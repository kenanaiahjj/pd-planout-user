# Orders all states manifest implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a source-derived Pantograph manifest and generator that transcribe the PlanOut Orders overview, order-detail variants, and Orders-owned interaction states.

**Architecture:** Add a standalone Node generator under `design-manifests/`. The generator compiles the real `tickets.ts` and `OrdersPage.tsx` source with the repository's existing `esbuild` dependency, uses the real `MY_TICKETS`, `createRegistrationQueueEntries()`, and `buildOrders()` output, then renders reusable manifest-node builders into `orders-all-states.json`. Remote event artwork is fetched once and embedded as base64 so the JSON satisfies the manifest image contract.

**Tech Stack:** Node.js ESM, `esbuild`, `qrcode`, JSON, Pantograph manifest node vocabulary.

## Global constraints

- Emit only the Orders module: overview, order details, and interactions owned by Orders.
- Transcribe implemented copy and source-derived seed data; do not invent product behavior.
- Never use node-level `x` or `y`; use auto-layout nesting, padding, gaps, and alignment.
- Keep `ord-gear-001` hidden from overview screens but include its direct-detail screen because the source preserves that route.
- Include both the generator and generated JSON.
- Do not modify or stage unrelated dirty-worktree files.

---

### Task 1: Build the source-backed generator

**Files:**
- Create: `design-manifests/generate-orders-all-states.mjs`

**Interfaces:**
- Consumes: `src/app/data/tickets.ts`, `src/app/pages/OrdersPage.tsx`, `src/app/data/orderPricing.js`, and the source image URLs.
- Produces: `buildManifest()` and a CLI that writes `design-manifests/orders-all-states.json`.

- [x] **Step 1: Resolve current source state data.** Compile the two TypeScript source entries in a temporary directory with `esbuild`, import the real exports, call `createRegistrationQueueEntries()`, call `buildOrders()`, and filter only at the same `TEMPORARILY_HIDDEN_ORDER_IDS` boundary used by `OrdersPage`.
- [x] **Step 2: Define reusable manifest builders.** Add constructors for text, rows, stacks, rules, buttons, pills, icons, order cards, cover panels, registration states, team player rows, merchandise/refund blocks, payment summaries, dialogs, sheets, QR viewers, and organizer contact content.
- [x] **Step 3: Define stable screens.** Emit overview `All`, `Pending`, `Complete`, and the source empty-list branch; detail screens for three-event, pending team, ready team, mixed access, prior mixed access, released team, released multiple entries, refunded merchandise, shipped merchandise direct detail, and not-found; interaction screens for share menu, email review, bulk email review, Guest QR, Passport QR, remove-player dialog, and contact organizer.
- [x] **Step 4: Embed valid media.** Fetch each unique remote event image once, preserve source-provided data URLs, read local empty-state PNGs, and generate deterministic QR PNGs with `qrcode`. Use a theme-panel fallback when a remote fetch fails and record that condition in metadata.

### Task 2: Generate and inspect the manifest

**Files:**
- Create: `design-manifests/orders-all-states.json`

**Interfaces:**
- Consumes: `design-manifests/generate-orders-all-states.mjs`.
- Produces: a Pantograph v0.2 JSON manifest with stable screen names and complete `meta`, `theme`, `source`, `findings`, and `skipped` fields.

- [x] **Step 1: Run the generator.** Run `node design-manifests/generate-orders-all-states.mjs` from the repository root.
- [x] **Step 2: Parse and validate the output.** Confirm valid JSON, 22 unique screens, every screen has a source and positive size, all `image.src` values are base64/data URLs, and no node object contains `x` or `y` layout keys.
- [x] **Step 3: Verify source-derived counts.** Confirm the generated metadata records 15 built orders, 14 visible overview orders, and 7 Pending / 7 Complete visible tabs from the current source. Do not substitute stale documentation counts.

### Task 3: Verify the artifact against the running app

**Files:**
- No application source changes.

**Interfaces:**
- Consumes: generated JSON and the running Vite app.
- Produces: verification evidence for route text, order detail reachability, and source health.

- [x] **Step 1: Run the repository build.** Run `npm run build` and inspect the exit code.
- [x] **Step 2: Run the focused Orders test.** Run `node --test tests/orders-ui-consistency.test.mjs` and record the exact result.
- [x] **Step 3: Browser-check the key routes.** At desktop width, verify `/orders`, `/orders/tkt-013`, `/orders/tkt-011`, `/orders/ord-gear-001`, and `/orders/missing`; at mobile width, verify no horizontal overflow on overview and representative detail routes.
- [x] **Step 4: Look for the Pantograph checker.** Search the plugin checkout and workspace for `tools/check.js` or `dist/pantograph-check.js`. If absent, state that the manifest is locally schema-checked but not Pantograph-engine checked.
