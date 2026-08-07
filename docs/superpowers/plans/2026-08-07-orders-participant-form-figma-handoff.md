# Orders and Participant Form Figma Handoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Put the current Orders and participant-form route families into the supplied Figma design file as 393px-wide mobile-only editable frames with connected state transitions.

**Architecture:** Use the running React/Vite app as the visual source of truth. Capture each approved route state into the existing Figma file for pixel reference, then retain cleaned editable layer trees with native text, shapes, vectors, imagery, components, and prototype links. Keep all source changes temporary and remove capture hooks and local artifacts before handoff.

**Tech Stack:** React/TypeScript/Vite source, Playwright or the connected browser for 393px route verification, Figma `generate_figma_design` for live capture, Figma `use_figma` for editable-layer cleanup and prototyping, Figma metadata/screenshot verification, Git for the spec/plan only.

## Global Constraints

- Target file is `ZOaDqfYD1FKadGrrrzxGGS`, starting at node `12284:37`.
- Every delivered screen frame is exactly `393px` wide and mobile-only.
- The delivered Figma content must use editable layers; screenshot-only image frames are not acceptable.
- The source route scope is `/orders`, `/orders/:orderId`, and `/orders/:ticketId/form`.
- Full screens for Passport, Guest QR, event detail, inbox/help, or receipt destinations are out of scope; their in-scope actions receive outbound route labels/connections.
- Use the current source copy and app-representable states. Do not invent hidden backend states or imply Passport ownership from email alone.
- Preserve the existing dirty worktree. Do not stage or modify unrelated user files.
- Temporary `index.html` capture hooks, capture-only query branches, generated local files, and the dev server must be removed/stopped and verified absent before completion.
- Validate visually and structurally; a successful build or capture alone is insufficient.

---

### Task 1: Inspect the target Figma area and capture conventions

**Files:**
- Read: `src/app/pages/OrdersPage.tsx`
- Read: `src/app/pages/ParticipantFormPage.tsx`
- Read: `src/app/routes/ParticipantFormRoute.tsx`
- Read: `src/app/data/tickets.ts`
- Read: `src/app/data/formLinks.js`
- Read: `src/app/data/teamAccess.js`
- Figma: target file `ZOaDqfYD1FKadGrrrzxGGS`, node `12284:37`

**Interfaces:**
- Consumes: the approved screen inventory in `docs/superpowers/specs/2026-08-07-orders-participant-form-figma-design.md`.
- Produces: the target page/section IDs, existing naming conventions, design-system/component map, source font, and a final capture manifest.

- [ ] **Step 1: Read the current source route and state branches**

Run:

```bash
rg -n "activeFilter|OrderDetailPage|RegistrationItem|TeamRegistrationItem|EmailReviewSheet|BulkEmailReviewSheet|RemoveConfirmDialog|subView|submitted|inviteConflict|inviteLinkRevoked|viewingIdx|reminderFor|teamEntryOwner|newPlayer|resubmission" \
  src/app/pages/OrdersPage.tsx src/app/pages/ParticipantFormPage.tsx src/app/routes/ParticipantFormRoute.tsx
```

Expected: the output identifies every persistent route state and overlay in the spec without adding a new state family.

- [ ] **Step 2: Inspect the target Figma file read-only**

Use Figma metadata/read tools against file key `ZOaDqfYD1FKadGrrrzxGGS` and node `12284:37` to record:

```text
target file type, page name, node type/name/size, sibling frames, existing section names, existing component instances, local/remote variables, text/effect styles, and product font families
```

Do not mutate the canvas during this task step. If the target node is a section or frame, preserve its existing content and choose a clearly named sibling section for the new handoff unless the file's conventions indicate that `12284:37` is the intended insertion point.

- [ ] **Step 3: Resolve the product font before any native text creation**

Confirm the font from `src/styles/fonts.css`, `src/styles/index.css`, and existing Figma text styles. Query available Figma fonts before creating text nodes; do not guess a style name.

