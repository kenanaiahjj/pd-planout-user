# 🎨 Frame Naming Handbook

**A naming standard for every tracked surface in our Figma files**

| | |
|---|---|
| **Status** | Proposed → for review in design crit |
| **Owner** | *[name]* |
| **Applies to** | All frames tracked by the Changelog plugin |
| **Last updated** | *[date]* |

---

## Table of contents

1. [Why this exists](#1-why-this-exists)
2. [Core principles](#2-core-principles)
3. [The format](#3-the-format)
4. [Type — the surface taxonomy](#4-type--the-surface-taxonomy)
5. [Area — the product map](#5-area--the-product-map)
6. [Name — the specific surface](#6-name--the-specific-surface)
7. [Variant — states and conditions](#7-variant--states-and-conditions)
8. [Flows and multi-step sequences](#8-flows-and-multi-step-sequences)
9. [Surface cookbook — every case](#9-surface-cookbook--every-case)
10. [Typography and formatting rules](#10-typography-and-formatting-rules)
11. [Forbidden patterns](#11-forbidden-patterns)
12. [Figma page organization](#12-figma-page-organization)
13. [Layers, components, and untracked work](#13-layers-components-and-untracked-work)
14. [Governance — changing the vocabulary](#14-governance--changing-the-vocabulary)
15. [Migration plan](#15-migration-plan)
16. [Plugin enforcement](#16-plugin-enforcement)
17. [FAQ and edge cases](#17-faq-and-edge-cases)
18. [Cheat sheet](#18-cheat-sheet)

---

## 1. Why this exists

Our Changelog plugin screenshots tracked frames on publish and writes them to a changelog page. That makes the frame name a **database key**, not a label:

- **Renaming a frame forks its history.** The plugin loses the thread between "Store Page" and "Store Page v2" — you get two half-histories instead of one story.
- **Names encoding recency go stale.** "New Paywall" stops being new. "(NEW)" in a name is a lie with a three-month fuse.
- **Inconsistent names make the tracker unusable.** Once the list passes ~30 frames, "was it *Profile No Subscription* or *Profile Free*?" costs real time, every time.
- **Devs and QA read these names.** They land in tickets, PR descriptions, and release notes. A name that only makes sense to the person who drew it is a translation cost paid by everyone downstream.

This handbook trades a small amount of naming freedom for a tracker that stays searchable, sortable, and machine-parseable as the product grows.

---

## 2. Core principles

**P1 — A name is an identity, not a description.**
It answers "which surface is this?" — never "what's new about it?" or "when did I make it?"

**P2 — Names are stable.** You pick a name once. Content changes freely underneath; the name doesn't.

**P3 — The vocabulary is closed.** Types, Areas, and Variants come from fixed lists. A closed vocabulary is what makes search work — synonym drift ("Guest" / "Logged Out" / "No Account" / "Anonymous") is exactly what broke our current file.

**P4 — One frame, one tracked thing.** If a surface has two meaningfully different states, that's two frames sharing a base name. Never swap content inside a single tracked frame — the changelog can't show you a diff of something that shape-shifted.

**P5 — Name the artifact, not the journey.**
✅ `Modal - Rewards - Claim Daily Drop`
❌ `Pop-Up That Appears When You Claim The Daily Drop`
The second name breaks the day the entry point changes.

**P6 — Consistency beats elegance.** Any of these conventions would work. The value is entirely in everyone using the *same* one.

---

## 3. The format

```
Type - Area - Name (Variant)
```

### Anatomy

```
Screen  -  Paywall  -  Main  (Member, Error)
└──┬──┘    └──┬───┘    └─┬┘   └──────┬─────┘
   │          │          │           │
   │          │          │           └─ optional; states, comma-separated
   │          │          └───────────── the specific surface
   │          └──────────────────────── product domain
   └─────────────────────────────────── kind of surface
```

### Mechanical rules

| Rule | Detail |
|---|---|
| **Separator** | Hyphen with a space on **both** sides: ` - ` |
| **Parts** | Exactly three, always. No two-part or four-part names. |
| **Variant** | In parentheses, at the very end, only when needed |
| **Multiple variants** | Comma-space separated inside one set of parens: `(Member, Empty)` |
| **Casing** | Title Case in every part |
| **Inner hyphens** | Fine, as long as they have no surrounding spaces: `First Top-Up` ✅ |

That last rule is the reason we require spaces around the separator: `Flow - Wallet - First Top-Up` parses into three clean parts, because `Top-Up`'s hyphen is unspaced.

### Examples

```
Screen - Store - Home
Screen - Store - Product Detail
Screen - Wallet - Details (Empty)
Screen - Paywall - Main (Guest)
Screen - Paywall - Main (Member)
Sheet - Wallet - Top-Up Amount
Modal - Rewards - Claim Daily Drop
Overlay - Global - Offline Banner
Section - Global - Tab Bar
Flow - Store - Buy VIP Pass
Flow - Store - Buy VIP Pass (Repeat)
Flow - Vouchers - Claim Cebuana
Message - Rewards - Streak Reminder Push
```

---

## 4. Type — the surface taxonomy

Eight types cover everything we ship. Pick by **how the surface behaves**, not how it looks.

| Type | Definition | Behavioral test | Examples |
|---|---|---|---|
| `Screen` | A full-viewport destination with its own route | Can you deep-link to it? Does back/up navigation leave it? | Store home, wallet details, settings, profile |
| `Sheet` | Partial overlay anchored to an edge; the screen behind stays visible | Does it slide in from an edge and leave context visible? | Bottom sheet, action sheet, drawer, side panel |
| `Modal` | Centered, blocking dialog that demands a decision | Must the user answer before continuing? | Confirm purchase, alert, permission rationale |
| `Overlay` | Transient, non-blocking feedback layered on any screen | Does it disappear on its own or on tap-away? | Toast, snackbar, tooltip, coach mark, banner |
| `Section` | A tracked region *inside* a screen | Is it a part, not a whole? Reused across screens? | Tab bar, header, balance card, ad slot |
| `Flow` | An ordered sequence of steps, tracked as one artifact | Is the *sequence* the thing you're reviewing? | Checkout, onboarding, voucher claim |
| `Message` | An out-of-app or inbox-style communication | Does it exist outside the running app? | Push, email, SMS, in-app inbox message |
| `Asset` | A non-UI deliverable that still needs change history | Is it shipped but not a UI surface? | QR code artwork, app store screenshots, OG image |

### Disambiguation rules

These are the calls people get wrong. Decide once, here:

- **`Screen` vs `Sheet`** — if the previous screen is still partly visible behind it, it's a `Sheet`. A full-height sheet that covers everything is a `Screen`.
- **`Sheet` vs `Modal`** — edge-anchored and dismissible by swipe → `Sheet`. Centered and requires an explicit choice → `Modal`.
- **`Modal` vs `Overlay`** — blocking → `Modal`. Ignorable → `Overlay`.
- **`Section` vs `Screen`** — only promote a region to `Section` if you need to track it *independently* of its parent screen. Don't create a `Section` for every card; create one for the ad slot you keep redesigning.
- **`Flow` vs several `Screen`s** — do both when useful. Track individual screens for detail, and a `Flow` frame when the sequence itself matters. The `Flow` frame is a container holding step frames (§8).
- **`Screen` vs `Asset`** — if it renders in our app, it's a `Screen`. If it renders in the App Store, an email client, or on paper, it's an `Asset` or a `Message`.

> **Rule of thumb:** when two types both seem right, pick the *smaller* one. A `Section` that grows into a `Screen` is an easy promotion; splitting an over-broad `Screen` is not.

---

## 5. Area — the product map

Areas are the product's domains. They should match how the team already talks — and ideally how the code is organized.

### Current areas

| Area | Covers |
|---|---|
| `Global` | Cross-app chrome and universal states: nav, tab bar, offline, maintenance, generic errors |
| `Onboarding` | First-run, sign-up, sign-in, permissions |
| `Store` | Browsing, product detail, cart, checkout, purchase |
| `Wallet` | Balance, top-up, transaction history, payment methods |
| `Paywall` | Subscription offers, upgrade prompts, plan comparison |
| `Profile` | Account, settings, preferences, support |
| `Rewards` | Daily drops, streaks, points, redemption |
| `Ads` | Ad units, rewarded video, ad-gated content |
| `Vouchers` | Voucher issuance, claiming, partner redemption (Cebuana, etc.) |

> ⚠️ **Prune this list before adopting.** Delete any area we don't actually have. An area nobody uses is dead vocabulary that makes the standard look bureaucratic.

### Rules for areas

1. **8–12 areas is the target.** Fewer than 6 and areas stop being useful filters. More than 15 and nobody remembers them.
2. **Areas are nouns, not features.** `Wallet` ✅ (a place) — `Topping Up` ❌ (an action).
3. **One area per surface.** If a surface genuinely belongs to two areas, ask "whose team owns this?" and use theirs. A paywall shown inside the store is still `Paywall`.
4. **`Global` is for chrome and universal states only** — not a dumping ground for things you can't classify. If you're reaching for `Global`, you probably need a new area, and that's a §14 conversation.
5. **Adding an area is deliberate**, not something you do mid-rename. See §14.

---

## 6. Name — the specific surface

The third part identifies the surface within its area.

### Guidelines

- **2–4 words.** `Main`, `Home`, `Details`, `Product Detail`, `Buy VIP Pass`, `Transaction History`.
- **Use `Main`** for an area's single primary surface when no better word exists: `Screen - Paywall - Main`.
- **Use `Home`** when the area has a landing surface plus deeper ones: `Screen - Store - Home` + `Screen - Store - Product Detail`.
- **Don't repeat the area.** `Screen - Wallet - Wallet Details` ❌ → `Screen - Wallet - Details` ✅
- **Don't repeat the type.** `Modal - Rewards - Claim Daily Drop Popup` ❌ — we know it's a modal.
- **Verbs are fine for flows and actions.** `Buy VIP Pass`, `Claim Cebuana`, `First Top-Up`.
- **Prefer the user's word over the internal one.** `Daily Drop` (what the UI says) over `DailyRewardV2Container` (what the code says).
- **Consistent abbreviations only.** `VIP`, `QR`, `KYC`, `OTP` are fine — they're what everyone says. Don't invent new ones.

---

## 7. Variant — states and conditions

A variant distinguishes two frames that are the *same surface* in *different conditions*. If you only have one version of a surface, **omit the parens entirely**.

### The variant catalog

Grouped by dimension. Use the exact words below — this is the closed list.

**Entitlement / account**
`Guest` · `Free` · `Member` · `Subscribed` · `Trial` · `Expired` · `Suspended`

**Data / population**
`Empty` · `Populated` · `Single Item` · `Overflow` *(too many items to fit)* · `Max`

**Loading & failure**
`Loading` · `Skeleton` · `Error` · `Offline` · `Success` · `Pending`

**Sequence / recency**
`First Time` · `Repeat` · `Returning`

**Form & input**
`Filled` · `Invalid` · `Disabled` · `Focused`

**Platform** *(only when platforms genuinely diverge)*
`iOS` · `Android` · `Web` · `Tablet`

**Appearance** *(only when we ship both)*
`Dark` · `Light` · `RTL` · a locale code like `Tagalog`

### Combining variants

Comma-separated, in this fixed slot order:

```
(Platform, Entitlement, Data/State, Appearance)
```

```
Screen - Wallet - Details (Member, Empty)      ✅
Screen - Wallet - Details (Empty, Member)      ❌ wrong order
Screen - Store - Home (Android, Guest, Dark)   ✅ but see the cap below
```

**Cap: two variants.** Three or more means one of these is true:
- The surface is doing too much and should be split, or
- You're documenting a matrix, which belongs in a **spec section on a working page**, not in the tracked changelog. Track the two or three states that actually ship differently; don't track all 24 permutations.

### Variants vs. separate surfaces

The test: **would a designer reviewing the changelog want to see these side by side?**

- Yes, and they're the same surface → **variants.** `Main (Guest)` / `Main (Member)`
- No, they're different jobs → **different names.** `Home` and `Product Detail`

---

## 8. Flows and multi-step sequences

A `Flow` frame is a **container** holding the ordered steps of a sequence. The container is what gets tracked; the steps inside it are ordinary child frames.

### Structure

```
Flow - Store - Buy VIP Pass              ← tracked; this is the frame the plugin watches
├── 01 Select Pass
├── 02 Confirm Purchase
├── 03 Payment Method
├── 04 Processing
└── 05 Success
```

### Rules

1. **Step frames are numbered with a zero-padded prefix** — `01`, `02` … so they sort correctly and read in order at a glance.
2. **Step frames don't follow the three-part format.** They're internal to the flow; a short label is right.
3. **Leave gaps if you like** (`10`, `20`, `30`) so inserting a step doesn't mean renumbering. Renumbering child frames is harmless — they aren't tracked individually — but gaps save churn in review comments.
4. **Number, don't date.** Never `01 Select Pass (Jul 9)`.
5. **Branches get a suffix**, not a new numbering scheme: `03a Payment Method - Card`, `03b Payment Method - Wallet`.
6. **A step that's also a standalone destination can exist twice** — as a tracked `Screen` and as a step frame inside the flow. That's intentional: the `Screen` tracks the surface's own evolution, the `Flow` tracks the sequence's.
7. **Don't number top-level names.** `3.2 - Store - Buy VIP Pass` ❌ — journey order changes constantly, and every reorder would fork history for every downstream frame.

---

## 9. Surface cookbook — every case

Look up the surface you're naming. This table is the answer to "but what about…".

### Full destinations

| Surface | Name |
|---|---|
| Store landing | `Screen - Store - Home` |
| Product / pass detail | `Screen - Store - Product Detail` |
| Search results | `Screen - Store - Search Results` |
| Search, no results | `Screen - Store - Search Results (Empty)` |
| Wallet balance & history | `Screen - Wallet - Details` |
| Transaction detail | `Screen - Wallet - Transaction Detail` |
| Paywall, not subscribed | `Screen - Paywall - Main (Guest)` |
| Paywall, already subscribed | `Screen - Paywall - Main (Member)` |
| Plan comparison | `Screen - Paywall - Plan Comparison` |
| Profile, free user | `Screen - Profile - Main (Free)` |
| Profile, subscriber | `Screen - Profile - Main (Subscribed)` |
| Settings list | `Screen - Profile - Settings` |
| Rewarded video playing | `Screen - Ads - Watching` |
| Ad in fixed aspect ratio | `Screen - Ads - Fixed Ratio` |
| Voucher list | `Screen - Vouchers - My Vouchers` |
| Sign-in | `Screen - Onboarding - Sign In` |
| Sign-up | `Screen - Onboarding - Sign Up` |
| OTP entry | `Screen - Onboarding - Verify OTP` |
| Welcome carousel | `Flow - Onboarding - Welcome Tour` |

### Sheets and panels

| Surface | Name |
|---|---|
| Top-up amount picker (bottom sheet) | `Sheet - Wallet - Top-Up Amount` |
| Payment method picker | `Sheet - Wallet - Payment Method` |
| Share menu | `Sheet - Global - Share` |
| Filter panel | `Sheet - Store - Filters` |
| Nav drawer | `Sheet - Global - Nav Drawer` |
| Date picker sheet | `Sheet - Global - Date Picker` |

### Modals and dialogs

| Surface | Name |
|---|---|
| Daily drop claim popup | `Modal - Rewards - Claim Daily Drop` |
| Purchase confirmation | `Modal - Store - Confirm Purchase` |
| Cancel subscription warning | `Modal - Paywall - Confirm Cancel` |
| Delete account confirm | `Modal - Profile - Confirm Delete Account` |
| Why-we-need-notifications rationale | `Modal - Onboarding - Notification Rationale` |
| Force-update wall | `Modal - Global - Force Update` |
| Generic error dialog | `Modal - Global - Error` |
| Session expired | `Modal - Global - Session Expired` |

> **OS-level dialogs** (the iOS permission prompt, Apple Pay sheet, system share sheet) — we don't design these, so don't track them alone. Include them inside a `Flow` when they're part of a sequence: step frame `04 iOS Notification Prompt`.

### Overlays and transient feedback

| Surface | Name |
|---|---|
| Success toast | `Overlay - Global - Success Toast` |
| Error snackbar | `Overlay - Global - Error Snackbar` |
| Offline banner | `Overlay - Global - Offline Banner` |
| Feature tooltip | `Overlay - Store - Filter Tooltip` |
| First-run coach marks | `Overlay - Onboarding - Coach Marks` |
| Promo banner in-app | `Overlay - Store - Promo Banner` |

### Sections and chrome

| Surface | Name |
|---|---|
| Bottom tab bar | `Section - Global - Tab Bar` |
| App header | `Section - Global - Header` |
| Balance card | `Section - Wallet - Balance Card` |
| Streak tracker module | `Section - Rewards - Streak Tracker` |
| Ad slot in feed | `Section - Ads - Feed Slot` |
| Product card | `Section - Store - Product Card` |
| Empty state block | `Section - Global - Empty State` |

### Flows

| Surface | Name |
|---|---|
| Buying a VIP pass, first time | `Flow - Store - Buy VIP Pass` |
| Buying another, already owned | `Flow - Store - Buy VIP Pass (Repeat)` |
| First-ever top-up | `Flow - Wallet - First Top-Up` |
| Claiming a Cebuana voucher | `Flow - Vouchers - Claim Cebuana` |
| Full checkout | `Flow - Store - Checkout` |
| Account deletion | `Flow - Profile - Delete Account` |
| Subscription upgrade | `Flow - Paywall - Upgrade` |
| KYC verification | `Flow - Onboarding - Verify Identity` |

### Messages — out-of-app

| Surface | Name |
|---|---|
| Streak reminder push | `Message - Rewards - Streak Reminder Push` |
| Purchase receipt email | `Message - Store - Receipt Email` |
| OTP SMS | `Message - Onboarding - OTP SMS` |
| Inbox announcement | `Message - Global - Announcement` |
| Win-back email | `Message - Paywall - Win-Back Email` |

Keep the channel in the name (`Push`, `Email`, `SMS`) — the same content shipped on two channels is two surfaces with real formatting differences.

### Assets — shipped but not UI

| Surface | Name |
|---|---|
| Voucher QR artwork | `Asset - Vouchers - QR Code` |
| App Store screenshots | `Asset - Global - Store Screenshots` |
| Social share image | `Asset - Global - OG Image` |
| Printed partner poster | `Asset - Vouchers - Partner Poster` |

### Universal states — the ones people forget

Every area needs these eventually. Name them as variants of the surface they interrupt, **not** as standalone screens:

```
Screen - Wallet - Details (Loading)
Screen - Wallet - Details (Empty)
Screen - Wallet - Details (Error)
Screen - Wallet - Details (Offline)
```

Only when a state is genuinely its own designed destination does it get its own name:

```
Screen - Global - Maintenance
Screen - Global - Not Found
Screen - Global - App Update Required
```

**How to decide:** if it shows the surface's own layout with different content → variant. If it replaces the surface with something else entirely → its own `Screen`.

---

## 10. Typography and formatting rules

| Rule | ✅ | ❌ |
|---|---|---|
| Title Case every part | `Buy VIP Pass` | `buy vip pass`, `BUY VIP PASS` |
| Spaces around the separator | `Screen - Store - Home` | `Screen-Store-Home` |
| No slashes | `Screen - Store - Home` | `Screen / Store / Home` |
| No emoji in tracked names | `Screen - Store - Home` | `🛍 Screen - Store - Home` |
| Spell out "and" | `Terms and Privacy` | `Terms & Privacy` |
| No trailing punctuation | `Details` | `Details.` |
| Single spaces only | `Buy VIP Pass` | `Buy  VIP Pass` |
| Numerals as digits | `Step 2`, `Tier 3` | `Step Two` |

**Why no slashes:** Figma treats `/` as a path separator. On export it creates nested folders, and in component naming it creates variant groups. Both fight our plugin.

**Why no emoji:** they break sorting, search, and filename sanitization. The single exception is the `🚧 ` prefix for untracked work (§13), where being visually loud is the point.

---

## 11. Forbidden patterns

### Never in a tracked frame name

| Forbidden | Why | Instead |
|---|---|---|
| `New`, `(NEW)` | Goes stale; changelog already flags new frames | Just the name |
| `v2`, `V3`, `2.0` | Version history is the changelog's job; a version bump forks history | Keep the name, publish a change |
| Dates — `Jul 9`, `2026-07` | Same; the plugin timestamps every capture | Nothing |
| `Final`, `FINAL FINAL` | Never true | Nothing |
| `Copy`, `Copy 2` | Figma's default — always an accident | Rename or delete |
| `Updated`, `Revised`, `Fixed` | Describes an event, not an identity | Nothing |
| `WIP`, `Draft`, `Test` | Untracked work has its own convention | `🚧 ` prefix, §13 |
| Designer initials | Ownership lives in Figma, not the name | Nothing |
| Ticket IDs — `PLAN-482` | Tickets close; surfaces don't | Link in the frame description |

> 💡 **The one-sentence version:** if it would be wrong in six months, it doesn't belong in the name.

### Synonym blacklist

Left column is banned. Use the right column.

| Don't use | Use |
|---|---|
| Logged Out, No Account, Anonymous, Not Signed In | `Guest` |
| No Membership, Non-Subscriber, Basic | `Free` |
| Premium, Paid, Pro, VIP User | `Member` or `Subscribed` |
| Pop-Up, Popup, Dialogue, Alert Box | type `Modal` |
| Bottom Sheet, Drawer, Tray | type `Sheet` |
| Toast, Snackbar, Banner *(as a name)* | type `Overlay` |
| Blank, No Data, Zero State | `Empty` |
| Spinner, Loader | `Loading` |
| Page *(as a name suffix)* | type `Screen` |

---

## 12. Figma page organization

Pages get emoji prefixes — here the emoji is doing real work as a visual sort key, and page names aren't parsed by the plugin.

```
📸 Changelog — do not edit     ← auto-generated by the plugin. Never work here.
✅ Shipped                     ← live in production
🚀 In Review                   ← handed to devs, awaiting ship
🚧 In Progress                 ← active design work
🧪 Explorations                ← throwaway; never tracked
📚 Components                  ← the design system
🗄 Archive                     ← dead work, kept for reference
```

### Rules

1. **The `📸 Changelog` page is machine-owned.** Don't edit, reorganize, or design on it. Anything you put there will be overwritten or will confuse the plugin.
2. **Only frames on `✅ Shipped`, `🚀 In Review`, and `🚧 In Progress` should ever be tracked.** Explorations and Archive are out of scope by definition.
3. **Moving a frame between pages doesn't affect its tracked history** — the plugin follows the node, not the location. Moving is safe and encouraged.
4. **Archive, don't delete.** Deleting a tracked frame orphans its history.

---

## 13. Layers, components, and untracked work

### Untracked and experimental frames

Prefix with `🚧 ` and name it however you like:

```
🚧 paywall idea — big price
🚧 store home v3 experiment
```

**Renaming a frame to the standard is the act of making it official.** That's a deliberate ritual: the moment a frame gets a conforming name, it becomes trackable, reviewable, and part of the record. Before that, it's yours to scribble on.

### Components

Components follow Figma's own conventions, **not** this standard. Slashes are correct here — that's how Figma builds variant groups:

```
Button/Primary
Button/Secondary
Card/Product
Input/Text
```

Components live on `📚 Components` and aren't tracked by the changelog plugin — the design system has its own versioning through library publishing.

### Layers inside frames

Not governed by this standard, but two courtesies for whoever opens your file next:

- Rename the layers that matter (`Price Row`, `CTA`). Leave `Frame 247` on the ones that don't.
- Name groups after their **function**, not their contents: `Header` over `Rectangle + Text + Icon`.

---

## 14. Governance — changing the vocabulary

The closed vocabulary is the whole point, so changing it has a process — a light one.

### Adding an Area

1. Check it isn't an existing area under a different name.
2. Raise it in design crit. One sentence: what it covers, and what it *doesn't*.
3. Owner (*[name]*) adds it to this doc and to the plugin's allowlist.
4. Announce in `#design`.

**Bar for a new Area:** a genuinely new product domain — a place in the app that didn't exist. Not "this screen feels different."

### Adding a Variant

Same process, lower bar — new states appear naturally as the product grows. But check the catalog first; the answer is usually already there under a different word.

### Adding a Type

**Very high bar.** Eight types cover every surface pattern in mobile and web software. If a ninth seems necessary, it's much more likely that an existing type's definition needs sharpening. Bring it to crit as a definition problem, not a vocabulary request.

### Reviewing the standard

Revisit every six months, or after any major product expansion. Look for: areas nobody used, variants that drifted, types people keep getting wrong.

---

## 15. Migration plan

Do the whole file in one sitting. A half-migrated file is worse than an unmigrated one — you can't tell whether a non-conforming name is a holdout or a mistake.

### Before you start

⚠️ **Rename before your next publish.** If our plugin keys history to frame names rather than node IDs, renaming after a publish forks every history. Confirm with *[dev name]* which one it uses, then rename during a publish freeze.

### Steps

1. **Freeze publishing.** Announce it; keep it short — an hour is plenty.
2. **Audit.** Export the current tracked list. Mark each frame: conforms / rename / shouldn't be tracked / duplicate.
3. **Resolve duplicates first.** Two frames of the same surface become one frame, or two variants of one base name. This is where most of the value is.
4. **Rename**, working area by area rather than top to bottom — it keeps your vocabulary decisions consistent.
5. **Untrack what shouldn't be tracked.** Explorations, one-offs, dead frames. Track fewer things than you think you need; adding is easy.
6. **Publish once.** This capture becomes the baseline for every name.
7. **Unfreeze**, and post the before/after in `#design`.

### Reference — our current frames, migrated

| Current name | Migrated name |
|---|---|
| Store Page (NEW) | `Screen - Store - Home` |
| Wallet Details | `Screen - Wallet - Details` |
| On First Top Up | `Flow - Wallet - First Top-Up` |
| New Paywall - No Membership | `Screen - Paywall - Main (Guest)` |
| New Paywall - With Membership | `Screen - Paywall - Main (Member)` |
| Profile No Subscription | `Screen - Profile - Main (Free)` |
| New Profile With Subscription | `Screen - Profile - Main (Subscribed)` |
| Pop-Up For Claiming Daily Drop | `Modal - Rewards - Claim Daily Drop` |
| Watching Ad | `Screen - Ads - Watching` |
| Ads Fixed Ratio | `Screen - Ads - Fixed Ratio` |
| Flow: Purchasing VIP Pass | `Flow - Store - Buy VIP Pass` |
| Flow: Purchasing another VIP Pass w… | `Flow - Store - Buy VIP Pass (Repeat)` |
| Cebuana Voucher Claiming Flow (NEW) | `Flow - Vouchers - Claim Cebuana` |
| ClaimDailyDrop | *duplicate of the Modal above — merge* |

Note what the migration buys us in the tracker's A→Z sort: Flows cluster, then Messages, Modals, Screens, Sections — and inside Screens, the Paywall and Profile variant pairs sit adjacent, exactly where you want them when comparing two states.

---

## 16. Plugin enforcement

**A standard with a linter survives. A standard in a doc does not.** These are the plugin changes that make this real — worth scoping with the dev team.

### Must have

- **Validate on track.** When a frame is added to the tracked list, check it against the pattern. Non-conforming → block, with the reason and a suggested fix.
- **Vocabulary allowlist.** Types, Areas, and Variants come from a config the plugin reads. A typo'd area (`Walet`) fails loudly instead of silently creating a new one.

### Should have

- **Rename warning.** If a tracked frame's name changes, warn that history will fork and offer to link the old and new names.
- **Grouped tracker panel.** Split names on ` - ` and group the list by Type, then Area. This is the payoff for the format — the panel becomes navigable instead of a flat scroll.
- **Area filter.** Chips along the top of the panel, generated from the Area allowlist.

### Nice to have

- **Variant diff view.** Frames sharing a base name and differing only in variant get shown side by side.
- **Normalize button.** Takes `screen-store-home` or `Screen/Store/Home` and fixes the casing and separators.
- **Forbidden-word lint.** Warn on `New`, `Final`, `v2`, dates, `Copy`.

### Parsing reference

```js
// Validation
const PATTERN = /^(Screen|Sheet|Modal|Overlay|Section|Flow|Message|Asset) - [A-Z][A-Za-z]+ - [A-Z][\w '\-]+( \(([\w \-]+)(, [\w \-]+)*\))?$/

// Destructuring a valid name
function parseFrameName(name) {
  const variantMatch = name.match(/ \(([^)]+)\)$/)
  const variants = variantMatch ? variantMatch[1].split(', ') : []
  const base = variantMatch ? name.slice(0, variantMatch.index) : name
  const [type, area, surface] = base.split(' - ')
  return { type, area, surface, variants }
}

// "Screen - Paywall - Main (Member, Error)"
// → { type: 'Screen', area: 'Paywall', surface: 'Main',
//     variants: ['Member', 'Error'] }
```

**Filename sanitization for screenshot export:** replace ` - ` with `--`, spaces with `-`, and strip parens:

```
Screen - Paywall - Main (Member)  →  screen--paywall--main-member.png
```

This keeps exports flat (no accidental folders), lowercase, and shell-safe.

---

## 17. FAQ and edge cases

**Q: A screen belongs to two areas — a paywall shown inside the store. Which wins?**
Whoever owns it. A paywall is `Paywall` no matter where it appears. If ownership is genuinely shared, that's a signal the areas are drawn wrong; raise it in crit.

**Q: We redesigned a screen completely. New name?**
No. Same surface, same name — that's precisely the change the changelog exists to show. A new name would hide the most interesting diff in the file.

**Q: We split one screen into two. What happens to the history?**
Keep the original name on whichever half inherits the surface's job, and give the new half a new name. Note the split in the frame description so the discontinuity is explained.

**Q: Do I track every state of every screen?**
No — track what ships and what you review. `(Empty)` and `(Error)` are worth tracking when they're designed; they aren't worth tracking as a completeness exercise. Track fewer things well.

**Q: Two designers gave the same surface different names in different files.**
Reconcile immediately — this is how the last system died. The name in the file that publishes to the changelog wins.

**Q: A/B test variants?**
Not variants in our sense — experiments are temporary and our names are permanent. Keep them on `🧪 Explorations` with a `🚧 ` prefix until one wins, then fold the winner into the canonical frame.

**Q: Do dev handoff or spec frames get tracked?**
No. Annotated specs, redlines, and measurement overlays are working artifacts, not surfaces. Keep them beside the frame they document, prefixed with `🚧 `.

**Q: The surface is in a language other than English.**
Name in English, add the locale as a variant: `Screen - Store - Home (Tagalog)`. Names are internal infrastructure; keeping them in one language keeps them searchable.

**Q: What about tablet, desktop, or watch?**
Platform variant when the surface is fundamentally the same: `(Tablet)`. A genuinely different product surface — a web dashboard we don't have on mobile — gets its own name, and probably its own file.

**Q: I truly can't classify this surface.**
Then it's a crit question, not a naming question. Post it in `#design` with a screenshot. Two minutes of discussion beats a name nobody else understands. The answer is usually "it's a Section" or "it's two things."

---

## 18. Cheat sheet

> Print this. Ignore the rest until you hit an edge case.

```
FORMAT      Type - Area - Name (Variant)
            spaces around the hyphens · Title Case · exactly 3 parts

TYPES       Screen   full destination, own route
            Sheet    edge-anchored, context visible behind
            Modal    centered, blocking, needs a decision
            Overlay  transient, non-blocking (toast, tooltip, banner)
            Section  a region inside a screen
            Flow     ordered sequence, tracked as one artifact
            Message  push, email, SMS, inbox
            Asset    shipped, but not UI (QR, store screenshots)

AREAS       Global · Onboarding · Store · Wallet · Paywall
            Profile · Rewards · Ads · Vouchers

VARIANTS    Guest · Free · Member · Subscribed · Trial · Expired
            Empty · Loading · Error · Offline · Success
            First Time · Repeat · iOS · Android · Dark
            → max two, ordered: Platform, Entitlement, State, Appearance

NEVER       New · v2 · dates · Final · Copy · Updated
            slashes · emoji · initials · ticket IDs

UNTRACKED   🚧 prefix, name it whatever you like

FLOW STEPS  child frames named 01, 02, 03 … inside the Flow frame
```

---

## Appendix — rolling this out

A suggested shape for the crit session:

1. **Open with the problem, not the solution.** Screenshot the current tracker panel: truncated names, `(NEW)` on a three-week-old frame, dates standing in for identity. Everyone recognizes it.
2. **Show the migrated list** (§15) next to it. The A→Z clustering does the arguing for you.
3. **Present one real alternative and your recommendation.** `Area - Name - Type` sorts by feature instead of by surface kind, which mirrors how the code is organized — devs often prefer it. Take a genuine vote; a standard people chose survives one they were handed.
4. **Prune the vocabulary together, live.** Cutting unused areas in the room turns the doc from an edict into the team's.
5. **Close on the enforcement ask** (§16) and the migration window (§15). Name the owner and the date.

**What needs filling in before you present:**
- Owner name in §14 and the header
- Prune §5 areas to what we actually have
- Confirm with devs whether the plugin keys history to node IDs or names (§15)
- Cut any cookbook rows in §9 for surfaces we don't have
