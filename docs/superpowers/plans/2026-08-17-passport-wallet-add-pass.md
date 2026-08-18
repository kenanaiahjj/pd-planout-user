# Passport Wallet-Style Add-Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Passport's oversized past-event card with a compact Apple Wallet-inspired add-pass surface while preserving the current QR scanner route and claimed-event history behavior.

**Architecture:** Keep the existing state and navigation inside `PassportPage.tsx`. Change only the JSX and Tailwind composition for the past-event section, and update its focused source-contract tests before implementation.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React, Node test runner, Vite

## Global Constraints

- The scan action must continue navigating to `/passport/add-entry?scan=1`.
- The scanner remains responsible for both live camera scanning and saved-photo upload.
- Do not change Guest QR claiming, storage, decoding, or route behavior.
- Use one scan icon on the surface and one clear primary action.
- Render claimed-history content only when `claimedGuestEntries.length > 0`.
- Do not add gradients, large blur surfaces, new image assets, or new dependencies.

---

### Task 1: Build the compact Wallet-style add-pass surface

**Files:**
- Modify: `tests/passport-past-event-card.test.mjs`
- Modify: `src/app/pages/PassportPage.tsx:840-887`

**Interfaces:**
- Consumes: `navigate(path: string)`, `claimedGuestEntries`, and the existing `ScanLine` and `ChevronRight` icons.
- Produces: one semantic scan button that navigates to `/passport/add-entry?scan=1`; conditional claimed-history rows with unchanged entry data.

- [x] **Step 1: Write the failing tests**

Update the focused tests to require the approved copy, compact Wallet sheet, conditional history, and absence of redundant empty guidance:

```js
test('Passport past-event surface uses a compact Wallet-style add-pass hierarchy', () => {
  const cardStart = source.indexOf('rounded-[24px] border border-white bg-[#fffdf8]');
  const cardEnd = source.indexOf('</section>', cardStart);
  const cardSource = source.slice(cardStart, cardEnd);

  assert.notEqual(cardStart, -1);
  assert.match(cardSource, />Add a past event<\/p>/);
  assert.match(cardSource, /Save an event you attended to your Passport\./);
  assert.match(cardSource, />Scan event QR<\/span>/);
  assert.match(cardSource, /Camera or saved QR photo/);
  assert.match(cardSource, /rounded-\[16px\] bg-\[#132d29\]/);
  assert.match(cardSource, /active:scale-\[0\.985\]/);
  assert.doesNotMatch(cardSource, /backdrop-blur|bg-gradient|linear-gradient/);
});

test('Passport past-event surface hides redundant empty history guidance', () => {
  assert.match(source, /claimedGuestEntries\.length > 0/);
  assert.match(source, />Past events<\/p>/);
  assert.doesNotMatch(source, /Claimed events will appear here/);
});
```

- [x] **Step 2: Run the focused test and confirm RED**

Run:

```bash
node --test tests/passport-past-event-card.test.mjs
```

Expected: FAIL because the current section still uses the old `rounded-[18px]` mint card, old copy, and redundant empty-state paragraph.

- [x] **Step 3: Implement the approved surface**

Replace only the past-event `<section>` in `PassportPage.tsx` with this composition:

```tsx
<section className="rounded-[24px] border border-white bg-[#fffdf8] p-4 shadow-[0_18px_44px_-32px_rgba(15,23,42,0.45)] ring-1 ring-black/[0.04]">
  <div className="flex items-center gap-3 px-1">
    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#edf4f2] text-[#177564] ring-1 ring-inset ring-black/[0.04]">
      <ScanLine className="size-5" strokeWidth={2} aria-hidden="true" />
    </div>
    <div className="min-w-0">
      <p className="text-balance text-[16px] font-semibold text-[#181d27]">Add a past event</p>
      <p className="mt-0.5 text-pretty text-[12px] leading-relaxed text-[#66746f]">Save an event you attended to your Passport.</p>
    </div>
  </div>

  <button
    type="button"
    onClick={() => navigate('/passport/add-entry?scan=1')}
    className="group mt-4 flex min-h-14 w-full items-center justify-between gap-4 rounded-[16px] bg-[#132d29] px-4 py-3 text-left text-white shadow-sm transition-transform duration-150 ease-out active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/40 focus-visible:ring-offset-2"
  >
    <span className="min-w-0">
      <span className="block text-[14px] font-semibold">Scan event QR</span>
      <span className="mt-0.5 block text-[11.5px] font-medium text-white/65">Camera or saved QR photo</span>
    </span>
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10" aria-hidden="true">
      <ChevronRight className="size-4 text-white/80 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
    </span>
  </button>

  {claimedGuestEntries.length > 0 && (
    <div className="mt-4 border-t border-black/[0.07] pt-4">
      <div className="flex items-center justify-between gap-3 px-1">
        <p className="text-[13px] font-semibold text-[#284541]">Past events</p>
        <span className="text-[11px] font-semibold text-[#6a8580]">{claimedGuestEntries.length} {claimedGuestEntries.length === 1 ? 'event' : 'events'}</span>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {claimedGuestEntries.map((entry) => (
          <div key={entry.id} className="flex items-center justify-between gap-3 rounded-[16px] border border-black/[0.05] bg-white px-3 py-2.5 shadow-sm">
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-semibold text-[#181d27]">{entry.eventName}</p>
              <p className="mt-0.5 truncate text-[11.5px] font-medium text-[#66746f]">{entry.category} · {entry.usedAt ? 'Checked in before claim' : 'Added from Guest QR'}</p>
            </div>
            <span className="shrink-0 rounded-full bg-[#e5f3ef] px-2.5 py-1 text-[11px] font-semibold text-[#177564]">Added</span>
          </div>
        ))}
      </div>
    </div>
  )}
</section>
```

- [x] **Step 4: Run the focused test and confirm GREEN**

Run:

```bash
node --test tests/passport-past-event-card.test.mjs
```

Expected: all focused tests PASS.

- [x] **Step 5: Verify the complete app contract**

Run:

```bash
node --test tests/*.test.mjs
npm run build
git diff --check -- src/app/pages/PassportPage.tsx tests/passport-past-event-card.test.mjs
```

Expected: all tests pass, Vite exits successfully, and diff check reports no whitespace errors.

- [x] **Step 6: Verify the live mobile flow**

Open `http://localhost:5173/passport` at the current mobile viewport. Confirm the surface is visibly shorter, has no redundant empty-history paragraph, and retains one scan icon. Activate `Scan event QR` and confirm the browser reaches `/passport/add-entry?scan=1`.

- [ ] **Step 7: Commit the focused implementation**

```bash
git add src/app/pages/PassportPage.tsx tests/passport-past-event-card.test.mjs docs/superpowers/plans/2026-08-17-passport-wallet-add-pass.md
git commit -m "refactor: polish Passport past-event launcher"
```
