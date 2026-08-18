import React, { Suspense, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

import { type GuestEntryQRRecord, useAppContext } from '@/app/context/AppContext';
import { createPassportQrSvg } from '@/app/components/PlanOutPassportCard';
import type { OrderEventEntry } from '@/app/pages/OrdersPage';

const BuyerGuestQrContent = React.lazy(async () => {
  const module = await import('@/app/pages/GuestEntryPages');
  return { default: module.BuyerGuestQrContent };
});

export type OrderQrOverlayState =
  | {
      kind: 'guest';
      entry: OrderEventEntry;
      orderId: string;
      qr: GuestEntryQRRecord;
    }
  | {
      kind: 'passport';
    };

function PassportQrViewer() {
  const { member } = useAppContext();
  const qrDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    createPassportQrSvg(member.qrPayload, member.displayName, member.passportCode),
  )}`;

  return (
    <div className="bg-[#f7fbfa] px-5 pb-6 pt-2 sm:px-8 sm:pb-8">
      <div className="rounded-[24px] border border-[#d7e8e3] bg-white p-5 shadow-[0_28px_60px_-42px_rgba(15,23,42,0.48)] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[1.8px] text-[#71829a]">PlanOut Passport</p>
            <p className="mt-1 text-[13px] font-semibold text-[#315f57]">Universal event QR</p>
          </div>
          <span className="rounded-full bg-[#e4f4ef] px-2.5 py-1 text-[10px] font-semibold text-[#177564]">Ready</span>
        </div>

        <div className="mx-auto mt-6 flex max-w-[330px] items-center justify-center rounded-[22px] border border-[#d9ebe6] bg-[#f8fafc] p-4 shadow-[0_18px_32px_-26px_rgba(15,23,42,0.52)] sm:p-5">
          <img
            src={qrDataUrl}
            alt={`${member.displayName} Passport QR`}
            className="h-auto w-full max-w-[286px] rounded-[14px]"
          />
        </div>

        <div className="mt-5 text-center">
          <p className="text-[17px] font-semibold tracking-[-0.25px] text-[#181d27]">{member.displayName}</p>
          <p className="mt-1 font-mono text-[11px] font-bold tracking-[2px] text-[#71829a]">{member.passportCode}</p>
          <p className="mx-auto mt-3 max-w-[34ch] text-[12px] font-medium leading-relaxed text-[#64748b]">
            Show this QR at the gate. It works across your ready registrations.
          </p>
        </div>
      </div>
    </div>
  );
}

export function OrderQrOverlay({
  state,
  onClose,
}: {
  state: OrderQrOverlayState | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!state) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, state]);

  if (!state || typeof document === 'undefined') return null;

  const isGuest = state.kind === 'guest';
  const title = isGuest ? 'Guest access pass' : 'PlanOut Passport QR';
  const description = isGuest
    ? 'Show or share this app-less entry pass.'
    : 'Your universal QR for ready event registrations.';

  return createPortal(
    <div
      data-testid="order-qr-overlay"
      className="fixed inset-0 z-[140] flex items-center justify-center bg-[#172b2a]/35 p-3 backdrop-blur-[5px] sm:p-6"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-qr-overlay-title"
        className="relative flex max-h-[min(900px,calc(100dvh-1.5rem))] w-full max-w-[560px] flex-col overflow-hidden rounded-[26px] border border-white/80 bg-white shadow-[0_34px_90px_-30px_rgba(15,23,42,0.55)] sm:max-h-[calc(100dvh-3rem)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[#e5efec] bg-white px-5 py-4 sm:px-7 sm:py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[1.8px] text-[#71829a]">QR viewer</p>
            <h2 id="order-qr-overlay-title" className="mt-1 text-[21px] font-semibold tracking-[-0.4px] text-[#181d27]">{title}</h2>
            <p className="mt-1 text-[12px] font-medium text-[#64748b]">{description}</p>
          </div>
          <button
            type="button"
            aria-label="Close QR viewer"
            data-testid="order-qr-overlay-close"
            onClick={onClose}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[#d7e5e2] bg-white text-[#64748b] transition-colors hover:bg-[#f3f8f7] hover:text-[#181d27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/30"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="min-h-0 overflow-y-auto">
          {isGuest ? (
            <Suspense
              fallback={(
                <div className="grid min-h-[420px] place-items-center bg-white px-6 text-[13px] font-semibold text-[#64748b]">
                  Preparing Guest QR…
                </div>
              )}
            >
              <BuyerGuestQrContent
                entry={state.entry}
                orderId={state.orderId}
                initialQr={state.qr}
                mode="overlay"
              />
            </Suspense>
          ) : (
            <PassportQrViewer />
          )}
        </div>
      </section>
    </div>,
    document.body,
  );
}
