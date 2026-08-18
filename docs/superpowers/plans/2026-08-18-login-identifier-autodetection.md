# Login Identifier Autodetection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` (recommended) or `executing-plans` to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Replace the PlanOut login screen's explicit Email/Phone selector with one identifier field that detects the channel as the user types while preserving the current OTP route contract.

**Architecture:** Keep classification in a pure `detectLoginMethod(value)` helper under `src/app/data/login.js`. `LoginPage.tsx` owns one raw identifier string, derives the live visual/input presentation from the helper, and snapshots `{ method, value }` when Continue starts the OTP step. `LoginRoute.tsx` remains unchanged because it already consumes the existing method/value callback.

**Tech Stack:** React 18, TypeScript/TSX, Vite, Tailwind utility classes, Node's built-in test runner.

## Global Constraints

- The login screen must have one identifier field with no segmented Email/Phone control.
- An empty field must show `Email or phone number`.
- A value containing `@` or any alphabetic character is `email`; a value beginning with a digit, `+`, or `(` is `phone` unless it has become email-like; an empty value is `null`.
- The input stays `type="text"`; channel-specific mobile input mode and icon are presentation feedback only.
- Continue remains enabled for any non-empty identifier; do not add format or country validation.
- OTP masking, Change behavior, resend behavior, social login, guest browsing, and the `onLoginComplete(method, value)` callback contract must remain intact.
- Do not modify or stage existing unrelated dirty files.

---

## File map

- Create: `src/app/data/login.js` — pure identifier classification helper.
- Create/modify: `tests/login-identifier.test.mjs` — detector unit tests and focused LoginPage source contract checks.
- Modify: `src/app/pages/LoginPage.tsx:1-530` — remove selector, consolidate identifier state, snapshot OTP target, and render live channel feedback.
- Do not modify: `src/app/routes/LoginRoute.tsx` — the existing route callback already accepts the detected method and value.

## Task 1: Add and verify the pure identifier detector

**Files:**
- Create: `tests/login-identifier.test.mjs`
- Create: `src/app/data/login.js`

**Interfaces:**
- Produces `detectLoginMethod(value: string): 'email' | 'phone' | null` for `LoginPage.tsx` and the test suite.

- [ ] **Step 1: Write the failing detector test.**

Create `tests/login-identifier.test.mjs` with this initial test. The existence assertion is intentional: it fails as an assertion before the helper exists, rather than relying on an import-time module error.

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const loginDataUrl = new URL('../src/app/data/login.js', import.meta.url);

test('detectLoginMethod classifies the identifier while it is being typed', async () => {
  assert.equal(fs.existsSync(loginDataUrl), true, 'login detector module should exist');

  const { detectLoginMethod } = await import(loginDataUrl.href);
  assert.equal(typeof detectLoginMethod, 'function');

  const cases = [
    ['', null],
    ['   ', null],
    ['0', 'phone'],
    ['+63', 'phone'],
    ['(02)', 'phone'],
    ['kenan', 'email'],
    ['123abc', 'email'],
    ['123@example.com', 'email'],
    [' kenan@example.com ', 'email'],
  ];

  for (const [value, expected] of cases) {
    assert.equal(detectLoginMethod(value), expected, `classification for ${JSON.stringify(value)}`);
  }
});
```

- [ ] **Step 2: Run the focused test and verify the expected failure.**

Run:

```bash
node --test tests/login-identifier.test.mjs
```

Expected: one failing test with `login detector module should exist` because `src/app/data/login.js` has not been created yet.

- [ ] **Step 3: Implement the minimal detector.**

Create `src/app/data/login.js` with exactly this pure implementation:

```js
export function detectLoginMethod(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.includes('@') || /[A-Za-z]/.test(trimmed)) return 'email';
  if (/^[+\d(]/.test(trimmed)) return 'phone';

  return 'email';
}
```

- [ ] **Step 4: Run the focused test and verify it passes.**

Run:

```bash
node --test tests/login-identifier.test.mjs
```

Expected: `1 pass`, `0 fail`.

- [ ] **Step 5: Commit the detector and its tests.**

Stage only the two task files, then commit:

```bash
git add -- src/app/data/login.js tests/login-identifier.test.mjs
git commit -m "feat: add login identifier detector"
```

## Task 2: Replace the selector with live detection in LoginPage

**Files:**
- Modify: `src/app/pages/LoginPage.tsx:10,247-529`
- Test: `tests/login-identifier.test.mjs`

**Interfaces:**
- Consumes `detectLoginMethod` from `@/app/data/login`.
- Produces the same `onLoginComplete(method, value)` call shape already consumed by `LoginRoute.tsx`.

- [ ] **Step 1: Add the failing LoginPage source-contract test.**

Append these imports and assertions to `tests/login-identifier.test.mjs`:

```js
const loginPageSource = fs.readFileSync(
  new URL('../src/app/pages/LoginPage.tsx', import.meta.url),
  'utf8',
);

