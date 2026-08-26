# Navigation and content actions design

## Context

The current PlanOut prototype has four user-facing actions that look actionable but do not complete the intended journey:

- Home’s `See all` action for pending forms navigates to `/passport/events?focus=forms`, but the destination does not render a forms section.
- Organizer profile `Contact Organizer` has no action even though the organizer record includes an email address.
- Event detail `Directions` has no action even though the event includes a venue and city in `location`.
- Event detail `Gallery` → `View all` has no action, while individual gallery photos already open an existing lightbox.

The user confirmed that pending forms belong in Orders with the Pending filter, organizer contact should use the organizer’s email, Directions should open Google Maps, and the existing Route Map, Event Waiver, organizer social links, and Inbox `Claim Offer` controls are intentional placeholders for now.

## Goals

1. Send aggregate pending-form navigation to `/orders?filter=pending`.
2. Preserve direct links from an individual pending entry to its participant form.
3. Make `Contact Organizer` a semantic email link using the selected organizer’s email address.
4. Make `Directions` a semantic external Google Maps search link built from the event location.
5. Make `Gallery` → `View all` open the existing lightbox and allow cycling through every gallery photo.
6. Preserve the existing visual treatment and avoid introducing new routes or dependencies.

## Non-goals

- Do not create destinations for Route Map or Event Waiver.
- Do not replace or populate organizer social placeholder URLs.
- Do not implement Inbox `Claim Offer`.
- Do not redesign the event details page, organizer profile, Orders page, or lightbox.
- Do not add a gallery backend, upload flow, or new image source.

## Design

### Pending forms

Use `/orders?filter=pending` as the single aggregate destination for pending forms. Update the Home forms section’s `See all` action and the active legacy/fallback forms redirects that currently use `focus=forms`. Keep entry-level actions unchanged so a user can still open a specific form directly from Home or an order.

Orders already derives its selected filter from the query string. The destination must therefore rely on the existing Orders filter behavior rather than adding a second forms view or a new query parameter.

### Organizer email

Render `Contact Organizer` as a semantic anchor that preserves the current compact primary-button appearance and points to `mailto:${organizer.email}`. The link must use the organizer record resolved for the current profile route. It must not open the floating chat widget, invent an email address, or create a new contact screen.

### Directions

Render `Directions` as a semantic external link while preserving its existing button styling. Build the URL with Google Maps’ search format:

```text
https://www.google.com/maps/search/?api=1&query=<encoded event.location>
```

Open the map in a new tab with `target="_blank"` and `rel="noreferrer"`. Use the complete event `location` value so the venue and city remain part of the search query.

### Gallery cycling

Reuse `EventDetailsPage`’s existing `selectedImageIndex` lightbox state. The `View all` control opens the lightbox at index `0`. Existing photo tiles continue to open the lightbox at their own index.

The lightbox’s Previous and Next controls cycle over the complete `galleryImages` array. Both controls wrap at the ends, so Previous from the first image selects the last image and Next from the last image selects the first image. The current `n / total` indicator remains synchronized with the selected index. Close behavior and the existing motion treatment remain unchanged.

## Component boundaries and data flow

- `HomePage.tsx` owns aggregate pending-form navigation and continues to own entry-level form navigation.
- `RegistrationQueueRoute.tsx` remains an authenticated compatibility redirect, but its destination becomes Orders Pending.
- `CheckoutPage.tsx` uses Orders Pending for its no-specific-form fallback instead of the absent Passport forms section.
- `OrganizerProfilePage.tsx` owns the organizer email link because it has the resolved organizer record and existing CTA styling.
- `EventDetailsPage.tsx` owns the map URL, Directions link, gallery-open handler, and wrapping lightbox index transitions.
- `PrimaryButton.tsx` may receive the smallest link-capability extension needed to preserve the shared primary CTA styling for the organizer email action. If a local anchor wrapper can reuse the same styles without changing the shared component contract, prefer the local wrapper.

## Error handling and accessibility

- Use the existing Orders route even when there are multiple pending entries; the Pending filter provides the complete list.
- Keep the current AuthGuard on the legacy registration-queue redirect.
- Use descriptive accessible names for the email link and Directions link. The organizer name and event location must remain available as link context.
- Use semantic anchors for email and external navigation so keyboard users and assistive technology receive link behavior.
- Keep Route Map, Event Waiver, social links, and Claim Offer visually unchanged as placeholders.
- Keep lightbox controls keyboard reachable. Wrapping navigation must not create an out-of-range array index.

## Testing and verification

Add regression coverage for the confirmed behavior before implementation:

1. Source-level tests verify that Home’s aggregate forms action, the compatibility redirect, and the checkout fallback use `/orders?filter=pending`, while entry-level form routes remain intact.
2. Source-level tests verify the organizer CTA uses the organizer email in a `mailto:` link and that the Directions URL encodes the complete event location for Google Maps.
3. Source-level tests verify `View all` opens the lightbox, the lightbox renders both navigation controls, and index transitions wrap at both ends.
4. Run the complete existing Node test suite and production build.
5. In the in-app browser, verify Home → `See all` lands on Orders with Pending selected, the organizer CTA exposes the organizer email link, Directions exposes the Google Maps URL, and Gallery → `View all` opens a cycling lightbox. Capture console errors and warnings during the route checks.

## Success criteria

- No active pending-form aggregate path sends the user to the empty Passport forms focus.
- The Home `See all` action lands on Orders with Pending selected.
- Organizer `Contact Organizer` opens the resolved organizer email composer.
- Event `Directions` opens a Google Maps search for the event location.
- Event `Gallery` → `View all` opens the first photo and cycles through all four photos in both directions.
- Confirmed placeholders remain unchanged.
