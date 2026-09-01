/**
 * @file ParticipantFormPage.tsx
 * @description A self-contained form for one participant entry.
 *
 *  1. Single  — Buyer marks whether the entry is for them or someone else.
 *               Buyer-owned entries attach to buyer Passport; buyer-filled
 *               guest entries resolve as Guest QR.
 *  2. Multiple — each participant opens their own targeted form from Orders.
 *  3. Team — each player has an independent form and access path.
 *
 * Styling aligned with PlanOut design system:
 *  - #177564 primary, #def2ee accent, #f8fafc bg
 *  - rounded-[12px] cards, rounded-full pills
 *  - border-[#e2e8f0] / border-[#def2ee] borders
 *  - text-[#181d27] / text-[#64748b] / text-[#94a3b8] text tiers
 */

import React, { useState, useCallback } from 'react';
import {
  Calendar,
  MapPin,
  CheckCircle2,
  Camera,
  Send,
  X,
  Eye,
  Mail,
  Clock,
  AlertCircle,
  FileText,
  User,
  Upload,
  Pencil,
  Phone,
  QrCode,
  Trash2,
  Undo2,
  IdCard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { ConfirmDialog } from '@/app/components/ConfirmDialog';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { type MyTicket, type Participant, type TeamPlayerAccessPath } from '@/app/data/tickets';
import { resolveTeamPlayerAccess, teamPlayerLabel } from '@/app/data/teamAccess.js';
import { PrimaryButton } from '@/app/components/PrimaryButton';
import { SecondaryButton } from '@/app/components/SecondaryButton';
import { IconButton } from '@/app/components/IconButton';
import {
  EntryCompletionChoice,
  type EntryCompletionChoiceValue,
} from '@/app/components/EntryCompletionChoice';
import { FormTextField } from '@/app/components/FormTextField';
import { ContactOrganizerButton, OrganizerContactWidget } from '@/app/components/OrganizerContactWidget';
import { useAppContext, type RegistrationEntryClaimResult } from '@/app/context/AppContext';
import {
  completeParticipantForm,
  isParticipantFormReady,
} from '@/app/data/participantFormState.js';
import { getOrganizerBySlug } from '@/app/data/organizers';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ParticipantFormPageProps {
  ticket: MyTicket;
  onBack: () => void;
  onGoToTickets: () => void;
  resubmission?: boolean;
  isPreCheckout?: boolean;
  initialParticipantId?: string;
  playerOnly?: boolean;
  onPlayerAccessChange?: (participantId: string, accessPath: TeamPlayerAccessPath) => void;
  onParticipantAccessChange?: (participantId: string, accessPath: TeamPlayerAccessPath) => void;
  onParticipantChange?: (participant: Participant) => void;
  onParticipantInvite?: (participantId: string, recipient: string, name?: string) => void;
  onParticipantInviteRevoke?: (participantId: string) => void;
  onInviteSubmit?: () => RegistrationEntryClaimResult;
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

type SubView = 'form' | 'sendEmail';
type SingleEntryOwner = 'self' | 'guest';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function DeadlineBadge({ deadline }: { deadline?: string }) {
  if (!deadline) return null;
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
    </div>
  );
}

// ---------------------------------------------------------------------------
// Event Header Card
// ---------------------------------------------------------------------------

function EventHeaderCard({ ticket }: { ticket: MyTicket }) {
  return (
    <div className="participant-form-event-card bg-white rounded-[12px] border border-[#def2ee] overflow-hidden shadow-[0px_16px_36px_0px_rgba(0,0,0,0.03)]">
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
  placeholder?: string;
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
    { label: 'First Name', filled: (form.firstName || '').trim() !== '', value: form.firstName || '' },
    { label: 'Last Name', filled: (form.lastName || '').trim() !== '', value: form.lastName || '' },
    ...(!isMulti ? [{ label: 'Email', filled: (form.email || '').trim() !== '', value: form.email || '' }] : []),
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
  initialParticipantId,
  playerOnly = false,
  onPlayerAccessChange,
  onParticipantAccessChange,
  onParticipantChange,
  onParticipantInvite,
  onParticipantInviteRevoke,
  onInviteSubmit,
}: ParticipantFormPageProps) {
  const navigate = useNavigate();
  const { canAttachTeamPlayerToPassport } = useAppContext();
  const isTeam = ticket.ticketType === 'team';
  const isMultiple = ticket.ticketType === 'multiple';
  const isMulti = isMultiple || isTeam;
  const isInviteMode = Boolean(onInviteSubmit);
  const organizerContact = getOrganizerBySlug(ticket.organizer);
  const [organizerContactOpen, setOrganizerContactOpen] = useState(false);
  const openOrganizerContact = () => setOrganizerContactOpen(true);
  const organizerContextSummary = `Form help · ${ticket.eventTitle} · Order ${ticket.confirmationRef}`;
  const isPlayerOnly = Boolean((isTeam || isMultiple) && (playerOnly || initialParticipantId));
  const selectedParticipant = initialParticipantId
    ? ticket.participants.find((participant) => participant.id === initialParticipantId)
    : ticket.participants[0];
  const participantIndex = Math.max(
    ticket.participants.findIndex((participant) => participant.id === selectedParticipant?.id),
    0,
  );
  const initialParticipants = selectedParticipant ? [selectedParticipant] : [];

  // State
  const [participants, setParticipants] = useState<Participant[]>(
    initialParticipants,
  );
  const [forms, setForms] = useState<FormData[]>(
    initialParticipants.map((p) => emptyForm(p)),
  );
  const teamOwnerSelectionLocked = Boolean(
    isTeam
      && isPlayerOnly
      && initialParticipants[0]?.id
      && resolveTeamPlayerAccess(initialParticipants[0]) !== 'passport'
      && !canAttachTeamPlayerToPassport(ticket.id, initialParticipants[0].id),
  );
  const initialTeamOwner: SingleEntryOwner = isTeam
    && !teamOwnerSelectionLocked
    && resolveTeamPlayerAccess(initialParticipants[0]) === 'passport'
    ? 'self'
    : 'guest';
  const activeIdx = 0;
  const [teamEntryOwner, setTeamEntryOwner] = useState<SingleEntryOwner>(initialTeamOwner);
  const [subView, setSubView] = useState<SubView>('form');
  const [submitted, setSubmitted] = useState(false);
  const [inviteConflict, setInviteConflict] = useState(false);
  const [inviteLinkRevoked, setInviteLinkRevoked] = useState(false);
  const [inviteConflictOwner, setInviteConflictOwner] = useState('another Passport');
  const [answersCopied, setAnswersCopied] = useState(false);

  // Send email states
  const [emailToSend, setEmailToSend] = useState('');
  const [nameToSend, setNameToSend] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Reminder modal
  const [reminderFor, setReminderFor] = useState<number | null>(null);

  // Edit email state (for changing email of invited-but-not-accepted participants)
  const [editingEmail, setEditingEmail] = useState(false);
  const [editedEmail, setEditedEmail] = useState('');
  const [emailResent, setEmailResent] = useState(false);

  // View form modal
  const [viewingIdx, setViewingIdx] = useState<number | null>(null);

  // Computed
  const currentForm = forms[activeIdx] ?? emptyForm();
  const currentParticipant = participants[activeIdx];

  const isFormFilled = isParticipantFormReady(currentForm, {
    requiresEmail: !isMulti,
  });
  const singleEntryOwner: SingleEntryOwner =
    currentParticipant?.isPrimary === false ? 'guest' : 'self';
  const entryOwner = isTeam ? teamEntryOwner : singleEntryOwner;
  const completionChoice: EntryCompletionChoiceValue = subView === 'sendEmail'
    ? 'claim'
    : entryOwner;
  const isSingleGuestEntry = !isInviteMode && !isMulti && singleEntryOwner === 'guest' && currentParticipant?.accessPath !== 'passport';
  const isBuyerManagedGuestEntry = !isInviteMode && Boolean(
    (currentParticipant?.accessPath === 'guest_qr')
      || (isTeam && resolveTeamPlayerAccess(currentParticipant) === 'guest_qr')
      || (isMultiple && currentParticipant?.isPrimary !== true && currentParticipant?.inviteStatus !== 'invited' && currentParticipant?.accessPath !== 'passport')
      || isSingleGuestEntry,
  );
  const currentGuestQrPath = currentParticipant?.id
    ? `/orders/${ticket.id}/entry/${ticket.id}-${currentParticipant.id}/guest-qr`
    : undefined;

  // Whether this participant's form has been sent or completed
  const isSentOrDone = !isInviteMode && (
    currentParticipant?.formStatus === 'completed' ||
    currentParticipant?.inviteStatus === 'invited' ||
    !!currentParticipant?.sentToEmail
  );
  const participantLabel = isTeam
    ? teamPlayerLabel(participantIndex)
    : currentParticipant?.name
      || currentParticipant?.email
      || 'Participant entry';
  const pageTitle = isSentOrDone && !isInviteMode
    ? 'Form details'
    : "Participant's Form";

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
    if (!currentParticipant) return;
    const buyerManagedGuest = isTeam
      ? teamEntryOwner === 'guest' || teamOwnerSelectionLocked
      : isBuyerManagedGuestEntry;
    const accessPath: TeamPlayerAccessPath = buyerManagedGuest ? 'guest_qr' : 'passport';
    const completedParticipant = completeParticipantForm(currentParticipant, currentForm, accessPath) as Participant;
    setParticipants((prev) => {
      const next = [...prev];
      next[activeIdx] = completedParticipant;
      return next;
    });
    onParticipantChange?.(completedParticipant);
    if (!onParticipantChange && currentParticipant.id) {
      if (isTeam) onPlayerAccessChange?.(currentParticipant.id, accessPath);
      else onParticipantAccessChange?.(currentParticipant.id, accessPath);
    }
  };

  const handleEntryOwnerChange = (owner: SingleEntryOwner) => {
    if (isTeam) {
      if (owner === 'self' && teamOwnerSelectionLocked) return;
      setTeamEntryOwner(owner);
      return;
    }

    const originalParticipant = selectedParticipant;
    setParticipants((prev) => {
      const next = [...prev];
      next[activeIdx] = {
        ...next[activeIdx],
        isPrimary: owner === 'self',
        name: owner === 'self' ? originalParticipant?.name ?? next[activeIdx].name : null,
        email: owner === 'self' ? originalParticipant?.email ?? next[activeIdx].email : null,
        sentToEmail: null,
        inviteStatus: 'not_invited',
        accessPath: owner === 'self' ? 'passport' : undefined,
      };
      return next;
    });

    setForms((prev) => {
      const next = [...prev];
      next[activeIdx] = owner === 'self' ? emptyForm(originalParticipant) : emptyForm();
      return next;
    });
  };

  const handleCompletionChoiceChange = (choice: EntryCompletionChoiceValue) => {
    if (choice === 'claim') {
      setSubView('sendEmail');
      return;
    }

    setSubView('form');
    handleEntryOwnerChange(choice);
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
        accessPath: 'pending',
        ...(isTeam ? { claimLinkRevoked: false } : {}),
        // For single tickets: clear buyer info since the attendee is someone else
        ...(!isMulti
          ? { name: null, email: emailToSend, isPrimary: false }
          : {}),
        // For team/multi: save the optional name to help track who was invited
        ...(isMulti && optionalName ? { name: optionalName } : {}),
      };
      return next;
    });
    if (currentParticipant?.id) {
      onParticipantInvite?.(currentParticipant.id, emailToSend.trim(), optionalName || undefined);
      if (isTeam) onPlayerAccessChange?.(currentParticipant.id, 'pending');
      else onParticipantAccessChange?.(currentParticipant.id, 'pending');
    }
    setEmailSent(true);
    setEmailToSend('');
    setNameToSend('');
    setTimeout(() => {
      setEmailSent(false);
      setSubView('form');
    }, 2000);
  };

  const handleSubmitForms = () => {
    if (isInviteMode) {
      if (!isFormFilled || inviteConflict) return;
      const result = onInviteSubmit();
      if (!result.ok) {
        setInviteConflictOwner(result.ownerName);
        setInviteLinkRevoked(result.reason === 'invite_revoked');
        setInviteConflict(true);
        return;
      }
      setParticipants((prev) => {
        const next = [...prev];
        next[activeIdx] = {
          ...next[activeIdx],
          formStatus: 'completed',
          inviteStatus: 'accepted',
          accessPath: 'passport',
          name: `${currentForm.firstName || ''} ${currentForm.lastName || ''}`.trim() || next[activeIdx].name,
          email: currentForm.email || next[activeIdx].email,
        };
        return next;
      });
      setSubmitted(true);
      return;
    }
    if (!isFormFilled) return;
    handleSaveParticipantInfo();
    setSubmitted(true);
  };

  const handleCopyInviteAnswers = async () => {
    if (!isInviteMode) return;
    const answerText = [
      `First name: ${currentForm.firstName}`,
      `Last name: ${currentForm.lastName}`,
      currentForm.email ? `Email: ${currentForm.email}` : '',
    ].filter(Boolean).join('\n');
    try {
      await navigator.clipboard?.writeText(answerText);
      setAnswersCopied(true);
      window.setTimeout(() => setAnswersCopied(false), 1800);
    } catch {
      // Clipboard access is best-effort; the form values remain visible.
    }
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
        accessPath: 'pending',
        ...(isTeam ? { claimLinkRevoked: false } : {}),
      };
      return next;
    });
    if (currentParticipant?.id) {
      onParticipantInvite?.(currentParticipant.id, editedEmail.trim(), currentParticipant.name || undefined);
      if (isTeam) onPlayerAccessChange?.(currentParticipant.id, 'pending');
      else onParticipantAccessChange?.(currentParticipant.id, 'pending');
    }
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
        accessPath: 'pending',
        ...(isTeam ? { name: null, email: null, claimLinkRevoked: true } : {}),
        ...(!isMulti ? { isPrimary: true, name: null, email: null } : {}),
        ...(isMulti && !isTeam ? { name: null } : {}),
      };
      return next;
    });
    if (isTeam && currentParticipant?.id) {
      onPlayerAccessChange?.(currentParticipant.id, 'pending');
    }
    if (currentParticipant?.id) onParticipantInviteRevoke?.(currentParticipant.id);
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


  // -----------------------------------------------------------------------
  // SUBMITTED SUCCESS (all individual player access paths handled)
  // -----------------------------------------------------------------------
  if (submitted) {
    return (
      <div className="participant-form-premium flex flex-col gap-5 pb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-[24px] sm:text-[32px] font-semibold text-[#181d27] leading-none tracking-tight">
            {pageTitle}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 lg:gap-8 items-start">
          {/* Sticky event card (desktop) */}
          <div className="lg:sticky lg:top-[80px]">
            <EventHeaderCard ticket={ticket} />
          </div>

          {/* Success content */}
          <div className="participant-form-card bg-white rounded-[12px] border border-[#def2ee] shadow-[0px_16px_36px_0px_rgba(0,0,0,0.03)] flex flex-col items-center px-6 py-10 sm:py-14">
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
                : isInviteMode
                  ? 'Form Successfully Submitted!'
                  : 'Form Successfully Submitted!'}
            </h2>
            <p className="text-[#64748b] text-[13px] mt-2 text-center max-w-[380px] leading-relaxed">
              {isPreCheckout
                ? 'Your participant details are saved. Proceed to payment to complete checkout.'
                : isInviteMode
                  ? 'Your form is complete. This entry is now attached to your PlanOut Passport.'
                : isBuyerManagedGuestEntry
                  ? 'This entry is saved. Return to Orders to manage or share its Guest QR.'
                  : 'Your form is complete. Staff will scan your PlanOut Passport at the gate.'}
            </p>

            <div className="mt-6 flex w-full max-w-[320px] items-center gap-3 rounded-[18px] border border-[#def2ee] bg-[#f0fdf9] p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#177564] text-white">
                <IdCard className="h-5 w-5" />
              </div>
              <div className="min-w-0 text-left">
                <p className="text-[14px] font-semibold text-[#181d27]">
                  {isBuyerManagedGuestEntry ? 'Use the Guest QR' : 'Use your universal passport QR'}
                </p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-[#64748b]">
                  {isBuyerManagedGuestEntry
                    ? 'The entry stays app-less and does not attach to any Passport.'
                    : 'Open Passport to show the same QR for every event.'}
                </p>
              </div>
            </div>

            <div className="mt-8 w-full max-w-[280px]">
              {isBuyerManagedGuestEntry && currentGuestQrPath && !isPreCheckout && (
                <SecondaryButton
                  type="button"
                  onClick={() => navigate(currentGuestQrPath)}
                  fullWidth
                  tone="neutral"
                  className="mb-3 py-2.5"
                >
                  <QrCode className="h-4 w-4" />
                  Open Guest QR
                </SecondaryButton>
              )}
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
    <>
      <div className="participant-form-premium flex flex-col gap-3 pb-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <h1 className="text-[24px] sm:text-[32px] font-semibold text-[#181d27] leading-none tracking-tight">
          {pageTitle}
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
          <div className="participant-form-card hidden lg:flex flex-col bg-white rounded-[12px] border border-[#def2ee] shadow-[0px_16px_36px_0px_rgba(0,0,0,0.03)] overflow-hidden">
            {/* Panel header with status badge */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#177564]" />
                <span className="text-[#181d27] text-[13px] font-semibold">
                  Form Progress
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
                        ? (currentForm.firstName || '').trim() !== ''
                        : key === 'lastName'
                          ? (currentForm.lastName || '').trim() !== ''
                          : key === 'email'
                            ? (currentForm.email || '').trim() !== ''
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

          </div>
        </div>

        {/* Right: Form card */}
        <div className="participant-form-card bg-white rounded-[12px] border border-[#def2ee] shadow-[0px_16px_36px_0px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="flex flex-col gap-3.5 p-4 sm:p-5">
            <div className="participant-form-identity flex items-center justify-between px-0.5 pb-0.5">
              <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-[#181d27]">
                {participantLabel}
              </h2>
            </div>
            {!isSentOrDone && organizerContact && (
              <div className="flex items-center justify-between gap-3 rounded-[13px] border border-[#d7e5e2] bg-[#f5faf8] px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#315f57]">
                    Need help filling this out?
                  </p>
                  <p className="mt-0.5 truncate text-[11px] font-medium text-[#7b8b9a]">
                    Contact {ticket.organizer} about this form.
                  </p>
                </div>
                <ContactOrganizerButton
                  onClick={openOrganizerContact}
                  className="px-2.5 text-[11px]"
                />
              </div>
            )}
            {ticket.deadline && <DeadlineBadge deadline={ticket.deadline} />}

            {!isInviteMode && !isSentOrDone && (
              <EntryCompletionChoice
                name={`participant-entry-completion-${currentParticipant?.id ?? 'current'}`}
                value={completionChoice}
                onChange={handleCompletionChoiceChange}
                selfTakenByAnotherEntry={teamOwnerSelectionLocked}
              />
            )}

            {/* ============================================================== */}
            {/* CONTENT AREA — the selected participant's form                */}
            {/* ============================================================== */}

            <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={subView}
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >

            {/* ── FORM VIEW (default) ── */}
            {subView === 'form' && !isSentOrDone && (
              <div className="flex flex-col gap-3">
                {isInviteMode && (
                  <div className="rounded-[12px] border border-[#def2ee] bg-[#f0fdf9] px-3.5 py-3 text-[12px] font-medium leading-relaxed text-[#35635a]">
                    You’re completing your assigned entry. Submit once to attach it to your PlanOut Passport.
                  </div>
                )}
                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    label="First Name"
                    required
                    value={currentForm.firstName}
                    onChange={(v) => updateField('firstName', v)}
                    highlight={resubmission ? 'warning' : undefined}
                  />
                  <FormField
                    label="Last Name"
                    required
                    value={currentForm.lastName}
                    onChange={(v) => updateField('lastName', v)}
                    highlight={resubmission ? 'warning' : undefined}
                  />
                </div>

                {!isMulti && (
                  <FormField
                    label="Email"
                    required
                    value={currentForm.email}
                    type="email"
                    onChange={(v) => updateField('email', v)}
                  />
                )}

                {isTeam && (
                  <>
                    <FormField
                      label="Email (optional)"
                      value={currentForm.email}
                      type="email"
                      onChange={(v) => updateField('email', v)}
                    />
                  </>
                )}

                {/* Dynamic event requirement upload field */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[#181d27] text-[13px] font-medium">
                      Waiver / Document Upload <span className="text-[#dc2626]">*</span>
                    </label>
                  </div>
                  {currentForm.waiver ? (
                    <div className="participant-form-upload relative p-[1.5px] rounded-[10px] bg-[#ecfdf5] border border-[#a7f3d0] shadow-[0_1px_2px_rgba(5,150,105,0.02)]">
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
                      className="participant-form-upload w-full relative p-[1.5px] rounded-[10px] bg-slate-50/50 hover:bg-slate-100/30 border border-dashed border-slate-200/80 hover:border-[#177564]/40 hover:shadow-[0_4px_12px_rgba(23,117,100,0.03)] transition-all duration-300 group"
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
                            PDF, PNG or JPG (max. 10 MB)
                          </p>
                        </div>
                      </div>
                    </button>
                  )}
                </div>

                {/* Single-entry forms can save details before the final submit. */}
                {!isInviteMode && !isMulti && (
                  <SecondaryButton
                    type="button"
                    onClick={handleSaveParticipantInfo}
                    disabled={!isFormFilled}
                    fullWidth
                    className="mt-1 h-11 text-[14px]"
                  >
                    {resubmission ? 'Save changes' : 'Save details'}
                  </SecondaryButton>
                )}
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
                          <Clock className="w-3 h-3" /> Claim link sent
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
                      {isBuyerManagedGuestEntry && currentGuestQrPath && (
                        <div className="flex items-center justify-between gap-3 rounded-[10px] border border-[#d9ece8] bg-[#f3fbf9] px-3 py-2.5">
                          <div className="flex min-w-0 items-center gap-2">
                            <QrCode className="h-4 w-4 shrink-0 text-[#177564]" />
                            <div className="min-w-0">
                              <p className="text-[12px] font-semibold text-[#177564]">Guest QR ready</p>
                              <p className="text-[11px] font-medium text-[#64748b]">Open it to share or manage this player&apos;s entry.</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => navigate(currentGuestQrPath)}
                            className="shrink-0 rounded-full border border-[#b7ded6] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#177564] transition-colors hover:bg-[#ecfdf8]"
                          >
                            Open QR
                          </button>
                        </div>
                      )}
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
                                  inputMode="email"
                                  autoComplete="email"
                                  enterKeyHint="send"
                                  aria-label="Updated invite email"
                                  value={editedEmail}
                                  onChange={(e) => setEditedEmail(e.target.value)}
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
                <div className="flex items-start gap-2.5 bg-[#f0fdf9] border border-[#def2ee] rounded-[10px] px-3.5 py-2.5">
                  <Mail className="w-4 h-4 text-[#177564] shrink-0 mt-0.5" />
                  <span className="text-[#35635a] text-[12px] font-medium leading-relaxed">
                    {isTeam
                      ? 'Send them a claim link. They sign in or create an account, complete their own details, and the entry attaches to their Passport.'
                      : !isMulti
                        ? 'Send them a claim link. They must sign in or create a PlanOut account, fill the form themselves, and this entry attaches to their Passport.'
                        : 'Send a claim link to the email address below. The participant completes the form and it attaches to their Passport.'}
                  </span>
                </div>

                <FormField
                  label={isTeam ? "Participant's Email" : "Attendee's Email"}
                  required
                  value={emailToSend}
                  type="email"
                  onChange={setEmailToSend}
                />

                {/* Optional name — helps the buyer identify the player */}
                {isMulti && (
                  <FormField
                    label="Name (optional)"
                    value={nameToSend}
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
                      <CheckCircle2 className="w-4 h-4" /> Claim link sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send claim link
                    </>
                  )}
                </SecondaryButton>
              </div>
            )}

            </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Footer: invited recipient submits only their own entry ── */}
          {isInviteMode && subView === 'form' && (
            <div className="participant-form-footer border-t border-[#f1f5f9] px-5 sm:px-6 py-4 flex flex-col items-center gap-2.5">
              {inviteConflict && (
                <div role="alert" className="w-full rounded-[12px] border border-[#f0c36d] bg-[#fffaf0] px-3.5 py-3 text-left">
                  {inviteLinkRevoked ? (
                    <>
                      <p className="text-[12px] font-semibold leading-relaxed text-[#8a5a00]">
                        This claim link was unsent by the buyer before it was accepted.
                      </p>
                      <p className="mt-1 text-[11px] font-medium leading-relaxed text-[#9a6a19]">
                        Ask the buyer to send a fresh link if you still need to complete this entry.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-[12px] font-semibold leading-relaxed text-[#8a5a00]">
                        This entry was completed by {inviteConflictOwner} first. Your answers are still here and have not been attached to that Passport.
                      </p>
                      <p className="mt-1 text-[11px] font-medium leading-relaxed text-[#9a6a19]">
                        Do not submit this link again. Ask the buyer for a fresh link if you still need an entry.
                      </p>
                    </>
                  )}
                </div>
              )}
              {inviteConflict && (
                <SecondaryButton type="button" onClick={handleCopyInviteAnswers} fullWidth tone="neutral" className="py-2.5">
                  {answersCopied ? 'Answers copied' : 'Copy my answers'}
                </SecondaryButton>
              )}
              {!inviteConflict && (
                <PrimaryButton
                  onClick={handleSubmitForms}
                  disabled={!isFormFilled}
                  fullWidth
                  className="py-2.5"
                >
                  Submit form
                </PrimaryButton>
              )}
              <button
                onClick={onBack}
                className="text-[#94a3b8] text-[12px] font-semibold hover:text-[#64748b] transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Footer: this form belongs to one participant only. */}
          {!isInviteMode && subView !== 'sendEmail' && (
            <div className="participant-form-footer border-t border-[#f1f5f9] px-5 sm:px-6 py-4 flex flex-col items-center gap-2.5">
              {isSentOrDone ? (
                <>
                  <PrimaryButton onClick={onGoToTickets} fullWidth className="py-2.5">
                    {isPreCheckout ? 'Continue checkout' : 'Back to Orders'}
                  </PrimaryButton>
                  {currentParticipant?.inviteStatus === 'invited' && currentParticipant?.formStatus !== 'completed' && (
                    <p className="text-[#94a3b8] text-[11px] text-center">
                      You&apos;ll be notified once this participant completes the form.
                    </p>
                  )}
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

      </div>

      {organizerContact && organizerContactOpen && (
        <OrganizerContactWidget
          key={`${organizerContact.id}:${ticket.id}:${ticket.confirmationRef}`}
          contact={organizerContact}
          contextSummary={organizerContextSummary}
          initiallyOpen
          showLauncher={false}
          onOpenChange={(open) => {
            if (!open) setOrganizerContactOpen(false);
          }}
        />
      )}
    </>
  );
}
