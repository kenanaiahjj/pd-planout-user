/**
 * @file ParticipantFormPage.tsx
 * @description Participant form & management for 3 ticket types.
 *
 *  1. Single  — Buyer marks whether the entry is for them or someone else.
 *               Buyer-owned entries attach to buyer Passport; buyer-filled
 *               guest entries resolve as Guest QR.
 *  2. Multiple — Buyer sends invites to friends; each gets their own ticket
 *               independently once they complete their form.
 *  3. Team — Buyer adds players within the organizer's min/max requirement.
 *            Each player independently receives Passport access through a claim
 *            link, or a buyer-managed app-less Guest QR. There is no team lead
 *            credential or separate roster-management surface.
 *
 * Styling aligned with PlanOut design system:
 *  - #177564 primary, #def2ee accent, #f8fafc bg
 *  - rounded-[12px] cards, rounded-full pills
 *  - border-[#e2e8f0] / border-[#def2ee] borders
 *  - text-[#181d27] / text-[#64748b] / text-[#94a3b8] text tiers
 */

import React, { useState, useCallback } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  CheckCircle2,
  Camera,
  Send,
  X,
  UserPlus,
  Eye,
  Mail,
  Copy,
  ChevronDown,
  Clock,
  AlertCircle,
  FileText,
  User,
  Upload,
  Pencil,
  Phone,
  Trash2,
  Undo2,
  Users,
  IdCard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { ConfirmDialog } from '@/app/components/ConfirmDialog';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { type MyTicket, type Participant } from '@/app/data/tickets';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { SecondaryButton } from '@/app/components/SecondaryButton';
import { IconButton } from '@/app/components/IconButton';
import { SegmentedChoice, type SegmentedChoiceOption } from '@/app/components/SegmentedChoice';
import { FormTextField } from '@/app/components/FormTextField';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ParticipantFormPageProps {
  ticket: MyTicket;
  onBack: () => void;
  onGoToTickets: () => void;
  resubmission?: boolean;
  isPreCheckout?: boolean;
}

// ---------------------------------------------------------------------------
// Form data per participant
// ---------------------------------------------------------------------------

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
  waiver: string | null;
}

function emptyForm(participant?: Participant): FormData {
  const nameParts = participant?.name?.split(' ') ?? [];
  return {
    firstName: nameParts[0] ?? '',
    lastName: nameParts.slice(1).join(' ') ?? '',
    email: participant?.email ?? '',
    birthday: '',
    waiver: null,
  };
}

// ---------------------------------------------------------------------------
// Sub-view type
// ---------------------------------------------------------------------------

type SubView = 'form' | 'sendEmail' | 'sendAll';
type SingleEntryOwner = 'self' | 'guest';

function ActionModeTabs({
  options,
  value,
  onChange,
  columnsClass = 'grid-cols-2 max-w-sm',
}: {
  options: SegmentedChoiceOption<SubView>[];
  value: SubView;
  onChange: (value: SubView) => void;
  columnsClass?: string;
}) {
  return (
    <SegmentedChoice
      options={options}
      value={value}
      onChange={onChange}
      columnsClass={columnsClass}
    />
  );
}

// ---------------------------------------------------------------------------
// Remove Participant Confirmation Dialog
// ---------------------------------------------------------------------------

