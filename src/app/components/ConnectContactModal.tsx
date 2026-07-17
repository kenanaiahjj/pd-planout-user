/**
 * @file ConnectContactModal.tsx
 * @description Post-profile-setup prompt to connect the missing contact method.
 *
 * If the user logged in with their phone → prompts to connect an email.
 * If the user logged in with email     → prompts to connect a phone number.
 *
 * Uses the same design language as ProfileSetupModal (Figma tokens).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone } from 'lucide-react';
import svgPaths from '../../imports/svg-488h79uj7t';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { FormTextField } from './FormTextField';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ConnectContactModalProps {
  /** Which method the user already has — we'll prompt for the *other* one. */
  existingMethod: 'email' | 'phone';
  /** Called with the value the user provides (or undefined if skipped). */
  onComplete: (value?: string) => void;
  /** Close / skip. */
  onSkip: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ConnectContactModal({
  existingMethod,
  onComplete,
  onSkip,
}: ConnectContactModalProps) {
  const isPromptingEmail = existingMethod === 'phone';
  const [value, setValue] = useState('');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const otpRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleSubmit = () => {
    if (!value.trim()) return;
    // Both email and phone now require OTP verification
    setStep('otp');
  };

  const handleOtpChange = (index: number, digit: string) => {
    if (isVerifying) return;
    if (digit.length > 1) digit = digit.slice(-1);
    if (digit && !/^\d$/.test(digit)) return;
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setOtpError('');
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    for (let i = 0; i < 6; i++) next[i] = pasted[i] || '';
    setOtp(next);
    const focusIdx = Math.min(pasted.length, 5);
    otpRefs.current[focusIdx]?.focus();
  };

  const handleVerify = useCallback(() => {
    const code = otp.join('');
    if (code.length < 6) {
      setOtpError('Please enter the full 6-digit code.');
      return;
    }
    // Mock: accept any 6-digit code — show brief verifying state
    setIsVerifying(true);
    setTimeout(() => {
      onComplete(value.trim());
    }, 800);
  }, [otp, onComplete, value]);

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    setResendTimer(30);
    otpRefs.current[0]?.focus();
  };

  const handleChangeNumber = () => {
    setStep('input');
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
  };

  /** Mask the value for display during OTP step */
  const maskedValue = isPromptingEmail
    ? (() => {
        const [local, domain] = value.split('@');
        if (!domain || local.length <= 4) return value;
        return `${local.slice(0, 3)}${'*'.repeat(Math.min(4, local.length - 3))}@${domain}`;
      })()
    : value;

  // Start resend countdown when entering OTP step
  useEffect(() => {
    if (step === 'otp') {
      setResendTimer(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  // Count down resend timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Auto-submit when all 6 OTP digits are filled
  useEffect(() => {
    if (step === 'otp' && otp.every((d) => d !== '') && !isVerifying) {
      handleVerify();
    }
  }, [otp, step, isVerifying, handleVerify]);

  return (
    /* Backdrop */
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Modal card */}
      <motion.div
        className="bg-white rounded-[12px] shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08),0px_8px_8px_-4px_rgba(10,13,18,0.03)] w-full max-w-[362px] overflow-hidden"
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      >
        {/* ---- Header bar ---- */}
        <div className="flex items-center justify-between bg-[#e9f6f4] px-4 py-3">
          <p className="text-[#177564] text-[20px] font-semibold leading-[1.4] tracking-[-0.4px]">
            {isPromptingEmail ? 'Connect Your Email' : 'Connect Your Phone'}
          </p>
          <button
            onClick={onSkip}
            className="bg-[#def2ee] rounded-[12px] w-6 h-6 flex items-center justify-center shrink-0 hover:bg-[#cbf0e8] transition-colors cursor-pointer"
          >
            <svg className="w-[19.2px] h-[19.2px]" viewBox="0 0 19.2 19.2" fill="none">
              <path d={svgPaths.p19013a00} fill="#125B4E" />
            </svg>
          </button>
        </div>

        {/* ---- Body ---- */}
        <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
          {/* Icon + description */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#def2ee] flex items-center justify-center shrink-0 mt-0.5">
              {isPromptingEmail ? (
                <Mail className="w-5 h-5 text-[#177564]" />
              ) : (
                <Phone className="w-5 h-5 text-[#177564]" />
              )}
            </div>
            <p className="text-[#535862] text-[15px] font-medium leading-[1.5] tracking-[-0.3px]">
              {isPromptingEmail
                ? step === 'otp'
                  ? `We sent a 6-digit verification code to ${maskedValue}. Enter it below to verify your email.`
                  : 'Connect your email to receive event promotions, order confirmations, and important news directly to your inbox.'
                : step === 'otp'
                  ? `We sent a 6-digit verification code to ${value}. Enter it below to verify your number.`
                  : 'Connect your phone number to receive event reminders, SMS confirmations, and quick OTP verification.'}
            </p>
          </div>

          {/* Input */}
          <FormTextField
            label={isPromptingEmail ? 'Email Address' : 'Phone Number'}
            type={isPromptingEmail ? 'email' : 'tel'}
            value={value}
            onChange={setValue}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            disabled={step === 'otp'}
            placeholder={
              isPromptingEmail
                ? 'Enter your email address'
                : 'Enter your phone number'
            }
            labelClassName="text-[16px] font-medium leading-[1.4] tracking-[-0.48px] text-[#414651]"
            frameClassName="rounded-[8px]"
            inputClassName="text-[16px] text-[#121212] tracking-[-0.48px] placeholder:text-[#64748b] font-medium"
          />

          {/* OTP Verification */}
          {step === 'otp' && (
            <div className="flex flex-col gap-[6px]">
              <label className="text-[#414651] text-[16px] font-medium leading-[1.4] tracking-[-0.48px]">
                Enter OTP
              </label>
              <div className="flex gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    maxLength={1}
                    className="w-10 h-10 bg-white rounded-[8px] border border-[#d5d7da] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] text-center text-[18px] text-[#121212] tracking-[-0.48px] font-medium outline-none focus:border-[#6ac3b3] focus:ring-2 focus:ring-[#bae3dc] transition-all"
                  />
                ))}
              </div>
              {otpError && (
                <p className="text-[#ff4d4f] text-[14px] font-medium leading-[1.5] tracking-[-0.3px]">
                  {otpError}
                </p>
              )}
              <div className="flex items-center justify-between mt-1">
                <button
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0}
                  className={`text-[14px] font-medium leading-[1.5] tracking-[-0.3px] transition-colors ${
                    resendTimer > 0
                      ? 'text-[#64748b] cursor-not-allowed'
                      : 'text-[#177564] cursor-pointer hover:underline'
                  }`}
                >
                  {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : 'Resend OTP'}
                </button>
                <button
                  onClick={handleChangeNumber}
                  className="text-[#64748b] text-[14px] font-medium leading-[1.5] tracking-[-0.3px] cursor-pointer hover:underline"
                >
                  {isPromptingEmail ? 'Change Email' : 'Change Number'}
                </button>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            {/* Skip */}
            <SecondaryButton onClick={onSkip} fullWidth tone="neutral" className="rounded-[8px] text-[16px]">
              Skip for now
            </SecondaryButton>

            {/* Connect */}
            <PrimaryButton
              onClick={step === 'input' ? handleSubmit : handleVerify}
              disabled={!value.trim() || isVerifying}
              fullWidth
              className="rounded-[8px] text-[16px]"
            >
              {isVerifying ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : step === 'otp' ? 'Verify' : 'Connect'}
            </PrimaryButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