test('LoginPage uses one autodetected identifier field instead of a selector', () => {
  assert.match(loginPageSource, /import \{ detectLoginMethod \} from '@\/app\/data\/login';/);
  assert.match(loginPageSource, /const \[identifier, setIdentifier\] = useState\(''\);/);
  assert.match(loginPageSource, /const \[otpTarget, setOtpTarget\] = useState<\{ method: LoginMethod; value: string \} \| null>\(null\);/);
  assert.doesNotMatch(loginPageSource, /setInputMode/);
  assert.doesNotMatch(loginPageSource, /Segmented tab toggle/);
  assert.match(loginPageSource, /type="text"/);
  assert.match(loginPageSource, /inputMode=\{detectedMethod === 'phone' \? 'tel' : 'email'\}/);
  assert.match(loginPageSource, /aria-label="Email or phone number"/);
  assert.match(loginPageSource, /placeholder="Email or phone number"/);
});
```

- [ ] **Step 2: Run the focused test and verify it fails for the missing integration.**

Run:

```bash
node --test tests/login-identifier.test.mjs
```

Expected: the detector test passes and the LoginPage contract test fails because the selector and old `inputMode` state are still present.

- [ ] **Step 3: Add the detector import, shared method types, and consolidated state.**

In `src/app/pages/LoginPage.tsx`, import the helper alongside the existing local imports:

```tsx
import { detectLoginMethod } from '@/app/data/login';
```

Add these types immediately before `LoginPageProps`, and use `LoginMethod` in the callback prop:

```tsx
type LoginMethod = 'email' | 'phone';

interface LoginPageProps {
  onLoginComplete: (method: LoginMethod, value: string) => void;
  /** Allow guest browsing — navigates back without logging in. */
  onContinueAsGuest?: () => void;
}
```

Replace the current `inputMode`, `email`, and `phone` state declarations with:

```tsx
const [identifier, setIdentifier] = useState('');
const [otpTarget, setOtpTarget] = useState<{ method: LoginMethod; value: string } | null>(null);
```

Keep the existing `step`, `otp`, `isSubmitting`, and `resendTimer` state unchanged.

- [ ] **Step 4: Make OTP completion use the Continue snapshot.**

Replace the current auto-submit effect with:

```tsx
useEffect(() => {
  if (!otpTarget || !otp.every((d) => d !== '')) return;

  setIsSubmitting(true);
  const timeout = setTimeout(() => {
    onLoginComplete(otpTarget.method, otpTarget.value);
  }, 800);
  return () => clearTimeout(timeout);
}, [otp, onLoginComplete, otpTarget]);
```

Replace `handleContinue` with:

```tsx
const handleContinue = useCallback(() => {
  const value = identifier.trim();
  const method = detectLoginMethod(value);
  if (!value || !method) return;

  setOtpTarget({ method, value });
  setIsSubmitting(true);
  setTimeout(() => {
    setIsSubmitting(false);
    setStep('otp');
  }, 600);
}, [identifier]);
```

Replace the current `identifier` and `maskedIdentifier` declarations with:

```tsx
const detectedMethod = detectLoginMethod(identifier);
const maskedIdentifier = otpTarget
  ? otpTarget.method === 'email'
    ? maskEmail(otpTarget.value)
    : `${otpTarget.value.slice(0, 4)}****${otpTarget.value.slice(-2)}`
  : '';
