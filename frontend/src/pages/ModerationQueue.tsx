// // // frontend/src/pages/ModerationQueue.tsx
// // import React, { useState, useEffect, useCallback } from 'react';
// // import {
// //   Filter,
// //   CheckCircle2,
// //   Eye,
// //   X,
// //   ChevronLeft,
// //   ChevronRight,
// //   Sparkles,
// //   AlertCircle,
// //   Loader2,
// //   RefreshCw,
// //   Zap,
// //   Plus,
// // } from 'lucide-react';
// // import { Link } from 'react-router-dom';
// // import {
// //   analyzeEventWithGemini,
// //   getRiskColor,
// //   getRiskBarColor,
// //   getRiskLabel,
// // } from '../lib/gemini';
// // import { getEvents, updateEventStatus } from '../lib/mockEvents';
// // import type { Event, AIAnalysis } from '../types';

// // // ─── Skeletons & badges ────────────────────────────────────────────────────────
// // const AILoadingSkeleton = () => (
// //   <div className="animate-pulse space-y-3">
// //     <div className="h-3 bg-indigo-100 rounded w-3/4" />
// //     <div className="h-3 bg-indigo-100 rounded w-1/2" />
// //     <div className="h-8 bg-indigo-100 rounded w-full" />
// //     <div className="h-8 bg-indigo-100 rounded w-full" />
// //   </div>
// // );

// // const RiskBadge = ({ analysis }: { analysis?: AIAnalysis }) => {
// //   if (!analysis) return <span className="text-[10px] text-on-surface-variant">Not analyzed</span>;
// //   if (analysis.isLoading) return <Loader2 size={14} className="animate-spin text-primary" />;
// //   return (
// //     <div className="flex flex-col gap-1">
// //       <span className={`text-[11px] font-bold ${getRiskColor(analysis.riskScore)}`}>
// //         {analysis.riskScore}%
// //       </span>
// //       <div className="w-full bg-indigo-100 h-1.5 rounded-full overflow-hidden">
// //         <div
// //           className={`h-full transition-all duration-700 ${getRiskBarColor(analysis.riskScore)}`}
// //           style={{ width: `${analysis.riskScore}%` }}
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // // ─── Main component ────────────────────────────────────────────────────────────
// // const ModerationQueue = () => {
// //   // ✅ Load from localStorage (includes events created via CreateEvent)
// //   const [events, setEvents] = useState<Event[]>(() => getEvents());
// //   const [analyses, setAnalyses] = useState<Record<string, AIAnalysis>>({});
// //   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
// //   const [isAnalyzingAll, setIsAnalyzingAll] = useState(false);
// //   const [analyzingId, setAnalyzingId] = useState<string | null>(null);
// //   const [filterStatus, setFilterStatus] = useState('all');
// //   const [notification, setNotification] = useState<{
// //     msg: string;
// //     type: 'success' | 'error';
// //   } | null>(null);

// //   // Set first event as selected after load
// //   useEffect(() => {
// //     if (events.length > 0 && !selectedEvent) {
// //       setSelectedEvent(events[0]);
// //     }
// //   }, [events]);

// //   const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
// //     setNotification({ msg, type });
// //     setTimeout(() => setNotification(null), 3000);
// //   };

// //   // ✅ Refresh events from localStorage (picks up newly created events)
// //   const refreshEvents = () => {
// //     const fresh = getEvents();
// //     setEvents(fresh);
// //     showNotification('Queue refreshed!');
// //   };

// //   // ── Analyze single event ──
// //   const analyzeEvent = useCallback(async (event: Event) => {
// //     setAnalyzingId(event.id);
// //     setAnalyses(prev => ({
// //       ...prev,
// //       [event.id]: { ...(prev[event.id] || {}), isLoading: true } as AIAnalysis,
// //     }));

// //     try {
// //       const result = await analyzeEventWithGemini(event);
// //       setAnalyses(prev => ({ ...prev, [event.id]: result }));

// //       // Auto-flag high risk
// //       if (result.riskScore >= 70) {
// //         setEvents(prev =>
// //           prev.map(e => (e.id === event.id ? { ...e, status: 'flagged' } : e)),
// //         );
// //         updateEventStatus(event.id, 'flagged');
// //       }
// //     } catch (err) {
// //       console.error('Analysis error:', err);
// //     } finally {
// //       setAnalyzingId(null);
// //     }
// //   }, []);

// //   // Auto-analyze first event on mount
// //   useEffect(() => {
// //     if (events.length > 0 && !analyses[events[0].id]) {
// //       analyzeEvent(events[0]);
// //     }
// //   }, []); // eslint-disable-line react-hooks/exhaustive-deps

// //   // Auto-analyze when selecting
// //   const handleSelectEvent = (event: Event) => {
// //     setSelectedEvent(event);
// //     if (!analyses[event.id]) {
// //       analyzeEvent(event);
// //     }
// //   };

// //   // Analyze all un-analyzed pending events
// //   const analyzeAll = async () => {
// //     setIsAnalyzingAll(true);
// //     const pending = events.filter(e => !analyses[e.id] || analyses[e.id].isLoading);
// //     for (const event of pending) {
// //       await analyzeEvent(event);
// //     }
// //     setIsAnalyzingAll(false);
// //     showNotification(`${pending.length} events analyzed by Gemini AI!`);
// //   };

// //   // Approve / Reject
// //   const handleAction = (eventId: string, action: 'approve' | 'reject') => {
// //     const newStatus = action === 'approve' ? 'approved' : 'rejected';
// //     setEvents(prev => prev.map(e => (e.id === eventId ? { ...e, status: newStatus } : e)));
// //     updateEventStatus(eventId, newStatus); // ✅ persist to localStorage
// //     showNotification(
// //       action === 'approve'
// //         ? '✓ Event approved & will be listed on MyApp'
// //         : '✗ Event rejected',
// //       action === 'approve' ? 'success' : 'error',
// //     );
// //     const next = events.find(e => e.id !== eventId && e.status === 'pending');
// //     if (next) setSelectedEvent(next);
// //   };

// //   const pendingCount = events.filter(e => e.status === 'pending').length;
// //   const flaggedCount = events.filter(e => e.status === 'flagged').length;
// //   const selectedAnalysis = selectedEvent ? analyses[selectedEvent.id] : null;

// //   const getStatusColor = (status: string) => {
// //     const map: Record<string, string> = {
// //       flagged: 'text-tertiary bg-tertiary-container/10',
// //       pending: 'text-on-surface-variant bg-surface-container-highest',
// //       under_review: 'text-amber-700 bg-amber-100',
// //       approved: 'text-on-secondary-container bg-secondary-container',
// //       rejected: 'text-tertiary bg-tertiary/10',
// //     };
// //     return map[status] || 'text-on-surface-variant bg-surface-container-highest';
// //   };

// //   const getStatusLabel = (status: string) => {
// //     const map: Record<string, string> = {
// //       pending: 'PENDING',
// //       flagged: 'FLAGGED',
// //       under_review: 'UNDER REVIEW',
// //       approved: 'APPROVED',
// //       rejected: 'REJECTED',
// //     };
// //     return map[status] || status.toUpperCase();
// //   };

// //   const filtered = events.filter(
// //     e => filterStatus === 'all' || e.status === filterStatus,
// //   );

// //   // ─── RENDER ──────────────────────────────────────────────────────────────────
// //   return (
// //     <div className="space-y-8">
// //       {/* Notification toast */}
// //       {notification && (
// //         <div
// //           className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg font-bold text-sm text-white transition-all ${
// //             notification.type === 'success' ? 'bg-secondary' : 'bg-tertiary'
// //           }`}
// //         >
// //           {notification.msg}
// //         </div>
// //       )}

