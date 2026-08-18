# PlanOut Prototype — Virtual User Testing
**Date:** 2026-08-06 · **Sessions:** 7 · **Viewport:** 375×812 (mobile) · **Build:** local dev (Vite, port 5173)

## Method & honesty notes

Sessions were run against the **live app**, not a description of it. UXD walked every primary route
(`/`, `/login`, `/events`, `/events/:id`, `/cart`, `/checkout`, `/orders`, `/orders/:id`,
`/orders/:id/form`, `/passport`, `/guest-entry/:ref`, `/settings`, `/settings/inbox`, `/notifications`),
and MCE's screen descriptions come from actual rendered text, DOM geometry, and computed styles.

Two things to be explicit about:

1. **Measured, not guessed.** Contrast ratios, font sizes, touch-target sizes, accessible-name strings,
   and badge counts in this report were read off the running app. They are cited inline.
2. **One artifact ruled out.** Several pages first appeared blank because the test browser tab was
   backgrounded (`document.visibilityState === 'hidden'`), which freezes `requestAnimationFrame` and
   strands Framer Motion entrance animations at `opacity: 0`. That is a **harness artifact, not a
   product bug**, and it was normalized before evaluation. The related *real* risk is recorded once, as
   C-7 — not repeated as a user-facing failure.

---

## Session 1: Marisol Ferrer

**Persona:** 45, operations manager at a logistics firm, tech comfort 3
**Goal:** Register herself and a colleague for the NUTRI-RUN 65 before the company wellness deadline
**Mode:** Primary workflow — discovery → cart → checkout → participant forms

### Journey
1. `HomePage` → reads hero "Your next sports event, organized in one place." → "One QR at check-in after registration." → *"Okay, one QR. That's the pitch. I like that."*
2. Taps `EventCard` (featured) → `EventDetailsPage` → sees **"From ₱950 / Get Tickets" twice on one screen** — once inline, once in the sticky footer bar → *"Which one do I press? Are these different tiers?"*
3. Reads price block → **"Sales end June 15"** → *"June 15? It's August. Did I miss it? But the button still works…"*
4. Scrolls for the date → the green **`FloatCard`** ("6 FORMS NEED YOUR ATTENTION / Finish Forms") is parked over the date-and-venue row → *"Something's covering the part I need. And what forms? I haven't registered yet."*
5. Taps `Get Tickets` → `GetTicketsModal` → picks 65K Ultramarathon Entry (Solo) → adds to cart
6. `CartPage` → sees **`23:59:19` countdown** in amber on the entry, **`02:59:53`** on a second item → *"Two different timers. Do I lose the cheaper one in three hours?"*
7. Scrolls: `Subtotal ₱3,249.00` · `Convenience Fee ₱97.47` · `Total ₱3,346.47` → *"A fee. It's not in the button total until I scroll."*
8. `Proceed to Checkout` → pays → lands on **"Complete participant details 1/3"**
9. Entry 1 card reads **"Beginner Double Male - 15-30"** under NUTRI-RUN 65, subtitle **"Singles Entry"**, badge **"Ready"** → *"Beginner Double Male? I signed up for a 65K run. And it says Ready — ready for what? I haven't typed anything."*
10. Sees `Fill Details Myself | Invite via Email` segmented control, then directly below **"This entry is for: For me / For someone else — Buyer-filled Guest QR"** → *"I already said I'd fill it myself. Now it's asking again?"*
11. Reaches **"Required document — Upload the file requested by the organizer, such as a waiver, medical certificate, or ID."** → *"Which one? I can't upload 'or'."* → skips it
12. Taps **"Fill up later"** → *"Fill up? Like petrol?"*

### Friction Points
- **`EventDetailsPage` price block**: `Get Tickets` + price duplicated inline and in sticky bar. | Severity: **M** | Fix: drop the inline pair; let the sticky bar own the CTA and give the space to date/venue.
- **`FloatCard`**: non-dismissible fixed overlay, shown on every route except orders/passport/form paths (`FloatCard.tsx:25-35`), occludes mid-page content. No close affordance. | Severity: **H** | Fix: make it dismissible per session, or collapse it into the `BottomNav` Orders badge.
- **"Required document" field**: names no specific document. | Severity: **H** | Fix: organizer supplies the document name and an example; render "Waiver (PDF)" not a list of maybes.
- **`Ready` badge on an unfilled form**: state label contradicts the form beneath it. | Severity: **H** | Fix: `Needs details` until required fields validate.
- **Two overlapping who-is-this-for controls**: segmented (`Fill Details Myself`/`Invite via Email`) + radio (`For me`/`For someone else`). | Severity: **H** | Fix: one control. Pick "Who is this entry for?" and derive the fill method from the answer.
- **Cart countdowns**: unlabeled, per-item, different durations, no stated consequence. | Severity: **M** | Fix: label it ("Price held for 2:59") or remove.
- **Fee revealed only on scroll**: sticky total includes a 3% convenience fee not shown near the button. | Severity: **M** | Fix: `₱3,346.47 · incl. ₱97.47 fee` in the sticky bar.
- **"Sales end June 15"**: past date, no year, CTA still live. | Severity: **M** | Fix: derive from event data; show `Sales closed` state.
- **"Fill up later" / "Fill up"**: not idiomatic for forms. | Severity: **L** | Fix: "Finish later" / "Complete form".

### Delights
- Participant form **pre-filled name, email, and phone** from the profile — she noticed and relaxed.
- "One QR at check-in after registration" set a clear expectation in one line.
- Cart grouped items **under their event**, so she could see what belonged to what.

### Outcome
**Partial** — paid, but left forms unfinished. *"I've given them money and I still don't know if I'm registered. And I never found out what document they want."*

---

## Session 2: Dev Ramasubramanian

