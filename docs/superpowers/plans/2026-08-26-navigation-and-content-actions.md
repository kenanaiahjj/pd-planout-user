# Navigation and content actions implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (\`- [ ]\`) syntax for tracking.

**Goal:** Repair the confirmed PlanOut navigation and event-detail actions while preserving all user-confirmed placeholders.

**Architecture:** Add one dependency-free navigation helper for the shared Orders Pending path and external link builders. Use semantic anchors for email and Google Maps navigation. Reuse EventDetailsPage’s existing lightbox state and change only its open and index-transition behavior; do not add routes or new data sources.

**Tech Stack:** React, TypeScript, React Router, Motion, Lucide React, Node’s built-in test runner, Vite.

## Global Constraints

- Aggregate pending-form navigation must use <code>/orders?filter=pending</code>.
- Individual pending-entry actions must continue opening their specific participant form routes.
- <code>Contact Organizer</code> must open the resolved organizer’s email address with <code>mailto:</code>.
- <code>Directions</code> must open Google Maps with the complete event <code>location</code> encoded in the query.
- Gallery <code>View all</code> must open the existing lightbox and navigation must wrap across every gallery image.
- Route Map, Event Waiver, organizer social links, and Inbox <code>Claim Offer</code> must remain placeholders.
- Do not add routes, dependencies, backend behavior, or unrelated visual redesign.
- Use test-first changes: each implementation task starts with a failing regression test.

---

### Task 1: Centralize and repair pending-form navigation

**Files:**
- Create: <code>src/app/data/navigation.js</code>
- Modify: <code>src/app/pages/HomePage.tsx:149,933</code>
- Modify: <code>src/app/routes/RegistrationQueueRoute.tsx:1-16</code>
- Modify: <code>src/app/components/CheckoutPage.tsx:8,1398</code>
- Modify: <code>src/app/layouts/RootLayout.tsx:28,349</code>
- Modify: <code>src/app/router.tsx:22-31</code>
- Test: <code>tests/navigation-and-content-actions.test.mjs</code>

**Interfaces:**
- Produces <code>ORDERS_PENDING_PATH</code>, <code>getOrganizerEmailHref(email)</code>, and <code>getGoogleMapsSearchUrl(location)</code> from <code>src/app/data/navigation.js</code> for later tasks.
- Keeps Home entry-level form navigation unchanged.

- [ ] **Step 1: Write the failing route regression test**

Create <code>tests/navigation-and-content-actions.test.mjs</code> with:

~~~js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
const navigationUrl = new URL('../src/app/data/navigation.js', import.meta.url);
const navigationSource = fs.existsSync(navigationUrl)
  ? fs.readFileSync(navigationUrl, 'utf8')
  : '';
const homeSource = read('../src/app/pages/HomePage.tsx');
const queueRouteSource = read('../src/app/routes/RegistrationQueueRoute.tsx');
const checkoutSource = read('../src/app/components/CheckoutPage.tsx');
const layoutSource = read('../src/app/layouts/RootLayout.tsx');
const routerSource = read('../src/app/router.tsx');

test('all aggregate pending-form shortcuts use Orders Pending', () => {
  assert.match(navigationSource, /export const ORDERS_PENDING_PATH = '\/orders\?filter=pending'/);
  assert.match(homeSource, /onOpenAll=\{\(\) => navigate\(ORDERS_PENDING_PATH\)\}/);
  assert.match(queueRouteSource, /<Navigate to=\{ORDERS_PENDING_PATH\} replace \/>/);
  assert.match(checkoutSource, /navigate\(ORDERS_PENDING_PATH\)/);
  assert.match(layoutSource, /onPress=\{\(\) => navTo\(ORDERS_PENDING_PATH\)\}/);
  assert.doesNotMatch(homeSource, /passportFormsPath/);
  assert.doesNotMatch(queueRouteSource, /focus=forms/);
  assert.doesNotMatch(checkoutSource, /focus=forms/);
});

