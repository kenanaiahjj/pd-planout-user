/**
 * @file AccountTab.tsx
 * @description Account settings tab — profile editing, social links, emails,
 * phone number, and account deletion. Mobile-first design.
 */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Camera,
  Plus,
  X,
  AlertTriangle,
  Check,
  Mail,
  Pencil,
  Send,
  Phone,
  ShieldCheck,
  Trash2,
  Link2,
  ArrowUpCircle,
} from 'lucide-react';
import { PrimaryButton } from '../PrimaryButton';
import { SecondaryButton } from '../SecondaryButton';
import { IconButton } from '../IconButton';
import { FormTextField, FormTextarea } from '../FormTextField';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { AnimatePresence, motion } from 'motion/react';
import { ConfirmDialog } from '../ConfirmDialog';
import { useAppContext } from '@/app/context/AppContext';

// --- Shared input styles ---
const INPUT_CLS =
  'w-full bg-white border border-slate-200/80 rounded-full px-4 py-2.5 text-[#181d27] text-sm placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#177564]/10 focus:border-[#177564] transition-all shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.005)]';

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-5 sm:p-6 flex flex-col gap-5 shadow-[0px_1px_3px_0px_rgba(15,23,42,0.03)]">
      {children}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h3 className="text-[#181d27] text-[16px] font-semibold">{title}</h3>
      {subtitle && <p className="text-[#94a3b8] text-[13px] mt-0.5">{subtitle}</p>}
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[#414651] text-[13px] font-semibold">
      {children}
      {required && <span className="ml-0.5 text-[#fec84b]">*</span>}
    </label>
  );
}

