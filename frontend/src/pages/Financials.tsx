// //import React from 'react';
// import React, { useEffect, useState } from 'react';

// import { 
//   Wallet, 
//   TrendingUp, 
//   AlertCircle, 
//   Search, 
//   Filter, 
//   CreditCard, 
//   CheckCircle2, 
//   XCircle, 
//   Undo2,
//   ExternalLink,
//   Shield
// } from 'lucide-react';

// const Financials = () => {
//   const transactions = [
//     { id: 'TR-55410', event: 'Techno-Garden Summer Festival', amount: '$12,400.00', type: 'Escrow Release', status: 'Pending', date: '2h ago', risk: 'Low' },
//     { id: 'TR-55411', event: 'Private Gala Dinner', amount: '$2,100.00', type: 'Payout', status: 'Completed', date: '5h ago', risk: 'None' },
//     { id: 'TR-55412', event: 'Future of Web3: London', amount: '$450.00', type: 'Refund Request', status: 'Flagged', date: '1d ago', risk: 'High' }
//   ];

//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-end">
//         <div>
//           <h3 className="text-3xl font-extrabold tracking-tight text-on-surface">Financial Oversight</h3>
//           <p className="text-on-surface-variant text-sm mt-1">Manage escrow, payouts, and fraud prevention.</p>
//         </div>
//         <div className="flex gap-4">
//           <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
//             <p className="text-[10px] text-on-surface-variant font-bold uppercase">Total in Escrow</p>
//             <p className="text-xl font-extrabold text-primary">$482,910.45</p>
//           </div>
//           <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
//             <p className="text-[10px] text-on-surface-variant font-bold uppercase">Pending Payouts</p>
//             <p className="text-xl font-extrabold text-secondary">124</p>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-12 gap-8">
//         <div className="col-span-12 lg:col-span-8 space-y-6">
//           <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-indigo-50/50">
//             <div className="px-6 py-4 bg-indigo-50/30 flex justify-between items-center border-b border-indigo-50/50">
//               <h4 className="text-sm font-bold text-indigo-900">Recent Transactions</h4>
//               <div className="flex items-center gap-2">
//                 <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg"><Search size={18} /></button>
//                 <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg"><Filter size={18} /></button>
//               </div>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr className="border-b border-indigo-50">
//                     <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Transaction</th>
//                     <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Amount</th>
//                     <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Type</th>
//                     <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Risk</th>
//                     <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-indigo-50/30">
//                   {transactions.map((tx) => (
//                     <tr key={tx.id} className="hover:bg-surface-container-low/50 transition-colors group">
//                       <td className="px-6 py-4">
//                         <div className="text-sm font-bold text-on-surface">{tx.event}</div>
//                         <div className="text-[11px] text-on-surface-variant">ID: {tx.id} • {tx.date}</div>
//                       </td>
//                       <td className="px-6 py-4 font-bold text-primary">{tx.amount}</td>
//                       <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">{tx.type}</td>
//                       <td className="px-6 py-4">
//                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${tx.risk === 'High' ? 'text-tertiary bg-tertiary-container/10' : tx.risk === 'Low' ? 'text-amber-600 bg-amber-50' : 'text-secondary bg-secondary-container/10'}`}>
//                           {tx.risk}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-right">
//                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${tx.status === 'Completed' ? 'text-on-secondary-container bg-secondary-container' : tx.status === 'Flagged' ? 'text-tertiary bg-tertiary-container/20' : 'text-on-surface-variant bg-surface-container-highest'}`}>
//                           {tx.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         <div className="col-span-12 lg:col-span-4 space-y-6">
//           <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-indigo-50/50">
//             <div className="flex items-center gap-2 text-primary mb-4">
//               <Shield size={20} />
//               <h4 className="font-bold text-sm uppercase tracking-wider">Fraud Engine Alerts</h4>
//             </div>
//             <div className="space-y-4">
//               <div className="p-4 bg-tertiary-container/5 border-l-4 border-tertiary rounded-r-xl">
//                 <div className="flex justify-between items-start mb-1">
//                   <p className="text-xs font-bold text-tertiary">Suspicious Refund Pattern</p>
//                   <AlertCircle size={14} className="text-tertiary" />
//                 </div>
//                 <p className="text-[11px] text-on-surface-variant leading-relaxed">Host "Midnight Rebels" requested 12 refunds in 15 minutes. Potential account takeover or bot activity.</p>
//                 <div className="mt-3 flex gap-2">
//                   <button className="text-[10px] font-bold bg-tertiary text-white px-3 py-1 rounded-lg">Freeze Payouts</button>
//                   <button className="text-[10px] font-bold text-on-surface-variant px-3 py-1 hover:bg-surface-container-low rounded-lg">Investigate</button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-indigo-50/40 rounded-3xl p-6 border border-indigo-100/30">
//             <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Escrow Summary</h4>
//             <div className="space-y-4">
//               <div className="flex justify-between items-center text-sm">
//                 <span className="text-on-surface-variant">Scheduled for Release</span>
//                 <span className="font-bold">$142,000.00</span>
//               </div>
//               <div className="flex justify-between items-center text-sm">
//                 <span className="text-on-surface-variant">On Hold (Disputes)</span>
//                 <span className="font-bold text-tertiary">$12,450.00</span>
//               </div>
//               <div className="pt-4 border-t border-indigo-100/50 flex justify-between items-center">
//                 <span className="text-xs font-bold uppercase">Net Platform Fees</span>
//                 <span className="text-lg font-black text-primary">$42,105.00</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Financials;
// frontend/src/pages/Financials.tsx
// ✅ Real payments data from MongoDB (payments collection)
// ✅ server.js ka GET /payments endpoint use karta hai
// ✅ Stats: total amount, pending count, verified count
// ✅ Fraud Engine alerts static (real fraud detection future scope)

