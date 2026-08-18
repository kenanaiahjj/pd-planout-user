# Login Apple-Like Control Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align every login control with PlanOut's existing rounded-rectangle form language and Apple-like restraint without changing identifier autodetection, OTP behavior, or login callbacks.

**Architecture:** Keep the visual change local to `LoginPage.tsx` with backward-compatible presentation opt-outs in `PrimaryButton`. Existing callers retain the current gradient, shine, and press-scale defaults; the login action uses the branded gradient through `brandGradient` with shine and press-scale disabled. Add focused source assertions to the existing login test, then verify the live flow at mobile width and run the full test/build checks.

**Tech Stack:** React, TypeScript/TSX, Tailwind CSS utility classes, Node's built-in test runner, Vite, Playwright/in-app browser.

## Global Constraints

- Keep the single autodetected `identifier` field and the existing `detectLoginMethod` behavior unchanged.
- Keep the existing OTP entry, resend, back/change, autocomplete, accessibility labels, and `onLoginComplete(method, value)` contract unchanged.
- Use 10px rounded rectangles for the identifier field, social buttons, and OTP cells; use a 12px rounded rectangle for Continue.
- Keep the login Continue gradient static by disabling the shared shine and active scale only for that instance; do not change those defaults for other `PrimaryButton` callers.
- Do not use full-pill geometry, nested bezels, decorative shimmer, or bouncy focus scaling on login controls.
- Preserve a minimum 44px touch target for every login control.
- Do not change `FormTextField.tsx`, global field rules in `src/styles/index.css`, `src/app/data/login.js`, or `LoginRoute.tsx`.
- Preserve all unrelated dirty-worktree changes and stage only the files named by each task.

---

### Task 1: Add failing geometry and action-surface assertions

**Files:**
- Modify: `tests/login-identifier.test.mjs`

**Interfaces:**
- Consumes: the existing `loginPageSource` fixture and the source of `src/app/components/PrimaryButton.tsx`.
- Produces: a focused red test proving the approved control geometry and button presentation contract are not present yet.

- [ ] **Step 1: Write the failing tests**

Add the `primaryButtonSource` read immediately after the existing `loginPageSource` read, then append these two tests:

```js
const primaryButtonSource = fs.readFileSync(
  new URL('../src/app/components/PrimaryButton.tsx', import.meta.url),
  'utf8',
);

test('PrimaryButton exposes an opt-in solid appearance for native actions', () => {
  assert.match(primaryButtonSource, /appearance\?: 'gradient' \| 'solid'/);
  assert.match(primaryButtonSource, /appearance === 'solid'/);
});

test('LoginPage uses the shared rounded-rectangle control language', () => {
  assert.match(loginPageSource, /appearance="solid"/);
  assert.match(loginPageSource, /rounded-\[10px\]/);
  assert.match(loginPageSource, /min-h-11/);
  assert.doesNotMatch(loginPageSource, /p-\[1\.5px\] rounded-full/);
  assert.doesNotMatch(loginPageSource, /rounded-\[16px\]/);
  assert.doesNotMatch(loginPageSource, /scale-\[1\.06\]/);
  assert.doesNotMatch(loginPageSource, /translate-x-\[\-100%\]/);
  assert.doesNotMatch(loginPageSource, /animate-pulse/);
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```bash
node --test tests/login-identifier.test.mjs
```

Expected: the two existing login tests pass, while the two new tests fail because `PrimaryButton` has no `appearance` prop and `LoginPage` still contains the full-pill, nested-bezel, shimmer, OTP scale, and pulse classes.

### Task 2: Add backward-compatible PrimaryButton presentation opt-outs

**Files:**
- Modify: `src/app/components/PrimaryButton.tsx`
- Test: `tests/login-identifier.test.mjs`

**Interfaces:**
- Consumes: the existing `brandGradient`, `disabled`, and `style` props.
- Produces: optional `appearance?: 'gradient' | 'solid'`, `showShine?: boolean`, and `pressScale?: boolean` props. All default to the current behavior; the login instance can use the branded gradient without the shine layer or active scale.

- [ ] **Step 1: Add the optional prop without changing existing callers**

Extend `PrimaryButtonProps` with:

```ts
/** Use a flat native action surface instead of the default gradient shine. */
appearance?: 'gradient' | 'solid';
/** Show the shared static shine layer. Defaults to true for existing callers. */
showShine?: boolean;
/** Apply the shared active press scale. Defaults to true for existing callers. */
pressScale?: boolean;
```

Destructure it with the default:

```ts
  appearance = 'gradient',
  showShine = true,
  pressScale = true,