- [ ] **Step 4: Save the source-to-frame capture manifest**

Use these frame IDs/routes as the starting manifest, adding only source-confirmed variants discovered in the read-only pass:

```text
Orders / 01 — All
Orders / 02 — Pending
Orders / 03 — Complete
Orders / 04 — Filtered empty
Orders / Detail — Single ready
Orders / Detail — Mixed registration
Orders / Detail — Prior pending registration
Orders / Detail — Team pending roster
Orders / Detail — Team mixed Passport and Guest QR
Orders / Detail — Resubmit required
Orders / Detail — Released
Orders / Detail — Merchandise or refund
Orders / Detail — Not found
Orders / Overlay — Email review
Orders / Overlay — Bulk email review
Orders / Overlay — Remove player confirmation
Forms / Single — Blank or partially filled
Forms / Single — Completed success
Forms / Single — Send form
Forms / Multiple — Participant manager
Forms / Multiple — Pending invite
Forms / Multiple — Completed participant
Forms / Multiple — Send all
Forms / Team — Player manager
Forms / Team — Passport ownership choice
Forms / Team — Guest QR ownership choice
Forms / Team — Locked completed player
Forms / Team — New player
Forms / Team — Remove player confirmation
Forms / Resubmission — Prefilled update
Forms / Invite — Normal shared form
Forms / Invite — Success
Forms / Invite — Conflict with preserved answers
Forms / Invite — Revoked link
Forms / Overlay — Reminder
Forms / Overlay — View form
```

- [ ] **Step 5: Validate the manifest against source data**

Confirm that each order-detail state maps to an actual `MY_TICKETS`/context state such as `tkt-011`, `tkt-012`, `tkt-013`, `tkt-014`, released entries, or the actual refund/merchandise records. Do not create a frame whose copy or status cannot be rendered by the current route.

### Task 2: Verify and prepare the live 393px source routes

**Files:**
- Modify temporarily: `index.html` only if the capture workflow requires the HTML-to-design script.
- Read/verify: `src/app/pages/OrdersPage.tsx`, `src/app/pages/ParticipantFormPage.tsx`, `src/app/routes/ParticipantFormRoute.tsx`
- Create temporarily: no committed files; any screenshot manifest must live outside the repo or be deleted before completion.

**Interfaces:**
- Consumes: Task 1 capture manifest.
- Produces: browser-verified URLs/state controls and a running local source suitable for capture.

- [ ] **Step 1: Check the existing dev-server state**

Run:

```bash
lsof -nP -iTCP:5173 -sTCP:LISTEN || true
```

Use an existing compatible server if it is already serving this workspace; otherwise start the app with:

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

Keep the server process/session ID so it can be stopped later.

- [ ] **Step 2: Verify the base route at 393px**

Open `http://127.0.0.1:5173/orders` in the connected browser or Playwright context with viewport width `393` and a mobile-height viewport. Confirm the current header, filter tabs, order cards, bottom navigation, image loading, font rendering, and console health.

- [ ] **Step 3: Verify representative detail routes**

Open the source-confirmed order IDs for a single ready order, mixed order, pending team order, and mixed team ownership order. Confirm the visible cards, buttons, state labels, and route transitions:

```text
/orders/<single-ready-id>
/orders/tkt-011
/orders/tkt-013
/orders/tkt-014
```

If an ID has changed in current data, use the exact ID discovered in Task 1 and record the replacement in the manifest.

- [ ] **Step 4: Verify participant form entry routes**

Open representative paths for the current single, multiple, team/player, new-player, resubmission, and invite modes. Confirm that the route selects the intended participant and that `/orders/:ticketId/form` redirects away when a multi/team form is opened without a participant, as the source requires.

- [ ] **Step 5: Record browser issues before capture**

If a source state cannot be reached through the current app without a temporary state selector, document the exact route/query/context requirement in the manifest. Do not silently invent a capture-only product state; use the current app's preview/data mechanisms or omit the state with an explicit reason.

### Task 3: Capture the live route states into the existing Figma file

**Files:**
- Temporarily modify: `index.html` if required by `generate_figma_design`.
- Temporary generated output: Figma capture nodes in the target file; these are reference material until Task 4.

**Interfaces:**
- Consumes: the verified browser routes and state manifest from Tasks 1–2.
- Produces: one completed capture per manifest screen in file `ZOaDqfYD1FKadGrrrzxGGS`, with capture IDs polled to completion.

- [ ] **Step 1: Add the capture hook only when needed**

Insert the exact HTML-to-design script required by the capture tool into `index.html`, preserving the existing file formatting and making no other source changes. Confirm the injection with:

```bash
rg -n "html-to-design/capture\.js" index.html
```

- [ ] **Step 2: Start one capture per source page/state**

For each unique browser state, call `figma_generate_figma_design` with:

```json
{
  "fileKey": "ZOaDqfYD1FKadGrrrzxGGS",
  "url": "http://127.0.0.1:5173/<verified-route-and-query>",
  "captureId": "<omit on first call>"
}
```

Use the returned capture ID exactly once for polling. Keep each route at 393px width and use a page/state-specific capture so the output does not wrap multiple screens into one oversized viewport frame.

- [ ] **Step 3: Poll every capture to completion**

Poll each capture ID every few seconds until it returns `status: completed`; record the resulting top-level node ID and the source route/state name. A capture that remains processing is not a completed screen.

- [ ] **Step 4: Visually compare representative capture output**

Use Figma screenshots for the first, middle, and last capture in each section. Check that the viewport is mobile-only, the bottom navigation is present where the route uses it, images loaded, and no desktop layout or capture wrapper was imported.

### Task 4: Build the editable Figma screen set

**Files:**
- Figma target file `ZOaDqfYD1FKadGrrrzxGGS`.
- No committed source-file changes.

**Interfaces:**
- Consumes: Task 3 capture node IDs, Task 1 target conventions, and the `figma-use`/`figma-generate-design` component and token map.
- Produces: named 393px editable frames, repeated native components/instances, and a stable section hierarchy.

- [ ] **Step 1: Create the wrapper section/frame before child nodes**

Use `use_figma` with `skillNames` containing both `figma-use` and `figma-generate-design`. Create a new section or wrapper at clear canvas coordinates near the approved target node, name it `Orders & Participant Forms / 393px`, and return every created node ID. Do not build top-level screen frames first and reparent them later.

- [ ] **Step 2: Create the screen frame shells**

Create one native top-level frame per manifest item with width `393`, a fixed mobile viewport surface, source-matching background, route/state name, and an internal `Screen content` auto-layout frame. Return all frame IDs. Use at most ten logical operations per `use_figma` call and split the work into multiple calls.

- [ ] **Step 3: Rebuild repeated controls as native editable pieces**

Use the target file's existing components/variables/styles when available. For uncovered repeated pieces, create local native components for the shared button, filter tab, order card, registration header, state panel, participant row, input field, bottom navigation, and modal shell. Place instances into the screen frames rather than duplicating unrelated one-off primitives.

- [ ] **Step 4: Transfer source imagery as editable image fills**

For each image present in the capture, read the capture fill's `imageHash`, apply that hash to the matching native image frame, and return the mutated node IDs. Do not leave blank image placeholders and do not keep the capture frame solely for its image fill.

- [ ] **Step 5: Populate each section incrementally**

Build in this order and validate after each batch:

```text
Orders overview → Order detail → Participant forms → overlays → interaction ledger
```

Every text mutation must load and await the verified source font. Wrapping text must use explicit width plus `textAutoResize = 'HEIGHT'`; all related children must be inside auto-layout parents. Return every created/mutated node ID from each call.

- [ ] **Step 6: Compare native frames against capture references**

