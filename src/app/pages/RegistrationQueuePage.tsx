import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Check, CheckCircle2, ChevronRight, Clock, Users } from 'lucide-react';
import { useAppContext } from '@/app/context/AppContext';
import { type RegistrationQueueEntry } from '@/app/data/tickets';

interface RegistrationQueuePageProps {
  mode: 'order' | 'all';
  entryId?: string | null;
  ticketId?: string | null;
}

function parseDeadline(deadline?: string): Date | null {
  if (!deadline) return null;
  const parsed = new Date(`${deadline} 23:59:59`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDeadline(deadline?: Date | null): string | null {
  if (!deadline) return null;
  return deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isPending(entry: RegistrationQueueEntry) {
  return entry.entryStatus === 'pending_form' || entry.entryStatus === 'resubmit_required';
}

function subtitleFor(entry: RegistrationQueueEntry) {
  if (entry.type === 'team') {
    return `Team · ${entry.teamAttachedCount || 0}/${entry.teamTotalCount || 0} player forms complete`;
  }
  if (entry.type === 'guest') return `For ${entry.personName}`;
  return entry.category || 'Your entry';
}

function actionLabel(entry: RegistrationQueueEntry) {
  if (entry.type === 'team') return 'Complete team entries';
  if (entry.entryStatus === 'resubmit_required') return 'Resubmit';
  return 'Fill out';
}

// ─── Pending card ────────────────────────────────────────────────────────────

function PendingCard({
  entry,
  onAction,
}: {
  entry: RegistrationQueueEntry;
  onAction: (entry: RegistrationQueueEntry) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onAction(entry)}
      className="group flex w-full items-center gap-4 rounded-[16px] border border-[#e8e8e8] bg-white p-4 text-left transition-all duration-200 hover:border-[#d1d5db] hover:shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] active:scale-[0.99]"
    >
      {/* Left icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f8f8f7]">
        {entry.type === 'team' ? (
          <Users className="h-4.5 w-4.5 text-[#6b7280]" strokeWidth={1.8} />
        ) : (
          <div className="h-2 w-2 rounded-full bg-[#f59e0b]" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold tracking-[-0.2px] text-[#181d27]">
          {entry.eventName}
        </p>
        <p className="mt-0.5 truncate text-[13px] text-[#9ca3af]">
          {subtitleFor(entry)}
          {entry.deadline ? ` · Due ${entry.deadline}` : ''}
        </p>
      </div>

      {/* Action */}
      <div className="flex shrink-0 items-center gap-1 text-[13px] font-semibold text-[#177564] opacity-80 transition-opacity group-hover:opacity-100">
        <span>{actionLabel(entry)}</span>
        <ChevronRight className="h-4 w-4" />
      </div>
    </button>
  );
}

// ─── Completed row ───────────────────────────────────────────────────────────

function CompletedRow({ entry }: { entry: RegistrationQueueEntry }) {
  return (
    <div className="flex items-center gap-3 px-1 py-2.5">
      <Check className="h-4 w-4 shrink-0 text-[#177564]" strokeWidth={2.4} />
      <p className="min-w-0 flex-1 truncate text-[14px] text-[#9ca3af]">
        {entry.eventName}
        {entry.type === 'guest' ? ` · ${entry.personName}` : ''}
      </p>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function RegistrationQueuePage({ mode, entryId, ticketId }: RegistrationQueuePageProps) {
  const navigate = useNavigate();
  const { registrationQueueEntries, activeRegistrationOrderRef } = useAppContext();

  const entries = useMemo(() => {
    if (entryId) {
      return registrationQueueEntries.filter((entry) => entry.id === entryId);
    }
    if (ticketId) {
      return registrationQueueEntries.filter((entry) => entry.ticketId === ticketId);
    }
    if (mode === 'order' && activeRegistrationOrderRef) {
      return registrationQueueEntries.filter((entry) => entry.orderRef === activeRegistrationOrderRef);
    }
    return registrationQueueEntries;
  }, [activeRegistrationOrderRef, entryId, mode, registrationQueueEntries, ticketId]);

  const pendingEntries = entries.filter(isPending);
  const completedEntries = entries.filter((e) => !isPending(e));
  const completedCount = completedEntries.length;
  const earliestDeadline = entries
    .map((entry) => parseDeadline(entry.deadline))
    .filter((deadline): deadline is Date => Boolean(deadline))
    .sort((a, b) => a.getTime() - b.getTime())[0];

  useEffect(() => {
    if (entries.length === 0 || pendingEntries.length > 0) return;
    const timeout = setTimeout(() => navigate('/passport'), 1400);
    return () => clearTimeout(timeout);
  }, [entries.length, navigate, pendingEntries.length]);

  const openForm = (entry: RegistrationQueueEntry) => {
    if (entry.type === 'team') {
      navigate(`/orders/${entry.ticketId}?returnTo=registration-queue`);
    } else {
      navigate(`${entry.formRoute}?returnTo=registration-queue&entryId=${encodeURIComponent(entry.id)}`);
    }
  };

  // --- Empty state ---
  if (entries.length === 0) {
    return (
      <div className="flex min-h-[52dvh] flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#f4f4f3] text-[#177564]">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-[22px] font-semibold tracking-[-0.4px] text-[#181d27]">
          No forms needed
        </h1>
        <p className="mt-2 max-w-[340px] text-[14px] leading-relaxed text-[#9ca3af]">
          Any entries that still need participant forms will appear here.
        </p>
      </div>
    );
  }

  // --- All complete ---
  if (pendingEntries.length === 0) {
    return (
      <div className="flex min-h-[52dvh] flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#def2ee] text-[#177564]">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-[22px] font-semibold tracking-[-0.4px] text-[#181d27]">
          All forms complete
        </h1>
        <p className="mt-2 max-w-[340px] text-[14px] leading-relaxed text-[#9ca3af]">
          Opening your Passport now.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[#177564]">
          Registration
        </p>
        <h1 className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.7px] text-[#181d27]">
          Complete your forms
        </h1>
        <p className="mt-2 text-[14px] text-[#9ca3af]">
          {completedCount} of {entries.length} done{earliestDeadline ? ` · Next deadline ${formatDeadline(earliestDeadline)}` : ''}
        </p>
      </div>

      {/* Pending */}
      <div className="flex flex-col gap-2.5">
        {pendingEntries.map((entry) => (
          <PendingCard key={entry.id} entry={entry} onAction={openForm} />
        ))}
      </div>

      {/* Completed */}
      {completedEntries.length > 0 && (
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[1.2px] text-[#c4c4c4]">
            Completed
          </p>
          <div className="flex flex-col divide-y divide-[#f0f0f0]">
            {completedEntries.map((entry) => (
              <CompletedRow key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <button
        type="button"
        onClick={() => navigate('/passport')}
        className="inline-flex items-center justify-center gap-1 self-center text-[13px] font-semibold text-[#177564] transition-opacity hover:opacity-70"
      >
        View Passport
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
