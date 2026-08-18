# Bulk Email Event Grouping Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the bulk email review group eligible recipients by their actual event, keep counts at the event-group level, and remove redundant summary decoration and the eligibility checkmark.

**Architecture:** Add one pure grouping selector to the existing form-sharing data module, then have `BulkEmailReviewSheet` render its editable draft entries through that selector. The sheet keeps its current modal shell, draft state, validation, and send payload; only the context and recipient composition change.

**Tech Stack:** JavaScript data helpers, React, TypeScript, Tailwind CSS, Motion, Node test runner

## Global Constraints

- Derive groups from eligible `entries`, never `order.name` or all order events.
- Group by `entry.ticket.id`, preserve first occurrence order, and preserve recipient order.
- Do not add a separate `Event`/`Events` eyebrow or total-recipient summary above the event groups.
- Use `Send invite` for one recipient and `Send <N> invites` for several.
- Keep the eligibility note text but render no checkmark or leading decoration.
- Preserve `getBulkEmailCandidates`, `emailDrafts`, `allEmailsValid`, `onSend(draftEntries)`, Cancel, close, and overlay behavior.
- Do not add dependencies, routes, schema changes, or unrelated refactors.
- Preserve unrelated dirty-worktree changes and do not stage or commit this work.

---

### Task 1: Add the eligible-entry event grouping selector

**Files:**
- Modify: `src/app/data/formLinks.js`
- Modify: `tests/order-form-sharing.test.mjs`

**Interfaces:**
- Consumes: an ordered array of entries containing `id`, `ticket.id`, and `ticket.eventTitle`.
- Produces: `groupBulkEmailEntriesByEvent(entries)` returning ordered `{ id, title, entries }` groups.

- [x] **Step 1: Write the failing grouping test**

Extend the existing `formLinks` destructure with `groupBulkEmailEntriesByEvent` and add a fixture whose order is event A, event B, event A. Assert that the helper is a function, returns two groups in A/B order, keeps both A recipients together in their original order, and falls back to `Event` for an empty title.

```js
test('bulk email entries group by event while preserving event and recipient order', () => {
  assert.equal(typeof groupBulkEmailEntriesByEvent, 'function');

  const grouped = groupBulkEmailEntriesByEvent([
    { id: 'a-1', ticket: { id: 'event-a', eventTitle: 'Emerald Pickleball Cup' } },
    { id: 'b-1', ticket: { id: 'event-b', eventTitle: '' } },
    { id: 'a-2', ticket: { id: 'event-a', eventTitle: 'Emerald Pickleball Cup' } },
  ]);

  assert.deepEqual(grouped.map((group) => ({
    id: group.id,
    title: group.title,
    entryIds: group.entries.map((entry) => entry.id),
  })), [
    { id: 'event-a', title: 'Emerald Pickleball Cup', entryIds: ['a-1', 'a-2'] },
    { id: 'event-b', title: 'Event', entryIds: ['b-1'] },
  ]);
});
```

- [x] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/order-form-sharing.test.mjs`

Expected: FAIL because `groupBulkEmailEntriesByEvent` is undefined.

- [x] **Step 3: Implement the selector**

```js
export function groupBulkEmailEntriesByEvent(entries = []) {
  const groups = [];
  const groupsById = new Map();

  entries.forEach((entry) => {
    const eventId = entry.ticket?.id || entry.id;
    let group = groupsById.get(eventId);

    if (!group) {
      group = {
        id: eventId,
        title: entry.ticket?.eventTitle?.trim() || 'Event',
        entries: [],
      };
      groupsById.set(eventId, group);
      groups.push(group);
    }

    group.entries.push(entry);
  });

  return groups;
}
```

- [x] **Step 4: Run the focused test and verify GREEN**

Run: `node --test tests/order-form-sharing.test.mjs`

Expected: all tests in the file pass.

### Task 2: Render event-grouped recipients in the review sheet

**Files:**
- Modify: `src/app/pages/OrdersPage.tsx:906-1060`
- Modify: `tests/order-form-sharing.test.mjs`
- Modify: `tests/orders-ui-consistency.test.mjs`

**Interfaces:**
- Consumes: `groupBulkEmailEntriesByEvent(draftEntries)` and the existing bulk review props excluding the now-unused `order` prop.
- Produces: `bulk-email-event-groups`, per-event headers/counts, editable recipient rows, and count-aware Send copy.

- [x] **Step 1: Write failing sheet composition tests**

Update the source-contract assertions so the bulk review must import and call `groupBulkEmailEntriesByEvent`, must not render `order.name` or a separate event-summary row, must render per-group counts, must map `group.entries`, and must not render `<Check` inside `BulkEmailReviewSheet`.

```js
assert.match(reviewSource, /const eventGroups = groupBulkEmailEntriesByEvent\(draftEntries\)/);
assert.doesNotMatch(reviewSource, /data-testid="bulk-email-event-summary"/);
assert.match(reviewSource, /data-testid="bulk-email-event-groups"/);
assert.match(reviewSource, /group\.entries\.length\} recipient/);
assert.match(reviewSource, /group\.entries\.map/);
assert.doesNotMatch(reviewSource, /order\.name|<Check/);
assert.match(reviewSource, /entries\.length === 1 \? 'Send invite' : `Send \$\{entries\.length\} invites`/);
```

- [x] **Step 2: Run the focused tests and verify RED**

Run: `node --test tests/order-form-sharing.test.mjs tests/orders-ui-consistency.test.mjs`

Expected: FAIL because the sheet still renders the order aggregate, one flat recipient list, the eligibility checkmark, and the old Send label.

- [x] **Step 3: Implement the grouped sheet**

- Import `groupBulkEmailEntriesByEvent` from `formLinks.js`.
- Remove the unused `order` prop from `BulkEmailReviewSheet` and its call site.
- Compute `const eventGroups = groupBulkEmailEntriesByEvent(draftEntries);`.
- Omit the order-level summary row so the first event group follows the sheet header directly.
- Map event groups into softly tinted event headers and their existing email inputs.
- Replace the decorated eligibility container with a plain text paragraph.
- Render `{entries.length === 1 ? 'Send invite' : `Send ${entries.length} invites`}` inside the existing primary button.

Use this event-group structure inside the existing scrollable sheet body:

```tsx
const eventGroups = groupBulkEmailEntriesByEvent(draftEntries);

<div data-testid="bulk-email-event-groups">
  {eventGroups.map((group) => (
    <section key={group.id}>
      <div>
        <h3>{group.title}</h3>
        <span>{group.entries.length} recipient{group.entries.length === 1 ? '' : 's'}</span>
      </div>
      <div>
        {group.entries.map((entry, index) => {
          const label = entry.participantLabel || entry.participantName || `Player ${index + 1}`;
          return (
            <label key={entry.id}>
              <span>{label}</span>
              <input
                type="email"
                value={entry.attendeeEmail}
                onChange={(event) => setEmailDrafts((current) => ({ ...current, [entry.id]: event.target.value }))}
                aria-label={`${label} email`}
              />
            </label>
          );
        })}
      </div>
    </section>
  ))}
</div>
<p id="bulk-email-eligibility-note" data-testid="bulk-email-eligibility-note">
  Only unsent forms without Passport or Guest QR access are included.
</p>
```

- [x] **Step 4: Run focused tests and verify GREEN**

Run: `node --test tests/order-form-sharing.test.mjs tests/orders-ui-consistency.test.mjs`

Expected: both files pass with no warnings or errors.

- [x] **Step 5: Verify repository and live behavior**

Run `node --test --test-reporter=dot tests/*.test.mjs`, `npm run build`, and focused `git diff --check`. Browser-check `/orders/tkt-001` at `400 × 964`: the sheet must begin with `Emerald Pickleball Cup` and its `1 recipient` group count, with no `EVENT` eyebrow, total-recipient chip, order aggregate, checkmark, overflow, or browser warning/error logs; valid/invalid Send behavior and Cancel/close must still work.

Expected: all checks pass and the live sheet remains functional.
