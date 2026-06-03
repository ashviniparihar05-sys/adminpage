// // // // // // // // frontend/src/pages/ModerationQueue.tsx
// // // // // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // // // // import {
// // // // // // //   Filter,
// // // // // // //   CheckCircle2,
// // // // // // //   Eye,
// // // // // // //   X,
// // // // // // //   ChevronLeft,
// // // // // // //   ChevronRight,
// // // // // // //   Sparkles,
// // // // // // //   AlertCircle,
// // // // // // //   Loader2,
// // // // // // //   RefreshCw,
// // // // // // //   Zap,
// // // // // // //   Plus,
// // // // // // // } from 'lucide-react';
// // // // // // // import { Link } from 'react-router-dom';
// // // // // // // import {
// // // // // // //   analyzeEventWithGemini,
// // // // // // //   getRiskColor,
// // // // // // //   getRiskBarColor,
// // // // // // //   getRiskLabel,
// // // // // // // } from '../lib/gemini';
// // // // // // // import { getEvents, updateEventStatus } from '../lib/mockEvents';
// // // // // // // import type { Event, AIAnalysis } from '../types';

// // // // // // // // ─── Skeletons & badges ────────────────────────────────────────────────────────
// // // // // // // const AILoadingSkeleton = () => (
// // // // // // //   <div className="animate-pulse space-y-3">
// // // // // // //     <div className="h-3 bg-indigo-100 rounded w-3/4" />
// // // // // // //     <div className="h-3 bg-indigo-100 rounded w-1/2" />
// // // // // // //     <div className="h-8 bg-indigo-100 rounded w-full" />
// // // // // // //     <div className="h-8 bg-indigo-100 rounded w-full" />
// // // // // // //   </div>
// // // // // // // );

// // // // // // // const RiskBadge = ({ analysis }: { analysis?: AIAnalysis }) => {
// // // // // // //   if (!analysis) return <span className="text-[10px] text-on-surface-variant">Not analyzed</span>;
// // // // // // //   if (analysis.isLoading) return <Loader2 size={14} className="animate-spin text-primary" />;
// // // // // // //   return (
// // // // // // //     <div className="flex flex-col gap-1">
// // // // // // //       <span className={`text-[11px] font-bold ${getRiskColor(analysis.riskScore)}`}>
// // // // // // //         {analysis.riskScore}%
// // // // // // //       </span>
// // // // // // //       <div className="w-full bg-indigo-100 h-1.5 rounded-full overflow-hidden">
// // // // // // //         <div
// // // // // // //           className={`h-full transition-all duration-700 ${getRiskBarColor(analysis.riskScore)}`}
// // // // // // //           style={{ width: `${analysis.riskScore}%` }}
// // // // // // //         />
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // // ─── Main component ────────────────────────────────────────────────────────────
// // // // // // // const ModerationQueue = () => {
// // // // // // //   // ✅ Load from localStorage (includes events created via CreateEvent)
// // // // // // //   const [events, setEvents] = useState<Event[]>(() => getEvents());
// // // // // // //   const [analyses, setAnalyses] = useState<Record<string, AIAnalysis>>({});
// // // // // // //   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
// // // // // // //   const [isAnalyzingAll, setIsAnalyzingAll] = useState(false);
// // // // // // //   const [analyzingId, setAnalyzingId] = useState<string | null>(null);
// // // // // // //   const [filterStatus, setFilterStatus] = useState('all');
// // // // // // //   const [notification, setNotification] = useState<{
// // // // // // //     msg: string;
// // // // // // //     type: 'success' | 'error';
// // // // // // //   } | null>(null);

// // // // // // //   // Set first event as selected after load
// // // // // // //   useEffect(() => {
// // // // // // //     if (events.length > 0 && !selectedEvent) {
// // // // // // //       setSelectedEvent(events[0]);
// // // // // // //     }
// // // // // // //   }, [events]);

// // // // // // //   const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
// // // // // // //     setNotification({ msg, type });
// // // // // // //     setTimeout(() => setNotification(null), 3000);
// // // // // // //   };

// // // // // // //   // ✅ Refresh events from localStorage (picks up newly created events)
// // // // // // //   const refreshEvents = () => {
// // // // // // //     const fresh = getEvents();
// // // // // // //     setEvents(fresh);
// // // // // // //     showNotification('Queue refreshed!');
// // // // // // //   };

// // // // // // //   // ── Analyze single event ──
// // // // // // //   const analyzeEvent = useCallback(async (event: Event) => {
// // // // // // //     setAnalyzingId(event.id);
// // // // // // //     setAnalyses(prev => ({
// // // // // // //       ...prev,
// // // // // // //       [event.id]: { ...(prev[event.id] || {}), isLoading: true } as AIAnalysis,
// // // // // // //     }));

// // // // // // //     try {
// // // // // // //       const result = await analyzeEventWithGemini(event);
// // // // // // //       setAnalyses(prev => ({ ...prev, [event.id]: result }));

// // // // // // //       // Auto-flag high risk
// // // // // // //       if (result.riskScore >= 70) {
// // // // // // //         setEvents(prev =>
// // // // // // //           prev.map(e => (e.id === event.id ? { ...e, status: 'flagged' } : e)),
// // // // // // //         );
// // // // // // //         updateEventStatus(event.id, 'flagged');
// // // // // // //       }
// // // // // // //     } catch (err) {
// // // // // // //       console.error('Analysis error:', err);
// // // // // // //     } finally {
// // // // // // //       setAnalyzingId(null);
// // // // // // //     }
// // // // // // //   }, []);

// // // // // // //   // Auto-analyze first event on mount
// // // // // // //   useEffect(() => {
// // // // // // //     if (events.length > 0 && !analyses[events[0].id]) {
// // // // // // //       analyzeEvent(events[0]);
// // // // // // //     }
// // // // // // //   }, []); // eslint-disable-line react-hooks/exhaustive-deps

// // // // // // //   // Auto-analyze when selecting
// // // // // // //   const handleSelectEvent = (event: Event) => {
// // // // // // //     setSelectedEvent(event);
// // // // // // //     if (!analyses[event.id]) {
// // // // // // //       analyzeEvent(event);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // Analyze all un-analyzed pending events
// // // // // // //   const analyzeAll = async () => {
// // // // // // //     setIsAnalyzingAll(true);
// // // // // // //     const pending = events.filter(e => !analyses[e.id] || analyses[e.id].isLoading);
// // // // // // //     for (const event of pending) {
// // // // // // //       await analyzeEvent(event);
// // // // // // //     }
// // // // // // //     setIsAnalyzingAll(false);
// // // // // // //     showNotification(`${pending.length} events analyzed by Gemini AI!`);
// // // // // // //   };

// // // // // // //   // Approve / Reject
// // // // // // //   const handleAction = (eventId: string, action: 'approve' | 'reject') => {
// // // // // // //     const newStatus = action === 'approve' ? 'approved' : 'rejected';
// // // // // // //     setEvents(prev => prev.map(e => (e.id === eventId ? { ...e, status: newStatus } : e)));
// // // // // // //     updateEventStatus(eventId, newStatus); // ✅ persist to localStorage
// // // // // // //     showNotification(
// // // // // // //       action === 'approve'
// // // // // // //         ? '✓ Event approved & will be listed on MyApp'
// // // // // // //         : '✗ Event rejected',
// // // // // // //       action === 'approve' ? 'success' : 'error',
// // // // // // //     );
// // // // // // //     const next = events.find(e => e.id !== eventId && e.status === 'pending');
// // // // // // //     if (next) setSelectedEvent(next);
// // // // // // //   };

// // // // // // //   const pendingCount = events.filter(e => e.status === 'pending').length;
// // // // // // //   const flaggedCount = events.filter(e => e.status === 'flagged').length;
// // // // // // //   const selectedAnalysis = selectedEvent ? analyses[selectedEvent.id] : null;

// // // // // // //   const getStatusColor = (status: string) => {
// // // // // // //     const map: Record<string, string> = {
// // // // // // //       flagged: 'text-tertiary bg-tertiary-container/10',
// // // // // // //       pending: 'text-on-surface-variant bg-surface-container-highest',
// // // // // // //       under_review: 'text-amber-700 bg-amber-100',
// // // // // // //       approved: 'text-on-secondary-container bg-secondary-container',
// // // // // // //       rejected: 'text-tertiary bg-tertiary/10',
// // // // // // //     };
// // // // // // //     return map[status] || 'text-on-surface-variant bg-surface-container-highest';
// // // // // // //   };

// // // // // // //   const getStatusLabel = (status: string) => {
// // // // // // //     const map: Record<string, string> = {
// // // // // // //       pending: 'PENDING',
// // // // // // //       flagged: 'FLAGGED',
// // // // // // //       under_review: 'UNDER REVIEW',
// // // // // // //       approved: 'APPROVED',
// // // // // // //       rejected: 'REJECTED',
// // // // // // //     };
// // // // // // //     return map[status] || status.toUpperCase();
// // // // // // //   };

// // // // // // //   const filtered = events.filter(
// // // // // // //     e => filterStatus === 'all' || e.status === filterStatus,
// // // // // // //   );

// // // // // // //   // ─── RENDER ──────────────────────────────────────────────────────────────────
// // // // // // //   return (
// // // // // // //     <div className="space-y-8">
// // // // // // //       {/* Notification toast */}
// // // // // // //       {notification && (
// // // // // // //         <div
// // // // // // //           className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg font-bold text-sm text-white transition-all ${
// // // // // // //             notification.type === 'success' ? 'bg-secondary' : 'bg-tertiary'
// // // // // // //           }`}
// // // // // // //         >
// // // // // // //           {notification.msg}
// // // // // // //         </div>
// // // // // // //       )}

// // // // // // //       {/* ── Header ── */}
// // // // // // //       <div className="flex justify-between items-end flex-wrap gap-4">
// // // // // // //         <div>
// // // // // // //           <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 block">
// // // // // // //             Operational Overview
// // // // // // //           </span>
// // // // // // //           <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">
// // // // // // //             Moderation Queue
// // // // // // //           </h3>
// // // // // // //           <p className="text-on-surface-variant text-sm mt-1">
// // // // // // //             Events submitted from MyApp awaiting AI review &amp; approval.
// // // // // // //           </p>
// // // // // // //         </div>

// // // // // // //         <div className="flex gap-3 items-center flex-wrap">
// // // // // // //           <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
// // // // // // //             <p className="text-[10px] text-on-surface-variant font-bold uppercase">Pending Review</p>
// // // // // // //             <p className="text-xl font-extrabold text-primary">{pendingCount}</p>
// // // // // // //           </div>
// // // // // // //           <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
// // // // // // //             <p className="text-[10px] text-on-surface-variant font-bold uppercase">Risk Flagged</p>
// // // // // // //             <p className="text-xl font-extrabold text-tertiary">{flaggedCount}</p>
// // // // // // //           </div>

// // // // // // //           {/* Analyze All */}
// // // // // // //           <button
// // // // // // //             onClick={analyzeAll}
// // // // // // //             disabled={isAnalyzingAll}
// // // // // // //             className="bg-gradient-to-r from-primary to-primary-container text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-60"
// // // // // // //           >
// // // // // // //             {isAnalyzingAll ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
// // // // // // //             {isAnalyzingAll ? 'Analyzing...' : 'AI Analyze All'}
// // // // // // //           </button>

// // // // // // //           {/* Create Test Event */}
// // // // // // //           <Link
// // // // // // //             to="/events/create"
// // // // // // //             className="bg-white border border-primary text-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/5 transition-all"
// // // // // // //           >
// // // // // // //             <Plus size={16} />
// // // // // // //             Create Test Event
// // // // // // //           </Link>
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* ── Filters ── */}
// // // // // // //       <div className="bg-surface-container-low p-4 rounded-2xl flex flex-wrap items-center gap-4">
// // // // // // //         <div className="flex-1 min-w-[180px]">
// // // // // // //           <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">
// // // // // // //             Risk Score
// // // // // // //           </label>
// // // // // // //           <select className="w-full bg-surface-container-highest border-none rounded-xl text-sm focus:ring-1 ring-primary/20 p-2">
// // // // // // //             <option>All Scores</option>
// // // // // // //             <option>High Risk (&gt;80)</option>
// // // // // // //             <option>Medium Risk (40–80)</option>
// // // // // // //             <option>Low Risk (&lt;40)</option>
// // // // // // //           </select>
// // // // // // //         </div>
// // // // // // //         <div className="flex-1 min-w-[180px]">
// // // // // // //           <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">
// // // // // // //             Status
// // // // // // //           </label>
// // // // // // //           <select
// // // // // // //             className="w-full bg-surface-container-highest border-none rounded-xl text-sm focus:ring-1 ring-primary/20 p-2"
// // // // // // //             value={filterStatus}
// // // // // // //             onChange={e => setFilterStatus(e.target.value)}
// // // // // // //           >
// // // // // // //             <option value="all">All Status</option>
// // // // // // //             <option value="pending">Pending</option>
// // // // // // //             <option value="flagged">Flagged</option>
// // // // // // //             <option value="approved">Approved</option>
// // // // // // //             <option value="rejected">Rejected</option>
// // // // // // //           </select>
// // // // // // //         </div>
// // // // // // //         <div className="flex-1 min-w-[180px]">
// // // // // // //           <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">
// // // // // // //             Event Category
// // // // // // //           </label>
// // // // // // //           <select className="w-full bg-surface-container-highest border-none rounded-xl text-sm focus:ring-1 ring-primary/20 p-2">
// // // // // // //             <option>All Categories</option>
// // // // // // //             <option>Music &amp; Nightlife</option>
// // // // // // //             <option>Technology</option>
// // // // // // //             <option>Health &amp; Wellness</option>
// // // // // // //             <option>Business &amp; Networking</option>
// // // // // // //           </select>
// // // // // // //         </div>
// // // // // // //         <div className="flex items-end h-full pt-5">
// // // // // // //           <button className="bg-surface-container-highest text-primary p-2 px-4 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-surface-variant transition-colors">
// // // // // // //             <Filter size={16} />
// // // // // // //             More Filters
// // // // // // //           </button>
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* ── Main grid ── */}
// // // // // // //       <div className="grid grid-cols-12 gap-6 items-start">
// // // // // // //         {/* Events table */}
// // // // // // //         <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-indigo-50/50">
// // // // // // //           <div className="px-6 py-4 bg-indigo-50/30 flex justify-between items-center border-b border-indigo-50/50">
// // // // // // //             <div className="flex items-center gap-3">
// // // // // // //               <span className="text-sm font-bold text-indigo-900">
// // // // // // //                 {events.length} events in queue
// // // // // // //               </span>
// // // // // // //               <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
// // // // // // //                 LIVE QUEUE
// // // // // // //               </span>
// // // // // // //             </div>
// // // // // // //             {/* ✅ Refresh button — picks up newly created events */}
// // // // // // //             <button
// // // // // // //               onClick={refreshEvents}
// // // // // // //               className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
// // // // // // //             >
// // // // // // //               <RefreshCw size={12} />
// // // // // // //               Refresh
// // // // // // //             </button>
// // // // // // //           </div>

// // // // // // //           <div className="overflow-x-auto">
// // // // // // //             <table className="w-full border-collapse">
// // // // // // //               <thead>
// // // // // // //                 <tr className="text-left border-b border-indigo-50">
// // // // // // //                   <th className="pl-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
// // // // // // //                     Event &amp; Host
// // // // // // //                   </th>
// // // // // // //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
// // // // // // //                     AI Flags
// // // // // // //                   </th>
// // // // // // //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider w-28">
// // // // // // //                     Risk Score
// // // // // // //                   </th>
// // // // // // //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
// // // // // // //                     Status
// // // // // // //                   </th>
// // // // // // //                   <th className="pr-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">
// // // // // // //                     Actions
// // // // // // //                   </th>
// // // // // // //                 </tr>
// // // // // // //               </thead>
// // // // // // //               <tbody className="divide-y divide-indigo-50/30">
// // // // // // //                 {filtered.length === 0 ? (
// // // // // // //                   <tr>
// // // // // // //                     <td colSpan={5} className="py-16 text-center text-on-surface-variant text-sm">
// // // // // // //                       No events found.{' '}
// // // // // // //                       <Link to="/events/create" className="text-primary font-bold hover:underline">
// // // // // // //                         Create a test event →
// // // // // // //                       </Link>
// // // // // // //                     </td>
// // // // // // //                   </tr>
// // // // // // //                 ) : (
// // // // // // //                   filtered.map(event => {
// // // // // // //                     const analysis = analyses[event.id];
// // // // // // //                     const isSelected = selectedEvent?.id === event.id;
// // // // // // //                     return (
// // // // // // //                       <tr
// // // // // // //                         key={event.id}
// // // // // // //                         onClick={() => handleSelectEvent(event)}
// // // // // // //                         className={`transition-colors cursor-pointer ${
// // // // // // //                           isSelected
// // // // // // //                             ? 'bg-primary/5 border-l-2 border-primary'
// // // // // // //                             : 'hover:bg-surface-container-low/50'
// // // // // // //                         }`}
// // // // // // //                       >
// // // // // // //                         {/* Event & Host */}
// // // // // // //                         <td className="pl-6 py-4">
// // // // // // //                           <div className="flex items-center gap-3">
// // // // // // //                             <img
// // // // // // //                               src={event.image}
// // // // // // //                               alt={event.title}
// // // // // // //                               className="w-12 h-12 rounded-xl object-cover shadow-sm flex-shrink-0"
// // // // // // //                               referrerPolicy="no-referrer"
// // // // // // //                               onError={e => {
// // // // // // //                                 (e.target as HTMLImageElement).src =
// // // // // // //                                   'https://placehold.co/48x48/e8eaf6/4355b9?text=E';
// // // // // // //                               }}
// // // // // // //                             />
// // // // // // //                             <div>
// // // // // // //                               <Link
// // // // // // //                                 to={`/moderation/${event.id}`}
// // // // // // //                                 className="text-sm font-bold text-slate-900 leading-tight hover:text-primary transition-colors"
// // // // // // //                                 onClick={e => e.stopPropagation()}
// // // // // // //                               >
// // // // // // //                                 {event.title}
// // // // // // //                               </Link>
// // // // // // //                               <div className="flex items-center gap-1 mt-0.5">
// // // // // // //                                 <p className="text-[11px] text-on-surface-variant">
// // // // // // //                                   Host:{' '}
// // // // // // //                                   <span className="font-semibold">{event.host}</span>
// // // // // // //                                 </p>
// // // // // // //                                 {event.hostVerified && (
// // // // // // //                                   <span className="text-[9px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-bold">
// // // // // // //                                     VERIFIED
// // // // // // //                                   </span>
// // // // // // //                                 )}
// // // // // // //                               </div>
// // // // // // //                               <p className="text-[10px] text-on-surface-variant mt-0.5">
// // // // // // //                                 {event.category}
// // // // // // //                               </p>
// // // // // // //                             </div>
// // // // // // //                           </div>
// // // // // // //                         </td>

// // // // // // //                         {/* AI Flags */}
// // // // // // //                         <td className="px-4 py-4">
// // // // // // //                           {analysis?.isLoading || analyzingId === event.id ? (
// // // // // // //                             <Loader2 size={14} className="animate-spin text-primary" />
// // // // // // //                           ) : analysis?.flags && analysis.flags.length > 0 ? (
// // // // // // //                             <div className="flex flex-wrap gap-1">
// // // // // // //                               {analysis.flags.slice(0, 2).map((flag, i) => (
// // // // // // //                                 <span
// // // // // // //                                   key={i}
// // // // // // //                                   className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
// // // // // // //                                     flag.severity === 'high'
// // // // // // //                                       ? 'bg-tertiary/10 text-tertiary'
// // // // // // //                                       : flag.severity === 'medium'
// // // // // // //                                       ? 'bg-amber-50 text-amber-700'
// // // // // // //                                       : 'bg-surface-container-high text-on-surface-variant'
// // // // // // //                                   }`}
// // // // // // //                                 >
// // // // // // //                                   {flag.type}
// // // // // // //                                 </span>
// // // // // // //                               ))}
// // // // // // //                               {analysis.flags.length > 2 && (
// // // // // // //                                 <span className="text-[10px] text-on-surface-variant">
// // // // // // //                                   +{analysis.flags.length - 2}
// // // // // // //                                 </span>
// // // // // // //                               )}
// // // // // // //                             </div>
// // // // // // //                           ) : analysis ? (
// // // // // // //                             <span className="px-2 py-0.5 bg-secondary-container/20 text-secondary rounded-md text-[10px] font-bold">
// // // // // // //                               Clear
// // // // // // //                             </span>
// // // // // // //                           ) : (
// // // // // // //                             <button
// // // // // // //                               onClick={e => {
// // // // // // //                                 e.stopPropagation();
// // // // // // //                                 analyzeEvent(event);
// // // // // // //                               }}
// // // // // // //                               className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1"
// // // // // // //                             >
// // // // // // //                               <Sparkles size={10} /> Analyze
// // // // // // //                             </button>
// // // // // // //                           )}
// // // // // // //                         </td>

// // // // // // //                         {/* Risk Score */}
// // // // // // //                         <td className="px-4 py-4 w-28">
// // // // // // //                           <RiskBadge analysis={analysis} />
// // // // // // //                         </td>

// // // // // // //                         {/* Status */}
// // // // // // //                         <td className="px-4 py-4">
// // // // // // //                           <span
// // // // // // //                             className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${getStatusColor(event.status)}`}
// // // // // // //                           >
// // // // // // //                             {getStatusLabel(event.status)}
// // // // // // //                           </span>
// // // // // // //                         </td>

// // // // // // //                         {/* Actions */}
// // // // // // //                         <td className="pr-6 py-4 text-right">
// // // // // // //                           <div className="flex items-center justify-end gap-1">
// // // // // // //                             <button
// // // // // // //                               onClick={e => {
// // // // // // //                                 e.stopPropagation();
// // // // // // //                                 handleAction(event.id, 'approve');
// // // // // // //                               }}
// // // // // // //                               className="p-2 text-secondary hover:bg-secondary-container/20 rounded-lg transition-colors"
// // // // // // //                               title="Approve"
// // // // // // //                             >
// // // // // // //                               <CheckCircle2 size={18} />
// // // // // // //                             </button>
// // // // // // //                             <Link
// // // // // // //                               to={`/moderation/${event.id}`}
// // // // // // //                               onClick={e => e.stopPropagation()}
// // // // // // //                               className="p-2 text-primary hover:bg-primary-container/10 rounded-lg transition-colors"
// // // // // // //                               title="View Detail"
// // // // // // //                             >
// // // // // // //                               <Eye size={18} />
// // // // // // //                             </Link>
// // // // // // //                             <button
// // // // // // //                               onClick={e => {
// // // // // // //                                 e.stopPropagation();
// // // // // // //                                 handleAction(event.id, 'reject');
// // // // // // //                               }}
// // // // // // //                               className="p-2 text-tertiary hover:bg-tertiary/10 rounded-lg transition-colors"
// // // // // // //                               title="Reject"
// // // // // // //                             >
// // // // // // //                               <X size={18} />
// // // // // // //                             </button>
// // // // // // //                           </div>
// // // // // // //                         </td>
// // // // // // //                       </tr>
// // // // // // //                     );
// // // // // // //                   })
// // // // // // //                 )}
// // // // // // //               </tbody>
// // // // // // //             </table>
// // // // // // //           </div>

// // // // // // //           {/* Pagination stub */}
// // // // // // //           <div className="px-6 py-4 bg-surface-container-low/30 border-t border-indigo-50/50 flex justify-between items-center">
// // // // // // //             <button className="text-xs font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors">
// // // // // // //               <ChevronLeft size={16} /> Previous
// // // // // // //             </button>
// // // // // // //             <div className="flex items-center gap-2">
// // // // // // //               <span className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg text-xs font-bold">
// // // // // // //                 1
// // // // // // //               </span>
// // // // // // //             </div>
// // // // // // //             <button className="text-xs font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors">
// // // // // // //               Next <ChevronRight size={16} />
// // // // // // //             </button>
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // // //         {/* ── AI Insights Panel ── */}
// // // // // // //         <div className="col-span-12 lg:col-span-4 space-y-6">
// // // // // // //           {/* AI Analysis Card */}
// // // // // // //           <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm relative overflow-hidden border border-indigo-50/50">
// // // // // // //             <div className="absolute top-0 left-0 w-1 h-full bg-tertiary" />
// // // // // // //             <div className="flex items-center justify-between mb-4">
// // // // // // //               <div className="flex items-center gap-2 text-tertiary">
// // // // // // //                 <Sparkles size={20} />
// // // // // // //                 <h4 className="font-bold text-sm">AI Insights Summary</h4>
// // // // // // //               </div>
// // // // // // //               {selectedAnalysis && !selectedAnalysis.isLoading && (
// // // // // // //                 <span
// // // // // // //                   className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
// // // // // // //                     selectedAnalysis.riskScore >= 70
// // // // // // //                       ? 'bg-tertiary/10 text-tertiary'
// // // // // // //                       : selectedAnalysis.riskScore >= 40
// // // // // // //                       ? 'bg-amber-50 text-amber-700'
// // // // // // //                       : 'bg-secondary-container/20 text-secondary'
// // // // // // //                   }`}
// // // // // // //                 >
// // // // // // //                   {getRiskLabel(selectedAnalysis.riskLevel)}
// // // // // // //                 </span>
// // // // // // //               )}
// // // // // // //             </div>

// // // // // // //             {!selectedEvent ? (
// // // // // // //               <p className="text-xs text-on-surface-variant">
// // // // // // //                 Select an event to see AI analysis
// // // // // // //               </p>
// // // // // // //             ) : selectedAnalysis?.isLoading || analyzingId === selectedEvent.id ? (
// // // // // // //               <div className="space-y-4">
// // // // // // //                 <div className="flex items-center gap-2 text-primary">
// // // // // // //                   <Loader2 size={16} className="animate-spin" />
// // // // // // //                   <span className="text-xs font-bold">Gemini AI is analyzing…</span>
// // // // // // //                 </div>
// // // // // // //                 <AILoadingSkeleton />
// // // // // // //               </div>
// // // // // // //             ) : selectedAnalysis ? (
// // // // // // //               <>
// // // // // // //                 <div className="mb-4">
// // // // // // //                   <h5 className="text-xs font-bold text-on-surface-variant uppercase mb-1">
// // // // // // //                     Analyzing
// // // // // // //                   </h5>
// // // // // // //                   <p className="text-sm font-semibold text-on-surface">
// // // // // // //                     "{selectedEvent.title}"
// // // // // // //                   </p>
// // // // // // //                   <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
// // // // // // //                     {selectedAnalysis.summary}
// // // // // // //                   </p>
// // // // // // //                 </div>

// // // // // // //                 {/* Metric bars */}
// // // // // // //                 <div className="space-y-3 mb-4">
// // // // // // //                   {[
// // // // // // //                     { label: 'Semantic Integrity', value: selectedAnalysis.semanticIntegrity },
// // // // // // //                     { label: 'Host Legitimacy', value: selectedAnalysis.hostLegitimacy },
// // // // // // //                     { label: 'Engagement Pattern', value: selectedAnalysis.engagementPattern },
// // // // // // //                   ].map(metric => (
// // // // // // //                     <div key={metric.label}>
// // // // // // //                       <div className="flex justify-between text-[11px] mb-1">
// // // // // // //                         <span className="text-on-surface-variant">{metric.label}</span>
// // // // // // //                         <span className={`font-bold ${getRiskColor(100 - metric.value)}`}>
// // // // // // //                           {metric.value}/100
// // // // // // //                         </span>
// // // // // // //                       </div>
// // // // // // //                       <div className="w-full bg-indigo-50 h-1.5 rounded-full overflow-hidden">
// // // // // // //                         <div
// // // // // // //                           className={`h-full transition-all duration-700 ${getRiskBarColor(100 - metric.value)}`}
// // // // // // //                           style={{ width: `${metric.value}%` }}
// // // // // // //                         />
// // // // // // //                       </div>
// // // // // // //                     </div>
// // // // // // //                   ))}
// // // // // // //                 </div>

// // // // // // //                 {/* Flags */}
// // // // // // //                 {selectedAnalysis.flags.length > 0 && (
// // // // // // //                   <div className="space-y-2 mb-4">
// // // // // // //                     {selectedAnalysis.flags.map((flag, i) => (
// // // // // // //                       <div
// // // // // // //                         key={i}
// // // // // // //                         className={`p-3 rounded-lg flex items-start gap-2 ${
// // // // // // //                           flag.severity === 'high'
// // // // // // //                             ? 'bg-tertiary/5 border-l-2 border-tertiary'
// // // // // // //                             : 'bg-amber-50/50 border-l-2 border-amber-400'
// // // // // // //                         }`}
// // // // // // //                       >
// // // // // // //                         <AlertCircle
// // // // // // //                           size={14}
// // // // // // //                           className={
// // // // // // //                             flag.severity === 'high'
// // // // // // //                               ? 'text-tertiary mt-0.5'
// // // // // // //                               : 'text-amber-600 mt-0.5'
// // // // // // //                           }
// // // // // // //                         />
// // // // // // //                         <div>
// // // // // // //                           <p className="text-xs font-bold text-on-surface">{flag.type}</p>
// // // // // // //                           <p className="text-[11px] text-on-surface-variant">{flag.description}</p>
// // // // // // //                         </div>
// // // // // // //                       </div>
// // // // // // //                     ))}
// // // // // // //                   </div>
// // // // // // //                 )}

// // // // // // //                 {/* Recommendation */}
// // // // // // //                 <div className="bg-surface-container-low p-4 rounded-2xl mb-4">
// // // // // // //                   <p className="text-[10px] font-bold text-primary uppercase mb-1">
// // // // // // //                     Moderator Recommendation
// // // // // // //                   </p>
// // // // // // //                   <p className="text-xs italic text-on-surface-variant">
// // // // // // //                     "{selectedAnalysis.recommendation}"
// // // // // // //                   </p>
// // // // // // //                 </div>

// // // // // // //                 <div className="flex flex-col gap-2">
// // // // // // //                   <Link
// // // // // // //                     to={`/moderation/${selectedEvent.id}`}
// // // // // // //                     className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-all text-center"
// // // // // // //                   >
// // // // // // //                     Review Full Report
// // // // // // //                   </Link>
// // // // // // //                   <p className="text-[10px] text-center text-on-surface-variant">
// // // // // // //                     Scanned {new Date(selectedAnalysis.scannedAt).toLocaleTimeString()}
// // // // // // //                   </p>
// // // // // // //                 </div>
// // // // // // //               </>
// // // // // // //             ) : (
// // // // // // //               <div className="text-center py-4">
// // // // // // //                 <p className="text-xs text-on-surface-variant mb-3">
// // // // // // //                   Click an event to analyze with Gemini AI
// // // // // // //                 </p>
// // // // // // //                 <button
// // // // // // //                   onClick={() => selectedEvent && analyzeEvent(selectedEvent)}
// // // // // // //                   className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2 mx-auto"
// // // // // // //                 >
// // // // // // //                   <Sparkles size={14} />
// // // // // // //                   Analyze with AI
// // // // // // //                 </button>
// // // // // // //               </div>
// // // // // // //             )}
// // // // // // //           </div>

// // // // // // //           {/* Event context card */}
// // // // // // //           {selectedEvent && (
// // // // // // //             <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-indigo-50/50">
// // // // // // //               <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">
// // // // // // //                 Event Context
// // // // // // //               </h4>
// // // // // // //               <div className="space-y-3">
// // // // // // //                 {[
// // // // // // //                   { label: 'Category', val: selectedEvent.category },
// // // // // // //                   { label: 'Ticket Price', val: selectedEvent.ticketPrice },
// // // // // // //                   { label: 'Capacity', val: String(selectedEvent.capacity) },
// // // // // // //                   { label: 'Event Date', val: selectedEvent.eventDate },
// // // // // // //                   { label: 'Location', val: selectedEvent.location },
// // // // // // //                 ].map(r => (
// // // // // // //                   <div key={r.label} className="flex justify-between text-sm">
// // // // // // //                     <span className="text-on-surface-variant">{r.label}</span>
// // // // // // //                     <span className="font-semibold text-right max-w-[60%] truncate">{r.val}</span>
// // // // // // //                   </div>
// // // // // // //                 ))}
// // // // // // //               </div>
// // // // // // //               <div className="mt-4 pt-4 border-t border-indigo-50">
// // // // // // //                 <div className="flex gap-2">
// // // // // // //                   <button
// // // // // // //                     onClick={() => handleAction(selectedEvent.id, 'approve')}
// // // // // // //                     className="flex-1 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1"
// // // // // // //                   >
// // // // // // //                     <CheckCircle2 size={14} /> Approve
// // // // // // //                   </button>
// // // // // // //                   <button
// // // // // // //                     onClick={() => handleAction(selectedEvent.id, 'reject')}
// // // // // // //                     className="flex-1 py-2 bg-tertiary/10 text-tertiary rounded-xl text-xs font-bold hover:bg-tertiary/20 transition-all flex items-center justify-center gap-1"
// // // // // // //                   >
// // // // // // //                     <X size={14} /> Reject
// // // // // // //                   </button>
// // // // // // //                 </div>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           )}
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default ModerationQueue;
// // // // // // // frontend/src/pages/ModerationQueue.tsx
// // // // // // // ✅ FULLY DYNAMIC — getEvents() se data, koi static array nahi
// // // // // // // ✅ Eye button → ModerationDetail page
// // // // // // // ✅ Approve/Reject → localStorage update + status change
// // // // // // // ✅ Refresh → naye create kiye events bhi dikhte hain

// // // // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // // // import {
// // // // // //   Filter, CheckCircle2, Eye, X, ChevronLeft, ChevronRight,
// // // // // //   Sparkles, AlertCircle, Loader2, RefreshCw, Zap, Plus,
// // // // // // } from 'lucide-react';
// // // // // // import { Link, useNavigate } from 'react-router-dom';
// // // // // // //import { analyzeEventWithGemini, getRiskColor, getRiskBarColor, getRiskLabel } from '../lib/gemini';

// // // // // // import { getEvents, updateEventStatus } from '../lib/mockEvents';
// // // // // // import type { Event, AIAnalysis } from '../types';
// // // // // // import { 
// // // // // //   analyzeEventWithOpenAI, 
// // // // // //   getRiskColor, 
// // // // // //   getRiskBarColor, 
// // // // // //   getRiskLabel 
// // // // // // } from '../lib/openai';
// // // // // // const AILoadingSkeleton = () => (
// // // // // //   <div className="animate-pulse space-y-3">
// // // // // //     <div className="h-3 bg-indigo-100 rounded w-3/4" />
// // // // // //     <div className="h-3 bg-indigo-100 rounded w-1/2" />
// // // // // //     <div className="h-8 bg-indigo-100 rounded w-full" />
// // // // // //   </div>
// // // // // // );

// // // // // // const RiskBadge = ({ analysis }: { analysis?: AIAnalysis }) => {
// // // // // //   if (!analysis) return <span className="text-[10px] text-on-surface-variant">Not analyzed</span>;
// // // // // //   if (analysis.isLoading) return <Loader2 size={14} className="animate-spin text-primary" />;
// // // // // //   return (
// // // // // //     <div className="flex flex-col gap-1">
// // // // // //      <span className={`text-[11px] font-bold ${getRiskColor(analysis.riskScore ?? 0)}`}>{analysis.riskScore ?? '—'}%</span>

// // // // // //       <div className="w-full bg-indigo-100 h-1.5 rounded-full overflow-hidden">
// // // // // //         <div className={`h-full transition-all duration-700 ${getRiskBarColor(analysis.riskScore)}`} style={{ width: `${analysis.riskScore}%` }} />
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // const ModerationQueue = () => {
// // // // // //   const navigate = useNavigate();
// // // // // //   const [events, setEvents] = useState<Event[]>([]);
// // // // // //   const [analyses, setAnalyses] = useState<Record<string, AIAnalysis>>({});
// // // // // //   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
// // // // // //   const [isAnalyzingAll, setIsAnalyzingAll] = useState(false);
// // // // // //   const [analyzingId, setAnalyzingId] = useState<string | null>(null);
// // // // // //   const [filterStatus, setFilterStatus] = useState('all');
// // // // // //   const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

// // // // // //   // ✅ Load events from localStorage on mount
// // // // // //   useEffect(() => {
// // // // // //     const all = getEvents();
// // // // // //     setEvents(all);
// // // // // //     if (all.length > 0) setSelectedEvent(all[0]);
// // // // // //   }, []);

// // // // // //   const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
// // // // // //     setNotification({ msg, type });
// // // // // //     setTimeout(() => setNotification(null), 3000);
// // // // // //   };

// // // // // //   // ✅ Refresh — picks up newly created events from localStorage
// // // // // //   const refreshEvents = () => {
// // // // // //     const fresh = getEvents();
// // // // // //     setEvents(fresh);
// // // // // //     showNotification('Queue refreshed!');
// // // // // //   };

// // // // // //   const analyzeEvent = useCallback(async (event: Event) => {
// // // // // //     setAnalyzingId(event.id);
// // // // // //     setAnalyses(prev => ({ ...prev, [event.id]: { ...(prev[event.id] || {}), isLoading: true } as AIAnalysis }));
// // // // // //     try {
// // // // // // const result = await analyzeEventWithOpenAI(event);
// // // // // // // ✅ Ensure flags always exists
// // // // // // const safeResult = {
// // // // // //   ...result,
// // // // // //   flags: result.flags ?? [],
// // // // // //   riskScore: result.riskScore ?? 0,
// // // // // //   riskLevel: result.riskLevel ?? 'low',
// // // // // //   semanticIntegrity: result.semanticIntegrity ?? 80,
// // // // // //   hostLegitimacy: result.hostLegitimacy ?? 80,
// // // // // //   engagementPattern: result.engagementPattern ?? 80,
// // // // // //   summary: result.summary ?? 'No summary available',
// // // // // //   recommendation: result.recommendation ?? '',
// // // // // //   scannedAt: result.scannedAt ?? new Date().toISOString(),
// // // // // //   isLoading: false,
// // // // // // };
// // // // // // setAnalyses(prev => ({ ...prev, [event.id]: safeResult }));
// // // // // //       if (result.riskScore >= 70) {
// // // // // //         setEvents(prev => prev.map(e => e.id === event.id ? { ...e, status: 'flagged' } : e));
// // // // // //         updateEventStatus(event.id, 'flagged');
// // // // // //       }
// // // // // //     } catch (err) {
// // // // // //       console.error('Analysis error:', err);
// // // // // //     } finally {
// // // // // //       setAnalyzingId(null);
// // // // // //     }
// // // // // //   }, []);

// // // // // //   const handleSelectEvent = (event: Event) => {
// // // // // //     setSelectedEvent(event);
// // // // // //     if (!analyses[event.id]) analyzeEvent(event);
// // // // // //   };

// // // // // //   const analyzeAll = async () => {
// // // // // //     setIsAnalyzingAll(true);
// // // // // //     const toAnalyze = events.filter(e => !analyses[e.id]);
// // // // // //     for (const event of toAnalyze) await analyzeEvent(event);
// // // // // //     setIsAnalyzingAll(false);
// // // // // //     showNotification(`${toAnalyze.length} events analyzed!`);
// // // // // //   };

// // // // // //   // ✅ Approve / Reject — updates localStorage + local state
// // // // // //   const handleAction = (eventId: string, action: 'approve' | 'reject') => {
// // // // // //     const newStatus = action === 'approve' ? 'approved' : 'rejected';
// // // // // //     setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: newStatus } : e));
// // // // // //     updateEventStatus(eventId, newStatus);
// // // // // //     showNotification(
// // // // // //       action === 'approve' ? '✓ Event approved & listed on MyApp!' : '✗ Event rejected',
// // // // // //       action === 'approve' ? 'success' : 'error',
// // // // // //     );
// // // // // //     if (selectedEvent?.id === eventId) {
// // // // // //       const next = events.find(e => e.id !== eventId && e.status === 'pending');
// // // // // //       if (next) setSelectedEvent(next);
// // // // // //     }
// // // // // //   };

// // // // // //   const pendingCount = events.filter(e => e.status === 'pending').length;
// // // // // //   const flaggedCount = events.filter(e => e.status === 'flagged').length;
// // // // // //   const selectedAnalysis = selectedEvent ? analyses[selectedEvent.id] : null;

// // // // // //   const getStatusStyle = (status: string) => {
// // // // // //     const map: Record<string, string> = {
// // // // // //       flagged: 'text-tertiary bg-tertiary-container/10',
// // // // // //       pending: 'text-on-surface-variant bg-surface-container-highest',
// // // // // //       under_review: 'text-amber-700 bg-amber-100',
// // // // // //       approved: 'text-on-secondary-container bg-secondary-container',
// // // // // //       rejected: 'text-tertiary bg-tertiary/10',
// // // // // //     };
// // // // // //     return map[status] || 'text-on-surface-variant bg-surface-container-highest';
// // // // // //   };

// // // // // //   const getStatusLabel = (s: string) =>
// // // // // //     ({ pending: 'PENDING', flagged: 'FLAGGED', under_review: 'UNDER REVIEW', approved: 'APPROVED', rejected: 'REJECTED' }[s] || s.toUpperCase());

// // // // // //   const filtered = events.filter(e => filterStatus === 'all' || e.status === filterStatus);

// // // // // //   return (
// // // // // //     <div className="space-y-8">
// // // // // //       {/* Toast */}
// // // // // //       {notification && (
// // // // // //         <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg font-bold text-sm text-white ${notification.type === 'success' ? 'bg-secondary' : 'bg-tertiary'}`}>
// // // // // //           {notification.msg}
// // // // // //         </div>
// // // // // //       )}

// // // // // //       {/* Header */}
// // // // // //       <div className="flex justify-between items-end flex-wrap gap-4">
// // // // // //         <div>
// // // // // //           <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 block">Operational Overview</span>
// // // // // //           <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">Moderation Queue</h3>
// // // // // //           <p className="text-on-surface-variant text-sm mt-1">Events awaiting AI review &amp; approval.</p>
// // // // // //         </div>
// // // // // //         <div className="flex gap-3 items-center flex-wrap">
// // // // // //           <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
// // // // // //             <p className="text-[10px] text-on-surface-variant font-bold uppercase">Pending</p>
// // // // // //             <p className="text-xl font-extrabold text-primary">{pendingCount}</p>
// // // // // //           </div>
// // // // // //           <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
// // // // // //             <p className="text-[10px] text-on-surface-variant font-bold uppercase">Flagged</p>
// // // // // //             <p className="text-xl font-extrabold text-tertiary">{flaggedCount}</p>
// // // // // //           </div>
// // // // // //           <button
// // // // // //             onClick={analyzeAll}
// // // // // //             disabled={isAnalyzingAll}
// // // // // //             className="bg-gradient-to-r from-primary to-primary-container text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-60"
// // // // // //           >
// // // // // //             {isAnalyzingAll ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
// // // // // //             {isAnalyzingAll ? 'Analyzing...' : 'AI Analyze All'}
// // // // // //           </button>
// // // // // //           <Link to="/events/create" className="bg-white border border-primary text-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/5 transition-all">
// // // // // //             <Plus size={16} /> Create Event
// // // // // //           </Link>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       {/* Filters */}
// // // // // //       <div className="bg-surface-container-low p-4 rounded-2xl flex flex-wrap items-center gap-4">
// // // // // //         <div className="flex-1 min-w-[160px]">
// // // // // //           <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">Status</label>
// // // // // //           <select className="w-full bg-surface-container-highest border-none rounded-xl text-sm p-2" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
// // // // // //             <option value="all">All Status</option>
// // // // // //             <option value="pending">Pending</option>
// // // // // //             <option value="flagged">Flagged</option>
// // // // // //             <option value="approved">Approved</option>
// // // // // //             <option value="rejected">Rejected</option>
// // // // // //           </select>
// // // // // //         </div>
// // // // // //         <div className="flex-1 min-w-[160px]">
// // // // // //           <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">Category</label>
// // // // // //           <select className="w-full bg-surface-container-highest border-none rounded-xl text-sm p-2">
// // // // // //             <option>All Categories</option>
// // // // // //             <option>Music &amp; Nightlife</option>
// // // // // //             <option>Technology</option>
// // // // // //             <option>Health &amp; Wellness</option>
// // // // // //             <option>Business &amp; Networking</option>
// // // // // //           </select>
// // // // // //         </div>
// // // // // //         <div className="flex items-end h-full pt-5">
// // // // // //           <button className="bg-surface-container-highest text-primary p-2 px-4 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-surface-variant transition-colors">
// // // // // //             <Filter size={16} /> More Filters
// // // // // //           </button>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       {/* Main Grid */}
// // // // // //       <div className="grid grid-cols-12 gap-6 items-start">
// // // // // //         {/* Table */}
// // // // // //         <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-indigo-50/50">
// // // // // //           <div className="px-6 py-4 bg-indigo-50/30 flex justify-between items-center border-b border-indigo-50/50">
// // // // // //             <div className="flex items-center gap-3">
// // // // // //               <span className="text-sm font-bold text-indigo-900">{events.length} events in queue</span>
// // // // // //               <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">LIVE</span>
// // // // // //             </div>
// // // // // //             <button onClick={refreshEvents} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
// // // // // //               <RefreshCw size={12} /> Refresh
// // // // // //             </button>
// // // // // //           </div>

// // // // // //           <div className="overflow-x-auto">
// // // // // //             <table className="w-full border-collapse">
// // // // // //               <thead>
// // // // // //                 <tr className="text-left border-b border-indigo-50">
// // // // // //                   <th className="pl-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Event &amp; Host</th>
// // // // // //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">AI Flags</th>
// // // // // //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider w-28">Risk Score</th>
// // // // // //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
// // // // // //                   <th className="pr-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
// // // // // //                 </tr>
// // // // // //               </thead>
// // // // // //               <tbody className="divide-y divide-indigo-50/30">
// // // // // //                 {filtered.length === 0 ? (
// // // // // //                   <tr>
// // // // // //                     <td colSpan={5} className="py-16 text-center text-on-surface-variant text-sm">
// // // // // //                       No events found.{' '}
// // // // // //                       <Link to="/events/create" className="text-primary font-bold hover:underline">Create one →</Link>
// // // // // //                     </td>
// // // // // //                   </tr>
// // // // // //                 ) : filtered.map(event => {
// // // // // //                   const analysis = analyses[event.id];
// // // // // //                   const isSelected = selectedEvent?.id === event.id;
// // // // // //                   return (
// // // // // //                     <tr
// // // // // //                       key={event.id}
// // // // // //                       onClick={() => handleSelectEvent(event)}
// // // // // //                       className={`transition-colors cursor-pointer ${isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-surface-container-low/50'}`}
// // // // // //                     >
// // // // // //                       {/* Event + Host */}
// // // // // //                       <td className="pl-6 py-4">
// // // // // //                         <div className="flex items-center gap-3">
// // // // // //                           <img
// // // // // //                             src={event.image}
// // // // // //                             alt={event.title}
// // // // // //                             className="w-12 h-12 rounded-xl object-cover shadow-sm flex-shrink-0"
// // // // // //                             referrerPolicy="no-referrer"
// // // // // //                             onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/e8eaf6/4355b9?text=E'; }}
// // // // // //                           />
// // // // // //                           <div>
// // // // // //                             <p className="text-sm font-bold text-slate-900 leading-tight">{event.title}</p>
// // // // // //                             <div className="flex items-center gap-1 mt-0.5 flex-wrap">
// // // // // //                               <p className="text-[11px] text-on-surface-variant">Host: <span className="font-semibold">{event.host}</span></p>
// // // // // //                               {event.hostVerified && (
// // // // // //                                 <span className="text-[9px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-bold">VERIFIED</span>
// // // // // //                               )}
// // // // // //                             </div>
// // // // // //                             <p className="text-[10px] text-on-surface-variant mt-0.5">{event.category}</p>
// // // // // //                           </div>
// // // // // //                         </div>
// // // // // //                       </td>

// // // // // //                       {/* AI Flags */}
// // // // // //                       <td className="px-4 py-4">
// // // // // //                         {analysis?.isLoading || analyzingId === event.id ? (
// // // // // //                           <Loader2 size={14} className="animate-spin text-primary" />
// // // // // //                         ) : analysis?.flags?.length > 0 ? (
// // // // // //                           <div className="flex flex-wrap gap-1">
// // // // // //                             {analysis.flags.slice(0, 2).map((flag, i) => (
// // // // // //                               <span key={i} className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${flag.severity === 'high' ? 'bg-tertiary/10 text-tertiary' : flag.severity === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-surface-container-high text-on-surface-variant'}`}>
// // // // // //                                 {flag.type}
// // // // // //                               </span>
// // // // // //                             ))}
// // // // // //                             {analysis.flags.length > 2 && <span className="text-[10px] text-on-surface-variant">+{analysis.flags.length - 2}</span>}
// // // // // //                           </div>
// // // // // //                         ) : analysis ? (
// // // // // //                           <span className="px-2 py-0.5 bg-secondary-container/20 text-secondary rounded-md text-[10px] font-bold">Clear</span>
// // // // // //                         ) : (
// // // // // //                           <button
// // // // // //                             onClick={e => { e.stopPropagation(); analyzeEvent(event); }}
// // // // // //                             className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1"
// // // // // //                           >
// // // // // //                             <Sparkles size={10} /> Analyze
// // // // // //                           </button>
// // // // // //                         )}
// // // // // //                       </td>

// // // // // //                       {/* Risk Score */}
// // // // // //                       <td className="px-4 py-4 w-28"><RiskBadge analysis={analysis} /></td>

// // // // // //                       {/* Status */}
// // // // // //                       <td className="px-4 py-4">
// // // // // //                         <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${getStatusStyle(event.status)}`}>
// // // // // //                           {getStatusLabel(event.status)}
// // // // // //                         </span>
// // // // // //                       </td>

// // // // // //                       {/* ✅ Actions — all 3 work */}
// // // // // //                       <td className="pr-6 py-4 text-right">
// // // // // //                         <div className="flex items-center justify-end gap-1">
// // // // // //                           {/* Approve */}
// // // // // //                           <button
// // // // // //                             onClick={e => { e.stopPropagation(); handleAction(event.id, 'approve'); }}
// // // // // //                             className="p-2 text-secondary hover:bg-secondary-container/20 rounded-lg transition-colors"
// // // // // //                             title="Approve"
// // // // // //                           >
// // // // // //                             <CheckCircle2 size={18} />
// // // // // //                           </button>
// // // // // //                           {/* ✅ Eye → ModerationDetail */}
// // // // // //                           <Link
// // // // // //                             to={`/moderation/${event.id}`}
// // // // // //                             onClick={e => e.stopPropagation()}
// // // // // //                             className="p-2 text-primary hover:bg-primary-container/10 rounded-lg transition-colors"
// // // // // //                             title="View Detail"
// // // // // //                           >
// // // // // //                             <Eye size={18} />
// // // // // //                           </Link>
// // // // // //                           {/* Reject */}
// // // // // //                           <button
// // // // // //                             onClick={e => { e.stopPropagation(); handleAction(event.id, 'reject'); }}
// // // // // //                             className="p-2 text-tertiary hover:bg-tertiary/10 rounded-lg transition-colors"
// // // // // //                             title="Reject"
// // // // // //                           >
// // // // // //                             <X size={18} />
// // // // // //                           </button>
// // // // // //                         </div>
// // // // // //                       </td>
// // // // // //                     </tr>
// // // // // //                   );
// // // // // //                 })}
// // // // // //               </tbody>
// // // // // //             </table>
// // // // // //           </div>

// // // // // //           <div className="px-6 py-4 bg-surface-container-low/30 border-t border-indigo-50/50 flex justify-between items-center">
// // // // // //             <button className="text-xs font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary"><ChevronLeft size={16} /> Previous</button>
// // // // // //             <span className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg text-xs font-bold">1</span>
// // // // // //             <button className="text-xs font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary">Next <ChevronRight size={16} /></button>
// // // // // //           </div>
// // // // // //         </div>

// // // // // //         {/* AI Insights Panel */}
// // // // // //         <div className="col-span-12 lg:col-span-4 space-y-6">
// // // // // //           <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm relative overflow-hidden border border-indigo-50/50">
// // // // // //             <div className="absolute top-0 left-0 w-1 h-full bg-tertiary" />
// // // // // //             <div className="flex items-center justify-between mb-4">
// // // // // //               <div className="flex items-center gap-2 text-tertiary">
// // // // // //                 <Sparkles size={20} />
// // // // // //                 <h4 className="font-bold text-sm">AI Insights</h4>
// // // // // //               </div>
// // // // // //               {selectedAnalysis && !selectedAnalysis.isLoading && (
// // // // // //                 <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${selectedAnalysis.riskScore >= 70 ? 'bg-tertiary/10 text-tertiary' : selectedAnalysis.riskScore >= 40 ? 'bg-amber-50 text-amber-700' : 'bg-secondary-container/20 text-secondary'}`}>
// // // // // //                   {getRiskLabel(selectedAnalysis.riskLevel)}
// // // // // //                 </span>
// // // // // //               )}
// // // // // //             </div>

// // // // // //             {!selectedEvent ? (
// // // // // //               <p className="text-xs text-on-surface-variant">Select an event to see AI analysis</p>
// // // // // //             ) : selectedAnalysis?.isLoading || analyzingId === selectedEvent.id ? (
// // // // // //               <div className="space-y-4">
// // // // // //                 <div className="flex items-center gap-2 text-primary">
// // // // // //                   <Loader2 size={16} className="animate-spin" />
// // // // // //                   <span className="text-xs font-bold">Gemini AI analyzing…</span>
// // // // // //                 </div>
// // // // // //                 <AILoadingSkeleton />
// // // // // //               </div>
// // // // // //             ) : selectedAnalysis ? (
// // // // // //               <>
// // // // // //                 <div className="mb-4">
// // // // // //                   <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Analyzing</p>
// // // // // //                   <p className="text-sm font-semibold text-on-surface">"{selectedEvent.title}"</p>
// // // // // //                   <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{selectedAnalysis.summary}</p>
// // // // // //                 </div>
// // // // // //                 <div className="space-y-3 mb-4">
// // // // // //                   {[
// // // // // //                     { label: 'Semantic Integrity', value: selectedAnalysis.semanticIntegrity },
// // // // // //                     { label: 'Host Legitimacy', value: selectedAnalysis.hostLegitimacy },
// // // // // //                     { label: 'Engagement Pattern', value: selectedAnalysis.engagementPattern },
// // // // // //                   ].map(m => (
// // // // // //                     <div key={m.label}>
// // // // // //                       <div className="flex justify-between text-[11px] mb-1">
// // // // // //                         <span className="text-on-surface-variant">{m.label}</span>
// // // // // //                         <span className={`font-bold ${getRiskColor(100 - m.value)}`}>{m.value}/100</span>
// // // // // //                       </div>
// // // // // //                       <div className="w-full bg-indigo-50 h-1.5 rounded-full overflow-hidden">
// // // // // //                         <div className={`h-full transition-all duration-700 ${getRiskBarColor(100 - m.value)}`} style={{ width: `${m.value}%` }} />
// // // // // //                       </div>
// // // // // //                     </div>
// // // // // //                   ))}
// // // // // //                 </div>
// // // // // // {(selectedAnalysis.flags?.length ?? 0) > 0 && (
// // // // // //                     <div className="space-y-2 mb-4">
// // // // // //                     {selectedAnalysis.flags.map((flag, i) => (
// // // // // //                       <div key={i} className={`p-3 rounded-lg flex items-start gap-2 ${flag.severity === 'high' ? 'bg-tertiary/5 border-l-2 border-tertiary' : 'bg-amber-50/50 border-l-2 border-amber-400'}`}>
// // // // // //                         <AlertCircle size={14} className={flag.severity === 'high' ? 'text-tertiary mt-0.5' : 'text-amber-600 mt-0.5'} />
// // // // // //                         <div>
// // // // // //                           <p className="text-xs font-bold text-on-surface">{flag.type}</p>
// // // // // //                           <p className="text-[11px] text-on-surface-variant">{flag.description}</p>
// // // // // //                         </div>
// // // // // //                       </div>
// // // // // //                     ))}
// // // // // //                   </div>
// // // // // //                 )}
// // // // // //                 <div className="bg-surface-container-low p-4 rounded-2xl mb-4">
// // // // // //                   <p className="text-[10px] font-bold text-primary uppercase mb-1">Recommendation</p>
// // // // // //                   <p className="text-xs italic text-on-surface-variant">"{selectedAnalysis.recommendation}"</p>
// // // // // //                 </div>
// // // // // //                 <Link to={`/moderation/${selectedEvent.id}`} className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-all text-center block">
// // // // // //                   Review Full Report
// // // // // //                 </Link>
// // // // // //               </>
// // // // // //             ) : (
// // // // // //               <div className="text-center py-4">
// // // // // //                 <p className="text-xs text-on-surface-variant mb-3">Click an event to analyze</p>
// // // // // //                 <button onClick={() => selectedEvent && analyzeEvent(selectedEvent)} className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 flex items-center gap-2 mx-auto">
// // // // // //                   <Sparkles size={14} /> Analyze with AI
// // // // // //                 </button>
// // // // // //               </div>
// // // // // //             )}
// // // // // //           </div>

// // // // // //           {/* Event Context */}
// // // // // //           {selectedEvent && (
// // // // // //             <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-indigo-50/50">
// // // // // //               <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Event Context</h4>
// // // // // //               <div className="space-y-3">
// // // // // //                 {[
// // // // // //                   { label: 'Category', val: selectedEvent.category },
// // // // // //                   { label: 'Price', val: selectedEvent.ticketPrice },
// // // // // //                   { label: 'Capacity', val: String(selectedEvent.capacity) },
// // // // // //                   { label: 'Date', val: selectedEvent.eventDate },
// // // // // //                   { label: 'Location', val: selectedEvent.location },
// // // // // //                 ].map(r => (
// // // // // //                   <div key={r.label} className="flex justify-between text-sm">
// // // // // //                     <span className="text-on-surface-variant">{r.label}</span>
// // // // // //                     <span className="font-semibold text-right max-w-[60%] truncate">{r.val}</span>
// // // // // //                   </div>
// // // // // //                 ))}
// // // // // //               </div>
// // // // // //               <div className="mt-4 pt-4 border-t border-indigo-50 flex gap-2">
// // // // // //                 <button onClick={() => handleAction(selectedEvent.id, 'approve')} className="flex-1 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1">
// // // // // //                   <CheckCircle2 size={14} /> Approve
// // // // // //                 </button>
// // // // // //                 <button onClick={() => handleAction(selectedEvent.id, 'reject')} className="flex-1 py-2 bg-tertiary/10 text-tertiary rounded-xl text-xs font-bold hover:bg-tertiary/20 flex items-center justify-center gap-1">
// // // // // //                   <X size={14} /> Reject
// // // // // //                 </button>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           )}
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default ModerationQueue;
// // // // // // frontend/src/pages/ModerationQueue.tsx
// // // // // // ✅ MyApp MongoDB se events fetch karta hai (via backend API)
// // // // // // ✅ Eye → ModerationDetail, Approve/Reject → MongoDB update

// // // // // import React, { useState, useEffect, useCallback } from 'react';
// // // // // import {
// // // // //   Filter, CheckCircle2, Eye, X, ChevronLeft, ChevronRight,
// // // // //   Sparkles, AlertCircle, Loader2, RefreshCw, Zap, Plus,
// // // // //   Database,
// // // // // } from 'lucide-react';
// // // // // import { Link } from 'react-router-dom';
// // // // // import { analyzeEventWithOpenAI, getRiskColor, getRiskBarColor, getRiskLabel } from '../lib/openai';
// // // // // import { getEventsFromAPI, updateEventStatusAPI, getEvents, updateEventStatus, addEvent } from '../lib/mockEvents';
// // // // // import type { Event, AIAnalysis } from '../types';

// // // // // const AILoadingSkeleton = () => (
// // // // //   <div className="animate-pulse space-y-3">
// // // // //     <div className="h-3 bg-indigo-100 rounded w-3/4" />
// // // // //     <div className="h-3 bg-indigo-100 rounded w-1/2" />
// // // // //     <div className="h-8 bg-indigo-100 rounded w-full" />
// // // // //   </div>
// // // // // );

// // // // // const RiskBadge = ({ analysis }: { analysis?: AIAnalysis }) => {
// // // // //   if (!analysis) return <span className="text-[10px] text-on-surface-variant">Not analyzed</span>;
// // // // //   if (analysis.isLoading) return <Loader2 size={14} className="animate-spin text-primary" />;
// // // // //   return (
// // // // //     <div className="flex flex-col gap-1">
// // // // //       <span className={`text-[11px] font-bold ${getRiskColor(analysis.riskScore ?? 0)}`}>{analysis.riskScore ?? '—'}%</span>
// // // // //       <div className="w-full bg-indigo-100 h-1.5 rounded-full overflow-hidden">
// // // // //         <div className={`h-full transition-all duration-700 ${getRiskBarColor(analysis.riskScore ?? 0)}`} style={{ width: `${analysis.riskScore ?? 0}%` }} />
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // const ModerationQueue = () => {
// // // // //   const [events, setEvents] = useState<Event[]>([]);
// // // // //   const [analyses, setAnalyses] = useState<Record<string, AIAnalysis>>({});
// // // // //   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
// // // // //   const [isAnalyzingAll, setIsAnalyzingAll] = useState(false);
// // // // //   const [analyzingId, setAnalyzingId] = useState<string | null>(null);
// // // // //   const [filterStatus, setFilterStatus] = useState('all');
// // // // //   const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
// // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // //   const [dataSource, setDataSource] = useState<'api' | 'local'>('api');
// // // // //   const [currentPage, setCurrentPage] = useState(1);
// // // // // const itemsPerPage = 5;
 
// // // // //   const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
// // // // //     setNotification({ msg, type });
// // // // //     setTimeout(() => setNotification(null), 3000);
// // // // //   };
  

// // // // //   // ✅ Load events — try MongoDB API first, fallback to localStorage
// // // // //   const loadEvents = async () => {
// // // // //     setIsLoading(true);
// // // // //     try {
// // // // //       const apiEvents = await getEventsFromAPI();
// // // // //       if (apiEvents.length > 0) {
// // // // //         setEvents(apiEvents);
// // // // //         setSelectedEvent(apiEvents[0]);
// // // // //         setDataSource('api');
// // // // //         console.log(`✅ Loaded ${apiEvents.length} events from MyApp MongoDB`);
// // // // //       } else {
// // // // //         // Fallback to localStorage if API returns nothing
// // // // //         const localEvents = getEvents();
// // // // //         setEvents(localEvents);
// // // // //         if (localEvents.length > 0) setSelectedEvent(localEvents[0]);
// // // // //         setDataSource('local');
// // // // //         console.log('⚠️ API returned no events, using localStorage fallback');
// // // // //       }
// // // // //     } catch (err) {
// // // // //       const localEvents = getEvents();
// // // // //       setEvents(localEvents);
// // // // //       if (localEvents.length > 0) setSelectedEvent(localEvents[0]);
// // // // //       setDataSource('local');
// // // // //       console.error('❌ API failed, using localStorage:', err);
// // // // //     } finally {
// // // // //       setIsLoading(false);
// // // // //     }
// // // // //   };

// // // // //   useEffect(() => { loadEvents(); }, []);

// // // // //   const refreshEvents = async () => {
// // // // //     await loadEvents();
// // // // //     showNotification('Queue refreshed from MyApp!');
// // // // //   };
// // // // //   useEffect(() => {
// // // // //   setCurrentPage(1);
// // // // // }, [filterStatus]);

// // // // //   const analyzeEvent = useCallback(async (event: Event) => {
// // // // //     setAnalyzingId(event.id);
// // // // //     setAnalyses(prev => ({ ...prev, [event.id]: { ...(prev[event.id] || {}), isLoading: true } as AIAnalysis }));
// // // // //     try {
// // // // //       const result = await analyzeEventWithOpenAI(event);
// // // // //       const safe = {
// // // // //         ...result,
// // // // //         flags: result.flags ?? [],
// // // // //         riskScore: result.riskScore ?? 0,
// // // // //         riskLevel: result.riskLevel ?? 'low',
// // // // //         semanticIntegrity: result.semanticIntegrity ?? 80,
// // // // //         hostLegitimacy: result.hostLegitimacy ?? 80,
// // // // //         engagementPattern: result.engagementPattern ?? 80,
// // // // //         summary: result.summary ?? 'No summary available',
// // // // //         recommendation: result.recommendation ?? '',
// // // // //         scannedAt: result.scannedAt ?? new Date().toISOString(),
// // // // //         isLoading: false,
// // // // //       };
// // // // //       setAnalyses(prev => ({ ...prev, [event.id]: safe }));

// // // // //       if ((result.riskScore ?? 0) >= 70) {
// // // // //         setEvents(prev => prev.map(e => e.id === event.id ? { ...e, status: 'flagged' } : e));
// // // // //         // Update in both API and localStorage
// // // // //         if (dataSource === 'api') await updateEventStatusAPI(event.id, 'flagged');
// // // // //         else updateEventStatus(event.id, 'flagged');
// // // // //       }
// // // // //     } catch (err) {
// // // // //       console.error('Analysis error:', err);
// // // // //     } finally {
// // // // //       setAnalyzingId(null);
// // // // //     }
// // // // //   }, [dataSource]);

// // // // //   const handleSelectEvent = (event: Event) => {
// // // // //     setSelectedEvent(event);
// // // // //     if (!analyses[event.id]) analyzeEvent(event);
// // // // //   };

// // // // //   const analyzeAll = async () => {
// // // // //     setIsAnalyzingAll(true);
// // // // //     const toAnalyze = events.filter(e => !analyses[e.id]);
// // // // //     for (const event of toAnalyze) await analyzeEvent(event);
// // // // //     setIsAnalyzingAll(false);
// // // // //     showNotification(`${toAnalyze.length} events analyzed!`);
// // // // //   };

// // // // //   // ✅ Approve/Reject — updates MongoDB via API
// // // // //   const handleAction = async (eventId: string, action: 'approve' | 'reject') => {
// // // // //     const newStatus = action === 'approve' ? 'approved' : 'rejected';

// // // // //     // Optimistic UI update
// // // // //     setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: newStatus } : e));

// // // // //     // Update in backend (MongoDB)
// // // // //     if (dataSource === 'api') {
// // // // //       const success = await updateEventStatusAPI(eventId, newStatus);
// // // // //       if (!success) {
// // // // //         showNotification('Failed to update status in MyApp DB', 'error');
// // // // //         // Rollback
// // // // //         setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'pending' } : e));
// // // // //         return;
// // // // //       }
// // // // //     } else {
// // // // //       updateEventStatus(eventId, newStatus);
// // // // //     }

// // // // //     showNotification(
// // // // //       action === 'approve' ? '✓ Event approved & will be listed on MyApp!' : '✗ Event rejected',
// // // // //       action === 'approve' ? 'success' : 'error',
// // // // //     );

// // // // //     if (selectedEvent?.id === eventId) {
// // // // //       const next = events.find(e => e.id !== eventId && e.status === 'pending');
// // // // //       if (next) setSelectedEvent(next);
// // // // //     }
// // // // //   };

// // // // //   const pendingCount = events.filter(e => e.status === 'pending').length;
// // // // //   const flaggedCount = events.filter(e => e.status === 'flagged').length;
// // // // //   const selectedAnalysis = selectedEvent ? analyses[selectedEvent.id] : null;

// // // // //   const getStatusStyle = (status: string) => ({
// // // // //     flagged: 'text-tertiary bg-tertiary-container/10',
// // // // //     pending: 'text-on-surface-variant bg-surface-container-highest',
// // // // //     under_review: 'text-amber-700 bg-amber-100',
// // // // //     approved: 'text-on-secondary-container bg-secondary-container',
// // // // //     rejected: 'text-tertiary bg-tertiary/10',
// // // // //   }[status] || 'text-on-surface-variant bg-surface-container-highest');

// // // // //   const getStatusLabel = (s: string) =>
// // // // //     ({ pending: 'PENDING', flagged: 'FLAGGED', under_review: 'UNDER REVIEW', approved: 'APPROVED', rejected: 'REJECTED' }[s] || s.toUpperCase());

// // // // //   const filtered = events.filter(e => filterStatus === 'all' || e.status === filterStatus);
// // // // //    const totalPages = Math.ceil(filtered.length / itemsPerPage);

// // // // // const startIndex = (currentPage - 1) * itemsPerPage;
// // // // // const paginatedEvents = filtered.slice(startIndex, startIndex + itemsPerPage);
// // // // //   return (
// // // // //     <div className="space-y-8">
// // // // //       {/* Toast */}
// // // // //       {notification && (
// // // // //         <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg font-bold text-sm text-white ${notification.type === 'success' ? 'bg-secondary' : 'bg-tertiary'}`}>
// // // // //           {notification.msg}
// // // // //         </div>
// // // // //       )}

// // // // //       {/* Header */}
// // // // //       <div className="flex justify-between items-end flex-wrap gap-4">
// // // // //         <div>
// // // // //           <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 block flex items-center gap-2">
// // // // //             <Database size={10} />
// // // // //             {dataSource === 'api' ? 'Live from MyApp MongoDB' : 'LocalStorage (API offline)'}
// // // // //           </span>
// // // // //           <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">Moderation Queue</h3>
// // // // //           <p className="text-on-surface-variant text-sm mt-1">Events from MyApp awaiting AI review &amp; approval.</p>
// // // // //         </div>
// // // // //         <div className="flex gap-3 items-center flex-wrap">
// // // // //           <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
// // // // //             <p className="text-[10px] text-on-surface-variant font-bold uppercase">Pending</p>
// // // // //             <p className="text-xl font-extrabold text-primary">{pendingCount}</p>
// // // // //           </div>
// // // // //           <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
// // // // //             <p className="text-[10px] text-on-surface-variant font-bold uppercase">Flagged</p>
// // // // //             <p className="text-xl font-extrabold text-tertiary">{flaggedCount}</p>
// // // // //           </div>
// // // // //           <button
// // // // //             onClick={analyzeAll}
// // // // //             disabled={isAnalyzingAll || isLoading}
// // // // //             className="bg-gradient-to-r from-primary to-primary-container text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-60"
// // // // //           >
// // // // //             {isAnalyzingAll ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
// // // // //             {isAnalyzingAll ? 'Analyzing...' : 'AI Analyze All'}
// // // // //           </button>
// // // // //           <button
// // // // //             onClick={refreshEvents}
// // // // //             disabled={isLoading}
// // // // //             className="bg-white border border-primary text-primary px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/5 transition-all disabled:opacity-50"
// // // // //           >
// // // // //             <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
// // // // //             {isLoading ? 'Loading...' : 'Refresh'}
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Filters */}
// // // // //       <div className="bg-surface-container-low p-4 rounded-2xl flex flex-wrap items-center gap-4">
// // // // //         <div className="flex-1 min-w-[160px]">
// // // // //           <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">Status</label>
// // // // //           <select className="w-full bg-surface-container-highest border-none rounded-xl text-sm p-2" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
// // // // //             <option value="all">All Status</option>
// // // // //             <option value="pending">Pending</option>
// // // // //             <option value="flagged">Flagged</option>
// // // // //             <option value="approved">Approved</option>
// // // // //             <option value="rejected">Rejected</option>
// // // // //           </select>
// // // // //         </div>
// // // // //         <div className="flex-1 min-w-[160px]">
// // // // //           <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">Category</label>
// // // // //           <select className="w-full bg-surface-container-highest border-none rounded-xl text-sm p-2">
// // // // //             <option>All Categories</option>
// // // // //             <option>Music &amp; Nightlife</option>
// // // // //             <option>Technology</option>
// // // // //             <option>Health &amp; Wellness</option>
// // // // //             <option>Business &amp; Networking</option>
// // // // //           </select>
// // // // //         </div>
// // // // //         <div className="flex items-end h-full pt-5">
// // // // //           <button className="bg-surface-container-highest text-primary p-2 px-4 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-surface-variant transition-colors">
// // // // //             <Filter size={16} /> More Filters
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Main Grid */}
// // // // //       <div className="grid grid-cols-12 gap-6 items-start">
// // // // //         <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-indigo-50/50">
// // // // //           <div className="px-6 py-4 bg-indigo-50/30 flex justify-between items-center border-b border-indigo-50/50">
// // // // //             <div className="flex items-center gap-3">
// // // // //               <span className="text-sm font-bold text-indigo-900">{events.length} events in queue</span>
// // // // //               <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${dataSource === 'api' ? 'bg-secondary/10 text-secondary' : 'bg-amber-50 text-amber-700'}`}>
// // // // //                 {dataSource === 'api' ? 'MONGODB LIVE' : 'LOCAL CACHE'}
// // // // //               </span>
// // // // //             </div>
// // // // //             <button onClick={refreshEvents} disabled={isLoading} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline disabled:opacity-50">
// // // // //               <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} /> Refresh
// // // // //             </button>
// // // // //           </div>

// // // // //           <div className="overflow-x-auto">
// // // // //             <table className="w-full border-collapse">
// // // // //               <thead>
// // // // //                 <tr className="text-left border-b border-indigo-50">
// // // // //                   <th className="pl-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Event &amp; Host</th>
// // // // //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">AI Flags</th>
// // // // //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider w-28">Risk Score</th>
// // // // //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
// // // // //                   <th className="pr-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
// // // // //                 </tr>
// // // // //               </thead>
// // // // //               <tbody className="divide-y divide-indigo-50/30">
// // // // //                 {isLoading ? (
// // // // //                   <tr><td colSpan={5} className="py-16 text-center">
// // // // //                     <div className="flex flex-col items-center gap-3">
// // // // //                       <Loader2 size={32} className="animate-spin text-primary" />
// // // // //                       <p className="text-sm text-on-surface-variant">Fetching events from MyApp database…</p>
// // // // //                     </div>
// // // // //                   </td></tr>
// // // // //                 ) : filtered.length === 0 ? (
// // // // //                   <tr><td colSpan={5} className="py-16 text-center text-on-surface-variant text-sm">
// // // // //                     {events.length === 0
// // // // //                       ? <div className="space-y-2">
// // // // //                           <p>No events found in MyApp database.</p>
// // // // //                           <p className="text-xs">Make sure backend is running: <code className="bg-surface-container px-2 py-0.5 rounded">cd backend && node server.js</code></p>
// // // // //                         </div>
// // // // //                       : 'No events match this filter.'
// // // // //                     }
// // // // //                   </td></tr>
// // // // //                 ) : paginatedEvents.map(event => {
// // // // //                   const analysis = analyses[event.id];
// // // // //                   const isSelected = selectedEvent?.id === event.id;
// // // // //                   return (
// // // // //                     <tr key={event.id} onClick={() => handleSelectEvent(event)}
// // // // //                       className={`transition-colors cursor-pointer ${isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-surface-container-low/50'}`}
// // // // //                     >
// // // // //                       <td className="pl-6 py-4">
// // // // //                         <div className="flex items-center gap-3">
// // // // //                           <img src={event.image} alt={event.title}
// // // // //                             className="w-12 h-12 rounded-xl object-cover shadow-sm flex-shrink-0"
// // // // //                             referrerPolicy="no-referrer"
// // // // //                             onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/e8eaf6/4355b9?text=E'; }}
// // // // //                           />
// // // // //                           <div>
// // // // //                             <p className="text-sm font-bold text-slate-900 leading-tight">{event.title}</p>
// // // // //                             <div className="flex items-center gap-1 mt-0.5">
// // // // //                               <p className="text-[11px] text-on-surface-variant">Host: <span className="font-semibold">{event.host}</span></p>
// // // // //                               {event.hostVerified && <span className="text-[9px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-bold">VERIFIED</span>}
// // // // //                             </div>
// // // // //                             <p className="text-[10px] text-on-surface-variant mt-0.5">{event.category}</p>
// // // // //                           </div>
// // // // //                         </div>
// // // // //                       </td>

// // // // //                       <td className="px-4 py-4">
// // // // //                         {analysis?.isLoading || analyzingId === event.id ? (
// // // // //                           <Loader2 size={14} className="animate-spin text-primary" />
// // // // //                         ) : (analysis?.flags?.length ?? 0) > 0 ? (
// // // // //                           <div className="flex flex-wrap gap-1">
// // // // //                             {analysis!.flags.slice(0, 2).map((flag, i) => (
// // // // //                               <span key={i} className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${flag.severity === 'high' ? 'bg-tertiary/10 text-tertiary' : flag.severity === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-surface-container-high text-on-surface-variant'}`}>
// // // // //                                 {flag.type}
// // // // //                               </span>
// // // // //                             ))}
// // // // //                             {analysis!.flags.length > 2 && <span className="text-[10px] text-on-surface-variant">+{analysis!.flags.length - 2}</span>}
// // // // //                           </div>
// // // // //                         ) : analysis ? (
// // // // //                           <span className="px-2 py-0.5 bg-secondary-container/20 text-secondary rounded-md text-[10px] font-bold">Clear</span>
// // // // //                         ) : (
// // // // //                           <button onClick={e => { e.stopPropagation(); analyzeEvent(event); }} className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1">
// // // // //                             <Sparkles size={10} /> Analyze
// // // // //                           </button>
// // // // //                         )}
// // // // //                       </td>

// // // // //                       <td className="px-4 py-4 w-28"><RiskBadge analysis={analysis} /></td>

// // // // //                       <td className="px-4 py-4">
// // // // //                         <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${getStatusStyle(event.status)}`}>
// // // // //                           {getStatusLabel(event.status)}
// // // // //                         </span>
// // // // //                       </td>

// // // // //                       <td className="pr-6 py-4 text-right">
// // // // //                         <div className="flex items-center justify-end gap-1">
// // // // //                           <button onClick={e => { e.stopPropagation(); handleAction(event.id, 'approve'); }}
// // // // //                             className="p-2 text-secondary hover:bg-secondary-container/20 rounded-lg transition-colors" title="Approve">
// // // // //                             <CheckCircle2 size={18} />
// // // // //                           </button>
// // // // //                           <Link to={`/moderation/${event.id}`} onClick={e => e.stopPropagation()}
// // // // //                             className="p-2 text-primary hover:bg-primary-container/10 rounded-lg transition-colors" title="View Detail">
// // // // //                             <Eye size={18} />
// // // // //                           </Link>
// // // // //                           <button onClick={e => { e.stopPropagation(); handleAction(event.id, 'reject'); }}
// // // // //                             className="p-2 text-tertiary hover:bg-tertiary/10 rounded-lg transition-colors" title="Reject">
// // // // //                             <X size={18} />
// // // // //                           </button>
// // // // //                         </div>
// // // // //                       </td>
// // // // //                     </tr>
// // // // //                   );
// // // // //                 })}
// // // // //               </tbody>
// // // // //             </table>
// // // // //           </div>

// // // // //          <div className="px-6 py-4 bg-surface-container-low/30 border-t border-indigo-50/50 flex justify-between items-center">

// // // // //   {/* PREVIOUS */}
// // // // //   <button
// // // // //     onClick={() => setCurrentPage(prev => prev - 1)}
// // // // //     disabled={currentPage === 1}
// // // // //     className="text-xs font-bold flex items-center gap-1 disabled:opacity-40"
// // // // //   >
// // // // //     <ChevronLeft size={16} /> Previous
// // // // //   </button>

// // // // //   {/* PAGE NUMBER */}
// // // // //   <span className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-bold">
// // // // //     {currentPage} / {totalPages}
// // // // //   </span>

// // // // //   {/* NEXT */}
// // // // //   <button
// // // // //     onClick={() => setCurrentPage(prev => prev + 1)}
// // // // //     disabled={currentPage === totalPages}
// // // // //     className="text-xs font-bold flex items-center gap-1 disabled:opacity-40"
// // // // //   >
// // // // //     Next <ChevronRight size={16} />
// // // // //   </button>

// // // // // </div>
// // // // //         </div>

// // // // //         {/* AI Insights Panel */}
// // // // //         <div className="col-span-12 lg:col-span-4 space-y-6">
// // // // //           <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm relative overflow-hidden border border-indigo-50/50">
// // // // //             <div className="absolute top-0 left-0 w-1 h-full bg-tertiary" />
// // // // //             <div className="flex items-center justify-between mb-4">
// // // // //               <div className="flex items-center gap-2 text-tertiary">
// // // // //                 <Sparkles size={20} />
// // // // //                 <h4 className="font-bold text-sm">AI Insights</h4>
// // // // //               </div>
// // // // //               {selectedAnalysis && !selectedAnalysis.isLoading && (
// // // // //                 <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${selectedAnalysis.riskScore >= 70 ? 'bg-tertiary/10 text-tertiary' : selectedAnalysis.riskScore >= 40 ? 'bg-amber-50 text-amber-700' : 'bg-secondary-container/20 text-secondary'}`}>
// // // // //                   {getRiskLabel(selectedAnalysis.riskLevel)}
// // // // //                 </span>
// // // // //               )}
// // // // //             </div>

// // // // //             {!selectedEvent ? (
// // // // //               <p className="text-xs text-on-surface-variant">Select an event to see AI analysis</p>
// // // // //             ) : selectedAnalysis?.isLoading || analyzingId === selectedEvent.id ? (
// // // // //               <div className="space-y-4">
// // // // //                 <div className="flex items-center gap-2 text-primary"><Loader2 size={16} className="animate-spin" /><span className="text-xs font-bold">AI analyzing…</span></div>
// // // // //                 <AILoadingSkeleton />
// // // // //               </div>
// // // // //             ) : selectedAnalysis ? (
// // // // //               <>
// // // // //                 <div className="mb-4">
// // // // //                   <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Analyzing</p>
// // // // //                   <p className="text-sm font-semibold text-on-surface">"{selectedEvent.title}"</p>
// // // // //                   <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{selectedAnalysis.summary}</p>
// // // // //                 </div>
// // // // //                 <div className="space-y-3 mb-4">
// // // // //                   {[
// // // // //                     { label: 'Semantic Integrity', value: selectedAnalysis.semanticIntegrity },
// // // // //                     { label: 'Host Legitimacy', value: selectedAnalysis.hostLegitimacy },
// // // // //                     { label: 'Engagement Pattern', value: selectedAnalysis.engagementPattern },
// // // // //                   ].map(m => (
// // // // //                     <div key={m.label}>
// // // // //                       <div className="flex justify-between text-[11px] mb-1">
// // // // //                         <span className="text-on-surface-variant">{m.label}</span>
// // // // //                         <span className={`font-bold ${getRiskColor(100 - m.value)}`}>{m.value}/100</span>
// // // // //                       </div>
// // // // //                       <div className="w-full bg-indigo-50 h-1.5 rounded-full overflow-hidden">
// // // // //                         <div className={`h-full transition-all duration-700 ${getRiskBarColor(100 - m.value)}`} style={{ width: `${m.value}%` }} />
// // // // //                       </div>
// // // // //                     </div>
// // // // //                   ))}
// // // // //                 </div>
// // // // //                 {(selectedAnalysis.flags?.length ?? 0) > 0 && (
// // // // //                   <div className="space-y-2 mb-4">
// // // // //                     {selectedAnalysis.flags.map((flag, i) => (
// // // // //                       <div key={i} className={`p-3 rounded-lg flex items-start gap-2 ${flag.severity === 'high' ? 'bg-tertiary/5 border-l-2 border-tertiary' : 'bg-amber-50/50 border-l-2 border-amber-400'}`}>
// // // // //                         <AlertCircle size={14} className={flag.severity === 'high' ? 'text-tertiary mt-0.5' : 'text-amber-600 mt-0.5'} />
// // // // //                         <div>
// // // // //                           <p className="text-xs font-bold text-on-surface">{flag.type}</p>
// // // // //                           <p className="text-[11px] text-on-surface-variant">{flag.description}</p>
// // // // //                         </div>
// // // // //                       </div>
// // // // //                     ))}
// // // // //                   </div>
// // // // //                 )}
// // // // //                 <div className="bg-surface-container-low p-4 rounded-2xl mb-4">
// // // // //                   <p className="text-[10px] font-bold text-primary uppercase mb-1">Recommendation</p>
// // // // //                   <p className="text-xs italic text-on-surface-variant">"{selectedAnalysis.recommendation}"</p>
// // // // //                 </div>
// // // // //                 <Link to={`/moderation/${selectedEvent.id}`} className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-all text-center block">
// // // // //                   Review Full Report
// // // // //                 </Link>
// // // // //               </>
// // // // //             ) : (
// // // // //               <div className="text-center py-4">
// // // // //                 <p className="text-xs text-on-surface-variant mb-3">Click an event to analyze</p>
// // // // //                 <button onClick={() => selectedEvent && analyzeEvent(selectedEvent)} className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 flex items-center gap-2 mx-auto">
// // // // //                   <Sparkles size={14} /> Analyze with AI
// // // // //                 </button>
// // // // //               </div>
// // // // //             )}
// // // // //           </div>

// // // // //           {selectedEvent && (
// // // // //             <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-indigo-50/50">
// // // // //               <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Event Context</h4>
// // // // //               <div className="space-y-3">
// // // // //                 {[
// // // // //                   { label: 'Category', val: selectedEvent.category },
// // // // //                   { label: 'Price', val: selectedEvent.ticketPrice },
// // // // //                   { label: 'Capacity', val: String(selectedEvent.capacity) },
// // // // //                   { label: 'Date', val: selectedEvent.eventDate },
// // // // //                   { label: 'Location', val: selectedEvent.location },
// // // // //                 ].map(r => (
// // // // //                   <div key={r.label} className="flex justify-between text-sm">
// // // // //                     <span className="text-on-surface-variant">{r.label}</span>
// // // // //                     <span className="font-semibold text-right max-w-[60%] truncate">{r.val}</span>
// // // // //                   </div>
// // // // //                 ))}
// // // // //               </div>
// // // // //               <div className="mt-4 pt-4 border-t border-indigo-50 flex gap-2">
// // // // //                 <button onClick={() => handleAction(selectedEvent.id, 'approve')}
// // // // //                   className="flex-1 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1">
// // // // //                   <CheckCircle2 size={14} /> Approve
// // // // //                 </button>
// // // // //                 <button onClick={() => handleAction(selectedEvent.id, 'reject')}
// // // // //                   className="flex-1 py-2 bg-tertiary/10 text-tertiary rounded-xl text-xs font-bold hover:bg-tertiary/20 flex items-center justify-center gap-1">
// // // // //                   <X size={14} /> Reject
// // // // //                 </button>
// // // // //               </div>
// // // // //             </div>
// // // // //           )}
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default ModerationQueue;
// // // // // frontend/src/pages/ModerationQueue.tsx
// // // // // ✅ NEW: Date filters (event start date + creation date)
// // // // // ✅ NEW: Co-Pilot Mode — AI automatically analyzes + approves/rejects

// // // // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // // // import {
// // // //   Filter, CheckCircle2, Eye, X, ChevronLeft, ChevronRight,
// // // //   Sparkles, AlertCircle, Loader2, RefreshCw, Zap, Database,
// // // //   Bot, ToggleLeft, ToggleRight, Calendar, Clock, Info,
// // // // } from 'lucide-react';
// // // // import { Link } from 'react-router-dom';
// // // // import { analyzeEventWithOpenAI, getRiskColor, getRiskBarColor, getRiskLabel } from '../lib/openai';
// // // // import { getEventsFromAPI, updateEventStatusAPI, getEvents, updateEventStatus } from '../lib/mockEvents';
// // // // import type { Event, AIAnalysis } from '../types';

// // // // // ─── Sub-components ───────────────────────────────────────────────────────────

// // // // const AILoadingSkeleton = () => (
// // // //   <div className="animate-pulse space-y-3">
// // // //     <div className="h-3 bg-indigo-100 rounded w-3/4" />
// // // //     <div className="h-3 bg-indigo-100 rounded w-1/2" />
// // // //     <div className="h-8 bg-indigo-100 rounded w-full" />
// // // //   </div>
// // // // );

// // // // const RiskBadge = ({ analysis }: { analysis?: AIAnalysis }) => {
// // // //   if (!analysis) return <span className="text-[10px] text-on-surface-variant">Not analyzed</span>;
// // // //   if (analysis.isLoading) return <Loader2 size={14} className="animate-spin text-primary" />;
// // // //   return (
// // // //     <div className="flex flex-col gap-1">
// // // //       <span className={`text-[11px] font-bold ${getRiskColor(analysis.riskScore ?? 0)}`}>
// // // //         {analysis.riskScore ?? '—'}%
// // // //       </span>
// // // //       <div className="w-full bg-indigo-100 h-1.5 rounded-full overflow-hidden">
// // // //         <div
// // // //           className={`h-full transition-all duration-700 ${getRiskBarColor(analysis.riskScore ?? 0)}`}
// // // //           style={{ width: `${analysis.riskScore ?? 0}%` }}
// // // //         />
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // // ─── Date helpers ─────────────────────────────────────────────────────────────
// // // // function toISO(date: Date) {
// // // //   return date.toISOString().slice(0, 10); // "2025-01-15"
// // // // }

// // // // function isInRange(dateStr: string, from: string, to: string): boolean {
// // // //   if (!dateStr) return true;
// // // //   const d = new Date(dateStr).getTime();
// // // //   if (isNaN(d)) return true;
// // // //   if (from && d < new Date(from).getTime()) return false;
// // // //   if (to && d > new Date(to + 'T23:59:59').getTime()) return false;
// // // //   return true;
// // // // }

// // // // // ─── Main Component ───────────────────────────────────────────────────────────
// // // // const ModerationQueue = () => {
// // // //   // ── Data state ──
// // // //   const [events, setEvents] = useState<Event[]>([]);
// // // //   const [analyses, setAnalyses] = useState<Record<string, AIAnalysis>>({});
// // // //   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
// // // //   const [isLoading, setIsLoading] = useState(true);
// // // //   const [dataSource, setDataSource] = useState<'api' | 'local'>('api');

// // // //   // ── Filter state ──
// // // //   const [filterStatus, setFilterStatus] = useState('all');
// // // //   const [startDateFrom, setStartDateFrom] = useState('');   // event ka start date from
// // // //   const [startDateTo, setStartDateTo] = useState('');       // event ka start date to
// // // //   const [createdFrom, setCreatedFrom] = useState('');       // event create hone ki date from
// // // //   const [createdTo, setCreatedTo] = useState('');           // event create hone ki date to
// // // //   const [showDateFilters, setShowDateFilters] = useState(false);

// // // //   // ── AI state ──
// // // //   const [analyzingId, setAnalyzingId] = useState<string | null>(null);
// // // //   const [isAnalyzingAll, setIsAnalyzingAll] = useState(false);

// // // //   // ── Co-Pilot state ──
// // // //   const [copilotMode, setCopilotMode] = useState(false);
// // // //   const [copilotRunning, setCopilotRunning] = useState(false);
// // // //   const [copilotLog, setCopilotLog] = useState<string[]>([]);
// // // //   // thresholds: AI score >= autoApproveThreshold → approve, >= autoRejectThreshold → reject
// // // //   const [autoApproveThreshold, setAutoApproveThreshold] = useState(30);  // risk <= 30 → approve
// // // //   const [autoRejectThreshold, setAutoRejectThreshold] = useState(70);    // risk >= 70 → reject
// // // //   const copilotRef = useRef(false); // stop flag

// // // //   // ── UI state ──
// // // //   const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

// // // //   const showNotification = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
// // // //     setNotification({ msg, type });
// // // //     setTimeout(() => setNotification(null), 4000);
// // // //   };

// // // //   // ─── Load events ─────────────────────────────────────────────────────────
// // // //   const loadEvents = async () => {
// // // //     setIsLoading(true);
// // // //     try {
// // // //       const apiEvents = await getEventsFromAPI();
// // // //       if (apiEvents.length > 0) {
// // // //         setEvents(apiEvents);
// // // //         setSelectedEvent(apiEvents[0]);
// // // //         setDataSource('api');
// // // //       } else {
// // // //         const local = getEvents();
// // // //         setEvents(local);
// // // //         if (local.length > 0) setSelectedEvent(local[0]);
// // // //         setDataSource('local');
// // // //       }
// // // //     } catch {
// // // //       const local = getEvents();
// // // //       setEvents(local);
// // // //       if (local.length > 0) setSelectedEvent(local[0]);
// // // //       setDataSource('local');
// // // //     } finally {
// // // //       setIsLoading(false);
// // // //     }
// // // //   };

// // // //   useEffect(() => { loadEvents(); }, []);

// // // //   const refreshEvents = async () => {
// // // //     await loadEvents();
// // // //     showNotification('Queue refreshed!', 'info');
// // // //   };

// // // //   // ─── Analyze single event ─────────────────────────────────────────────────
// // // //   const analyzeEvent = useCallback(async (event: Event): Promise<AIAnalysis | null> => {
// // // //     setAnalyzingId(event.id);
// // // //     setAnalyses(prev => ({ ...prev, [event.id]: { ...(prev[event.id] || {}), isLoading: true } as AIAnalysis }));
// // // //     try {
// // // //       const result = await analyzeEventWithOpenAI(event);
// // // //       const safe: AIAnalysis = {
// // // //         ...result,
// // // //         flags: result.flags ?? [],
// // // //         riskScore: result.riskScore ?? 0,
// // // //         riskLevel: result.riskLevel ?? 'low',
// // // //         semanticIntegrity: result.semanticIntegrity ?? 80,
// // // //         hostLegitimacy: result.hostLegitimacy ?? 80,
// // // //         engagementPattern: result.engagementPattern ?? 80,
// // // //         summary: result.summary ?? 'No summary available',
// // // //         recommendation: result.recommendation ?? '',
// // // //         scannedAt: result.scannedAt ?? new Date().toISOString(),
// // // //         isLoading: false,
// // // //       };
// // // //       setAnalyses(prev => ({ ...prev, [event.id]: safe }));
// // // //       return safe;
// // // //     } catch {
// // // //       return null;
// // // //     } finally {
// // // //       setAnalyzingId(null);
// // // //     }
// // // //   }, []);

// // // //   // ─── Approve / Reject action ──────────────────────────────────────────────
// // // //   const handleAction = async (eventId: string, action: 'approve' | 'reject', silent = false) => {
// // // //     const newStatus = action === 'approve' ? 'approved' : 'rejected';
// // // //     setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: newStatus } : e));

// // // //     if (dataSource === 'api') {
// // // //       const ok = await updateEventStatusAPI(eventId, newStatus);
// // // //       if (!ok && !silent) {
// // // //         showNotification('Failed to update in MongoDB', 'error');
// // // //         setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'pending' } : e));
// // // //         return;
// // // //       }
// // // //     } else {
// // // //       updateEventStatus(eventId, newStatus);
// // // //     }

// // // //     if (!silent) {
// // // //       showNotification(
// // // //         action === 'approve' ? '✓ Approved & listed on MyApp!' : '✗ Event rejected',
// // // //         action === 'approve' ? 'success' : 'error',
// // // //       );
// // // //     }

// // // //     if (selectedEvent?.id === eventId) {
// // // //       const next = events.find(e => e.id !== eventId && e.status === 'pending');
// // // //       if (next) setSelectedEvent(next);
// // // //     }
// // // //   };

// // // //   // ─── Co-Pilot Mode ────────────────────────────────────────────────────────
// // // //   // How it works:
// // // //   // 1. Saare pending events ko ek-ek karke AI se analyze karta hai
// // // //   // 2. riskScore <= autoApproveThreshold → auto-approve (LOW risk = safe)
// // // //   // 3. riskScore >= autoRejectThreshold  → auto-reject  (HIGH risk = dangerous)
// // // //   // 4. In between → "Needs Review" — human moderator decide kare
// // // //   const runCopilot = async () => {
// // // //     const pending = events.filter(e => e.status === 'pending' || e.status === 'flagged');
// // // //     if (pending.length === 0) {
// // // //       showNotification('No pending events to process', 'info');
// // // //       return;
// // // //     }

// // // //     setCopilotRunning(true);
// // // //     copilotRef.current = false; // reset stop flag
// // // //     setCopilotLog([`🤖 Co-Pilot started — processing ${pending.length} events...`]);
// // // //     setCopilotLog(prev => [...prev, `📊 Settings: Auto-approve if risk ≤ ${autoApproveThreshold}%, Auto-reject if risk ≥ ${autoRejectThreshold}%`]);

// // // //     let approved = 0, rejected = 0, skipped = 0;

// // // //     for (const event of pending) {
// // // //       if (copilotRef.current) {
// // // //         setCopilotLog(prev => [...prev, '⏹ Co-Pilot stopped by user.']);
// // // //         break;
// // // //       }

// // // //       setCopilotLog(prev => [...prev, `🔍 Analyzing: "${event.title}"...`]);

// // // //       const analysis = await analyzeEvent(event);

// // // //       if (!analysis) {
// // // //         setCopilotLog(prev => [...prev, `  ⚠️ Analysis failed — skipping`]);
// // // //         skipped++;
// // // //         continue;
// // // //       }

// // // //       const score = analysis.riskScore ?? 50;

// // // //       if (score <= autoApproveThreshold) {
// // // //         // LOW RISK → Auto Approve
// // // //         await handleAction(event.id, 'approve', true);
// // // //         setCopilotLog(prev => [...prev,
// // // //           `  ✅ AUTO-APPROVED — Risk: ${score}% (≤${autoApproveThreshold}%) — "${event.title}"`
// // // //         ]);
// // // //         approved++;
// // // //       } else if (score >= autoRejectThreshold) {
// // // //         // HIGH RISK → Auto Reject
// // // //         await handleAction(event.id, 'reject', true);
// // // //         setCopilotLog(prev => [...prev,
// // // //           `  ❌ AUTO-REJECTED — Risk: ${score}% (≥${autoRejectThreshold}%) — "${event.title}"`
// // // //         ]);
// // // //         rejected++;
// // // //       } else {
// // // //         // MEDIUM RISK → Human review needed
// // // //         setCopilotLog(prev => [...prev,
// // // //           `  🟡 NEEDS REVIEW — Risk: ${score}% (${autoApproveThreshold}–${autoRejectThreshold}%) — "${event.title}"`
// // // //         ]);
// // // //         skipped++;
// // // //       }

// // // //       // Small delay to avoid rate limits
// // // //       await new Promise(r => setTimeout(r, 500));
// // // //     }

// // // //     setCopilotLog(prev => [...prev,
// // // //       ``,
// // // //       `📋 Co-Pilot Complete!`,
// // // //       `  ✅ Auto-approved: ${approved}`,
// // // //       `  ❌ Auto-rejected: ${rejected}`,
// // // //       `  🟡 Needs human review: ${skipped}`,
// // // //     ]);
// // // //     setCopilotRunning(false);
// // // //     await loadEvents(); // refresh
// // // //   };

// // // //   const stopCopilot = () => {
// // // //     copilotRef.current = true;
// // // //     setCopilotRunning(false);
// // // //   };

// // // //   // ─── Filtered events (apply all filters) ─────────────────────────────────
// // // //   // Filter logic:
// // // //   // 1. Status filter
// // // //   // 2. Event start date range (event.eventDate)
// // // //   // 3. Event creation date range (event.dateSubmitted)
// // // //   const filtered = events.filter(e => {
// // // //     if (filterStatus !== 'all' && e.status !== filterStatus) return false;

// // // //     // Start date filter — event kab hoga
// // // //     if (startDateFrom || startDateTo) {
// // // //       const startOk = isInRange(e.eventDate || '', startDateFrom, startDateTo);
// // // //       if (!startOk) return false;
// // // //     }

// // // //     // Creation date filter — event kab submit hua
// // // //     if (createdFrom || createdTo) {
// // // //       const createOk = isInRange(
// // // //         typeof e.dateSubmitted === 'string' ? e.dateSubmitted : String(e.dateSubmitted || ''),
// // // //         createdFrom,
// // // //         createdTo,
// // // //       );
// // // //       if (!createOk) return false;
// // // //     }

// // // //     return true;
// // // //   });

// // // //   const clearDateFilters = () => {
// // // //     setStartDateFrom(''); setStartDateTo('');
// // // //     setCreatedFrom(''); setCreatedTo('');
// // // //   };

// // // //   const hasActiveDateFilter = startDateFrom || startDateTo || createdFrom || createdTo;

// // // //   const pendingCount = events.filter(e => e.status === 'pending').length;
// // // //   const flaggedCount = events.filter(e => e.status === 'flagged').length;
// // // //   const selectedAnalysis = selectedEvent ? analyses[selectedEvent.id] : null;

// // // //   const getStatusStyle = (status: string) => ({
// // // //     flagged:      'text-tertiary bg-tertiary-container/10',
// // // //     pending:      'text-on-surface-variant bg-surface-container-highest',
// // // //     under_review: 'text-amber-700 bg-amber-100',
// // // //     approved:     'text-on-secondary-container bg-secondary-container',
// // // //     rejected:     'text-tertiary bg-tertiary/10',
// // // //   }[status] || 'text-on-surface-variant bg-surface-container-highest');

// // // //   const getStatusLabel = (s: string) =>
// // // //     ({ pending: 'PENDING', flagged: 'FLAGGED', under_review: 'UNDER REVIEW', approved: 'APPROVED', rejected: 'REJECTED' }[s] || s.toUpperCase());

// // // //   // ─── RENDER ───────────────────────────────────────────────────────────────
// // // //   return (
// // // //     <div className="space-y-6">

// // // //       {/* Toast */}
// // // //       {notification && (
// // // //         <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg font-bold text-sm text-white transition-all
// // // //           ${notification.type === 'success' ? 'bg-secondary' : notification.type === 'error' ? 'bg-tertiary' : 'bg-primary'}`}>
// // // //           {notification.msg}
// // // //         </div>
// // // //       )}

// // // //       {/* ── Header ── */}
// // // //       <div className="flex justify-between items-end flex-wrap gap-4">
// // // //         <div>
// // // //           <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 flex items-center gap-1.5">
// // // //             <Database size={10} />
// // // //             {dataSource === 'api' ? 'Live from MyApp MongoDB' : 'LocalStorage (API offline)'}
// // // //           </span>
// // // //           <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">Moderation Queue</h3>
// // // //           <p className="text-on-surface-variant text-sm mt-1">Events awaiting AI review &amp; approval.</p>
// // // //         </div>

// // // //         <div className="flex gap-3 items-center flex-wrap">
// // // //           {/* Stats */}
// // // //           <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
// // // //             <p className="text-[10px] text-on-surface-variant font-bold uppercase">Pending</p>
// // // //             <p className="text-xl font-extrabold text-primary">{pendingCount}</p>
// // // //           </div>
// // // //           <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
// // // //             <p className="text-[10px] text-on-surface-variant font-bold uppercase">Flagged</p>
// // // //             <p className="text-xl font-extrabold text-tertiary">{flaggedCount}</p>
// // // //           </div>

// // // //           {/* Co-Pilot Toggle */}
// // // //           <button
// // // //             onClick={() => setCopilotMode(p => !p)}
// // // //             className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all
// // // //               ${copilotMode
// // // //                 ? 'bg-indigo-900 border-indigo-700 text-white shadow-lg shadow-indigo-900/30'
// // // //                 : 'bg-white border-indigo-200 text-indigo-700 hover:border-indigo-400'}`}
// // // //           >
// // // //             <Bot size={16} />
// // // //             Co-Pilot {copilotMode ? 'ON' : 'OFF'}
// // // //             {copilotMode
// // // //               ? <ToggleRight size={18} className="text-indigo-300" />
// // // //               : <ToggleLeft size={18} className="text-indigo-400" />}
// // // //           </button>

// // // //           {/* Refresh */}
// // // //           <button
// // // //             onClick={refreshEvents}
// // // //             disabled={isLoading}
// // // //             className="bg-white border border-primary text-primary px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/5 transition-all disabled:opacity-50"
// // // //           >
// // // //             <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
// // // //             {isLoading ? 'Loading...' : 'Refresh'}
// // // //           </button>
// // // //         </div>
// // // //       </div>

// // // //       {/* ── Co-Pilot Panel ── */}
// // // //       {/* 
// // // //         Co-Pilot Mode kaise kaam karta hai:
// // // //         - Ye ek "auto-moderator" hai
// // // //         - Har pending event ko AI se analyze karta hai
// // // //         - Score <= approveThreshold (default 30%) → automatically approve — matlab event safe hai
// // // //         - Score >= rejectThreshold (default 70%)  → automatically reject  — matlab event risky/fraud hai  
// // // //         - Middle mein → human moderator ko dikhata hai
// // // //         - Tum thresholds change kar sakte ho — zyada strict karna hai toh approveThreshold kam karo
// // // //       */}
// // // //       {copilotMode && (
// // // //         <div className="bg-indigo-950 rounded-3xl p-6 border border-indigo-800 shadow-xl">
// // // //           <div className="flex items-start justify-between mb-5 flex-wrap gap-4">
// // // //             <div className="flex items-center gap-3">
// // // //               <div className="w-10 h-10 bg-indigo-700 rounded-2xl flex items-center justify-center">
// // // //                 <Bot size={20} className="text-white" />
// // // //               </div>
// // // //               <div>
// // // //                 <h4 className="text-white font-bold text-base">AI Co-Pilot Mode</h4>
// // // //                 <p className="text-indigo-300 text-xs">
// // // //                   AI analyzes every pending event and auto-approves/rejects based on risk score
// // // //                 </p>
// // // //               </div>
// // // //             </div>

// // // //             {/* Tooltip / Info */}
// // // //             <div className="bg-indigo-900/60 border border-indigo-700/50 rounded-xl px-4 py-3 max-w-sm">
// // // //               <p className="text-indigo-200 text-[11px] leading-relaxed flex items-start gap-2">
// // // //                 <Info size={12} className="flex-shrink-0 mt-0.5 text-indigo-400" />
// // // //                 Co-Pilot reviews all pending events automatically. You can adjust thresholds below — lower approve threshold = stricter moderation.
// // // //               </p>
// // // //             </div>
// // // //           </div>

// // // //           {/* Threshold sliders */}
// // // //           <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
// // // //             {/* Auto-Approve threshold */}
// // // //             <div className="bg-indigo-900/50 rounded-2xl p-4 border border-indigo-800/50">
// // // //               <div className="flex justify-between items-center mb-2">
// // // //                 <label className="text-[11px] font-bold text-green-400 uppercase tracking-wider flex items-center gap-1.5">
// // // //                   <CheckCircle2 size={12} /> Auto-Approve if Risk ≤
// // // //                 </label>
// // // //                 <span className="text-green-400 font-extrabold text-sm">{autoApproveThreshold}%</span>
// // // //               </div>
// // // //               <input
// // // //                 type="range" min={0} max={60} step={5}
// // // //                 value={autoApproveThreshold}
// // // //                 onChange={e => setAutoApproveThreshold(Number(e.target.value))}
// // // //                 className="w-full accent-green-500"
// // // //               />
// // // //               <p className="text-indigo-400 text-[10px] mt-1.5">
// // // //                 Events with risk score ≤ {autoApproveThreshold}% will be auto-approved → listed on MyApp
// // // //               </p>
// // // //             </div>

// // // //             {/* Auto-Reject threshold */}
// // // //             <div className="bg-indigo-900/50 rounded-2xl p-4 border border-indigo-800/50">
// // // //               <div className="flex justify-between items-center mb-2">
// // // //                 <label className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
// // // //                   <X size={12} /> Auto-Reject if Risk ≥
// // // //                 </label>
// // // //                 <span className="text-red-400 font-extrabold text-sm">{autoRejectThreshold}%</span>
// // // //               </div>
// // // //               <input
// // // //                 type="range" min={40} max={100} step={5}
// // // //                 value={autoRejectThreshold}
// // // //                 onChange={e => setAutoRejectThreshold(Number(e.target.value))}
// // // //                 className="w-full accent-red-500"
// // // //               />
// // // //               <p className="text-indigo-400 text-[10px] mt-1.5">
// // // //                 Events with risk score ≥ {autoRejectThreshold}% will be auto-rejected → removed from MyApp
// // // //               </p>
// // // //             </div>
// // // //           </div>

// // // //           {/* Risk band visualization */}
// // // //           <div className="mb-5">
// // // //             <p className="text-indigo-400 text-[10px] font-bold uppercase mb-2">Risk Band Preview</p>
// // // //             <div className="relative h-6 rounded-full overflow-hidden flex">
// // // //               <div className="bg-green-500/80 flex items-center justify-center text-[9px] font-bold text-white"
// // // //                 style={{ width: `${autoApproveThreshold}%` }}>
// // // //                 {autoApproveThreshold > 10 ? 'AUTO-APPROVE' : ''}
// // // //               </div>
// // // //               <div className="bg-amber-500/80 flex items-center justify-center text-[9px] font-bold text-white"
// // // //                 style={{ width: `${autoRejectThreshold - autoApproveThreshold}%` }}>
// // // //                 {autoRejectThreshold - autoApproveThreshold > 15 ? 'HUMAN REVIEW' : ''}
// // // //               </div>
// // // //               <div className="bg-red-500/80 flex-1 flex items-center justify-center text-[9px] font-bold text-white">
// // // //                 {100 - autoRejectThreshold > 5 ? 'AUTO-REJECT' : ''}
// // // //               </div>
// // // //             </div>
// // // //             <div className="flex justify-between text-[9px] text-indigo-400 mt-1 px-1">
// // // //               <span>0%</span>
// // // //               <span>{autoApproveThreshold}%</span>
// // // //               <span>{autoRejectThreshold}%</span>
// // // //               <span>100%</span>
// // // //             </div>
// // // //           </div>

// // // //           {/* Run button */}
// // // //           <div className="flex gap-3 flex-wrap">
// // // //             {!copilotRunning ? (
// // // //               <button
// // // //                 onClick={runCopilot}
// // // //                 disabled={pendingCount === 0}
// // // //                 className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-40"
// // // //               >
// // // //                 <Bot size={16} />
// // // //                 Run Co-Pilot on {pendingCount} Pending Events
// // // //               </button>
// // // //             ) : (
// // // //               <button
// // // //                 onClick={stopCopilot}
// // // //                 className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all"
// // // //               >
// // // //                 <X size={16} />
// // // //                 Stop Co-Pilot
// // // //               </button>
// // // //             )}
// // // //           </div>

// // // //           {/* Co-Pilot log */}
// // // //           {copilotLog.length > 0 && (
// // // //             <div className="mt-4 bg-black/40 rounded-2xl p-4 max-h-48 overflow-y-auto font-mono">
// // // //               {copilotLog.map((line, i) => (
// // // //                 <div key={i} className={`text-[11px] leading-relaxed
// // // //                   ${line.includes('AUTO-APPROVED') ? 'text-green-400' :
// // // //                     line.includes('AUTO-REJECTED') ? 'text-red-400' :
// // // //                     line.includes('NEEDS REVIEW') ? 'text-amber-400' :
// // // //                     line.includes('Complete') ? 'text-white font-bold' :
// // // //                     'text-indigo-300'}`}>
// // // //                   {line || '\u00A0'}
// // // //                 </div>
// // // //               ))}
// // // //               {copilotRunning && (
// // // //                 <div className="flex items-center gap-2 text-indigo-300 text-[11px] mt-1">
// // // //                   <Loader2 size={10} className="animate-spin" /> Processing…
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       )}

// // // //       {/* ── Filters ── */}
// // // //       <div className="bg-surface-container-low p-4 rounded-2xl space-y-3">
// // // //         {/* Row 1: Status + Category + Date toggle */}
// // // //         <div className="flex flex-wrap items-end gap-4">
// // // //           <div className="flex-1 min-w-[140px]">
// // // //             <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">Status</label>
// // // //             <select
// // // //               className="w-full bg-surface-container-highest border-none rounded-xl text-sm p-2"
// // // //               value={filterStatus}
// // // //               onChange={e => setFilterStatus(e.target.value)}
// // // //             >
// // // //               <option value="all">All Status</option>
// // // //               <option value="pending">Pending</option>
// // // //               <option value="flagged">Flagged</option>
// // // //               <option value="approved">Approved</option>
// // // //               <option value="rejected">Rejected</option>
// // // //             </select>
// // // //           </div>

// // // //           <div className="flex-1 min-w-[140px]">
// // // //             <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">Category</label>
// // // //             <select className="w-full bg-surface-container-highest border-none rounded-xl text-sm p-2">
// // // //               <option>All Categories</option>
// // // //               <option>Music &amp; Nightlife</option>
// // // //               <option>Technology</option>
// // // //               <option>Health &amp; Wellness</option>
// // // //               <option>Business &amp; Networking</option>
// // // //             </select>
// // // //           </div>

// // // //           {/* Date filter toggle button */}
// // // //           <button
// // // //             onClick={() => setShowDateFilters(p => !p)}
// // // //             className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border
// // // //               ${showDateFilters || hasActiveDateFilter
// // // //                 ? 'bg-primary text-white border-primary'
// // // //                 : 'bg-surface-container-highest text-primary border-primary/20 hover:border-primary/50'}`}
// // // //           >
// // // //             <Calendar size={14} />
// // // //             Date Filters
// // // //             {hasActiveDateFilter && (
// // // //               <span className="bg-white/20 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">ON</span>
// // // //             )}
// // // //           </button>

// // // //           {hasActiveDateFilter && (
// // // //             <button onClick={clearDateFilters} className="text-xs text-tertiary font-bold hover:underline flex items-center gap-1">
// // // //               <X size={12} /> Clear dates
// // // //             </button>
// // // //           )}
// // // //         </div>

// // // //         {/* Row 2: Date pickers (show/hide) */}
// // // //         {/*
// // // //           Date filter explanation:
// // // //           - "Event Start Date" — event kab hoga ya tha (eventDate field)
// // // //             → e.g. sirf upcoming events dekhne hain: From = aaj ki date
// // // //           - "Event Created Date" — organizer ne event kab submit kiya (dateSubmitted / createdAt field)
// // // //             → e.g. sirf is hafte submit hue events dekhne hain
// // // //         */}
// // // //         {showDateFilters && (
// // // //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-indigo-100/30">

// // // //             {/* Event Start Date range */}
// // // //             <div className="bg-surface-container-lowest rounded-2xl p-4 border border-indigo-50/50">
// // // //               <p className="text-[10px] font-bold text-primary uppercase mb-3 flex items-center gap-1.5">
// // // //                 <Calendar size={10} /> Event Start Date
// // // //                 <span className="text-on-surface-variant font-normal normal-case">— when the event happens</span>
// // // //               </p>
// // // //               <div className="grid grid-cols-2 gap-2">
// // // //                 <div>
// // // //                   <label className="text-[10px] text-on-surface-variant font-bold uppercase mb-1 block">From</label>
// // // //                   <input
// // // //                     type="date"
// // // //                     value={startDateFrom}
// // // //                     onChange={e => setStartDateFrom(e.target.value)}
// // // //                     className="w-full bg-surface-container-high border-none rounded-xl text-xs p-2 focus:ring-2 ring-primary/20"
// // // //                   />
// // // //                 </div>
// // // //                 <div>
// // // //                   <label className="text-[10px] text-on-surface-variant font-bold uppercase mb-1 block">To</label>
// // // //                   <input
// // // //                     type="date"
// // // //                     value={startDateTo}
// // // //                     onChange={e => setStartDateTo(e.target.value)}
// // // //                     className="w-full bg-surface-container-high border-none rounded-xl text-xs p-2 focus:ring-2 ring-primary/20"
// // // //                   />
// // // //                 </div>
// // // //               </div>
// // // //               {/* Quick presets */}
// // // //               <div className="flex gap-2 mt-2 flex-wrap">
// // // //                 {[
// // // //                   { label: 'Today', from: toISO(new Date()), to: toISO(new Date()) },
// // // //                   { label: 'This Week', from: toISO(new Date()), to: toISO(new Date(Date.now() + 7 * 86400000)) },
// // // //                   { label: 'This Month', from: toISO(new Date(new Date().getFullYear(), new Date().getMonth(), 1)), to: toISO(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)) },
// // // //                 ].map(p => (
// // // //                   <button key={p.label}
// // // //                     onClick={() => { setStartDateFrom(p.from); setStartDateTo(p.to); }}
// // // //                     className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors">
// // // //                     {p.label}
// // // //                   </button>
// // // //                 ))}
// // // //               </div>
// // // //             </div>

// // // //             {/* Event Creation Date range */}
// // // //             <div className="bg-surface-container-lowest rounded-2xl p-4 border border-indigo-50/50">
// // // //               <p className="text-[10px] font-bold text-secondary uppercase mb-3 flex items-center gap-1.5">
// // // //                 <Clock size={10} /> Event Submitted Date
// // // //                 <span className="text-on-surface-variant font-normal normal-case">— when organizer submitted</span>
// // // //               </p>
// // // //               <div className="grid grid-cols-2 gap-2">
// // // //                 <div>
// // // //                   <label className="text-[10px] text-on-surface-variant font-bold uppercase mb-1 block">From</label>
// // // //                   <input
// // // //                     type="date"
// // // //                     value={createdFrom}
// // // //                     onChange={e => setCreatedFrom(e.target.value)}
// // // //                     className="w-full bg-surface-container-high border-none rounded-xl text-xs p-2 focus:ring-2 ring-primary/20"
// // // //                   />
// // // //                 </div>
// // // //                 <div>
// // // //                   <label className="text-[10px] text-on-surface-variant font-bold uppercase mb-1 block">To</label>
// // // //                   <input
// // // //                     type="date"
// // // //                     value={createdTo}
// // // //                     onChange={e => setCreatedTo(e.target.value)}
// // // //                     className="w-full bg-surface-container-high border-none rounded-xl text-xs p-2 focus:ring-2 ring-primary/20"
// // // //                   />
// // // //                 </div>
// // // //               </div>
// // // //               {/* Quick presets */}
// // // //               <div className="flex gap-2 mt-2 flex-wrap">
// // // //                 {[
// // // //                   { label: 'Today', from: toISO(new Date()), to: toISO(new Date()) },
// // // //                   { label: 'Last 7 days', from: toISO(new Date(Date.now() - 7 * 86400000)), to: toISO(new Date()) },
// // // //                   { label: 'Last 30 days', from: toISO(new Date(Date.now() - 30 * 86400000)), to: toISO(new Date()) },
// // // //                 ].map(p => (
// // // //                   <button key={p.label}
// // // //                     onClick={() => { setCreatedFrom(p.from); setCreatedTo(p.to); }}
// // // //                     className="text-[10px] px-2.5 py-1 rounded-full bg-secondary/10 text-secondary font-bold hover:bg-secondary/20 transition-colors">
// // // //                     {p.label}
// // // //                   </button>
// // // //                 ))}
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {/* ── Main Grid ── */}
// // // //       <div className="grid grid-cols-12 gap-6 items-start">

// // // //         {/* Events Table */}
// // // //         <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-indigo-50/50">
// // // //           <div className="px-6 py-4 bg-indigo-50/30 flex justify-between items-center border-b border-indigo-50/50">
// // // //             <div className="flex items-center gap-3 flex-wrap">
// // // //               <span className="text-sm font-bold text-indigo-900">{filtered.length} events</span>
// // // //               {filtered.length !== events.length && (
// // // //                 <span className="text-[10px] text-on-surface-variant">({events.length} total, filtered)</span>
// // // //               )}
// // // //               <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold
// // // //                 ${dataSource === 'api' ? 'bg-secondary/10 text-secondary' : 'bg-amber-50 text-amber-700'}`}>
// // // //                 {dataSource === 'api' ? 'MONGODB LIVE' : 'LOCAL CACHE'}
// // // //               </span>
// // // //             </div>
// // // //             <button onClick={refreshEvents} disabled={isLoading}
// // // //               className="text-xs font-bold text-primary flex items-center gap-1 hover:underline disabled:opacity-50">
// // // //               <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} /> Refresh
// // // //             </button>
// // // //           </div>

// // // //           <div className="overflow-x-auto">
// // // //             <table className="w-full border-collapse">
// // // //               <thead>
// // // //                 <tr className="text-left border-b border-indigo-50">
// // // //                   <th className="pl-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Event &amp; Host</th>
// // // //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
// // // //                     <span className="flex items-center gap-1"><Calendar size={10} /> Dates</span>
// // // //                   </th>
// // // //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">AI Flags</th>
// // // //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider w-24">Risk</th>
// // // //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
// // // //                   <th className="pr-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody className="divide-y divide-indigo-50/30">
// // // //                 {isLoading ? (
// // // //                   <tr><td colSpan={6} className="py-16 text-center">
// // // //                     <div className="flex flex-col items-center gap-3">
// // // //                       <Loader2 size={32} className="animate-spin text-primary" />
// // // //                       <p className="text-sm text-on-surface-variant">Fetching from MyApp database…</p>
// // // //                     </div>
// // // //                   </td></tr>
// // // //                 ) : filtered.length === 0 ? (
// // // //                   <tr><td colSpan={6} className="py-16 text-center text-on-surface-variant text-sm">
// // // //                     {events.length === 0
// // // //                       ? <p>No events found. Make sure backend is running on port 5006.</p>
// // // //                       : <p>No events match the current filters. <button onClick={clearDateFilters} className="text-primary font-bold hover:underline">Clear date filters</button></p>
// // // //                     }
// // // //                   </td></tr>
// // // //                 ) : filtered.map(event => {
// // // //                   const analysis = analyses[event.id];
// // // //                   const isSelected = selectedEvent?.id === event.id;
// // // //                   return (
// // // //                     <tr key={event.id}
// // // //                       onClick={() => { setSelectedEvent(event); if (!analyses[event.id]) analyzeEvent(event); }}
// // // //                       className={`transition-colors cursor-pointer ${isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-surface-container-low/50'}`}
// // // //                     >
// // // //                       {/* Event + Host */}
// // // //                       <td className="pl-6 py-4">
// // // //                         <div className="flex items-center gap-3">
// // // //                           <img src={event.image} alt={event.title}
// // // //                             className="w-12 h-12 rounded-xl object-cover shadow-sm flex-shrink-0"
// // // //                             referrerPolicy="no-referrer"
// // // //                             onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/e8eaf6/4355b9?text=E'; }}
// // // //                           />
// // // //                           <div>
// // // //                             <p className="text-sm font-bold text-slate-900 leading-tight">{event.title}</p>
// // // //                             <div className="flex items-center gap-1 mt-0.5">
// // // //                               <p className="text-[11px] text-on-surface-variant">
// // // //                                 Host: <span className="font-semibold">{event.host}</span>
// // // //                               </p>
// // // //                               {event.hostVerified && (
// // // //                                 <span className="text-[9px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-bold">✓</span>
// // // //                               )}
// // // //                             </div>
// // // //                           </div>
// // // //                         </div>
// // // //                       </td>

// // // //                       {/* Dates column — NEW */}
// // // //                       <td className="px-4 py-4">
// // // //                         <div className="space-y-1">
// // // //                           {event.eventDate ? (
// // // //                             <div className="flex items-center gap-1">
// // // //                               <Calendar size={9} className="text-primary flex-shrink-0" />
// // // //                               <span className="text-[10px] font-bold text-on-surface">{event.eventDate}</span>
// // // //                             </div>
// // // //                           ) : (
// // // //                             <span className="text-[10px] text-on-surface-variant">No date</span>
// // // //                           )}
// // // //                           {event.dateSubmitted && (
// // // //                             <div className="flex items-center gap-1">
// // // //                               <Clock size={9} className="text-on-surface-variant flex-shrink-0" />
// // // //                               <span className="text-[10px] text-on-surface-variant">
// // // //                                 {new Date(event.dateSubmitted).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
// // // //                               </span>
// // // //                             </div>
// // // //                           )}
// // // //                         </div>
// // // //                       </td>

// // // //                       {/* AI Flags */}
// // // //                       <td className="px-4 py-4">
// // // //                         {analysis?.isLoading || analyzingId === event.id ? (
// // // //                           <Loader2 size={14} className="animate-spin text-primary" />
// // // //                         ) : (analysis?.flags?.length ?? 0) > 0 ? (
// // // //                           <div className="flex flex-wrap gap-1">
// // // //                             {analysis!.flags.slice(0, 2).map((flag, i) => (
// // // //                               <span key={i} className={`px-2 py-0.5 rounded-md text-[10px] font-bold
// // // //                                 ${flag.severity === 'high' ? 'bg-tertiary/10 text-tertiary' :
// // // //                                   flag.severity === 'medium' ? 'bg-amber-50 text-amber-700' :
// // // //                                   'bg-surface-container-high text-on-surface-variant'}`}>
// // // //                                 {flag.type}
// // // //                               </span>
// // // //                             ))}
// // // //                             {analysis!.flags.length > 2 && (
// // // //                               <span className="text-[10px] text-on-surface-variant">+{analysis!.flags.length - 2}</span>
// // // //                             )}
// // // //                           </div>
// // // //                         ) : analysis ? (
// // // //                           <span className="px-2 py-0.5 bg-secondary-container/20 text-secondary rounded-md text-[10px] font-bold">Clear</span>
// // // //                         ) : (
// // // //                           <button onClick={e => { e.stopPropagation(); analyzeEvent(event); }}
// // // //                             className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1">
// // // //                             <Sparkles size={10} /> Analyze
// // // //                           </button>
// // // //                         )}
// // // //                       </td>

// // // //                       {/* Risk */}
// // // //                       <td className="px-4 py-4 w-24"><RiskBadge analysis={analysis} /></td>

// // // //                       {/* Status */}
// // // //                       <td className="px-4 py-4">
// // // //                         <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${getStatusStyle(event.status)}`}>
// // // //                           {getStatusLabel(event.status)}
// // // //                         </span>
// // // //                       </td>

// // // //                       {/* Actions */}
// // // //                       <td className="pr-6 py-4 text-right">
// // // //                         <div className="flex items-center justify-end gap-1">
// // // //                           <button onClick={e => { e.stopPropagation(); handleAction(event.id, 'approve'); }}
// // // //                             className="p-2 text-secondary hover:bg-secondary-container/20 rounded-lg transition-colors" title="Approve">
// // // //                             <CheckCircle2 size={18} />
// // // //                           </button>
// // // //                           <Link to={`/moderation/${event.id}`} onClick={e => e.stopPropagation()}
// // // //                             className="p-2 text-primary hover:bg-primary-container/10 rounded-lg transition-colors" title="View Detail">
// // // //                             <Eye size={18} />
// // // //                           </Link>
// // // //                           <button onClick={e => { e.stopPropagation(); handleAction(event.id, 'reject'); }}
// // // //                             className="p-2 text-tertiary hover:bg-tertiary/10 rounded-lg transition-colors" title="Reject">
// // // //                             <X size={18} />
// // // //                           </button>
// // // //                         </div>
// // // //                       </td>
// // // //                     </tr>
// // // //                   );
// // // //                 })}
// // // //               </tbody>
// // // //             </table>
// // // //           </div>

// // // //           <div className="px-6 py-4 bg-surface-container-low/30 border-t border-indigo-50/50 flex justify-between items-center">
// // // //             <button className="text-xs font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary">
// // // //               <ChevronLeft size={16} /> Previous
// // // //             </button>
// // // //             <span className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg text-xs font-bold">1</span>
// // // //             <button className="text-xs font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary">
// // // //               Next <ChevronRight size={16} />
// // // //             </button>
// // // //           </div>
// // // //         </div>

// // // //         {/* AI Insights Panel */}
// // // //         <div className="col-span-12 lg:col-span-4 space-y-6">
// // // //           <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm relative overflow-hidden border border-indigo-50/50">
// // // //             <div className="absolute top-0 left-0 w-1 h-full bg-tertiary" />

// // // //             <div className="flex items-center justify-between mb-4">
// // // //               <div className="flex items-center gap-2 text-tertiary">
// // // //                 <Sparkles size={20} />
// // // //                 <h4 className="font-bold text-sm">AI Insights</h4>
// // // //               </div>
// // // //               {selectedAnalysis && !selectedAnalysis.isLoading && (
// // // //                 <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold
// // // //                   ${selectedAnalysis.riskScore >= 70 ? 'bg-tertiary/10 text-tertiary' :
// // // //                     selectedAnalysis.riskScore >= 40 ? 'bg-amber-50 text-amber-700' :
// // // //                     'bg-secondary-container/20 text-secondary'}`}>
// // // //                   {getRiskLabel(selectedAnalysis.riskLevel)}
// // // //                 </span>
// // // //               )}
// // // //             </div>

// // // //             {!selectedEvent ? (
// // // //               <p className="text-xs text-on-surface-variant">Select an event to see AI analysis</p>
// // // //             ) : selectedAnalysis?.isLoading || analyzingId === selectedEvent.id ? (
// // // //               <div className="space-y-4">
// // // //                 <div className="flex items-center gap-2 text-primary">
// // // //                   <Loader2 size={16} className="animate-spin" />
// // // //                   <span className="text-xs font-bold">AI analyzing…</span>
// // // //                 </div>
// // // //                 <AILoadingSkeleton />
// // // //               </div>
// // // //             ) : selectedAnalysis ? (
// // // //               <>
// // // //                 <div className="mb-4">
// // // //                   <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Analyzing</p>
// // // //                   <p className="text-sm font-semibold text-on-surface">"{selectedEvent.title}"</p>
// // // //                   <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{selectedAnalysis.summary}</p>
// // // //                 </div>

// // // //                 <div className="space-y-3 mb-4">
// // // //                   {[
// // // //                     { label: 'Semantic Integrity', value: selectedAnalysis.semanticIntegrity },
// // // //                     { label: 'Host Legitimacy', value: selectedAnalysis.hostLegitimacy },
// // // //                     { label: 'Engagement Pattern', value: selectedAnalysis.engagementPattern },
// // // //                   ].map(m => (
// // // //                     <div key={m.label}>
// // // //                       <div className="flex justify-between text-[11px] mb-1">
// // // //                         <span className="text-on-surface-variant">{m.label}</span>
// // // //                         <span className={`font-bold ${getRiskColor(100 - m.value)}`}>{m.value}/100</span>
// // // //                       </div>
// // // //                       <div className="w-full bg-indigo-50 h-1.5 rounded-full overflow-hidden">
// // // //                         <div className={`h-full transition-all duration-700 ${getRiskBarColor(100 - m.value)}`}
// // // //                           style={{ width: `${m.value}%` }} />
// // // //                       </div>
// // // //                     </div>
// // // //                   ))}
// // // //                 </div>

// // // //                 {(selectedAnalysis.flags?.length ?? 0) > 0 && (
// // // //                   <div className="space-y-2 mb-4">
// // // //                     {selectedAnalysis.flags.map((flag, i) => (
// // // //                       <div key={i} className={`p-3 rounded-lg flex items-start gap-2
// // // //                         ${flag.severity === 'high' ? 'bg-tertiary/5 border-l-2 border-tertiary' : 'bg-amber-50/50 border-l-2 border-amber-400'}`}>
// // // //                         <AlertCircle size={14} className={flag.severity === 'high' ? 'text-tertiary mt-0.5' : 'text-amber-600 mt-0.5'} />
// // // //                         <div>
// // // //                           <p className="text-xs font-bold text-on-surface">{flag.type}</p>
// // // //                           <p className="text-[11px] text-on-surface-variant">{flag.description}</p>
// // // //                         </div>
// // // //                       </div>
// // // //                     ))}
// // // //                   </div>
// // // //                 )}

// // // //                 <div className="bg-surface-container-low p-4 rounded-2xl mb-4">
// // // //                   <p className="text-[10px] font-bold text-primary uppercase mb-1">Recommendation</p>
// // // //                   <p className="text-xs italic text-on-surface-variant">"{selectedAnalysis.recommendation}"</p>
// // // //                 </div>

// // // //                 <Link to={`/moderation/${selectedEvent.id}`}
// // // //                   className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-all text-center block">
// // // //                   Review Full Report
// // // //                 </Link>
// // // //               </>
// // // //             ) : (
// // // //               <div className="text-center py-4">
// // // //                 <p className="text-xs text-on-surface-variant mb-3">Click an event to analyze</p>
// // // //                 <button onClick={() => selectedEvent && analyzeEvent(selectedEvent)}
// // // //                   className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 flex items-center gap-2 mx-auto">
// // // //                   <Sparkles size={14} /> Analyze with AI
// // // //                 </button>
// // // //               </div>
// // // //             )}
// // // //           </div>

// // // //           {/* Event Context */}
// // // //           {selectedEvent && (
// // // //             <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-indigo-50/50">
// // // //               <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Event Context</h4>
// // // //               <div className="space-y-2.5">
// // // //                 {[
// // // //                   { label: 'Category', val: selectedEvent.category },
// // // //                   { label: 'Price', val: selectedEvent.ticketPrice },
// // // //                   { label: 'Capacity', val: String(selectedEvent.capacity) },
// // // //                   { label: '📅 Event Date', val: selectedEvent.eventDate || '—' },
// // // //                   { label: '🕐 Submitted', val: selectedEvent.dateSubmitted ? new Date(selectedEvent.dateSubmitted).toLocaleDateString('en-IN') : '—' },
// // // //                   { label: 'Location', val: selectedEvent.location },
// // // //                 ].map(r => (
// // // //                   <div key={r.label} className="flex justify-between text-sm">
// // // //                     <span className="text-on-surface-variant">{r.label}</span>
// // // //                     <span className="font-semibold text-right max-w-[60%] truncate">{r.val}</span>
// // // //                   </div>
// // // //                 ))}
// // // //               </div>
// // // //               <div className="mt-4 pt-4 border-t border-indigo-50 flex gap-2">
// // // //                 <button onClick={() => handleAction(selectedEvent.id, 'approve')}
// // // //                   className="flex-1 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1">
// // // //                   <CheckCircle2 size={14} /> Approve
// // // //                 </button>
// // // //                 <button onClick={() => handleAction(selectedEvent.id, 'reject')}
// // // //                   className="flex-1 py-2 bg-tertiary/10 text-tertiary rounded-xl text-xs font-bold hover:bg-tertiary/20 flex items-center justify-center gap-1">
// // // //                   <X size={14} /> Reject
// // // //                 </button>
// // // //               </div>
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ModerationQueue;
// // // // frontend/src/pages/ModerationQueue.tsx
// // // //
// // // // ✅ AI CACHING:
// // // //    - Events load hone pe aiAnalysis field check karo
// // // //    - Agar cached hai → seedha state mein daal do (no API call)
// // // //    - "Re-analyze" button → force=true bhejo → fresh analysis
// // // //
// // // // ✅ PAGINATION:
// // // //    - 5 events per page
// // // //    - Filter change hone pe page 1 pe wapas jao
// // // //
// // // // ✅ DATE FILTERS (clearly labeled):
// // // //    📅 Event Start Date = Event kab hoga (organizer ne date rakhi)
// // // //    🕐 Submitted Date   = Admin ko kab mila (organizer ne kab create kiya)
// // // //
// // // // ✅ CO-PILOT MODE: AI auto-approve/reject karta hai
// // // // ✅ CO-PILOT MODE: AI auto-approve/reject karta hai

// // // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // // import {
// // //   CheckCircle2, Eye, X, ChevronLeft, ChevronRight,
// // //   Sparkles, AlertCircle, Loader2, RefreshCw, Database,
// // //   Bot, ToggleLeft, ToggleRight, Calendar, Clock, Info, RotateCcw,
// // // } from 'lucide-react';
// // // import { Link } from 'react-router-dom';
// // // import { analyzeEventWithOpenAI, getRiskColor, getRiskBarColor, getRiskLabel } from '../lib/openai';
// // // import { getEventsFromAPI, updateEventStatusAPI, getEvents, updateEventStatus } from '../lib/mockEvents';
// // // import type { Event, AIAnalysis } from '../types';

// // // // ─── Helper: Date range check ─────────────────────────────────────────────────
// // // // from/to compare karo date string se
// // // function isInRange(dateStr: string, from: string, to: string): boolean {
// // //   if (!dateStr) return true; // date nahi hai to filter se bahar nahi
// // //   const d = new Date(dateStr).getTime();
// // //   if (isNaN(d)) return true;
// // //   if (from && d < new Date(from).getTime()) return false;
// // //   if (to && d > new Date(to + 'T23:59:59').getTime()) return false;
// // //   return true;
// // // }

// // // function toISO(date: Date) {
// // //   return date.toISOString().slice(0, 10);
// // // }

// // // // ─── Small UI components ──────────────────────────────────────────────────────
// // // const Skeleton = () => (
// // //   <div className="animate-pulse space-y-3">
// // //     <div className="h-3 bg-indigo-100 rounded w-3/4" />
// // //     <div className="h-3 bg-indigo-100 rounded w-1/2" />
// // //     <div className="h-8 bg-indigo-100 rounded w-full" />
// // //   </div>
// // // );

// // // const RiskBadge = ({ analysis }: { analysis?: AIAnalysis }) => {
// // //   if (!analysis) return <span className="text-[10px] text-on-surface-variant">Not analyzed</span>;
// // //   if (analysis.isLoading) return <Loader2 size={14} className="animate-spin text-primary" />;
// // //   return (
// // //     <div className="flex flex-col gap-1">
// // //       <span className={`text-[11px] font-bold ${getRiskColor(analysis.riskScore ?? 0)}`}>
// // //         {analysis.riskScore ?? '—'}%
// // //       </span>
// // //       <div className="w-full bg-indigo-100 h-1.5 rounded-full overflow-hidden">
// // //         <div className={`h-full transition-all duration-700 ${getRiskBarColor(analysis.riskScore ?? 0)}`}
// // //           style={{ width: `${analysis.riskScore ?? 0}%` }} />
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // ─── Main Component ───────────────────────────────────────────────────────────
// // // const ModerationQueue = () => {

// // //   // ── Core data ──
// // //   const [events, setEvents] = useState<Event[]>([]);
// // //   const [analyses, setAnalyses] = useState<Record<string, AIAnalysis>>({});
// // //   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [dataSource, setDataSource] = useState<'api' | 'local'>('api');

// // //   // ── Filters ──
// // //   const [filterStatus, setFilterStatus] = useState('all');
// // //   // 📅 Event Start Date filters — event kab hoga
// // //   const [startDateFrom, setStartDateFrom] = useState('');
// // //   const [startDateTo, setStartDateTo] = useState('');
// // //   // 🕐 Submitted Date filters — organizer ne kab submit kiya
// // //   const [createdFrom, setCreatedFrom] = useState('');
// // //   const [createdTo, setCreatedTo] = useState('');
// // //   const [showDateFilters, setShowDateFilters] = useState(false);

// // //   // ── Pagination ──
// // //   // Ek page pe 5 events — agar zyada events hain to next/prev se navigate karo
// // //   const ITEMS_PER_PAGE = 5;
// // //   const [currentPage, setCurrentPage] = useState(1);

// // //   // ── AI ──
// // //   const [analyzingId, setAnalyzingId] = useState<string | null>(null);

// // //   // ── Co-Pilot ──
// // //   const [copilotMode, setCopilotMode] = useState(false);
// // //   const [copilotRunning, setCopilotRunning] = useState(false);
// // //   const [copilotLog, setCopilotLog] = useState<string[]>([]);
// // //   const [autoApproveThreshold, setAutoApproveThreshold] = useState(30);
// // //   const [autoRejectThreshold, setAutoRejectThreshold] = useState(70);
// // //   const copilotStopRef = useRef(false);

// // //   // ── Toast ──
// // //   const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
// // //   const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
// // //     setNotification({ msg, type });
// // //     setTimeout(() => setNotification(null), 4000);
// // //   };

// // //   // ─── Load Events ─────────────────────────────────────────────────────────────
// // //   // API se events fetch karo. Har event mein aiAnalysis field bhi aata hai (agar cached hai)
// // //   // Ye cached analyses seedha state mein daal do → page reload pe score wahi rahega
// // //   const loadEvents = async () => {
// // //     setIsLoading(true);
// // //     try {
// // //       const apiEvents = await getEventsFromAPI();
// // //       if (apiEvents.length > 0) {
// // //         setEvents(apiEvents);
// // //         setSelectedEvent(apiEvents[0]);
// // //         setDataSource('api');

// // //         // ✅ CACHING: Jo events ke paas aiAnalysis hai, unhe seedha state mein daal do
// // //         // Iska matlab: page reload pe AI score wahi rahega, naya call nahi hoga
// // //         const cachedAnalyses: Record<string, AIAnalysis> = {};
// // //         for (const ev of apiEvents) {
// // //           if ((ev as any).aiAnalysis?.riskScore !== undefined) {
// // //             cachedAnalyses[ev.id] = {
// // //               ...(ev as any).aiAnalysis,
// // //               isLoading: false,
// // //             };
// // //           }
// // //         }
// // //         if (Object.keys(cachedAnalyses).length > 0) {
// // //           setAnalyses(prev => ({ ...cachedAnalyses, ...prev }));
// // //           console.log(`📦 Loaded ${Object.keys(cachedAnalyses).length} cached AI analyses from MongoDB`);
// // //         }
// // //       } else {
// // //         const local = getEvents();
// // //         setEvents(local);
// // //         if (local.length > 0) setSelectedEvent(local[0]);
// // //         setDataSource('local');
// // //       }
// // //     } catch {
// // //       const local = getEvents();
// // //       setEvents(local);
// // //       if (local.length > 0) setSelectedEvent(local[0]);
// // //       setDataSource('local');
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => { loadEvents(); }, []);

// // //   // filter change → page 1 pe wapas jao
// // //   useEffect(() => { setCurrentPage(1); }, [filterStatus, startDateFrom, startDateTo, createdFrom, createdTo]);

// // //   // ─── Analyze Event ────────────────────────────────────────────────────────────
// // //   // force=false (default): pehle cache check hoga backend pe
// // //   // force=true: fresh analysis + cache update
// // //   const analyzeEvent = useCallback(async (event: Event, force = false): Promise<AIAnalysis | null> => {
// // //     setAnalyzingId(event.id);
// // //     setAnalyses(prev => ({ ...prev, [event.id]: { ...(prev[event.id] || {}), isLoading: true } as AIAnalysis }));

// // //     try {
// // //       // openai.ts mein fetch call hoti hai: POST /analyze {event, force}
// // //       // Backend cache check karta hai agar force=false
// // //       const res = await fetch('http://localhost:5006/analyze', {
// // //         method: 'POST',
// // //         headers: { 'Content-Type': 'application/json' },
// // //         body: JSON.stringify({ event, force }),
// // //       });
// // //       const data = await res.json();

// // //       const safe: AIAnalysis = {
// // //         riskScore: data.riskScore ?? 0,
// // //         riskLevel: data.riskLevel ?? 'low',
// // //         semanticIntegrity: data.semanticIntegrity ?? 80,
// // //         hostLegitimacy: data.hostLegitimacy ?? 80,
// // //         engagementPattern: data.engagementPattern ?? 80,
// // //         flags: Array.isArray(data.flags) ? data.flags : [],
// // //         summary: data.summary ?? '',
// // //         recommendation: data.recommendation ?? '',
// // //         scannedAt: data.scannedAt ?? new Date().toISOString(),
// // //         isLoading: false,
// // //       };

// // //       setAnalyses(prev => ({ ...prev, [event.id]: safe }));

// // //       if (data.fromCache) {
// // //         console.log(`📦 Cache hit: "${event.title}"`);
// // //       } else {
// // //         console.log(`🤖 Fresh analysis: "${event.title}" — score: ${data.riskScore}`);
// // //       }

// // //       return safe;
// // //     } catch (err) {
// // //       console.error('Analysis error:', err);
// // //       return null;
// // //     } finally {
// // //       setAnalyzingId(null);
// // //     }
// // //   }, []);

// // //   // ─── Approve / Reject ─────────────────────────────────────────────────────────
// // //   const handleAction = async (eventId: string, action: 'approve' | 'reject', silent = false) => {
// // //     const newStatus = action === 'approve' ? 'approved' : 'rejected';
// // //     setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: newStatus } : e));
// // // // Rejection ke waqt reason bhi bhejo
// // // const success = await updateEventStatusAPI(eventId, newStatus, 
// // //   action === 'reject' ? 'Does not meet community guidelines' : undefined
// // // );
// // //     if (dataSource === 'api') {
// // //       const ok = await updateEventStatusAPI(eventId, newStatus);
// // //       if (!ok && !silent) {
// // //         showToast('Failed to update in MongoDB', 'error');
// // //         setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'pending' } : e));
// // //         return;
// // //       }
// // //     } else {
// // //       updateEventStatus(eventId, newStatus);
// // //     }

// // //     if (!silent) {
// // //       showToast(
// // //         action === 'approve' ? '✓ Approved! Event will appear on MyApp' : '✗ Event rejected',
// // //         action === 'approve' ? 'success' : 'error',
// // //       );
// // //     }

// // //     if (selectedEvent?.id === eventId) {
// // //       const next = events.find(e => e.id !== eventId && e.status === 'pending');
// // //       if (next) setSelectedEvent(next);
// // //     }
// // //   };

// // //   // ─── Co-Pilot ─────────────────────────────────────────────────────────────────
// // //   // AI har pending event analyze karta hai
// // //   // riskScore <= autoApproveThreshold → approve (safe event)
// // //   // riskScore >= autoRejectThreshold  → reject  (risky event)
// // //   // In between → moderator decide kare
// // //   const runCopilot = async () => {
// // //     const pending = events.filter(e => e.status === 'pending' || e.status === 'flagged');
// // //     if (!pending.length) { showToast('No pending events', 'info'); return; }

// // //     setCopilotRunning(true);
// // //     copilotStopRef.current = false;
// // //     setCopilotLog([
// // //       `🤖 Co-Pilot started — ${pending.length} events to process`,
// // //       `📊 Approve if risk ≤ ${autoApproveThreshold}% | Reject if risk ≥ ${autoRejectThreshold}%`,
// // //     ]);

// // //     let approved = 0, rejected = 0, skipped = 0;

// // //     for (const event of pending) {
// // //       if (copilotStopRef.current) {
// // //         setCopilotLog(p => [...p, '⏹ Stopped by user']);
// // //         break;
// // //       }

// // //       setCopilotLog(p => [...p, `🔍 Analyzing: "${event.title}"...`]);
// // //       const analysis = await analyzeEvent(event);

// // //       if (!analysis) { setCopilotLog(p => [...p, '  ⚠️ Analysis failed — skipping']); skipped++; continue; }

// // //       const score = analysis.riskScore ?? 50;

// // //       if (score <= autoApproveThreshold) {
// // //         await handleAction(event.id, 'approve', true);
// // //         setCopilotLog(p => [...p, `  ✅ AUTO-APPROVED — ${score}% risk — "${event.title}"`]);
// // //         approved++;
// // //       } else if (score >= autoRejectThreshold) {
// // //         await handleAction(event.id, 'reject', true);
// // //         setCopilotLog(p => [...p, `  ❌ AUTO-REJECTED — ${score}% risk — "${event.title}"`]);
// // //         rejected++;
// // //       } else {
// // //         setCopilotLog(p => [...p, `  🟡 NEEDS REVIEW — ${score}% risk (${autoApproveThreshold}–${autoRejectThreshold}%)`]);
// // //         skipped++;
// // //       }

// // //       await new Promise(r => setTimeout(r, 400));
// // //     }

// // //     setCopilotLog(p => [...p, '', '📋 Done!', `  ✅ Approved: ${approved} | ❌ Rejected: ${rejected} | 🟡 Review: ${skipped}`]);
// // //     setCopilotRunning(false);
// // //     await loadEvents();
// // //   };

// // //   // ─── Filtered + Paginated events ─────────────────────────────────────────────
// // //   //
// // //   // Filter order:
// // //   // 1. Status (pending/approved/rejected/flagged)
// // //   // 2. Event Start Date — event kab hoga (eventDate field)
// // //   //    → "Only show events happening this week" jaisi queries ke liye
// // //   // 3. Submitted Date — organizer ne kab submit kiya (dateSubmitted field)
// // //   //    → "Only show events submitted today" jaisi queries ke liye
// // //   //
// // //   const filtered = events.filter(e => {
// // //     if (filterStatus !== 'all' && e.status !== filterStatus) return false;

// // //     // 📅 Event Start Date filter
// // //     if (startDateFrom || startDateTo) {
// // //       if (!isInRange(e.eventDate || '', startDateFrom, startDateTo)) return false;
// // //     }

// // //     // 🕐 Submitted Date filter
// // //     if (createdFrom || createdTo) {
// // //       const ds = typeof e.dateSubmitted === 'string' ? e.dateSubmitted : String(e.dateSubmitted || '');
// // //       if (!isInRange(ds, createdFrom, createdTo)) return false;
// // //     }

// // //     return true;
// // //   });

// // //   // Pagination math
// // //   const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
// // //   const safePage = Math.min(currentPage, totalPages);
// // //   const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
// // //   const pageEvents = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

// // //   const hasDateFilter = startDateFrom || startDateTo || createdFrom || createdTo;
// // //   const pendingCount = events.filter(e => e.status === 'pending').length;
// // //   const flaggedCount = events.filter(e => e.status === 'flagged').length;
// // //   const selectedAnalysis = selectedEvent ? analyses[selectedEvent.id] : null;

// // //   const statusStyle = (s: string) => ({
// // //     flagged: 'text-tertiary bg-tertiary-container/10',
// // //     pending: 'text-on-surface-variant bg-surface-container-highest',
// // //     under_review: 'text-amber-700 bg-amber-100',
// // //     approved: 'text-on-secondary-container bg-secondary-container',
// // //     rejected: 'text-tertiary bg-tertiary/10',
// // //   }[s] || 'text-on-surface-variant bg-surface-container-highest');

// // //   const statusLabel = (s: string) =>
// // //     ({ pending: 'PENDING', flagged: 'FLAGGED', under_review: 'UNDER REVIEW', approved: 'APPROVED', rejected: 'REJECTED' }[s] || s.toUpperCase());

// // //   // ─── RENDER ───────────────────────────────────────────────────────────────────
// // //   return (
// // //     <div className="space-y-6">

// // //       {/* Toast notification */}
// // //       {notification && (
// // //         <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg font-bold text-sm text-white transition-all
// // //           ${notification.type === 'success' ? 'bg-secondary' : notification.type === 'error' ? 'bg-tertiary' : 'bg-primary'}`}>
// // //           {notification.msg}
// // //         </div>
// // //       )}

// // //       {/* ── HEADER ── */}
// // //       <div className="flex justify-between items-end flex-wrap gap-4">
// // //         <div>
// // //           <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 flex items-center gap-1.5">
// // //             <Database size={10} />
// // //             {dataSource === 'api' ? 'Live — MyApp MongoDB' : 'LocalStorage (backend offline)'}
// // //           </span>
// // //           <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">Moderation Queue</h3>
// // //           <p className="text-on-surface-variant text-sm mt-1">Events awaiting review &amp; approval before listing on MyApp.</p>
// // //         </div>

// // //         <div className="flex gap-3 items-center flex-wrap">
// // //           <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
// // //             <p className="text-[10px] text-on-surface-variant font-bold uppercase">Pending</p>
// // //             <p className="text-xl font-extrabold text-primary">{pendingCount}</p>
// // //           </div>
// // //           <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
// // //             <p className="text-[10px] text-on-surface-variant font-bold uppercase">Flagged</p>
// // //             <p className="text-xl font-extrabold text-tertiary">{flaggedCount}</p>
// // //           </div>
// // //           <button onClick={() => setCopilotMode(p => !p)}
// // //             className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all
// // //               ${copilotMode ? 'bg-indigo-900 border-indigo-700 text-white' : 'bg-white border-indigo-200 text-indigo-700 hover:border-indigo-400'}`}>
// // //             <Bot size={16} /> Co-Pilot {copilotMode ? 'ON' : 'OFF'}
// // //             {copilotMode ? <ToggleRight size={18} className="text-indigo-300" /> : <ToggleLeft size={18} className="text-indigo-400" />}
// // //           </button>
// // //           <button onClick={() => { loadEvents(); showToast('Refreshed!', 'info'); }} disabled={isLoading}
// // //             className="bg-white border border-primary text-primary px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/5 disabled:opacity-50">
// // //             <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
// // //             {isLoading ? 'Loading...' : 'Refresh'}
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* ── CO-PILOT PANEL ── */}
// // //       {copilotMode && (
// // //         <div className="bg-indigo-950 rounded-3xl p-6 border border-indigo-800 shadow-xl space-y-5">
// // //           <div className="flex items-center gap-3">
// // //             <div className="w-10 h-10 bg-indigo-700 rounded-2xl flex items-center justify-center">
// // //               <Bot size={20} className="text-white" />
// // //             </div>
// // //             <div>
// // //               <h4 className="text-white font-bold text-base">AI Co-Pilot Mode</h4>
// // //               <p className="text-indigo-300 text-xs">Auto-analyzes pending events and approves/rejects based on risk score</p>
// // //             </div>
// // //             <div className="ml-auto bg-indigo-900/60 border border-indigo-700/50 rounded-xl px-4 py-3 max-w-sm">
// // //               <p className="text-indigo-200 text-[11px] leading-relaxed flex items-start gap-2">
// // //                 <Info size={12} className="flex-shrink-0 mt-0.5 text-indigo-400" />
// // //                 Lower "approve threshold" = stricter moderation. Events in the middle zone need human review.
// // //               </p>
// // //             </div>
// // //           </div>

// // //           {/* Sliders */}
// // //           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
// // //             <div className="bg-indigo-900/50 rounded-2xl p-4 border border-indigo-800/50">
// // //               <div className="flex justify-between mb-2">
// // //                 <label className="text-[11px] font-bold text-green-400 uppercase flex items-center gap-1"><CheckCircle2 size={12} /> Auto-Approve if Risk ≤</label>
// // //                 <span className="text-green-400 font-extrabold text-sm">{autoApproveThreshold}%</span>
// // //               </div>
// // //               <input type="range" min={0} max={60} step={5} value={autoApproveThreshold}
// // //                 onChange={e => setAutoApproveThreshold(Number(e.target.value))} className="w-full accent-green-500" />
// // //               <p className="text-indigo-400 text-[10px] mt-1.5">Events with risk ≤ {autoApproveThreshold}% → listed on MyApp automatically</p>
// // //             </div>
// // //             <div className="bg-indigo-900/50 rounded-2xl p-4 border border-indigo-800/50">
// // //               <div className="flex justify-between mb-2">
// // //                 <label className="text-[11px] font-bold text-red-400 uppercase flex items-center gap-1"><X size={12} /> Auto-Reject if Risk ≥</label>
// // //                 <span className="text-red-400 font-extrabold text-sm">{autoRejectThreshold}%</span>
// // //               </div>
// // //               <input type="range" min={40} max={100} step={5} value={autoRejectThreshold}
// // //                 onChange={e => setAutoRejectThreshold(Number(e.target.value))} className="w-full accent-red-500" />
// // //               <p className="text-indigo-400 text-[10px] mt-1.5">Events with risk ≥ {autoRejectThreshold}% → auto-rejected</p>
// // //             </div>
// // //           </div>

// // //           {/* Risk band */}
// // //           <div>
// // //             <p className="text-indigo-400 text-[10px] font-bold uppercase mb-1.5">Risk Band</p>
// // //             <div className="h-6 rounded-full overflow-hidden flex">
// // //               <div className="bg-green-500/80 flex items-center justify-center text-[9px] font-bold text-white" style={{ width: `${autoApproveThreshold}%` }}>{autoApproveThreshold > 12 ? 'AUTO-APPROVE' : ''}</div>
// // //               <div className="bg-amber-500/80 flex items-center justify-center text-[9px] font-bold text-white" style={{ width: `${autoRejectThreshold - autoApproveThreshold}%` }}>{autoRejectThreshold - autoApproveThreshold > 15 ? 'HUMAN REVIEW' : ''}</div>
// // //               <div className="bg-red-500/80 flex-1 flex items-center justify-center text-[9px] font-bold text-white">{100 - autoRejectThreshold > 5 ? 'AUTO-REJECT' : ''}</div>
// // //             </div>
// // //             <div className="flex justify-between text-[9px] text-indigo-400 mt-1 px-1">
// // //               <span>0%</span><span>{autoApproveThreshold}%</span><span>{autoRejectThreshold}%</span><span>100%</span>
// // //             </div>
// // //           </div>

// // //           {/* Run/Stop */}
// // //           <div className="flex gap-3">
// // //             {!copilotRunning ? (
// // //               <button onClick={runCopilot} disabled={pendingCount === 0}
// // //                 className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 disabled:opacity-40">
// // //                 <Bot size={16} /> Run Co-Pilot on {pendingCount} Pending Events
// // //               </button>
// // //             ) : (
// // //               <button onClick={() => { copilotStopRef.current = true; setCopilotRunning(false); }}
// // //                 className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90">
// // //                 <X size={16} /> Stop Co-Pilot
// // //               </button>
// // //             )}
// // //           </div>

// // //           {/* Log */}
// // //           {copilotLog.length > 0 && (
// // //             <div className="bg-black/40 rounded-2xl p-4 max-h-44 overflow-y-auto font-mono space-y-0.5">
// // //               {copilotLog.map((line, i) => (
// // //                 <div key={i} className={`text-[11px] leading-relaxed ${
// // //                   line.includes('AUTO-APPROVED') ? 'text-green-400' :
// // //                   line.includes('AUTO-REJECTED') ? 'text-red-400' :
// // //                   line.includes('NEEDS REVIEW') ? 'text-amber-400' :
// // //                   line.includes('Done!') ? 'text-white font-bold' : 'text-indigo-300'
// // //                 }`}>{line || '\u00A0'}</div>
// // //               ))}
// // //               {copilotRunning && <div className="flex items-center gap-2 text-indigo-300 text-[11px]"><Loader2 size={10} className="animate-spin" /> Processing…</div>}
// // //             </div>
// // //           )}
// // //         </div>
// // //       )}

// // //       {/* ── FILTERS ── */}
// // //       <div className="bg-surface-container-low p-4 rounded-2xl space-y-3">
// // //         <div className="flex flex-wrap items-end gap-4">
// // //           {/* Status filter */}
// // //           <div className="flex-1 min-w-[140px]">
// // //             <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">Status</label>
// // //             <select className="w-full bg-surface-container-highest border-none rounded-xl text-sm p-2"
// // //               value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
// // //               <option value="all">All Status</option>
// // //               <option value="pending">Pending</option>
// // //               <option value="flagged">Flagged</option>
// // //               <option value="approved">Approved</option>
// // //               <option value="rejected">Rejected</option>
// // //             </select>
// // //           </div>

// // //           {/* Date filter toggle */}
// // //           <button onClick={() => setShowDateFilters(p => !p)}
// // //             className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all
// // //               ${showDateFilters || hasDateFilter ? 'bg-primary text-white border-primary' : 'bg-surface-container-highest text-primary border-primary/20 hover:border-primary/50'}`}>
// // //             <Calendar size={14} /> Date Filters
// // //             {hasDateFilter && <span className="bg-white/20 text-[9px] px-1.5 py-0.5 rounded-full font-bold">ON</span>}
// // //           </button>

// // //           {hasDateFilter && (
// // //             <button onClick={() => { setStartDateFrom(''); setStartDateTo(''); setCreatedFrom(''); setCreatedTo(''); }}
// // //               className="text-xs text-tertiary font-bold hover:underline flex items-center gap-1">
// // //               <X size={12} /> Clear dates
// // //             </button>
// // //           )}
// // //         </div>

// // //         {/* Date filter panels */}
// // //         {showDateFilters && (
// // //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-indigo-100/30">

// // //             {/* 📅 Event Start Date */}
// // //             <div className="bg-surface-container-lowest rounded-2xl p-4 border border-indigo-50/50">
// // //               <p className="text-[11px] font-bold text-primary mb-1 flex items-center gap-1.5">
// // //                 <Calendar size={11} /> Event Start Date
// // //               </p>
// // //               <p className="text-[10px] text-on-surface-variant mb-3">
// // //                 Event kab hoga — organizer ne jo date rakhi hai (e.g. "Concert on 25 Jan")
// // //               </p>
// // //               <div className="grid grid-cols-2 gap-2 mb-2">
// // //                 <div>
// // //                   <label className="text-[10px] text-on-surface-variant font-bold block mb-1">From</label>
// // //                   <input type="date" value={startDateFrom} onChange={e => setStartDateFrom(e.target.value)}
// // //                     className="w-full bg-surface-container-high border-none rounded-xl text-xs p-2 focus:ring-2 ring-primary/20" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="text-[10px] text-on-surface-variant font-bold block mb-1">To</label>
// // //                   <input type="date" value={startDateTo} onChange={e => setStartDateTo(e.target.value)}
// // //                     className="w-full bg-surface-container-high border-none rounded-xl text-xs p-2 focus:ring-2 ring-primary/20" />
// // //                 </div>
// // //               </div>
// // //               <div className="flex gap-2 flex-wrap">
// // //                 {[
// // //                   { l: 'Today', f: toISO(new Date()), t: toISO(new Date()) },
// // //                   { l: 'This Week', f: toISO(new Date()), t: toISO(new Date(Date.now() + 7 * 86400000)) },
// // //                   { l: 'This Month', f: toISO(new Date(new Date().getFullYear(), new Date().getMonth(), 1)), t: toISO(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)) },
// // //                 ].map(p => (
// // //                   <button key={p.l} onClick={() => { setStartDateFrom(p.f); setStartDateTo(p.t); }}
// // //                     className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors">
// // //                     {p.l}
// // //                   </button>
// // //                 ))}
// // //               </div>
// // //             </div>

// // //             {/* 🕐 Submitted Date */}
// // //             <div className="bg-surface-container-lowest rounded-2xl p-4 border border-indigo-50/50">
// // //               <p className="text-[11px] font-bold text-secondary mb-1 flex items-center gap-1.5">
// // //                 <Clock size={11} /> Submitted Date
// // //               </p>
// // //               <p className="text-[10px] text-on-surface-variant mb-3">
// // //                 Admin ko kab mila — organizer ne event kab create karke submit kiya
// // //               </p>
// // //               <div className="grid grid-cols-2 gap-2 mb-2">
// // //                 <div>
// // //                   <label className="text-[10px] text-on-surface-variant font-bold block mb-1">From</label>
// // //                   <input type="date" value={createdFrom} onChange={e => setCreatedFrom(e.target.value)}
// // //                     className="w-full bg-surface-container-high border-none rounded-xl text-xs p-2 focus:ring-2 ring-primary/20" />
// // //                 </div>
// // //                 <div>
// // //                   <label className="text-[10px] text-on-surface-variant font-bold block mb-1">To</label>
// // //                   <input type="date" value={createdTo} onChange={e => setCreatedTo(e.target.value)}
// // //                     className="w-full bg-surface-container-high border-none rounded-xl text-xs p-2 focus:ring-2 ring-primary/20" />
// // //                 </div>
// // //               </div>
// // //               <div className="flex gap-2 flex-wrap">
// // //                 {[
// // //                   { l: 'Today', f: toISO(new Date()), t: toISO(new Date()) },
// // //                   { l: 'Last 7 days', f: toISO(new Date(Date.now() - 7 * 86400000)), t: toISO(new Date()) },
// // //                   { l: 'Last 30 days', f: toISO(new Date(Date.now() - 30 * 86400000)), t: toISO(new Date()) },
// // //                 ].map(p => (
// // //                   <button key={p.l} onClick={() => { setCreatedFrom(p.f); setCreatedTo(p.t); }}
// // //                     className="text-[10px] px-2.5 py-1 rounded-full bg-secondary/10 text-secondary font-bold hover:bg-secondary/20 transition-colors">
// // //                     {p.l}
// // //                   </button>
// // //                 ))}
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* ── MAIN GRID ── */}
// // //       <div className="grid grid-cols-12 gap-6 items-start">

// // //         {/* Events Table */}
// // //         <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-indigo-50/50">

// // //           {/* Table header */}
// // //           <div className="px-6 py-4 bg-indigo-50/30 flex justify-between items-center border-b border-indigo-50/50">
// // //             <div className="flex items-center gap-3 flex-wrap">
// // //               <span className="text-sm font-bold text-indigo-900">
// // //                 {filtered.length} events
// // //                 {filtered.length !== events.length && <span className="text-on-surface-variant font-normal"> (of {events.length})</span>}
// // //               </span>
// // //               <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${dataSource === 'api' ? 'bg-secondary/10 text-secondary' : 'bg-amber-50 text-amber-700'}`}>
// // //                 {dataSource === 'api' ? 'MONGODB LIVE' : 'LOCAL'}
// // //               </span>
// // //             </div>
// // //             <button onClick={() => { loadEvents(); showToast('Refreshed!', 'info'); }} disabled={isLoading}
// // //               className="text-xs font-bold text-primary flex items-center gap-1 hover:underline disabled:opacity-50">
// // //               <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} /> Refresh
// // //             </button>
// // //           </div>

// // //           {/* Table */}
// // //           <div className="overflow-x-auto">
// // //             <table className="w-full border-collapse">
// // //               <thead>
// // //                 <tr className="text-left border-b border-indigo-50">
// // //                   <th className="pl-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Event &amp; Host</th>
// // //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
// // //                     <span className="flex flex-col gap-0.5">
// // //                       <span className="flex items-center gap-1"><Calendar size={9} className="text-primary" /> Event Date</span>
// // //                       <span className="flex items-center gap-1"><Clock size={9} className="text-on-surface-variant" /> Submitted</span>
// // //                     </span>
// // //                   </th>
// // //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">AI Flags</th>
// // //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider w-24">Risk</th>
// // //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
// // //                   <th className="pr-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="divide-y divide-indigo-50/30">
// // //                 {isLoading ? (
// // //                   <tr><td colSpan={6} className="py-16 text-center">
// // //                     <Loader2 size={28} className="animate-spin text-primary mx-auto mb-2" />
// // //                     <p className="text-sm text-on-surface-variant">Fetching from MyApp database…</p>
// // //                   </td></tr>
// // //                 ) : pageEvents.length === 0 ? (
// // //                   <tr><td colSpan={6} className="py-16 text-center text-sm text-on-surface-variant">
// // //                     {events.length === 0
// // //                       ? 'No events. Make sure backend is running on port 5006.'
// // //                       : <span>No events match filters. <button onClick={() => { setFilterStatus('all'); setStartDateFrom(''); setStartDateTo(''); setCreatedFrom(''); setCreatedTo(''); }} className="text-primary font-bold hover:underline">Clear all filters</button></span>
// // //                     }
// // //                   </td></tr>
// // //                 ) : pageEvents.map(event => {
// // //                   const analysis = analyses[event.id];
// // //                   const isSelected = selectedEvent?.id === event.id;
// // //                   return (
// // //                     <tr key={event.id}
// // //                       onClick={() => { setSelectedEvent(event); if (!analyses[event.id]) analyzeEvent(event); }}
// // //                       className={`transition-colors cursor-pointer ${isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-surface-container-low/50'}`}>

// // //                       {/* Event + Host */}
// // //                       <td className="pl-6 py-4">
// // //                         <div className="flex items-center gap-3">
// // //                           <img src={event.image} alt={event.title}
// // //                             className="w-12 h-12 rounded-xl object-cover shadow-sm flex-shrink-0"
// // //                             referrerPolicy="no-referrer"
// // //                             onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/e8eaf6/4355b9?text=E'; }}
// // //                           />
// // //                           <div>
// // //                             <p className="text-sm font-bold text-slate-900 leading-tight">{event.title}</p>
// // //                             <p className="text-[11px] text-on-surface-variant mt-0.5">
// // //                               Host: <span className="font-semibold">{event.host}</span>
// // //                               {event.hostVerified && <span className="ml-1 text-[9px] bg-secondary-container text-on-secondary-container px-1 py-0.5 rounded font-bold">✓</span>}
// // //                             </p>
// // //                             <p className="text-[10px] text-on-surface-variant">{event.category}</p>
// // //                           </div>
// // //                         </div>
// // //                       </td>

// // //                       {/* Dates */}
// // //                       <td className="px-4 py-4">
// // //                         <div className="space-y-1">
// // //                           {/* 📅 Event Start Date — event kab hoga */}
// // //                           <div className="flex items-center gap-1">
// // //                             <Calendar size={9} className="text-primary flex-shrink-0" />
// // //                             <span className="text-[10px] font-bold text-on-surface">
// // //                               {event.eventDate || '—'}
// // //                             </span>
// // //                           </div>
// // //                           {/* 🕐 Submitted Date — kab admin ke paas aaya */}
// // //                           <div className="flex items-center gap-1">
// // //                             <Clock size={9} className="text-on-surface-variant flex-shrink-0" />
// // //                             <span className="text-[10px] text-on-surface-variant">
// // //                               {event.dateSubmitted
// // //                                 ? new Date(event.dateSubmitted).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })
// // //                                 : '—'}
// // //                             </span>
// // //                           </div>
// // //                         </div>
// // //                       </td>

// // //                       {/* AI Flags */}
// // //                       <td className="px-4 py-4">
// // //                         {analysis?.isLoading || analyzingId === event.id ? (
// // //                           <Loader2 size={14} className="animate-spin text-primary" />
// // //                         ) : (analysis?.flags?.length ?? 0) > 0 ? (
// // //                           <div className="flex flex-wrap gap-1">
// // //                             {analysis!.flags.slice(0, 2).map((flag, i) => (
// // //                               <span key={i} className={`px-2 py-0.5 rounded-md text-[10px] font-bold
// // //                                 ${flag.severity === 'high' ? 'bg-tertiary/10 text-tertiary' :
// // //                                   flag.severity === 'medium' ? 'bg-amber-50 text-amber-700' :
// // //                                   'bg-surface-container-high text-on-surface-variant'}`}>
// // //                                 {flag.type}
// // //                               </span>
// // //                             ))}
// // //                             {analysis!.flags.length > 2 && <span className="text-[10px] text-on-surface-variant">+{analysis!.flags.length - 2}</span>}
// // //                           </div>
// // //                         ) : analysis ? (
// // //                           <span className="px-2 py-0.5 bg-secondary-container/20 text-secondary rounded-md text-[10px] font-bold">Clear</span>
// // //                         ) : (
// // //                           <button onClick={e => { e.stopPropagation(); analyzeEvent(event); }}
// // //                             className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1">
// // //                             <Sparkles size={10} /> Analyze
// // //                           </button>
// // //                         )}
// // //                       </td>

// // //                       {/* Risk Score */}
// // //                       <td className="px-4 py-4 w-24"><RiskBadge analysis={analysis} /></td>

// // //                       {/* Status */}
// // //                       <td className="px-4 py-4">
// // //                         <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${statusStyle(event.status)}`}>
// // //                           {statusLabel(event.status)}
// // //                         </span>
// // //                       </td>

// // //                       {/* Actions */}
// // //                       <td className="pr-6 py-4 text-right">
// // //                         <div className="flex items-center justify-end gap-1">
// // //                           <button onClick={e => { e.stopPropagation(); handleAction(event.id, 'approve'); }}
// // //                             className="p-2 text-secondary hover:bg-secondary-container/20 rounded-lg transition-colors" title="Approve">
// // //                             <CheckCircle2 size={18} />
// // //                           </button>
// // //                           <Link to={`/moderation/${event.id}`} onClick={e => e.stopPropagation()}
// // //                             className="p-2 text-primary hover:bg-primary-container/10 rounded-lg transition-colors" title="View Detail">
// // //                             <Eye size={18} />
// // //                           </Link>
// // //                           <button onClick={e => { e.stopPropagation(); handleAction(event.id, 'reject'); }}
// // //                             className="p-2 text-tertiary hover:bg-tertiary/10 rounded-lg transition-colors" title="Reject">
// // //                             <X size={18} />
// // //                           </button>
// // //                         </div>
// // //                       </td>
// // //                     </tr>
// // //                   );
// // //                 })}
// // //               </tbody>
// // //             </table>
// // //           </div>

// // //           {/* ── PAGINATION ── */}
// // //           <div className="px-6 py-4 bg-surface-container-low/30 border-t border-indigo-50/50 flex justify-between items-center">
// // //             <button
// // //               onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
// // //               disabled={safePage === 1}
// // //               className="text-xs font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
// // //               <ChevronLeft size={16} /> Previous
// // //             </button>

// // //             {/* Page number pills */}
// // //             <div className="flex items-center gap-1.5">
// // //               {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
// // //                 // agar pages zyada hain to smart windowing
// // //                 let page = i + 1;
// // //                 if (totalPages > 5) {
// // //                   if (safePage <= 3) page = i + 1;
// // //                   else if (safePage >= totalPages - 2) page = totalPages - 4 + i;
// // //                   else page = safePage - 2 + i;
// // //                 }
// // //                 return (
// // //                   <button key={page} onClick={() => setCurrentPage(page)}
// // //                     className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all
// // //                       ${safePage === page ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-variant'}`}>
// // //                     {page}
// // //                   </button>
// // //                 );
// // //               })}
// // //               {totalPages > 5 && safePage < totalPages - 2 && (
// // //                 <>
// // //                   <span className="text-on-surface-variant text-xs">…</span>
// // //                   <button onClick={() => setCurrentPage(totalPages)}
// // //                     className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold bg-surface-container-highest text-on-surface-variant hover:bg-surface-variant">
// // //                     {totalPages}
// // //                   </button>
// // //                 </>
// // //               )}
// // //             </div>

// // //             <button
// // //               onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
// // //               disabled={safePage === totalPages}
// // //               className="text-xs font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
// // //               Next <ChevronRight size={16} />
// // //             </button>
// // //           </div>
// // //         </div>

// // //         {/* ── AI INSIGHTS PANEL ── */}
// // //         <div className="col-span-12 lg:col-span-4 space-y-6">
// // //           <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm relative overflow-hidden border border-indigo-50/50">
// // //             <div className="absolute top-0 left-0 w-1 h-full bg-tertiary" />

// // //             <div className="flex items-center justify-between mb-4">
// // //               <div className="flex items-center gap-2 text-tertiary">
// // //                 <Sparkles size={20} />
// // //                 <h4 className="font-bold text-sm">AI Insights</h4>
// // //               </div>
// // //               <div className="flex items-center gap-2">
// // //                 {selectedAnalysis && !selectedAnalysis.isLoading && (
// // //                   <>
// // //                     <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold
// // //                       ${selectedAnalysis.riskScore >= 70 ? 'bg-tertiary/10 text-tertiary' :
// // //                         selectedAnalysis.riskScore >= 40 ? 'bg-amber-50 text-amber-700' :
// // //                         'bg-secondary-container/20 text-secondary'}`}>
// // //                       {getRiskLabel(selectedAnalysis.riskLevel)}
// // //                     </span>
// // //                     {/* Re-analyze button — force=true bhejta hai */}
// // //                     <button
// // //                       onClick={() => selectedEvent && analyzeEvent(selectedEvent, true)}
// // //                       title="Re-analyze (fresh AI call)"
// // //                       className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container transition-colors">
// // //                       <RotateCcw size={13} />
// // //                     </button>
// // //                   </>
// // //                 )}
// // //               </div>
// // //             </div>

// // //             {!selectedEvent ? (
// // //               <p className="text-xs text-on-surface-variant">Select an event to see AI analysis</p>
// // //             ) : selectedAnalysis?.isLoading || analyzingId === selectedEvent.id ? (
// // //               <div className="space-y-4">
// // //                 <div className="flex items-center gap-2 text-primary">
// // //                   <Loader2 size={16} className="animate-spin" />
// // //                   <span className="text-xs font-bold">AI analyzing…</span>
// // //                 </div>
// // //                 <Skeleton />
// // //               </div>
// // //             ) : selectedAnalysis ? (
// // //               <>
// // //                 <div className="mb-4">
// // //                   <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Analyzing</p>
// // //                   <p className="text-sm font-semibold text-on-surface">"{selectedEvent.title}"</p>
// // //                   <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{selectedAnalysis.summary}</p>
// // //                 </div>

// // //                 <div className="space-y-3 mb-4">
// // //                   {[
// // //                     { label: 'Semantic Integrity', value: selectedAnalysis.semanticIntegrity },
// // //                     { label: 'Host Legitimacy', value: selectedAnalysis.hostLegitimacy },
// // //                     { label: 'Engagement Pattern', value: selectedAnalysis.engagementPattern },
// // //                   ].map(m => (
// // //                     <div key={m.label}>
// // //                       <div className="flex justify-between text-[11px] mb-1">
// // //                         <span className="text-on-surface-variant">{m.label}</span>
// // //                         <span className={`font-bold ${getRiskColor(100 - m.value)}`}>{m.value}/100</span>
// // //                       </div>
// // //                       <div className="w-full bg-indigo-50 h-1.5 rounded-full overflow-hidden">
// // //                         <div className={`h-full transition-all duration-700 ${getRiskBarColor(100 - m.value)}`}
// // //                           style={{ width: `${m.value}%` }} />
// // //                       </div>
// // //                     </div>
// // //                   ))}
// // //                 </div>

// // //                 {(selectedAnalysis.flags?.length ?? 0) > 0 && (
// // //                   <div className="space-y-2 mb-4">
// // //                     {selectedAnalysis.flags.map((flag, i) => (
// // //                       <div key={i} className={`p-3 rounded-lg flex items-start gap-2
// // //                         ${flag.severity === 'high' ? 'bg-tertiary/5 border-l-2 border-tertiary' : 'bg-amber-50/50 border-l-2 border-amber-400'}`}>
// // //                         <AlertCircle size={14} className={flag.severity === 'high' ? 'text-tertiary mt-0.5' : 'text-amber-600 mt-0.5'} />
// // //                         <div>
// // //                           <p className="text-xs font-bold text-on-surface">{flag.type}</p>
// // //                           <p className="text-[11px] text-on-surface-variant">{flag.description}</p>
// // //                         </div>
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 )}

// // //                 <div className="bg-surface-container-low p-4 rounded-2xl mb-4">
// // //                   <p className="text-[10px] font-bold text-primary uppercase mb-1">Recommendation</p>
// // //                   <p className="text-xs italic text-on-surface-variant">"{selectedAnalysis.recommendation}"</p>
// // //                 </div>

// // //                 <Link to={`/moderation/${selectedEvent.id}`}
// // //                   className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-bold shadow-md hover:opacity-90 text-center block">
// // //                   Review Full Report
// // //                 </Link>
// // //               </>
// // //             ) : (
// // //               <div className="text-center py-4">
// // //                 <p className="text-xs text-on-surface-variant mb-3">Click an event to analyze with AI</p>
// // //                 <button onClick={() => selectedEvent && analyzeEvent(selectedEvent)}
// // //                   className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 flex items-center gap-2 mx-auto">
// // //                   <Sparkles size={14} /> Analyze with AI
// // //                 </button>
// // //               </div>
// // //             )}
// // //           </div>

// // //           {/* Event Context */}
// // //           {selectedEvent && (
// // //             <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-indigo-50/50">
// // //               <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Event Context</h4>
// // //               <div className="space-y-2.5">
// // //                 {[
// // //                   { label: 'Category', val: selectedEvent.category },
// // //                   { label: 'Price', val: selectedEvent.ticketPrice },
// // //                   { label: 'Capacity', val: String(selectedEvent.capacity) },
// // //                   { label: '📅 Event Date', val: selectedEvent.eventDate || '—' },
// // //                   { label: '🕐 Submitted', val: selectedEvent.dateSubmitted ? new Date(selectedEvent.dateSubmitted).toLocaleDateString('en-IN') : '—' },
// // //                   { label: 'Location', val: selectedEvent.location },
// // //                 ].map(r => (
// // //                   <div key={r.label} className="flex justify-between text-sm">
// // //                     <span className="text-on-surface-variant text-xs">{r.label}</span>
// // //                     <span className="font-semibold text-right max-w-[60%] truncate text-xs">{r.val}</span>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //               <div className="mt-4 pt-4 border-t border-indigo-50 flex gap-2">
// // //                 <button onClick={() => handleAction(selectedEvent.id, 'approve')}
// // //                   className="flex-1 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1">
// // //                   <CheckCircle2 size={14} /> Approve
// // //                 </button>
// // //                 <button onClick={() => handleAction(selectedEvent.id, 'reject')}
// // //                   className="flex-1 py-2 bg-tertiary/10 text-tertiary rounded-xl text-xs font-bold hover:bg-tertiary/20 flex items-center justify-center gap-1">
// // //                   <X size={14} /> Reject
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default ModerationQueue;
// // // frontend/src/pages/ModerationQueue.tsx
// // // ✅ Tab bar: Events | Services (dono alag fetch, analyze, approve/reject)
// // // ✅ Services tab: /services API, /analyze-service endpoint
// // // ✅ AI caching works for both (MongoDB mein save hota hai)
// // // ✅ Co-Pilot, Date filters, Pagination — sab Events aur Services dono mein

// // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // import {
// //   CheckCircle2, Eye, X, ChevronLeft, ChevronRight,
// //   Sparkles, AlertCircle, Loader2, RefreshCw, Database,
// //   Bot, ToggleLeft, ToggleRight, Calendar, Clock, Info, RotateCcw,
// //   Wrench,
// // } from 'lucide-react';
// // import { Link } from 'react-router-dom';
// // import { getRiskColor, getRiskBarColor, getRiskLabel } from '../lib/openai';
// // import { getEventsFromAPI, updateEventStatusAPI, getEvents, updateEventStatus } from '../lib/mockEvents';
// // import type { Event, AIAnalysis } from '../types';

// // // ─── Service type (events ke type se alag) ───────────────────────────────────
// // interface ServiceItem {
// //   id: string;
// //   title: string;
// //   host: string;
// //   hostVerified: boolean;
// //   image: string;
// //   category: string;
// //   emoji: string;
// //   dateSubmitted: string;
// //   location: string;
// //   ticketPrice: string;
// //   rateType: string | null;
// //   capacity: number | null;
// //   description: string;
// //   status: string;
// //   attendeesCount: number;
// //   joinPolicy: string;
// //   scheduleSummary: string;
// //   meetupStyle: string | null;
// //   minDuration: string | null;
// //   aiAnalysis: AIAnalysis | null;
// //   creatorClerkId: string | null;
// //   kind: 'service';
// // }

// // // ─── Helpers ─────────────────────────────────────────────────────────────────
// // function isInRange(dateStr: string, from: string, to: string): boolean {
// //   if (!dateStr) return true;
// //   const d = new Date(dateStr).getTime();
// //   if (isNaN(d)) return true;
// //   if (from && d < new Date(from).getTime()) return false;
// //   if (to && d > new Date(to + 'T23:59:59').getTime()) return false;
// //   return true;
// // }

// // function toISO(date: Date) {
// //   return date.toISOString().slice(0, 10);
// // }

// // // ─── Sub-components ──────────────────────────────────────────────────────────
// // const Skeleton = () => (
// //   <div className="animate-pulse space-y-3">
// //     <div className="h-3 bg-indigo-100 rounded w-3/4" />
// //     <div className="h-3 bg-indigo-100 rounded w-1/2" />
// //     <div className="h-8 bg-indigo-100 rounded w-full" />
// //   </div>
// // );

// // const RiskBadge = ({ analysis }: { analysis?: AIAnalysis }) => {
// //   if (!analysis) return <span className="text-[10px] text-on-surface-variant">Not analyzed</span>;
// //   if (analysis.isLoading) return <Loader2 size={14} className="animate-spin text-primary" />;
// //   return (
// //     <div className="flex flex-col gap-1">
// //       <span className={`text-[11px] font-bold ${getRiskColor(analysis.riskScore ?? 0)}`}>
// //         {analysis.riskScore ?? '—'}%
// //       </span>
// //       <div className="w-full bg-indigo-100 h-1.5 rounded-full overflow-hidden">
// //         <div
// //           className={`h-full transition-all duration-700 ${getRiskBarColor(analysis.riskScore ?? 0)}`}
// //           style={{ width: `${analysis.riskScore ?? 0}%` }}
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // const statusStyle = (s: string) =>
// //   ({
// //     flagged: 'text-tertiary bg-tertiary-container/10',
// //     pending: 'text-on-surface-variant bg-surface-container-highest',
// //     under_review: 'text-amber-700 bg-amber-100',
// //     approved: 'text-on-secondary-container bg-secondary-container',
// //     rejected: 'text-tertiary bg-tertiary/10',
// //     active: 'text-on-secondary-container bg-secondary-container',
// //     paused: 'text-amber-700 bg-amber-100',
// //   }[s] || 'text-on-surface-variant bg-surface-container-highest');

// // const statusLabel = (s: string) =>
// //   ({
// //     pending: 'PENDING', flagged: 'FLAGGED', under_review: 'UNDER REVIEW',
// //     approved: 'APPROVED', rejected: 'REJECTED', active: 'ACTIVE', paused: 'PAUSED',
// //   }[s] || s.toUpperCase());

// // // ─── Tab types ───────────────────────────────────────────────────────────────
// // type ActiveTab = 'events' | 'services';

// // // ═══════════════════════════════════════════════════════════════════════════════
// // // MAIN COMPONENT
// // // ═══════════════════════════════════════════════════════════════════════════════
// // const ModerationQueue = () => {

// //   // ── Tab state ──
// //   const [activeTab, setActiveTab] = useState<ActiveTab>('events');

// //   // ── Events state ──
// //   const [events, setEvents] = useState<Event[]>([]);
// //   const [eventAnalyses, setEventAnalyses] = useState<Record<string, AIAnalysis>>({});
// //   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
// //   const [eventsLoading, setEventsLoading] = useState(true);
// //   const [eventDataSource, setEventDataSource] = useState<'api' | 'local'>('api');

// //   // ── Services state ──
// //   const [services, setServices] = useState<ServiceItem[]>([]);
// //   const [serviceAnalyses, setServiceAnalyses] = useState<Record<string, AIAnalysis>>({});
// //   const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
// //   const [servicesLoading, setServicesLoading] = useState(false);
// //   const [servicesLoaded, setServicesLoaded] = useState(false); // lazy load

// //   // ── Filters ──
// //   const [filterStatus, setFilterStatus] = useState('all');
// //   const [startDateFrom, setStartDateFrom] = useState('');
// //   const [startDateTo, setStartDateTo] = useState('');
// //   const [createdFrom, setCreatedFrom] = useState('');
// //   const [createdTo, setCreatedTo] = useState('');
// //   const [showDateFilters, setShowDateFilters] = useState(false);

// //   // ── Pagination ──
// //   const ITEMS_PER_PAGE = 5;
// //   const [currentPage, setCurrentPage] = useState(1);

// //   // ── AI ──
// //   const [analyzingId, setAnalyzingId] = useState<string | null>(null);

// //   // ── Co-Pilot ──
// //   const [copilotMode, setCopilotMode] = useState(false);
// //   const [copilotRunning, setCopilotRunning] = useState(false);
// //   const [copilotLog, setCopilotLog] = useState<string[]>([]);
// //   const [autoApproveThreshold, setAutoApproveThreshold] = useState(30);
// //   const [autoRejectThreshold, setAutoRejectThreshold] = useState(70);
// //   const copilotStopRef = useRef(false);

// //   // ── Toast ──
// //   const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
// //   const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
// //     setNotification({ msg, type });
// //     setTimeout(() => setNotification(null), 4000);
// //   };

// //   // ─── Load Events ─────────────────────────────────────────────────────────────
// //   const loadEvents = async () => {
// //     setEventsLoading(true);
// //     try {
// //       const apiEvents = await getEventsFromAPI();
// //       if (apiEvents.length > 0) {
// //         setEvents(apiEvents);
// //         setSelectedEvent(apiEvents[0]);
// //         setEventDataSource('api');

// //         // Pre-load cached AI analyses from MongoDB
// //         const cached: Record<string, AIAnalysis> = {};
// //         for (const ev of apiEvents) {
// //           if ((ev as any).aiAnalysis?.riskScore !== undefined) {
// //             cached[ev.id] = { ...(ev as any).aiAnalysis, isLoading: false };
// //           }
// //         }
// //         if (Object.keys(cached).length > 0) {
// //           setEventAnalyses(prev => ({ ...cached, ...prev }));
// //           console.log(`📦 Loaded ${Object.keys(cached).length} cached event analyses`);
// //         }
// //       } else {
// //         const local = getEvents();
// //         setEvents(local);
// //         if (local.length > 0) setSelectedEvent(local[0]);
// //         setEventDataSource('local');
// //       }
// //     } catch {
// //       const local = getEvents();
// //       setEvents(local);
// //       if (local.length > 0) setSelectedEvent(local[0]);
// //       setEventDataSource('local');
// //     } finally {
// //       setEventsLoading(false);
// //     }
// //   };

// //   // ─── Load Services ────────────────────────────────────────────────────────────
// //   const loadServices = async () => {
// //     setServicesLoading(true);
// //     try {
// //       const res = await fetch('http://localhost:5006/services');
// //       if (!res.ok) throw new Error('Services API failed');
// //       const data: ServiceItem[] = await res.json();
// //       setServices(data);
// //       if (data.length > 0) setSelectedService(data[0]);

// //       // Pre-load cached AI analyses
// //       const cached: Record<string, AIAnalysis> = {};
// //       for (const sv of data) {
// //         if (sv.aiAnalysis?.riskScore !== undefined) {
// //           cached[sv.id] = { ...sv.aiAnalysis, isLoading: false };
// //         }
// //       }
// //       if (Object.keys(cached).length > 0) {
// //         setServiceAnalyses(prev => ({ ...cached, ...prev }));
// //         console.log(`📦 Loaded ${Object.keys(cached).length} cached service analyses`);
// //       }
// //       setServicesLoaded(true);
// //     } catch (err) {
// //       console.error('Services load failed:', err);
// //       setServices([]);
// //       setServicesLoaded(true);
// //     } finally {
// //       setServicesLoading(false);
// //     }
// //   };

// //   useEffect(() => { loadEvents(); }, []);

// //   // Tab switch hone pe services lazy load karo
// //   useEffect(() => {
// //     if (activeTab === 'services' && !servicesLoaded) {
// //       loadServices();
// //     }
// //   }, [activeTab]);

// //   // Filter/tab change hone pe page 1 pe wapas jao
// //   useEffect(() => { setCurrentPage(1); }, [filterStatus, startDateFrom, startDateTo, createdFrom, createdTo, activeTab]);

// //   // ─── Analyze Event ────────────────────────────────────────────────────────────
// //   const analyzeEvent = useCallback(async (event: Event, force = false): Promise<AIAnalysis | null> => {
// //     setAnalyzingId(event.id);
// //     setEventAnalyses(prev => ({
// //       ...prev,
// //       [event.id]: { ...(prev[event.id] || {}), isLoading: true } as AIAnalysis,
// //     }));
// //     try {
// //       const res = await fetch('http://localhost:5006/analyze', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ event, force }),
// //       });
// //       const data = await res.json();
// //       const safe: AIAnalysis = {
// //         riskScore: data.riskScore ?? 0,
// //         riskLevel: data.riskLevel ?? 'low',
// //         semanticIntegrity: data.semanticIntegrity ?? 80,
// //         hostLegitimacy: data.hostLegitimacy ?? 80,
// //         engagementPattern: data.engagementPattern ?? 80,
// //         flags: Array.isArray(data.flags) ? data.flags : [],
// //         summary: data.summary ?? '',
// //         recommendation: data.recommendation ?? '',
// //         scannedAt: data.scannedAt ?? new Date().toISOString(),
// //         isLoading: false,
// //       };
// //       setEventAnalyses(prev => ({ ...prev, [event.id]: safe }));
// //       return safe;
// //     } catch (err) {
// //       console.error('Event analysis error:', err);
// //       return null;
// //     } finally {
// //       setAnalyzingId(null);
// //     }
// //   }, []);

// //   // ─── Analyze Service ──────────────────────────────────────────────────────────
// //   // /analyze-service endpoint use karta hai — service-specific prompt
// //   const analyzeService = useCallback(async (service: ServiceItem, force = false): Promise<AIAnalysis | null> => {
// //     setAnalyzingId(service.id);
// //     setServiceAnalyses(prev => ({
// //       ...prev,
// //       [service.id]: { ...(prev[service.id] || {}), isLoading: true } as AIAnalysis,
// //     }));
// //     try {
// //       const res = await fetch('http://localhost:5006/analyze-service', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ service, force }),
// //       });
// //       const data = await res.json();
// //       const safe: AIAnalysis = {
// //         riskScore: data.riskScore ?? 0,
// //         riskLevel: data.riskLevel ?? 'low',
// //         semanticIntegrity: data.semanticIntegrity ?? 80,
// //         hostLegitimacy: data.hostLegitimacy ?? 80,
// //         engagementPattern: data.engagementPattern ?? 80,
// //         flags: Array.isArray(data.flags) ? data.flags : [],
// //         summary: data.summary ?? '',
// //         recommendation: data.recommendation ?? '',
// //         scannedAt: data.scannedAt ?? new Date().toISOString(),
// //         isLoading: false,
// //       };
// //       setServiceAnalyses(prev => ({ ...prev, [service.id]: safe }));
// //       return safe;
// //     } catch (err) {
// //       console.error('Service analysis error:', err);
// //       return null;
// //     } finally {
// //       setAnalyzingId(null);
// //     }
// //   }, []);

// //   // ─── Approve/Reject Event ─────────────────────────────────────────────────────
// //   const handleEventAction = async (eventId: string, action: 'approve' | 'reject', silent = false) => {
// //     const newStatus = action === 'approve' ? 'approved' : 'rejected';
// //     setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: newStatus } : e));

// //     if (eventDataSource === 'api') {
// //       const ok = await updateEventStatusAPI(eventId, newStatus);
// //       if (!ok && !silent) {
// //         showToast('Failed to update in MongoDB', 'error');
// //         setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'pending' } : e));
// //         return;
// //       }
// //     } else {
// //       updateEventStatus(eventId, newStatus);
// //     }

// //     if (!silent) {
// //       showToast(
// //         action === 'approve' ? '✓ Event approved & listed on MyApp!' : '✗ Event rejected',
// //         action === 'approve' ? 'success' : 'error',
// //       );
// //     }

// //     if (selectedEvent?.id === eventId) {
// //       const next = events.find(e => e.id !== eventId && e.status === 'pending');
// //       if (next) setSelectedEvent(next);
// //     }
// //   };

// //   // ─── Approve/Reject Service ───────────────────────────────────────────────────
// //   const handleServiceAction = async (serviceId: string, action: 'approve' | 'reject', silent = false) => {
// //     const newStatus = action === 'approve' ? 'approved' : 'rejected';
// //     setServices(prev => prev.map(s => s.id === serviceId ? { ...s, status: newStatus } : s));

// //     try {
// //       const res = await fetch(`http://localhost:5006/services/${serviceId}/status`, {
// //         method: 'PATCH',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ status: newStatus }),
// //       });
// //       if (!res.ok && !silent) {
// //         showToast('Failed to update service in MongoDB', 'error');
// //         setServices(prev => prev.map(s => s.id === serviceId ? { ...s, status: 'pending' } : s));
// //         return;
// //       }
// //     } catch {
// //       if (!silent) showToast('Network error updating service', 'error');
// //     }

// //     if (!silent) {
// //       showToast(
// //         action === 'approve' ? '✓ Service approved & live on MyApp!' : '✗ Service rejected',
// //         action === 'approve' ? 'success' : 'error',
// //       );
// //     }

// //     if (selectedService?.id === serviceId) {
// //       const next = services.find(s => s.id !== serviceId && s.status === 'pending');
// //       if (next) setSelectedService(next);
// //     }
// //   };

// //   // ─── Co-Pilot ─────────────────────────────────────────────────────────────────
// //   const runCopilot = async () => {
// //     const isEvents = activeTab === 'events';
// //     const pending = isEvents
// //       ? events.filter(e => e.status === 'pending' || e.status === 'flagged')
// //       : services.filter(s => s.status === 'pending' || s.status === 'flagged');

// //     if (!pending.length) { showToast('No pending items to process', 'info'); return; }

// //     setCopilotRunning(true);
// //     copilotStopRef.current = false;
// //     setCopilotLog([
// //       `🤖 Co-Pilot started — ${pending.length} ${isEvents ? 'events' : 'services'} to process`,
// //       `📊 Approve if risk ≤ ${autoApproveThreshold}% | Reject if risk ≥ ${autoRejectThreshold}%`,
// //     ]);

// //     let approved = 0, rejected = 0, skipped = 0;

// //     for (const item of pending) {
// //       if (copilotStopRef.current) { setCopilotLog(p => [...p, '⏹ Stopped by user']); break; }

// //       setCopilotLog(p => [...p, `🔍 Analyzing: "${item.title}"...`]);

// //       const analysis = isEvents
// //         ? await analyzeEvent(item as Event)
// //         : await analyzeService(item as ServiceItem);

// //       if (!analysis) { setCopilotLog(p => [...p, '  ⚠️ Analysis failed — skipping']); skipped++; continue; }

// //       const score = analysis.riskScore ?? 50;
// //       if (score <= autoApproveThreshold) {
// //         isEvents
// //           ? await handleEventAction(item.id, 'approve', true)
// //           : await handleServiceAction(item.id, 'approve', true);
// //         setCopilotLog(p => [...p, `  ✅ AUTO-APPROVED — ${score}% risk — "${item.title}"`]);
// //         approved++;
// //       } else if (score >= autoRejectThreshold) {
// //         isEvents
// //           ? await handleEventAction(item.id, 'reject', true)
// //           : await handleServiceAction(item.id, 'reject', true);
// //         setCopilotLog(p => [...p, `  ❌ AUTO-REJECTED — ${score}% risk — "${item.title}"`]);
// //         rejected++;
// //       } else {
// //         setCopilotLog(p => [...p, `  🟡 NEEDS REVIEW — ${score}% risk`]);
// //         skipped++;
// //       }

// //       await new Promise(r => setTimeout(r, 400));
// //     }

// //     setCopilotLog(p => [...p, '', '📋 Done!', `  ✅ Approved: ${approved} | ❌ Rejected: ${rejected} | 🟡 Review: ${skipped}`]);
// //     setCopilotRunning(false);
// //     if (isEvents) loadEvents(); else loadServices();
// //   };

// //   // ─── Filter & Paginate ────────────────────────────────────────────────────────
// //   const currentItems = activeTab === 'events' ? events : services;

// //   const filtered = currentItems.filter((item: any) => {
// //     if (filterStatus !== 'all' && item.status !== filterStatus) return false;
// //     if (startDateFrom || startDateTo) {
// //       if (!isInRange(item.eventDate || '', startDateFrom, startDateTo)) return false;
// //     }
// //     if (createdFrom || createdTo) {
// //       const ds = typeof item.dateSubmitted === 'string' ? item.dateSubmitted : String(item.dateSubmitted || '');
// //       if (!isInRange(ds, createdFrom, createdTo)) return false;
// //     }
// //     return true;
// //   });

// //   const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
// //   const safePage = Math.min(currentPage, totalPages);
// //   const pageItems = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

// //   const hasDateFilter = startDateFrom || startDateTo || createdFrom || createdTo;
// //   const pendingCount = currentItems.filter((i: any) => i.status === 'pending').length;
// //   const flaggedCount = currentItems.filter((i: any) => i.status === 'flagged').length;

// //   // Currently selected item + its analysis
// //   const selectedItem = activeTab === 'events' ? selectedEvent : selectedService;
// //   const selectedAnalysis = selectedItem
// //     ? activeTab === 'events'
// //       ? eventAnalyses[selectedItem.id]
// //       : serviceAnalyses[selectedItem.id]
// //     : null;

// //   const isLoading = activeTab === 'events' ? eventsLoading : servicesLoading;

// //   // ─── RENDER ───────────────────────────────────────────────────────────────────
// //   return (
// //     <div className="space-y-6">

// //       {/* Toast */}
// //       {notification && (
// //         <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg font-bold text-sm text-white transition-all
// //           ${notification.type === 'success' ? 'bg-secondary' : notification.type === 'error' ? 'bg-tertiary' : 'bg-primary'}`}>
// //           {notification.msg}
// //         </div>
// //       )}

// //       {/* ── HEADER ── */}
// //       <div className="flex justify-between items-end flex-wrap gap-4">
// //         <div>
// //           <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 flex items-center gap-1.5">
// //             <Database size={10} />
// //             {activeTab === 'events'
// //               ? (eventDataSource === 'api' ? 'Live — MyApp MongoDB' : 'LocalStorage (backend offline)')
// //               : 'Live — MyApp MongoDB (Services)'}
// //           </span>
// //           <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">Moderation Queue</h3>
// //           <p className="text-on-surface-variant text-sm mt-1">
// //             {activeTab === 'events'
// //               ? 'Events awaiting AI review & approval before listing on MyApp.'
// //               : 'Services awaiting AI review & approval before listing on MyApp.'}
// //           </p>
// //         </div>

// //         <div className="flex gap-3 items-center flex-wrap">
// //           <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
// //             <p className="text-[10px] text-on-surface-variant font-bold uppercase">Pending</p>
// //             <p className="text-xl font-extrabold text-primary">{pendingCount}</p>
// //           </div>
// //           <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
// //             <p className="text-[10px] text-on-surface-variant font-bold uppercase">Flagged</p>
// //             <p className="text-xl font-extrabold text-tertiary">{flaggedCount}</p>
// //           </div>

// //           {/* Co-Pilot */}
// //           <button onClick={() => setCopilotMode(p => !p)}
// //             className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all
// //               ${copilotMode ? 'bg-indigo-900 border-indigo-700 text-white' : 'bg-white border-indigo-200 text-indigo-700 hover:border-indigo-400'}`}>
// //             <Bot size={16} /> Co-Pilot {copilotMode ? 'ON' : 'OFF'}
// //             {copilotMode ? <ToggleRight size={18} className="text-indigo-300" /> : <ToggleLeft size={18} className="text-indigo-400" />}
// //           </button>

// //           {/* Refresh */}
// //           <button
// //             onClick={() => {
// //               if (activeTab === 'events') { loadEvents(); showToast('Events refreshed!', 'info'); }
// //               else { loadServices(); showToast('Services refreshed!', 'info'); }
// //             }}
// //             disabled={isLoading}
// //             className="bg-white border border-primary text-primary px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/5 disabled:opacity-50">
// //             <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
// //             {isLoading ? 'Loading...' : 'Refresh'}
// //           </button>
// //         </div>
// //       </div>

// //       {/* ── TAB BAR ── */}
// //       <div className="flex gap-2">
// //         <button
// //           onClick={() => setActiveTab('events')}
// //           className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2
// //             ${activeTab === 'events'
// //               ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
// //               : 'bg-white border-surface-container-highest text-on-surface-variant hover:border-primary/30'}`}
// //         >
// //           <Calendar size={15} />
// //           Events
// //           <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
// //             ${activeTab === 'events' ? 'bg-white/20 text-white' : 'bg-surface-container-highest text-on-surface-variant'}`}>
// //             {events.length}
// //           </span>
// //         </button>

// //         <button
// //           onClick={() => setActiveTab('services')}
// //           className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2
// //             ${activeTab === 'services'
// //               ? 'bg-secondary text-white border-secondary shadow-sm shadow-secondary/20'
// //               : 'bg-white border-surface-container-highest text-on-surface-variant hover:border-secondary/30'}`}
// //         >
// //           <Wrench size={15} />
// //           Services
// //           {servicesLoaded && (
// //             <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
// //               ${activeTab === 'services' ? 'bg-white/20 text-white' : 'bg-surface-container-highest text-on-surface-variant'}`}>
// //               {services.length}
// //             </span>
// //           )}
// //         </button>
// //       </div>

// //       {/* ── CO-PILOT PANEL ── */}
// //       {copilotMode && (
// //         <div className="bg-indigo-950 rounded-3xl p-6 border border-indigo-800 shadow-xl space-y-5">
// //           <div className="flex items-center gap-3 flex-wrap">
// //             <div className="w-10 h-10 bg-indigo-700 rounded-2xl flex items-center justify-center">
// //               <Bot size={20} className="text-white" />
// //             </div>
// //             <div>
// //               <h4 className="text-white font-bold text-base">AI Co-Pilot Mode</h4>
// //               <p className="text-indigo-300 text-xs">
// //                 Auto-analyzes pending {activeTab} and approves/rejects based on risk score
// //               </p>
// //             </div>
// //             <div className="ml-auto bg-indigo-900/60 border border-indigo-700/50 rounded-xl px-4 py-3 max-w-xs">
// //               <p className="text-indigo-200 text-[11px] leading-relaxed flex items-start gap-2">
// //                 <Info size={12} className="flex-shrink-0 mt-0.5 text-indigo-400" />
// //                 Lower "approve threshold" = stricter moderation. Middle zone needs human review.
// //               </p>
// //             </div>
// //           </div>

// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
// //             <div className="bg-indigo-900/50 rounded-2xl p-4 border border-indigo-800/50">
// //               <div className="flex justify-between mb-2">
// //                 <label className="text-[11px] font-bold text-green-400 uppercase flex items-center gap-1"><CheckCircle2 size={12} /> Auto-Approve if Risk ≤</label>
// //                 <span className="text-green-400 font-extrabold text-sm">{autoApproveThreshold}%</span>
// //               </div>
// //               <input type="range" min={0} max={60} step={5} value={autoApproveThreshold}
// //                 onChange={e => setAutoApproveThreshold(Number(e.target.value))} className="w-full accent-green-500" />
// //               <p className="text-indigo-400 text-[10px] mt-1.5">Risk ≤ {autoApproveThreshold}% → listed on MyApp automatically</p>
// //             </div>
// //             <div className="bg-indigo-900/50 rounded-2xl p-4 border border-indigo-800/50">
// //               <div className="flex justify-between mb-2">
// //                 <label className="text-[11px] font-bold text-red-400 uppercase flex items-center gap-1"><X size={12} /> Auto-Reject if Risk ≥</label>
// //                 <span className="text-red-400 font-extrabold text-sm">{autoRejectThreshold}%</span>
// //               </div>
// //               <input type="range" min={40} max={100} step={5} value={autoRejectThreshold}
// //                 onChange={e => setAutoRejectThreshold(Number(e.target.value))} className="w-full accent-red-500" />
// //               <p className="text-indigo-400 text-[10px] mt-1.5">Risk ≥ {autoRejectThreshold}% → auto-rejected</p>
// //             </div>
// //           </div>

// //           {/* Risk band */}
// //           <div>
// //             <p className="text-indigo-400 text-[10px] font-bold uppercase mb-1.5">Risk Band</p>
// //             <div className="h-6 rounded-full overflow-hidden flex">
// //               <div className="bg-green-500/80 flex items-center justify-center text-[9px] font-bold text-white" style={{ width: `${autoApproveThreshold}%` }}>{autoApproveThreshold > 12 ? 'AUTO-APPROVE' : ''}</div>
// //               <div className="bg-amber-500/80 flex items-center justify-center text-[9px] font-bold text-white" style={{ width: `${autoRejectThreshold - autoApproveThreshold}%` }}>{autoRejectThreshold - autoApproveThreshold > 15 ? 'HUMAN REVIEW' : ''}</div>
// //               <div className="bg-red-500/80 flex-1 flex items-center justify-center text-[9px] font-bold text-white">{100 - autoRejectThreshold > 5 ? 'AUTO-REJECT' : ''}</div>
// //             </div>
// //           </div>

// //           <div className="flex gap-3">
// //             {!copilotRunning ? (
// //               <button onClick={runCopilot} disabled={pendingCount === 0}
// //                 className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 disabled:opacity-40">
// //                 <Bot size={16} /> Run Co-Pilot on {pendingCount} Pending {activeTab === 'events' ? 'Events' : 'Services'}
// //               </button>
// //             ) : (
// //               <button onClick={() => { copilotStopRef.current = true; setCopilotRunning(false); }}
// //                 className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90">
// //                 <X size={16} /> Stop Co-Pilot
// //               </button>
// //             )}
// //           </div>

// //           {copilotLog.length > 0 && (
// //             <div className="bg-black/40 rounded-2xl p-4 max-h-44 overflow-y-auto font-mono space-y-0.5">
// //               {copilotLog.map((line, i) => (
// //                 <div key={i} className={`text-[11px] leading-relaxed ${
// //                   line.includes('AUTO-APPROVED') ? 'text-green-400' :
// //                   line.includes('AUTO-REJECTED') ? 'text-red-400' :
// //                   line.includes('NEEDS REVIEW') ? 'text-amber-400' :
// //                   line.includes('Done!') ? 'text-white font-bold' : 'text-indigo-300'
// //                 }`}>{line || '\u00A0'}</div>
// //               ))}
// //               {copilotRunning && <div className="flex items-center gap-2 text-indigo-300 text-[11px]"><Loader2 size={10} className="animate-spin" /> Processing…</div>}
// //             </div>
// //           )}
// //         </div>
// //       )}

// //       {/* ── FILTERS ── */}
// //       <div className="bg-surface-container-low p-4 rounded-2xl space-y-3">
// //         <div className="flex flex-wrap items-end gap-4">
// //           <div className="flex-1 min-w-[140px]">
// //             <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">Status</label>
// //             <select className="w-full bg-surface-container-highest border-none rounded-xl text-sm p-2"
// //               value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
// //               <option value="all">All Status</option>
// //               <option value="pending">Pending</option>
// //               <option value="flagged">Flagged</option>
// //               <option value="approved">Approved</option>
// //               <option value="rejected">Rejected</option>
// //               {activeTab === 'services' && <option value="active">Active</option>}
// //               {activeTab === 'services' && <option value="paused">Paused</option>}
// //             </select>
// //           </div>

// //           <button onClick={() => setShowDateFilters(p => !p)}
// //             className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all
// //               ${showDateFilters || hasDateFilter ? 'bg-primary text-white border-primary' : 'bg-surface-container-highest text-primary border-primary/20 hover:border-primary/50'}`}>
// //             <Calendar size={14} /> Date Filters
// //             {hasDateFilter && <span className="bg-white/20 text-[9px] px-1.5 py-0.5 rounded-full font-bold">ON</span>}
// //           </button>

// //           {hasDateFilter && (
// //             <button onClick={() => { setStartDateFrom(''); setStartDateTo(''); setCreatedFrom(''); setCreatedTo(''); }}
// //               className="text-xs text-tertiary font-bold hover:underline flex items-center gap-1">
// //               <X size={12} /> Clear dates
// //             </button>
// //           )}
// //         </div>

// //         {showDateFilters && (
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-indigo-100/30">
// //             {/* Event Start Date — only relevant for events */}
// //             {activeTab === 'events' && (
// //               <div className="bg-surface-container-lowest rounded-2xl p-4 border border-indigo-50/50">
// //                 <p className="text-[11px] font-bold text-primary mb-1 flex items-center gap-1.5"><Calendar size={11} /> Event Start Date</p>
// //                 <p className="text-[10px] text-on-surface-variant mb-3">Event kab hoga</p>
// //                 <div className="grid grid-cols-2 gap-2 mb-2">
// //                   <div><label className="text-[10px] text-on-surface-variant font-bold block mb-1">From</label>
// //                     <input type="date" value={startDateFrom} onChange={e => setStartDateFrom(e.target.value)} className="w-full bg-surface-container-high border-none rounded-xl text-xs p-2 focus:ring-2 ring-primary/20" /></div>
// //                   <div><label className="text-[10px] text-on-surface-variant font-bold block mb-1">To</label>
// //                     <input type="date" value={startDateTo} onChange={e => setStartDateTo(e.target.value)} className="w-full bg-surface-container-high border-none rounded-xl text-xs p-2 focus:ring-2 ring-primary/20" /></div>
// //                 </div>
// //                 <div className="flex gap-2 flex-wrap">
// //                   {[{ l: 'Today', f: toISO(new Date()), t: toISO(new Date()) }, { l: 'This Week', f: toISO(new Date()), t: toISO(new Date(Date.now() + 7 * 86400000)) }].map(p => (
// //                     <button key={p.l} onClick={() => { setStartDateFrom(p.f); setStartDateTo(p.t); }}
// //                       className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold hover:bg-primary/20">{p.l}</button>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}

// //             {/* Submitted Date */}
// //             <div className="bg-surface-container-lowest rounded-2xl p-4 border border-indigo-50/50">
// //               <p className="text-[11px] font-bold text-secondary mb-1 flex items-center gap-1.5"><Clock size={11} /> Submitted Date</p>
// //               <p className="text-[10px] text-on-surface-variant mb-3">Admin ko kab mila</p>
// //               <div className="grid grid-cols-2 gap-2 mb-2">
// //                 <div><label className="text-[10px] text-on-surface-variant font-bold block mb-1">From</label>
// //                   <input type="date" value={createdFrom} onChange={e => setCreatedFrom(e.target.value)} className="w-full bg-surface-container-high border-none rounded-xl text-xs p-2 focus:ring-2 ring-primary/20" /></div>
// //                 <div><label className="text-[10px] text-on-surface-variant font-bold block mb-1">To</label>
// //                   <input type="date" value={createdTo} onChange={e => setCreatedTo(e.target.value)} className="w-full bg-surface-container-high border-none rounded-xl text-xs p-2 focus:ring-2 ring-primary/20" /></div>
// //               </div>
// //               <div className="flex gap-2 flex-wrap">
// //                 {[{ l: 'Today', f: toISO(new Date()), t: toISO(new Date()) }, { l: 'Last 7 days', f: toISO(new Date(Date.now() - 7 * 86400000)), t: toISO(new Date()) }].map(p => (
// //                   <button key={p.l} onClick={() => { setCreatedFrom(p.f); setCreatedTo(p.t); }}
// //                     className="text-[10px] px-2.5 py-1 rounded-full bg-secondary/10 text-secondary font-bold hover:bg-secondary/20">{p.l}</button>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* ── MAIN GRID ── */}
// //       <div className="grid grid-cols-12 gap-6 items-start">

// //         {/* Table */}
// //         <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-indigo-50/50">
// //           <div className="px-6 py-4 bg-indigo-50/30 flex justify-between items-center border-b border-indigo-50/50">
// //             <div className="flex items-center gap-3 flex-wrap">
// //               <span className="text-sm font-bold text-indigo-900">
// //                 {filtered.length} {activeTab}
// //                 {filtered.length !== currentItems.length && <span className="text-on-surface-variant font-normal"> (of {currentItems.length})</span>}
// //               </span>
// //               <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'events' && eventDataSource === 'api' ? 'bg-secondary/10 text-secondary' : activeTab === 'services' ? 'bg-secondary/10 text-secondary' : 'bg-amber-50 text-amber-700'}`}>
// //                 {activeTab === 'events' ? (eventDataSource === 'api' ? 'MONGODB LIVE' : 'LOCAL') : 'MONGODB LIVE'}
// //               </span>
// //             </div>
// //             <button onClick={() => { if (activeTab === 'events') loadEvents(); else loadServices(); }} disabled={isLoading}
// //               className="text-xs font-bold text-primary flex items-center gap-1 hover:underline disabled:opacity-50">
// //               <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} /> Refresh
// //             </button>
// //           </div>

// //           <div className="overflow-x-auto">
// //             <table className="w-full border-collapse">
// //               <thead>
// //                 <tr className="text-left border-b border-indigo-50">
// //                   <th className="pl-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
// //                     {activeTab === 'events' ? 'Event & Host' : 'Service & Provider'}
// //                   </th>
// //                   {activeTab === 'events' && (
// //                     <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
// //                       <span className="flex flex-col gap-0.5">
// //                         <span className="flex items-center gap-1"><Calendar size={9} className="text-primary" /> Event Date</span>
// //                         <span className="flex items-center gap-1"><Clock size={9} className="text-on-surface-variant" /> Submitted</span>
// //                       </span>
// //                     </th>
// //                   )}
// //                   {activeTab === 'services' && (
// //                     <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Details</th>
// //                   )}
// //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">AI Flags</th>
// //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider w-24">Risk</th>
// //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
// //                   <th className="pr-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-indigo-50/30">
// //                 {isLoading ? (
// //                   <tr><td colSpan={6} className="py-16 text-center">
// //                     <Loader2 size={28} className="animate-spin text-primary mx-auto mb-2" />
// //                     <p className="text-sm text-on-surface-variant">Fetching {activeTab} from database…</p>
// //                   </td></tr>
// //                 ) : activeTab === 'services' && !servicesLoaded ? (
// //                   <tr><td colSpan={6} className="py-16 text-center">
// //                     <Loader2 size={28} className="animate-spin text-secondary mx-auto mb-2" />
// //                     <p className="text-sm text-on-surface-variant">Loading services…</p>
// //                   </td></tr>
// //                 ) : pageItems.length === 0 ? (
// //                   <tr><td colSpan={6} className="py-16 text-center text-sm text-on-surface-variant">
// //                     {currentItems.length === 0
// //                       ? `No ${activeTab} found. Make sure backend is running on port 5006.`
// //                       : <span>No {activeTab} match filters. <button onClick={() => { setFilterStatus('all'); setStartDateFrom(''); setStartDateTo(''); setCreatedFrom(''); setCreatedTo(''); }} className="text-primary font-bold hover:underline">Clear all filters</button></span>
// //                     }
// //                   </td></tr>
// //                 ) : pageItems.map((item: any) => {
// //                   const isEvent = item.kind !== 'service';
// //                   const analysis = isEvent ? eventAnalyses[item.id] : serviceAnalyses[item.id];
// //                   const isSelected = isEvent ? selectedEvent?.id === item.id : selectedService?.id === item.id;

// //                   return (
// //                     <tr key={item.id}
// //                       onClick={() => {
// //                         if (isEvent) {
// //                           setSelectedEvent(item);
// //                           if (!eventAnalyses[item.id]) analyzeEvent(item);
// //                         } else {
// //                           setSelectedService(item);
// //                           if (!serviceAnalyses[item.id]) analyzeService(item);
// //                         }
// //                       }}
// //                       className={`transition-colors cursor-pointer ${isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-surface-container-low/50'}`}>

// //                       {/* Item + Host */}
// //                       <td className="pl-6 py-4">
// //                         <div className="flex items-center gap-3">
// //                           <img src={item.image} alt={item.title}
// //                             className="w-12 h-12 rounded-xl object-cover shadow-sm flex-shrink-0"
// //                             referrerPolicy="no-referrer"
// //                             onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/48x48/e8eaf6/4355b9?text=${isEvent ? 'E' : 'S'}`; }}
// //                           />
// //                           <div>
// //                             <p className="text-sm font-bold text-slate-900 leading-tight">{item.title}</p>
// //                             <p className="text-[11px] text-on-surface-variant mt-0.5">
// //                               {isEvent ? 'Host' : 'Provider'}: <span className="font-semibold">{item.host}</span>
// //                               {item.hostVerified && <span className="ml-1 text-[9px] bg-secondary-container text-on-secondary-container px-1 py-0.5 rounded font-bold">✓</span>}
// //                             </p>
// //                             <p className="text-[10px] text-on-surface-variant">
// //                               {isEvent ? item.category : `${item.emoji || '🛠️'} ${item.ticketPrice}`}
// //                             </p>
// //                           </div>
// //                         </div>
// //                       </td>

// //                       {/* Dates (events) or Details (services) */}
// //                       <td className="px-4 py-4">
// //                         {isEvent ? (
// //                           <div className="space-y-1">
// //                             <div className="flex items-center gap-1">
// //                               <Calendar size={9} className="text-primary flex-shrink-0" />
// //                               <span className="text-[10px] font-bold text-on-surface">{item.eventDate || '—'}</span>
// //                             </div>
// //                             <div className="flex items-center gap-1">
// //                               <Clock size={9} className="text-on-surface-variant flex-shrink-0" />
// //                               <span className="text-[10px] text-on-surface-variant">
// //                                 {item.dateSubmitted ? new Date(item.dateSubmitted).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'}
// //                               </span>
// //                             </div>
// //                           </div>
// //                         ) : (
// //                           <div className="space-y-1">
// //                             <div className="text-[10px] font-bold text-on-surface">{item.scheduleSummary || '—'}</div>
// //                             {item.minDuration && <div className="text-[10px] text-on-surface-variant">Min: {item.minDuration}</div>}
// //                             {item.meetupStyle && <div className="text-[10px] text-on-surface-variant capitalize">{item.meetupStyle.replace('_', ' ')}</div>}
// //                           </div>
// //                         )}
// //                       </td>

// //                       {/* AI Flags */}
// //                       <td className="px-4 py-4">
// //                         {analysis?.isLoading || analyzingId === item.id ? (
// //                           <Loader2 size={14} className="animate-spin text-primary" />
// //                         ) : (analysis?.flags?.length ?? 0) > 0 ? (
// //                           <div className="flex flex-wrap gap-1">
// //                             {analysis!.flags.slice(0, 2).map((flag, i) => (
// //                               <span key={i} className={`px-2 py-0.5 rounded-md text-[10px] font-bold
// //                                 ${flag.severity === 'high' ? 'bg-tertiary/10 text-tertiary' :
// //                                   flag.severity === 'medium' ? 'bg-amber-50 text-amber-700' :
// //                                   'bg-surface-container-high text-on-surface-variant'}`}>
// //                                 {flag.type}
// //                               </span>
// //                             ))}
// //                             {analysis!.flags.length > 2 && <span className="text-[10px] text-on-surface-variant">+{analysis!.flags.length - 2}</span>}
// //                           </div>
// //                         ) : analysis ? (
// //                           <span className="px-2 py-0.5 bg-secondary-container/20 text-secondary rounded-md text-[10px] font-bold">Clear</span>
// //                         ) : (
// //                           <button onClick={e => { e.stopPropagation(); isEvent ? analyzeEvent(item) : analyzeService(item); }}
// //                             className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1">
// //                             <Sparkles size={10} /> Analyze
// //                           </button>
// //                         )}
// //                       </td>

// //                       {/* Risk */}
// //                       <td className="px-4 py-4 w-24"><RiskBadge analysis={analysis} /></td>

// //                       {/* Status */}
// //                       <td className="px-4 py-4">
// //                         <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${statusStyle(item.status)}`}>
// //                           {statusLabel(item.status)}
// //                         </span>
// //                       </td>

// //                       {/* Actions */}
// //                       <td className="pr-6 py-4 text-right">
// //                         <div className="flex items-center justify-end gap-1">
// //                           <button onClick={e => { e.stopPropagation(); isEvent ? handleEventAction(item.id, 'approve') : handleServiceAction(item.id, 'approve'); }}
// //                             className="p-2 text-secondary hover:bg-secondary-container/20 rounded-lg transition-colors" title="Approve">
// //                             <CheckCircle2 size={18} />
// //                           </button>
// //                           {/* Services don't have a detail page yet — show eye only for events */}
// //                           {isEvent && (
// //                             <Link to={`/moderation/${item.id}`} onClick={e => e.stopPropagation()}
// //                               className="p-2 text-primary hover:bg-primary-container/10 rounded-lg transition-colors" title="View Detail">
// //                               <Eye size={18} />
// //                             </Link>
// //                           )}
// //                           <button onClick={e => { e.stopPropagation(); isEvent ? handleEventAction(item.id, 'reject') : handleServiceAction(item.id, 'reject'); }}
// //                             className="p-2 text-tertiary hover:bg-tertiary/10 rounded-lg transition-colors" title="Reject">
// //                             <X size={18} />
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   );
// //                 })}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Pagination */}
// //           <div className="px-6 py-4 bg-surface-container-low/30 border-t border-indigo-50/50 flex justify-between items-center">
// //             <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safePage === 1}
// //               className="text-xs font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
// //               <ChevronLeft size={16} /> Previous
// //             </button>

// //             <div className="flex items-center gap-1.5">
// //               {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
// //                 let page = i + 1;
// //                 if (totalPages > 5) {
// //                   if (safePage <= 3) page = i + 1;
// //                   else if (safePage >= totalPages - 2) page = totalPages - 4 + i;
// //                   else page = safePage - 2 + i;
// //                 }
// //                 return (
// //                   <button key={page} onClick={() => setCurrentPage(page)}
// //                     className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all
// //                       ${safePage === page ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-variant'}`}>
// //                     {page}
// //                   </button>
// //                 );
// //               })}
// //             </div>

// //             <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
// //               className="text-xs font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
// //               Next <ChevronRight size={16} />
// //             </button>
// //           </div>
// //         </div>

// //         {/* ── AI INSIGHTS PANEL ── */}
// //         <div className="col-span-12 lg:col-span-4 space-y-6">
// //           <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm relative overflow-hidden border border-indigo-50/50">
// //             <div className={`absolute top-0 left-0 w-1 h-full ${activeTab === 'events' ? 'bg-tertiary' : 'bg-secondary'}`} />

// //             <div className="flex items-center justify-between mb-4">
// //               <div className={`flex items-center gap-2 ${activeTab === 'events' ? 'text-tertiary' : 'text-secondary'}`}>
// //                 <Sparkles size={20} />
// //                 <h4 className="font-bold text-sm">AI Insights</h4>
// //                 {activeTab === 'services' && <span className="text-[9px] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded font-bold">SERVICE</span>}
// //               </div>
// //               <div className="flex items-center gap-2">
// //                 {selectedAnalysis && !selectedAnalysis.isLoading && (
// //                   <>
// //                     <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold
// //                       ${selectedAnalysis.riskScore >= 70 ? 'bg-tertiary/10 text-tertiary' :
// //                         selectedAnalysis.riskScore >= 40 ? 'bg-amber-50 text-amber-700' :
// //                         'bg-secondary-container/20 text-secondary'}`}>
// //                       {getRiskLabel(selectedAnalysis.riskLevel)}
// //                     </span>
// //                     {/* Re-analyze button */}
// //                     <button
// //                       onClick={() => {
// //                         if (activeTab === 'events' && selectedEvent) analyzeEvent(selectedEvent, true);
// //                         else if (activeTab === 'services' && selectedService) analyzeService(selectedService, true);
// //                       }}
// //                       title="Re-analyze (fresh AI call)"
// //                       className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container transition-colors">
// //                       <RotateCcw size={13} />
// //                     </button>
// //                   </>
// //                 )}
// //               </div>
// //             </div>

// //             {!selectedItem ? (
// //               <p className="text-xs text-on-surface-variant">
// //                 Select a {activeTab === 'events' ? 'event' : 'service'} to see AI analysis
// //               </p>
// //             ) : selectedAnalysis?.isLoading || analyzingId === selectedItem.id ? (
// //               <div className="space-y-4">
// //                 <div className="flex items-center gap-2 text-primary">
// //                   <Loader2 size={16} className="animate-spin" />
// //                   <span className="text-xs font-bold">AI analyzing…</span>
// //                 </div>
// //                 <Skeleton />
// //               </div>
// //             ) : selectedAnalysis ? (
// //               <>
// //                 <div className="mb-4">
// //                   <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Analyzing</p>
// //                   <p className="text-sm font-semibold text-on-surface">"{selectedItem.title}"</p>
// //                   <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{selectedAnalysis.summary}</p>
// //                 </div>

// //                 <div className="space-y-3 mb-4">
// //                   {[
// //                     { label: 'Semantic Integrity', value: selectedAnalysis.semanticIntegrity },
// //                     { label: 'Host Legitimacy', value: selectedAnalysis.hostLegitimacy },
// //                     { label: 'Engagement Pattern', value: selectedAnalysis.engagementPattern },
// //                   ].map(m => (
// //                     <div key={m.label}>
// //                       <div className="flex justify-between text-[11px] mb-1">
// //                         <span className="text-on-surface-variant">{m.label}</span>
// //                         <span className={`font-bold ${getRiskColor(100 - m.value)}`}>{m.value}/100</span>
// //                       </div>
// //                       <div className="w-full bg-indigo-50 h-1.5 rounded-full overflow-hidden">
// //                         <div className={`h-full transition-all duration-700 ${getRiskBarColor(100 - m.value)}`}
// //                           style={{ width: `${m.value}%` }} />
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>

// //                 {(selectedAnalysis.flags?.length ?? 0) > 0 && (
// //                   <div className="space-y-2 mb-4">
// //                     {selectedAnalysis.flags.map((flag, i) => (
// //                       <div key={i} className={`p-3 rounded-lg flex items-start gap-2
// //                         ${flag.severity === 'high' ? 'bg-tertiary/5 border-l-2 border-tertiary' : 'bg-amber-50/50 border-l-2 border-amber-400'}`}>
// //                         <AlertCircle size={14} className={flag.severity === 'high' ? 'text-tertiary mt-0.5' : 'text-amber-600 mt-0.5'} />
// //                         <div>
// //                           <p className="text-xs font-bold text-on-surface">{flag.type}</p>
// //                           <p className="text-[11px] text-on-surface-variant">{flag.description}</p>
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}

// //                 <div className="bg-surface-container-low p-4 rounded-2xl mb-4">
// //                   <p className="text-[10px] font-bold text-primary uppercase mb-1">Recommendation</p>
// //                   <p className="text-xs italic text-on-surface-variant">"{selectedAnalysis.recommendation}"</p>
// //                 </div>

// //                 {/* Full Report link — only for events */}
// //                 {activeTab === 'events' && selectedEvent && (
// //                   <Link to={`/moderation/${selectedEvent.id}`}
// //                     className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-bold shadow-md hover:opacity-90 text-center block">
// //                     Review Full Report
// //                   </Link>
// //                 )}
// //               </>
// //             ) : (
// //               <div className="text-center py-4">
// //                 <p className="text-xs text-on-surface-variant mb-3">
// //                   Click a {activeTab === 'events' ? 'event' : 'service'} to analyze with AI
// //                 </p>
// //                 <button onClick={() => {
// //                   if (activeTab === 'events' && selectedEvent) analyzeEvent(selectedEvent);
// //                   else if (activeTab === 'services' && selectedService) analyzeService(selectedService);
// //                 }}
// //                   className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 flex items-center gap-2 mx-auto">
// //                   <Sparkles size={14} /> Analyze with AI
// //                 </button>
// //               </div>
// //             )}
// //           </div>

// //           {/* Context Panel */}
// //           {selectedItem && (
// //             <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-indigo-50/50">
// //               <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">
// //                 {activeTab === 'events' ? 'Event Context' : 'Service Context'}
// //               </h4>
// //               <div className="space-y-2.5">
// //                 {activeTab === 'events' && selectedEvent ? [
// //                   { label: 'Category', val: selectedEvent.category },
// //                   { label: 'Price', val: selectedEvent.ticketPrice },
// //                   { label: 'Capacity', val: String(selectedEvent.capacity) },
// //                   { label: '📅 Event Date', val: selectedEvent.eventDate || '—' },
// //                   { label: '🕐 Submitted', val: selectedEvent.dateSubmitted ? new Date(selectedEvent.dateSubmitted).toLocaleDateString('en-IN') : '—' },
// //                   { label: 'Location', val: selectedEvent.location },
// //                 ].map(r => (
// //                   <div key={r.label} className="flex justify-between text-sm">
// //                     <span className="text-on-surface-variant text-xs">{r.label}</span>
// //                     <span className="font-semibold text-right max-w-[60%] truncate text-xs">{r.val}</span>
// //                   </div>
// //                 )) : selectedService ? [
// //                   { label: 'Price', val: selectedService.ticketPrice },
// //                   { label: 'Join Policy', val: selectedService.joinPolicy },
// //                   { label: 'Availability', val: selectedService.scheduleSummary },
// //                   { label: 'Min Duration', val: selectedService.minDuration || '—' },
// //                   { label: 'Style', val: selectedService.meetupStyle?.replace('_', ' ') || '—' },
// //                   { label: 'Location', val: selectedService.location },
// //                   { label: '🕐 Submitted', val: selectedService.dateSubmitted ? new Date(selectedService.dateSubmitted).toLocaleDateString('en-IN') : '—' },
// //                 ].map(r => (
// //                   <div key={r.label} className="flex justify-between text-sm">
// //                     <span className="text-on-surface-variant text-xs">{r.label}</span>
// //                     <span className="font-semibold text-right max-w-[60%] truncate text-xs capitalize">{r.val}</span>
// //                   </div>
// //                 )) : null}
// //               </div>
// //               <div className="mt-4 pt-4 border-t border-indigo-50 flex gap-2">
// //                 <button
// //                   onClick={() => activeTab === 'events' && selectedEvent
// //                     ? handleEventAction(selectedEvent.id, 'approve')
// //                     : selectedService && handleServiceAction(selectedService.id, 'approve')}
// //                   className="flex-1 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1">
// //                   <CheckCircle2 size={14} /> Approve
// //                 </button>
// //                 <button
// //                   onClick={() => activeTab === 'events' && selectedEvent
// //                     ? handleEventAction(selectedEvent.id, 'reject')
// //                     : selectedService && handleServiceAction(selectedService.id, 'reject')}
// //                   className="flex-1 py-2 bg-tertiary/10 text-tertiary rounded-xl text-xs font-bold hover:bg-tertiary/20 flex items-center justify-center gap-1">
// //                   <X size={14} /> Reject
// //                 </button>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ModerationQueue;
// // frontend/src/pages/ModerationQueue.tsx
// // ✅ AUTO-REFRESH — /events/since + /services/since polling (30s)
// //    Naye events bina reload ke queue mein appear hote hain
// //    Aur agar aiAnalysis nahi hai to auto-analyze bhi hota hai
// // ✅ IMPROVED UI — cleaner cards, status pills, live indicator
// // ✅ Tab bar: Events | Services
// // ✅ AI caching, Co-Pilot, Date filters, Pagination — sab intact

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   CheckCircle2, Eye, X, ChevronLeft, ChevronRight,
//   Sparkles, AlertCircle, Loader2, RefreshCw, Database,
//   Bot, ToggleLeft, ToggleRight, Calendar, Clock, Info, RotateCcw,
//   Wrench, Activity, TrendingUp, Shield,
// } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { getRiskColor, getRiskBarColor, getRiskLabel } from '../lib/openai';
// import { getEventsFromAPI, updateEventStatusAPI, getEvents, updateEventStatus } from '../lib/mockEvents';
// import type { Event, AIAnalysis } from '../types';

// // ─── Service type ─────────────────────────────────────────────────────────────
// interface ServiceItem {
//   id: string;
//   title: string;
//   host: string;
//   hostVerified: boolean;
//   image: string;
//   category: string;
//   emoji: string;
//   dateSubmitted: string;
//   location: string;
//   ticketPrice: string;
//   rateType: string | null;
//   capacity: number | null;
//   description: string;
//   status: string;
//   attendeesCount: number;
//   joinPolicy: string;
//   scheduleSummary: string;
//   meetupStyle: string | null;
//   minDuration: string | null;
//   aiAnalysis: AIAnalysis | null;
//   creatorClerkId: string | null;
//   kind: 'service';
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function isInRange(dateStr: string, from: string, to: string): boolean {
//   if (!dateStr) return true;
//   const d = new Date(dateStr).getTime();
//   if (isNaN(d)) return true;
//   if (from && d < new Date(from).getTime()) return false;
//   if (to && d > new Date(to + 'T23:59:59').getTime()) return false;
//   return true;
// }

// function toISO(date: Date) {
//   return date.toISOString().slice(0, 10);
// }

// function timeAgo(dateStr: string): string {
//   const diff = Date.now() - new Date(dateStr).getTime();
//   const mins = Math.floor(diff / 60000);
//   const hours = Math.floor(diff / 3600000);
//   const days = Math.floor(diff / 86400000);
//   if (mins < 1) return 'just now';
//   if (mins < 60) return `${mins}m ago`;
//   if (hours < 24) return `${hours}h ago`;
//   return `${days}d ago`;
// }

// type ActiveTab = 'events' | 'services';

// // ─── Sub-components ──────────────────────────────────────────────────────────

// const Skeleton = () => (
//   <div className="animate-pulse space-y-3">
//     <div className="h-3 bg-indigo-100 rounded w-3/4" />
//     <div className="h-3 bg-indigo-100 rounded w-1/2" />
//     <div className="h-8 bg-indigo-100 rounded w-full" />
//   </div>
// );

// const RiskBadge = ({ analysis }: { analysis?: AIAnalysis }) => {
//   if (!analysis) return <span className="text-[10px] text-on-surface-variant">—</span>;
//   if (analysis.isLoading) return <Loader2 size={14} className="animate-spin text-primary" />;
//   const score = analysis.riskScore ?? 0;
//   return (
//     <div className="flex flex-col gap-1 min-w-[64px]">
//       <div className="flex items-center justify-between">
//         <span className={`text-[11px] font-extrabold ${getRiskColor(score)}`}>{score}%</span>
//         <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
//           score >= 70 ? 'bg-red-50 text-red-600' :
//           score >= 40 ? 'bg-amber-50 text-amber-600' :
//           'bg-emerald-50 text-emerald-600'
//         }`}>
//           {score >= 70 ? 'HIGH' : score >= 40 ? 'MED' : 'LOW'}
//         </span>
//       </div>
//       <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
//         <div
//           className={`h-full transition-all duration-700 ${getRiskBarColor(score)}`}
//           style={{ width: `${score}%` }}
//         />
//       </div>
//     </div>
//   );
// };

// const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
//   pending:      { bg: 'bg-slate-100',   text: 'text-slate-600',   dot: 'bg-slate-400',   label: 'Pending' },
//   flagged:      { bg: 'bg-red-50',      text: 'text-red-600',     dot: 'bg-red-500',     label: 'Flagged' },
//   under_review: { bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-500',   label: 'Reviewing' },
//   approved:     { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Approved' },
//   rejected:     { bg: 'bg-red-50',      text: 'text-red-600',     dot: 'bg-red-500',     label: 'Rejected' },
//   active:       { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Active' },
//   paused:       { bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-500',   label: 'Paused' },
// };

// const StatusPill = ({ status }: { status: string }) => {
//   const cfg = statusConfig[status] || statusConfig.pending;
//   return (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${cfg.bg} ${cfg.text}`}>
//       <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
//       {cfg.label}
//     </span>
//   );
// };

// // Live pulse indicator for auto-refresh
// const LiveDot = ({ active }: { active: boolean }) => (
//   <span className="relative flex items-center gap-1.5">
//     <span className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-300'}`}>
//       {active && <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />}
//     </span>
//     <span className={`text-[10px] font-bold ${active ? 'text-emerald-600' : 'text-slate-400'}`}>
//       {active ? 'LIVE' : 'OFFLINE'}
//     </span>
//   </span>
// );

// // ═══════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════════
// const ModerationQueue = () => {

//   // ── Tab ──
//   const [activeTab, setActiveTab] = useState<ActiveTab>('events');

//   // ── Events ──
//   const [events, setEvents] = useState<Event[]>([]);
//   const [eventAnalyses, setEventAnalyses] = useState<Record<string, AIAnalysis>>({});
//   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
//   const [eventsLoading, setEventsLoading] = useState(true);
//   const [eventDataSource, setEventDataSource] = useState<'api' | 'local'>('api');
//   // Track timestamp of last fetch — for /since polling
//   const lastEventFetchRef = useRef<number>(Date.now());

//   // ── Services ──
//   const [services, setServices] = useState<ServiceItem[]>([]);
//   const [serviceAnalyses, setServiceAnalyses] = useState<Record<string, AIAnalysis>>({});
//   const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
//   const [servicesLoading, setServicesLoading] = useState(false);
//   const [servicesLoaded, setServicesLoaded] = useState(false);
//   const lastServiceFetchRef = useRef<number>(Date.now());

//   // ── Auto-refresh state ──
//   // Shows a "N new items" banner when polling finds new items
//   const [newItemsBanner, setNewItemsBanner] = useState<{ count: number; tab: ActiveTab } | null>(null);
//   const [isPolling, setIsPolling] = useState(false);
//   const POLL_INTERVAL = 30000; // 30 seconds

//   // ── Filters ──
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [startDateFrom, setStartDateFrom] = useState('');
//   const [startDateTo, setStartDateTo] = useState('');
//   const [createdFrom, setCreatedFrom] = useState('');
//   const [createdTo, setCreatedTo] = useState('');
//   const [showDateFilters, setShowDateFilters] = useState(false);

//   // ── Pagination ──
//   const ITEMS_PER_PAGE = 8;
//   const [currentPage, setCurrentPage] = useState(1);

//   // ── AI ──
//   const [analyzingId, setAnalyzingId] = useState<string | null>(null);

//   // ── Co-Pilot ──
//   const [copilotMode, setCopilotMode] = useState(false);
//   const [copilotRunning, setCopilotRunning] = useState(false);
//   const [copilotLog, setCopilotLog] = useState<string[]>([]);
//   const [autoApproveThreshold, setAutoApproveThreshold] = useState(30);
//   const [autoRejectThreshold, setAutoRejectThreshold] = useState(70);
//   const copilotStopRef = useRef(false);

//   // ── Toast ──
//   const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
//   const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
//     setNotification({ msg, type });
//     setTimeout(() => setNotification(null), 4000);
//   };

//   // ─── Load Events (full fetch) ─────────────────────────────────────────────
//   const loadEvents = async (silent = false) => {
//     if (!silent) setEventsLoading(true);
//     const fetchStart = Date.now();
//     try {
//       const apiEvents = await getEventsFromAPI();
//       if (apiEvents.length > 0) {
//         setEvents(apiEvents);
//         if (!selectedEvent) setSelectedEvent(apiEvents[0]);
//         setEventDataSource('api');

//         // Pre-load cached AI analyses
//         const cached: Record<string, AIAnalysis> = {};
//         for (const ev of apiEvents) {
//           if ((ev as any).aiAnalysis?.riskScore !== undefined) {
//             cached[ev.id] = { ...(ev as any).aiAnalysis, isLoading: false };
//           }
//         }
//         if (Object.keys(cached).length > 0) {
//           setEventAnalyses(prev => ({ ...cached, ...prev }));
//         }
//       } else {
//         const local = getEvents();
//         setEvents(local);
//         if (!selectedEvent && local.length > 0) setSelectedEvent(local[0]);
//         setEventDataSource('local');
//       }
//       lastEventFetchRef.current = fetchStart;
//     } catch {
//       const local = getEvents();
//       setEvents(local);
//       if (!selectedEvent && local.length > 0) setSelectedEvent(local[0]);
//       setEventDataSource('local');
//     } finally {
//       if (!silent) setEventsLoading(false);
//     }
//   };

//   // ─── Load Services (full fetch) ───────────────────────────────────────────
//   const loadServices = async (silent = false) => {
//     if (!silent) setServicesLoading(true);
//     const fetchStart = Date.now();
//     try {
//       const res = await fetch('http://localhost:5006/services');
//       if (!res.ok) throw new Error('Services API failed');
//       const data: ServiceItem[] = await res.json();
//       setServices(data);
//       if (!selectedService && data.length > 0) setSelectedService(data[0]);

//       const cached: Record<string, AIAnalysis> = {};
//       for (const sv of data) {
//         if (sv.aiAnalysis?.riskScore !== undefined) {
//           cached[sv.id] = { ...sv.aiAnalysis, isLoading: false };
//         }
//       }
//       if (Object.keys(cached).length > 0) {
//         setServiceAnalyses(prev => ({ ...cached, ...prev }));
//       }
//       setServicesLoaded(true);
//       lastServiceFetchRef.current = fetchStart;
//     } catch {
//       setServicesLoaded(true);
//     } finally {
//       if (!silent) setServicesLoading(false);
//     }
//   };

//   // ─── POLLING — /since endpoints ──────────────────────────────────────────
//   // Har 30 second mein sirf naye events/services fetch karo
//   // Agar naye milte hain → state mein add karo + banner dikhao
//   // Agar unka aiAnalysis nahi hai → auto-analyze karo
//   const pollForNewItems = useCallback(async () => {
//     if (isPolling) return;
//     setIsPolling(true);
//     try {
//       if (eventDataSource === 'api') {
//         // Events poll
//         const eventTs = lastEventFetchRef.current;
//         const res = await fetch(`http://localhost:5006/events/since?ts=${eventTs}`);
//         if (res.ok) {
//           const { newCount, events: newEvents } = await res.json();
//           if (newCount > 0) {
//             // Merge naye events — duplicate avoid karo
//             setEvents(prev => {
//               const existingIds = new Set(prev.map(e => e.id));
//               const toAdd = newEvents.filter((e: Event) => !existingIds.has(e.id));
//               if (toAdd.length === 0) return prev;

//               // Cached analyses bhi load karo
//               const cached: Record<string, AIAnalysis> = {};
//               for (const ev of toAdd) {
//                 if ((ev as any).aiAnalysis?.riskScore !== undefined) {
//                   cached[ev.id] = { ...(ev as any).aiAnalysis, isLoading: false };
//                 }
//               }
//               if (Object.keys(cached).length > 0) {
//                 setEventAnalyses(prevA => ({ ...cached, ...prevA }));
//               }

//               if (activeTab === 'events') {
//                 setNewItemsBanner({ count: toAdd.length, tab: 'events' });
//                 setTimeout(() => setNewItemsBanner(null), 8000);
//               }

//               return [...toAdd, ...prev];
//             });
//             lastEventFetchRef.current = Date.now();
//           }
//         }
//       }

//       if (servicesLoaded) {
//         // Services poll
//         const serviceTs = lastServiceFetchRef.current;
//         const res = await fetch(`http://localhost:5006/services/since?ts=${serviceTs}`);
//         if (res.ok) {
//           const { newCount, services: newServices } = await res.json();
//           if (newCount > 0) {
//             setServices(prev => {
//               const existingIds = new Set(prev.map(s => s.id));
//               const toAdd = newServices.filter((s: ServiceItem) => !existingIds.has(s.id));
//               if (toAdd.length === 0) return prev;

//               if (activeTab === 'services') {
//                 setNewItemsBanner({ count: toAdd.length, tab: 'services' });
//                 setTimeout(() => setNewItemsBanner(null), 8000);
//               }

//               return [...toAdd, ...prev];
//             });
//             lastServiceFetchRef.current = Date.now();
//           }
//         }
//       }
//     } catch {
//       // Silently fail — main data already loaded
//     } finally {
//       setIsPolling(false);
//     }
//   }, [eventDataSource, servicesLoaded, activeTab, isPolling]);

//   // ─── Effects ──────────────────────────────────────────────────────────────
//   useEffect(() => { loadEvents(); }, []);

//   // Tab switch → lazy load services
//   useEffect(() => {
//     if (activeTab === 'services' && !servicesLoaded) loadServices();
//   }, [activeTab]);

//   // Auto-refresh polling — har 30 sec
//   useEffect(() => {
//     const interval = setInterval(pollForNewItems, POLL_INTERVAL);
//     return () => clearInterval(interval);
//   }, [pollForNewItems]);

//   // Filter/tab change → page 1
//   useEffect(() => { setCurrentPage(1); }, [filterStatus, startDateFrom, startDateTo, createdFrom, createdTo, activeTab]);

//   // ─── Analyze Event ────────────────────────────────────────────────────────
//   const analyzeEvent = useCallback(async (event: Event, force = false): Promise<AIAnalysis | null> => {
//     setAnalyzingId(event.id);
//     setEventAnalyses(prev => ({ ...prev, [event.id]: { ...(prev[event.id] || {}), isLoading: true } as AIAnalysis }));
//     try {
//       const res = await fetch('http://localhost:5006/analyze', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ event, force }),
//       });
//       const data = await res.json();
//       const safe: AIAnalysis = {
//         riskScore: data.riskScore ?? 0, riskLevel: data.riskLevel ?? 'low',
//         semanticIntegrity: data.semanticIntegrity ?? 80, hostLegitimacy: data.hostLegitimacy ?? 80,
//         engagementPattern: data.engagementPattern ?? 80, flags: Array.isArray(data.flags) ? data.flags : [],
//         summary: data.summary ?? '', recommendation: data.recommendation ?? '',
//         scannedAt: data.scannedAt ?? new Date().toISOString(), isLoading: false,
//       };
//       setEventAnalyses(prev => ({ ...prev, [event.id]: safe }));
//       return safe;
//     } catch { return null; }
//     finally { setAnalyzingId(null); }
//   }, []);

//   // ─── Analyze Service ──────────────────────────────────────────────────────
//   const analyzeService = useCallback(async (service: ServiceItem, force = false): Promise<AIAnalysis | null> => {
//     setAnalyzingId(service.id);
//     setServiceAnalyses(prev => ({ ...prev, [service.id]: { ...(prev[service.id] || {}), isLoading: true } as AIAnalysis }));
//     try {
//       const res = await fetch('http://localhost:5006/analyze-service', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ service, force }),
//       });
//       const data = await res.json();
//       const safe: AIAnalysis = {
//         riskScore: data.riskScore ?? 0, riskLevel: data.riskLevel ?? 'low',
//         semanticIntegrity: data.semanticIntegrity ?? 80, hostLegitimacy: data.hostLegitimacy ?? 80,
//         engagementPattern: data.engagementPattern ?? 80, flags: Array.isArray(data.flags) ? data.flags : [],
//         summary: data.summary ?? '', recommendation: data.recommendation ?? '',
//         scannedAt: data.scannedAt ?? new Date().toISOString(), isLoading: false,
//       };
//       setServiceAnalyses(prev => ({ ...prev, [service.id]: safe }));
//       return safe;
//     } catch { return null; }
//     finally { setAnalyzingId(null); }
//   }, []);

//   // ─── Actions ──────────────────────────────────────────────────────────────
//   const handleEventAction = async (eventId: string, action: 'approve' | 'reject', silent = false) => {
//     const newStatus = action === 'approve' ? 'approved' : 'rejected';
//     setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: newStatus } : e));
//     if (eventDataSource === 'api') {
//       const ok = await updateEventStatusAPI(eventId, newStatus);
//       if (!ok && !silent) {
//         showToast('Failed to update in MongoDB', 'error');
//         setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'pending' } : e));
//         return;
//       }
//     } else {
//       updateEventStatus(eventId, newStatus);
//     }
//     if (!silent) showToast(action === 'approve' ? '✓ Event approved!' : '✗ Event rejected', action === 'approve' ? 'success' : 'error');
//     if (selectedEvent?.id === eventId) {
//       const next = events.find(e => e.id !== eventId && e.status === 'pending');
//       if (next) setSelectedEvent(next);
//     }
//   };

//   const handleServiceAction = async (serviceId: string, action: 'approve' | 'reject', silent = false) => {
//     const newStatus = action === 'approve' ? 'approved' : 'rejected';
//     setServices(prev => prev.map(s => s.id === serviceId ? { ...s, status: newStatus } : s));
//     try {
//       await fetch(`http://localhost:5006/services/${serviceId}/status`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: newStatus }),
//       });
//     } catch { if (!silent) showToast('Network error', 'error'); }
//     if (!silent) showToast(action === 'approve' ? '✓ Service approved!' : '✗ Service rejected', action === 'approve' ? 'success' : 'error');
//     if (selectedService?.id === serviceId) {
//       const next = services.find(s => s.id !== serviceId && s.status === 'pending');
//       if (next) setSelectedService(next);
//     }
//   };

//   // ─── Co-Pilot ─────────────────────────────────────────────────────────────
//   const runCopilot = async () => {
//     const isEvents = activeTab === 'events';
//     const pending = isEvents
//       ? events.filter(e => e.status === 'pending' || e.status === 'flagged')
//       : services.filter(s => s.status === 'pending' || s.status === 'flagged');

//     if (!pending.length) { showToast('No pending items', 'info'); return; }

//     setCopilotRunning(true);
//     copilotStopRef.current = false;
//     setCopilotLog([
//       `🤖 Co-Pilot started — ${pending.length} ${isEvents ? 'events' : 'services'}`,
//       `📊 Approve ≤ ${autoApproveThreshold}% | Reject ≥ ${autoRejectThreshold}%`,
//     ]);

//     let approved = 0, rejected = 0, skipped = 0;
//     for (const item of pending) {
//       if (copilotStopRef.current) { setCopilotLog(p => [...p, '⏹ Stopped']); break; }
//       setCopilotLog(p => [...p, `🔍 "${item.title}"...`]);
//       const analysis = isEvents ? await analyzeEvent(item as Event) : await analyzeService(item as ServiceItem);
//       if (!analysis) { setCopilotLog(p => [...p, '  ⚠️ Failed — skip']); skipped++; continue; }
//       const score = analysis.riskScore ?? 50;
//       if (score <= autoApproveThreshold) {
//         isEvents ? await handleEventAction(item.id, 'approve', true) : await handleServiceAction(item.id, 'approve', true);
//         setCopilotLog(p => [...p, `  ✅ APPROVED — ${score}%`]);
//         approved++;
//       } else if (score >= autoRejectThreshold) {
//         isEvents ? await handleEventAction(item.id, 'reject', true) : await handleServiceAction(item.id, 'reject', true);
//         setCopilotLog(p => [...p, `  ❌ REJECTED — ${score}%`]);
//         rejected++;
//       } else {
//         setCopilotLog(p => [...p, `  🟡 REVIEW — ${score}%`]);
//         skipped++;
//       }
//       await new Promise(r => setTimeout(r, 400));
//     }
//     setCopilotLog(p => [...p, '', `✅ ${approved} approved | ❌ ${rejected} rejected | 🟡 ${skipped} review`]);
//     setCopilotRunning(false);
//     if (isEvents) loadEvents(true); else loadServices(true);
//   };

//   // ─── Filter + Paginate ────────────────────────────────────────────────────
//   const currentItems = activeTab === 'events' ? events : services;
//   const filtered = currentItems.filter((item: any) => {
//     if (filterStatus !== 'all' && item.status !== filterStatus) return false;
//     if (startDateFrom || startDateTo) {
//       if (!isInRange(item.eventDate || '', startDateFrom, startDateTo)) return false;
//     }
//     if (createdFrom || createdTo) {
//       const ds = typeof item.dateSubmitted === 'string' ? item.dateSubmitted : String(item.dateSubmitted || '');
//       if (!isInRange(ds, createdFrom, createdTo)) return false;
//     }
//     return true;
//   });

//   const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
//   const safePage = Math.min(currentPage, totalPages);
//   const pageItems = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

//   const hasDateFilter = startDateFrom || startDateTo || createdFrom || createdTo;
//   const pendingCount = currentItems.filter((i: any) => i.status === 'pending').length;
//   const flaggedCount = currentItems.filter((i: any) => i.status === 'flagged').length;
//   const approvedCount = currentItems.filter((i: any) => i.status === 'approved').length;

//   const selectedItem = activeTab === 'events' ? selectedEvent : selectedService;
//   const selectedAnalysis = selectedItem
//     ? activeTab === 'events' ? eventAnalyses[selectedItem.id] : serviceAnalyses[selectedItem.id]
//     : null;
//   const isLoading = activeTab === 'events' ? eventsLoading : servicesLoading;

//   // ─── RENDER ───────────────────────────────────────────────────────────────
//   return (
//     <div className="space-y-5">

//       {/* Toast */}
//       {notification && (
//         <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-xl font-semibold text-sm text-white flex items-center gap-2 transition-all
//           ${notification.type === 'success' ? 'bg-emerald-600' : notification.type === 'error' ? 'bg-red-500' : 'bg-indigo-600'}`}>
//           {notification.type === 'success' ? <CheckCircle2 size={16} /> : notification.type === 'error' ? <X size={16} /> : <Info size={16} />}
//           {notification.msg}
//         </div>
//       )}

//       {/* New items banner */}
//       {newItemsBanner && (
//         <div className="bg-indigo-600 text-white px-5 py-3 rounded-2xl flex items-center gap-3 shadow-lg shadow-indigo-200">
//           <Activity size={16} className="animate-pulse" />
//           <span className="text-sm font-semibold">
//             {newItemsBanner.count} new {newItemsBanner.tab} just appeared in the queue
//           </span>
//           <button onClick={() => setNewItemsBanner(null)} className="ml-auto opacity-70 hover:opacity-100">
//             <X size={14} />
//           </button>
//         </div>
//       )}

//       {/* ── HEADER ── */}
//       <div className="flex justify-between items-start flex-wrap gap-4">
//         <div>
//           <div className="flex items-center gap-2 mb-1">
//             <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
//               <Database size={10} />
//               {activeTab === 'events'
//                 ? (eventDataSource === 'api' ? 'MyApp MongoDB' : 'LocalStorage')
//                 : 'MyApp MongoDB (Services)'}
//             </span>
//             <LiveDot active={eventDataSource === 'api'} />
//           </div>
//           <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">Moderation Queue</h3>
//           <p className="text-on-surface-variant text-sm mt-1">
//             Auto-refreshes every 30s — new submissions appear instantly.
//           </p>
//         </div>

//         <div className="flex gap-2.5 items-center flex-wrap">
//           {/* Stats */}
//           {[
//             { label: 'Pending', value: pendingCount, color: 'text-amber-600', bg: 'bg-amber-50' },
//             { label: 'Flagged', value: flaggedCount, color: 'text-red-600', bg: 'bg-red-50' },
//             { label: 'Approved', value: approvedCount, color: 'text-emerald-600', bg: 'bg-emerald-50' },
//           ].map(s => (
//             <div key={s.label} className={`${s.bg} px-4 py-2 rounded-xl border border-slate-100`}>
//               <p className="text-[10px] text-slate-500 font-bold uppercase">{s.label}</p>
//               <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
//             </div>
//           ))}

//           {/* Co-Pilot */}
//           <button onClick={() => setCopilotMode(p => !p)}
//             className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all
//               ${copilotMode ? 'bg-indigo-900 border-indigo-700 text-white shadow-lg shadow-indigo-900/20' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'}`}>
//             <Bot size={15} />
//             Co-Pilot
//             {copilotMode ? <ToggleRight size={18} className="text-indigo-300" /> : <ToggleLeft size={18} />}
//           </button>

//           {/* Manual Refresh */}
//           <button
//             onClick={() => {
//               if (activeTab === 'events') { loadEvents(); showToast('Refreshed!', 'info'); }
//               else { loadServices(); showToast('Services refreshed!', 'info'); }
//             }}
//             disabled={isLoading}
//             className="bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 disabled:opacity-50 transition-all">
//             <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* ── TABS ── */}
//       <div className="flex gap-2 border-b border-slate-100 pb-0">
//         {[
//           { key: 'events' as ActiveTab, label: 'Events', count: events.length, icon: <Calendar size={14} /> },
//           { key: 'services' as ActiveTab, label: 'Services', count: servicesLoaded ? services.length : null, icon: <Wrench size={14} /> },
//         ].map(tab => (
//           <button
//             key={tab.key}
//             onClick={() => setActiveTab(tab.key)}
//             className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-sm font-semibold transition-all border border-b-0 -mb-px
//               ${activeTab === tab.key
//                 ? 'bg-white border-slate-200 text-slate-900 shadow-sm'
//                 : 'bg-transparent border-transparent text-slate-500 hover:text-slate-700'}`}
//           >
//             {tab.icon}
//             {tab.label}
//             {tab.count !== null && (
//               <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
//                 ${activeTab === tab.key ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
//                 {tab.count}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* ── CO-PILOT PANEL ── */}
//       {copilotMode && (
//         <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-4">
//           <div className="flex items-center gap-3 flex-wrap">
//             <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
//               <Bot size={18} className="text-white" />
//             </div>
//             <div className="flex-1">
//               <h4 className="text-white font-semibold text-sm">AI Co-Pilot</h4>
//               <p className="text-slate-400 text-xs">Auto-review based on risk thresholds</p>
//             </div>
//             <div className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 max-w-xs">
//               <p className="text-slate-300 text-[11px] leading-relaxed flex items-start gap-1.5">
//                 <Info size={11} className="flex-shrink-0 mt-0.5 text-slate-500" />
//                 Lower "approve" threshold = stricter moderation. Middle zone needs human review.
//               </p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
//               <div className="flex justify-between mb-2">
//                 <label className="text-[11px] font-bold text-emerald-400 uppercase flex items-center gap-1"><CheckCircle2 size={11} /> Approve if ≤</label>
//                 <span className="text-emerald-400 font-bold text-sm">{autoApproveThreshold}%</span>
//               </div>
//               <input type="range" min={0} max={60} step={5} value={autoApproveThreshold}
//                 onChange={e => setAutoApproveThreshold(Number(e.target.value))} className="w-full accent-emerald-500" />
//             </div>
//             <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
//               <div className="flex justify-between mb-2">
//                 <label className="text-[11px] font-bold text-red-400 uppercase flex items-center gap-1"><X size={11} /> Reject if ≥</label>
//                 <span className="text-red-400 font-bold text-sm">{autoRejectThreshold}%</span>
//               </div>
//               <input type="range" min={40} max={100} step={5} value={autoRejectThreshold}
//                 onChange={e => setAutoRejectThreshold(Number(e.target.value))} className="w-full accent-red-500" />
//             </div>
//           </div>

//           {/* Risk band */}
//           <div>
//             <div className="h-5 rounded-full overflow-hidden flex text-[9px] font-bold">
//               <div className="bg-emerald-500/80 flex items-center justify-center text-white" style={{ width: `${autoApproveThreshold}%` }}>{autoApproveThreshold > 12 ? 'APPROVE' : ''}</div>
//               <div className="bg-amber-500/80 flex items-center justify-center text-white" style={{ width: `${autoRejectThreshold - autoApproveThreshold}%` }}>{autoRejectThreshold - autoApproveThreshold > 15 ? 'REVIEW' : ''}</div>
//               <div className="bg-red-500/80 flex-1 flex items-center justify-center text-white">{100 - autoRejectThreshold > 5 ? 'REJECT' : ''}</div>
//             </div>
//           </div>

//           <div className="flex gap-3">
//             {!copilotRunning ? (
//               <button onClick={runCopilot} disabled={pendingCount === 0}
//                 className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 disabled:opacity-40 transition-colors">
//                 <Bot size={15} /> Run on {pendingCount} pending
//               </button>
//             ) : (
//               <button onClick={() => { copilotStopRef.current = true; setCopilotRunning(false); }}
//                 className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2">
//                 <X size={15} /> Stop
//               </button>
//             )}
//           </div>

//           {copilotLog.length > 0 && (
//             <div className="bg-black/50 rounded-xl p-4 max-h-40 overflow-y-auto font-mono space-y-0.5">
//               {copilotLog.map((line, i) => (
//                 <div key={i} className={`text-[11px] leading-relaxed ${
//                   line.includes('APPROVED') ? 'text-emerald-400' :
//                   line.includes('REJECTED') ? 'text-red-400' :
//                   line.includes('REVIEW') ? 'text-amber-400' :
//                   line.includes('approved') || line.includes('rejected') ? 'text-white font-bold' : 'text-slate-400'
//                 }`}>{line || '\u00A0'}</div>
//               ))}
//               {copilotRunning && <div className="flex items-center gap-2 text-slate-400 text-[11px]"><Loader2 size={10} className="animate-spin" /> Processing…</div>}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── FILTERS ── */}
//       <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 shadow-sm">
//         <div className="flex flex-wrap items-end gap-3">
//           <div className="flex-1 min-w-[140px]">
//             <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 tracking-wider">Status</label>
//             <select className="w-full bg-slate-50 border border-slate-200 rounded-xl text-sm p-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
//               value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
//               <option value="all">All Status</option>
//               <option value="pending">Pending</option>
//               <option value="flagged">Flagged</option>
//               <option value="approved">Approved</option>
//               <option value="rejected">Rejected</option>
//               {activeTab === 'services' && <><option value="active">Active</option><option value="paused">Paused</option></>}
//             </select>
//           </div>

//           <button onClick={() => setShowDateFilters(p => !p)}
//             className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all
//               ${showDateFilters || hasDateFilter ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'}`}>
//             <Calendar size={13} /> Date Filters
//             {hasDateFilter && <span className="bg-white/20 text-[9px] px-1.5 py-0.5 rounded-full font-bold">ON</span>}
//           </button>

//           {hasDateFilter && (
//             <button onClick={() => { setStartDateFrom(''); setStartDateTo(''); setCreatedFrom(''); setCreatedTo(''); }}
//               className="text-xs text-red-500 font-semibold hover:underline flex items-center gap-1">
//               <X size={11} /> Clear
//             </button>
//           )}
//         </div>

//         {showDateFilters && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
//             {activeTab === 'events' && (
//               <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
//                 <p className="text-[11px] font-bold text-indigo-600 mb-1 flex items-center gap-1.5"><Calendar size={11} /> Event Start Date</p>
//                 <p className="text-[10px] text-slate-500 mb-3">Event kab hoga</p>
//                 <div className="grid grid-cols-2 gap-2 mb-2">
//                   <div><label className="text-[10px] text-slate-500 font-bold block mb-1">From</label>
//                     <input type="date" value={startDateFrom} onChange={e => setStartDateFrom(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg text-xs p-2 focus:outline-none focus:ring-2 ring-indigo-200" /></div>
//                   <div><label className="text-[10px] text-slate-500 font-bold block mb-1">To</label>
//                     <input type="date" value={startDateTo} onChange={e => setStartDateTo(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg text-xs p-2 focus:outline-none focus:ring-2 ring-indigo-200" /></div>
//                 </div>
//                 <div className="flex gap-2">
//                   {[{ l: 'Today', f: toISO(new Date()), t: toISO(new Date()) }, { l: 'This Week', f: toISO(new Date()), t: toISO(new Date(Date.now() + 7 * 86400000)) }].map(p => (
//                     <button key={p.l} onClick={() => { setStartDateFrom(p.f); setStartDateTo(p.t); }}
//                       className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 font-bold hover:bg-indigo-200">{p.l}</button>
//                   ))}
//                 </div>
//               </div>
//             )}
//             <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
//               <p className="text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1.5"><Clock size={11} /> Submitted Date</p>
//               <p className="text-[10px] text-slate-500 mb-3">Admin ko kab mila</p>
//               <div className="grid grid-cols-2 gap-2 mb-2">
//                 <div><label className="text-[10px] text-slate-500 font-bold block mb-1">From</label>
//                   <input type="date" value={createdFrom} onChange={e => setCreatedFrom(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg text-xs p-2 focus:outline-none focus:ring-2 ring-indigo-200" /></div>
//                 <div><label className="text-[10px] text-slate-500 font-bold block mb-1">To</label>
//                   <input type="date" value={createdTo} onChange={e => setCreatedTo(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg text-xs p-2 focus:outline-none focus:ring-2 ring-indigo-200" /></div>
//               </div>
//               <div className="flex gap-2">
//                 {[{ l: 'Today', f: toISO(new Date()), t: toISO(new Date()) }, { l: 'Last 7d', f: toISO(new Date(Date.now() - 7 * 86400000)), t: toISO(new Date()) }].map(p => (
//                   <button key={p.l} onClick={() => { setCreatedFrom(p.f); setCreatedTo(p.t); }}
//                     className="text-[10px] px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 font-bold hover:bg-slate-300">{p.l}</button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ── MAIN GRID ── */}
//       <div className="grid grid-cols-12 gap-5 items-start">

//         {/* ── TABLE ── */}
//         <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">

//           {/* Table header */}
//           <div className="px-6 py-4 bg-slate-50 flex justify-between items-center border-b border-slate-100">
//             <div className="flex items-center gap-3 flex-wrap">
//               <span className="text-sm font-semibold text-slate-800">
//                 {filtered.length} {activeTab}
//                 {filtered.length !== currentItems.length && <span className="text-slate-400 font-normal"> of {currentItems.length}</span>}
//               </span>
//               {isPolling && (
//                 <span className="flex items-center gap-1 text-[10px] text-indigo-500 font-semibold">
//                   <Loader2 size={10} className="animate-spin" /> checking for new…
//                 </span>
//               )}
//             </div>
//             <button onClick={() => { activeTab === 'events' ? loadEvents() : loadServices(); }} disabled={isLoading}
//               className="text-xs font-semibold text-indigo-600 flex items-center gap-1 hover:underline disabled:opacity-50">
//               <RefreshCw size={11} className={isLoading ? 'animate-spin' : ''} /> Refresh
//             </button>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="text-left border-b border-slate-100">
//                   <th className="pl-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
//                     {activeTab === 'events' ? 'Event' : 'Service'}
//                   </th>
//                   <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dates</th>
//                   <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Flags</th>
//                   <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-24">Risk</th>
//                   <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
//                   <th className="pr-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {isLoading ? (
//                   <tr><td colSpan={6} className="py-16 text-center">
//                     <Loader2 size={28} className="animate-spin text-indigo-400 mx-auto mb-2" />
//                     <p className="text-sm text-slate-400">Loading…</p>
//                   </td></tr>
//                 ) : activeTab === 'services' && !servicesLoaded ? (
//                   <tr><td colSpan={6} className="py-16 text-center">
//                     <Loader2 size={28} className="animate-spin text-indigo-400 mx-auto mb-2" />
//                     <p className="text-sm text-slate-400">Loading services…</p>
//                   </td></tr>
//                 ) : pageItems.length === 0 ? (
//                   <tr><td colSpan={6} className="py-16 text-center text-sm text-slate-400">
//                     {currentItems.length === 0
//                       ? 'No items found. Backend running on port 5006?'
//                       : <span>No items match. <button onClick={() => { setFilterStatus('all'); setStartDateFrom(''); setStartDateTo(''); setCreatedFrom(''); setCreatedTo(''); }} className="text-indigo-600 font-semibold hover:underline">Clear filters</button></span>
//                     }
//                   </td></tr>
//                 ) : pageItems.map((item: any) => {
//                   const isEvent = item.kind !== 'service';
//                   const analysis = isEvent ? eventAnalyses[item.id] : serviceAnalyses[item.id];
//                   const isSelected = isEvent ? selectedEvent?.id === item.id : selectedService?.id === item.id;

//                   return (
//                     <tr key={item.id}
//                       onClick={() => {
//                         if (isEvent) { setSelectedEvent(item); if (!eventAnalyses[item.id]) analyzeEvent(item); }
//                         else { setSelectedService(item); if (!serviceAnalyses[item.id]) analyzeService(item); }
//                       }}
//                       className={`transition-colors cursor-pointer group ${isSelected
//                         ? 'bg-indigo-50 border-l-[3px] border-l-indigo-500'
//                         : 'hover:bg-slate-50/80 border-l-[3px] border-l-transparent'}`}>

//                       {/* Item */}
//                       <td className="pl-5 py-3.5">
//                         <div className="flex items-center gap-3">
//                           <div className="relative flex-shrink-0">
//                             <img src={item.image} alt={item.title}
//                               className="w-11 h-11 rounded-xl object-cover"
//                               referrerPolicy="no-referrer"
//                               onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/44x44/e0e7ff/4f46e5?text=${isEvent ? 'E' : 'S'}`; }}
//                             />
//                             {item.status === 'pending' && (
//                               <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white" title="Pending review" />
//                             )}
//                           </div>
//                           <div className="min-w-0">
//                             <p className="text-sm font-semibold text-slate-900 leading-tight truncate max-w-[180px]">{item.title}</p>
//                             <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[180px]">
//                               {isEvent ? 'Host' : 'Provider'}: <span className="font-medium text-slate-600">{item.host}</span>
//                               {item.hostVerified && <span className="ml-1 text-[9px] bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded font-bold">✓</span>}
//                             </p>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Dates */}
//                       <td className="px-4 py-3.5">
//                         <div className="space-y-1">
//                           {isEvent ? (
//                             <>
//                               {item.eventDate && (
//                                 <div className="flex items-center gap-1">
//                                   <Calendar size={9} className="text-indigo-400 flex-shrink-0" />
//                                   <span className="text-[10px] font-medium text-slate-700">{item.eventDate}</span>
//                                 </div>
//                               )}
//                               {item.dateSubmitted && (
//                                 <div className="flex items-center gap-1">
//                                   <Clock size={9} className="text-slate-400 flex-shrink-0" />
//                                   <span className="text-[10px] text-slate-400">{timeAgo(item.dateSubmitted)}</span>
//                                 </div>
//                               )}
//                             </>
//                           ) : (
//                             <>
//                               <div className="text-[10px] font-medium text-slate-700 truncate max-w-[100px]">{item.scheduleSummary || '—'}</div>
//                               {item.dateSubmitted && (
//                                 <div className="flex items-center gap-1">
//                                   <Clock size={9} className="text-slate-400 flex-shrink-0" />
//                                   <span className="text-[10px] text-slate-400">{timeAgo(item.dateSubmitted)}</span>
//                                 </div>
//                               )}
//                             </>
//                           )}
//                         </div>
//                       </td>

//                       {/* Flags */}
//                       <td className="px-4 py-3.5">
//                         {analysis?.isLoading || analyzingId === item.id ? (
//                           <div className="flex items-center gap-1.5">
//                             <Loader2 size={12} className="animate-spin text-indigo-400" />
//                             <span className="text-[10px] text-slate-400">Analyzing…</span>
//                           </div>
//                         ) : (analysis?.flags?.length ?? 0) > 0 ? (
//                           <div className="flex flex-wrap gap-1">
//                             {analysis!.flags.slice(0, 2).map((flag, i) => (
//                               <span key={i} className={`px-2 py-0.5 rounded-md text-[9px] font-bold
//                                 ${flag.severity === 'high' ? 'bg-red-50 text-red-600' :
//                                   flag.severity === 'medium' ? 'bg-amber-50 text-amber-600' :
//                                   'bg-slate-100 text-slate-500'}`}>
//                                 {flag.type}
//                               </span>
//                             ))}
//                             {analysis!.flags.length > 2 && <span className="text-[10px] text-slate-400">+{analysis!.flags.length - 2}</span>}
//                           </div>
//                         ) : analysis ? (
//                           <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
//                             <Shield size={10} /> Clean
//                           </span>
//                         ) : (
//                           <button onClick={e => { e.stopPropagation(); isEvent ? analyzeEvent(item) : analyzeService(item); }}
//                             className="text-[10px] text-indigo-600 font-semibold hover:underline flex items-center gap-1">
//                             <Sparkles size={10} /> Analyze
//                           </button>
//                         )}
//                       </td>

//                       {/* Risk */}
//                       <td className="px-4 py-3.5 w-24"><RiskBadge analysis={analysis} /></td>

//                       {/* Status */}
//                       <td className="px-4 py-3.5"><StatusPill status={item.status} /></td>

//                       {/* Actions */}
//                       <td className="pr-5 py-3.5 text-right">
//                         <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                           <button onClick={e => { e.stopPropagation(); isEvent ? handleEventAction(item.id, 'approve') : handleServiceAction(item.id, 'approve'); }}
//                             className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
//                             <CheckCircle2 size={17} />
//                           </button>
//                           {isEvent && (
//                             <Link to={`/moderation/${item.id}`} onClick={e => e.stopPropagation()}
//                               className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View Detail">
//                               <Eye size={17} />
//                             </Link>
//                           )}
//                           <button onClick={e => { e.stopPropagation(); isEvent ? handleEventAction(item.id, 'reject') : handleServiceAction(item.id, 'reject'); }}
//                             className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
//                             <X size={17} />
//                           </button>
//                         </div>
//                         {/* Always visible on mobile */}
//                         <div className="flex items-center justify-end gap-1 lg:hidden">
//                           <button onClick={e => { e.stopPropagation(); isEvent ? handleEventAction(item.id, 'approve') : handleServiceAction(item.id, 'approve'); }}
//                             className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
//                             <CheckCircle2 size={15} />
//                           </button>
//                           {isEvent && (
//                             <Link to={`/moderation/${item.id}`} onClick={e => e.stopPropagation()}
//                               className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
//                               <Eye size={15} />
//                             </Link>
//                           )}
//                           <button onClick={e => { e.stopPropagation(); isEvent ? handleEventAction(item.id, 'reject') : handleServiceAction(item.id, 'reject'); }}
//                             className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
//                             <X size={15} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
//             <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safePage === 1}
//               className="text-xs font-semibold text-slate-500 flex items-center gap-1 hover:text-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
//               <ChevronLeft size={14} /> Prev
//             </button>

//             <div className="flex items-center gap-1.5">
//               {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
//                 let page = i + 1;
//                 if (totalPages > 5) {
//                   if (safePage <= 3) page = i + 1;
//                   else if (safePage >= totalPages - 2) page = totalPages - 4 + i;
//                   else page = safePage - 2 + i;
//                 }
//                 return (
//                   <button key={page} onClick={() => setCurrentPage(page)}
//                     className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-all
//                       ${safePage === page ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}>
//                     {page}
//                   </button>
//                 );
//               })}
//               {totalPages > 5 && safePage < totalPages - 2 && (
//                 <>
//                   <span className="text-slate-300 text-xs">…</span>
//                   <button onClick={() => setCurrentPage(totalPages)}
//                     className="w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold bg-white text-slate-500 hover:bg-slate-100 border border-slate-200">
//                     {totalPages}
//                   </button>
//                 </>
//               )}
//             </div>

//             <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
//               className="text-xs font-semibold text-slate-500 flex items-center gap-1 hover:text-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
//               Next <ChevronRight size={14} />
//             </button>
//           </div>
//         </div>

//         {/* ── AI INSIGHTS PANEL ── */}
//         <div className="col-span-12 lg:col-span-4 space-y-4">

//           {/* Analysis card */}
//           <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center">
//                   <Sparkles size={15} className="text-violet-600" />
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-sm text-slate-900">AI Analysis</h4>
//                   {selectedAnalysis && !selectedAnalysis.isLoading && (
//                     <p className="text-[10px] text-slate-400">Scanned {timeAgo(selectedAnalysis.scannedAt)}</p>
//                   )}
//                 </div>
//               </div>
//               {selectedAnalysis && !selectedAnalysis.isLoading && (
//                 <div className="flex items-center gap-2">
//                   <span className={`text-[10px] px-2 py-1 rounded-full font-bold
//                     ${selectedAnalysis.riskScore >= 70 ? 'bg-red-50 text-red-600' :
//                       selectedAnalysis.riskScore >= 40 ? 'bg-amber-50 text-amber-700' :
//                       'bg-emerald-50 text-emerald-600'}`}>
//                     {getRiskLabel(selectedAnalysis.riskLevel)}
//                   </span>
//                   <button onClick={() => {
//                     if (activeTab === 'events' && selectedEvent) analyzeEvent(selectedEvent, true);
//                     else if (activeTab === 'services' && selectedService) analyzeService(selectedService, true);
//                   }} title="Re-analyze" className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors">
//                     <RotateCcw size={13} />
//                   </button>
//                 </div>
//               )}
//             </div>

//             {!selectedItem ? (
//               <p className="text-xs text-slate-400 text-center py-6">Select an item to see AI analysis</p>
//             ) : selectedAnalysis?.isLoading || analyzingId === selectedItem.id ? (
//               <div className="space-y-3">
//                 <div className="flex items-center gap-2 text-indigo-500">
//                   <Loader2 size={14} className="animate-spin" />
//                   <span className="text-xs font-semibold">Analyzing with AI…</span>
//                 </div>
//                 <Skeleton />
//               </div>
//             ) : selectedAnalysis ? (
//               <>
//                 <div className="mb-4 bg-slate-50 rounded-xl p-3">
//                   <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Analyzing</p>
//                   <p className="text-sm font-semibold text-slate-900 leading-tight">"{selectedItem.title}"</p>
//                   <p className="text-xs text-slate-500 mt-2 leading-relaxed">{selectedAnalysis.summary}</p>
//                 </div>

//                 {/* Metric bars */}
//                 <div className="space-y-3 mb-4">
//                   {[
//                     { label: 'Semantic Integrity', value: selectedAnalysis.semanticIntegrity, icon: <TrendingUp size={11} /> },
//                     { label: 'Host Legitimacy', value: selectedAnalysis.hostLegitimacy, icon: <Shield size={11} /> },
//                     { label: 'Engagement', value: selectedAnalysis.engagementPattern, icon: <Activity size={11} /> },
//                   ].map(m => (
//                     <div key={m.label}>
//                       <div className="flex justify-between text-[11px] mb-1.5">
//                         <span className="text-slate-500 flex items-center gap-1">{m.icon} {m.label}</span>
//                         <span className={`font-bold ${getRiskColor(100 - m.value)}`}>{m.value}/100</span>
//                       </div>
//                       <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
//                         <div className={`h-full transition-all duration-700 rounded-full ${getRiskBarColor(100 - m.value)}`}
//                           style={{ width: `${m.value}%` }} />
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Flags */}
//                 {(selectedAnalysis.flags?.length ?? 0) > 0 && (
//                   <div className="space-y-2 mb-4">
//                     {selectedAnalysis.flags.map((flag, i) => (
//                       <div key={i} className={`p-3 rounded-xl flex items-start gap-2
//                         ${flag.severity === 'high' ? 'bg-red-50 border-l-2 border-red-400' : 'bg-amber-50 border-l-2 border-amber-400'}`}>
//                         <AlertCircle size={13} className={flag.severity === 'high' ? 'text-red-500 mt-0.5 flex-shrink-0' : 'text-amber-500 mt-0.5 flex-shrink-0'} />
//                         <div>
//                           <p className="text-xs font-semibold text-slate-800">{flag.type}</p>
//                           <p className="text-[11px] text-slate-500 mt-0.5">{flag.description}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* Recommendation */}
//                 <div className="bg-indigo-50 p-3 rounded-xl mb-4">
//                   <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Recommendation</p>
//                   <p className="text-xs text-slate-600 italic leading-relaxed">"{selectedAnalysis.recommendation}"</p>
//                 </div>

//                 {activeTab === 'events' && selectedEvent && (
//                   <Link to={`/moderation/${selectedEvent.id}`}
//                     className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 text-center block transition-colors">
//                     Full Report →
//                   </Link>
//                 )}
//               </>
//             ) : (
//               <div className="text-center py-6">
//                 <div className="w-12 h-12 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-3">
//                   <Sparkles size={20} className="text-violet-400" />
//                 </div>
//                 <p className="text-xs text-slate-400 mb-3">Click any item to run AI analysis</p>
//                 <button onClick={() => {
//                   if (activeTab === 'events' && selectedEvent) analyzeEvent(selectedEvent);
//                   else if (activeTab === 'services' && selectedService) analyzeService(selectedService);
//                 }}
//                   className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-indigo-700 flex items-center gap-2 mx-auto transition-colors">
//                   <Sparkles size={13} /> Analyze
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Context Panel */}
//           {selectedItem && (
//             <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
//               <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
//                 {activeTab === 'events' ? 'Event Details' : 'Service Details'}
//               </h4>

//               {/* Item image + title */}
//               <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-50">
//                 <img src={selectedItem.image} alt={selectedItem.title}
//                   className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
//                   onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/e0e7ff/4f46e5?text=?'; }}
//                 />
//                 <div className="min-w-0">
//                   <p className="text-sm font-semibold text-slate-900 truncate">{selectedItem.title}</p>
//                   <StatusPill status={selectedItem.status} />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 {(activeTab === 'events' && selectedEvent ? [
//                   { label: 'Category', val: selectedEvent.category },
//                   { label: 'Price', val: selectedEvent.ticketPrice },
//                   { label: 'Capacity', val: String(selectedEvent.capacity) },
//                   { label: 'Event Date', val: selectedEvent.eventDate || '—' },
//                   { label: 'Location', val: selectedEvent.location },
//                 ] : selectedService ? [
//                   { label: 'Price', val: selectedService.ticketPrice },
//                   { label: 'Availability', val: selectedService.scheduleSummary },
//                   { label: 'Join Policy', val: selectedService.joinPolicy },
//                   { label: 'Location', val: selectedService.location },
//                 ] : []).map(r => (
//                   <div key={r.label} className="flex justify-between items-center text-xs">
//                     <span className="text-slate-400">{r.label}</span>
//                     <span className="font-medium text-slate-700 text-right max-w-[55%] truncate">{r.val}</span>
//                   </div>
//                 ))}
//               </div>

//               {/* Action buttons */}
//               <div className="mt-4 pt-4 border-t border-slate-50 grid grid-cols-2 gap-2">
//                 <button
//                   onClick={() => activeTab === 'events' && selectedEvent
//                     ? handleEventAction(selectedEvent.id, 'approve')
//                     : selectedService && handleServiceAction(selectedService.id, 'approve')}
//                   className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
//                   <CheckCircle2 size={13} /> Approve
//                 </button>
//                 <button
//                   onClick={() => activeTab === 'events' && selectedEvent
//                     ? handleEventAction(selectedEvent.id, 'reject')
//                     : selectedService && handleServiceAction(selectedService.id, 'reject')}
//                   className="py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-red-100">
//                   <X size={13} /> Reject
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ModerationQueue;
// frontend/src/pages/ModerationQueue.tsx
// ✅ AUTO-REFRESH — har 30 sec mein /events/since + /services/since poll
//    Naye events bina reload ke queue mein appear ho jaate hain — koi flicker nahi
//    UI bilkul same hai (document 4 wali) — sirf auto-refresh logic add hua hai

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CheckCircle2, Eye, X, ChevronLeft, ChevronRight,
  Sparkles, AlertCircle, Loader2, RefreshCw, Database,
  Bot, ToggleLeft, ToggleRight, Calendar, Clock, Info, RotateCcw,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getRiskColor, getRiskBarColor, getRiskLabel } from '../lib/openai';
import { getEventsFromAPI, updateEventStatusAPI, getEvents, updateEventStatus } from '../lib/mockEvents';
import type { Event, AIAnalysis } from '../types';

interface ServiceItem {
  id: string; title: string; host: string; hostVerified: boolean; image: string;
  category: string; emoji: string; dateSubmitted: string; location: string;
  ticketPrice: string; rateType: string | null; capacity: number | null;
  description: string; status: string; attendeesCount: number; joinPolicy: string;
  scheduleSummary: string; meetupStyle: string | null; minDuration: string | null;
  aiAnalysis: AIAnalysis | null; creatorClerkId: string | null; kind: 'service';
}

function isInRange(dateStr: string, from: string, to: string): boolean {
  if (!dateStr) return true;
  const d = new Date(dateStr).getTime();
  if (isNaN(d)) return true;
  if (from && d < new Date(from).getTime()) return false;
  if (to && d > new Date(to + 'T23:59:59').getTime()) return false;
  return true;
}
function toISO(date: Date) { return date.toISOString().slice(0, 10); }

type ActiveTab = 'events' | 'services';

const Skeleton = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-3 bg-indigo-100 rounded w-3/4" />
    <div className="h-3 bg-indigo-100 rounded w-1/2" />
    <div className="h-8 bg-indigo-100 rounded w-full" />
  </div>
);

const RiskBadge = ({ analysis }: { analysis?: AIAnalysis }) => {
  if (!analysis) return <span className="text-[10px] text-on-surface-variant">Not analyzed</span>;
  if (analysis.isLoading) return <Loader2 size={14} className="animate-spin text-primary" />;
  return (
    <div className="flex flex-col gap-1">
      <span className={`text-[11px] font-bold ${getRiskColor(analysis.riskScore ?? 0)}`}>{analysis.riskScore ?? '—'}%</span>
      <div className="w-full bg-indigo-100 h-1.5 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-700 ${getRiskBarColor(analysis.riskScore ?? 0)}`} style={{ width: `${analysis.riskScore ?? 0}%` }} />
      </div>
    </div>
  );
};

const sStyle = (s: string) => ({
  flagged: 'text-tertiary bg-tertiary-container/10', pending: 'text-on-surface-variant bg-surface-container-highest',
  under_review: 'text-amber-700 bg-amber-100', approved: 'text-on-secondary-container bg-secondary-container',
  rejected: 'text-tertiary bg-tertiary/10', active: 'text-on-secondary-container bg-secondary-container',
  paused: 'text-amber-700 bg-amber-100',
}[s] || 'text-on-surface-variant bg-surface-container-highest');

const sLabel = (s: string) => ({
  pending: 'PENDING', flagged: 'FLAGGED', under_review: 'UNDER REVIEW',
  approved: 'APPROVED', rejected: 'REJECTED', active: 'ACTIVE', paused: 'PAUSED',
}[s] || s.toUpperCase());

const ModerationQueue = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('events');

  const [events, setEvents] = useState<Event[]>([]);
  const [eventAnalyses, setEventAnalyses] = useState<Record<string, AIAnalysis>>({});
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventDataSource, setEventDataSource] = useState<'api' | 'local'>('api');
  // ✅ timestamp track karo — /since polling ke liye
  const lastEventTs = useRef<number>(Date.now());

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [serviceAnalyses, setServiceAnalyses] = useState<Record<string, AIAnalysis>>({});
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesLoaded, setServicesLoaded] = useState(false);
  const lastServiceTs = useRef<number>(Date.now());

  const [filterStatus, setFilterStatus] = useState('all');
  const [startDateFrom, setStartDateFrom] = useState('');
  const [startDateTo, setStartDateTo] = useState('');
  const [createdFrom, setCreatedFrom] = useState('');
  const [createdTo, setCreatedTo] = useState('');
  const [showDateFilters, setShowDateFilters] = useState(false);

  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const [copilotMode, setCopilotMode] = useState(false);
  const [copilotRunning, setCopilotRunning] = useState(false);
  const [copilotLog, setCopilotLog] = useState<string[]>([]);
  const [autoApproveThreshold, setAutoApproveThreshold] = useState(30);
  const [autoRejectThreshold, setAutoRejectThreshold] = useState(70);
  const copilotStopRef = useRef(false);

  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // ─── Full load ────────────────────────────────────────────────────────────
  const loadEvents = async () => {
    setEventsLoading(true);
    const t = Date.now();
    try {
      const apiEvents = await getEventsFromAPI();
      if (apiEvents.length > 0) {
        setEvents(apiEvents);
        setSelectedEvent(s => s ?? apiEvents[0]);
        setEventDataSource('api');
        const cached: Record<string, AIAnalysis> = {};
        for (const ev of apiEvents) {
          if ((ev as any).aiAnalysis?.riskScore !== undefined)
            cached[ev.id] = { ...(ev as any).aiAnalysis, isLoading: false };
        }
        if (Object.keys(cached).length) setEventAnalyses(p => ({ ...cached, ...p }));
      } else {
        const local = getEvents();
        setEvents(local);
        setSelectedEvent(s => s ?? local[0] ?? null);
        setEventDataSource('local');
      }
      lastEventTs.current = t;
    } catch {
      const local = getEvents();
      setEvents(local);
      setSelectedEvent(s => s ?? local[0] ?? null);
      setEventDataSource('local');
    } finally { setEventsLoading(false); }
  };

  const loadServices = async () => {
    setServicesLoading(true);
    const t = Date.now();
    try {
      const res = await fetch('http://localhost:5006/services');
      if (!res.ok) throw new Error();
      const data: ServiceItem[] = await res.json();
      setServices(data);
      setSelectedService(s => s ?? data[0] ?? null);
      const cached: Record<string, AIAnalysis> = {};
      for (const sv of data) {
        if (sv.aiAnalysis?.riskScore !== undefined)
          cached[sv.id] = { ...sv.aiAnalysis, isLoading: false };
      }
      if (Object.keys(cached).length) setServiceAnalyses(p => ({ ...cached, ...p }));
      setServicesLoaded(true);
      lastServiceTs.current = t;
    } catch { setServicesLoaded(true); }
    finally { setServicesLoading(false); }
  };

  // ─── Auto-refresh polling ─────────────────────────────────────────────────
  // Har 30 sec mein /events/since?ts=... call karo
  // Sirf naye events aate hain — existing sab preserve hote hain
  // Koi spinner nahi, koi reload nahi — silently prepend ho jaate hain
  const pollNewItems = useCallback(async () => {
    try {
      if (eventDataSource === 'api') {
        const res = await fetch(`http://localhost:5006/events/since?ts=${lastEventTs.current}`);
        if (res.ok) {
          const { events: newEvs } = await res.json();
          if (newEvs?.length) {
            setEvents(prev => {
              const existing = new Set(prev.map((e: Event) => e.id));
              const toAdd = newEvs.filter((e: Event) => !existing.has(e.id));
              if (!toAdd.length) return prev;
              // cached analyses bhi load karo
              const cached: Record<string, AIAnalysis> = {};
              for (const ev of toAdd)
                if ((ev as any).aiAnalysis?.riskScore !== undefined)
                  cached[ev.id] = { ...(ev as any).aiAnalysis, isLoading: false };
              if (Object.keys(cached).length) setEventAnalyses(p => ({ ...cached, ...p }));
              return [...toAdd, ...prev]; // naye events top pe aate hain
            });
            lastEventTs.current = Date.now();
          }
        }
      }
      if (servicesLoaded) {
        const res = await fetch(`http://localhost:5006/services/since?ts=${lastServiceTs.current}`);
        if (res.ok) {
          const { services: newSvs } = await res.json();
          if (newSvs?.length) {
            setServices(prev => {
              const existing = new Set(prev.map((s: ServiceItem) => s.id));
              const toAdd = newSvs.filter((s: ServiceItem) => !existing.has(s.id));
              if (!toAdd.length) return prev;
              return [...toAdd, ...prev];
            });
            lastServiceTs.current = Date.now();
          }
        }
      }
    } catch { /* silently ignore */ }
  }, [eventDataSource, servicesLoaded]);

  useEffect(() => { loadEvents(); }, []);
  useEffect(() => { if (activeTab === 'services' && !servicesLoaded) loadServices(); }, [activeTab]);
  useEffect(() => { setCurrentPage(1); }, [filterStatus, startDateFrom, startDateTo, createdFrom, createdTo, activeTab]);

  // ✅ Auto-refresh interval — 30 seconds
  useEffect(() => {
    const interval = setInterval(pollNewItems, 30000);
    return () => clearInterval(interval);
  }, [pollNewItems]);

  // ─── Analyze ──────────────────────────────────────────────────────────────
  const analyzeEvent = useCallback(async (event: Event, force = false): Promise<AIAnalysis | null> => {
    setAnalyzingId(event.id);
    setEventAnalyses(p => ({ ...p, [event.id]: { ...(p[event.id] || {}), isLoading: true } as AIAnalysis }));
    try {
      const res = await fetch('http://localhost:5006/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, force }),
      });
      const data = await res.json();
      const safe: AIAnalysis = {
        riskScore: data.riskScore ?? 0, riskLevel: data.riskLevel ?? 'low',
        semanticIntegrity: data.semanticIntegrity ?? 80, hostLegitimacy: data.hostLegitimacy ?? 80,
        engagementPattern: data.engagementPattern ?? 80, flags: Array.isArray(data.flags) ? data.flags : [],
        summary: data.summary ?? '', recommendation: data.recommendation ?? '',
        scannedAt: data.scannedAt ?? new Date().toISOString(), isLoading: false,
      };
      setEventAnalyses(p => ({ ...p, [event.id]: safe }));
      return safe;
    } catch { return null; } finally { setAnalyzingId(null); }
  }, []);

  const analyzeService = useCallback(async (service: ServiceItem, force = false): Promise<AIAnalysis | null> => {
    setAnalyzingId(service.id);
    setServiceAnalyses(p => ({ ...p, [service.id]: { ...(p[service.id] || {}), isLoading: true } as AIAnalysis }));
    try {
      const res = await fetch('http://localhost:5006/analyze-service', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service, force }),
      });
      const data = await res.json();
      const safe: AIAnalysis = {
        riskScore: data.riskScore ?? 0, riskLevel: data.riskLevel ?? 'low',
        semanticIntegrity: data.semanticIntegrity ?? 80, hostLegitimacy: data.hostLegitimacy ?? 80,
        engagementPattern: data.engagementPattern ?? 80, flags: Array.isArray(data.flags) ? data.flags : [],
        summary: data.summary ?? '', recommendation: data.recommendation ?? '',
        scannedAt: data.scannedAt ?? new Date().toISOString(), isLoading: false,
      };
      setServiceAnalyses(p => ({ ...p, [service.id]: safe }));
      return safe;
    } catch { return null; } finally { setAnalyzingId(null); }
  }, []);

  // ─── Actions ──────────────────────────────────────────────────────────────
  const handleEventAction = async (eventId: string, action: 'approve' | 'reject', silent = false) => {
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    setEvents(p => p.map(e => e.id === eventId ? { ...e, status: newStatus } : e));
    if (eventDataSource === 'api') {
      const ok = await updateEventStatusAPI(eventId, newStatus);
      if (!ok && !silent) { showToast('Failed to update in MongoDB', 'error'); setEvents(p => p.map(e => e.id === eventId ? { ...e, status: 'pending' } : e)); return; }
    } else { updateEventStatus(eventId, newStatus); }
    if (!silent) showToast(action === 'approve' ? '✓ Event approved & listed on MyApp!' : '✗ Event rejected', action === 'approve' ? 'success' : 'error');
    if (selectedEvent?.id === eventId) { const next = events.find(e => e.id !== eventId && e.status === 'pending'); if (next) setSelectedEvent(next); }
  };

  const handleServiceAction = async (serviceId: string, action: 'approve' | 'reject', silent = false) => {
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    setServices(p => p.map(s => s.id === serviceId ? { ...s, status: newStatus } : s));
    try { await fetch(`http://localhost:5006/services/${serviceId}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) }); }
    catch { if (!silent) showToast('Network error', 'error'); }
    if (!silent) showToast(action === 'approve' ? '✓ Service approved & live on MyApp!' : '✗ Service rejected', action === 'approve' ? 'success' : 'error');
    if (selectedService?.id === serviceId) { const next = services.find(s => s.id !== serviceId && s.status === 'pending'); if (next) setSelectedService(next); }
  };

  // ─── Co-Pilot ─────────────────────────────────────────────────────────────
  const runCopilot = async () => {
    const isEvents = activeTab === 'events';
    const pending = isEvents ? events.filter(e => e.status === 'pending' || e.status === 'flagged') : services.filter(s => s.status === 'pending' || s.status === 'flagged');
    if (!pending.length) { showToast('No pending items', 'info'); return; }
    setCopilotRunning(true); copilotStopRef.current = false;
    setCopilotLog([`🤖 Co-Pilot started — ${pending.length} ${isEvents ? 'events' : 'services'}`, `📊 Approve ≤${autoApproveThreshold}% | Reject ≥${autoRejectThreshold}%`]);
    let approved = 0, rejected = 0, skipped = 0;
    for (const item of pending) {
      if (copilotStopRef.current) { setCopilotLog(p => [...p, '⏹ Stopped']); break; }
      setCopilotLog(p => [...p, `🔍 "${item.title}"...`]);
      const analysis = isEvents ? await analyzeEvent(item as Event) : await analyzeService(item as ServiceItem);
      if (!analysis) { setCopilotLog(p => [...p, '  ⚠️ Failed']); skipped++; continue; }
      const score = analysis.riskScore ?? 50;
      if (score <= autoApproveThreshold) { isEvents ? await handleEventAction(item.id, 'approve', true) : await handleServiceAction(item.id, 'approve', true); setCopilotLog(p => [...p, `  ✅ APPROVED — ${score}%`]); approved++; }
      else if (score >= autoRejectThreshold) { isEvents ? await handleEventAction(item.id, 'reject', true) : await handleServiceAction(item.id, 'reject', true); setCopilotLog(p => [...p, `  ❌ REJECTED — ${score}%`]); rejected++; }
      else { setCopilotLog(p => [...p, `  🟡 REVIEW — ${score}%`]); skipped++; }
      await new Promise(r => setTimeout(r, 400));
    }
    setCopilotLog(p => [...p, '', `✅ ${approved} | ❌ ${rejected} | 🟡 ${skipped}`]);
    setCopilotRunning(false);
    if (isEvents) loadEvents(); else loadServices();
  };

  // ─── Filter + Paginate ────────────────────────────────────────────────────
  const currentItems = activeTab === 'events' ? events : services;
  const filtered = currentItems.filter((item: any) => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if ((startDateFrom || startDateTo) && !isInRange(item.eventDate || '', startDateFrom, startDateTo)) return false;
    if (createdFrom || createdTo) { const ds = typeof item.dateSubmitted === 'string' ? item.dateSubmitted : String(item.dateSubmitted || ''); if (!isInRange(ds, createdFrom, createdTo)) return false; }
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
  const hasDateFilter = startDateFrom || startDateTo || createdFrom || createdTo;
  const pendingCount = currentItems.filter((i: any) => i.status === 'pending').length;
  const flaggedCount = currentItems.filter((i: any) => i.status === 'flagged').length;
  const selectedItem = activeTab === 'events' ? selectedEvent : selectedService;
  const selectedAnalysis = selectedItem ? (activeTab === 'events' ? eventAnalyses[selectedItem.id] : serviceAnalyses[selectedItem.id]) : null;
  const isLoading = activeTab === 'events' ? eventsLoading : servicesLoading;

  return (
    <div className="space-y-6">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg font-bold text-sm text-white transition-all ${notification.type === 'success' ? 'bg-secondary' : notification.type === 'error' ? 'bg-tertiary' : 'bg-primary'}`}>
          {notification.msg}
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Database size={10} />
            {activeTab === 'events' ? (eventDataSource === 'api' ? 'Live — MyApp MongoDB' : 'LocalStorage (backend offline)') : 'Live — MyApp MongoDB (Services)'}
          </span>
          <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">Moderation Queue</h3>
          <p className="text-on-surface-variant text-sm mt-1">
            {activeTab === 'events' ? 'Events awaiting AI review & approval before listing on MyApp.' : 'Services awaiting AI review & approval before listing on MyApp.'}
          </p>
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase">Pending</p>
            <p className="text-xl font-extrabold text-primary">{pendingCount}</p>
          </div>
          <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase">Flagged</p>
            <p className="text-xl font-extrabold text-tertiary">{flaggedCount}</p>
          </div>
          <button onClick={() => setCopilotMode(p => !p)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${copilotMode ? 'bg-indigo-900 border-indigo-700 text-white' : 'bg-white border-indigo-200 text-indigo-700 hover:border-indigo-400'}`}>
            <Bot size={16} /> Co-Pilot {copilotMode ? 'ON' : 'OFF'}
            {copilotMode ? <ToggleRight size={18} className="text-indigo-300" /> : <ToggleLeft size={18} className="text-indigo-400" />}
          </button>
          <button onClick={() => { if (activeTab === 'events') { loadEvents(); showToast('Events refreshed!', 'info'); } else { loadServices(); showToast('Services refreshed!', 'info'); } }} disabled={isLoading}
            className="bg-white border border-primary text-primary px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/5 disabled:opacity-50">
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* TAB BAR */}
      <div className="flex gap-2">
        <button onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${activeTab === 'events' ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20' : 'bg-white border-surface-container-highest text-on-surface-variant hover:border-primary/30'}`}>
          <Calendar size={15} /> Events
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'events' ? 'bg-white/20 text-white' : 'bg-surface-container-highest text-on-surface-variant'}`}>{events.length}</span>
        </button>
        <button onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${activeTab === 'services' ? 'bg-secondary text-white border-secondary shadow-sm shadow-secondary/20' : 'bg-white border-surface-container-highest text-on-surface-variant hover:border-secondary/30'}`}>
          <Wrench size={15} /> Services
          {servicesLoaded && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'services' ? 'bg-white/20 text-white' : 'bg-surface-container-highest text-on-surface-variant'}`}>{services.length}</span>}
        </button>
      </div>

      {/* CO-PILOT */}
      {copilotMode && (
        <div className="bg-indigo-950 rounded-3xl p-6 border border-indigo-800 shadow-xl space-y-5">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-10 h-10 bg-indigo-700 rounded-2xl flex items-center justify-center"><Bot size={20} className="text-white" /></div>
            <div><h4 className="text-white font-bold text-base">AI Co-Pilot Mode</h4><p className="text-indigo-300 text-xs">Auto-analyzes pending {activeTab} and approves/rejects based on risk score</p></div>
            <div className="ml-auto bg-indigo-900/60 border border-indigo-700/50 rounded-xl px-4 py-3 max-w-xs">
              <p className="text-indigo-200 text-[11px] leading-relaxed flex items-start gap-2"><Info size={12} className="flex-shrink-0 mt-0.5 text-indigo-400" />Lower "approve threshold" = stricter moderation. Middle zone needs human review.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-indigo-900/50 rounded-2xl p-4 border border-indigo-800/50">
              <div className="flex justify-between mb-2"><label className="text-[11px] font-bold text-green-400 uppercase flex items-center gap-1"><CheckCircle2 size={12} /> Auto-Approve if Risk ≤</label><span className="text-green-400 font-extrabold text-sm">{autoApproveThreshold}%</span></div>
              <input type="range" min={0} max={60} step={5} value={autoApproveThreshold} onChange={e => setAutoApproveThreshold(Number(e.target.value))} className="w-full accent-green-500" />
              <p className="text-indigo-400 text-[10px] mt-1.5">Risk ≤ {autoApproveThreshold}% → listed on MyApp automatically</p>
            </div>
            <div className="bg-indigo-900/50 rounded-2xl p-4 border border-indigo-800/50">
              <div className="flex justify-between mb-2"><label className="text-[11px] font-bold text-red-400 uppercase flex items-center gap-1"><X size={12} /> Auto-Reject if Risk ≥</label><span className="text-red-400 font-extrabold text-sm">{autoRejectThreshold}%</span></div>
              <input type="range" min={40} max={100} step={5} value={autoRejectThreshold} onChange={e => setAutoRejectThreshold(Number(e.target.value))} className="w-full accent-red-500" />
              <p className="text-indigo-400 text-[10px] mt-1.5">Risk ≥ {autoRejectThreshold}% → auto-rejected</p>
            </div>
          </div>
          <div>
            <p className="text-indigo-400 text-[10px] font-bold uppercase mb-1.5">Risk Band</p>
            <div className="h-6 rounded-full overflow-hidden flex">
              <div className="bg-green-500/80 flex items-center justify-center text-[9px] font-bold text-white" style={{ width: `${autoApproveThreshold}%` }}>{autoApproveThreshold > 12 ? 'AUTO-APPROVE' : ''}</div>
              <div className="bg-amber-500/80 flex items-center justify-center text-[9px] font-bold text-white" style={{ width: `${autoRejectThreshold - autoApproveThreshold}%` }}>{autoRejectThreshold - autoApproveThreshold > 15 ? 'HUMAN REVIEW' : ''}</div>
              <div className="bg-red-500/80 flex-1 flex items-center justify-center text-[9px] font-bold text-white">{100 - autoRejectThreshold > 5 ? 'AUTO-REJECT' : ''}</div>
            </div>
          </div>
          <div className="flex gap-3">
            {!copilotRunning
              ? <button onClick={runCopilot} disabled={pendingCount === 0} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 disabled:opacity-40"><Bot size={16} /> Run Co-Pilot on {pendingCount} Pending {activeTab === 'events' ? 'Events' : 'Services'}</button>
              : <button onClick={() => { copilotStopRef.current = true; setCopilotRunning(false); }} className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90"><X size={16} /> Stop Co-Pilot</button>
            }
          </div>
          {copilotLog.length > 0 && (
            <div className="bg-black/40 rounded-2xl p-4 max-h-44 overflow-y-auto font-mono space-y-0.5">
              {copilotLog.map((line, i) => (
                <div key={i} className={`text-[11px] leading-relaxed ${line.includes('APPROVED') ? 'text-green-400' : line.includes('REJECTED') ? 'text-red-400' : line.includes('REVIEW') ? 'text-amber-400' : line.includes('✅') && !line.includes('APPROVED') ? 'text-white font-bold' : 'text-indigo-300'}`}>{line || '\u00A0'}</div>
              ))}
              {copilotRunning && <div className="flex items-center gap-2 text-indigo-300 text-[11px]"><Loader2 size={10} className="animate-spin" /> Processing…</div>}
            </div>
          )}
        </div>
      )}

      {/* FILTERS */}
      <div className="bg-surface-container-low p-4 rounded-2xl space-y-3">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">Status</label>
            <select className="w-full bg-surface-container-highest border-none rounded-xl text-sm p-2" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option><option value="pending">Pending</option><option value="flagged">Flagged</option>
              <option value="approved">Approved</option><option value="rejected">Rejected</option>
              {activeTab === 'services' && <><option value="active">Active</option><option value="paused">Paused</option></>}
            </select>
          </div>
          <button onClick={() => setShowDateFilters(p => !p)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${showDateFilters || hasDateFilter ? 'bg-primary text-white border-primary' : 'bg-surface-container-highest text-primary border-primary/20 hover:border-primary/50'}`}>
            <Calendar size={14} /> Date Filters {hasDateFilter && <span className="bg-white/20 text-[9px] px-1.5 py-0.5 rounded-full font-bold">ON</span>}
          </button>
          {hasDateFilter && <button onClick={() => { setStartDateFrom(''); setStartDateTo(''); setCreatedFrom(''); setCreatedTo(''); }} className="text-xs text-tertiary font-bold hover:underline flex items-center gap-1"><X size={12} /> Clear dates</button>}
        </div>
        {showDateFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-indigo-100/30">
            {activeTab === 'events' && (
              <div className="bg-surface-container-lowest rounded-2xl p-4 border border-indigo-50/50">
                <p className="text-[11px] font-bold text-primary mb-1 flex items-center gap-1.5"><Calendar size={11} /> Event Start Date</p>
                <p className="text-[10px] text-on-surface-variant mb-3">Event kab hoga</p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div><label className="text-[10px] text-on-surface-variant font-bold block mb-1">From</label><input type="date" value={startDateFrom} onChange={e => setStartDateFrom(e.target.value)} className="w-full bg-surface-container-high border-none rounded-xl text-xs p-2 focus:ring-2 ring-primary/20" /></div>
                  <div><label className="text-[10px] text-on-surface-variant font-bold block mb-1">To</label><input type="date" value={startDateTo} onChange={e => setStartDateTo(e.target.value)} className="w-full bg-surface-container-high border-none rounded-xl text-xs p-2 focus:ring-2 ring-primary/20" /></div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[{ l: 'Today', f: toISO(new Date()), t: toISO(new Date()) }, { l: 'This Week', f: toISO(new Date()), t: toISO(new Date(Date.now() + 7 * 86400000)) }].map(p => (
                    <button key={p.l} onClick={() => { setStartDateFrom(p.f); setStartDateTo(p.t); }} className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold hover:bg-primary/20">{p.l}</button>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-surface-container-lowest rounded-2xl p-4 border border-indigo-50/50">
              <p className="text-[11px] font-bold text-secondary mb-1 flex items-center gap-1.5"><Clock size={11} /> Submitted Date</p>
              <p className="text-[10px] text-on-surface-variant mb-3">Admin ko kab mila</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div><label className="text-[10px] text-on-surface-variant font-bold block mb-1">From</label><input type="date" value={createdFrom} onChange={e => setCreatedFrom(e.target.value)} className="w-full bg-surface-container-high border-none rounded-xl text-xs p-2 focus:ring-2 ring-primary/20" /></div>
                <div><label className="text-[10px] text-on-surface-variant font-bold block mb-1">To</label><input type="date" value={createdTo} onChange={e => setCreatedTo(e.target.value)} className="w-full bg-surface-container-high border-none rounded-xl text-xs p-2 focus:ring-2 ring-primary/20" /></div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[{ l: 'Today', f: toISO(new Date()), t: toISO(new Date()) }, { l: 'Last 7 days', f: toISO(new Date(Date.now() - 7 * 86400000)), t: toISO(new Date()) }].map(p => (
                  <button key={p.l} onClick={() => { setCreatedFrom(p.f); setCreatedTo(p.t); }} className="text-[10px] px-2.5 py-1 rounded-full bg-secondary/10 text-secondary font-bold hover:bg-secondary/20">{p.l}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Table */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-indigo-50/50">
          <div className="px-6 py-4 bg-indigo-50/30 flex justify-between items-center border-b border-indigo-50/50">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-bold text-indigo-900">
                {filtered.length} {activeTab}{filtered.length !== currentItems.length && <span className="text-on-surface-variant font-normal"> (of {currentItems.length})</span>}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'events' && eventDataSource === 'api' ? 'bg-secondary/10 text-secondary' : activeTab === 'services' ? 'bg-secondary/10 text-secondary' : 'bg-amber-50 text-amber-700'}`}>
                {activeTab === 'events' ? (eventDataSource === 'api' ? 'MONGODB LIVE' : 'LOCAL') : 'MONGODB LIVE'}
              </span>
            </div>
            <button onClick={() => { if (activeTab === 'events') loadEvents(); else loadServices(); }} disabled={isLoading}
              className="text-xs font-bold text-primary flex items-center gap-1 hover:underline disabled:opacity-50">
              <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b border-indigo-50">
                  <th className="pl-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{activeTab === 'events' ? 'Event & Host' : 'Service & Provider'}</th>
                  {activeTab === 'events' && (
                    <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      <span className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1"><Calendar size={9} className="text-primary" /> Event Date</span>
                        <span className="flex items-center gap-1"><Clock size={9} className="text-on-surface-variant" /> Submitted</span>
                      </span>
                    </th>
                  )}
                  {activeTab === 'services' && <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Details</th>}
                  <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">AI Flags</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider w-24">Risk</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="pr-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-50/30">
                {isLoading ? (
                  <tr><td colSpan={6} className="py-16 text-center"><Loader2 size={28} className="animate-spin text-primary mx-auto mb-2" /><p className="text-sm text-on-surface-variant">Fetching {activeTab}…</p></td></tr>
                ) : activeTab === 'services' && !servicesLoaded ? (
                  <tr><td colSpan={6} className="py-16 text-center"><Loader2 size={28} className="animate-spin text-secondary mx-auto mb-2" /><p className="text-sm text-on-surface-variant">Loading services…</p></td></tr>
                ) : pageItems.length === 0 ? (
                  <tr><td colSpan={6} className="py-16 text-center text-sm text-on-surface-variant">
                    {currentItems.length === 0 ? `No ${activeTab} found. Backend running on port 5006?`
                      : <span>No {activeTab} match filters. <button onClick={() => { setFilterStatus('all'); setStartDateFrom(''); setStartDateTo(''); setCreatedFrom(''); setCreatedTo(''); }} className="text-primary font-bold hover:underline">Clear filters</button></span>}
                  </td></tr>
                ) : pageItems.map((item: any) => {
                  const isEvent = item.kind !== 'service';
                  const analysis = isEvent ? eventAnalyses[item.id] : serviceAnalyses[item.id];
                  const isSelected = isEvent ? selectedEvent?.id === item.id : selectedService?.id === item.id;
                  return (
                    <tr key={item.id}
                      onClick={() => { if (isEvent) { setSelectedEvent(item); if (!eventAnalyses[item.id]) analyzeEvent(item); } else { setSelectedService(item); if (!serviceAnalyses[item.id]) analyzeService(item); } }}
                      className={`transition-colors cursor-pointer ${isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-surface-container-low/50'}`}>
                      <td className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover shadow-sm flex-shrink-0" referrerPolicy="no-referrer" onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/48x48/e8eaf6/4355b9?text=${isEvent ? 'E' : 'S'}`; }} />
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-tight">{item.title}</p>
                            <p className="text-[11px] text-on-surface-variant mt-0.5">{isEvent ? 'Host' : 'Provider'}: <span className="font-semibold">{item.host}</span>{item.hostVerified && <span className="ml-1 text-[9px] bg-secondary-container text-on-secondary-container px-1 py-0.5 rounded font-bold">✓</span>}</p>
                            <p className="text-[10px] text-on-surface-variant">{isEvent ? item.category : `${item.emoji || '🛠️'} ${item.ticketPrice}`}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {isEvent ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1"><Calendar size={9} className="text-primary flex-shrink-0" /><span className="text-[10px] font-bold text-on-surface">{item.eventDate || '—'}</span></div>
                            <div className="flex items-center gap-1"><Clock size={9} className="text-on-surface-variant flex-shrink-0" /><span className="text-[10px] text-on-surface-variant">{item.dateSubmitted ? new Date(item.dateSubmitted).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'}</span></div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold text-on-surface">{item.scheduleSummary || '—'}</div>
                            {item.minDuration && <div className="text-[10px] text-on-surface-variant">Min: {item.minDuration}</div>}
                            {item.meetupStyle && <div className="text-[10px] text-on-surface-variant capitalize">{item.meetupStyle.replace('_', ' ')}</div>}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {analysis?.isLoading || analyzingId === item.id ? <Loader2 size={14} className="animate-spin text-primary" />
                          : (analysis?.flags?.length ?? 0) > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {analysis!.flags.slice(0, 2).map((flag, i) => (
                                <span key={i} className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${flag.severity === 'high' ? 'bg-tertiary/10 text-tertiary' : flag.severity === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-surface-container-high text-on-surface-variant'}`}>{flag.type}</span>
                              ))}
                              {analysis!.flags.length > 2 && <span className="text-[10px] text-on-surface-variant">+{analysis!.flags.length - 2}</span>}
                            </div>
                          ) : analysis ? <span className="px-2 py-0.5 bg-secondary-container/20 text-secondary rounded-md text-[10px] font-bold">Clear</span>
                          : <button onClick={e => { e.stopPropagation(); isEvent ? analyzeEvent(item) : analyzeService(item); }} className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1"><Sparkles size={10} /> Analyze</button>}
                      </td>
                      <td className="px-4 py-4 w-24"><RiskBadge analysis={analysis} /></td>
                      <td className="px-4 py-4"><span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${sStyle(item.status)}`}>{sLabel(item.status)}</span></td>
                      <td className="pr-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={e => { e.stopPropagation(); isEvent ? handleEventAction(item.id, 'approve') : handleServiceAction(item.id, 'approve'); }} className="p-2 text-secondary hover:bg-secondary-container/20 rounded-lg transition-colors" title="Approve"><CheckCircle2 size={18} /></button>
                          {isEvent && <Link to={`/moderation/${item.id}`} onClick={e => e.stopPropagation()} className="p-2 text-primary hover:bg-primary-container/10 rounded-lg transition-colors" title="View Detail"><Eye size={18} /></Link>}
                          <button onClick={e => { e.stopPropagation(); isEvent ? handleEventAction(item.id, 'reject') : handleServiceAction(item.id, 'reject'); }} className="p-2 text-tertiary hover:bg-tertiary/10 rounded-lg transition-colors" title="Reject"><X size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-surface-container-low/30 border-t border-indigo-50/50 flex justify-between items-center">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className="text-xs font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><ChevronLeft size={16} /> Previous</button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page = i + 1;
                if (totalPages > 5) { if (safePage <= 3) page = i + 1; else if (safePage >= totalPages - 2) page = totalPages - 4 + i; else page = safePage - 2 + i; }
                return <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${safePage === page ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-variant'}`}>{page}</button>;
              })}
            </div>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="text-xs font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed">Next <ChevronRight size={16} /></button>
          </div>
        </div>

        {/* AI INSIGHTS */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm relative overflow-hidden border border-indigo-50/50">
            <div className={`absolute top-0 left-0 w-1 h-full ${activeTab === 'events' ? 'bg-tertiary' : 'bg-secondary'}`} />
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center gap-2 ${activeTab === 'events' ? 'text-tertiary' : 'text-secondary'}`}>
                <Sparkles size={20} /><h4 className="font-bold text-sm">AI Insights</h4>
                {activeTab === 'services' && <span className="text-[9px] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded font-bold">SERVICE</span>}
              </div>
              <div className="flex items-center gap-2">
                {selectedAnalysis && !selectedAnalysis.isLoading && (
                  <>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${selectedAnalysis.riskScore >= 70 ? 'bg-tertiary/10 text-tertiary' : selectedAnalysis.riskScore >= 40 ? 'bg-amber-50 text-amber-700' : 'bg-secondary-container/20 text-secondary'}`}>{getRiskLabel(selectedAnalysis.riskLevel)}</span>
                    <button onClick={() => { if (activeTab === 'events' && selectedEvent) analyzeEvent(selectedEvent, true); else if (activeTab === 'services' && selectedService) analyzeService(selectedService, true); }} title="Re-analyze" className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container transition-colors"><RotateCcw size={13} /></button>
                  </>
                )}
              </div>
            </div>

            {!selectedItem ? (
              <p className="text-xs text-on-surface-variant">Select a {activeTab === 'events' ? 'event' : 'service'} to see AI analysis</p>
            ) : selectedAnalysis?.isLoading || analyzingId === selectedItem.id ? (
              <div className="space-y-4"><div className="flex items-center gap-2 text-primary"><Loader2 size={16} className="animate-spin" /><span className="text-xs font-bold">AI analyzing…</span></div><Skeleton /></div>
            ) : selectedAnalysis ? (
              <>
                <div className="mb-4">
                  <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Analyzing</p>
                  <p className="text-sm font-semibold text-on-surface">"{selectedItem.title}"</p>
                  <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{selectedAnalysis.summary}</p>
                </div>
                <div className="space-y-3 mb-4">
                  {[{ label: 'Semantic Integrity', value: selectedAnalysis.semanticIntegrity }, { label: 'Host Legitimacy', value: selectedAnalysis.hostLegitimacy }, { label: 'Engagement Pattern', value: selectedAnalysis.engagementPattern }].map(m => (
                    <div key={m.label}>
                      <div className="flex justify-between text-[11px] mb-1"><span className="text-on-surface-variant">{m.label}</span><span className={`font-bold ${getRiskColor(100 - m.value)}`}>{m.value}/100</span></div>
                      <div className="w-full bg-indigo-50 h-1.5 rounded-full overflow-hidden"><div className={`h-full transition-all duration-700 ${getRiskBarColor(100 - m.value)}`} style={{ width: `${m.value}%` }} /></div>
                    </div>
                  ))}
                </div>
                {(selectedAnalysis.flags?.length ?? 0) > 0 && (
                  <div className="space-y-2 mb-4">
                    {selectedAnalysis.flags.map((flag, i) => (
                      <div key={i} className={`p-3 rounded-lg flex items-start gap-2 ${flag.severity === 'high' ? 'bg-tertiary/5 border-l-2 border-tertiary' : 'bg-amber-50/50 border-l-2 border-amber-400'}`}>
                        <AlertCircle size={14} className={flag.severity === 'high' ? 'text-tertiary mt-0.5' : 'text-amber-600 mt-0.5'} />
                        <div><p className="text-xs font-bold text-on-surface">{flag.type}</p><p className="text-[11px] text-on-surface-variant">{flag.description}</p></div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="bg-surface-container-low p-4 rounded-2xl mb-4">
                  <p className="text-[10px] font-bold text-primary uppercase mb-1">Recommendation</p>
                  <p className="text-xs italic text-on-surface-variant">"{selectedAnalysis.recommendation}"</p>
                </div>
                {activeTab === 'events' && selectedEvent && (
                  <Link to={`/moderation/${selectedEvent.id}`} className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-bold shadow-md hover:opacity-90 text-center block">Review Full Report</Link>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-on-surface-variant mb-3">Click a {activeTab === 'events' ? 'event' : 'service'} to analyze with AI</p>
                <button onClick={() => { if (activeTab === 'events' && selectedEvent) analyzeEvent(selectedEvent); else if (activeTab === 'services' && selectedService) analyzeService(selectedService); }} className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 flex items-center gap-2 mx-auto"><Sparkles size={14} /> Analyze with AI</button>
              </div>
            )}
          </div>

          {/* Context Panel */}
          {selectedItem && (
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-indigo-50/50">
              <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">{activeTab === 'events' ? 'Event Context' : 'Service Context'}</h4>
              <div className="space-y-2.5">
                {activeTab === 'events' && selectedEvent ? [
                  { label: 'Category', val: selectedEvent.category }, { label: 'Price', val: selectedEvent.ticketPrice },
                  { label: 'Capacity', val: String(selectedEvent.capacity) }, { label: '📅 Event Date', val: selectedEvent.eventDate || '—' },
                  { label: '🕐 Submitted', val: selectedEvent.dateSubmitted ? new Date(selectedEvent.dateSubmitted).toLocaleDateString('en-IN') : '—' },
                  { label: 'Location', val: selectedEvent.location },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-sm"><span className="text-on-surface-variant text-xs">{r.label}</span><span className="font-semibold text-right max-w-[60%] truncate text-xs">{r.val}</span></div>
                )) : selectedService ? [
                  { label: 'Price', val: selectedService.ticketPrice }, { label: 'Join Policy', val: selectedService.joinPolicy },
                  { label: 'Availability', val: selectedService.scheduleSummary }, { label: 'Min Duration', val: selectedService.minDuration || '—' },
                  { label: 'Style', val: selectedService.meetupStyle?.replace('_', ' ') || '—' }, { label: 'Location', val: selectedService.location },
                  { label: '🕐 Submitted', val: selectedService.dateSubmitted ? new Date(selectedService.dateSubmitted).toLocaleDateString('en-IN') : '—' },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-sm"><span className="text-on-surface-variant text-xs">{r.label}</span><span className="font-semibold text-right max-w-[60%] truncate text-xs capitalize">{r.val}</span></div>
                )) : null}
              </div>
              <div className="mt-4 pt-4 border-t border-indigo-50 flex gap-2">
                <button onClick={() => activeTab === 'events' && selectedEvent ? handleEventAction(selectedEvent.id, 'approve') : selectedService && handleServiceAction(selectedService.id, 'approve')}
                  className="flex-1 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1"><CheckCircle2 size={14} /> Approve</button>
                <button onClick={() => activeTab === 'events' && selectedEvent ? handleEventAction(selectedEvent.id, 'reject') : selectedService && handleServiceAction(selectedService.id, 'reject')}
                  className="flex-1 py-2 bg-tertiary/10 text-tertiary rounded-xl text-xs font-bold hover:bg-tertiary/20 flex items-center justify-center gap-1"><X size={14} /> Reject</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModerationQueue;