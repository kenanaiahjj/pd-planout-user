# PlanOut UX Fix Plan — agent execution spec

**Source of findings:** `docs/ux-test-results/planout-prototype-2026-08-06.md`
**Target repo:** PlanOut Prototype (React 18 + Vite + Tailwind v4 + react-router v7 + motion v12)
**Audience:** an LLM coding agent executing tasks one at a time.

---

## 0. How to use this plan

- Tasks are **atomic and ordered**. Do one task, verify it, commit it, then move on. Do not batch.
- Every task has **Anchor** (file:line + the string to find), **Change**, **Accept** (objective pass condition), and **Guard** (what must not change).
- Line numbers are from the audit commit and **may drift**. Always locate by the quoted string, not the number.
- If an Anchor string is not found, **stop and report** — do not guess a substitute location.
- Phase 1 must land completely before Phase 2 begins; Phases 2–4 are internally parallel-safe.

### Commands

```bash
npm run build
```

```bash
node --test tests/
```

Both must pass before each commit. There is no `npm test` script; the suite is `node:test` files that
assert against **source text**, so if you change a class string that a test regexes, update that test in
the same commit.

### READ THIS BEFORE OPENING A BROWSER

Several pages animate in from `opacity: 0` via motion (`EventDetailsPage.tsx:128-131` `fadeUp`;
`PassportPage.tsx:788-790` `scale: 0.15, y: 400`; `CartPage` `translateX`). **If your browser tab is
backgrounded, `requestAnimationFrame` never fires and these pages render blank or displaced.** That is a
harness artifact, not a bug. Two findings were withdrawn from the audit for this reason.

Before trusting any visual observation, run:

```js
JSON.stringify({vis: document.visibilityState, hidden: document.hidden})
```

If `hidden` is `true`, either front the tab or normalize before measuring:

```js
(()=>{const s=document.createElement('style');s.textContent='[style*="opacity: 0"],[style*="opacity:0"],[style*="translateX"],[style*="scale(0.15"]{opacity:1!important;transform:none!important}';document.head.appendChild(s);return 'normalized'})()
```

**Do not "fix" a blank page you have not confirmed with `visibilityState: "visible"`.** Task 4.1 addresses
the underlying fragility properly.

### Guardrails (apply to every task)

- **Do not** restyle, refactor, or "clean up" anything outside the named Anchor.
- **Do not** touch `src/imports/**` (generated Figma output) or `src/app/pages/PassportCasesPage*.tsx`
  except where a task names them.
- **Do not** change mock data values unless a task says to. Several audit findings are data-shaped;
  fixing them silently makes regressions untraceable.
- **Do not** rename exported symbols. Several tests assert on source text.
- **Do not** introduce new dependencies.
- Keep Tailwind arbitrary-value syntax and the existing hex-literal style; this codebase does not use
  semantic color tokens, and inventing them mid-plan creates inconsistency.
- Preserve `motion-reduce:` and `prefers-reduced-motion` handling wherever it already exists.

### Verification setup used by every "Accept" clause

Start the app, set the viewport to **375×812**, and sign in by seeding a profile:

```js
localStorage.setItem('planout.user.profile.v1', JSON.stringify({name:'Kenan Aiah', email:'kenanaiah@lmf.ventures', phone:'+63 917 000 1234', loginMethod:'email'}))
```

Contrast checker (paste into console, returns a ratio for two computed colors):

```js
window.cr=(fg,bg)=>{const L=c=>{const[r,g,b]=c.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4});return .2126*r+.7152*g+.0722*b};const a=L(fg),b2=L(bg);return((Math.max(a,b2)+.05)/(Math.min(a,b2)+.05)).toFixed(2)}
```

---

# PHASE 1 — Action states become explicit (P1)

> Rationale: PRODUCT.md commits to *"Action states must be explicit"* and *"WCAG AA contrast"*. Phase 1 is
> the set of failures against that specific promise. 6 of 7 sessions hit at least one of these.

---

## Task 1.1 — Move the order status pill out of the folder graphic and make it legible

**Why:** `Forms needed` renders at **8px bold, 2.34:1** contrast; `Ready for gate` at **8px, 2.59:1**.
WCAG AA requires 4.5:1. Both sit inside a decorative folder illustration. This is the app's primary state
signal and its least readable element.

**Anchor A** — `src/app/pages/OrdersPage.tsx`, in `OrderFolderGraphic`, the `<span data-testid="order-state-label">` whose class string contains:
```
absolute left-1/2 top-[52px] w-max -translate-x-1/2 rounded-[4px] px-2 py-1 text-center text-[8px] font-bold
```

**Anchor B** — `src/app/pages/OrdersPage.tsx`, `stateClasses` in `OrderFolderGraphic`:
```
? 'bg-[#e8d79f]/95 text-[#5b461e] ring-[#c4aa61]'
: 'bg-[#b7ddd2]/95 text-[#0a5a50] ring-[#78aea2]'
```

**Anchor C** — `src/app/pages/OrdersPage.tsx`, in `OrderCard`, the row containing `{order.ref}` and `{order.date}`.

**Change:**
1. **Delete** the `order-state-label` span from `OrderFolderGraphic` entirely. The graphic keeps its
   `role="img"` + `aria-label` (which already includes `state.label`) — leave that alone.
2. Render the pill in the card's **text column** instead: in `OrderCard`, directly beneath the `<h2>`
   holding `{order.name}` and above the item-summary `<p>`, render the pill when `getOrderState(order)`
   is non-null.
