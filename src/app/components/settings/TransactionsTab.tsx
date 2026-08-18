/**
 * @file TransactionsTab.tsx
 * @description Table-style transaction list matching the reference design.
 * Columns: Transaction ID · Date · Event · Amount · Status
 * Tap any row to navigate to the full transaction detail page.
 */
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Search, Download, Receipt } from 'lucide-react';
import { SecondaryButton } from '../SecondaryButton';

// --- Types ---
interface EventLineItem {
  name: string;
  tickets: number;
  ticketType: string;
  price: number;
}

interface Transaction {
  id: string;
  date: string;
  events: EventLineItem[];
  paymentMethod: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Expired';
}

// --- Mock data (matching reference format) ---
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'AAA-QZCJU2',
    date: 'Mar 24, 2026',
    events: [{ name: 'Canlaon Marathon 2026', tickets: 1, ticketType: 'Straight', price: 1.0 }],
    paymentMethod: 'GCash ****4532',
    amount: 1.0,
    status: 'Completed',
  },
  {
    id: 'AAA-HNIQSH',
    date: 'Mar 24, 2026',
    events: [{ name: 'Dumaguete Fun Run', tickets: 1, ticketType: 'Straight', price: 950.0 }],
    paymentMethod: 'Maya ****8821',
    amount: 950.0,
    status: 'Completed',
  },
  {
    id: 'AAA-MK7T3P',
    date: 'Mar 18, 2026',
    events: [
      { name: 'Mountain Hiking Adventure', tickets: 2, ticketType: 'Standard', price: 200.0 },
      { name: 'Adventure Sports Festival', tickets: 1, ticketType: 'VIP', price: 550.0 },
    ],
    paymentMethod: 'Visa ****4532',
    amount: 950.0,
    status: 'Completed',
  },
  {
    id: 'AAA-XR2PLQ',
    date: 'Mar 10, 2026',
    events: [{ name: 'City Marathon Series', tickets: 1, ticketType: 'Early Bird', price: 350.0 }],
    paymentMethod: 'GCash ****4532',
    amount: 350.0,
    status: 'Completed',
  },
  {
    id: 'AAA-9WBVFN',
    date: 'Feb 28, 2026',
    events: [
      { name: 'Pickleball Tournament', tickets: 3, ticketType: 'Standard', price: 300.0 },
    ],
    paymentMethod: 'Maya ****8821',
    amount: 900.0,
    status: 'Completed',
  },
  {
    id: 'AAA-L4DJYC',
    date: 'Feb 14, 2026',
    events: [{ name: 'Adventure Sports Festival', tickets: 1, ticketType: 'VIP', price: 550.0 }],
    paymentMethod: 'Visa ****4532',
    amount: 550.0,
    status: 'Pending',
  },
  {
    id: 'AAA-T8KZMW',
    date: 'Jan 30, 2026',
    events: [{ name: 'Bacolod Cycling Challenge', tickets: 2, ticketType: 'Standard', price: 400.0 }],
    paymentMethod: 'GCash ****4532',
    amount: 800.0,
    status: 'Expired',
  },
];

const STATUS_CONFIG: Record<
  Transaction['status'],
  { label: string; textColor: string; bgColor: string }
> = {
  Completed: { label: 'Completed', textColor: '#177564', bgColor: '#ecfdf5' },
  Pending:   { label: 'Pending',   textColor: '#b45309', bgColor: '#fffbeb' },
  Expired:   { label: 'Expired',   textColor: '#6b7280', bgColor: '#f3f4f6' },
};

function transactionEventLabel(status: Transaction['status']) {
  if (status === 'Completed') return 'Payment successful';
  if (status === 'Pending') return 'Payment pending';
  return 'Checkout expired';
}

function transactionItemSummary(txn: Transaction) {
  const primary = txn.events[0];
  const extraCount = txn.events.length - 1;
  return `${primary.name}${extraCount > 0 ? ` +${extraCount} more` : ''}`;
}

// --- Status Badge ---
function StatusBadge({ status }: { status: Transaction['status'] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center px-2.5 py-[5px] rounded-full text-[12px] font-semibold whitespace-nowrap"
      style={{ color: cfg.textColor, backgroundColor: cfg.bgColor }}
    >
      {cfg.label}
    </span>
  );
}