// //       {/* ── Header ── */}
// //       <div className="flex justify-between items-end flex-wrap gap-4">
// //         <div>
// //           <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 block">
// //             Operational Overview
// //           </span>
// //           <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">
// //             Moderation Queue
// //           </h3>
// //           <p className="text-on-surface-variant text-sm mt-1">
// //             Events submitted from MyApp awaiting AI review &amp; approval.
// //           </p>
// //         </div>

// //         <div className="flex gap-3 items-center flex-wrap">
// //           <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
// //             <p className="text-[10px] text-on-surface-variant font-bold uppercase">Pending Review</p>
// //             <p className="text-xl font-extrabold text-primary">{pendingCount}</p>
// //           </div>
// //           <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
// //             <p className="text-[10px] text-on-surface-variant font-bold uppercase">Risk Flagged</p>
// //             <p className="text-xl font-extrabold text-tertiary">{flaggedCount}</p>
// //           </div>

// //           {/* Analyze All */}
// //           <button
// //             onClick={analyzeAll}
// //             disabled={isAnalyzingAll}
// //             className="bg-gradient-to-r from-primary to-primary-container text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-60"
// //           >
// //             {isAnalyzingAll ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
// //             {isAnalyzingAll ? 'Analyzing...' : 'AI Analyze All'}
// //           </button>

// //           {/* Create Test Event */}
// //           <Link
// //             to="/events/create"
// //             className="bg-white border border-primary text-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/5 transition-all"
// //           >
// //             <Plus size={16} />
// //             Create Test Event
// //           </Link>
// //         </div>
// //       </div>

// //       {/* ── Filters ── */}
// //       <div className="bg-surface-container-low p-4 rounded-2xl flex flex-wrap items-center gap-4">
// //         <div className="flex-1 min-w-[180px]">
// //           <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">
// //             Risk Score
// //           </label>
// //           <select className="w-full bg-surface-container-highest border-none rounded-xl text-sm focus:ring-1 ring-primary/20 p-2">
// //             <option>All Scores</option>
// //             <option>High Risk (&gt;80)</option>
// //             <option>Medium Risk (40–80)</option>
// //             <option>Low Risk (&lt;40)</option>
// //           </select>
// //         </div>
// //         <div className="flex-1 min-w-[180px]">
// //           <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">
// //             Status
// //           </label>
// //           <select
// //             className="w-full bg-surface-container-highest border-none rounded-xl text-sm focus:ring-1 ring-primary/20 p-2"
// //             value={filterStatus}
// //             onChange={e => setFilterStatus(e.target.value)}
// //           >
// //             <option value="all">All Status</option>
// //             <option value="pending">Pending</option>
// //             <option value="flagged">Flagged</option>
// //             <option value="approved">Approved</option>
// //             <option value="rejected">Rejected</option>
// //           </select>
// //         </div>
// //         <div className="flex-1 min-w-[180px]">
// //           <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">
// //             Event Category
// //           </label>
// //           <select className="w-full bg-surface-container-highest border-none rounded-xl text-sm focus:ring-1 ring-primary/20 p-2">
// //             <option>All Categories</option>
// //             <option>Music &amp; Nightlife</option>
// //             <option>Technology</option>
// //             <option>Health &amp; Wellness</option>
// //             <option>Business &amp; Networking</option>
// //           </select>
// //         </div>
// //         <div className="flex items-end h-full pt-5">
// //           <button className="bg-surface-container-highest text-primary p-2 px-4 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-surface-variant transition-colors">
// //             <Filter size={16} />
// //             More Filters
// //           </button>
// //         </div>
// //       </div>

// //       {/* ── Main grid ── */}
// //       <div className="grid grid-cols-12 gap-6 items-start">
// //         {/* Events table */}
// //         <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-indigo-50/50">
// //           <div className="px-6 py-4 bg-indigo-50/30 flex justify-between items-center border-b border-indigo-50/50">
// //             <div className="flex items-center gap-3">
// //               <span className="text-sm font-bold text-indigo-900">
// //                 {events.length} events in queue
// //               </span>
// //               <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
// //                 LIVE QUEUE
// //               </span>
// //             </div>
// //             {/* ✅ Refresh button — picks up newly created events */}
// //             <button
// //               onClick={refreshEvents}
// //               className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
// //             >
// //               <RefreshCw size={12} />
// //               Refresh
// //             </button>
// //           </div>

// //           <div className="overflow-x-auto">
// //             <table className="w-full border-collapse">
// //               <thead>
// //                 <tr className="text-left border-b border-indigo-50">
// //                   <th className="pl-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
// //                     Event &amp; Host
// //                   </th>
// //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
// //                     AI Flags
// //                   </th>
// //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider w-28">
// //                     Risk Score
// //                   </th>
// //                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
// //                     Status
// //                   </th>
// //                   <th className="pr-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">
// //                     Actions
// //                   </th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-indigo-50/30">
// //                 {filtered.length === 0 ? (
// //                   <tr>
// //                     <td colSpan={5} className="py-16 text-center text-on-surface-variant text-sm">
// //                       No events found.{' '}
// //                       <Link to="/events/create" className="text-primary font-bold hover:underline">
// //                         Create a test event →
// //                       </Link>
// //                     </td>
// //                   </tr>
// //                 ) : (
// //                   filtered.map(event => {
// //                     const analysis = analyses[event.id];
// //                     const isSelected = selectedEvent?.id === event.id;
// //                     return (
// //                       <tr
// //                         key={event.id}
// //                         onClick={() => handleSelectEvent(event)}
// //                         className={`transition-colors cursor-pointer ${
// //                           isSelected
// //                             ? 'bg-primary/5 border-l-2 border-primary'
// //                             : 'hover:bg-surface-container-low/50'
// //                         }`}
// //                       >
// //                         {/* Event & Host */}
// //                         <td className="pl-6 py-4">
// //                           <div className="flex items-center gap-3">
// //                             <img
// //                               src={event.image}
// //                               alt={event.title}
// //                               className="w-12 h-12 rounded-xl object-cover shadow-sm flex-shrink-0"
// //                               referrerPolicy="no-referrer"
// //                               onError={e => {
// //                                 (e.target as HTMLImageElement).src =
// //                                   'https://placehold.co/48x48/e8eaf6/4355b9?text=E';
// //                               }}
// //                             />
// //                             <div>
// //                               <Link
// //                                 to={`/moderation/${event.id}`}
// //                                 className="text-sm font-bold text-slate-900 leading-tight hover:text-primary transition-colors"
// //                                 onClick={e => e.stopPropagation()}
// //                               >
// //                                 {event.title}
// //                               </Link>
// //                               <div className="flex items-center gap-1 mt-0.5">
// //                                 <p className="text-[11px] text-on-surface-variant">
// //                                   Host:{' '}
// //                                   <span className="font-semibold">{event.host}</span>
// //                                 </p>
// //                                 {event.hostVerified && (
// //                                   <span className="text-[9px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-bold">
// //                                     VERIFIED
// //                                   </span>
// //                                 )}
// //                               </div>
// //                               <p className="text-[10px] text-on-surface-variant mt-0.5">
// //                                 {event.category}
// //                               </p>
// //                             </div>
// //                           </div>
// //                         </td>

// //                         {/* AI Flags */}
// //                         <td className="px-4 py-4">
// //                           {analysis?.isLoading || analyzingId === event.id ? (
// //                             <Loader2 size={14} className="animate-spin text-primary" />
// //                           ) : analysis?.flags && analysis.flags.length > 0 ? (
// //                             <div className="flex flex-wrap gap-1">
// //                               {analysis.flags.slice(0, 2).map((flag, i) => (
// //                                 <span
// //                                   key={i}
// //                                   className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
// //                                     flag.severity === 'high'
// //                                       ? 'bg-tertiary/10 text-tertiary'
// //                                       : flag.severity === 'medium'
// //                                       ? 'bg-amber-50 text-amber-700'
// //                                       : 'bg-surface-container-high text-on-surface-variant'
// //                                   }`}
// //                                 >
// //                                   {flag.type}
// //                                 </span>
// //                               ))}
// //                               {analysis.flags.length > 2 && (
// //                                 <span className="text-[10px] text-on-surface-variant">
// //                                   +{analysis.flags.length - 2}
// //                                 </span>
// //                               )}
// //                             </div>
// //                           ) : analysis ? (
// //                             <span className="px-2 py-0.5 bg-secondary-container/20 text-secondary rounded-md text-[10px] font-bold">
// //                               Clear
// //                             </span>
// //                           ) : (
// //                             <button
// //                               onClick={e => {
// //                                 e.stopPropagation();
// //                                 analyzeEvent(event);
// //                               }}
// //                               className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1"
// //                             >
// //                               <Sparkles size={10} /> Analyze
// //                             </button>
// //                           )}
// //                         </td>