test('Home keeps direct entry-level participant form links', () => {
  assert.match(homeSource, /orders\/\$\{entry\.ticketId\}\/form\?returnTo=home&entryId=/);
});

test('the legacy route documentation names the Orders Pending destination', () => {
  assert.match(routerSource, /registration-queue\s+-> Legacy redirect to Orders Pending/);
});
~~~

- [ ] **Step 2: Run the focused test and verify the expected failure**

Run:

~~~bash
node --test tests/navigation-and-content-actions.test.mjs
~~~

Expected: FAIL because <code>src/app/data/navigation.js</code> does not exist and the current sources still use <code>focus=forms</code> or literal pending paths.

- [ ] **Step 3: Add the shared navigation helpers**

Create <code>src/app/data/navigation.js</code> with:

~~~js
export const ORDERS_PENDING_PATH = '/orders?filter=pending';

export function getOrganizerEmailHref(email) {
  return 'mailto:' + email;
}

export function getGoogleMapsSearchUrl(location) {
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(location);
}
~~~

- [ ] **Step 4: Replace aggregate forms destinations with the shared path**

In <code>HomePage.tsx</code>, import <code>ORDERS_PENDING_PATH</code>, remove the unused <code>passportFormsPath</code> helper, and use:

~~~tsx
onOpenAll={() => navigate(ORDERS_PENDING_PATH)}
~~~

Keep entry-level navigation pointed at <code>/orders/:ticketId/form</code>.

In <code>RegistrationQueueRoute.tsx</code>, remove <code>useSearchParams</code> and redirect inside the existing <code>AuthGuard</code> with:

~~~tsx
<Navigate to={ORDERS_PENDING_PATH} replace />
~~~

In <code>CheckoutPage.tsx</code>, replace only the no-specific-form fallback with <code>navigate(ORDERS_PENDING_PATH)</code>. Keep the preceding specific-form branch unchanged.

In <code>RootLayout.tsx</code>, use <code>ORDERS_PENDING_PATH</code> for the existing floating forms card callback.

Update the route comment in <code>router.tsx</code> from <code>Legacy redirect to Passport forms</code> to <code>Legacy redirect to Orders Pending</code>.

- [ ] **Step 5: Run the focused test and verify it passes**

Run:

~~~bash
node --test tests/navigation-and-content-actions.test.mjs
~~~

Expected: PASS for the pending-navigation tests.

- [ ] **Step 6: Commit the pending-navigation repair**

~~~bash
git add src/app/data/navigation.js src/app/pages/HomePage.tsx src/app/routes/RegistrationQueueRoute.tsx src/app/components/CheckoutPage.tsx src/app/layouts/RootLayout.tsx src/app/router.tsx tests/navigation-and-content-actions.test.mjs
git commit -m "fix: route pending forms to filtered orders"
~~~

### Task 2: Make organizer contact open email

**Files:**
- Modify: <code>src/app/components/PrimaryButton.tsx:43-135</code>
- Modify: <code>src/app/pages/OrganizerProfilePage.tsx:24,805</code>
- Modify: <code>tests/navigation-and-content-actions.test.mjs</code>

**Interfaces:**
- Consumes <code>getOrganizerEmailHref(email)</code> from <code>src/app/data/navigation.js</code>.
- Produces a <code>PrimaryButtonLink</code> anchor variant that shares the existing primary-button visual treatment without changing current <code>PrimaryButton</code> callers.

- [ ] **Step 1: Extend the failing regression test**

Append:

~~~js
const primaryButtonSource = read('../src/app/components/PrimaryButton.tsx');
const organizerSource = read('../src/app/pages/OrganizerProfilePage.tsx');

test('organizer contact uses a semantic email link with primary-button styling', () => {
  assert.match(primaryButtonSource, /export const PrimaryButtonLink = React\.forwardRef<HTMLAnchorElement/);
  assert.match(organizerSource, /getOrganizerEmailHref/);
  assert.match(organizerSource, /<PrimaryButtonLink[\s\S]*href=\{getOrganizerEmailHref\(organizer\.email\)\}/);
  assert.match(organizerSource, /aria-label=\{'Email ' \+ organizer\.name\}/);
  assert.doesNotMatch(organizerSource, /<PrimaryButton compact[\s\S]*Contact Organizer/);
});
~~~