**Persona:** 28, backend engineer, tech comfort 5
**Goal:** Ten-minute audit — "is my stuff sorted, and what still needs me?"
**Mode:** Power user, fast scanning, trusts numbers over prose

### Journey
1. Opens app on `/` → immediately reads badges: **bell `4`**, **cart `3`**, **nav bag `8`** → *"Eight what?"*
2. Taps `BottomNav` bag → `OrdersPage` → tabs read **All 15 · Pending 5 · Complete 10** → *"Hold on. The badge said 8, this says 5 pending."*
3. Scrolls → sees the `FloatCard` on a prior screen said **6 forms** → *"Four different numbers for 'stuff I owe you': 4, 5, 6, 8. Which one is real?"*
4. Scans order cards → status pills sit **inside the folder illustration** at **8px, bold** → leans in → *"I literally cannot read the status without zooming."*
5. Notices **five orders have no pill at all** (GEAR-2026-001982, LPT-2026-003456, VMS-2026-004400, PGA-2026-005678, RFN-2026-000341) → *"Is blank 'done' or 'unknown'?"*
6. Reads a card: `2× 42K Full Marathon` … `₱1,595` → *"Is that each or the total? …And why are five different orders all exactly ₱5,295?"*
7. Opens `MNL-2026-001234` → three entries, all named **"(Jessica Williams)"** → *"That's not me. Whose account am I in?"*
8. Sees `Ready for gate - staff scans your universal QR.` next to a filled green **`View QR`**, and the one entry that needs work gets an outline **`Fill up`** → *"The done thing shouts, the to-do thing whispers. That's backwards."*
9. Taps `Download receipt` → checks `Payment summary` math: 3 × ₱1,500 = ₱4,500 + ₱285 = ₱4,785 ✓ → *"Okay, the arithmetic is fine. It's the labels that are lying."*
10. Hits `/passport` → silver card with a QR, tucked into a leather holder, **empty pocket** beneath it → *"Where's the rest of it? No name, no code — just 'UNIVERSAL PASS' and a QR."*

### Friction Points
- **Four disagreeing pending counts**: `ticketActionCount` (nav badge, 8), `passportPendingCount` (`FloatCard`, 6), Orders `Pending` tab (5), notification bell (4). Two separate context getters (`AppContext.tsx:985-986`). | Severity: **H** | Fix: one derived `actionRequiredCount` selector, consumed everywhere.
- **Status pill = 8px type at 2.34:1 contrast** ("Forms needed", `#5b461e` on `oklab(0.879…)`); "Ready for gate" 8px at 2.59:1. WCAG AA needs 4.5:1. | Severity: **H** | Fix: move the pill out of the illustration; 12px minimum; darken to ≥4.5:1.
- **Absent pill as implicit state**: no-badge orders are indistinguishable from unrendered state. | Severity: **M** | Fix: always render a state, including `Complete`.
- **Unlabeled money on order cards**: figure is order total incl. fees but reads as a unit price beside `2×`. | Severity: **M** | Fix: prefix `Total`.
- **Inverted CTA hierarchy in `OrderDetailBlocks`**: primary-filled `View QR` on settled entries, secondary-outline `Fill up` on action-required entries. | Severity: **H** | Fix: swap — action-required gets the filled button.
- **`/passport` first paint is empty**: card container starts ~800px down the document; card is `w-[390px]` inside a 375px viewport at `scale(0.9)`. | Severity: **H** | Fix: fluid width (`min(100vw-32px, 390px)`); card in first viewport.

### Delights
- Payment summary math checked out, and the fee line was itemized.
- `formatMoney` + monospace order refs made scanning quick.
- Tab counts on Orders (once trusted) are the right control in the right place.

### Outcome
**Completed with distrust** — *"I found everything. I don't believe any of the numbers. Pick one source of truth and delete the other three."*

---

## Session 3: Loreto Villanueva

**Persona:** 67, retired schoolteacher, walks a 5K with her grandson, tech comfort 2
**Goal:** Check that the run she was signed up for is "in the phone" and see what she must bring
**Mode:** Basic, unhurried, reads everything, afraid of breaking things

### Journey
1. Opens app → `HomePage` → *"'320+ EVENTS, 48K ATHLETES.' That's nice, but where is mine?"*
2. Looks at `BottomNav`: five icons, **no words** → *"A house, a calendar, a shiny square, a bag, and a little photograph of somebody. I don't know which is mine."*
3. Guesses the shiny center square (`IdCard` icon, animated mesh tile) → `/passport` → silver card half-tucked into a brown leather holder → *"Oh, that's pretty. Is that my ticket?"*
4. Below it, a **pocket labelled `PASSPORT HOLDER` that looks empty** → *"But that part's empty. So I'm not registered?"*
5. Reads the card face: **`UNIVERSAL PASS`** → *"Universal pass. Is that the same as the passport? The other page called it a passport."*
6. Sees no name or code on the card face (hidden by design, for privacy) → *"How will the man at the gate know it's me?"* — a question the screen never answers
8. Sees three bright tabs: **pink `Events`, blue `Save`, yellow `Reset QR`**, labels half-covered by the pocket → *"'Reset QR.' If I press that does my ticket disappear? I'm not touching it."*
9. Taps `Events` tab → `/passport/events`
10. Returns, finds `Add a past event — Scan QR / Enter code`, then **"Claimed events will appear here."** → *"So it IS empty. But I paid."*
11. Bottom nav floats over the `Enter code` row → *"The bar is sitting on top of the words."*
12. Gives up, calls her grandson