3. Pill styling: `rounded-full px-2.5 py-1 text-[11px] font-semibold` — **remove `/95` alpha** so contrast
   is deterministic, and use opaque fills:
   - `warning` → background `#fdf0d2`, text `#6b4e12`
   - `ready` → background `#d4ebe4`, text `#0b4f45`
4. Keep `getOrderState` and the `OrderState` type unchanged.

**Accept:**
- On `/orders` at 375px, every card with a state shows the pill in the text column, never over the artwork.
- `document.querySelectorAll('[data-testid="order-state-label"]')` inside the graphic returns 0.
- For both pill variants, computed `font-size` is `11px` and `window.cr(fg, bg) >= 4.5`.
- `node --test tests/` passes; update `tests/orders-ui-consistency.test.mjs` if it regexes the old class.

**Guard:** do not resize the folder graphic, do not change `getOrderGraphicVariant`, do not alter the
graphic's `aria-label`.

---

## Task 1.2 — Always render a state, including `Complete`

**Why:** 5 of 15 seeded orders render no pill at all. Absence of a badge is indistinguishable from a
render failure; Session 2 could not tell "done" from "unknown".

**Anchor** — `src/app/pages/OrdersPage.tsx`:
```
function getOrderState(order: OrderRecord): OrderState {
```
and the type above it:
```
type OrderState = {
  label: 'Forms needed' | 'Ready for gate';
  tone: 'warning' | 'ready';
} | null;
```

**Change:**
- Widen the type to `label: 'Forms needed' | 'Ready for gate' | 'Complete'` and
  `tone: 'warning' | 'ready' | 'neutral'`. Keep `| null` only for the genuinely indeterminate case.
- Return `{ label: 'Complete', tone: 'neutral' }` where the function currently falls through to `null`
  for orders that are finished (merch-only orders, and event orders with no pending forms and no
  gate-attached entries).
- Add the `neutral` branch to `stateClasses`: background `#eef1f4`, text `#475467`.

**Accept:**
- On `/orders`, all 15 cards show exactly one pill.
- `window.cr` for the neutral pill `>= 4.5`.
- The `Complete` tab count still reads 10 and the `Pending` count still reads 5 (this task must not change
  filtering — only labelling).

**Guard:** do not change `orderHasPending` or `orderIsComplete`; the tab counts derive from them.

---

## Task 1.3 — One count for "what you owe"

**Why:** Four surfaces report four different numbers simultaneously: nav bag badge **8**
(`ticketActionCount`), `FloatCard` **6** (`passportPendingCount`), Orders `Pending` tab **5**, header bell
**4**. Session 2 stopped trusting the entire interface over this.

**Anchor A** — `src/app/context/AppContext.tsx`:
```
        ticketActionCount: getActionRequiredCount(),
        passportPendingCount: passportPendingSummary.pendingCount,
```

**Anchor B** — `src/app/context/AppContext.tsx`, the `passportPendingSummary` `useMemo` (search
`const passportPendingSummary = useMemo(`).

**Anchor C** — `src/app/pages/OrdersPage.tsx`:
```
    { value: 'pending', label: 'Pending', badge: orders.filter(orderHasPending).length },
```

**Change:**
1. Decide the canonical definition: **the number of registration entries that require an action from this
   user** (form needed, player entry needed, resubmit required). Write that definition as a comment above
   the selector.
2. Export a single `actionRequiredCount` from `AppContext`, computed once.
3. Keep `ticketActionCount` and `passportPendingCount` as **aliases of the same value** for one commit so
   nothing breaks, then in the same task update the three consumers
   (`BottomNav` badge, `FloatCard` via `RootLayout.tsx` `pendingCount`, and the `Header` bell if it is
   action-derived) to read `actionRequiredCount`, and delete the aliases.
4. **Leave the Orders `Pending` tab as-is** — it counts *orders*, not entries, which is legitimately a
   different unit. Instead relabel it so the difference is visible: `Pending` stays, but the tab's
   `aria-label` becomes `` `Pending, ${n} orders` `` (see Task 3.4).
5. The notification bell badge counts **unread notifications**, which is also a different thing. Leave its
   number alone, but confirm it is not being read as an action count anywhere.

**Accept:**
- `grep -rn "ticketActionCount\|passportPendingCount" src/` returns **0 hits** outside the deletion commit.
- On `/orders` at 375px: the nav bag badge and the `FloatCard` count are **identical**.
- `npm run build` passes.

**Guard:** do not change `getActionRequiredCount`'s underlying logic in this task — only unify the
plumbing. If the two old functions disagree on the same data, record which one you kept and why in the
commit message.

---

## Task 1.4 — Swap the CTA hierarchy so the required action is the loudest

**Why:** Settled entries get a filled `PrimaryButton` (`View QR`); the entry that actually needs work gets
an outline `SecondaryButton` (`Fill up`). Session 2: *"The done thing shouts, the to-do thing whispers."*

**Anchor A** (needs work — currently secondary) — `src/app/pages/OrdersPage.tsx`, in `RegistrationItem`,
the `fillAction` prop:
```
          fillAction={(
            <SecondaryButton
```
…whose child text is `Fill up`.

**Anchor B** (settled — currently primary) — `src/app/pages/OrdersPage.tsx`, the `entry.status === 'attached'` branch:
```
            <PrimaryButton
              type="button"
              onClick={() => navigate('/passport')}
              compact
              className="text-[12px]"
            >
              View QR
            </PrimaryButton>
```

**Change:**
- `fillAction`: `SecondaryButton` → `PrimaryButton`, label `Fill up` → **`Complete form`**.
- `attached` branch: `PrimaryButton` → `SecondaryButton` for `View QR`. Keep `viewFormAction` as-is.
- Do the same swap in the `entry.type === 'team'` path if it mirrors this structure (label
  `Player entry needed` → CTA `Complete player entries`).

