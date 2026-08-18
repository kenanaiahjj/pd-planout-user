/**
 * @file LoginPage.tsx
 * @description Two-step login flow (Email → OTP) matching premium Figma designs.
 *
 * Mobile: full-width vertically-centered form.
 * Desktop: split layout — form on left, hero image on right.
 *
 * Uses Figma-imported assets for the logo and social-login SVG icons.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import imgLogo from '@/assets/5a332411061613331a1ffc8c7aa2ccf247ff8699.png';
import imgHero from '@/assets/80a9288cce0f3fbae7ebd6ed6d5626c04458d6fd.png';
import svgPaths from '../../imports/svg-3kdsnz0ryc';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { detectLoginMethod } from '@/app/data/login';

// ---------------------------------------------------------------------------
// Social icon SVGs (from Figma import)
// ---------------------------------------------------------------------------

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
      <g clipPath="url(#gclip)">
        <path d={svgPaths.p7776880} fill="#4285F4" />
        <path d={svgPaths.p2d84f580} fill="#34A853" />
        <path d={svgPaths.p380d1d80} fill="#FBBC04" />
        <path d={svgPaths.p1ebd4080} fill="#EA4335" />
      </g>
      <defs>
        <clipPath id="gclip">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
      <g clipPath="url(#fbclip)">
        <path d={svgPaths.p2334f790} fill="#1877F2" />
        <path d={svgPaths.p137c9ab0} fill="white" />
      </g>
      <defs>
        <clipPath id="fbclip">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-[9px] h-[16px] shrink-0" viewBox="0 0 11.4372 18" fill="none">
      <path
        d={svgPaths.p36d4d200}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="w-[13px] h-[10px] shrink-0" viewBox="0 0 14 11" fill="none">
      <path
        d="M1 1L7 6L13 1M1 1H13V10H1V1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Mask email for OTP screen: "ken****ah@gmail.com" */
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain || local.length <= 4) return email;
  return `${local.slice(0, 3)}${'*'.repeat(Math.min(4, local.length - 5))}${local.slice(-2)}@${domain}`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SocialButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full min-h-11 rounded-[10px] flex items-center justify-center gap-3 px-5 py-2.5 border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/20 focus-visible:ring-offset-1 transition-colors duration-150 cursor-pointer"
    >
      {icon}
      <span className="text-[#344054] text-[14px] font-semibold tracking-tight">{label}</span>
    </button>
  );
}

