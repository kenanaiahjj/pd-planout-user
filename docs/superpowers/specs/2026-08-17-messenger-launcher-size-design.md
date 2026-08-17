# Messenger Launcher Size Adjustment

## Goal

Reduce the visible Messenger launcher artwork without weakening its mobile usability.

## Decision

- Keep the launcher button at 48×48px so the tap target remains comfortably accessible.
- Render the transparent Messenger artwork at exactly 40×40px, centered inside the button.
- Keep the unread badge positioned relative to the 48px button so it remains legible and does not cover the logo.
- Preserve the transparent background, shadow, focus ring, hover, pressed feedback, position, and panel behavior.

## Alternatives considered

- A 40×40px button and logo would match the requested visual size but create an undersized tap target.
- A 44×44px button and logo would remain usable but would not reduce the visual weight enough.

## Verification

- The source contract distinguishes the 48px button from the 40px artwork.
- The Passport mobile view shows the smaller artwork with the same placement and unread behavior.
- Focused tests, the full test suite, and the production build pass.