// //                         {/* Risk Score */}
// //                         <td className="px-4 py-4 w-28">
// //                           <RiskBadge analysis={analysis} />
// //                         </td>

// //                         {/* Status */}
// //                         <td className="px-4 py-4">
// //                           <span
// //                             className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${getStatusColor(event.status)}`}
// //                           >
// //                             {getStatusLabel(event.status)}
// //                           </span>
// //                         </td>

// //                         {/* Actions */}
// //                         <td className="pr-6 py-4 text-right">
// //                           <div className="flex items-center justify-end gap-1">
// //                             <button
// //                               onClick={e => {
// //                                 e.stopPropagation();
// //                                 handleAction(event.id, 'approve');
// //                               }}
// //                               className="p-2 text-secondary hover:bg-secondary-container/20 rounded-lg transition-colors"
// //                               title="Approve"
// //                             >
// //                               <CheckCircle2 size={18} />
// //                             </button>
// //                             <Link
// //                               to={`/moderation/${event.id}`}
// //                               onClick={e => e.stopPropagation()}
// //                               className="p-2 text-primary hover:bg-primary-container/10 rounded-lg transition-colors"
// //                               title="View Detail"
// //                             >
// //                               <Eye size={18} />
// //                             </Link>
// //                             <button
// //                               onClick={e => {
// //                                 e.stopPropagation();
// //                                 handleAction(event.id, 'reject');
// //                               }}
// //                               className="p-2 text-tertiary hover:bg-tertiary/10 rounded-lg transition-colors"
// //                               title="Reject"
// //                             >
// //                               <X size={18} />
// //                             </button>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     );
// //                   })
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Pagination stub */}
// //           <div className="px-6 py-4 bg-surface-container-low/30 border-t border-indigo-50/50 flex justify-between items-center">
// //             <button className="text-xs font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors">
// //               <ChevronLeft size={16} /> Previous
// //             </button>
// //             <div className="flex items-center gap-2">
// //               <span className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg text-xs font-bold">
// //                 1
// //               </span>
// //             </div>
// //             <button className="text-xs font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors">
// //               Next <ChevronRight size={16} />
// //             </button>
// //           </div>
// //         </div>

// //         {/* ── AI Insights Panel ── */}
// //         <div className="col-span-12 lg:col-span-4 space-y-6">
// //           {/* AI Analysis Card */}
// //           <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm relative overflow-hidden border border-indigo-50/50">
// //             <div className="absolute top-0 left-0 w-1 h-full bg-tertiary" />
// //             <div className="flex items-center justify-between mb-4">
// //               <div className="flex items-center gap-2 text-tertiary">
// //                 <Sparkles size={20} />
// //                 <h4 className="font-bold text-sm">AI Insights Summary</h4>
// //               </div>
// //               {selectedAnalysis && !selectedAnalysis.isLoading && (
// //                 <span
// //                   className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
// //                     selectedAnalysis.riskScore >= 70
// //                       ? 'bg-tertiary/10 text-tertiary'
// //                       : selectedAnalysis.riskScore >= 40
// //                       ? 'bg-amber-50 text-amber-700'
// //                       : 'bg-secondary-container/20 text-secondary'
// //                   }`}
// //                 >
// //                   {getRiskLabel(selectedAnalysis.riskLevel)}
// //                 </span>
// //               )}
// //             </div>

// //             {!selectedEvent ? (
// //               <p className="text-xs text-on-surface-variant">
// //                 Select an event to see AI analysis
// //               </p>
// //             ) : selectedAnalysis?.isLoading || analyzingId === selectedEvent.id ? (
// //               <div className="space-y-4">
// //                 <div className="flex items-center gap-2 text-primary">
// //                   <Loader2 size={16} className="animate-spin" />
// //                   <span className="text-xs font-bold">Gemini AI is analyzing…</span>
// //                 </div>
// //                 <AILoadingSkeleton />
// //               </div>
// //             ) : selectedAnalysis ? (
// //               <>
// //                 <div className="mb-4">
// //                   <h5 className="text-xs font-bold text-on-surface-variant uppercase mb-1">
// //                     Analyzing
// //                   </h5>
// //                   <p className="text-sm font-semibold text-on-surface">
// //                     "{selectedEvent.title}"
// //                   </p>
// //                   <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
// //                     {selectedAnalysis.summary}
// //                   </p>
// //                 </div>

// //                 {/* Metric bars */}
// //                 <div className="space-y-3 mb-4">
// //                   {[
// //                     { label: 'Semantic Integrity', value: selectedAnalysis.semanticIntegrity },
// //                     { label: 'Host Legitimacy', value: selectedAnalysis.hostLegitimacy },
// //                     { label: 'Engagement Pattern', value: selectedAnalysis.engagementPattern },
// //                   ].map(metric => (
// //                     <div key={metric.label}>
// //                       <div className="flex justify-between text-[11px] mb-1">
// //                         <span className="text-on-surface-variant">{metric.label}</span>
// //                         <span className={`font-bold ${getRiskColor(100 - metric.value)}`}>
// //                           {metric.value}/100
// //                         </span>
// //                       </div>
// //                       <div className="w-full bg-indigo-50 h-1.5 rounded-full overflow-hidden">
// //                         <div
// //                           className={`h-full transition-all duration-700 ${getRiskBarColor(100 - metric.value)}`}
// //                           style={{ width: `${metric.value}%` }}
// //                         />
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>

// //                 {/* Flags */}
// //                 {selectedAnalysis.flags.length > 0 && (
// //                   <div className="space-y-2 mb-4">
// //                     {selectedAnalysis.flags.map((flag, i) => (
// //                       <div
// //                         key={i}
// //                         className={`p-3 rounded-lg flex items-start gap-2 ${
// //                           flag.severity === 'high'
// //                             ? 'bg-tertiary/5 border-l-2 border-tertiary'
// //                             : 'bg-amber-50/50 border-l-2 border-amber-400'
// //                         }`}
// //                       >
// //                         <AlertCircle
// //                           size={14}
// //                           className={
// //                             flag.severity === 'high'
// //                               ? 'text-tertiary mt-0.5'
// //                               : 'text-amber-600 mt-0.5'
// //                           }
// //                         />
// //                         <div>
// //                           <p className="text-xs font-bold text-on-surface">{flag.type}</p>
// //                           <p className="text-[11px] text-on-surface-variant">{flag.description}</p>
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}

// //                 {/* Recommendation */}
// //                 <div className="bg-surface-container-low p-4 rounded-2xl mb-4">
// //                   <p className="text-[10px] font-bold text-primary uppercase mb-1">
// //                     Moderator Recommendation
// //                   </p>
// //                   <p className="text-xs italic text-on-surface-variant">
// //                     "{selectedAnalysis.recommendation}"
// //                   </p>
// //                 </div>

