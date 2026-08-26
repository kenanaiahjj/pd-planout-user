/**
 * @file OrganizerProfilePage.tsx
 * @description Organizer public profile page — redesigned to match the PlanOut
 * design system: cover image with overlapping profile card, centered logo,
 * stats, pill-toggle tabs, and polished event/review cards.
 */

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Star,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Search,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Camera,
  ImagePlus,
  X,
  Upload,
  ZoomIn,
  Clock,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { PrimaryButton, PrimaryButtonLink } from '@/app/components/PrimaryButton';
import { SegmentedChoice } from '@/app/components/SegmentedChoice';
import { EventCard } from '@/app/components/EventCard';
import { EmptyStateGraphic } from '@/app/components/EmptyStateGraphic';
import { getOrganizerEmailHref } from '@/app/data/navigation.js';
import { MOCK_EVENTS } from '@/app/data/events';
import {
  type OrganizerData,
  type OrganizerEvent,
  type OrganizerReview,
} from '@/app/data/organizers';

// ---------------------------------------------------------------------------
// Social icon SVGs (compact inline — matching Figma's icon set)
// ---------------------------------------------------------------------------

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.093 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.11V9a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.77a8.21 8.21 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.2z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, React.FC> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  youtube: YouTubeIcon,
  x: XIcon,
};

// ---------------------------------------------------------------------------
// Gradient generator — derives a unique gradient from the organizer's logoColor
// ---------------------------------------------------------------------------

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return { h, s, l };
}

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function buildCoverGradient(logoColor: string): string {
  const { h, s } = hexToHSL(logoColor);
  const dark = hslToHex(h, Math.min(s, 0.7), 0.22);
  const mid = hslToHex((h + 15) % 360, Math.min(s, 0.65), 0.38);
  const light = hslToHex((h + 30) % 360, Math.min(s, 0.5), 0.6);
  const pale = hslToHex((h + 40) % 360, Math.min(s, 0.4), 0.82);
  return `linear-gradient(135deg, ${dark} 0%, ${mid} 35%, ${light} 65%, ${pale} 100%)`;
}

// ---------------------------------------------------------------------------
// Star rating component
// ---------------------------------------------------------------------------

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < Math.round(rating)
              ? 'text-[#FFBC00] fill-[#FFBC00]'
              : 'text-[#d1d5db] fill-[#d1d5db]'
          }
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Review Card
// ---------------------------------------------------------------------------

function ReviewCard({ review }: { review: OrganizerReview }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-slate-100/80 rounded-2xl shadow-[var(--shadow-premium)] p-4 sm:p-5 flex flex-col gap-3.5"
    >
      {/* Author row */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#177564]/10 text-[#177564] flex items-center justify-center shrink-0 border border-[#177564]/5">
          <span className="text-[12px] font-bold">
            {review.authorInitials}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold text-slate-800 truncate">
              {review.authorName}
            </span>
            <span className="text-[12px] text-slate-400 font-semibold shrink-0">
              {review.date}
            </span>
          </div>
          <div className="mt-0.5">
            <StarRating rating={review.rating} size={13} />
          </div>
        </div>
      </div>

      {/* Review text */}
      <p className="text-[14px] text-slate-600 font-medium leading-[1.6] tracking-[-0.2px]">
        {review.text}
      </p>

      {/* Attached images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {review.images.map((img, i) => (
            <div
              key={i}
              className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-slate-50 border border-slate-200/50"
            >
              <ImageWithFallback
                src={img}
                alt={`Review photo ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Organizer reply */}
      {review.reply && (
        <div className="ml-3 sm:ml-5 border-l-[3px] border-[#177564]/30 bg-[#f0fdf9]/80 rounded-r-xl px-4 py-3 border-y border-r border-[#177564]/5">
          <p className="text-[10px] text-[#177564] font-bold uppercase tracking-wider mb-1">
            Organizer Reply
          </p>
          <p className="text-[13px] text-slate-600 font-medium leading-[1.6]">
            {review.reply.text}
          </p>
        </div>
      )}
    </motion.div>
  );
}