**Accept:**
- On `/orders/MNL-2026-001234` at 375px: the `Form needed` entry's CTA is the filled green button; both
  `Ready for gate` entries have outline buttons only.
- No occurrence of `>Fill up<` or `Fill up later` remains in `src/app/` (see Task 2.1 for the rest).

**Guard:** do not change `PrimaryButton`/`SecondaryButton` themselves; do not change navigation targets.

---

## Task 1.5 — Make `FloatCard` dismissible and stop it covering content

**Why:** Non-dismissible `position: fixed` overlay rendered on every route except orders/passport/form
paths. Observed covering an **entire event card** on `/events` and the **date/venue row** on `/events/:id`.
With `BottomNav` it occupies ~190px of an 812px screen. It is also a `<button>` containing a
button-styled `<div>` (nested interactive semantics) and cannot be dismissed by keyboard or `Esc`.

**Anchor** — `src/app/components/FloatCard.tsx`, whole component; plus `shouldHideOnRoute` at
`FloatCard.tsx:25-35`; plus its usage in `src/app/layouts/RootLayout.tsx` (`pendingCount={...}`).

**Change:**
1. Add `/events` and event detail routes to `shouldHideOnRoute` — the card is noise while browsing:
   return `true` for `pathname === '/events'` and `/^\/events\//.test(pathname)`.
2. Restructure the markup: the **card is a `<div>`**, not a `<button>`. Inside it place
   **two real buttons** — the `Finish Forms` action and a `<button aria-label="Dismiss">` with an `X`
   (24px icon, 44×44 hit area).
3. Dismissal: hold state in `sessionStorage` under `planout.floatcard.dismissed.v1`. Once dismissed, do
   not render for the rest of the session. Re-show on a new session or when `pendingCount` increases
   above the value stored at dismissal.
4. Add `Esc` to dismiss while the card is mounted (`keydown` listener, cleaned up on unmount).

**Accept:**
- On `/events` and `/events/1` at 375px: no `FloatCard` in the DOM.
- On `/`: the card renders; the dismiss button is reachable by `Tab`, has an accessible name, and its hit
  box is `>= 44×44`.
- After dismissing, a reload within the same session does not re-show it.
- The card contains exactly two elements matching `button, [role="button"]`.
- `tests/orders-ui-consistency.test.mjs` still passes (it already asserts the card stays off `/orders`).

**Guard:** keep the existing brand-gradient logic and `accentColor`/`accentDarkColor` props intact.

---

## Task 1.6 — Passport: say that the QR alone is enough

### ⚠️ Do not reveal the name or passport code

The closed card hides the holder's name and passport code **on purpose**. Only the QR is needed to scan,
and concealing identity is a **privacy measure** — the card gets held up in public at a gate. Identity is
available on demand by opening the card.

**An earlier draft of this plan told you to reorder the card face so the name and code were always visible.
That was wrong and has been removed. Do not implement it.** If a future task or reviewer suggests surfacing
identity on the closed card, stop and ask.

**Why this task still exists:** the design is right, but the screen never explains it. Three of seven
sessions read the blank card face and the empty-looking pocket as "I'm not registered", and Session 3
asked *"How will the man at the gate know it's me?"* — a question with a good answer that the UI never gives.

**Anchor A** — `src/app/pages/PassportPage.tsx`, the region below `<PlanOutPassportCard ... />` (search
`qrSubtitle=`).

**Anchor B** — `src/app/components/PlanOutPassportCard.tsx`, the card-face eyebrow text `UNIVERSAL PASS`.

**Anchor C** — `src/app/pages/PassportPage.tsx`, the `footerActions` array (the `Events` / `Save` /
`Reset QR` tabs) and the pocket graphic beneath the card.

**Change:**
1. Add a single reassurance line directly beneath the card:
   **"Staff scan this QR to check you in. Your name and code stay private until you open the card."**
   Small, muted, centered. This is the whole point of the task.
2. Rename the card-face eyebrow `UNIVERSAL PASS` → **`PLANOUT PASSPORT`** (Task 2.1's naming unification;
   done here because it is the same edit region). **Text only — do not move it or anything around it.**
3. Stop the pocket graphic reading as an empty container: it should look like part of the wallet, not like a
   slot awaiting content. Reduce its visual prominence (lower contrast against the leather, drop the
   `PASSPORT HOLDER` lettering to near-invisible or remove it) so the QR card is unambiguously the subject.
4. Ensure the footer tab labels are not clipped at `holderScale = 0.9` — verify `Events`, `Save`, and
   `Reset QR` are each fully readable at 375px.

**Accept:**
- Load `/passport` at 375px with `visibilityState: "visible"`. The reassurance line is visible without
  scrolling, and the card face still shows **only** the eyebrow and the QR — **no name, no passport code**.
- Opening the card (drag/tap) still reveals name and code exactly as before.
- `Events`, `Save`, `Reset QR` labels are fully within their tab bounds.
- `tests/cardholder-components.test.mjs` and `tests/passport-past-event-card.test.mjs` pass.

**Guard:** do not change `targetY`, the drag gesture, `layoutId="passport-metal-card"`, the leather
aesthetic, or the closed-state composition. Do not move name/code into the visible region.

---

## Task 1.7 — `Reset QR` needs a consequence and a lower rank

**Why:** A destructive, unexplained action sits at equal visual weight to `Save` and `Events`, in candy
yellow. Sessions 3 and 6 both refused to touch it. Session 6 (VoiceOver) had no description of what it does.

