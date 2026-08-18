import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ordersSource = fs.readFileSync(
  new URL('../src/app/pages/OrdersPage.tsx', import.meta.url),
  'utf8',
);
const participantFormSource = fs.readFileSync(
  new URL('../src/app/pages/ParticipantFormPage.tsx', import.meta.url),
  'utf8',
);
const guestEntrySource = fs.readFileSync(
  new URL('../src/app/pages/GuestEntryPages.tsx', import.meta.url),
  'utf8',
);
const metalCardSource = fs.readFileSync(
  new URL('../src/app/components/MetalCard.tsx', import.meta.url),
  'utf8',
);
const primaryButtonSource = fs.readFileSync(
  new URL('../src/app/components/PrimaryButton.tsx', import.meta.url),
  'utf8',
);
const appContextSource = fs.readFileSync(
  new URL('../src/app/context/AppContext.tsx', import.meta.url),
  'utf8',
);
const ticketsSource = fs.readFileSync(
  new URL('../src/app/data/tickets.ts', import.meta.url),
  'utf8',
);

const loginRouteSource = fs.readFileSync(
  new URL('../src/app/routes/LoginRoute.tsx', import.meta.url),
  'utf8',
);
const participantFormRouteSource = fs.readFileSync(
  new URL('../src/app/routes/ParticipantFormRoute.tsx', import.meta.url),
  'utf8',
);
const rootLayoutSource = fs.readFileSync(
  new URL('../src/app/layouts/RootLayout.tsx', import.meta.url),
  'utf8',
);
const routerSource = fs.readFileSync(
  new URL('../src/app/router.tsx', import.meta.url),
  'utf8',
);

test('buyer-filled individual entries resolve to Guest QR access in Orders', () => {
  assert.match(ordersSource, /const isBuyerManagedGuest = isGuest && accessPath === 'guest_qr';/);
  assert.match(ordersSource, /Guest QR ready/);
});