```

Immediately before the `return`, resolve the button style as follows:

```ts
const resolvedStyle = disabled
  ? style
  : appearance === 'solid'
    ? {
        backgroundColor: '#177564',
        boxShadow: '0 8px 18px -14px rgba(23,117,100,0.6)',
        ...style,
      }
  : { ...createBackgroundStyle(brandGradient, showShine), ...style };
```

Replace the existing conditional `style={disabled ? style : ...}` with:

```tsx
style={resolvedStyle}
```

Leave the default rounded-xl geometry, default gradient, shine overlay markup, active press scale, disabled fallback, and all existing callers unchanged. The login instance opts out through props rather than selector-specific CSS.

- [ ] **Step 2: Run the focused test to verify the component contract passes**

Run:

```bash
node --test tests/login-identifier.test.mjs
```

Expected: the solid-appearance test passes; the LoginPage geometry test remains the only failing new test until Task 3 removes the old login classes.

### Task 3: Replace login-only pills and effects with rounded rectangles

**Files:**
- Modify: `src/app/pages/LoginPage.tsx`
- Test: `tests/login-identifier.test.mjs`

**Interfaces:**
- Consumes: the `PrimaryButton` presentation options and the existing identifier/OTP state.
- Produces: consistent login visuals with no change to event handlers, state, or route behavior.

- [ ] **Step 1: Simplify the social button surface**

Replace the `SocialButton` button class with:

```tsx
className="w-full min-h-11 rounded-[10px] flex items-center justify-center gap-3 px-5 py-2.5 border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/20 focus-visible:ring-offset-1 transition-colors duration-150 cursor-pointer"
```

Remove the shimmer `<div>` immediately inside the button and replace the icon wrapper with the direct icon node:

```tsx
{icon}
<span className="text-[#344054] text-[14px] font-semibold tracking-tight">{label}</span>
```

Keep the provider icon, label, callback, and button semantics unchanged.

- [ ] **Step 2: Replace the identifier double bezel**

Replace the current `Double Bezel Input Field` block with this single-frame structure:

```tsx
{/* Identifier field */}
<div className="relative mb-4 group">
  <div className="relative flex min-h-11 items-center gap-3 rounded-[10px] border border-slate-200/80 bg-white px-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors duration-150 hover:border-slate-300 focus-within:border-[#177564] focus-within:ring-2 focus-within:ring-[#177564]/15">
    <span className="flex h-4 w-4 shrink-0 items-center justify-center text-slate-400 transition-colors duration-150 group-focus-within:text-[#177564]">
      {detectedMethod === 'phone' ? <PhoneIcon /> : detectedMethod === 'email' ? <EmailIcon /> : null}
    </span>

    <input
      type="text"
      inputMode={detectedMethod === 'phone' ? 'tel' : 'email'}
      autoComplete="username"
      enterKeyHint="next"
      aria-label="Email or phone number"
      value={identifier}
      onChange={(e) => setIdentifier(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
      placeholder="Email or phone number"
      className="native-mobile-field w-full min-h-11 bg-transparent text-[14.5px] text-slate-800 placeholder:text-slate-400 font-semibold outline-none border-none p-0 focus:ring-0"
    />
  </div>
</div>
```

Keep the exact identifier state, detector, input mode, autocomplete, enter-key, label, placeholder, and handlers.

- [ ] **Step 3: Use the branded gradient Continue variant**

Update the login `PrimaryButton` invocation to use the approved brand gradient and replace the pill override:

```tsx
<PrimaryButton
  onClick={handleContinue}
  disabled={isSubmitting || !identifier.trim()}
  fullWidth
  appearance="gradient"
  brandGradient={{ from: '#28b99e', to: '#177564' }}
  showShine={false}
  pressScale={false}
  className="rounded-[12px] py-2.5 text-[14px] font-bold tracking-tight"
>
```

Leave the loading indicator, label, arrow, disabled expression, and click handler unchanged.

- [ ] **Step 4: Simplify OTP cells and remove focus bounce**

Replace the nested OTP cell wrapper and inner surface with a single frame:

```tsx
<div
  key={i}
  className={`group relative flex h-12 w-11 items-center justify-center rounded-[10px] border transition-colors duration-150 sm:h-14 sm:w-[52px] ${
    isFocused
      ? 'border-[#177564] bg-[#f2fbf8] shadow-[0_0_0_3px_rgba(23,117,100,0.12)]'
      : 'border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] hover:border-slate-300'
  }`}
>
  <input
    ref={(el) => {
      inputsRef.current[i] = el;
    }}
    type="text"
    inputMode="numeric"
    autoComplete={i === 0 ? 'one-time-code' : 'off'}
    aria-label={`Verification digit ${i + 1}`}
    maxLength={1}
    value={value[i] || ''}
    onChange={(e) => handleChange(i, e.target.value)}
    onKeyDown={(e) => handleKeyDown(i, e)}
    onPaste={i === 0 ? handlePaste : undefined}
    className="absolute inset-0 h-full w-full text-center text-[22px] font-bold tracking-tight text-slate-800 bg-transparent outline-none select-none focus-visible:ring-0 sm:text-[28px]"
    style={{ caretColor: '#177564' }}
  />
</div>
```

Remove the now-unused `hasValue` variable and the tactile indicator dot. The bordered/tinted frame is the only focus feedback; digit handling and all OTP callbacks remain unchanged.

- [ ] **Step 5: Remove the login-only decorative pulse**

Remove `animate-pulse-slow` from the `GoogleIcon` SVG class. This is a purely decorative animation and is not part of the provider icon behavior.

- [ ] **Step 6: Run the focused test to verify the complete red-green transition**

Run:

```bash
node --test tests/login-identifier.test.mjs
```

Expected: all four focused login tests pass.

### Task 4: Verify the implementation and live interaction

**Files:**
- Verify: `src/app/pages/LoginPage.tsx`
- Verify: `src/app/components/PrimaryButton.tsx`
- Verify: `tests/login-identifier.test.mjs`

**Interfaces:**
- Consumes: the completed visual implementation and existing project test/build commands.
- Produces: fresh evidence that the visual contract, login behavior, build, and worktree hygiene are intact.

- [ ] **Step 1: Run the complete Node test suite**

Run:

```bash
node --test tests/*.mjs
```

Expected: all discovered tests pass with zero failures.

- [ ] **Step 2: Run the production build**

Run:

```bash
npm run build
```

Expected: Vite completes with exit code 0 and emits the production bundle.

- [ ] **Step 3: Check patch whitespace**

Run:

```bash
git diff --check -- src/app/pages/LoginPage.tsx src/app/components/PrimaryButton.tsx tests/login-identifier.test.mjs
```

Expected: no whitespace errors.

- [ ] **Step 4: Browser-check the mobile login screen**

Start the local app:

```bash
npm run dev -- --host 127.0.0.1
```

At a 393×852 viewport, open `/login` and verify:

1. The identifier field is one 10px rounded rectangle with a quiet border, not a pill or nested bezel.
2. Entering `09171234567` keeps the same live phone detection and shows the phone icon/input mode.
3. Continue is a static `#28b99e` to `#177564` gradient 12px rectangle with a 44px touch target and restrained press/focus feedback.
4. The OTP cells are single 10px rectangles with a green border/tint for the next cell and no scale bounce.
5. Entering a complete OTP still invokes the same login completion route.
6. Use Change phone number, then enter `kenan@example.com`; the field switches back to email presentation and reaches the same OTP screen.
7. Social buttons use the same 10px rounded-rectangle language, and no control overflows horizontally or gets obscured by the mobile keyboard.

- [ ] **Step 5: Inspect the final diff and commit only the focused implementation**

Run:

```bash
git diff --stat -- src/app/pages/LoginPage.tsx src/app/components/PrimaryButton.tsx tests/login-identifier.test.mjs
git status --short
```

Confirm unrelated dirty files are not staged, then stage only:

```bash
git add -- src/app/pages/LoginPage.tsx src/app/components/PrimaryButton.tsx tests/login-identifier.test.mjs
git commit -m "refine: align login controls with shared field language"
```

Do not stage or modify the pre-existing native-mobile field, duplicate-file, or unrelated design changes.
