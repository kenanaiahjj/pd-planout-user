import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  X,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Switch } from '@/app/components/ui/switch';
import passportEmailCover from '@/assets/planout-passport-email-cover-editorial.png';

// ---------------------------------------------------------------------------
// Screen sources
//
// Every case viewport is a real app screen: either this same-origin iframe of a
// live route, or a Playwright capture of a state that needs an interaction to
// reach (see scratch/capture_purchase_intent_screens.mjs). The only exception
// is WF_DefaultScreen, which explicitly says a step has no screen in the app.
// ---------------------------------------------------------------------------

function LiveAppScreen({ path, title, scrollToText }: { path: string; title: string; scrollToText?: string }) {
  const [ready, setReady] = useState(false);
  const src = `${path}${path.includes('?') ? '&' : '?'}passportCasePreview=1`;
  const frameWidth = 390;
  const frameHeight = 844;
  const frameScale = 280 / frameWidth;

  /** Same-origin iframe: scroll the embedded app to the section named by `scrollToText`. */
  const handleFrameLoad = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    if (!scrollToText) return;
    const frame = event.currentTarget;
    // The SPA renders after load; retry briefly until the section heading exists.
    let attempts = 0;
    const tryScroll = () => {
      attempts += 1;
      try {
        const doc = frame.contentDocument;
        if (doc) {
          const target = Array.from(doc.querySelectorAll('h1, h2, h3, h4, p, span')).find(
            (el) => el.textContent?.trim() === scrollToText,
          );
          if (target) {
            target.scrollIntoView({ block: 'start' });
            return;
          }
        }
      } catch {
        return; // cross-origin or detached — leave the frame at the top
      }
      if (attempts < 20) setTimeout(tryScroll, 250);
    };
    tryScroll();
  };

  useEffect(() => {
    try {
      const existing = window.localStorage.getItem('planout.user.profile.v1');
      if (!existing) {
        window.localStorage.setItem(
          'planout.user.profile.v1',
          JSON.stringify({
            name: 'User',
            email: 'user@example.com',
            phone: '',
            loginMethod: 'email',
          }),
        );
      }
    } catch {
      // The iframe still renders unauthenticated public routes if storage is unavailable.
    } finally {
      setReady(true);
    }
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#f6f8fb] p-5 text-center">
        <div className="rounded-2xl border border-[#dbe7e4] bg-white px-4 py-3 text-[11px] font-semibold text-[#64748b]">
          Loading app screen...
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden bg-[#f6f8fb]"
      style={{ height: Math.ceil(frameHeight * frameScale) }}
    >
      <iframe
        title={title}
        src={src}
        loading="lazy"
        onLoad={handleFrameLoad}
        className="absolute left-0 top-0 border-0 bg-[#f6f8fb]"
        style={{
          width: frameWidth,
          height: frameHeight,
          transform: `scale(${frameScale})`,
          transformOrigin: 'top left',
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Case Item Showcase Component
// ---------------------------------------------------------------------------// ---------------------------------------------------------------------------
// Step Flow Reusable Viewports
// ---------------------------------------------------------------------------

type EmailTone = 'ready' | 'action' | 'important' | 'update';

function getEmailTone(subject: string, headline = ''): EmailTone {
  const content = `${subject} ${headline}`.toLowerCase();

  if (/(revoked|released|no-show|not checked in|missed)/.test(content)) return 'important';
  if (/(ready|active|confirmed|checked in|attached)/.test(content)) return 'ready';
  if (/(complete|update|required|claim|join|invite|resubmit)/.test(content)) return 'action';
  return 'update';
}

const EMAIL_TONE_META: Record<EmailTone, { label: string; dot: string; badge: string }> = {
  ready: {
    label: 'Access ready',
    dot: 'bg-[#74e0c5]',
    badge: 'border-[#bce7da] bg-[#eef9f5] text-[#176c5d]',
  },
  action: {
    label: 'Action requested',
    dot: 'bg-[#e8b760]',
    badge: 'border-[#f0d9aa] bg-[#fff8e9] text-[#8a5a09]',
  },
  important: {
    label: 'Important update',
    dot: 'bg-[#ee8e8a]',
    badge: 'border-[#f0c6c4] bg-[#fff3f2] text-[#a8423f]',
  },
  update: {
    label: 'Passport update',
    dot: 'bg-[#9dd4c8]',
    badge: 'border-[#cce5df] bg-[#f1f8f6] text-[#246d60]',
  },
};

function WF_DefaultScreen({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-[#0f172a] text-slate-200 min-h-full flex flex-col p-6 justify-center items-center text-center gap-4.5 font-sans">
      <div className="w-11 h-11 rounded-xl bg-slate-800/80 flex items-center justify-center border border-slate-700/50 shadow-inner">
        <span className="font-mono text-xs font-semibold text-teal-300">UI</span>
      </div>
      <div className="flex flex-col gap-2.5 px-2">
        <span className="mx-auto rounded-full bg-slate-800 border border-slate-700/50 px-2.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-slate-400">
          Flow Interaction
        </span>
        <h4 className="text-[13px] font-bold text-white mt-1 leading-tight">{title}</h4>
        <p className="text-[10px] text-slate-400 leading-relaxed mt-1">{desc}</p>
      </div>
      <div className="mt-4 border-t border-slate-800/60 w-full pt-4">
        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
          (No screen in app for this step)
        </p>
      </div>
    </div>
  );
}

function getPurchaseIntentStepRoute(caseTitle: string, stepTitle: string): string | null {
  if (!/^Case\s+(2[4-9]|3[0-6]):/i.test(caseTitle)) return null;

  const title = stepTitle.toLowerCase();
  const routeByCase = {
    solo: '/passport',
    guestManager: '/orders/tkt-008/guest-manager',
    guestQr: '/orders/tkt-010/entry/tkt-010-p2/guest-qr',
    // '/ticket-claim/:ref' resolves the order and entry from its query, then
    // opens the organizer form in invite mode. Without both params it bounces
    // to '/orders', so the recipient screen never renders.
    claim: '/ticket-claim/CLM-CANLAON-42K?order=tkt-011&entry=tkt-011-p2',
    formFill: '/orders/tkt-003/form?returnTo=orders',
    temporary: '/orders/tkt-010/entry/tkt-010-p2/guest-qr',
    mixed: '/passport/events',
  };

  // '/checkout' redirects to '/cart' without an active order, so checkout steps
  // use the static capture (or the checkout wireframe) instead of a live route.
  if (title.includes('checkout') || title.includes('purchase')) return null;

  // Case 25: Solo buyer — all post-checkout steps show passport
  if (caseTitle.includes('Buyer Buys For Himself')) return routeByCase.solo;

  // Case 27: Group, buyer fills every form — guest manager screen for all steps
  if (caseTitle.includes('Fills Every Form')) return routeByCase.guestManager;

  // Case 26: Buyer fills own form, sends claim link to friend
  if (caseTitle.includes('Sends The Form')) {
    if (title.includes('fill own')) return routeByCase.formFill;
    if (title.includes('friend registers') || title.includes('opens the link')) return routeByCase.claim;
    // 'Email — claim link sent' and 'Access surfaces' have no live screen
    return null;
  }

  // Case 28: Buyer fills form on behalf of a no-account guest, generates Guest QR
  if (caseTitle.includes('Dependent')) {
    if (title.includes('fill form') || title.includes('fill on behalf') || title.includes('on behalf')) return routeByCase.formFill;
    if (title.includes('generate guest qr') || title.includes('generate temporary') || title.includes('temporary qr')) return routeByCase.temporary;
    // 'Print or SMS pass' and 'Access surfaces' are external actions — no live screen
    return null;
  }

  // Case 29: Mixed order — show passport/events for strategy step, null for outcome
  if (caseTitle.includes('Mixed Order')) {
    if (title.includes('form') || title.includes('open') || title.includes('choose')) return routeByCase.mixed;
    return null;
  }

  // Case 30: Buyer doesn't attend — sends form link to friend (claim link flow)
  if (caseTitle.includes('Buyer Does Not Attend') && caseTitle.includes('Sends Form')) {
    if (title.includes('friend registers') || title.includes('opens') || title.includes('entry attaches')) return routeByCase.claim;
    // 'Send form link' is the buyer's action in Orders — no dedicated live screen
    return null;
  }

  // Case 31: Buyer doesn't attend — fills form & sends app-less pass
  if (caseTitle.includes('Fills Form & Sends App-less Pass')) {
    if (title.includes('buyer fills') || title.includes('fill')) return routeByCase.formFill;
    if (title.includes('dependent') || title.includes('temporary') || title.includes('guest qr')) return routeByCase.temporary;
    if (title.includes('guest qr') || title.includes('variant a') || title.includes('friend opens')) return routeByCase.guestQr;
    return null;
  }

  // Case 33: Team purchase — buyer manages each player from the order; players resolve individually
  if (caseTitle.includes('Team Purchase')) {
    // 'Add player' lives on the team order, not at checkout. tkt-002 shows the
    // "Players X of Y ready" count with the Add player action.
    if (title.includes('size the roster')) return '/orders/tkt-002';
    if (title.includes('choose access')) return '/orders/tkt-013';
    if (title.includes('players resolve')) return routeByCase.claim;
    if (title.includes('gate access')) return routeByCase.solo;
    return null;
  }

  // Case 34: app-less Guest QR holder creates an account later and claims the entry once
  if (caseTitle.includes('Creates An Account Later')) {
    if (title.includes('guest qr shared')) return '/guest-entry/GE-TEMP-4021';
    if (title.includes('add-entry')) return '/passport/add-entry';
    if (title.includes('invalidated')) return routeByCase.solo;
    // 'Guest attends or keeps code' and 'Confirm one-time claim' are physical / mid-flow steps
    return null;
  }

  // Case 36: a Guest QR that was already scanned at the gate becomes Passport history
  if (caseTitle.includes('Past Guest QR')) {
    if (title.includes('scanner')) return '/passport/add-entry';
    if (title.includes('scan the used pass')) return '/passport/add-entry?code=GE-USED-4218';
    if (title.includes('passport keeps')) return routeByCase.solo;
    // Step 1 uses the used-pass capture; 'Confirm the past event' uses the post-action capture.
    return null;
  }

  return null;
}

const PURCHASE_INTENT_CAPTURE_BASE = '/passport-cases/purchase-intent';

const PURCHASE_INTENT_CAPTURES: Array<{ match: string; screens: string[] }> = [
  {
    match: 'Buyer Buys For Himself',
    screens: ['checkout-purchase', 'participant-form', 'passport-events', 'passport-qr'],
  },
  {
    match: 'Fills Every Form',
    screens: ['orders-overview', 'guest-manager', 'mixed-participant-form', 'buyer-guest-qr', 'claim-email-edit', 'order-ready-guest'],
  },
  {
    match: 'Sends The Form',
    screens: ['checkout-purchase', 'participant-form', 'claim-email-edit', 'ticket-claim', 'passport-qr'],
  },
  {
    match: 'Buyer Buys For A Dependent',
    screens: ['checkout-purchase', 'participant-form', 'buyer-guest-qr', 'public-guest-pass', 'order-ready-guest'],
  },
  {
    match: 'Mixed Order',
    screens: ['checkout-purchase', 'order-setup', 'mixed-participant-form', 'order-ready-guest'],
  },
  {
    match: 'Buyer Does Not Attend — Sends Form',
    screens: ['checkout-purchase', 'claim-email-edit', 'ticket-claim', 'passport-qr', 'order-ready-guest'],
  },
  {
    match: 'Fills Form & Sends App-less Pass',
    screens: ['checkout-purchase', 'participant-form', 'buyer-guest-qr', 'public-guest-pass', 'order-ready-guest'],
  },
  {
    // Step 1 (checkout) uses the capture; empty slots fall through to live app screens.
    match: 'Team Purchase',
    screens: ['checkout-purchase', '', '', '', ''],
  },
  {
    // Case 3 — real confirmation captures; empty slots fall through to step heuristics.
    match: 'Inline Form Pending',
    screens: ['checkout-purchase', '', 'checkout-confirmation', '', ''],
  },
  {
    // Case 34 — steps 1/3/5 use live app screens; 2 and 4 use real captures
    // (used-state public pass, and the add-entry confirm state).
    match: 'Creates An Account Later',
    screens: ['', 'public-guest-used', '', 'add-entry-confirm', ''],
  },
  {
    // Case 36 — the used pass and the post-claim confirmation are captures;
    // the scanner, the resolved past entry, and the Passport are live screens.
    match: 'Past Guest QR',
    screens: ['public-guest-used', '', '', 'add-entry-past-added', ''],
  },
];

function getPurchaseIntentCapture(caseTitle: string, stepIdx: number) {
  const scenario = PURCHASE_INTENT_CAPTURES.find((item) => caseTitle.includes(item.match));
  return scenario?.screens[stepIdx] ?? null;
}

/**
 * Captures taken at a desktop viewport. The case frame is a phone, so these are
 * fitted inside it rather than cropped to fill it.
 */
const WIDE_CAPTURES = new Set(['add-entry-web']);

function PurchaseIntentCapture({
  capture,
  title,
  fit = WIDE_CAPTURES.has(capture) ? 'contain' : 'cover',
}: {
  capture: string;
  title: string;
  fit?: 'cover' | 'contain';
}) {
  return (
    <div className="h-[606px] w-full overflow-hidden bg-[#f6f8fb]">
      <img
        src={`${PURCHASE_INTENT_CAPTURE_BASE}/${capture}.png`}
        alt={`PlanOut app screen for ${title}`}
        className={`h-full w-full object-top ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
        loading="lazy"
      />
    </div>
  );
}

/**
 * Real app screens for the step kinds that recur across cases.
 *
 * Every entry here is a route the app actually serves, or a capture of a real
 * screen. Steps that genuinely have no screen — an organizer editing a form, a
 * deadline passing, printing a pass — fall through to the explicit
 * "no screen in app for this step" panel instead of a drawn stand-in.
 */
const SHARED_STEP_SCREENS: Array<{
  test: (title: string, desc: string) => boolean;
  capture?: string;
  route?: string;
}> = [
  // Payment ledger states, most specific first.
  { test: (t, d) => /expired|timed out|released back/.test(t + d) && /payment|session|checkout/.test(t + d), route: '/settings/transactions/AAA-T8KZMW' },
  { test: (t, d) => /pending|awaiting|not confirmed|offline payment|bank transfer/.test(t + d) && /payment|order created|locked/.test(t + d), route: '/settings/transactions/AAA-L4DJYC' },
  { test: (t, d) => /payment (completes|confirms|is complete|successful)|payment confirms/.test(t + d), route: '/settings/transactions/AAA-QZCJU2' },

  { test: (t) => /checkout|purchase/.test(t), capture: 'checkout-purchase' },
  { test: (t, d) => /\bcart\b/.test(t + d), route: '/cart' },

  // Account creation and sign-in.
  { test: (t, d) => /sign up|sign in|signs in|makes an account|create.*account|activates/.test(t + d) && !/scan/.test(t), route: '/login' },

  // Anything the system sends lands in the in-app notification list.
  { test: (t, d) => /email|notification|notified|reminder/.test(t + d), route: '/notifications' },

  // Organizer forms.
  { test: (t, d) => /form|waiver|fill|register|participant data/.test(t + d), route: '/orders/tkt-003/form?returnTo=orders' },

  // Buyer-side management surfaces.
  { test: (t, d) => /add player|player count|player entries|roster/.test(t + d), route: '/orders/tkt-002' },
  { test: (t, d) => /guest qr|app-less|temporary pass/.test(t + d), route: '/orders/tkt-010/entry/tkt-010-p2/guest-qr' },
  { test: (t, d) => /open orders|from orders|in orders|order detail/.test(t + d), route: '/orders' },
  { test: (t, d) => /browse|register again|event page/.test(t + d), route: '/events/1' },
  { test: (t, d) => /passport/.test(t + d), route: '/passport' },
];

function getSharedStepScreen(step: { title: string; desc: string }) {
  const title = step.title.toLowerCase();
  const desc = step.desc.toLowerCase();
  return SHARED_STEP_SCREENS.find((entry) => entry.test(title, desc)) || null;
}

/**
 * Per-case step screens for the screen-state cases, indexed by step.
 *
 * These are the steps the keyword rules above cannot place, keyed by the case
 * number in the title. A `capture:` value points at a real capture; anything
 * else is a live route. `null` means the step has no screen in the app — a gate
 * scan, an organizer edit, a deadline passing — and keeps the explicit
 * "no screen in app for this step" panel.
 */
const CASE_STEP_SCREENS: Record<string, Array<string | null>> = {
  // 8: Deadline missed → the released entry shows under Passport → Status updates.
  '8': [null, null, '/passport/events', null, null],
  // 12/13: the scan and the cancel both happen on the distribution screen now.
  '12': [null, null, null, null],
  '13': [null, '/orders/tkt-011/guest-manager', null, null],
  // 14: after the gate scan the public pass switches to its used state.
  '14': [null, null, '/guest-entry/GE-USED-4218', null],
  // 15: sharing happens in the invite review sheet on the order.
  '15': [null, 'capture:claim-email-edit', null, null, null],
  // 21: the buyer shares from the distribution screen; the recipient picks an entry.
  '21': ['/orders/tkt-011/guest-manager', '/order-share/tkt-011', null, null],
  // 37-41: the add-entry and public-pass states each resolve to a real URL.
  '37': [null, null, '/passport/add-entry', '/passport/add-entry'],
  '38': [null, '/passport/add-entry?code=GE-USED-4218', '/passport/add-entry?code=GE-USED-4218', null],
  '39': [null, '/passport/add-entry?code=GE-TEMP-4021&demoState=added', '/passport/add-entry?code=GE-TEMP-4021&demoState=added', null],
  '40': [null, '/passport/add-entry?code=GE-REVOKED-4218', '/passport/add-entry?code=GE-REVOKED-4218', null],
  '41': ['/guest-entry/GE-CANLAON-42K', null, '/guest-entry/GE-REVOKED-4218', null],
  // 42: the diff screen is the answer to both the notice and the review step.
  '42': [null, null, '/forms/tkt-011-p1/diff', null],
  // 43: the launcher lives on the Passport page.
  '43': ['/passport', '/passport', '/passport/add-entry', null],
  // 44: the conflict only exists after a second account submits.
  '44': [null, null, 'capture:invite-claim-conflict', null],
  // 45-48: team player entries. The generic "form" rule would send these to the
  // individual form, so each step names the team route it actually belongs to.
  '45': [
    '/orders/tkt-013',
    '/orders/tkt-013/form?returnTo=order&participantId=p7&playerOnly=1',
    '/orders/tkt-013/form?returnTo=order&participantId=p7&playerOnly=1',
    null,
  ],
  '46': [
    '/orders/tkt-014',
    '/orders/tkt-014',
    '/orders/tkt-013/form?returnTo=order&participantId=p1&playerOnly=1',
    null,
  ],
  '47': [
    '/orders/tkt-013',
    '/orders/tkt-013',
    '/orders/tkt-013/form?returnTo=order&participantId=p5&playerOnly=1',
    null,
  ],
  '48': ['/orders/tkt-014', '/orders/tkt-014', '/orders/tkt-014', null],
  // 49: the buyer arrives from the cart, then checkout opens on the details gate.
  '49': [
    '/cart',
    'capture:checkout-participant-details',
    'capture:checkout-participant-details',
    null,
  ],
  // 50: the web surface is desktop-only, so every step uses the wide capture.
  '50': [
    '/guest-entry/GE-CANLAON-42K',
    'capture:add-entry-web',
    'capture:add-entry-web',
    null,
  ],
  // 51: the overview card, then the restructured detail.
  '51': ['/orders', '/orders/tkt-009', '/orders/tkt-009', null],
};

function getCaseStepScreen(caseTitle: string, stepIdx: number) {
  const num = caseTitle.match(/Case\s+(\d+):/i)?.[1];
  const value = num ? CASE_STEP_SCREENS[num]?.[stepIdx] : null;
  if (!value) return null;
  return value.startsWith('capture:')
    ? { capture: value.slice('capture:'.length) }
    : { route: value };
}

type StepScreenSource =
  | { kind: 'capture'; capture: string }
  | { kind: 'live'; route: string }
  | { kind: 'case' }
  | { kind: 'none' };

/**
 * One resolution order for every step viewport, shared by the case catalog and
 * the flow diagram so both agree on which screen backs a step:
 * per-case capture → per-case route → the case's own screen on the last step →
 * per-case step screen → shared step screen → no screen in the app.
 */
function resolveStepScreen(
  caseTitle: string,
  stepIdx: number,
  step: { title: string; desc: string },
  stepsCount: number,
): StepScreenSource {
  const purchaseIntentCapture = getPurchaseIntentCapture(caseTitle, stepIdx);
  if (purchaseIntentCapture) return { kind: 'capture', capture: purchaseIntentCapture };

  const purchaseIntentRoute = getPurchaseIntentStepRoute(caseTitle, step.title);
  if (purchaseIntentRoute) return { kind: 'live', route: purchaseIntentRoute };

  // The last step shows the screen the case is actually about.
  if (stepIdx === stepsCount - 1) return { kind: 'case' };

  const screen = getCaseStepScreen(caseTitle, stepIdx) || getSharedStepScreen(step);
  if (screen?.capture) return { kind: 'capture', capture: screen.capture };
  if (screen?.route) return { kind: 'live', route: screen.route };

  return { kind: 'none' };
}

/** Short label naming the evidence behind a step, shown on the flow diagram. */
function describeStepScreen(source: StepScreenSource): string {
  if (source.kind === 'live') return `Live · ${source.route}`;
  if (source.kind === 'capture') return `Capture · ${source.capture}`;
  if (source.kind === 'case') return 'Case screen';
  return 'No app screen';
}

function getStepViewport(
  caseTitle: string,
  stepIdx: number,
  step: { title: string; desc: string },
  stepsCount: number,
  finalViewport: () => React.ReactNode
): React.ReactNode {
  const source = resolveStepScreen(caseTitle, stepIdx, step, stepsCount);

  if (source.kind === 'capture') {
    return <PurchaseIntentCapture capture={source.capture} title={step.title} />;
  }
  if (source.kind === 'live') {
    return <LiveAppScreen title={`Live app screen - ${step.title}`} path={source.route} />;
  }
  if (source.kind === 'case') {
    return finalViewport();
  }
  return <WF_DefaultScreen title={step.title} desc={step.desc} />;
}

// ---------------------------------------------------------------------------
// Mock HTML Email Client Frame
// ---------------------------------------------------------------------------

interface EmailTemplateProps {
  subject: string;
  toName: string;
  toEmail: string;
  headline: string;
  paragraphs: string[];
  details: Record<string, string>;
  ctaText: string;
  footerNote?: string;
}

interface AccessPathProps {
  origin: string;
  route: string;
  backTarget: string;
  steps: string[];
}

interface CaseCatalogItem {
  group: 'scenario' | 'pending' | 'ready' | 'eventPast' | 'exceptions' | 'overview';
  badgeText: string;
  badgeColor?: string;
  title: string;
  subtitle: string;
  timelineSteps: Array<{ title: string; desc: string }>;
  emailTemplates?: EmailTemplateProps[];
  accessPath?: AccessPathProps;
  renderViewport: () => React.ReactNode;
}

function AccessPathPanel({ accessPath }: { accessPath: AccessPathProps }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1.15fr_1fr_1fr]">
        {[
          { label: 'Origin touchpoint', value: accessPath.origin },
          { label: 'Actual app route', value: accessPath.route, mono: true },
          { label: 'Back button returns to', value: accessPath.backTarget },
        ].map((item) => (
          <div key={item.label} className="min-w-0 border-l pl-3">
            <p className="text-[10px] font-medium text-muted-foreground">{item.label}</p>
            <p className={`mt-1 truncate text-xs font-medium ${item.mono ? 'font-mono' : ''}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div>
        <p className="text-[10px] font-medium text-muted-foreground">Step by step access</p>
        <ol className="mt-2 grid gap-2 md:grid-cols-2">
          {accessPath.steps.map((step, index) => (
            <li key={step} className="flex gap-2 rounded-md bg-muted/35 px-3 py-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-background text-[10px] font-medium text-muted-foreground">
                {index + 1}
              </span>
              <span className="text-xs leading-relaxed text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function EmailPreviewFrame({
  subject,
  toName,
  toEmail,
  headline,
  paragraphs,
  details,
  ctaText,
  footerNote = 'This is an automated operational email from PlanOut. You received this because you are a registered participant or contact.',
}: EmailTemplateProps) {
  const detailEntries = Object.entries(details);
  const firstName = toName.split(' ')[0];
  const tone = getEmailTone(subject, headline);
  const toneMeta = EMAIL_TONE_META[tone];

  return (
    <div className="mx-auto w-full max-w-[600px] rounded-[18px] bg-[#f6f8f7] p-5 lg:mx-0">
      <article className="overflow-hidden rounded-[14px] bg-white text-[#142823] shadow-[0_18px_40px_-34px_rgba(10,42,35,0.42)]">
        <div
          className="relative min-h-[190px] overflow-hidden bg-[#0d332d] bg-cover bg-center px-8 pb-8 pt-10 text-center text-white"
          style={{ backgroundImage: `url(${passportEmailCover})` }}
        >
          <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#3cd4b9_0%,#28b99e_46%,#177564_100%)]" />
          <div className="relative flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-white/50 bg-[#0b2d28]/65">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <p className="mt-3 text-[27px] font-semibold tracking-[-0.045em]">PlanOut</p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">Passport access</p>
          </div>
        </div>

        <div className="px-8 py-9 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5b7870]">{toneMeta.label}</p>
          <h2 className="mx-auto mt-4 max-w-[410px] text-[27px] font-semibold leading-[1.1] tracking-[-0.035em] text-[#15362f] text-balance">
            {headline}
          </h2>
          <p className="mx-auto mt-4 max-w-[390px] text-[14px] leading-relaxed text-[#667873] text-pretty">
            Hi {firstName}, your Passport has a new event-access update.
          </p>

          <div className="mx-auto mt-6 flex max-w-[390px] flex-col gap-3 text-center">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-[14px] leading-relaxed text-[#435a54] text-pretty">
                {p}
              </p>
            ))}
          </div>

          <div className="pt-8">
            <button
              type="button"
              className="inline-flex h-12 w-full max-w-[310px] items-center justify-center gap-2 rounded-md bg-[linear-gradient(90deg,#3cd4b9_0%,#177564_100%)] px-8 text-sm font-semibold text-white shadow-[0_12px_18px_-14px_rgba(23,117,100,0.8)] transition-transform hover:brightness-105 active:scale-[0.99]"
            >
              {ctaText} <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mx-auto mt-10 max-w-[420px] border-t border-dashed border-[#d8e3df] pt-6 text-left">
            <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6b817b]">Access record</p>
            <div className="divide-y divide-[#e6eeeb] border-y border-[#e6eeeb]">
              {detailEntries.map(([key, value]) => (
                <div key={key} className="grid grid-cols-[minmax(100px,0.8fr)_1fr] gap-4 px-1 py-3 text-xs">
                  <span className="font-medium text-[#687d77]">{key}</span>
                  <span className="text-right font-semibold leading-tight text-[#183f36]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="border-t border-dashed border-[#d8e3df] px-8 py-7 text-center text-[11px] text-[#657873]">
          <p className="mx-auto max-w-[330px] leading-relaxed">{footerNote}</p>
          <p className="mt-5 font-semibold text-[#254a41]">Need help? Contact PlanOut Support.</p>
          <p className="mt-4 font-medium underline underline-offset-2">planout.ph</p>
        </footer>
      </article>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Case Item Showcase Component
// ---------------------------------------------------------------------------

function DevicePreviewFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-[620px] w-[280px] shrink-0 flex-col overflow-hidden rounded-xl border bg-background shadow-sm transition-colors hover:border-foreground/20">
      <div className="flex h-6 shrink-0 items-center justify-between border-b bg-muted/30 px-4 text-[8px] font-semibold text-muted-foreground">
        <span>9:41</span>
        <span>5G</span>
      </div>
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-slate-50">
        {children}
      </div>
      <div className="flex h-3 shrink-0 items-center justify-center border-t bg-background">
        <div className="h-0.5 w-14 rounded-full bg-muted" />
      </div>
    </div>
  );
}

function CaseItemFrame({
  id,
  title,
  subtitle,
  badgeText,
  badgeColor,
  timelineSteps,
  emailTemplates,
  accessPath,
  renderViewport,
}: {
  id?: string;
  title: string;
  subtitle: string;
  badgeText: string;
  badgeColor?: string;
  timelineSteps: Array<{ title: string; desc: string }>;
  emailTemplates?: EmailTemplateProps[];
  accessPath?: AccessPathProps;
  renderViewport: (stepIdx: number) => React.ReactNode;
}) {
  const [selectedEmailIdx, setSelectedEmailIdx] = useState(0);
  void badgeColor;

  return (
    <Card
      id={id}
      className="scroll-mt-28 overflow-hidden shadow-none"
    >
      <CardHeader className="border-b bg-muted/20 pb-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 space-y-2">
            <Badge variant="outline" className="text-muted-foreground">
              {badgeText}
            </Badge>
            <CardTitle className="text-base font-semibold tracking-tight">{title}</CardTitle>
            <CardDescription className="max-w-4xl text-sm leading-relaxed">
              {subtitle}
            </CardDescription>
          </div>
          <div className="shrink-0 rounded-md border bg-background px-3 py-2 text-right">
            <p className="font-mono text-sm font-medium">{timelineSteps.length}</p>
            <p className="text-[10px] text-muted-foreground">steps</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="min-w-0">
          {accessPath && <AccessPathPanel accessPath={accessPath} />}
        </div>

        {/* Email Template Preview (or No Email placeholder) */}
        <div className="w-full">
          {emailTemplates && emailTemplates.length > 0 ? (
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground block">
                  Notification email
                </span>
                {emailTemplates.length > 1 && (
                  <div className="flex gap-1 rounded-md bg-muted p-1">
                    {emailTemplates.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedEmailIdx(idx)}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                          selectedEmailIdx === idx
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Alert {idx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <EmailPreviewFrame {...emailTemplates[selectedEmailIdx]} />
            </div>
          ) : (
            <div className="flex min-h-[142px] w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed p-6 text-center">
              <span className="text-xs font-medium text-muted-foreground">No email notification</span>
              <p className="text-xs text-muted-foreground/80 max-w-[220px]">
                This state exists purely in-app. No automated transactional email is generated.
              </p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Bottom Part: Horizontal Scrollable Step-by-Step Screens */}
      <CardContent className="border-t p-6">
        <div className="flex flex-col gap-3 min-w-0">
          <h4 className="text-xs font-medium text-muted-foreground">
            Visual journey ({timelineSteps.length} steps)
          </h4>

          <div className="flex flex-row overflow-x-auto gap-6 pb-4 pt-1 min-w-0">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col gap-3 shrink-0 w-[280px]">
                {/* Step Header */}
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-muted text-[10px] font-medium text-muted-foreground">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold truncate" title={step.title}>
                    {step.title}
                  </span>
                </div>

                <DevicePreviewFrame>
                  {renderViewport(idx)}
                </DevicePreviewFrame>

                {/* Step Description */}
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5 pr-2">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Wireframe Viewport Renderers
// ---------------------------------------------------------------------------

/** Case 11: Guest QR Active */
function WF_GuestQRActive() {
  return (
    <LiveAppScreen
      title="Live app screen - Guest QR active"
      path="/orders/tkt-010/entry/tkt-010-p2/guest-qr"
    />
  );
}

/**
 * Case 12: a scanned Guest QR.
 * The redesigned pass has no used state — it stays white and claimable — so the
 * scan is only visible on the distribution screen. Reaching that needs a seeded
 * scan, hence a capture rather than a live route.
 */
function WF_GuestQRUsed() {
  return (
    <PurchaseIntentCapture
      capture="guest-manager-scanned"
      title="Guest slot marked used after the gate scan"
    />
  );
}

/** Case 13: Guest QR Revoked */
function WF_GuestQRRevoked() {
  return (
    <LiveAppScreen
      title="Live app screen - Guest QR revoked"
      path="/orders/tkt-010/entry/tkt-010-p2/guest-qr?state=revoked"
    />
  );
}

/** Case 35: Guest QR Claimed into Passport (buyer view) — not a query-param preview state, so this uses a real capture. */
function WF_GuestQRClaimed() {
  return (
    <PurchaseIntentCapture
      capture="buyer-guest-qr-claimed"
      title="Buyer's Guest QR screen after the guest claims it"
    />
  );
}

/** Case 14: Guest Web Page */
function WF_PublicGuestPage() {
  return (
    <LiveAppScreen
      title="Live app screen - Public guest entry"
      path="/guest-entry/GE-CANLAON-42K"
    />
  );
}

/**
 * Case 15: Shared form link — the recipient's destination.
 * '/ticket-claim/:ref' has no page of its own: it resolves the order and entry
 * from its query and hands off to the standard participant form.
 */
function WF_GuestClaimRegister() {
  return (
    <LiveAppScreen
      title="Live app screen - Shared form link destination"
      path="/ticket-claim/CLM-CANLAON-42K?order=tkt-011&entry=tkt-011-p2"
    />
  );
}

/** Case 37: Camera-first add-entry scanner */
function WF_AddEntryScanner() {
  return (
    <LiveAppScreen
      title="Live app screen - Add-entry scanner"
      path="/passport/add-entry"
    />
  );
}

/** Case 38: Add-entry resolved to a used pass (past event) */
function WF_AddEntryPast() {
  return (
    <LiveAppScreen
      title="Live app screen - Add a past event"
      path="/passport/add-entry?code=GE-USED-4218"
    />
  );
}

/** Case 39: Add-entry blocked because the Guest QR was already claimed */
function WF_AddEntryAlreadySaved() {
  return (
    <LiveAppScreen
      title="Live app screen - Entry already saved"
      path="/passport/add-entry?code=GE-TEMP-4021&demoState=added"
    />
  );
}

/** Case 40: Add-entry blocked because the Guest QR was revoked */
function WF_AddEntryUnavailable() {
  return (
    <LiveAppScreen
      title="Live app screen - Entry cannot be added"
      path="/passport/add-entry?code=GE-REVOKED-4218"
    />
  );
}

/** Case 41: Public guest page with a dead reference */
function WF_PublicGuestInvalid() {
  return (
    <LiveAppScreen
      title="Live app screen - Guest QR no longer valid"
      path="/guest-entry/GE-REVOKED-4218"
    />
  );
}

/**
 * Case 50: the desktop web add-entry surface.
 * The iframe is 390px wide, which is the mobile camera surface, so this uses a
 * capture taken at a desktop viewport instead.
 */
function WF_AddEntryWeb() {
  return (
    <PurchaseIntentCapture
      capture="add-entry-web"
      title="Desktop web add-entry surface"
      fit="contain"
    />
  );
}

/** Case 51: order-level identity with one grouped registration list */
function WF_OrdersAdaptiveDetail() {
  return (
    <LiveAppScreen
      title="Live app screen - Adaptive order detail"
      path="/orders/tkt-009"
    />
  );
}

/** Case 49: the pre-checkout participant details gate */
function WF_CheckoutParticipantDetails() {
  return (
    <PurchaseIntentCapture
      capture="checkout-participant-details"
      title="Participant details required before payment"
    />
  );
}

/** Case 45: team player form with the Passport / Guest QR ownership choice */
function WF_TeamOwnerChoice() {
  return (
    <LiveAppScreen
      title="Live app screen - Player entry ownership choice"
      path="/orders/tkt-013/form?returnTo=order&participantId=p7&playerOnly=1"
    />
  );
}

/** Case 46: completed player form, read-only */
function WF_TeamFormCompleted() {
  return (
    <LiveAppScreen
      title="Live app screen - Completed player form details"
      path="/orders/tkt-013/form?returnTo=order&participantId=p1&playerOnly=1"
    />
  );
}

/** Case 47: player invite sent, waiting, with a take-back */
function WF_TeamInviteSent() {
  return (
    <LiveAppScreen
      title="Live app screen - Player invite sent"
      path="/orders/tkt-013/form?returnTo=order&participantId=p5&playerOnly=1"
    />
  );
}

/** Case 48: team order with every player resolved */
function WF_TeamAllReady() {
  return (
    <LiveAppScreen
      title="Live app screen - Team order fully resolved"
      path="/orders/tkt-014"
    />
  );
}

/** Case 42: Organizer form version diff */
function WF_FormDiffReview() {
  return (
    <LiveAppScreen
      title="Live app screen - Form version diff"
      path="/forms/tkt-011-p1/diff"
    />
  );
}

/** Case 43: Passport's "Add a past event" launcher */
function WF_PassportPastLauncher() {
  return (
    <LiveAppScreen
      title="Live app screen - Add a past event launcher"
      path="/passport"
      scrollToText="Add a past event"
    />
  );
}

/**
 * Case 44: First-submit-wins conflict on a shared form link.
 * Reaching this needs a submission from a second account, so it uses a capture.
 */
function WF_InviteClaimConflict() {
  return (
    <PurchaseIntentCapture
      capture="invite-claim-conflict"
      title="Shared form link already claimed by another account"
    />
  );
}

/** Case 16: Guest QR (No Account Flow) */
function WF_TemporaryGuestQR() {
  return (
    <LiveAppScreen
      title="Live app screen - Guest QR"
      path="/orders/tkt-010/entry/tkt-010-p2/guest-qr"
    />
  );
}

/** Case 23: Multi-Guest Order — Buyer Fills All, Distributes QRs */
function WF_MultiGuestManager() {
  return (
    <LiveAppScreen
      title="Live app screen - Multi-guest manager"
      path="/orders/tkt-008/guest-manager"
    />
  );
}

/** Case 21: Lead Transfer */
function WF_GroupShareLive() {
  return (
    <LiveAppScreen
      title="Live app screen - Group claim links"
      path="/order-share/tkt-011"
    />
  );
}

/** Case 22: Events Attending Overview */
function WF_EventsOverview() {
  return (
    <LiveAppScreen
      title="Live app screen - Passport Events attending"
      path="/passport/events"
    />
  );
}

// ---------------------------------------------------------------------------
// Flow Step Definitions
// ---------------------------------------------------------------------------

const FLOWS = {
  // ===== PURCHASE-INTENT SCENARIOS (who buys / who fills / who receives) =====
  scnSolo: [
    { title: 'Checkout & Purchase', desc: 'The buyer buys one ticket for themselves. The buyer pays.' },
    { title: 'Fill own form', desc: 'The buyer completes the organizer form. The form is available on the confirmation screen, or later from Orders.' },
    { title: 'Entry attaches', desc: 'The entry attaches to the buyer\'s Passport. The app does not make invites or extra QR codes.' },
    { title: 'Access at the gate', desc: 'The buyer opens the Passport tab and shows the Universal QR. The staff scans the QR to find the entry.' },
  ],
  scnGroupFillAll: [
    { title: 'Open Orders', desc: 'The buyer opens Orders after the purchase. The buyer selects the order that has their entry and the friend slots.' },
    { title: 'Distribute Guest QRs', desc: 'The buyer opens the guest-distribution screen. This screen controls all the guest slots in one place, with a group-chat share option.' },
    { title: 'Choose per friend', desc: 'For each friend, the buyer makes a Guest QR or sends a claim link. A claim link puts the entry on the friend\'s Passport.' },
    { title: 'Generate guest QRs', desc: 'For app-less friends, the buyer makes and shares Guest QR links. These friends do not need a PlanOut account.' },
    { title: 'Send claim links', desc: 'For Passport friends, the buyer sends a claim link. The friend signs in or makes an account. The entry then attaches to that Passport.' },
    { title: 'Access surfaces', desc: 'The buyer can also manage each slot one at a time from the order detail. Claimed entries move to the recipient\'s Passport.' },
  ],
  scnGroupSendFriend: [
    { title: 'Checkout & Purchase', desc: 'The buyer buys two tickets. One ticket is for the buyer. One ticket is for a friend who controls their own entry.' },
    { title: 'Fill own form', desc: 'The buyer completes their own organizer form. The buyer\'s entry attaches to their Passport.' },
    { title: 'Email — claim link sent', desc: 'The buyer copies the claim link from Orders. The buyer sends the link by email or message. This step occurs outside PlanOut.' },
    { title: 'Friend registers', desc: 'The friend opens the link at /ticket-claim/:claimRef. The friend signs in or makes a PlanOut account. The friend then completes the organizer form.' },
    { title: 'Access surfaces', desc: 'The buyer keeps their entry on their Passport. The friend\'s entry attaches to the friend\'s Passport.' },
  ],
  scnDependent: [
    { title: 'Checkout & Purchase', desc: 'The buyer buys a ticket for a person who will not use a PlanOut account.' },
    { title: 'Fill form on behalf', desc: 'The buyer opens Orders. The buyer completes all the organizer fields for the guest.' },
    { title: 'Generate Guest QR', desc: 'The buyer taps Generate & send QR in Orders. This makes an app-less Guest QR. The guest does not need an app, a login, or an account.' },
    { title: 'Print or send QR — external', desc: 'The buyer prints the Guest QR or sends the web link by SMS or message. This step occurs outside PlanOut.' },
    { title: 'Access surfaces — outcome', desc: 'The buyer controls the Guest QR from Orders. The staff scans the guest in at the gate. The entry does not attach to a Passport.' },
  ],
  scnMixed: [
    { title: 'Checkout & Purchase', desc: 'The buyer buys three tickets in one order. One ticket is for the buyer. Two tickets are for other persons.' },
    { title: 'Open Orders', desc: 'The order shows a "Forms needed" label with the number of slots that need action.' },
    { title: 'Choose per slot', desc: 'The buyer selects an option for each slot: complete the form, send a claim link (account necessary), or send a Guest QR (no account).' },
    { title: 'Access surfaces', desc: 'The buyer\'s entry is on their Passport. The claimed entry is on the friend\'s Passport. The guest uses the Guest QR. Orders shows all three.' },
  ],
  scnGiftTransfer: [
    { title: 'Checkout & Purchase', desc: 'The buyer buys a ticket for a friend. The buyer does not attend.' },
    { title: 'Email — form link sent', desc: 'The buyer copies the form link from Orders. The buyer sends the link by email or message. This step occurs outside PlanOut.' },
    { title: 'Friend registers & fills', desc: 'The friend opens the link at /ticket-claim/:claimRef. The friend signs in or makes an account. The friend completes the organizer form.' },
    { title: 'Entry attaches — outcome', desc: 'After the friend completes the form, the entry attaches to the friend\'s Passport.' },
    { title: 'Organizer transfer only', desc: 'If the form is already complete, only the organizer can transfer the entry. The buyer must contact the organizer.' },
  ],
  scnGiftGuestQR: [
    { title: 'Checkout & Purchase', desc: 'The buyer buys access for another person. The buyer does not attend.' },
    { title: 'Buyer fills form', desc: 'The recipient does not use an account. Because of this, the buyer completes the organizer form for the recipient.' },
    { title: 'Generate Guest QR', desc: 'The buyer makes the Guest QR. The same Guest QR applies to adult friends, children, elderly relatives, and dependents.' },
    { title: 'Share or print QR', desc: 'The buyer sends the Guest QR link, or prints the QR for the gate scan.' },
    { title: 'Access surfaces', desc: 'The buyer monitors the Guest QR from Orders. The recipient does not get Passport ownership.' },
  ],
  scnTeam: [
    { title: 'Checkout & Purchase', desc: 'The buyer buys one team registration. The organizer sets the minimum and maximum player counts. This stays one purchase and one financial registration item.' },
    { title: 'Size the roster', desc: 'The buyer adds player entries from the team order with "Add player", up to the organizer maximum, and can remove an extra slot back down to the organizer minimum. Only an unsent, unfilled slot can be removed. Adding a slot does not open a form.' },
    { title: 'Choose access per player', desc: 'From the team order, the buyer sends a claim link, or completes the form and makes a Guest QR for each player.' },
    { title: 'Players resolve access', desc: 'Players with claim links attach to their own Passports. App-less players use their Guest QRs.' },
    { title: 'Gate access', desc: 'Each player shows their own Passport or Guest QR at the gate.' },
  ],
  scnLeadTransfer: [
    { title: 'Guest QR shared', desc: 'The buyer completes the organizer form. The buyer shares an app-less Guest QR.' },
    { title: 'Guest attends or keeps code', desc: 'The guest can show the QR at the gate. The guest can also keep the code and make an account later.' },
    { title: 'Open add-entry flow', desc: 'The guest signs in or makes an account, then opens the scanner from Passport and scans the QR, or uploads a saved photo of it.' },
    { title: 'Claim once', desc: 'A recognized code is claimed on the spot and Passport confirms it with a toast. Opening a direct /passport/add-entry?code= link instead shows the review screen first, which is the recovery path for a shared link.' },
    { title: 'Guest QR invalidated', desc: 'The Passport keeps the entry and the check-in record. The Guest QR becomes invalid. A second claim is not possible.' },
  ],
  scnPastPassClaim: [
    { title: 'Guest QR used at the gate', desc: 'The guest shows the app-less Guest QR at the gate. The staff scans it. The pass records the check-in time and the gate, and the QR stops working for entry.' },
    { title: 'Open the past-event scanner', desc: 'The guest signs in or makes an account later. On the Passport tab, the "Add a past event" card opens the in-app camera.' },
    { title: 'Scan the used pass', desc: 'The guest scans the same Guest QR or uploads a saved photo of it. A used pass still resolves, because the check-in record is what makes it worth keeping.' },
    { title: 'Confirm the past event', desc: 'A direct /passport/add-entry?code= link shows the review screen: the event, the participant, and the check-in stamp, stating that adding it keeps history only and creates no new gate QR. A camera scan skips this and claims outright.' },
    { title: 'Passport keeps the history', desc: 'The event joins the Passport history for that account. The original Guest QR becomes permanently inactive, so no second Passport can claim the same check-in.' },
  ],
  cardFront: [
    { title: 'Checkout & Purchase', desc: 'The user puts one ticket in the cart. The user completes the checkout and starts the registration.' },
    { title: 'User Registers / Activates', desc: 'The user completes the registration. The system makes a Universal Passport.' },
    { title: 'Welcome Email Sent', desc: 'The system sends a welcome email. The email has the Passport Code and the offline instructions.' },
    { title: 'View Passport in App', desc: 'The user opens the Passport tab. The card shows the dynamic QR on a white page, under the PlanOut Passport wordmark, with the holder name and passport code.' },
  ],
  cardFrontActions: [
    { title: 'Checkout & Purchase', desc: 'The user buys a ticket on PlanOut. The Universal Passport becomes active.' },
    { title: 'Open Passport Front', desc: 'The user opens the Passport tab. The front card shows the dynamic QR as a premium tile that expands on tap.' },
    { title: 'Open Events', desc: 'The user taps Events on the front action row. This shows the registrations and the forms that are not complete.' },
    { title: 'Save or Regenerate QR', desc: 'The user can save the Passport or make a new QR from the front actions.' },
  ],
  inlineForm: [
    { title: 'Checkout & Purchase', desc: 'The user puts one ticket in the cart and starts the checkout.' },
    { title: 'Payment Completes', desc: 'The payment is successful. The confirmation screen opens.' },
    { title: 'Form Pending Warning', desc: 'The order has only one ticket. Because of this, the confirmation screen shows the organizer form.' },
    { title: 'Email Sent', desc: 'The system sends a reminder email about the form.' },
    { title: 'Fill & Submit Inline', desc: 'The user examines the name and email fields. The user completes the organizer fields and submits the form.' },
  ],
  formTaskSingle: [
    { title: 'Checkout & Purchase', desc: 'The user buys one ticket. The organizer form is not complete at this point.' },
    { title: 'Open Orders', desc: 'The order shows a "Forms needed" label. A floating "Finish Forms" pill on other pages also opens Orders.' },
    { title: 'View pending row', desc: 'The order detail shows "Forms still needed — participant form required" for the entry.' },
    { title: 'Complete Form', desc: 'The user taps "Complete forms". The participant form opens.' },
  ],
  pendingPayment: [
    { title: 'Checkout & Purchase', desc: 'The user completes the checkout with an offline payment, for example a bank transfer.' },
    { title: 'Order Created', desc: 'The system makes the order. The payment is not confirmed at this point.' },
    { title: 'Locked State Displays', desc: 'Settings → Transactions shows the record as Pending: "Awaiting Payment — your order is reserved". The timeline stops before Confirmation.' },
    { title: 'Payment Confirms', desc: 'The system confirms the payment. The order then unlocks the forms and the Passport access.' },
  ],
  resubmitRequired: [
    { title: 'Checkout & Purchase', desc: 'The user buys a ticket, completes the participant data, and submits the organizer form.' },
    { title: 'Organizer Updates Form', desc: 'The organizer changes the form requirements after the first submission.' },
    { title: 'Resubmit Notification', desc: 'The system sends a notification about the change. The entry in Orders shows "Review changes".' },
    { title: 'Review & Resubmit', desc: 'The form-diff screen shows each field as Unchanged, Updated, New, or Removed. The user then taps "Review and resubmit form".' },
  ],
  attached: [
    { title: 'Checkout & Purchase', desc: 'The user buys a ticket. The user completes all the participant data during or after the checkout.' },
    { title: 'All Requirements Met', desc: 'The payment is complete. The forms are complete. The organizer requirements are satisfied.' },
    { title: 'Ready Notification Sent', desc: 'The system sends a confirmation email. The email shows that all the forms and data are complete.' },
    { title: 'Passport Renders Green', desc: 'The Passport shows a green event card with the "Ready" label. There are no open tasks.' },
  ],
  spotReleased: [
    { title: 'Checkout & Purchase', desc: 'The user buys a ticket. The form is not complete and has a deadline.' },
    { title: 'Deadline Passes', desc: 'The deadline passes. The form is not complete at that time.' },
    { title: 'Spot Auto-Released', desc: 'The system releases the slot to the event inventory. The system does not give a refund.' },
    { title: 'Notification Sent', desc: 'The system tells the user by email and in the app that the slot is released.' },
    { title: 'Browse Again Option', desc: 'The user can open the event page and register again if slots are available.' },
  ],
  pastAttended: [
    { title: 'Checkout & Purchase', desc: 'The user buys a ticket and completes the data. The payment is complete. The entry attaches.' },
    { title: 'Scanned & Authenticated', desc: 'The staff scans the QR. The system records the "Attended" status and the time.' },
    { title: 'Check-In Confirmed Email', desc: 'The system sends a check-in confirmation email with the bib data.' },
    { title: 'Passport Updates State', desc: 'The entry moves to the Past events section with a check-in record.' },
  ],
  pastNoShow: [
    { title: 'Checkout & Purchase', desc: 'The user buys a ticket and completes the data. The entry attaches.' },
    { title: 'Absent on Event Day', desc: 'The participant does not check in at the gate before the deadline.' },
    { title: 'Database Tagged No-Show', desc: 'The system sets the entry to "No-show". The QR becomes permanently unserviceable.' },
    { title: 'No-Show Alert Email', desc: 'The system sends an email to the user with the no-show status and the available options.' },
  ],
  guestActive: [
    { title: 'Checkout & Purchase', desc: 'The buyer buys entries for other persons. The buyer completes the checkout and selects "No, they\'re going without me".' },
    { title: 'Separate QR Generated', desc: 'The buyer selects the Guest QR option. The entry moves to the guest management panel.' },
    { title: 'Guest Receives Link', desc: 'The system sends the Guest QR link to the guest by email. The status changes to "Active".' },
    { title: 'Pass Shows The Credential', desc: 'The "Guest access pass" screen shows one perforated ticket: attendee, event, QR, reference, gate, and validity. Share Guest QR is the primary action and Regenerate QR replaces the code in place.' },
  ],
  guestUsed: [
    { title: 'Checkout & Purchase', desc: 'The buyer buys entries for other persons. The buyer makes and shares the Guest QR link.' },
    { title: 'Gate Scan Complete', desc: 'The guest shows the pass at the gate. The staff scans it. The code is spent for entry.' },
    { title: 'Buyer Notified', desc: 'The system sends an email to the buyer: "Your guest has checked in!".' },
    { title: 'Slot Shows Used', desc: 'The distribution screen marks the slot "Used" and reads "Scanned <time> · still claimable once". The pass itself stays white, because the past event can still join one Passport.' },
  ],
  guestRevoked: [
    { title: 'Checkout & Purchase', desc: 'The buyer buys entries for other persons. The buyer makes and shares the Guest QR.' },
    { title: 'Buyer Click Revoke', desc: 'The buyer cancels the pass from the guest slot on the distribution screen.' },
    { title: 'Guest Notified', desc: 'The system sends an email to the guest. The email says that the ticket is cancelled.' },
    { title: 'Pass Shows Revoked', desc: 'The pass turns muted and carries a rotated "REVOKED" stamp over the QR. The code no longer works and cannot be claimed.' },
  ],
  guestClaimed: [
    { title: 'Checkout & Purchase', desc: 'The buyer buys entries for other persons. The buyer makes and shares the Guest QR.' },
    { title: 'Guest Signs In', desc: 'The guest decides to make a PlanOut account. The guest signs in and opens the scanner from the Passport tab, then scans the same Guest QR or uploads a saved photo of it.' },
    { title: 'Guest Confirms Claim', desc: 'The guest reviews the entry and taps "Add to my Passport". The claim happens one time only.' },
    { title: 'Manager Shows Claimed', desc: 'The buyer\'s Guest QR screen shows a "Claimed" label and a "CLAIMED" mark over the QR. The QR cannot be shared, scanned, or claimed again.' },
  ],
  publicGuestPage: [
    { title: 'Checkout & Purchase', desc: 'The buyer buys entries for other persons. The buyer makes the Guest QR and shares the link.' },
    { title: 'Open Web Viewport', desc: 'The guest opens the link in a browser. The public guest page opens. A login is not necessary.' },
    { title: 'Check-In scanned', desc: 'The guest shows the web QR at the gate. The staff scans the QR. The status changes to "Used".' },
    { title: 'Sign Up Call to Action', desc: 'The page shows a banner: "Get your own PlanOut Passport".' },
  ],
  guestClaimRegister: [
    { title: 'Checkout & Purchase', desc: 'The buyer buys a ticket for another person. The buyer sends that person the form link instead of filling the form.' },
    { title: 'Buyer Shares Ticket', desc: 'The buyer opens "Share form" on the entry and picks Send link or Copy link. Both produce the same /ticket-claim/:ref link with the order and entry attached, so the two paths differ only in delivery.' },
    { title: 'Claim Email Received', desc: 'The recipient receives the link by email or chat. The invited email is informational only, because a link can be forwarded.' },
    { title: 'Login or Register', desc: 'The link has no claim page of its own. A signed-out recipient gets the normal login screen with the form as the return destination, then lands on the standard participant form.' },
    { title: 'Passport Bound', desc: 'Submitting the form claims the entry for the account that submitted it. Opening the link reserves nothing.' },
  ],
  addEntryScanner: [
    { title: 'Guest QR received', desc: 'The person holds an app-less Guest QR, either as a link or as a printed code.' },
    { title: 'Sign in first', desc: 'The add-entry screen needs an account, because the entry has to land on a specific Passport.' },
    { title: 'Open the scanner', desc: 'Passport → Add a past event → Scan event QR opens the full-screen camera surface. The route is canonical: ?scan=1 always means the focused scanner, with no stale result behind it.' },
    { title: 'Claim on a good scan', desc: 'A recognized, eligible code is claimed immediately and the app returns to Passport with an "Entry added to Passport" toast. A missing, revoked, or already-claimed code stays in the scanner with a specific error toast. "Upload QR" and the sample code cover a blocked camera.' },
  ],
  addEntryPast: [
    { title: 'Pass already used', desc: 'The Guest QR was scanned at the gate. The pass carries a check-in time and a gate.' },
    { title: 'Resolve the code', desc: 'The scanner or the manual code opens the resolved-entry state at ?code=.' },
    { title: 'Review the past event', desc: 'The screen shows the event, the participant, the access gate, and the check-in stamp.' },
    { title: 'Confirm history only', desc: 'The copy states that adding it keeps the past event in Passport history and does not create a new gate QR.' },
  ],
  addEntryAlreadySaved: [
    { title: 'Entry already claimed', desc: 'The same Guest QR was already added to a Passport. A Guest QR may become Passport history exactly once.' },
    { title: 'Reopen the code', desc: 'The holder scans the code again, or opens its ?code= link, from the same account or a different one.' },
    { title: 'Blocked with a reason', desc: 'The screen shows an "Added" status and states that the entry is already saved. There is no second claim action.' },
    { title: 'Route to the record', desc: 'View Passport takes the owner to the entry. Scan another Guest QR restarts the scanner for a different code.' },
  ],
  addEntryUnavailable: [
    { title: 'Buyer revokes the QR', desc: 'The buyer revokes the Guest QR from Orders before anybody claims it.' },
    { title: 'Holder tries to claim', desc: 'The holder scans the code, or opens its ?code= link, on the add-entry screen.' },
    { title: 'Claim refused', desc: 'The screen shows an "Unavailable" status and states that the Guest QR was revoked before it could be added.' },
    { title: 'Return path only', desc: 'The actions are Return to Passport and Scan another Guest QR. Recovery is the buyer resending a new QR.' },
  ],
  publicGuestInvalid: [
    { title: 'Link shared outside the app', desc: 'The public /guest-entry/:ref page needs no login, so the link is the credential.' },
    { title: 'Buyer revokes or the ref is wrong', desc: 'The buyer revokes the pass from Orders, or the recipient opens a mistyped or expired reference.' },
    { title: 'Public page explains', desc: 'A revoked pass reads "This entry QR is no longer valid" and names the buyer to contact. An unknown reference reads "Entry QR not found".' },
    { title: 'No self-service recovery', desc: 'The page offers no claim or retry action. The buyer has to generate and resend a new Guest QR.' },
  ],
  formDiffReview: [
    { title: 'Form already submitted', desc: 'The participant completed and submitted the organizer form.' },
    { title: 'Organizer edits the form', desc: 'The organizer changes the requirements after that submission, which raises the form version.' },
    { title: 'Review changes', desc: 'Orders shows "Review changes" on the entry. The link opens the version diff at /forms/:entryId/diff.' },
    { title: 'Field-level diff', desc: 'Each field is labelled Unchanged, Updated, New field, or Removed, with previous data pre-filled, then the participant resubmits.' },
  ],
  passportPastLauncher: [
    { title: 'Open Passport', desc: 'The account holder opens the Passport tab.' },
    { title: 'Find the add-pass sheet', desc: 'Below the Passport card sits one compact Wallet-style sheet: a circular scan symbol, the heading "Add a past event", and one line — "Save an event you attended to your Passport."' },
    { title: 'One action row', desc: '"Scan event QR" is the single full-width action, with "Camera or saved QR photo" as metadata inside the row rather than a separate paragraph. There is no empty-state sentence: the action is the zero-state guidance.' },
    { title: 'History appears when it exists', desc: 'A "Past events" list renders only once entries have been claimed, separated by one subtle divider, each a compact pass row with an "Added" status.' },
  ],
  addEntryWeb: [
    { title: 'Guest QR arrives on a computer', desc: 'The pass reaches the holder as an emailed link or a saved image, and they open Passport in a desktop browser.' },
    { title: 'The web surface replaces the camera', desc: 'At 768px and above, /passport/add-entry renders a light web entry surface titled "Add a Guest QR to Passport". It never calls for camera access, mounts no video element, and shows no camera-flip control.' },
    { title: 'Upload the saved photo', desc: 'One action — "Upload QR photo" — takes an image of the pass from the computer. The page states plainly that the image stays on the device; decoding happens locally through the same jsQR path as the phone.' },
    { title: 'Same claim rules after decoding', desc: 'A decoded reference joins the existing ?code= resolution, so eligible, revoked, and already-claimed records behave exactly as they do on a phone. Below 768px the camera-first scanner is untouched.' },
  ],
  ordersAdaptiveDetail: [
    { title: 'Open an order', desc: 'Orders lists photo-led cards carrying the status label, purchase date, event title, quantity, and amount.' },
    { title: 'The order is the identity', desc: 'Order Details leads with the order, not its first event: a status label, the purchase date, the reference, and a truthful title — a multi-event purchase reads "3-event order" with its item count and total.' },
    { title: 'One registration list', desc: 'Every entry lives in a single continuous Registration surface with subtle dividers instead of a stack of separate cards. The heading carries the aggregate pending-form state and the bulk controls, "Send all" and "Copy all".' },
    { title: 'Status then action per event', desc: 'Inside the list each event keeps its own identity, its registration status, and its most important action, with recovery and sharing actions visually secondary.' },
  ],
  checkoutParticipantDetails: [
    { title: 'Only gated forms block payment', desc: 'A mixed cart can hold entries whose details are required before payment and entries whose details can wait. Checkout opens the gate for the first kind only, under a "Required before payment" label.' },
    { title: 'The count is the requirement', desc: 'The progress reads against the gated entries alone — "1/1 required before payment" — so the number never implies work that does not block payment. Only gated entries appear as editable tabs.' },
    { title: 'Choose who each entry is for', desc: 'Buyer-filled slots ask "This entry is for": "For me" attaches to the buyer\'s Passport, "For someone else" produces a buyer-filled Guest QR. This is the same question the Orders and team player forms ask.' },
    { title: 'Deferred work is named up front', desc: 'An inline "After payment" summary lists the deferred events and categories before payment is submitted, and says those forms stay available from confirmation, Orders, or Passport. It uses the calm form surface, not a warning color — amber stays reserved for deadlines and problems.' },
  ],
  teamOwnerChoice: [
    { title: 'Open a player entry', desc: 'From the team order, the buyer opens a player row that still needs a form.' },
    { title: 'Choose who the entry is for', desc: 'The form opens with "This entry is for": "For me" attaches to the buyer\'s own Passport, "For someone else" produces a buyer-filled Guest QR.' },
    { title: 'One Passport entry per account', desc: 'Once the order already has a Passport entry for the buyer, "For me" is locked and the screen explains that additional player entries use Guest QR or claim links.' },
    { title: 'The choice is recorded', desc: 'Submitting stores the selected ownership path with the completed form, so the order row and the gate credential agree.' },
  ],
  teamFormCompleted: [
    { title: 'Player form submitted', desc: 'A player entry is complete, either filled by the buyer or claimed and submitted by the recipient.' },
    { title: 'Open it from the order', desc: 'The team row shows "View form" and opens the same player form route in read-only mode.' },
    { title: 'Read-only details', desc: 'The screen is titled "Form details" and shows a "Completed" state with the recorded name and email instead of editable fields.' },
    { title: 'Access stays where it was assigned', desc: 'Reading the form does not change ownership. A Passport player keeps their Passport entry, a buyer-filled player keeps their Guest QR.' },
  ],
  teamInviteSent: [
    { title: 'Buyer sends a player link', desc: 'The buyer sends a claim link to a player from the team order.' },
    { title: 'The row shows the sent state', desc: 'The order row shows the recipient and a Revoke action. A saved address is never shown as sent until the invite actually goes out.' },
    { title: 'Form details shows the wait', desc: 'Opening that player shows "Invitation Sent", the recipient address, "Change Email", and "Waiting for participant to complete form…".' },
    { title: 'The buyer can take it back', desc: 'Revoke on the order row, or "I\'ll fill this out myself instead" on the form, returns the entry to buyer-filled mode. The old link stops working.' },
  ],
  teamAllReady: [
    { title: 'Every player resolved', desc: 'All player entries have a completed form and an assigned access path.' },
    { title: 'The order reads Full', desc: 'The team card shows "Players 6 of 6 ready" with a "Full" marker, so no slot is waiting.' },
    { title: 'Rows name their owner', desc: 'Passport players show the recorded owner, and the buyer\'s own row is labeled "You". Buyer-managed players keep their Guest QR.' },
    { title: 'Actions become read and show', desc: 'The pending actions are gone. Each row keeps "View form", and buyer-managed players keep "View QR".' },
  ],
  inviteClaimConflict: [
    { title: 'Link reaches two people', desc: 'A shared form link can be forwarded or reposted, so more than one account can open the same entry.' },
    { title: 'First submission wins', desc: 'Opening the link reserves nothing. The first completed submission owns the entry and its Passport.' },
    { title: 'Later submit refused', desc: 'A second account submitting the same entry stays on the standard form and gets an inline notice naming the account that completed it first.' },
    { title: 'Answers are preserved', desc: 'The typed answers stay on screen and are never attached to the other Passport. The invite submit action is replaced by "Copy my answers", so the entry cannot be overwritten. The same panel covers a claim link the buyer unsent before it was accepted.' },
  ],
  temporaryGuestQR: [
    { title: 'Checkout & Purchase', desc: 'The buyer buys entries for a person who will not use a PlanOut account.' },
    { title: 'Buyer Fills Form', desc: 'The buyer taps "Fill Form on Behalf" in Orders. The buyer completes all the organizer fields for the guest.' },
    { title: 'Generate Guest QR', desc: 'The buyer taps "Generate & send QR". The system makes the Guest QR.' },
    { title: 'Print or SMS link', desc: 'The buyer prints the Guest QR or sends the web link to the guest\'s telephone.' },
    { title: 'Direct gate scan', desc: 'The staff scans the guest in at the gate. The guest does not need the app or a login.' },
  ],
  multiGuestManager: [
    { title: 'Checkout & Purchase', desc: 'The buyer buys many tickets for other persons. The buyer does not attend. The buyer controls all the entries.' },
    { title: 'Fill All Forms', desc: 'The buyer completes the organizer fields for each slot from Orders. The buyer does not send invites.' },
    { title: 'Individual QRs Generated', desc: 'The system makes one Guest QR for each slot. The buyer can share or revoke each QR separately.' },
    { title: 'Distribute QRs', desc: 'The buyer sends each QR by link or email. The guests open the web page. The guests do not need an app or an account.' },
    { title: 'Multi-Guest Manager', desc: 'The guest management screen shows the status of each QR: Active, Used, or Revoked. The buyer can share or revoke each one.' },
  ],
  formTaskMulti: [
    { title: 'Checkout & Purchase', desc: 'The buyer buys tickets for more than one participant in one order.' },
    { title: 'Open Orders', desc: 'The order shows a "Forms needed" label with the number of open forms.' },
    { title: 'Manage Forms', desc: 'The group participant form shows the progress of each slot. The buyer completes each slot or sends a claim link.' },
  ],
  teamProgress: [
    { title: 'Checkout & Purchase', desc: 'The buyer selects a team package. The buyer pays and completes the checkout.' },
    { title: 'Team Package Purchased', desc: 'The buyer registers a team. The slots stay locked until the player forms are complete.' },
    { title: 'Monitor Player Access', desc: 'The team order shows each player entry and whether it has a Guest QR, Passport access, a claim link in progress, or still needs setup.' },
    { title: 'Save Per-Player Paths', desc: 'From each player row in Orders, the buyer completes details for a Guest QR or sends a claim link. There is no team-wide Passport or gate credential.' },
  ],
  teamRosterList: [
    { title: 'Checkout & Purchase', desc: 'The buyer buys a team package. The buyer opens the team order from Orders.' },
    { title: 'Fill Or Send Per Player', desc: 'For each player row in the order, the buyer completes the form for an app-less Guest QR or sends a claim link.' },
    { title: 'Players Complete Forms', desc: 'Players with claim links sign in or make an account. They complete the organizer form. Their entries attach to their own Passports.' },
    { title: 'Player Access Updates Live', desc: 'The player entries show Guest QR ready, Passport access, claim link sent, or entry setup needed.' },
  ],
  formTaskTeam: [
    { title: 'Checkout & Purchase', desc: 'The buyer buys a team package. The player forms are not complete at this point.' },
    { title: 'Open Orders', desc: 'The team order shows one consolidated registration item, with its own price, for the whole team.' },
    { title: 'View Player Entries Card', desc: 'A "Player entries" card shows "X of Y player entries set up" and keeps each player action in the order.' },
    { title: 'Set Player Access', desc: 'Each player row offers Complete form, send/copy form link, or Open Guest QR as that player becomes ready.' },
  ],
  groupShare: [
    { title: 'Buyer shares once', desc: 'The buyer sends one group link. The link has the available claim links.' },
    { title: 'Recipient chooses entry', desc: 'Each recipient selects their own entry.' },
    { title: 'Login or Register', desc: 'The recipient signs in or makes an account. The organizer form then opens.' },
    { title: 'Entry attached', desc: 'The recipient submits the form. The entry attaches to that Passport.' },
  ],
  eventsOverview: [
    { title: 'Checkout & Purchase', desc: 'The user buys entries for more than one event on PlanOut.' },
    { title: 'Open Events Attending', desc: 'The user taps "Events" on the Passport front actions. All the registrations show.' },
    { title: 'View Pages', desc: 'The page shows four sections: Forms needed, Ready for access, Status updates, and Past events.' },
    { title: 'Act on Entries', desc: 'The user can complete forms, look for released events, or examine the past attendance records.' },
  ],
};

const EMAIL_CATALOG = {
  welcome: {
    subject: 'Your PlanOut Passport is active',
    toName: 'Jessica Sanchez',
    toEmail: 'jessica@email.com',
    headline: 'Your Passport is ready for event access',
    paragraphs: [
      'Your PlanOut Passport has been created and linked to this email. It is now the access layer for your eligible event registrations.',
      'Use it to review upcoming entries, complete organizer requirements, and present your live QR when a ticket is ready for scanning.',
      'For event day, keep the Passport available on your phone or save a backup before arriving at the gate.',
    ],
    details: {
      'Passport Code': 'M-4019-92',
      'Account Email': 'jessica@email.com',
      'Access Type': 'Universal Passport',
      'Security': 'Dynamic QR credential',
    },
    ctaText: 'View My Passport',
  },
  formRequired: {
    subject: 'Complete your Canlaon Marathon form',
    toName: 'Jessica Sanchez',
    toEmail: 'jessica@email.com',
    headline: 'Complete your details to unlock your entry',
    paragraphs: [
      'Your purchase for Canlaon Marathon 2026 is confirmed, but your entry is not ready for gate scanning yet.',
      'The organizer requires a few participant details before PlanOut can attach the ticket to your Passport.',
      'Submit the form before the deadline so your slot stays reserved and your QR can be activated.',
    ],
    details: {
      'Event': 'Canlaon Marathon 2026',
      'Category': '42K Full Marathon',
      'Requirement': 'Organizer form',
      'Deadline': 'June 15, 2026',
    },
    ctaText: 'Complete Registration Form',
  },
  resubmitRequired: {
    subject: 'Please update your Aquathlon form',
    toName: 'Jessica Sanchez',
    toEmail: 'jessica@email.com',
    headline: 'A form update is required for your entry',
    paragraphs: [
      'The organizer updated the required participant information for Aquathlon Dumaguete 2026.',
      'Please review the new fields and resubmit your form so your ticket can remain valid.',
      'Until the update is completed, your Passport will show this entry as needing attention.',
    ],
    details: {
      'Event': 'Aquathlon Dumaguete 2026',
      'Category': 'Sprint Distance',
      'Status': 'Resubmission Required',
      'Updated Fields': 'Organizer requirements',
    },
    ctaText: 'Review and Resubmit',
  },
  spotReleased: {
    subject: 'Your slot for Emerald Pickleball Cup has been released',
    toName: 'Jessica Sanchez',
    toEmail: 'jessica@email.com',
    headline: 'Your reserved slot has been released',
    paragraphs: [
      'The required form deadline passed before your participant details were completed.',
      'Your Emerald Pickleball Cup slot has been returned to available inventory based on the organizer\'s registration rules.',
      'You can check the event page to see whether a new slot is still available.',
    ],
    details: {
      'Event': 'Emerald Pickleball Cup',
      'Category': 'Singles',
      'Status': 'Spot Released',
      'Missed Deadline': 'June 20, 2026',
    },
    ctaText: 'Browse Event Again',
  },
  ticketReady: {
    subject: 'Your Canlaon Marathon ticket is ready',
    toName: 'Jessica Sanchez',
    toEmail: 'jessica@email.com',
    headline: 'Your entry is attached to your Passport',
    paragraphs: [
      'Your registration details have been accepted for Canlaon Marathon 2026.',
      'The ticket is now attached to your PlanOut Passport and ready for event-day access.',
      'Review the athlete guide before arrival for start time, bib release, and gate instructions.',
    ],
    details: {
      'Event': 'Canlaon Marathon 2026',
      'Category': '42K Full Marathon',
      'Bib Number': '#1247',
      'Gate': 'Main Gate Entrance',
      'Passport Status': 'Attached and ready',
    },
    ctaText: 'View Athlete Guide',
  },
  checkinSuccess: {
    subject: 'Check-in confirmed for Canlaon Marathon',
    toName: 'Jessica Sanchez',
    toEmail: 'jessica@email.com',
    headline: 'Your gate check-in is confirmed',
    paragraphs: [
      'Your PlanOut Passport was scanned successfully at the main entry gate.',
      'You are now checked in for Canlaon Marathon 2026. Keep this confirmation for your race-day record.',
    ],
    details: {
      'Event': 'Canlaon Marathon 2026',
      'Check-In Time': '4:12 AM - June 27, 2026',
      'Gate': 'Main Gate Entrance',
      'Bib Number': '#1247',
      'Race Status': 'Checked In',
    },
    ctaText: 'View Live Race Timing',
  },
  noShow: {
    subject: 'We missed you at Canlaon Marathon 2026',
    toName: 'Jessica Sanchez',
    toEmail: 'jessica@email.com',
    headline: 'Your entry was marked as not checked in',
    paragraphs: [
      'The organizer did not record a gate scan for your Passport before check-in closed.',
      'Your Canlaon Marathon 2026 registration has been marked as a no-show in PlanOut.',
      'If you believe this is incorrect, contact the organizer so they can review the event record.',
    ],
    details: {
      'Event': 'Canlaon Marathon 2026',
      'Category': '42K Full Marathon',
      'Attendance Status': 'No-Show',
      'Event Date': 'June 27, 2026',
    },
    ctaText: 'Contact Event Organizer',
  },
  guestLink: {
    subject: 'Your Canlaon Marathon guest QR is ready',
    toName: 'Daniel Vance',
    toEmail: 'daniel@email.com',
    headline: 'Your guest entry QR is ready',
    paragraphs: [
      'Jessica Sanchez shared a Canlaon Marathon 2026 entry with you.',
      'No PlanOut account is required. Open your guest QR before arriving and show it to gate staff for one-time scanning.',
      'This QR can be revoked or replaced by the buyer, so use the latest link you received.',
    ],
    details: {
      'Event': 'Canlaon Marathon 2026',
      'Category': '42K Full Marathon',
      'Gate': 'Main Gate Entrance',
      'Shared By': 'Jessica Sanchez',
      'Event Date': 'June 27, 2026',
    },
    ctaText: 'View Guest Entry QR',
  },
  guestCheckedIn: {
    subject: 'Daniel Vance has checked in',
    toName: 'Jessica Sanchez',
    toEmail: 'jessica@email.com',
    headline: 'Your guest QR was used at the gate',
    paragraphs: [
      'The guest entry QR you shared for Canlaon Marathon 2026 was scanned successfully.',
      'Daniel Vance is now marked checked in. This guest QR cannot be reused or shared again.',
    ],
    details: {
      'Guest Name': 'Daniel Vance',
      'Scanned At': 'Main Gate - 4:18 AM',
      'Event': 'Canlaon Marathon 2026',
      'QR Status': 'Used',
    },
    ctaText: 'View Order Details',
  },
  guestRevoked: {
    subject: 'Your shared guest QR was revoked',
    toName: 'Daniel Vance',
    toEmail: 'daniel@email.com',
    headline: 'This guest QR is no longer valid',
    paragraphs: [
      'Jessica Sanchez revoked the guest entry QR previously shared with you for Canlaon Marathon 2026.',
      'The old QR will no longer scan at the gate. Please do not use a saved screenshot or printed copy.',
      'If you still need access, contact Jessica Sanchez for a replacement QR or transfer.',
    ],
    details: {
      'Event': 'Canlaon Marathon 2026',
      'Revoked By': 'Jessica Sanchez',
      'QR Status': 'Revoked',
      'Updated': 'June 10, 2026',
    },
    ctaText: 'Contact Jessica',
  },
  guestClaim: {
    subject: 'Claim your Canlaon Marathon ticket',
    toName: 'Daniel Vance',
    toEmail: 'daniel@email.com',
    headline: 'Jessica shared a ticket for you to claim',
    paragraphs: [
      'Jessica Sanchez assigned you an entry for Canlaon Marathon 2026.',
      'This email contains the claim link only. PlanOut does not match the ticket to an account until you open the link and authenticate.',
      'Sign in with an existing PlanOut account or create a new one, complete the organizer form, and the ticket will attach to that Passport.',
    ],
    details: {
      'Shared By': 'Jessica Sanchez',
      'Event': 'Canlaon Marathon 2026',
      'Category': '42K Full Marathon',
      'Account Step': 'Login or create account',
      'Claim Deadline': 'June 15, 2026',
    },
    ctaText: 'Open Claim Link',
  },
  temporaryQR: {
    subject: 'Your Canlaon Marathon web QR is ready',
    toName: 'Arthur Sanchez',
    toEmail: 'arthur.s@email.com',
    headline: 'Your app-less entry pass is ready',
    paragraphs: [
      'Jessica Sanchez completed the required registration details on your behalf.',
      'You do not need a PlanOut account or app for this entry. Open the web QR, or bring a printed copy, and present it at the gate.',
      'This pass is valid only for the assigned event entry and should not be forwarded.',
    ],
    details: {
      'Event': 'Canlaon Marathon 2026',
      'Attendee': 'Arthur Sanchez',
      'Signed By': 'Jessica Sanchez',
      'Gate': 'Gate A - Main Entrance',
    },
    ctaText: 'Open Web QR',
  },
  rosterInvite: {
    subject: 'Claim your Apo Island player entry',
    toName: 'Daniel Vance',
    toEmail: 'daniel@email.com',
    headline: 'You have a player entry to claim',
    paragraphs: [
      'Marcus Reyes purchased a player entry for you in Apo Island Water Swim and sent you this claim link.',
      'Sign in or create a PlanOut account, verify your details, and complete the organizer form.',
      'After completion, this entry attaches to your own PlanOut Passport for gate access.',
    ],
    details: {
      'Team': 'Apo Island Water Swim',
      'Added By': 'Marcus Reyes (buyer)',
      'Category': '4x500m Relay',
      'Form Deadline': 'July 1, 2026',
    },
    ctaText: 'Open Claim Link & Complete Form',
  },
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function PassportCasesPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'catalog' | 'purchase' | 'diagram'>('purchase');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedStepIdx, setSelectedStepIdx] = useState<number>(0);
  const [diagramGroupFilter, setDiagramGroupFilter] = useState<string>('all');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;

    const savedTheme = window.localStorage.getItem('planout.passportCases.theme');
    if (savedTheme === 'dark') return true;
    if (savedTheme === 'light') return false;

    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDarkMode);
    window.localStorage.setItem('planout.passportCases.theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Helper to parse case details from titles
  const parseTitle = (title: string) => {
    const match = title.match(/Case\s+(\d+):\s*(.*)/i);
    if (match) {
      return {
        num: match[1],
        short: match[2],
        id: `case-${match[1]}`
      };
    }
    return { num: '', short: title, id: '' };
  };

  // Smooth scroll and highlight animation
  const scrollToCase = (caseId: string) => {
    const el = document.getElementById(caseId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const origBorder = el.style.borderColor;
      const origShadow = el.style.boxShadow;
      el.style.borderColor = '#14b8a6'; // teal-500
      el.style.boxShadow = '0 0 25px rgba(20, 184, 166, 0.4)';
      setTimeout(() => {
        el.style.borderColor = origBorder;
        el.style.boxShadow = origShadow;
      }, 1500);
    }
  };

  const handleViewCaseInCatalog = (caseId: string) => {
    setViewMode('catalog');
    setTimeout(() => {
      scrollToCase(caseId);
    }, 150);
  };

  const getStepType = (title: string, desc: string) => {
    const lowerTitle = title.toLowerCase();
    const lowerDesc = desc.toLowerCase();
    if (lowerTitle.includes('email') || lowerDesc.includes('email') || lowerTitle.includes('notified')) return 'Email Alert';
    if (lowerTitle.includes('checkout') || lowerTitle.includes('purchase') || lowerTitle.includes('pay') || lowerDesc.includes('payment') || lowerDesc.includes('checkout')) return 'Transaction';
    if (lowerTitle.includes('form') || lowerTitle.includes('waiver') || lowerTitle.includes('register') || lowerDesc.includes('form') || lowerDesc.includes('waiver')) return 'Form Submission';
    if (lowerTitle.includes('qr') || lowerTitle.includes('gate') || lowerTitle.includes('scan') || lowerDesc.includes('scan') || lowerTitle.includes('check-in') || lowerTitle.includes('checked-in')) return 'Check-In';
    return 'App View';
  };

  // ---------------------------------------------------------------------------
  // 23 Cases Grouped by User Context
  // ---------------------------------------------------------------------------

  const CASES_LIST: CaseCatalogItem[] = [
    // ===== GROUP 0: PURCHASE-INTENT SCENARIOS (who buys / who fills / who receives) =====
    {
      group: 'scenario',
      badgeText: 'Solo · Self',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      title: 'Case 24: Buyer Buys For Himself & Attends',
      subtitle: 'This is the most simple case. One person buys one ticket and attends. The buyer completes their own organizer form. The entry attaches to the buyer\'s Passport. There are no invites and no extra QR codes. For the screen states, see Cases 1–7.',
      timelineSteps: FLOWS.scnSolo,
      emailTemplates: [EMAIL_CATALOG.welcome],
      accessPath: {
        origin: 'Passport tab (also available from Orders)',
        route: '/passport',
        backTarget: 'Home',
        steps: [
          'The buyer completes the checkout. The buyer completes their own form.',
          'The buyer opens the Passport tab from the bottom navigation.',
          'The entry shows on the Passport when the form is complete.',
          'At the gate, the buyer shows their Universal Passport QR.',
        ],
      },
      renderViewport: () => <LiveAppScreen title="Solo buyer outcome - Passport" path="/passport" />,
    },
    {
      group: 'scenario',
      badgeText: 'Group · Fills all',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      title: 'Case 25: Buyer Buys For Self + Friends, Fills Every Form',
      subtitle: 'The buyer buys more than one ticket. The buyer completes all the participant forms. The buyer\'s entry stays on their Passport. Each friend gets an app-less Guest QR, or a claim link that puts the entry on the friend\'s Passport. A dedicated screen distributes all the guest slots at once, with a group-chat share option; each slot can also be managed on its own from the order detail. For the screen states, see Case 23.',
      timelineSteps: FLOWS.scnGroupFillAll,
      emailTemplates: [EMAIL_CATALOG.guestLink, EMAIL_CATALOG.guestClaim],
      accessPath: {
        origin: 'Direct link, or per-slot from the order detail (Orders does not currently link to the distribution screen)',
        route: '/orders/:orderId/guest-manager, or /orders/:orderId for each slot one at a time',
        backTarget: 'Orders list or order detail',
        steps: [
          'The buyer opens Orders after the purchase. The buyer selects the multi-entry order.',
          'From the order detail, the buyer manages each friend\'s slot on its own row.',
          'For each friend, the buyer taps Generate & send QR, or copies that row\'s claim link.',
          'Guest QR friends show the web QR. Claim-link friends sign in or make an account. Their entries attach to their Passports.',
        ],
      },
      renderViewport: () => <LiveAppScreen title="Buyer-managed guest distribution outcome" path="/orders/tkt-011/guest-manager" />,
    },
    {
      group: 'scenario',
      badgeText: 'Group · Claim Form',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      title: 'Case 26: Buyer Fills Own, Sends The Form To A Friend',
      subtitle: 'The buyer completes their own form. The buyer then sends a claim link for the friend\'s slot. The friend signs in or makes a PlanOut account. The friend completes the organizer form. The entry attaches to the friend\'s Passport. For the screen states, see Case 15.',
      timelineSteps: FLOWS.scnGroupSendFriend,
      emailTemplates: [EMAIL_CATALOG.guestClaim],
      accessPath: {
        origin: 'Orders → send the claim link',
        route: '/ticket-claim/:claimRef',
        backTarget: 'Order detail or claim email',
        steps: [
          'The buyer completes their own form. The buyer\'s entry attaches to their Passport.',
          'The buyer opens Orders and sends the claim link to the friend.',
          'The friend opens the link. The friend signs in or makes an account. The friend completes the organizer form.',
          'The friend shows their own Passport QR at the gate.',
        ],
      },
      renderViewport: () => <LiveAppScreen title="Buyer entry ready, claim link sent" path="/orders/tkt-011" />,
    },
    {
      group: 'scenario',
      badgeText: 'Guest QR',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'Case 28: Buyer Buys For A Dependent (Child / Elderly, No Account)',
      subtitle: 'This case is for a participant who will not use a PlanOut account. The buyer completes all the fields for the guest. The buyer makes a Guest QR. The guest does not need an app, a login, or a Passport. For the screen states, see Case 16.',
      timelineSteps: FLOWS.scnDependent,
      emailTemplates: [EMAIL_CATALOG.temporaryQR],
      accessPath: {
        origin: 'Orders → order → Guest QR action',
        route: '/orders/:orderId/entry/:entryId/guest-qr',
        backTarget: 'Order detail',
        steps: [
          'The buyer completes the necessary forms for the guest.',
          'The buyer opens Orders. The buyer taps Generate & send QR on the guest row.',
          'The buyer prints the Guest QR or sends the web link to a telephone.',
          'The staff scans the guest in at the gate.',
        ],
      },
      renderViewport: () => <LiveAppScreen title="Dependent Guest QR outcome" path="/orders/tkt-010/entry/tkt-010-p2/guest-qr" />,
    },
    {
      group: 'scenario',
      badgeText: 'Group · Mixed',
      badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      title: 'Case 29: Mixed Order — Self + Invite + Guest QR',
      subtitle: 'This is the usual family-and-friends order. There is one purchase and more than one slot. The buyer completes their own form. The buyer sends one friend a claim link (account necessary). The buyer sends one guest a Guest QR (no account). For the screen states, see Case 17.',
      timelineSteps: FLOWS.scnMixed,
      emailTemplates: [],
      accessPath: {
        origin: 'Orders → order → participant form',
        route: '/orders/:orderId → /orders/:ticketId/form',
        backTarget: 'Orders',
        steps: [
          'The buyer opens Orders. The order shows a "Forms needed" label for the multi-entry order.',
          'The buyer opens the participant form for the order.',
          'For each slot, the buyer completes the form, sends a claim link, or sends a Guest QR.',
          'Each slot then goes to the correct surface: the Passport or the Guest QR.',
        ],
      },
      renderViewport: () => <LiveAppScreen title="Mixed order outcome" path="/orders/tkt-011" />,
    },
    {
      group: 'scenario',
      badgeText: 'Gift · Form Link',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'Case 30: Buyer Does Not Attend — Sends Form To Friend',
      subtitle: 'The buyer buys the ticket as a gift and does not attend. The participant form is not complete. The buyer sends the form link to the friend. The friend signs in or makes an account and completes the organizer form. The entry attaches to that Passport. This is not a transfer by the buyer. If the form is already complete, only the organizer can transfer the entry. For the screen states, use the current form screen.',
      timelineSteps: FLOWS.scnGiftTransfer,
      emailTemplates: [EMAIL_CATALOG.guestClaim],
      accessPath: {
        origin: 'Orders → send the form link',
        route: '/orders/:ticketId/form',
        backTarget: 'Orders list',
        steps: [
          'The buyer opens Orders while the participant form is not complete.',
          'The buyer sends the form link to the friend.',
          'The friend signs in or makes an account. The friend completes the organizer form.',
          'The entry attaches to the friend\'s Passport after the form is submitted.',
        ],
      },
      renderViewport: () => <LiveAppScreen title="Gifted entry, form link sent" path="/orders/tkt-012" />,
    },
    {
      group: 'scenario',
      badgeText: 'Gift · App-less',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      title: 'Case 31: Buyer Does Not Attend — Fills Form & Sends App-less Pass',
      subtitle: 'The buyer buys access for a person who will not use a PlanOut account. The recipient does not sign in. Because of this, the buyer completes the organizer form first. The buyer then sends a Guest QR. Adult friends, children, elderly relatives, and dependents use the same app-less Guest QR. The buyer controls the pass from Orders. The pass does not attach to the recipient\'s Passport. For the screen states, see Cases 11–16.',
      timelineSteps: FLOWS.scnGiftGuestQR,
      emailTemplates: [EMAIL_CATALOG.guestLink, EMAIL_CATALOG.temporaryQR],
      accessPath: {
        origin: 'Orders → order → Guest QR',
        route: '/orders/:orderId/entry/:entryId/guest-qr',
        backTarget: 'Order detail',
        steps: [
          'The buyer opens Orders. The buyer completes the organizer form for the recipient.',
          'The buyer makes a Guest QR for the completed slot.',
          'The recipient opens the Guest QR link or the printed QR. The recipient does not need an account.',
          'The recipient shows the web QR at the gate. The buyer monitors the QR status in Orders.',
        ],
      },
      renderViewport: () => <LiveAppScreen title="App-less pass outcome" path="/orders/tkt-010/entry/tkt-010-p2/guest-qr" />,
    },
    {
      group: 'scenario',
      badgeText: 'Team · Individual access',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      title: 'Case 33: Team Purchase — Players Resolve Individually',
      subtitle: 'This is one team purchase with multiple player entries. The buyer adds player entries from the order, up to the organizer maximum, then each player gets access through a claim link or an app-less Guest QR. There is no team-wide Passport or gate credential, and the team stays one financial registration item.',
      timelineSteps: FLOWS.scnTeam,
      emailTemplates: [EMAIL_CATALOG.rosterInvite],
      accessPath: {
        origin: 'Checkout → Orders → team order',
        route: '/orders/:ticketId → /passport',
        backTarget: 'Orders list',
        steps: [
          'From the team order, the buyer sizes the roster: "Add player" up to the organizer maximum, and remove an unsent extra slot down to the minimum.',
          'From the team order, the buyer completes the form for a Guest QR, or sends a claim link for each player.',
          'Claim-link players sign in or make an account. They complete their own organizer form.',
          'At the gate, each player uses their own Passport or Guest QR.',
        ],
      },
      renderViewport: () => <LiveAppScreen title="Team order player access outcome" path="/orders/tkt-013" />,
    },
    {
      group: 'scenario',
      badgeText: 'Guest QR · Later claim',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      title: 'Case 34: Guest QR Holder Creates An Account Later',
      subtitle: 'A person used an app-less Guest QR. The person makes a PlanOut account later. The person signs in, then scans the Guest QR with the in-app camera or uploads a saved photo of it. A recognized code is claimed immediately and Passport confirms it with a toast. This is possible one time only.',
      timelineSteps: FLOWS.scnLeadTransfer,
      emailTemplates: [],
      accessPath: {
        origin: 'Guest QR link, or Passport → Add a past event → Scan event QR',
        route: '/passport/add-entry?scan=1 (a shared ?code= link opens the review state instead)',
        backTarget: 'Passport',
        steps: [
          'The guest signs in or makes an account first. The add-entry screen needs an account.',
          'The guest opens the scanner from Passport and scans the pass, or uploads a saved photo of it.',
          'The guest examines the entry and taps Add to my Passport.',
          'The Guest QR becomes invalid. A second claim is not possible.',
        ],
      },
      renderViewport: () => <LiveAppScreen title="Claimed entry on the Passport" path="/passport" />,
    },
    {
      group: 'scenario',
      badgeText: 'Guest QR · Past pass',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      title: 'Case 36: Guest Adds A Used Past Guest QR To Passport',
      subtitle: 'The app-less pass was already scanned at the gate, so it is spent for entry. The holder can still bring the event into a Passport as history. The guest signs in, scans or types the same code, and confirms. The Passport keeps the event and the check-in stamp, no new gate QR is issued, and the pass cannot be claimed a second time.',
      timelineSteps: FLOWS.scnPastPassClaim,
      emailTemplates: [],
      accessPath: {
        origin: 'Passport → Add a past event → Scan event QR (also from the used public pass page)',
        route: '/passport/add-entry → /passport/add-entry?code=GE-USED-4218',
        backTarget: 'Passport',
        steps: [
          'The guest shows the Guest QR at the gate. The staff scan records the check-in time and the gate.',
          'The guest signs in or makes an account, because the entry has to land on a specific Passport.',
          'The guest scans the used pass or uploads its image. The used public pass page also offers "Add past event to Passport".',
          'The confirm screen shows the check-in stamp and states that this keeps history only, with no new gate QR.',
          'The event joins Passport history. The Guest QR becomes permanently inactive, so a second Passport cannot claim it.',
        ],
      },
      renderViewport: () => <LiveAppScreen title="Past event kept in Passport history" path="/passport" />,
    },

    // ===== GROUP A: INDIVIDUAL (SINGLE PERSON, SINGLE TICKET) =====
    {
      group: 'ready',
      badgeText: 'Individual Passport',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      title: 'Case 1: Universal Passport Card (Front)',
      subtitle: 'This is the main entry card and it holds the dynamic QR check-in token. The front carries the UNIVERSAL PASS eyebrow, the holder name, the passport code, and the QR, stamped with the PlanOut Passport wordmark. The whole Passport route family sits on one continuous white surface, and the QR is presented as a premium tile — crisp square modules, a deliberate quiet zone, a white-and-mint frame — that expands on tap without changing its payload.',
      timelineSteps: FLOWS.cardFront,
      emailTemplates: [EMAIL_CATALOG.welcome],
      accessPath: {
        origin: 'Passport tab (bottom navigation)',
        route: '/passport',
        backTarget: 'Home',
        steps: [
          'The buyer completes the checkout. The Passport becomes active.',
          'The buyer taps Passport in the bottom navigation.',
          'The Universal Passport card shows the dynamic QR.',
          'The buyer shows the same card at the gate for the check-in.',
        ],
      },
      renderViewport: () => <LiveAppScreen title="Universal Passport card" path="/passport" />,
    },
    {
      group: 'ready',
      badgeText: 'Front Actions',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      title: 'Case 2: Universal Passport Card — Front Actions',
      subtitle: 'The Passport card has no back side: Events, Save, and Reset QR all sit on the front, alongside the QR itself, which expands in place. The expanded QR reuses the same tile language rather than introducing a second visual system, and Reset QR changes the payload without changing any of this geometry.',
      timelineSteps: FLOWS.cardFrontActions,
      emailTemplates: [],
      accessPath: {
        origin: 'Passport tab (bottom navigation)',
        route: '/passport',
        backTarget: 'Home',
        steps: [
          'The buyer opens the Passport tab and sees the front card.',
          'The front action row has the Events, Save, and Reset QR actions.',
          'The buyer taps Events to open Passport Events, or uses Save or Reset QR on the card.',
          'There is no different screen. All the actions are on the Passport front.',
        ],
      },
      renderViewport: () => <LiveAppScreen title="Passport front actions" path="/passport" />,
    },
    {
      group: 'pending',
      badgeText: 'Inline Dynamic Form',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'Case 3: Checkout Confirmation → Inline Form Pending',
      subtitle: 'This is the checkout confirmation for an order with one event. The banner counts the forms that still need attention, and the organizer form opens inline so the buyer never leaves the confirmation. The inline form carries the same ownership question as everywhere else — "For me" attaches to the buyer\'s Passport, "For someone else" produces a buyer-filled Guest QR — and the confirmation states the choice plainly: a claim link for their Passport, or a buyer-filled app-less Guest QR. "Do this later" keeps the work on the order.',
      timelineSteps: FLOWS.inlineForm,
      emailTemplates: [EMAIL_CATALOG.formRequired],
      accessPath: {
        origin: 'Checkout confirmation (single-ticket order)',
        route: '/checkout (confirmation state)',
        backTarget: 'Orders or Passport',
        steps: [
          'The buyer completes the checkout with one ticket and pays.',
          'The confirmation screen shows the organizer form.',
          'The buyer completes and submits the form on the same screen.',
          'The entry then attaches to the buyer\'s Passport.',
        ],
      },
      renderViewport: () => (
        <PurchaseIntentCapture
          capture="checkout-confirmation-form"
          title="Inline form on the checkout confirmation"
        />
      ),
    },
    {
      group: 'pending',
      badgeText: 'Form Pending · Single',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'Case 4: Single Entry — Form Still Pending',
      subtitle: 'This is a single ticket with an organizer form that is not complete. The item shows in Orders. The order detail shows "Forms still needed — participant form required" and a "Complete forms" button. A floating "Finish Forms" pill also appears on most other pages and opens Orders.',
      timelineSteps: FLOWS.formTaskSingle,
      emailTemplates: [EMAIL_CATALOG.formRequired],
      accessPath: {
        origin: 'Orders → order detail (also reachable from the floating "Finish Forms" pill)',
        route: '/orders/:orderId → /orders/:ticketId/form',
        backTarget: 'Orders list',
        steps: [
          'The buyer opens Orders and selects the order with the "Forms needed" label.',
          'The open row shows "Forms still needed — participant form required".',
          'The buyer taps Complete forms. The participant form opens.',
          'The buyer submits the form. The entry attaches to the buyer\'s Passport.',
        ],
      },
      renderViewport: () => <LiveAppScreen title="Order detail with pending form" path="/orders/tkt-003" />,
    },
    {
      group: 'pending',
      badgeText: 'Pending Payment',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'Case 5: Locked — Pending Payment Verification',
      subtitle: 'The payment is not confirmed, for example a bank transfer. The transaction record shows "Awaiting Payment — your order is reserved". The timeline stops before Confirmation. The forms and the Passport access unlock after the payment.',
      timelineSteps: FLOWS.pendingPayment,
      emailTemplates: [],
      accessPath: {
        origin: 'Settings → Transactions → pending record',
        route: '/settings/transactions/:txnId',
        backTarget: 'Transactions ledger',
        steps: [
          'The buyer completes the checkout with an offline payment.',
          'The transaction shows in Settings → Transactions as Pending.',
          'The timeline stays at "Awaiting Payment" until the payment is confirmed.',
          'After the confirmation, the order unlocks the forms and the Passport access.',
        ],
      },
      renderViewport: () => (
        <LiveAppScreen title="Awaiting payment ledger" path="/settings/transactions/AAA-L4DJYC" />
      ),
    },
    {
      group: 'exceptions',
      badgeText: 'Resubmit Required',
      badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      title: 'Case 6: Form Update Required — Resubmission Needed',
      subtitle: 'The organizer changes the form requirements after the first submission. The form-diff screen shows each field as Unchanged, Updated, New, or Removed. The screen keeps the user\'s data. The user then taps "Review and resubmit form".',
      timelineSteps: FLOWS.resubmitRequired,
      emailTemplates: [EMAIL_CATALOG.resubmitRequired],
      accessPath: {
        origin: 'Orders → "Review changes" on the flagged entry',
        route: '/forms/:entryId/diff → /orders/:ticketId/form',
        backTarget: 'Orders',
        steps: [
          'The organizer changes the form after the buyer\'s submission.',
          'The entry in Orders shows "Review changes".',
          'The diff screen shows the changes between form v1 and form v2.',
          'The buyer taps "Review and resubmit form". After the submission, the entry attaches again.',
        ],
      },
      renderViewport: () => (
        <LiveAppScreen title="Form update diff" path="/forms/resubmit-aquathlon/diff" />
      ),
    },
    {
      group: 'ready',
      badgeText: 'Ready · Attached',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      title: 'Case 7: Custom Form Submitted → Attached & Access Ready',
      subtitle: 'This is the usual good result. All the registration data is complete. The Passport shows the event card with the green "Ready" label. The forms and the payment are complete.',
      timelineSteps: FLOWS.attached,
      emailTemplates: [EMAIL_CATALOG.ticketReady],
      accessPath: {
        origin: 'Passport tab / Passport → Events',
        route: '/passport',
        backTarget: 'Home',
        steps: [
          'The buyer completes the payment and all the organizer forms.',
          'The event card on the Passport becomes green with the "Ready" label.',
          'There are no open tasks for the entry.',
          'The buyer shows the Universal Passport QR at the gate.',
        ],
      },
      renderViewport: () => (
        <LiveAppScreen title="Ready for access entries" path="/passport/events" />
      ),
    },
    {
      group: 'exceptions',
      badgeText: 'Spot Released',
      badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      title: 'Case 8: Deadline Missed → Spot Released',
      subtitle: 'The form deadline passed without a submission. The row shows a "Spot released" label. The user can open the event again and register if slots are available.',
      timelineSteps: FLOWS.spotReleased,
      emailTemplates: [EMAIL_CATALOG.spotReleased],
      accessPath: {
        origin: 'Passport → Events (Status updates section)',
        route: '/passport/events',
        backTarget: 'Passport',
        steps: [
          'The form deadline passes and the form is not complete.',
          'The row shows a "Spot released" label in the Status updates section.',
          'The buyer opens Passport → Events to see the released state.',
          'The buyer can open the event again and register if slots are available.',
        ],
      },
      renderViewport: () => (
        <LiveAppScreen title="Spot released status update" path="/passport/events" scrollToText="Status updates" />
      ),
    },
    {
      group: 'eventPast',
      badgeText: 'Attended History',
      badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      title: 'Case 9: Event Completed → Checked-In & Attended Log',
      subtitle: 'This is the check-in history for events where the staff scanned the user at the gate. The entry shows an "Attended" or "Completed" label.',
      timelineSteps: FLOWS.pastAttended,
      emailTemplates: [EMAIL_CATALOG.checkinSuccess],
      accessPath: {
        origin: 'Passport → Events (Past events section)',
        route: '/passport/events',
        backTarget: 'Passport',
        steps: [
          'The staff scans the buyer in at the gate on the event day.',
          'The entry moves to the Past events section with an "Attended" record.',
          'The buyer opens Passport → Events to see the attendance history.',
          'No more action is necessary.',
        ],
      },
      renderViewport: () => (
        <LiveAppScreen title="Past events attended log" path="/passport/events" scrollToText="Past events" />
      ),
    },
    {
      group: 'eventPast',
      badgeText: 'No-Show History',
      badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
      title: 'Case 10: Event Completed → Missed No-Show Log',
      subtitle: 'This shows the tickets that were not scanned on the event day. The entry shows a "No-show" label and this message: "You were registered but not checked in on event day."',
      timelineSteps: FLOWS.pastNoShow,
      emailTemplates: [EMAIL_CATALOG.noShow],
      accessPath: {
        origin: 'Passport → Events (Past events section)',
        route: '/passport/events',
        backTarget: 'Passport',
        steps: [
          'The buyer is registered but does not check in on the event day.',
          'The system sets the entry to "No-show". The QR becomes unserviceable.',
          'The buyer opens Passport → Events to see the no-show record.',
          'Entry with that ticket is not possible again.',
        ],
      },
      renderViewport: () => (
        <LiveAppScreen title="Past events no-show log" path="/passport/events" scrollToText="Past events" />
      ),
    },

    // ===== GROUP B: GUEST SHARING (MULTIPLE PEOPLE, MULTIPLE TICKETS) =====

    {
      group: 'ready',
      badgeText: 'Buyer Guest Manager',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      title: 'Case 11: Shared Ticket → Guest QR Active',
      subtitle: 'This is the buyer\'s view of an active Guest QR, redesigned as a credential rather than a form. The screen is titled "Guest access pass": one dark green perforated ticket carries the attendee name, the event and category, the scannable QR on white, the entry reference, the gate and time, and the validity date. "Share Guest QR" is the only filled action, with "Regenerate QR" below it — the pass replaces itself in place instead of offering a separate resend.',
      timelineSteps: FLOWS.guestActive,
      emailTemplates: [EMAIL_CATALOG.guestLink],
      accessPath: {
        origin: 'Orders → order detail → guest entry',
        route: '/orders/tkt-010/entry/tkt-010-p2/guest-qr',
        backTarget: 'Previous app screen, normally the order detail',
        steps: [
          'The buyer completes the checkout for an entry for a different person.',
          'The buyer opens Orders from the bottom navigation.',
          'The buyer opens the order that has the guest participant.',
          'The buyer taps the Guest QR action on the participant row.',
        ],
      },
      renderViewport: () => <WF_GuestQRActive />,
    },
    {
      group: 'eventPast',
      badgeText: 'Buyer Guest Manager',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      title: 'Case 12: Shared Ticket → Guest Checked-In At The Gate',
      subtitle: 'The pass itself does not change after a scan: it stays white and claimable, because a spent Guest QR can still become Passport history exactly once. The scan surfaces on the distribution screen instead, where the slot turns to "Used" and reads "Scanned <time> · still claimable once" beside the reference. The buyer keeps the Passport-option note and the share actions on that slot.',
      timelineSteps: FLOWS.guestUsed,
      emailTemplates: [EMAIL_CATALOG.guestCheckedIn],
      accessPath: {
        origin: 'Orders → order detail → Manage guest QRs, after the gate scan',
        route: '/orders/:orderId/guest-manager (the scanned slot)',
        backTarget: 'Previous app screen, normally the order detail',
        steps: [
          'The buyer makes and shares a Guest QR from Orders.',
          'The guest shows the public pass at the gate and the staff scans it.',
          'The distribution screen marks that slot "Used" with the scan time and gate.',
          'The pass stays claimable once, so the guest can still add the past event to a Passport.',
        ],
      },
      renderViewport: () => <WF_GuestQRUsed />,
    },
    {
      group: 'exceptions',
      badgeText: 'Buyer Guest Manager',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      title: 'Case 13: Shared Ticket → Guest QR Revoked',
      subtitle: 'This is the buyer\'s view after a shared Guest QR is cancelled. The pass keeps its ticket shape but turns muted, with a rotated "REVOKED" stamp over the QR so the state is unmistakable at a glance. The code no longer works at the gate and the holder cannot claim it. The buyer generates a fresh pass to recover.',
      timelineSteps: FLOWS.guestRevoked,
      emailTemplates: [EMAIL_CATALOG.guestRevoked],
      accessPath: {
        origin: 'Orders → order detail → guest QR revoke flow',
        route: '/orders/tkt-010/entry/tkt-010-p2/guest-qr?state=revoked',
        backTarget: 'Previous app screen, normally the order detail',
        steps: [
          'The buyer opens Orders and selects the applicable order.',
          'The buyer opens the Guest QR for the participant slot.',
          'The buyer cancels the pass, either from the slot or from the pass itself.',
          'The pass shows the REVOKED stamp. A new Guest QR has to be generated.',
        ],
      },
      renderViewport: () => <WF_GuestQRRevoked />,
    },
    {
      group: 'ready',
      badgeText: 'Buyer Guest Manager',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      title: 'Case 35: Shared Ticket → Guest QR Claimed Into Passport',
      subtitle: 'The guest decides to make a PlanOut account and adds the Guest QR to their own Passport. The buyer\'s pass keeps its ticket shape but turns indigo-tinted with a rotated "CLAIMED" stamp over the QR, and an explanatory panel below reads "Guest QR claimed — this entry now belongs to a Passport." The code cannot be shared, scanned, or claimed again.',
      timelineSteps: FLOWS.guestClaimed,
      emailTemplates: [],
      accessPath: {
        origin: 'Orders → order detail → guest entry (buyer side)',
        route: '/orders/tkt-010/entry/tkt-010-p2/guest-qr',
        backTarget: 'Previous app screen, normally the order detail',
        steps: [
          'The guest signs in or makes an account, then scans the Guest QR from the Passport add-pass sheet.',
          'The guest reviews the entry and taps "Add to my Passport".',
          'The Guest QR becomes permanently claimed. A second claim is not possible.',
          'The buyer opens the Guest QR from Orders and sees the claimed state.',
        ],
      },
      renderViewport: () => <WF_GuestQRClaimed />,
    },
    {
      group: 'ready',
      badgeText: 'Guest Web Page',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'Case 14: Non-User Guest Landing Page View',
      subtitle: 'This is the public web page that the guest opens. A login is not necessary. The page shows the ticket data, the check-in status, the gate QR code, and a "Sign up free" button.',
      timelineSteps: FLOWS.publicGuestPage,
      emailTemplates: [EMAIL_CATALOG.guestLink],
      accessPath: {
        origin: 'Shared guest link from SMS, email, or chat',
        route: '/guest-entry/GE-CANLAON-42K',
        backTarget: 'Browser history, usually the message or email source',
        steps: [
          'The buyer shares the Guest QR link from Orders.',
          'The guest receives the link outside the app.',
          'The guest opens the link in a browser. A login is not necessary.',
          'The guest shows the web QR at the gate.',
        ],
      },
      renderViewport: () => <WF_PublicGuestPage />,
    },
    {
      group: 'ready',
      badgeText: 'Guest Claim & Register',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      title: 'Case 15: Shared Form Link → Login Gate & Standard Form',
      subtitle: 'A shared form link has no claim page of its own. The link carries the order and the entry, so a signed-out recipient gets the normal login or create-account screen with the form as the return destination, and a signed-in recipient goes straight to the standard participant form. The account that submits the form owns the entry on its Passport. This is a permanent transfer of that slot, not a Guest QR.',
      timelineSteps: FLOWS.guestClaimRegister,
      emailTemplates: [EMAIL_CATALOG.guestClaim],
      accessPath: {
        origin: 'Shared form link from the order (Share form → Send link or Copy link, or a bulk email)',
        route: '/ticket-claim/:ref?order=&entry= → /login (if signed out) → /orders/:ticketId/form?invite=1',
        backTarget: 'Browser history, usually the email or chat the link came from',
        steps: [
          '"Share form" on the entry offers Send link and Copy link; both build the same /ticket-claim link with the order and entry attached.',
          'The recipient opens the link. Without both parameters the route falls back to Orders, so the link is the whole credential.',
          'A signed-out recipient sees the standard login screen and returns to the form after authenticating. No claim-specific page appears.',
          'The recipient completes the standard participant form. The submission, not the invited email, decides which Passport owns the entry.',
        ],
      },
      renderViewport: () => <WF_GuestClaimRegister />,
    },
    {
      group: 'ready',
      badgeText: 'Guest QR',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'Case 16: Guest QR (No Account Flow)',
      subtitle: 'This is an app-less entry pass for a person who will not use a PlanOut account. The buyer completes all the organizer fields for that person, and the completed buyer-filled form is what produces the pass. An app, a login, or an account is not necessary, and the pass does not attach to a Passport. The pass keeps the green ticket credential treatment, deliberately separate from the metal Passport card, so a shared guest pass never reads as Passport ownership.',
      timelineSteps: FLOWS.temporaryGuestQR,
      emailTemplates: [EMAIL_CATALOG.temporaryQR],
      accessPath: {
        origin: 'Orders → order detail → Guest QR action',
        route: '/orders/tkt-010/entry/tkt-010-p2/guest-qr',
        backTarget: 'Previous app screen, normally the order detail',
        steps: [
          'The buyer completes the necessary forms for the guest.',
          'The buyer opens Orders and selects the applicable order.',
          'The buyer taps Generate & send QR on the guest participant row.',
          'The buyer opens, copies, prints, or sends the Guest QR.',
        ],
      },
      renderViewport: () => <WF_TemporaryGuestQR />,
    },
    {
      group: 'pending',
      badgeText: 'Form Pending · Multiple',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'Case 17: Group Entry — Multiple Participant Forms Pending',
      subtitle: 'One purchase includes more than one participant. The group participant form shows the progress of each slot: completed or sent. For each slot, the buyer completes the form or sends a claim link. Different options for different slots are permitted.',
      timelineSteps: FLOWS.formTaskMulti,
      emailTemplates: [],
      accessPath: {
        origin: 'Orders → order → Complete forms',
        route: '/orders/:ticketId/form',
        backTarget: 'Orders',
        steps: [
          'The buyer opens Orders after a multi-participant purchase.',
          'The order shows a "Forms needed" label with the number of open forms.',
          'The buyer opens the group participant form to control all the slots.',
          'For each slot, the buyer completes the form or sends a claim link.',
        ],
      },
      renderViewport: () => (
        <LiveAppScreen title="Group participant form" path="/orders/tkt-011/form?returnTo=orders" />
      ),
    },

    {
      group: 'ready',
      badgeText: 'Multi-Guest Manager',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      title: 'Case 23: Multi-Guest Order — Buyer Fills All, Distributes QRs',
      subtitle: 'The buyer buys more than one ticket. The buyer completes all the organizer forms and does not send invites. The system makes one Guest QR for each slot. The buyer sends each QR separately. This screen shows the status of every guest slot in one place, with share and revoke controls and a group-chat share option. The guests do not need PlanOut accounts. Orders does not currently link to this screen — reach it by direct link, or manage each slot on its own from the order detail.',
      timelineSteps: FLOWS.multiGuestManager,
      emailTemplates: [],
      accessPath: {
        origin: 'Direct link (Orders order detail manages each slot on its own instead)',
        route: '/orders/tkt-008/guest-manager',
        backTarget: 'Previous app screen, normally the order detail or Orders list',
        steps: [
          'The buyer completes the checkout for entries for other persons.',
          'The buyer completes the participant form for each guest slot.',
          'The buyer opens this screen directly, or manages each guest row from the order detail.',
          'The buyer can make, open, copy, or revoke each Guest QR separately.',
        ],
      },
      renderViewport: () => <WF_MultiGuestManager />,
    },

    // ===== GROUP C: TEAM (MULTIPLE PEOPLE, SINGLE TICKET) =====
    {
      group: 'pending',
      badgeText: 'Team Progress',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      title: 'Case 18: Team Order → Player Access',
      subtitle: 'The team order lists the purchased player entries. For each player row, the buyer completes details for an app-less Guest QR or sends a claim link for that player\'s Passport.',
      timelineSteps: FLOWS.teamProgress,
      emailTemplates: [],
      accessPath: {
        origin: 'Orders → team order',
        route: '/orders/:ticketId',
        backTarget: 'Orders',
        steps: [
          'The buyer buys a team package. The slots stay locked.',
          'The team order lists the purchased player entries.',
          'The buyer uses each player row to complete the form or send/copy a claim link.',
          'Each player resolves to their own access credential.',
        ],
      },
      renderViewport: () => (
        <LiveAppScreen title="Team order player access" path="/orders/tkt-013" />
      ),
    },
    {
      group: 'pending',
      badgeText: 'Player Access Statuses',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      title: 'Case 19: Team Order → Player Rows',
      subtitle: 'The player rows in Orders show Guest QR ready, Passport access, claim link sent, or entry setup needed. The buyer chooses how each player receives their entry.',
      timelineSteps: FLOWS.teamRosterList,
      emailTemplates: [EMAIL_CATALOG.rosterInvite],
      accessPath: {
        origin: 'Orders → team order',
        route: '/orders/:ticketId',
        backTarget: 'Orders list',
        steps: [
          'The buyer opens the team order in Orders.',
          'The player rows show the current entry setup.',
          'The buyer completes details or sends/copies a claim link per player.',
          'Passport ownership belongs to the player who claims it.',
        ],
      },
      renderViewport: () => (
        <LiveAppScreen title="Team order player entries" path="/orders/tkt-013" />
      ),
    },
    {
      group: 'pending',
      badgeText: 'Form Pending · Team',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      title: 'Case 20: Team Order — Player Entries Pending',
      subtitle: 'The team order detail shows one consolidated registration item for the whole team, with one price. A "Player entries" card shows "X of Y player entries set up" with the actions for each player row.',
      timelineSteps: FLOWS.formTaskTeam,
      emailTemplates: [],
      accessPath: {
        origin: 'Orders → team order detail',
        route: '/orders/:orderId',
        backTarget: 'Orders list',
        steps: [
          'The buyer opens Orders after the team purchase.',
          'The team order shows one consolidated registration item and a "Player entries" card.',
          'The buyer uses each player row to complete details or send/copy a claim link.',
        ],
      },
      renderViewport: () => (
        <LiveAppScreen title="Team order with player entries pending" path="/orders/tkt-013" />
      ),
    },
    {
      group: 'ready',
      badgeText: 'Group Claim Links',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      title: 'Case 21: Group Chat Claim Links — Recipient Selection',
      subtitle: 'The buyer shares one group-chat link. Each recipient selects their own entry. The recipient signs in or makes an account. The organizer form then opens.',
      timelineSteps: FLOWS.groupShare,
      emailTemplates: [],
      accessPath: {
        origin: 'Order → share all claim links',
        route: '/order-share/:orderId',
        backTarget: 'Group chat / Orders',
        steps: [
          'The buyer opens the shared group link for the order.',
          'The recipient selects their own entry and opens the claim link.',
          'The recipient signs in or makes an account. There is no onboarding stop.',
          'The recipient completes the organizer form. The entry attaches to that Passport.',
        ],
      },
      renderViewport: () => <WF_GroupShareLive />,
    },

    // ===== GROUP D: AGGREGATE VIEW =====
    {
      group: 'overview',
      badgeText: 'Events Page',
      badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      title: 'Case 22: Passport Events Attending — Aggregate Overview',
      subtitle: 'This is the full Events Attending page. The page shows all the registrations in three sections: "Ready for access", "Status updates", and "Past events".',
      timelineSteps: FLOWS.eventsOverview,
      emailTemplates: [],
      accessPath: {
        origin: 'Passport → Events (front action)',
        route: '/passport/events',
        backTarget: 'Passport',
        steps: [
          'The buyer taps Events on the Passport front actions.',
          'The page shows all the registrations for all the tickets.',
          'The sections are: Ready for access, Status updates, and Past events.',
          'The buyer can do the tasks for each entry from this one screen.',
        ],
      },
      renderViewport: () => <WF_EventsOverview />,
    },

    // ===== GROUP F: ADD A PAST EVENT TO PASSPORT (RECIPIENT-SIDE CLAIMING) =====
    {
      group: 'overview',
      badgeText: 'Passport Launcher',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      title: 'Case 43: Passport → Add A Past Event Launcher',
      subtitle: 'This is the Wallet-style add-pass sheet below the Passport card, and it starts every recipient-side claim. One compact surface: a circular scan symbol, the heading "Add a past event", and one line of explanation. "Scan event QR" is the single full-width action row, with "Camera or saved QR photo" as metadata inside it. The old empty-state sentence is gone — the action is the zero-state guidance — and a "Past events" list appears below a divider only once something has been claimed.',
      timelineSteps: FLOWS.passportPastLauncher,
      emailTemplates: [],
      accessPath: {
        origin: 'Passport tab (bottom navigation), below the Passport card',
        route: '/passport → /passport/add-entry',
        backTarget: 'Passport',
        steps: [
          'The account holder opens the Passport tab.',
          'The Wallet-style "Add a past event" sheet sits below the Passport card.',
          '"Scan event QR" is the one action row; the camera-or-photo detail lives inside it.',
          'A "Past events" list appears below a divider only once entries have been claimed.',
        ],
      },
      renderViewport: () => <WF_PassportPastLauncher />,
    },
    {
      group: 'ready',
      badgeText: 'Camera-first Scanner',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      title: 'Case 37: Add To Passport → Camera-First Guest QR Scanner',
      subtitle: 'On a phone the add-entry route opens straight into a full-screen dark scan surface, so claiming an app-less pass is one focused task. The top row keeps close and camera-flip controls; the tray below offers "Upload QR" for a saved photo and a sample code. The route is canonical — the scanner never renders behind a stale result — and a good scan claims the entry outright rather than stopping at a confirmation screen.',
      timelineSteps: FLOWS.addEntryScanner,
      emailTemplates: [],
      accessPath: {
        origin: 'Passport → Add a past event → Scan event QR',
        route: '/passport/add-entry?scan=1 (the bare path opens the same scanner on mobile)',
        backTarget: 'Passport',
        steps: [
          'The holder signs in first. The add-entry screen needs an account.',
          'The scanner opens directly, with no intermediate card and no stale result behind it.',
          'A recognized, eligible code is claimed at once, then Passport confirms it with a toast.',
          'Upload QR and the sample code cover a blocked camera or an unreadable print.',
        ],
      },
      renderViewport: () => <WF_AddEntryScanner />,
    },
    {
      group: 'eventPast',
      badgeText: 'Past Event Claim',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      title: 'Case 38: Add To Passport → Past Event Review & Confirm',
      subtitle: 'This is the resolved-entry state for a Guest QR that was already scanned at the gate. The screen shows the event, the participant, the access gate, and the check-in stamp, and it states plainly that adding this keeps the past event in Passport history and will not create a new gate QR. The action reads "Add past event to Passport".',
      timelineSteps: FLOWS.addEntryPast,
      emailTemplates: [],
      accessPath: {
        origin: 'Add-entry scanner, a typed code, or the used public pass page',
        route: '/passport/add-entry?code=GE-USED-4218',
        backTarget: 'Passport',
        steps: [
          'The Guest QR was scanned at the gate, so it carries a check-in time and a gate.',
          'The scanner or the manual code resolves the entry at ?code=.',
          'The screen shows the check-in stamp with the event and participant details.',
          'Confirming adds history only. The Guest QR does not become a working gate QR again.',
        ],
      },
      renderViewport: () => <WF_AddEntryPast />,
    },
    {
      group: 'exceptions',
      badgeText: 'One-Time Claim Guard',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      title: 'Case 39: Add To Passport → Entry Already Saved',
      subtitle: 'A Guest QR may become Passport history exactly once. When the same code is opened again, the add-entry screen shows an "Added" status and states that the entry is already saved. There is no second claim action: the options are View Passport and Scan another Guest QR.',
      timelineSteps: FLOWS.addEntryAlreadySaved,
      emailTemplates: [],
      accessPath: {
        origin: 'Add-entry scanner or a typed code, reopened after a successful claim',
        route: '/passport/add-entry?code=GE-TEMP-4021&demoState=added',
        backTarget: 'Passport',
        steps: [
          'The Guest QR was already added to a Passport.',
          'The holder scans or types the same code again.',
          'The screen shows the "Added" status and refuses a second claim.',
          'View Passport opens the saved record. Scan another Guest QR restarts the scanner.',
        ],
      },
      renderViewport: () => <WF_AddEntryAlreadySaved />,
    },
    {
      group: 'exceptions',
      badgeText: 'Revoked Before Claim',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      title: 'Case 40: Add To Passport → Guest QR Revoked Before Claim',
      subtitle: 'The buyer revoked the Guest QR before anybody claimed it. The add-entry screen shows an "Unavailable" status and states that the pass was revoked before it could be added. The only actions are Return to Passport and Scan another Guest QR. Recovery is the buyer issuing a new Guest QR.',
      timelineSteps: FLOWS.addEntryUnavailable,
      emailTemplates: [],
      accessPath: {
        origin: 'Add-entry scanner or a typed code, after the buyer revoked the pass',
        route: '/passport/add-entry?code=GE-REVOKED-4218',
        backTarget: 'Passport',
        steps: [
          'The buyer revokes the Guest QR from Orders.',
          'The holder scans the code, or opens its ?code= link, on the add-entry screen.',
          'The screen shows "Unavailable" and names the reason.',
          'There is no self-service recovery. The buyer has to send a new Guest QR.',
        ],
      },
      renderViewport: () => <WF_AddEntryUnavailable />,
    },
    {
      group: 'exceptions',
      badgeText: 'Guest Web Page',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      title: 'Case 41: Public Guest Page → Link No Longer Valid',
      subtitle: 'The public guest page needs no login, so the link itself is the credential. A revoked pass reads "This entry QR is no longer valid" and names the buyer to contact. An unknown reference reads "Entry QR not found" and asks the buyer to resend. Neither state offers a claim or retry action.',
      timelineSteps: FLOWS.publicGuestInvalid,
      emailTemplates: [],
      accessPath: {
        origin: 'Shared guest link from SMS, email, or chat',
        route: '/guest-entry/GE-REVOKED-4218 (unknown references render the not-found state)',
        backTarget: 'Browser history, usually the message the link came from',
        steps: [
          'The buyer shares the public guest link. No login is needed to open it.',
          'The buyer revokes the pass, or the reference is mistyped or unknown.',
          'The page explains the state and names the buyer to contact.',
          'The recipient cannot recover the pass. The buyer generates and resends a new one.',
        ],
      },
      renderViewport: () => <WF_PublicGuestInvalid />,
    },
    {
      group: 'exceptions',
      badgeText: 'Shared Link Conflict',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'Case 44: Shared Form Link → Already Claimed By Another Account',
      subtitle: 'A shared form link can be forwarded, so two accounts can open the same entry. Opening it reserves nothing: the first completed submission owns the entry. A later account stays on the standard form and gets an inline notice naming the account that finished first. The typed answers stay on screen and are never attached to the other Passport, and the invite submit action is replaced by "Copy my answers".',
      timelineSteps: FLOWS.inviteClaimConflict,
      emailTemplates: [],
      accessPath: {
        origin: 'A shared form link opened by a second account',
        route: '/orders/:ticketId/form?invite=1 (submission refused)',
        backTarget: 'Browser history, usually the email or chat the link came from',
        steps: [
          'The same form link reaches more than one person.',
          'The first account to submit the form claims the entry for its Passport.',
          'The second account submits and stays on the form with an inline conflict notice.',
          'The answers remain visible and unattached. "Copy my answers" replaces the invite submit action.',
        ],
      },
      renderViewport: () => <WF_InviteClaimConflict />,
    },
    {
      group: 'exceptions',
      badgeText: 'Form Version Diff',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'Case 42: Form Update → Version Diff Review',
      subtitle: 'This is the screen behind "Review changes" in Orders. When the organizer edits a form after a submission, the diff lists every field as Unchanged, Updated, New field, or Removed, with the previous answers pre-filled, so the participant can see exactly what changed before resubmitting.',
      timelineSteps: FLOWS.formDiffReview,
      emailTemplates: [EMAIL_CATALOG.formRequired],
      accessPath: {
        origin: 'Orders → order detail → Review changes on the affected entry',
        route: '/forms/:entryId/diff',
        backTarget: 'Orders',
        steps: [
          'The participant already submitted the organizer form.',
          'The organizer changes the requirements, which raises the form version.',
          'Orders shows "Review changes" on that entry and links to the diff.',
          'The diff labels each field, keeps the previous answers, and leads to a resubmission.',
        ],
      },
      renderViewport: () => <WF_FormDiffReview />,
    },

    // ===== GROUP G: TEAM PLAYER ENTRIES (OWNERSHIP, INVITES, COMPLETION) =====
    {
      group: 'pending',
      badgeText: 'Player Ownership Choice',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      title: 'Case 45: Team Player Form → Passport Or Guest QR Ownership',
      subtitle: 'A player entry starts by asking who it is for. "For me" attaches the entry to the buyer\'s own Passport; "For someone else" keeps it buyer-filled and produces a Guest QR. Because one account can hold only one Passport entry per order, "For me" locks once the buyer already has one, and the screen says so: additional player entries use Guest QR or claim links. The submitted choice is recorded with the form. Checkout and the confirmation form ask this same question, so ownership reads identically wherever a buyer fills a form.',
      timelineSteps: FLOWS.teamOwnerChoice,
      emailTemplates: [],
      accessPath: {
        origin: 'Orders → team order → a player row that needs a form',
        route: '/orders/:ticketId/form?returnTo=order&participantId=:pid&playerOnly=1',
        backTarget: 'The team order',
        steps: [
          'The buyer opens a player row that still needs a form.',
          'The form asks who the entry is for before any participant fields.',
          '"For me" is disabled when the order already holds a Passport entry for the buyer.',
          'Submitting records the ownership path, so the row and the gate credential agree.',
        ],
      },
      renderViewport: () => <WF_TeamOwnerChoice />,
    },
    {
      group: 'ready',
      badgeText: 'Completed Player Form',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      title: 'Case 46: Team Player Form → Completed Form Details',
      subtitle: 'Once a player entry is complete, the same route opens read-only as "Form details": a Completed state with the recorded name and email instead of editable fields. This is what "View form" on a resolved team row opens, for both buyer-filled players and players who claimed the entry themselves. Reading it changes no ownership.',
      timelineSteps: FLOWS.teamFormCompleted,
      emailTemplates: [],
      accessPath: {
        origin: 'Orders → team order → View form on a resolved player row',
        route: '/orders/:ticketId/form?returnTo=order&participantId=:pid&playerOnly=1',
        backTarget: 'The team order',
        steps: [
          'The player entry is already complete.',
          'The team row shows View form instead of a fill action.',
          'The form route opens in read-only mode, titled "Form details".',
          'The recorded participant details are shown; ownership is untouched.',
        ],
      },
      renderViewport: () => <WF_TeamFormCompleted />,
    },
    {
      group: 'pending',
      badgeText: 'Player Invite Sent',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'Case 47: Team Player Form → Invite Sent, Waiting, Or Taken Back',
      subtitle: 'When a player has been sent a claim link, the form shows "Invitation Sent" with the recipient address, a "Change Email" action, and "Waiting for participant to complete form…". The buyer can take the entry back — "I\'ll fill this out myself instead" here, or Revoke on the order row without opening the form at all — which returns it to buyer-filled mode and stops the old link from working. A saved address is never displayed as sent until the invite actually goes out.',
      timelineSteps: FLOWS.teamInviteSent,
      emailTemplates: [EMAIL_CATALOG.rosterInvite],
      accessPath: {
        origin: 'Orders → team order → an invited player row',
        route: '/orders/:ticketId/form?returnTo=order&participantId=:pid&playerOnly=1',
        backTarget: 'The team order',
        steps: [
          'The buyer sends a claim link to a player from the team order.',
          'The row shows the recipient with a Revoke action; unsent rows stay blank.',
          'Opening the player shows the sent state and the wait, with Change Email.',
          'Taking the entry back returns it to buyer-filled mode and invalidates the link.',
        ],
      },
      renderViewport: () => <WF_TeamInviteSent />,
    },
    {
      group: 'ready',
      badgeText: 'Team Fully Resolved',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      title: 'Case 48: Team Order → Every Player Resolved',
      subtitle: 'This is a team order with nothing left to chase: the card reads "Players 6 of 6 ready" with a "Full" marker. Passport players show the recorded owner, and the buyer\'s own row is labeled "You". Buyer-managed players keep their Guest QR. The pending actions are gone — each row keeps "View form", and buyer-managed rows keep "View QR".',
      timelineSteps: FLOWS.teamAllReady,
      emailTemplates: [],
      accessPath: {
        origin: 'Orders → a fully resolved team order',
        route: '/orders/tkt-014',
        backTarget: 'Orders list',
        steps: [
          'Every player entry has a completed form and an assigned access path.',
          'The team card reads "Players 6 of 6 ready" and is marked Full.',
          'Each row names its owner; the buyer\'s own row reads "You".',
          'Rows expose View form, and buyer-managed players also expose View QR.',
        ],
      },
      renderViewport: () => <WF_TeamAllReady />,
    },
    {
      group: 'pending',
      badgeText: 'Before Payment',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'Case 49: Checkout → Participant Details Before Payment',
      subtitle: 'A mixed cart can hold entries that need details before payment and entries whose details can wait, so the gate shows only the first kind and counts only those — "Required before payment", "1/1". Deferred entries never appear as tabs; they are named in an inline "After payment" summary before payment is submitted, which states they stay available from confirmation, Orders, or Passport. Buyer-filled slots ask the same ownership question as Orders. With no gated entries the gate is skipped and payment is shown directly.',
      timelineSteps: FLOWS.checkoutParticipantDetails,
      emailTemplates: [EMAIL_CATALOG.formRequired],
      accessPath: {
        origin: 'Checkout, when an item requires forms before payment',
        route: '/checkout (participant details gate)',
        backTarget: 'Cart',
        steps: [
          'At least one item requires participant details before payment.',
          'The gate shows only those entries and counts only them.',
          'Each buyer-filled slot chooses Passport ownership or a buyer-filled Guest QR.',
          'An "After payment" summary names the deferred forms before payment is submitted.',
        ],
      },
      renderViewport: () => <WF_CheckoutParticipantDetails />,
    },
    {
      group: 'ready',
      badgeText: 'Web Add-Entry',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      title: 'Case 50: Add To Passport → Desktop Web Surface',
      subtitle: 'At 768px and above the add-entry route stops being a camera. It renders a light web surface titled "Add a Guest QR to Passport" that never requests camera access or mounts a video element, and offers one path: upload a saved photo of the pass, decoded locally through the same jsQR code as the phone. Below 768px the camera-first scanner is unchanged. Everything after decoding — eligible, revoked, already-claimed — behaves identically.',
      timelineSteps: FLOWS.addEntryWeb,
      emailTemplates: [],
      accessPath: {
        origin: 'Passport → Add a past event, on a desktop browser',
        route: '/passport/add-entry at a viewport of 768px or wider',
        backTarget: 'Passport',
        steps: [
          'The holder opens Passport on a computer rather than a phone.',
          'The add-entry route renders the web surface, with no camera involved.',
          '"Upload QR photo" takes a saved image; the page states it stays on the device.',
          'The decoded reference rejoins the normal ?code= resolution and claim rules.',
        ],
      },
      renderViewport: () => <WF_AddEntryWeb />,
    },
    {
      group: 'overview',
      badgeText: 'Adaptive Order Detail',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      title: 'Case 51: Order Details → Order Identity & Grouped Registration',
      subtitle: 'Order Details leads with the order rather than its first event, so a multi-event purchase is never misrepresented: the header carries the status label, purchase date, reference, and a truthful title such as "3-event order" with its item count and total. Below it, every entry sits in one continuous Registration surface separated by subtle dividers instead of a stack of cards, with the aggregate pending-form state, the bulk "Send all" and "Copy all" controls, and a "Contact organizer" action in its heading. Per-entry sharing collapses into one "Share form" menu offering Send link or Copy link.',
      timelineSteps: FLOWS.ordersAdaptiveDetail,
      emailTemplates: [],
      accessPath: {
        origin: 'Orders → an order card',
        route: '/orders/:orderId',
        backTarget: 'Orders list',
        steps: [
          'Orders lists photo-led cards with the status label, date, title, quantity, and amount.',
          'The detail header keeps the order as the identity, not the first event.',
          'One registration list holds every entry, with bulk sharing in its heading.',
          'Each event inside the list keeps its own status and primary action.',
        ],
      },
      renderViewport: () => <WF_OrdersAdaptiveDetail />,
    },
  ];

  const PURCHASE_INTENT_CASES = CASES_LIST.filter(c => c.group === 'scenario');
  const purchaseIntentCount = PURCHASE_INTENT_CASES.length;

  const getPurchaseIntentDisplay = (item: CaseCatalogItem) => {
    const original = parseTitle(item.title);
    const localNum = PURCHASE_INTENT_CASES.findIndex(c => c.title === item.title) + 1;

    return {
      ...original,
      localNum,
      localId: `purchase-intent-${localNum}`,
      localTitle: `Purchase Intent ${localNum}: ${original.short}`,
      globalLabel: original.num ? `Global Case ${original.num}` : '',
    };
  };

  const renderCaseItem = (
    item: CaseCatalogItem,
    options?: { purchaseIntent?: boolean; idOverride?: string },
  ) => {
    const parsed = parseTitle(item.title);
    const purchase = options?.purchaseIntent ? getPurchaseIntentDisplay(item) : undefined;

    return (
      <CaseItemFrame
        key={`${options?.purchaseIntent ? 'purchase-' : ''}${item.title}`}
        id={options?.idOverride || purchase?.localId || parsed.id}
        badgeText={purchase ? `Purchase Intent ${purchase.localNum}` : item.badgeText}
        badgeColor={purchase ? 'bg-teal-500/10 text-teal-300 border-teal-500/20' : item.badgeColor}
        title={purchase ? purchase.localTitle : item.title}
        subtitle={purchase
          ? `${item.subtitle} Original audit reference: ${purchase.globalLabel}.`
          : item.subtitle}
        timelineSteps={item.timelineSteps}
        emailTemplates={item.emailTemplates}
        accessPath={item.accessPath}
        renderViewport={(stepIdx) =>
          getStepViewport(item.title, stepIdx, item.timelineSteps[stepIdx], item.timelineSteps.length, item.renderViewport)
        }
      />
    );
  };

  const viewTabs: Array<{ id: 'purchase' | 'catalog' | 'diagram'; label: string }> = [
    { id: 'purchase', label: 'Purchase Intent' },
    { id: 'catalog', label: 'Screen States' },
    { id: 'diagram', label: 'Flow Diagram' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      {/* Header section */}
      <header className="sticky top-0 z-10 border-b bg-background/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => navigate('/')}
              aria-label="Back to home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Passport cases</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{CASES_LIST.length} cases · Purchase Intent has its own ordered 1–{purchaseIntentCount} set</p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:w-auto md:justify-end">
            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value as 'catalog' | 'purchase' | 'diagram')}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid h-9 w-full grid-cols-3 rounded-lg sm:w-auto">
                {viewTabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="rounded-md px-3 text-xs">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex h-9 items-center justify-between gap-3 rounded-lg border bg-background px-3 text-xs font-medium text-muted-foreground sm:justify-start">
              <label htmlFor="passport-cases-dark-mode" className="select-none whitespace-nowrap">
                Dark mode
              </label>
              <Switch
                id="passport-cases-dark-mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
                aria-label="Toggle dark mode"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main content container */}
      <main className="max-w-[1400px] mx-auto px-6 mt-8 flex flex-col gap-8">
        {viewMode === 'purchase' ? (
          <div className="flex flex-col gap-8">
            <Card className="shadow-none">
              <CardContent className="p-6">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-5 border-b pb-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight">Purchase Intent Cases</h2>
                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                        These cases are grouped by buyer intent. The sequence starts at Purchase Intent 1. The order shows who buys, who completes the form, who gets access, and what they show at the gate. The global case numbers stay only as audit references.
                      </p>
                    </div>
                    <div className="rounded-md border bg-muted/40 px-4 py-3 text-right">
                      <p className="text-2xl font-semibold leading-none">{purchaseIntentCount}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Purchase intent cases</p>
                    </div>
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
                  {PURCHASE_INTENT_CASES.map((item) => {
                    const purchase = getPurchaseIntentDisplay(item);
                    return (
                      <button
                        key={purchase.localId}
                        onClick={() => scrollToCase(purchase.localId)}
                        className="flex items-center gap-3 rounded-md border bg-background px-3 py-3 text-left transition-colors hover:bg-accent cursor-pointer"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-xs font-medium text-foreground">
                          {purchase.localNum}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{purchase.short}</span>
                          <span className="mt-0.5 block text-[10px] font-mono uppercase tracking-wide text-muted-foreground">{purchase.globalLabel}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-6">
              {PURCHASE_INTENT_CASES.map((item) => renderCaseItem(item, { purchaseIntent: true }))}
            </div>
          </div>
        ) : viewMode === 'catalog' ? (
          <>
            {/* Table of Contents / Index Section */}
            <Card className="shadow-none">
              <CardContent className="p-6">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-sm font-medium">State Index</h2>
                    <span className="text-xs text-muted-foreground">
                      Click a case to go to it
                    </span>
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {[
                    { group: 'pending', label: 'Pending & Setup' },
                    { group: 'ready', label: 'Ready & Distribution' },
                    { group: 'eventPast', label: 'Event Day & Past' },
                    { group: 'exceptions', label: 'Exceptions & Updates' },
                    { group: 'overview', label: 'Overview' },
                  ].map((section) => (
                    <div key={section.group} className="flex flex-col gap-3 border-l pl-4">
                      <div className="text-xs font-medium text-foreground">
                        {section.label}
                      </div>
                      <div className="flex flex-col gap-1">
                        {CASES_LIST.filter(c => c.group === section.group).map((item) => {
                          const { num, short, id } = parseTitle(item.title);
                          return (
                            <button
                              key={id}
                              onClick={() => scrollToCase(id)}
                              className="w-full text-left py-1 px-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                            >
                              <span className="truncate block">
                                <span className="font-mono text-[10px] mr-1.5 text-muted-foreground/70">#{num}</span>
                                {short}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              </CardContent>
            </Card>

            {/* Account & Gate Access Rules Reference */}
            <Card className="shadow-none">
              <CardContent className="p-6">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-2 border-b pb-4">
                    <h2 className="text-sm font-medium">Account & Gate Access Rules</h2>
                    <span className="ml-auto text-xs text-muted-foreground">Who needs a PlanOut account?</span>
                  </div>
                  <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs text-muted-foreground">Scenario</TableHead>
                      <TableHead className="text-xs text-muted-foreground">Who fills the form</TableHead>
                      <TableHead className="text-xs text-muted-foreground">Account required?</TableHead>
                      <TableHead className="text-xs text-muted-foreground">Gate QR source</TableHead>
                      <TableHead className="text-xs text-muted-foreground">Cases</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                      {[
                        { scenario: 'Buyer self-attending', fills: 'Buyer fills own form', account: 'Yes — already has one', qr: 'Universal Passport QR', cases: '1–14' },
                        { scenario: 'Ticket transfer (claim)', fills: 'Recipient fills own form', account: 'Yes — must create account first', qr: "Recipient's Passport QR", cases: '15' },
                        { scenario: 'Buyer fills for adult guest', fills: 'Buyer fills on their behalf', account: 'No — Guest QR issued', qr: 'Guest QR (web link)', cases: '23' },
                        { scenario: 'Buyer fills for dependent', fills: 'Buyer fills on their behalf', account: 'No — Guest QR issued', qr: 'Guest QR (web or printout)', cases: '16' },
                        { scenario: 'Team player entry', fills: 'Player fills own form', account: 'Yes — account required first', qr: "Player's Passport QR", cases: '18–21' },
                        { scenario: 'Buyer attends with friends', fills: "Buyer's choice per slot", account: 'Per-slot — mixed OK', qr: 'Invite → Passport QR, or fill → Guest QR', cases: '17' },
                      ].map((row) => (
                        <TableRow key={row.scenario}>
                          <TableCell className="font-medium">{row.scenario}</TableCell>
                          <TableCell className="text-muted-foreground">{row.fills}</TableCell>
                          <TableCell><Badge variant="outline">{row.account}</Badge></TableCell>
                          <TableCell className="text-muted-foreground">{row.qr}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">{row.cases}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-8">
              {/* Lifecycle sections: pending -> ready -> event day -> exceptions -> overview */}
              {([
                {
                  group: 'pending',
                  title: 'A. Pending & Setup',
                  blurb: 'These states occur after the purchase and before access is ready. The forms are not complete, or the payment is not confirmed.',
                },
                {
                  group: 'ready',
                  title: 'B. Ready & Distribution',
                  blurb: 'The entries are complete and access is ready. These states show the Passport card and the ways to give access to other persons: Guest QRs, claim links, and the group share link.',
                },
                {
                  group: 'eventPast',
                  title: 'C. Event Day & Past',
                  blurb: 'These states occur at the gate and after the event: the check-in scan, the attended history, and the no-show record.',
                },
                {
                  group: 'exceptions',
                  title: 'D. Exceptions & Updates',
                  blurb: 'These states are not on the usual path. The organizer changes a form, a deadline passes, or the buyer revokes a Guest QR.',
                },
                {
                  group: 'overview',
                  title: 'E. Overview',
                  blurb: 'The Events Attending page shows all the registrations in one place.',
                },
              ] as const).map((section) => {
                const sectionCases = CASES_LIST.filter(c => c.group === section.group);
                return (
                  <div key={section.group} className="flex flex-col gap-6 mt-6">
                    <div className="flex flex-col gap-1 py-3">
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-lg font-semibold tracking-tight">{section.title}</h2>
                        <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {sectionCases.length} {sectionCases.length === 1 ? 'case' : 'cases'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{section.blurb}</p>
                    </div>
                    <div className="flex flex-col gap-6">
                      {sectionCases.map((item) => {
                        const { id } = parseTitle(item.title);
                        return (
                          <CaseItemFrame
                            key={item.title}
                            id={id}
                            badgeText={item.badgeText}
                            badgeColor={item.badgeColor}
                            title={item.title}
                            subtitle={item.subtitle}
                            timelineSteps={item.timelineSteps}
                            emailTemplates={item.emailTemplates}
                            accessPath={item.accessPath}
                            renderViewport={(stepIdx) =>
                              getStepViewport(item.title, stepIdx, item.timelineSteps[stepIdx], item.timelineSteps.length, item.renderViewport)
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Render Diagram View */
          <div className="flex flex-col gap-6 w-full">
            <div className="rounded-xl border bg-card p-6 flex flex-col gap-2">
              <h2 className="text-sm font-medium">State Flow Diagram</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                Each row is one case. The row shows the steps of the user journey from left to right. Click a step to open the app screen and the related email template. Every step names its screen source: a live app route, a capture of a state that needs an interaction to reach, the screen the case itself documents, or no app screen for steps that happen at the gate or on the organizer's side. Use the filters below to show one lifecycle stage: pending, ready, event day, exceptions, or the overview.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 pb-2">
              {[
                { id: 'all', label: `All Cases (${CASES_LIST.length})` },
                { id: 'scenario', label: `Purchase Intent (${purchaseIntentCount})` },
                { id: 'pending', label: `Pending & Setup (${CASES_LIST.filter(c => c.group === 'pending').length})` },
                { id: 'ready', label: `Ready & Distribution (${CASES_LIST.filter(c => c.group === 'ready').length})` },
                { id: 'eventPast', label: `Event Day & Past (${CASES_LIST.filter(c => c.group === 'eventPast').length})` },
                { id: 'exceptions', label: `Exceptions & Updates (${CASES_LIST.filter(c => c.group === 'exceptions').length})` },
                { id: 'overview', label: `Overview (${CASES_LIST.filter(c => c.group === 'overview').length})` },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => {
                    setDiagramGroupFilter(pill.id);
                    setSelectedNodeId(null);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border select-none cursor-pointer ${
                    diagramGroupFilter === pill.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Flowcharts Stack */}
            <div className="flex flex-col gap-6 w-full">
              {(() => {
                const filtered = CASES_LIST.filter(c => diagramGroupFilter === 'all' || c.group === diagramGroupFilter);
                return filtered.map((item) => {
                  const { num, short, id } = parseTitle(item.title);
                  const purchase = item.group === 'scenario' ? getPurchaseIntentDisplay(item) : undefined;

                  return (
                    <div
                      key={id}
                      id={id}
                      className="p-5 rounded-xl border bg-card flex flex-col gap-4"
                    >
                      {/* Case Row Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="flex h-6 min-w-[42px] px-1 items-center justify-center rounded-md bg-muted text-xs font-mono font-medium text-muted-foreground shrink-0">
                            {purchase ? `PI ${purchase.localNum}` : `#${num}`}
                          </span>
                          <h3 className="text-sm font-semibold truncate">
                            {purchase ? purchase.short : short}
                          </h3>
                        </div>
                        <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium text-muted-foreground shrink-0">
                          {item.badgeText}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl -mt-1">
                        {item.subtitle}
                      </p>

                      {/* Horizontal flowchart row */}
                      <div className="overflow-x-auto w-full pb-2 pt-1">
                        <div className="flex items-center gap-3 md:gap-4 pr-4 pl-1">
                          {item.timelineSteps.map((step: any, idx: number) => {
                            const stepType = getStepType(step.title, step.desc);
                            const screenSource = resolveStepScreen(
                              item.title,
                              idx,
                              step,
                              item.timelineSteps.length,
                            );

                            return (
                              <React.Fragment key={idx}>
                                {/* Step Node */}
                                <div
                                  id={`${id}-step-${idx}`}
                                  onClick={() => {
                                    setSelectedNodeId(id);
                                    setSelectedStepIdx(idx);
                                  }}
                                  className="cursor-pointer rounded-lg border bg-background p-4 w-[240px] shrink-0 flex flex-col gap-2 transition-colors hover:bg-accent select-none"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                                      {idx + 1}
                                    </span>
                                    <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                      {stepType}
                                    </span>
                                  </div>

                                  <h4 className="text-xs font-semibold truncate leading-snug">
                                    {step.title}
                                  </h4>

                                  <p className="text-[10px] text-muted-foreground leading-normal line-clamp-2 h-[30px]">
                                    {step.desc}
                                  </p>

                                  <div className="border-t pt-2 mt-1">
                                    <span
                                      className={`block truncate font-mono text-[10px] ${
                                        screenSource.kind === 'none'
                                          ? 'text-muted-foreground/70'
                                          : 'text-foreground'
                                      }`}
                                      title={describeStepScreen(screenSource)}
                                    >
                                      {describeStepScreen(screenSource)}
                                    </span>
                                  </div>
                                </div>

                                {/* Arrow Connector */}
                                {idx < item.timelineSteps.length - 1 && (
                                  <div className="flex items-center justify-center shrink-0">
                                    <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
                                  </div>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}
      </main>

      {/* Floating Detail Drawer Panel */}
      {selectedNodeId && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-[998] transition-opacity duration-300"
            onClick={() => setSelectedNodeId(null)}
          />

          {/* Drawer component */}
          <div className="fixed top-0 right-0 h-full w-full sm:w-[500px] md:w-[600px] bg-background border-l z-[999] shadow-lg flex flex-col transition-transform duration-300 transform translate-x-0 overflow-hidden">
            {(() => {
              const item = CASES_LIST.find(c => parseTitle(c.title).id === selectedNodeId);
              if (!item) return null;
              const { num, short } = parseTitle(item.title);
              const purchase = item.group === 'scenario' ? getPurchaseIntentDisplay(item) : undefined;
              const activeStep = item.timelineSteps[selectedStepIdx];
              const stepType = activeStep ? getStepType(activeStep.title, activeStep.desc) : 'App View';
              const emailTemplate = item.emailTemplates && item.emailTemplates.length > 0
                ? (item.emailTemplates[selectedStepIdx] || item.emailTemplates[0])
                : null;
              
              return (
                <>
                  {/* Drawer Header */}
                  <div className="p-5 border-b flex items-center justify-between bg-background sticky top-0 shrink-0 z-10">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium text-muted-foreground shrink-0">
                        {purchase ? `Purchase Intent ${purchase.localNum}` : `Case ${num}`}
                      </span>
                      <h3 className="text-sm font-semibold truncate">
                        {purchase ? purchase.short : short}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedNodeId(null)}
                      className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Drawer Body (Scrollable) */}
                  <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                    {/* Subtitle / Description */}
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Transition context
                      </span>
                      <p className="text-sm leading-relaxed">
                        {item.subtitle}
                      </p>
                    </div>

                    {item.accessPath && <AccessPathPanel accessPath={item.accessPath} />}

                    <div className="h-px bg-border" />

                    {/* Visual Walkthrough Progress Selector */}
                    <div className="flex flex-col gap-4 items-center">
                      <div className="flex items-center justify-between w-full border-b pb-3">
                        <span className="text-xs font-medium text-muted-foreground">
                          Step {selectedStepIdx + 1} of {item.timelineSteps.length}
                        </span>

                        {/* Prev / Next buttons */}
                        <div className="flex gap-1.5">
                          <button
                            disabled={selectedStepIdx === 0}
                            onClick={() => setSelectedStepIdx(prev => Math.max(0, prev - 1))}
                            className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors select-none ${
                              selectedStepIdx === 0
                                ? 'text-muted-foreground/50 cursor-not-allowed'
                                : 'text-foreground bg-background hover:bg-accent cursor-pointer'
                            }`}
                          >
                            Prev
                          </button>
                          <button
                            disabled={selectedStepIdx === item.timelineSteps.length - 1}
                            onClick={() => setSelectedStepIdx(prev => Math.min(item.timelineSteps.length - 1, prev + 1))}
                            className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors select-none ${
                              selectedStepIdx === item.timelineSteps.length - 1
                                ? 'text-muted-foreground/50 cursor-not-allowed'
                                : 'text-foreground bg-background hover:bg-accent cursor-pointer'
                            }`}
                          >
                            Next
                          </button>
                        </div>
                      </div>

                      {/* Active Step Details */}
                      <div className="flex flex-col gap-1 w-full rounded-lg border bg-muted/40 p-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground shrink-0">
                              {selectedStepIdx + 1}
                            </span>
                            <span className="text-xs font-semibold truncate">
                              {activeStep.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground border rounded-md px-1.5 py-0.5">
                            {stepType}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed pl-6.5 mt-1">
                          {activeStep.desc}
                        </p>
                      </div>

                      <div className="mt-3">
                        <DevicePreviewFrame>
                          {getStepViewport(item.title, selectedStepIdx, activeStep, item.timelineSteps.length, item.renderViewport)}
                        </DevicePreviewFrame>
                      </div>
                    </div>
                    
                    {/* Active Email Alert Preview */}
                    {stepType === 'Email Alert' && emailTemplate && (
                      <>
                        <div className="h-px bg-border mt-4" />
                        <div className="flex flex-col gap-3">
                          <span className="text-xs font-medium text-muted-foreground">
                            Email notification
                          </span>
                          <div className="scale-[0.88] origin-top-left -mr-[12%] flex flex-col w-full">
                            <EmailPreviewFrame {...emailTemplate} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Drawer Actions / Footer */}
                  <div className="p-5 border-t bg-background flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedNodeId(null);
                        handleViewCaseInCatalog(selectedNodeId);
                      }}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm py-2.5 rounded-md text-center transition-colors select-none cursor-pointer"
                    >
                      View in catalog
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </>
      )}
    </div>
  );
}