// ---------------------------------------------------------------------------
// Leave a Review Modal (simple inline form)
// ---------------------------------------------------------------------------

function LeaveReviewForm({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<{ file: File; url: string }[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const dragCounter = useRef(0);

  const MAX_PHOTOS = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      photos.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, []);

  const addFiles = useCallback((fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    setPhotoError(null);

    setPhotos((prev) => {
      const remaining = MAX_PHOTOS - prev.length;
      if (remaining <= 0) {
        setPhotoError(`Maximum ${MAX_PHOTOS} photos reached.`);
        return prev;
      }

      const newPhotos: { file: File; url: string }[] = [];
      for (let i = 0; i < Math.min(files.length, remaining); i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
          setPhotoError('Only image files are allowed.');
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          setPhotoError('Each photo must be under 5 MB.');
          continue;
        }
        newPhotos.push({ file, url: URL.createObjectURL(file) });
      }

      if (files.length > remaining) {
        setPhotoError(`Only ${remaining} more photo${remaining === 1 ? '' : 's'} allowed (max ${MAX_PHOTOS}).`);
      }

      return [...prev, ...newPhotos];
    });
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    addFiles(files);
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const removed = prev[index];
      URL.revokeObjectURL(removed.url);
      return prev.filter((_, i) => i !== index);
    });
    setPhotoError(null);
  };

  // --- Drag & Drop handlers ---
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      addFiles(files);
    }
  }, [addFiles]);

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-[#def2ee] rounded-[12px] p-6 text-center shadow-[0px_16px_36px_0px_rgba(0,0,0,0.03)]"
      >
        <div className="w-14 h-14 rounded-full bg-[#ecfdf5] flex items-center justify-center mx-auto mb-3">
          <MessageSquare className="w-6 h-6 text-[#059669]" />
        </div>
        <p className="text-[16px] font-semibold text-[#181d27]">Thank you!</p>
        <p className="text-[14px] text-[#64748b] mt-1">
          Your review has been submitted.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white border border-[#def2ee] rounded-[12px] p-5 flex flex-col gap-4 shadow-[0px_16px_36px_0px_rgba(0,0,0,0.03)]"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 z-20 bg-[#f0fdf9]/95 border-2 border-dashed border-[#177564] rounded-[12px] flex flex-col items-center justify-center gap-3 pointer-events-none"
            >
              <div className="w-14 h-14 rounded-full bg-[#def2ee] flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#177564]" />
              </div>
              <p className="text-[#177564] text-[15px] font-semibold">Drop photos here</p>
              <p className="text-[#64748b] text-[12px]">PNG, JPG or GIF (max 5MB each)</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-[#181d27]">
            Leave a Review
          </h3>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-[#64748b] text-[14px] font-medium transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Star selector */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              onMouseEnter={() => setHovered(i + 1)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(i + 1)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={
                  i < (hovered || rating)
                    ? 'text-[#FFBC00] fill-[#FFBC00]'
                    : 'text-[#d1d5db] fill-[#d1d5db]'
                }
                style={{ width: 28, height: 28 }}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="text-[13px] text-[#64748b] ml-2 font-medium">
              {rating}/5
            </span>
          )}
        </div>

        {/* Text input */}
        <textarea
          aria-label="Review description"
          enterKeyHint="enter"
          className="w-full border border-[#e2e8f0] rounded-[10px] p-3 text-[14px] text-[#181d27] placeholder:text-[#94a3b8] resize-none outline-none focus:ring-2 focus:ring-[#177564]/20 focus:border-[#177564] transition-all"
          rows={3}
          placeholder="Share your experience..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Photo Upload */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-semibold text-[#414651]">
              Add photos <span className="text-[#94a3b8] font-medium">(optional)</span>
            </label>
            {photos.length > 0 && (
              <span className="text-[11px] font-medium tabular-nums text-[#94a3b8]">
                {photos.length}/{MAX_PHOTOS}
              </span>
            )}
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/png,image/jpeg,image/gif,image/webp"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Photo previews grid */}
          {photos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative group/thumb w-[68px] h-[68px] rounded-[8px] overflow-hidden border border-[#e2e8f0] shadow-sm cursor-pointer"
                  onClick={() => setLightboxIndex(index)}
                >
                  <img
                    src={photo.url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition-colors" />
                  {/* Zoom icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity pointer-events-none">
                    <ZoomIn className="w-4 h-4 text-white drop-shadow-md" />
                  </div>
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removePhoto(index); }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-[#ef4444] text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Add more tile */}
              {photos.length < MAX_PHOTOS && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-[68px] h-[68px] rounded-[8px] border border-dashed border-[#def2ee] bg-[#f8fdfb] hover:border-[#177564] hover:bg-[#f0fdf9] transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <ImagePlus className="w-4 h-4 text-[#177564]" />
                  <span className="text-[9px] font-semibold text-[#177564]">Add</span>
                </button>
              )}
            </div>
          )}

          {/* Upload dropzone (shown when no photos) */}
          {photos.length === 0 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`bg-white border border-dashed rounded-[10px] px-4 py-3 flex items-center gap-3 transition-all group cursor-pointer ${
                isDragging
                  ? 'border-[#177564] bg-[#f0fdf9]'
                  : 'border-[#e2e8f0] hover:border-[#177564] hover:bg-[#f8fdfb]'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-[#f0fdf9] border border-[#def2ee] flex items-center justify-center shrink-0 group-hover:bg-[#def2ee] transition-colors">
                <Camera className="w-4 h-4 text-[#177564]" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-[13px] font-semibold text-[#177564]">
                  Upload or drag & drop photos
                </p>
                <p className="text-[11px] text-[#94a3b8]">
                  PNG, JPG or GIF (max 5MB each, up to {MAX_PHOTOS})
                </p>
              </div>
            </button>
          )}

          {/* Error */}
          {photoError && (
            <p className="text-[11px] text-[#ef4444] font-medium">{photoError}</p>
          )}
        </div>

        <PrimaryButton
          disabled={rating === 0 || text.trim().length === 0}
          onClick={() => setSubmitted(true)}
          className="py-2.5"
        >
          Submit Review
        </PrimaryButton>
      </motion.div>

      {/* ============================================================== */}
      {/* Photo Lightbox Modal                                            */}
      {/* ============================================================== */}
      <AnimatePresence>
        {lightboxIndex !== null && photos[lightboxIndex] && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setLightboxIndex(null)}
            />

            {/* Image container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="relative z-10 max-w-[90vw] max-h-[80vh] flex flex-col items-center gap-3"
            >
              <img
                src={photos[lightboxIndex].url}
                alt={`Photo ${lightboxIndex + 1}`}
                className="max-w-full max-h-[75vh] rounded-[12px] object-contain shadow-2xl"
              />

              {/* Controls bar */}
              <div className="flex items-center gap-3">
                {/* Prev */}
                <button
                  onClick={() => setLightboxIndex(Math.max(0, lightboxIndex - 1))}
                  disabled={lightboxIndex === 0}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <span className="text-white/80 text-[13px] font-medium tabular-nums min-w-[40px] text-center">
                  {lightboxIndex + 1} / {photos.length}
                </span>

                {/* Next */}
                <button
                  onClick={() => setLightboxIndex(Math.min(photos.length - 1, lightboxIndex + 1))}
                  disabled={lightboxIndex === photos.length - 1}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed rotate-180"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                {/* Remove */}
                <button
                  onClick={() => {
                    removePhoto(lightboxIndex);
                    if (photos.length <= 1) setLightboxIndex(null);
                    else if (lightboxIndex >= photos.length - 1) setLightboxIndex(lightboxIndex - 1);
                  }}
                  className="w-9 h-9 rounded-full bg-[#ef4444]/80 hover:bg-[#ef4444] text-white flex items-center justify-center transition-colors ml-4"
                  title="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Close button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface OrganizerProfilePageProps {
  organizer: OrganizerData;
  onBack: () => void;
  onEventClick?: (eventId: string) => void;
}

// ---------------------------------------------------------------------------
// Tabs type
// ---------------------------------------------------------------------------

type ProfileTab = 'events' | 'reviews';

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function OrganizerProfilePage({
  organizer,
  onBack,
  onEventClick,
}: OrganizerProfilePageProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>('events');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [eventFilter, setEventFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [showEventFilterDropdown, setShowEventFilterDropdown] = useState(false);

  // Filter events / reviews by search + event timing filter
  const filteredEvents = useMemo(() => {
    let events = organizer.events;

    // Apply timing filter
    if (eventFilter === 'upcoming') {
      events = events.filter((e) => !e.isPast);
    } else if (eventFilter === 'past') {
      events = events.filter((e) => e.isPast === true);
    }

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.labels.some((l) => l.toLowerCase().includes(q)),
      );
    }
    return events;
  }, [organizer.events, searchQuery, eventFilter]);

  const filteredReviews = useMemo(() => {
    if (!searchQuery.trim()) return organizer.reviews;
    const q = searchQuery.toLowerCase();
    return organizer.reviews.filter(
      (r) =>
        r.text.toLowerCase().includes(q) ||
        r.authorName.toLowerCase().includes(q),
    );
  }, [organizer.reviews, searchQuery]);

  const handleEventClick = (eventId: string) => {
    if (onEventClick) {
      onEventClick(eventId);
    }
  };

  return (
    <>


      <div className="flex flex-col pb-10 -mx-4 sm:-mx-8">
        {/* ================================================================ */}
        {/* Cover Image                                                      */}
        {/* ================================================================ */}
        <div className="relative w-full h-[260px] sm:h-[340px] bg-[#0f172b] overflow-hidden">
          {organizer.coverImage ? (
            <ImageWithFallback
              src={organizer.coverImage}
              alt={`${organizer.name} cover`}
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: buildCoverGradient(organizer.logoColor) }}
            />
          )}
          {/* Top fade gradient for header legibility */}
          <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* ================================================================ */}
        {/* Profile Info (Open, Luma-style layout)                          */}
        {/* ================================================================ */}
        <div className="relative z-10 px-4 sm:px-8 -mt-[48px] flex flex-col items-center">
          {/* Logo centered, overlapping the cover banner */}
          <div
            className="w-[96px] h-[96px] sm:w-[104px] sm:h-[104px] rounded-full border-[5px] border-white shadow-md flex items-center justify-center shrink-0"
            style={{ backgroundColor: organizer.logoColor }}
          >
            <span className="text-white text-[30px] sm:text-[34px] font-bold tracking-tight">
              {organizer.logoInitials}
            </span>
          </div>

          {/* Organizer Name */}
          <h1 className="text-slate-800 text-[26px] sm:text-[32px] font-black leading-tight tracking-[-0.8px] text-center mt-5">
            {organizer.name}
          </h1>

          {/* Description / Bio */}
          <p className="text-slate-500 text-[14.5px] leading-[1.65] tracking-[-0.2px] text-center mt-2.5 max-w-[540px] font-medium">
            {organizer.description}
          </p>

          {/* Stats row - clean, dot-separated list */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4 text-[13px] font-semibold text-slate-500">
            <div className="flex items-center gap-1">
              <span className="text-slate-800 font-bold">{organizer.stats.totalEvents}</span>
              <span>Events</span>
            </div>
            <span className="text-slate-300">·</span>
            <div className="flex items-center gap-1">
              <span className="text-slate-800 font-bold">{organizer.stats.rating.toFixed(1)}</span>
              <Star className="w-3.5 h-3.5 text-[#FFBC00] fill-[#FFBC00] inline mt-[-2px]" />
            </div>
            <span className="text-slate-300">·</span>
            <div className="flex items-center gap-1">
              <span className="text-slate-800 font-bold">{organizer.stats.reviews.toLocaleString()}</span>
              <span>Reviews</span>
            </div>
          </div>

          {/* Contacts + Socials Row */}
          <div className="flex flex-col items-center gap-4 mt-6 w-full max-w-[540px]">
            {/* Social icons & Contact button */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
              {/* Social icons */}
              {organizer.socials.length > 0 && (
                <div className="flex items-center gap-2">
                  {organizer.socials.map((s) => {
                    const Icon = SOCIAL_ICONS[s.platform];
                    if (!Icon) return null;
                    return (
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.94 }}
                        key={s.platform}
                        href={s.url}
                        className="w-9.5 h-9.5 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-[#177564] hover:border-slate-200 transition-all cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                        title={s.platform}
                      >
                        <Icon />
                      </motion.a>
                    );
                  })}
                </div>
              )}

              {/* Divider if socials exist */}
              {organizer.socials.length > 0 && (
                <div className="h-5 w-[1px] bg-slate-200 hidden sm:block" />
              )}

              {/* Contact Organizer CTA */}
              <PrimaryButtonLink
                href={getOrganizerEmailHref(organizer.email)}
                aria-label={'Email ' + organizer.name}
                className="rounded-full shadow-sm py-2 px-5 font-bold text-[13px]"
              >
                <Mail className="w-3.5 h-3.5" />
                Contact Organizer
              </PrimaryButtonLink>
            </div>

            {/* Sub-info: email & phone */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[12px] font-semibold text-slate-400 mt-1">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400/80" />
                {organizer.email}
              </span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400/80" />
                {organizer.phone}
              </span>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* Tab Switcher & Filters                                           */}
        {/* ================================================================ */}
        <div className="px-4 sm:px-8 mt-12 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <SegmentedChoice
              size="sm"
              value={activeTab}
              onChange={(tab) => {
                setActiveTab(tab);
                setShowReviewForm(false);
              }}
              columnsClass="grid-cols-2 max-w-[280px]"
              options={[
                { value: 'events', label: 'Events', badge: organizer.events.length },
                { value: 'reviews', label: 'Reviews', badge: organizer.reviews.length },
              ]}
            />

            {/* Write Review Button (on the right of tab bar) */}
            {activeTab === 'reviews' && !showReviewForm && (
              <PrimaryButton
                compact
                onClick={() => setShowReviewForm(true)}
                className="h-9 rounded-[12px] px-3.5 text-[12px] whitespace-nowrap"
              >
                <MessageSquare className="w-3 h-3" />
                Write Review
              </PrimaryButton>
            )}
          </div>

          {/* Search & Filters Row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {/* Search Input */}
              <div className="relative flex-1 sm:w-[280px] sm:flex-initial group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                <input
                  type="search"
                  inputMode="search"
                  enterKeyHint="search"
                  autoComplete="off"
                  aria-label={`Search ${activeTab}`}
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 rounded-xl py-2.5 pl-10 pr-10 text-[13px] font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#177564] focus:ring-1 focus:ring-[#177564]/20 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.015)] h-[38px]"
                  style={{ color: '#181d27' }}
                />
                {searchQuery && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="rounded-full p-1 text-[#94a3b8] transition-colors hover:bg-[#e2e8f0] hover:text-[#475569] cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Event timing filter dropdown */}
              {activeTab === 'events' && (
                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setShowEventFilterDropdown(!showEventFilterDropdown)}
                    className={`flex items-center gap-1.5 px-3.5 h-[38px] rounded-xl text-[13px] font-bold transition-all whitespace-nowrap cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.015)] ${
                      eventFilter !== 'all'
                        ? 'bg-[#177564] text-white shadow-sm'
                        : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-[#f8fafc]'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    {eventFilter === 'all' ? 'All Events' : eventFilter === 'upcoming' ? 'Upcoming' : 'Past'}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showEventFilterDropdown ? 'rotate-180' : ''}`} />
                  </motion.button>

                  {/* Dropdown menu */}
                  <AnimatePresence>
                    {showEventFilterDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        className="absolute left-0 mt-1.5 w-[160px] bg-white border border-slate-200/80 rounded-xl shadow-[var(--shadow-premium)] overflow-hidden z-30 p-1"
                      >
                        {([
                          { value: 'all' as const, label: 'All Events', icon: Calendar, count: organizer.events.length },
                          { value: 'upcoming' as const, label: 'Upcoming', icon: Calendar, count: organizer.events.filter(e => !e.isPast).length },
                          { value: 'past' as const, label: 'Past Events', icon: Clock, count: organizer.events.filter(e => e.isPast).length },
                        ]).map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setEventFilter(option.value);
                              setShowEventFilterDropdown(false);
                            }}
                            className={`flex items-center justify-between w-full px-3 py-2 text-[12.5px] font-semibold rounded-lg transition-colors cursor-pointer ${
                              eventFilter === option.value
                                ? 'bg-[#177564]/8 text-[#177564]'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <option.icon className="w-3.5 h-3.5" />
                              <span>{option.label}</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">
                              ({option.count})
                            </span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Click-away listener */}
                  {showEventFilterDropdown && (
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setShowEventFilterDropdown(false)}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>


        {/* ================================================================ */}
        {/* Tab Content                                                       */}
        {/* ================================================================ */}
        <div className="px-4 sm:px-8 mt-5 flex flex-col gap-4 max-w-[960px] mx-auto w-full">
          {/* Leave a Review form (when active) */}
          <AnimatePresence>
            {showReviewForm && activeTab === 'reviews' && (
              <LeaveReviewForm onClose={() => setShowReviewForm(false)} />
            )}
          </AnimatePresence>

          {/* Events tab */}
          {activeTab === 'events' && (
            <div className="flex flex-col gap-4">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => {
                  const fullEvent = MOCK_EVENTS.find((e) => e.id === event.eventId);
                  return (
                    <EventCard
                      key={event.eventId}
                      title={event.title}
                      date={event.date}
                      endDate={fullEvent?.endDate}
                      eventDates={fullEvent?.eventDates}
                      dailySchedule={fullEvent?.dailySchedule}
                      location={event.location}
                      organizer={organizer.name}
                      rating={event.rating}
                      labels={event.labels}
                      image={event.image}
                      onClick={() => handleEventClick(event.eventId)}
                    />
                  );
                })
              ) : (
                <div className="text-center py-16 bg-white rounded-[12px] border border-[#e2e8f0]">
                  <EmptyStateGraphic kind="no-organizer-events" className="h-36 w-36" />
                  <p className="text-[#64748b] text-[15px] font-medium">
                    {eventFilter === 'all' ? 'No events found' : eventFilter === 'upcoming' ? 'No upcoming events' : 'No past events'}
                  </p>
                  <p className="text-[#94a3b8] text-[13px] mt-1">
                    {searchQuery.trim() ? 'Try a different search term' : eventFilter !== 'all' ? 'Try changing the filter' : 'Check back later for new events'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Reviews tab */}
          {activeTab === 'reviews' && (
            <div className="flex flex-col gap-4">
              {/* Rating summary bar */}
              {organizer.reviews.length > 0 && !showReviewForm && (
                <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[12px] p-4 flex items-center gap-4">
                  <div className="flex flex-col items-center gap-0.5 shrink-0">
                    <span className="text-[28px] font-bold text-[#181d27] leading-none">
                      {organizer.stats.rating.toFixed(1)}
                    </span>
                    <StarRating rating={organizer.stats.rating} size={14} />
                    <span className="text-[12px] text-[#94a3b8] mt-1">
                      {organizer.stats.reviews.toLocaleString()} reviews
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = organizer.reviews.filter(
                        (r) => r.rating === star,
                      ).length;
                      const pct =
                        organizer.reviews.length > 0
                          ? (count / organizer.reviews.length) * 100
                          : 0;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-[11px] text-[#94a3b8] w-3 text-right shrink-0">
                            {star}
                          </span>
                          <Star className="w-3 h-3 text-[#FFBC00] fill-[#FFBC00] shrink-0" />
                          <div className="flex-1 h-[6px] bg-[#e2e8f0] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#FFBC00] rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-[#94a3b8] w-6 text-right shrink-0">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <div className="text-center py-16 bg-white rounded-[12px] border border-[#e2e8f0]">
                  <EmptyStateGraphic kind="no-organizer-reviews" className="h-36 w-36" />
                  <p className="text-[#64748b] text-[15px] font-medium">
                    No reviews yet
                  </p>
                  <p className="text-[#94a3b8] text-[13px] mt-1">
                    Be the first to leave a review
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