```

- [ ] **Step 5: Remove the selector and render the single live-detecting field.**

Delete the entire segmented tab toggle block between the `Input section` wrapper and the `Double Bezel Input Field`. In its place, keep the existing bezel wrapper and use this field body:

```tsx
<div className="relative rounded-[calc(9999px-1.5px)] bg-white px-5 py-3 flex items-center gap-3 shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.01)] border border-transparent">
  <span className="flex h-4 w-4 items-center justify-center text-slate-400 group-focus-within:text-[#177564] transition-colors duration-300">
    {detectedMethod === 'phone' ? <PhoneIcon /> : detectedMethod === 'email' ? <EmailIcon /> : null}
  </span>

  <input
    type="text"
    inputMode={detectedMethod === 'phone' ? 'tel' : 'email'}
    aria-label="Email or phone number"
    value={identifier}
    onChange={(e) => setIdentifier(e.target.value)}
    onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
    placeholder="Email or phone number"
    className="w-full bg-transparent text-[14.5px] text-slate-800 placeholder:text-slate-400 font-semibold outline-none border-none p-0 focus:ring-0"
  />
</div>
```

Keep the existing `PrimaryButton`, but make its disabled expression use the single value:

```tsx
disabled={isSubmitting || !identifier.trim()}
```

Update the OTP Change label to read from the snapshot:

```tsx
<span>Change {otpTarget?.method === 'email' ? 'email' : 'phone number'}</span>
```

Do not change the social buttons, consent copy, guest button, OTP inputs, resend button, route wrapper, or navigation behavior.

- [ ] **Step 6: Run the focused test and verify the integration passes.**

Run:

```bash
node --test tests/login-identifier.test.mjs
```

Expected: `2 pass`, `0 fail`.

- [ ] **Step 7: Commit the LoginPage integration.**

Stage only the LoginPage and focused test, then commit:

```bash
git add -- src/app/pages/LoginPage.tsx tests/login-identifier.test.mjs
git commit -m "feat: autodetect login identifier type"
```

## Task 3: Run complete verification and browser smoke checks

**Files:**
- Verify: `src/app/data/login.js`
- Verify: `src/app/pages/LoginPage.tsx`
- Verify: `src/app/routes/LoginRoute.tsx`
- Verify: `tests/login-identifier.test.mjs`

- [ ] **Step 1: Run the full Node test suite.**

Run:

```bash
node --test tests/*.test.mjs
```

Expected: exit code `0` and zero failed tests.

- [ ] **Step 2: Build the production bundle.**

Run:

```bash
npm run build
```

Expected: exit code `0` with a completed Vite build.

- [ ] **Step 3: Check the diff and confirm unrelated files remain untouched by this work.**

Run:

```bash
git diff --check HEAD~2..HEAD
git status --short
```

Expected: `git diff --check` is silent. The status may still show the pre-existing dirty files, but no unrelated file should appear in either feature commit.

- [ ] **Step 4: Browser-check the live `/login` interaction.**

Start the Vite dev server with `npm run dev -- --host 127.0.0.1`, open `/login` in the in-app browser at a mobile-sized viewport, and verify this sequence:

1. The Email/Phone segmented selector is absent.
2. The empty field says `Email or phone number`.
3. Typing `09` changes the field to phone presentation and uses the telephone keyboard hint.
4. Clearing the field and typing `kenan@example.com` changes the field to email presentation.
5. Clicking Continue reaches `Verify Security Code` and shows the masked email.
6. Entering six digits completes the flow without console errors and routes through the existing `LoginRoute` callback.
7. Going back to the identifier step leaves the value editable and allows the detector to switch channels again.

- [ ] **Step 5: Stop the dev server and record the exact verification results.**

Use the active terminal session's stop mechanism after the browser check, then report the test count, build exit code, diff-check result, and browser observations.

