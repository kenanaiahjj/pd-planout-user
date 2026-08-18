# Login Identifier Autodetection Design

## Goal

Remove the explicit Email/Phone selector from the PlanOut login screen and let the single identifier field determine the login channel as the user types, without changing the existing two-step OTP flow or login callback contract.

## Approved behavior

- The login screen has one identifier field with no segmented Email/Phone control.
- An empty field uses the neutral placeholder `Email or phone number`.
- The detector trims leading/trailing whitespace and returns:
  - `phone` when the first meaningful character is a digit, `+`, or `(` and the value has not become email-like.
  - `email` when the value contains `@` or any alphabetic character.
  - `null` when the field is empty.
- The field's icon and mobile input mode update live as the detected channel changes.
- The field remains a plain text input so mixed entry does not trigger browser-side email validation while the user is typing.
- Continue remains enabled for any non-empty identifier, preserving the current prototype behavior; this change does not add format validation.
- When Continue is pressed, the trimmed identifier and detected method are snapshotted for the OTP step. OTP masking, the Change action, and `onLoginComplete(method, value)` all use that snapshot.
- Returning from OTP to the identifier step keeps the entered value editable and allows the channel to be detected again.

## Alternatives considered

### Keep two values and auto-switch between them

This would minimize changes to the existing state variables, but it would retain two sources of truth and could preserve a stale email or phone value when the user changes channels. It is rejected for unnecessary state complexity.

### Detect only when Continue is pressed

This would be the smallest code change, but it would not satisfy the requested live autodetection because the field would not communicate which channel it recognized while the user fills it.

## Architecture

- Add a small pure helper in `src/app/data/login.js` that owns the input classification rule and is independently unit-tested.
- Replace `inputMode`, `email`, and `phone` state in `LoginPage.tsx` with one raw identifier value and a snapshotted OTP target containing `{ method, value }`.
- Derive the live presentation method from the raw identifier. The component owns only presentation state; the helper owns classification.
- Keep `LoginRoute.tsx` unchanged. Its existing `onLoginComplete` callback already accepts the method/value pair required by the new flow.

## Interaction and accessibility

- Preserve the existing input focus behavior and Enter-to-continue interaction.
- Give the single input the accessible name `Email or phone number`.
- Keep the current visible focus treatment and button disabled state.
- Do not introduce a new focusable control where the selector was removed.
- Use the existing email and phone glyphs as decorative visual feedback; the accessible name remains stable while the visual treatment changes.

## Error and edge-case handling

- Whitespace-only input is treated as empty and cannot continue.
- A phone number may begin with `+`, `(`, or a digit, including partial input; no length or country validation is added.
- Values that start numerically but later contain `@` or letters switch to email mode immediately.
- Clearing the field removes channel-specific state from the presentation and returns to the neutral placeholder.
- No network behavior, OTP timing, resend behavior, social login behavior, or guest browsing behavior changes.

## Verification

- Add focused unit tests for empty, numeric, international, parenthesized, alphabetic, and email-address inputs.
- Run the focused login detector test and confirm it fails before the helper exists, then passes after implementation.
- Run the full Node test suite, production build, and `git diff --check`.
- Browser-check `/login` at mobile width: confirm the selector is gone, numeric input switches to phone treatment, email input switches to email treatment, Continue reaches OTP, and OTP completion still passes the correct method/value to the route.

