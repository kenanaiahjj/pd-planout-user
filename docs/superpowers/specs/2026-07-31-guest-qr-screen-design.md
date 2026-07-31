# Guest QR screen — Quiet Credential

## Intent

Make the buyer-managed Guest QR route feel like a calm, trustworthy access credential. The QR must remain the visual focus, while the attendee, event, validity, state, and operational actions become easier to scan on a phone.

## Scope

Update the active state of `BuyerGuestQrContent` in `src/app/pages/GuestEntryPages.tsx`. Preserve all existing behavior and state variants: active, scanned, revoked, and claimed. Keep share, resend, mark scanned, revoke, guest receipt, and regenerate actions functional.

## Visual direction

- Use the existing PlanOut teal as a restrained accent, not as a large saturated header block.
- Replace the nested bordered-card stack with one primary pass surface on a quiet app canvas.
- Give the QR the strongest visual weight: centered, high-contrast, generously padded, and surrounded by a subtle mint halo.
- Group event, participant, entry reference, gate, and validity into a compact information hierarchy.
- Replace separate heavy status boxes with one clear status row: state first, validity second.
- Keep destructive revoke available but visually subordinate to sharing and scanning actions.
- Use the product’s existing system sans and familiar button vocabulary.

## Interaction and accessibility

- Make `Share Guest QR` the primary full-width action.
- Keep `Resend` and `Mark scanned` as secondary actions with 44px minimum touch targets.
- Keep `Revoke` as an explicit destructive action, separated from the primary action group.
- Preserve visible focus rings, semantic button labels, and WCAG AA contrast.
- Use short press feedback on actions; no decorative page-load choreography.
- Add reduced-motion behavior for any enter or press transition.

## State mapping

The layout remains structurally consistent across states. Only the accent, status copy, QR treatment, and contextual action area change for claimed, scanned, and revoked states. A claimed entry must still explain that it now belongs to a Passport; a scanned entry must still offer the guest receipt; a revoked entry must still offer a new QR.

## Verification bar

- At the 390px mobile viewport, the QR and primary share action are visible without ambiguity.
- The attendee name, event, date, gate, reference, and status remain readable without horizontal overflow.
- Active, scanned, revoked, and claimed routes retain their existing actions and copy.
- Browser smoke verification reports no console errors.
- Existing focused tests and production build remain green.
