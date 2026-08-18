# Messenger Launcher Size Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render the Messenger artwork at 40×40px while retaining the existing 48×48px launcher tap target.

**Architecture:** Keep `MessengerMark` prop-driven and change only the class passed by the floating launcher. The outer button continues to own focus, pointer feedback, shadow, unread-badge positioning, and its accessible name.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Node test runner, Vite

## Global Constraints

- The launcher button remains exactly 48×48px.
- The transparent Messenger artwork becomes exactly 40×40px.
- Preserve the transparent background, focus ring, hover and pressed feedback, unread badge, safe-area placement, and panel behavior.
- Do not introduce dependencies.

---

### Task 1: Separate launcher artwork size from tap-target size

**Files:**
- Modify: `tests/messenger-widget.test.mjs:71-75`
- Modify: `src/app/components/MessengerWidget.tsx:422-436`

**Interfaces:**
- Consumes: `MessengerMark({ className?: string })` and the existing icon-only launcher button.
- Produces: a 48px launcher button containing a centered 40px Messenger artwork.

- [ ] **Step 1: Write the failing test**

```js
test('MessengerWidget keeps a 48px tap target around 40px artwork', () => {
  assert.match(widgetSource, /className="relative flex size-12 items-center justify-center/);
  assert.match(widgetSource, /<MessengerMark className="size-10" \/>/);
});
```

- [ ] **Step 2: Verify RED**

Run: `node --test tests/messenger-widget.test.mjs`

Expected: FAIL because the launcher currently passes `size-12` to `MessengerMark`.

- [ ] **Step 3: Implement the requested artwork size**

```tsx
<MessengerMark className="size-10" />
```

Do not change the button's `size-12` class or any unread-badge positioning classes.

- [ ] **Step 4: Verify GREEN**

Run: `node --test tests/messenger-widget.test.mjs`

Expected: all Messenger widget tests pass.

- [ ] **Step 5: Verify the live Passport surface**

Open `http://localhost:5173/passport` at 398×944. Confirm the visible artwork is 40×40px, the button remains 48×48px, and the unread badge remains attached to the button corner.

- [ ] **Step 6: Run regression checks**

Run: `node --test tests/*.test.mjs`

Expected: all tests pass.

Run: `npm run build`

Expected: the Vite production build succeeds.

Run: `git diff --check -- src/app/components/MessengerWidget.tsx tests/messenger-widget.test.mjs`

Expected: no whitespace errors.