function BrandLockup() {
  return (
    <div
      className="flex items-center justify-center gap-3 mb-4 group transition-transform duration-500 hover:scale-105"
      aria-label="PlanOut"
    >
      <div className="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px]">
        <img src={imgLogo} alt="" className="w-full h-full object-cover rounded-2xl" />
      </div>
      <span className="font-semibold leading-none text-[#1e9680] text-[28px] sm:text-[32px] tracking-[-0.04em]">
        PlanOut
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// OTP Input
// ---------------------------------------------------------------------------

function OtpInput({
  length = 6,
  value,
  onChange,
}: {
  length?: number;
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = useCallback(
    (index: number, char: string) => {
      if (!/^\d?$/.test(char)) return;
      const next = [...value];
      next[index] = char;
      onChange(next);
      if (char && index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    },
    [value, onChange, length],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' && !value[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    },
    [value],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
      const next = [...value];
      for (let i = 0; i < pasted.length; i++) {
        next[i] = pasted[i];
      }
      onChange(next);
      const focusIdx = Math.min(pasted.length, length - 1);
      inputsRef.current[focusIdx]?.focus();
    },
    [value, onChange, length],
  );

  return (
    <div className="flex gap-2 sm:gap-3 items-center justify-center">
      {Array.from({ length }).map((_, i) => {
        const activeIndex = value.findIndex((v) => !v);
        const isFocused = i === (activeIndex === -1 ? length - 1 : activeIndex);
        return (
          <div
            key={i}
            className={`group relative flex h-12 w-11 items-center justify-center rounded-[10px] border transition-colors duration-150 sm:h-14 sm:w-[52px] ${
              isFocused
                ? 'border-[#177564] bg-[#f2fbf8] shadow-[0_0_0_3px_rgba(23,117,100,0.12)]'
                : 'border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] hover:border-slate-300'
            }`}
          >
            <input
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              aria-label={`Verification digit ${i + 1}`}
              maxLength={1}
              value={value[i] || ''}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className="absolute inset-0 h-full w-full text-center text-[22px] font-bold tracking-tight text-slate-800 bg-transparent outline-none select-none focus-visible:ring-0 sm:text-[28px]"
              style={{ caretColor: '#177564' }}
            />
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type LoginMethod = 'email' | 'phone';

interface LoginPageProps {
  onLoginComplete: (method: LoginMethod, value: string) => void;
  /** Allow guest browsing — navigates back without logging in. */
  onContinueAsGuest?: () => void;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function LoginPage({ onLoginComplete, onContinueAsGuest }: LoginPageProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [identifier, setIdentifier] = useState('');
  const [otpTarget, setOtpTarget] = useState<{ method: LoginMethod; value: string } | null>(null);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Start resend countdown when entering OTP step
  useEffect(() => {
    if (step === 'otp') {
      setResendTimer(30);
    }
  }, [step]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Auto-submit when all OTP digits are filled
  useEffect(() => {
    if (!otpTarget || !otp.every((d) => d !== '')) return;

    setIsSubmitting(true);
    const timeout = setTimeout(() => {
      onLoginComplete(otpTarget.method, otpTarget.value);
    }, 800);
    return () => clearTimeout(timeout);
  }, [otp, onLoginComplete, otpTarget]);

  const handleContinue = useCallback(() => {
    const value = identifier.trim();
    const method = detectLoginMethod(value);
    if (!value || !method) return;

    setOtpTarget({ method, value });
    setIsSubmitting(true);
    // Simulate sending OTP
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
    }, 600);
  }, [identifier]);

  const handleResend = useCallback(() => {
    if (resendTimer > 0) return;
    setOtp(Array(6).fill(''));
    setResendTimer(30);
  }, [resendTimer]);

  const detectedMethod = detectLoginMethod(identifier);
  const maskedIdentifier = otpTarget
    ? otpTarget.method === 'email'
      ? maskEmail(otpTarget.value)
      : `${otpTarget.value.slice(0, 4)}****${otpTarget.value.slice(-2)}`
    : '';

  // -----------------------------------------------------------------------
  // Render: Email / Phone step
  // -----------------------------------------------------------------------
  const renderEmailStep = () => (
    <div className="flex flex-col items-center w-full animate-in fade-in duration-500">
      {/* Logo */}
      <BrandLockup />

      {/* Heading */}
      <h1 className="text-[26px] sm:text-[32px] font-extrabold text-slate-900 tracking-[-0.035em] text-center leading-tight">
        Welcome to PlanOut
      </h1>
      <p className="text-[13.5px] sm:text-[14.5px] font-medium text-slate-500 text-center tracking-tight leading-relaxed mt-2.5 max-w-[291px] sm:max-w-[384px]">
        Exploring events is a great way to expand your horizons and experience new things.
      </p>

      {/* Spacer */}
      <div className="h-6 sm:h-8" />

      {/* Input section */}
      <div className="w-full max-w-[320px]">
        {/* Identifier field */}
        <div className="relative mb-4 group">
          <div className="relative flex min-h-11 items-center gap-3 rounded-[10px] border border-slate-200/80 bg-white px-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors duration-150 hover:border-slate-300 focus-within:border-[#177564] focus-within:ring-2 focus-within:ring-[#177564]/15">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center text-slate-400 transition-colors duration-150 group-focus-within:text-[#177564]">
              {detectedMethod === 'phone' ? <PhoneIcon /> : detectedMethod === 'email' ? <EmailIcon /> : null}
            </span>

            <input
              type="text"
              inputMode={detectedMethod === 'phone' ? 'tel' : 'email'}
              autoComplete="username"
              enterKeyHint="next"
              aria-label="Email or phone number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
              placeholder="Email or phone number"
              className="native-mobile-field w-full min-h-11 bg-transparent text-[14.5px] text-slate-800 placeholder:text-slate-400 font-semibold outline-none border-none p-0 focus:ring-0"
            />
          </div>
        </div>

        <PrimaryButton
          onClick={handleContinue}
          disabled={isSubmitting || !identifier.trim()}
          fullWidth
          appearance="gradient"
          brandGradient={{ from: '#28b99e', to: '#177564' }}
          className="min-h-[52px] rounded-[12px] bg-gradient-to-r from-[#28b99e] to-[#177564] px-4 py-2.5 text-[14px] font-semibold tracking-[-0.01em] disabled:opacity-100 disabled:saturate-100 disabled:text-[#65756f]"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white motion-reduce:animate-none" />
              Sending code…
            </span>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </>
          )}
        </PrimaryButton>

        {/* Consent notice — keep this immediately after the primary action so it is easy to find. */}
        <p className="mx-auto mt-3 max-w-[290px] px-2 text-center text-[11.5px] font-medium leading-[1.55] tracking-[-0.01em] text-slate-500 sm:text-[12px]">
          By continuing, you agree to PlanOut&apos;s{' '}
          <span className="font-bold text-[#177564] underline decoration-[#177564]/35 underline-offset-2">
            Terms of Service
          </span>{' '}
          and{' '}
          <span className="font-bold text-[#177564] underline decoration-[#177564]/35 underline-offset-2">
            Privacy Policy
          </span>
          .
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3.5 w-full max-w-[320px] sm:max-w-[328px] mt-8 sm:mt-10">
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-[13px] font-bold text-slate-400 tracking-wider uppercase">or</span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>

      {/* Social buttons */}
      <div className="flex flex-col gap-3 w-full max-w-[328px] mt-6 sm:mt-8">
        <SocialButton icon={<GoogleIcon />} label="Sign in with Google" onClick={() => onLoginComplete('email', 'google-test@planout.com')} />
        <SocialButton icon={<FacebookIcon />} label="Sign in with Facebook" onClick={() => onLoginComplete('email', 'fb-test@planout.com')} />
      </div>

      {/* Guest browsing */}
      {onContinueAsGuest && (
        <button
          onClick={onContinueAsGuest}
          className="group mt-8 min-h-11 text-[13px] font-bold text-slate-500 hover:text-[#177564] tracking-tight transition-colors duration-300 flex items-center gap-1 cursor-pointer"
        >
          <span>Continue as Guest</span>
          <ArrowRight className="w-3.5 h-3.5 translate-y-[0.5px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
        </button>
      )}
    </div>
  );

  // -----------------------------------------------------------------------
  // Render: OTP step
  // -----------------------------------------------------------------------
  const renderOtpStep = () => (
    <div className="flex flex-col items-center w-full animate-in fade-in duration-500">
      {/* Logo */}
      <BrandLockup />

      {/* Heading */}
      <h1 className="text-[26px] sm:text-[32px] font-extrabold text-slate-900 tracking-[-0.035em] text-center leading-tight">
        Welcome to PlanOut
      </h1>

      {/* Spacer */}
      <div className="h-6 sm:h-8" />

      {/* OTP section */}
      <div className="flex flex-col items-center gap-2.5 w-full max-w-[424px]">
        <h2 className="text-[18px] sm:text-[21px] font-extrabold text-slate-800 tracking-tight text-center leading-none">
          Verify Security Code
        </h2>
        <p className="text-[13.5px] sm:text-[14.5px] font-medium text-slate-500 tracking-tight text-center leading-relaxed max-w-[274px] sm:max-w-full">
          We sent a 6-digit code to <span className="font-bold text-slate-800">{maskedIdentifier}</span>
        </p>
      </div>

      {/* OTP Inputs */}
      <div className="mt-8">
        <OtpInput value={otp} onChange={setOtp} />
      </div>

      {/* Resend */}
      <div className="flex flex-col items-center gap-1.5 mt-10">
        <p className="text-[13.5px] font-semibold text-slate-500 tracking-tight">
          Didn't receive OTP Code?
        </p>
        <button
          onClick={handleResend}
          disabled={resendTimer > 0}
          className={`min-h-11 text-[14px] font-extrabold tracking-tight transition-colors duration-300 ${
            resendTimer > 0
              ? 'text-slate-400 cursor-not-allowed'
              : 'text-[#177564] hover:text-[#0f5f4f] cursor-pointer'
          }`}
        >
          {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
        </button>
      </div>

      {/* Back to email */}
      <button
        onClick={() => {
          setStep('email');
          setOtp(Array(6).fill(''));
          setIsSubmitting(false);
        }}
        className="group mt-8 min-h-11 text-[13.5px] font-semibold text-slate-500 hover:text-[#177564] tracking-tight transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Change {otpTarget?.method === 'email' ? 'email' : 'phone number'}</span>
      </button>
    </div>
  );

  // -----------------------------------------------------------------------
  // Main layout
  // -----------------------------------------------------------------------
  return (
    <div className="min-h-[100dvh] bg-[#f8fafc] flex relative overflow-hidden font-sans">
      {/* Decorative Radial mesh glows in background */}
      <div className="absolute left-[-100px] top-[-100px] w-[450px] h-[450px] bg-[#28b99e]/5 rounded-full blur-[90px] pointer-events-none z-0" />
      <div className="absolute right-[25%] bottom-[-100px] w-[400px] h-[400px] bg-[#177564]/4 rounded-full blur-[80px] pointer-events-none z-0" />

      {/* Left panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 overflow-y-auto relative z-10">
        <div className="w-full max-w-[340px] py-8">
          {step === 'email' ? renderEmailStep() : renderOtpStep()}
        </div>
      </div>

      {/* Right panel — hero image (desktop only) */}
      <div className="hidden lg:flex w-[46%] xl:w-[48%] items-center justify-start p-4 pl-0 relative z-10">
        <div className="w-full h-[calc(100vh-32px)] rounded-[24px] overflow-hidden relative shadow-[0_16px_40px_rgba(0,0,0,0.06)] group">
          <img
            src={imgHero}
            alt="Adventure landscape"
            className="w-full h-full object-cover transition-transform duration-10000 ease-linear group-hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20 transition-opacity duration-700 group-hover:opacity-90" />

          {/* Glassmorphic testimonial box (Double-Bezel) */}
          <div className="absolute bottom-10 left-10 right-10 max-w-[460px] p-[2.5px] rounded-[26px] bg-white/8 backdrop-blur-xl border border-white/12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.35)] animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)]">
            <div className="rounded-[23.5px] bg-gradient-to-b from-black/25 to-black/45 p-6 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.15)] flex flex-col gap-4">
              {/* Eyebrow and Rating */}
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-bold uppercase tracking-[0.25em] text-[#28b99e]">
                  PlanOut Passport
                </span>
                {/* 5 Stars Rating */}
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <svg key={idx} className="w-3.5 h-3.5 fill-[#28b99e] text-[#28b99e]" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>

              {/* Testimonial Quote */}
              <h3 className="text-[17px] font-semibold leading-relaxed tracking-tight text-white/95">
                "One scan, and you're in. The easiest gate check-in for athletes ever."
              </h3>

              <div className="h-px bg-white/10" />

              {/* User Info & Stats */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#177564] border border-white/15 flex items-center justify-center font-bold text-[13px] text-white shadow-sm">
                    KM
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-white leading-tight">Kenan Maalat</span>
                    <span className="text-[10.5px] text-white/50 font-medium">City Striders Runner</span>
                  </div>
                </div>

                {/* Compact stats badge */}
                <div className="rounded-full p-[1.5px] bg-white/10 border border-white/5 shadow-inner">
                  <div className="rounded-full px-3 py-1 bg-[#177564]/55 text-white text-[10px] font-bold tracking-tight shadow-sm">
                    48K+ Verified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