**Anchor** — `src/app/pages/PassportPage.tsx`:
```
                { label: 'Reset QR', icon: RefreshCw, onClick: regenerateQr, className: 'bg-[#ffe36e] text-[#4f4214] rotate-[5deg]' },
```

**Change:**
1. Route `regenerateQr` through the existing `ConfirmDialog` (`src/app/components/ConfirmDialog.tsx`).
   Copy: title **"Reset your Passport QR?"**, body **"Your current QR stops working immediately. Anyone
   holding a screenshot of it will not be able to check in. Your registrations are not affected."**,
   confirm **"Reset QR"**, cancel **"Keep current QR"**.
2. Add `aria-describedby` on the tab pointing at visually-hidden text carrying the same warning.
3. Relabel `Save` → **`Save to Wallet`** (it calls `downloadQr`; if it does not produce a wallet pass,
   use **`Download QR`** instead — check `downloadQr` and pick the truthful label).

**Accept:**
- Activating `Reset QR` opens a confirm dialog; cancelling leaves `member.qrVersion` unchanged.
- The tab has a non-empty `aria-describedby` target.
- `Save`'s label matches what the handler actually does.

**Guard:** do not change `regenerateQr`'s implementation.

---

## Task 1.8 — Global focus-visible token + focus management on navigation

**Why:** `outline: none` throughout; `focus-visible` styling exists in only **25 of 143** component files;
`Header.tsx`, `EventCard.tsx`, `CartPage.tsx` have **none**. Route changes reset focus to document top.
PRODUCT.md explicitly commits to "visible keyboard focus".

**Anchor A** — `src/styles/theme.css`, inside the existing base layer (the block containing `button { font-size: ... }`).

**Anchor B** — `src/app/components/AnimatedOutlet.tsx`, the `motion.div` keyed on `location.pathname`.

**Change:**
1. In `theme.css`, add a global rule inside the same `@layer base` block:
   ```css
   :focus-visible {
     outline: 2px solid #177564;
     outline-offset: 2px;
     border-radius: inherit;
   }
   ```
   Do **not** add `outline: none` anywhere. Leave component-level `focus-visible:ring-*` utilities in
   place — they layer harmlessly on top.
2. In `AnimatedOutlet`, on `location.pathname` change (skipping first render), move focus to the new
   page's `h1`: query `document.querySelector('main h1')`, and if found, set `tabIndex={-1}` on it and
   call `.focus({preventScroll: true})`. If no `h1`, focus the `main` element.

**Accept:**
- `Tab` from page load on `/orders` produces a visible 2px emerald ring on every stop, including the three
  header buttons.
- Navigating `/orders` → an order detail moves `document.activeElement` to the detail page's `h1`
  (verify: `document.activeElement.tagName === 'H1'`).
- No visual change when navigating with a pointer (`:focus-visible` only).

**Guard:** do not add focus styles that fire on mouse click (`:focus`); do not remove existing
`focus-visible:ring` utilities.

---

## Task 1.9 — Sticky headers must not cover the focused field

**Why:** In the checkout participant form, the sticky stepper card covers the field above the one being
typed in (observed: "Last name" clipped). Keyboard users lose sight of their own input.

**Anchor** — `src/app/components/CheckoutPage.tsx`, the sticky stepper container (search for the element
rendering `Complete participant details` together with the `1/3` counter), and the form's input elements.

**Change:**
- Measure the sticky header's height and apply `scroll-margin-top` of that height + 12px to every focusable
  form control in the flow. Prefer one CSS rule scoped to the form container over per-input classes, e.g.
  a class on the form wrapper plus `.checkout-form :is(input,select,textarea,button){scroll-margin-top:var(--checkout-sticky-h)}`
  with the variable set from the sticky element's height.

**Accept:**
- At 375px on `/checkout#demo`, `Tab` through every field: no focused control is ever visually behind the
  sticky stepper.
- Same check with browser find-on-page / anchor scroll.

**Guard:** do not make the stepper non-sticky.

---

# PHASE 2 — Language and truth (P2)

> 15 of the audit's 16 content findings are naming, not logic. This phase is mostly find-and-replace with
> judgment, and it is the cheapest credibility win available.

---

## Task 2.1 — Terminology lockfile, then enforce it

**Change:**
1. Create `docs/terminology.md` with a table of **one approved term per concept** and its banned variants:

   | Concept | Use | Never |
   |---|---|---|
   | The persistent access credential | **Passport** (`PlanOut Passport` on first mention) | `UNIVERSAL PASS`, `universal QR`, `PASSPORT HOLDER` (as a label), `universal pass` |
   | The organizer-required form | **participant form** | `form details`, `Completed Information` |
   | Completing that form | **Complete form** / **Finish later** | `Fill up`, `Fill up later` |
   | Form outstanding | **Form needed** (singular, everywhere) | `Forms needed`, `Forms still needed` |
   | Event host | **organizer** | `organiser` |
   | Separator between metadata | `·` | `-` used as a separator |

2. Apply it across `src/app/**` (excluding `src/imports/**`). Known sites:
   - `Fill up` / `Fill up later` — `OrdersPage.tsx`, `CheckoutPage.tsx`
   - `universal QR` — `OrdersPage.tsx` (`Ready for gate - staff scans your universal QR.` →
     **`Ready for gate · staff scan your Passport QR.`**)
   - `UNIVERSAL PASS` — `PlanOutPassportCard.tsx` (done in Task 1.6)
   - `organiser` — `HomePage.tsx`, `NotificationsPage.tsx`
   - `PlanOut passport` lowercase — `src/app/data/events.ts` About copy
   - `Forms needed` vs `Form needed` — `OrdersPage.tsx` (`getOrderState` label and the entry pill)
   - Hyphen separators — `OrdersPage.tsx` (`Ready for gate - `, `Form update required - `),
     `GuestEntryPages.tsx` (`One-time use - Valid …` → `One-time use · Valid …`), `getItemSummary`
     (item joiner `-` → `·`)