// //                 <div className="flex flex-col gap-2">
// //                   <Link
// //                     to={`/moderation/${selectedEvent.id}`}
// //                     className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-all text-center"
// //                   >
// //                     Review Full Report
// //                   </Link>
// //                   <p className="text-[10px] text-center text-on-surface-variant">
// //                     Scanned {new Date(selectedAnalysis.scannedAt).toLocaleTimeString()}
// //                   </p>
// //                 </div>
// //               </>
// //             ) : (
// //               <div className="text-center py-4">
// //                 <p className="text-xs text-on-surface-variant mb-3">
// //                   Click an event to analyze with Gemini AI
// //                 </p>
// //                 <button
// //                   onClick={() => selectedEvent && analyzeEvent(selectedEvent)}
// //                   className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2 mx-auto"
// //                 >
// //                   <Sparkles size={14} />
// //                   Analyze with AI
// //                 </button>
// //               </div>
// //             )}
// //           </div>

// //           {/* Event context card */}
// //           {selectedEvent && (
// //             <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-indigo-50/50">
// //               <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">
// //                 Event Context
// //               </h4>
// //               <div className="space-y-3">
// //                 {[
// //                   { label: 'Category', val: selectedEvent.category },
// //                   { label: 'Ticket Price', val: selectedEvent.ticketPrice },
// //                   { label: 'Capacity', val: String(selectedEvent.capacity) },
// //                   { label: 'Event Date', val: selectedEvent.eventDate },
// //                   { label: 'Location', val: selectedEvent.location },
// //                 ].map(r => (
// //                   <div key={r.label} className="flex justify-between text-sm">
// //                     <span className="text-on-surface-variant">{r.label}</span>
// //                     <span className="font-semibold text-right max-w-[60%] truncate">{r.val}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //               <div className="mt-4 pt-4 border-t border-indigo-50">
// //                 <div className="flex gap-2">
// //                   <button
// //                     onClick={() => handleAction(selectedEvent.id, 'approve')}
// //                     className="flex-1 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1"
// //                   >
// //                     <CheckCircle2 size={14} /> Approve
// //                   </button>
// //                   <button
// //                     onClick={() => handleAction(selectedEvent.id, 'reject')}
// //                     className="flex-1 py-2 bg-tertiary/10 text-tertiary rounded-xl text-xs font-bold hover:bg-tertiary/20 transition-all flex items-center justify-center gap-1"
// //                   >
// //                     <X size={14} /> Reject
// //                   </button>
// //                 </div>
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
// // ✅ FULLY DYNAMIC — getEvents() se data, koi static array nahi
// // ✅ Eye button → ModerationDetail page
// // ✅ Approve/Reject → localStorage update + status change
// // ✅ Refresh → naye create kiye events bhi dikhte hain

// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Filter, CheckCircle2, Eye, X, ChevronLeft, ChevronRight,
//   Sparkles, AlertCircle, Loader2, RefreshCw, Zap, Plus,
// } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// //import { analyzeEventWithGemini, getRiskColor, getRiskBarColor, getRiskLabel } from '../lib/gemini';

// import { getEvents, updateEventStatus } from '../lib/mockEvents';
// import type { Event, AIAnalysis } from '../types';
// import { 
//   analyzeEventWithOpenAI, 
//   getRiskColor, 
//   getRiskBarColor, 
//   getRiskLabel 
// } from '../lib/openai';
// const AILoadingSkeleton = () => (
//   <div className="animate-pulse space-y-3">
//     <div className="h-3 bg-indigo-100 rounded w-3/4" />
//     <div className="h-3 bg-indigo-100 rounded w-1/2" />
//     <div className="h-8 bg-indigo-100 rounded w-full" />
//   </div>
// );

// const RiskBadge = ({ analysis }: { analysis?: AIAnalysis }) => {
//   if (!analysis) return <span className="text-[10px] text-on-surface-variant">Not analyzed</span>;
//   if (analysis.isLoading) return <Loader2 size={14} className="animate-spin text-primary" />;
//   return (
//     <div className="flex flex-col gap-1">
//      <span className={`text-[11px] font-bold ${getRiskColor(analysis.riskScore ?? 0)}`}>{analysis.riskScore ?? '—'}%</span>

//       <div className="w-full bg-indigo-100 h-1.5 rounded-full overflow-hidden">
//         <div className={`h-full transition-all duration-700 ${getRiskBarColor(analysis.riskScore)}`} style={{ width: `${analysis.riskScore}%` }} />
//       </div>
//     </div>
//   );
// };

// const ModerationQueue = () => {
//   const navigate = useNavigate();
//   const [events, setEvents] = useState<Event[]>([]);
//   const [analyses, setAnalyses] = useState<Record<string, AIAnalysis>>({});
//   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
//   const [isAnalyzingAll, setIsAnalyzingAll] = useState(false);
//   const [analyzingId, setAnalyzingId] = useState<string | null>(null);
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

//   // ✅ Load events from localStorage on mount
//   useEffect(() => {
//     const all = getEvents();
//     setEvents(all);
//     if (all.length > 0) setSelectedEvent(all[0]);
//   }, []);

//   const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
//     setNotification({ msg, type });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   // ✅ Refresh — picks up newly created events from localStorage
//   const refreshEvents = () => {
//     const fresh = getEvents();
//     setEvents(fresh);
//     showNotification('Queue refreshed!');
//   };

//   const analyzeEvent = useCallback(async (event: Event) => {
//     setAnalyzingId(event.id);
//     setAnalyses(prev => ({ ...prev, [event.id]: { ...(prev[event.id] || {}), isLoading: true } as AIAnalysis }));
//     try {
// const result = await analyzeEventWithOpenAI(event);
// // ✅ Ensure flags always exists
// const safeResult = {
//   ...result,
//   flags: result.flags ?? [],
//   riskScore: result.riskScore ?? 0,
//   riskLevel: result.riskLevel ?? 'low',
//   semanticIntegrity: result.semanticIntegrity ?? 80,
//   hostLegitimacy: result.hostLegitimacy ?? 80,
//   engagementPattern: result.engagementPattern ?? 80,
//   summary: result.summary ?? 'No summary available',
//   recommendation: result.recommendation ?? '',
//   scannedAt: result.scannedAt ?? new Date().toISOString(),
//   isLoading: false,
// };
// setAnalyses(prev => ({ ...prev, [event.id]: safeResult }));
//       if (result.riskScore >= 70) {
//         setEvents(prev => prev.map(e => e.id === event.id ? { ...e, status: 'flagged' } : e));
//         updateEventStatus(event.id, 'flagged');
//       }
//     } catch (err) {
//       console.error('Analysis error:', err);
//     } finally {
//       setAnalyzingId(null);
//     }
//   }, []);

//   const handleSelectEvent = (event: Event) => {
//     setSelectedEvent(event);
//     if (!analyses[event.id]) analyzeEvent(event);
//   };

//   const analyzeAll = async () => {
//     setIsAnalyzingAll(true);
//     const toAnalyze = events.filter(e => !analyses[e.id]);
//     for (const event of toAnalyze) await analyzeEvent(event);
//     setIsAnalyzingAll(false);
//     showNotification(`${toAnalyze.length} events analyzed!`);
//   };

//   // ✅ Approve / Reject — updates localStorage + local state
//   const handleAction = (eventId: string, action: 'approve' | 'reject') => {
//     const newStatus = action === 'approve' ? 'approved' : 'rejected';
//     setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: newStatus } : e));
//     updateEventStatus(eventId, newStatus);
//     showNotification(
//       action === 'approve' ? '✓ Event approved & listed on MyApp!' : '✗ Event rejected',
//       action === 'approve' ? 'success' : 'error',
//     );
//     if (selectedEvent?.id === eventId) {
//       const next = events.find(e => e.id !== eventId && e.status === 'pending');
//       if (next) setSelectedEvent(next);
//     }
//   };

//   const pendingCount = events.filter(e => e.status === 'pending').length;
//   const flaggedCount = events.filter(e => e.status === 'flagged').length;
//   const selectedAnalysis = selectedEvent ? analyses[selectedEvent.id] : null;

