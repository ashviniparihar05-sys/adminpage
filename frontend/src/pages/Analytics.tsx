// import React from 'react';
// import { 
//   TrendingUp, 
//   TrendingDown, 
//   Calendar, 
//   BarChart3, 
//   Activity, 
//   Shield, 
//   AlertCircle, 
//   UserPlus, 
//   CalendarDays, 
//   Ban, 
//   CheckCircle2, 
//   Sparkles,
//   Search,
//   Filter,
//   Gavel
// } from 'lucide-react';

// const Analytics = () => {
//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-end">
//         <div>
//           <h3 className="text-3xl font-extrabold tracking-tight text-on-surface">Platform Analytics</h3>
//           <p className="text-on-surface-variant text-sm mt-1">Real-time health metrics and curator insights.</p>
//         </div>
//         <div className="flex gap-3">
//           <button className="bg-surface-container-highest px-4 py-2 rounded-xl text-sm font-semibold text-primary flex items-center gap-2 hover:bg-surface-variant transition-colors">
//             <Calendar size={16} />
//             Last 30 Days
//           </button>
//           <button className="bg-gradient-to-r from-primary to-primary-container text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
//             Export Report
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//         {[
//           { label: 'Total Bookings', value: '24,892', change: '+12%', icon: BarChart3, color: 'text-primary', bg: 'bg-indigo-50', trend: 'up' },
//           { label: 'Revenue', value: '$1.2M', change: '+8%', icon: Activity, color: 'text-primary', bg: 'bg-indigo-50', trend: 'up' },
//           { label: 'Active Hosts', value: '3,410', change: '+4%', icon: UserPlus, color: 'text-primary', bg: 'bg-indigo-50', trend: 'up' },
//           { label: 'Flagged Events', value: '182', change: '-15%', icon: AlertCircle, color: 'text-tertiary', bg: 'bg-tertiary-fixed', trend: 'down' },
//           { label: 'Abuse Trends', value: 'Elevated', change: 'Alert', icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'alert' },
//         ].map((kpi, i) => (
//           <div key={i} className="bg-surface-container-lowest p-6 rounded-xl space-y-4 shadow-sm border border-indigo-50/50 hover:border-indigo-100 transition-all">
//             <div className="flex justify-between items-start">
//               <div className={`p-2 ${kpi.bg} rounded-lg ${kpi.color}`}>
//                 <kpi.icon size={20} />
//               </div>
//               <span className={`text-xs font-bold flex items-center gap-1 ${kpi.trend === 'up' ? 'text-secondary' : kpi.trend === 'down' ? 'text-tertiary' : 'text-amber-600'}`}>
//                 {kpi.change} 
//                 {kpi.trend === 'up' && <TrendingUp size={12} />}
//                 {kpi.trend === 'down' && <TrendingDown size={12} />}
//                 {kpi.trend === 'alert' && <AlertCircle size={12} className="fill-amber-600 text-white" />}
//               </span>
//             </div>
//             <div>
//               <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{kpi.label}</p>
//               <h4 className="text-2xl font-bold mt-1">{kpi.value}</h4>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-12 gap-8">
//         <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-indigo-50/50">
//           <div className="flex justify-between items-center mb-8">
//             <div>
//               <h5 className="text-lg font-bold text-on-surface">Revenue Performance</h5>
//               <p className="text-sm text-on-surface-variant">Comparison between revenue and volume</p>
//             </div>
//             <div className="flex gap-4">
//               <div className="flex items-center gap-2">
//                 <span className="w-3 h-3 rounded-full bg-primary"></span>
//                 <span className="text-xs font-medium text-on-surface-variant">Revenue</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="w-3 h-3 rounded-full bg-secondary"></span>
//                 <span className="text-xs font-medium text-on-surface-variant">Bookings</span>
//               </div>
//             </div>
//           </div>
//           <div className="h-64 flex items-end justify-between gap-1 group">
//             {[40, 55, 45, 75, 60, 85, 50, 40, 65, 95, 70, 60].map((h, i) => (
//               <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
//                 <div 
//                   className={`w-full rounded-t-lg transition-all duration-300 cursor-pointer relative ${i === 3 ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-surface-container hover:bg-primary/20'}`} 
//                   style={{ height: `${h}%` }}
//                 >
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="flex justify-between mt-4 text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">
//             {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <span key={m}>{m}</span>)}
//           </div>
//         </div>