3. Add `tests/terminology.test.mjs` in the existing source-assertion style: read every file under
   `src/app/**` except `src/imports/**` and `PassportCasesPage*.tsx`, and assert **zero** matches for
   `/UNIVERSAL PASS|universal QR|organiser|Fill up/`.

**Accept:** `node --test tests/` passes, including the new terminology test.

**Guard:** do not rename code identifiers (`passportCode`, `guestQR`, etc.) — user-facing strings only.
`PASSPORT HOLDER` as decorative artwork text stays, but gets `aria-hidden` in Task 3.3.

---

## Task 2.2 — Delete the three self-contradictions

**2.2a — `Ready` badge on an unfilled form.**
Anchor: `src/app/components/CheckoutPage.tsx`, the entry card badge rendering `Ready`.
Change: derive the badge from required-field validity. Unfilled → **`Needs details`** (`pending` tone);
all required fields valid → `Ready`.
Accept: on `/checkout#demo` with a required field emptied, the badge reads `Needs details`.

**2.2b — "You'll be notified once the attendee completes the form" on a complete form.**
Anchor: the form-details view reached at `/orders/tkt-001/form` — locate the string
`You'll be notified once the attendee completes the form`.
Change: render that line **only** when the entry's status is pending/invited. When status is complete,
omit it.
Accept: `/orders/tkt-001/form` shows `Complete` and **no** "you'll be notified" line.

**2.2c — "Claimed events will appear here." on an account with 15 orders.**
Anchor: `src/app/pages/PassportPage.tsx`, the claimed-entries empty state.
Change: replace with copy that states the relationship:
**"Your registrations already work with this QR. This section is only for adding past events you attended
before joining PlanOut."**
Accept: string present on `/passport`; old string gone.

---

## Task 2.3 — Name the required document

**Why:** "Upload the file requested by the organizer, such as a waiver, medical certificate, or ID." A user
cannot comply with a list of maybes. Session 1 skipped it and left checkout incomplete.

**Anchor** — `src/app/components/CheckoutPage.tsx`, the `Required document` block; and the ticket/event
data shape in `src/app/data/tickets.ts`.

**Change:**
1. Add an optional field to the ticket/entry data: `requiredDocument?: { name: string; note?: string }`.
2. Seed it on the entries that currently demand a document (e.g. `{ name: 'Event waiver', note: 'Signed PDF, downloadable from the Requirements section of the event page' }`).
3. Render `Required document · {name}` as the label and `{note}` as the helper. If `requiredDocument` is
   absent, **do not render the upload block at all** rather than showing a generic prompt.

**Accept:** on `/checkout#demo`, the upload block names a specific document, or is absent.

**Guard:** do not make the upload mandatory in this task — gating submission is a product decision, not a
copy fix. Note it as an open question in the commit message.

---

## Task 2.4 — Collapse the duplicate recipient/fill-method controls

**Why:** The segmented `Fill Details Myself | Invite via Email` sits directly above the radio group
`This entry is for: For me / For someone else`. Two controls, one decision. Session 1 read the second as a
system error. Also `Buyer-filled Guest QR` is internal jargon in user copy.

**Anchor** — `src/app/components/CheckoutPage.tsx`, the segmented control and the `This entry is for`
radio group.

**Change:**
- Keep **one** question: **"Who is this entry for?"** with three options:
  1. **Me** — helper: "Attaches to your Passport."
  2. **Someone else — I'll fill their details** — helper: "They'll get a QR code from you."
  3. **Someone else — they'll fill their own** — helper: "We'll email them a link."
- Remove the segmented control; derive the old `fillMethod` state from the selected option so downstream
  logic is untouched.
- Delete the string `Buyer-filled Guest QR` from user-facing copy.

**Accept:**
- `/checkout#demo` shows exactly one control answering who the entry is for.
- The three downstream paths (self / buyer-filled guest QR / email invite) still work — verify each
  produces the same state it did before.
- `Buyer-filled Guest QR` returns 0 hits in `src/app/`.

**Guard:** do not change the state machine's values, only how they are selected.

---

## Task 2.5 — Label the money and the team quantities on order cards

**Why:** `2× 42K Full Marathon … ₱1,595` — the figure is the **order total including fees** but reads as a
unit price. `1× Relay Team of 5` conflates one purchase with five people.

**Anchor A** — `src/app/pages/OrdersPage.tsx`, in `OrderCard`, the `{formatMoney(getOrderTotal(order))}` span.
**Anchor B** — `src/app/pages/OrdersPage.tsx`, `getItemSummary`.

**Change:**
- Prefix the amount with a `Total` label (small, muted, to the left of the figure).
- For team entries, render `{ticketTypeName} · {playerCount} players` and, when forms are outstanding,
  ` · {n} forms needed`.

**Accept:** on `/orders`, the amount is unambiguously labelled `Total`; team orders state their player
count.

---

## Task 2.6 — Give the urgent notification a CTA; fix stale dates

**Why:** "Action Required — complete the participant form … before July 5" has **no button**, while
"Leave a Review" has `Write Review`. Deadlines lack years and are in the past with no expired state
("Sales end June 15", "before July 5", "Event Tomorrow — City Half Marathon 2025").