//   const getStatusStyle = (status: string) => {
//     const map: Record<string, string> = {
//       flagged: 'text-tertiary bg-tertiary-container/10',
//       pending: 'text-on-surface-variant bg-surface-container-highest',
//       under_review: 'text-amber-700 bg-amber-100',
//       approved: 'text-on-secondary-container bg-secondary-container',
//       rejected: 'text-tertiary bg-tertiary/10',
//     };
//     return map[status] || 'text-on-surface-variant bg-surface-container-highest';
//   };

//   const getStatusLabel = (s: string) =>
//     ({ pending: 'PENDING', flagged: 'FLAGGED', under_review: 'UNDER REVIEW', approved: 'APPROVED', rejected: 'REJECTED' }[s] || s.toUpperCase());

//   const filtered = events.filter(e => filterStatus === 'all' || e.status === filterStatus);

//   return (
//     <div className="space-y-8">
//       {/* Toast */}
//       {notification && (
//         <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg font-bold text-sm text-white ${notification.type === 'success' ? 'bg-secondary' : 'bg-tertiary'}`}>
//           {notification.msg}
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex justify-between items-end flex-wrap gap-4">
//         <div>
//           <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 block">Operational Overview</span>
//           <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">Moderation Queue</h3>
//           <p className="text-on-surface-variant text-sm mt-1">Events awaiting AI review &amp; approval.</p>
//         </div>
//         <div className="flex gap-3 items-center flex-wrap">
//           <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
//             <p className="text-[10px] text-on-surface-variant font-bold uppercase">Pending</p>
//             <p className="text-xl font-extrabold text-primary">{pendingCount}</p>
//           </div>
//           <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
//             <p className="text-[10px] text-on-surface-variant font-bold uppercase">Flagged</p>
//             <p className="text-xl font-extrabold text-tertiary">{flaggedCount}</p>
//           </div>
//           <button
//             onClick={analyzeAll}
//             disabled={isAnalyzingAll}
//             className="bg-gradient-to-r from-primary to-primary-container text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-60"
//           >
//             {isAnalyzingAll ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
//             {isAnalyzingAll ? 'Analyzing...' : 'AI Analyze All'}
//           </button>
//           <Link to="/events/create" className="bg-white border border-primary text-primary px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/5 transition-all">
//             <Plus size={16} /> Create Event
//           </Link>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-surface-container-low p-4 rounded-2xl flex flex-wrap items-center gap-4">
//         <div className="flex-1 min-w-[160px]">
//           <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">Status</label>
//           <select className="w-full bg-surface-container-highest border-none rounded-xl text-sm p-2" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
//             <option value="all">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="flagged">Flagged</option>
//             <option value="approved">Approved</option>
//             <option value="rejected">Rejected</option>
//           </select>
//         </div>
//         <div className="flex-1 min-w-[160px]">
//           <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">Category</label>
//           <select className="w-full bg-surface-container-highest border-none rounded-xl text-sm p-2">
//             <option>All Categories</option>
//             <option>Music &amp; Nightlife</option>
//             <option>Technology</option>
//             <option>Health &amp; Wellness</option>
//             <option>Business &amp; Networking</option>
//           </select>
//         </div>
//         <div className="flex items-end h-full pt-5">
//           <button className="bg-surface-container-highest text-primary p-2 px-4 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-surface-variant transition-colors">
//             <Filter size={16} /> More Filters
//           </button>
//         </div>
//       </div>

//       {/* Main Grid */}
//       <div className="grid grid-cols-12 gap-6 items-start">
//         {/* Table */}
//         <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-indigo-50/50">
//           <div className="px-6 py-4 bg-indigo-50/30 flex justify-between items-center border-b border-indigo-50/50">
//             <div className="flex items-center gap-3">
//               <span className="text-sm font-bold text-indigo-900">{events.length} events in queue</span>
//               <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">LIVE</span>
//             </div>
//             <button onClick={refreshEvents} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
//               <RefreshCw size={12} /> Refresh
//             </button>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="text-left border-b border-indigo-50">
//                   <th className="pl-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Event &amp; Host</th>
//                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">AI Flags</th>
//                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider w-28">Risk Score</th>
//                   <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
//                   <th className="pr-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-indigo-50/30">
//                 {filtered.length === 0 ? (
//                   <tr>
//                     <td colSpan={5} className="py-16 text-center text-on-surface-variant text-sm">
//                       No events found.{' '}
//                       <Link to="/events/create" className="text-primary font-bold hover:underline">Create one →</Link>
//                     </td>
//                   </tr>
//                 ) : filtered.map(event => {
//                   const analysis = analyses[event.id];
//                   const isSelected = selectedEvent?.id === event.id;
//                   return (
//                     <tr
//                       key={event.id}
//                       onClick={() => handleSelectEvent(event)}
//                       className={`transition-colors cursor-pointer ${isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-surface-container-low/50'}`}
//                     >
//                       {/* Event + Host */}
//                       <td className="pl-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <img
//                             src={event.image}
//                             alt={event.title}
//                             className="w-12 h-12 rounded-xl object-cover shadow-sm flex-shrink-0"
//                             referrerPolicy="no-referrer"
//                             onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/e8eaf6/4355b9?text=E'; }}
//                           />
//                           <div>
//                             <p className="text-sm font-bold text-slate-900 leading-tight">{event.title}</p>
//                             <div className="flex items-center gap-1 mt-0.5 flex-wrap">
//                               <p className="text-[11px] text-on-surface-variant">Host: <span className="font-semibold">{event.host}</span></p>
//                               {event.hostVerified && (
//                                 <span className="text-[9px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-bold">VERIFIED</span>
//                               )}
//                             </div>
//                             <p className="text-[10px] text-on-surface-variant mt-0.5">{event.category}</p>
//                           </div>
//                         </div>
//                       </td>

//                       {/* AI Flags */}
//                       <td className="px-4 py-4">
//                         {analysis?.isLoading || analyzingId === event.id ? (
//                           <Loader2 size={14} className="animate-spin text-primary" />
//                         ) : analysis?.flags?.length > 0 ? (
//                           <div className="flex flex-wrap gap-1">
//                             {analysis.flags.slice(0, 2).map((flag, i) => (
//                               <span key={i} className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${flag.severity === 'high' ? 'bg-tertiary/10 text-tertiary' : flag.severity === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-surface-container-high text-on-surface-variant'}`}>
//                                 {flag.type}
//                               </span>
//                             ))}
//                             {analysis.flags.length > 2 && <span className="text-[10px] text-on-surface-variant">+{analysis.flags.length - 2}</span>}
//                           </div>
//                         ) : analysis ? (
//                           <span className="px-2 py-0.5 bg-secondary-container/20 text-secondary rounded-md text-[10px] font-bold">Clear</span>
//                         ) : (
//                           <button
//                             onClick={e => { e.stopPropagation(); analyzeEvent(event); }}
//                             className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1"
//                           >
//                             <Sparkles size={10} /> Analyze
//                           </button>
//                         )}
//                       </td>

//                       {/* Risk Score */}
//                       <td className="px-4 py-4 w-28"><RiskBadge analysis={analysis} /></td>

//                       {/* Status */}
//                       <td className="px-4 py-4">
//                         <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${getStatusStyle(event.status)}`}>
//                           {getStatusLabel(event.status)}
//                         </span>
//                       </td>