- [ ] **Step 2: Run the focused test and verify the expected failure**

Run:

~~~bash
node --test tests/navigation-and-content-actions.test.mjs
~~~

Expected: FAIL because <code>PrimaryButtonLink</code> and the organizer email link do not exist.

- [ ] **Step 3: Extract shared primary-button visuals and add <code>PrimaryButtonLink</code>**

In <code>PrimaryButton.tsx</code>, separate the visual props from the native button props, preserve the current <code>PrimaryButton</code> output, and add an anchor variant with the same class/style/content structure:

~~~tsx
interface PrimaryButtonVisualProps {
  fullWidth?: boolean;
  compact?: boolean;
  appearance?: 'gradient' | 'solid';
  brandGradient?: { from: string; to: string; shadow?: string };
  showShine?: boolean;
  pressScale?: boolean;
}

interface PrimaryButtonLinkProps
  extends PrimaryButtonVisualProps,
    React.AnchorHTMLAttributes<HTMLAnchorElement> {}

function primaryButtonClassName({
  fullWidth,
  compact,
  pressScale,
  className = '',
}: Pick<PrimaryButtonVisualProps, 'fullWidth' | 'compact' | 'pressScale'> & {
  className?: string;
}) {
  return [
    'relative inline-flex items-center justify-center gap-2',
    compact ? 'px-4 py-2' : 'px-[18px] py-[10px]',
    fullWidth ? 'w-full' : '',
    'rounded-xl text-[15px] font-semibold text-white text-center',
    'transition-[filter,transform] duration-150 ease-out',
    pressScale === false ? '' : 'active:scale-[0.98] motion-reduce:active:scale-100',
    'motion-reduce:transition-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/35 focus-visible:ring-offset-2',
    'cursor-pointer hover:brightness-110',
    className,
  ].filter(Boolean).join(' ');
}

function primaryButtonStyle({
  appearance = 'gradient',
  brandGradient,
  showShine = true,
  style,
}: Pick<PrimaryButtonVisualProps, 'appearance' | 'brandGradient' | 'showShine'> & {
  style?: React.CSSProperties;
}) {
  const backgroundStyle = appearance === 'solid'
    ? {
        backgroundColor: '#177564',
        boxShadow: '0 8px 18px -14px rgba(23,117,100,0.6)',
      }
    : createBackgroundStyle(brandGradient, showShine);

  return { ...backgroundStyle, ...style };
}

export const PrimaryButtonLink = React.forwardRef<HTMLAnchorElement, PrimaryButtonLinkProps>(
  function PrimaryButtonLink({
    children,
    className,
    fullWidth,
    compact,
    appearance,
    brandGradient,
    showShine,
    pressScale,
    style,
    ...rest
  }, ref) {
    return (
      <a
        ref={ref}
        className={primaryButtonClassName({ fullWidth, compact, pressScale, className })}
        style={primaryButtonStyle({ appearance, brandGradient, showShine, style })}
        {...rest}
      >
        <span className="relative z-[1] flex items-center justify-center gap-2 leading-[24px] whitespace-nowrap">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 rounded-[inherit] border border-white/20 pointer-events-none"
        />
      </a>
    );
  },
);
~~~

Share class/style helpers between both exports. Preserve the existing gradient, compact sizing, focus ring, hover, press, reduced-motion, and shine behavior. Do not change current button consumers.

- [ ] **Step 4: Replace the organizer CTA with the email link**

Import <code>PrimaryButtonLink</code> and <code>getOrganizerEmailHref</code> in <code>OrganizerProfilePage.tsx</code>. Use:

~~~tsx
<PrimaryButtonLink
  href={getOrganizerEmailHref(organizer.email)}
  aria-label={'Email ' + organizer.name}
  className="rounded-full shadow-sm py-2 px-5 font-bold text-[13px]"
>
  <Mail className="w-3.5 h-3.5" />
  Contact Organizer
</PrimaryButtonLink>
~~~

Leave the social links and displayed email/phone text unchanged.

- [ ] **Step 5: Run the focused test and verify it passes**

Run:

~~~bash
node --test tests/navigation-and-content-actions.test.mjs
~~~

Expected: PASS, including the organizer email-link test.

- [ ] **Step 6: Commit the organizer email repair**

~~~bash
git add src/app/components/PrimaryButton.tsx src/app/pages/OrganizerProfilePage.tsx tests/navigation-and-content-actions.test.mjs
git commit -m "fix: make organizer contact open email"
~~~

### Task 3: Repair Directions and gallery cycling

**Files:**
- Modify: <code>src/app/components/EventDetailsPage.tsx:20,58-112,440-500,575-610</code>
- Modify: <code>tests/navigation-and-content-actions.test.mjs</code>

**Interfaces:**
- Consumes <code>getGoogleMapsSearchUrl(location)</code> from <code>src/app/data/navigation.js</code>.
- Keeps <code>selectedImageIndex: number | null</code> as the only lightbox selection state.

- [ ] **Step 1: Extend the failing regression test**

Append:

~~~js
const eventDetailsSource = read('../src/app/components/EventDetailsPage.tsx');

test('event actions expose Google Maps Directions and a cycling gallery', () => {
  assert.match(eventDetailsSource, /getGoogleMapsSearchUrl/);
  assert.match(eventDetailsSource, /href=\{getGoogleMapsSearchUrl\(event\.location\)\}/);
  assert.match(eventDetailsSource, /target="_blank"/);
  assert.match(eventDetailsSource, /rel="noreferrer"/);
  assert.match(eventDetailsSource, /onClick=\{\(\) => setSelectedImageIndex\(0\)\}/);
  assert.match(eventDetailsSource, /function cycleSelectedImage\(direction: -1 \| 1\)/);
  assert.match(eventDetailsSource, /\(current \+ direction \+ galleryImages\.length\) % galleryImages\.length/);
  assert.match(eventDetailsSource, /aria-label="Previous photo"/);
  assert.match(eventDetailsSource, /aria-label="Next photo"/);
  assert.match(eventDetailsSource, /aria-modal="true"/);
});
~~~

- [ ] **Step 2: Run the focused test and verify the expected failure**

Run:

~~~bash
node --test tests/navigation-and-content-actions.test.mjs
~~~

Expected: FAIL because Directions is still a button and Gallery <code>View all</code> and wrapping transitions do not exist.

- [ ] **Step 3: Add the Google Maps Directions link**

Import <code>getGoogleMapsSearchUrl</code> into <code>EventDetailsPage.tsx</code> and replace the existing Directions button with:

~~~tsx
<a
  href={getGoogleMapsSearchUrl(event.location)}
  target="_blank"
  rel="noreferrer"
  aria-label={'Get directions to ' + event.location}
  className="flex items-center gap-1.5 rounded-full border border-[var(--event-surface-border)] px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--event-surface-muted)] transition-colors hover:bg-white/10 active:scale-95"
>
  <Navigation className="h-3.5 w-3.5" strokeWidth={2} />
  Directions
</a>
~~~

Preserve the existing map preview and event location text.

- [ ] **Step 4: Add wrapping lightbox transitions**

After <code>galleryImages</code> is defined, add:

~~~tsx
const cycleSelectedImage = (direction: -1 | 1) => {
  setSelectedImageIndex((current) => {
    if (current === null || galleryImages.length === 0) return current;
    return (current + direction + galleryImages.length) % galleryImages.length;
  });
};
~~~

Change Gallery <code>View all</code> to a button with <code>type="button"</code>, <code>aria-haspopup="dialog"</code>, and <code>onClick={() => setSelectedImageIndex(0)}</code>. Keep each tile’s current index selection.

