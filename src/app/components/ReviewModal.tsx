/**
 * @file ReviewModal.tsx
 * @description Review modal with 3 views:
 *   1. Review form (star rating, description, waiver upload, public toggle)
 *   2. "Review Later" confirmation (Cancel/skip flow)
 *   3. "Review Submitted" with certificate download
 *
 * Design matches Figma imports:
 *   - HomeNotificationSubmitAReview
 *   - HomeNotificationSubmitAReviewSkip
 *   - HomeNotificationSubmitAReviewDownloadCertificate
 *
 * Uses shared SVG paths from the Figma-imported svg files.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { MyTicket } from '@/app/data/tickets';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Calendar, MapPin, Upload, Eye, EyeOff, X, Camera, ImagePlus } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

// ---------------------------------------------------------------------------
// SVG path data (from Figma imports)
// ---------------------------------------------------------------------------

/** Close X icon (material-symbols:close-rounded) */
const CLOSE_PATH =
  'M9.6 10.72L5.68 14.64C5.53333 14.7867 5.34667 14.86 5.12 14.86C4.89333 14.86 4.70667 14.7867 4.56 14.64C4.41333 14.4933 4.34 14.3067 4.34 14.08C4.34 13.8533 4.41333 13.6667 4.56 13.52L8.48 9.6L4.56 5.68C4.41333 5.53333 4.34 5.34667 4.34 5.12C4.34 4.89333 4.41333 4.70667 4.56 4.56C4.70667 4.41333 4.89333 4.34 5.12 4.34C5.34667 4.34 5.53333 4.41333 5.68 4.56L9.6 8.48L13.52 4.56C13.6667 4.41333 13.8533 4.34 14.08 4.34C14.3067 4.34 14.4933 4.41333 14.64 4.56C14.7867 4.70667 14.86 4.89333 14.86 5.12C14.86 5.34667 14.7867 5.53333 14.64 5.68L10.72 9.6L14.64 13.52C14.7867 13.6667 14.86 13.8533 14.86 14.08C14.86 14.3067 14.7867 14.4933 14.64 14.64C14.4933 14.7867 14.3067 14.86 14.08 14.86C13.8533 14.86 13.6667 14.7867 13.52 14.64L9.6 10.72Z';

/** User/person icon circle paths */
const USER_CIRCLE_PATH =
  'M42 27.0001C42 29.6523 40.9464 32.1959 39.0711 34.0713C37.1957 35.9467 34.6522 37.0003 32 37.0003C29.3478 37.0003 26.8043 35.9467 24.9289 34.0713C23.0536 32.1959 22 29.6523 22 27.0001C22 24.3479 23.0536 21.8044 24.9289 19.929C26.8043 18.0536 29.3478 17 32 17C34.6522 17 37.1957 18.0536 39.0711 19.929C40.9464 21.8044 42 24.3479 42 27.0001Z';
const USER_BADGE_PATH =
  'M25.3346 34.4531L23.668 45.1866C23.668 46.5366 26.638 47.4133 27.7463 46.81L31.2563 44.8983C31.4847 44.7731 31.7409 44.7075 32.0013 44.7075C32.2617 44.7075 32.5179 44.7731 32.7463 44.8983L36.2563 46.81C37.3646 47.4133 40.3346 46.535 40.3346 45.1849L38.668 34.4531';

/** Star SVG paths */
const STAR_FILL_PATH =
  'M18 4.5L21.525 13.14L30.84 13.83L23.7 19.86L25.935 28.92L18 24L10.065 28.92L12.3 19.86L5.16 13.83L14.475 13.14L18 4.5Z';
const STAR_STROKE_PATH =
  'M18 4.5L14.475 13.14L5.16 13.83L12.3 19.86L10.065 28.92L18 24M18 4.5L21.525 13.14L30.84 13.83L23.7 19.86L25.935 28.92L18 24';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Figma-matching user avatar icon */
