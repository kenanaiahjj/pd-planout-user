# Focused PlanOut Login Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the promotional `/login` presentation with a restrained, centered PlanOut sign-in flow while preserving identifier detection, OTP behavior, social callbacks, guest access, and responsive accessibility semantics.

**Architecture:** Keep the existing `LoginPage` state machine and callback interfaces. Refactor only its presentational sub-components and root layout: one shared centered shell renders both identifier and OTP steps, with the PlanOut brand gradient reserved for the enabled primary Continue action. Remove the desktop hero and decorative motion rather than adding another visual system.

**Tech Stack:** React 18, TypeScript, Tailwind CSS utility classes, lucide-react, Node test runner, Vite.

## Global Constraints

- Preserve the one autodetected email-or-phone field and existing `detectLoginMethod` behavior.
- Preserve OTP auto-advance, paste, backspace, resend timer, automatic completion, and change-identifier actions.
- Preserve Google, Facebook, and optional Continue as Guest callbacks exactly.
- Keep `aria-label`, `autoComplete`, `inputMode`, and `enterKeyHint` attributes on login and OTP fields.
- Use a true near-white product surface and one centered content column; do not reintroduce the hero panel, radial glows, testimonial card, star rating, shimmer sweep, or hover zoom.
- Use the PlanOut brand gradient only on the enabled primary Continue button; disabled and loading states remain readable and quiet.
- Keep all controls at least 44px tall on mobile and honor reduced-motion preferences.

---

### Task 1: Add failing login presentation regressions

**Files:**
- Create: `tests/login-ui-polish.test.mjs`
- Read: `src/app/pages/LoginPage.tsx`

**Interfaces:**
- Consumes: the current `LoginPage.tsx` source as a static contract.
- Produces: explicit assertions for the focused login shell that the implementation must satisfy.

- [ ] **Step 1: Write the failing test**

Create a source-level regression suite with assertions for the new structure and the absence of the old hero treatment:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(
  new URL('../src/app/pages/LoginPage.tsx', import.meta.url),
  'utf8',
);

