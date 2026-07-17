import React from 'react';
import { Trophy } from 'lucide-react';

const orderCurrency = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
});

export type OrderRegistrationLine = {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  amount: number;
  statusLabel?: string;
  statusTone?: 'ready' | 'pending' | 'neutral' | 'danger';
  icon?: React.ComponentType<{ className?: string }>;
};

export type OrderPaymentLine = {
  id: string;
  label: string;
  amount: number;
};

export function formatOrderMoney(value: number) {
  return orderCurrency.format(value);
}

function statusClasses(tone: NonNullable<OrderRegistrationLine['statusTone']>) {
  if (tone === 'ready') return 'bg-[#def2ee] text-[#177564]';
  if (tone === 'pending') return 'bg-[#fffbeb] text-[#92400e]';
  if (tone === 'danger') return 'bg-[#fef2f2] text-[#b42318]';
  return 'bg-[#f1f5f9] text-[#64748b]';
}

export function OrderRegistrationItemCard({ item }: { item: OrderRegistrationLine }) {
  const Icon = item.icon || Trophy;
  const tone = item.statusTone || 'neutral';

  return (
    <article className="rounded-[18px] border border-neutral-100 bg-white p-4">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#177564]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="line-clamp-2 text-[15px] font-semibold tracking-[-0.2px] text-[#181d27]">
                  {item.title}
                </h3>
                {item.statusLabel && (
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClasses(tone)}`}>
                    {item.statusLabel}
                  </span>
                )}
              </div>
              {item.subtitle && (
                <p className="mt-0.5 text-[12px] font-medium text-[#94a3b8]">
                  {item.subtitle}
                </p>
              )}
              {item.meta && (
                <p className="mt-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2px] text-[#94a3b8]">
                  {item.meta}
                </p>
              )}
            </div>
            <span className="shrink-0 text-[13px] font-semibold text-[#181d27]">
              {formatOrderMoney(item.amount)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export function OrderPaymentSummary({
  lineItems,
  subtotal,
  fees,
  discount = 0,
  discountLabel = 'Discount',
  total,
  paymentMeta,
  title = 'Payment summary',
  totalLabel = 'Total',
  statusLabel,
  statusTone = 'neutral',
}: {
  lineItems?: OrderPaymentLine[];
  subtotal: number;
  fees: number;
  discount?: number;
  discountLabel?: string;
  total: number;
  paymentMeta?: string;
  title?: string;
  totalLabel?: string;
  statusLabel?: string;
  statusTone?: 'ready' | 'pending' | 'neutral' | 'danger';
}) {
  const hasLineItems = lineItems && lineItems.length > 0;

  return (
    <section className="rounded-[18px] border border-neutral-100 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[16px] font-semibold text-[#181d27]">{title}</h2>
        {statusLabel && (
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClasses(statusTone)}`}>
            {statusLabel}
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {hasLineItems && lineItems.map((item) => (
          <div key={item.id} className="flex justify-between gap-3 text-[13px] text-[#64748b]">
            <span className="min-w-0 truncate">{item.label}</span>
            <span className="shrink-0 font-semibold text-[#414651]">{formatOrderMoney(item.amount)}</span>
          </div>
        ))}
        <div className={hasLineItems ? "mt-2 border-t border-[#eef2f7] pt-2" : ""}>
          <div className="flex justify-between text-[13px] text-[#64748b]">
            <span>Subtotal</span>
            <span>{formatOrderMoney(subtotal)}</span>
          </div>
          <div className="mt-1 flex justify-between text-[13px] text-[#64748b]">
            <span>Fees</span>
            <span>{formatOrderMoney(fees)}</span>
          </div>
          {discount > 0 && (
            <div className="mt-1 flex justify-between text-[13px] text-[#177564]">
              <span>{discountLabel}</span>
              <span>-{formatOrderMoney(discount)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between text-[15px] font-semibold text-[#181d27]">
            <span>{totalLabel}</span>
            <span>{formatOrderMoney(total)}</span>
          </div>
        </div>
      </div>
      {paymentMeta && (
        <p className="mt-3 text-[12px] font-medium text-[#64748b]">
          {paymentMeta}
        </p>
      )}
    </section>
  );
}
