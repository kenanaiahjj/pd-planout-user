# Meta Messenger Widget Design

## Goal

Give authenticated PlanOut prototype screens a persistent Meta Messenger-style contact affordance without adding a real Messenger integration.

## User-visible behavior

1. On most authenticated routes, a floating blue Messenger button appears at the bottom-right of the viewport.
2. The button is hidden on the full-screen Passport QR scanner so that scanner controls remain the only focused action. Login and other unauthenticated routes do not render the authenticated app shell.
3. Activating the button opens an in-place floating Messenger window. It does not navigate away from the current screen, take over the viewport, or call an external service.
4. The popover is labeled `PlanOut Messenger`, shows an online/availability cue, and contains a short mock support conversation.
5. Three quick-reply buttons append a local user message and simulated PlanOut response. A user can also submit free-form text and receives a local support-style response. While a reply is pending, the header and conversation show a typing state. If the window is closed when a reply arrives, the floating launcher shows an unread count until the conversation is opened. The conversation is ephemeral and is not persisted.
6. The composer and compact chat actions are presented as normal Messenger controls. The attachment menu opens photo/file choices, camera and photo launch the browser picker, emoji inserts into the composer, and a selected file appears as a removable attachment before sending. They remain local-only in the prototype; no network request or Meta SDK is used.
7. The window can be closed with the close button, the floating trigger, or Escape. The header keeps only chat details and close controls; call and video actions are not presented. The trigger and dialog controls expose accessible labels, including the unread count.

## Architecture

- Add `src/app/components/MessengerWidget.tsx` as the single reusable component. It owns open/closed state, the ephemeral conversation state, composer menus, pending attachment state, and simulated response timing.
- Mount the widget once from `src/app/layouts/RootLayout.tsx` when `isAuthenticated && !useFullScreenOverlay`. Rendering it from the shared layout makes it available across home, events, detail, orders, Passport, settings, cart, checkout, and related authenticated screens without page-level duplication.
- Keep the widget below existing full-screen drawers (`DrawerPanel` uses `z-[70]`) and above the bottom navigation/notification affordances. Use responsive safe-area-aware offsets so the mobile button clears the bottom nav and, when present, the existing pending-form `FloatCard`.
- Use the existing React, Tailwind, `lucide-react`, and `motion/react` dependencies. The Messenger cue uses a blue gradient and a simple white chat/lightning mark; it does not depend on a remote logo asset.

## Visual and interaction details

- Closed trigger: 56px circular blue gradient button, subtle elevation, hover/press scale feedback, and an `Open Messenger` accessible label.
- Open panel: a responsive floating window capped at approximately 400px wide, with full Messenger contact-header, thread, bubble, quick-reply, attachment/photo/emoji, and composer styling. The header status changes to `Typing…` while PlanOut prepares a reply.
- On narrow screens, the window remains a window constrained to the viewport width and available height; it never becomes a full-screen takeover of the app.
- Motion is short and opacity/transform-based, with reduced-motion support. The popover does not add a blocking backdrop.

## Error and edge states

- There are no network or authentication errors because this is a local-only prototype.
- Quick replies remain available after each simulated response, and the composer accepts free-form messages while a response is not pending.
- A reply received while the window is closed increments the launcher unread badge; opening the window clears the badge.
- If a drawer or full-screen overlay is open, existing stacking order determines that surface remains in front of the widget.

## Verification

- Run `npm run build`.
- Run a browser smoke check on `/`, `/events`, `/orders`, `/passport`, `/settings`, and an event detail route to confirm the trigger is present and does not change route state.
- Click the trigger, verify the popover and quick replies, close it with the trigger and Escape, and confirm the mobile position clears the bottom nav.
- Submit a free-form message, verify the local typing/reply state, open the attachment menu, insert an emoji, and confirm the compact composer actions remain local-only without leaving the route.
- Close the window while a response is pending, verify the launcher shows an unread badge after the response, reopen it, and confirm the badge clears.
- Verify `/passport/add-entry` does not show the widget and inspect the browser console for new errors.
- Confirm the diff contains only the new widget, its RootLayout mount, and this spec; existing unrelated worktree changes remain untouched.
