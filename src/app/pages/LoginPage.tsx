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

// ---------------------------------------------------------------------------
// Social icon SVGs (from Figma import)
// ---------------------------------------------------------------------------

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 shrink-0 animate-pulse-slow" viewBox="0 0 24 24" fill="none">
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
      className="group relative w-full bg-white rounded-full flex items-center justify-center gap-3 px-5 py-2.5 border border-slate-200/80 shadow-[0_1.5px_3px_rgba(10,13,18,0.03)] hover:bg-slate-50 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(10,13,18,0.05)] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
      <span className="relative z-10 transition-transform duration-300 group-hover:scale-105">{icon}</span>
      <span className="relative z-10 text-[#344054] text-[14px] font-semibold tracking-tight">
        {label}
      </span>
    </button>
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
        const hasValue = !!value[i];
        return (
          <div
            key={i}
            className={`group relative p-[2.5px] rounded-[16px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              isFocused
                ? 'bg-gradient-to-b from-[#28b99e] to-[#177564] shadow-[0_12px_24px_-8px_rgba(23,117,100,0.25)] scale-[1.06]'
                : 'bg-slate-200/50 hover:bg-slate-300/60 shadow-[0_2px_4px_rgba(0,0,0,0.01)]'
            }`}
          >
            <div className={`relative w-[44px] h-[48px] sm:w-[54px] sm:h-[60px] rounded-[13.5px] bg-white flex items-center justify-center transition-all ${
              isFocused ? 'shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.95)]' : 'shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]'
            }`}>
              <input
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={value[i] || ''}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className="absolute inset-0 w-full h-full text-center text-[22px] sm:text-[28px] font-bold tracking-tight text-slate-800 bg-transparent outline-none select-none transition-colors"
                style={{ caretColor: '#177564' }}
              />
              
              {/* Tactile indicator dot / line inside */}
              <div className={`absolute bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                hasValue 
                  ? 'opacity-0 scale-50' 
                  : isFocused 
                    ? 'bg-[#177564] scale-100 animate-pulse' 
                    : 'bg-slate-300 scale-75'
              }`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface LoginPageProps {
  onLoginComplete: (method: 'email' | 'phone', value: string) => void;
  /** Allow guest browsing — navigates back without logging in. */
  onContinueAsGuest?: () => void;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function LoginPage({ onLoginComplete, onContinueAsGuest }: LoginPageProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [inputMode, setInputMode] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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
    if (otp.every((d) => d !== '')) {
      setIsSubmitting(true);
      const timeout = setTimeout(() => {
        const value = inputMode === 'email' ? email.trim() : phone.trim();
        onLoginComplete(inputMode, value);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [otp, onLoginComplete, inputMode, email, phone]);

  const handleContinue = useCallback(() => {
    const val = inputMode === 'email' ? email.trim() : phone.trim();
    if (!val) return;
    setIsSubmitting(true);
    // Simulate sending OTP
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
    }, 600);
  }, [email, phone, inputMode]);

  const handleResend = useCallback(() => {
    if (resendTimer > 0) return;
    setOtp(Array(6).fill(''));
    setResendTimer(30);
  }, [resendTimer]);

  const identifier = inputMode === 'email' ? email : phone;
  const maskedIdentifier =
    inputMode === 'email' ? maskEmail(email) : `${phone.slice(0, 4)}****${phone.slice(-2)}`;

  // -----------------------------------------------------------------------
  // Render: Email / Phone step
  // -----------------------------------------------------------------------
  const renderEmailStep = () => (
    <div className="flex flex-col items-center w-full animate-in fade-in duration-500">
      {/* Logo */}
      <div className="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] mb-4 group transition-transform duration-500 hover:scale-105">
        <img src={imgLogo} alt="PlanOut" className="w-full h-full object-cover rounded-2xl" />
      </div>

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

        {/* Segmented tab toggle with sliding background */}
        <div className="relative flex w-full bg-[#f1f5f9]/80 rounded-full p-[3px] mb-5 border border-black/[0.03] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
          {/* Sliding active background */}
          <div
            className="absolute top-[3px] bottom-[3px] left-[3px] rounded-full bg-white shadow-[0px_2px_6px_0px_rgba(10,13,18,0.06),0px_1px_2px_0px_rgba(10,13,18,0.04)] border border-black/[0.02] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{
              width: 'calc(50% - 3px)',
              transform: inputMode === 'email' ? 'translateX(0)' : 'translateX(100%)',
            }}
          />
          
          <button
            onClick={() => setInputMode('email')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full text-[13px] font-bold tracking-tight transition-colors duration-300 cursor-pointer ${
              inputMode === 'email' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <EmailIcon />
            <span>Email</span>
          </button>
          <button
            onClick={() => setInputMode('phone')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full text-[13px] font-bold tracking-tight transition-colors duration-300 cursor-pointer ${
              inputMode === 'phone' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <PhoneIcon />
            <span>Phone</span>
          </button>
        </div>

        {/* Double Bezel Input Field */}
        <div className="relative mb-4 group">
          <div className="relative p-[1.5px] rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-300 focus-within:bg-gradient-to-b focus-within:from-[#28b99e]/40 focus-within:to-[#177564]/30 focus-within:shadow-[0_4px_16px_rgba(23,117,100,0.06)] focus-within:border-transparent">
            <div className="relative rounded-[calc(9999px-1.5px)] bg-white px-5 py-3 flex items-center gap-3 shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.01)] border border-transparent">
              <span className="text-slate-400 group-focus-within:text-[#177564] transition-colors duration-300">
                {inputMode === 'email' ? (
                  <svg className="w-4 h-4" viewBox="0 0 14 11" fill="none">
                    <path
                      d="M1 1L7 6L13 1M1 1H13V10H1V1Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg className="w-4.5 h-4.5" viewBox="0 0 11.4372 18" fill="none">
                    <path
                      d="M1 1.7L10.4 1.7M1.7 5H9.7M5.7 14.5V14.5M1.7 1H9.7C10.1 1 10.4 1.3 10.4 1.7V16.3C10.4 16.7 10.1 17 9.7 17H1.7C1.3 17 1 16.7 1 16.3V1.7C1 1.3 1.3 1 1.7 1Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              
              <input
                type={inputMode === 'email' ? 'email' : 'tel'}
                value={inputMode === 'email' ? email : phone}
                onChange={(e) =>
                  inputMode === 'email' ? setEmail(e.target.value) : setPhone(e.target.value)
                }
                onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                placeholder={
                  inputMode === 'email' ? 'Enter email address' : 'Enter phone number'
                }
                className="w-full bg-transparent text-[14.5px] text-slate-800 placeholder:text-slate-400 font-semibold outline-none border-none p-0 focus:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Continue button */}
        <PrimaryButton
          onClick={handleContinue}
          disabled={isSubmitting || !identifier.trim()}
          fullWidth
          className="rounded-full py-2.5 text-[14px] font-bold tracking-tight"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2.5">
              <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending Security Code...
            </span>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="w-4.5 h-4.5" strokeWidth={2.2} />
            </>
          )}
        </PrimaryButton>
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
          className="group mt-8 text-[13px] font-bold text-slate-500 hover:text-[#177564] tracking-tight transition-colors duration-300 flex items-center gap-1 cursor-pointer"
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
      <div className="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] mb-4 group transition-transform duration-500 hover:scale-105">
        <img src={imgLogo} alt="PlanOut" className="w-full h-full object-cover rounded-2xl" />
      </div>

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
          className={`text-[14px] font-extrabold tracking-tight transition-colors duration-300 ${
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
        className="group mt-8 text-[13.5px] font-semibold text-slate-500 hover:text-[#177564] tracking-tight transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Change {inputMode === 'email' ? 'email' : 'phone number'}</span>
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
                <div className="p-[1.5px] rounded-full bg-white/10 border border-white/5 shadow-inner">
                  <div className="px-3 py-1 rounded-full bg-[#177564]/55 text-white text-[10px] font-bold tracking-tight shadow-sm">
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
