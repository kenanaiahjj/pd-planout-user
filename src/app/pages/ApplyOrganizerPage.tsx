/**
 * @file ApplyOrganizerPage.tsx
 * @description Full-page application form for becoming an event organizer.
 * Sections: Organization info, contact details, document uploads, T&C agreement.
 * Matches the PlanOut design system: SectionCard pattern, gold required asterisks,
 * shadow inputs, green accent, consistent typography.
 */
import React, { useState, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Upload,
  X,
  Check,
  FileText,
  Building2,
  User,
  Sparkles,
  CalendarCheck,
  BarChart3,
  Users,
  FileUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { useAppContext } from '@/app/context/AppContext';

// ---------------------------------------------------------------------------
// Design-system primitives (matching AccountTab / CertificatesTab)
// ---------------------------------------------------------------------------

const INPUT_CLS =
  'w-full bg-white border border-[#d5d7da] rounded-[8px] px-3.5 py-2.5 text-[#181d27] text-sm placeholder:text-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#177564]/20 focus:border-[#177564] transition-all shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]';

function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-[12px] border border-[#e2e8f0] p-4 sm:p-5 flex flex-col gap-5 ${className}`}>
      {children}
    </div>
  );
}

function SectionHeader({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      {icon && (
        <div className="w-8 h-8 rounded-[8px] bg-[#def2ee] flex items-center justify-center shrink-0 mt-0.5">
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-[#181d27] text-[16px] font-semibold">{title}</h3>
        {subtitle && <p className="text-[#94a3b8] text-[13px] mt-0.5">{subtitle}</p>}
      </div>
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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

interface DocumentField {
  id: string;
  label: string;
  required: boolean;
  hint: string;
  file: UploadedFile | null;
  dragOver: boolean;
}

// ---------------------------------------------------------------------------
// File Upload Zone
// ---------------------------------------------------------------------------

function FileUploadZone({
  doc,
  onFileSelect,
  onRemoveFile,
  onDragOver,
  onDragLeave,
}: {
  doc: DocumentField;
  onFileSelect: (id: string, file: File) => void;
  onRemoveFile: (id: string) => void;
  onDragOver: (id: string) => void;
  onDragLeave: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      onDragLeave(doc.id);
      const file = e.dataTransfer.files?.[0];
      if (file) onFileSelect(doc.id, file);
    },
    [doc.id, onFileSelect, onDragLeave],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      onDragOver(doc.id);
    },
    [doc.id, onDragOver],
  );

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel required={doc.required}>{doc.label}</FieldLabel>

      <AnimatePresence mode="wait">
        {doc.file ? (
          <motion.div
            key="uploaded"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="border border-[#177564]/20 bg-[#f0fdf9] rounded-[8px] p-3 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-[8px] bg-[#def2ee] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-[#177564]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#181d27] text-[13px] font-semibold truncate">{doc.file.name}</p>
              <p className="text-[#94a3b8] text-[11px]">
                {doc.file.size >= 1024 * 1024
                  ? `${(doc.file.size / (1024 * 1024)).toFixed(1)} MB`
                  : `${(doc.file.size / 1024).toFixed(1)} KB`}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#def2ee] text-[#177564] text-[10px] font-bold">
                <Check className="w-2.5 h-2.5" />
                Uploaded
              </span>
              <button
                onClick={() => onRemoveFile(doc.id)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#fef2f2] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={() => onDragLeave(doc.id)}
            onClick={() => inputRef.current?.click()}
            className={`group relative border border-dashed rounded-[8px] py-5 sm:py-6 flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
              doc.dragOver
                ? 'border-[#177564] bg-[#f0fdf9] scale-[1.01]'
                : 'border-[#d5d7da] hover:border-[#177564]/40 hover:bg-[#fafbfc]'
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              doc.dragOver ? 'bg-[#def2ee]' : 'bg-[#f3f4f6] group-hover:bg-[#def2ee]'
            }`}>
              <Upload className={`w-4 h-4 transition-colors ${
                doc.dragOver ? 'text-[#177564]' : 'text-[#94a3b8] group-hover:text-[#177564]'
              }`} />
            </div>
            <p className="text-[#4b5563] text-[12px] text-center px-4">
              <span className="text-[#177564] font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-[#94a3b8] text-[11px] text-center px-4">{doc.hint}</p>
            <p className="text-[#cbd5e1] text-[10px] mt-0.5">PDF, JPG, or PNG (max 5 MB)</p>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileSelect(doc.id, file);
                e.target.value = '';
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Benefits Banner
// ---------------------------------------------------------------------------

const BENEFITS = [
  { icon: <Sparkles className="w-3.5 h-3.5" />, text: 'Create and manage events' },
  { icon: <CalendarCheck className="w-3.5 h-3.5" />, text: 'Sell tickets and track registrations' },
  { icon: <Users className="w-3.5 h-3.5" />, text: 'Build your community of athletes' },
  { icon: <BarChart3 className="w-3.5 h-3.5" />, text: 'Access analytics and insights' },
];

// ---------------------------------------------------------------------------
// Success Screen
// ---------------------------------------------------------------------------

function SuccessScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-[28px] sm:text-[36px] font-semibold text-[#181d27] leading-none tracking-tight">
          Apply as Organizer
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <SectionCard className="items-center text-center py-10 sm:py-14">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
            className="w-16 h-16 rounded-full bg-[#def2ee] flex items-center justify-center"
          >
            <Check className="w-8 h-8 text-[#177564]" />
          </motion.div>
          <div className="flex flex-col gap-1.5 max-w-[380px]">
            <h3 className="text-[#181d27] text-[18px] font-semibold tracking-tight">
              Application Submitted!
            </h3>
            <p className="text-[#94a3b8] text-[13px] leading-relaxed">
              We'll review your application and get back to you within 2–3 business days.
              You'll receive a notification once approved.
            </p>
          </div>
          <PrimaryButton onClick={onBack} className="mt-1 px-8 py-2.5">
            Back to Settings
          </PrimaryButton>
        </SectionCard>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

const INITIAL_DOCUMENTS: DocumentField[] = [
  {
    id: 'gov-id',
    label: 'Government-Issued ID',
    required: true,
    hint: "Valid ID such as passport, driver's license, or national ID",
    file: null,
    dragOver: false,
  },
  {
    id: 'biz-reg',
    label: 'Proof of Business Registration',
    required: true,
    hint: 'SEC, DTI, or CDA registration certificate',
    file: null,
    dragOver: false,
  },
  {
    id: 'mayors-permit',
    label: "Mayor's Permit",
    required: true,
    hint: 'From the city where your organization is based',
    file: null,
    dragOver: false,
  },
  {
    id: 'lgu-permit',
    label: 'LGU Event Permit',
    required: true,
    hint: 'Local government unit permit for organizing events',
    file: null,
    dragOver: false,
  },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

export function ApplyOrganizerPage({ onBack }: { onBack: () => void }) {
  const { userProfile, setPendingOrgApplication } = useAppContext();

  // Form state
  const [orgName, setOrgName] = useState('');
  const [orgBio, setOrgBio] = useState('');
  const [fullName, setFullName] = useState(userProfile.name || '');
  const [email, setEmail] = useState(userProfile.email || '');
  const [contactNumber, setContactNumber] = useState(userProfile.phone || '');
  const [documents, setDocuments] = useState<DocumentField[]>(INITIAL_DOCUMENTS);
  const [submitted, setSubmitted] = useState(false);

  // Validation
  const requiredDocsFilled = documents.filter((d) => d.required).every((d) => d.file !== null);
  const canSubmit =
    orgName.trim() &&
    orgBio.trim() &&
    fullName.trim() &&
    email.trim() &&
    contactNumber.trim() &&
    requiredDocsFilled;

  // Completion progress
  const totalSteps = 6; // org name, bio, name, email, phone, docs
  let completed = 0;
  if (orgName.trim()) completed++;
  if (orgBio.trim()) completed++;
  if (fullName.trim()) completed++;
  if (email.trim()) completed++;
  if (contactNumber.trim()) completed++;
  if (requiredDocsFilled) completed++;
  const progress = Math.round((completed / totalSteps) * 100);

  // Document handlers
  const handleFileSelect = (docId: string, file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Invalid file type', {
        description: `"${file.name}" is not a supported format. Please upload a PDF, JPG, or PNG file.`,
      });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File too large', {
        description: `"${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)} MB. Maximum file size is 5 MB.`,
      });
      return;
    }
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, file: { name: file.name, size: file.size, type: file.type }, dragOver: false }
          : d,
      ),
    );
  };

  const handleRemoveFile = (docId: string) => {
    setDocuments((prev) => prev.map((d) => (d.id === docId ? { ...d, file: null } : d)));
  };

  const handleDragOver = (docId: string) => {
    setDocuments((prev) => prev.map((d) => (d.id === docId ? { ...d, dragOver: true } : d)));
  };

  const handleDragLeave = (docId: string) => {
    setDocuments((prev) => prev.map((d) => (d.id === docId ? { ...d, dragOver: false } : d)));
  };

  if (submitted) {
    return <SuccessScreen onBack={onBack} />;
  }

  return (
    <div className="flex flex-col gap-5 pb-6 animate-in fade-in duration-300">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-[28px] sm:text-[36px] font-semibold text-[#181d27] leading-none tracking-tight">
            Apply as Organizer
          </h1>
          <p className="text-[#94a3b8] text-[13px] mt-1 hidden sm:block">
            Complete this form to start creating and managing your own events
          </p>
        </div>
      </div>

      {/* ── Benefits card ── */}
      <SectionCard className="!p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-[#f0fdf9] to-[#def2ee]/50 px-4 sm:px-5 py-4 sm:py-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[7px] bg-[#177564] flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5 text-white" />
            </div>
            <p className="text-[#177564] text-[14px] font-semibold">As an organizer, you can:</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            {BENEFITS.map((b) => (
              <div key={b.text} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#177564] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-[#364153] text-[13px]">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* ── Progress bar ── */}
      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex items-center justify-between">
          <p className="text-[#94a3b8] text-[11px] font-semibold uppercase tracking-[0.5px]">
            Application Progress
          </p>
          <p className="text-[#177564] text-[11px] font-bold">{progress}%</p>
        </div>
        <div className="h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#3cd4b9] to-[#177564] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* ══ Section 1 — Organization Information ══ */}
      <SectionCard>
        <SectionHeader
          icon={<Building2 className="w-4 h-4 text-[#177564]" />}
          title="Organization Information"
          subtitle="Tell us about your organization"
        />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <FieldLabel required>Organization Name</FieldLabel>
            <input
              type="text"
              autoComplete="organization"
              enterKeyHint="next"
              aria-label="Organization name"
              placeholder="e.g. Metro Manila Runners"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className={INPUT_CLS}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel required>Organization Description</FieldLabel>
            <textarea
              aria-label="Organization description"
              placeholder="Describe your organization, its mission, and the events you plan to host"
              value={orgBio}
              onChange={(e) => setOrgBio(e.target.value)}
              rows={4}
              className={`${INPUT_CLS} resize-none`}
            />
            <p className="text-[#94a3b8] text-[11px]">
              {orgBio.length}/500 characters
            </p>
          </div>
        </div>
      </SectionCard>

      {/* ══ Section 2 — Contact Information ══ */}
      <SectionCard>
        <SectionHeader
          icon={<User className="w-4 h-4 text-[#177564]" />}
          title="Contact Information"
          subtitle="Your details for application verification"
        />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <FieldLabel required>Full Name</FieldLabel>
            <input
              type="text"
              autoComplete="name"
              enterKeyHint="next"
              aria-label="Full name"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={INPUT_CLS}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Email Address</FieldLabel>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              enterKeyHint="next"
              aria-label="Email address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={INPUT_CLS}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Contact Number</FieldLabel>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              enterKeyHint="done"
              aria-label="Contact number"
                placeholder="+63 XXX XXX XXXX"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className={INPUT_CLS}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ══ Section 3 — Required Documents ══ */}
      <SectionCard>
        <SectionHeader
          icon={<FileUp className="w-4 h-4 text-[#177564]" />}
          title="Required Documents"
          subtitle="Upload clear, readable copies of the following"
        />

        <div className="flex flex-col gap-5">
          {documents.map((doc) => (
            <FileUploadZone
              key={doc.id}
              doc={doc}
              onFileSelect={handleFileSelect}
              onRemoveFile={handleRemoveFile}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            />
          ))}
        </div>
      </SectionCard>

      {/* ══ Agreement + Submit ══ */}
      <SectionCard>
        <PrimaryButton
          onClick={() => {
            setPendingOrgApplication({
              orgName: orgName.trim(),
              orgType: 'Event Company',
              submittedAt: new Date().toISOString(),
            });
            setSubmitted(true);
          }}
          disabled={!canSubmit}
          fullWidth
          className="py-3"
        >
          Submit Application
        </PrimaryButton>

        <p className="text-center text-[#94a3b8] text-[12px] -mt-2 leading-relaxed">
          By submitting this application, you agree to our{' '}
          <button type="button" className="text-[#177564] text-[12px] hover:underline font-semibold">
            Terms and Conditions
          </button>{' '}
          and{' '}
          <button type="button" className="text-[#177564] text-[12px] hover:underline font-semibold">
            Privacy Policy
          </button>
        </p>

        <p className="text-center text-[#94a3b8] text-[12px] -mt-2">
          Have questions?{' '}
          <button type="button" className="text-[#177564] text-[12px] hover:underline font-semibold">
            Contact our support team
          </button>
        </p>
      </SectionCard>

      {/* Bottom spacing */}
      <div className="h-2" />
    </div>
  );
}
