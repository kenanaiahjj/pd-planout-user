# Native Mobile Fields Design

## Goal

Remove every simulated iOS keyboard from the PlanOut prototype and make every customer-facing field usable with the browser and operating system's native mobile keyboard without hiding the focused control, surrounding guidance, or completion actions.

## Scope

This change covers all customer-facing editable controls in the application: login and OTP, onboarding, event and location search, cart and checkout, Orders invite sheets, participant forms, Guest Entry and scanner recovery, profile and account settings, organizer forms, reviews, Messenger, certificates, contact connection, filters, and other visible text, email, telephone, numeric, date, textarea, select, and file-upload controls.

The work does not redesign form copy or visual styling. Existing uncommitted Orders, participant-form, shared-field, and test changes must be preserved.

## Architecture

### Remove the simulation at its global boundary

Delete `src/app/components/IOSKeyboard.tsx`. Remove its import, mount, and explanatory comments from `src/app/layouts/AppProviderLayout.tsx`. Remove tests that load or assert simulator behavior. No query-string flag, local-storage setting, fake key event, fixed keyboard overlay, or simulator-only focus listener will remain.

Real keyboard accommodation is not simulation. Existing `window.visualViewport` behavior in native mobile sheets remains and may be generalized where a fixed overlay needs to react to the actual visible viewport.

### Establish a native mobile field contract

All customer-facing fields must satisfy these rules:

- Use the native HTML control appropriate to the value.
- Provide the correct `type`, `inputMode`, `autoComplete`, and `enterKeyHint` when the field's semantics are known.
- Use at least `16px` text on narrow viewports so focusing a field does not trigger iOS page zoom.
- Provide at least a `44px` interactive height or equivalent touch area.
- Fit within the viewport using `width: 100%`, `min-width: 0`, and wrapping grid/flex parents where necessary.
- Keep visible focus styling and preserve semantic labels and keyboard order.
- Give focused controls scroll clearance through shared `scroll-margin` behavior.
- Allow surrounding pages, sheets, and dialogs to scroll when the visible viewport becomes shorter.
- Keep fixed actions above `env(safe-area-inset-bottom)` and avoid fixed widgets covering active forms.

Shared behavior belongs in the shared field components and global mobile CSS. Route-specific fixes are limited to controls or containers that cannot consume the shared contract.

### Responsive containers

Full-screen and fixed form surfaces use dynamic or small viewport units rather than assuming a static `100vh`. Dialog bodies and sheets use bounded height plus internal `overflow-y: auto`. Native-keyboard-aware overlays may use `window.visualViewport` to calculate the visible height or lower inset, but they must not fabricate keyboard dimensions.

No global focus handler will force animated scrolling. Native browser behavior plus CSS scroll clearance is the default; JavaScript focus positioning is allowed only inside a constrained overlay where the browser cannot expose the focused field reliably.

## Testing

### Source and automated coverage

- Assert that `IOSKeyboard`, its storage key, its query flags, and simulator-specific tests are absent.
- Add focused source or behavioral tests for the shared mobile field contract.
- Preserve and run all existing tests.
- Run the production build and `git diff --check`.

### Mobile route verification

Exercise customer-facing fields at `393x852` and `320x568`. For every surface, open the field, focus it, enter or edit a value, and reach its associated next, submit, send, save, or close action. Check that:

- No fake keyboard is rendered.
- No horizontal document overflow appears.
- The focused field remains within the visible viewport after a mobile-height reduction.
- The surface can scroll far enough to reach guidance, validation, and actions.
- Fixed navigation, floating widgets, or safe-area padding do not cover the field or action.
- Email, phone, numeric, search, OTP, and multiline controls retain appropriate native semantics.

Repeat representative desktop checks to ensure mobile hardening does not regress the desktop layouts.

## Completion Criteria

The task is complete when the simulator is entirely removed, every customer-facing editable surface passes the two mobile viewport checks, all automated tests and the production build pass, no task-related horizontal overflow or hidden action remains, and the current unrelated working-tree changes are intact.