function UserIcon() {
  return (
    <div className="w-16 h-16 shrink-0">
      <svg className="block w-full h-full" fill="none" viewBox="0 0 64 64">
        <circle cx="32" cy="32" fill="#DEF2EE" r="32" />
        <path d={USER_CIRCLE_PATH} stroke="#177564" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <path d={USER_BADGE_PATH} stroke="#177564" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

/** Close button matching Figma header */
function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-6 h-6 bg-[#def2ee] rounded-[12px] flex items-center justify-center p-[2px] hover:bg-[#cbf0e8] transition-colors shrink-0"
    >
      <svg className="w-[19.2px] h-[19.2px]" fill="none" viewBox="0 0 19.2 19.2">
        <path d={CLOSE_PATH} fill="#125B4E" />
      </svg>
    </button>
  );
}

/** Star rating component */
function StarRating({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];
  const active = hovered || rating;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-[#414651] tracking-[-0.2px]">
          How was your experience?
        </p>
        {active > 0 && (
          <span className={`text-[12px] font-semibold tracking-[-0.2px] transition-colors ${
            active >= 4 ? 'text-[#059669]' : active >= 3 ? 'text-[#f59e0b]' : 'text-[#ef4444]'
          }`}>
            {LABELS[active]}
          </span>
        )}
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= active;
          return (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => onChange(star)}
              className="w-10 h-10 transition-transform hover:scale-110 active:scale-95"
            >
              <svg className="block w-full h-full" fill="none" viewBox="0 0 36 36">
                <path
                  d={STAR_FILL_PATH}
                  fill={filled ? '#FEC84B' : 'white'}
                  fillOpacity={filled ? 1 : 0.15}
                />
                <path
                  d={STAR_STROKE_PATH}
                  stroke={filled ? '#F79009' : '#D5D7DA'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal views
// ---------------------------------------------------------------------------

type ModalView = 'review' | 'skip' | 'submitted';

interface ReviewModalProps {
  open: boolean;
  ticket: MyTicket | null;
  onClose: () => void;
  onReviewSubmitted: (ticketId: string) => void;
  onGoToTickets?: () => void;
}

export function ReviewModal({
  open,
  ticket,
  onClose,
  onReviewSubmitted,
  onGoToTickets,
}: ReviewModalProps) {
  // Start on submitted view if review is already done
  const initialView: ModalView = ticket?.reviewStatus === 'submitted' ? 'submitted' : 'review';
  const [view, setView] = useState<ModalView>(initialView);
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  // Sync initial view when ticket changes
  useEffect(() => {
    if (open && ticket) {
      setView(ticket.reviewStatus === 'submitted' ? 'submitted' : 'review');
    }
  }, [open, ticket]);

  const resetAndClose = useCallback(() => {
    setView('review');
    setRating(0);
    setDescription('');
    setIsPublic(false);
    onClose();
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    if (!ticket) return;
    onReviewSubmitted(ticket.id);
    setView('submitted');
  }, [ticket, onReviewSubmitted]);

  const handleCancel = useCallback(() => {
    setView('skip');
  }, []);

  const handleSkipClose = useCallback(() => {
    resetAndClose();
  }, [resetAndClose]);

  const handleGoToTickets = useCallback(() => {
    resetAndClose();
    onGoToTickets?.();
  }, [resetAndClose, onGoToTickets]);

  if (!open || !ticket) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={resetAndClose}
          />

          {/* Modal container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative z-10 w-full max-w-[408px] max-h-[90vh] overflow-y-auto"
          >
            <AnimatePresence mode="wait">
              {view === 'review' && (
                <ReviewForm
                  key="review"
                  ticket={ticket}
                  rating={rating}
                  onRatingChange={setRating}
                  description={description}
                  onDescriptionChange={setDescription}
                  isPublic={isPublic}
                  onPublicChange={setIsPublic}
                  onConfirm={handleConfirm}
                  onCancel={handleCancel}
                  onClose={resetAndClose}
                />
              )}
              {view === 'skip' && (
                <SkipView
                  key="skip"
                  onClose={handleSkipClose}
                  onGoToTickets={handleGoToTickets}
                />
              )}
              {view === 'submitted' && (
                <SubmittedView
                  key="submitted"
                  onClose={resetAndClose}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Review Form View
// ---------------------------------------------------------------------------

function ReviewForm({
  ticket,
  rating,
  onRatingChange,
  description,
  onDescriptionChange,
  isPublic,
  onPublicChange,
  onConfirm,
  onCancel,
  onClose,
}: {
  ticket: MyTicket;
  rating: number;
  onRatingChange: (r: number) => void;
  description: string;
  onDescriptionChange: (d: string) => void;
  isPublic: boolean;
  onPublicChange: (v: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<{ file: File; url: string }[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const MAX_PHOTOS = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      photos.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setPhotoError(null);

    const newPhotos: { file: File; url: string }[] = [];
    const remaining = MAX_PHOTOS - photos.length;

    if (remaining <= 0) {
      setPhotoError(`Maximum ${MAX_PHOTOS} photos reached.`);
      e.target.value = '';
      return;
    }

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

    setPhotos((prev) => [...prev, ...newPhotos]);
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-[12px] shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08),0px_8px_8px_-4px_rgba(10,13,18,0.03)] overflow-hidden"
    >
      {/* Header bar */}
      <div className="bg-[#e9f6f4] flex items-center justify-between px-4 py-3">
        <span className="text-[#177564] text-[16px] font-semibold tracking-[-0.48px]">
          Submit a Review
        </span>
        <CloseButton onClick={onClose} />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-5 px-5 pt-5 pb-6">
        {/* Event Context Card */}
        <div className="flex items-center gap-3 bg-[#f8fafb] rounded-[10px] border border-[#e8f0ee] p-3">
          <div className="w-[52px] h-[52px] rounded-[8px] overflow-hidden bg-gray-100 shrink-0">
            <ImageWithFallback
              src={ticket.image}
              alt={ticket.eventTitle}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-[#181d27] leading-[1.3] truncate">
              {ticket.eventTitle}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <Calendar className="w-3 h-3 text-[#177564] shrink-0" />
              <span className="text-[11px] text-[#64748b] font-medium truncate">{ticket.eventDate}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3 h-3 text-[#177564] shrink-0" />
              <span className="text-[11px] text-[#64748b] font-medium truncate">{ticket.eventLocation}</span>
            </div>
          </div>
        </div>

        {/* Hero + CTA text */}
        <div className="flex items-start gap-3">
          <UserIcon />
          <div className="flex flex-col gap-1 pt-1">
            <h2 className="text-[20px] font-semibold text-[#181d27] tracking-[-0.4px] leading-[1.3]">
              You've finished!
            </h2>
            <p className="text-[13px] text-[#64748b] leading-[1.5]">
              Leave a quick review to unlock your certificate.
            </p>
          </div>
        </div>

        {/* Star Rating */}
        <StarRating rating={rating} onChange={onRatingChange} />

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-semibold text-[#414651]">
              Description
            </label>
            <span className={`text-[11px] font-medium tabular-nums ${description.length > 280 ? 'text-[#ef4444]' : 'text-[#94a3b8]'}`}>
              {description.length}/300
            </span>
          </div>
          <textarea
            value={description}
            onChange={(e) => {
              if (e.target.value.length <= 300) onDescriptionChange(e.target.value);
            }}
            placeholder="What did you enjoy most? Any suggestions?"
            className="w-full h-[100px] bg-white border border-[#d5d7da] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] px-3 py-2.5 text-[14px] text-[#181d27] placeholder:text-[#94a3b8] resize-none focus:outline-none focus:ring-2 focus:ring-[#177564]/20 focus:border-[#177564] transition-all"
          />
        </div>

        {/* Photo Upload */}
        <div className="flex flex-col gap-1.5">
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
            <div className="flex flex-wrap gap-2 mb-1">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative group/thumb w-[72px] h-[72px] rounded-[8px] overflow-hidden border border-[#e2e8f0] shadow-sm"
                >
                  <img
                    src={photo.url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition-colors" />
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-[#ef4444] text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Add more button (inline tile) */}
              {photos.length < MAX_PHOTOS && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-[72px] h-[72px] rounded-[8px] border border-dashed border-[#def2ee] bg-[#f8fdfb] hover:border-[#177564] hover:bg-[#f0fdf9] transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <ImagePlus className="w-4 h-4 text-[#177564]" />
                  <span className="text-[9px] font-semibold text-[#177564]">Add</span>
                </button>
              )}
            </div>
          )}

          {/* Upload dropzone (shown when no photos yet) */}
          {photos.length === 0 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white border border-[#e9eaeb] border-dashed rounded-[8px] px-4 py-3 flex items-center gap-3 hover:border-[#177564] hover:bg-[#f8fdfb] transition-all group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-[#f0fdf9] border border-[#def2ee] flex items-center justify-center shrink-0 group-hover:bg-[#def2ee] transition-colors">
                <Camera className="w-4 h-4 text-[#177564]" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-[13px] font-semibold text-[#177564]">
                  Upload photos
                </p>
                <p className="text-[11px] text-[#94a3b8]">
                  PNG, JPG or GIF (max. 5MB each, up to {MAX_PHOTOS})
                </p>
              </div>
            </button>
          )}

          {/* Error message */}
          {photoError && (
            <p className="text-[11px] text-[#ef4444] font-medium">
              {photoError}
            </p>
          )}
        </div>

        {/* Public toggle */}
        <div className="bg-[#f8f9fb] rounded-[10px] px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center shrink-0">
              {isPublic ? (
                <Eye className="w-3.5 h-3.5 text-[#177564]" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-[#94a3b8]" />
              )}
            </div>
            <div className="flex flex-col gap-[1px] min-w-0">
              <span className="text-[12px] font-semibold text-[#181d27] tracking-[-0.2px]">
                Make my review public
              </span>
              <span className="text-[11px] text-[#94a3b8] tracking-[-0.2px]">
                Help others discover this event
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onPublicChange(!isPublic)}
            className={`relative w-[36px] h-[20px] rounded-full transition-colors shrink-0 ${
              isPublic ? 'bg-[#177564]' : 'bg-[#D5D7DA]'
            }`}
          >
            <div
              className={`absolute top-[2px] w-[16px] h-[16px] rounded-full bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.15)] transition-all ${
                isPublic ? 'left-[18px]' : 'left-[2px]'
              }`}
            />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <SecondaryButton onClick={onCancel} fullWidth tone="neutral">
            Skip
          </SecondaryButton>
          <PrimaryButton onClick={onConfirm} disabled={rating === 0} fullWidth className="flex-[2]">
            Submit Review
          </PrimaryButton>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Skip / Review Later View
// ---------------------------------------------------------------------------

function SkipView({
  onClose,
  onGoToTickets,
}: {
  onClose: () => void;
  onGoToTickets: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-[12px] shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08),0px_8px_8px_-4px_rgba(10,13,18,0.03)] overflow-hidden"
    >
      {/* Header bar */}
      <div className="bg-[#e9f6f4] flex items-center justify-between px-4 py-3">
        <span className="text-[#177564] text-[20px] font-semibold tracking-[-0.4px]">
          Review Later
        </span>
        <CloseButton onClick={onClose} />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-5 px-5 pt-5 pb-6">
        {/* Hero + heading */}
        <div className="flex items-start gap-3">
          <UserIcon />
          <div className="flex flex-col gap-1 pt-1">
            <h2 className="text-[20px] font-semibold text-[#181d27] tracking-[-0.4px] leading-[1.3]">
              No worries!
            </h2>
            <p className="text-[13px] text-[#64748b] leading-[1.5]">
              You can submit your review anytime.
            </p>
          </div>
        </div>

        {/* Info card: where to find it */}
        <div className="bg-[#f8fafb] rounded-[10px] border border-[#e8f0ee] p-3.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#def2ee] flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M8 1.333A6.667 6.667 0 1 0 14.667 8 6.674 6.674 0 0 0 8 1.333Zm0 10.334a.667.667 0 1 1 0-1.334.667.667 0 0 1 0 1.334Zm.667-3.334a.667.667 0 0 1-1.334 0V5.667a.667.667 0 0 1 1.334 0v2.666Z" fill="#177564"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#181d27] leading-[1.4]">
              How to review later
            </p>
            <p className="text-[12px] text-[#64748b] leading-[1.5] mt-0.5">
              Your review and certificate will be waiting for you in:
            </p>
            {/* Breadcrumb path */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-1 bg-white border border-[#e2e8f0] rounded-[6px] px-2 py-[3px] text-[11px] font-semibold text-[#414651]">
                <svg className="w-3 h-3 text-[#177564]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
                Orders
              </span>
              <svg className="w-3 h-3 text-[#94a3b8] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              <span className="inline-flex items-center gap-1 bg-[#def2ee] border border-[#b8e4db] rounded-[6px] px-2 py-[3px] text-[11px] font-semibold text-[#177564]">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Completed
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <SecondaryButton onClick={onClose} fullWidth tone="neutral">
            Close
          </SecondaryButton>
          <PrimaryButton onClick={onGoToTickets} fullWidth className="flex-[2]">
            Go To Orders
          </PrimaryButton>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Submitted / Certificate View
// ---------------------------------------------------------------------------

function SubmittedView({ onClose }: { onClose: () => void }) {
  const handleDownload = useCallback(() => {
    // Mock download — in production this would fetch a real certificate PDF
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'certificate.pdf';
    // Simulated click
    alert('Certificate download started! (Mock)');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-[12px] shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08),0px_8px_8px_-4px_rgba(10,13,18,0.03)] overflow-hidden"
    >
      {/* Header bar */}
      <div className="bg-[#e9f6f4] flex items-center justify-between px-4 py-3">
        <span className="text-[#177564] text-[20px] font-semibold tracking-[-0.4px]">
          Review Submitted
        </span>
        <CloseButton onClick={onClose} />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 px-6 pt-8 pb-6">
        <UserIcon />

        <h2 className="text-[20px] font-semibold text-[#535862] tracking-[-0.4px] leading-[1.4]">
          Thank you for your review!
        </h2>

        <div className="flex flex-col gap-2 text-[16px] tracking-[-0.48px] leading-[1.4] text-[#535862]">
          <p className="font-medium">
            Your feedback helps us improve future events.
          </p>
          <p className="font-semibold">
            Your certificate is ready to download.
          </p>
        </div>

        {/* Download Certificate */}
        <div className="flex flex-col gap-2">
          <PrimaryButton onClick={handleDownload} fullWidth>
            Download Certificate
          </PrimaryButton>
          <p className="text-[10px] font-semibold text-black tracking-[-0.2px]">
            Save your achievement certificate to your device
          </p>
        </div>
      </div>
    </motion.div>
  );
}
