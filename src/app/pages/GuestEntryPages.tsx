import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router';
import jsQR from 'jsqr';
import QRCode from 'qrcode';
import {
  ArrowLeft,
  Camera,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ImageUp,
  Lock,
  MapPin,
  RefreshCw,
  ScanLine,
  Send,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Ticket,
  X,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  type EntryAttendanceDecision,
  type GuestEntryQRRecord,
  getDemoGuestEntryQR,
  useAppContext,
} from '@/app/context/AppContext';
import { FormTextField } from '@/app/components/FormTextField';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { SecondaryButton } from '@/app/components/SecondaryButton';
import {
  buildOrders,
  isManagedGuestEntry,
  type OrderEventEntry,
  type OrderRecord,
} from '@/app/pages/OrdersPage';
import { type Participant, type RegistrationQueueEntry } from '@/app/data/tickets';
import { useIsMobile } from '@/app/components/ui/use-mobile';

const TICKET_EDGE_SLOTS = [
  '5%', '10.6%', '16.25%', '21.9%', '27.5%', '33.1%', '38.8%', '44.4%', '50%',
  '55.6%', '61.2%', '66.9%', '72.5%', '78.1%', '83.75%', '89.4%', '95%',
];

function EntryQr({
  value,
  sizeClass = 'w-[232px]',
}: {
  value: string;
  sizeClass?: string;
}) {
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    let mounted = true;
    QRCode.toDataURL(`${window.location.origin}/guest-entry/${encodeURIComponent(value)}`, {
      width: 720,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#0f172b', light: '#ffffff' },
    })
      .then((url) => {
        if (mounted) setDataUrl(url);
      })
      .catch(() => {
        if (mounted) setDataUrl('');
      });

    return () => {
      mounted = false;
    };
  }, [value]);

  return (
    <div className={`aspect-square ${sizeClass} rounded-[16px] bg-white p-3 shadow-[0_8px_18px_-16px_rgba(15,23,42,0.58),inset_0_0_0_1px_rgba(215,229,226,0.9)]`}>
      {dataUrl ? (
        <img src={dataUrl} alt="Guest entry QR code" className="h-full w-full rounded-[7px]" />
      ) : (
        <div className="grid h-full w-full place-items-center rounded-[7px] bg-[#f8fafc] text-[11px] font-semibold text-[#64748b]">Preparing QR</div>
      )}
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

type GuestQrScanStatus = 'starting' | 'scanning' | 'unsupported' | 'blocked' | 'processing-photo' | 'photo-empty';

function decodeGuestQr(imageData: ImageData) {
  return jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'attemptBoth',
  })?.data;
}

function decodeGuestQrPhoto(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();
    const finish = (value: string | null) => {
      URL.revokeObjectURL(imageUrl);
      resolve(value);
    };

    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, 1600 / image.naturalWidth);
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) {
          finish(null);
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        finish(decodeGuestQr(context.getImageData(0, 0, canvas.width, canvas.height)) || null);
      } catch {
        finish(null);
      }
    };
    image.onerror = () => finish(null);
    image.src = imageUrl;
  });
}

function guestQrCodeFromScan(value: string) {
  const rawValue = value.trim();
  if (!rawValue) return '';

  try {
    const parsed = new URL(rawValue, window.location.origin);
    const segments = parsed.pathname.split('/').filter(Boolean);
    const guestEntryIndex = segments.findIndex((segment) => segment.toLowerCase() === 'guest-entry');
    if (guestEntryIndex >= 0 && segments[guestEntryIndex + 1]) {
      return decodeURIComponent(segments[guestEntryIndex + 1]).trim().toUpperCase();
    }
  } catch {
    // Fall back to the raw value for QR codes that contain only the entry code.
  }

  const codeMatch = rawValue.match(/\bGE-[A-Z0-9]+(?:-[A-Z0-9]+)+\b/i);
  return (codeMatch?.[0] || rawValue).trim().toUpperCase();
}

function freshDemoGuestQrRef() {
  const suffix = crypto.randomUUID().replaceAll('-', '').slice(0, 8).toUpperCase();
  return `GE-TEMP-4021-${suffix}`;
}

