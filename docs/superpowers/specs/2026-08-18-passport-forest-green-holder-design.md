# Passport Forest-Green Holder Design

## Goal

Recolor the Passport holder/pocket to a premium layered forest-green material so the credential feels more recognizably PlanOut-branded.

## Approved behavior

- The large lower holder pocket changes from tan leather to a deep forest-green layered gradient.
- The inner `PASSPORT HOLDER` insert uses a related, slightly lighter/darker green layer to preserve depth and hierarchy.
- Existing inset highlights, borders, shadows, and dimensional layering remain, with green-compatible tones.
- The holder mark and wordmark use a subdued mint/green contrast treatment that remains legible without competing with the QR.
- The metallic QR frame and QR code remain unchanged.
- The Events, Save, and Reset QR tabs remain colorful and unchanged.
- No Passport data, QR generation, navigation, or interaction behavior changes.

## Visual treatment

- Outer pocket: `#0b5d58` to `#063c36`, with a restrained vertical/diagonal tonal shift.
- Inner insert: `#176f63` to `#0a4c46`, with a lower inset shadow for the recessed effect.
- Borders and highlights: low-opacity white and dark-green insets rather than tan borders.
- Holder mark/text: muted mint/green at accessible contrast against the inner insert.

## Architecture

`PlanOutPassportCard` remains the single owner of the holder material. Only the two holder-layer class strings and the holder mark/text colors change. The metallic card and action-tab API remain untouched so all existing PassportPage behavior continues to use the same component contract.

## Responsive and accessibility behavior

- Preserve the current scaled holder geometry and touch interaction.
- Keep the existing focus/active states and reduced-motion behavior.
- Maintain readable contrast for the holder mark and text against the inner green surface.
- Do not add extra decorative overlays or change the card's viewport footprint.

## Verification

- Add a source-contract regression asserting the forest-green outer and inner holder layers and the absence of the old tan holder fills.
- Run focused Passport card tests, the full Node test suite, production build, and `git diff --check`.
- Visually verify that the metallic QR frame and colorful tabs remain unchanged while the lower holder reads as one cohesive green material.

