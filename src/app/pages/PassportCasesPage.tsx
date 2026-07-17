import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  Lock,
  Mail,
  Eye,
  Check,
  Upload,
  ClipboardList,
  ChevronRight,
  QrCode,
  X,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
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
// Wireframe Primitives
// ---------------------------------------------------------------------------

function WireframeQR({ size = 72, label = 'QR' }: { size?: number; label?: string }) {
  return (
    <div
      className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 select-none shrink-0"
      style={{ width: size, height: size }}
    >
      <QrCode className="w-5 h-5 mb-0.5" />
      <span className="text-[8px] font-bold uppercase tracking-wider">{label}</span>
    </div>
  );
}

function WireframeBadge({ text, color = 'bg-slate-100 text-slate-500' }: { text: string; color?: string }) {
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${color}`}>
      {text}
    </span>
  );
}

function WireframeBtn({ label, variant = 'primary' }: { label: string; variant?: 'primary' | 'secondary' | 'danger' | 'disabled' | 'orange' }) {
  const cls: Record<string, string> = {
    primary: 'bg-[#177564] text-white',
    secondary: 'bg-white text-slate-600 border border-slate-200',
    danger: 'bg-red-500/90 text-white',
    disabled: 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed',
    orange: 'bg-orange-600 text-white',
  };
  return (
    <div className={`inline-flex h-8 items-center justify-center gap-1 rounded-full px-4 text-[11px] font-semibold ${cls[variant]}`}>
      {label}
      {variant === 'primary' && <ChevronRight className="w-3 h-3" />}
    </div>
  );
}

function WireframeImagePlaceholder({ size = 48 }: { size?: number }) {
  return (
    <div
      className="rounded-xl bg-slate-200 shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Eye className="w-4 h-4 text-slate-400" />
    </div>
  );
}

function WireframeInput({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
      <div className="bg-slate-50 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-600 border border-slate-200 font-medium">{value}</div>
    </div>
  );
}

function LiveAppScreen({ path, title }: { path: string; title: string }) {
  const [ready, setReady] = useState(false);
  const src = `${path}${path.includes('?') ? '&' : '?'}passportCasePreview=1`;
  const frameWidth = 390;
  const frameHeight = 844;
  const frameScale = 280 / frameWidth;

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

/** Generic event row wireframe used across many cases */
function WireframeEventRow({
  eventName,
  eventDate,
  category,
  badge,
  badgeColor,
  description,
  buttons,
  faded,
  progressBar,
}: {
  eventName: string;
  eventDate: string;
  category?: string;
  badge?: string;
  badgeColor?: string;
  description?: string;
  buttons?: Array<{ label: string; variant?: 'primary' | 'secondary' | 'danger' | 'disabled' | 'orange' }>;
  faded?: boolean;
  progressBar?: { current: number; total: number };
}) {
  return (
    <div className={`rounded-[16px] border border-slate-200 bg-white p-4 ${faded ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <WireframeImagePlaceholder />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-[13px] font-semibold text-slate-800">{eventName}</h3>
              <p className="mt-0.5 text-[11px] text-slate-500">{eventDate}{category ? ` · ${category}` : ''}</p>
            </div>
            {badge && <WireframeBadge text={badge} color={badgeColor} />}
          </div>
          {progressBar && (
            <div className="mt-2.5">
              <p className="text-[11px] font-semibold text-slate-600 mb-1">
                {progressBar.current} of {progressBar.total} roster forms complete
              </p>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#177564]"
                  style={{ width: `${Math.round((progressBar.current / progressBar.total) * 100)}%` }}
                />
              </div>
            </div>
          )}
          {description && (
            <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">{description}</p>
          )}
          {buttons && buttons.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {buttons.map((b) => (
                <WireframeBtn key={b.label} label={b.label} variant={b.variant} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



// ---------------------------------------------------------------------------
// Case Item Showcase Component
// ---------------------------------------------------------------------------// ---------------------------------------------------------------------------
// Step Flow Reusable Viewports
// ---------------------------------------------------------------------------

function WF_Checkout({ eventName, category, price }: { eventName: string; category: string; price: string | number }) {
  return (
    <div className="bg-[#f8fafc] min-h-full flex flex-col p-4 justify-between font-sans text-slate-800">
      <div className="flex flex-col gap-3">
        {/* Header bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-[12px] font-bold text-slate-900">Checkout</span>
        </div>

        {/* Customer Details Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Customer Details</span>
          <div className="flex flex-col gap-1 text-[10px]">
            <div className="flex justify-between"><span className="text-slate-400 font-medium">Email:</span><span className="text-slate-800 font-semibold">jessica@email.com</span></div>
            <div className="flex justify-between"><span className="text-slate-400 font-medium">Phone:</span><span className="text-slate-800 font-semibold">0917 123 4567</span></div>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Payment Method</span>
          <div className="flex items-center justify-between border border-[#177564]/30 bg-[#ecfdf8] rounded-lg p-2 text-[10px]">
            <span className="font-semibold text-[#177564]">Credit / Debit Card</span>
            <span className="text-[8px] font-bold text-white bg-[#177564] px-1.5 py-0.5 rounded-full">Selected</span>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Order Summary</span>
          <div className="flex gap-2 items-center">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><Eye className="w-3.5 h-3.5" /></div>
            <div className="min-w-0 flex-1">
              <h4 className="text-[10px] font-bold text-slate-800 truncate">{eventName}</h4>
              <p className="text-[8px] text-slate-400 font-semibold">{category}</p>
            </div>
          </div>
          <div className="h-px bg-slate-100 my-0.5" />
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-400 font-semibold">Total Price</span>
            <span className="text-slate-900 font-extrabold">₱{price}</span>
          </div>
        </div>
      </div>

      <div className="w-full pt-3">
        <div className="bg-[#177564] text-white text-[11px] font-bold py-2 rounded-xl text-center select-none cursor-pointer flex items-center justify-center gap-1 shadow-sm">
          Pay ₱{price}
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}

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

function WF_EmailView({ subject, body }: { subject: string; body: string }) {
  const tone = getEmailTone(subject);
  const toneMeta = EMAIL_TONE_META[tone];

  return (
    <div className="min-h-full bg-[#f6f8f7] p-3 font-sans text-[#142823]">
      <article className="overflow-hidden rounded-lg bg-white shadow-[0_10px_22px_-20px_rgba(10,42,35,0.45)]">
        <div
          className="relative min-h-[132px] overflow-hidden bg-[#0d332d] bg-cover bg-center px-3 pb-4 pt-5 text-center text-white"
          style={{ backgroundImage: `url(${passportEmailCover})` }}
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#3cd4b9_0%,#28b99e_46%,#177564_100%)]" />
          <div className="relative flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/50 bg-[#0b2d28]/60">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <p className="mt-1.5 text-[11px] font-semibold tracking-[-0.025em]">PlanOut</p>
            <p className="text-[7px] font-semibold uppercase tracking-[0.19em] text-white/80">Passport access</p>
          </div>
        </div>

        <div className="bg-white p-4 text-center">
          <p className="text-[7.5px] font-semibold uppercase tracking-[0.14em] text-[#5b7870]">{toneMeta.label}</p>
          <p className="mt-2.5 text-[12px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#173a32]">{subject}</p>
          <p className="mt-2 text-[8.5px] leading-[1.55] text-[#5b716b]">{body}</p>
          <span className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-md bg-[linear-gradient(90deg,#3cd4b9_0%,#177564_100%)] py-2 text-[8.5px] font-semibold text-white">
            Open in PlanOut <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
      </article>
    </div>
  );
}

function WF_FormFillStep({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-[#f8fafc] min-h-full flex flex-col p-4 justify-between font-sans text-slate-800">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1 border-b border-slate-200 pb-2">
          <ClipboardList className="w-3.5 h-3.5 text-[#177564]" />
          <span className="text-[11px] font-bold text-slate-900 truncate">Participant Registration</span>
        </div>
        
        <div className="rounded-lg bg-teal-50 border border-teal-205 p-2 text-[8px] text-teal-800 leading-normal font-medium">
          ℹ️ <strong>Organizer-Defined Form</strong>: Fields, select options, and waivers are dynamically configured by the event organizer.
        </div>

        <h4 className="text-[11px] font-bold text-slate-800 mt-1">{title}</h4>
        
        <div className="flex flex-col gap-2 mt-0.5">
          <WireframeInput label="Organizer Custom Field 1 (e.g. Emergency Contact)" value="Maria Sanchez" />
          <WireframeInput label="Organizer Custom Field 2 (e.g. T-Shirt Size)" value="Medium" />
          
          <div className="flex flex-col gap-0.5">
            <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wide">Organizer Custom Waiver / Term</span>
            <div className="flex items-start gap-2 border border-slate-200 bg-slate-50 rounded-lg p-2">
              <input type="checkbox" checked disabled className="rounded border-slate-300 text-[#177564] mt-0.5 shrink-0" />
              <span className="text-[8px] text-slate-500 font-medium leading-normal">
                I agree to the organizer's custom terms & liability waiver statement.
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-4">
        <div className="bg-[#177564] text-white text-[11px] font-bold py-2 rounded-xl text-center select-none cursor-pointer shadow-sm">
          Submit Form
        </div>
      </div>
    </div>
  );
}

function WF_AuthStep({ desc }: { desc: string }) {
  return (
    <div className="bg-white min-h-full flex flex-col p-5 justify-between font-sans text-slate-800">
      <div className="flex flex-col gap-5 mt-4">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-[#177564] flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-black">P</span>
          </div>
          <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">Create PlanOut Account</h3>
          <p className="text-[9.5px] text-slate-500 text-center leading-normal px-2">{desc}</p>
        </div>
        
        <div className="flex flex-col gap-2.5">
          <button className="w-full h-9 rounded-xl border border-slate-200 flex items-center justify-center gap-2 text-[10.5px] font-semibold text-slate-700 bg-slate-50">
            <span className="text-[11px] font-black text-slate-500">G</span>
            Continue with Google
          </button>
          <div className="flex items-center my-0.5">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[8px] text-slate-400 px-2.5 uppercase tracking-wider">or email</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>
          <WireframeInput label="Email" value="jessica.sanchez@email.com" />
        </div>
      </div>
      <div className="w-full pt-4">
        <div className="bg-[#177564] text-white text-[11px] font-bold py-2.5 rounded-xl text-center select-none cursor-pointer shadow-sm">
          Sign Up Free
        </div>
      </div>
    </div>
  );
}

function WF_PaymentStatusStep({
  title,
  status,
  desc,
  isMultiple = false,
}: {
  title: string;
  status: 'success' | 'pending';
  desc: string;
  isMultiple?: boolean;
}) {
  const isPending = status === 'pending';

  return (
    <div className="bg-[#f8fafc] min-h-full flex flex-col p-4 gap-4 font-sans text-slate-800">
      {/* Header bar */}
      <div className="flex flex-col gap-1 border-b border-slate-200 pb-2 shrink-0">
        <span className="text-[12px] font-bold text-slate-900 leading-tight">Confirmation</span>
        <p className="text-[8.5px] text-slate-500 font-semibold leading-normal">
          Your order is tied to PlanOut Passport for event-day access.
        </p>
      </div>

      {isPending ? (
        /* Waiting for Payment State */
        <div className="flex flex-col gap-3">
          <div className="rounded-[12px] border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-3 text-center text-white">
              <h4 className="text-[11px] font-bold">Waiting for Payment</h4>
              <p className="text-[8px] text-amber-50 mt-0.5 leading-normal">
                Please complete your payment to confirm your order.
              </p>
            </div>
            <div className="p-2.5 flex items-center justify-between text-[9px] border-t border-slate-100 bg-white">
              <span className="text-slate-400 font-semibold">Ref Code</span>
              <span className="text-slate-800 font-bold font-mono">REF-4902-JK</span>
            </div>
          </div>

          {/* Reserved Items summary */}
          <div className="bg-white rounded-[12px] border border-slate-200 p-3 flex flex-col gap-2 shadow-sm">
            <div className="text-[9.5px] font-bold text-slate-700">Reserved Items</div>
            <div className="h-px bg-slate-100 my-0.5" />
            <div className="flex justify-between text-[9px] text-slate-600">
              <span>Sprint Distance Ticket</span>
              <span className="font-bold text-slate-800">₱1,200</span>
            </div>
            <div className="flex justify-between text-[9px] text-slate-650 font-bold border-t border-slate-50 pt-1.5 mt-0.5">
              <span>Total Price</span>
              <span className="text-slate-900 font-extrabold">₱1,200</span>
            </div>
          </div>

          <button className="w-full bg-[#177564] text-white text-[10.5px] font-bold py-2 rounded-xl text-center shadow-sm select-none">
            Continue to Payment
          </button>
        </div>
      ) : !isMultiple ? (
        /* Success State: Single Ticket Inline Form */
        <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col gap-3 shadow-sm">
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-100 px-2 py-0.5 text-[8px] font-bold text-amber-700 uppercase tracking-wide">
              <Lock className="w-2.5 h-2.5" />
              Form Pending
            </span>
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-slate-900 leading-tight">Complete registration</h4>
            <p className="text-[9px] text-slate-500 mt-1 leading-normal">
              Your payment was successful. Complete attendee details inline to activate Passport check-in.
            </p>
          </div>
          <div className="h-px bg-slate-100 my-0.5" />
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <WireframeInput label="First Name" value="Jessica" />
              <WireframeInput label="Last Name" value="Sanchez" />
            </div>
            <WireframeInput label="Email" value="jessica@email.com" />
            <div className="border border-dashed border-slate-200 bg-slate-50 rounded-lg p-2 text-center flex flex-col items-center">
              <span className="text-[8px] font-semibold text-slate-500">Upload medical waiver</span>
            </div>
            <button className="w-full bg-[#177564] text-white text-[10.5px] font-bold py-2 rounded-xl text-center shadow-sm mt-1">
              Submit & Activate Passport
            </button>
          </div>
        </div>
      ) : (
        /* Success State: Multiple Tickets Reserved slots */
        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col gap-2 shadow-sm">
            <h4 className="text-[13px] font-bold text-slate-900 leading-tight">Your spots are reserved</h4>
            <p className="text-[9px] text-slate-500 leading-normal">
              Complete remaining participant forms so these registrations attach to your PlanOut Passport.
            </p>
            <div className="grid grid-cols-2 gap-1.5 border-t border-slate-100 pt-2 mt-1.5 text-[8.5px] font-semibold text-slate-400 uppercase tracking-wide">
              <div>
                <p>Order Reference</p>
                <p className="text-[9.5px] text-slate-800 font-bold font-mono mt-0.5">REF-8902-JK</p>
              </div>
              <div>
                <p>Form Progress</p>
                <p className="text-[9.5px] text-amber-700 font-bold mt-0.5">0 of 3 complete</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider px-0.5">3 forms still needed</p>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col">
              {[
                { event: 'Canlaon Marathon', label: 'Finish form' },
                { event: 'VisMin Super Cup', label: 'Finish form' },
                { event: 'Apo Island Swim', label: 'Complete team form' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2.5 border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 shrink-0">
                      <ClipboardList className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-bold text-slate-800 truncate">{item.event}</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#177564] flex items-center gap-0.5 shrink-0">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
  if (!/^Case\s+(2[4-9]|3[0-4]):/i.test(caseTitle)) return null;

  const title = stepTitle.toLowerCase();
  const routeByCase = {
    solo: '/passport',
    guestManager: '/orders/tkt-008/guest-manager',
    guestQr: '/orders/tkt-010/entry/tkt-010-p2/guest-qr',
    claim: '/ticket-claim/CLM-CANLAON-42K',
    formFill: '/orders/tkt-003/form?returnTo=orders',
    temporary: '/orders/tkt-010/entry/tkt-010-p2/guest-qr',
    mixed: '/passport/events',
    teamForm: '/orders/tkt-004/form?returnTo=orders',
    groupShare: '/order-share/tkt-011',
  };

  if (title.includes('checkout') || title.includes('purchase')) return '/checkout';

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

  // Case 31 alt: Sends A Guest QR
  if (caseTitle.includes('Sends A Guest QR')) {
    if (title.includes('friend opens')) return '/guest-entry/GE-CANLAON-42K';
    return routeByCase.guestQr;
  }

  // Case 33: Coach buys team, invites roster
  if (caseTitle.includes('Coach Buys A Team')) {
    if (title.includes('invite roster') || title.includes('email')) return null; // email action, no live screen
    if (title.includes('members fill') || title.includes('member') || title.includes('fills form')) return routeByCase.teamForm;
    if (title.includes('team attaches') || title.includes('access')) return null;
    return routeByCase.teamForm;
  }

  // Group claim links — each recipient selects their own entry from the shared page.
  if (caseTitle.includes('Group Chat Claim Links')) {
    if (title.includes('open shared') || title.includes('select their entry') || title.includes('choose')) return routeByCase.groupShare;
    if (title.includes('new lead accepts') || title.includes('accepts')) return routeByCase.claim;
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
    match: 'Coach Buys A Team',
    screens: ['checkout-purchase', 'team-form', 'ticket-claim', 'passport-qr', 'team-order'],
  },
  {
    match: 'Team Lead Transfer',
    screens: ['checkout-purchase', 'team-lead-selector', 'team-lead-selected', 'team-lead-share', 'team-order'],
  },
];

function getPurchaseIntentCapture(caseTitle: string, stepIdx: number) {
  const scenario = PURCHASE_INTENT_CAPTURES.find((item) => caseTitle.includes(item.match));
  return scenario?.screens[stepIdx] ?? null;
}

function PurchaseIntentCapture({ capture, title }: { capture: string; title: string }) {
  return (
    <div className="h-[606px] w-full overflow-hidden bg-[#f6f8fb]">
      <img
        src={`${PURCHASE_INTENT_CAPTURE_BASE}/${capture}.png`}
        alt={`PlanOut app screen for ${title}`}
        className="h-full w-full object-cover object-top"
        loading="lazy"
      />
    </div>
  );
}

function getStepViewport(
  caseTitle: string,
  stepIdx: number,
  step: { title: string; desc: string },
  stepsCount: number,
  finalViewport: () => React.ReactNode
): React.ReactNode {
  const purchaseIntentCapture = getPurchaseIntentCapture(caseTitle, stepIdx);
  if (purchaseIntentCapture) {
    return <PurchaseIntentCapture capture={purchaseIntentCapture} title={step.title} />;
  }

  const purchaseIntentRoute = getPurchaseIntentStepRoute(caseTitle, step.title);
  if (purchaseIntentRoute) {
    return <LiveAppScreen title={`Live app screen - ${step.title}`} path={purchaseIntentRoute} />;
  }

  // Step 1 of timelines is usually "Checkout & Purchase"
  if (step.title === 'Checkout & Purchase') {
    let eventName = 'Canlaon Marathon 2026';
    let category = '42K Full Marathon';
    let price = 1500;
    
    if (caseTitle.includes('Team')) {
      eventName = 'Apo Island Water Swim';
      category = '4x500m Relay (Team)';
      price = 4000;
    } else if (caseTitle.includes('Pickleball') || caseTitle.includes('Multi')) {
      eventName = 'VisMin Super Cup';
      category = 'Pickleball / Basketball';
      price = 2000;
    } else if (caseTitle.includes('Aquathlon') || caseTitle.includes('Resubmit')) {
      eventName = 'Aquathlon Dumaguete 2026';
      category = 'Sprint Distance';
      price = 1200;
    }
    return <WF_Checkout eventName={eventName} category={category} price={price} />;
  }

  // Final step renders the specific custom view
  if (stepIdx === stepsCount - 1) {
    return finalViewport();
  }

  const lowerTitle = step.title.toLowerCase();
  const lowerDesc = step.desc.toLowerCase();

  // Reusable screen: Email View
  if (lowerTitle.includes('email') || lowerTitle.includes('notification') || lowerDesc.includes('email') || lowerDesc.includes('notified')) {
    return <WF_EmailView subject={step.title} body={step.desc} />;
  }

  // Reusable screen: Registration Form
  if (lowerTitle.includes('register') || lowerTitle.includes('form') || lowerTitle.includes('waiver') || lowerTitle.includes('fill') || lowerDesc.includes('form') || lowerDesc.includes('waiver')) {
    if (lowerTitle.includes('sign up') || lowerTitle.includes('account') || lowerDesc.includes('account')) {
      return <WF_AuthStep desc={step.desc} />;
    }
    return <WF_FormFillStep title={step.title} description={step.desc} />;
  }

  // Reusable screen: Payment Status
  if (lowerTitle.includes('payment') || lowerTitle.includes('created') || lowerTitle.includes('confirmed') || lowerDesc.includes('payment') || lowerDesc.includes('invoice')) {
    const isPending = lowerTitle.includes('pending') || lowerDesc.includes('pending');
    const isMultiple = caseTitle.includes('Team') || caseTitle.includes('Multi') || caseTitle.includes('Pickleball') || caseTitle.includes('Shared');
    return <WF_PaymentStatusStep title={step.title} status={isPending ? 'pending' : 'success'} desc={step.desc} isMultiple={isMultiple} />;
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
  group: 'scenario' | 'single' | 'multiple' | 'team' | 'aggregate';
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

/** Case 1: Passport Card Front */
function WF_PassportFront() {
  return (
    <div className="flex items-center justify-center p-4 min-h-full bg-[#eef7f5] font-sans">
      <div className="relative w-[230px] h-[310px] rounded-[24px] border border-[#ad885c] bg-gradient-to-b from-[#d8b68f] to-[#b28e65] shadow-lg p-2.5 overflow-hidden">
        {/* Leather stitch line */}
        <div className="absolute inset-1.5 rounded-[20px] border border-dashed border-[#8c6d48]/40 pointer-events-none" />

        {/* Metal Card Sliding Up */}
        <div className="absolute left-1/2 -translate-x-1/2 top-4 w-[190px] h-[225px] rounded-[20px] border border-white/70 bg-[linear-gradient(135deg,#fafafa_0%,#e4e4e7_25%,#a1a1aa_50%,#f4f4f5_75%,#fafafa_100%)] p-3 flex flex-col justify-between shadow-[0_12px_24px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.8)]">
          <span className="font-mono text-[6.5px] font-extrabold tracking-[1.5px] text-[#3f3f46] uppercase text-center">Universal Pass</span>
          
          <div className="mx-auto flex h-[90px] w-[90px] items-center justify-center rounded-[16px] border border-white/55 bg-white/85 shadow-sm p-2">
            <QrCode className="w-full h-full text-slate-800" />
          </div>

          <div className="text-center font-mono leading-none">
            <p className="text-[8px] font-bold uppercase tracking-[0.5px] text-slate-900">Jessica Sanchez</p>
            <p className="text-[7px] text-slate-600 tracking-[1.5px] mt-0.5">M-4019-92</p>
          </div>
        </div>

        {/* Leather Pocket Front Lip */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 h-[76px] rounded-[14px] bg-[linear-gradient(135deg,#bd9a72_0%,#9e7a52_100%)] border border-[#8a6842] shadow-[0_4px_10px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center opacity-90">
          <div className="absolute inset-1 rounded-[10px] border border-[#705230]/40 pointer-events-none" />
          <span className="text-[8px] font-black tracking-widest text-[#5c4935] uppercase">PlanOut</span>
          <span className="text-[5.5px] font-bold uppercase tracking-[2px] text-[#5c4935]/70 mt-0.5">Passport Holder</span>
        </div>
      </div>
    </div>
  );
}

/** Case 2: Passport Card Front Actions */
function WF_PassportFrontActions() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-3 bg-[#eef7f5] p-4 font-sans">
      <div className="relative h-[310px] w-[230px] overflow-hidden rounded-[24px] border border-[#ad885c] bg-gradient-to-b from-[#d8b68f] to-[#b28e65] p-2.5 shadow-lg">
        {/* Leather stitch line */}
        <div className="pointer-events-none absolute inset-1.5 rounded-[20px] border border-dashed border-[#8c6d48]/40" />

        {/* Metal Card Front */}
        <div className="absolute left-1/2 top-4 flex h-[225px] w-[190px] -translate-x-1/2 flex-col justify-between rounded-[20px] border border-white/70 bg-[linear-gradient(135deg,#fafafa_0%,#e4e4e7_25%,#a1a1aa_50%,#f4f4f5_75%,#fafafa_100%)] p-3 shadow-[0_12px_24px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.8)]">
          <span className="text-center font-mono text-[6.5px] font-extrabold uppercase tracking-[1.5px] text-[#3f3f46]">Universal Pass</span>
          
          <div className="mx-auto flex h-[90px] w-[90px] items-center justify-center rounded-[16px] border border-white/55 bg-white/85 p-2 shadow-sm">
            <QrCode className="h-full w-full text-slate-800" />
          </div>

          <div className="text-center font-mono leading-none">
            <p className="text-[8px] font-bold uppercase tracking-[0.5px] text-slate-900">Jessica Sanchez</p>
            <p className="mt-0.5 text-[7px] tracking-[1.5px] text-slate-600">M-4019-92</p>
          </div>
        </div>

        {/* Leather Pocket Front Lip */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex h-[76px] flex-col items-center justify-center rounded-[14px] border border-[#8a6842] bg-[linear-gradient(135deg,#bd9a72_0%,#9e7a52_100%)] opacity-90 shadow-[0_4px_10px_rgba(0,0,0,0.15)]">
          <div className="pointer-events-none absolute inset-1 rounded-[10px] border border-[#705230]/40" />
          <span className="text-[8px] font-black tracking-widest text-[#5c4935] uppercase">PlanOut</span>
          <span className="text-[5.5px] font-bold uppercase tracking-[2px] text-[#5c4935]/70 mt-0.5">Passport Holder</span>
        </div>
      </div>

      <div className="grid w-full grid-cols-3 gap-1.5">
        {[
          { label: 'Events', color: 'bg-slate-100 text-slate-700', badge: 2 },
          { label: 'Save', color: 'bg-slate-100 text-slate-700' },
          { label: 'Reset QR', color: 'bg-slate-100 text-slate-700' },
        ].map(({ label, color, badge }) => (
          <div key={label} className={`relative flex flex-col items-center gap-0.5 rounded-xl border border-black/5 px-1 py-2 text-center shadow-sm ${color}`}>
            <span className="text-[7px] font-extrabold leading-none">{label}</span>
            {badge && (
              <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[6px] font-black text-white">{badge}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Case 3: Inline Form Confirmation */
function WF_InlineForm() {
  return (
    <div className="bg-[#f8fafc] min-h-full flex flex-col p-4 gap-3 font-sans text-slate-800">
      {/* Top Registration Complete banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-2.5 flex items-center gap-2 shadow-sm">
        <div className="w-7 h-7 rounded-full bg-emerald-50 text-[#177564] flex items-center justify-center shrink-0">
          <Check className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h4 className="text-[10px] font-bold text-slate-800 leading-none">Order Confirmed!</h4>
          <p className="text-[8px] text-slate-400 mt-0.5 truncate">Confirmation email sent to jessica@email.com</p>
        </div>
      </div>

      {/* Inline registration form card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col gap-3 shadow-[0_8px_24px_-16px_rgba(15,23,42,0.12)]">
        <div className="flex items-center gap-1">
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[7.5px] font-extrabold text-amber-700 uppercase tracking-wide">
            <Lock className="w-2.5 h-2.5" />
            Form Pending
          </span>
        </div>
        <div>
          <h3 className="text-[12px] font-bold text-slate-900 leading-tight">Complete registration</h3>
          <p className="text-[9px] text-slate-500 mt-0.5 leading-normal">
            Fill out the attendee details below to activate your passport and attach your ticket.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="grid grid-cols-2 gap-2">
            <WireframeInput label="First Name" value="Jessica" />
            <WireframeInput label="Last Name" value="Sanchez" />
          </div>
          <WireframeInput label="Email" value="jessica@email.com" />
          <WireframeInput label="Contact" value="0917 123 4567" />
          
          <div className="flex flex-col gap-0.5">
            <span className="text-[8px] font-semibold text-slate-400 uppercase">Medical Clearance / Waiver</span>
            <div className="border border-dashed border-slate-200 bg-slate-50 rounded-xl p-3 text-center flex flex-col items-center justify-center">
              <Upload className="w-4 h-4 text-slate-400 mb-0.5" />
              <span className="text-[9px] font-bold text-[#177564]">medical_clearance_sanchez.pdf</span>
              <span className="text-[7.5px] text-slate-450 mt-0.5">Upload verified successfully</span>
            </div>
          </div>

          <div className="flex items-start gap-2 border border-slate-100 bg-slate-50 rounded-lg p-2 mt-0.5">
            <input type="checkbox" checked disabled className="rounded border-slate-300 text-[#177564] mt-0.5 shrink-0" />
            <span className="text-[8px] text-slate-500 font-medium leading-normal">
              I agree to the organizer's custom terms & liability waiver statement.
            </span>
          </div>
        </div>

        <div className="bg-[#177564] text-white text-[11px] font-bold py-2 rounded-xl text-center select-none cursor-pointer mt-1 shadow-sm">
          Submit & Activate Passport
        </div>
      </div>
    </div>
  );
}

/** Case 4: FormTaskCard — Single Entry */
function WF_FormTaskSingle() {
  return (
    <div className="p-4 bg-[#f8fafc] min-h-full flex flex-col justify-center font-sans">
      <article className="bg-white rounded-[18px] border border-slate-200 p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col gap-4">
        <div className="flex items-start gap-3.5">
          <div className="h-13 w-13 shrink-0 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200/50 shadow-inner">
            <Eye className="w-4.5 h-4.5 text-slate-400" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Single entry</span>
            <h3 className="text-[14px] font-bold text-slate-900 mt-0.5 leading-tight truncate">Canlaon Marathon 2026</h3>
            <p className="text-[12px] text-slate-500 mt-1 leading-normal">
              Complete your participant details so this event appears as ready on your Passport.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11.5px] text-slate-500 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>42K Full Marathon</span>
              <span className="text-slate-300">·</span>
              <span>Deadline June 15, 2026</span>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="bg-[#177564] text-white text-[12px] font-bold h-9 px-5 rounded-full flex items-center justify-center gap-1.5 shadow-sm select-none cursor-pointer">
            Complete form
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </article>
    </div>
  );
}

/** Case 5: Locked — Pending Payment */
function WF_PendingPayment() {
  return (
    <div className="p-4 bg-[#f8fafc] min-h-full flex flex-col justify-center font-sans">
      <article className="rounded-[18px] border border-slate-200 bg-white p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
        <div className="flex items-start gap-3">
          <div className="h-13 w-13 shrink-0 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200/50 shadow-inner">
            <Eye className="w-4.5 h-4.5 text-slate-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="truncate text-[14px] font-bold text-slate-900 leading-tight">Canlaon Marathon 2026</h2>
                <p className="mt-1 text-[11.5px] font-semibold text-slate-500 leading-relaxed">
                  June 27, 2026 - 42K Full Marathon
                </p>
              </div>
            </div>
            
            <p className="mt-3 text-[12.5px] font-medium leading-relaxed text-amber-800">
              Payment verification pending · Access ready once paid
            </p>

            <button
              type="button"
              disabled
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-100 border border-slate-200 px-4 py-2 text-[11.5px] font-bold text-slate-400 cursor-not-allowed"
            >
              Awaiting payment
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

/** Case 6: Resubmit Required */
function WF_ResubmitRequired() {
  return (
    <div className="p-4 bg-[#f8fafc] min-h-full flex flex-col justify-center font-sans">
      <article className="rounded-[18px] border border-slate-200 bg-white p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
        <div className="flex items-start gap-3">
          <div className="h-13 w-13 shrink-0 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200/50 shadow-inner">
            <Eye className="w-4.5 h-4.5 text-slate-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-[14px] font-bold text-slate-900 leading-tight">Aquathlon Dumaguete 2026</h2>
                <p className="mt-1 text-[11.5px] font-semibold text-slate-500 leading-relaxed">
                  Aug 10, 2026 - Sprint Distance
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-orange-50 px-2 py-0.5 text-[9.5px] font-bold text-orange-700 border border-orange-100">
                Form update required
              </span>
            </div>

            <p className="mt-3 text-[12.5px] font-medium leading-relaxed text-slate-500">
              Please review the updated form to keep this registration valid.
            </p>

            <button
              type="button"
              className="mt-4 inline-flex h-9 items-center justify-center rounded-full bg-orange-600 px-4.5 text-[11.5px] font-bold text-white transition-all hover:bg-orange-700 active:scale-[0.98] shadow-sm select-none"
            >
              Review form
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

/** Case 7: Attached & Ready */
function WF_AttachedReady() {
  return (
    <div className="p-4 bg-[#f8fafc] min-h-full flex flex-col justify-center font-sans">
      <article className="rounded-[18px] border border-slate-200 bg-white p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
        <div className="flex items-start gap-3">
          <div className="h-13 w-13 shrink-0 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200/50 shadow-inner">
            <Eye className="w-4.5 h-4.5 text-slate-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-[14px] font-bold text-slate-900 leading-tight">Canlaon Marathon 2026</h2>
                <p className="mt-1 text-[11.5px] font-semibold text-slate-500 leading-relaxed">
                  June 27, 2026 - 42K Full Marathon
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-[#177564] border border-emerald-100">
                Ready
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

/** Case 8: Spot Released */
function WF_SpotReleased() {
  return (
    <div className="p-4 bg-[#f8fafc] min-h-full flex flex-col justify-center font-sans">
      <article className="rounded-[18px] border border-slate-200 bg-white p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] opacity-70">
        <div className="flex items-start gap-3">
          <div className="h-13 w-13 shrink-0 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200/50 shadow-inner">
            <Eye className="w-4.5 h-4.5 text-slate-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-[14px] font-bold text-slate-500 leading-tight">Emerald Pickleball Cup</h2>
                <p className="mt-1 text-[11.5px] font-semibold text-slate-400 leading-relaxed">
                  July 5, 2026 - Singles
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-[9.5px] font-bold text-slate-500 border border-slate-200">
                Spot released
              </span>
            </div>
            
            <p className="mt-3 text-[12.5px] font-medium leading-relaxed text-slate-500">
              Form deadline was June 20, 2026. Your spot was released back to inventory. No refund issued.
            </p>

            <button
              type="button"
              className="mt-4 inline-flex h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-4.5 text-[11.5px] font-bold text-slate-650 hover:bg-slate-50 shadow-sm animate-none"
            >
              Browse event again
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

/** Case 9: Past Attended */
function WF_PastAttended() {
  return (
    <div className="p-4 bg-[#f8fafc] min-h-full flex flex-col justify-center font-sans">
      <article className="rounded-[18px] border border-slate-200 bg-white p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
        <div className="flex items-start gap-3">
          <div className="h-13 w-13 shrink-0 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200/50 shadow-inner">
            <Eye className="w-4.5 h-4.5 text-slate-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-[14px] font-bold text-slate-500 leading-tight">Negros Trail Ultra 2025</h2>
                <p className="mt-1 text-[11.5px] font-semibold text-slate-400 leading-relaxed">
                  Nov 15, 2025 - 50K Ultra
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-[9.5px] font-bold text-slate-500 border border-slate-200">
                Attended
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

/** Case 10: Past No-Show */
function WF_PastNoShow() {
  return (
    <div className="p-4 bg-[#f8fafc] min-h-full flex flex-col justify-center font-sans">
      <article className="rounded-[18px] border border-slate-200 bg-white p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
        <div className="flex items-start gap-3">
          <div className="h-13 w-13 shrink-0 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200/50 shadow-inner">
            <Eye className="w-4.5 h-4.5 text-slate-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-[14px] font-bold text-slate-500 leading-tight">Summer Fun Run 2025</h2>
                <p className="mt-1 text-[11.5px] font-semibold text-slate-400 leading-relaxed">
                  May 20, 2025 - 5K Run
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-[9.5px] font-bold text-slate-500 border border-slate-200">
                No-show
              </span>
            </div>
            <p className="mt-3 text-[12.5px] font-medium leading-relaxed text-slate-500">
              You were registered but not checked in on event day.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}


/** Case 11: Guest QR Active */
function WF_GuestQRActive() {
  return (
    <LiveAppScreen
      title="Live app screen - Guest QR active"
      path="/orders/tkt-010/entry/tkt-010-p2/guest-qr"
    />
  );
}

/** Case 12: Guest QR Used */
function WF_GuestQRUsed() {
  return (
    <LiveAppScreen
      title="Live app screen - Guest QR used"
      path="/orders/tkt-010/entry/tkt-010-p2/guest-qr?state=used"
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

/** Case 14: Guest Web Page */
function WF_PublicGuestPage() {
  return (
    <LiveAppScreen
      title="Live app screen - Public guest entry"
      path="/guest-entry/GE-CANLAON-42K"
    />
  );
}

/** Case 16: Guest Claim & Register */
function WF_GuestClaimRegister() {
  return (
    <LiveAppScreen
      title="Live app screen - Ticket claim"
      path="/ticket-claim/CLM-CANLAON-42K"
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

/** Case 17: FormTaskCard — Multiple Entries */
function WF_FormTaskMulti() {
  return (
    <div className="p-4 bg-[#f8fafc] min-h-full flex flex-col justify-center font-sans">
      <article className="bg-white rounded-[18px] border border-slate-200 p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col gap-4">
        <div className="flex items-start gap-3.5">
          <div className="h-13 w-13 shrink-0 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200/50 shadow-inner">
            <Eye className="w-4.5 h-4.5 text-slate-400" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Multiple entries</span>
            <h3 className="text-[14px] font-bold text-slate-900 mt-0.5 leading-tight truncate">VisMin Super Cup Basketball</h3>
            <p className="text-[12px] text-slate-500 mt-1 leading-normal">
              Use this when one purchase covers more than one participant. Fill forms yourself or send links.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11.5px] text-slate-500 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>2 forms needed</span>
              <span className="text-slate-300">·</span>
              <span>Deadline July 1, 2026</span>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="bg-[#177564] text-white text-[12px] font-bold h-9 px-5 rounded-full flex items-center justify-center gap-1.5 shadow-sm select-none cursor-pointer">
            Manage participant forms
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </article>
    </div>
  );
}

/** Case 18: Coach View → Roster Progress */
function WF_TeamProgress() {
  return (
    <div className="p-4 bg-[#f8fafc] min-h-full flex flex-col justify-center font-sans">
      <article className="rounded-[18px] border border-slate-200 bg-white p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="h-13 w-13 shrink-0 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200/50 shadow-inner">
            <Eye className="w-4.5 h-4.5 text-slate-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-[14px] font-bold text-slate-900 leading-tight">Apo Island Water Swim (Team)</h2>
                <p className="mt-1 text-[11.5px] font-semibold text-slate-500 leading-relaxed">
                  July 14, 2026 - 4x500m Relay
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[9.5px] font-bold text-amber-800 border border-amber-100">
                Deadline July 1, 2026
              </span>
            </div>
            
            <div className="mt-3">
              <p className="text-[11.5px] font-bold text-slate-700 mb-1">
                2 of 4 player forms complete
              </p>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#177564]"
                  style={{ width: '50%' }}
                />
              </div>
            </div>

            <button
              type="button"
              className="mt-4 inline-flex h-9 items-center justify-center rounded-full bg-[#177564] px-4.5 text-[11.5px] font-bold text-white transition-all hover:bg-[#115e50] active:scale-[0.98] shadow-sm select-none"
            >
              Complete team form
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

/** Case 19: Coach View → Roster Slots */
function WF_TeamRoster() {
  const members = [
    { name: 'Coach Marcus', role: 'Lead', status: 'attached' },
    { name: 'Jessica Sanchez', role: 'Primary', status: 'attached' },
    { name: 'Alvin Cheng', role: 'Member', status: 'attached' },
    { name: 'Ramon Diaz', role: 'Member', status: 'pending' },
    { name: '(Unassigned)', role: 'Slot 5', status: 'unassigned' },
  ];
  const colors: Record<string, string> = {
    attached: 'bg-emerald-50 text-[#177564] border-emerald-100',
    pending: 'bg-amber-50 text-amber-800 border-amber-100',
    unassigned: 'bg-slate-100 text-slate-500 border-slate-200',
  };

  return (
    <div className="p-4 bg-white min-h-full flex flex-col gap-3 font-sans text-slate-800">
      <div className="mt-1 rounded-[14px] border border-slate-100 bg-slate-50/40 p-3.5 shadow-sm">
        <div className="mb-3 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Roster Members
        </div>
        <div className="flex flex-col gap-2.5">
          {members.map((m, i) => (
            <div key={i} className="flex items-center justify-between gap-3 border-b border-slate-50 pb-2 last:border-0 last:pb-0">
              <div className="min-w-0">
                <p className="truncate text-[12.5px] font-semibold text-slate-800 leading-none">{m.name}</p>
                {m.role && (
                  <p className="mt-1 text-[9.5px] font-medium text-slate-400 leading-none">{m.role}</p>
                )}
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9.5px] font-semibold border ${colors[m.status]}`}>
                {m.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Case 20: FormTaskCard — Team Entry */
function WF_FormTaskTeam() {
  return (
    <div className="p-4 bg-[#f8fafc] min-h-full flex flex-col justify-center font-sans">
      <article className="bg-white rounded-[18px] border border-slate-200 p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col gap-4">
        <div className="flex items-start gap-3.5">
          <div className="h-13 w-13 shrink-0 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200/50 shadow-inner">
            <Eye className="w-4.5 h-4.5 text-slate-400" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Team entry</span>
            <h3 className="text-[14px] font-bold text-slate-900 mt-0.5 leading-tight truncate">Apo Island Water Swim (Team)</h3>
            <p className="text-[12px] text-slate-500 mt-1 leading-normal">
              2 roster forms still needed before this team can use Passport access.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11.5px] text-slate-500 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>2/4 complete</span>
              <span className="text-slate-300">·</span>
              <span>Deadline July 1, 2026</span>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="bg-[#177564] text-white text-[12px] font-bold h-9 px-5 rounded-full flex items-center justify-center gap-1.5 shadow-sm select-none cursor-pointer">
            Manage team form
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </article>
    </div>
  );
}

/** Case 21: Lead Transfer */
function WF_LeadTransfer() {
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

/** Purchase-intent scenario: final "where you access it" summary screen */
function WF_AccessSummary({
  surface,
  route,
  rows,
  note,
}: {
  surface: 'Orders' | 'Passport' | 'Guest web page' | 'Claim page' | 'Team' | 'Form';
  route: string;
  rows: Array<{ label: string; value: string; tone?: 'buyer' | 'recipient' | 'gate' }>;
  note?: string;
}) {
  const surfaceMeta: Record<string, { tint: string }> = {
    Orders: { tint: 'text-[#177564] bg-[#ecfdf8] border-[#177564]/25' },
    Passport: { tint: 'text-[#177564] bg-[#ecfdf8] border-[#177564]/25' },
    'Guest web page': { tint: 'text-amber-700 bg-amber-50 border-amber-200' },
    'Claim page': { tint: 'text-pink-700 bg-pink-50 border-pink-200' },
    Team: { tint: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
    Form: { tint: 'text-teal-700 bg-teal-50 border-teal-200' },
  };
  const toneMeta: Record<string, { color: string }> = {
    buyer: { color: 'bg-[#177564]' },
    recipient: { color: 'bg-pink-500' },
    gate: { color: 'bg-slate-500' },
  };
  const meta = surfaceMeta[surface];

  return (
    <div className="bg-[#f8fafc] min-h-full flex flex-col p-4 gap-3 font-sans text-slate-800">
      <div className="flex items-center border-b border-slate-200 pb-2 shrink-0">
        <span className="text-[12px] font-bold text-slate-900">Where you access this</span>
      </div>

      {/* Surface chip + route */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${meta.tint}`}>
            {surface}
          </span>
          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">entry surface</span>
        </div>
        <div className="rounded-lg bg-slate-900 px-2.5 py-1.5 font-mono text-[10px] font-semibold text-teal-300 break-all">
          {route}
        </div>
      </div>

      {/* Access rows */}
      <div className="flex flex-col gap-2">
        {rows.map((r) => {
          const tm = toneMeta[r.tone ?? 'buyer'];
          return (
            <div key={r.label} className="bg-white rounded-xl border border-slate-200 p-2.5 flex items-start gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${tm.color}`} />
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{r.label}</p>
                <p className="text-[10.5px] font-semibold text-slate-700 leading-snug mt-0.5">{r.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {note && (
        <div className="rounded-lg bg-teal-50 border border-teal-200 p-2 text-[9px] text-teal-800 leading-normal font-medium mt-auto">
          {note}
        </div>
      )}
    </div>
  );
}

const FLOWS = {
  // ===== PURCHASE-INTENT SCENARIOS (who buys / who fills / who receives) =====
  scnSolo: [
    { title: 'Checkout & Purchase', desc: 'Buyer buys one ticket for themselves and pays.' },
    { title: 'Fill own form', desc: 'Buyer completes the organizer form for themselves — inline on the confirmation, or later from Orders or the Passport Events tab.' },
    { title: 'Entry attaches', desc: 'The entry attaches to the buyer\'s own Universal Passport. No invites and no extra QRs are created.' },
    { title: 'Access at the gate', desc: 'Buyer opens the Passport tab and shows their one Universal QR. Staff scan resolves this entry.' },
  ],
  scnGroupFillAll: [
    { title: 'Open Orders', desc: 'Buyer starts from Orders after purchase and selects the order that contains their own entry plus friend slots.' },
    { title: 'Manage guest QRs', desc: 'Buyer taps Manage guest QRs on the order to open the distribution surface for all guest slots.' },
    { title: 'Choose per friend', desc: 'Buyer can generate an app-less Guest QR, or send a claim link if that friend should own the entry on their Passport.' },
    { title: 'Generate guest QRs', desc: 'For app-less friends, buyer generates and shares Guest QR links. Friends need no PlanOut account.' },
    { title: 'Send claim links', desc: 'For Passport friends, buyer sends a claim link. The friend signs in or creates an account, then the entry attaches to that Passport.' },
    { title: 'Access surfaces', desc: 'Buyer manages guest QR status from Orders. Claimed entries move to the recipient Passport.' },
  ],
  scnGroupSendFriend: [
    { title: 'Checkout & Purchase', desc: 'Buyer buys two tickets — one for themselves, one for a friend who should manage their own entry.' },
    { title: 'Fill own form', desc: 'Buyer completes their own organizer form; their entry attaches to their Passport.' },
    { title: 'Email — claim link sent', desc: 'From Orders, buyer copies the claim link and sends it to the friend via email or message. No live app screen exists for this action — it happens outside PlanOut.' },
    { title: 'Friend registers', desc: 'Friend opens the link in their browser, which lands on /ticket-claim/:claimRef. They sign in or create a PlanOut account, then complete the organizer form.' },
    { title: 'Access surfaces', desc: 'Buyer keeps their own entry on Passport; the friend\'s claimed entry attaches to the friend\'s Passport. No separate screen — outcome only.' },
  ],
  scnDependent: [
    { title: 'Checkout & Purchase', desc: 'Buyer buys a ticket for someone who will not use a PlanOut account.' },
    { title: 'Fill form on behalf', desc: 'Buyer opens Orders and completes all organizer-defined fields on the guest\'s behalf.' },
    { title: 'Generate Guest QR', desc: 'Buyer taps Generate & send QR in Orders to create the app-less Guest QR — no app, no login, no account ever required.' },
    { title: 'Print or send QR — external', desc: 'Buyer prints the Guest QR or sends the web link via SMS or messaging. No live app screen — this happens outside PlanOut.' },
    { title: 'Access surfaces — outcome', desc: 'Buyer manages the Guest QR from Orders; the guest is scanned in directly at the gate. No Passport attachment.' },
  ],
  scnMixed: [
    { title: 'Checkout & Purchase', desc: 'Buyer buys three tickets — self plus two others — in one order.' },
    { title: 'Open FormTaskCard', desc: 'On the Passport Events tab, a "Multiple entries" task card shows the slots still needing action.' },
    { title: 'Choose per slot', desc: 'Buyer picks a strategy per slot: fill own, send one friend a claim link that requires login/sign-up, send another a Guest QR with no account.' },
    { title: 'Access surfaces', desc: 'Self on the buyer\'s Passport, the invited friend on their own Passport, the guest via Guest QR — all reachable from Orders.' },
  ],
  scnGiftTransfer: [
    { title: 'Checkout & Purchase', desc: 'Buyer buys a ticket purely for a friend and is not attending themselves.' },
    { title: 'Email — form link sent', desc: 'From Orders, buyer copies the form/claim link and sends it to the friend via email or message. No live app screen — this action happens outside PlanOut.' },
    { title: 'Friend registers & fills', desc: 'Friend opens the link, signs in or creates a PlanOut account, and completes the organizer form. Lands on /ticket-claim/:claimRef.' },
    { title: 'Entry attaches — outcome', desc: 'After registration and form completion, the entry attaches to the friend\'s Passport. No separate screen — outcome only.' },
    { title: 'Organizer transfer only', desc: 'If the form had already been filled or the wrong person owns it, the buyer must contact the organizer to request a transfer.' },
  ],
  scnGiftGuestQR: [
    { title: 'Checkout & Purchase', desc: 'Buyer buys access for someone else and is not attending themselves.' },
    { title: 'Buyer fills form', desc: 'Buyer completes the organizer form on the recipient\'s behalf because the recipient will not log in or create a PlanOut account.' },
    { title: 'Generate Guest QR', desc: 'Buyer generates the same Guest QR for adult friends, children, elderly relatives, dependents, or any app-less recipient.' },
    { title: 'Share or print QR', desc: 'Buyer sends the Guest QR link or prints it for gate scanning.' },
    { title: 'Access surfaces', desc: 'Buyer tracks the Guest QR from Orders. The recipient does not get Passport ownership.' },
  ],
  scnTeam: [
    { title: 'Checkout & Purchase', desc: 'Buyer purchases one team registration with organizer-defined minimum and maximum player counts.' },
    { title: 'Add players', desc: 'Buyer adds players in the team form; there is no separate roster-management screen.' },
    { title: 'Choose access per player', desc: 'Buyer sends a claim link to account holders or completes the form and generates an app-less Guest QR.' },
    { title: 'Players resolve access', desc: 'Claim recipients attach to their own Passport; app-less recipients use their Guest QR.' },
    { title: 'Gate access', desc: 'Each player presents their own Passport or Guest QR.' },
  ],
  scnLeadTransfer: [
    { title: 'Guest QR shared', desc: 'Buyer completes the organizer form and shares an app-less Guest QR.' },
    { title: 'Guest attends or keeps code', desc: 'The QR can be presented at the gate or kept for later account creation.' },
    { title: 'Open add-entry flow', desc: 'Guest scans the QR or enters its code after signing in or creating an account.' },
    { title: 'Confirm one-time claim', desc: 'The entry is reviewed and explicitly added to that Passport.' },
    { title: 'Guest QR invalidated', desc: 'The Passport retains the entry and any prior check-in; the QR cannot be used or claimed again.' },
  ],
  cardFront: [
    { title: 'Checkout & Purchase', desc: 'User adds a single entry ticket to their cart, completes checkout, and initiates registration.' },
    { title: 'User Registers / Activates', desc: 'User completes registration. System provisions a Universal Passport.' },
    { title: 'Welcome Email Sent', desc: 'System emails a welcome message containing their unique Passport Code and offline setup instructions.' },
    { title: 'View Passport in App', desc: 'User accesses the card on their Passport tab. Shows dynamic QR code and personal stats.' },
  ],
  cardFrontActions: [
    { title: 'Checkout & Purchase', desc: 'User purchases a ticket on PlanOut and activates their Universal Passport.' },
    { title: 'Open Passport Front', desc: 'Athlete opens the Passport tab and sees the active front card with the dynamic QR.' },
    { title: 'Open Events', desc: 'Athlete taps Events from the front action row to review registrations and pending forms.' },
    { title: 'Save or Regenerate QR', desc: 'Athlete can save the Passport or regenerate the QR directly from the front actions.' },
  ],
  inlineForm: [
    { title: 'Checkout & Purchase', desc: 'User adds exactly 1 ticket to cart and starts checkout.' },
    { title: 'Payment Completes', desc: 'Single ticket payment captures successfully. Confirmation page loads.' },
    { title: 'Form Pending Warning', desc: 'Because the cart contains exactly 1 ticket, the organizer\'s dynamic registration form is embedded directly inline.' },
    { title: 'Email Sent', desc: 'A custom form pending reminder email is fired to the user\'s inbox.' },
    { title: 'Fill & Submit Inline', desc: 'User reviews prefilled name/email, completes organizer custom fields, and clicks submit.' },
  ],
  formTaskSingle: [
    { title: 'Checkout & Purchase', desc: 'User purchases a single ticket with details to be completed post-checkout.' },
    { title: 'Navigate to Passport Events', desc: 'User opens the Events Attending tab from their Passport card actions.' },
    { title: 'View FormTaskCard', desc: 'System displays a "Single entry" task card with event name, deadline, and category.' },
    { title: 'Complete Form', desc: 'User taps "Complete form" to open the participant form page.' },
  ],
  pendingPayment: [
    { title: 'Checkout & Purchase', desc: 'User completes checkout but selects offline payment (e.g. bank transfer).' },
    { title: 'Order Created', desc: 'User completes checkout but payment is not yet confirmed.' },
    { title: 'Locked State Displays', desc: 'Passport shows the event row in locked state with "Awaiting payment" disabled button.' },
    { title: 'Payment Confirms', desc: 'Once payment is verified, the row transitions to pending_form or attached status.' },
  ],
  resubmitRequired: [
    { title: 'Checkout & Purchase', desc: 'User purchases a ticket, completes participant details, and submits organizer-defined forms.' },
    { title: 'Organizer Updates Form', desc: 'Event organizer modifies the participant form requirements after initial submission.' },
    { title: 'Resubmit Notification', desc: 'System sends a notification that the form needs to be reviewed and resubmitted.' },
    { title: 'Review & Resubmit', desc: 'User taps "Review form" to open the updated form and re-sign. CTA label comes from formTaskDetails() when entryStatus is resubmit_required.' },
  ],
  attached: [
    { title: 'Checkout & Purchase', desc: 'User purchases a ticket and completes all participant details inline or post-checkout.' },
    { title: 'All Requirements Met', desc: 'Payment received, participant forms submitted, and organizer-defined requirements verified.' },
    { title: 'Ready Notification Sent', desc: 'System emails a confirmation showing all custom forms and registration details are verified.' },
    { title: 'Passport Renders Green', desc: 'Passport displays a green event card indicating "Ready" with zero pending tasks.' },
  ],
  spotReleased: [
    { title: 'Checkout & Purchase', desc: 'User purchases a ticket with post-checkout forms pending and a set deadline.' },
    { title: 'Deadline Passes', desc: 'The form submission deadline expires without the participant completing their required forms.' },
    { title: 'Spot Auto-Released', desc: 'System releases the slot back to event inventory. No refund is issued.' },
    { title: 'Notification Sent', desc: 'User is notified via email and in-app that their spot was released.' },
    { title: 'Browse Again Option', desc: 'User can browse the event to re-register if spots are still available.' },
  ],
  pastAttended: [
    { title: 'Checkout & Purchase', desc: 'User purchases ticket, completes details, payment clears, and ticket is attached.' },
    { title: 'Scanned & Authenticated', desc: 'Staff scans QR. System marks attendance status as "Attended" and logs time.' },
    { title: 'Check-In Confirmed Email', desc: 'System instantly sends check-in confirmation email with athlete bib details.' },
    { title: 'Passport Updates State', desc: 'Active ticket moves to Past Events section with a green checkmark check-in log.' },
  ],
  pastNoShow: [
    { title: 'Checkout & Purchase', desc: 'User purchases ticket, completes details, and ticket is successfully attached.' },
    { title: 'Absent on Event Day', desc: 'Registered participant does not check in at the gate before the deadline.' },
    { title: 'Database Tagged No-Show', desc: 'Unscanned tickets are tagged as "No-Show". Active QR is permanently disabled.' },
    { title: 'No-Show Alert Email', desc: 'System emails the user expressing regrets and offering options.' },
  ],
  guestActive: [
    { title: 'Checkout & Purchase', desc: 'Buyer purchases entries for others, completes checkout, and selects "No, they\'re going without me".' },
    { title: 'Separate QR Generated', desc: 'Buyer elects to send guest QR. Ticket moves to Guest Sharing management panel.' },
    { title: 'Guest Receives Link', desc: 'System emails the guest their Guest Entry QR link. Status is marked as "Active".' },
    { title: 'Manager Shows Active', desc: 'Buyer\'s Guest QR Controller shows "Active" with a one-time use warning.' },
  ],
  guestUsed: [
    { title: 'Checkout & Purchase', desc: 'Buyer purchases entries for others and generates + shares Guest QR link.' },
    { title: 'Gate Scan Complete', desc: 'Guest arrives separately, presents QR. Staff scans check-in, setting status to "Used".' },
    { title: 'Buyer Notified', desc: 'System automatically emails the buyer: "Your guest has checked in!".' },
    { title: 'Manager Shows Used', desc: 'Buyer\'s Guest QR Controller shows "Used" and the exact gate scan timestamp.' },
  ],
  guestRevoked: [
    { title: 'Checkout & Purchase', desc: 'Buyer purchases entries for others, generates Guest QR, and shares with guest.' },
    { title: 'Buyer Click Revoke', desc: 'Buyer clicks "Revoke" on the guest manager screen.' },
    { title: 'Guest Notified', desc: 'System automatically emails the guest informing them their ticket was cancelled.' },
    { title: 'Manager Shows Revoked', desc: 'Buyer\'s Guest QR Controller displays the ticket as revoked and inactive.' },
  ],
  publicGuestPage: [
    { title: 'Checkout & Purchase', desc: 'Buyer purchases entries for others, generates Guest QR, and shares link.' },
    { title: 'Open Web Viewport', desc: 'Guest clicks link, loading the public `/guest-entry` page in their mobile browser (no login required).' },
    { title: 'Check-In scanned', desc: 'Guest shows the web QR at the gate. Staff scans it, changing status in database to "Used".' },
    { title: 'Sign Up Call to Action', desc: 'Page presents a banner: "Get your own PlanOut Passport" to convert guest.' },
  ],
  guestClaimRegister: [
    { title: 'Checkout & Purchase', desc: 'Buyer purchases ticket for guest and initiates a ticket transfer via email.' },
    { title: 'Buyer Shares Ticket', desc: 'Buyer enters guest\'s email address on their Orders dashboard and triggers a share action.' },
    { title: 'Claim Email Received', desc: 'Guest receives a secure claim link. The email does not match an account automatically.' },
    { title: 'Login or Register', desc: 'Guest clicks the link, signs into an existing account or creates a new one, and completes the organizer form.' },
    { title: 'Passport Bound', desc: 'The ticket binds to the Passport for the authenticated account and appears in that account dashboard.' },
  ],
  temporaryGuestQR: [
    { title: 'Checkout & Purchase', desc: 'Buyer purchases entries for someone who will not use a PlanOut account.' },
    { title: 'Buyer Fills Form', desc: 'Buyer clicks "Fill Form on Behalf" on their Orders dashboard, completing all organizer-defined fields for the guest.' },
    { title: 'Generate Guest QR', desc: 'Buyer clicks "Generate & send QR" to instantly create a direct admission QR token.' },
    { title: 'Print or SMS link', desc: 'Buyer prints a physical QR page or sends the Guest QR web link to the guest\'s phone.' },
    { title: 'Direct gate scan', desc: 'Guest scans in directly at the venue gate; no PlanOut app or login required.' },
  ],
  multiGuestManager: [
    { title: 'Checkout & Purchase', desc: 'Buyer purchases multiple tickets for people they are not attending with — managing all entries entirely on behalf of others.' },
    { title: 'Fill All Forms', desc: 'Buyer fills organizer-defined fields for every participant slot from their Orders dashboard. No invites sent; buyer owns all data.' },
    { title: 'Individual QRs Generated', desc: 'A unique Guest Entry QR is generated per participant slot. Each QR is independently shareable and revocable from the buyer\'s panel.' },
    { title: 'Distribute QRs', desc: 'Buyer shares each QR individually via link or email — directly to each guest\'s phone. Guests open the web page with no app or account needed.' },
    { title: 'Multi-Guest Manager', desc: 'Buyer\'s Guest Entry Manager shows all participant QR statuses (Active, Used, Revoked) with per-person share and revoke controls.' },
  ],
  formTaskMulti: [
    { title: 'Checkout & Purchase', desc: 'Buyer purchases tickets covering multiple participants in a single order.' },
    { title: 'View FormTaskCard', desc: 'System shows a "Multiple entries" task card with the count of forms still needed.' },
    { title: 'Manage Forms', desc: 'User taps "Manage participant forms" to fill forms themselves or send invite links.' },
  ],
  teamProgress: [
    { title: 'Checkout & Purchase', desc: 'Captain/Coach selects a team package, completes payment, and starts checkout.' },
    { title: 'Team Package Purchased', desc: 'Captain/Coach registers a team. Slots are reserved but locked until roster details are complete.' },
    { title: 'Monitor Progress Bar', desc: 'Captain Passport displays a live progress dashboard showing completed vs pending roster slots.' },
    { title: 'Team QR Unlocks', desc: 'Once all slots are Claimed & forms completed, the team ticket transitions to "Ready" status.' },
  ],
  teamRosterList: [
    { title: 'Checkout & Purchase', desc: 'Coach purchases a team package and opens the team dashboard.' },
    { title: 'Invite Roster Members', desc: 'Captain inputs member emails in the Roster Panel. System sends an email invite to each member.' },
    { title: 'Invitees Complete Forms', desc: 'Invitees receive email, click link, and fill out the custom registration forms configured by the organizer.' },
    { title: 'Roster Updates Live', desc: 'Roster list displays checkmarks next to claim slots as custom forms are completed.' },
  ],
  formTaskTeam: [
    { title: 'Checkout & Purchase', desc: 'Team captain purchases a team package with details to be completed post-checkout.' },
    { title: 'Navigate to Passport Events', desc: 'Team captain opens the Events Attending tab.' },
    { title: 'View FormTaskCard', desc: 'System shows a "Team entry" task card with roster completion count and deadline.' },
    { title: 'Manage Team Form', desc: 'Captain taps "Manage team form" to view roster, send invites, or fill forms.' },
  ],
  groupShare: [
    { title: 'Buyer shares once', desc: 'Buyer sends a group link containing the available individual claim links.' },
    { title: 'Recipient chooses entry', desc: 'Each recipient selects the entry intended for them.' },
    { title: 'Login or Register', desc: 'Recipient signs in or creates an account, then continues directly to the organizer form.' },
    { title: 'Entry attached', desc: 'Submitting the form attaches the individual entry to that Passport.' },
  ],
  eventsOverview: [
    { title: 'Checkout & Purchase', desc: 'Athlete registers/purchases entries for multiple events on PlanOut.' },
    { title: 'Open Events Attending', desc: 'User taps "Events" from the Passport front actions to see all registrations.' },
    { title: 'View Pages', desc: 'Page shows 4 sections: Forms needed, Ready for access, Status updates, Past events.' },
    { title: 'Act on Entries', desc: 'User can complete forms, browse released events, or review past attendance records.' },
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
    subject: 'Join the Apo Island team roster',
    toName: 'Daniel Vance',
    toEmail: 'daniel@email.com',
    headline: 'You have been added to a team roster',
    paragraphs: [
      'Coach Marcus added you as a participant for Apo Island Water Swim.',
      'Accept the roster invitation, verify your details, and complete the organizer form to activate your team entry.',
      'After completion, the team access will resolve through your PlanOut Passport.',
    ],
    details: {
      'Team': 'Apo Island Water Swim',
      'Team Captain': 'Coach Marcus',
      'Category': '4x500m Relay',
      'Form Deadline': 'July 1, 2026',
    },
    ctaText: 'Accept Invite & Complete Form',
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
      subtitle: 'The simplest case. One person buys one ticket, fills their own organizer form, and attends. The entry attaches to their own Universal Passport — no invites and no separate QRs. Screen states: see Cases 1–7.',
      timelineSteps: FLOWS.scnSolo,
      emailTemplates: [EMAIL_CATALOG.welcome],
      accessPath: {
        origin: 'Passport tab (also reachable from Orders)',
        route: '/passport',
        backTarget: 'Home',
        steps: [
          'Buyer completes checkout and fills their own form (inline, or later).',
          'Buyer opens the Passport tab from the bottom navigation.',
          'The entry shows on their Universal Passport once the form is complete.',
          'At the gate the buyer shows their one Universal Passport QR.',
        ],
      },
      renderViewport: () => (
        <WF_AccessSummary
          surface="Passport"
          route="/passport"
          rows={[
            { label: 'Buyer', value: 'Fills own form; entry attaches to their Universal Passport.', tone: 'buyer' },
            { label: 'Gate QR', value: "Buyer's Universal Passport QR.", tone: 'gate' },
          ]}
          note="Also reachable from Orders → the ticket, or Passport → Events."
        />
      ),
    },
    {
      group: 'scenario',
      badgeText: 'Group · Fills all',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      title: 'Case 25: Buyer Buys For Self + Friends, Fills Every Form',
      subtitle: 'Buyer buys several tickets and completes every participant form themselves. Their own entry sits on their Passport; each friend can either receive an app-less Guest QR or a claim link if they should add the entry to their own Passport. Screen states: see Case 23.',
      timelineSteps: FLOWS.scnGroupFillAll,
      emailTemplates: [EMAIL_CATALOG.guestLink, EMAIL_CATALOG.guestClaim],
      accessPath: {
        origin: 'Orders → order-level Manage guest QRs',
        route: '/orders/:orderId/guest-manager',
        backTarget: 'Orders list or order detail',
        steps: [
          'Buyer opens Orders after purchase and selects the matching multi-entry order.',
          'Buyer taps Manage guest QRs on the order.',
          'For each friend, buyer either generates a Guest QR or copies a claim link.',
          'Guest QR friends show the web QR; claim-link friends sign in or create an account so the entry lands on their Passport.',
        ],
      },
      renderViewport: () => (
        <WF_AccessSummary
          surface="Orders"
          route="/orders/:orderId/guest-manager"
          rows={[
            { label: 'Buyer', value: 'Fills all forms; chooses Guest QR or claim link per friend from Orders.', tone: 'buyer' },
            { label: 'Friends', value: 'Guest QR = no account. Claim link = sign in/create account and attach to Passport.', tone: 'recipient' },
            { label: 'Gate QR', value: 'Guest QR friends show web QR. Claimed friends show Passport QR.', tone: 'gate' },
          ]}
        />
      ),
    },
    {
      group: 'scenario',
      badgeText: 'Group · Claim Form',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      title: 'Case 26: Buyer Fills Own, Sends The Form To A Friend',
      subtitle: 'Buyer completes their own form, then sends the friend a claim/register link for the friend\'s slot. The friend signs in or creates a PlanOut account, fills the organizer form, and the entry attaches to their own Passport. Screen states: see Case 15.',
      timelineSteps: FLOWS.scnGroupSendFriend,
      emailTemplates: [EMAIL_CATALOG.guestClaim],
      accessPath: {
        origin: 'Orders → send form / claim link',
        route: '/ticket-claim/:claimRef',
        backTarget: 'Order detail or claim email',
        steps: [
          'Buyer completes their own form (entry on their Passport).',
          'Buyer opens Orders and sends the friend a claim/register link.',
          'Friend opens the link, signs in or creates a PlanOut account, and fills the organizer form.',
          'The friend shows their own Passport QR at the gate.',
        ],
      },
      renderViewport: () => (
        <WF_AccessSummary
          surface="Passport"
          route="/ticket-claim/:claimRef"
          rows={[
            { label: 'Buyer', value: 'Own entry on Passport; sends the friend a form/claim link from Orders.', tone: 'buyer' },
            { label: 'Friend', value: 'Signs in or creates an account, fills the form, and receives the entry on Passport.', tone: 'recipient' },
            { label: 'Gate QR', value: 'Buyer: Passport QR · Friend: Passport QR.', tone: 'gate' },
          ]}
        />
      ),
    },
    {
      group: 'scenario',
      badgeText: 'Guest QR',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'Case 28: Buyer Buys For A Dependent (Child / Elderly, No Account)',
      subtitle: 'For a participant who will not use a PlanOut account. The buyer fills every field on their behalf and generates a Guest QR — no app, no login, no Passport attachment. Screen states: see Case 16.',
      timelineSteps: FLOWS.scnDependent,
      emailTemplates: [EMAIL_CATALOG.temporaryQR],
      accessPath: {
        origin: 'Orders → order → Guest QR action',
        route: '/orders/:orderId/entry/:entryId/guest-qr',
        backTarget: 'Order detail',
        steps: [
          'Buyer fills the required forms on behalf of the guest.',
          'Buyer opens Orders and taps Generate & send QR on the guest row.',
          'Buyer prints the Guest QR or sends the web link to a phone.',
          'The guest is scanned in directly at the gate.',
        ],
      },
      renderViewport: () => (
        <WF_AccessSummary
          surface="Orders"
          route="/orders/:orderId/entry/:entryId/guest-qr"
          rows={[
            { label: 'Buyer', value: 'Fills form on behalf; manages the Guest QR from Orders.', tone: 'buyer' },
            { label: 'Guest', value: 'No account ever — carries the printed or web Guest QR.', tone: 'recipient' },
            { label: 'Gate QR', value: 'Scanned in directly via the Guest QR.', tone: 'gate' },
          ]}
        />
      ),
    },
    {
      group: 'scenario',
      badgeText: 'Group · Mixed',
      badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      title: 'Case 29: Mixed Order — Self + Invite + Guest QR',
      subtitle: 'The realistic family-and-friends order: one purchase, several slots, a different strategy per slot. Buyer fills their own, invites one friend to claim (account), and sends another a Guest QR (no account). Screen states: see Case 17.',
      timelineSteps: FLOWS.scnMixed,
      emailTemplates: [],
      accessPath: {
        origin: 'Passport → Events → participant form',
        route: '/passport/events → /orders/:ticketId/form',
        backTarget: 'Passport Events',
        steps: [
          'Buyer opens the Passport Events tab and finds the Multiple-entries task card.',
          'Buyer opens the participant form for the order.',
          'Per slot, buyer fills own, invites a friend to claim, or sends a Guest QR.',
          'Each slot then resolves on the right surface (Passport or Guest QR).',
        ],
      },
      renderViewport: () => (
        <WF_AccessSummary
          surface="Passport"
          route="/passport/events → /orders/:ticketId/form"
          rows={[
            { label: 'Buyer', value: 'Self on own Passport; picks invite or Guest QR per other slot.', tone: 'buyer' },
            { label: 'Others', value: 'Invited friend: own Passport · Guest: web QR.', tone: 'recipient' },
            { label: 'Gate QR', value: 'Mixed — Passport QRs and Guest QRs together.', tone: 'gate' },
          ]}
        />
      ),
    },
    {
      group: 'scenario',
      badgeText: 'Gift · Form Link',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'Case 30: Buyer Does Not Attend — Sends Form To Friend',
      subtitle: 'Buyer purchases purely as a gift and is not attending, but the participant form is still unfilled. The buyer sends the form link to the friend; the friend logs in or creates an account, completes the organizer form, and the entry attaches to that Passport. This is not a buyer-side transfer. If the form was already filled or ownership needs to change later, only the organizer can handle that transfer when contacted. Screen states: use the current form fill-up screen.',
      timelineSteps: FLOWS.scnGiftTransfer,
      emailTemplates: [EMAIL_CATALOG.guestClaim],
      accessPath: {
        origin: 'Orders → send form link',
        route: '/orders/:ticketId/form',
        backTarget: 'Orders list',
        steps: [
          'Buyer opens Orders while the participant form is still unfilled.',
          'Buyer sends the form link to the friend.',
          'Friend logs in or creates an account and completes the organizer form.',
          'Entry attaches to the friend\'s Passport after the form is submitted.',
        ],
      },
      renderViewport: () => (
        <WF_AccessSummary
          surface="Form"
          route="/orders/:ticketId/form"
          rows={[
            { label: 'Buyer', value: 'Not attending; sends the unfilled organizer form link from Orders.', tone: 'buyer' },
            { label: 'Friend', value: 'Logs in or creates account, fills the form, and receives the entry on Passport.', tone: 'recipient' },
            { label: 'Gate QR', value: 'Friend shows their own Passport QR.', tone: 'gate' },
          ]}
        />
      ),
    },
    {
      group: 'scenario',
      badgeText: 'Gift · App-less',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      title: 'Case 31: Buyer Does Not Attend — Fills Form & Sends App-less Pass',
      subtitle: 'Buyer buys access for someone else who will not use a PlanOut account. Because the recipient is not logging in, the buyer must complete the organizer form on their behalf first, then send a Guest QR. Adult friends, children, elderly relatives, and dependents all use the same app-less Guest QR. The pass stays managed from the buyer\'s Orders and does not attach to the recipient\'s Passport. Screen states: see Cases 11–16.',
      timelineSteps: FLOWS.scnGiftGuestQR,
      emailTemplates: [EMAIL_CATALOG.guestLink, EMAIL_CATALOG.temporaryQR],
      accessPath: {
        origin: 'Orders → order → Guest QR',
        route: '/orders/:orderId/entry/:entryId/guest-qr',
        backTarget: 'Order detail',
        steps: [
          'Buyer opens Orders and completes the organizer form on behalf of the recipient.',
          'Buyer generates a Guest QR for the filled slot.',
          'Recipient opens the Guest QR link or printout — no account.',
          'Recipient shows the web QR at the gate; buyer tracks its state in Orders.',
        ],
      },
      renderViewport: () => (
        <WF_AccessSummary
          surface="Orders"
          route="/orders/:orderId/entry/:entryId/app-less-pass"
          rows={[
            { label: 'Buyer', value: 'Not attending; fills the organizer form on behalf of the recipient, then sends the Guest QR.', tone: 'buyer' },
            { label: 'Recipients', value: 'Adult guest, child, elderly relative, or dependent: same Guest QR. No Passport ownership.', tone: 'recipient' },
            { label: 'Gate QR', value: 'Recipient shows the app-less web QR or printout.', tone: 'gate' },
          ]}
        />
      ),
    },
    {
      group: 'scenario',
      badgeText: 'Team · Individual access',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      title: 'Case 33: Team Purchase — Players Resolve Individually',
      subtitle: 'One team registration with organizer-defined player limits. The buyer adds players in the team form; each player receives Passport access through a claim link or an app-less Guest QR. There is no team lead or roster-management surface.',
      timelineSteps: FLOWS.scnTeam,
      emailTemplates: [EMAIL_CATALOG.rosterInvite],
      accessPath: {
        origin: 'Orders → team participant form',
        route: '/orders/:ticketId/form → /passport',
        backTarget: 'Orders list',
        steps: [
          'Buyer opens the team form and adds players within the organizer minimum and maximum.',
          'For each player, buyer completes the form for an app-less Guest QR or sends a claim link.',
          'Claim-link recipients sign in or create an account and complete their own organizer form.',
          'At the gate, each person uses their own Passport or Guest QR.',
        ],
      },
      renderViewport: () => (
        <WF_AccessSummary
          surface="Team"
          route="/orders/:ticketId/form → /passport"
          rows={[
            { label: 'Buyer', value: 'Adds players in the team form; chooses a claim link or Guest QR per player.', tone: 'buyer' },
            { label: 'Players', value: 'Account holders claim into their own Passport; app-less players receive a Guest QR.', tone: 'recipient' },
            { label: 'Gate QR', value: 'Each player shows their own Passport or Guest QR.', tone: 'gate' },
          ]}
        />
      ),
    },
    {
      group: 'scenario',
      badgeText: 'Guest QR · Later claim',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      title: 'Case 34: Guest QR Holder Creates An Account Later',
      subtitle: 'A person used an app-less Guest QR, then later creates a PlanOut account. They scan the Guest QR or enter its code, confirm the entry, and add it to their Passport exactly once.',
      timelineSteps: FLOWS.scnLeadTransfer,
      emailTemplates: [],
      accessPath: {
        origin: 'Guest QR link or Passport → Add code',
        route: '/passport/add-entry',
        backTarget: 'Passport',
        steps: [
          'Guest scans the shared Guest QR or opens Add code in Passport.',
          'They sign in or create an account, then review the entry.',
          'They confirm Add to my Passport.',
          'The Guest QR is invalidated; a second claim is blocked.',
        ],
      },
      renderViewport: () => (
        <WF_AccessSummary
          surface="Team"
          route="/passport/add-entry"
          rows={[
            { label: 'Guest', value: 'Uses the Guest QR or code after deciding to create an account.', tone: 'recipient' },
            { label: 'Passport', value: 'Receives the entry and preserves a prior check-in, if any.', tone: 'buyer' },
            { label: 'Guest QR', value: 'Permanently invalid after the one-time claim.', tone: 'gate' },
          ]}
        />
      ),
    },

    // ===== GROUP A: INDIVIDUAL (SINGLE PERSON, SINGLE TICKET) =====
    {
      group: 'single',
      badgeText: 'Individual Passport',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      title: 'Case 1: Universal Passport Card (Front)',
      subtitle: 'The primary entry card holding the dynamic QR check-in token. Shows the textured metal front side with the unique dynamic QR, passport code, and athlete metadata.',
      timelineSteps: FLOWS.cardFront,
      emailTemplates: [EMAIL_CATALOG.welcome],
      accessPath: {
        origin: 'Passport tab (bottom navigation)',
        route: '/passport',
        backTarget: 'Home',
        steps: [
          'Buyer completes checkout and activates their Passport.',
          'Buyer taps Passport in the bottom navigation.',
          'The Universal Passport card renders with the dynamic QR.',
          'The same card is shown at the gate for check-in.',
        ],
      },
      renderViewport: () => <WF_PassportFront />,
    },
    {
      group: 'single',
      badgeText: 'Front Actions',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      title: 'Case 2: Universal Passport Card — Front Actions',
      subtitle: 'There is no Passport card back state. Events, Save, and Regenerate QR are front-accessible actions from the Passport card surface.',
      timelineSteps: FLOWS.cardFrontActions,
      emailTemplates: [],
      accessPath: {
        origin: 'Passport tab (bottom navigation)',
        route: '/passport',
        backTarget: 'Home',
        steps: [
          'Buyer opens the Passport tab and sees the front card.',
          'The front action row exposes Events, Save, and Regenerate QR.',
          'Buyer taps Events to jump to Passport Events, or Save / Regenerate in place.',
          'No separate screen — all actions live on the Passport front.',
        ],
      },
      renderViewport: () => <WF_PassportFrontActions />,
    },
    {
      group: 'single',
      badgeText: 'Inline Dynamic Form',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'Case 3: Checkout Confirmation → Inline Form Pending',
      subtitle: 'The checkout confirmation screen when a user purchases exactly 1 event. The organizer\'s dynamic registration fields are embedded directly inline on the confirmation page to eliminate friction.',
      timelineSteps: FLOWS.inlineForm,
      emailTemplates: [EMAIL_CATALOG.formRequired],
      accessPath: {
        origin: 'Checkout confirmation (single-ticket order)',
        route: '/checkout (confirmation state)',
        backTarget: 'Orders or Passport',
        steps: [
          'Buyer checks out exactly one ticket and pays.',
          'The confirmation screen embeds the organizer form inline.',
          'Buyer fills and submits without leaving the confirmation.',
          'The entry then attaches to the buyer\'s Passport.',
        ],
      },
      renderViewport: () => <WF_InlineForm />,
    },
    {
      group: 'single',
      badgeText: 'FormTaskCard · Single',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'Case 4: FormTaskCard — Single Entry Pending',
      subtitle: 'The task card shown on the Passport Events page for a single-entry ticket with forms still pending. Displays "Single entry" eyebrow, event name, category, deadline, and a "Complete form" CTA.',
      timelineSteps: FLOWS.formTaskSingle,
      emailTemplates: [EMAIL_CATALOG.formRequired],
      accessPath: {
        origin: 'Passport → Events (also reachable from Orders)',
        route: '/passport/events → /orders/:ticketId/form',
        backTarget: 'Passport Events',
        steps: [
          'Buyer opens Passport → Events from the front actions.',
          'A "Single entry" task card shows the event, category, and deadline.',
          'Buyer taps Complete form to open the participant form.',
          'On submit the entry attaches to the buyer\'s Passport.',
        ],
      },
      renderViewport: () => <WF_FormTaskSingle />,
    },
    {
      group: 'single',
      badgeText: 'Pending Payment',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'Case 5: Locked — Pending Payment Verification',
      subtitle: 'The locked event row when payment has not yet been confirmed (e.g. bank transfer pending). The "Awaiting payment" button is disabled. Row transitions to pending_form or attached once payment clears.',
      timelineSteps: FLOWS.pendingPayment,
      emailTemplates: [],
      accessPath: {
        origin: 'Orders (also shown on Passport)',
        route: '/orders',
        backTarget: 'Home',
        steps: [
          'Buyer checks out with an offline / pending payment method.',
          'The order appears in Orders with an "Awaiting payment" locked row.',
          'The button stays disabled until the payment clears.',
          'Once verified the row moves to pending_form or attached.',
        ],
      },
      renderViewport: () => <WF_PendingPayment />,
    },
    {
      group: 'single',
      badgeText: 'Resubmit Required',
      badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      title: 'Case 6: Form Update Required — Resubmission Needed',
      subtitle: 'Shown when an organizer updates form requirements after initial submission. Displays an orange "Form update required" badge and a "Review form" CTA — matching the real app\'s resubmit label from formTaskDetails().',
      timelineSteps: FLOWS.resubmitRequired,
      emailTemplates: [EMAIL_CATALOG.resubmitRequired],
      accessPath: {
        origin: 'Passport → Events (after organizer update)',
        route: '/passport/events → /orders/:ticketId/form',
        backTarget: 'Passport Events',
        steps: [
          'Organizer updates the form after the buyer already submitted.',
          'A "Form update required" card appears on Passport → Events.',
          'Buyer taps Review form to open the updated form.',
          'On re-submit the entry returns to attached.',
        ],
      },
      renderViewport: () => <WF_ResubmitRequired />,
    },
    {
      group: 'single',
      badgeText: 'Ready · Attached',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      title: 'Case 7: Custom Form Submitted → Attached & Access Ready',
      subtitle: 'The standard green-path event card on the Passport once all registration details are completed. Shows the emerald "Ready" badge indicating organizer-configured fields and payment are verified.',
      timelineSteps: FLOWS.attached,
      emailTemplates: [EMAIL_CATALOG.ticketReady],
      accessPath: {
        origin: 'Passport tab / Passport → Events',
        route: '/passport',
        backTarget: 'Home',
        steps: [
          'Buyer completes payment and all organizer forms.',
          'The event card turns green ("Ready") on the Passport.',
          'No pending tasks remain for that entry.',
          'Buyer shows the Universal Passport QR at the gate.',
        ],
      },
      renderViewport: () => <WF_AttachedReady />,
    },
    {
      group: 'single',
      badgeText: 'Spot Released',
      badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      title: 'Case 8: Deadline Missed → Spot Released',
      subtitle: 'Shown when the form deadline passes without submission. The row is faded with a "Spot released" badge. User can browse the event again to re-register if slots remain.',
      timelineSteps: FLOWS.spotReleased,
      emailTemplates: [EMAIL_CATALOG.spotReleased],
      accessPath: {
        origin: 'Passport → Events (Status updates section)',
        route: '/passport/events',
        backTarget: 'Passport',
        steps: [
          'Buyer misses the form deadline for a pending entry.',
          'The row fades with a "Spot released" badge under Status updates.',
          'Buyer opens Passport → Events to see the released state.',
          'Buyer can browse the event again to re-register if slots remain.',
        ],
      },
      renderViewport: () => <WF_SpotReleased />,
    },
    {
      group: 'single',
      badgeText: 'Attended History',
      badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      title: 'Case 9: Event Completed → Checked-In & Attended Log',
      subtitle: 'Logs completed check-in history for events the athlete successfully scanned into at the gate. Shows "Attended" or "Completed" badge.',
      timelineSteps: FLOWS.pastAttended,
      emailTemplates: [EMAIL_CATALOG.checkinSuccess],
      accessPath: {
        origin: 'Passport → Events (Past events section)',
        route: '/passport/events',
        backTarget: 'Passport',
        steps: [
          'Buyer is scanned in at the gate on event day.',
          'The entry moves to the Past events section with an "Attended" log.',
          'Buyer opens Passport → Events to review attendance history.',
          'No further action is required.',
        ],
      },
      renderViewport: () => <WF_PastAttended />,
    },
    {
      group: 'single',
      badgeText: 'No-Show History',
      badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
      title: 'Case 10: Event Completed → Missed No-Show Log',
      subtitle: 'Highlights registered tickets that were never scanned on event day. Shows a "No-show" badge with the message "You were registered but not checked in on event day."',
      timelineSteps: FLOWS.pastNoShow,
      emailTemplates: [EMAIL_CATALOG.noShow],
      accessPath: {
        origin: 'Passport → Events (Past events section)',
        route: '/passport/events',
        backTarget: 'Passport',
        steps: [
          'Buyer is registered but never scans in on event day.',
          'The entry is tagged "No-show" and the QR is disabled.',
          'Buyer opens Passport → Events to see the no-show log.',
          'No re-entry is possible for that ticket.',
        ],
      },
      renderViewport: () => <WF_PastNoShow />,
    },

    // ===== GROUP B: GUEST SHARING (MULTIPLE PEOPLE, MULTIPLE TICKETS) =====

    {
      group: 'multiple',
      badgeText: 'Buyer Guest Manager',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      title: 'Case 11: Shared Ticket → Guest QR Active',
      subtitle: 'The buyer\'s dashboard view for a shared Guest QR in active state. Shows the QR code, ref number, "Active" badge, one-time use warning, and Share/Revoke actions.',
      timelineSteps: FLOWS.guestActive,
      emailTemplates: [EMAIL_CATALOG.guestLink],
      accessPath: {
        origin: 'Orders → order detail → guest entry',
        route: '/orders/tkt-010/entry/tkt-010-p2/guest-qr',
        backTarget: 'Previous app screen, normally the order detail',
        steps: [
          'Buyer completes checkout for an entry assigned to someone else.',
          'Buyer opens Orders from the bottom navigation.',
          'Buyer opens the order that contains the guest participant.',
          'Buyer taps the guest QR action on that participant row.',
        ],
      },
      renderViewport: () => <WF_GuestQRActive />,
    },
    {
      group: 'multiple',
      badgeText: 'Buyer Guest Manager',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      title: 'Case 12: Shared Ticket → Guest Checked-In (Used QR)',
      subtitle: 'The buyer\'s dashboard view showing that the guest has scanned in at the gate. Shows the exact entry gate name and checked-in timestamp. QR is consumed.',
      timelineSteps: FLOWS.guestUsed,
      emailTemplates: [EMAIL_CATALOG.guestCheckedIn],
      accessPath: {
        origin: 'Orders → order detail → guest entry after scan',
        route: '/orders/tkt-010/entry/tkt-010-p2/guest-qr?state=used',
        backTarget: 'Previous app screen, normally the order detail',
        steps: [
          'Buyer generated and shared a guest QR from Orders.',
          'Guest presents the public QR at the gate.',
          'Staff scan marks the guest QR as used.',
          'Buyer reopens the guest QR from Orders and sees the scanned state.',
        ],
      },
      renderViewport: () => <WF_GuestQRUsed />,
    },
    {
      group: 'multiple',
      badgeText: 'Buyer Guest Manager',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      title: 'Case 13: Shared Ticket → Guest QR Revoked',
      subtitle: 'The buyer\'s dashboard view when a shared guest ticket has been cancelled. Shows a red "Revoked" badge, disabled QR, and option to generate a new one.',
      timelineSteps: FLOWS.guestRevoked,
      emailTemplates: [EMAIL_CATALOG.guestRevoked],
      accessPath: {
        origin: 'Orders → order detail → guest QR revoke flow',
        route: '/orders/tkt-010/entry/tkt-010-p2/guest-qr?state=revoked',
        backTarget: 'Previous app screen, normally the order detail',
        steps: [
          'Buyer opens Orders and selects the relevant order.',
          'Buyer opens the guest QR for the participant slot.',
          'Buyer taps Revoke and confirms the cancellation.',
          'The same guest QR screen updates into the revoked state.',
        ],
      },
      renderViewport: () => <WF_GuestQRRevoked />,
    },
    {
      group: 'multiple',
      badgeText: 'Guest Web Page',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'Case 14: Non-User Guest Landing Page View',
      subtitle: 'The unauthenticated mobile webpage opened by a guest. Shows ticket details, check-in status, gate QR code, and a "Sign up free" CTA to convert to a PlanOut user.',
      timelineSteps: FLOWS.publicGuestPage,
      emailTemplates: [EMAIL_CATALOG.guestLink],
      accessPath: {
        origin: 'Shared guest link from SMS, email, or chat',
        route: '/guest-entry/GE-CANLAON-42K',
        backTarget: 'Browser history, usually the message or email source',
        steps: [
          'Buyer shares the guest QR link from Orders.',
          'Guest receives the link outside the app.',
          'Guest opens the link in a mobile browser with no login required.',
          'Guest shows the web QR at the gate.',
        ],
      },
      renderViewport: () => <WF_PublicGuestPage />,
    },
    {
      group: 'multiple',
      badgeText: 'Guest Claim & Register',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      title: 'Case 15: Guest Ticket Transfer → Claim & Register Account',
      subtitle: 'Full ticket ownership transfer — buyer sends another person a claim link by email. The email does not match an account by itself. Recipient must log in or create a PlanOut account from the link, fill the organizer form, and have the entry bind to that authenticated Passport. This is a permanent transfer, not a Guest QR — the buyer loses access to that slot entirely.',
      timelineSteps: FLOWS.guestClaimRegister,
      emailTemplates: [EMAIL_CATALOG.guestClaim],
      accessPath: {
        origin: 'Ticket claim link sent to recipient email',
        route: '/ticket-claim/CLM-CANLAON-42K',
        backTarget: 'Browser history, usually the claim email or previous page',
        steps: [
          'Buyer starts a ticket transfer for a participant slot.',
          'Recipient receives a claim link by email.',
          'Recipient opens the claim page and logs in or creates an account.',
          'Recipient completes the organizer form so the entry binds to that Passport.',
        ],
      },
      renderViewport: () => <WF_GuestClaimRegister />,
    },
    {
      group: 'multiple',
      badgeText: 'Guest QR',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'Case 16: Guest QR (No Account Flow)',
      subtitle: 'App-less entry pass for anyone who will not use a PlanOut account. Buyer fills all organizer-defined fields on their behalf. A Guest QR is generated; no app, no login, no account required, and it does not attach to any Passport.',
      timelineSteps: FLOWS.temporaryGuestQR,
      emailTemplates: [EMAIL_CATALOG.temporaryQR],
      accessPath: {
        origin: 'Orders → order detail → Guest QR action',
        route: '/orders/tkt-010/entry/tkt-010-p2/guest-qr',
        backTarget: 'Previous app screen, normally the order detail',
        steps: [
          'Buyer fills the required forms on behalf of the guest.',
          'Buyer opens Orders and selects the matching order.',
          'Buyer taps Generate & send QR on the guest participant row.',
          'Buyer opens, copies, prints, or sends the Guest QR.',
        ],
      },
      renderViewport: () => <WF_TemporaryGuestQR />,
    },
    {
      group: 'multiple',
      badgeText: 'FormTaskCard · Multiple',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      title: 'Case 17: FormTaskCard — Multiple Entries Pending',
      subtitle: 'The task card shown on the Passport Events page when one purchase covers multiple participants. For each slot, buyer can either invite the participant (claim flow — account required) or fill the form themselves (Guest QR — no account needed). Mixed strategies across slots are supported. Card shows aggregate pending count.',
      timelineSteps: FLOWS.formTaskMulti,
      emailTemplates: [],
      accessPath: {
        origin: 'Passport → Events (also reachable from Orders)',
        route: '/passport/events → /orders/:ticketId/form',
        backTarget: 'Passport Events',
        steps: [
          'Buyer opens Passport → Events after a multi-participant order.',
          'A "Multiple entries" card shows the count of forms still needed.',
          'Buyer opens the participant form to manage all slots.',
          'Per slot the buyer fills own, invites (claim), or sends a Guest QR.',
        ],
      },
      renderViewport: () => <WF_FormTaskMulti />,
    },

    {
      group: 'multiple',
      badgeText: 'Multi-Guest Manager',
      badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      title: 'Case 23: Multi-Guest Order — Buyer Fills All, Distributes QRs',
      subtitle: 'Buyer purchases multiple tickets and fills all organizer forms themselves (no invites). A unique Guest Entry QR is generated per slot. Buyer distributes each QR independently. The Guest Entry Manager panel shows per-guest share status, used/active state, and revocation controls. No PlanOut account required for any guest.',
      timelineSteps: FLOWS.multiGuestManager,
      emailTemplates: [],
      accessPath: {
        origin: 'Orders → order-level Manage guest QRs',
        route: '/orders/tkt-008/guest-manager',
        backTarget: 'Previous app screen, normally the order detail or Orders list',
        steps: [
          'Buyer checks out multiple participant entries for other people.',
          'Buyer completes the participant forms for each guest slot.',
          'Buyer opens Orders and taps Manage guest QRs on the order.',
          'Buyer generates, opens, copies, marks used, or revokes each guest QR independently.',
        ],
      },
      renderViewport: () => <WF_MultiGuestManager />,
    },

    // ===== GROUP C: TEAM (MULTIPLE PEOPLE, SINGLE TICKET) =====
    {
      group: 'team',
      badgeText: 'Team Progress',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      title: 'Case 18: Coach View → Roster Progress Bar',
      subtitle: 'The progress indicator shown to team buyers/coaches. Shows at a glance how many roster members have completed their required forms before the team ticket is valid.',
      timelineSteps: FLOWS.teamProgress,
      emailTemplates: [],
      accessPath: {
        origin: 'Passport (team card) / Orders',
        route: '/passport',
        backTarget: 'Home',
        steps: [
          'Coach buys a team package; slots are reserved but locked.',
          'The team card on the Passport shows a live roster progress bar.',
          'Coach watches completed-vs-pending member forms update.',
          'Once every slot is complete the team ticket turns Ready.',
        ],
      },
      renderViewport: () => <WF_TeamProgress />,
    },
    {
      group: 'team',
      badgeText: 'Roster Statuses',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      title: 'Case 19: Coach View → Roster Slots List',
      subtitle: 'Displays roster entries with status dots: Complete (green), Pending (amber invite sent, form unsubmitted), or Open (unassigned slot).',
      timelineSteps: FLOWS.teamRosterList,
      emailTemplates: [EMAIL_CATALOG.rosterInvite],
      accessPath: {
        origin: 'Orders → team participant form',
        route: '/orders/:ticketId/form',
        backTarget: 'Orders list',
        steps: [
          'Coach opens the team form from the order in Orders.',
          'The roster panel lists slots as Complete, Pending, or Open.',
          'Coach inputs member emails; the system sends invites.',
          'Status dots update live as members complete their forms.',
        ],
      },
      renderViewport: () => <WF_TeamRoster />,
    },
    {
      group: 'team',
      badgeText: 'FormTaskCard · Team',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      title: 'Case 20: FormTaskCard — Team Entry Pending',
      subtitle: 'The task card shown on the Passport Events page for a team ticket. Displays "Team entry" eyebrow, roster completion count (e.g. "2/4 complete"), and "Manage team form" CTA.',
      timelineSteps: FLOWS.formTaskTeam,
      emailTemplates: [],
      accessPath: {
        origin: 'Passport → Events (also reachable from Orders)',
        route: '/passport/events → /orders/:ticketId/form',
        backTarget: 'Passport Events',
        steps: [
          'Coach opens Passport → Events after buying a team package.',
          'A "Team entry" card shows the roster completion count and deadline.',
          'Coach taps Manage team form to open the roster.',
          'Coach sends invites or fills member forms from there.',
        ],
      },
      renderViewport: () => <WF_FormTaskTeam />,
    },
    {
      group: 'team',
      badgeText: 'Group Claim Links',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      title: 'Case 21: Group Chat Claim Links — Recipient Selection',
      subtitle: 'Buyer shares one group-chat link. Each recipient chooses their individual entry, signs in or creates an account, and continues directly to the organizer form.',
      timelineSteps: FLOWS.groupShare,
      emailTemplates: [],
      accessPath: {
        origin: 'Order → share all claim links',
        route: '/order-share/:orderId',
        backTarget: 'Group chat / Orders',
        steps: [
          'Buyer opens the shared group link for the order.',
          'Recipient selects their own entry and opens the individual claim link.',
          'Recipient logs in or creates an account without onboarding interruption.',
          'After acceptance, the team moves to that Passport.',
        ],
      },
      renderViewport: () => <WF_LeadTransfer />,
    },

    // ===== GROUP D: AGGREGATE VIEW =====
    {
      group: 'aggregate',
      badgeText: 'Events Page',
      badgeColor: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      title: 'Case 22: Passport Events Attending — Aggregate Overview',
      subtitle: 'The full Events Attending page showing all registrations organized into sections: "Forms needed" (FormTaskCards), "Ready for access" (attached rows), "Status updates" (released rows), and "Past events".',
      timelineSteps: FLOWS.eventsOverview,
      emailTemplates: [],
      accessPath: {
        origin: 'Passport → Events (front action)',
        route: '/passport/events',
        backTarget: 'Passport',
        steps: [
          'Buyer taps Events from the Passport front actions.',
          'The page aggregates every registration across all tickets.',
          'Sections: Forms needed, Ready for access, Status updates, Past events.',
          'Buyer acts on any entry directly from this one screen.',
        ],
      },
      renderViewport: () => <WF_EventsOverview />,
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
    { id: 'catalog', label: 'Audit Catalog' },
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
                        Consolidated by buyer intent, starting at Purchase Intent 1. These are ordered by who buys, who fills the form, who receives access, and what they show at the gate. The original global case numbers are kept only as audit references.
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
                    <h2 className="text-sm font-medium">Flow Index</h2>
                    <span className="text-xs text-muted-foreground">
                      Click any case to scroll & highlight
                    </span>
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { group: 'single', label: 'Individual Flows' },
                    { group: 'multiple', label: 'Guest Sharing' },
                    { group: 'team', label: 'Team Entries' },
                    { group: 'aggregate', label: 'Aggregate View' },
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
                        { scenario: 'Team roster member', fills: 'Member fills own form', account: 'Yes — account required first', qr: "Member's Passport QR", cases: '18–21' },
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
              {/* Group A: Single Person Single Ticket */}
              <div className="flex flex-col gap-6 mt-6">
                <div className="flex flex-col gap-1 py-3">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-semibold tracking-tight">A. Individual Flows</h2>
                    <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium text-muted-foreground">10 cases</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Single buyer, single ticket. Covers the full personal passport lifecycle — checkout to gate access — plus form states, QR rotation, and re-entry.</p>
                </div>
                <div className="flex flex-col gap-6">
                  {CASES_LIST.filter(c => c.group === 'single').map((item) => {
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

              {/* Group B: Multiple People Multiple Tickets */}
              <div className="flex flex-col gap-6 mt-6">
                <div className="flex flex-col gap-1 py-3">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-semibold tracking-tight">B. Guest Sharing</h2>
                    <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium text-muted-foreground">8 cases</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Multiple tickets, multiple people. Covers all flows where the buyer manages others — ticket transfers, Guest QRs, and multi-guest distribution.</p>
                </div>
                <div className="flex flex-col gap-6">
                  {CASES_LIST.filter(c => c.group === 'multiple').map((item) => {
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

              {/* Group C: Team */}
              <div className="flex flex-col gap-6 mt-6">
                <div className="flex flex-col gap-1 py-3">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-semibold tracking-tight">C. Team Entries</h2>
                    <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium text-muted-foreground">4 cases</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">One team purchase with individual player entries. Players complete their own forms from invite links; Passport ownership requires login or account creation from the claim flow. Covers player progress and individual distribution paths.</p>
                </div>
                <div className="flex flex-col gap-6">
                  {CASES_LIST.filter(c => c.group === 'team').map((item) => {
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

              {/* Group D: Aggregate */}
              <div className="flex flex-col gap-6 mt-6">
                <div className="flex flex-col gap-1 py-3">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-semibold tracking-tight">D. Aggregate View</h2>
                    <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium text-muted-foreground">1 case</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">The Passport Events Attending page — a unified view of all registrations across tickets, form states, and entry statuses, organized into actionable sections.</p>
                </div>
                <div className="flex flex-col gap-6">
                  {CASES_LIST.filter(c => c.group === 'aggregate').map((item) => {
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
            </div>
          </>
        ) : (
          /* Render Diagram View */
          <div className="flex flex-col gap-6 w-full">
            <div className="rounded-xl border bg-card p-6 flex flex-col gap-2">
              <h2 className="text-sm font-medium">State Flow Diagram</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                Below are the horizontal flow diagrams showing the step-by-step user journey and state transitions for each case. Click any step node card in a flow to open the matching app screen preview where available, plus associated email alert templates. Use the filters below to narrow down by registration context.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 pb-2">
              {[
                { id: 'all', label: 'All Cases (34)' },
                { id: 'scenario', label: `Purchase Intent (${purchaseIntentCount})` },
                { id: 'single', label: 'Individual Flows (10)' },
                { id: 'multiple', label: 'Guest Sharing (8)' },
                { id: 'team', label: 'Team Entries (4)' },
                { id: 'aggregate', label: 'Aggregate Overview (1)' },
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
                                    <span className="text-[10px] font-medium text-foreground">
                                      View screen
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
