import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router';
import {
  CheckCircle2,
  ClipboardCheck,
  Lock,
  Send,
  Share2,
  ShieldCheck,
  Ticket,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  type EntryAttendanceDecision,
  type GuestEntryQRRecord,
  useAppContext,
} from '@/app/context/AppContext';
import { FormTextField } from '@/app/components/FormTextField';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { SecondaryButton } from '@/app/components/SecondaryButton';
import {
  buildOrders,
  type OrderEventEntry,
  type OrderRecord,
} from '@/app/pages/OrdersPage';
import { type RegistrationQueueEntry } from '@/app/data/tickets';

function hashCell(value: string, index: number) {
  let hash = 2166136261;
  const input = `${value}:${index}`;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % 7 < 3;
}

function EntryQr({
  value,
  sizeClass = 'w-[232px]',
}: {
  value: string;
  sizeClass?: string;
}) {
  const cells = Array.from({ length: 21 * 21 }, (_, index) => {
    const row = Math.floor(index / 21);
    const col = index % 21;
    const inFinder =
      (row < 7 && col < 7) ||
      (row < 7 && col > 13) ||
      (row > 13 && col < 7);
    const finderBorder =
      inFinder &&
      (row % 14 === 0 ||
        row % 14 === 6 ||
        col % 14 === 0 ||
        col % 14 === 6 ||
        (row % 14 >= 2 && row % 14 <= 4 && col % 14 >= 2 && col % 14 <= 4));

    return inFinder ? finderBorder : hashCell(value, index);
  });

  return (
    <div className={`grid aspect-square ${sizeClass} grid-cols-[repeat(21,1fr)] gap-[3px] rounded-[20px] border border-[#d7e5e2] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfa_100%)] p-5 shadow-[0_14px_32px_-28px_rgba(15,23,42,0.48)]`}>
      {cells.map((active, index) => (
        <span key={index} className={`rounded-[2px] ${active ? 'bg-[#0f172b]' : 'bg-transparent'}`} />
      ))}
    </div>
  );
}

function formatScanTime(value?: string) {
  if (!value) return '4:18 AM - Main Gate';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function validDateCopy(eventDate: string) {
  const dateOnly = eventDate.split(' at ')[0];
  const event = new Date(dateOnly);
  const today = new Date();
  if (
    !Number.isNaN(event.getTime()) &&
    event.getFullYear() === today.getFullYear() &&
    event.getMonth() === today.getMonth() &&
    event.getDate() === today.getDate()
  ) {
    return 'One-time use - Valid today only';
  }
  return `One-time use - Valid ${dateOnly}`;
}

function copyText(value: string, success = 'Copied') {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(value);
    toast.success(success);
  }
}

function claimRefFor(value: string) {
  return `CLM-${value.replace(/[^A-Z0-9]/gi, '').toUpperCase()}`;
}

function findOrderEntry({
  orderId,
  entryId,
  registrationQueueEntries,
  entryAttendance,
  guestEntryQRs,
}: {
  orderId?: string;
  entryId?: string;
  registrationQueueEntries: RegistrationQueueEntry[];
  entryAttendance?: Record<string, EntryAttendanceDecision | undefined>;
  guestEntryQRs?: Record<string, GuestEntryQRRecord | undefined>;
}) {
  const orders = buildOrders({
    registrationQueueEntries,
    entryAttendance,
    guestEntryQRs,
  });
  const order = orders.find((item) =>
    item.id === orderId ||
    item.ref === orderId ||
    item.eventEntries.some((entry) => entry.ticket.id === orderId)
  );
  const entry = order?.eventEntries.find((item) => item.id === entryId);
  return { order, entry };
}

function findOrder({
  orderId,
  registrationQueueEntries,
  entryAttendance,
  guestEntryQRs,
}: {
  orderId?: string;
  registrationQueueEntries: RegistrationQueueEntry[];
  entryAttendance?: Record<string, EntryAttendanceDecision | undefined>;
  guestEntryQRs?: Record<string, GuestEntryQRRecord | undefined>;
}) {
  const orders = buildOrders({
    registrationQueueEntries,
    entryAttendance,
    guestEntryQRs,
  });
  return orders.find((item) =>
    item.id === orderId ||
    item.ref === orderId ||
    item.eventEntries.some((entry) => entry.ticket.id === orderId)
  );
}

function MissingEntry({
  title = 'Entry not found',
  description = 'This registration item is not available in the current prototype data.',
}: {
  title?: string;
  description?: string;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[52dvh] flex-col items-center justify-center px-5 text-center">
      <Lock className="h-10 w-10 text-[#94a3b8]" />
      <h1 className="mt-4 text-[24px] font-semibold tracking-[-0.5px] text-[#181d27]">{title}</h1>
      <p className="mt-2 max-w-[320px] text-[14px] font-medium leading-relaxed text-[#64748b]">
        {description}
      </p>
      <PrimaryButton type="button" onClick={() => navigate('/orders')} compact className="mt-5 text-[13px]">
        Back to Orders
      </PrimaryButton>
    </div>
  );
}

function demoGuestQr(ref: string): GuestEntryQRRecord | undefined {
  const base: GuestEntryQRRecord = {
    id: `demo-${ref}`,
    orderId: 'CFR-2026-008823',
    entryId: 'tkt-010-p2',
    attendeeName: 'Emily Park',
    eventName: 'Canlaon Marathon 2026',
    eventDate: 'June 27, 2026 at 5:00 AM',
    category: '42K Full Marathon',
    gate: 'Main Gate',
    ref,
    isActive: true,
    expiresAt: '2026-06-27T23:59:59.000Z',
    buyerName: 'Jessica Sanchez',
    recipientUrl: `/guest-entry/${ref}`,
  };

  if (ref === 'GE-TEMP-4021') {
    return {
      ...base,
      attendeeName: 'Arthur Sanchez',
      ref,
      onBehalfSignedBy: 'Jessica Sanchez',
    };
  }
  if (ref === 'GE-CANLAON-42K') {
    return {
      ...base,
      ref,
      attendeeName: 'Emily Park',
      onBehalfSignedBy: 'Jessica Sanchez',
    };
  }
  if (ref === 'GE-USED-4218') {
    return {
      ...base,
      ref,
      usedAt: '2026-06-27T04:18:00.000Z',
      scanGate: 'Main Gate',
    };
  }
  if (ref === 'GE-REVOKED-4218') {
    return {
      ...base,
      ref,
      isActive: false,
    };
  }
  return undefined;
}