function RemoveConfirmDialog({
  open,
  onOpenChange,
  participantName,
  onConfirm,
  willDropBelowMin,
  minCount,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participantName: string;
  onConfirm: () => void;
  willDropBelowMin?: boolean;
  minCount?: number;
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Remove Participant?"
      description={
        <>
          Are you sure you want to remove{' '}
          <span className="font-semibold text-[#181d27]">{participantName}</span>?
          {' '}Their form data and any pending invite will be permanently deleted from the roster.
        </>
      }
      icon={<Trash2 className="w-6 h-6" />}
      iconVariant="destructive"
      confirmLabel="Remove"
      variant="destructive"
      onConfirm={onConfirm}
    >
      {willDropBelowMin && (
        <div className="mt-1 w-full bg-[#fffbeb] border border-[#fde68a] rounded-[8px] px-3 py-2 text-[12px] text-[#92400e] leading-relaxed text-left">
          This will bring your roster below the minimum of {minCount} participants. You'll need to add more before submitting.
        </div>
      )}
    </ConfirmDialog>
  );
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function DeadlineBadge({ deadline, minPlayers, maxPlayers }: { deadline?: string; minPlayers?: number; maxPlayers?: number }) {
  if (!deadline && !minPlayers) return null;
  return (
    <div className="flex items-center gap-4 flex-wrap text-[12px]">
      {deadline && (
        <div className="inline-flex items-center gap-1.5 text-[#dc2626]">
          <AlertCircle className="w-3.5 h-3.5" />
          <span className="font-semibold">
            Deadline: {deadline}
          </span>
        </div>
      )}
      {minPlayers != null && maxPlayers != null && (
        <div className="inline-flex items-center gap-1.5 text-[#177564]">
          <Users className="w-3.5 h-3.5" />
          <span className="font-semibold">
            {minPlayers}–{maxPlayers} players
          </span>
        </div>
      )}
    </div>
  );
}

function ProgressSummary({
  participants,
  className,
  isTeam = false,
}: {
  participants: Participant[];
  className?: string;
  isTeam?: boolean;
}) {
  const completed = participants.filter(
    (p) => p.formStatus === 'completed',
  ).length;
  const sentToOthers = participants.filter(
    (p) =>
      p.formStatus !== 'completed' &&
      (p.inviteStatus === 'invited' || p.sentToEmail),
  ).length;
  const incomplete = participants.filter(
    (p) =>
      p.formStatus === 'not_started' &&
      p.inviteStatus !== 'invited' &&
      !p.sentToEmail,
  ).length;
  const pending = participants.filter(
    (p) =>
      p.formStatus === 'pending' &&
      p.inviteStatus !== 'invited' &&
      !p.sentToEmail,
  ).length;
  const total = participants.length;
  return (
    <div className={`flex flex-wrap items-center gap-2 text-[12px] ${className || ''}`}>
      {isTeam ? (
        <>
          <span className="font-semibold text-[#059669]">Roster forms</span>
          <span className="text-[#94a3b8]">·</span>
          <span className="font-semibold text-[#181d27]">{completed} of {total} forms complete</span>
        </>
      ) : (
        <>
          <span className="font-semibold text-[#059669]">{completed} completed</span>
          {sentToOthers > 0 && (
            <span className="font-semibold text-[#3b82f6]">{sentToOthers} sent</span>
          )}
          {pending > 0 && (
            <span className="font-semibold text-[#d97706]">{pending} pending</span>
          )}
          {incomplete > 0 && (
            <span className="font-semibold text-[#94a3b8]">{incomplete} incomplete</span>
          )}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Event Header Card
// ---------------------------------------------------------------------------

function EventHeaderCard({ ticket }: { ticket: MyTicket }) {
  return (
    <div className="bg-white rounded-[12px] border border-[#def2ee] overflow-hidden shadow-[0px_16px_36px_0px_rgba(0,0,0,0.03)]">
      {/* Desktop: image on top for sticky sidebar */}
      <div className="hidden lg:block w-full aspect-[320/160] overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={ticket.image}
          alt={ticket.eventTitle}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="px-3 pt-2.5 pb-0.5 flex flex-wrap items-center gap-1.5">
        {/* Labels */}
        {ticket.labels
          .filter((label) => label.toLowerCase() !== ticket.ticketTypeName.toLowerCase())
          .map((label) => (
            <span
              key={label}
              className="bg-[#def2ee] text-[#177564] text-[10px] font-medium px-2 py-[2px] rounded-full"
            >
              {label}
            </span>
          ))}
        {/* Ticket type badge */}
        <span className="bg-[#f1f5f9] text-[#64748b] text-[9px] font-semibold px-2 py-[2px] rounded-full uppercase tracking-wide">
          {ticket.ticketTypeName}
        </span>
      </div>

      <div className="flex gap-2.5 px-3 py-2">
        {/* Event image (mobile only — desktop has the tall one above) */}
        <div className="w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] lg:hidden rounded-[8px] overflow-hidden shrink-0 bg-gray-100">
          <ImageWithFallback
            src={ticket.image}
            alt={ticket.eventTitle}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Event info */}
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <h2 className="text-[#181d27] text-[14px] font-semibold tracking-[-0.2px] leading-tight line-clamp-2">
            {ticket.eventTitle}
          </h2>
          <div className="flex items-center gap-1.5 text-[#64748b] text-[11px]">
            <Calendar className="w-3 h-3 text-slate-400 shrink-0" strokeWidth={1.8} />
            <span className="truncate">{ticket.eventDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#64748b] text-[11px]">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" strokeWidth={1.8} />
            <span className="truncate">{ticket.eventLocation}</span>
          </div>
        </div>
      </div>

      {/* Organizer row */}
      <div className="px-3 pb-2.5 flex items-center gap-2 border-t border-[#f1f5f9] pt-2">
        <div className="w-4 h-4 rounded-full bg-[#def2ee] flex items-center justify-center text-[#177564] text-[8px] font-bold shrink-0">
          {ticket.organizer.charAt(0)}
        </div>
        <span className="text-[#94a3b8] text-[10px] font-medium truncate">
          by {ticket.organizer}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FormField helper
// ---------------------------------------------------------------------------

function FormField({
  label,
  required,
  value,
  placeholder,
  type = 'text',
  onChange,
  highlight,
}: {
  label: string;
  required?: boolean;
  value: string;
  placeholder: string;
  type?: string;
  onChange: (value: string) => void;
  highlight?: 'warning';
}) {
  return (
    <FormTextField
      label={label}
      required={required}
      value={value}
      placeholder={placeholder}
      type={type as React.HTMLInputTypeAttribute}
      onChange={onChange}
      highlight={highlight}
    />
  );
}

// ---------------------------------------------------------------------------
// Reminder Modal
// ---------------------------------------------------------------------------

function ReminderModal({
  participantName,
  onCancel,
  onConfirm,
}: {
  participantName: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative z-10 bg-white rounded-[12px] w-[90%] max-w-[340px] shadow-[0px_16px_36px_0px_rgba(0,0,0,0.08)] animate-in zoom-in-95 fade-in duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <p className="text-[#177564] text-[15px] font-semibold">
            Complete Registration
          </p>
          <IconButton
            onClick={onCancel}
            aria-label="Close registration dialog"
            size="sm"
          >
            <X className="w-3.5 h-3.5" />
          </IconButton>
        </div>

        {/* Body */}
        <div className="flex flex-col items-center gap-4 px-5 py-6">
          <div className="w-[90px] h-[90px] rounded-full bg-[#def2ee] flex items-center justify-center">
            <Mail className="w-10 h-10 text-[#177564]" />
          </div>

          <div className="text-center">
            <p className="text-[#181d27] text-[15px] font-semibold">
              Reminder sent to {participantName || '[Participant]'}
            </p>
            <p className="text-[#64748b] text-[13px] mt-2 leading-relaxed">
              Team members will be able to edit their info and complete the
              registration process.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-5 pb-5">
          <SecondaryButton
            onClick={onCancel}
            tone="neutral"
            className="flex-1 min-h-0 rounded-[8px] py-2.5"
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={onConfirm} className="flex-1 py-2.5">
            Confirm
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// View Form / Progress Modal
// ---------------------------------------------------------------------------

function ViewFormModal({
  participant,
  participantIdx,
  form,
  isMulti,
  onClose,
}: {
  participant: Participant;
  participantIdx: number;
  form: FormData;
  isMulti: boolean;
  onClose: () => void;
}) {
  const isCompleted = participant.formStatus === 'completed';
  const isSent = participant.inviteStatus === 'invited' || !!participant.sentToEmail;
  const displayName = participant.name || `Participant ${participantIdx + 1}`;
  const sentEmail = participant.sentToEmail || participant.email || '';

  // Required fields checklist
  const fields: { label: string; filled: boolean; value: string }[] = [
    { label: 'First Name', filled: form.firstName.trim() !== '', value: form.firstName },
    { label: 'Last Name', filled: form.lastName.trim() !== '', value: form.lastName },
    ...(!isMulti ? [{ label: 'Email', filled: form.email.trim() !== '', value: form.email }] : []),
    { label: 'Waiver', filled: !!form.waiver, value: form.waiver || '' },
  ];
  const filledCount = fields.filter((f) => f.filled).length;
  const progressPct = fields.length > 0 ? (filledCount / fields.length) * 100 : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 bg-white rounded-[16px] w-[90%] max-w-[380px] shadow-[0px_16px_36px_0px_rgba(0,0,0,0.08)] animate-in zoom-in-95 fade-in duration-200 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
              isCompleted
                ? 'bg-[#d1fae5] text-[#065f46]'
                : isSent
                  ? 'bg-[#dbeafe] text-[#1e40af]'
                  : 'bg-[#f1f5f9] text-[#94a3b8]'
            }`}>
              {isCompleted ? (
                <CheckCircle2 className="w-4.5 h-4.5" />
              ) : (
                <span className="text-[13px] font-bold">
                  {participant.name ? participant.name.charAt(0).toUpperCase() : participantIdx + 1}
                </span>
              )}
            </div>
            <div>
              <p className="text-[#181d27] text-[15px] font-semibold leading-tight">
                {displayName}
              </p>
              <p className="text-[#94a3b8] text-[11px] font-medium mt-0.5">
                {isCompleted ? 'Form completed' : isSent ? 'Invitation pending' : 'Not started'}
              </p>
            </div>
          </div>
          <IconButton
            onClick={onClose}
            aria-label="Close participant details"
            size="sm"
          >
            <X className="w-3.5 h-3.5" />
          </IconButton>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          {/* Status badge */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-[10px] mb-4 ${
            isCompleted
              ? 'bg-[#ecfdf5] border border-[#a7f3d0]'
              : isSent
                ? 'bg-[#eff6ff] border border-[#bfdbfe]'
                : 'bg-[#f8fafc] border border-[#e2e8f0]'
          }`}>
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <div className="flex flex-1 flex-wrap items-center gap-1.5">
                  <span className="text-[#065f46] text-[12px] font-semibold">Form submitted · Ready for gate</span>
                </div>
              </>
            ) : isSent ? (
              <>
                <Clock className="w-4 h-4 text-[#3b82f6] shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-[#1e40af] text-[12px] font-semibold">Waiting for response</span>
                  <p className="text-[#60a5fa] text-[11px] mt-0.5 truncate">
                    Sent to {sentEmail}
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-[#94a3b8] shrink-0" />
                <span className="text-[#64748b] text-[12px] font-semibold">No form submitted yet</span>
              </>
            )}
          </div>

          {/* Completed: show filled form data */}
          {isCompleted && (
            <div className="flex flex-col gap-3">
              <p className="text-[#94a3b8] text-[10px] font-semibold uppercase tracking-wider">Submitted Information</p>
              <div className="bg-[#f8fafc] rounded-[12px] border border-[#e2e8f0] divide-y divide-[#f1f5f9]">
                {[
                  { label: 'Name', value: participant.name || 'N/A', icon: User },
                  { label: 'Email', value: participant.email || sentEmail || 'N/A', icon: Mail },
                  ...(form.birthday ? [{ label: 'Birthday', value: form.birthday, icon: Calendar }] : []),
                  { label: 'Waiver', value: form.waiver || 'Uploaded', icon: Upload },
                ].map(({ label, value, icon: FieldIcon }) => (
                  <div key={label} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-7 h-7 rounded-full bg-[#def2ee] flex items-center justify-center shrink-0">
                      <FieldIcon className="w-3.5 h-3.5 text-[#177564]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#94a3b8] text-[10px] font-medium">{label}</p>
                      <p className="text-[#181d27] text-[13px] font-medium truncate">{value}</p>
                    </div>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending: show form fields checklist */}
          {!isCompleted && (
            <div className="flex flex-col gap-3">
              {/* Progress ring */}
              <div className="flex items-center gap-3 mb-1">
                <div className="relative w-10 h-10 shrink-0">
                  <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="14" fill="none"
                      stroke={progressPct > 0 ? '#177564' : '#e2e8f0'}
                      strokeWidth="3"
                      strokeDasharray={`${progressPct * 0.88} 88`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#181d27]">
                    {filledCount}/{fields.length}
                  </span>
                </div>
                <div>
                  <p className="text-[#181d27] text-[13px] font-semibold">
                    {filledCount === 0 ? 'Not started' : `${filledCount} of ${fields.length} fields`}
                  </p>
                  <p className="text-[#94a3b8] text-[11px]">
                    {filledCount === 0
                      ? 'Waiting for participant to begin'
                      : filledCount < fields.length
                        ? 'Partially filled — waiting for completion'
                        : 'All fields filled — awaiting submission'}
                  </p>
                </div>
              </div>

              {/* Field checklist */}
              <p className="text-[#94a3b8] text-[10px] font-semibold uppercase tracking-wider">Required Fields</p>
              <div className="bg-[#f8fafc] rounded-[12px] border border-[#e2e8f0] divide-y divide-[#f1f5f9]">
                {fields.map(({ label, filled, value }) => (
                  <div key={label} className="flex items-center gap-3 px-4 py-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      filled ? 'bg-[#059669] text-white' : 'bg-[#f1f5f9] border border-[#e2e8f0]'
                    }`}>
                      {filled ? <CheckCircle2 className="w-3 h-3" /> : <span className="w-1.5 h-1.5 rounded-full bg-[#cbd5e1]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[12px] ${filled ? 'text-[#181d27] font-medium' : 'text-[#94a3b8]'}`}>
                        {label}
                      </p>
                    </div>
                    {filled && value && (
                      <span className="text-[#64748b] text-[11px] truncate max-w-[120px]">{value}</span>
                    )}
                    {!filled && (
                      <span className="text-[#cbd5e1] text-[10px] font-medium">Pending</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Invite timeline (for sent invites) */}
              {isSent && (
                <>
                  <p className="text-[#94a3b8] text-[10px] font-semibold uppercase tracking-wider mt-2">Invite Activity</p>
                  <div className="flex flex-col gap-0">
                    <div className="flex items-start gap-3 relative">
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-[#dbeafe] flex items-center justify-center shrink-0">
                          <Send className="w-2.5 h-2.5 text-[#3b82f6]" />
                        </div>
                        <div className="w-px h-6 bg-[#e2e8f0]" />
                      </div>
                      <div className="pb-4">
                        <p className="text-[#181d27] text-[12px] font-medium">Invitation sent</p>
                        <p className="text-[#94a3b8] text-[11px]">{sentEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-[#fef3c7] flex items-center justify-center shrink-0">
                          <Clock className="w-2.5 h-2.5 text-[#d97706]" />
                        </div>
                      </div>
                      <div>
                        <p className="text-[#d97706] text-[12px] font-medium">Awaiting response</p>
                        <p className="text-[#94a3b8] text-[11px]">Participant hasn't opened the form yet</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#f1f5f9] px-5 py-4 shrink-0">
          <PrimaryButton onClick={onClose} fullWidth className="py-2.5">
            Close
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// MAIN COMPONENT
// =========================================================================

export function ParticipantFormPage({
  ticket,
  onBack,
  onGoToTickets,
  resubmission = false,
  isPreCheckout = false,
}: ParticipantFormPageProps) {
  const navigate = useNavigate();
  const isTeam = ticket.ticketType === 'team';
  const isMultiple = ticket.ticketType === 'multiple';
  const isMulti =
    ticket.ticketType === 'multiple' || ticket.ticketType === 'team';

  const minP = ticket.minParticipants ?? 1;
  const maxP = ticket.maxParticipants ?? 99;

  // State
  const [participants, setParticipants] = useState<Participant[]>(
    ticket.participants,
  );
  const [forms, setForms] = useState<FormData[]>(
    ticket.participants.map((p) => emptyForm(p)),
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const [subView, setSubView] = useState<SubView>('form');
  const [submitted, setSubmitted] = useState(false);
  const [invitationsSent, setInvitationsSent] = useState(false);

  // Send email states
  const [emailToSend, setEmailToSend] = useState('');
  const [nameToSend, setNameToSend] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Send all invitations emails
  const [inviteEmails, setInviteEmails] = useState<string[]>(
    ticket.participants.map((p) => p.email ?? ''),
  );

  // Reminder modal
  const [reminderFor, setReminderFor] = useState<number | null>(null);

  // Edit email state (for changing email of invited-but-not-accepted participants)
  const [editingEmail, setEditingEmail] = useState(false);
  const [editedEmail, setEditedEmail] = useState('');
  const [emailResent, setEmailResent] = useState(false);

  // Remove participant confirmation dialog
  const [removeIdx, setRemoveIdx] = useState<number | null>(null);

  // View form modal
  const [viewingIdx, setViewingIdx] = useState<number | null>(null);

  // Animation direction for participant switching
  const [animDir, setAnimDir] = useState<1 | -1>(1);

  // Computed
  const currentForm = forms[activeIdx] ?? emptyForm();
  const currentParticipant = participants[activeIdx];
  const completedCount = participants.filter(
    (p) => p.formStatus === 'completed',
  ).length;
  const sentCount = participants.filter(
    (p) =>
      p.formStatus !== 'completed' &&
      (p.inviteStatus === 'invited' || p.sentToEmail),
  ).length;
  const allCompletedOrSent =
    completedCount + sentCount >= participants.length &&
    participants.length >= minP;
  const canAdd = isTeam && participants.length < maxP;

  const isFormFilled =
    currentForm.firstName.trim() !== '' &&
    currentForm.lastName.trim() !== '' &&
    (isMulti || currentForm.email.trim() !== '');
  const singleEntryOwner: SingleEntryOwner =
    !isMulti && currentParticipant?.isPrimary === false ? 'guest' : 'self';
  const isSingleGuestEntry = !isMulti && singleEntryOwner === 'guest';

  // Whether this participant's form has been sent or completed
  const isSentOrDone =
    currentParticipant?.formStatus === 'completed' ||
    currentParticipant?.inviteStatus === 'invited' ||
    !!currentParticipant?.sentToEmail;

  // Handlers
  const updateField = useCallback(
    (field: keyof FormData, value: string) => {
      setForms((prev) => {
        const next = [...prev];
        next[activeIdx] = { ...next[activeIdx], [field]: value };
        return next;
      });
    },
    [activeIdx],
  );

  const handleSaveParticipantInfo = () => {
    setParticipants((prev) => {
      const next = [...prev];
      next[activeIdx] = {
        ...next[activeIdx],
        formStatus: 'completed',
        name:
          `${currentForm.firstName} ${currentForm.lastName}`.trim() ||
          next[activeIdx].name,
        email: currentForm.email || next[activeIdx].email,
        inviteStatus: 'accepted',
      };
      return next;
    });
  };

  const handleSingleEntryOwnerChange = (owner: SingleEntryOwner) => {
    setParticipants((prev) => {
      const next = [...prev];
      const originalParticipant = ticket.participants[activeIdx];
      next[activeIdx] = {
        ...next[activeIdx],
        isPrimary: owner === 'self',
        name: owner === 'self' ? originalParticipant?.name ?? next[activeIdx].name : null,
        email: owner === 'self' ? originalParticipant?.email ?? next[activeIdx].email : null,
        sentToEmail: null,
        inviteStatus: 'not_invited',
      };
      return next;
    });

    setForms((prev) => {
      const next = [...prev];
      next[activeIdx] = owner === 'self' ? emptyForm(ticket.participants[activeIdx]) : emptyForm();
      return next;
    });
  };

  const handleSendFormEmail = () => {
    if (!emailToSend.trim()) return;
    const optionalName = nameToSend.trim() || null;
    setParticipants((prev) => {
      const next = [...prev];
      next[activeIdx] = {
        ...next[activeIdx],
        sentToEmail: emailToSend,
        inviteStatus: 'invited',
        // For single tickets: clear buyer info since the attendee is someone else
        ...(!isMulti
          ? { name: null, email: emailToSend, isPrimary: false }
          : {}),
        // For team/multi: save the optional name to help track who was invited
        ...(isMulti && optionalName ? { name: optionalName } : {}),
      };
      return next;
    });
    setEmailSent(true);
    setEmailToSend('');
    setNameToSend('');
    setTimeout(() => {
      setEmailSent(false);
      setSubView('form');
    }, 2000);
  };

  const handleSendAllInvitations = () => {
    setParticipants((prev) =>
      prev.map((p, idx) => {
        if (p.formStatus === 'completed') return p;
        const email = inviteEmails[idx];
        if (!email?.trim()) return p;
        return {
          ...p,
          sentToEmail: email,
          inviteStatus: 'invited' as const,
        };
      }),
    );
    setInvitationsSent(true);
  };

  const handleSubmitForms = () => {
    if (!isMulti && isFormFilled) {
      handleSaveParticipantInfo();
    }
    setSubmitted(true);
  };

  const handleAddParticipant = () => {
    // Team only — instantly add a blank participant slot
    const newP: Participant = {
      id: `p-new-${Date.now()}`,
      name: null,
      email: null,
      formStatus: 'not_started',
      inviteStatus: 'not_invited',
    };
    setParticipants((prev) => [...prev, newP]);
    setForms((prev) => [...prev, emptyForm(newP)]);
    setInviteEmails((prev) => [...prev, '']);
    // Auto-navigate to the newly added participant
    const newIdx = participants.length;
    setAnimDir(1);
    setActiveIdx(newIdx);
    setSubView('form');
  };

  /** Remove a participant by index after confirmation. */
  const handleRemoveParticipant = (idx: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== idx));
    setForms((prev) => prev.filter((_, i) => i !== idx));
    setInviteEmails((prev) => prev.filter((_, i) => i !== idx));
    // Adjust active index
    if (activeIdx >= idx && activeIdx > 0) {
      setActiveIdx((prev) => Math.max(0, prev - 1));
    }
    setRemoveIdx(null);
    setEditingEmail(false);
  };

  /** Change email and resend invite for a participant whose invite hasn't been accepted yet. */
  const handleChangeEmailAndResend = () => {
    if (!editedEmail.trim()) return;
    setParticipants((prev) => {
      const next = [...prev];
      next[activeIdx] = {
        ...next[activeIdx],
        email: editedEmail,
        sentToEmail: editedEmail,
        inviteStatus: 'invited',
      };
      return next;
    });
    setEmailResent(true);
    setTimeout(() => {
      setEmailResent(false);
      setEditingEmail(false);
    }, 2000);
  };

  /** Undo a sent invite so the current user can fill the form themselves. */
  const handleUndoSend = () => {
    setParticipants((prev) => {
      const next = [...prev];
      next[activeIdx] = {
        ...next[activeIdx],
        sentToEmail: null,
        inviteStatus: 'not_invited',
        formStatus: 'not_started',
        // For single tickets: restore buyer context
        ...(!isMulti ? { isPrimary: true, name: null, email: null } : {}),
        // For multi/team: clear the name that was auto-set from the send form
        ...(isMulti ? { name: null } : {}),
      };
      return next;
    });
    // Reset form fields so user starts fresh
    setForms((prev) => {
      const next = [...prev];
      next[activeIdx] = emptyForm();
      return next;
    });
    setEditingEmail(false);
    setSubView('form');
  };

  const handleWaiverUpload = useCallback(() => {
    setForms((prev) => {
      const next = [...prev];
      next[activeIdx] = { ...next[activeIdx], waiver: 'PlanOut_Waiver.pdf' };
      return next;
    });
  }, [activeIdx]);

  const handleRemoveWaiver = useCallback(() => {
    setForms((prev) => {
      const next = [...prev];
      next[activeIdx] = { ...next[activeIdx], waiver: null };
      return next;
    });
  }, [activeIdx]);

  /** Navigate to the next incomplete / unsent participant (for multiple tickets). */
  const goToNextIncomplete = () => {
    const nextIdx = participants.findIndex(
      (p, i) =>
        i !== activeIdx &&
        p.formStatus !== 'completed' &&
        p.inviteStatus !== 'invited' &&
        !p.sentToEmail,
    );
    if (nextIdx !== -1) {
      setAnimDir(nextIdx > activeIdx ? 1 : -1);
      setActiveIdx(nextIdx);
      setSubView('form');
      setEmailSent(false);
      setEditingEmail(false);
      setEmailToSend('');
      setNameToSend('');
    }
  };

  const nextIncompleteIdx = participants.findIndex(
    (p, i) =>
      i !== activeIdx &&
      p.formStatus !== 'completed' &&
      p.inviteStatus !== 'invited' &&
      !p.sentToEmail,
  );

  // -----------------------------------------------------------------------
  // INVITATIONS SENT SUCCESS
  // -----------------------------------------------------------------------
  if (invitationsSent) {
    return (
      <div className="flex flex-col gap-5 pb-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-[#def2ee] flex items-center justify-center text-[#177564] hover:bg-[#cbf0e8] transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-[24px] sm:text-[32px] font-semibold text-[#181d27] leading-none tracking-tight">
            {isTeam ? 'Team Registration' : "Participant's Form"}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 lg:gap-8 items-start">
          {/* Sticky event card (desktop) */}
          <div className="lg:sticky lg:top-[80px]">
            <EventHeaderCard ticket={ticket} />
          </div>

          {/* Success content */}
          <div className="bg-white rounded-[12px] border border-[#def2ee] shadow-[0px_16px_36px_0px_rgba(0,0,0,0.03)] flex flex-col items-center px-6 py-10 sm:py-14">
            {/* Illustration */}
            <div className="relative w-[140px] h-[140px] mb-6">
              <div className="absolute inset-0 rounded-full bg-[#def2ee]" />
              <div className="absolute inset-4 rounded-full bg-[#b5e6db] flex items-center justify-center">
                <div className="relative">
                  <Mail className="w-12 h-12 text-[#177564]" />
                  <div className="absolute -top-1 -right-2 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3cd4b9, #177564)' }}>
                    <Send className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-[#181d27] text-[20px] font-semibold tracking-[-0.3px] text-center">
              Invitations Sent!
            </h2>
            <p className="text-[#64748b] text-[13px] mt-2 text-center max-w-[340px] leading-relaxed">
              {isTeam
                ? 'Participants will receive a form link to complete their registration. You can track their progress from Orders or Passport.'
                : 'Participants will be able to edit their info and complete the registration process.'}
            </p>

            <div className="mt-8 w-full max-w-[280px]">
              <PrimaryButton onClick={onGoToTickets} fullWidth className="py-2.5">
                Continue
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // SUBMITTED SUCCESS (team: ticket generated)
  // -----------------------------------------------------------------------
  if (submitted) {
    return (
      <div className="flex flex-col gap-5 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-[#def2ee] flex items-center justify-center text-[#177564] hover:bg-[#cbf0e8] transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-[24px] sm:text-[32px] font-semibold text-[#181d27] leading-none tracking-tight">
            {isTeam ? 'Team Registration' : "Participant's Form"}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 lg:gap-8 items-start">
          {/* Sticky event card (desktop) */}
          <div className="lg:sticky lg:top-[80px]">
            <EventHeaderCard ticket={ticket} />
          </div>

          {/* Success content */}
          <div className="bg-white rounded-[12px] border border-[#def2ee] shadow-[0px_16px_36px_0px_rgba(0,0,0,0.03)] flex flex-col items-center px-6 py-10 sm:py-14">
            {/* Success icon */}
            <div className="relative w-[120px] h-[120px] mb-6">
              <div className="absolute inset-0 rounded-full bg-[#def2ee]" />
              <div className="absolute inset-3 rounded-full bg-[#b5e6db] flex items-center justify-center">
                <CheckCircle2 className="w-14 h-14 text-[#177564]" />
              </div>
            </div>

            <h2 className="text-[#181d27] text-[20px] font-semibold tracking-[-0.3px] text-center">
              {isPreCheckout
                ? 'Registration Form Completed!'
                : isTeam
                  ? 'Team Registration Submitted!'
                  : 'Form Successfully Submitted!'}
            </h2>
            <p className="text-[#64748b] text-[13px] mt-2 text-center max-w-[380px] leading-relaxed">
              {isPreCheckout
                ? 'Your participant details are saved. Proceed to payment to complete checkout.'
                : isTeam
                  ? 'Your team registration is saved. Each player uses their own Passport entry or Guest QR at the event.'
                  : isSingleGuestEntry
                    ? 'Your form is complete. This buyer-managed Guest QR can be shared or printed for gate entry.'
                    : 'Your form is complete. Staff will scan your PlanOut Passport at the gate.'}
            </p>

            <div className="mt-6 flex w-full max-w-[320px] items-center gap-3 rounded-[18px] border border-[#def2ee] bg-[#f0fdf9] p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#177564] text-white">
                <IdCard className="h-5 w-5" />
              </div>
              <div className="min-w-0 text-left">
                <p className="text-[14px] font-semibold text-[#181d27]">
                  {isSingleGuestEntry ? 'Use the Guest QR' : 'Use your universal passport QR'}
                </p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-[#64748b]">
                  {isSingleGuestEntry
                    ? 'The entry stays app-less and does not attach to any Passport.'
                    : 'Open Passport to show the same QR for every event.'}
                </p>
              </div>
            </div>

            {/* Player summary — access remains individual, not team-owned. */}
            {isTeam && (
              <div className="w-full max-w-[380px] mt-6 rounded-[12px] border border-[#def2ee] overflow-hidden">
                <div className="px-4 py-2.5 bg-[#f8fafc] border-b border-[#e2e8f0]">
                  <p className="text-[#181d27] text-[13px] font-semibold">
                    Team players ({participants.length})
                  </p>
                </div>
                {/* Participant rows */}
                {participants.map((p, idx) => (
                  <div
                    key={p.id}
                    className="px-4 py-2.5 flex items-center gap-3 border-b border-[#f1f5f9] last:border-b-0"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#d1fae5] text-[#065f46] flex items-center justify-center text-[11px] font-bold shrink-0">
                      {p.name ? p.name.charAt(0) : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#181d27] text-[12px] font-medium truncate">
                        {p.name || `Participant ${idx + 1}`}
                      </p>
                    </div>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 w-full max-w-[280px]">
              <PrimaryButton
                onClick={() => onGoToTickets()}
                fullWidth
                className="py-2.5"
              >
                {isPreCheckout
                  ? 'Continue to Checkout'
                  : 'Go to Orders'}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // MAIN RENDER
  // -----------------------------------------------------------------------
  return (
    <div className="flex flex-col gap-3 pb-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <h1 className="text-[24px] sm:text-[32px] font-semibold text-[#181d27] leading-none tracking-tight">
          {isTeam ? 'Team Registration' : "Participant's Form"}
        </h1>
      </div>

      {resubmission && (
        <div className="rounded-[14px] border border-[#fde68a] bg-[#fffbeb] px-4 py-3">
          <p className="text-[13px] font-semibold text-[#92400e]">
            Resubmitting form — pre-filled from your previous submission
          </p>
        </div>
      )}



      {/* Two-column grid: sticky event card (left) + scrollable form (right) on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-3 lg:gap-8 items-start">
        {/* Left: Sticky event card + form progress (desktop) */}
        <div className="lg:sticky lg:top-[80px] flex flex-col gap-3">
          <EventHeaderCard ticket={ticket} />

          {/* ── Desktop Form Progress Panel (lg+ only) ── */}
          <div className="hidden lg:flex flex-col bg-white rounded-[12px] border border-[#def2ee] shadow-[0px_16px_36px_0px_rgba(0,0,0,0.03)] overflow-hidden">
            {/* Panel header with status badge */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#177564]" />
                <span className="text-[#181d27] text-[13px] font-semibold">
                  {isTeam ? 'Roster forms' : 'Form Progress'}
                </span>
              </div>
              {ticket.status === 'action_required' && (
                <div className="flex items-center gap-1.5 bg-[#fffbeb] border border-[#fde68a] px-2.5 py-[3px] rounded-full">
                  <AlertCircle className="w-3 h-3 text-[#d97706]" />
                  <span className="text-[#92400e] text-[11px] font-semibold tracking-[0.2px]">Action Required</span>
                </div>
              )}
              {ticket.status === 'pending' && (
                <div className="flex items-center gap-1.5 bg-[#fffbeb] border border-[#fde68a] px-2.5 py-[3px] rounded-full">
                  <Clock className="w-3 h-3 text-[#d97706]" />
                  <span className="text-[#92400e] text-[11px] font-semibold tracking-[0.2px]">Pending</span>
                </div>
              )}
              {ticket.status === 'confirmed' && (
                <div className="flex items-center gap-1.5 bg-[#ecfdf5] border border-[#a7f3d0] px-2.5 py-[3px] rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-[#059669]" />
                  <span className="text-[#065f46] text-[11px] font-semibold tracking-[0.2px]">Confirmed</span>
                </div>
              )}
            </div>

            {/* Required fields checklist */}
            <div className="px-4 pt-3 pb-2">
              <p className="text-[#94a3b8] text-[10px] font-semibold uppercase tracking-wider mb-2">Required Fields</p>
              <div className="flex flex-col gap-1.5">
                {(() => {
                  const fields: { key: string; label: string; icon: typeof User }[] = [
                    { key: 'firstName', label: 'First Name', icon: User },
                    { key: 'lastName', label: 'Last Name', icon: User },
                    ...(!isMulti ? [{ key: 'email', label: 'Email', icon: Mail }] : []),
                    { key: 'waiver', label: 'Waiver Upload', icon: Upload },
                  ];
                  return fields.map(({ key, label, icon: Icon }) => {
                    const filled = key === 'waiver'
                      ? !!currentForm.waiver
                      : key === 'firstName'
                        ? currentForm.firstName.trim() !== ''
                        : key === 'lastName'
                          ? currentForm.lastName.trim() !== ''
                          : key === 'email'
                            ? currentForm.email.trim() !== ''
                            : false;
                    const preview = key !== 'waiver' && filled
                      ? String(currentForm[key as keyof FormData] ?? '')
                      : '';
                    return (
                      <div key={key} className="flex items-center gap-2 py-1">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          filled ? 'bg-[#059669] text-white' : 'bg-[#f1f5f9] text-[#cbd5e1]'
                        }`}>
                          {filled ? <CheckCircle2 className="w-3 h-3" /> : <Icon className="w-2.5 h-2.5" />}
                        </div>
                        <span className={`text-[12px] transition-colors ${filled ? 'text-[#181d27] font-medium' : 'text-[#94a3b8]'}`}>
                          {label}
                        </span>
                        {preview && (
                          <span className="text-[10px] text-[#94a3b8] ml-auto truncate max-w-[100px]">
                            {preview}
                          </span>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Participant roster (multi/team only) */}
            {isMulti && (
              <>
                <div className="mx-4 my-1 h-px bg-[#f1f5f9]" />
                <div className="px-4 pt-1 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[#94a3b8] text-[10px] font-semibold uppercase tracking-wider">
                      {isTeam
                        ? `Roster forms (${completedCount} of ${participants.length} forms complete)`
                        : `Participants (${completedCount + sentCount}/${participants.length})`}
                    </p>
                  </div>

                  {/* Mini progress bar */}
                  <div className="w-full h-1 bg-[#e2e8f0] rounded-full overflow-hidden mb-2.5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${participants.length > 0 ? (((isTeam ? completedCount : completedCount + sentCount) / participants.length) * 100) : 0}%`,
                        background: (isTeam ? completedCount : completedCount + sentCount) >= participants.length ? '#059669' : '#177564',
                      }}
                    />
                  </div>

                  {/* Roster list */}
                  <div className="flex flex-col gap-0.5 max-h-[240px] overflow-y-auto scrollbar-none">
                    {participants.map((p, idx) => {
                      const isDone = p.formStatus === 'completed';
                      const isSent = p.inviteStatus === 'invited' || !!p.sentToEmail;
                      const isAct = activeIdx === idx;
                      const canRemove = isTeam && !p.isPrimary && !isDone && participants.length > minP;
                      return (
                        <div key={p.id} className="flex items-center group/roster">
                          <button
                            onClick={() => { setAnimDir(idx > activeIdx ? 1 : -1); setActiveIdx(idx); setSubView('form'); setEmailSent(false); setEditingEmail(false); }}
                            className={`flex-1 flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] text-left transition-all ${isAct ? 'bg-[#def2ee]' : 'hover:bg-[#f8fafc]'}`}
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              isDone ? 'bg-[#d1fae5] text-[#065f46]'
                                : isSent ? 'bg-[#dbeafe] text-[#1e40af]'
                                  : isAct ? 'bg-[#177564] text-white'
                                    : 'bg-[#f1f5f9] text-[#94a3b8]'
                            }`}>
                              {p.name ? p.name.charAt(0).toUpperCase() : idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-[11px] font-medium truncate ${isAct ? 'text-[#177564]' : 'text-[#181d27]'}`}>
                                {p.name || `Participant ${idx + 1}`}
                                {p.isPrimary && !isTeam && <span className="text-[#94a3b8] font-normal ml-1">(You)</span>}
                              </p>
                              {isTeam && (
                                <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-1.5">
                                  <p className="text-[10px] font-medium text-[#94a3b8]">
                                    {isDone
                                      ? 'Form submitted · Ready for gate'
                                      : isSent
                                        ? 'Awaiting form submission'
                                        : p.name || p.email
                                          ? 'Awaiting form submission'
                                          : 'No PlanOut account needed'}
                                  </p>
                                </div>
                              )}
                            </div>
                            {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />}
                            {isSent && !isDone && <Clock className="w-3.5 h-3.5 text-[#3b82f6] shrink-0" />}
                            {!isDone && !isSent && <span className="w-2 h-2 rounded-full bg-[#fbbf24] shrink-0" />}
                          </button>
                          {canRemove && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setRemoveIdx(idx); }}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-[#cbd5e1] hover:text-[#ef4444] hover:bg-[#fef2f2] opacity-0 group-hover/roster:opacity-100 transition-all shrink-0 ml-0.5"
                              aria-label={`Remove ${p.name || `Participant ${idx + 1}`}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {isTeam && (
                    <p className="text-[#94a3b8] text-[10px] mt-2 text-center">
                      {minP}–{maxP} participants required · {participants.length} added
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Deadline + player count */}
            {(ticket.deadline || isMulti) && (
              <div className="px-4 pb-3 pt-1.5 border-t border-[#f1f5f9] flex flex-col gap-1.5">
                {ticket.deadline && (
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-3 h-3 text-[#dc2626]" />
                    <span className="text-[#991b1b] text-[10px] font-semibold">Due {ticket.deadline}</span>
                  </div>
                )}
                {isMulti && (
                  <div className="flex items-center gap-1.5">
                    <User className="w-3 h-3 text-[#177564]" />
                    <span className="text-[#177564] text-[10px] font-semibold">{minP}–{maxP} players required</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Form card */}
        <div className="bg-white rounded-[12px] border border-[#def2ee] shadow-[0px_16px_36px_0px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="flex flex-col gap-3.5 p-4 sm:p-5">
            {/* ── Multi header: Deadline + Add Participant + Progress + Tabs ── */}
            {isMulti ? (
              <>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <DeadlineBadge deadline={ticket.deadline} minPlayers={minP} maxPlayers={maxP} />
                  {/* Team player count is controlled by the organizer's min/max rule. */}
                  {canAdd && (
                    <button
                      onClick={handleAddParticipant}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#def2ee] text-[#177564] text-[12px] font-semibold whitespace-nowrap hover:bg-[#def2ee] transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Add Participant
                    </button>
                  )}
                </div>

                {/* Progress */}
                <ProgressSummary participants={participants} isTeam={isTeam} />

                {/* Participant tabs (pills) */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {participants.map((p, idx) => {
                    const isActive = activeIdx === idx;
                    const isDone = p.formStatus === 'completed';
                    const isSent =
                      p.inviteStatus === 'invited' || !!p.sentToEmail;
                    const canRemoveThis = isTeam && !p.isPrimary && !isDone && participants.length > minP;

                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setAnimDir(idx > activeIdx ? 1 : -1);
                          setActiveIdx(idx);
                          setSubView('form');
                          setEmailSent(false);
                          setEditingEmail(false);
                          setEmailToSend('');
                          setNameToSend('');
                        }}
                        className={`flex items-center gap-1.5 pl-3 py-1.5 text-[12px] font-semibold whitespace-nowrap transition-all rounded-full border cursor-pointer shrink-0 ${
                          canRemoveThis ? 'pr-2' : 'pr-3'
                        } ${
                          isActive
                            ? 'bg-[#177564] border-[#177564] text-white'
                            : isDone
                              ? 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0] hover:bg-[#e6fbf1]'
                              : isSent
                                ? 'bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe] hover:bg-[#e0f2fe]'
                                : 'bg-white border-[#e2e8f0] text-[#64748b] hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
                        }`}
                      >
                        <span>{p.name ? p.name.split(' ')[0] : `Participant ${idx + 1}`}</span>
                        {isDone && <CheckCircle2 className="w-3 h-3 shrink-0" />}
                        {isSent && !isDone && <Clock className="w-3 h-3 shrink-0" />}
                        {!isDone && !isSent && (
                          <span className="w-2 h-2 rounded-full bg-[#fbbf24] shrink-0" />
                        )}
                        {/* Remove button — team tickets, removable participants */}
                        {canRemoveThis && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setRemoveIdx(idx);
                            }}
                            className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                              isActive
                                ? 'hover:bg-white/20 text-white/70 hover:text-white'
                                : isSent
                                  ? 'hover:bg-[#dbeafe] text-[#93c5fd] hover:text-[#ef4444]'
                                  : 'hover:bg-[#e2e8f0] text-[#94a3b8] hover:text-[#ef4444]'
                            }`}
                            aria-label={`Remove Participant ${idx + 1}`}
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Team/multi action mode selector. Keep email actions secondary so the final submit remains primary. */}
                {!isSentOrDone && (
                  <ActionModeTabs
                    value={subView}
                    onChange={setSubView}
                    columnsClass="grid-cols-3"
                    options={[
                      { value: 'form', label: 'Fill Myself', icon: User },
                      { value: 'sendEmail', label: 'Send Form', icon: Send },
                      { value: 'sendAll', label: 'Send All', icon: Mail },
                    ]}
                  />
                )}
              </>
            ) : (
              <>
                {ticket.deadline && <DeadlineBadge deadline={ticket.deadline} minPlayers={isMulti ? minP : undefined} maxPlayers={isMulti ? maxP : undefined} />}

                {/* Single ticket: option to send form to someone else */}
                {!isSentOrDone && (
                  <div className="flex flex-col gap-3">
                    {/* Info hint */}
                    <p className="text-slate-500 text-[13px] font-medium leading-relaxed">
                      If someone else fills the form from a claim link, the entry attaches to that person's Passport.
                    </p>

                    <ActionModeTabs
                      value={subView}
                      onChange={setSubView}
                      options={[
                        { value: 'form', label: 'Fill Details Myself', icon: User },
                        { value: 'sendEmail', label: 'Invite via Email', icon: Mail },
                      ]}
                    />
                  </div>
                )}
              </>
            )}

            {/* ============================================================== */}
            {/* CONTENT AREA — animated on participant switch                   */}
            {/* ============================================================== */}

            <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${activeIdx}-${subView}`}
              initial={{ opacity: 0, x: animDir * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: animDir * -24 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >

            {/* ── FORM VIEW (default) ── */}
            {subView === 'form' && !isSentOrDone && (
              <div className="flex flex-col gap-3">
                {!isMulti && (
                  <fieldset className="flex flex-col gap-2">
                    <legend className="text-[#181d27] text-[13px] font-semibold">
                      This entry is for
                    </legend>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {[
                        {
                          value: 'self' as const,
                          label: 'Me',
                          description: 'Attaches to my Passport',
                        },
                        {
                          value: 'guest' as const,
                          label: 'Someone else',
                          description: 'Buyer-filled Guest QR',
                        },
                      ].map((option) => {
                        const selected = singleEntryOwner === option.value;
                        return (
                          <label
                            key={option.value}
                            className={`flex min-h-[70px] cursor-pointer items-start gap-3 rounded-[12px] border px-3.5 py-3 transition-all ${
                              selected
                                ? 'border-[#177564] bg-[#f0fdf9] text-[#177564]'
                                : 'border-[#e2e8f0] bg-white text-[#64748b] hover:border-[#b7ded6] hover:bg-[#f8fbfa]'
                            }`}
                          >
                            <input
                              type="radio"
                              name="single-entry-owner"
                              value={option.value}
                              checked={selected}
                              onChange={() => handleSingleEntryOwnerChange(option.value)}
                              className="mt-0.5 h-4 w-4 accent-[#177564]"
                            />
                            <span className="min-w-0">
                              <span className={`block text-[13px] font-semibold ${selected ? 'text-[#177564]' : 'text-[#181d27]'}`}>
                                {option.label}
                              </span>
                              <span className="mt-0.5 block text-[11px] font-medium leading-relaxed text-[#64748b]">
                                {option.description}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    <p className="text-[11px] font-medium leading-relaxed text-[#64748b]">
                      Buyer-filled forms for someone else generate Guest QR. Forms completed by the other person attach to their Passport.
                    </p>
                  </fieldset>
                )}

                {isTeam && (
                  <div className="text-[12px] text-slate-500 font-medium leading-relaxed">
                    <span className="font-semibold text-[#181d27] block mb-0.5">Fill their form now</span>
                    Fastest. You enter their details, then share an app-less Guest QR. No account is required.
                    <span className="block mt-1">If they want Passport access, send them the claim link instead.</span>
                  </div>
                )}
                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    label="First Name"
                    required
                    value={currentForm.firstName}
                    placeholder="John"
                    onChange={(v) => updateField('firstName', v)}
                    highlight={resubmission ? 'warning' : undefined}
                  />
                  <FormField
                    label="Last Name"
                    required
                    value={currentForm.lastName}
                    placeholder="Doe"
                    onChange={(v) => updateField('lastName', v)}
                    highlight={resubmission ? 'warning' : undefined}
                  />
                </div>

                {!isMulti && (
                  <FormField
                    label="Email"
                    required
                    value={currentForm.email}
                    placeholder="participant@email.com"
                    type="email"
                    onChange={(v) => updateField('email', v)}
                  />
                )}

                {isTeam && (
                  <>
                    <FormField
                      label="Email (optional)"
                      value={currentForm.email}
                      placeholder="participant@email.com"
                      type="email"
                      onChange={(v) => updateField('email', v)}
                    />
                    <p className="-mt-2 text-[11px] font-medium leading-relaxed text-[#64748b]">
                      This does not match a PlanOut account automatically. If they need Passport ownership, send a claim/invite link and have them log in or create an account.
                    </p>
                  </>
                )}

                {/* Dynamic organizer-defined upload field */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[#181d27] text-[13px] font-medium">
                      Waiver / Document Upload <span className="text-[#dc2626]">*</span>
                    </label>
                  </div>
                  <p className="text-[11px] text-[#64748b] -mt-1 leading-normal">
                    This file upload requirement is configured dynamically by the event organizer (e.g. Liability Waiver, Medical Certificate, or ID proof).
                  </p>
                  {currentForm.waiver ? (
                    <div className="relative p-[1.5px] rounded-[10px] bg-[#ecfdf5] border border-[#a7f3d0] shadow-[0_1px_2px_rgba(5,150,105,0.02)]">
                      <div className="relative rounded-[calc(10px-1.5px)] bg-white/60 backdrop-blur-sm px-4 py-3 flex items-center gap-3 border border-transparent">
                        <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0" />
                        <span className="text-[#065f46] text-[13px] font-semibold flex-1 truncate">
                          {currentForm.waiver}
                        </span>
                        <ConfirmDialog
                          trigger={
                            <button
                              className="w-6 h-6 rounded-full bg-white/90 border border-slate-200/50 flex items-center justify-center text-[#dc2626] hover:bg-[#fef2f2] hover:border-[#fca5a5] hover:scale-105 active:scale-95 transition-all shrink-0"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          }
                          icon={<Trash2 className="w-6 h-6" />}
                          iconVariant="destructive"
                          title="Remove Waiver?"
                          description={
                            <>
                              Are you sure you want to remove the uploaded waiver <strong>{currentForm.waiver}</strong>? You'll need to upload it again.
                            </>
                          }
                          confirmLabel="Yes, Remove"
                          cancelLabel="Cancel"
                          variant="destructive"
                          onConfirm={handleRemoveWaiver}
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleWaiverUpload}
                      className="w-full relative p-[1.5px] rounded-[10px] bg-slate-50/50 hover:bg-slate-100/30 border border-dashed border-slate-200/80 hover:border-[#177564]/40 hover:shadow-[0_4px_12px_rgba(23,117,100,0.03)] transition-all duration-300 group"
                    >
                      <div className="relative rounded-[calc(10px-1.5px)] bg-white px-4 py-4 flex flex-col items-center gap-2 border border-transparent">
                        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200/30 group-hover:bg-[#def2ee] group-hover:border-transparent flex items-center justify-center text-slate-400 group-hover:text-[#177564] transition-all duration-300">
                          <Camera className="w-5 h-5" />
                        </div>
                        <div className="text-center">
                          <p className="text-[13px] text-slate-500">
                            <span className="text-[#177564] font-semibold tracking-tight">
                              Click to upload
                            </span>{' '}
                            or drag and drop
                          </p>
                          <p className="text-[11px] text-[#cbd5e1] mt-0.5 font-medium">
                            SVG, PNG, JPG or GIF (max. 800×400px)
                          </p>
                        </div>
                      </div>
                    </button>
                  )}
                </div>

                {/* Save current participant details without submitting the whole form. */}
                <SecondaryButton
                  type="button"
                  onClick={handleSaveParticipantInfo}
                  disabled={!isFormFilled}
                  fullWidth
                  className="mt-1 h-11 text-[14px]"
                >
                  {resubmission ? 'Save changes' : isMultiple ? 'Save participant' : 'Save details'}
                </SecondaryButton>
              </div>
            )}

            {/* ── FORM SENT / COMPLETED VIEW ── */}
            {subView === 'form' && isSentOrDone && (
              <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                {/* Submitted info card */}
                <div className="bg-[#f8fafc] rounded-[12px] border border-[#e2e8f0] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[#181d27] text-[13px] font-semibold">
                      {currentParticipant?.formStatus === 'completed'
                        ? 'Completed Information'
                        : 'Form Sent To'}
                    </p>
                    {currentParticipant?.inviteStatus === 'invited' &&
                      currentParticipant?.formStatus !== 'completed' && (
                        <span className="inline-flex items-center gap-1 bg-[#eff6ff] text-[#1e40af] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#bfdbfe]">
                          <Clock className="w-3 h-3" /> Invitation Sent
                        </span>
                      )}
                    {currentParticipant?.formStatus === 'completed' && (
                      <span className="inline-flex items-center gap-1 bg-[#ecfdf5] text-[#065f46] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#a7f3d0]">
                        <CheckCircle2 className="w-3 h-3" /> Complete
                      </span>
                    )}
                  </div>

                  {currentParticipant?.formStatus === 'completed' && (
                    <div className="flex flex-col gap-2">
                      <div>
                        <p className="text-[#94a3b8] text-[11px] font-medium">
                          Name
                        </p>
                        <p className="text-[#181d27] text-[13px] font-medium">
                          {currentParticipant.name || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#94a3b8] text-[11px] font-medium">
                          Email
                        </p>
                        <p className="text-[#181d27] text-[13px] font-medium">
                          {currentParticipant.email || 'N/A'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Sent-to email with edit capability (only when not accepted) */}
                  {currentParticipant?.inviteStatus === 'invited' &&
                    currentParticipant?.formStatus !== 'completed' && (
                      <div>
                        <p className="text-[#94a3b8] text-[11px] font-medium mb-1">
                          Sent to
                        </p>
                        {editingEmail ? (
                          <div className="flex flex-col gap-2.5 mt-1.5">
                            <div className="flex items-start gap-2.5 bg-[#fffbeb] border border-[#fde68a] rounded-[8px] px-3 py-2">
                              <AlertCircle className="w-3.5 h-3.5 text-[#d97706] shrink-0 mt-0.5" />
                              <span className="text-[#92400e] text-[11px] leading-relaxed">
                                The previous invite will be invalidated. A new form link will be sent to the updated email.
                              </span>
                            </div>
                            <div className="relative p-[1.5px] rounded-[10px] bg-slate-100/80 hover:bg-slate-200/60 border border-slate-200/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)] transition-all duration-300 focus-within:bg-gradient-to-b focus-within:from-[#28b99e]/40 focus-within:to-[#177564]/30 focus-within:shadow-[0_4px_16px_rgba(23,117,100,0.05)] focus-within:border-transparent group">
                              <div className="relative rounded-[calc(10px-1.5px)] bg-white px-3.5 py-2.5 flex items-center gap-2.5 shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.005)] border border-transparent">
                                <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-[#177564] transition-colors duration-300 shrink-0" />
                                <input
                                  type="email"
                                  value={editedEmail}
                                  onChange={(e) => setEditedEmail(e.target.value)}
                                  placeholder="Enter new email address"
                                  className="w-full bg-transparent text-[14px] text-[#181d27] placeholder:text-[#cbd5e1] focus:outline-none min-w-0"
                                  autoFocus
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <SecondaryButton
                                onClick={() => {
                                  setEditingEmail(false);
                                  setEditedEmail('');
                                }}
                                tone="neutral"
                                className="flex-1 min-h-0 rounded-[8px] py-2 text-[12px]"
                              >
                                Cancel
                              </SecondaryButton>
                              <PrimaryButton
                                onClick={handleChangeEmailAndResend}
                                disabled={!editedEmail.trim() || emailResent}
                                className="flex-1 py-2"
                              >
                                {emailResent ? (
                                  <><CheckCircle2 className="w-3.5 h-3.5" /> Sent!</>
                                ) : (
                                  <><Send className="w-3.5 h-3.5" /> Resend to New Email</>
                                )}
                              </PrimaryButton>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <p className="text-[#181d27] text-[13px] font-medium flex-1">
                              {currentParticipant.sentToEmail ||
                                currentParticipant.email ||
                                'N/A'}
                            </p>
                            {/* Edit button — only when invite hasn't been accepted */}
                            {currentParticipant.inviteStatus !== 'accepted' && (
                              <button
                                onClick={() => {
                                  setEditedEmail(
                                    currentParticipant.sentToEmail ||
                                      currentParticipant.email ||
                                      '',
                                  );
                                  setEditingEmail(true);
                                }}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#e2e8f0] text-[#64748b] text-[11px] font-semibold whitespace-nowrap hover:bg-[#f8fafc] hover:text-[#177564] hover:border-[#def2ee] transition-colors"
                                title="Change email and resend"
                              >
                                <Pencil className="w-3 h-3" />
                                Change Email
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                </div>

                {/* Action row for sent participants */}
                {currentParticipant?.inviteStatus === 'invited' &&
                  currentParticipant?.formStatus !== 'completed' &&
                  !editingEmail && (
                    <>
                      <div className="flex items-center justify-end gap-2">
                        {[
                          { icon: Eye, title: 'View', action: () => setViewingIdx(activeIdx) },
                          { icon: Mail, title: 'Resend', action: () => setReminderFor(activeIdx) },
                          { icon: Copy, title: 'Copy link', action: () => {} },
                        ].map(({ icon: Icon, title, action }) => (
                          <button
                            key={title}
                            onClick={action}
                            className="w-8 h-8 rounded-full border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:bg-[#f8fafc] hover:text-[#177564] hover:border-[#def2ee] transition-colors"
                            title={title}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </button>
                        ))}
                      </div>

                      {/* Waiting message */}
                      <div className="bg-[#f8fafc] rounded-[10px] border border-dashed border-[#e2e8f0] py-4 text-center">
                        <p className="text-[#94a3b8] text-[13px]">
                          Waiting for {isMulti ? 'participant' : 'attendee'} to complete form…
                        </p>
                      </div>

                      {/* Undo send — fill it out myself instead */}
                      {currentParticipant?.inviteStatus !== 'accepted' && (
                        <button
                          onClick={handleUndoSend}
                          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-[10px] border border-[#e2e8f0] text-[#64748b] text-[12px] font-semibold whitespace-nowrap hover:bg-[#f8fafc] hover:text-[#177564] hover:border-[#def2ee] transition-colors"
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                          I'll fill this out myself instead
                        </button>
                      )}
                    </>
                  )}

              </div>
            )}

            {/* ── SEND FORM TO EMAIL VIEW ── */}
            {subView === 'sendEmail' && (
              <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                {/* Info banner */}
                <div className="flex items-start gap-2.5 bg-[#eff6ff] border border-[#bfdbfe] rounded-[10px] px-3.5 py-2.5">
                  <Mail className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                  <span className="text-[#1e40af] text-[12px] font-medium leading-relaxed">
                    {isTeam
                      ? 'Send them a claim link. They sign in or create an account, complete their own details, and the entry attaches to their Passport.'
                      : !isMulti
                        ? 'Send them the form link. They must sign in or create a PlanOut account, fill the form themselves, and this entry attaches to their Passport.'
                        : 'An invitation to complete this form will be sent to the email address below.'}
                  </span>
                </div>

                <FormField
                  label={isTeam ? "Participant's Email" : "Attendee's Email"}
                  required
                  value={emailToSend}
                  placeholder="Enter email address"
                  type="email"
                  onChange={setEmailToSend}
                />

                {/* Optional name — helps coach track who was invited */}
                {isMulti && (
                  <FormField
                    label="Name (optional)"
                    value={nameToSend}
                    placeholder="Helps you identify who you sent it to"
                    onChange={setNameToSend}
                  />
                )}

                <SecondaryButton
                  type="button"
                  onClick={handleSendFormEmail}
                  disabled={!emailToSend.trim()}
                  fullWidth
                >
                  {emailSent ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Email Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Form
                    </>
                  )}
                </SecondaryButton>
              </div>
            )}

            {/* ── SEND ALL FORM TO OTHERS VIEW ── */}
            {subView === 'sendAll' && (
              <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                {/* Info banner */}
                <div className="flex items-start gap-2.5 bg-[#def2ee] border border-[#a7f3d0] rounded-[10px] px-3.5 py-2.5">
                  <Send className="w-4 h-4 text-[#177564] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#065f46] text-[13px] font-semibold">
                      Send Invitations
                    </p>
                    <p className="text-[#177564] text-[12px] mt-0.5 leading-relaxed">
                      Enter email addresses for each participant.
                    </p>
                  </div>
                </div>

                {/* Participant email rows */}
                <div className="flex flex-col gap-2">
                  {participants.map((p, idx) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 bg-[#f8fafc] rounded-[10px] border border-[#e2e8f0] px-3.5 py-2.5"
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#def2ee] text-[#177564] text-[11px] font-bold shrink-0">
                        {idx + 1}
                      </span>

                      {p.formStatus === 'completed' ? (
                        <div className="flex-1 flex items-center gap-2 min-w-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                          <span className="text-[#065f46] text-[13px] font-medium truncate">
                            {p.email || 'Completed'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex-1 relative p-[1.5px] rounded-[10px] bg-slate-100/80 hover:bg-slate-200/60 border border-slate-200/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)] transition-all duration-300 focus-within:bg-gradient-to-b focus-within:from-[#28b99e]/40 focus-within:to-[#177564]/30 focus-within:shadow-[0_4px_16px_rgba(23,117,100,0.05)] focus-within:border-transparent group">
                          <div className="relative rounded-[calc(10px-1.5px)] bg-white px-3 py-1.5 flex items-center gap-2 shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.005)] border border-transparent">
                            <Mail className="w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#177564] transition-colors duration-300 shrink-0" />
                            <input
                              type="email"
                              value={inviteEmails[idx] ?? ''}
                              onChange={(e) => {
                                setInviteEmails((prev) => {
                                  const next = [...prev];
                                  next[idx] = e.target.value;
                                  return next;
                                });
                              }}
                              placeholder={`Email for Participant ${idx + 1}`}
                              className="w-full bg-transparent text-[13px] text-[#181d27] placeholder:text-[#cbd5e1] focus:outline-none min-w-0"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 pt-1">
                  <SecondaryButton
                    onClick={() => setSubView('form')}
                    tone="neutral"
                    className="flex-1 min-h-0 rounded-[8px] py-2.5"
                  >
                    Cancel
                  </SecondaryButton>
                  <SecondaryButton
                    type="button"
                    onClick={handleSendAllInvitations}
                    className="flex-1"
                  >
                    <Send className="w-4 h-4" />
                    Send Invitations
                  </SecondaryButton>
                </div>
              </div>
            )}

            </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Footer: Team — Submit Team Registration ── */}
          {isTeam && subView !== 'sendAll' && (
            <div className="border-t border-[#f1f5f9] px-4 sm:px-5 py-4 flex flex-col items-center gap-2">
              <PrimaryButton
                onClick={handleSubmitForms}
                disabled={!allCompletedOrSent}
                fullWidth
                className="py-2.5"
              >
                Save team entries
              </PrimaryButton>

              {!allCompletedOrSent && (
                <p className="text-[#dc2626] text-[11px] text-center font-medium">
                  * Every player must be completed or sent a claim link before
                  submitting.
                </p>
              )}

              <button
                onClick={onBack}
                className="text-[#94a3b8] text-[12px] font-semibold hover:text-[#64748b] transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {/* ── Footer: Multiple — per-participant progress & navigation ── */}
          {isMultiple && subView !== 'sendAll' && (
            <div className="border-t border-[#f1f5f9] px-5 sm:px-6 py-4 flex flex-col items-center gap-3">
              {completedCount + sentCount >= participants.length ? (
                /* All participants handled */
                <>
                  <PrimaryButton onClick={onGoToTickets} fullWidth className="py-2.5">
                    Back to Orders
                  </PrimaryButton>
                  <p className="text-[#059669] text-[11px] text-center font-medium">
                    All participant forms are handled!
                  </p>
                </>
              ) : isSentOrDone && nextIncompleteIdx !== -1 ? (
                /* Current participant done, others remain */
                <div className="flex items-center gap-3 w-full">
                  <SecondaryButton
                    onClick={onBack}
                    tone="neutral"
                    className="flex-1 min-h-0 rounded-[8px] py-2.5"
                  >
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton
                    onClick={goToNextIncomplete}
                    className="flex-1 py-2.5"
                  >
                    Next Participant →
                  </PrimaryButton>
                </div>
              ) : (
                <button
                  onClick={onBack}
                  className="text-[#94a3b8] text-[12px] font-semibold hover:text-[#64748b] transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          )}

          {/* Single ticket footer */}
          {!isMulti && subView !== 'sendEmail' && (
            <div className="border-t border-[#f1f5f9] px-5 sm:px-6 py-4 flex flex-col items-center gap-2.5">
              {isSentOrDone ? (
                /* Form was sent to someone else — show waiting state + back */
                <>
                  <PrimaryButton onClick={onGoToTickets} fullWidth className="py-2.5">
                    Back to Orders
                  </PrimaryButton>
                  <p className="text-[#94a3b8] text-[11px] text-center">
                    You'll be notified once the attendee completes the form.
                  </p>
                </>
              ) : (
                <div className="flex items-center gap-3 w-full">
                  <SecondaryButton
                    onClick={onBack}
                    tone="neutral"
                    className="flex-1 min-h-0 rounded-[8px] py-2.5"
                  >
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton
                    onClick={handleSubmitForms}
                    disabled={!isFormFilled}
                    className="flex-1 py-2.5"
                  >
                    Submit Form
                  </PrimaryButton>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reminder Modal */}
      {reminderFor !== null && (
        <ReminderModal
          participantName={
            participants[reminderFor]?.name ||
            `Participant ${reminderFor + 1}`
          }
          onCancel={() => setReminderFor(null)}
          onConfirm={() => setReminderFor(null)}
        />
      )}

      {/* View Form / Progress Modal */}
      {viewingIdx !== null && participants[viewingIdx] && (
        <ViewFormModal
          participant={participants[viewingIdx]}
          participantIdx={viewingIdx}
          form={forms[viewingIdx] ?? emptyForm()}
          isMulti={isMulti}
          onClose={() => setViewingIdx(null)}
        />
      )}

      {/* Remove Participant Confirmation Dialog */}
      <RemoveConfirmDialog
        open={removeIdx !== null}
        onOpenChange={(open) => { if (!open) setRemoveIdx(null); }}
        participantName={
          removeIdx !== null
            ? participants[removeIdx]?.name || `Participant ${removeIdx + 1}`
            : ''
        }
        onConfirm={() => { if (removeIdx !== null) handleRemoveParticipant(removeIdx); }}
        willDropBelowMin={participants.length <= minP}
        minCount={minP}
      />
    </div>
  );
}
