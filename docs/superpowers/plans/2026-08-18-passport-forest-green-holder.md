# Passport Forest-Green Holder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recolor the Passport holder system with layered PlanOut forest-green surfaces while preserving the QR card, action tabs, geometry, and interactions.

**Architecture:** Keep `PlanOutPassportCard` as the owner of the holder material. Update only the holder/backplate, pocket, inner insert, and holder mark styling; no data, routing, QR, or interaction APIs change. Add a source-contract regression beside the existing component contract tests so the approved palette cannot silently regress to tan.

**Tech Stack:** React, TypeScript, Tailwind utility classes, Node's built-in test runner, Vite.

## Global Constraints

- Preserve the current scaled holder geometry and touch interaction.
- Keep the metallic QR frame and QR code unchanged.
- Keep the Events, Save, and Reset QR tabs colorful and unchanged.
- Do not change Passport data, QR generation, navigation, focus/active states, or reduced-motion behavior.
- Keep the holder mark and wordmark readable against the green inner insert.

---

### Task 1: Apply and lock the forest-green holder material

**Files:**
- Modify: `tests/cardholder-components.test.mjs`
- Modify: `src/app/components/PlanOutPassportCard.tsx:329-432`

**Interfaces:**
- Consumes: Existing `PlanOutPassportCard` JSX layers and existing component source-contract test.
- Produces: A source-verified holder material using the approved green tokens, with all current PassportCard props and interactions unchanged.

- [ ] **Step 1: Write the failing source-contract test**

Add this import and fixture after the existing `metalSource` fixture in `tests/cardholder-components.test.mjs`:

```js
const passportSource = fs.readFileSync(
  new URL('../src/app/components/PlanOutPassportCard.tsx', import.meta.url),
  'utf8',
);
```

Add this test after the existing `MetalCard` test:

```js
test('Passport holder uses layered forest-green material', () => {
  const holderStart = passportSource.indexOf('top-[104px]');
  const holderEnd = passportSource.indexOf('{/* Fullscreen Overlay */}', holderStart);
  const holderSource = passportSource.slice(holderStart, holderEnd);

  assert.notEqual(holderStart, -1, 'Passport holder backplate should be present');
  assert.notEqual(holderEnd, -1, 'Passport holder overlay boundary should be present');
  assert.match(holderSource, /#0b7067/);
  assert.match(holderSource, /#075f56/);
  assert.match(holderSource, /#063c36/);
  assert.match(holderSource, /#176f63/);
  assert.match(holderSource, /#0a4c46/);
  assert.match(holderSource, /border-\[#084c46\]/);
  assert.match(holderSource, /border-\[#0b4f48\]/);
  assert.match(holderSource, /#b8ddd5/);
  assert.doesNotMatch(holderSource, /#d8b48f|#b28e65|#d8b68f|#bd9a72|#9e7a52|#ad885c|#8a6842/);
});
```

- [ ] **Step 2: Run the focused test and verify it fails for the missing green material**

Run:

```bash
node --test tests/cardholder-components.test.mjs
```

Expected: the existing LeatherCardholder and MetalCard tests pass, and `Passport holder uses layered forest-green material` fails because the current holder source still contains tan fills and does not contain the approved green tokens.

- [ ] **Step 3: Replace only the holder material classes and mark colors**

In `src/app/components/PlanOutPassportCard.tsx`, make these exact class changes:

```tsx
// Deep ambient holder backplate
className="absolute left-0 right-0 top-[104px] z-0 h-[330px] rounded-[38px] bg-[linear-gradient(90deg,#063c36_0%,#0b5d58_48%,#063c36_100%)] shadow-[0_34px_68px_-26px_rgba(4,45,41,0.42),inset_0_1px_1px_rgba(214,255,247,0.16)]"

// Lower holder pocket
className="absolute bottom-0 left-0 right-0 z-20 h-[294px] rounded-[38px] bg-[#0b5d58] bg-[linear-gradient(180deg,#0b7067_0%,#075f56_52%,#063c36_100%)] shadow-[0_32px_52px_-30px_rgba(4,45,41,0.58),inset_0_1px_0_rgba(214,255,247,0.22),inset_0_-24px_48px_rgba(0,0,0,0.2)] border border-[#084c46]"

// Lower pocket inset border
className="pointer-events-none absolute inset-3.5 rounded-[30px] border border-dashed border-[#b8ddd5]/30"

// Inner Passport Holder insert
className="absolute bottom-[32px] left-[24px] right-[24px] z-40 h-[132px] rounded-[22px] bg-[#176f63] bg-[linear-gradient(135deg,#176f63_0%,#0a4c46_100%)] shadow-[0_19px_28px_-20px_rgba(3,33,30,0.48),inset_0_1px_0_rgba(225,255,249,0.22),inset_0_-22px_34px_rgba(0,0,0,0.22)] border border-[#0b4f48]"

// Inner Passport Holder inset border
className="pointer-events-none absolute inset-2.5 rounded-[17px] border border-[#b8ddd5]/25"

// Holder mark and wordmark
className="h-6 w-auto opacity-30 brightness-0 invert pointer-events-none"
className="mt-1 text-[8.5px] font-bold uppercase tracking-[3.5px] text-[#b8ddd5]/70"
```

Do not edit the metallic QR frame class, QR content, `footerActions`, tab children, holder dimensions, drag handlers, or click handlers.

- [ ] **Step 4: Run the focused test and verify the material contract passes**

Run:

```bash
node --test tests/cardholder-components.test.mjs
```

Expected: all tests in the file pass, including the forest-green holder regression.

- [ ] **Step 5: Run the full verification suite**

Run:

```bash
node --test tests/*.test.mjs
npm run build
git diff --check -- src/app/components/PlanOutPassportCard.tsx tests/cardholder-components.test.mjs
```

Expected: the full Node suite passes, Vite produces a successful production build, and `git diff --check` reports no whitespace errors. Leave implementation changes uncommitted so they remain reviewable alongside the user's existing worktree changes.