export function BuyerGuestQrContent({
  entry,
  orderId,
  previewState,
}: {
  entry: OrderEventEntry;
  orderId: string;
  previewState?: 'used' | 'revoked';
}) {
  const navigate = useNavigate();
  const {
    generateGuestEntryQR,
    markGuestEntryQRUsed,
    member,
    revokeGuestEntryQR,
  } = useAppContext();
  const [localQr, setLocalQr] = useState(entry.guestQR);
  const [showRevokeSheet, setShowRevokeSheet] = useState(false);
  const [revokeReason, setRevokeReason] = useState('');

  useEffect(() => {
    if (entry.guestQR) {
      setLocalQr(entry.guestQR);
      return;
    }
    setLocalQr(generateGuestEntryQR({
      orderId,
      entryId: entry.id,
      attendeeName: entry.participantName,
      eventName: entry.ticket.eventTitle,
      eventDate: entry.ticket.eventDate,
      category: entry.category,
      gate: 'Main Gate',
      buyerName: member.displayName,
    }));
  }, [entry, generateGuestEntryQR, member.displayName, orderId]);

  const qr = localQr
    ? previewState === 'used'
      ? {
          ...localQr,
          usedAt: localQr.usedAt || '2026-06-27T04:18:00.000Z',
          scanGate: localQr.scanGate || 'Main Gate',
        }
      : previewState === 'revoked'
        ? {
            ...localQr,
            isActive: false,
            revokedAt: localQr.revokedAt || '2026-06-10T08:30:00.000Z',
          }
        : localQr
    : localQr;

  if (!qr) {
    return (
      <div className="flex min-h-[52dvh] items-center justify-center text-[14px] font-semibold text-[#64748b]">
        Preparing Guest Entry QR...
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/guest-entry/${qr.ref}`;
  const shareText = `${qr.attendeeName}'s entry for ${qr.eventName} on ${qr.eventDate}. Open this link to get your entry QR. ${shareUrl}`;
  const isUsed = Boolean(qr.usedAt);
  const isClaimed = Boolean(qr.claimedAt);
  const isRevoked = !qr.isActive && !isClaimed;

  const shareQr = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Guest Entry QR', text: shareText, url: shareUrl });
      } else {
        copyText(shareText, 'Guest entry link copied');
      }
    } catch {
      toast.error('Could not share Guest Entry QR');
    }
  };

  return (
    <div className="relative flex flex-col gap-5 pb-8">
      <section className={`overflow-hidden rounded-[22px] border shadow-[0_18px_42px_-32px_rgba(15,23,42,0.65)] ${isClaimed ? 'border-[#d8ddff] bg-[#f5f7ff]' : isRevoked ? 'border-[#fecaca] bg-[#fff7f7]' : isUsed ? 'border-[#cbd5e1] bg-[#f8fafc]' : 'border-[#0f6b5f] bg-[#0f6b5f]'}`}>
        <div className={`p-4 ${isClaimed ? 'text-[#312e81]' : isRevoked ? 'text-[#7f1d1d]' : isUsed ? 'text-[#181d27]' : 'text-white'}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="line-clamp-2 text-[22px] font-semibold leading-tight tracking-[-0.45px]">{entry.ticket.eventTitle}</h1>
              <p className={`mt-1.5 text-[12px] font-semibold ${isClaimed ? 'text-[#46518f]' : isRevoked ? 'text-[#991b1b]' : isUsed ? 'text-[#516173]' : 'text-[#d7f4ee]'}`}>
                {entry.category} · {entry.participantName}
              </p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${isClaimed ? 'bg-white text-[#4338ca]' : isRevoked ? 'bg-[#fee2e2] text-[#b42318]' : isUsed ? 'bg-[#e2e8f0] text-[#475569]' : 'bg-white/14 text-white ring-1 ring-white/18'}`}>
              {isClaimed ? 'Claimed' : isRevoked ? 'Revoked' : isUsed ? 'Scanned' : 'Active'}
            </span>
          </div>
        </div>

        <div className="border-t border-white/10 bg-white p-5 text-center">
          <div className="relative flex justify-center">
            <EntryQr value={qr.ref} />
            {(isClaimed || isRevoked || isUsed) && (
              <div className={`absolute inset-0 flex items-center justify-center rounded-[22px] ${isClaimed ? 'bg-[#4338ca]/12' : isUsed ? 'bg-[#0f172b]/12' : 'bg-[#7f1d1d]/18'}`}>
                <span className={`rotate-[-12deg] rounded-[10px] border-2 bg-white/90 px-4 py-2 text-[18px] font-bold tracking-[2px] ${isClaimed ? 'border-[#4338ca] text-[#4338ca]' : isUsed ? 'border-[#64748b] text-[#475569]' : 'border-[#b42318] text-[#b42318]'}`}>
                  {isClaimed ? 'CLAIMED' : isUsed ? 'SCANNED' : 'REVOKED'}
                </span>
              </div>
            )}
          </div>
          <div className="mt-4 rounded-[16px] border border-[#e4edf0] bg-[#f8fafc] px-3 py-3">
            <p className={`font-mono text-[12px] font-semibold tracking-[0.3px] text-[#5f7182] ${isRevoked ? 'line-through decoration-[#b42318] decoration-2' : ''}`}>{qr.ref}</p>
            <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.35px] text-[#181d27]">{qr.attendeeName}</h2>
            <p className="mx-auto mt-1 max-w-[300px] text-[13px] font-medium leading-relaxed text-[#516173]">
              {qr.eventName} · {qr.eventDate} · {qr.gate}
            </p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-left">
            <div className="rounded-[14px] border border-[#e4edf0] bg-white px-3 py-2.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.8px] text-[#94a3b8]">Validity</p>
              <p className="mt-0.5 text-[12px] font-semibold text-[#92400e]">{validDateCopy(qr.eventDate).replace('One-time use - ', '')}</p>
            </div>
            <div className="rounded-[14px] border border-[#e4edf0] bg-white px-3 py-2.5">
              <p className="text-[9px] font-bold uppercase tracking-[0.8px] text-[#94a3b8]">Status</p>
              <p className={`mt-0.5 text-[12px] font-semibold ${isClaimed ? 'text-[#4338ca]' : isRevoked ? 'text-[#b42318]' : isUsed ? 'text-[#64748b]' : 'text-[#177564]'}`}>
                {isClaimed ? 'Claimed' : isRevoked ? 'Revoked' : isUsed ? 'Scanned' : 'Ready'}
              </p>
            </div>
          </div>
          {isUsed && (
            <p className="mt-3 text-[12px] font-semibold text-[#64748b]">Used at {formatScanTime(qr.usedAt)} · {qr.scanGate || qr.gate}</p>
          )}
          {!isRevoked && !isUsed && (
            <button
              type="button"
              onClick={() => setShowRevokeSheet(true)}
              className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] border border-[#fda29b] bg-[#fff1f0] px-5 py-2.5 text-[13px] font-bold text-[#b42318] shadow-[0_10px_22px_-18px_rgba(180,35,24,0.55)] transition-all hover:bg-[#ffe4e2] hover:border-[#f97066] active:scale-[0.98]"
            >
              <XCircle className="h-4 w-4" />
              Revoke
            </button>
          )}
        </div>
      </section>

      {isClaimed ? (
        <div className="rounded-[18px] border border-[#d8ddff] bg-[#f5f7ff] p-4 text-center">
          <CheckCircle2 className="mx-auto h-7 w-7 text-[#4338ca]" />
          <p className="mt-2 text-[15px] font-semibold text-[#312e81]">Guest QR claimed</p>
          <p className="mt-1 text-[12px] font-medium leading-relaxed text-[#46518f]">This entry now belongs to a Passport. It cannot be shared, scanned, or claimed again.</p>
        </div>
      ) : isUsed ? (
        <div className="rounded-[18px] border border-[#d5d7da] bg-white p-4 text-center">
          <CheckCircle2 className="mx-auto h-7 w-7 text-[#64748b]" />
          <p className="mt-2 text-[15px] font-semibold text-[#181d27]">Guest checked in</p>
          <p className="mt-1 text-[12px] font-medium leading-relaxed text-[#64748b]">
            The QR is consumed and cannot be shared again. Keep this record for the order history.
          </p>
          <SecondaryButton
            type="button"
            onClick={() => navigate(`/guest-entry/${qr.ref}`)}
            fullWidth
            tone="neutral"
            className="mt-4"
          >
            View guest receipt
          </SecondaryButton>
        </div>
      ) : isRevoked ? (
        <div className="rounded-[18px] border border-[#fecaca] bg-[#fef2f2] p-4 text-center">
          <XCircle className="mx-auto h-7 w-7 text-[#b42318]" />
          <p className="mt-2 text-[15px] font-semibold text-[#b42318]">QR revoked</p>
          <PrimaryButton
            type="button"
            onClick={() => {
              const next = generateGuestEntryQR({
                orderId,
                entryId: entry.id,
                attendeeName: entry.participantName,
                eventName: entry.ticket.eventTitle,
                eventDate: entry.ticket.eventDate,
                category: entry.category,
                gate: 'Main Gate',
                buyerName: member.displayName,
              });
              setLocalQr(next);
            }}
            compact
            className="mt-3 rounded-[12px] text-[13px]"
          >
            Generate new QR
          </PrimaryButton>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <PrimaryButton type="button" onClick={shareQr} fullWidth className="h-12 rounded-[13px] text-[14px]">
            <Share2 className="h-4 w-4" />
            Share
          </PrimaryButton>
          <SecondaryButton
            type="button"
            onClick={() => toast.success('Guest Entry QR resent', { description: qr.attendeeName })}
            fullWidth
            tone="neutral"
            className="h-11 rounded-[12px]"
          >
            <Send className="h-4 w-4" />
            Resend
          </SecondaryButton>
          <SecondaryButton
            type="button"
            onClick={() => {
              markGuestEntryQRUsed(entry.id, 'Main Gate');
              setLocalQr({ ...qr, usedAt: new Date().toISOString(), scanGate: 'Main Gate' });
              toast.success('Guest check-in recorded');
            }}
            fullWidth
            tone="neutral"
            className="h-11 rounded-[12px]"
          >
            <ClipboardCheck className="h-4 w-4" />
            Mark scanned
          </SecondaryButton>
        </div>
      )}

      {showRevokeSheet && (
        <div className="fixed inset-0 z-[120] flex items-end bg-black/32">
          <div className="w-full rounded-t-[24px] bg-white p-5 shadow-[0_-18px_48px_-30px_rgba(15,23,42,0.7)]">
            <h2 className="text-[20px] font-semibold tracking-[-0.4px] text-[#181d27]">
              Revoke {qr.attendeeName}'s QR?
            </h2>
            <p className="mt-2 text-[13px] font-medium leading-relaxed text-[#64748b]">
              This immediately invalidates their current QR. A new one can be generated after revoking. The entry itself is not affected.
            </p>
            <div className="mt-4 grid gap-2">
              {['Sent to wrong person', `${qr.attendeeName} lost the link`, 'Plans changed', 'Other'].map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setRevokeReason(reason)}
                  className={`rounded-[12px] border px-3 py-2 text-left text-[13px] font-semibold ${revokeReason === reason ? 'border-[#b42318] bg-[#fef2f2] text-[#b42318]' : 'border-[#e5e7eb] text-[#64748b]'}`}
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                revokeGuestEntryQR(entry.id);
                setLocalQr({ ...qr, isActive: false, revokedAt: new Date().toISOString() });
                setShowRevokeSheet(false);
              }}
              className="mt-5 h-12 w-full rounded-[14px] bg-[#b42318] text-[14px] font-semibold text-white"
            >
              Revoke QR
            </button>
            <button
              type="button"
              onClick={() => setShowRevokeSheet(false)}
              className="mt-2 h-11 w-full rounded-[12px] text-[13px] font-semibold text-[#64748b]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function BuyerGuestQrPage() {
  const { orderId, entryId } = useParams<{ orderId: string; entryId: string }>();
  const [searchParams] = useSearchParams();
  const {
    registrationQueueEntries,
    entryAttendance,
    guestEntryQRs,
  } = useAppContext();
  const { order, entry } = findOrderEntry({
    orderId,
    entryId,
    registrationQueueEntries,
    entryAttendance,
    guestEntryQRs,
  });

  if (!order || !entry) return <MissingEntry />;
  return (
    <BuyerGuestQrContent
      entry={entry}
      orderId={order.id}
      previewState={searchParams.get('state') === 'used' || searchParams.get('state') === 'revoked'
        ? searchParams.get('state') as 'used' | 'revoked'
        : undefined}
    />
  );
}