//                       {/* ✅ Actions — all 3 work */}
//                       <td className="pr-6 py-4 text-right">
//                         <div className="flex items-center justify-end gap-1">
//                           {/* Approve */}
//                           <button
//                             onClick={e => { e.stopPropagation(); handleAction(event.id, 'approve'); }}
//                             className="p-2 text-secondary hover:bg-secondary-container/20 rounded-lg transition-colors"
//                             title="Approve"
//                           >
//                             <CheckCircle2 size={18} />
//                           </button>
//                           {/* ✅ Eye → ModerationDetail */}
//                           <Link
//                             to={`/moderation/${event.id}`}
//                             onClick={e => e.stopPropagation()}
//                             className="p-2 text-primary hover:bg-primary-container/10 rounded-lg transition-colors"
//                             title="View Detail"
//                           >
//                             <Eye size={18} />
//                           </Link>
//                           {/* Reject */}
//                           <button
//                             onClick={e => { e.stopPropagation(); handleAction(event.id, 'reject'); }}
//                             className="p-2 text-tertiary hover:bg-tertiary/10 rounded-lg transition-colors"
//                             title="Reject"
//                           >
//                             <X size={18} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           <div className="px-6 py-4 bg-surface-container-low/30 border-t border-indigo-50/50 flex justify-between items-center">
//             <button className="text-xs font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary"><ChevronLeft size={16} /> Previous</button>
//             <span className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg text-xs font-bold">1</span>
//             <button className="text-xs font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary">Next <ChevronRight size={16} /></button>
//           </div>
//         </div>

//         {/* AI Insights Panel */}
//         <div className="col-span-12 lg:col-span-4 space-y-6">
//           <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm relative overflow-hidden border border-indigo-50/50">
//             <div className="absolute top-0 left-0 w-1 h-full bg-tertiary" />
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-2 text-tertiary">
//                 <Sparkles size={20} />
//                 <h4 className="font-bold text-sm">AI Insights</h4>
//               </div>
//               {selectedAnalysis && !selectedAnalysis.isLoading && (
//                 <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${selectedAnalysis.riskScore >= 70 ? 'bg-tertiary/10 text-tertiary' : selectedAnalysis.riskScore >= 40 ? 'bg-amber-50 text-amber-700' : 'bg-secondary-container/20 text-secondary'}`}>
//                   {getRiskLabel(selectedAnalysis.riskLevel)}
//                 </span>
//               )}
//             </div>

//             {!selectedEvent ? (
//               <p className="text-xs text-on-surface-variant">Select an event to see AI analysis</p>
//             ) : selectedAnalysis?.isLoading || analyzingId === selectedEvent.id ? (
//               <div className="space-y-4">
//                 <div className="flex items-center gap-2 text-primary">
//                   <Loader2 size={16} className="animate-spin" />
//                   <span className="text-xs font-bold">Gemini AI analyzing…</span>
//                 </div>
//                 <AILoadingSkeleton />
//               </div>
//             ) : selectedAnalysis ? (
//               <>
//                 <div className="mb-4">
//                   <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Analyzing</p>
//                   <p className="text-sm font-semibold text-on-surface">"{selectedEvent.title}"</p>
//                   <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{selectedAnalysis.summary}</p>
//                 </div>
//                 <div className="space-y-3 mb-4">
//                   {[
//                     { label: 'Semantic Integrity', value: selectedAnalysis.semanticIntegrity },
//                     { label: 'Host Legitimacy', value: selectedAnalysis.hostLegitimacy },
//                     { label: 'Engagement Pattern', value: selectedAnalysis.engagementPattern },
//                   ].map(m => (
//                     <div key={m.label}>
//                       <div className="flex justify-between text-[11px] mb-1">
//                         <span className="text-on-surface-variant">{m.label}</span>
//                         <span className={`font-bold ${getRiskColor(100 - m.value)}`}>{m.value}/100</span>
//                       </div>
//                       <div className="w-full bg-indigo-50 h-1.5 rounded-full overflow-hidden">
//                         <div className={`h-full transition-all duration-700 ${getRiskBarColor(100 - m.value)}`} style={{ width: `${m.value}%` }} />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
// {(selectedAnalysis.flags?.length ?? 0) > 0 && (
//                     <div className="space-y-2 mb-4">
//                     {selectedAnalysis.flags.map((flag, i) => (
//                       <div key={i} className={`p-3 rounded-lg flex items-start gap-2 ${flag.severity === 'high' ? 'bg-tertiary/5 border-l-2 border-tertiary' : 'bg-amber-50/50 border-l-2 border-amber-400'}`}>
//                         <AlertCircle size={14} className={flag.severity === 'high' ? 'text-tertiary mt-0.5' : 'text-amber-600 mt-0.5'} />
//                         <div>
//                           <p className="text-xs font-bold text-on-surface">{flag.type}</p>
//                           <p className="text-[11px] text-on-surface-variant">{flag.description}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 <div className="bg-surface-container-low p-4 rounded-2xl mb-4">
//                   <p className="text-[10px] font-bold text-primary uppercase mb-1">Recommendation</p>
//                   <p className="text-xs italic text-on-surface-variant">"{selectedAnalysis.recommendation}"</p>
//                 </div>
//                 <Link to={`/moderation/${selectedEvent.id}`} className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-all text-center block">
//                   Review Full Report
//                 </Link>
//               </>
//             ) : (
//               <div className="text-center py-4">
//                 <p className="text-xs text-on-surface-variant mb-3">Click an event to analyze</p>
//                 <button onClick={() => selectedEvent && analyzeEvent(selectedEvent)} className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 flex items-center gap-2 mx-auto">
//                   <Sparkles size={14} /> Analyze with AI
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Event Context */}
//           {selectedEvent && (
//             <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-indigo-50/50">
//               <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Event Context</h4>
//               <div className="space-y-3">
//                 {[
//                   { label: 'Category', val: selectedEvent.category },
//                   { label: 'Price', val: selectedEvent.ticketPrice },
//                   { label: 'Capacity', val: String(selectedEvent.capacity) },
//                   { label: 'Date', val: selectedEvent.eventDate },
//                   { label: 'Location', val: selectedEvent.location },
//                 ].map(r => (
//                   <div key={r.label} className="flex justify-between text-sm">
//                     <span className="text-on-surface-variant">{r.label}</span>
//                     <span className="font-semibold text-right max-w-[60%] truncate">{r.val}</span>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-4 pt-4 border-t border-indigo-50 flex gap-2">
//                 <button onClick={() => handleAction(selectedEvent.id, 'approve')} className="flex-1 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1">
//                   <CheckCircle2 size={14} /> Approve
//                 </button>
//                 <button onClick={() => handleAction(selectedEvent.id, 'reject')} className="flex-1 py-2 bg-tertiary/10 text-tertiary rounded-xl text-xs font-bold hover:bg-tertiary/20 flex items-center justify-center gap-1">
//                   <X size={14} /> Reject
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
// ✅ MyApp MongoDB se events fetch karta hai (via backend API)
// ✅ Eye → ModerationDetail, Approve/Reject → MongoDB update

import React, { useState, useEffect, useCallback } from 'react';
import {
  Filter, CheckCircle2, Eye, X, ChevronLeft, ChevronRight,
  Sparkles, AlertCircle, Loader2, RefreshCw, Zap, Plus,
  Database,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeEventWithOpenAI, getRiskColor, getRiskBarColor, getRiskLabel } from '../lib/openai';
import { getEventsFromAPI, updateEventStatusAPI, getEvents, updateEventStatus, addEvent } from '../lib/mockEvents';
import type { Event, AIAnalysis } from '../types';