**Anchor** — `src/app/pages/NotificationsPage.tsx`; `src/app/data/events.ts` (sales-end copy);
`src/app/components/EventDetailsPage.tsx` (the `Sales end …` line).

**Change:**
1. Every notification with an action-required semantic gets a CTA deep-linking to the relevant form.
2. All user-facing dates include the year.
3. If a sales-end or form deadline is in the past, render an **expired/closed** state and disable the
   related CTA rather than leaving it live.

**Accept:** no action-required notification lacks a CTA; no user-facing date omits the year; a past
sales-end date renders a closed state with a non-actionable CTA.

**Guard:** derive "past" from the data, not from a hardcoded today.

---

## Task 2.7 — Re-seed demo data that reads as bugs

**Why:** These cost real session time and generated findings that are not about the design.

**Change (data only, `src/app/data/**` and the order seeds in `OrdersPage.tsx`):**
1. Participant names/emails on the signed-in user's own entries: derive from the active profile instead of
   hardcoded `Jessica Williams` / `jessica@email.com`.
2. Checkout entry 1 category `Beginner Double Male - 15-30` under an ultramarathon, subtitled
   `Singles Entry` — replace with an event-appropriate category (e.g. `65K Ultramarathon · Solo`).
3. `"Dumaguete City Night Run - setup in progress"` — remove the state string from the title; express it as
   a badge.
4. Vary the uniform placeholder prices (five unrelated orders all at exactly ₱5,295; six at ₱1,595).
5. Reconcile event dates across surfaces — NUTRI-RUN 65 currently shows **Aug 6, 2026** on Home/Events but
   **Jul 4, 2026** in Cart and order `MNL-2026-001234`. Pick one and make all surfaces read it from the
   same source.
6. Reconcile year drift: `Canlaon Marathon 2025` (Inbox) vs `Canlaon Marathon 2026` (Orders).

**Accept:** `tests/event-date.test.mjs` and `tests/order-pricing.test.mjs` pass; the same event shows the
same date on `/events`, `/cart`, and its order detail.

**Guard:** keep the data volume (15 orders, 9 events) so list/pagination behaviour is still exercised.

---

## Task 2.8 — Remove internal tooling from user surfaces

**Anchor** — `src/app/components/SettingsPage.tsx`, the `PROTOTYPE` section rendering
`Passport Cases Board` / `All 34 registration & access scenarios`.

**Change:** render only when `import.meta.env.DEV` is true. Leave the `/passport-cases` route registered
so the board stays reachable by direct URL.

**Accept:** production build (`npm run build` + serve `dist/`) shows no `PROTOTYPE` section; dev server
still shows it.

---

# PHASE 3 — Navigation, layout, and access (P2/P3)

## Task 3.1 — Label the bottom navigation

**Why:** Five destinations, zero text labels (deliberate per `BottomNav.tsx:7`). Session 3 could not
identify a single tab. Additionally the Settings tab is the user's **avatar** while a separate `/profile`
route exists.

**Anchor** — `src/app/components/layout/BottomNav.tsx`.

**Change:**
- Add a text label under each icon: `Home`, `Events`, `Passport`, `Orders`, `Account`. 10px, medium, active
  in `#177564`, inactive in the existing inactive color. Keep the raised center Passport tile; put its
  label below the tile.
- Replace the avatar on the fifth tab with a settings/person icon, **or** rename the destination to
  `Account` and keep the avatar — pick one and make `aria-label`, `alt`, and the visible label agree.
- Keep the existing `aria-label`s; ensure they now match the visible text.
- Verify the bar still fits 375px without truncation, and that the existing
  `@media (prefers-reduced-motion: reduce)` block at `BottomNav.tsx:122` is preserved.

**Accept:** all five tabs show a legible label at 375px; visible label and `aria-label` match; nav height
increase is reflected in the scroll-padding fix of Task 3.2.

---

## Task 3.2 — Stop the floating chrome from covering the last row of content

**Why:** `BottomNav` occludes content on `/passport` (`Enter code` row), `/orders`, and `/orders/:id`
(`Payment summary` heading).

**Anchor** — the page-level scroll containers: `src/app/pages/PassportPage.tsx:773`
(`pb-[calc(118px+env(safe-area-inset-bottom))]`), `OrdersPage.tsx` (the `pb-[calc(7rem+env(...))]` value
asserted by `tests/orders-ui-consistency.test.mjs`), and `RootLayout.tsx`.

**Change:** define one shared value for "bottom chrome height" (nav height after Task 3.1 + safe area) and
apply it as bottom padding on every scroll container. Update the regex in
`tests/orders-ui-consistency.test.mjs` to match the new value.

**Accept:** at 375px on `/passport`, `/orders`, and `/orders/MNL-2026-001234`, scrolling to the bottom
leaves the last interactive row fully visible above the nav.

---

## Task 3.3 — Screen-reader grouping on list cards

**Why:** The order card is one `<button>` whose accessible name is built from all descendant text, so
adjacent numbers fuse — measured: `"…Dumaguete Futsal Cup Season 41× Team of 8₱5,295"` ("Season 4" +
"1×"). Session 6 had to listen to a full receipt to learn one status.

**Anchor A** — `src/app/pages/OrdersPage.tsx`, `OrderCard`'s root `<button>`.
**Anchor B** — `src/app/pages/PassportPage.tsx`, the decorative `PASSPORT HOLDER` text on the wallet graphic.

**Change:**
1. Give the `OrderCard` root an explicit `aria-label`:
   `` `${order.name}, ${state ? state.label : 'complete'}, total ${formatMoney(getOrderTotal(order))}` ``
   An explicit label replaces name-from-contents, which fixes the fusion definitively.