For each section, screenshot the native frame and compare it to the corresponding capture. Fix only targeted differences: text truncation, incorrect font, missing images, wrong spacing, wrong state tone, missing navigation, or incorrect card/action order.

- [ ] **Step 7: Delete temporary capture reference nodes after parity**

Once native frames match the live captures, remove only the temporary capture output nodes. Keep the cleaned native section and return all deleted/mutated IDs for audit. If a capture node contains an image hash still needed by a native frame, transfer the hash before deletion.

### Task 5: Add Figma prototype interactions and state annotations

**Files:**
- Figma target file `ZOaDqfYD1FKadGrrrzxGGS`.
- No committed source-file changes.

**Interfaces:**
- Consumes: native frame IDs from Task 4.
- Produces: prototype connections for all in-scope state-changing interactions and an editable interaction ledger.

- [ ] **Step 1: Connect Orders overview states**

Add `ON_CLICK` or equivalent prototype links for All/Pending/Complete tabs, filtered-empty recovery, and every order card to its matching detail frame. Preserve the source action labels.

- [ ] **Step 2: Connect Order detail actions**

Connect Fill up/View form, Send link, Email all, Copy link, Copy all, Revoke, Resend, Undo, Change email, Add player, Remove, View QR/Generate QR, Review changes, Check if slots available, Download receipt, and Get help to the next in-scope state or overlay. Use outbound route annotations for destinations outside this handoff.

- [ ] **Step 3: Connect participant-form navigation**

Connect participant/player tabs, Fill details, Send form, Send all, ownership selection, Add player, Remove, View, Reminder, Resend, Change email, Undo, Save, Submit, Next incomplete, Back, Go to Orders, and Copy my answers. Use overlay presentation for dialogs/sheets and preserve the visible current screen underneath.

- [ ] **Step 4: Add an editable interaction ledger**

Create a small native table/frame listing `Source frame`, `Trigger`, `Target frame or outbound route`, and `State represented`. Include only interactions actually present in the source; no invented backend transitions.

- [ ] **Step 5: Validate prototype link coverage**

Use Figma metadata to inspect reactions on representative overview, detail, form, and overlay frames. Confirm there are no links pointing to deleted capture nodes.

### Task 6: Final verification and cleanup

**Files:**
- Temporarily modified: `index.html` (must be restored).
- Temporary server/process and any capture artifacts (must be removed/stopped).
- Figma target file remains the intended external deliverable.

**Interfaces:**
- Consumes: completed native frame set and prototype graph from Tasks 4–5.
- Produces: verified Figma handoff and a clean local workspace apart from the user's pre-existing changes.

- [ ] **Step 1: Verify Figma frame inventory and dimensions**

Use Figma metadata to assert that every manifest frame exists, has width `393`, has editable child text/shape/vector/component nodes, and is in the intended section. Verify representative first/middle/last frames in each section.

- [ ] **Step 2: Verify screenshots at mobile width**

Screenshot representative overview, order detail, team, form, overlay, success, conflict, and not-found frames. Check for clipped text, overlap, missing images, wrong fonts, horizontal overflow, or hidden bottom actions.

- [ ] **Step 3: Verify local source cleanup**

Run:

```bash
rg -n "html-to-design|captureMode|capture=conflict|figmacapture" index.html src tests || true
git status --short
```

Expected: no temporary capture hook/branch remains; the only tracked changes attributable to this task are the committed spec and plan files, while unrelated pre-existing changes remain unmodified.

- [ ] **Step 4: Stop the local server and confirm the port is free**

Stop only the server process started for this handoff, then run:

```bash
lsof -nP -iTCP:5173 -sTCP:LISTEN || true
```

Expected: no handoff server is listening on port `5173`.

- [ ] **Step 5: Run proportionate source verification**

Run:

```bash
node --test tests/*.test.mjs
npm run build
git diff --check
```

Expected: existing tests pass, the Vite build succeeds, and diff check reports no whitespace errors. Do not use build success as a substitute for Figma screenshot/metadata verification.