In the lightbox, render both navigation controls at every index and call <code>cycleSelectedImage(-1)</code> or <code>cycleSelectedImage(1)</code>. Add <code>type="button"</code> and descriptive <code>aria-label</code> values. Add <code>role="dialog"</code>, <code>aria-modal="true"</code>, and an event-specific <code>aria-label</code> to the lightbox container. Keep the existing image counter and motion transitions.

- [ ] **Step 5: Run the focused test and verify it passes**

Run:

~~~bash
node --test tests/navigation-and-content-actions.test.mjs
~~~

Expected: PASS for all focused navigation, email, Directions, and gallery tests.

- [ ] **Step 6: Commit the event-action repair**

~~~bash
git add src/app/components/EventDetailsPage.tsx tests/navigation-and-content-actions.test.mjs
git commit -m "fix: connect event directions and gallery controls"
~~~

### Task 4: Run the complete verification pass

**Files:**
- Verify: <code>src/app/data/navigation.js</code>
- Verify: <code>src/app/pages/HomePage.tsx</code>
- Verify: <code>src/app/routes/RegistrationQueueRoute.tsx</code>
- Verify: <code>src/app/components/CheckoutPage.tsx</code>
- Verify: <code>src/app/layouts/RootLayout.tsx</code>
- Verify: <code>src/app/components/PrimaryButton.tsx</code>
- Verify: <code>src/app/pages/OrganizerProfilePage.tsx</code>
- Verify: <code>src/app/components/EventDetailsPage.tsx</code>
- Verify: <code>tests/navigation-and-content-actions.test.mjs</code>

- [ ] **Step 1: Run the complete Node test suite**

Run:

~~~bash
node --test --test-reporter=dot tests/*.test.mjs
~~~

Expected: exit code <code>0</code> with no failed tests.

- [ ] **Step 2: Run the production build**

Run:

~~~bash
npm run build
~~~

Expected: exit code <code>0</code>. Existing Vite chunking warnings may remain, but no TypeScript or bundling errors may be introduced.

- [ ] **Step 3: Check the final diff for whitespace errors**

Run:

~~~bash
git diff --check origin/main..HEAD
~~~

Expected: no output and exit code <code>0</code>.

- [ ] **Step 4: Verify Home pending navigation in the in-app browser**

Open <code>/</code>, refresh the DOM snapshot, and activate the <code>See all</code> button in the forms-needing-attention section. Verify:

- URL is <code>/orders?filter=pending</code>.
- Orders shows <code>Pending</code> as the active filter.
- The pending order list is visible.
- No <code>/passport/events?focus=forms</code> navigation occurs.

- [ ] **Step 5: Verify organizer email and event links in the in-app browser**

Open <code>/organizers/city-striders</code>, inspect the <code>Contact Organizer</code> anchor, and confirm its <code>href</code> starts with <code>mailto:</code> and contains the resolved organizer email. Open <code>/events/1</code>, inspect <code>Directions</code>, and confirm its <code>href</code> is the encoded Google Maps search URL for the full event location, with <code>target="_blank"</code> and <code>rel="noreferrer"</code>.

- [ ] **Step 6: Verify gallery cycling in the in-app browser**

On <code>/events/1</code>, activate Gallery → <code>View all</code> and verify the lightbox opens at <code>1 / 4</code>. Activate Next four times and confirm the counter sequence wraps <code>1 / 4 → 2 / 4 → 3 / 4 → 4 / 4 → 1 / 4</code>. Activate Previous from <code>1 / 4</code> and confirm it wraps to <code>4 / 4</code>. Confirm individual gallery tiles still open at their selected index.

- [ ] **Step 7: Capture console health and final status**

During the browser checks, collect console errors and warnings for <code>/</code>, <code>/orders?filter=pending</code>, <code>/organizers/city-striders</code>, and <code>/events/1</code>. The final report must list any existing warnings separately from newly introduced errors and confirm that the intentional placeholders were not modified.