2. Ensure the ref/date/summary text nodes are not separately focusable (they are `<span>`/`<p>` — confirm
   no `tabIndex`).
3. Add `aria-hidden="true"` to the decorative `PASSPORT HOLDER` text and the wallet graphic's text layers.

**Accept:**
- The order card's computed accessible name contains no run-together digits and is under ~60 characters.
- `PASSPORT HOLDER` is not announced.

---

## Task 3.4 — Real tabs, and 44px targets

**Why:** Measured sub-44px targets against PRODUCT.md's own 44px standard: `Open notifications` 32×32,
`Open cart` 32×32, Orders filter pills 36px tall, `Go to home` 84×22. Filter pills are `<button>`s with no
`aria-selected` and no arrow-key support.

**Anchor A** — `src/app/components/layout/Header.tsx`, the `h-8 w-8` button class strings (4 occurrences).
**Anchor B** — `src/app/pages/OrdersPage.tsx`, the `tabs` array and its rendering.

**Change:**
1. Header buttons: keep the 32px **visual** circle, expand the **hit area** to 44×44 — wrap in a 44×44
   flex container, or add `before:absolute before:-inset-1.5 before:content-['']`. Do not enlarge the
   visible circle.
2. `Go to home`: give it a 44px-tall hit area.
3. Filter pills: `role="tablist"` on the container, `role="tab"` + `aria-selected` on each, arrow-key
   navigation (Left/Right moves selection), min-height 44px, and
   `aria-label={`${label}, ${badge} orders`}` so the count is not read as part of the word.

**Accept:**
- Every interactive element on `/orders` reports `>= 44` in both dimensions:
  ```js
  [...document.querySelectorAll('button,a[href]')].filter(b=>{const r=b.getBoundingClientRect();return r.width>0&&(r.width<44||r.height<44)}).length === 0
  ```
- Arrow keys move between filter tabs; `aria-selected` tracks the active tab.

---

## Task 3.5 — Truncation pass at 375px

**Why:** Eight measured truncation sites: events search placeholder (`Search events, sports, organ`), event
titles, venues (`Quezon Park, Dumague…`), cart item names, order item summaries, checkout entry titles,
and the Passport footer tab labels.

**Change:**
- Titles: two-line clamp (`line-clamp-2`) instead of single-line truncate wherever a title is currently
  clipped mid-word.
- Venues: render `Venue, City` and drop the province at mobile widths, rather than ellipsing.
- Search placeholder: shorten to `Search events or sports`.
- Re-verify the Passport tab labels from Task 1.6.

**Accept:** at 375px, no visible text on `/events`, `/events/1`, `/cart`, `/orders`, `/checkout#demo`
terminates in an ellipsis mid-word. Titles may wrap to two lines.

---

## Task 3.6 — Cart: explain the countdown, surface the fee

**Anchor** — `src/app/components/CartPage.tsx`.

**Change:**
1. The unlabeled amber countdowns (`23:59:19`, `02:59:53`) either get a label stating what expires
   (`Price held · 2:59:53`) or are removed. If the prototype has no real hold mechanic, **remove them** —
   unexplained urgency is worse than none.
2. Sticky total: append `incl. {fee} fee` beside the figure so the ~3% convenience fee is not a scroll-away
   surprise.

**Accept:** no unlabeled timer remains; the sticky total discloses the fee.

---

## Task 3.7 — Silent redirect on an invalid form URL

**Why:** `/orders/MNL-2026-001234/form` (an order ref where an entry id is expected) silently redirects to
`/orders` with no message. Session 5 could not tell whether the form had saved.

**Anchor** — `src/app/routes/ParticipantFormRoute.tsx`.

**Change:** when the param resolves to nothing, redirect as now **and** raise a `sonner` toast:
`"That form link is no longer valid. Open the order and choose Complete form."`

**Accept:** navigating to a bogus form URL lands on `/orders` with a visible toast.

---

# PHASE 4 — Structural (P3, larger)

## Task 4.1 — Remove the blank-page failure mode

**Why (measured):** every content block on `EventDetailsPage` starts at `opacity: 0`; `PassportPage`'s card
starts at `opacity: 0, scale: 0.15, y: 400`; `CartPage` enters from `translateX`. If `rAF` is starved the
page renders blank or displaced. This is what produced two false findings during the audit, and it is
reachable in production via backgrounded-then-restored tabs, low-power modes, and some in-app webviews.

**Change:** invert the pattern — render content **visible by default** and animate *from* visible, or gate
the reveal on CSS rather than a JS frame loop. Concretely: replace `initial="hidden"` variants with
`initial={false}` plus a CSS `@keyframes` reveal that has a visible end state, so a stalled animation
leaves content readable. Wrap the app in `<MotionConfig reducedMotion="user">` while you are here.

**Accept:** with JS animation frames suppressed (throttle rAF, or background the tab and reload), the
content of `/events/1`, `/passport`, and `/cart` is still readable and correctly positioned.

**Guard:** the animations should still play normally when frames are available.

---

## Task 4.2 — Passport card: fluid instead of fixed-390-downscaled

**Why — this is now the highest-value Passport fix.** Given that the QR is deliberately the *only*
functional element on the closed card (see Task 1.6), downscaling it is the one geometry problem that has
real consequences. The card is authored at a fixed `390×590` and multiplied by `holderScale` — `0.9` at
375px (`Math.min(1, (innerWidth - 24) / 390)`, `PlanOutPassportCard.tsx:186-188`) — so on the most common
phone width the app shrinks the thing a scanner has to read by 10%, and squeezes the footer tabs at the
same time. Every millimetre of QR is scan margin in poor light at a 5 AM gate.

