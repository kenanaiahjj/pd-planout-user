import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { ClipboardList } from 'lucide-react';
import { PrimaryButton } from '@/app/components/PrimaryButton';

const CHANGES = [
  { type: 'unchanged', fieldLabel: 'Full name', oldValue: 'Jessica Williams', newValue: 'Jessica Williams' },
  { type: 'updated', fieldLabel: 'Emergency contact', oldValue: 'Phone number only', newValue: 'Phone number + relationship required' },
  { type: 'new', fieldLabel: 'Medical notes', oldValue: '', newValue: 'Optional text field' },
  { type: 'removed', fieldLabel: 'Shirt pickup location', oldValue: 'Race village', newValue: '' },
] as const;

export function FormDiffPage() {
  const navigate = useNavigate();
  const { entryId = 'resubmit-aquathlon' } = useParams<{ entryId: string }>();
  const eventName = entryId === 'resubmit-aquathlon' ? 'Bay Aquathlon Challenge' : 'Registration';

  return (
    <div className="relative flex flex-col gap-5 pb-44">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[1.6px] text-[#c2410c]">Form update</p>
        <h1 className="mt-2 text-[26px] font-semibold leading-tight tracking-[-0.8px] text-[#181d27]">
          {eventName} — Form updated · v1 → v2 · Updated May 28 by organiser
        </h1>
      </div>

      <div className="rounded-[14px] border border-[#fde68a] bg-[#fffbeb] p-4">
        <p className="text-[13px] font-semibold leading-relaxed text-[#92400e]">
          The organiser updated the registration form. Review the changes below and resubmit. Your previous data is pre-filled.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        {CHANGES.map((change) => (
          <div key={change.fieldLabel} className="rounded-[16px] border border-white/75 bg-white/78 p-4 shadow-[0_18px_38px_-34px_rgba(15,23,42,0.48)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={`text-[15px] font-semibold ${change.type === 'removed' ? 'text-[#667085] line-through' : 'text-[#181d27]'}`}>
                  {change.fieldLabel}
                </p>
                {change.type === 'unchanged' && <p className="mt-1 text-[13px] text-[#64748b]">{change.newValue}</p>}
                {change.type === 'updated' && (
                  <p className="mt-1 text-[13px]">
                    <span className="text-[#b42318] line-through">{change.oldValue}</span>
                    <span className="mx-2 text-[#94a3b8]">→</span>
                    <span className="font-semibold text-[#177564]">{change.newValue}</span>
                  </p>
                )}
                {change.type === 'new' && (
                  <input
                    placeholder={change.newValue}
                    className="mt-2 w-full rounded-[8px] border border-[#a7f3d0] bg-white px-3 py-2 text-[13px]"
                  />
                )}
                {change.type === 'removed' && <p className="mt-1 text-[13px] text-[#94a3b8] line-through">{change.oldValue}</p>}
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                change.type === 'updated'
                  ? 'bg-[#fffbeb] text-[#92400e]'
                  : change.type === 'new'
                    ? 'bg-[#def2ee] text-[#177564]'
                    : 'bg-[#f1f5f9] text-[#64748b]'
              }`}>
                {change.type === 'updated' ? 'Updated' : change.type === 'new' ? 'New field' : change.type === 'removed' ? 'Removed' : 'Unchanged'}
              </span>
            </div>
          </div>
        ))}
      </section>

      <PrimaryButton
        type="button"
        onClick={() => navigate(`/orders/tkt-005/form?returnTo=passport&resubmit=1&entryId=${entryId}`)}
        fullWidth
        className="h-13 rounded-[14px] text-[14px]"
      >
        <ClipboardList className="h-4 w-4" />
        Review and resubmit form
      </PrimaryButton>
    </div>
  );
}
