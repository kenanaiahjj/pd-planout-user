/**
 * @file OnboardingScreen.tsx
 * @description Full-page mobile onboarding flow that runs after first login/signup.
 *
 * Three steps:
 *  1. Profile  — name + avatar photo upload
 *  2. Connect  — connect the missing contact method (phone if logged in via email, or vice-versa)
 *  3. Celebration — finish onboarding
 *
 * Mobile: full-screen, no chrome.
 * Desktop: centered card with decorative side panel (same as login page).
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import imgLogo from '@/assets/5a332411061613331a1ffc8c7aa2ccf247ff8699.png';
import imgHero from '@/assets/80a9288cce0f3fbae7ebd6ed6d5626c04458d6fd.png';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { SecondaryButton } from '@/app/components/SecondaryButton';

// ---------------------------------------------------------------------------
// Country codes
// ---------------------------------------------------------------------------

const COUNTRY_CODES = [
  { code: '+63', flag: '\u{1F1F5}\u{1F1ED}', name: 'Philippines' },
  { code: '+1', flag: '\u{1F1FA}\u{1F1F8}', name: 'United States' },
  { code: '+65', flag: '\u{1F1F8}\u{1F1EC}', name: 'Singapore' },
  { code: '+60', flag: '\u{1F1F2}\u{1F1FE}', name: 'Malaysia' },
  { code: '+66', flag: '\u{1F1F9}\u{1F1ED}', name: 'Thailand' },
  { code: '+62', flag: '\u{1F1EE}\u{1F1E9}', name: 'Indonesia' },
  { code: '+84', flag: '\u{1F1FB}\u{1F1F3}', name: 'Vietnam' },
  { code: '+81', flag: '\u{1F1EF}\u{1F1F5}', name: 'Japan' },
  { code: '+82', flag: '\u{1F1F0}\u{1F1F7}', name: 'South Korea' },
  { code: '+44', flag: '\u{1F1EC}\u{1F1E7}', name: 'United Kingdom' },
  { code: '+61', flag: '\u{1F1E6}\u{1F1FA}', name: 'Australia' },
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface OnboardingScreenProps {
  loginMethod: 'email' | 'phone';
  onComplete: (profile: {
    name: string;
    birthdate?: string;
    avatarUrl?: string;
    contactValue?: string;
    interests: string[];
  }) => void;
  /** Called when user hits the back arrow on step 1 (goes back to login). */
  onBackToLogin?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function OnboardingScreen({
  loginMethod,
  onComplete,
  onBackToLogin,
}: OnboardingScreenProps) {
  const [step, setStep] = useState<1 | 2 | 'celebration'>(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  // Celebration overlay — rendered on top of everything, not via early return
  const [showCelebration, setShowCelebration] = useState(false);

  // Stable ref for onComplete to avoid effect re-triggering
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Snapshot of completion data, captured when user clicks "Get Started"
  const completionDataRef = useRef<Parameters<typeof onComplete>[0] | null>(null);

  // Step 1 state
  const [onbFirstName, setOnbFirstName] = useState('');
  const [onbLastName, setOnbLastName] = useState('');
  const name = `${onbFirstName.trim()} ${onbLastName.trim()}`.trim();
  const [birthdate, setBirthdate] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2 state
  const isPromptingEmail = loginMethod === 'phone';
  const [contactValue, setContactValue] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]); // PH default
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [contactStep, setContactStep] = useState<'input' | 'otp'>('input');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step indicator
  const totalSteps = 2;

  // Helpers
  const goForward = (nextStep: 1 | 2 | 'celebration') => {
    setDirection(1);
    setStep(nextStep);
  };

  const goBack = (prevStep: 1 | 2) => {
    setDirection(-1);
    setStep(prevStep);
  };

  // ── Step 1 handlers ──
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ── Step 2 handlers ──
  const handleSendOtp = () => {
    if (!contactValue.trim()) return;
    setContactStep('otp');
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

  const handleVerifyOtp = useCallback(() => {
    const code = otp.join('');
    if (code.length < 6) {
      setOtpError('Please enter the full 6-digit code.');
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      handleFinish();
    }, 800);
  }, [otp]);

  useEffect(() => {
    if (contactStep === 'otp') {
      setResendTimer(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }, [contactStep]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Auto-submit OTP when all 6 digits are filled
  useEffect(() => {
    if (contactStep === 'otp' && otp.every((d) => d !== '') && !isVerifying) {
      handleVerifyOtp();
    }
  }, [otp, contactStep, isVerifying, handleVerifyOtp]);

  const handleFinish = () => {
    // Prevent double-tap
    if (showCelebration) return;

    // Capture data NOW before any state changes
    const data = {
      name: name.trim(),
      birthdate: birthdate || undefined,
      avatarUrl: avatarPreview ?? undefined,
      contactValue: contactValue.trim() || undefined,
      interests: [],
    };
    completionDataRef.current = data;

    // Show celebration overlay (user will manually tap "Get Started" to proceed)
    setShowCelebration(true);
  };

  /** Called when the user taps "Get Started" on the celebration screen. */
  const handleCelebrationContinue = () => {
    if (completionDataRef.current) {
      onCompleteRef.current(completionDataRef.current);
    }
  };

  // ── Swipe gesture handling ──
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (step === 'celebration') return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Only trigger if horizontal swipe is dominant and large enough
    if (absDeltaX < 60 || absDeltaY > absDeltaX * 0.7) return;

    if (deltaX > 0) {
      // Swiped right → go back
      if (step === 2) goBack(1);
    } else {
      // Swiped left → go forward (only if allowed)
      if (step === 1 && name.trim()) goForward(2);
      else if (step === 2) handleFinish(); // Step 2 is always skippable
    }
  }, [step, name]);

  // ── Masked contact value for OTP ──
  const maskedContact = isPromptingEmail
    ? (() => {
        const [local, domain] = contactValue.split('@');
        if (!domain || local.length <= 4) return contactValue;
        return `${local.slice(0, 3)}${'*'.repeat(Math.min(4, local.length - 3))}@${domain}`;
      })()
    : contactValue;

  // ── Animation variants ──
  const pageVariants = {
    enter: (d: number) => ({
      x: d > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (d: number) => ({
      x: d > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  // -------------------------------------------------------------------------
  // Celebration screen (post-onboarding)
  // -------------------------------------------------------------------------

  // --- Confetti: two waves of particles for depth ---
  const CONFETTI_COLORS = ['#177564', '#3cd4b9', '#def2ee', '#fec84b', '#f97066', '#8b5cf6', '#38bdf8', '#fb923c'];

  const confettiParticles = useRef(
    Array.from({ length: 60 }, (_, i) => {
      const isSecondWave = i >= 30;
      const shapes: ('rect' | 'circle' | 'strip')[] = ['rect', 'circle', 'strip'];
      return {
        id: i,
        x: Math.random() * 100,
        delay: isSecondWave ? 0.4 + Math.random() * 0.5 : Math.random() * 0.35,
        duration: 2.0 + Math.random() * 1.4,
        size: 4 + Math.random() * 8,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        rotation: Math.random() * 360,
        drift: (Math.random() - 0.5) * 80,
        shape: shapes[i % 3],
        wobble: 10 + Math.random() * 20,
      };
    })
  ).current;

  // --- Sparkle dots around the checkmark ---
  const sparkleDots = useRef(
    Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      return {
        id: i,
        angle,
        distance: 60 + Math.random() * 16,
        size: 3 + Math.random() * 4,
        delay: 0.5 + i * 0.05,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      };
    })
  ).current;

  const renderCelebration = () => (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f0fdf8 50%, #f8fafc 100%)' }}
    >
      {/* Subtle radial glow behind icon */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(23,117,100,0.08) 0%, transparent 70%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.15, ease: 'easeOut' }}
      />

      {/* Confetti particles — two waves, mixed shapes */}
      {confettiParticles.map((p) => {
        const w = p.shape === 'strip' ? p.size * 0.4 : p.size;
        const h = p.shape === 'strip' ? p.size * 2.2 : p.shape === 'rect' ? p.size * 1.4 : p.size;
        const radius = p.shape === 'circle' ? '50%' : p.shape === 'strip' ? '2px' : '2px';
        return (
          <motion.div
            key={p.id}
            className="absolute top-0 pointer-events-none"
            style={{
              left: `${p.x}%`,
              width: w,
              height: h,
              backgroundColor: p.color,
              borderRadius: radius,
            }}
            initial={{ y: -20, opacity: 0, rotate: p.rotation, x: 0 }}
            animate={{
              y: '120vh',
              opacity: [0, 1, 1, 0.5, 0],
              x: [0, p.wobble, -p.wobble * 0.6, p.drift],
              rotate: p.rotation + 540 + Math.random() * 360,
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
        );
      })}

      {/* ── Main content column ── */}
      <div className="relative flex flex-col items-center z-10">
        {/* Animated checkmark circle */}
        <motion.div
          className="relative mb-7"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
        >
          {/* Outer glow ring */}
          <motion.div
            className="absolute -inset-3 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(23,117,100,0.12) 40%, transparent 70%)' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <div
            className="relative w-[88px] h-[88px] rounded-full flex items-center justify-center"
            style={{
              backgroundImage: 'linear-gradient(135deg, rgb(60, 212, 185) 0%, rgb(23, 117, 100) 100%)',
              boxShadow: '0 12px 40px rgba(23, 117, 100, 0.3), 0 4px 12px rgba(23, 117, 100, 0.15)',
            }}
          >
            {/* Animated SVG checkmark */}
            <svg className="w-11 h-11" viewBox="0 0 48 48" fill="none">
              <motion.path
                d="M13 24L21 32L35 16"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.55, ease: [0.65, 0, 0.35, 1] }}
              />
            </svg>
          </div>

          {/* Pulse rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full"
              style={{ border: `1.5px solid ${i === 0 ? 'rgba(23,117,100,0.25)' : i === 1 ? 'rgba(60,212,185,0.2)' : 'rgba(222,242,238,0.3)'}` }}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.6 + i * 0.4, opacity: 0 }}
              transition={{ duration: 1.2 + i * 0.2, delay: 0.5 + i * 0.15, ease: 'easeOut' }}
            />
          ))}

          {/* Sparkle dots orbiting */}
          {sparkleDots.map((dot) => (
            <motion.div
              key={dot.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: dot.size,
                height: dot.size,
                backgroundColor: dot.color,
                top: '50%',
                left: '50%',
              }}
              initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
              animate={{
                x: Math.cos(dot.angle) * dot.distance,
                y: Math.sin(dot.angle) * dot.distance,
                scale: [0, 1.3, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 0.8,
                delay: dot.delay,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>

        {/* Welcome heading */}
        <motion.h1
          className="text-[26px] text-[#181d27] tracking-[-0.52px] text-center"
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          Welcome, {name.trim().split(' ')[0]}!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-[15px] text-[#64748b] tracking-[-0.3px] text-center mt-2.5 max-w-[280px] leading-[1.55]"
          initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
        >
          Your profile is ready. Let's find events you'll love.
        </motion.p>

        {/* Divider dot row */}
        <motion.div
          className="flex items-center gap-1.5 mt-6 mb-7"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.4, delay: 1.3 }}
        >
          <div className="w-[120px] h-[1px] rounded-full" style={{ background: 'linear-gradient(90deg, transparent 0%, #177564 50%, transparent 100%)' }} />
        </motion.div>

        {/* Get Started CTA button */}
        <motion.div
          className="w-[280px]"
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 24,
            delay: 1.55,
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <PrimaryButton
            onClick={handleCelebrationContinue}
            fullWidth
            className="rounded-[8px] py-[13px] text-[15px]"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </PrimaryButton>
        </motion.div>
      </div>
    </motion.div>
  );

  // -------------------------------------------------------------------------
  // Step 1: Profile
  // -------------------------------------------------------------------------
  const renderProfileStep = () => (
    <div className="flex flex-col items-center w-full px-6">
      {/* Logo */}
      <div className="w-[48px] h-[48px] lg:w-[56px] lg:h-[56px] mb-3 lg:mb-5">
        <img src={imgLogo} alt="PlanOut" className="w-full h-full object-cover" />
      </div>

      <h1 className="text-[24px] text-[#181d27] tracking-[-0.48px] text-center">
        Complete Your Profile
      </h1>
      <p className="text-[15px] text-[#64748b] tracking-[-0.3px] text-center mt-1.5 lg:mt-2 max-w-[300px] leading-[1.5]">
        Add your name and a profile photo so others can recognize you at events.
      </p>

      {/* Avatar upload */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="relative mt-5 lg:mt-8 mb-1.5 lg:mb-2 group cursor-pointer"
      >
        <div className="w-[88px] h-[88px] lg:w-[100px] lg:h-[100px] rounded-full overflow-hidden border-[3px] border-[#def2ee] shadow-[0px_8px_24px_0px_rgba(23,117,100,0.12)]">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="50" fill="url(#avatarGradBig)" />
              <defs>
                <linearGradient
                  id="avatarGradBig"
                  gradientUnits="userSpaceOnUse"
                  x1="50" x2="50" y1="0" y2="100"
                >
                  <stop stopColor="#3CFFDE" />
                  <stop offset="1" stopColor="#1C5A4F" />
                </linearGradient>
              </defs>
            </svg>
          )}
        </div>
        {/* Camera badge */}
        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#177564] rounded-full flex items-center justify-center border-[2.5px] border-white shadow-md group-hover:scale-110 transition-transform">
          <Camera className="w-4 h-4 text-white" />
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </button>
      <p className="text-[12px] text-[#94a3b8] mb-4 lg:mb-6">Tap to upload a photo</p>

      {/* Name inputs */}
      <div className="w-full max-w-[320px] flex flex-col gap-3">
        <div>
          <label className="block text-[14px] text-[#181d27] tracking-[-0.28px] mb-1.5">First Name <span className="text-[#ef4444]">*</span></label>
          <input
            type="text"
            autoComplete="given-name"
            enterKeyHint="next"
            value={onbFirstName}
            onChange={(e) => setOnbFirstName(e.target.value)}
            placeholder="Juan"
            className="w-full bg-white rounded-[8px] border border-[#d5d7da] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] px-[14px] py-[10px] text-[16px] text-[#181d27] tracking-[-0.48px] placeholder:text-[#64748b] outline-none focus:border-[#6ac3b3] focus:ring-2 focus:ring-[#bae3dc] transition-all"
          />
        </div>
        <div>
          <label className="block text-[14px] text-[#181d27] tracking-[-0.28px] mb-1.5">Last Name <span className="text-[#ef4444]">*</span></label>
          <input
            type="text"
            autoComplete="family-name"
            enterKeyHint="next"
            value={onbLastName}
            onChange={(e) => setOnbLastName(e.target.value)}
            placeholder="Dela Cruz"
            className="w-full bg-white rounded-[8px] border border-[#d5d7da] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] px-[14px] py-[10px] text-[16px] text-[#181d27] tracking-[-0.48px] placeholder:text-[#64748b] outline-none focus:border-[#6ac3b3] focus:ring-2 focus:ring-[#bae3dc] transition-all"
          />
        </div>
      </div>

      {/* Birthdate input */}
      <div className="w-full max-w-[320px] mt-3">
        <label className="block text-[14px] text-[#181d27] tracking-[-0.28px] mb-1.5">
          <span className="inline-flex items-center gap-1.5">
            
            Date of Birth <span className="text-[#ef4444]">*</span>
          </span>
        </label>
        <input
          type="date"
          autoComplete="bday"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="w-full bg-white rounded-[8px] border border-[#d5d7da] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] px-[14px] py-[10px] text-[16px] text-[#181d27] tracking-[-0.48px] placeholder:text-[#64748b] outline-none focus:border-[#6ac3b3] focus:ring-2 focus:ring-[#bae3dc] transition-all appearance-none"
          style={{ colorScheme: 'light' }}
        />
        <p className="text-[11px] text-[#94a3b8] mt-1">Used for age verification at events</p>
      </div>

      {/* CTA */}
      <div className="w-full max-w-[320px] mt-5 lg:mt-8">
        <PrimaryButton
          onClick={() => onbFirstName.trim() && onbLastName.trim() && birthdate && goForward(2)}
          disabled={!onbFirstName.trim() || !onbLastName.trim() || !birthdate}
          fullWidth
          className="rounded-[8px] py-[12px] text-[15px]"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </PrimaryButton>
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // Step 2: Connect Phone/Email (input view — no inline OTP)
  // -------------------------------------------------------------------------
  const renderConnectStep = () => (
    <div className="flex flex-col items-center w-full px-6">
      {/* Icon */}
      

      <h1 className="text-[24px] text-[#181d27] tracking-[-0.48px] text-center">
        {isPromptingEmail ? 'Connect Your Email' : 'Connect Your Phone'}
      </h1>
      <p className="text-[15px] text-[#64748b] tracking-[-0.3px] text-center mt-2 max-w-[300px] leading-[1.5]">
        {isPromptingEmail
          ? 'Add your email address to receive event updates, order confirmations, and promotions.'
          : 'Add your phone number to receive event reminders and quick OTP verification.'}
      </p>

      {/* Input */}
      <div className="w-full max-w-[320px] mt-8">
        <label className="block text-[14px] text-[#181d27] tracking-[-0.28px] mb-1.5">
          {isPromptingEmail ? 'Email Address' : 'Phone Number'}
        </label>

        {isPromptingEmail ? (
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            enterKeyHint="send"
            value={contactValue}
            onChange={(e) => setContactValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
            placeholder="Enter your email address"
            className="w-full bg-white rounded-[8px] border border-[#d5d7da] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] px-[14px] py-[10px] text-[16px] text-[#181d27] tracking-[-0.48px] placeholder:text-[#64748b] outline-none focus:border-[#6ac3b3] focus:ring-2 focus:ring-[#bae3dc] transition-all"
          />
        ) : (
          /* Phone input with country code */
          <div className="flex gap-2">
            {/* Country code selector */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowCountryPicker(!showCountryPicker)}
                className="flex items-center gap-1 bg-white rounded-[8px] border border-[#d5d7da] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] px-2.5 py-[10px] text-[15px] text-[#181d27] hover:bg-[#f8fafc] transition-colors cursor-pointer h-full"
              >
                <span className="text-[18px] leading-none">{selectedCountry.flag}</span>
                <span className="text-[14px] text-[#64748b]">{selectedCountry.code}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8]" />
              </button>

              {/* Dropdown */}
              {showCountryPicker && (
                <div className="absolute top-full left-0 mt-1 z-20 bg-white rounded-[8px] border border-[#e2e8f0] shadow-[0px_8px_24px_rgba(0,0,0,0.1)] py-1 w-[220px] max-h-[200px] overflow-y-auto">
                  {COUNTRY_CODES.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        setSelectedCountry(country);
                        setShowCountryPicker(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-[#f1f5f9] transition-colors cursor-pointer ${
                        selectedCountry.code === country.code ? 'bg-[#f0fdf4]' : ''
                      }`}
                    >
                      <span className="text-[18px]">{country.flag}</span>
                      <span className="text-[14px] text-[#181d27] flex-1">{country.name}</span>
                      <span className="text-[13px] text-[#64748b]">{country.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Phone number input */}
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              enterKeyHint="send"
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
              placeholder="912 345 6789"
              className="flex-1 min-w-0 bg-white rounded-[8px] border border-[#d5d7da] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] px-[14px] py-[10px] text-[16px] text-[#181d27] tracking-[-0.48px] placeholder:text-[#64748b] outline-none focus:border-[#6ac3b3] focus:ring-2 focus:ring-[#bae3dc] transition-all"
            />
          </div>
        )}
      </div>

      {/* CTAs */}
      <div className="w-full max-w-[320px] mt-8 flex flex-col gap-3">
        <PrimaryButton
          onClick={handleSendOtp}
          disabled={!contactValue.trim()}
          fullWidth
          className="rounded-[8px] py-[12px] text-[15px]"
        >
          {isPromptingEmail ? 'Verify Email' : 'Verify Phone'}
          <ArrowRight className="w-4 h-4" />
        </PrimaryButton>
        <SecondaryButton
          onClick={handleFinish}
          fullWidth
          tone="neutral"
          className="rounded-[8px] py-[10px] text-[15px]"
        >
          Skip for now
        </SecondaryButton>
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // Step 2 OTP: Separate full-page OTP verification
  // -------------------------------------------------------------------------
  const renderOtpStep = () => (
    <div className="flex flex-col items-center w-full px-6">
      {/* Icon */}
      

      <h1 className="text-[24px] text-[#181d27] tracking-[-0.48px] text-center">
        Verify Your {isPromptingEmail ? 'Email' : 'Number'}
      </h1>
      <p className="text-[15px] text-[#64748b] tracking-[-0.3px] text-center mt-2 max-w-[300px] leading-[1.5]">
        We sent a 6-digit code to{' '}
        <span className="text-[#181d27]">{maskedContact}</span>
      </p>

      {/* OTP inputs */}
      <div className="w-full max-w-[320px] mt-8">
        <div className="flex gap-2 justify-center">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { otpRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              aria-label={`Verification digit ${i + 1}`}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
              onPaste={i === 0 ? handleOtpPaste : undefined}
              maxLength={1}
              className="w-11 h-12 bg-white rounded-[8px] border border-[#d5d7da] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] text-center text-[20px] text-[#181d27] tracking-[-0.48px] outline-none focus:border-[#6ac3b3] focus:ring-2 focus:ring-[#bae3dc] transition-all"
            />
          ))}
        </div>
        {otpError && (
          <p className="text-[#ff4d4f] text-[13px] mt-3 text-center">{otpError}</p>
        )}
      </div>

      {/* Resend / change */}
      <div className="flex items-center justify-between w-full max-w-[320px] mt-4">
        <button
          onClick={() => {
            setContactStep('input');
            setOtp(['', '', '', '', '', '']);
            setOtpError('');
          }}
          className="text-[#64748b] text-[13px] cursor-pointer hover:underline"
        >
          Change {isPromptingEmail ? 'email' : 'number'}
        </button>
        <button
          onClick={() => {
            if (resendTimer > 0) return;
            setOtp(['', '', '', '', '', '']);
            setResendTimer(30);
            otpRefs.current[0]?.focus();
          }}
          disabled={resendTimer > 0}
          className={`text-[13px] transition-colors ${resendTimer > 0 ? 'text-[#64748b] cursor-not-allowed' : 'text-[#177564] cursor-pointer hover:underline'}`}
        >
          {resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend Code'}
        </button>
      </div>

      {/* CTAs */}
      <div className="w-full max-w-[320px] mt-8 flex flex-col gap-3">
        <PrimaryButton
          onClick={handleVerifyOtp}
          disabled={isVerifying || otp.some((d) => !d)}
          fullWidth
          className="rounded-[8px] py-[12px] text-[15px]"
        >
          {isVerifying ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verifying...
            </span>
          ) : (
            'Verify & Continue'
          )}
        </PrimaryButton>
        <SecondaryButton
          onClick={() => {
            setContactStep('input');
            handleFinish();
          }}
          fullWidth
          tone="neutral"
          className="rounded-[8px] py-[10px] text-[15px]"
        >
          Skip for now
        </SecondaryButton>
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // Progress indicator — single continuous bar, no labels
  // -------------------------------------------------------------------------
  const currentIndex = typeof step === 'number' ? step - 1 : 2;
  const progressPercent = ((currentIndex + 1) / totalSteps) * 100;

  const renderProgress = () => (
    <div className="w-full max-w-[360px] mx-auto">
      <div className="h-[4px] rounded-full overflow-hidden bg-[#e9eaeb]">
        <div
          className="h-full rounded-full bg-[#21a58d] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // Main render
  // -------------------------------------------------------------------------
  return (
    <>
      {/* Celebration overlay — rendered on top, not via early return */}
      {showCelebration && renderCelebration()}

      <div className="fixed inset-0 z-50 bg-[#f8fafc] flex">
        {/* ── Left panel (form) ── */}
        <div className="flex-1 flex flex-col min-h-dvh lg:min-h-0 overflow-hidden">
          {/* Top bar: stacked on mobile, single row on desktop */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-2 px-4 pt-3 pb-0 shrink-0">
            {/* Back button */}
            <button
              onClick={() => {
                if (step === 1) {
                  onBackToLogin?.();
                } else if (step === 2 && contactStep === 'otp') {
                  // OTP sub-page → back to contact input
                  setContactStep('input');
                  setOtp(['', '', '', '', '', '']);
                  setOtpError('');
                } else if (step === 2) {
                  goBack(1);
                }
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#f1f5f9] transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-[#181d27]" />
            </button>

            {/* Progress bar */}
            <div className="lg:flex-1">{renderProgress()}</div>
          </div>

          {/* Step content — animated, with swipe support */}
          <div
            className="flex-1 flex items-start lg:items-center justify-start lg:justify-center overflow-y-auto pt-2 pb-4 lg:py-4"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step === 2 ? `2-${contactStep}` : step}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                className="w-full max-w-[480px] flex flex-col items-center"
              >
                {step === 1 && renderProfileStep()}
                {step === 2 && contactStep === 'input' && renderConnectStep()}
                {step === 2 && contactStep === 'otp' && renderOtpStep()}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* ── Right panel: hero image (desktop only) ── */}
        <div className="hidden lg:flex w-[45%] xl:w-[48%] items-center justify-start p-3 pl-0">
          <div className="w-full h-[calc(100vh-24px)] rounded-[16px] overflow-hidden relative">
            <img
              src={imgHero}
              alt="Adventure landscape"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
            {/* Step indicator overlay */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-[12px] p-5 shadow-lg">
                <p className="text-[#177564] text-[13px] tracking-widest uppercase mb-1">
                  Step {step} of {totalSteps}
                </p>
                <p className="text-[#181d27] text-[20px] tracking-[-0.4px]">
                  {step === 1 && 'Set up your profile'}
                  {step === 2 && 'Connect your contact info'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