**Anchor** — `src/app/components/PlanOutPassportCard.tsx`:
```
      const availableWidth = Math.max(280, viewportWidth - 24);
      setHolderScale(Math.min(1, availableWidth / holderDesignWidth));
```
and the `origin-top-left` wrapper applying `transform: scale(${holderScale})`.

**Change:** make the card fluid — `width: min(100% - 24px, 390px)` with internal proportions in relative
units — and remove the `holderScale` transform entirely. The QR must render at its current size or larger
at 375px, never smaller. If the QR can be made larger within the fluid layout, do so: it is the payload.

**Accept:**
- At 375px the rendered QR's bounding box is `>=` its current size. Measure before and after:
  ```js
  document.querySelector('svg[role="img"], canvas')?.getBoundingClientRect()
  ```
  (confirm the selector against the actual QR node first).
- At 390px and above the card is visually unchanged.
- No `transform: scale()` remains on the holder wrapper.
- The card face still shows no name or passport code.

**Depends on:** Task 1.6 (copy and eyebrow land first, so this commit is pure geometry).

---

## Task 4.3 — Team roster surface

**Why:** `1× Team of 8` with no way to see or manage the eight. Session 5 (the coach persona) abandoned this
goal entirely. Note `"Manage Roster"` was deliberately removed in a prior change — **do not simply restore
it**; check `docs/` and git history for the decision before designing.

**Change:** on the order/entry detail, list each player slot with its own form state and access path
(Passport / claim link / guest QR), plus a summary `n of m ready` (a progress affordance already exists near
`OrdersPage.tsx:1564`).

**Accept:** from a team order, every player slot is visible with an individual state and an action.

**Guard:** read the prior roster-removal rationale first; if this plan conflicts with a settled product
decision, stop and report rather than reverting it.

---

## Task 4.4 — Merge the two message centers

**Why:** `/notifications` (bell, unread 4) and `/settings/inbox` (unread 2, and `Inbox 2 + Archived 2 ≠ All 6`)
duplicate content, keep separate counts, and Notifications tells users to "View in Inbox" — a two-hop
journey for one message. Inbox also teaches `Swipe left to archive` next to a visible `Archive` button.

**Change:** one message surface with one unread count. If both routes must survive, make Notifications a
pure pointer with **no** separate badge, and reconcile the Inbox tab counts so they add up. Remove the
redundant swipe instruction.

**Accept:** one unread count in the UI; Inbox tab counts reconcile; no "View in Inbox" hop.

---

## Task 4.5 — Guest QR: offline reassurance

**Why:** `PublicGuestEntryPage` is the strongest screen in the app, but says nothing about working at a 5 AM
gate with no signal.

**Change:** add a line confirming offline availability (only if true — verify before claiming it) and a
save-to-wallet/screenshot affordance.

**Accept:** the page states its offline behaviour truthfully.

**Guard:** **do not restyle this page.** It is the design reference for the Passport work. Additive only.

---

# Commit and PR structure

| PR | Contents | Gate |
|---|---|---|
| **PR 1 — Action states are explicit** | Tasks 1.1 – 1.9 | `npm run build` + `node --test tests/` + manual 375px pass on `/orders`, `/orders/:id`, `/passport`, `/checkout#demo` |
| **PR 2 — Language and truth** | Tasks 2.1 – 2.8 | new `tests/terminology.test.mjs` green |
| **PR 3 — Navigation and access** | Tasks 3.1 – 3.7 | 44px sweep returns 0; arrow-key tabs work |
| **PR 4 — Structural** | Tasks 4.1 – 4.5, one commit each | rAF-starved render check passes |

One commit per task. Message format:

```
fix(orders): move status pill out of folder graphic

Forms needed rendered at 8px / 2.34:1 contrast inside the card artwork.
Moves the pill into the text column at 11px with opaque fills at >=4.5:1.

Task 1.1 of docs/ux-test-results/planout-ux-fix-plan.md
```

---

# Open questions — ask, do not assume

1. **Task 2.3:** should an unnamed required document block submission, or stay optional? Product decision.
2. **Task 3.1:** replace the avatar tab with an icon, or rename the destination to `Account`? Brand call.
3. **Task 4.3:** the roster surface may conflict with the earlier decision to remove `Manage Roster`.
   Confirm intent before building.
4. **Task 4.4:** are Notifications and Inbox meant to be architecturally distinct (transactional vs
   relational messaging)? If so, the fix is disclosure, not a merge.
5. **Task 1.3:** `getActionRequiredCount()` and `passportPendingSummary.pendingCount` disagree (8 vs 6) on
   the same data. Which definition is correct is a product question; the plan unifies the plumbing but
   someone must pick the semantics.

---

# Out of scope — settled decisions, do not "fix" these

- **The closed Passport card hides the holder's name and passport code. This is intentional.** Only the QR
  is needed to scan, and concealing identity is a privacy measure for a credential held up in public.
  Identity is available by opening the card. Task 1.6 adds copy explaining this; **no task may surface
  name or code on the closed card.** If something in this plan appears to ask for that, it is a stale
  instruction — stop and ask.
- Visual redesign of `PublicGuestEntryPage` (it is the reference, not a target).
- The leather-wallet aesthetic on `/passport` — the audit faults the *empty-looking pocket* and the missing
  explanation, not the metaphor.
- `src/imports/**` (generated), `PassportCasesPage*.tsx` (internal board).
- `AGENTS.md` has been overwritten with a `claude-mem` context block and no longer contains repo
  instructions. Restoring it from git history is unrelated to this plan but should be done before an agent
  relies on it for conventions.