const AILoadingSkeleton = () => (
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

const ModerationQueue = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [analyses, setAnalyses] = useState<Record<string, AIAnalysis>>({});
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isAnalyzingAll, setIsAnalyzingAll] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'api' | 'local'>('api');
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;
 
  const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ✅ Load events — try MongoDB API first, fallback to localStorage
  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const apiEvents = await getEventsFromAPI();
      if (apiEvents.length > 0) {
        setEvents(apiEvents);
        setSelectedEvent(apiEvents[0]);
        setDataSource('api');
        console.log(`✅ Loaded ${apiEvents.length} events from MyApp MongoDB`);
      } else {
        // Fallback to localStorage if API returns nothing
        const localEvents = getEvents();
        setEvents(localEvents);
        if (localEvents.length > 0) setSelectedEvent(localEvents[0]);
        setDataSource('local');
        console.log('⚠️ API returned no events, using localStorage fallback');
      }
    } catch (err) {
      const localEvents = getEvents();
      setEvents(localEvents);
      if (localEvents.length > 0) setSelectedEvent(localEvents[0]);
      setDataSource('local');
      console.error('❌ API failed, using localStorage:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadEvents(); }, []);

  const refreshEvents = async () => {
    await loadEvents();
    showNotification('Queue refreshed from MyApp!');
  };
  useEffect(() => {
  setCurrentPage(1);
}, [filterStatus]);

  const analyzeEvent = useCallback(async (event: Event) => {
    setAnalyzingId(event.id);
    setAnalyses(prev => ({ ...prev, [event.id]: { ...(prev[event.id] || {}), isLoading: true } as AIAnalysis }));
    try {
      const result = await analyzeEventWithOpenAI(event);
      const safe = {
        ...result,
        flags: result.flags ?? [],
        riskScore: result.riskScore ?? 0,
        riskLevel: result.riskLevel ?? 'low',
        semanticIntegrity: result.semanticIntegrity ?? 80,
        hostLegitimacy: result.hostLegitimacy ?? 80,
        engagementPattern: result.engagementPattern ?? 80,
        summary: result.summary ?? 'No summary available',
        recommendation: result.recommendation ?? '',
        scannedAt: result.scannedAt ?? new Date().toISOString(),
        isLoading: false,
      };
      setAnalyses(prev => ({ ...prev, [event.id]: safe }));

      if ((result.riskScore ?? 0) >= 70) {
        setEvents(prev => prev.map(e => e.id === event.id ? { ...e, status: 'flagged' } : e));
        // Update in both API and localStorage
        if (dataSource === 'api') await updateEventStatusAPI(event.id, 'flagged');
        else updateEventStatus(event.id, 'flagged');
      }
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setAnalyzingId(null);
    }
  }, [dataSource]);

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    if (!analyses[event.id]) analyzeEvent(event);
  };

  const analyzeAll = async () => {
    setIsAnalyzingAll(true);
    const toAnalyze = events.filter(e => !analyses[e.id]);
    for (const event of toAnalyze) await analyzeEvent(event);
    setIsAnalyzingAll(false);
    showNotification(`${toAnalyze.length} events analyzed!`);
  };

  // ✅ Approve/Reject — updates MongoDB via API
  const handleAction = async (eventId: string, action: 'approve' | 'reject') => {
    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    // Optimistic UI update
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: newStatus } : e));

    // Update in backend (MongoDB)
    if (dataSource === 'api') {
      const success = await updateEventStatusAPI(eventId, newStatus);
      if (!success) {
        showNotification('Failed to update status in MyApp DB', 'error');
        // Rollback
        setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'pending' } : e));
        return;
      }
    } else {
      updateEventStatus(eventId, newStatus);
    }

    showNotification(
      action === 'approve' ? '✓ Event approved & will be listed on MyApp!' : '✗ Event rejected',
      action === 'approve' ? 'success' : 'error',
    );

    if (selectedEvent?.id === eventId) {
      const next = events.find(e => e.id !== eventId && e.status === 'pending');
      if (next) setSelectedEvent(next);
    }
  };

  const pendingCount = events.filter(e => e.status === 'pending').length;
  const flaggedCount = events.filter(e => e.status === 'flagged').length;
  const selectedAnalysis = selectedEvent ? analyses[selectedEvent.id] : null;

  const getStatusStyle = (status: string) => ({
    flagged: 'text-tertiary bg-tertiary-container/10',
    pending: 'text-on-surface-variant bg-surface-container-highest',
    under_review: 'text-amber-700 bg-amber-100',
    approved: 'text-on-secondary-container bg-secondary-container',
    rejected: 'text-tertiary bg-tertiary/10',
  }[status] || 'text-on-surface-variant bg-surface-container-highest');

  const getStatusLabel = (s: string) =>
    ({ pending: 'PENDING', flagged: 'FLAGGED', under_review: 'UNDER REVIEW', approved: 'APPROVED', rejected: 'REJECTED' }[s] || s.toUpperCase());

  const filtered = events.filter(e => filterStatus === 'all' || e.status === filterStatus);
   const totalPages = Math.ceil(filtered.length / itemsPerPage);