test('login keeps one focused product shell for both steps', () => {
  assert.match(source, /Sign in to PlanOut/);
  assert.match(source, /Use your email or phone number to continue/);
  assert.match(source, /aria-label="Email or phone number"/);
  assert.match(source, /bg-gradient-to-r from-\[#28b99e\] to-\[#177564\]/);
  assert.match(source, /Or continue with/);
  assert.match(source, /Continue as Guest/);
  assert.match(source, /Enter your verification code/);
  assert.doesNotMatch(source, /imgHero/);
  assert.doesNotMatch(source, /PlanOut Passport/);
  assert.doesNotMatch(source, /testimonial|Verified|City Striders Runner|48K\+/i);
  assert.doesNotMatch(source, /animate-pulse-slow|translate-x-\[100%\]|group-hover:scale-105/);
});
```

- [ ] **Step 2: Run the regression to verify it fails**

Run:

```bash
node --test tests/login-ui-polish.test.mjs
```

Expected: FAIL because the current source still contains `imgHero`, the old welcome copy, the testimonial panel, and the decorative social-button animation.

### Task 2: Refactor LoginPage presentation without changing behavior

**Files:**
- Modify: `src/app/pages/LoginPage.tsx:1-520`

**Interfaces:**
- Consumes: existing `LoginPageProps`, `detectLoginMethod`, `onLoginComplete`, `onContinueAsGuest`, and OTP state handlers.
- Produces: the same exported `LoginPage` component and callback signatures with a new visual shell.

- [ ] **Step 1: Remove hero-only imports and decorative social motion**

Delete the `imgHero` import. Keep the logo asset, social SVG paths, icons, and state logic. Replace `SocialButton` with a 52px-high secondary button that has a neutral border, no sweep overlay, no scale animation, and a visible `focus-visible` ring:

```tsx
className="flex min-h-12 w-full items-center justify-center gap-3 rounded-[14px] border border-[#dbe6e2] bg-white px-4 text-[15px] font-semibold text-[#24342f] transition-colors hover:bg-[#f7faf8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/40 active:bg-[#f0f7f4]"
```

- [ ] **Step 2: Simplify the brand lockup**

Keep `BrandLockup`, but remove hover scaling and oversized spacing. Use a 32px logo, a 22px wordmark, and a compact top margin so the lockup reads as navigation context rather than a hero.

- [ ] **Step 3: Rebuild the identifier step hierarchy**

Keep the existing identifier input event handlers and native hints. Replace the welcome copy and double-bezel field with this hierarchy:

```tsx
<h1 className="text-center text-[30px] font-bold tracking-[-0.03em] text-[#111b24]">
  Sign in to PlanOut
</h1>
<p className="mt-2 text-center text-[15px] leading-6 text-[#5f7188]">
  Use your email or phone number to continue.
</p>
<label htmlFor="login-identifier" className="mt-8 block text-[13px] font-semibold text-[#34485d]">
  Email or phone number
</label>
<div className="mt-2 flex min-h-[52px] items-center gap-3 rounded-[14px] border border-[#d8e3df] bg-white px-4 transition-colors focus-within:border-[#177564] focus-within:ring-2 focus-within:ring-[#177564]/15">
  <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[#8798a8]">
    {detectedMethod === 'phone' ? <PhoneIcon /> : detectedMethod === 'email' ? <EmailIcon /> : null}
  </span>
  <input
    id="login-identifier"
    type="text"
    inputMode={detectedMethod === 'phone' ? 'tel' : 'email'}
    autoComplete="username"
    enterKeyHint="next"
    aria-label="Email or phone number"
    value={identifier}
    onChange={(e) => setIdentifier(e.target.value)}
    onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
    placeholder="Email or phone number"
    className="w-full min-w-0 bg-transparent text-[16px] text-[#1b2835] placeholder:text-[#8798a8] outline-none"
  />
</div>
```

Give the enabled `PrimaryButton` the PlanOut gradient and 52px minimum height. Keep the existing disabled and loading logic; only replace the class treatment and loading copy if needed for the new shell. Keep consent immediately below the button.

- [ ] **Step 4: Rebuild the secondary actions**

Use a divider with the exact label `Or continue with`, render the existing Google and Facebook callbacks with the new `SocialButton`, and render Continue as Guest as a text button with a visible focus ring and no animated arrow reveal.

- [ ] **Step 5: Rebuild the OTP step in the same shell**

Change the OTP title to `Enter your verification code`, keep the masked destination, and retain all existing `OtpInput`, resend, and change-identifier handlers. Flatten OTP cells to bordered white boxes with one green active ring; do not add gradients, bouncing dots, or decorative shadows.

- [ ] **Step 6: Replace the root split layout with one responsive shell**

Replace the current glow/split-panel JSX with:

```tsx
return (
  <main className="min-h-[100dvh] overflow-y-auto bg-[#f7faf9] px-5 py-8 font-sans sm:px-8 sm:py-12">
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-[420px] items-center justify-center">
      <div className="w-full py-6 sm:py-8">
        {step === 'email' ? renderEmailStep() : renderOtpStep()}
      </div>
    </div>
  </main>
);
```

This keeps short mobile viewports scrollable and prevents the old desktop hero from competing with authentication.

### Task 3: Verify the login flow and production output

**Files:**
- Test: `tests/login-ui-polish.test.mjs`
- Test: `tests/login-identifier.test.mjs`
- Test: `tests/native-mobile-fields.test.mjs`
- Build: `dist/` generated by Vite

**Interfaces:**
- Consumes: the refactored `LoginPage` and existing auth route tests.
- Produces: passing focused tests, a successful production build, and a whitespace-clean diff.

- [ ] **Step 1: Run focused tests**

```bash
node --test tests/login-ui-polish.test.mjs tests/login-identifier.test.mjs tests/native-mobile-fields.test.mjs
```

Expected: all login UI, identifier, and native-field assertions pass.

- [ ] **Step 2: Run the production build**

```bash
npm run build
```

Expected: Vite exits with code 0. Existing chunk-size or dynamic-import notices may remain warnings; no new compile errors are acceptable.

- [ ] **Step 3: Run diff checks**

```bash
git diff --check -- src/app/pages/LoginPage.tsx tests/login-ui-polish.test.mjs
```

Expected: no output.

- [ ] **Step 4: Record the focused result**

Report the test count, build status, and any unrelated pre-existing dirty-worktree failures without modifying unrelated files.
