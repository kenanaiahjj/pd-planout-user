/**
 * @file ProfileSetupModal.tsx
 * @description Post-login "Complete Your Profile" modal — matches the Figma
 * design with gradient avatar circle, upload button, name input, and
 * "Get Started" CTA.
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import svgPaths from '../../imports/svg-488h79uj7t';
import { PrimaryButton } from './PrimaryButton';
import { FormTextField } from './FormTextField';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ProfileSetupModalProps {
  /** Called with the user's name (and optional avatar data URL) on submit. */
  onComplete: (name: string, avatarUrl?: string) => void;
  /** Close / dismiss the modal. */
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProfileSetupModal({ onComplete, onClose }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onComplete(name.trim(), avatarPreview ?? undefined);
  };

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
            Complete Your Profile
          </p>
          <button
            onClick={onClose}
            className="bg-[#def2ee] rounded-[12px] w-6 h-6 flex items-center justify-center shrink-0 hover:bg-[#cbf0e8] transition-colors cursor-pointer"
          >
            <svg className="w-[19.2px] h-[19.2px]" viewBox="0 0 19.2 19.2" fill="none">
              <path d={svgPaths.p19013a00} fill="#125B4E" />
            </svg>
          </button>
        </div>

        {/* ---- Body ---- */}
        <div className="flex flex-col gap-4 items-center px-6 pt-4 pb-6">
          {/* Description */}
          <p className="text-[#535862] text-[16px] font-medium leading-[1.4] tracking-[-0.48px] w-full">
            Enter your name and choose an avatar that will be displayed on your profile.
          </p>

          {/* Avatar + Name row */}
          <div className="flex items-center gap-4 w-full">
            {/* Avatar */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="relative shrink-0 w-[62px] h-[62px] cursor-pointer group"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <svg className="w-full h-full" viewBox="0 0 62.4973 61.9027" fill="none">
                  <ellipse
                    cx="31.2487"
                    cy="30.9514"
                    rx="31.2487"
                    ry="30.9514"
                    fill="url(#avatarGrad)"
                  />
                  <defs>
                    <linearGradient
                      id="avatarGrad"
                      gradientUnits="userSpaceOnUse"
                      x1="31.2487"
                      x2="31.2487"
                      y1="0"
                      y2="61.9027"
                    >
                      <stop stopColor="#3CFFDE" />
                      <stop offset="1" stopColor="#1C5A4F" />
                    </linearGradient>
                  </defs>
                </svg>
              )}

              {/* Upload badge */}
              <div className="absolute -right-0.5 bottom-0 w-[22.5px] h-[22.3px] group-hover:scale-110 transition-transform">
                <svg className="w-full h-full" viewBox="0 0 22.499 22.285" fill="none">
                  <path d={svgPaths.p17ad0a00} fill="#DEF2EE" stroke="#177564" />
                </svg>
                {/* Upload arrow icon */}
                <svg
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[7.6px] h-[7.4px]"
                  viewBox="0 0 7.56353 7.36263"
                  fill="none"
                >
                  <path d={svgPaths.p2683a300} fill="#177564" />
                </svg>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </button>

            {/* Name input */}
            <FormTextField
              label="Name"
              value={name}
              onChange={setName}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Enter your name"
              className="flex-1 min-w-0"
              labelClassName="text-[16px] font-medium leading-[1.4] tracking-[-0.48px] text-[#414651]"
              frameClassName="rounded-[8px]"
              inputClassName="text-[16px] text-[#121212] tracking-[-0.48px] placeholder:text-[#64748b] font-medium"
            />
          </div>

          {/* Get Started button */}
          <PrimaryButton
            onClick={handleSubmit}
            disabled={!name.trim()}
            fullWidth
            className="rounded-[8px] text-[16px]"
          >
            Get Started
          </PrimaryButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