//         <div className="col-span-12 lg:col-span-4 bg-surface-container-low rounded-xl p-8 relative overflow-hidden shadow-sm border border-indigo-50/50">
//           <h5 className="text-lg font-bold text-on-surface mb-2">Location Moderation</h5>
//           <p className="text-sm text-on-surface-variant mb-6">Density of reported incidents by region.</p>
//           <div className="relative h-64 bg-surface-container-highest rounded-lg overflow-hidden group border border-indigo-100/30">
//             <img 
//               src="https://picsum.photos/seed/map/800/600" 
//               alt="World Map" 
//               className="w-full h-full object-cover opacity-20 grayscale"
//               referrerPolicy="no-referrer"
//             />
//             <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-error/20 rounded-full animate-pulse flex items-center justify-center">
//               <div className="w-4 h-4 bg-error rounded-full shadow-lg shadow-error/50"></div>
//             </div>
//             <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-amber-500/20 rounded-full animate-pulse flex items-center justify-center">
//               <div className="w-3 h-3 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50"></div>
//             </div>
//           </div>
//           <div className="mt-6 space-y-3">
//             <div className="flex justify-between items-center text-sm">
//               <span className="text-on-surface-variant">North America</span>
//               <span className="font-bold text-on-surface">42 High Risk</span>
//             </div>
//             <div className="w-full bg-surface-container-highest h-1 rounded-full">
//               <div className="bg-error w-3/4 h-full rounded-full"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Analytics;
// frontend/src/pages/Analytics.tsx
// ✅ Real data from MongoDB via server.js endpoints
// ✅ Owner-level dashboard: events, services, payments, users, bot, reviews
// ✅ Event detail with AI risk breakdown, host info, rejection reasons
// ✅ Fetches: /events, /services, /payments, /users, /bot/status, /collections

import React, { useEffect, useState, useCallback } from 'react';
import {
  TrendingUp, TrendingDown, Calendar, Activity, Shield, AlertCircle,
  UserPlus, CheckCircle2, Sparkles, RefreshCw, Loader2, ChevronDown,
  ChevronUp, Bot, CreditCard, Star, Users, Package, Eye,
  Clock, MapPin, Zap, BarChart3, XCircle, Info,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type EventItem = {
  id: string; title: string; host: string; category: string;
  status: string; dateSubmitted: string; eventDate: string;
  location: string; ticketPrice: string; capacity: number;
  description: string; attendeesCount: number; kind: string;
  creatorClerkId?: string;
  aiAnalysis?: {
    riskScore: number; riskLevel: string; summary: string;
    recommendation: string; flags: { type: string; description: string; severity: string }[];
    semanticIntegrity: number; hostLegitimacy: number; engagementPattern: number;
    scannedAt: string;
  } | null;
};

type Payment = {
  id: string; amount: number; currency: string; status: string;
  type: string; createdAt: string; eventTitle?: string;
  razorpayPaymentId?: string;
};

type User = {
  id: string; name: string; type: string; status: string;
  eventsHosted: number; eventsAttended: number; rating: number;
  reputation: number; joined: string; lastActive: string;
};

type BotStatus = {
  enabled: boolean; isRunning: boolean;
  config: { approveThreshold: number; rejectThreshold: number; intervalMinutes: number };
  stats: { totalRuns: number; totalApproved: number; totalRejected: number; totalNeedsReview: number; totalErrors: number; lastRunAt: string | null };
  recentLogs: { runNumber: number; ranAt: string; analyzed: number; approved: number; rejected: number; needsReview: number }[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const API = 'http://localhost:5006';

function fmt(paise: number, cur = 'INR') {
  const n = paise / 100;
  return cur === 'INR' ? `₹${n.toLocaleString('en-IN')}` : `$${n.toLocaleString('en-US')}`;
}

function timeAgo(iso: string) {
  if (!iso) return '—';
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d / 60000), h = Math.floor(d / 3600000), days = Math.floor(d / 86400000);
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${days}d ago`;
}

function riskColor(score: number) {
  if (score >= 70) return 'text-red-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-emerald-600';
}

function riskBg(score: number) {
  if (score >= 70) return 'bg-red-50 border-red-200';
  if (score >= 40) return 'bg-amber-50 border-amber-200';
  return 'bg-emerald-50 border-emerald-200';
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    approved: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-red-100 text-red-800',
    pending: 'bg-slate-100 text-slate-600',
    flagged: 'bg-amber-100 text-amber-800',
    verified: 'bg-emerald-100 text-emerald-800',
    failed: 'bg-red-100 text-red-800',
  };
  return map[status?.toLowerCase()] || 'bg-slate-100 text-slate-600';
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon: Icon, color, trend }: any) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div className={`p-2.5 rounded-xl ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      {trend != null && (
        <span className={`text-xs font-bold flex items-center gap-0.5 ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
    <p className="text-xs font-semibold text-slate-500 mt-0.5">{label}</p>
    {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
  </div>
);

// ─── Risk Bar ─────────────────────────────────────────────────────────────────
const RiskBar = ({ label, value }: { label: string; value: number }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className={`font-bold ${riskColor(100 - value)}`}>{value}/100</span>
    </div>
    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${value >= 70 ? 'bg-emerald-500' : value >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

// ─── Event Detail Card (expandable) ──────────────────────────────────────────
const EventDetailCard = ({ ev }: { ev: EventItem }) => {
  const [open, setOpen] = useState(false);
  const ai = ev.aiAnalysis;

  return (
    <div className={`border rounded-2xl overflow-hidden transition-all ${ai ? riskBg(ai.riskScore) : 'bg-white border-slate-200'}`}>
      {/* Header row */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left px-5 py-4 flex items-center gap-3 hover:bg-black/5 transition-colors"
      >
        {/* Risk score circle */}
        {ai ? (
          <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 font-black text-sm ${ai.riskScore >= 70 ? 'bg-red-500 text-white' : ai.riskScore >= 40 ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
            {ai.riskScore}
            <span className="text-[8px] font-bold opacity-80">RISK</span>
          </div>
        ) : (
          <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
            <Sparkles size={16} className="text-slate-400" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 text-sm truncate">{ev.title}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Host: <span className="font-semibold">{ev.host}</span>
            {' · '}{ev.category}
            {' · '}{ev.kind === 'service' ? '🛠 Service' : '📅 Event'}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
            <MapPin size={9} />{ev.location || '—'}
            {' · '}
            <Clock size={9} />{timeAgo(ev.dateSubmitted)}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${statusBadge(ev.status)}`}>
            {ev.status}
          </span>
          {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="px-5 pb-5 border-t border-black/10 pt-4 space-y-4">

          {/* AI Analysis — the main content owner cares about */}
          {ai ? (
            <div className="space-y-4">
              {/* Risk explanation — in formal English with reasons */}
              <div className="bg-white/80 rounded-xl p-4 border border-black/10">
                <div className="flex items-center gap-2 mb-2">
                  <Bot size={14} className="text-indigo-500" />
                  <p className="text-xs font-black text-slate-700 uppercase tracking-wider">AI Risk Analysis</p>
                  <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${ai.riskScore >= 70 ? 'bg-red-100 text-red-700' : ai.riskScore >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {ai.riskLevel?.toUpperCase()} RISK — {ai.riskScore}/100
                  </span>
                </div>

                {/* Formal risk explanation */}
                <p className="text-sm text-slate-700 leading-relaxed mb-3">{ai.summary}</p>

                {/* Why this score — detailed breakdown */}
                <div className="bg-slate-50 rounded-lg p-3 mb-3 border border-slate-200">
                  <p className="text-[11px] font-black text-slate-500 uppercase mb-2">Why Risk Score is {ai.riskScore}%</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {ai.riskScore >= 70
                      ? `This ${ev.kind === 'service' ? 'service' : 'event'} received a high risk score of ${ai.riskScore}/100 because our AI detected significant concerns that pose a risk to users. The factors contributing to this elevated score are detailed below. Events scoring above 70% are typically auto-rejected by the system.`
                      : ai.riskScore >= 40
                      ? `This ${ev.kind === 'service' ? 'service' : 'event'} received a medium risk score of ${ai.riskScore}/100. While not critically dangerous, several factors reduced the trust score. Manual review is recommended before approval. Events in the 40-70% range are flagged for human moderator review.`
                      : `This ${ev.kind === 'service' ? 'service' : 'event'} received a low risk score of ${ai.riskScore}/100, indicating it is likely legitimate. The host's description, pricing, and location details met our quality standards. Events scoring below 30% are typically auto-approved by the system.`}
                  </p>
                </div>

                {/* Metric bars */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <RiskBar label="Semantic Integrity" value={ai.semanticIntegrity} />
                  <RiskBar label="Host Legitimacy" value={ai.hostLegitimacy} />
                  <RiskBar label="Engagement Pattern" value={ai.engagementPattern} />
                </div>

                {/* Flags */}
                {ai.flags?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-black text-slate-500 uppercase">Specific Issues Detected</p>
                    {ai.flags.map((flag, i) => (
                      <div key={i} className={`p-2.5 rounded-lg border-l-2 flex items-start gap-2 ${flag.severity === 'high' ? 'bg-red-50 border-red-400' : flag.severity === 'medium' ? 'bg-amber-50 border-amber-400' : 'bg-slate-50 border-slate-300'}`}>
                        <AlertCircle size={12} className={`flex-shrink-0 mt-0.5 ${flag.severity === 'high' ? 'text-red-500' : flag.severity === 'medium' ? 'text-amber-500' : 'text-slate-400'}`} />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{flag.type}</p>
                          <p className="text-[11px] text-slate-600">{flag.description}</p>
                        </div>
                        <span className={`ml-auto text-[9px] font-black px-1.5 py-0.5 rounded uppercase flex-shrink-0 ${flag.severity === 'high' ? 'bg-red-100 text-red-700' : flag.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                          {flag.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Moderator recommendation */}
                <div className="mt-3 bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                  <p className="text-[11px] font-black text-indigo-500 uppercase mb-1">Moderator Recommendation</p>
                  <p className="text-xs text-indigo-800 italic">"{ai.recommendation}"</p>
                </div>

                <p className="text-[10px] text-slate-400 mt-2 text-right">Scanned {timeAgo(ai.scannedAt)}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 rounded-xl p-4 text-center text-sm text-slate-500">
              No AI analysis available for this item yet.
            </div>
          )}

          {/* Event meta details */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'Price', val: ev.ticketPrice },
              { label: 'Capacity', val: String(ev.capacity) },
              { label: 'Attendees', val: String(ev.attendeesCount) },
              { label: 'Event Date', val: ev.eventDate || '—' },
              { label: 'Submitted', val: new Date(ev.dateSubmitted).toLocaleDateString('en-IN') },
              { label: 'Creator ID', val: ev.creatorClerkId?.slice(-12) || '—' },
            ].map(r => (
              <div key={r.label} className="bg-white/60 rounded-lg p-2.5 border border-black/5">
                <p className="text-[10px] text-slate-400 uppercase font-bold">{r.label}</p>
                <p className="text-xs font-semibold text-slate-800 mt-0.5 truncate">{r.val}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {ev.description && ev.description !== 'No description provided.' && (
            <div className="bg-white/60 rounded-lg p-3 border border-black/5">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Description</p>
              <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">{ev.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Analytics Page ──────────────────────────────────────────────────────
const Analytics = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [services, setServices] = useState<EventItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Filter state
  const [eventsFilter, setEventsFilter] = useState<'all' | 'approved' | 'rejected' | 'pending' | 'flagged'>('all');
  const [activeSection, setActiveSection] = useState<'overview' | 'events' | 'payments' | 'users' | 'bot'>('overview');

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [evRes, svRes, pmRes, usRes, botRes] = await Promise.all([
        fetch(`${API}/events`),
        fetch(`${API}/services`),
        fetch(`${API}/payments`),
        fetch(`${API}/users`),
        fetch(`${API}/bot/status`),
      ]);

      const [evData, svData, pmData, usData, botData] = await Promise.all([
        evRes.ok ? evRes.json() : [],
        svRes.ok ? svRes.json() : [],
        pmRes.ok ? pmRes.json() : [],
        usRes.ok ? usRes.json() : [],
        botRes.ok ? botRes.json() : null,
      ]);

      setEvents(Array.isArray(evData) ? evData : []);
      setServices(Array.isArray(svData) ? svData : []);
      setPayments(Array.isArray(pmData) ? pmData : []);
      setUsers(Array.isArray(usData) ? usData : []);
      setBotStatus(botData);
      setLastRefresh(new Date());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ── Computed stats ──────────────────────────────────────────────────────────
  const allItems = [...events, ...services];
  const approved  = allItems.filter(e => e.status === 'approved').length;
  const rejected  = allItems.filter(e => e.status === 'rejected').length;
  const pending   = allItems.filter(e => e.status === 'pending').length;
  const flagged   = allItems.filter(e => e.status === 'flagged').length;

  const totalRevenue = payments.filter(p => p.status === 'verified').reduce((s, p) => s + p.amount, 0);
  const verifiedPay  = payments.filter(p => p.status === 'verified').length;
  const failedPay    = payments.filter(p => p.status === 'failed').length;
  const platformFee  = Math.round(totalRevenue * 0.10);

  const activeUsers  = users.filter(u => u.status === 'Active').length;
  const bannedUsers  = users.filter(u => u.status === 'Banned').length;
  const hosts        = users.filter(u => u.type === 'Host' || u.type === 'Both').length;

  // High risk items
  const highRisk = allItems.filter(e => e.aiAnalysis && e.aiAnalysis.riskScore >= 70);
  const medRisk  = allItems.filter(e => e.aiAnalysis && e.aiAnalysis.riskScore >= 40 && e.aiAnalysis.riskScore < 70);

  // Filtered events/services for list
  const filteredItems = allItems.filter(e => eventsFilter === 'all' || e.status === eventsFilter);

  // Monthly breakdown from payments
  const monthlyRevenue: Record<string, number> = {};
  payments.forEach(p => {
    if (p.status !== 'verified') return;
    const m = new Date(p.createdAt).toLocaleString('en', { month: 'short' });
    monthlyRevenue[m] = (monthlyRevenue[m] || 0) + p.amount;
  });
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const maxRev = Math.max(...months.map(m => monthlyRevenue[m] || 0), 1);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
        <p className="text-sm text-slate-500 font-semibold">Loading analytics from MongoDB…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <AlertCircle size={32} className="text-red-400" />
        <p className="text-sm text-red-600 font-bold">{error}</p>
        <p className="text-xs text-slate-500">Make sure <code className="bg-slate-100 px-1.5 py-0.5 rounded">node server.js</code> is running on port 5006</p>
        <button onClick={loadAll} className="text-sm text-indigo-600 font-bold hover:underline flex items-center gap-1">
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">
            MongoDB Live · assis_auth
          </span>
          <h3 className="text-3xl font-extrabold tracking-tight text-slate-900">Platform Analytics</h3>
          <p className="text-slate-500 text-sm mt-1">
            Owner dashboard — all metrics from live database.
            <span className="ml-2 text-[10px] text-slate-400">Last updated: {lastRefresh.toLocaleTimeString()}</span>
          </p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          {/* Section tabs */}
          {(['overview','events','payments','users','bot'] as const).map(s => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${activeSection === s ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'}`}
            >
              {s === 'bot' ? '🤖 AI Bot' : s}
            </button>
          ))}
          <button
            onClick={loadAll}
            disabled={loading}
            className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:border-indigo-300 disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* OVERVIEW SECTION                                                  */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeSection === 'overview' && (
        <div className="space-y-6">

          {/* KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <StatCard label="Total Events" value={events.length} sub={`+${services.length} services`} icon={Calendar} color="bg-indigo-500" trend={null} />
            <StatCard label="Approved" value={approved} sub="Live on MyApp" icon={CheckCircle2} color="bg-emerald-500" trend={null} />
            <StatCard label="Rejected" value={rejected} sub="Removed" icon={XCircle} color="bg-red-400" trend={null} />
            <StatCard label="Pending Review" value={pending} sub="Awaiting decision" icon={Clock} color="bg-amber-500" trend={null} />
            <StatCard label="High Risk" value={highRisk.length} sub="Score ≥ 70" icon={Shield} color="bg-red-500" trend={null} />
            <StatCard label="Total Revenue" value={fmt(totalRevenue)} sub={`Platform fee: ${fmt(platformFee)}`} icon={CreditCard} color="bg-violet-500" trend={null} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Users" value={users.length} sub={`${activeUsers} active`} icon={Users} color="bg-blue-500" trend={null} />
            <StatCard label="Hosts" value={hosts} sub="Event creators" icon={UserPlus} color="bg-teal-500" trend={null} />
            <StatCard label="Banned Users" value={bannedUsers} sub="Moderated accounts" icon={AlertCircle} color="bg-orange-500" trend={null} />
            <StatCard label="Verified Payments" value={verifiedPay} sub={`${failedPay} failed`} icon={Activity} color="bg-pink-500" trend={null} />
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h5 className="text-base font-black text-slate-800">Monthly Revenue</h5>
                <p className="text-xs text-slate-500">Based on verified Razorpay payments</p>
              </div>
              <span className="text-sm font-black text-indigo-600">{fmt(totalRevenue)} total</span>
            </div>
            <div className="h-40 flex items-end gap-1.5">
              {months.map(m => {
                const val = monthlyRevenue[m] || 0;
                const h = maxRev > 0 ? Math.max(4, Math.round((val / maxRev) * 100)) : 4;
                return (
                  <div key={m} className="flex-1 flex flex-col items-center gap-1 group">
                    <div
                      className={`w-full rounded-t-lg transition-all cursor-pointer group-hover:opacity-80 ${val > 0 ? 'bg-indigo-500' : 'bg-slate-100'}`}
                      style={{ height: `${h}%` }}
                      title={`${m}: ${fmt(val)}`}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2">
              {months.map(m => (
                <span key={m} className="flex-1 text-center text-[9px] text-slate-400 font-bold">{m}</span>
              ))}
            </div>
          </div>

          {/* Status breakdown donut-style bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h5 className="text-sm font-black text-slate-800 mb-4">Moderation Breakdown</h5>
              {[
                { label: 'Approved', val: approved, total: allItems.length, color: 'bg-emerald-500' },
                { label: 'Rejected', val: rejected, total: allItems.length, color: 'bg-red-400' },
                { label: 'Pending', val: pending, total: allItems.length, color: 'bg-amber-400' },
                { label: 'Flagged', val: flagged, total: allItems.length, color: 'bg-orange-400' },
              ].map(r => (
                <div key={r.label} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-semibold">{r.label}</span>
                    <span className="font-black text-slate-800">{r.val} <span className="text-slate-400 font-normal">/ {r.total}</span></span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${r.color} rounded-full`} style={{ width: r.total > 0 ? `${(r.val / r.total) * 100}%` : '0%' }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h5 className="text-sm font-black text-slate-800 mb-4">AI Risk Distribution</h5>
              {[
                { label: 'Low Risk (0–39)', val: allItems.filter(e => e.aiAnalysis && e.aiAnalysis.riskScore < 40).length, color: 'bg-emerald-500' },
                { label: 'Medium Risk (40–69)', val: medRisk.length, color: 'bg-amber-400' },
                { label: 'High Risk (70+)', val: highRisk.length, color: 'bg-red-500' },
                { label: 'Not Analyzed', val: allItems.filter(e => !e.aiAnalysis).length, color: 'bg-slate-300' },
              ].map(r => (
                <div key={r.label} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-semibold">{r.label}</span>
                    <span className="font-black text-slate-800">{r.val}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${r.color} rounded-full`} style={{ width: allItems.length > 0 ? `${(r.val / allItems.length) * 100}%` : '0%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High risk quick preview */}
          {highRisk.length > 0 && (
            <div className="bg-red-50 rounded-2xl p-5 border border-red-200">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={16} className="text-red-500" />
                <h5 className="text-sm font-black text-red-800">High Risk Items ({highRisk.length})</h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {highRisk.slice(0, 4).map(e => (
                  <div key={e.id} className="bg-white rounded-xl p-3 border border-red-100 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 font-black text-red-700 text-sm">
                      {e.aiAnalysis?.riskScore}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{e.title}</p>
                      <p className="text-[10px] text-slate-500">by {e.host} · {e.status}</p>
                    </div>
                  </div>
                ))}
              </div>
              {highRisk.length > 4 && (
                <button onClick={() => { setActiveSection('events'); setEventsFilter('flagged'); }} className="text-xs text-red-600 font-bold mt-2 hover:underline">
                  View all {highRisk.length} high risk items →
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* EVENTS SECTION — full detail with AI breakdown                   */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeSection === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h4 className="text-lg font-black text-slate-800">
              Events & Services
              <span className="ml-2 text-sm font-normal text-slate-400">({filteredItems.length} items)</span>
            </h4>
            <div className="flex gap-2 flex-wrap">
              {(['all','approved','rejected','pending','flagged'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setEventsFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${eventsFilter === f ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300'}`}
                >
                  {f} {f !== 'all' && `(${allItems.filter(e => e.status === f).length})`}
                </button>
              ))}
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Package size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold">No items match this filter.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map(ev => (
                <EventDetailCard key={ev.id} ev={ev} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* PAYMENTS SECTION                                                  */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeSection === 'payments' && (
        <div className="space-y-4">
          <h4 className="text-lg font-black text-slate-800">
            Payments
            <span className="ml-2 text-sm font-normal text-slate-400">({payments.length} transactions)</span>
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Revenue" value={fmt(totalRevenue)} sub="Verified only" icon={CreditCard} color="bg-emerald-500" trend={null} />
            <StatCard label="Platform Fee (10%)" value={fmt(platformFee)} sub="Estimated" icon={BarChart3} color="bg-indigo-500" trend={null} />
            <StatCard label="Verified" value={verifiedPay} sub="Successful" icon={CheckCircle2} color="bg-teal-500" trend={null} />
            <StatCard label="Failed" value={failedPay} sub="Needs review" icon={AlertCircle} color="bg-red-400" trend={null} />
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
              <p className="text-xs font-black text-slate-600 uppercase tracking-wider">Recent Transactions</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Payment ID', 'Event', 'Amount', 'Type', 'Status', 'Date'].map(h => (
                      <th key={h} className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {payments.slice(0, 50).map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-slate-600">
                        {p.razorpayPaymentId ? `pay_${p.razorpayPaymentId.slice(-8)}` : p.id.slice(-12)}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700 font-semibold max-w-[180px] truncate">
                        {p.eventTitle || '—'}
                      </td>
                      <td className="px-4 py-3 text-xs font-black text-slate-800">{fmt(p.amount, p.currency)}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 capitalize">{p.type}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${statusBadge(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">{timeAgo(p.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {payments.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-sm">No payments found.</div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* USERS SECTION                                                     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeSection === 'users' && (
        <div className="space-y-4">
          <h4 className="text-lg font-black text-slate-800">
            Users
            <span className="ml-2 text-sm font-normal text-slate-400">({users.length} total)</span>
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Users" value={users.length} sub="All time" icon={Users} color="bg-blue-500" trend={null} />
            <StatCard label="Active" value={activeUsers} sub="Not banned/deleted" icon={CheckCircle2} color="bg-emerald-500" trend={null} />
            <StatCard label="Hosts" value={hosts} sub="Create events" icon={UserPlus} color="bg-violet-500" trend={null} />
            <StatCard label="Banned" value={bannedUsers} sub="Moderated" icon={AlertCircle} color="bg-red-400" trend={null} />
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['User', 'Type', 'Activity', 'Reputation', 'Rating', 'Status', 'Joined'].map(h => (
                    <th key={h} className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.slice(0, 50).map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-xs font-bold text-slate-800">{u.name}</p>
                      <p className="text-[10px] text-slate-400">{u.lastActive}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.type === 'Host' ? 'bg-violet-100 text-violet-700' : u.type === 'Both' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                        {u.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{u.activity}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${u.reputation}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600">{u.reputation}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {u.rating > 0 ? (
                        <span className="flex items-center gap-0.5">
                          <Star size={10} className="text-amber-400 fill-amber-400" />
                          {u.rating.toFixed(1)}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${statusBadge(u.status)}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{u.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-sm">No users found.</div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* BOT SECTION                                                       */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeSection === 'bot' && botStatus && (
        <div className="space-y-4">
          <h4 className="text-lg font-black text-slate-800">AI Moderation Bot</h4>

          {/* Bot status banner */}
          <div className={`rounded-2xl p-5 border flex items-center gap-4 ${botStatus.enabled ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${botStatus.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}>
              <Bot size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-black text-slate-800 text-base">
                Bot is {botStatus.enabled ? (botStatus.isRunning ? '🔄 Running...' : '✅ Active') : '⏸ Disabled'}
              </p>
              <p className="text-sm text-slate-600 mt-0.5">
                Auto-approve ≤ {botStatus.config.approveThreshold}% risk
                &nbsp;·&nbsp;
                Auto-reject ≥ {botStatus.config.rejectThreshold}% risk
                &nbsp;·&nbsp;
                Every {botStatus.config.intervalMinutes} minutes
              </p>
              {botStatus.stats.lastRunAt && (
                <p className="text-xs text-slate-400 mt-0.5">Last run: {timeAgo(botStatus.stats.lastRunAt)}</p>
              )}
            </div>
          </div>

          {/* All-time stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <StatCard label="Total Runs" value={botStatus.stats.totalRuns} icon={Zap} color="bg-indigo-500" trend={null} />
            <StatCard label="Total Analyzed" value={botStatus.stats.totalAnalyzed} icon={Eye} color="bg-blue-500" trend={null} />
            <StatCard label="Auto-Approved" value={botStatus.stats.totalApproved} icon={CheckCircle2} color="bg-emerald-500" trend={null} />
            <StatCard label="Auto-Rejected" value={botStatus.stats.totalRejected} icon={XCircle} color="bg-red-400" trend={null} />
            <StatCard label="Needs Review" value={botStatus.stats.totalNeedsReview} icon={AlertCircle} color="bg-amber-500" trend={null} />
          </div>

          {/* Risk band visual */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-xs font-black text-slate-500 uppercase mb-3">Risk Band Configuration</p>
            <div className="h-8 rounded-xl overflow-hidden flex text-[11px] font-black text-white">
              <div className="bg-emerald-500 flex items-center justify-center" style={{ width: `${botStatus.config.approveThreshold}%` }}>
                {botStatus.config.approveThreshold > 10 ? 'AUTO-APPROVE' : ''}
              </div>
              <div className="bg-amber-500 flex items-center justify-center" style={{ width: `${botStatus.config.rejectThreshold - botStatus.config.approveThreshold}%` }}>
                {botStatus.config.rejectThreshold - botStatus.config.approveThreshold > 15 ? 'HUMAN REVIEW' : ''}
              </div>
              <div className="bg-red-500 flex-1 flex items-center justify-center">
                AUTO-REJECT
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0%</span>
              <span>{botStatus.config.approveThreshold}%</span>
              <span>{botStatus.config.rejectThreshold}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Recent run logs */}
          {botStatus.recentLogs.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-5 py-3 bg-slate-50 border-b">
                <p className="text-xs font-black text-slate-600 uppercase tracking-wider">Recent Bot Runs</p>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50">
                    {['Run #', 'Time', 'Analyzed', 'Approved', 'Rejected', 'Review'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-[10px] font-black text-slate-400 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {botStatus.recentLogs.map(log => (
                    <tr key={log.runNumber} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 text-xs font-black text-slate-600">#{log.runNumber}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-500">{timeAgo(log.ranAt)}</td>
                      <td className="px-4 py-2.5 text-xs font-bold text-slate-700">{log.analyzed}</td>
                      <td className="px-4 py-2.5 text-xs font-bold text-emerald-600">{log.approved}</td>
                      <td className="px-4 py-2.5 text-xs font-bold text-red-500">{log.rejected}</td>
                      <td className="px-4 py-2.5 text-xs font-bold text-amber-600">{log.needsReview}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeSection === 'bot' && !botStatus && (
        <div className="text-center py-12 text-slate-400">
          <Bot size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">Bot status unavailable. Make sure backend is running.</p>
        </div>
      )}

    </div>
  );
};

export default Analytics;
