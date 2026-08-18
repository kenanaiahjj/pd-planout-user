/**
 * @file LoginPage.tsx
 * @description Focused two-step login flow (Email/phone → OTP).
 *
 * The visual shell stays intentionally quiet so the authentication task is
 * clear on both mobile and desktop. The state machine and callbacks remain
 * compatible with the existing login route.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import imgLogo from '@/assets/5a332411061613331a1ffc8c7aa2ccf247ff8699.png';
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
      type="button"
      onClick={onClick}
      className="flex min-h-12 w-full items-center justify-center gap-3 rounded-[12px] border border-[#dbe6e2] bg-white px-4 text-[14px] font-semibold text-[#24342f] transition-colors duration-150 hover:bg-[#f7faf8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/40 focus-visible:ring-offset-2 active:bg-[#f0f7f4] motion-reduce:transition-none"
    >
      {icon}
      <span className="tracking-[-0.01em]">{label}</span>
    </button>
  );
}

function BrandLockup() {
  return (
    <div className="flex items-center justify-center gap-2.5" aria-label="PlanOut">
      <img src={imgLogo} alt="" className="h-8 w-8 object-contain" />
      <span className="text-[22px] font-semibold leading-none tracking-[-0.03em] text-[#177564]">
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
    <div className="flex w-full flex-col items-center">
      <BrandLockup />

      <h1 className="mt-8 text-center text-[28px] font-bold leading-tight tracking-[-0.03em] text-[#111b24]">
        Sign in to PlanOut
      </h1>
      <p className="mt-2 max-w-[300px] text-center text-[14px] leading-5 text-[#5f7188]">
        Use your email or phone number to continue.
      </p>

      <div className="mt-7 w-full">
        <label htmlFor="login-identifier" className="block text-[12px] font-semibold text-[#34485d]">
          Email or phone number
        </label>
        <div className="group relative mt-2 mb-3">
          <div className="relative flex min-h-[52px] items-center gap-3 rounded-[12px] border border-[#d8e3df] bg-white px-4 transition-colors duration-150 hover:border-[#b8cbc4] focus-within:border-[#177564] focus-within:ring-2 focus-within:ring-[#177564]/15">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[#8798a8] transition-colors duration-150 group-focus-within:text-[#177564]">
              {detectedMethod === 'phone' ? <PhoneIcon /> : detectedMethod === 'email' ? <EmailIcon /> : null}
            </span>

            <input
              id="login-identifier"
              type="text"
              inputMode={detectedMethod === 'phone' ? 'tel' : 'email'}
              autoComplete="username"
              enterKeyHint="next"
              aria-label="Email or phone number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
              placeholder="Email or phone number"
              className="native-mobile-field w-full min-h-11 min-w-0 border-none bg-transparent p-0 text-[15px] font-medium text-[#1b2835] outline-none placeholder:text-[#8798a8] focus:ring-0"
            />
          </div>
        </div>

        <PrimaryButton
          onClick={handleContinue}
          disabled={isSubmitting || !identifier.trim()}
          fullWidth
          appearance="gradient"
          brandGradient={{ from: '#28b99e', to: '#177564' }}
          showShine={false}
          pressScale={false}
          className="min-h-[52px] !rounded-[12px] bg-gradient-to-r from-[#28b99e] to-[#177564] px-4 py-2.5 text-[14px] font-semibold tracking-[-0.01em] disabled:opacity-100 disabled:saturate-100 disabled:text-[#65756f]"
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

        <p className="mx-auto mt-2.5 max-w-[300px] px-2 text-center text-[11px] leading-[1.45] text-[#62766f]">
          By continuing, you agree to PlanOut&apos;s{' '}
          <span className="font-semibold text-[#177564] underline decoration-[#177564]/35 underline-offset-2">
            Terms of Service
          </span>{' '}
          and{' '}
          <span className="font-semibold text-[#177564] underline decoration-[#177564]/35 underline-offset-2">
            Privacy Policy
          </span>
          .
        </p>
      </div>

      <div className="mt-6 flex w-full items-center gap-3 text-[#87958f]">
        <div className="h-px flex-1 bg-[#dfe8e4]" />
        <span className="text-[11.5px] font-medium">Or continue with</span>
        <div className="h-px flex-1 bg-[#dfe8e4]" />
      </div>

      <div className="mt-3 flex w-full flex-col gap-2.5">
        <SocialButton
          icon={<GoogleIcon />}
          label="Continue with Google"
          onClick={() => onLoginComplete('email', 'google-test@planout.com')}
        />
        <SocialButton
          icon={<FacebookIcon />}
          label="Continue with Facebook"
          onClick={() => onLoginComplete('email', 'fb-test@planout.com')}
        />
      </div>

      {onContinueAsGuest && (
        <button
          type="button"
          onClick={onContinueAsGuest}
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-[13px] font-semibold text-[#5f7188] transition-colors hover:text-[#177564] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/35 focus-visible:ring-offset-2 motion-reduce:transition-none"
        >
          Continue as Guest
        </button>
      )}
    </div>
  );

  // -----------------------------------------------------------------------
  // Render: OTP step
  // -----------------------------------------------------------------------
  const renderOtpStep = () => (
    <div className="flex w-full flex-col items-center">
      <BrandLockup />

      <h1 className="mt-8 text-center text-[28px] font-bold leading-tight tracking-[-0.03em] text-[#111b24]">
        Enter your verification code
      </h1>
      <p className="mt-2 max-w-[320px] text-center text-[14px] leading-5 text-[#5f7188]">
        We sent a 6-digit code to <span className="font-semibold text-[#273846]">{maskedIdentifier}</span>
      </p>

      <div className="mt-7">
        <OtpInput value={otp} onChange={setOtp} />
      </div>

      <div className="mt-7 flex flex-col items-center gap-1">
        <p className="text-[13px] font-medium text-[#5f7188]">Didn&apos;t receive a code?</p>
        <button
          type="button"
          onClick={handleResend}
          disabled={resendTimer > 0}
          className={`min-h-11 rounded-lg px-3 text-[13px] font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/35 focus-visible:ring-offset-2 motion-reduce:transition-none ${
            resendTimer > 0
              ? 'cursor-not-allowed text-[#9aa8a4]'
              : 'cursor-pointer text-[#177564] hover:bg-[#edf7f3] hover:text-[#0f5f4f]'
          }`}
        >
          {resendTimer > 0 ? `Resend code (${resendTimer}s)` : 'Resend code'}
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          setStep('email');
          setOtp(Array(6).fill(''));
          setIsSubmitting(false);
        }}
        className="mt-5 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold text-[#5f7188] transition-colors hover:text-[#177564] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177564]/35 focus-visible:ring-offset-2 motion-reduce:transition-none"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Change {otpTarget?.method === 'email' ? 'email' : 'phone number'}</span>
      </button>
    </div>
  );

  // -----------------------------------------------------------------------
  // Main layout
  // -----------------------------------------------------------------------
      return (
        <main className="min-h-[100dvh] overflow-y-auto bg-[#f7faf9] px-5 py-7 font-sans sm:px-8 sm:py-10">
          <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-[360px] items-center justify-center">
            <div className="w-full py-5 sm:py-6">
              {step === 'email' ? renderEmailStep() : renderOtpStep()}
            </div>
          </div>
        </main>
      );
}
