# PlanOut mobile screen capture board

**Date:** 2026-10-27  
**Target:** Paper file `Planout V3`, page `Mobile App` (`p-1-0`)

## Goal

Add a searchable gallery of PlanOut’s distinct mobile screens to the existing Paper page. Capture the current prototype at 390 px wide so the boards reflect the app’s actual copy, data, and visual states.

## Coverage

Include every discrete mobile screen represented by the app’s routes and existing case fixtures. Include route previews, QA cases with a mobile layout, dialogs and sheets, and data-driven states such as empty, loading, error, success, claimed, and revoked. Exclude desktop-only layouts, pointer hover/focus, and arbitrary text-entry permutations that do not create a distinct screen.

Use isolated browser contexts with the prototype’s existing fixture data. Capture the app content at 390 × 784 px with a 2× device scale factor. Place each capture below the standard 60 px mobile status bar in a 390 × 844 px Paper artboard.

## Organization and naming

Keep the screens on the linked `Mobile App` page. Arrange frames by user flow and leave 80 px between neighboring artboards.

Use the route and state on the artboard, then name the captured content by component and feature:

- Artboard: `page-{route}-state-{state}`
- Capture layer: `component-{screen}-feature-{feature}`
- Example: `page-orders-state-empty` → `component-order-list-feature-empty`

The screen image is a single selectable layer. The frame and layer names make each captured route or state easy to find and replace.

## Visual treatment

Preserve the current PlanOut prototype UI without restyling. Use the product’s existing mineral palette: background `#F6F8FB`, white surface `#FFFFFF`, ink `#17202B`, PlanOut teal `#177564`, pale patina `#D9E8E5`, and slate text `#64748B`. The typography remains Inter with the app’s existing hierarchy.

Add the standard status bar as a separate first child in each mobile artboard. Keep all app captures at 390 px wide.

## Verification

Confirm that every imported artboard is 390 px wide and 844 px high, each capture is aligned below the status bar, names follow the route/component/feature/state convention, and no frame overlaps another. Review representative screens in Paper at 1× and check the final frame inventory against the route and case manifests.
