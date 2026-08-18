# PlanOut Login — Focused Account Entry

## Intent

Make `/login` feel like a calm, trustworthy product entry point instead of a promotional landing page. The screen should direct attention to the one required action—entering an email or phone number—while preserving all existing authentication paths.

## Existing behavior to preserve

- One identifier field accepts either email or phone input and detects the method while typing.
- Continue sends a simulated one-time code and advances to the six-digit OTP state.
- OTP input supports auto-advance, paste, backspace navigation, resend timing, and automatic completion.
- Google and Facebook buttons complete the prototype login callbacks.
- Continue as Guest remains available when supplied by the route.
- Login callbacks, route return behavior, and accessibility labels remain unchanged.

## Visual direction

Use a restrained product surface: a true near-white background, one compact PlanOut lockup, and a centered content column capped at roughly 420px. Remove decorative radial glows, testimonial imagery, star ratings, shimmer sweeps, and hover-zoom treatment. Authentication is the content; brand expression comes from the logo, typography, and PlanOut green.

The identifier state uses:

- A concise heading: `Sign in to PlanOut`.
- One short supporting sentence that explains the next step.
- A visible field label above a 52px identifier field with a 14px radius, neutral border, and a single green focus ring.
- A PlanOut brand-gradient Continue button with a quiet disabled state; the gradient is reserved for this primary action.
- Consent text directly below the primary action.
- A simple divider labeled `Or continue with` followed by compact Google and Facebook secondary buttons.
- `Continue as Guest` as a tertiary text action below the social options.

The OTP state reuses the same shell, spacing, logo treatment, and type scale. Its title describes the action (`Enter your verification code`), the masked destination remains visible, the six inputs use flat bordered cells with one clear active ring, and resend/change actions remain secondary.

## Responsive behavior

- Mobile keeps a single full-height column with safe top and bottom padding and no horizontal overflow.
- Desktop keeps the same centered form rather than introducing a competing hero panel.
- Content remains usable at short viewport heights through vertical scrolling; no content is hidden behind fixed controls.

## Interaction and accessibility

- Preserve existing keyboard handling, Enter-to-continue, paste behavior, resend countdown, disabled states, and focus targets.
- Keep the current `aria-label`, `autoComplete`, `inputMode`, and `enterKeyHint` attributes.
- Use 150–250ms state transitions only for focus, loading, and step changes; honor reduced-motion preferences.
- Keep body and placeholder text at accessible contrast levels.

## Verification

- Add source-level regression checks for the focused layout and removal of decorative hero-only markup.
- Run the login identifier, native mobile field, and relevant auth-flow tests.
- Run the production build and `git diff --check`.
