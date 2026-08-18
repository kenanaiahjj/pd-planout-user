# Participant Form Quiet-Luxury Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved Quiet luxury visual finish to participant forms from Orders and Checkout without changing layout, behavior, copy, state, or routes.

**Architecture:** Add stable semantic class hooks to the existing shared form controls, then activate a scoped `.participant-form-premium` theme only around participant-form surfaces. Add semantic surface hooks to `ParticipantFormPage` and the two Checkout participant-form containers so one stylesheet polishes both without affecting unrelated forms or changing DOM order.

**Tech Stack:** React 18, TypeScript, Tailwind CSS 4 utility classes, scoped CSS in `src/styles/index.css`, Node `node:test`, Vite.

## Global Constraints

- Preserve all current participant-form layout, field order, labels, actions, callbacks, validation, ownership, Guest QR, Passport, invite, upload, and return-route behavior.
- Do not add steps, accordions, sticky actions, auto-save, fields, actions, dependencies, or global form restyling.
- Keep unrelated uses of `FormTextField`, `FormTextarea`, and `SegmentedChoice` visually unchanged.
- Use the approved warm-white, green-gray, deep-emerald Quiet luxury appearance.
- Keep WCAG AA text contrast, visible focus, readable disabled states, and existing semantic status cues.
- Preserve unrelated dirty-worktree changes.

---

### Task 1: Add stable shared-control styling hooks

**Files:**
- Create: `tests/participant-form-polish.test.mjs`
- Modify: `src/app/components/FormTextField.tsx`
- Modify: `src/app/components/SegmentedChoice.tsx`

**Interfaces:**
- Consumes: existing `FormTextFieldProps`, `FormTextareaProps`, and `SegmentedChoiceProps<T>` APIs.
- Produces: semantic classes `form-text-field`, `form-text-field__label`, `form-text-field__frame`, `form-text-field__input`, `form-textarea__input`, `segmented-choice`, and `segmented-choice__item`; selected segmented options expose `data-selected`.

- [ ] **Step 1: Write the failing shared-hook test**

Create `tests/participant-form-polish.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const fieldSource = fs.readFileSync(new URL('../src/app/components/FormTextField.tsx', import.meta.url), 'utf8');
const segmentedSource = fs.readFileSync(new URL('../src/app/components/SegmentedChoice.tsx', import.meta.url), 'utf8');
const participantSource = fs.readFileSync(new URL('../src/app/pages/ParticipantFormPage.tsx', import.meta.url), 'utf8');
const checkoutSource = fs.readFileSync(new URL('../src/app/components/CheckoutPage.tsx', import.meta.url), 'utf8');
const stylesSource = fs.readFileSync(new URL('../src/styles/index.css', import.meta.url), 'utf8');

test('shared form controls expose stable semantic hooks without changing their API', () => {
  assert.match(fieldSource, /form-text-field/);
  assert.match(fieldSource, /form-text-field__label/);
  assert.match(fieldSource, /form-text-field__frame/);
  assert.match(fieldSource, /form-text-field__input/);
  assert.match(fieldSource, /form-textarea__input/);
  assert.match(segmentedSource, /segmented-choice/);
  assert.match(segmentedSource, /segmented-choice__item/);
  assert.match(segmentedSource, /data-selected=\{isActive \? '' : undefined\}/);
});
```

- [ ] **Step 2: Run the focused test to verify RED**

```bash
node --test tests/participant-form-polish.test.mjs
```

Expected: FAIL because the semantic hooks do not exist.

- [ ] **Step 3: Add semantic classes without changing default visuals**

In `FormTextField`, append the hooks to the existing class strings:

```tsx
<div className={`form-text-field flex flex-col gap-1.5 group ${className}`}>
  <label className={`form-text-field__label text-[13px] font-semibold tracking-tight text-[#344054] transition-colors duration-200 group-focus-within:text-[#177564] ${labelClassName}`}>
  <div className={`form-text-field__frame rounded-[10px] border px-3.5 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all duration-200 focus-within:ring-2 ${frameClass} ${frameClassName}`}>
    <input className={`form-text-field__input w-full min-w-0 bg-transparent text-[14px] text-[#181d27] placeholder:text-[#94a3b8] focus:outline-none disabled:cursor-not-allowed disabled:text-slate-400 ${inputClassName}`} />
  </div>
</div>
```

Apply `form-text-field`, `form-text-field__label`, and `form-text-field__frame` to `FormTextarea`, with `form-textarea__input` on the `<textarea>`. Keep every existing utility class and prop.

In `SegmentedChoice`, keep all current utility classes and add:

```tsx
<div className={`segmented-choice grid ${columnsClass} w-full rounded-full bg-slate-100/80 p-0.5 ${className}`}>
  <button
    data-selected={isActive ? '' : undefined}
    className={`segmented-choice__item flex min-w-0 items-center justify-center rounded-full border font-semibold transition-all active:scale-[0.98] ${itemClass} ${
      isActive
        ? 'border-slate-200 bg-white text-slate-800 shadow-xs'
        : 'border-transparent text-slate-500 hover:text-slate-800'
    }`}
  >
```

- [ ] **Step 4: Run the focused test to verify GREEN**

```bash
node --test tests/participant-form-polish.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit the shared hooks**

```bash
git add tests/participant-form-polish.test.mjs src/app/components/FormTextField.tsx src/app/components/SegmentedChoice.tsx
git commit -m "refactor: add participant form styling hooks"
```

---

### Task 2: Apply Quiet luxury to ParticipantFormPage

**Files:**
- Modify: `tests/participant-form-polish.test.mjs`
- Modify: `src/app/pages/ParticipantFormPage.tsx`
- Modify: `src/styles/index.css`

**Interfaces:**
- Consumes: Task 1 semantic shared-control hooks.
- Produces: scoped theme activated by `participant-form-premium`, plus hooks `participant-form-event-card`, `participant-form-card`, `participant-form-identity`, `participant-form-ownership`, `participant-form-owner-choice`, `participant-form-upload`, and `participant-form-footer`.

- [ ] **Step 1: Add failing ParticipantFormPage assertions**

Append:

```js
test('ParticipantFormPage opts into Quiet luxury without changing its structure', () => {
  assert.match(participantSource, /participant-form-premium flex flex-col gap-3 pb-6/);
  assert.match(participantSource, /participant-form-event-card/);
  assert.match(participantSource, /participant-form-card/);
  assert.match(participantSource, /participant-form-identity/);
  assert.match(participantSource, /participant-form-ownership/);
  assert.match(participantSource, /participant-form-owner-choice/);
  assert.match(participantSource, /participant-form-upload/);
  assert.match(participantSource, /participant-form-footer/);
  assert.match(participantSource, /Fill Details Myself/);
  assert.match(participantSource, /Invite via Email/);
  assert.match(participantSource, /Save details/);
  assert.match(participantSource, /Submit Form/);
});

test('Quiet luxury CSS is scoped and leaves shared defaults untouched', () => {
  assert.match(stylesSource, /\.participant-form-premium\s*\{/);
  assert.match(stylesSource, /\.participant-form-premium \.form-text-field__frame/);
  assert.match(stylesSource, /\.participant-form-premium \.segmented-choice/);
  assert.match(stylesSource, /\.participant-form-premium \.participant-form-owner-choice/);
  assert.doesNotMatch(stylesSource, /^\.form-text-field__frame\s*\{/m);
  assert.doesNotMatch(stylesSource, /^\.segmented-choice\s*\{/m);
});
```

- [ ] **Step 2: Run the test to verify RED**

```bash
node --test tests/participant-form-polish.test.mjs
```

Expected: FAIL because the page and CSS hooks are absent.

- [ ] **Step 3: Add semantic surface classes to existing elements**

Keep element order and utilities; add only the hooks:

```tsx
<div className="participant-form-premium flex flex-col gap-3 pb-6">
<div className="participant-form-premium flex flex-col gap-5 pb-6">
<div className="participant-form-event-card bg-white rounded-[12px] border border-[#def2ee] overflow-hidden shadow-[0px_16px_36px_0px_rgba(0,0,0,0.03)]">
<div className="participant-form-card bg-white rounded-[12px] border border-[#def2ee] shadow-[0px_16px_36px_0px_rgba(0,0,0,0.03)] overflow-hidden">
<div className="participant-form-identity flex items-center gap-3 rounded-[12px] border border-[#def2ee] bg-[#f8fbfa] px-3.5 py-3">
<fieldset className="participant-form-ownership flex flex-col gap-2">
<label
  data-selected={selected ? '' : undefined}
  className={`participant-form-owner-choice flex min-h-[70px] items-start gap-3 rounded-[12px] border px-3.5 py-3 transition-all ${
    selected
      ? 'border-[#177564] bg-[#f0fdf9] text-[#177564]'
      : 'border-[#e2e8f0] bg-white text-[#64748b]'
  } ${optionDisabled
    ? 'cursor-not-allowed opacity-60'
    : 'cursor-pointer hover:border-[#b7ded6] hover:bg-[#f8fbfa]'}`}
>
<button className="participant-form-upload w-full relative p-[1.5px] rounded-[10px] bg-slate-50/50 hover:bg-slate-100/30 border border-dashed border-slate-200/80 hover:border-[#177564]/40 hover:shadow-[0_4px_12px_rgba(23,117,100,0.03)] transition-all duration-300 group">
<div className="participant-form-upload relative p-[1.5px] rounded-[10px] bg-[#ecfdf5] border border-[#a7f3d0] shadow-[0_1px_2px_rgba(5,150,105,0.02)]">
<div className="participant-form-footer border-t border-[#f1f5f9] px-5 sm:px-6 py-4 flex flex-col items-center gap-2.5">
```

Do not remove or reorder any child, callback, condition, utility, label, or action.

- [ ] **Step 4: Add scoped Quiet-luxury CSS**

Append to `src/styles/index.css`:

```css
.participant-form-premium {
  --participant-surface: #fffefa;
  --participant-surface-muted: #f7faf8;
  --participant-border: #dce5e1;
  --participant-border-strong: #b8cec7;
  --participant-ink: #18201d;
  --participant-muted: #5f6f68;
  --participant-accent: #177564;
  color: var(--participant-ink);
}

.participant-form-premium .participant-form-event-card,
.participant-form-premium .participant-form-card {
  background: var(--participant-surface);
  border-color: var(--participant-border);
  box-shadow: 0 18px 42px -34px rgba(20, 39, 32, 0.42);
}

.participant-form-premium .participant-form-identity {
  background: var(--participant-surface-muted);
  border-color: #e5ece8;
}

.participant-form-premium .form-text-field__label { color: #34413c; }
.participant-form-premium .form-text-field__frame {
  background: #fffefa;
  border-color: var(--participant-border);
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.025);
}
.participant-form-premium .form-text-field__frame:hover { border-color: var(--participant-border-strong); }
.participant-form-premium .form-text-field__frame:focus-within {
  border-color: var(--participant-accent);
  box-shadow: 0 0 0 3px rgba(23, 117, 100, 0.12);
}
.participant-form-premium .form-text-field__input,
.participant-form-premium .form-textarea__input { color: var(--participant-ink); }
.participant-form-premium .form-text-field__input::placeholder,
.participant-form-premium .form-textarea__input::placeholder { color: #87938e; }

.participant-form-premium .segmented-choice {
  background: #e9efec;
  border: 1px solid #e0e7e3;
}
.participant-form-premium .segmented-choice__item { color: #62716b; }
.participant-form-premium .segmented-choice__item[data-selected] {
  background: #fffefa;
  border-color: var(--participant-border);
  color: #173d34;
  box-shadow: 0 4px 10px -8px rgba(20, 45, 37, 0.42);
}

.participant-form-premium .participant-form-owner-choice {
  background: #fffefa;
  border-color: var(--participant-border);
}
.participant-form-premium .participant-form-owner-choice[data-selected] {
  background: #edf8f4;
  border-color: #4d917f;
  box-shadow: inset 0 0 0 1px rgba(23, 117, 100, 0.06);
}
.participant-form-premium .participant-form-upload {
  background: #fbfcfa;
  border-color: #c8d5d0;
  box-shadow: none;
}
.participant-form-premium .participant-form-upload:hover,
.participant-form-premium .participant-form-upload:focus-visible {
  background: #f7faf8;
  border-color: #6fae9d;
}
.participant-form-premium .participant-form-upload:focus-visible,
.participant-form-premium .participant-form-owner-choice:focus-within,
.participant-form-premium .segmented-choice__item:focus-visible {
  outline: 2px solid rgba(23, 117, 100, 0.48);
  outline-offset: 2px;
}
.participant-form-premium .participant-form-footer {
  border-color: #e8ece9;
  background: #fffefa;
}
@media (prefers-contrast: more) {
  .participant-form-premium {
    --participant-border: #85968f;
    --participant-muted: #3f4e48;
  }
}
```

Do not set layout properties such as `display`, columns, width, height, position, margin, padding, or order.

- [ ] **Step 5: Run focused participant tests**

```bash
node --test tests/participant-form-polish.test.mjs tests/single-participant-form.test.mjs tests/participant-form-state.test.mjs tests/team-access.test.mjs
```

Expected: all PASS.

- [ ] **Step 6: Commit ParticipantFormPage polish**

```bash
git add tests/participant-form-polish.test.mjs src/app/pages/ParticipantFormPage.tsx src/styles/index.css
git commit -m "feat: polish participant form surfaces"
```

---

### Task 3: Apply the same scoped finish to Checkout participant forms

**Files:**
- Modify: `tests/participant-form-polish.test.mjs`
- Modify: `src/app/components/CheckoutPage.tsx`

**Interfaces:**
- Consumes: Task 1 shared hooks and Task 2 `.participant-form-premium` theme.
- Produces: the same appearance on the pre-payment gate and inline confirmation form, while Checkout dev tools, contact, voucher, and payment fields remain unchanged.

- [ ] **Step 1: Add failing Checkout scope assertions**

```js
test('Checkout scopes Quiet luxury to participant form containers only', () => {
  assert.match(checkoutSource, /participant-form-premium space-y-3/);
  assert.match(checkoutSource, /participant-form-premium participant-form-card rounded-\[22px\]/);
  assert.match(checkoutSource, /participant-form-ownership flex flex-col gap-2/);
  assert.match(checkoutSource, /participant-form-owner-choice flex min-h-\[70px\]/);
  assert.match(checkoutSource, /data-selected=\{selected \? '' : undefined\}/);
  assert.doesNotMatch(checkoutSource, /Checkout dev tools[\s\S]{0,900}participant-form-premium/);
});
```

- [ ] **Step 2: Run the test to verify RED**

```bash
node --test tests/participant-form-polish.test.mjs
```

Expected: FAIL because Checkout has not opted in.

- [ ] **Step 3: Mark only Checkout participant-form containers**

Add hooks without moving children:

```tsx
<section className="participant-form-premium participant-form-card rounded-[22px] border border-[#d9e8e5] bg-white p-5 shadow-[0_18px_42px_-34px_rgba(15,23,42,0.52)] sm:p-6 flex flex-col gap-5">
<div className="participant-form-premium space-y-3 pt-[104px] lg:pt-0" data-pre-payment-gate>
<div className="participant-form-card overflow-hidden rounded-[16px] border border-[#d5e3df] bg-white shadow-[0_8px_18px_-16px_rgba(15,23,42,0.42)] transition-all duration-300">
<fieldset className="participant-form-ownership flex flex-col gap-2">
<label
  data-selected={selected ? '' : undefined}
  className={`participant-form-owner-choice flex min-h-[70px] items-start gap-3 rounded-[12px] border px-3.5 py-3 transition-all ${
    selected
      ? 'border-[#177564] bg-[#f0fdf9] text-[#177564]'
      : 'border-[#e2e8f0] bg-white text-[#64748b]'
  } ${
    disabled
      ? 'cursor-not-allowed opacity-50'
      : 'cursor-pointer hover:border-[#b7ded6] hover:bg-[#f8fbfa]'
  }`}
>
```

Add `participant-form-upload` to the existing participant document upload button and completed-file surface within those containers. Do not mark Checkout dev tools, primary contact, voucher, or payment fields.

- [ ] **Step 4: Run focused Checkout and behavior tests**

```bash
node --test tests/participant-form-polish.test.mjs tests/checkout-confirmation.test.mjs tests/checkout-devtools.test.mjs tests/team-access.test.mjs tests/order-form-sharing.test.mjs
```

Expected: all PASS.

- [ ] **Step 5: Commit Checkout participant-form polish**

```bash
git add tests/participant-form-polish.test.mjs src/app/components/CheckoutPage.tsx
git commit -m "feat: align checkout participant form polish"
```

---

### Task 4: Verify unchanged behavior and rendered polish

**Files:**
- Modify only if verification finds a scoped defect: `src/app/pages/ParticipantFormPage.tsx`, `src/app/components/CheckoutPage.tsx`, `src/app/components/FormTextField.tsx`, `src/app/components/SegmentedChoice.tsx`, `src/styles/index.css`, `tests/participant-form-polish.test.mjs`

**Interfaces:**
- Consumes: Tasks 1–3.
- Produces: verified build and route evidence that polish did not change behavior or layout.

- [ ] **Step 1: Run the complete suite**

```bash
node --test tests/*.test.mjs
```

Expected: all PASS with zero failures.

- [ ] **Step 2: Run build and diff hygiene**

```bash
npm run build
git diff --check
```

Expected: Vite build succeeds and `git diff --check` prints no errors.

- [ ] **Step 3: Browser-check mobile at 393 × 852**

Check:

```text
/orders/tkt-003/form?returnTo=orders
/orders/tkt-013/form?returnTo=order&participantId=p7&playerOnly=1
/orders/tkt-013/form?returnTo=order&participantId=p1&playerOnly=1
/orders/tkt-013/form?returnTo=order&participantId=p5&playerOnly=1
/checkout#demo
```

Confirm the event header, participant card, deadline, segmented control, ownership choices, fields, upload, and actions remain in their current positions. Confirm focus-visible styling, readable helper text, selected ownership, disabled actions, uploaded/completed/invite states, and no console errors.

- [ ] **Step 4: Browser-check desktop at 1280 × 900**

Confirm `ParticipantFormPage` retains its `320px` sticky event column and form column, Checkout retains its participant switcher and form grid, and the theme does not leak into dev tools, primary contact, voucher, or payment fields.

- [ ] **Step 5: Exercise behavior**

On the standard form, switch fill/invite, switch ownership, fill the same fields, upload the waiver, and confirm existing save/submit enablement and destinations. On `/checkout#demo`, switch participants, fill or invite, upload, use `Save details and continue` or `Fill up later`, and confirm the same current state transitions.

- [ ] **Step 6: Commit any verification correction**

If verification required a correction:

```bash
git add src/app/pages/ParticipantFormPage.tsx src/app/components/CheckoutPage.tsx src/app/components/FormTextField.tsx src/app/components/SegmentedChoice.tsx src/styles/index.css tests/participant-form-polish.test.mjs
git commit -m "fix: finish participant form visual verification"
```

If no correction was required, do not create an empty commit.