import React, { useEffect, useState } from 'react';
import {
  Wallet,
  TrendingUp,
  AlertCircle,
  Search,
  Filter,
  CreditCard,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Shield,
  Loader2,
  ExternalLink,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
// MongoDB payments collection ka document shape
type Payment = {
  id: string;               // _id stringified
  bookingId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amount: number;           // paise mein (200000 = ₹2000)
  currency: string;
  type: string;             // "booking" | "event" etc.
  status: string;           // "verified" | "pending" | "failed"
  verifiedAt?: string;
  createdAt: string;
  // Enriched fields (server join karta hai)
  eventTitle?: string;
  hostName?: string;
  risk?: string;            // server side se ya heuristic
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatAmount(paise: number, currency = 'INR') {
  const amount = paise / 100;
  if (currency === 'INR') return `₹${amount.toLocaleString('en-IN')}`;
  return `$${amount.toLocaleString('en-US')}`;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// Risk heuristic — riskScore server pe nahi hai abhi, toh client side laga do
// Future mein AI fraud detection integrate kar sakte ho
function getRisk(payment: Payment): 'High' | 'Medium' | 'Low' | 'None' {
  if (payment.status === 'failed') return 'High';
  if (!payment.razorpayPaymentId) return 'Medium';
  if (payment.status === 'verified') return 'None';
  return 'Low';
}

function getTypeLabel(type: string) {
  const map: Record<string, string> = {
    booking: 'Booking Payment',
    event: 'Event Ticket',
    service: 'Service Booking',
    refund: 'Refund',
  };
  return map[type] || type;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    verified: 'text-on-secondary-container bg-secondary-container',
    pending: 'text-on-surface-variant bg-surface-container-highest',
    failed: 'text-tertiary bg-tertiary-container/20',
    refunded: 'text-amber-700 bg-amber-50',
  };
  const cls = map[status.toLowerCase()] || 'text-on-surface-variant bg-surface-container-highest';
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${cls}`}>
      {status}
    </span>
  );
};

// ─── Risk Badge ───────────────────────────────────────────────────────────────
const RiskBadge = ({ risk }: { risk: string }) => {
  const map: Record<string, string> = {
    High: 'text-tertiary bg-tertiary-container/10',
    Medium: 'text-amber-600 bg-amber-50',
    Low: 'text-primary bg-primary/5',
    None: 'text-secondary bg-secondary-container/10',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${map[risk] || ''}`}>
      {risk}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Financials = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notification, setNotification] = useState<string | null>(null);

  // ── Fetch payments from server ──────────────────────────────────────────────
  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5006/payments');
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch payments');
      console.error('Payments fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // ── Computed stats ──────────────────────────────────────────────────────────
  // Total verified amount (paise → rupees)
  const totalVerified = payments
    .filter(p => p.status === 'verified')
    .reduce((sum, p) => sum + p.amount, 0);

  // Pending payments count
  const pendingCount = payments.filter(p => p.status === 'pending').length;

  // Failed / flagged count
  const flaggedCount = payments.filter(p => p.status === 'failed').length;

  // Platform fee estimate — 10% of total verified (placeholder)
  const platformFee = totalVerified * 0.10;

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filtered = payments.filter(p => {
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q
      || p.razorpayPaymentId?.toLowerCase().includes(q)
      || p.razorpayOrderId?.toLowerCase().includes(q)
      || p.bookingId?.toLowerCase().includes(q)
      || p.eventTitle?.toLowerCase().includes(q)
      || p.hostName?.toLowerCase().includes(q)
      || p.type?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  // High risk payments for fraud alerts
  const highRiskPayments = payments.filter(p => getRisk(p) === 'High').slice(0, 3);

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg font-bold text-sm text-white bg-secondary">
          {notification}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 block">
            MongoDB · payments collection
          </span>
          <h3 className="text-3xl font-extrabold tracking-tight text-on-surface">
            Financial Oversight
          </h3>
          <p className="text-on-surface-variant text-sm mt-1">
            Real-time payment data from Razorpay transactions.
          </p>
        </div>

        <div className="flex gap-3 items-center flex-wrap">
          {/* Total Verified */}
          <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase">Total Verified</p>
            <p className="text-xl font-extrabold text-primary">
              {isLoading ? '—' : formatAmount(totalVerified)}
            </p>
          </div>

          {/* Pending */}
          <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase">Pending</p>
            <p className="text-xl font-extrabold text-secondary">
              {isLoading ? '—' : pendingCount}
            </p>
          </div>

          {/* Failed */}
          <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase">Failed</p>
            <p className="text-xl font-extrabold text-tertiary">
              {isLoading ? '—' : flaggedCount}
            </p>
          </div>

          {/* Refresh */}
          <button
            onClick={() => { fetchPayments(); showToast('Payments refreshed!'); }}
            disabled={isLoading}
            className="bg-white border border-primary text-primary px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/5 disabled:opacity-50"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-12 gap-6">

        {/* ── Transactions Table ── */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-indigo-50/50">

            {/* Table Header */}
            <div className="px-6 py-4 bg-indigo-50/30 flex justify-between items-center border-b border-indigo-50/50 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <h4 className="text-sm font-bold text-indigo-900">
                  {payments.length} Transactions
                </h4>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                  LIVE
                </span>
              </div>

              {/* Search + Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    type="text"
                    placeholder="Search payment ID, event..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-surface-container-highest rounded-xl text-xs border-none focus:ring-1 ring-primary/20 w-48"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="bg-surface-container-highest border-none rounded-xl text-xs p-1.5 focus:ring-1 ring-primary/20"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-indigo-50">
                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Transaction</th>
                    <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Amount</th>
                    <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Type</th>
                    <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Risk</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-50/30">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center">
                        <Loader2 size={28} className="animate-spin text-primary mx-auto mb-2" />
                        <p className="text-sm text-on-surface-variant">Fetching from MongoDB payments collection…</p>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center">
                        <p className="text-sm text-tertiary font-bold mb-2">⚠️ {error}</p>
                        <p className="text-xs text-on-surface-variant">
                          Make sure backend is running: <code className="bg-surface-container px-2 py-0.5 rounded">node server.js</code>
                        </p>
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-sm text-on-surface-variant">
                        {payments.length === 0
                          ? 'No payments found in MongoDB.'
                          : 'No payments match this filter.'}
                      </td>
                    </tr>
                  ) : (
                    filtered.map(payment => {
                      const risk = getRisk(payment);
                      return (
                        <tr key={payment.id} className="hover:bg-surface-container-low/50 transition-colors">

                          {/* Transaction Info */}
                          <td className="px-6 py-4">
                            <div className="text-sm font-bold text-on-surface">
                              {payment.eventTitle || payment.bookingId?.slice(0, 16) || 'Unknown Event'}
                            </div>
                            <div className="text-[11px] text-on-surface-variant mt-0.5">
                              {payment.razorpayPaymentId
                                ? `pay_${payment.razorpayPaymentId.slice(-8)}`
                                : payment.razorpayOrderId?.slice(0, 20) || payment.id.slice(0, 16)
                              }
                              {' • '}
                              {payment.createdAt ? timeAgo(payment.createdAt) : '—'}
                            </div>
                            {payment.hostName && (
                              <div className="text-[10px] text-on-surface-variant mt-0.5">
                                Host: <span className="font-semibold">{payment.hostName}</span>
                              </div>
                            )}
                          </td>

                          {/* Amount */}
                          <td className="px-4 py-4 font-bold text-primary text-sm">
                            {formatAmount(payment.amount, payment.currency)}
                          </td>

                          {/* Type */}
                          <td className="px-4 py-4 text-xs font-medium text-on-surface-variant">
                            {getTypeLabel(payment.type)}
                          </td>

                          {/* Risk */}
                          <td className="px-4 py-4">
                            <RiskBadge risk={risk} />
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 text-right">
                            <StatusBadge status={payment.status} />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            {!isLoading && !error && filtered.length > 0 && (
              <div className="px-6 py-3 bg-surface-container-low/30 border-t border-indigo-50/50 text-xs text-on-surface-variant">
                Showing {filtered.length} of {payments.length} transactions
              </div>
            )}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="col-span-12 lg:col-span-4 space-y-6">

          {/* Fraud Engine Alerts */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-indigo-50/50">
            <div className="flex items-center gap-2 text-primary mb-4">
              <Shield size={20} />
              <h4 className="font-bold text-sm uppercase tracking-wider">Fraud Engine Alerts</h4>
            </div>

            {isLoading ? (
              <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                <Loader2 size={14} className="animate-spin" />
                Analyzing payments…
              </div>
            ) : highRiskPayments.length === 0 ? (
              <div className="p-4 bg-secondary-container/10 rounded-2xl text-center">
                <CheckCircle2 size={24} className="text-secondary mx-auto mb-2" />
                <p className="text-xs font-bold text-secondary">No high risk payments detected</p>
                <p className="text-[11px] text-on-surface-variant mt-1">All transactions look clean</p>
              </div>
            ) : (
              <div className="space-y-4">
                {highRiskPayments.map(p => (
                  <div key={p.id} className="p-4 bg-tertiary-container/5 border-l-4 border-tertiary rounded-r-xl">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-xs font-bold text-tertiary">Failed Payment</p>
                      <AlertCircle size={14} className="text-tertiary" />
                    </div>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      {p.eventTitle || 'Booking'} — {formatAmount(p.amount, p.currency)} payment failed.
                      Order: {p.razorpayOrderId?.slice(-10) || '—'}
                    </p>
                    <p className="text-[10px] text-on-surface-variant mt-1">
                      {p.createdAt ? timeAgo(p.createdAt) : '—'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Financial Summary */}
          <div className="bg-indigo-50/40 rounded-3xl p-6 border border-indigo-100/30">
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">
              Payment Summary
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Verified Payments</span>
                <span className="font-bold">
                  {isLoading ? '—' : formatAmount(totalVerified)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Pending</span>
                <span className="font-bold text-amber-600">
                  {isLoading ? '—' : `${pendingCount} transactions`}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant">Failed / Flagged</span>
                <span className="font-bold text-tertiary">
                  {isLoading ? '—' : `${flaggedCount} transactions`}
                </span>
              </div>
              <div className="pt-4 border-t border-indigo-100/50 flex justify-between items-center">
                <span className="text-xs font-bold uppercase">Est. Platform Fees (10%)</span>
                <span className="text-lg font-black text-primary">
                  {isLoading ? '—' : formatAmount(platformFee)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Breakdown */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-indigo-50/50">
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">
              Payment Methods
            </h4>
            {isLoading ? (
              <Loader2 size={16} className="animate-spin text-primary" />
            ) : (
              <div className="space-y-3">
                {/* Razorpay verified */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-on-surface-variant">Razorpay Verified</span>
                    <span className="font-bold text-secondary">
                      {payments.filter(p => p.razorpayPaymentId && p.status === 'verified').length}
                    </span>
                  </div>
                  <div className="w-full bg-indigo-50 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full"
                      style={{
                        width: payments.length > 0
                          ? `${(payments.filter(p => p.razorpayPaymentId && p.status === 'verified').length / payments.length) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                </div>
                {/* Pending */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-on-surface-variant">Pending</span>
                    <span className="font-bold text-amber-600">{pendingCount}</span>
                  </div>
                  <div className="w-full bg-indigo-50 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{
                        width: payments.length > 0
                          ? `${(pendingCount / payments.length) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                </div>
                {/* Failed */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-on-surface-variant">Failed</span>
                    <span className="font-bold text-tertiary">{flaggedCount}</span>
                  </div>
                  <div className="w-full bg-indigo-50 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-tertiary rounded-full"
                      style={{
                        width: payments.length > 0
                          ? `${(flaggedCount / payments.length) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financials;