export function PublicGuestEntryPage({ overrideQr }: { overrideQr?: GuestEntryQRRecord } = {}) {
  const { guestQRRef } = useParams<{ guestQRRef: string }>();
  const navigate = useNavigate();
  const { findGuestEntryQRByRef } = useAppContext();
  const qr = overrideQr || (guestQRRef ? findGuestEntryQRByRef(guestQRRef) || demoGuestQr(guestQRRef) : undefined);

  return (
    <div className="min-h-dvh bg-[linear-gradient(180deg,#fbfffe_0%,#f6f8fb_42%,#eef4f2_100%)] px-5 pb-8 pt-[calc(18px+env(safe-area-inset-top))]">
      <main className="mx-auto flex w-full max-w-[430px] flex-col items-center">
        <header className="mb-6 flex w-full items-center justify-center">
          <div className="rounded-full border border-[#dbe7e4] bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-[1.8px] text-[#177564] shadow-sm">
            PlanOut
          </div>
        </header>

        {!qr ? (
          <section className="mt-20 rounded-[22px] border border-white bg-white p-6 text-center shadow-[0_24px_54px_-40px_rgba(15,23,42,0.5)]">
            <Lock className="mx-auto h-9 w-9 text-[#94a3b8]" />
            <h1 className="mt-4 text-[23px] font-semibold tracking-[-0.5px] text-[#181d27]">Entry QR not found</h1>
            <p className="mt-2 text-[14px] leading-relaxed text-[#64748b]">
              Ask the buyer to resend your Guest Entry QR link.
            </p>
          </section>
        ) : qr.claimedAt ? (
          <section className="mt-20 rounded-[22px] border border-[#dbe7e4] bg-white p-6 text-center shadow-[0_24px_54px_-40px_rgba(15,23,42,0.5)]">
            <CheckCircle2 className="mx-auto h-9 w-9 text-[#177564]" />
            <h1 className="mt-4 text-[23px] font-semibold tracking-[-0.5px] text-[#181d27]">This entry is on a Passport</h1>
            <p className="mt-2 text-[14px] leading-relaxed text-[#64748b]">
              This Guest QR has already been claimed and cannot be used or claimed again.
            </p>
          </section>
        ) : !qr.isActive ? (
          <section className="mt-20 rounded-[22px] border border-[#fecaca] bg-[#fef2f2] p-6 text-center shadow-[0_24px_54px_-40px_rgba(15,23,42,0.5)]">
            <XCircle className="mx-auto h-9 w-9 text-[#b42318]" />
            <h1 className="mt-4 text-[23px] font-semibold tracking-[-0.5px] text-[#7f1d1d]">
              This entry QR is no longer valid.
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-[#991b1b]">
              Contact {qr.buyerName} for a new one.
            </p>
          </section>
        ) : qr.usedAt ? (
          <section className="mt-20 rounded-[22px] border border-[#d5d7da] bg-white p-6 text-center shadow-[0_24px_54px_-40px_rgba(15,23,42,0.5)]">
            <CheckCircle2 className="mx-auto h-9 w-9 text-[#64748b]" />
            <h1 className="mt-4 text-[23px] font-semibold tracking-[-0.5px] text-[#181d27]">
              This QR has already been used for check-in.
            </h1>
            <p className="mt-2 text-[14px] font-medium leading-relaxed text-[#64748b]">
              Checked in at {formatScanTime(qr.usedAt)} - {qr.scanGate || qr.gate}.
            </p>
          </section>
        ) : (
          <>
            <section className="w-full overflow-hidden rounded-[22px] border border-[#0f6b5f] bg-[#0f6b5f] shadow-[0_18px_42px_-32px_rgba(15,23,42,0.65)]">
              <div className="p-4 text-white">
                <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.6px]">{qr.attendeeName}</h1>
                <p className="mt-1.5 text-[13px] font-semibold text-[#d7f4ee]">{qr.eventName}</p>
              </div>
              <div className="bg-white p-5 text-center">
                <div className="flex justify-center">
                  <EntryQr value={qr.ref} sizeClass="w-[252px]" />
                </div>
                <p className="mt-4 font-mono text-[12px] font-semibold tracking-[0.4px] text-[#5f7182]">{qr.ref}</p>
                <div className="mt-4 rounded-[16px] border border-[#e4edf0] bg-[#f8fafc] p-4">
                  <h2 className="text-[17px] font-semibold tracking-[-0.25px] text-[#181d27]">{qr.category}</h2>
                  <p className="mt-1 text-[13px] font-medium leading-relaxed text-[#516173]">
                    {qr.eventDate} · {qr.gate}
                  </p>
                  <p className="mx-auto mt-3 inline-flex rounded-full border border-[#fde68a] bg-[#fffbeb] px-3 py-1.5 text-[12px] font-semibold text-[#92400e]">
                    {validDateCopy(qr.eventDate)}
                  </p>
                </div>
                {qr.onBehalfSignedBy && (
                  <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50/70 px-3 py-1.5 text-[11px] font-semibold text-teal-800">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#177564]" />
                    Forms completed by {qr.onBehalfSignedBy}
                  </div>
                )}
                <p className="mt-4 text-[15px] font-semibold text-[#177564]">
                  Show this to staff at {qr.gate}
                </p>
              </div>
            </section>
            <footer className="mt-6 rounded-[18px] border border-[#cfe4df] bg-white/80 p-4 text-center">
              <p className="text-[12px] font-semibold leading-relaxed text-[#177564]">
                No account is needed to use this QR. If you create an account later, you can add this entry to your Passport once.
              </p>
              <SecondaryButton
                type="button"
                onClick={() => navigate(`/passport/add-entry?code=${encodeURIComponent(qr.ref)}`)}
                fullWidth
                tone="neutral"
                className="mt-3 h-11 rounded-[12px]"
              >
                Add this entry to Passport
              </SecondaryButton>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}

export function TemporaryGuestQrPage() {
  return <BuyerGuestQrPage />;
}

function GuestStatusPill({ qr }: { qr?: GuestEntryQRRecord }) {
  if (!qr) {
    return <span className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[11px] font-semibold text-[#64748b]">Not generated</span>;
  }
  if (qr.claimedAt) {
    return <span className="rounded-full bg-[#eef2ff] px-2.5 py-1 text-[11px] font-semibold text-[#4338ca]">Claimed</span>;
  }
  if (!qr.isActive) {
    return <span className="rounded-full bg-[#fef2f2] px-2.5 py-1 text-[11px] font-semibold text-[#b42318]">Revoked</span>;
  }
  if (qr.usedAt) {
    return <span className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[11px] font-semibold text-[#475569]">Used</span>;
  }
  return <span className="rounded-full bg-[#def2ee] px-2.5 py-1 text-[11px] font-semibold text-[#177564]">Active</span>;
}

export function AddGuestEntryToPassportPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { claimGuestEntryQR, findGuestEntryQRByRef } = useAppContext();
  const [code, setCode] = useState(searchParams.get('code') || '');
  const [submittedCode, setSubmittedCode] = useState(searchParams.get('code') || '');
  const [claimed, setClaimed] = useState<GuestEntryQRRecord | null>(null);
  const qr = submittedCode ? findGuestEntryQRByRef(submittedCode) : undefined;
  const normalizedCode = code.trim().toUpperCase();

  const lookup = () => {
    setClaimed(null);
    setSubmittedCode(normalizedCode);
  };
  const claim = () => {
    const result = claimGuestEntryQR(submittedCode);
    if (!result.ok) {
      toast.error(
        result.reason === 'already_claimed'
          ? 'This entry has already been claimed.'
          : result.reason === 'revoked'
            ? 'This Guest QR is no longer valid.'
            : 'Guest QR not found.',
      );
      return;
    }
    setClaimed(result.qr);
    toast.success('Entry added to Passport', { description: result.qr.eventName });
  };

  if (claimed) {
    return (
      <div className="mx-auto flex min-h-[62dvh] w-full max-w-[430px] flex-col justify-center px-5 py-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-[#177564]" />
        <h1 className="mt-4 text-[25px] font-semibold tracking-[-0.55px] text-[#181d27]">Entry added to Passport</h1>
        <p className="mt-2 text-[13px] font-medium leading-relaxed text-[#64748b]">
          {claimed.eventName} is now part of your Passport history. The original Guest QR is permanently inactive.
        </p>
        <PrimaryButton type="button" onClick={() => navigate('/passport')} fullWidth className="mt-6 h-12 rounded-[14px]">
          View Passport
        </PrimaryButton>
      </div>
    );
  }

  const claimedAlready = Boolean(qr?.claimedAt);
  const revoked = Boolean(qr && !qr.isActive && !qr.claimedAt);
  return (
    <div className="mx-auto flex w-full max-w-[430px] flex-col gap-5 px-5 pb-8 pt-5">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[1px] text-[#177564]">Passport</p>
        <h1 className="mt-1 text-[27px] font-semibold tracking-[-0.7px] text-[#181d27]">Add a Guest QR entry</h1>
        <p className="mt-2 text-[13px] font-medium leading-relaxed text-[#64748b]">
          Scan a Guest QR to open this page, or enter its code. A valid entry can be added to one Passport only, even after it was used at the gate.
        </p>
      </header>

      <section className="rounded-[18px] border border-[#dbe7e4] bg-white p-4 shadow-[0_14px_30px_-28px_rgba(15,23,42,0.48)]">
        <label className="block text-[12px] font-semibold text-[#344054]" htmlFor="guest-qr-code">Guest QR code</label>
        <p className="mt-1 text-[11px] font-medium text-[#64748b]">Example format: GE-AB12-CD34</p>
        <div className="mt-3 flex gap-2">
          <input
            id="guest-qr-code"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            onKeyDown={(event) => event.key === 'Enter' && lookup()}
            className="min-w-0 flex-1 rounded-[11px] border border-[#cbd5e1] px-3 py-2.5 font-mono text-[13px] font-semibold uppercase tracking-[0.4px] text-[#181d27] outline-none focus:border-[#177564] focus:ring-2 focus:ring-[#177564]/15"
            placeholder="GE-"
          />
          <SecondaryButton type="button" onClick={lookup} tone="neutral" className="rounded-[11px] px-3 text-[12px]">Find</SecondaryButton>
        </div>
      </section>

      {submittedCode && !qr && (
        <p className="rounded-[14px] border border-[#fde68a] bg-[#fffbeb] p-3 text-[12px] font-medium leading-relaxed text-[#854d0e]">We could not find that Guest QR. Check the code or ask the buyer to resend the link.</p>
      )}
      {qr && (
        <section className="rounded-[18px] border border-[#dbe7e4] bg-[#f8fbfa] p-4">
          <p className="text-[16px] font-semibold text-[#181d27]">{qr.eventName}</p>
          <p className="mt-1 text-[12px] font-medium text-[#516173]">{qr.attendeeName} · {qr.category}</p>
          <p className="mt-2 font-mono text-[11px] font-semibold text-[#64748b]">{qr.ref}</p>
          {qr.usedAt && <p className="mt-3 rounded-[10px] bg-white px-3 py-2 text-[12px] font-medium text-[#516173]">Checked in at {formatScanTime(qr.usedAt)}. Claiming preserves this event history.</p>}
          {claimedAlready ? <p className="mt-4 text-[13px] font-semibold text-[#4338ca]">This entry is already on a Passport and cannot be claimed again.</p>
            : revoked ? <p className="mt-4 text-[13px] font-semibold text-[#b42318]">This Guest QR was revoked and cannot be claimed.</p>
            : <PrimaryButton type="button" onClick={claim} fullWidth className="mt-4 h-12 rounded-[13px]">Add to my Passport</PrimaryButton>}
        </section>
      )}
    </div>
  );
}

function isClaimLinkGuest(entry: OrderEventEntry) {
  return entry.inviteStatus === 'invited' && entry.status !== 'attached';
}

function isGuestFormComplete(entry: OrderEventEntry) {
  return entry.status === 'attached';
}

interface ClaimLinkOverride {
  canceled?: boolean;
  email?: string;
}

export function MultiGuestManagerPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const {
    generateGuestEntryQR,
    guestEntryQRs,
    markGuestEntryQRUsed,
    member,
    registrationQueueEntries,
    entryAttendance,
    revokeGuestEntryQR,
  } = useAppContext();
  const order = findOrder({
    orderId,
    registrationQueueEntries,
    entryAttendance,
    guestEntryQRs,
  });
  const guestEntries = useMemo(
    () => (order?.eventEntries || []).filter((entry) => entry.type === 'guest'),
    [order?.eventEntries],
  );
  const [prepared, setPrepared] = useState<Record<string, GuestEntryQRRecord | undefined>>({});
  const [claimOverrides, setClaimOverrides] = useState<Record<string, ClaimLinkOverride | undefined>>({});
  const [editingClaimEmail, setEditingClaimEmail] = useState<Record<string, string | undefined>>({});

  if (!order || guestEntries.length === 0) {
    return (
      <MissingEntry
        title="No guest entries to manage"
        description="This order does not have guest registration items that can receive individual QRs."
      />
    );
  }

  const qrFor = (entry: OrderEventEntry) => guestEntryQRs[entry.id] || prepared[entry.id] || entry.guestQR;
  const isActiveClaimLinkGuest = (entry: OrderEventEntry) => isClaimLinkGuest(entry) && !claimOverrides[entry.id]?.canceled;
  const claimEmailFor = (entry: OrderEventEntry) => claimOverrides[entry.id]?.email || entry.attendeeEmail || entry.participantName;
  const qrEligibleEntries = guestEntries.filter((entry) => !isActiveClaimLinkGuest(entry) && isGuestFormComplete(entry));

  const prepareQr = (entry: OrderEventEntry) => {
    if (isActiveClaimLinkGuest(entry) || !isGuestFormComplete(entry)) return undefined;
    const next = generateGuestEntryQR({
      orderId: order.id,
      entryId: entry.id,
      attendeeName: entry.participantName,
      eventName: entry.ticket.eventTitle,
      eventDate: entry.ticket.eventDate,
      category: entry.category,
      gate: 'Main Gate',
      buyerName: member.displayName,
    });
    setPrepared((prev) => ({ ...prev, [entry.id]: next }));
    return next;
  };

  const activeCount = qrEligibleEntries.filter((entry) => {
    const qr = qrFor(entry);
    return qr?.isActive && !qr.usedAt && !qr.claimedAt;
  }).length;
  const usedCount = qrEligibleEntries.filter((entry) => Boolean(qrFor(entry)?.usedAt)).length;
  const claimLinkCount = guestEntries.length - qrEligibleEntries.length;
  const groupClaimEntries = guestEntries.filter((entry) => entry.status !== 'attached');
  const groupShareUrl = `${window.location.origin}/order-share/${order.id}`;
  const formNeededCount = guestEntries.filter((entry) => !isActiveClaimLinkGuest(entry) && !isGuestFormComplete(entry)).length;
  const pendingCount = qrEligibleEntries.length - activeCount - usedCount;
  const cancelClaimLink = (entry: OrderEventEntry) => {
    setClaimOverrides((prev) => ({
      ...prev,
      [entry.id]: {
        ...prev[entry.id],
        canceled: true,
      },
    }));
    setEditingClaimEmail((prev) => ({ ...prev, [entry.id]: undefined }));
    toast.success('Claim link canceled', {
      description: 'This slot can now use an app-less Guest QR.',
    });
  };
  const saveClaimEmail = (entry: OrderEventEntry) => {
    const nextEmail = (editingClaimEmail[entry.id] || '').trim();
    if (!nextEmail) return;
    setClaimOverrides((prev) => ({
      ...prev,
      [entry.id]: {
        ...prev[entry.id],
        email: nextEmail,
      },
    }));
    setEditingClaimEmail((prev) => ({ ...prev, [entry.id]: undefined }));
    toast.success('Claim link resent', {
      description: `Sent to ${nextEmail}`,
    });
  };
  const shareAllClaimLinks = async () => {
    const text = `Choose your PlanOut entry for ${order.name}, then sign in or create an account to complete your registration form. ${groupShareUrl}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Choose your PlanOut entry', text, url: groupShareUrl });
      } else {
        copyText(text, 'Group claim link copied');
      }
    } catch {
      toast.error('Could not share the group claim link');
    }
  };

  return (
    <div className="relative flex flex-col gap-5 pb-8">
      <section className="overflow-hidden rounded-[20px] border border-[#0f6b5f] bg-[#0f6b5f] shadow-[0_18px_42px_-32px_rgba(15,23,42,0.75)]">
        <div className="p-4 text-white">
          <h1 className="text-[25px] font-semibold leading-tight tracking-[-0.55px]">
            Distribute guest QRs
          </h1>
          <p className="mt-2 max-w-[300px] text-[13px] font-medium leading-relaxed text-[#d7f4ee]">
            Generate app-less guest QRs and track claim-link guests from one order surface.
          </p>
        </div>

        <div className="grid grid-cols-4 border-t border-white/10 bg-white/[0.04]">
          {[
            { label: 'Guests', value: guestEntries.length },
            { label: 'Active', value: activeCount },
            { label: 'QR pending', value: pendingCount },
            { label: formNeededCount > 0 ? 'Forms' : 'Claim links', value: formNeededCount > 0 ? formNeededCount : claimLinkCount },
          ].map((item) => (
            <div key={item.label} className="border-r border-white/10 px-2 py-3 text-center last:border-r-0">
              <p className="text-[20px] font-semibold tracking-[-0.5px] text-white">{item.value}</p>
              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.7px] text-[#9fb0c1]">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 p-3">
          <PrimaryButton
            type="button"
            onClick={() => qrEligibleEntries.forEach(prepareQr)}
            fullWidth
            className="h-12 rounded-[13px] text-[14px]"
            disabled={qrEligibleEntries.length === 0}
          >
            Generate app-less guest QRs
          </PrimaryButton>
        </div>
      </section>

      <section className="rounded-[20px] border border-[#d8ddff] bg-[#f7f8ff] p-4 shadow-[0_14px_30px_-28px_rgba(15,23,42,0.45)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[14px] font-semibold text-[#312e81]">Share all claim links</p>
            <p className="mt-1 text-[12px] font-medium leading-relaxed text-[#46518f]">
              Send one link to a group chat. Each person chooses their own entry, then signs in or creates an account and completes their form.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-[#c6cdfb] bg-white px-2.5 py-1 text-[11px] font-bold text-[#4338ca]">
            {groupClaimEntries.length} link{groupClaimEntries.length === 1 ? '' : 's'}
          </span>
        </div>
        <PrimaryButton
          type="button"
          onClick={shareAllClaimLinks}
          fullWidth
          disabled={groupClaimEntries.length === 0}
          className="mt-4 h-12 rounded-[13px] text-[14px]"
        >
          <Share2 className="h-4 w-4" />
          Share to group chat
        </PrimaryButton>
        {groupClaimEntries.length === 0 && (
          <p className="mt-2 text-center text-[11px] font-medium text-[#64748b]">All individual entries in this order are already registered.</p>
        )}
      </section>

      <section className="flex flex-col gap-3">
        {guestEntries.map((entry, index) => {
          const qr = qrFor(entry);
          const claimLinkGuest = isActiveClaimLinkGuest(entry);
          const needsGuestForm = !claimLinkGuest && !isGuestFormComplete(entry);
          const claimEmail = claimEmailFor(entry);
          const editEmailValue = editingClaimEmail[entry.id];
          const publicUrl = qr ? `${window.location.origin}/guest-entry/${qr.ref}` : '';
          const claimRef = claimRefFor(qr?.ref || entry.id);
          const claimUrl = `${window.location.origin}/ticket-claim/${claimRef}`;
          const formUrl = `/orders/${entry.ticket.id}/form?returnTo=orders&entryId=${entry.id}`;
          return (
            <article key={entry.id} className="overflow-hidden rounded-[18px] border border-[#dfe7ec] bg-white shadow-[0_14px_30px_-28px_rgba(15,23,42,0.48)]">
              <div className="flex items-center justify-between border-b border-[#eef2f6] bg-[#fbfcfd] px-4 py-3">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[1px] text-[#7b8a99]">Guest slot {String(index + 1).padStart(2, '0')}</span>
                  {claimLinkGuest ? (
                  <span className="rounded-full bg-[#eef2ff] px-2.5 py-1 text-[11px] font-semibold text-[#4338ca]">Claim link sent</span>
                ) : needsGuestForm ? (
                  <span className="rounded-full bg-[#fffbeb] px-2.5 py-1 text-[11px] font-semibold text-[#92400e]">Form needed</span>
                ) : (
                  <GuestStatusPill qr={qr} />
                )}
              </div>
              <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-[16px] font-semibold tracking-[-0.25px] text-[#181d27]">{entry.participantName}</h2>
                  <p className="mt-1 text-[12px] font-medium leading-relaxed text-[#516173]">
                    {entry.ticket.eventTitle} · {entry.category}
                  </p>
                </div>
              </div>

              {claimLinkGuest ? (
                <div className="mt-4 rounded-[16px] border border-[#d8ddff] bg-[#f5f7ff] p-4">
                  <p className="text-[13px] font-semibold text-[#3431a3]">Waiting for Passport claim</p>
                  <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-[#46518f]">
                    {claimEmail} was sent a claim link. They sign in or create an account, complete the organizer form, and this entry attaches to their Passport.
                  </p>
                  {editEmailValue != null && (
                    <div className="mt-3 flex flex-col gap-2">
                      <label className="text-[11px] font-semibold text-[#3431a3]">
                        Resend claim link to
                      </label>
                      <input
                        type="email"
                        value={editEmailValue}
                        onChange={(event) => setEditingClaimEmail((prev) => ({ ...prev, [entry.id]: event.target.value }))}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') saveClaimEmail(entry);
                          if (event.key === 'Escape') setEditingClaimEmail((prev) => ({ ...prev, [entry.id]: undefined }));
                        }}
                        autoFocus
                        className="w-full rounded-[10px] border border-[#c6cdfb] bg-white px-3 py-2 text-[13px] font-medium text-[#181d27] outline-none transition-shadow placeholder:text-[#64748b] focus:border-[#7775e6] focus:ring-2 focus:ring-[#7775e6]/20"
                        placeholder="friend@example.com"
                      />
                    </div>
                  )}
                </div>
              ) : needsGuestForm ? (
                <div className="mt-4 rounded-[16px] border border-[#fde68a] bg-[#fffbeb] p-4">
                  <p className="text-[13px] font-semibold text-[#92400e]">Organizer form needed first</p>
                  <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-[#854d0e]">
                    This claim link was canceled. Fill the organizer form on behalf of this guest before generating an app-less QR.
                  </p>
                </div>
                  ) : qr ? (
                <div className="mt-4 grid gap-3 rounded-[16px] border border-[#d7e5e2] bg-[#f7fbfa] p-3 min-[390px]:grid-cols-[104px_1fr] min-[390px]:items-center">
                  <EntryQr value={qr.ref} sizeClass="w-[104px]" />
                  <div className="min-w-0">
                    <p className="font-mono text-[12px] font-semibold text-[#344054]">{qr.ref}</p>
                    <p className="mt-1 text-[12px] font-medium leading-relaxed text-[#64748b]">
                      {qr.claimedAt
                        ? 'Claimed into a Passport. This QR is permanently inactive.'
                        : qr.usedAt
                          ? `Scanned ${formatScanTime(qr.usedAt)} · still claimable once.`
                          : qr.isActive
                            ? 'Ready to share with guest. They can also claim it into a Passport once.'
                            : 'Inactive. Generate a replacement if needed.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-[16px] border border-dashed border-[#d7e5e2] bg-[#f8fbfa] p-4 text-center">
                  <p className="text-[13px] font-semibold text-[#516173]">No QR generated yet</p>
                  <p className="mt-1 text-[11px] font-medium text-[#7b8a99]">Generate when this guest is ready to receive their pass.</p>
                </div>
              )}

              {!claimLinkGuest && !needsGuestForm && (
                <div className="mt-4 rounded-[16px] border border-[#d7e5e2] bg-[#f8fbfa] p-3">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#177564]" />
                    <div>
                      <p className="text-[12px] font-bold text-[#344054]">Passport option</p>
                      <p className="mt-1 text-[11px] font-medium leading-relaxed text-[#64748b]">
                        If this friend wants this entry attached to a PlanOut account, send a claim link instead of an app-less QR.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 grid gap-2 min-[390px]:grid-cols-2">
                {claimLinkGuest ? (
                  editEmailValue != null ? (
                    <>
                      <PrimaryButton type="button" onClick={() => saveClaimEmail(entry)} compact>
                        Resend claim link
                      </PrimaryButton>
                      <SecondaryButton
                        type="button"
                        onClick={() => setEditingClaimEmail((prev) => ({ ...prev, [entry.id]: undefined }))}
                        tone="neutral"
                      >
                        Cancel
                      </SecondaryButton>
                    </>
                  ) : (
                    <>
                      <SecondaryButton type="button" onClick={() => copyText(claimUrl, 'Claim link copied')} tone="neutral">
                        <Send className="h-3.5 w-3.5" />
                        Copy claim link
                      </SecondaryButton>
                      <SecondaryButton
                        type="button"
                        onClick={() => setEditingClaimEmail((prev) => ({ ...prev, [entry.id]: claimEmail }))}
                        tone="neutral"
                      >
                        Change email
                      </SecondaryButton>
                      <button
                        type="button"
                        onClick={() => cancelClaimLink(entry)}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[12px] border border-[#fda29b] bg-[#fff1f0] px-4 text-[13px] font-bold text-[#b42318] transition-all hover:bg-[#ffe4e2] hover:border-[#f97066] active:scale-[0.98] min-[390px]:col-span-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Cancel claim link and use Guest QR
                      </button>
                    </>
                  )
                ) : needsGuestForm ? (
                  <>
                    <PrimaryButton type="button" onClick={() => navigate(formUrl)} compact>
                      Fill form & get QR
                    </PrimaryButton>
                    <SecondaryButton
                      type="button"
                      onClick={() => setClaimOverrides((prev) => ({
                        ...prev,
                        [entry.id]: {
                          ...prev[entry.id],
                          canceled: false,
                        },
                      }))}
                      tone="neutral"
                    >
                      Restore claim link
                    </SecondaryButton>
                  </>
                ) : !qr ? (
                  <>
                    <PrimaryButton type="button" onClick={() => prepareQr(entry)} compact>
                      Generate QR
                    </PrimaryButton>
                    <SecondaryButton type="button" onClick={() => copyText(claimUrl, 'Claim link copied')} tone="neutral">
                      <Send className="h-3.5 w-3.5" />
                      Claim link
                    </SecondaryButton>
                  </>
                ) : (
                  <>
                    <SecondaryButton type="button" onClick={() => navigate(`/guest-entry/${qr.ref}`)} tone="neutral">
                      Open
                    </SecondaryButton>
                    <SecondaryButton type="button" onClick={() => copyText(publicUrl, 'Guest QR link copied')} tone="neutral">
                      Copy link
                    </SecondaryButton>
                    <SecondaryButton type="button" onClick={() => copyText(claimUrl, 'Claim link copied')} tone="neutral">
                      <Send className="h-3.5 w-3.5" />
                      Claim link
                    </SecondaryButton>
                    {qr.isActive && !qr.usedAt && (
                      <>
                        <SecondaryButton type="button" onClick={() => markGuestEntryQRUsed(entry.id, 'Main Gate')} tone="neutral">
                          Mark used
                        </SecondaryButton>
                        <button
                          type="button"
                          onClick={() => revokeGuestEntryQR(entry.id)}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[12px] border border-[#fda29b] bg-[#fff1f0] px-4 text-[13px] font-bold text-[#b42318] shadow-[0_10px_22px_-18px_rgba(180,35,24,0.55)] transition-all hover:bg-[#ffe4e2] hover:border-[#f97066] active:scale-[0.98]"
                        >
                          <XCircle className="h-4 w-4" />
                          Revoke
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

export function GroupTicketSharePage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const {
    registrationQueueEntries,
    entryAttendance,
    guestEntryQRs,
  } = useAppContext();
  const order = findOrder({ orderId, registrationQueueEntries, entryAttendance, guestEntryQRs });
  const selectableEntries = (order?.eventEntries || []).filter((entry) =>
    entry.type === 'guest' && entry.status !== 'attached',
  );

  if (!order || selectableEntries.length === 0) {
    return (
      <div className="min-h-dvh bg-[#f6f8fb] px-5 pb-8 pt-[calc(18px+env(safe-area-inset-top))]">
        <main className="mx-auto flex w-full max-w-[430px] flex-col gap-5">
          <header className="flex justify-center"><div className="rounded-full border border-[#d7e5e2] bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[1.8px] text-[#177564] shadow-sm">PlanOut</div></header>
          <section className="mt-16 rounded-[22px] border border-white bg-white p-6 text-center shadow-[0_24px_54px_-40px_rgba(15,23,42,0.5)]">
            <Lock className="mx-auto h-9 w-9 text-[#94a3b8]" />
            <h1 className="mt-4 text-[23px] font-semibold tracking-[-0.5px] text-[#181d27]">No entries available</h1>
            <p className="mt-2 text-[14px] leading-relaxed text-[#64748b]">Ask the buyer to share a current group link or send your individual claim link.</p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#f6f8fb] px-5 pb-8 pt-[calc(18px+env(safe-area-inset-top))]">
      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-5">
        <header className="flex justify-center"><div className="rounded-full border border-[#d7e5e2] bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[1.8px] text-[#177564] shadow-sm">PlanOut</div></header>
        <section className="overflow-hidden rounded-[22px] border border-[#0f6b5f] bg-[#0f6b5f] shadow-[0_18px_42px_-32px_rgba(15,23,42,0.65)]">
          <div className="p-4 text-white">
            <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.6px]">Choose your entry</h1>
            <p className="mt-2 text-[13px] font-medium leading-relaxed text-[#d7f4ee]">Select the ticket meant for you. You will sign in or create an account before completing the organizer form.</p>
          </div>
          <div className="bg-white p-4"><p className="text-[14px] font-semibold text-[#181d27]">{order.name}</p><p className="mt-1 text-[12px] font-medium text-[#64748b]">Only choose your own entry. Each selection opens its individual claim link.</p></div>
        </section>
        <section className="flex flex-col gap-3">
          {selectableEntries.map((entry, index) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => navigate(`/ticket-claim/${claimRefFor(entry.id)}?order=${encodeURIComponent(order.id)}&entry=${encodeURIComponent(entry.id)}&via=group`)}
              className="flex w-full items-center justify-between gap-4 rounded-[18px] border border-[#dfe7ec] bg-white p-4 text-left shadow-[0_14px_30px_-28px_rgba(15,23,42,0.48)] transition-transform active:scale-[0.98]"
            >
              <div><p className="font-mono text-[10px] font-bold uppercase tracking-[1px] text-[#7b8a99]">Entry {String(index + 1).padStart(2, '0')}</p><p className="mt-1 text-[16px] font-semibold text-[#181d27]">{entry.category}</p><p className="mt-1 text-[12px] font-medium text-[#64748b]">Continue to registration</p></div>
              <span className="rounded-[11px] bg-[#eef7f5] px-3 py-2 text-[12px] font-bold text-[#177564]">This is mine</span>
            </button>
          ))}
        </section>
      </main>
    </div>
  );
}

export function GuestTicketClaimPage() {
  const { claimRef } = useParams<{ claimRef: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const {
    completeRegistrationEntry,
    entryAttendance,
    guestEntryQRs,
    isAuthenticated,
    registrationQueueEntries,
    setReturnTo,
  } = useAppContext();
  const orderId = searchParams.get('order') || undefined;
  const entryId = searchParams.get('entry') || undefined;
  const { entry } = findOrderEntry({ orderId, entryId, registrationQueueEntries, entryAttendance, guestEntryQRs });
  const [step, setStep] = useState<'account' | 'form' | 'done'>(isAuthenticated ? 'form' : 'account');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  const claim = {
    ref: claimRef || 'CLM-CANLAON-42K',
    eventName: entry?.ticket.eventTitle || 'Canlaon Marathon 2026',
    category: entry?.category || '42K Full Marathon',
    sharedBy: 'the buyer',
    deadline: entry?.ticket.deadline || 'June 15, 2026',
  };

  const formReady = emergencyName.trim().length > 2 && emergencyPhone.trim().length > 5;

  useEffect(() => {
    if (isAuthenticated && step === 'account') setStep('form');
  }, [isAuthenticated, step]);

  const continueToAccount = () => {
    setReturnTo(`${location.pathname}${location.search}`);
    navigate('/login');
  };

  return (
    <div className="min-h-dvh bg-[#f6f8fb] px-5 pb-8 pt-[calc(18px+env(safe-area-inset-top))]">
      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-5">
        <header className="flex items-center justify-center">
          <div className="rounded-full border border-[#d7e5e2] bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[1.8px] text-[#177564] shadow-sm">
            PlanOut
          </div>
        </header>

        <section className="overflow-hidden rounded-[22px] border border-[#0f6b5f] bg-[#0f6b5f] shadow-[0_18px_42px_-32px_rgba(15,23,42,0.65)]">
          <div className="p-4 text-white">
            <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.7px]">
              Claim your shared ticket
            </h1>
            <p className="mt-2 text-[13px] font-medium leading-relaxed text-[#d7f4ee]">
              Sign in or create a PlanOut account, complete the organizer form, then attach the entry to that Passport.
            </p>
          </div>
          <div className="bg-white p-4">
            <p className="text-[12px] font-medium leading-relaxed text-[#516173]">
              {claim.sharedBy} assigned you an entry for this event.
            </p>
            <div className="mt-3 rounded-[16px] border border-[#e2e8f0] bg-[#f8fafc] p-4">
              <p className="text-[15px] font-semibold text-[#181d27]">{claim.eventName}</p>
              <p className="mt-1 text-[12px] font-medium text-[#516173]">{claim.category} · Due {claim.deadline}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[20px] border border-[#e2e8f0] bg-white p-5 shadow-[0_10px_28px_-26px_rgba(15,23,42,0.42)]">
          <div className="mb-5 grid grid-cols-3 gap-2">
            {[
              { id: 'account', label: 'Sign in' },
              { id: 'form', label: 'Form' },
              { id: 'done', label: 'Passport' },
            ].map((item, index) => {
              const itemId = item.id as typeof step;
              const active = itemId === step;
              const complete = (step === 'form' && index === 0) || (step === 'done' && index < 2);
              return (
                <div key={item.id} className="flex flex-col gap-1.5">
                  <span className={`h-1.5 rounded-full ${active || complete ? 'bg-[#177564]' : 'bg-[#e2e8f0]'}`} />
                  <span className={`text-center text-[10px] font-bold uppercase tracking-[0.7px] ${active || complete ? 'text-[#177564]' : 'text-[#94a3b8]'}`}>{item.label}</span>
                </div>
              );
            })}
          </div>

          {step === 'account' && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-[20px] font-semibold tracking-[-0.5px] text-[#181d27]">Sign in or create account</h2>
                <p className="mt-1 text-[13px] font-medium leading-relaxed text-[#64748b]">
                  The claim link does not match accounts automatically. Continue with an existing login or create a new account; this entry will attach to whichever Passport is authenticated here.
                </p>
              </div>
              <PrimaryButton
                type="button"
                onClick={continueToAccount}
                fullWidth
                className="h-12 rounded-[14px]"
              >
                Sign in or create account
              </PrimaryButton>
            </div>
          )}

          {step === 'form' && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-[20px] font-semibold tracking-[-0.5px] text-[#181d27]">Organizer form</h2>
                <p className="mt-1 text-[13px] font-medium leading-relaxed text-[#64748b]">
                  These details attach the shared entry to the Passport for the account you just used.
                </p>
              </div>
              <FormTextField label="Emergency contact" required value={emergencyName} onChange={setEmergencyName} placeholder="Contact name" />
              <FormTextField label="Emergency phone" required value={emergencyPhone} onChange={setEmergencyPhone} placeholder="+63 917 000 0000" />
              <div className="rounded-[14px] border border-[#dbe7e4] bg-[#f8fbfa] p-3">
                <p className="text-[12px] font-semibold leading-relaxed text-[#177564]">
                  Waiver accepted for {claim.eventName}. You can review signed forms from Passport after claiming.
                </p>
              </div>
              <PrimaryButton
                type="button"
                disabled={!formReady}
                onClick={() => {
                  if (entry?.queueEntry?.id) completeRegistrationEntry(entry.queueEntry.id);
                  setStep('done');
                  toast.success('Ticket claimed', { description: `${claim.eventName} is attached to this Passport.` });
                }}
                fullWidth
                className="h-12 rounded-[14px]"
              >
                Claim ticket
              </PrimaryButton>
            </div>
          )}

          {step === 'done' && (
            <div className="flex flex-col items-center text-center">
              <CheckCircle2 className="h-12 w-12 text-[#177564]" />
              <h2 className="mt-4 text-[22px] font-semibold tracking-[-0.5px] text-[#181d27]">Ticket claimed</h2>
              <p className="mt-2 text-[13px] font-medium leading-relaxed text-[#64748b]">
                Your entry is now bound to this PlanOut Passport. Open Passport to see the universal QR.
              </p>
              <PrimaryButton type="button" onClick={() => navigate('/passport')} fullWidth className="mt-5 h-12 rounded-[14px]">
                View Passport
              </PrimaryButton>
            </div>
          )}
        </section>

        <p className="px-2 text-center text-[11px] font-medium leading-relaxed text-[#94a3b8]">
          Claim links require login or account creation before ownership moves. Guest QR links remain app-less and do not transfer ownership.
        </p>
      </main>
    </div>
  );
}