// --- Table Row (desktop) ---
function TableRow({
  txn,
  onTap,
  isLast,
}: {
  txn: Transaction;
  onTap: () => void;
  isLast: boolean;
}) {
  const primary = txn.events[0];
  const isExpired = txn.status === 'Expired';

  return (
    <tr
      onClick={onTap}
      className={`cursor-pointer hover:bg-[#f8fafc] active:bg-[#f1f5f9] transition-colors ${
        !isLast ? 'border-b border-[#e9edf3]' : ''
      } ${isExpired ? 'opacity-60' : ''}`}
    >
      <td className="px-5 py-4 whitespace-nowrap">
        <span className="text-[#181d27] text-[13px] font-bold tracking-wide">{txn.id}</span>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <span className={`text-[13px] ${isExpired ? 'text-[#9ca3af]' : 'text-[#177564]'}`}>{txn.date}</span>
      </td>
      <td className="px-5 py-4">
        <p className="text-[#181d27] text-[13px] font-semibold leading-snug">
          {transactionEventLabel(txn.status)}
        </p>
        <p className="text-[#94a3b8] text-[12px] mt-0.5">
          {transactionItemSummary(txn)} &middot; {primary.tickets} {primary.tickets === 1 ? 'ticket' : 'tickets'}
        </p>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <span className={`text-[13px] font-bold ${isExpired ? 'text-[#9ca3af] line-through' : 'text-[#181d27]'}`}>
          &#8369;{txn.amount.toFixed(2)}
        </span>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <StatusBadge status={txn.status} />
      </td>
    </tr>
  );
}

// --- Mobile Card Row ---
function MobileRow({
  txn,
  onTap,
  isLast,
}: {
  txn: Transaction;
  onTap: () => void;
  isLast: boolean;
}) {
  const primary = txn.events[0];
  const isExpired = txn.status === 'Expired';

  return (
    <button
      onClick={onTap}
      className={`w-full px-4 py-3.5 flex items-center gap-3 hover:bg-[#f8fafc] active:bg-[#f1f5f9] transition-colors text-left relative ${
        !isLast ? 'border-b border-[#e9edf3]' : ''
      } ${isExpired ? 'opacity-60' : ''}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[#181d27] text-[13px] font-bold truncate">{txn.id}</p>
          <StatusBadge status={txn.status} />
        </div>
        <p className="text-[#181d27] text-[12px] font-semibold mt-1">
          {transactionEventLabel(txn.status)}
        </p>
        <p className="text-[#94a3b8] text-[12px] mt-0.5">
          {transactionItemSummary(txn)}
        </p>
        <p className={`text-[11px] mt-0.5 ${isExpired ? 'text-[#9ca3af]' : 'text-[#177564]'}`}>{txn.date}</p>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className={`text-[14px] font-bold ${isExpired ? 'text-[#9ca3af] line-through' : 'text-[#181d27]'}`}>
          &#8369;{txn.amount.toFixed(2)}
        </p>
      </div>
    </button>
  );
}

// --- Main ---
export function TransactionsTab() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return MOCK_TRANSACTIONS;
    const q = search.toLowerCase();
    return MOCK_TRANSACTIONS.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.events.some(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            e.ticketType.toLowerCase().includes(q)
        ) ||
        t.paymentMethod.toLowerCase().includes(q) ||
        t.date.toLowerCase().includes(q)
    );
  }, [search]);

  const totalSpent = useMemo(
    () =>
      MOCK_TRANSACTIONS.filter((t) => t.status === 'Completed').reduce(
        (sum, t) => sum + t.amount,
        0
      ),
    []
  );

  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-300">
      {/* Top bar: Search + Export */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
          <input
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            aria-label="Search transactions"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200/80 rounded-full pl-10 pr-4 py-2.5 text-[#181d27] text-[14px] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#177564]/10 focus:border-[#177564] transition-all shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.005)]"
          />
        </div>
        <SecondaryButton compact tone="neutral" className="rounded-full px-4 py-2.5 text-[13px]">
          <Download className="w-4 h-4" />
          Export
        </SecondaryButton>
      </div>

      {/* Table (md+) / Cards (sm) */}
      {filtered.length > 0 ? (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-[0px_1px_3px_0px_rgba(15,23,42,0.03)]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#e9edf3]">
                  {['Transaction ID', 'Date', 'Payment event', 'Amount', 'Status'].map((col) => (
                    <th
                      key={col}
                      className="px-5 py-3 text-left text-[11px] font-semibold tracking-[0.06em] uppercase text-[#94a3b8]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((txn, i) => (
                  <TableRow
                    key={txn.id}
                    txn={txn}
                    onTap={() => navigate(`/settings/transactions/${txn.id}`)}
                    isLast={i === filtered.length - 1}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-[0px_1px_3px_0px_rgba(15,23,42,0.03)]">
            {filtered.map((txn, i) => (
              <MobileRow
                key={txn.id}
                txn={txn}
                onTap={() => navigate(`/settings/transactions/${txn.id}`)}
                isLast={i === filtered.length - 1}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-10 flex flex-col items-center gap-3 text-center shadow-[0px_1px_3px_0px_rgba(15,23,42,0.03)]">
          <div className="w-12 h-12 rounded-full bg-[#f3f4f6] flex items-center justify-center">
            <Receipt className="w-5 h-5 text-[#94a3b8]" />
          </div>
          <p className="text-[#94a3b8] text-sm">No transactions found</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-end justify-between px-1 pt-1">
        <p className="text-[#94a3b8] text-[12px]">
          Showing {filtered.length} of {MOCK_TRANSACTIONS.length} transactions
        </p>
        <div className="text-right">
          <p className="text-[#94a3b8] text-[11px]">Total Spent</p>
          <p className="text-[#181d27] text-[15px] font-bold">&#8369;{totalSpent.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