const startIndex = (currentPage - 1) * itemsPerPage;
const paginatedEvents = filtered.slice(startIndex, startIndex + itemsPerPage);
  return (
    <div className="space-y-8">
      {/* Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg font-bold text-sm text-white ${notification.type === 'success' ? 'bg-secondary' : 'bg-tertiary'}`}>
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 block flex items-center gap-2">
            <Database size={10} />
            {dataSource === 'api' ? 'Live from MyApp MongoDB' : 'LocalStorage (API offline)'}
          </span>
          <h3 className="text-3xl font-extrabold text-on-surface tracking-tight">Moderation Queue</h3>
          <p className="text-on-surface-variant text-sm mt-1">Events from MyApp awaiting AI review &amp; approval.</p>
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
          <button
            onClick={analyzeAll}
            disabled={isAnalyzingAll || isLoading}
            className="bg-gradient-to-r from-primary to-primary-container text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-60"
          >
            {isAnalyzingAll ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
            {isAnalyzingAll ? 'Analyzing...' : 'AI Analyze All'}
          </button>
          <button
            onClick={refreshEvents}
            disabled={isLoading}
            className="bg-white border border-primary text-primary px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/5 transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-container-low p-4 rounded-2xl flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">Status</label>
          <select className="w-full bg-surface-container-highest border-none rounded-xl text-sm p-2" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="flagged">Flagged</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1 ml-1">Category</label>
          <select className="w-full bg-surface-container-highest border-none rounded-xl text-sm p-2">
            <option>All Categories</option>
            <option>Music &amp; Nightlife</option>
            <option>Technology</option>
            <option>Health &amp; Wellness</option>
            <option>Business &amp; Networking</option>
          </select>
        </div>
        <div className="flex items-end h-full pt-5">
          <button className="bg-surface-container-highest text-primary p-2 px-4 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-surface-variant transition-colors">
            <Filter size={16} /> More Filters
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-indigo-50/50">
          <div className="px-6 py-4 bg-indigo-50/30 flex justify-between items-center border-b border-indigo-50/50">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-indigo-900">{events.length} events in queue</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${dataSource === 'api' ? 'bg-secondary/10 text-secondary' : 'bg-amber-50 text-amber-700'}`}>
                {dataSource === 'api' ? 'MONGODB LIVE' : 'LOCAL CACHE'}
              </span>
            </div>
            <button onClick={refreshEvents} disabled={isLoading} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline disabled:opacity-50">
              <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b border-indigo-50">
                  <th className="pl-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Event &amp; Host</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">AI Flags</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider w-28">Risk Score</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="pr-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-50/30">
                {isLoading ? (
                  <tr><td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={32} className="animate-spin text-primary" />
                      <p className="text-sm text-on-surface-variant">Fetching events from MyApp database…</p>
                    </div>
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="py-16 text-center text-on-surface-variant text-sm">
                    {events.length === 0
                      ? <div className="space-y-2">
                          <p>No events found in MyApp database.</p>
                          <p className="text-xs">Make sure backend is running: <code className="bg-surface-container px-2 py-0.5 rounded">cd backend && node server.js</code></p>
                        </div>
                      : 'No events match this filter.'
                    }
                  </td></tr>
                ) : paginatedEvents.map(event => {
                  const analysis = analyses[event.id];
                  const isSelected = selectedEvent?.id === event.id;
                  return (
                    <tr key={event.id} onClick={() => handleSelectEvent(event)}
                      className={`transition-colors cursor-pointer ${isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-surface-container-low/50'}`}
                    >
                      <td className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={event.image} alt={event.title}
                            className="w-12 h-12 rounded-xl object-cover shadow-sm flex-shrink-0"
                            referrerPolicy="no-referrer"
                            onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/e8eaf6/4355b9?text=E'; }}
                          />
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-tight">{event.title}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <p className="text-[11px] text-on-surface-variant">Host: <span className="font-semibold">{event.host}</span></p>
                              {event.hostVerified && <span className="text-[9px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-bold">VERIFIED</span>}
                            </div>
                            <p className="text-[10px] text-on-surface-variant mt-0.5">{event.category}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        {analysis?.isLoading || analyzingId === event.id ? (
                          <Loader2 size={14} className="animate-spin text-primary" />
                        ) : (analysis?.flags?.length ?? 0) > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {analysis!.flags.slice(0, 2).map((flag, i) => (
                              <span key={i} className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${flag.severity === 'high' ? 'bg-tertiary/10 text-tertiary' : flag.severity === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                {flag.type}
                              </span>
                            ))}
                            {analysis!.flags.length > 2 && <span className="text-[10px] text-on-surface-variant">+{analysis!.flags.length - 2}</span>}
                          </div>
                        ) : analysis ? (
                          <span className="px-2 py-0.5 bg-secondary-container/20 text-secondary rounded-md text-[10px] font-bold">Clear</span>
                        ) : (
                          <button onClick={e => { e.stopPropagation(); analyzeEvent(event); }} className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1">
                            <Sparkles size={10} /> Analyze
                          </button>
                        )}
                      </td>

                      <td className="px-4 py-4 w-28"><RiskBadge analysis={analysis} /></td>

                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${getStatusStyle(event.status)}`}>
                          {getStatusLabel(event.status)}
                        </span>
                      </td>

                      <td className="pr-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={e => { e.stopPropagation(); handleAction(event.id, 'approve'); }}
                            className="p-2 text-secondary hover:bg-secondary-container/20 rounded-lg transition-colors" title="Approve">
                            <CheckCircle2 size={18} />
                          </button>
                          <Link to={`/moderation/${event.id}`} onClick={e => e.stopPropagation()}
                            className="p-2 text-primary hover:bg-primary-container/10 rounded-lg transition-colors" title="View Detail">
                            <Eye size={18} />
                          </Link>
                          <button onClick={e => { e.stopPropagation(); handleAction(event.id, 'reject'); }}
                            className="p-2 text-tertiary hover:bg-tertiary/10 rounded-lg transition-colors" title="Reject">
                            <X size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

         <div className="px-6 py-4 bg-surface-container-low/30 border-t border-indigo-50/50 flex justify-between items-center">

  {/* PREVIOUS */}
  <button
    onClick={() => setCurrentPage(prev => prev - 1)}
    disabled={currentPage === 1}
    className="text-xs font-bold flex items-center gap-1 disabled:opacity-40"
  >
    <ChevronLeft size={16} /> Previous
  </button>

  {/* PAGE NUMBER */}
  <span className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-bold">
    {currentPage} / {totalPages}
  </span>

  {/* NEXT */}
  <button
    onClick={() => setCurrentPage(prev => prev + 1)}
    disabled={currentPage === totalPages}
    className="text-xs font-bold flex items-center gap-1 disabled:opacity-40"
  >
    Next <ChevronRight size={16} />
  </button>

</div>
        </div>

        {/* AI Insights Panel */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm relative overflow-hidden border border-indigo-50/50">
            <div className="absolute top-0 left-0 w-1 h-full bg-tertiary" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-tertiary">
                <Sparkles size={20} />
                <h4 className="font-bold text-sm">AI Insights</h4>
              </div>
              {selectedAnalysis && !selectedAnalysis.isLoading && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${selectedAnalysis.riskScore >= 70 ? 'bg-tertiary/10 text-tertiary' : selectedAnalysis.riskScore >= 40 ? 'bg-amber-50 text-amber-700' : 'bg-secondary-container/20 text-secondary'}`}>
                  {getRiskLabel(selectedAnalysis.riskLevel)}
                </span>
              )}
            </div>

            {!selectedEvent ? (
              <p className="text-xs text-on-surface-variant">Select an event to see AI analysis</p>
            ) : selectedAnalysis?.isLoading || analyzingId === selectedEvent.id ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary"><Loader2 size={16} className="animate-spin" /><span className="text-xs font-bold">AI analyzing…</span></div>
                <AILoadingSkeleton />
              </div>
            ) : selectedAnalysis ? (
              <>
                <div className="mb-4">
                  <p className="text-xs font-bold text-on-surface-variant uppercase mb-1">Analyzing</p>
                  <p className="text-sm font-semibold text-on-surface">"{selectedEvent.title}"</p>
                  <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{selectedAnalysis.summary}</p>
                </div>
                <div className="space-y-3 mb-4">
                  {[
                    { label: 'Semantic Integrity', value: selectedAnalysis.semanticIntegrity },
                    { label: 'Host Legitimacy', value: selectedAnalysis.hostLegitimacy },
                    { label: 'Engagement Pattern', value: selectedAnalysis.engagementPattern },
                  ].map(m => (
                    <div key={m.label}>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-on-surface-variant">{m.label}</span>
                        <span className={`font-bold ${getRiskColor(100 - m.value)}`}>{m.value}/100</span>
                      </div>
                      <div className="w-full bg-indigo-50 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-700 ${getRiskBarColor(100 - m.value)}`} style={{ width: `${m.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                {(selectedAnalysis.flags?.length ?? 0) > 0 && (
                  <div className="space-y-2 mb-4">
                    {selectedAnalysis.flags.map((flag, i) => (
                      <div key={i} className={`p-3 rounded-lg flex items-start gap-2 ${flag.severity === 'high' ? 'bg-tertiary/5 border-l-2 border-tertiary' : 'bg-amber-50/50 border-l-2 border-amber-400'}`}>
                        <AlertCircle size={14} className={flag.severity === 'high' ? 'text-tertiary mt-0.5' : 'text-amber-600 mt-0.5'} />
                        <div>
                          <p className="text-xs font-bold text-on-surface">{flag.type}</p>
                          <p className="text-[11px] text-on-surface-variant">{flag.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="bg-surface-container-low p-4 rounded-2xl mb-4">
                  <p className="text-[10px] font-bold text-primary uppercase mb-1">Recommendation</p>
                  <p className="text-xs italic text-on-surface-variant">"{selectedAnalysis.recommendation}"</p>
                </div>
                <Link to={`/moderation/${selectedEvent.id}`} className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-all text-center block">
                  Review Full Report
                </Link>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-on-surface-variant mb-3">Click an event to analyze</p>
                <button onClick={() => selectedEvent && analyzeEvent(selectedEvent)} className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 flex items-center gap-2 mx-auto">
                  <Sparkles size={14} /> Analyze with AI
                </button>
              </div>
            )}
          </div>

          {selectedEvent && (
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-indigo-50/50">
              <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Event Context</h4>
              <div className="space-y-3">
                {[
                  { label: 'Category', val: selectedEvent.category },
                  { label: 'Price', val: selectedEvent.ticketPrice },
                  { label: 'Capacity', val: String(selectedEvent.capacity) },
                  { label: 'Date', val: selectedEvent.eventDate },
                  { label: 'Location', val: selectedEvent.location },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">{r.label}</span>
                    <span className="font-semibold text-right max-w-[60%] truncate">{r.val}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-indigo-50 flex gap-2">
                <button onClick={() => handleAction(selectedEvent.id, 'approve')}
                  className="flex-1 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1">
                  <CheckCircle2 size={14} /> Approve
                </button>
                <button onClick={() => handleAction(selectedEvent.id, 'reject')}
                  className="flex-1 py-2 bg-tertiary/10 text-tertiary rounded-xl text-xs font-bold hover:bg-tertiary/20 flex items-center justify-center gap-1">
                  <X size={14} /> Reject
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModerationQueue;