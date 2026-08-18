# Settings Apple + Luma Redesign

## Goal

Make the authenticated `/settings` hub feel calm, native, and event-product focused: Apple-like in its grouped-list interaction model and Luma-like in its editorial restraint, while preserving every existing destination, organization action, and sign-out flow.

## Current problems

- The page repeats the account context in a profile card and a separate Organizations group.
- Nested rounded cards, colored icon tiles, pill badges, gradients, and large shadows make a simple settings hub feel decorative and AI-generated.
- Uppercase tracked section labels and dense helper copy add visual noise.
- Organization switching uses a full-screen rotating logo/ring, which is too theatrical for a short state change.
- Desktop uses two equally weighted columns even though the page is a single settings hierarchy.

## Design

### Page frame

- Keep the existing authenticated route and shell.
- Render one responsive column with a `max-width` of approximately `680px`; center it on desktop and give it 16px horizontal padding on mobile.
- Use the existing shell background, but make the settings surface itself plain and unboxed.
- Keep the header compact: back affordance, `Settings` title, and no explanatory subtitle on mobile. Desktop may retain one short supporting line, but it should not create a second visual hierarchy.

### Account identity

- Use one top identity row for the personal account: initials/avatar, display name, email or `Personal Account`, and a trailing chevron.
- Keep the row 56–64px tall with a subtle neutral surface and a single bottom rule rather than a floating card.
- Tapping the row still calls `onGoToProfile`.

### Grouped settings rows

- Use native-feeling grouped sections: a small sentence-case section title above a white/near-white list, 1px hairline separators between rows, and 48–56px touch targets.
- Use monochrome Lucide icons in a compact 28px leading column. PlanOut green is reserved for selected/active states and the primary account affordance; avoid rainbow icon backgrounds.
- Keep row labels and supporting values concise. Remove unnecessary descriptive copy where the label already explains the destination.
- Keep trailing chevrons and status values aligned to a fixed column.

### Workspaces / organizations

- Replace the duplicated quick-switch card and second organizations card with one `Workspaces` group.
- Render Personal Account first, then each organization, then pending applications when present, then `Create Organization` as a final action row.
- Active workspace uses a green checkmark and a lightly tinted row. Inactive workspaces use a plain chevron/switch affordance. Role and event count remain secondary metadata, not pills.
- Organization switching keeps the existing 1200ms mock transition and state updates, but displays a quiet centered “Switching to …” sheet with a simple progress indicator; remove the rotating logo ring and pulsing logo animation.

### Secondary groups

- `General`: My Account, Transactions, Inbox.
- `Support`: Help Center, Privacy Policy, Terms of Service.
- `About`: App Version as a non-interactive value row.
- `Prototype`: Passport Cases Board only when the callback exists.
- Sign out is a separate full-width destructive row with red text and no oversized filled card.

### Responsive behavior

- The same reading order is used at every width; no desktop-only duplicate content.
- At desktop, the centered column gains more breathing room but does not split into two unrelated columns.
- At mobile, rows remain at least 44px tall, labels do not truncate before the trailing action, and the bottom navigation remains unaffected.

### Accessibility and motion

- Every row remains a real button with an accessible name and visible focus ring.
- Color is not the only active-workspace signal; the check icon and text provide redundant state.
- Respect `prefers-reduced-motion`: the switching sheet fades in without rotation or scale choreography.
- Keep contrast at WCAG AA and maintain the existing sign-out confirmation dialog.

## Behavior and data flow

- Preserve `activeOrgId`, `handleSwitchOrg`, `pendingOrgApplication`, and all callback props in `SettingsPage`.
- Do not change route paths, context storage, organization mock data, or callback signatures.
- The only behavior change is presentation: active/inactive workspace state becomes easier to scan, and switching feedback becomes quieter.

## Verification

- Run the existing production build and record any baseline failures unrelated to this change.
- Add focused source assertions for required settings groups, callback wiring, 44px row sizing, and absence of the rotating switcher animation.
- If the local app can boot, verify `/settings` at a narrow mobile viewport and a desktop viewport; exercise My Account, organization switching, Create Organization, Passport Cases, and Sign Out confirmation.
- Check keyboard focus order, reduced-motion behavior, and horizontal overflow.