export function AccountTab() {
  const { userProfile, setUserProfile } = useAppContext();

  const [firstName, setFirstName] = useState(userProfile.name?.split(' ')[0] || 'Jessica');
  const [lastName, setLastName] = useState(userProfile.name?.split(' ').slice(1).join(' ') || 'Sanchez');
  const [birthdate, setBirthdate] = useState(userProfile.birthdate || '');
  const [bio, setBio] = useState('');
  const [socialLinks, setSocialLinks] = useState<string[]>(['Instagram', 'Twitter']);
  const [newSocial, setNewSocial] = useState('');
  const [email, setEmailLocal] = useState(userProfile.email || 'jessica@email.com');
  const [phone, setPhoneLocal] = useState(userProfile.phone || '+63 961 480 2451');
  const [saved, setSaved] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Social link removal confirm state
  const [removeSocialIdx, setRemoveSocialIdx] = useState<number | null>(null);
  // Secondary email removal confirm state
  const [removeEmailIdx, setRemoveEmailIdx] = useState<number | null>(null);

  // Wrap setEmail / setPhone so they sync to context
  const setEmail = useCallback((val: string) => {
    setEmailLocal(val);
    setUserProfile((p) => ({ ...p, email: val }));
  }, [setUserProfile]);

  const setPhone = useCallback((val: string) => {
    setPhoneLocal(val);
    setUserProfile((p) => ({ ...p, phone: val }));
  }, [setUserProfile]);

  // Email editing state
  const [emailEditing, setEmailEditing] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailLinkSent, setEmailLinkSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const resendTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Secondary emails state
  interface SecondaryEmail {
    email: string;
    verified: boolean;
  }
  const [secondaryEmails, setSecondaryEmails] = useState<SecondaryEmail[]>([]);
  const [addingEmail, setAddingEmail] = useState(false);
  const [addEmailValue, setAddEmailValue] = useState('');
  const [addEmailError, setAddEmailError] = useState('');
  const [addEmailSent, setAddEmailSent] = useState(false);
  const [addEmailResendCooldown, setAddEmailResendCooldown] = useState(0);
  const addEmailResendTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const addEmailInputRef = useRef<HTMLInputElement>(null);

  // Phone editing state
  type PhoneStep = 'display' | 'input' | 'otp' | 'success';
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('display');
  const [newPhone, setNewPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [phoneResendCooldown, setPhoneResendCooldown] = useState(0);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const phoneResendTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  // Set-as-primary OTP re-verification state
  const [primaryOtpTarget, setPrimaryOtpTarget] = useState<number | null>(null);
  const [primaryOtpDigits, setPrimaryOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [primaryOtpError, setPrimaryOtpError] = useState('');
  const [primaryOtpVerifying, setPrimaryOtpVerifying] = useState(false);
  const [primaryOtpCooldown, setPrimaryOtpCooldown] = useState(0);
  const [primaryOtpSuccess, setPrimaryOtpSuccess] = useState(false);
  const primaryOtpTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const primaryOtpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isValidPhone = (v: string) => /^\+?[\d\s\-().]{7,20}$/.test(v.trim());

  const startResendCooldown = useCallback(() => {
    setResendCooldown(30);
    if (resendTimerRef.current) clearInterval(resendTimerRef.current);
    resendTimerRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (resendTimerRef.current) clearInterval(resendTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const startAddEmailResendCooldown = useCallback(() => {
    setAddEmailResendCooldown(30);
    if (addEmailResendTimerRef.current) clearInterval(addEmailResendTimerRef.current);
    addEmailResendTimerRef.current = setInterval(() => {
      setAddEmailResendCooldown((prev) => {
        if (prev <= 1) {
          if (addEmailResendTimerRef.current) clearInterval(addEmailResendTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (resendTimerRef.current) clearInterval(resendTimerRef.current);
      if (phoneResendTimerRef.current) clearInterval(phoneResendTimerRef.current);
      if (addEmailResendTimerRef.current) clearInterval(addEmailResendTimerRef.current);
      if (primaryOtpTimerRef.current) clearInterval(primaryOtpTimerRef.current);
    };
  }, []);

  // Sync defaults to context on mount (so Header/Dropdown show correct values)
  useEffect(() => {
    if (!userProfile.email && email) {
      setUserProfile((p) => ({ ...p, email }));
    }
    if (!userProfile.phone && phone) {
      setUserProfile((p) => ({ ...p, phone }));
    }
    if (!userProfile.name && (firstName || lastName)) {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      if (fullName) setUserProfile((p) => ({ ...p, name: fullName }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEmailEdit = () => {
    setNewEmail(email);
    setEmailEditing(true);
    setEmailLinkSent(false);
    setEmailError('');
    setTimeout(() => emailInputRef.current?.focus(), 50);
  };

  const handleEmailCancel = () => {
    setEmailEditing(false);
    setNewEmail('');
    setEmailError('');
  };

  const handleEmailSend = () => {
    if (!newEmail.trim()) {
      setEmailError('Email address is required.');
      return;
    }
    if (!isValidEmail(newEmail.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    if (newEmail.trim().toLowerCase() === email.toLowerCase()) {
      setEmailError('New email must be different from your current one.');
      return;
    }
    const matchingSecondary = secondaryEmails.find(
      (se) => se.email.toLowerCase() === newEmail.trim().toLowerCase()
    );
    if (matchingSecondary) {
      setEmailError(
        matchingSecondary.verified
          ? 'This email is already added as a secondary email. Use "Set as Primary" on that email instead.'
          : 'This email is already added as an unverified secondary email. Verify it first, then use "Set as Primary".'
      );
      return;
    }
    setEmailError('');
    setEmailLinkSent(true);
    startResendCooldown();
    setTimeout(() => {
      setEmail(newEmail.trim());
      setEmailEditing(false);
      setEmailLinkSent(false);
      setNewEmail('');
    }, 4000);
  };

  // Phone editing handlers
  const startPhoneResendCooldown = useCallback(() => {
    setPhoneResendCooldown(30);
    if (phoneResendTimerRef.current) clearInterval(phoneResendTimerRef.current);
    phoneResendTimerRef.current = setInterval(() => {
      setPhoneResendCooldown((prev) => {
        if (prev <= 1) {
          if (phoneResendTimerRef.current) clearInterval(phoneResendTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handlePhoneUpdate = () => {
    setNewPhone('');
    setPhoneError('');
    setOtpError('');
    setOtpDigits(['', '', '', '', '', '']);
    setPhoneStep('input');
    setTimeout(() => phoneInputRef.current?.focus(), 50);
  };

  const handlePhoneCancel = () => {
    setPhoneStep('display');
    setNewPhone('');
    setPhoneError('');
    setOtpError('');
    setOtpDigits(['', '', '', '', '', '']);
    if (phoneResendTimerRef.current) clearInterval(phoneResendTimerRef.current);
    setPhoneResendCooldown(0);
  };

  const handlePhoneSendOtp = () => {
    if (!newPhone.trim()) {
      setPhoneError('Phone number is required.');
      return;
    }
    if (!isValidPhone(newPhone)) {
      setPhoneError('Please enter a valid phone number.');
      return;
    }
    if (newPhone.trim() === phone) {
      setPhoneError('New number must be different from your current one.');
      return;
    }
    setPhoneError('');
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError('');
    setPhoneStep('otp');
    startPhoneResendCooldown();
    setTimeout(() => otpInputsRef.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const next = [...otpDigits];
    next[index] = value;
    setOtpDigits(next);
    if (otpError) setOtpError('');
    if (value && index < 5) otpInputsRef.current[index + 1]?.focus();
    if (value && index === 5 && next.every((d) => d !== '')) handleOtpVerify(next);
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...otpDigits];
    for (let i = 0; i < 6; i++) next[i] = pasted[i] || '';
    setOtpDigits(next);
    if (otpError) setOtpError('');
    const focusIdx = Math.min(pasted.length, 5);
    otpInputsRef.current[focusIdx]?.focus();
    if (next.every((d) => d !== '')) handleOtpVerify(next);
  };

  const handleOtpVerify = (digits?: string[]) => {
    const code = (digits || otpDigits).join('');
    if (code.length < 6) { setOtpError('Please enter all 6 digits.'); return; }
    setOtpVerifying(true);
    setTimeout(() => {
      setOtpVerifying(false);
      setPhone(newPhone.trim());
      setPhoneStep('success');
      if (phoneResendTimerRef.current) clearInterval(phoneResendTimerRef.current);
      setTimeout(() => {
        setPhoneStep('display');
        setNewPhone('');
        setOtpDigits(['', '', '', '', '', '']);
      }, 2500);
    }, 1200);
  };

  const handleSave = () => {
    // Sync name to context
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    setUserProfile((p) => ({ ...p, name: fullName }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const removeSocial = (index: number) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const addSocial = () => {
    if (newSocial.trim()) {
      setSocialLinks((prev) => [...prev, newSocial.trim()]);
      setNewSocial('');
    }
  };

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCoverPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddEmail = () => {
    setAddingEmail(true);
    setAddEmailValue('');
    setAddEmailError('');
    setAddEmailSent(false);
    setAddEmailResendCooldown(0);
    if (addEmailResendTimerRef.current) clearInterval(addEmailResendTimerRef.current);
    setTimeout(() => addEmailInputRef.current?.focus(), 50);
  };

  const handleAddEmailCancel = () => {
    setAddingEmail(false);
    setAddEmailValue('');
    setAddEmailError('');
    setAddEmailSent(false);
    setAddEmailResendCooldown(0);
    if (addEmailResendTimerRef.current) clearInterval(addEmailResendTimerRef.current);
  };

  const handleAddEmailSend = () => {
    if (!addEmailValue.trim()) { setAddEmailError('Email address is required.'); return; }
    if (!isValidEmail(addEmailValue.trim())) { setAddEmailError('Please enter a valid email address.'); return; }
    if (addEmailValue.trim().toLowerCase() === email.toLowerCase()) { setAddEmailError('This is already your primary email.'); return; }
    if (secondaryEmails.some((e) => e.email.toLowerCase() === addEmailValue.trim().toLowerCase())) { setAddEmailError('This email is already added.'); return; }
    if (secondaryEmails.length >= 5) { setAddEmailError('You can add up to 5 secondary emails.'); return; }
    setAddEmailError('');
    setAddEmailSent(true);
    startAddEmailResendCooldown();
    setTimeout(() => {
      setSecondaryEmails((prev) => [...prev, { email: addEmailValue.trim(), verified: false }]);
      setAddingEmail(false);
      setAddEmailValue('');
      setAddEmailError('');
      setAddEmailSent(false);
      setAddEmailResendCooldown(0);
      if (addEmailResendTimerRef.current) clearInterval(addEmailResendTimerRef.current);
    }, 4000);
  };

  // --- Set-as-primary OTP helpers ---
  const startPrimaryOtpCooldown = useCallback(() => {
    setPrimaryOtpCooldown(30);
    if (primaryOtpTimerRef.current) clearInterval(primaryOtpTimerRef.current);
    primaryOtpTimerRef.current = setInterval(() => {
      setPrimaryOtpCooldown((prev) => {
        if (prev <= 1) {
          if (primaryOtpTimerRef.current) clearInterval(primaryOtpTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  /** ConfirmDialog confirmed -> start OTP verification */
  const handleStartPrimaryOtp = (index: number) => {
    setPrimaryOtpTarget(index);
    setPrimaryOtpDigits(['', '', '', '', '', '']);
    setPrimaryOtpError('');
    setPrimaryOtpVerifying(false);
    setPrimaryOtpSuccess(false);
    startPrimaryOtpCooldown();
    setTimeout(() => primaryOtpInputsRef.current[0]?.focus(), 100);
  };

  const handlePrimaryOtpCancel = () => {
    setPrimaryOtpTarget(null);
    setPrimaryOtpDigits(['', '', '', '', '', '']);
    setPrimaryOtpError('');
    setPrimaryOtpVerifying(false);
    setPrimaryOtpSuccess(false);
    setPrimaryOtpCooldown(0);
    if (primaryOtpTimerRef.current) clearInterval(primaryOtpTimerRef.current);
  };

  const handlePrimaryOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const next = [...primaryOtpDigits];
    next[index] = value;
    setPrimaryOtpDigits(next);
    if (primaryOtpError) setPrimaryOtpError('');
    if (value && index < 5) primaryOtpInputsRef.current[index + 1]?.focus();
    if (value && index === 5 && next.every((d) => d !== '')) handlePrimaryOtpVerify(next);
  };

  const handlePrimaryOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !primaryOtpDigits[index] && index > 0) {
      primaryOtpInputsRef.current[index - 1]?.focus();
    }
  };

  const handlePrimaryOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = [...primaryOtpDigits];
    for (let i = 0; i < 6; i++) next[i] = pasted[i] || '';
    setPrimaryOtpDigits(next);
    if (primaryOtpError) setPrimaryOtpError('');
    const focusIdx = Math.min(pasted.length, 5);
    primaryOtpInputsRef.current[focusIdx]?.focus();
    if (next.every((d) => d !== '')) handlePrimaryOtpVerify(next);
  };

  /** Verify OTP then perform the swap */
  const handlePrimaryOtpVerify = (digits?: string[]) => {
    const code = (digits || primaryOtpDigits).join('');
    if (code.length < 6) { setPrimaryOtpError('Please enter all 6 digits.'); return; }
    setPrimaryOtpVerifying(true);
    setTimeout(() => {
      if (primaryOtpTarget === null) return;
      const promoted = secondaryEmails[primaryOtpTarget];
      if (!promoted) { setPrimaryOtpVerifying(false); return; }
      const oldPrimary = email;
      setEmail(promoted.email);
      setSecondaryEmails((prev) => {
        const next = prev.filter((_, idx) => idx !== primaryOtpTarget);
        return [{ email: oldPrimary, verified: true }, ...next];
      });
      setEmailEditing(false);
      setEmailLinkSent(false);
      setNewEmail('');
      setEmailError('');
      setPrimaryOtpVerifying(false);
      setPrimaryOtpSuccess(true);
      if (primaryOtpTimerRef.current) clearInterval(primaryOtpTimerRef.current);
      setTimeout(() => {
        setPrimaryOtpTarget(null);
        setPrimaryOtpSuccess(false);
        setPrimaryOtpDigits(['', '', '', '', '', '']);
      }, 2500);
    }, 1200);
  };

  // ---------- Social link icon map ----------
  const socialIconMap: Record<string, string> = {
    instagram: 'Instagram',
    twitter: 'Twitter / X',
    facebook: 'Facebook',
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
    tiktok: 'TikTok',
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-300">
      {/* Your Profile */}
      <SectionCard>
        <SectionHeader title="Your Profile" />

        {/* Avatar */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[#94a3b8] text-[13px] font-medium">Profile Photo</p>
          <div className="relative w-[88px] h-[88px]">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#177564] to-[#21a58d] flex items-center justify-center text-white text-[28px] font-bold">
              {firstName.charAt(0)}{lastName.charAt(0)}
            </div>
            <IconButton
              aria-label="Update profile photo"
              size="sm"
              tone="primary"
              className="absolute -bottom-0.5 -right-0.5 border-2 border-white shadow-sm"
            >
              <Camera className="w-3.5 h-3.5" />
            </IconButton>
          </div>
        </div>

        {/* Cover Photo */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[#94a3b8] text-[13px] font-medium">Cover Photo</p>
          <div
            onClick={() => coverInputRef.current?.click()}
            className="w-full h-24 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#177564] bg-slate-50/50 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_4px_20px_rgba(23,117,100,0.04)] overflow-hidden"
          >
            {coverPhoto ? (
              <ImageWithFallback src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <>
                <Camera className="w-5 h-5 text-[#94a3b8]" />
                <p className="text-[#94a3b8] text-[12px]">Upload cover photo</p>
              </>
            )}
          </div>
          <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverPhotoChange} />
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <FormTextField
            label="First Name"
            required
            value={firstName}
            onChange={setFirstName}
            placeholder="First name"
          />
          <FormTextField
            label="Last Name"
            required
            value={lastName}
            onChange={setLastName}
            placeholder="Last name"
          />
        </div>

        {/* Birthdate */}
        <FormTextField
          label="Date of Birth"
          type="date"
          value={birthdate}
          onChange={setBirthdate}
          placeholder="Date of birth"
        />

        {/* Bio */}
        <FormTextarea
          label="Bio"
          value={bio}
          onChange={setBio}
          placeholder="Tell us about yourself..."
          rows={3}
        />

        {/* Social Links */}
        <div className="flex flex-col gap-2">
          <FieldLabel>Social Links</FieldLabel>
          <AnimatePresence initial={false}>
            {socialLinks.map((link, i) => (
              <motion.div
                key={`${link}-${i}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <div className="flex-1 flex items-center gap-2 bg-slate-50/80 border border-slate-200/60 rounded-full px-4 py-2">
                  <Link2 className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
                  <span className="text-[#181d27] text-sm truncate">{link}</span>
                </div>
                <ConfirmDialog
                  trigger={
                    <button className="text-[#94a3b8] hover:text-[#dc2626] transition-colors shrink-0" title="Remove link">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  }
                  icon={<Link2 className="w-6 h-6" />}
                  iconVariant="destructive"
                  title="Remove Social Link?"
                  description={<>Are you sure you want to remove <strong>{link}</strong>? This action cannot be undone.</>}
                  confirmLabel="Yes, Remove"
                  cancelLabel="Cancel"
                  variant="destructive"
                  onConfirm={() => removeSocial(i)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="flex items-center gap-2">
            <input
              type="url"
              inputMode="url"
              autoComplete="url"
              enterKeyHint="done"
              aria-label="Social profile URL"
              className={INPUT_CLS}
              value={newSocial}
              onChange={(e) => setNewSocial(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSocial()}
              placeholder="Add social link (e.g. Instagram)"
            />
            <IconButton
              onClick={addSocial}
              disabled={!newSocial.trim()}
              aria-label="Add social link"
              tone="primary"
              className="h-9 w-9 shadow-sm"
            >
              <Plus className="w-4 h-4" />
            </IconButton>
          </div>
        </div>

        {/* Save */}
        <div>
          <PrimaryButton onClick={handleSave} compact>
            <Check className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save Changes'}
          </PrimaryButton>
        </div>
      </SectionCard>

      {/* Emails */}
      <SectionCard>
        <SectionHeader
          title="Emails"
          subtitle="Your primary email is used to log in. Add secondary emails to receive event invites sent to those addresses."
        />
        <div className="bg-[#f0fdf9]/60 backdrop-blur-sm border border-[#177564]/20 rounded-2xl p-4 flex flex-col gap-0 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {!emailEditing ? (
              /* ---- Default display ---- */
              <motion.div
                key="display"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[#181d27] text-[14px] font-semibold truncate">{email}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                     <p className="text-[#177564] text-[12px]">Primary email</p>
                     <span className="text-[#cbd5e1] text-[10px]">&bull;</span>
                     <p className="text-[#94a3b8] text-[11px]">Used to log in</p>
                  </div>
                </div>
                <button
                  onClick={handleEmailEdit}
                  className="text-[#94a3b8] hover:text-[#177564] transition-colors shrink-0"
                  title="Edit email"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </motion.div>
            ) : !emailLinkSent ? (
              /* ---- Editing state ---- */
              <motion.div
                key="editing"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3"
              >
                <div>
                  <p className="text-[#181d27] text-[13px] font-semibold mb-1.5">Change email address</p>
                  <p className="text-[#64748b] text-[12px] leading-relaxed">
                    We'll send a verification link to your new email address.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                <input
                  ref={emailInputRef}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  enterKeyHint="send"
                    value={newEmail}
                    onChange={(e) => {
                      setNewEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleEmailSend()}
                    placeholder="Enter new email address"
                    className={`${INPUT_CLS} ${emailError ? '!border-[#dc2626] !ring-[#dc2626]/20' : ''}`}
                  />
                  {emailError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[#dc2626] text-[12px]"
                    >
                      {emailError}
                    </motion.p>
                  )}
                </div>
                <div className="flex gap-2">
                  <SecondaryButton onClick={handleEmailCancel} compact tone="neutral" className="rounded-full">
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton onClick={handleEmailSend} compact className="rounded-full">
                    <Send className="w-3.5 h-3.5" />
                    Send Verification Link
                  </PrimaryButton>
                </div>
              </motion.div>
            ) : (
              /* ---- Link sent confirmation ---- */
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-2.5 items-center text-center py-2"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                  className="w-10 h-10 rounded-full bg-[#177564] flex items-center justify-center"
                >
                  <Mail className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <p className="text-[#181d27] text-[14px] font-semibold">Verification link sent!</p>
                  <p className="text-[#64748b] text-[12px] mt-1 leading-relaxed">
                    We've sent a link to <span className="font-semibold text-[#177564]">{newEmail}</span>.
                    <br />
                    Click the link in the email to confirm the change.
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <button
                    onClick={() => { if (resendCooldown === 0) startResendCooldown(); }}
                    disabled={resendCooldown > 0}
                    className={`text-[12px] font-semibold transition-colors ${
                      resendCooldown > 0 ? 'text-[#94a3b8] cursor-default' : 'text-[#177564] hover:underline'
                    }`}
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend link'}
                  </button>
                  <span className="text-[#64748b] text-[12px]">|</span>
                  <button
                    onClick={handleEmailCancel}
                    className="text-[#94a3b8] text-[12px] font-medium hover:text-[#64748b] transition-colors"
                  >
                    Cancel change
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Secondary emails list */}
        <AnimatePresence initial={false}>
          {secondaryEmails.map((se, i) => (
            <motion.div
              key={se.email}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white border border-slate-200/60 rounded-2xl p-4 flex items-center gap-3 shadow-[0px_1px_3px_0px_rgba(15,23,42,0.02)]">
                <div className="flex-1 min-w-0">
                  <p className="text-[#181d27] text-[14px] font-semibold truncate">{se.email}</p>
                  <p className={`text-[12px] mt-0.5 ${se.verified ? 'text-[#177564]' : 'text-[#f59e0b]'}`}>
                    {se.verified ? 'Verified' : 'Unverified \u2014 check your inbox'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!se.verified && (
                    <button
                      onClick={() => {
                        setSecondaryEmails((prev) =>
                          prev.map((e, idx) => (idx === i ? { ...e, verified: true } : e))
                        );
                      }}
                      className="text-[#177564] text-[12px] font-semibold hover:underline"
                    >
                      Verify
                    </button>
                  )}
                  {se.verified && (
                    <ConfirmDialog
                      trigger={
                        <button
                          className="text-[#177564] text-[12px] font-semibold hover:underline flex items-center gap-1"
                          title="Set as primary login email"
                        >
                          <ArrowUpCircle className="w-3 h-3" />
                          Set as Primary
                        </button>
                      }
                      icon={<Mail className="w-6 h-6" />}
                      iconVariant="info"
                      title="Change Primary Email?"
                      description={
                        <>
                          <strong>{se.email}</strong> will become your new primary email used to log in.
                          Your current primary email (<strong>{email}</strong>) will be moved to your secondary emails.
                          <br /><br />
                          A verification code will be sent to <strong>{email}</strong> to confirm this change.
                        </>
                      }
                      confirmLabel="Continue"
                      cancelLabel="Cancel"
                      variant="default"
                      onConfirm={() => handleStartPrimaryOtp(i)}
                    />
                  )}
                  <ConfirmDialog
                    trigger={
                      <button
                        className="text-[#94a3b8] hover:text-[#dc2626] transition-colors"
                        title="Remove email"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    }
                    icon={<Mail className="w-6 h-6" />}
                    iconVariant="destructive"
                    title="Remove Email?"
                    description={
                      <>
                        Are you sure you want to remove <strong>{se.email}</strong> from your account?
                        This action cannot be undone.
                      </>
                    }
                    confirmLabel="Yes, Remove"
                    cancelLabel="Cancel"
                    variant="destructive"
                    onConfirm={() => setSecondaryEmails((prev) => prev.filter((_, idx) => idx !== i))}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Set-as-primary OTP verification panel */}
        <AnimatePresence mode="wait">
          {primaryOtpTarget !== null && !primaryOtpSuccess && (
            <motion.div
              key="primary-otp"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              className="bg-[#f0fdf9]/60 backdrop-blur-sm border border-[#177564]/20 rounded-2xl p-4 flex flex-col gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#177564]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-[#177564]" />
                </div>
                <div className="flex-1">
                  <p className="text-[#181d27] text-[13px] font-semibold">Verify your identity</p>
                  <p className="text-[#64748b] text-[12px] mt-0.5 leading-relaxed">
                    We sent a 6-digit code to <span className="font-semibold text-[#177564]">{email}</span>.
                    Enter it below to confirm the change.
                  </p>
                </div>
              </div>

              {/* OTP digit inputs */}
              <div className="flex justify-center gap-2">
                {primaryOtpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { primaryOtpInputsRef.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                    aria-label={`Email verification digit ${idx + 1}`}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePrimaryOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handlePrimaryOtpKeyDown(idx, e)}
                    onPaste={handlePrimaryOtpPaste}
                    className={`w-10 h-12 text-center text-[18px] font-semibold bg-white border rounded-[10px] focus:outline-none focus:ring-2 transition-all ${
                      primaryOtpError
                        ? 'border-[#dc2626] focus:ring-[#dc2626]/20 focus:border-[#dc2626]'
                        : 'border-slate-200/80 focus:ring-[#177564]/10 focus:border-[#177564]'
                    } shadow-sm`}
                  />
                ))}
              </div>

              {primaryOtpError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[#dc2626] text-[12px] text-center"
                >
                  {primaryOtpError}
                </motion.p>
              )}

              {primaryOtpVerifying && (
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    className="w-4 h-4 border-2 border-[#177564] border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  <p className="text-[#177564] text-[13px] font-medium">Verifying...</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    if (primaryOtpCooldown === 0) startPrimaryOtpCooldown();
                  }}
                  disabled={primaryOtpCooldown > 0}
                  className={`text-[12px] font-semibold transition-colors ${
                    primaryOtpCooldown > 0 ? 'text-[#94a3b8] cursor-default' : 'text-[#177564] hover:underline'
                  }`}
                >
                  {primaryOtpCooldown > 0 ? `Resend in ${primaryOtpCooldown}s` : 'Resend code'}
                </button>
                <button
                  onClick={handlePrimaryOtpCancel}
                  className="text-[#94a3b8] text-[12px] font-medium hover:text-[#64748b] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {primaryOtpTarget !== null && primaryOtpSuccess && (
            <motion.div
              key="primary-otp-success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="bg-[#f0fdf9]/60 backdrop-blur-sm border border-[#177564]/20 rounded-2xl p-4 flex flex-col gap-2 items-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                className="w-10 h-10 rounded-full bg-[#177564] flex items-center justify-center"
              >
                <Check className="w-5 h-5 text-white" />
              </motion.div>
              <p className="text-[#181d27] text-[14px] font-semibold">Primary email updated!</p>
              <p className="text-[#64748b] text-[12px] leading-relaxed">
                <span className="font-semibold text-[#177564]">{email}</span> is now your login email.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Email Address */}
        <AnimatePresence mode="wait" initial={false}>
          {!addingEmail ? (
            secondaryEmails.length >= 5 ? (
              <motion.p
                key="limit-reached"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[#94a3b8] text-[12px] italic"
              >
                Maximum of 5 secondary emails reached.
              </motion.p>
            ) : (
              <motion.div
                key="add-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3"
              >
                <button
                  onClick={handleAddEmail}
                  className="self-start text-[#177564] text-[13px] font-semibold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Email Address
                </button>
                {secondaryEmails.length > 0 && (
                  <span className="text-[#94a3b8] text-[11px]">
                    {secondaryEmails.length}/5
                  </span>
                )}
              </motion.div>
            )
          ) : !addEmailSent ? (
            <motion.div
              key="add-form"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-[0px_1px_3px_0px_rgba(15,23,42,0.02)] flex flex-col gap-3"
            >
              <div>
                <p className="text-[#181d27] text-[13px] font-semibold mb-1.5">Add email address</p>
                <p className="text-[#64748b] text-[12px] leading-relaxed">
                  We'll send a verification link to confirm this email belongs to you.
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <input
                  ref={addEmailInputRef}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  enterKeyHint="send"
                  value={addEmailValue}
                  onChange={(e) => {
                    setAddEmailValue(e.target.value);
                    if (addEmailError) setAddEmailError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddEmailSend()}
                  placeholder="Enter email address"
                  className={`${INPUT_CLS} ${addEmailError ? '!border-[#dc2626] !ring-[#dc2626]/20' : ''}`}
                />
                {addEmailError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[#dc2626] text-[12px]"
                  >
                    {addEmailError}
                  </motion.p>
                )}
              </div>
              <div className="flex gap-2">
                <SecondaryButton onClick={handleAddEmailCancel} compact tone="neutral" className="rounded-full">
                  Cancel
                </SecondaryButton>
                <PrimaryButton onClick={handleAddEmailSend} compact className="rounded-full">
                  <Send className="w-3.5 h-3.5" />
                  Send Verification Link
                </PrimaryButton>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="add-sent"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-[0px_1px_3px_0px_rgba(15,23,42,0.02)] flex flex-col gap-2.5 items-center text-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                className="w-10 h-10 rounded-full bg-[#177564] flex items-center justify-center"
              >
                <Mail className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <p className="text-[#181d27] text-[14px] font-semibold">Verification link sent!</p>
                <p className="text-[#64748b] text-[12px] mt-1 leading-relaxed">
                  We've sent a link to <span className="font-semibold text-[#177564]">{addEmailValue}</span>.
                  <br />
                  Click the link in the email to confirm.
                </p>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <button
                  onClick={() => { if (addEmailResendCooldown === 0) startAddEmailResendCooldown(); }}
                  disabled={addEmailResendCooldown > 0}
                  className={`text-[12px] font-semibold transition-colors ${
                    addEmailResendCooldown > 0 ? 'text-[#94a3b8] cursor-default' : 'text-[#177564] hover:underline'
                  }`}
                >
                  {addEmailResendCooldown > 0 ? `Resend in ${addEmailResendCooldown}s` : 'Resend link'}
                </button>
                <span className="text-[#64748b] text-[12px]">|</span>
                <button
                  onClick={handleAddEmailCancel}
                  className="text-[#94a3b8] text-[12px] font-medium hover:text-[#64748b] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SectionCard>

      {/* Phone Number */}
      <SectionCard>
        <SectionHeader
          title="Phone Number"
          subtitle="Manage the phone number you use to sign in to PlanOut and receive SMS updates."
        />
        <div className="bg-[#f0fdf9]/60 backdrop-blur-sm border border-[#177564]/20 rounded-2xl p-4 flex flex-col gap-0 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {phoneStep === 'display' && (
              <motion.div
                key="phone-display"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[#181d27] text-[14px] font-semibold truncate">{phone}</p>
                  <p className="text-[#177564] text-[12px] mt-0.5">Primary phone number</p>
                </div>
                <button
                  onClick={handlePhoneUpdate}
                  className="text-[#94a3b8] hover:text-[#177564] transition-colors shrink-0"
                  title="Update phone"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {phoneStep === 'input' && (
              <motion.div
                key="phone-input"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3"
              >
                <div>
                  <p className="text-[#181d27] text-[13px] font-semibold mb-1.5">Change phone number</p>
                  <p className="text-[#64748b] text-[12px] leading-relaxed">
                    We'll send a 6-digit verification code via SMS to your new number.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                <input
                  ref={phoneInputRef}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  enterKeyHint="send"
                    value={newPhone}
                    onChange={(e) => {
                      setNewPhone(e.target.value);
                      if (phoneError) setPhoneError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handlePhoneSendOtp()}
                    placeholder="Enter new phone number"
                    className={`${INPUT_CLS} ${phoneError ? '!border-[#dc2626] !ring-[#dc2626]/20' : ''}`}
                  />
                  {phoneError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[#dc2626] text-[12px]"
                    >
                      {phoneError}
                    </motion.p>
                  )}
                </div>
                <div className="flex gap-2">
                  <SecondaryButton onClick={handlePhoneCancel} compact tone="neutral" className="rounded-full">
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton onClick={handlePhoneSendOtp} compact className="rounded-full">
                    <Send className="w-3.5 h-3.5" />
                    Send Code
                  </PrimaryButton>
                </div>
              </motion.div>
            )}

            {phoneStep === 'otp' && (
              <motion.div
                key="phone-otp"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3"
              >
                <div>
                  <p className="text-[#181d27] text-[13px] font-semibold mb-1.5">Enter verification code</p>
                  <p className="text-[#64748b] text-[12px] leading-relaxed">
                    We sent a 6-digit code to <span className="font-semibold text-[#177564]">{newPhone}</span>.
                  </p>
                </div>

                {/* OTP digit inputs */}
                <div className="flex justify-center gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { otpInputsRef.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                      aria-label={`Phone verification digit ${idx + 1}`}
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className={`w-10 h-12 text-center text-[18px] font-semibold bg-white border rounded-[10px] focus:outline-none focus:ring-2 transition-all ${
                        otpError
                          ? 'border-[#dc2626] focus:ring-[#dc2626]/20 focus:border-[#dc2626]'
                          : 'border-slate-200/80 focus:ring-[#177564]/10 focus:border-[#177564]'
                      } shadow-sm`}
                    />
                  ))}
                </div>

                {otpError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[#dc2626] text-[12px] text-center"
                  >
                    {otpError}
                  </motion.p>
                )}

                {otpVerifying && (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      className="w-4 h-4 border-2 border-[#177564] border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                    <p className="text-[#177564] text-[13px] font-medium">Verifying...</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => { if (phoneResendCooldown === 0) { startPhoneResendCooldown(); } }}
                    disabled={phoneResendCooldown > 0}
                    className={`text-[12px] font-semibold transition-colors ${
                      phoneResendCooldown > 0 ? 'text-[#94a3b8] cursor-default' : 'text-[#177564] hover:underline'
                    }`}
                  >
                    {phoneResendCooldown > 0 ? `Resend in ${phoneResendCooldown}s` : 'Resend code'}
                  </button>
                  <button
                    onClick={handlePhoneCancel}
                    className="text-[#94a3b8] text-[12px] font-medium hover:text-[#64748b] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            {phoneStep === 'success' && (
              <motion.div
                key="phone-success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-2 items-center text-center py-2"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                  className="w-10 h-10 rounded-full bg-[#177564] flex items-center justify-center"
                >
                  <Check className="w-5 h-5 text-white" />
                </motion.div>
                <p className="text-[#181d27] text-[14px] font-semibold">Phone number updated!</p>
                <p className="text-[#64748b] text-[12px]">
                  Your new number is <span className="font-semibold text-[#177564]">{phone}</span>.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SectionCard>

      {/* Delete Account */}
      <SectionCard>
        <SectionHeader
          title="Delete Account"
          subtitle="Permanently delete your PlanOut account and all associated data."
        />
        <ConfirmDialog
          trigger={
            <button className="self-start px-4 py-2.5 bg-white border border-[#fecaca] text-[#dc2626] text-[13px] font-semibold rounded-full hover:bg-[#fef2f2] active:scale-95 transition-all flex items-center gap-2 shadow-sm">
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          }
          icon={<AlertTriangle className="w-6 h-6" />}
          iconVariant="destructive"
          title="Delete Account?"
          description={
            <>
              Are you sure you want to permanently delete your account <strong>{firstName} {lastName}</strong>?
              All your data, tickets, and event history will be lost. This action cannot be undone.
            </>
          }
          confirmLabel="Yes, Delete My Account"
          cancelLabel="Cancel"
          variant="destructive"
          onConfirm={() => {
            // In production, this would call the backend
          }}
        />
      </SectionCard>
    </div>
  );
}