function GuestQrScanner({
  onDetected,
  onClose,
  enableLiveCamera,
}: {
  onDetected: (value: string) => void;
  onClose: () => void;
  enableLiveCamera: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<GuestQrScanStatus>('starting');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  useEffect(() => {
    let disposed = false;
    let detected = false;
    let detecting = false;
    let frameId = 0;
    let cameraTimeout = 0;
    let stream: MediaStream | undefined;

    const start = async () => {
      if (!enableLiveCamera) {
        setStatus('scanning');
        return;
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('unsupported');
        return;
      }

      cameraTimeout = window.setTimeout(() => {
        if (!disposed) setStatus('blocked');
      }, 3500);

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        window.clearTimeout(cameraTimeout);
        if (disposed || !videoRef.current || !canvasRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        if (disposed) return;
        setStatus('scanning');

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) {
          setStatus('unsupported');
          return;
        }

        const scan = () => {
          if (disposed || detected) return;
          if (detecting) {
            frameId = requestAnimationFrame(scan);
            return;
          }
          detecting = true;
          const video = videoRef.current;
          if (video && video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
            const scale = Math.min(1, 720 / video.videoWidth);
            canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
            canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const rawValue = decodeGuestQr(context.getImageData(0, 0, canvas.width, canvas.height));
            if (rawValue && !detected) {
              detected = true;
              onDetected(rawValue);
            }
          }
          detecting = false;
          if (!disposed && !detected) frameId = requestAnimationFrame(scan);
        };
        frameId = requestAnimationFrame(scan);
      } catch {
        window.clearTimeout(cameraTimeout);
        if (!disposed) setStatus('blocked');
      }
    };

    start();
    return () => {
      disposed = true;
      window.clearTimeout(cameraTimeout);
      cancelAnimationFrame(frameId);
      stream?.getTracks().forEach((track) => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [enableLiveCamera, facingMode, onDetected]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setStatus('processing-photo');
    decodeGuestQrPhoto(file).then((rawValue) => {
      if (rawValue) onDetected(rawValue);
      else setStatus('photo-empty');
    });
  };

  const handleDemoScan = () => {
    setStatus('scanning');
    onDetected(`/guest-entry/${freshDemoGuestQrRef()}`);
  };

  const statusCopy = {
    starting: 'Opening camera…',
    scanning: 'Ready to scan',
    unsupported: 'Camera unavailable in this browser',
    blocked: 'Camera access is blocked',
    'processing-photo': 'Reading QR from image…',
    'photo-empty': 'No QR found in that image',
  }[status];

  const statusDetail = {
    starting: 'Preparing the scanner.',
    scanning: 'The code is recognized automatically.',
    unsupported: 'Upload a QR image instead.',
    blocked: 'Upload a QR image instead.',
    'processing-photo': 'This stays on the current device.',
    'photo-empty': 'Try another image with the full QR visible.',
  }[status];

  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden bg-black px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-[calc(12px+env(safe-area-inset-top))] text-white">
      <video ref={videoRef} muted playsInline className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-45" aria-label="Guest QR camera preview" />
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-black/45" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-28px-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-full max-w-[500px] flex-col">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close scanner"
            className="inline-flex size-11 items-center justify-center rounded-full bg-white/[0.08] text-white/90 ring-1 ring-inset ring-white/10 transition-[background-color,transform] duration-150 ease-out hover:bg-white/[0.14] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/65"
          >
            <X className="h-4 w-4" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            onClick={() => setFacingMode((mode) => mode === 'environment' ? 'user' : 'environment')}
            aria-label="Flip camera"
            className="inline-flex size-11 items-center justify-center rounded-full bg-white/[0.08] text-white/90 ring-1 ring-inset ring-white/10 transition-[background-color,transform] duration-150 ease-out hover:bg-white/[0.14] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/65"
          >
            <RefreshCw className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </div>

        <div className="mt-9 text-center">
          <h1 className="text-balance text-[26px] font-semibold leading-[1.12] tracking-[-0.022em] text-white">Scan a Guest QR</h1>
          <p className="mt-2 text-[14px] font-medium leading-5 text-white/70">Hold the QR code inside the frame.</p>
        </div>

        <div className="relative mx-auto mt-8 aspect-square w-[min(72vw,300px)] max-w-[300px] rounded-[18px] bg-white/[0.045] ring-1 ring-inset ring-white/10">
          <div className="absolute inset-[1px] rounded-[17px] bg-black/15" />
          <span className="absolute left-0 top-0 h-10 w-10 rounded-tl-[11px] border-l-[3px] border-t-[3px] border-white/80" />
          <span className="absolute right-0 top-0 h-10 w-10 rounded-tr-[11px] border-r-[3px] border-t-[3px] border-white/80" />
          <span className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-[11px] border-b-[3px] border-l-[3px] border-white/80" />
          <span className="absolute bottom-0 right-0 h-10 w-10 rounded-br-[11px] border-b-[3px] border-r-[3px] border-white/80" />
          <span className={`absolute inset-x-10 top-1/2 h-px bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.45)] transition-opacity duration-200 ${status === 'scanning' ? 'opacity-100' : 'opacity-30'}`} />
        </div>

        <div className="mt-5 min-h-12 text-center" aria-live="polite">
          <div className="inline-flex items-center gap-2 text-[14px] font-medium tracking-[0.005em] text-white/95">
            {status === 'scanning' ? <ScanLine className="h-4 w-4 text-white/90" /> : <Camera className="h-4 w-4 text-white/75" />}
            {statusCopy}
          </div>
          <p className="mt-1 text-[14px] leading-5 text-white/65">{statusDetail}</p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-1.5 pb-1 text-center">
          <p className="text-[13px] font-medium text-white/60">Have a saved QR photo?</p>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="sr-only"
            aria-label="Upload a Guest QR image"
          />
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[14px] font-semibold text-white/90 transition-[background-color,color,transform] duration-150 ease-out hover:bg-white/[0.08] hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/65"
          >
            <ImageUp className="h-4 w-4" />
            Upload QR
          </button>
          <button
            type="button"
            onClick={handleDemoScan}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[13px] font-medium text-white/60 transition-[background-color,color,transform] duration-150 ease-out hover:bg-white/[0.08] hover:text-white/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/65"
          >
            <ScanLine className="h-3.5 w-3.5" />
            Use sample QR
          </button>
        </div>
      </div>

      <style>{`@media (prefers-reduced-motion: reduce) { [class*="transition-"] { transition-duration: 0ms !important; } }`}</style>
    </section>
  );
}

function GuestQrWebEntry({
  onDetected,
  onClose,
  showLocalBack,
}: {
  onDetected: (value: string) => void;
  onClose: () => void;
  showLocalBack: boolean;
}) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoStatus, setPhotoStatus] = useState<'idle' | 'processing' | 'empty'>('idle');

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setPhotoStatus('processing');
    decodeGuestQrPhoto(file).then((rawValue) => {
      if (rawValue) onDetected(rawValue);
      else setPhotoStatus('empty');
    });
  };

  const photoStatusCopy = photoStatus === 'processing'
    ? 'Reading QR from image…'
    : photoStatus === 'empty'
      ? 'No QR found in that image. Try another photo with the full code visible.'
      : 'The image stays on this device.';

  return (
    <section className="min-h-[100dvh] bg-[#f6f8fb] px-5 pb-8 pt-[calc(16px+env(safe-area-inset-top))] text-[#181d27] sm:px-8 sm:pt-8">
      <div className="mx-auto flex min-h-[calc(100dvh-48px)] w-full max-w-[860px] flex-col">
        {showLocalBack && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Back to Passport"
            className="inline-flex min-h-11 items-center gap-2 self-start px-1 text-[13px] font-semibold text-[#516173] transition-colors hover:text-[#177564] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/25"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.1} />
            Back to Passport
          </button>
        )}

        <div className="mx-auto flex w-full max-w-[660px] flex-1 flex-col justify-center py-10">
          <p className="text-[11px] font-bold uppercase tracking-[1.2px] text-[#177564]">Passport</p>
          <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.8px] text-[#181d27] sm:text-[40px]">Add a Guest QR to Passport</h1>
          <p className="mt-3 max-w-[560px] text-[14px] font-medium leading-relaxed text-[#64748b]">
            Upload a saved QR photo. No camera access is needed on the web.
          </p>

          <div className="mt-8 max-w-[520px]">
            <section className="rounded-[22px] border border-[#cfe4df] bg-[#f8fffd] p-5 shadow-[0_20px_40px_-34px_rgba(15,23,42,0.48)]" aria-labelledby="upload-guest-qr-title">
              <div className="flex size-11 items-center justify-center rounded-[14px] bg-[#dff5ef] text-[#177564]">
                <ImageUp className="h-5 w-5" />
              </div>
              <h2 id="upload-guest-qr-title" className="mt-5 text-[18px] font-semibold tracking-[-0.25px]">Upload a QR photo</h2>
              <p className="mt-2 text-[13px] font-medium leading-relaxed text-[#64748b]">Choose an image of the Guest QR from your computer or downloads folder.</p>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="sr-only"
                aria-label="Upload a Guest QR image"
              />
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[13px] bg-[#177564] px-4 text-[14px] font-semibold text-white shadow-[0_12px_22px_-16px_rgba(23,117,100,0.72)] transition-[filter,transform] hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/30"
              >
                <ImageUp className="h-4 w-4" />
                Upload QR photo
              </button>
              <p className="mt-3 text-[12px] font-medium leading-relaxed text-[#64748b]" aria-live="polite">{photoStatusCopy}</p>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
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
  teamPlayerAccess,
  teamPlayerRoster,
}: {
  orderId?: string;
  entryId?: string;
  registrationQueueEntries: RegistrationQueueEntry[];
  entryAttendance?: Record<string, EntryAttendanceDecision | undefined>;
  guestEntryQRs?: Record<string, GuestEntryQRRecord | undefined>;
  teamPlayerAccess?: Record<string, 'pending' | 'guest_qr' | 'passport' | undefined>;
  teamPlayerRoster?: Record<string, Participant[] | undefined>;
}) {
  const orders = buildOrders({
    registrationQueueEntries,
    entryAttendance,
    guestEntryQRs,
    teamPlayerAccess,
    teamPlayerRoster,
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
  teamPlayerAccess,
  teamPlayerRoster,
}: {
  orderId?: string;
  registrationQueueEntries: RegistrationQueueEntry[];
  entryAttendance?: Record<string, EntryAttendanceDecision | undefined>;
  guestEntryQRs?: Record<string, GuestEntryQRRecord | undefined>;
  teamPlayerAccess?: Record<string, 'pending' | 'guest_qr' | 'passport' | undefined>;
  teamPlayerRoster?: Record<string, Participant[] | undefined>;
}) {
  const orders = buildOrders({
    registrationQueueEntries,
    entryAttendance,
    guestEntryQRs,
    teamPlayerAccess,
    teamPlayerRoster,
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

export function BuyerGuestQrContent({
  entry,
  orderId,
  previewState,
  initialQr,
  mode = 'page',
}: {
  entry: OrderEventEntry;
  orderId: string;
  previewState?: 'revoked';
  initialQr?: GuestEntryQRRecord;
  mode?: 'page' | 'overlay';
}) {
  const {
    generateGuestEntryQR,
    member,
  } = useAppContext();
  const isOverlay = mode === 'overlay';
  const [localQr, setLocalQr] = useState(initialQr || entry.guestQR);

  useEffect(() => {
    if (initialQr) {
      setLocalQr(initialQr);
      return;
    }
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
  }, [entry, generateGuestEntryQR, initialQr, member.displayName, orderId]);

  const qr = localQr && previewState === 'revoked'
    ? {
        ...localQr,
        isActive: false,
        revokedAt: localQr.revokedAt || '2026-06-10T08:30:00.000Z',
      }
    : localQr;

  if (!qr) {
    return (
      <div className="flex min-h-[52dvh] items-center justify-center text-[14px] font-semibold text-[#64748b]">
        Preparing Guest Entry QR...
      </div>
    );
  }

  const [ticketDate, ticketTime] = qr.eventDate.split(' at ');
  const shareUrl = `${window.location.origin}/guest-entry/${qr.ref}`;
  const shareText = `${qr.attendeeName}'s entry for ${qr.eventName} on ${qr.eventDate}. Open this link to get your entry QR. ${shareUrl}`;
  const isClaimed = Boolean(qr.claimedAt);
  const isRevoked = !qr.isActive && !isClaimed;
  const passRingClass = isClaimed
    ? 'ring-[#d8ddff]'
    : isRevoked
      ? 'ring-[#fecaca]'
      : 'ring-white/20';
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
      <div data-ticket-page-surface="white" data-qr-mode={mode} className={`relative isolate flex flex-col bg-white ${isOverlay ? 'gap-4 pb-5' : 'min-h-[calc(100dvh-5rem)] gap-5 pb-8'}`}>
      <style>{`@keyframes guest-ticket-rise { from { opacity: 0; transform: translate3d(0, 14px, 0) scale(0.985); } to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); } } .guest-ticket-entry { animation: guest-ticket-rise 260ms cubic-bezier(0.23, 1, 0.32, 1) both; } @media (prefers-reduced-motion: reduce) { .guest-ticket-entry { animation: none; } }`}</style>
      {!isOverlay && (
        <header data-testid="guest-qr-page-header" className="mx-auto w-full max-w-[360px] shrink-0 px-1 pt-6 text-center">
          <h1 className="text-[24px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#17202b]">Guest access pass</h1>
          <p className="mx-auto mt-1 max-w-[32ch] text-[13px] font-medium leading-5 text-[#64748b] [text-wrap:balance]">
            {qr.attendeeName} · {qr.eventName}
          </p>
        </header>
      )}
      <section
        data-testid="guest-qr-pass"
        aria-label="Guest QR pass"
        data-material="planout-ticket"
        data-ticket-tone="forest"
        data-ticket-finish="soft-touch"
        data-ticket-surface="single-gradient"
        data-ticket-typography="editorial-compact"
        data-ticket-entry-animation="rise"
        data-ticket-anchor="bottom"
        className={`guest-ticket-entry relative isolate mx-auto w-full max-w-[324px] overflow-hidden rounded-[14px] bg-[linear-gradient(145deg,#0b5a50_0%,#063c36_54%,#042d29_100%)] [font-kerning:normal] ring-1 ring-inset ${isOverlay ? '' : 'mt-auto'} ${passRingClass}`}
      >
        <div data-ticket-edge="postage-perforation" data-ticket-edge-density="dense" data-ticket-edge-shape="scalloped" aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
          {TICKET_EDGE_SLOTS.map((slot) => (
            <React.Fragment key={`top-bottom-${slot}`}>
              <span className="absolute -top-[7px] size-[10px] rounded-full bg-white shadow-[inset_0_-1px_2px_rgba(4,45,41,0.12)]" style={{ left: slot }} />
              <span className="absolute -bottom-[7px] size-[10px] rounded-full bg-white shadow-[inset_0_1px_2px_rgba(4,45,41,0.12)]" style={{ left: slot }} />
            </React.Fragment>
          ))}
          {TICKET_EDGE_SLOTS.map((slot) => (
            <React.Fragment key={`left-right-${slot}`}>
              <span className="absolute -left-[7px] size-[10px] rounded-full bg-white shadow-[inset_-1px_0_2px_rgba(4,45,41,0.12)]" style={{ top: slot }} />
              <span className="absolute -right-[7px] size-[10px] rounded-full bg-white shadow-[inset_1px_0_2px_rgba(4,45,41,0.12)]" style={{ top: slot }} />
            </React.Fragment>
          ))}
        </div>
        <div className="relative z-10 p-5 pb-0 text-center">
          <header className="text-center">
            <h1 data-ticket-type="attendee-name" className="mt-3 text-2xl font-semibold uppercase leading-[1.05] tracking-[0.02em] text-white [text-wrap:balance]">
              {qr.attendeeName}
            </h1>
            <p data-ticket-type="event-meta" className="mt-2 line-clamp-2 text-[0.75rem] font-medium leading-[1.4] tracking-[0.015em] text-[#b8ddd5]">
              {qr.eventName} · {entry.category}
            </p>
          </header>

          <div
            data-qr-stage="ticket-scan-area"
            className="relative mt-5 flex justify-center"
          >
            <div className="relative">
              <EntryQr value={qr.ref} sizeClass="w-[192px]" />
              {(isClaimed || isRevoked) && (
                <div className={`absolute inset-0 flex items-center justify-center rounded-[20px] ${isClaimed ? 'bg-[#4338ca]/12' : 'bg-[#7f1d1d]/18'}`}>
                  <span className={`rotate-[-12deg] rounded-[10px] border-2 bg-white/90 px-4 py-2 text-[17px] font-bold tracking-[1.8px] ${isClaimed ? 'border-[#4338ca] text-[#4338ca]' : 'border-[#b42318] text-[#b42318]'}`}>
                    {isClaimed ? 'CLAIMED' : 'REVOKED'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <p data-ticket-type="reference" className="mt-4 font-mono text-[0.625rem] font-semibold uppercase leading-none tracking-[0.12em] tabular-nums text-white/70">{qr.ref}</p>

          <div data-ticket-panel="single-surface" data-ticket-type="operational-meta" className="relative -mx-5 mt-5 px-5 pb-[18px] pt-5 text-center text-white">
            <div className="flex flex-col items-center gap-3">
              <div>
                <p data-ticket-type="event-date" className="font-sans text-[0.6875rem] font-semibold uppercase leading-[1.2] tracking-[0.1em] tabular-nums text-white/70">{ticketDate}</p>
                <p data-ticket-type="gate" className="mt-1 text-xs font-bold leading-[1.3] text-white">{ticketTime ? `${ticketTime} · ${qr.gate}` : qr.gate}</p>
              </div>
              <div data-ticket-type="validity" className="text-center">
                <p className="font-mono text-[0.5625rem] font-semibold uppercase leading-none tracking-[0.11em] text-white/50">Valid until</p>
                <p className="mt-1 whitespace-nowrap font-sans text-[0.6875rem] font-semibold uppercase leading-[1.2] tracking-[0.1em] tabular-nums text-white/85">{ticketDate}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isClaimed ? (
        <div className="rounded-[16px] bg-[#f5f7ff] p-4 text-center ring-1 ring-inset ring-[#d8ddff]">
          <CheckCircle2 className="mx-auto h-7 w-7 text-[#4338ca]" />
          <p className="mt-2 text-[15px] font-semibold text-[#312e81]">Guest QR claimed</p>
          <p className="mt-1 text-[12px] font-medium leading-relaxed text-[#46518f]">This entry now belongs to a Passport. It cannot be shared, scanned, or claimed again.</p>
        </div>
      ) : isRevoked ? (
        <div className="rounded-[16px] bg-[#fef2f2] p-4 text-center ring-1 ring-inset ring-[#fecaca]">
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
                forceNew: true,
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
        <div
          data-ticket-actions="bottom-safe"
          className="sticky bottom-0 z-30 -mx-1 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.94)_28%,#ffffff_56%)] px-1 pb-[calc(8px+env(safe-area-inset-bottom))] pt-4"
        >
          <div className="mx-auto flex w-full max-w-[360px] flex-col gap-2.5">
            <PrimaryButton
              type="button"
              onClick={shareQr}
              fullWidth
              data-testid="guest-qr-primary-action"
              className="h-12 !rounded-full text-[14px] shadow-[0_16px_26px_-18px_rgba(23,117,100,0.82)] transition-transform duration-150 ease-out hover:brightness-105 active:scale-[0.98] motion-reduce:transition-none"
            >
              <Share2 className="h-4 w-4" />
              Share Guest QR
            </PrimaryButton>
            <button
              type="button"
              data-testid="guest-qr-regenerate-action"
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
                  forceNew: true,
                });
                setLocalQr(next);
                toast.success('New Guest QR generated', { description: 'The previous QR is no longer valid.' });
              }}
              className="mx-auto inline-flex min-h-9 items-center justify-center gap-2 px-3 text-[12px] font-semibold text-[#177564] transition-colors duration-150 ease-out hover:text-[#0f5f52] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/25 motion-reduce:transition-none"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate QR
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
    teamPlayerAccess,
    teamPlayerRoster,
  } = useAppContext();
  const { order, entry } = findOrderEntry({
    orderId,
    entryId,
    registrationQueueEntries,
    entryAttendance,
    guestEntryQRs,
    teamPlayerAccess,
    teamPlayerRoster,
  });

  if (!order || !entry) return <MissingEntry />;
  return (
    <BuyerGuestQrContent
      entry={entry}
      orderId={order.id}
      previewState={searchParams.get('state') === 'revoked'
        ? 'revoked'
        : undefined}
    />
  );
}

export function PublicGuestEntryPage({ overrideQr }: { overrideQr?: GuestEntryQRRecord } = {}) {
  const { guestQRRef } = useParams<{ guestQRRef: string }>();
  const navigate = useNavigate();
  const { findGuestEntryQRByRef } = useAppContext();
  const qr = overrideQr || (guestQRRef ? findGuestEntryQRByRef(guestQRRef) || getDemoGuestEntryQR(guestQRRef) : undefined);

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
          <section className="mt-12 w-full rounded-[22px] border border-[#d5d7da] bg-white p-5 text-center shadow-[0_24px_54px_-40px_rgba(15,23,42,0.5)]">
            <CheckCircle2 className="mx-auto h-9 w-9 text-[#64748b]" />
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[1px] text-[#64748b]">Past Guest QR</p>
            <h1 className="mt-2 text-[23px] font-semibold tracking-[-0.5px] text-[#181d27]">This QR was already used</h1>
            <p className="mt-2 text-[14px] font-medium leading-relaxed text-[#64748b]">
              {qr.attendeeName} checked in at {formatScanTime(qr.usedAt)} - {qr.scanGate || qr.gate}.
            </p>
            <div className="mt-5 rounded-[16px] border border-[#e4edf0] bg-[#f8fafc] px-4 py-3">
              <p className="text-[15px] font-semibold text-[#181d27]">{qr.eventName}</p>
              <p className="mt-1 text-[12px] font-medium text-[#516173]">{qr.category} · {qr.eventDate}</p>
            </div>
            <PrimaryButton
              type="button"
              onClick={() => navigate(`/passport/add-entry?code=${encodeURIComponent(qr.ref)}`)}
              fullWidth
              className="mt-5 h-12 rounded-[13px]"
            >
              Add past event to Passport
            </PrimaryButton>
            <p className="mt-3 text-[12px] font-medium leading-relaxed text-[#64748b]">
              This keeps the check-in in your Passport history. It does not create a new gate QR.
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
                No account is needed to use this QR. If you create an account later, you can add this event to your Passport history once.
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

const PROTOTYPE_GUEST_STATES = [
  { key: 'ready', label: 'Ready to add', description: 'Eligible entry', ref: 'GE-TEMP-4021' },
  { key: 'past', label: 'Past event', description: 'Already checked in', ref: 'GE-USED-4218' },
  { key: 'added', label: 'Already saved', description: 'In Passport history', ref: 'GE-TEMP-4021' },
  { key: 'unavailable', label: 'Unavailable', description: 'Revoked QR', ref: 'GE-REVOKED-4218' },
] as const;

type PrototypeGuestState = typeof PROTOTYPE_GUEST_STATES[number]['key'];

function isPrototypeGuestState(value: string | null): value is PrototypeGuestState {
  return PROTOTYPE_GUEST_STATES.some((state) => state.key === value);
}

function getPrototypeGuestEntryQR(state: PrototypeGuestState) {
  const config = PROTOTYPE_GUEST_STATES.find((entry) => entry.key === state);
  if (!config) return undefined;

  const source = getDemoGuestEntryQR(config.ref);
  if (!source) return undefined;
  if (state !== 'added') return source;

  return {
    ...source,
    id: 'demo-GE-DEMO-ADDED',
    ref: 'GE-DEMO-ADDED',
    recipientUrl: '/guest-entry/GE-DEMO-ADDED',
    isActive: false,
    claimedAt: '2026-06-27T07:18:00.000Z',
    claimedByMemberId: 'demo-member',
  } satisfies GuestEntryQRRecord;
}

function PrototypeStateSwitcher({
  activeState,
  onChange,
}: {
  activeState: PrototypeGuestState;
  onChange: (state: PrototypeGuestState) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const activeLabel = PROTOTYPE_GUEST_STATES.find((state) => state.key === activeState)?.label || 'Ready to add';

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls="prototype-state-panel"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-[11px] border border-[#dfe8e5] bg-white px-2.5 text-[10px] font-semibold text-[#66757c] shadow-[0_3px_8px_-8px_rgba(15,23,42,0.55)] transition-[background-color,border-color,transform] duration-150 ease-out hover:border-[#c7d8d3] hover:bg-[#fbfdfc] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/30"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.9} />
        <span>Prototype</span>
        <span className="sr-only">: {activeLabel}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} strokeWidth={1.9} />
      </button>

      {isOpen && (
        <div
          id="prototype-state-panel"
          role="dialog"
          aria-label="Prototype state"
          className="absolute right-0 top-[calc(100%+8px)] z-20 w-[232px] overflow-hidden rounded-[14px] border border-[#dbe4e2] bg-white p-1.5 shadow-[0_12px_24px_-16px_rgba(15,23,42,0.28)]"
        >
          <div className="px-2.5 pb-1.5 pt-2">
            <p className="text-[11px] font-semibold text-[#35434b]">Presentation state</p>
            <p className="mt-0.5 text-[10px] leading-[1.35] text-[#849097]">Preview only · no Passport data changes</p>
          </div>
          <div className="space-y-0.5" role="radiogroup" aria-label="Choose a prototype state">
            {PROTOTYPE_GUEST_STATES.map((state) => {
              const isActive = state.key === activeState;
              return (
                <button
                  key={state.key}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => {
                    onChange(state.key);
                    setIsOpen(false);
                  }}
                  className={`flex min-h-11 w-full items-center gap-2 rounded-[11px] px-2.5 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/30 ${isActive ? 'bg-[#f0f7f5]' : 'hover:bg-[#f7f9f8]'}`}
                >
                  <span className={`grid size-6 shrink-0 place-items-center rounded-full ${isActive ? 'bg-[#d9eee9] text-[#177564]' : 'bg-[#f1f4f3] text-transparent'}`}>
                    <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-[12px] font-semibold ${isActive ? 'text-[#177564]' : 'text-[#35434b]'}`}>{state.label}</span>
                    <span className="mt-0.5 block text-[10px] text-[#849097]">{state.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function inferPrototypeGuestState(qr: GuestEntryQRRecord, claimedAlready: boolean, revoked: boolean): PrototypeGuestState {
  if (claimedAlready) return 'added';
  if (revoked) return 'unavailable';
  if (qr.usedAt) return 'past';
  return 'ready';
}

function ScannedGuestEntryState({
  qr,
  claimedAlready,
  revoked,
  prototypeState,
  onClose,
  onClaim,
  onViewPassport,
  onScanAgain,
  onPrototypeStateChange,
}: {
  qr: GuestEntryQRRecord;
  claimedAlready: boolean;
  revoked: boolean;
  prototypeState: PrototypeGuestState;
  onClose: () => void;
  onClaim: () => void;
  onViewPassport: () => void;
  onScanAgain: () => void;
  onPrototypeStateChange: (state: PrototypeGuestState) => void;
}) {
  const isPastEvent = Boolean(qr.usedAt);
  const state = claimedAlready
    ? {
        title: 'This entry is already saved',
        description: 'You have already added this guest entry to your Passport history.',
        tone: 'indigo',
      }
    : revoked
      ? {
          title: 'This entry cannot be added',
          description: 'This Guest QR was revoked before it could be added to your Passport.',
          tone: 'slate',
        }
      : {
          title: isPastEvent ? 'Add this past event' : 'Ready to add',
          description: isPastEvent
            ? 'Review the event details before bringing it into your Passport history.'
            : 'Review the event details before adding it to your Passport.',
          tone: 'teal',
        };

  const stateIconClass = state.tone === 'teal'
    ? 'bg-[#e4f4ef] text-[#177564]'
    : state.tone === 'indigo'
      ? 'bg-[#eff1ff] text-[#4b50a5]'
      : 'bg-[#eef2f4] text-[#5b6876]';

  return (
    <main className="min-h-[100dvh] bg-[#f8faf9] px-5 pb-[calc(28px+env(safe-area-inset-bottom))] pt-[calc(16px+env(safe-area-inset-top))] text-[#18212b]">
      <div className="mx-auto flex min-h-[calc(100dvh-44px-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-full max-w-[430px] flex-col">
        <header className="flex min-h-10 items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-11 items-center justify-center rounded-full text-[#465462] transition-[background-color,transform] duration-150 ease-out hover:bg-white active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/35"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
          <PrototypeStateSwitcher activeState={prototypeState} onChange={onPrototypeStateChange} />
        </header>

        <div className="mt-8 text-center">
          <div className={`mx-auto grid size-12 place-items-center rounded-[14px] ${stateIconClass}`}>
            {revoked ? <XCircle className="h-6 w-6" strokeWidth={2} /> : <CheckCircle2 className="h-6 w-6" strokeWidth={2} />}
          </div>
          <h1 className="mt-4 text-balance text-[26px] font-semibold leading-[1.12] tracking-[-0.025em] text-[#18212b]">{state.title}</h1>
          <p className="mx-auto mt-2.5 max-w-[320px] text-[14px] font-medium leading-[1.45] text-[#65747c]">{state.description}</p>
        </div>

        <section className="mt-7 overflow-hidden rounded-[16px] border border-[#e1e9e6] bg-white" aria-live="polite">
          <div className="px-5 pb-[18px] pt-[19px]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-[19px] font-semibold leading-[1.22] tracking-[-0.02em] text-[#18212b]">{qr.eventName}</h2>
                <p className="mt-1.5 text-[13px] font-medium text-[#65727d]">{qr.attendeeName} <span className="px-0.5 text-[#b0babd]">·</span> {qr.category}</p>
              </div>
              {(claimedAlready || revoked) && (
                <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${claimedAlready ? 'border-[#dfe3fb] bg-[#f4f5ff] text-[#4b50a5]' : 'border-[#e1e6e8] bg-[#f6f8f8] text-[#5b6876]'}`}>
                  {claimedAlready ? 'Added' : 'Unavailable'}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 border-t border-[#edf1ef]">
            <div className="border-r border-[#edf1ef] px-5 py-[15px]">
              <CalendarDays className="h-4 w-4 text-[#6d817d]" strokeWidth={1.8} />
              <p className="mt-2 text-[11px] font-semibold text-[#849198]">Event date</p>
              <p className="mt-1 text-[12px] font-semibold leading-[1.35] text-[#394851]">{qr.eventDate}</p>
            </div>
            <div className="px-5 py-[15px]">
              <MapPin className="h-4 w-4 text-[#6d817d]" strokeWidth={1.8} />
              <p className="mt-2 text-[11px] font-semibold text-[#849198]">Access</p>
              <p className="mt-1 text-[12px] font-semibold leading-[1.35] text-[#394851]">{qr.gate}</p>
            </div>
          </div>

          {isPastEvent && (
            <div className="border-t border-[#edf1ef] bg-[#fbfcfc] px-5 py-3.5">
              <p className="text-[12px] font-semibold text-[#465c56]">Checked in {formatScanTime(qr.usedAt)} · {qr.scanGate || qr.gate}</p>
              <p className="mt-1 text-[12px] leading-[1.45] text-[#74827f]">Adding this keeps the past event in your Passport history. It will not create a new gate QR.</p>
            </div>
          )}

          <div className="border-t border-[#edf1ef] px-5 py-3">
            <p className="font-mono text-[11px] font-semibold tracking-[0.06em] text-[#89969b]">{qr.ref}</p>
          </div>
        </section>

        <div className="mt-5">
          {claimedAlready ? (
            <PrimaryButton type="button" onClick={onViewPassport} fullWidth brandGradient={{ from: '#218875', to: '#177564', shadow: 'rgba(23,117,100,0.34)' }} className="h-[52px] rounded-[13px]">View Passport</PrimaryButton>
          ) : revoked ? (
            <SecondaryButton type="button" onClick={onClose} fullWidth tone="neutral" className="h-12 rounded-[13px]">Return to Passport</SecondaryButton>
          ) : (
            <PrimaryButton type="button" onClick={onClaim} fullWidth brandGradient={{ from: '#218875', to: '#177564', shadow: 'rgba(23,117,100,0.34)' }} className="h-[52px] rounded-[13px]">{isPastEvent ? 'Add past event to Passport' : 'Add to my Passport'}</PrimaryButton>
          )}
          <button
            type="button"
            onClick={onScanAgain}
            className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[13px] px-4 text-[13px] font-semibold text-[#56656f] transition-[background-color,color,transform] duration-150 ease-out hover:bg-white hover:text-[#33424b] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/30"
          >
            <ScanLine className="h-4 w-4 text-[#70817f]" strokeWidth={1.8} />
            Scan another Guest QR
          </button>
        </div>
      </div>
    </main>
  );
}

export function AddGuestEntryToPassportPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { claimGuestEntryQR, findGuestEntryQRByRef, isDesktop } = useAppContext();
  const submittedCode = searchParams.get('code') || '';
  const [claimed, setClaimed] = useState<GuestEntryQRRecord | null>(null);
  const isMobile = useIsMobile();
  const requestedPrototypeState = searchParams.get('demoState');
  const prototypeState = isPrototypeGuestState(requestedPrototypeState) ? requestedPrototypeState : undefined;
  const qr = submittedCode
    ? (prototypeState ? getPrototypeGuestEntryQR(prototypeState) : findGuestEntryQRByRef(submittedCode) || getDemoGuestEntryQR(submittedCode))
    : undefined;
  const handleScan = useCallback((value: string) => {
    const scannedCode = guestQrCodeFromScan(value);
    if (!scannedCode) return;

    const result = claimGuestEntryQR(scannedCode);
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

    navigate('/passport', { replace: true });
    toast.success('Entry added to Passport', { description: result.qr.eventName });
  }, [claimGuestEntryQR, navigate]);

  const handlePrototypeStateChange = (nextState: PrototypeGuestState) => {
    const config = PROTOTYPE_GUEST_STATES.find((state) => state.key === nextState);
    if (!config) return;
    const nextRef = nextState === 'added' ? 'GE-DEMO-ADDED' : config.ref;
    setClaimed(null);
    navigate(`/passport/add-entry?code=${encodeURIComponent(nextRef)}&demoState=${nextState}`, { replace: true });
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
  const isScannedState = Boolean(submittedCode && qr);
  const activePrototypeState = prototypeState || (qr ? inferPrototypeGuestState(qr, claimedAlready, revoked) : 'ready');

  if (isScannedState && qr) {
    return (
      <ScannedGuestEntryState
        qr={qr}
        claimedAlready={claimedAlready}
        revoked={revoked}
        prototypeState={activePrototypeState}
        onClose={() => navigate('/passport')}
        onClaim={claim}
        onViewPassport={() => navigate('/passport')}
        onScanAgain={() => navigate('/passport/add-entry?scan=1')}
        onPrototypeStateChange={handlePrototypeStateChange}
      />
    );
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#090f18]">
      {isMobile ? (
        <GuestQrScanner
          onDetected={handleScan}
          onClose={() => navigate('/passport')}
          enableLiveCamera={searchParams.get('live') === '1'}
        />
      ) : (
        <GuestQrWebEntry
          onDetected={handleScan}
          onClose={() => navigate('/passport')}
          showLocalBack={!isDesktop()}
        />
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
    teamPlayerAccess,
    teamPlayerRoster,
  } = useAppContext();
  const order = findOrder({
    orderId,
    registrationQueueEntries,
    entryAttendance,
    guestEntryQRs,
    teamPlayerAccess,
    teamPlayerRoster,
  });
  const guestEntries = useMemo(
    () => (order?.eventEntries || []).filter(isManagedGuestEntry),
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
          const claimUrl = `${window.location.origin}/ticket-claim/${claimRef}?order=${encodeURIComponent(order.id)}&entry=${encodeURIComponent(entry.id)}`;
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
                  <h2 className="truncate text-[16px] font-semibold tracking-[-0.25px] text-[#181d27]">{entry.participantLabel || entry.participantName}</h2>
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
                        inputMode="email"
                        autoComplete="email"
                        enterKeyHint="send"
                        aria-label="Resend claim link email"
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
    teamPlayerAccess,
    teamPlayerRoster,
  } = useAppContext();
  const order = findOrder({ orderId, registrationQueueEntries, entryAttendance, guestEntryQRs, teamPlayerAccess, teamPlayerRoster });
  const selectableEntries = (order?.eventEntries || []).filter((entry) =>
    isManagedGuestEntry(entry) && entry.status !== 'attached',
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
  const [searchParams] = useSearchParams();
  const { entryAttendance, guestEntryQRs, isAuthenticated, registrationQueueEntries, teamPlayerAccess, teamPlayerRoster } = useAppContext();
  const orderId = searchParams.get('order') || undefined;
  const entryId = searchParams.get('entry') || undefined;
  const { entry } = findOrderEntry({ orderId, entryId, registrationQueueEntries, entryAttendance, guestEntryQRs, teamPlayerAccess, teamPlayerRoster });
  if (!entry) return <Navigate to="/orders" replace />;

  const params = new URLSearchParams({
    entryId: entry.queueEntry?.id || entry.id,
    invite: '1',
  });
  if (entry.participantId) params.set('participantId', entry.participantId);
  const formPath = `/orders/${entry.ticket.id}/form?${params.toString()}`;

  return isAuthenticated
    ? <Navigate to={formPath} replace />
    : <Navigate to="/login" replace state={{ returnTo: formPath }} />;
}