### Friction Points
- **Icon-only `BottomNav`** (comment at `BottomNav.tsx:7`: "label-less active indicators"). Five destinations, zero text. | Severity: **H** | Fix: add text labels. This is the app's whole IA; 375px has room for five 2-line labels.
- **Avatar tab = Settings** (`aria-label="Settings"`, `alt="Settings"`) while a separate `/profile` exists. A face reads as "me", not "settings". | Severity: **M** | Fix: gear icon for Settings, or rename the destination "Account".
- **The wallet pocket reads as empty**, so the page's dominant message is "you have nothing" even though the pass is right above it. | Severity: **H** | Fix: the pass is the subject; the wallet is decoration. Don't render a prominent empty container.
- **Nothing states that the QR alone is sufficient at the gate.** The name and code are hidden on purpose (privacy — see UI issue #4), but with no reassurance the user reads the blank card face as incomplete. | Severity: **H** | Fix: one line under the card — "Staff scan this QR. Your name stays private." Do **not** reveal the name or code.
- **Five names for one concept**: "PlanOut Passport", "Passport", "UNIVERSAL PASS", "universal QR", "PASSPORT HOLDER". | Severity: **H** | Fix: one name — Passport — everywhere, including the card face.
- **`Reset QR` at equal weight to `Save` and `Events`**, unexplained, destructive-sounding. | Severity: **H** | Fix: move into a menu; add "Your old QR stops working" confirm copy.
- **Candy-colored tabs** (hot pink / cyan / yellow) against a restrained emerald brand, labels clipped by the pocket. | Severity: **M** | Fix: tokenized neutrals; don't clip labels.
- **`BottomNav` occludes the last content row** on `/passport`, `/orders`, `/orders/:id`. | Severity: **M** | Fix: bottom padding = nav height + safe-area on scroll containers.
- **"Claimed events will appear here."** contradicts having 15 orders; Orders↔Passport relationship never explained. | Severity: **H** | Fix: state it — "Your registrations already work with this QR. This section is only for adding past events."

### Delights
- Once found, the silver card with the large QR read as **valuable and official** — exactly the intent.
- "Show this to staff at the gate" phrasing (seen later) was the clearest sentence she read.

### Outcome
**Abandoned** — *"I think my ticket is in there somewhere, but the pocket looks empty and I'm afraid to press the yellow one."*

---

## Session 4: Aya Bituin

**Persona:** 19, university student, first PlanOut visit, tech comfort 4
**Goal:** Friends invited her to a night run; find it, see the cost, decide
**Mode:** First-time discovery, explores everything, low patience for jargon

### Journey
1. `/login` → segmented `Email | Phone`, then `Continue` (disabled, gray) → *"Nice, no password."* → enters email → OTP
2. `HomePage` → taps sport chips `Running` → likes the instant filter
3. `/events` → search placeholder truncated to **"Search events, sports, organ"** → *"Organ?"*
4. Event titles clipped: **"NegOr50•50 Series 2: NUTRI-…"**, venues clipped: **"Quezon Park, Dumague…"**, **"Grand Arena, Quezon C…"** → *"Everything's cut off. I can't tell these apart."*
5. `FloatCard` covers the third event card entirely → *"There's an event under there. I can't read it and I can't move this."*
6. Notices the **↗ arrow** on each card → *"Does that open another app?"*
7. Opens an event → reads `Running · Ultramarathon · Outdoor` chips → taps one → nothing happens → *"They look like filters but they're decoration."*
8. Reads About copy: *"Complete your registration early so your PlanOut passport is ready at the gate."* (lowercase "passport" here, capital elsewhere)
9. Date row: **"Thursday, Aug 6, 2026"** in bold sans, **"5:00 AM"** in gray monospace → *"Why is the time in a different font? It looks disabled."*
10. `Rating · 4.8 ★` → *"The word 'Rating' is doing nothing."*
11. Goes to `/notifications` out of curiosity → reads **"The organiser of Bay Aquathlon…"** then **"Organizer Invitation"** two rows down → *"organiser, organizer. Pick one."*
12. Sees **"Action Required — complete the participant form … before July 5"** with **no button**, while "Leave a Review" has `Write Review` → *"The urgent one is the only one I can't act on. And July 5 already passed."*
13. Opens `/settings/inbox` → **`Inbox 2 | Archived 2`** above **`All 6 | Invites 2 | Promotions 2 | Updates 2`** → *"Inbox is 2 but All is 6? Where do the other four live?"*
14. Sees **"Swipe left to archive"** next to a visible `Archive` button on every row → *"Why teach me a swipe for a button that's right there?"*

### Friction Points
- **Systemic truncation** at 375px: search placeholder, event titles, venues, cart item names, order item summaries, checkout entry titles. | Severity: **H** | Fix: two-line clamp for titles; shorten venue to `Venue, City`; widen search.
- **`FloatCard` covers a whole event card** in the list. | Severity: **H** | Fix: same as Session 1 — dismissible or merged into the nav badge.
- **Decorative chips look interactive**. | Severity: **M** | Fix: make them real filters or restyle as flat labels.
- **Date/time typography split** — bold sans date + gray monospace time reads as disabled. | Severity: **M** | Fix: one type treatment for the whole datetime.
- **`organiser` vs `organizer`** in adjacent rows and across Home vs Event pages. | Severity: **M** | Fix: pick one locale (PH English → "organizer") and lint for it.
- **"Action Required" notification has no CTA** while lower-priority ones do. | Severity: **H** | Fix: every action-required notification deep-links to the form.
- **Past deadlines with no year, no expired state** ("before July 5", "Sales end June 15", "Event Tomorrow / City Half Marathon 2025"). | Severity: **M** | Fix: absolute dates with year; render an expired state.
- **Inbox counts don't reconcile** (Inbox 2 + Archived 2 ≠ All 6); two tab rows compete. | Severity: **M** | Fix: one tab row; make counts consistent.
- **"Swipe left to archive"** duplicates a visible button. | Severity: **L** | Fix: drop the instruction.
- **Notifications and Inbox are two message centers** with separate unread counts, and Notifications says "View in Inbox". | Severity: **H** | Fix: merge, or make Notifications a pure pointer with no separate count.
- **`↗` affordance** unclear. | Severity: **L** | Fix: chevron, or nothing — the card is already tappable.

### Delights
- **Passwordless email → OTP** login felt modern and fast.
- Sport chips on Home filtered **instantly** — her favorite moment.
- "Good to know" block (refund policy, entry requirements) answered questions before she asked.

### Outcome
**Completed browsing, didn't register** — *"The events look real and the login was painless. But half the words are cut off and the app keeps telling me about forms for events I never signed up for."*

---

## Session 5: Coach Ruben Alcantara

**Persona:** 52, club coach and event organizer, manages team entries, tech comfort 4
**Goal:** Confirm his relay team's forms are done and get gate access sorted for a player without the app
**Mode:** Advanced — team entries, guest QR, organizer surfaces

### Journey
1. `/orders` → finds `CCR-2026-006204 · Cebu Coastal Relay · 1× Relay Team of 5` with `Forms needed` → *"One times relay team of five. So is that one form or five?"*
2. Opens `FUT-2026-002390 · Dumaguete Futsal Cup · 1× Team of 8` → looks for a roster view → *"Where do I see my eight players?"*
3. Spots `DNR-2026-008511 · **Dumaguete City Night Run - setup in progress**` → *"That's… part of the event name? Is 'setup in progress' the venue?"*
4. Opens a form entry → `/orders/tkt-001/form` → panel reads **`Completed Information` · `Complete`** with Name/Email, and the footer reads **"You'll be notified once the attendee completes the form."** → *"It says complete and it says waiting. Which is it?"*
5. Form contains only **Name and Email** for a 65K ultramarathon → *"No emergency contact? No medical? For a 65K?"* — yet checkout demanded a "Required document"
6. Types a stale form URL from a colleague's message → **silently dumped back to `/orders`**, no message → *"Did it work? Did it save? Nothing told me anything."*
7. Goes to generate access for his app-less player → `/guest-entry/GE-TEMP-4021` → **the best screen he's seen**: name large, big QR, `42K Full Marathon`, `June 27, 2026 at 5:00 AM · Main Gate`, `One-time use - Valid June 27, 2026`, `Forms completed by Jessica Sanchez`, **"Show this to staff at Main Gate"**, plus "No account is needed to use this QR." → *"THIS. Why isn't my own passport this clear?"*
8. Notices nothing about offline → *"The gate has no signal at 5 AM. Does this work without data?"*
9. `/settings` → sees **`Switch to Manila Running Club`** at top AND a full `ORGANIZATIONS` list with per-row `Switch` → *"Two switchers."*
10. `Urban Fitness Team` shows **`Under Review`** and **`Pending`** on the same row → *"Two words, one state."*
11. Reads **`Create Organization` / "Apply to become an event organizer"** → *"Create or apply? Those are different promises."*
12. Sees **`PROTOTYPE — Passport Cases Board — All 34 registration & access scenarios`** in his settings → *"Why can I see the developers' test board?"*

### Friction Points
- **Team entries give no roster surface from Orders**: `1× Team of 8` with no way to see or manage the eight. | Severity: **H** | Fix: roster section on the order/entry with per-player form + access state.
- **Ambiguous team quantities**: `1× Relay Team of 5` — one purchase, five people, one number. | Severity: **M** | Fix: `Relay Team · 5 players · 3 forms outstanding`.
- **`FormDiffPage`/form-details contradiction**: `Complete` badge above "You'll be notified once the attendee completes the form." | Severity: **H** | Fix: render the waiting line only when state is pending.
- **Thin organizer form vs "Required document" at checkout**: Name + Email only for a 65K. | Severity: **M** | Fix: align the post-purchase form with what checkout demanded.
- **Silent redirect on an invalid `orders/:ticketId/form` URL** → lands on `/orders` with no explanation. | Severity: **M** | Fix: "That form link is no longer valid" toast, or a proper not-found state.
- **Data leaking into names**: `"Dumaguete City Night Run - setup in progress"` — a state string concatenated into the event title. | Severity: **M** | Fix: state belongs in a badge, not the title.
- **Guest QR has no offline story** for a 5 AM gate. | Severity: **M** | Fix: "Works offline — saved on this device", plus Save to Wallet.
- **Duplicate org switchers** in `/settings`. | Severity: **L** | Fix: keep the list; drop the top shortcut.
- **`Under Review` + `Pending` on one row**; **`Create` vs `Apply`** mismatch. | Severity: **L** | Fix: one term per state; rename to "Apply to organize".
- **Internal `PROTOTYPE` section exposed** to end users. | Severity: **M** | Fix: gate behind a dev flag.
- **Hardcoded `Jessica Williams` / `jessica@email.com`** on the signed-in user's own entries. | Severity: **M** (content) | Fix: seed from the active profile.

### Delights
- **`PublicGuestEntryPage` is the strongest screen in the app** — one job, done cleanly: name, QR, gate, instruction, reassurance.
- "Forms completed by Jessica Sanchez" told the guest exactly why they don't have paperwork to do.
- Payment ledger / receipt download is where an organizer expects it.

### Outcome
**Partial** — got guest access sorted, gave up on the team roster. *"Your no-account guest page is better than your logged-in passport. Copy that page's clarity into the rest of the app."*

---

## Session 6: Thandiwe Mokoena — VoiceOver

**Persona:** 34, policy analyst, blind, expert VoiceOver user, tech comfort 5
**Goal:** Confirm which orders need action, then reach her Passport QR
**Mode:** Screen reader, swipe navigation, no vision of layout

### Journey
1. Lands on `/orders` → landmarks announce `banner`, `navigation`, `main`, one `h1` → *"Good, there's structure."*
2. Swipes into the order list → first card announces as a single run-on string:
   **"Forms neededFUT-2026-002390Feb 13, 2026Dumaguete Futsal Cup Season 41× Team of 8₱5,295, button"**
   → *"'Season 41 times Team of 8.' The event is Season 4 and the quantity is 1. Those numbers just fused."*
3. Every card is one giant button with a 70–90 character concatenated name → *"I can't skim. I have to listen to the whole receipt to learn one status."*
4. Reaches the `FloatCard` → announces as one button containing eyebrow + body + the word "Finish Forms" → *"Is 'Finish Forms' a separate button inside this button? I can't tell, and I can't dismiss it."*
5. Swipes the filter tabs → `"All15"`, `"Pending5"`, `"Complete10"` → *"No 'selected' state announced, and the label and count run together."*
6. Header controls announce cleanly: `"Open notifications"`, `"Open cart"`, `"Go to home"` → *"These were done properly."*
7. `BottomNav` announces `Home`, `Events`, `Open Passport`, `Orders`, `Settings` → *"Also correct. Thank you."*
8. Activates `Open Passport` → `/passport` → hears `"Kenan's Passport"`, then **`"UNIVERSAL PASS"`, `"KENAN AIAH"`, `"PO-7K2M-9XQA"`, `"Events"`, `"Save"`, `"Reset QR"`, `"PASSPORT HOLDER"`** → *"What is a PASSPORT HOLDER? Is that a heading, a button, my role?"* (it's decorative text on the wallet graphic)
9. Hits `"Reset QR"` in the swipe order with no description → *"I'm not activating an unexplained 'Reset' on my only means of entry."*
10. Reaches `"Claimed events will appear here."` → *"So my passport is empty? I have fifteen orders."*

### Friction Points
- **Order cards are single buttons with concatenated accessible names** — adjacent numbers merge ("Season 4" + "1×" → "Season 41×"). Measured on the live page. | Severity: **H** | Fix: card is a link with a concise name (`"Dumaguete Futsal Cup Season 4, forms needed"`); expose ref/date/total as separate non-focusable text; add `aria-hidden` to redundant bits.
- **Status conveyed by a low-contrast pill inside an illustration** — the same failure hurts low-vision users at 8px / 2.34:1. | Severity: **H** | Fix: as C-1 below.
- **Filter tabs lack selected state** and merge label+count. | Severity: **M** | Fix: `role="tab"` + `aria-selected`, `aria-label="Pending, 5 orders"`.
- **`FloatCard` is a button containing a button-styled div** — nested interactive semantics, no dismiss control, appears on nearly every route. | Severity: **H** | Fix: one real button; add a labelled dismiss.
- **Decorative wallet text (`PASSPORT HOLDER`) is announced** as content. | Severity: **M** | Fix: `aria-hidden="true"` on the graphic's text.
- **`Reset QR` has no accessible description** of consequence. | Severity: **H** | Fix: `aria-describedby` + confirm dialog stating the old QR stops working.
- **`Save` is unlabeled as to target** ("Save" — where?). | Severity: **M** | Fix: "Save to Apple Wallet".

### Delights
- **Header and BottomNav `aria-label`s are correct and specific** — `"Open notifications"`, `"Open Passport"`. Genuinely good work.
- **Zero unnamed interactive controls** on `/orders` (34 buttons/links audited, 0 missing names).
- Landmark structure (`header`/`nav`/`main`) and a single `h1` per page.

### Outcome
**Partial** — determined which orders needed action, but only by listening to full receipts. *"Your labels are good. Your grouping is not. Stop wrapping whole cards in one button."*

---

## Session 7: Yusuf Karadeniz — keyboard only

**Persona:** 41, data journalist with RSI, keyboard-only, tech comfort 5
**Goal:** Get from a "forms needed" order to a submitted form without touching a pointer
**Mode:** Tab / Shift-Tab / Enter, expects visible focus and predictable order

### Journey
1. `/orders`, presses `Tab` → focus moves but **no visible ring** on the header buttons → *"Where am I? I'm flying blind."*
2. Tabs through `Go to home`, `Open notifications`, `Open cart` — all `outline: none`, no `focus-visible` utilities in `Header.tsx` (0 occurrences) → *"Three stops I can't see."*
3. Reaches the filter tabs → focus invisible, and arrow keys do nothing (they're buttons, not a tablist) → *"I have to Tab through All, Pending, Complete instead of arrowing."*
4. Tabs into the order list → **15 stops, one per card**, no skip link → *"To reach the bottom of my orders I press Tab about twenty times."*
5. Enters `FUT-2026-002390` → `OrderDetailPage` → focus lands at document top, not on the heading → *"No focus management on route change. I've lost my place."*
6. Tabs to the entry actions → `Fill up` is reachable; ring visibility is inconsistent (`PrimaryButton`/`SecondaryButton` each carry one `focus-visible` rule; `EventCard` and `CartPage` carry none)
7. Enters the participant form → tabs fields → sticky stepper header **covers the field above the one he's typing in** (observed: "Last name" clipped behind the sticky card) → *"My focused field is under the header."*
8. Reaches `Upload document` → a `+` tile; activates with Enter → OS dialog → returns → focus lost
9. Submits with `Save details and continue` → *"That worked. But `Fill up later` is the same size and shape right beneath it — one stray Tab+Enter and I've bailed out of the form I just filled."*
10. Tries `Esc` on the `FloatCard` → nothing; it isn't dismissible by any means

### Friction Points
- **No visible focus indicator on many controls**: `outline: none` throughout; `focus-visible` styling present in only **25 of 143** component files; `Header.tsx`, `EventCard.tsx`, `CartPage.tsx` have **none**. PRODUCT.md explicitly targets "visible keyboard focus". | Severity: **H** | Fix: one global `:focus-visible` token (2px ring + offset) applied at the base layer, not per component.
- **No focus management on route change** — focus resets to document top instead of the new page heading. | Severity: **H** | Fix: move focus to the `h1` (or a route-change live region) on navigation.
- **Filter tabs are buttons, not a tablist** — no arrow-key navigation. | Severity: **M** | Fix: `role="tablist"`/`role="tab"` with arrow-key handling.
- **15 sequential card stops, no skip link / no "skip to content"**. | Severity: **M** | Fix: skip link; group the list with a heading and a landmark.
- **Sticky stepper occludes the focused field** in the participant form. | Severity: **H** | Fix: `scroll-margin-top` equal to sticky header height on all inputs.
- **Destructive-adjacent secondary (`Fill up later`) is visually equal to the submit** and immediately after it in tab order. | Severity: **M** | Fix: de-emphasize to a text link and move it above or well away from the submit.
- **Focus lost after file dialog**. | Severity: **L** | Fix: return focus to the upload control.
- **`FloatCard` cannot be dismissed by keyboard** (or at all). | Severity: **H** | Fix: dismiss button in tab order, `Esc` support.

### Delights
- **Tab order is logical and DOM order matches visual order** — no traps, no reversed sequences.
- `BottomNav` does carry `focus-visible:ring` styles — the pattern exists in the codebase, it just isn't applied globally.
- All controls are real `<button>`/`<a>` elements, so Enter/Space work as expected.

### Outcome
**Completed, slowly** — *"Nothing is broken, but I did it by memory and luck. Add one focus ring token and manage focus on navigation and I'd be fine."*

---

# UX Test Synthesis Report

## UI Issues (priority ranked)

1. **Action-required state is the least legible thing in the app** — 6/7 sessions
   Widgets: `OrdersPage` status pill, `OrderDetailBlocks` CTAs, `CheckoutPage` `Ready` badge
   Measured: `Forms needed` = **8px bold, 2.34:1**; `Ready for gate` = **8px bold, 2.59:1**; both inside a decorative folder illustration. WCAG AA requires 4.5:1. Meanwhile settled entries get the filled primary button and action-required entries get an outline button.
   Fix: pill out of the illustration, ≥12px, ≥4.5:1; filled primary on action-required, quiet on settled.

2. **Four different counts for "what you owe"** — 4/7 sessions
   Widgets: `BottomNav` bag badge (**8**), `FloatCard` (**6**), `OrdersPage` Pending tab (**5**), header bell (**4**)
   Source: `ticketActionCount` vs `passportPendingCount` (`AppContext.tsx:985-986`) vs page-local math vs notification unread.
   Fix: one derived selector consumed by every surface.

3. **`FloatCard` is an undismissable overlay that covers content** — 5/7 sessions
   Shown on all routes except orders/passport/form paths (`FloatCard.tsx:25-35`); no close control; observed covering an entire event card on `/events` and the date/venue row on `/events/:id`. With `BottomNav` it consumes ~190px (~23%) of an 812px screen.
   Fix: dismissible per session, or fold into the Orders badge.

4. **The Passport page never explains that the QR alone is enough** — 3/7 sessions
   Widgets: `PlanOutPassportCard`, `PassportPage`

   **Design intent (confirmed by the product owner):** in the closed state the holder deliberately covers
   the card's lower half. Only the QR is needed to scan, and hiding the name and passport code is a
   **privacy measure** — the card is held up in public at a gate. Identity is available on demand by
   opening the card. *This is correct behaviour and must not be "fixed".*

   What the sessions actually hit is that the screen never says so. Three users concluded something was
   wrong or missing:
   - The pocket graphic labelled `PASSPORT HOLDER` **reads as an empty container**, so the page's dominant
     message is "you have nothing" (Session 3 abandoned partly on this).
   - "Claimed events will appear here." is shown to an account holding **15 orders**, with the
     Orders↔Passport relationship never stated.
   - Session 3's question — *"How will the man at the gate know it's me?"* — has a good answer under the
     privacy design (the scan resolves identity), but nothing on the screen gives it.
   - The card is authored at a fixed `390×590` and downscaled to `0.9` at 375px (`holderScale`,
     `PlanOutPassportCard.tsx:186-188`). Since **the QR is the only functional element**, shrinking it is
     the one geometry issue that matters. The same scale clips the footer tab labels.

   Fix: one line of reassurance that the QR is all staff need; don't render a prominent empty pocket;
   explain Orders↔Passport; stop downscaling the QR.

   *Correction: an earlier draft of this report claimed (a) the page renders blank on first paint with the
   card ~800px down the document, and (b) the hidden name and code were a defect. (a) was a harness
   artifact — see C-7. (b) was me misreading an intentional privacy decision as an oversight. Both are
   withdrawn.*

5. **Icon-only bottom navigation** — 3/7 sessions
   Five destinations, no text labels (deliberate per `BottomNav.tsx:7`), and the Settings tab is the user's avatar while a separate `/profile` route exists.
   Fix: text labels; gear for Settings or rename to "Account".

6. **Two controls asking the same question in the participant form** — 2/7 sessions
   `Fill Details Myself | Invite via Email` segmented control sits directly above `This entry is for: For me / For someone else`.
   Fix: collapse to one question; derive the rest.

7. **No visible focus, no focus management** — 2/7 sessions
   `focus-visible` styling in 25/143 component files; `Header.tsx`, `EventCard.tsx`, `CartPage.tsx` have none; route changes reset focus to document top; sticky stepper occludes the focused field.
   Fix: global `:focus-visible` token; focus the `h1` on navigation; `scroll-margin-top` on inputs.

8. **Screen-reader grouping collapses cards into one run-on label** — 1/7 (severe)
   Order card announces `"…Dumaguete Futsal Cup Season 41× Team of 8₱5,295"` — adjacent numbers fuse.
   Fix: concise link name; supporting detail as non-focusable text.

9. **Systemic truncation at 375px** — 3/7 sessions
   Search placeholder, event titles, venues, cart item names, order summaries, checkout entry titles, and the `Events`/`Reset QR` wallet tab labels (clipped by the pocket graphic).
   Fix: two-line clamps on titles; shorten venue strings; widen the search field.

10. **Touch targets below the app's own 44px standard** — measured
    `Open notifications` 32×32, `Open cart` 32×32, filter tabs 36px tall, `Go to home` 84×22. PRODUCT.md targets 44px.
    Fix: pad to 44×44 without changing visual size.

11. **Duplicated CTA on the conversion screen** — 1/7
    `From ₱950` + `Get Tickets` appear inline and in the sticky bar simultaneously.
    Fix: keep the sticky bar; give the inline space to date/venue.

12. **Fee revealed only on scroll** — 1/7
    Sticky cart total includes a ~3% convenience fee itemized only further up the page.
    Fix: `incl. ₱97.47 fee` beside the sticky total.

## Content / Data Issues (MCE report)

1. **Five names for one concept.** "PlanOut Passport", "Passport", "UNIVERSAL PASS" (card face), "universal QR" (`Ready for gate - staff scans your universal QR.`), "PASSPORT HOLDER" (wallet). Affected: `/passport`, `/orders/:id`, `/`, `/events/:id`. → One name: **Passport**.

2. **"Fill up" used for forms.** `Fill up`, `Fill up later` — not idiomatic English. Affected: `OrderDetailBlocks`, `CheckoutPage`. → "Complete form" / "Finish later".

3. **Contradictory states on one screen.**
   - Form details: `Completed Information` + `Complete` badge **and** "You'll be notified once the attendee completes the form."
   - Checkout: `Ready` badge on an entry whose required fields are empty.
   - `/passport`: "Claimed events will appear here." while the account holds 15 orders.
   → Render pending copy only in pending state; explain the Orders↔Passport relationship.

4. **Terminology drift.** `Forms needed` (list) / `Form needed` (detail) / `participant form` / `Form details` / `Completed Information`. And `organiser` vs `organizer` in adjacent notification rows and across Home vs Event pages. → One term per concept; one locale.

5. **Dates disagree across surfaces for the same event.** NUTRI-RUN 65 shows **Aug 6, 2026** on Home/Events, **Jul 4, 2026** in Cart and in order `MNL-2026-001234`. → Single source of truth.

6. **Stale and year-less deadlines with no expired state.** "Sales end June 15" (past, CTA still live), "before July 5" (past), "Event Tomorrow — City Half Marathon 2025", `Canlaon Marathon 2025` in Inbox vs `Canlaon Marathon 2026` in Orders. → Absolute dates with year; render closed/expired states.

7. **Placeholder identity leaking.** All three entries in `MNL-2026-001234` are `(Jessica Williams)` / `jessica@email.com` while the signed-in user is Kenan Aiah. → Seed participant data from the active profile.

8. **Category labels don't match their events.** Checkout entry 1: `Beginner Double Male - 15-30` under **NUTRI-RUN 65** (an ultramarathon), subtitled `Singles Entry` — two contradictions on one card. → Fix seed data; add a sanity check that category belongs to the event's sport.

9. **"Required document" names no document.** "…such as a waiver, medical certificate, or ID." A user cannot comply with a list of maybes. → Organizer specifies the exact document; render its name.

10. **Internal jargon in user copy.** `Buyer-filled Guest QR` as a user-facing radio description. → "They'll get a QR code from you".

11. **State strings concatenated into titles.** `"Dumaguete City Night Run - setup in progress"`. → State belongs in a badge.

12. **Unlabeled money and ambiguous quantities.** `2× 42K Full Marathon … ₱1,595` — the figure is the order total incl. fees but reads as a unit price. `1× Relay Team of 5` — one purchase, five people, one number. Five unrelated orders all priced exactly ₱5,295 (uniform placeholder seeds). → Prefix `Total`; express team entries as `Relay Team · 5 players · 3 forms outstanding`; vary seed prices.

13. **Hyphen used as a separator throughout.** `Event - Item (Name)`, `Ready for gate - staff scans…`, `One-time use - Valid June 27`, `1× Official Hoodie - 2× PlanOut Race Cap`. Reads as a range or a compound. → `·` or an en dash.

14. **Two message centers, duplicated content.** `/notifications` (bell, unread 4) and `/settings/inbox` (unread 2, and `Inbox 2 + Archived 2 ≠ All 6`); Notifications tells users to "View in Inbox". Registration-confirmed messages appear in both. → Merge, or make Notifications a pointer with no separate count.

15. **Internal tooling exposed.** `PROTOTYPE — Passport Cases Board — All 34 registration & access scenarios` in user settings. → Dev flag.

16. **The most urgent notification is the only one without a CTA.** "Action Required — complete the participant form" has no button; "Leave a Review" has `Write Review`. → Deep-link every action-required item.

## Patterns Observed

- **The app's stated first principle is its weakest execution.** PRODUCT.md: *"Action states must be explicit: paid, pending form, processing payment, and ready to scan need distinct visual language."* In practice the state signal is 8px type at 2.34:1 inside a decorative graphic, the action-required CTA is quieter than the settled one, and four surfaces report four different pending counts.
- **Decoration outranks information.** The leather wallet, the folder illustration, and the animated mesh nav tile each win the visual fight against the content they house — the QR card, the status pill, and the destination label respectively.
- **The no-account guest page is the best screen in the product.** `PublicGuestEntryPage` — one job, name large, QR large, gate named, one instruction, one reassurance. Every session that saw it reacted positively; Session 5 asked why the logged-in Passport isn't built the same way. **That page is the design target for the rest of the app.**
- **Users don't distrust the app's math, they distrust its labels.** The one power user who verified arithmetic found it correct — then stopped believing the interface anyway, because four counts disagreed.
- **Two controls for one decision, twice.** Fill-method vs entry-recipient in the form; org switcher at top vs org list below in Settings. Both times users read the second control as a system error.
- **375px is not a tested width.** Truncation in eight places, a 390px card in a 375px viewport, clipped wallet tab labels, and floating chrome that occludes content on five routes.
- **Accessibility is half-built, and the good half proves the team can do it.** `aria-label`s on nav and header are exemplary; zero unnamed controls on Orders. But focus styling reaches 25/143 files and whole cards are wrapped in single buttons. The fixes are patterns already present in the codebase, just not applied globally.

## Recommended Changes

| Priority | Change | Effort | Impact |
|---|---|---|---|
| **P1** | Rebuild the order status pill: out of the illustration, ≥12px, ≥4.5:1 contrast, always rendered (incl. `Complete`) | S | Fixes the #1 issue across 6/7 sessions and an objective WCAG AA failure |
| **P1** | Single `actionRequiredCount` selector; delete the other three count paths | S | Restores trust in every badge; unblocks the power-user journey |
| **P1** | Swap CTA hierarchy in `OrderDetailBlocks` — filled primary on action-required, quiet on settled | S | Makes the required action the loudest thing, per PRODUCT.md |
| **P1** | Make `FloatCard` dismissible (and remove it from `/events`, `/events/:id`) | S | Stops content occlusion on 5 routes; fixes a keyboard/SR trap |
| **P1** | Passport: add "staff scan this QR, your name stays private" reassurance; no prominent empty pocket; stop downscaling the QR | M | Keeps the privacy design intact while removing the "am I even registered?" read |
| **P1** | Global `:focus-visible` token + focus the `h1` on route change + `scroll-margin-top` on inputs | S | Closes the "visible keyboard focus" gap PRODUCT.md already commits to |
| **P2** | Add text labels to `BottomNav`; gear (not avatar) for Settings | S | Fixes navigation for low-confidence users; ends Settings/Profile confusion |
| **P2** | Collapse the duplicate fill-method / recipient controls into one question | M | Removes the biggest comprehension stall in checkout |
| **P2** | Order cards: link with a concise accessible name; details as non-focusable text | S | Ends run-on announcements and number fusion for SR users |
| **P2** | Terminology pass: one name for Passport; "Complete form" not "Fill up"; one spelling of organizer; `·` not `-` | S | Cheapest credibility win in the report |
| **P2** | "Required document": organizer names the document; render the name | M | Unblocks form completion — currently not completable in good faith |
| **P2** | Truncation pass at 375px: two-line title clamps, shortened venues, wider search, unclipped wallet tabs | M | Restores scannability across Events, Orders, Cart, Checkout |
| **P2** | Fix contradictory states: no `Ready` on unfilled forms; no "you'll be notified" on complete forms; explain Orders↔Passport | S | Removes three direct self-contradictions |
| **P3** | Single source of truth for event dates; absolute dates with year; expired/closed states | M | Removes stale-deadline confusion (June 15, July 5, 2025 events) |
| **P3** | Re-seed mock data: participant identity from profile, event-appropriate categories, varied prices, no state strings in titles | M | Stops users reading demo artifacts as bugs |
| **P3** | Merge Notifications and Inbox (or one unread count + pointer); add CTA to action-required notifications | M | Ends the two-message-center split and the two-hop journey |
| **P3** | Pad sub-44px targets (32×32 header buttons, 36px tabs); `role="tablist"` + arrow keys on filters | S | Meets the app's own 44px standard |
| **P3** | Team roster surface from the order; express team entries as players + outstanding forms | L | Unblocks the coach/organizer persona entirely |
| **P3** | Remove the `PROTOTYPE` settings section behind a dev flag; add offline reassurance + Wallet save to guest QR | S | Removes internal leakage; addresses the 5 AM no-signal gate |
| **P3** | Cart: label the countdowns or remove them; surface the fee beside the sticky total | S | Removes unexplained urgency and fee surprise |

## Next Steps

1. **Ship the P1 block as one "action states are explicit" release.** All six items are small, they target the same broken promise, and together they fix the top four synthesis issues.
2. **Run a 375px truncation and occlusion sweep** before anything else visual — eight truncation sites and five occlusion sites were found on the routes tested, so more likely exist on routes not covered.
3. **Adopt `PublicGuestEntryPage` as the reference for the Passport redesign.** It already solves the problem the Passport page is failing at; the work is porting its clarity, not inventing.
4. **Add a terminology lockfile** (Passport / registration / form / organizer) and lint copy against it. Fifteen of sixteen content issues are naming, not logic.
5. **Re-seed demo data from the active profile** before the next round of testing — "Jessica Williams" and mismatched categories cost real session time and produced findings that aren't about the design.
6. **Re-test sessions 3, 6, and 7 after P1+P2** — those personas abandoned or barely completed, and they are the ones whose outcomes should flip.

## C-7 — Resilience note (not observed by users)

Every content block on `EventDetailsPage` starts at `opacity: 0` (`fadeUp` variants, `EventDetailsPage.tsx:128-131`)
and becomes visible only when a JS animation frame runs. `PassportPage.tsx:788-790` is worse: the card
starts at `opacity: 0, scale: 0.15, y: 400`. `CartPage` enters from `translateX`. In this harness the tab
was backgrounded, `rAF` never fired, and those pages rendered blank or displaced — on `EventDetailsPage`,
title/price/organizer/date/About/Location/Requirements/Gallery were all invisible; on `/passport` the card
measured 138×209 at ~800px down the document instead of 351×531 in view.
**This was a harness artifact and normal users will not see it** — two findings in an earlier draft of this
report were traced to it and withdrawn.
But the same stall is reachable in production wherever `rAF` is starved or the animation throws: a
backgrounded-then-restored tab, aggressive low-power modes, or some in-app webviews. Making content
visible by default and animating *from* visible (or gating on a CSS-driven reveal) removes a whole class
of blank-page failure for zero visual cost. | Severity: **M** | Effort: S
