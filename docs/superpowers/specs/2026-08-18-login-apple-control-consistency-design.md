# Login Apple-Like Control Consistency Design

## Goal

Make the login screen feel like part of the same product as the rest of PlanOut by replacing its full-pill control treatment with the app's existing restrained rounded-rectangle language, while preserving the autodetected identifier flow and all login behavior.

## Approved direction

Use a calm, native rectangle treatment across every interactive login control:

- The identifier field, social login buttons, and OTP cells use a single visible surface with a 10px rounded rectangle, a quiet slate border, and no nested bezel.
- The Continue button uses a 12px rounded rectangle with the PlanOut green gradient from `#28b99e` to `#177564`, matching the app's normal button geometry rather than a full pill.
- All controls keep a minimum 44px touch target.
- Focus is communicated through the existing PlanOut green border/ring and a small surface tint; it does not rely on scale, bounce, glow, or animated effects. The Continue gradient is static.
- Press feedback is immediate and restrained: a small tonal change or shadow reduction, without a springy scale effect.
- The primary action keeps the shared PlanOut green gradient treatment as its visual anchor, but uses the approved rounded-rectangle geometry instead of a pill.
- The app's existing logo, background glows, hero panel, testimonial card, consent copy, and guest link are outside this control-consistency pass.

## Scope

### Identifier field

In `src/app/pages/LoginPage.tsx`, replace the current full-pill, double-layer field shell with one rounded-rectangle frame. Keep the single `identifier` value, live `detectLoginMethod` presentation, email/phone icons, `inputMode`, `autoComplete`, `enterKeyHint`, placeholder, and Enter-to-continue behavior unchanged.

### Continue action

In `src/app/pages/LoginPage.tsx`, remove the login-only `rounded-full` override from `PrimaryButton` and provide `brandGradient={{ from: '#28b99e', to: '#177564' }}` for the Continue action. Set `showShine={false}` and `pressScale={false}` on this instance so the gradient remains static and restrained; existing `PrimaryButton` callers keep their defaults. Preserve its disabled state, `handleContinue` callback, label, keyboard behavior, and existing button sizing.

### Social actions

In the local `SocialButton` component in `LoginPage.tsx`, replace the full-pill and gradient-shimmer surface with the same 10px rectangle, quiet border, white surface, and restrained press state. Keep provider labels, icons, disabled behavior, and callbacks unchanged.

### OTP step

In the local `OtpInput` component in `LoginPage.tsx`, replace the large rounded cells and bounce-like focus scale with 10px rounded rectangles. Keep digit entry, auto-advance, backspace navigation, paste handling, `one-time-code` autocomplete on the first cell, accessible labels, resend behavior, and completion behavior unchanged.

## Architecture and data flow

This is a presentation-only change in `src/app/pages/LoginPage.tsx` plus backward-compatible opt-out props in `src/app/components/PrimaryButton.tsx`. `src/app/components/FormTextField.tsx` and global field rules in `src/styles/index.css` remain the source of the app's shared form geometry and are not changed. `src/app/data/login.js`, `LoginRoute.tsx`, and the OTP/login callback contract remain unchanged.

The identifier detector remains the only source of the current channel presentation. Visual changes must not add selector state, format validation, network behavior, or a second identifier value.

## Accessibility and motion

- Keep the existing accessible name `Email or phone number` and all OTP digit labels.
- Preserve keyboard focus visibility and the current Enter-to-continue path.
- Keep controls operable at mobile width and at least 44px high.
- Do not add a new focusable element to replace the removed selector.
- Avoid decorative animation on the input path; respect the existing reduced-motion rules.

## Acceptance criteria

- No login control uses `rounded-full`.
- The identifier, social buttons, and OTP cells visibly share the app's rounded-rectangle language.
- The identifier field has one frame rather than a nested pill/bezel.
- Continue keeps the `#28b99e` to `#177564` PlanOut gradient, but reads as a 12px rounded rectangle with restrained press feedback.
- The login screen still autodetects email versus phone as the user types and reaches the same OTP/completion states.
- Existing login detector tests continue to pass, and focused source assertions cover the new geometry and removal of pill/shimmer classes.
- Browser verification at mobile width shows consistent control geometry in both the identifier and OTP steps, with no horizontal overflow or keyboard-regression symptoms.

## Verification

- Add focused source assertions to `tests/login-identifier.test.mjs` for the shared rounded-rectangle classes and absence of login `rounded-full`, nested bezel, shimmer, and bounce classes.
- Run the focused login test and confirm the new assertions fail before implementation, then pass after implementation.
- Run the complete Node test suite, production build, and `git diff --check`.
- Use the browser at a mobile viewport to inspect the identifier and OTP states, type both phone and email examples, and verify the existing flow remains intact.