test('recipient-claimed individual entries keep Passport access in Orders', () => {
  assert.match(ordersSource, /isIndividualPassportEntry/);
  assert.match(ordersSource, /entry\.accessPath === 'passport'/);
  assert.match(ordersSource, /entry\.type === 'guest' && entry\.accessPath !== 'passport'/);
  assert.match(participantFormRouteSource, /claimRegistrationEntry\(/);
  assert.match(appContextSource, /claimFormEntry\(source!, claimant\)/);
});

test('a duplicate claimant keeps a local draft and can copy answers after the conflict', () => {
  assert.match(participantFormSource, /inviteConflict/);
  assert.match(participantFormSource, /Your answers are still here/);
  assert.match(participantFormSource, /Copy my answers/);
});

test('shared claims re-read persisted state before accepting a submission', () => {
  assert.match(appContextSource, /const persistedEntries = readRegistrationQueueEntries\(\)/);
  assert.match(appContextSource, /const persistedTeamPlayerAccess = readRecord<TeamPlayerAccessPath>/);
  assert.match(appContextSource, /const persistedTeamPlayerRoster = readRecord<Participant\[\]>/);
});

test('unsent team claim links are rejected after the buyer takes the form back', () => {
  assert.match(appContextSource, /participant\?\.claimLinkRevoked/);
  assert.match(appContextSource, /reason: 'invite_revoked'/);
  assert.match(participantFormSource, /inviteLinkRevoked/);
});

test('shared form login uses the normal route return destination', () => {
  assert.match(loginRouteSource, /useLocation/);
  assert.match(loginRouteSource, /stateReturnTo/);
});

test('completed buyer-filled forms expose the participant Guest QR route', () => {
  assert.match(participantFormSource, /isBuyerManagedGuestEntry/);
  assert.match(participantFormSource, /onParticipantAccessChange/);
  assert.match(participantFormSource, />\s*Open QR\s*</);
  assert.match(
    participantFormSource,
    /`\/orders\/\$\{ticket\.id\}\/entry\/\$\{ticket\.id\}-\$\{currentParticipant\.id\}\/guest-qr`/,
  );
});

test('Guest QR screen uses a QR-first credential hierarchy', () => {
  const ticketSource = guestEntrySource.match(/<section\s+data-testid="guest-qr-pass"[\s\S]*?<\/section>/)?.[0] || '';
  assert.match(guestEntrySource, /data-testid="guest-qr-pass"/);
  assert.match(guestEntrySource, /data-testid="guest-qr-primary-action"/);
  assert.doesNotMatch(guestEntrySource, /data-testid="guest-qr-primary-action"[\s\S]*backgroundImage: 'none'/);
  assert.doesNotMatch(ticketSource, /Ready to scan/);
  assert.doesNotMatch(ticketSource, />PlanOut<\/p>/);
  assert.match(guestEntrySource, /Share Guest QR/);
  assert.match(guestEntrySource, /Guest QR pass/);
});

test('Guest QR page restores orientation and groups the code below the QR', () => {
  const ticketSource = guestEntrySource.match(/<section\s+data-testid="guest-qr-pass"[\s\S]*?<\/section>/)?.[0] || '';
  assert.match(guestEntrySource, /data-testid="guest-qr-page-header"/);
  assert.match(guestEntrySource, />Guest access pass<\/h1>/);
  assert.match(guestEntrySource, /\{qr\.attendeeName\} · \{qr\.eventName\}/);
  assert.match(guestEntrySource, /guest-qr-page-header.*text-center/);
  assert.match(ticketSource, /data-qr-stage="ticket-scan-area"[\s\S]*data-ticket-type="reference"/);
  assert.match(ticketSource, /Valid until/);
  assert.doesNotMatch(ticketSource, /Valid date/);
});

test('Guest QR pass uses the PlanOut ticket treatment', () => {
  assert.match(guestEntrySource, /data-material="planout-ticket"/);
  assert.match(guestEntrySource, /data-ticket-tone="forest"/);
  assert.match(guestEntrySource, /data-ticket-finish="soft-touch"/);
  assert.match(guestEntrySource, /data-ticket-surface="single-gradient"/);
  assert.match(guestEntrySource, /data-ticket-edge="postage-perforation"/);
  assert.match(guestEntrySource, /#063c36/);
  assert.match(guestEntrySource, /data-ticket-panel="single-surface"/);
  assert.doesNotMatch(guestEntrySource, /data-ticket-panel="mint-stub"/);
  assert.doesNotMatch(guestEntrySource, /#c9f7eb/);
});

test('Guest QR pass uses a full stamp-like postage perforation', () => {
  assert.match(guestEntrySource, /const TICKET_EDGE_SLOTS = \[/);
  assert.match(guestEntrySource, /TICKET_EDGE_SLOTS\.map/);
  assert.match(guestEntrySource, /data-ticket-edge="postage-perforation"/);
  assert.match(guestEntrySource, /data-ticket-edge-density="dense"/);
  assert.match(guestEntrySource, /data-ticket-edge-shape="scalloped"/);
  assert.match(guestEntrySource, /size-\[10px\]/);
  assert.doesNotMatch(guestEntrySource, /size-\[14px\]/);
  assert.match(guestEntrySource, /-top-\[7px\]/);
  assert.match(guestEntrySource, /-bottom-\[7px\]/);
  assert.match(guestEntrySource, /-left-\[7px\]/);
  assert.match(guestEntrySource, /-right-\[7px\]/);
});

test('Guest QR footer keeps only event and validity metadata', () => {
  const ticketSource = guestEntrySource.match(/<section\s+data-testid="guest-qr-pass"[\s\S]*?<\/section>/)?.[0] || '';
  assert.match(ticketSource, /data-ticket-type="event-date"/);
  assert.match(ticketSource, /data-ticket-type="validity"/);
  assert.match(ticketSource, /data-ticket-type="event-date" className="font-sans text-\[0\.6875rem\] font-semibold uppercase leading-\[1\.2\] tracking-\[0\.1em\][\s\S]*>\{ticketDate\}<\/p>/);
  assert.match(ticketSource, /data-ticket-type="validity"[\s\S]*font-sans text-\[0\.6875rem\] font-semibold uppercase leading-\[1\.2\] tracking-\[0\.1em\][\s\S]*>\{ticketDate\}<\/p>/);
  assert.match(ticketSource, /data-ticket-type="operational-meta" className="[^\"]*text-center/);
  assert.match(ticketSource, /data-ticket-type="operational-meta"[\s\S]*flex flex-col items-center/);
  assert.match(ticketSource, /<header className="text-center">/);
  assert.doesNotMatch(ticketSource, /validDateCopy\(ticketDate\)/);
  assert.doesNotMatch(ticketSource, /border-dashed/);
  assert.doesNotMatch(ticketSource, /data-ticket-type="operational-status"/);
});

test('Guest QR pass uses a clear editorial ticket type hierarchy', () => {
  const ticketSource = guestEntrySource.match(/<section\s+data-testid="guest-qr-pass"[\s\S]*?<\/section>/)?.[0] || '';
  assert.match(ticketSource, /data-ticket-typography="editorial-compact"/);
  assert.match(ticketSource, /data-ticket-type="attendee-name"/);
  assert.match(ticketSource, /data-ticket-type="event-meta"/);
  assert.match(ticketSource, /data-ticket-type="operational-meta"/);
  assert.match(ticketSource, /tabular-nums/);
  assert.match(ticketSource, /text-2xl font-semibold/);
  assert.doesNotMatch(ticketSource, /text-\[25px\]/);
});

test('Guest QR actions stay reachable in a bottom-safe sticky zone', () => {
  assert.match(guestEntrySource, /data-ticket-actions="bottom-safe"/);
  assert.match(guestEntrySource, /sticky bottom-0/);
  assert.match(guestEntrySource, /env\(safe-area-inset-bottom\)/);
});

test('Guest QR ticket enters with restrained physical motion', () => {
  const ticketSource = guestEntrySource.match(/<section\s+data-testid="guest-qr-pass"[\s\S]*?<\/section>/)?.[0] || '';
  assert.match(ticketSource, /data-ticket-entry-animation="rise"/);
  assert.match(guestEntrySource, /@keyframes guest-ticket-rise/);
  assert.match(guestEntrySource, /cubic-bezier\(0\.23, 1, 0\.32, 1\)/);
  assert.match(guestEntrySource, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(guestEntrySource, /guest-ticket-rise[\s\S]*scale\(0\)/);
});

test('Guest QR ticket and actions share a bottom-anchored stack', () => {
  const ticketSource = guestEntrySource.match(/<section\s+data-testid="guest-qr-pass"[\s\S]*?<\/section>/)?.[0] || '';
  assert.match(ticketSource, /data-ticket-anchor="bottom"/);
  assert.match(ticketSource, /mt-auto/);
  assert.match(guestEntrySource, /data-ticket-actions="bottom-safe"/);
});

test('Guest QR stays white and claimable after a gate scan', () => {
  const buyerGuestQrSource = guestEntrySource.match(/export function BuyerGuestQrContent[\s\S]*?export function BuyerGuestQrPage/)?.[0] || '';
  assert.match(buyerGuestQrSource, /data-ticket-page-surface="white"/);
  assert.doesNotMatch(buyerGuestQrSource, /bg-\[radial-gradient\(/);
  assert.doesNotMatch(buyerGuestQrSource, /markGuestEntryQRUsed/);
  assert.doesNotMatch(buyerGuestQrSource, /Mark scanned/);
  assert.doesNotMatch(buyerGuestQrSource, /Guest checked in/);
  assert.doesNotMatch(buyerGuestQrSource, /SCANNED/);
  assert.match(rootLayoutSource, /isGuestQrPage/);
  assert.match(rootLayoutSource, /isGuestQrPage \? '#ffffff'/);
});

test('Guest QR pass uses the bold green ticket credential styling', () => {
  assert.match(guestEntrySource, /data-material="planout-ticket"/);
  assert.match(guestEntrySource, /max-w-\[324px\]/);
  assert.match(guestEntrySource, /sizeClass="w-\[192px\]"/);
  assert.doesNotMatch(guestEntrySource, /<MetalCardTexture/);
  assert.doesNotMatch(guestEntrySource, /BRUSHED_METAL_PASS_BACKGROUND/);
  assert.doesNotMatch(guestEntrySource, /background-size:5px_5px/);
  assert.match(guestEntrySource, /max-w-\[360px\]/);
  assert.doesNotMatch(guestEntrySource, /shadow-\[0_12px_18px_-12px_rgba\(4,45,41,0\.48\)/);
  assert.doesNotMatch(guestEntrySource, /brandGradient=\{\{ from: '#1f1f21', to: '#050505' \}\}/);
  assert.match(primaryButtonSource, /from: '#3cd4b9'/);
  assert.match(primaryButtonSource, /to: '#177564'/);
  assert.match(guestEntrySource, /!rounded-full/);
});

test('live Guest QR pass stays separate from the Passport metal-card treatment', () => {
  assert.doesNotMatch(guestEntrySource, /BRUSHED_METAL_PASS_BACKGROUND/);
  assert.doesNotMatch(guestEntrySource, /MetalCardTexture/);
  assert.doesNotMatch(guestEntrySource, /MetalCardEmbossedPills/);
  assert.match(metalCardSource, /export const BRUSHED_METAL_BACKGROUND/);
  assert.match(metalCardSource, /export const BRUSHED_METAL_PASS_BACKGROUND/);
  assert.match(metalCardSource, /export function MetalCardEmbossedPills/);
});

test('active Guest QR regenerates in place and removes redundant resend', () => {
  const buyerGuestQrSource = guestEntrySource.match(/export function BuyerGuestQrContent[\s\S]*?export function BuyerGuestQrPage/)?.[0] || '';
  assert.match(buyerGuestQrSource, /Regenerate QR/);
  assert.match(buyerGuestQrSource, /forceNew: true/);
  assert.doesNotMatch(buyerGuestQrSource, /Revoke QR/);
  assert.doesNotMatch(buyerGuestQrSource, /Resend/);
  assert.doesNotMatch(buyerGuestQrSource, /setShowRevokeSheet/);
  assert.match(appContextSource, /forceNew\?: boolean/);
  assert.match(appContextSource, /existing && !input\.forceNew/);
});

test('Guest QR scan area avoids a redundant nested container', () => {
  assert.match(guestEntrySource, /data-qr-stage="ticket-scan-area"/);
  assert.match(guestEntrySource, /<EntryQr value=\{qr\.ref\} sizeClass="w-\[192px\]" \/>/);
  assert.doesNotMatch(guestEntrySource, /style=\{qrStageStyle\}/);
  assert.doesNotMatch(guestEntrySource, /qrStageClass/);
});

test('Guest QR keeps the credential surface focused on the scannable pass', () => {
  assert.doesNotMatch(guestEntrySource, /data-testid="guest-wallet-preview"/);
  assert.doesNotMatch(guestEntrySource, /<LeatherCardholder/);
  assert.doesNotMatch(guestEntrySource, /View wallet/);
  assert.match(guestEntrySource, /data-testid="guest-qr-pass"/);
});

test('completion persistence records the selected ownership path', () => {
  assert.match(appContextSource, /completeRegistrationEntry: \(entryId: string, accessPath\?: TeamPlayerAccessPath\)/);
  assert.match(appContextSource, /accessPath,\n/);
  assert.match(participantFormSource, /const accessPath: TeamPlayerAccessPath = buyerManagedGuest \? 'guest_qr' : 'passport';/);
});

test('team order details keep Guest QR actions visible per player', () => {
  assert.match(ordersSource, /teamEntries\.map/);
  assert.match(ordersSource, /View QR/);
});

test('team order details keep form management on the order', () => {
  const teamRegistrationSource = ordersSource.slice(
    ordersSource.indexOf('function TeamRegistrationItem'),
    ordersSource.indexOf('function ShippingTracker'),
  );
  assert.doesNotMatch(ordersSource, />\s*Open player entries\s*</);
  assert.match(ordersSource, /ParticipantFormLinkActions/);
  assert.match(ordersSource, /entry=\{playerEntry\}/);
  assert.match(teamRegistrationSource, />\s*Fill up\s*</);
  assert.doesNotMatch(teamRegistrationSource, />\s*Complete\s*</);
  assert.match(participantFormRouteSource, /const playerOnly = searchParams\.get\('playerOnly'\) === '1';/);
  assert.match(participantFormSource, /playerOnly/);
});

test('Orders participant links always open one form, never the retired roster editor', () => {
  assert.match(ordersSource, /participantId=.*playerOnly=1/);
  assert.match(participantFormRouteSource, /ticket\.ticketType === 'team' \|\| ticket\.ticketType === 'multiple'/);
  assert.match(participantFormRouteSource, /const completionParticipantId = participantId \|\| entry\?\.participantId;/);
  assert.match(participantFormRouteSource, /if \(\(ticket\.ticketType === 'team' \|\| ticket\.ticketType === 'multiple'\) && !completionParticipantId && !isInvite/);
  assert.match(participantFormRouteSource, /initialParticipantId=\{selectedParticipant\?\.id \|\| inviteParticipant\?\.id \|\| completionParticipantId\}/);
  assert.match(participantFormRouteSource, /playerOnly=\{playerOnly \|\| Boolean\(selectedParticipant && !isInvite\)\}/);
  assert.match(participantFormRouteSource, /participants: \[selectedParticipant\]/);
  assert.match(participantFormSource, /const isPlayerOnly = Boolean\(\(isTeam \|\| isMultiple\) && \(playerOnly \|\| initialParticipantId\)\)/);
  assert.doesNotMatch(participantFormSource, /isTeamManager|isMultiEditor|Next Participant/);
});

test('the retired static team form preview route is not reachable', () => {
  assert.doesNotMatch(routerSource, /ParticipantFormPreviewRoute/);
  assert.doesNotMatch(routerSource, /orders\/tkt-002\/form/);
});

test('each team player form owns its own Passport or Guest QR choice', () => {
  assert.match(participantFormSource, /isTeam && isPlayerOnly/);
  assert.match(participantFormSource, /teamEntryOwner/);
  assert.match(participantFormSource, /teamOwnerSelectionLocked/);
  assert.match(participantFormSource, /const optionDisabled = option\.value === 'self' && teamOwnerSelectionLocked/);
  assert.match(participantFormSource, /disabled=\{optionDisabled\}/);
  assert.match(participantFormSource, /const buyerManagedGuest = isTeam[\s\S]*teamEntryOwner === 'guest'[\s\S]*teamOwnerSelectionLocked/);
});

test('team Passport ownership is guarded and duplicate stored slots are normalized', () => {
  assert.match(appContextSource, /normalizeTeamPlayerState/);
  assert.match(appContextSource, /canAttachTeamPlayerToPassport/);
  assert.match(appContextSource, /requestedAccessPath === 'passport' && !canAttachTeamPlayerToPassport/);
});

test('team order details expose completed player forms', () => {
  const teamRegistrationSource = ordersSource.slice(
    ordersSource.indexOf('function TeamRegistrationItem'),
    ordersSource.indexOf('function ShippingTracker'),
  );
  assert.match(teamRegistrationSource, /hasGuestQr \? \(/);
  assert.match(teamRegistrationSource, /hasPassport && isBuyerPlayer \? \(/);
  assert.match(teamRegistrationSource, /View form/);
  assert.match(teamRegistrationSource, /onClick=\{\(\) => openPlayerForm\(playerEntry\)\}/);
});

test('buyer-owned team Passport rows are labeled You and expose their form', () => {
  assert.match(ordersSource, /passportMemberId\?: string;/);
  assert.match(ordersSource, /passportMemberId: participant\.passportMemberId/);
  assert.match(ordersSource, /const isBuyerPlayer = playerEntry\.passportMemberId === member\.memberId/);
  assert.match(ordersSource, /isBuyerPlayer \? 'You'/);
  assert.match(ordersSource, /hasPassport && isBuyerPlayer \? \(/);
});

test('team Passport rows surface the recorded owner for non-buyer entries', () => {
  assert.match(ordersSource, /passportDisplayName\?: string;/);
  assert.match(ordersSource, /passportDisplayName: participant\.passportDisplayName/);
  assert.match(ordersSource, /playerEntry\.participantName/);

  const teamMockStart = ticketsSource.indexOf("id: 'tkt-014'");
  const teamMock = ticketsSource.slice(teamMockStart, teamMockStart + 5200);
  assert.match(teamMock, /id: 'p2'[\s\S]*passportMemberId: 'member-emily-park'/);
  assert.match(teamMock, /passportDisplayName: 'Emily Park'/);
});

test('unsent team rows do not display a saved email as if it were sent', () => {
  assert.match(ordersSource, /const effectiveInviteStatus = matchingQueue\?\.inviteStatus \|\| participant\.inviteStatus;/);
  assert.match(ordersSource, /const canDisplayTeamEmail = effectiveInviteStatus === 'invited' \|\| participant\.formStatus === 'completed';/);
  assert.match(ordersSource, /canDisplayTeamEmail \? participant\.email : undefined/);
});

test('pending team invites can be unsent from Orders without opening the form', () => {
  assert.match(ordersSource, />\s*Revoke\s*</);
  assert.match(ordersSource, /unsendTeamPlayerInvite/);
  const unsendHandlerStart = ordersSource.indexOf('const unsendPlayerInvite =');
  const unsendHandlerEnd = ordersSource.indexOf('const sharePlayerInvite', unsendHandlerStart);
  const unsendHandler = ordersSource.slice(unsendHandlerStart, unsendHandlerEnd);
  assert.doesNotMatch(unsendHandler, /navigate\(/);
});

test('team order details expose add-player access up to the team maximum', () => {
  assert.match(ordersSource, /canAddTeamPlayer/);
  assert.match(ordersSource, /Add player/);
  assert.match(ordersSource, /const addPlayerSlot/);
  assert.match(ordersSource, /setTeamPlayerRoster\(ticketId, \[\.\.\.roster, newPlayer\]\)/);
  assert.doesNotMatch(ordersSource, /newPlayer=1/);
  assert.doesNotMatch(participantFormRouteSource, /const newPlayer = searchParams\.get\('newPlayer'\) === '1';/);
  assert.doesNotMatch(participantFormSource, /newPlayer/);
});

test('team order details expose removal for eligible unsent extra slots', () => {
  assert.match(ordersSource, /canRemoveTeamPlayer/);
  assert.match(ordersSource, /removeTeamPlayerSlot/);
  assert.match(ordersSource, /title="Remove player entry\?"/);
  assert.match(ordersSource, /cornerAction=/);
  assert.match(ordersSource, /IconButton/);
  assert.match(ordersSource, /size="sm"/);
  assert.match(ordersSource, /aria-label=\{`Remove \$\{playerName\}`\}/);
});

test('Orders includes a completed team mock with buyer-managed Guest QR players', () => {
  const teamMockStart = ticketsSource.indexOf("id: 'tkt-014'");
  const teamMock = ticketsSource.slice(teamMockStart, teamMockStart + 5200);

  assert.notEqual(teamMockStart, -1);
  assert.match(teamMock, /name: 'Sofia Lim'/);
  assert.match(teamMock, /accessPath: 'guest_qr'/);
  assert.match(teamMock, /id: 'p2'[\s\S]*accessPath: 'passport'/);
});
