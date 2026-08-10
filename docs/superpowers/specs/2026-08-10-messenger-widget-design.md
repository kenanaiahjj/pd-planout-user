# Meta Messenger Widget Design

## Goal

Give authenticated PlanOut prototype screens a persistent Meta Messenger-style contact affordance without adding a real Messenger integration.

## User-visible behavior

1. On most authenticated routes, a floating blue Messenger button appears at the bottom-right of the viewport.
2. The button is hidden on the full-screen Passport QR scanner so that scanner controls remain the only focused action. Login and other unauthenticated routes do not render the authenticated app shell.
3. Activating the button opens an in-place popover. It does not navigate away from the current screen or call an external service.
4. The popover is labeled `PlanOut Messenger`, shows an online/availability cue, and contains a short mock support conversation.
5. Three quick-reply buttons append a local user message and canned PlanOut response. This is intentionally ephemeral prototype state and is not persisted.
6. The composer is visual-only and explicitly identifies the interaction as a prototype; no network request or Meta SDK is used.
7. The popover can be closed with the close button, the floating trigger, or Escape. The trigger and dialog controls expose accessible labels.

## Architecture

- Add `src/app/components/MessengerWidget.tsx` as the single reusable component. It owns open/closed state and the ephemeral quick-reply conversation state.
- Mount the widget once from `src/app/layouts/RootLayout.tsx` when `isAuthenticated && !useFullScreenOverlay`. Rendering it from the shared layout makes it available across home, events, detail, orders, Passport, settings, cart, checkout, and related authenticated screens without page-level duplication.
- Keep the widget below existing full-screen drawers (`DrawerPanel` uses `z-[70]`) and above the bottom navigation/notification affordances. Use responsive safe-area-aware offsets so the mobile button clears the bottom nav and, when present, the existing pending-form `FloatCard`.
- Use the existing React, Tailwind, `lucide-react`, and `motion/react` dependencies. The Messenger cue uses a blue gradient and a simple white chat/lightning mark; it does not depend on a remote logo asset.

## Visual and interaction details

- Closed trigger: 56px circular blue gradient button, subtle elevation, hover/press scale feedback, and an `Open Messenger` accessible label.
- Open panel: responsive card capped at approximately 360px wide, with a blue Messenger header, close control, status line, neutral conversation surface, rounded message bubbles, quick replies, and a disabled prototype composer.
- On narrow screens, the panel is constrained to the viewport width and height so it never covers the entire app or becomes taller than the available visual viewport.
- Motion is short and opacity/transform-based, with reduced-motion support. The popover does not add a blocking backdrop.

## Error and edge states

- There are no network or authentication errors because this is a local-only prototype.
- Quick replies remain available after each canned response; repeated taps replace the previous ephemeral exchange rather than growing an unbounded transcript.
- If a drawer or full-screen overlay is open, existing stacking order determines that surface remains in front of the widget.

## Verification

- Run `npm run build`.
- Run a browser smoke check on `/`, `/events`, `/orders`, `/passport`, `/settings`, and an event detail route to confirm the trigger is present and does not change route state.
- Click the trigger, verify the popover and quick replies, close it with the trigger and Escape, and confirm the mobile position clears the bottom nav.
- Verify `/passport/add-entry` does not show the widget and inspect the browser console for new errors.
- Confirm the diff contains only the new widget, its RootLayout mount, and this spec; existing unrelated worktree changes remain untouched.
