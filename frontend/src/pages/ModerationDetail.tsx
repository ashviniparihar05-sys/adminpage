// // import React, { useState, useEffect } from 'react';
// // import {
// //   ExternalLink,
// //   Edit3,
// //   MapPin,
// //   Bot,
// //   AlertTriangle,
// //   Layers,
// //   Send,
// //   CheckCircle2,
// //   Undo2,
// //   XCircle,
// //   Loader2,
// //   Sparkles,
// //   RefreshCw,
// //   AlertCircle,
// //   Shield,
// //   ChevronLeft,
// // } from 'lucide-react';
// // import { useParams, useNavigate, Link } from 'react-router-dom';
// // import { analyzeEventWithGemini, getRiskColor, getRiskBarColor, getRiskLabel } from "../lib/gemini";
// // import { MOCK_INCOMING_EVENTS } from '../lib/mockEvents';
// // import type { Event, AIAnalysis } from '../types';

// // const ModerationDetail = () => {
// //   const { id } = useParams<{ id: string }>();
// //   const navigate = useNavigate();
// //   const [event, setEvent] = useState<Event | null>(null);
// //   const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
// //   const [isAnalyzing, setIsAnalyzing] = useState(false);
// //   const [note, setNote] = useState('');
// //   const [notes, setNotes] = useState<{ text: string; time: string }[]>([
// //     { text: 'I checked the venue\'s public calendar. They don\'t have this booked. Flagging as potential scam.', time: '2h ago' },
// //   ]);
// //   const [actionDone, setActionDone] = useState<string | null>(null);

// //   useEffect(() => {
// //     const found = MOCK_INCOMING_EVENTS.find(e => e.id === id);
// //     setEvent(found || null);
// //     if (found) {
// //       runAnalysis(found);
// //     }
// //   }, [id]);

// //   const runAnalysis = async (evt: Event) => {
// //     setIsAnalyzing(true);
// //     try {
// //       const result = await analyzeEventWithGemini(evt);
// //       setAnalysis(result);
// //     } catch (err) {
// //       console.error(err);
// //     } finally {
// //       setIsAnalyzing(false);
// //     }
// //   };

// //   const handleAction = (action: 'approve' | 'reject' | 'send_edits') => {
// //     const msgs: Record<string, string> = {
// //       approve: '✓ Event approved! It will now be listed on MyApp.',
// //       reject: '✗ Event rejected & host notified.',
// //       send_edits: '↩ Sent back to host for edits.',
// //     };
// //     setActionDone(msgs[action]);
// //     setTimeout(() => navigate('/moderation'), 2000);
// //   };

// //   const addNote = () => {
// //     if (!note.trim()) return;
// //     setNotes(prev => [...prev, { text: note, time: 'Just now' }]);
// //     setNote('');
// //   };

// //   if (!event) {
// //     return (
// //       <div className="flex items-center justify-center h-64">
// //         <div className="text-center">
// //           <p className="text-on-surface-variant mb-4">Event not found</p>
// //           <Link to="/moderation" className="text-primary font-bold hover:underline">← Back to Queue</Link>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-8">
// //       {/* Action Done Banner */}
// //       {actionDone && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
// //           <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm">
// //             <CheckCircle2 size={48} className="text-secondary mx-auto mb-4" />
// //             <p className="font-bold text-lg">{actionDone}</p>
// //             <p className="text-xs text-on-surface-variant mt-2">Redirecting to queue...</p>
// //           </div>
// //         </div>
// //       )}

// //       {/* Back + Header */}
// //       <div className="flex items-center gap-3 mb-2">
// //         <Link to="/moderation" className="flex items-center gap-1 text-on-surface-variant hover:text-primary text-sm font-medium transition-colors">
// //           <ChevronLeft size={16} /> Back to Queue
// //         </Link>
// //         <span className="text-on-surface-variant">/</span>
// //         <span className="text-xs font-bold text-on-surface-variant uppercase">{event.id}</span>
// //       </div>

// //       <div className="flex justify-between items-end">
// //         <div>
// //           <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">{event.title}</h2>
// //           <div className="flex items-center gap-3">
// //             <span className="text-on-surface-variant text-sm">Organized by</span>
// //             <div className="flex items-center gap-2">
// //               <div className="w-6 h-6 rounded-lg bg-primary-container flex items-center justify-center text-white text-[10px] font-bold">
// //                 {event.host[0]}
// //               </div>
// //               <span className="text-primary font-semibold">{event.host}</span>
// //               {event.hostVerified && (
// //                 <span className="text-[9px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold">VERIFIED</span>
// //               )}
// //               <ExternalLink size={14} className="text-primary" />
// //             </div>
// //           </div>
// //         </div>
// //         <div className="flex gap-3">
// //           <button className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface font-semibold hover:bg-surface-container-low transition-all">
// //             Preview as User
// //           </button>
// //           <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:opacity-90 transition-all">
// //             <Edit3 size={16} />
// //             Quick Edit
// //           </button>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-12 gap-8 items-start">
// //         {/* Left - Event Details */}
// //         <div className="col-span-12 lg:col-span-8 space-y-8">
// //           {/* Images */}
// //           <div className="grid grid-cols-3 gap-4 h-[360px]">
// //             <div className="col-span-2 rounded-xl overflow-hidden group relative shadow-md">
// //               <img
// //                 className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
// //                 src={event.image}
// //                 alt={event.title}
// //                 referrerPolicy="no-referrer"
// //                 onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e8eaf6/4355b9?text=Event'; }}
// //               />
// //               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
// //               <div className="absolute bottom-4 left-4">
// //                 <span className="bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full">
// //                   {event.category}
// //                 </span>
// //               </div>
// //             </div>
// //             <div className="grid grid-rows-2 gap-4">
// //               <div className="rounded-xl overflow-hidden bg-surface-container-low flex items-center justify-center">
// //                 <div className="text-center p-4">
// //                   <p className="text-2xl font-bold text-primary">{event.capacity}</p>
// //                   <p className="text-xs text-on-surface-variant">Max Capacity</p>
// //                 </div>
// //               </div>
// //               <div className="rounded-xl overflow-hidden bg-surface-container-low flex items-center justify-center">
// //                 <div className="text-center p-4">
// //                   <p className="text-sm font-bold text-primary">{event.ticketPrice}</p>
// //                   <p className="text-xs text-on-surface-variant">Ticket Price</p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Event Info */}
// //           <section className="bg-surface-container-lowest rounded-xl p-8 space-y-6 shadow-sm border border-indigo-50/50">
// //             <div className="flex items-center justify-between">
// //               <h3 className="text-xl font-bold text-on-surface">Event Description</h3>
// //               <div className="flex gap-2">
// //                 {event.category.split(' & ').map(cat => (
// //                   <span key={cat} className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-bold text-on-surface-variant uppercase tracking-wider">
// //                     {cat.trim()}
// //                   </span>
// //                 ))}
// //               </div>
// //             </div>
// //             <p className="text-on-surface-variant leading-relaxed">{event.description}</p>

// //             <div className="grid grid-cols-3 gap-8 py-6 border-t border-indigo-100/10">
// //               <div>
// //                 <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">Ticket Price</p>
// //                 <p className="text-xl font-extrabold text-primary">{event.ticketPrice}</p>
// //               </div>
// //               <div>
// //                 <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">Date</p>
// //                 <p className="text-lg font-bold">{event.eventDate}</p>
// //               </div>
// //               <div>
// //                 <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">Capacity</p>
// //                 <p className="text-lg font-bold text-secondary">{event.capacity} Max</p>
// //               </div>
// //             </div>

// //             <div className="space-y-3">
// //               <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest">Location</p>
// //               <div className="h-40 rounded-xl bg-surface-container-low flex items-center justify-center border border-indigo-100/30">
// //                 <div className="bg-white p-3 rounded-2xl shadow-xl border border-indigo-100 flex items-center gap-3">
// //                   <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-white">
// //                     <MapPin size={20} />
// //                   </div>
// //                   <div>
// //                     <p className="font-bold text-sm">{event.location}</p>
// //                     <p className="text-xs text-on-surface-variant">Event Venue</p>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </section>
// //         </div>

// //         {/* Right - AI Report + Actions */}
// //         <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-24">
// //           {/* AI Moderation Report */}
// //           <section className={`rounded-xl p-6 border-l-4 shadow-sm ${
// //             analysis && analysis.riskScore >= 70 ? 'bg-surface-container-highest/40 border-tertiary' :
// //             analysis && analysis.riskScore >= 40 ? 'bg-amber-50/40 border-amber-400' :
// //             'bg-secondary-container/10 border-secondary'
// //           }`}>
// //             <div className="flex items-start justify-between mb-4">
// //               <div>
// //                 <h3 className="font-bold text-on-surface flex items-center gap-2">
// //                   <Bot size={18} className="text-primary" />
// //                   AI Moderation Report
// //                 </h3>
// //                 {analysis && !isAnalyzing && (
// //                   <p className="text-xs text-on-surface-variant mt-0.5 italic">
// //                     Scanned at {new Date(analysis.scannedAt).toLocaleTimeString()}
// //                   </p>
// //                 )}
// //               </div>
// //               <div className="flex items-center gap-2">
// //                 {analysis && !isAnalyzing && (
// //                   <span className={`px-3 py-1 rounded-full font-bold text-xs ${
// //                     analysis.riskScore >= 70 ? 'bg-tertiary/10 text-tertiary border border-tertiary/20' :
// //                     analysis.riskScore >= 40 ? 'bg-amber-100 text-amber-700' :
// //                     'bg-secondary-container/20 text-secondary'
// //                   }`}>
// //                     {getRiskLabel(analysis.riskLevel)}
// //                   </span>
// //                 )}
// //                 <button
// //                   onClick={() => runAnalysis(event)}
// //                   disabled={isAnalyzing}
// //                   className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container transition-colors"
// //                   title="Re-analyze"
// //                 >
// //                   <RefreshCw size={14} className={isAnalyzing ? 'animate-spin' : ''} />
// //                 </button>
// //               </div>
// //             </div>

// //             {isAnalyzing ? (
// //               <div className="space-y-4 py-4">
// //                 <div className="flex items-center gap-3 text-primary">
// //                   <Loader2 size={20} className="animate-spin" />
// //                   <div>
// //                     <p className="text-sm font-bold">Gemini AI Analyzing...</p>
// //                     <p className="text-xs text-on-surface-variant">Checking content, pricing, flags...</p>
// //                   </div>
// //                 </div>
// //                 <div className="animate-pulse space-y-3">
// //                   <div className="h-3 bg-indigo-100 rounded w-full"></div>
// //                   <div className="h-3 bg-indigo-100 rounded w-4/5"></div>
// //                   <div className="h-3 bg-indigo-100 rounded w-3/5"></div>
// //                   <div className="h-8 bg-indigo-100 rounded"></div>
// //                   <div className="h-8 bg-indigo-100 rounded"></div>
// //                 </div>
// //               </div>
// //             ) : analysis ? (
// //               <>
// //                 <div className="bg-white/60 p-4 rounded-lg mb-4">
// //                   <div className="flex justify-between items-center mb-2">
// //                     <span className="text-xs font-bold uppercase tracking-tighter text-on-surface-variant">Risk Score</span>
// //                     <span className={`text-lg font-black ${getRiskColor(analysis.riskScore)}`}>
// //                       {analysis.riskScore}/100
// //                     </span>
// //                   </div>
// //                   <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
// //                     <div
// //                       className={`h-full transition-all duration-700 ${getRiskBarColor(analysis.riskScore)}`}
// //                       style={{ width: `${analysis.riskScore}%` }}
// //                     />
// //                   </div>
// //                   <p className="text-xs mt-3 leading-relaxed text-on-surface-variant">{analysis.summary}</p>
// //                 </div>

// //                 {/* Metric bars */}
// //                 <div className="space-y-2 mb-4">
// //                   {[
// //                     { label: 'Semantic Integrity', value: analysis.semanticIntegrity },
// //                     { label: 'Host Legitimacy', value: analysis.hostLegitimacy },
// //                     { label: 'Engagement Pattern', value: analysis.engagementPattern },
// //                   ].map(m => (
// //                     <div key={m.label}>
// //                       <div className="flex justify-between text-[11px] mb-0.5">
// //                         <span className="text-on-surface-variant">{m.label}</span>
// //                         <span className={`font-bold ${getRiskColor(100 - m.value)}`}>{m.value}/100</span>
// //                       </div>
// //                       <div className="w-full bg-indigo-50 h-1 rounded-full overflow-hidden">
// //                         <div
// //                           className={`h-full ${getRiskBarColor(100 - m.value)}`}
// //                           style={{ width: `${m.value}%` }}
// //                         />
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>

// //                 {/* Flags */}
// //                 {analysis.flags.length > 0 && (
// //                   <div className="space-y-2 mb-4">
// //                     {analysis.flags.map((flag, i) => (
// //                       <div
// //                         key={i}
// //                         className={`flex items-start gap-3 p-3 rounded-lg ${
// //                           flag.severity === 'high' ? 'bg-tertiary/5 border-l-2 border-tertiary' :
// //                           'bg-amber-50/50 border-l-2 border-amber-400'
// //                         }`}
// //                       >
// //                         <AlertTriangle size={14} className={flag.severity === 'high' ? 'text-tertiary mt-0.5' : 'text-amber-600 mt-0.5'} />
// //                         <div>
// //                           <p className="text-sm font-bold text-on-surface">{flag.type}</p>
// //                           <p className="text-[11px] text-on-surface-variant">{flag.description}</p>
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}

// //                 {analysis.flags.length === 0 && (
// //                   <div className="flex items-center gap-2 p-3 bg-secondary-container/20 rounded-lg mb-4">
// //                     <Shield size={16} className="text-secondary" />
// //                     <p className="text-xs font-bold text-secondary">No issues detected by AI</p>
// //                   </div>
// //                 )}

// //                 {/* Recommendation */}
// //                 <div className="bg-surface-container-low p-4 rounded-2xl">
// //                   <p className="text-[10px] font-bold text-primary uppercase mb-1">Moderator Recommendation</p>
// //                   <p className="text-xs italic text-on-surface-variant">"{analysis.recommendation}"</p>
// //                 </div>
// //               </>
// //             ) : null}
// //           </section>

// //           {/* Collaboration */}
// //           <section className="bg-surface-container-low rounded-xl p-6 space-y-4 shadow-sm">
// //             <div className="flex items-center justify-between">
// //               <h3 className="font-bold text-on-surface text-sm uppercase tracking-wider">Collaboration Notes</h3>
// //               <button className="text-primary text-xs font-bold hover:underline">View History</button>
// //             </div>
// //             <div className="space-y-3 max-h-40 overflow-y-auto">
// //               {notes.map((n, i) => (
// //                 <div key={i} className="flex gap-3">
// //                   <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">M</div>
// //                   <div className="flex-1 bg-white p-3 rounded-xl rounded-tl-none shadow-sm text-xs">
// //                     <p className="font-bold mb-0.5">Moderator <span className="font-normal text-on-surface-variant ml-1">{n.time}</span></p>
// //                     <p className="text-on-surface-variant leading-snug">{n.text}</p>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //             <div className="relative">
// //               <textarea
// //                 className="w-full bg-white border-none rounded-xl text-xs min-h-[70px] p-3 focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/50 shadow-inner"
// //                 placeholder="Add internal note... Use @ to tag"
// //                 value={note}
// //                 onChange={e => setNote(e.target.value)}
// //               />
// //               <button
// //                 onClick={addNote}
// //                 className="absolute bottom-2 right-2 p-1.5 bg-primary text-white rounded-lg hover:opacity-90 transition-all"
// //               >
// //                 <Send size={14} />
// //               </button>
// //             </div>
// //           </section>

// //           {/* Final Action */}
// //           <section className="bg-surface-container-highest rounded-xl p-6 shadow-sm border border-indigo-50/50">
// //             <h3 className="font-bold text-on-surface text-sm uppercase tracking-wider mb-4">Final Action</h3>
// //             <div className="flex flex-col gap-3">
// //               <button
// //                 onClick={() => handleAction('approve')}
// //                 className="w-full py-3 bg-secondary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 shadow-md shadow-secondary/10 transition-all"
// //               >
// //                 <CheckCircle2 size={18} />
// //                 Approve Event → List on MyApp
// //               </button>
// //               <button
// //                 onClick={() => handleAction('send_edits')}
// //                 className="w-full py-3 bg-white text-on-surface-variant font-bold border border-outline-variant rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all"
// //               >
// //                 <Undo2 size={18} />
// //                 Send Back for Edits
// //               </button>
// //               <button
// //                 onClick={() => handleAction('reject')}
// //                 className="w-full py-3 bg-tertiary-container text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:brightness-110 shadow-md shadow-tertiary/10 transition-all"
// //               >
// //                 <XCircle size={18} />
// //                 Reject & Suspend Host
// //               </button>
// //             </div>
// //             <p className="text-[10px] text-center mt-4 text-on-surface-variant uppercase font-bold tracking-widest">
// //               Action will be logged in Audit Trail
// //             </p>
// //           </section>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ModerationDetail;
// // frontend/src/pages/ModerationDetail.tsx
// // ✅ Loads event from localStorage (works for default + created events)
// // ✅ Approve/Reject persists to localStorage
// // ✅ Re-analyze button works

// import React, { useState, useEffect } from 'react';
// import {
//   ExternalLink, Edit3, MapPin, Bot, AlertTriangle, Send,
//   CheckCircle2, Undo2, XCircle, Loader2, RefreshCw, Shield, ChevronLeft,
// } from 'lucide-react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { analyzeEventWithGemini, getRiskColor, getRiskBarColor, getRiskLabel } from '../lib/gemini';
// import { getEvents, updateEventStatus } from '../lib/mockEvents';
// import type { Event, AIAnalysis } from '../types';

// const ModerationDetail = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [event, setEvent] = useState<Event | null>(null);
//   const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [note, setNote] = useState('');
//   const [notes, setNotes] = useState<{ text: string; time: string }[]>([]);
//   const [actionDone, setActionDone] = useState<string | null>(null);

//   useEffect(() => {
//     // ✅ Load from localStorage — finds both seed events + created events
//     const all = getEvents();
//     const found = all.find(e => e.id === id) || null;
//     setEvent(found);
//     if (found) runAnalysis(found);
//   }, [id]);

//   const runAnalysis = async (evt: Event) => {
//     setIsAnalyzing(true);
//     try {
//       const result = await analyzeEventWithGemini(evt);
//       setAnalysis(result);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   const handleAction = (action: 'approve' | 'reject' | 'send_edits') => {
//     if (!event) return;
//     if (action === 'approve') {
//       updateEventStatus(event.id, 'approved');
//       setEvent(prev => prev ? { ...prev, status: 'approved' } : prev);
//     } else if (action === 'reject') {
//       updateEventStatus(event.id, 'rejected');
//       setEvent(prev => prev ? { ...prev, status: 'rejected' } : prev);
//     }
//     const msgs: Record<string, string> = {
//       approve: '✓ Event approved! It will now be listed on MyApp.',
//       reject: '✗ Event rejected & host notified.',
//       send_edits: '↩ Sent back to host for edits.',
//     };
//     setActionDone(msgs[action]);
//     setTimeout(() => navigate('/moderation'), 2000);
//   };

//   const addNote = () => {
//     if (!note.trim()) return;
//     setNotes(prev => [...prev, { text: note, time: 'Just now' }]);
//     setNote('');
//   };

//   if (!event) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <p className="text-on-surface-variant mb-4">Event not found</p>
//           <Link to="/moderation" className="text-primary font-bold hover:underline">← Back to Queue</Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {/* Success overlay */}
//       {actionDone && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm">
//             <CheckCircle2 size={48} className="text-secondary mx-auto mb-4" />
//             <p className="font-bold text-lg">{actionDone}</p>
//             <p className="text-xs text-on-surface-variant mt-2">Redirecting to queue...</p>
//           </div>
//         </div>
//       )}

//       {/* Breadcrumb */}
//       <div className="flex items-center gap-3">
//         <Link to="/moderation" className="flex items-center gap-1 text-on-surface-variant hover:text-primary text-sm font-medium transition-colors">
//           <ChevronLeft size={16} /> Back to Queue
//         </Link>
//         <span className="text-on-surface-variant">/</span>
//         <span className="text-xs font-bold text-on-surface-variant uppercase">{event.id}</span>
//         {/* Status badge */}
//         <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
//           event.status === 'approved' ? 'bg-secondary-container text-on-secondary-container' :
//           event.status === 'rejected' ? 'bg-tertiary/10 text-tertiary' :
//           event.status === 'flagged' ? 'bg-amber-100 text-amber-700' :
//           'bg-surface-container-highest text-on-surface-variant'
//         }`}>
//           {event.status}
//         </span>
//       </div>

//       {/* Title */}
//       <div className="flex justify-between items-end flex-wrap gap-4">
//         <div>
//           <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">{event.title}</h2>
//           <div className="flex items-center gap-3 flex-wrap">
//             <span className="text-on-surface-variant text-sm">Organized by</span>
//             <div className="flex items-center gap-2">
//               <div className="w-6 h-6 rounded-lg bg-primary-container flex items-center justify-center text-white text-[10px] font-bold">{event.host[0]}</div>
//               <span className="text-primary font-semibold">{event.host}</span>
//               {event.hostVerified && <span className="text-[9px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold">VERIFIED</span>}
//               <ExternalLink size={14} className="text-primary" />
//             </div>
//           </div>
//         </div>
//         <div className="flex gap-3">
//           <button className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface font-semibold hover:bg-surface-container-low transition-all">
//             Preview as User
//           </button>
//           <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:opacity-90 transition-all">
//             <Edit3 size={16} /> Quick Edit
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-12 gap-8 items-start">
//         {/* Left */}
//         <div className="col-span-12 lg:col-span-8 space-y-8">
//           {/* Image + stats */}
//           <div className="grid grid-cols-3 gap-4 h-72">
//             <div className="col-span-2 rounded-xl overflow-hidden group relative shadow-md">
//               <img
//                 className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
//                 src={event.image}
//                 alt={event.title}
//                 referrerPolicy="no-referrer"
//                 onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e8eaf6/4355b9?text=Event'; }}
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//               <div className="absolute bottom-4 left-4">
//                 <span className="bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full">{event.category}</span>
//               </div>
//             </div>
//             <div className="grid grid-rows-2 gap-4">
//               <div className="rounded-xl bg-surface-container-low flex items-center justify-center">
//                 <div className="text-center p-4">
//                   <p className="text-2xl font-bold text-primary">{event.capacity}</p>
//                   <p className="text-xs text-on-surface-variant">Max Capacity</p>
//                 </div>
//               </div>
//               <div className="rounded-xl bg-surface-container-low flex items-center justify-center">
//                 <div className="text-center p-4">
//                   <p className="text-sm font-bold text-primary">{event.ticketPrice}</p>
//                   <p className="text-xs text-on-surface-variant">Ticket Price</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Description */}
//           <section className="bg-surface-container-lowest rounded-xl p-8 space-y-6 shadow-sm border border-indigo-50/50">
//             <div className="flex items-center justify-between flex-wrap gap-3">
//               <h3 className="text-xl font-bold text-on-surface">Event Description</h3>
//               <div className="flex gap-2 flex-wrap">
//                 {event.category.split(' & ').map(cat => (
//                   <span key={cat} className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-bold text-on-surface-variant uppercase tracking-wider">{cat.trim()}</span>
//                 ))}
//               </div>
//             </div>
//             <p className="text-on-surface-variant leading-relaxed">{event.description}</p>
//             <div className="grid grid-cols-3 gap-8 py-6 border-t border-indigo-100/10">
//               <div>
//                 <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">Ticket Price</p>
//                 <p className="text-xl font-extrabold text-primary">{event.ticketPrice}</p>
//               </div>
//               <div>
//                 <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">Date</p>
//                 <p className="text-lg font-bold">{event.eventDate}</p>
//               </div>
//               <div>
//                 <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">Capacity</p>
//                 <p className="text-lg font-bold text-secondary">{event.capacity} Max</p>
//               </div>
//             </div>
//             <div>
//               <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-3">Location</p>
//               <div className="h-28 rounded-xl bg-surface-container-low flex items-center justify-center border border-indigo-100/30">
//                 <div className="bg-white p-3 rounded-2xl shadow-xl border border-indigo-100 flex items-center gap-3">
//                   <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-white">
//                     <MapPin size={20} />
//                   </div>
//                   <div>
//                     <p className="font-bold text-sm">{event.location}</p>
//                     <p className="text-xs text-on-surface-variant">Event Venue</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-4 pt-2 border-t border-indigo-50/30 text-xs">
//               <div>
//                 <p className="text-on-surface-variant font-bold uppercase tracking-widest text-[10px] mb-0.5">Submitted</p>
//                 <p className="font-semibold">{new Date(event.dateSubmitted).toLocaleString()}</p>
//               </div>
//               <div>
//                 <p className="text-on-surface-variant font-bold uppercase tracking-widest text-[10px] mb-0.5">Event ID</p>
//                 <p className="font-semibold font-mono">{event.id}</p>
//               </div>
//             </div>
//           </section>
//         </div>

//         {/* Right */}
//         <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-24">
//           {/* AI Report */}
//           <section className={`rounded-xl p-6 border-l-4 shadow-sm ${
//             analysis && analysis.riskScore >= 70 ? 'bg-surface-container-highest/40 border-tertiary' :
//             analysis && analysis.riskScore >= 40 ? 'bg-amber-50/40 border-amber-400' :
//             'bg-secondary-container/10 border-secondary'
//           }`}>
//             <div className="flex items-start justify-between mb-4">
//               <div>
//                 <h3 className="font-bold text-on-surface flex items-center gap-2">
//                   <Bot size={18} className="text-primary" /> AI Moderation Report
//                 </h3>
//                 {analysis && !isAnalyzing && (
//                   <p className="text-xs text-on-surface-variant mt-0.5 italic">Scanned at {new Date(analysis.scannedAt).toLocaleTimeString()}</p>
//                 )}
//               </div>
//               <div className="flex items-center gap-2">
//                 {analysis && !isAnalyzing && (
//                   <span className={`px-3 py-1 rounded-full font-bold text-xs ${analysis.riskScore >= 70 ? 'bg-tertiary/10 text-tertiary border border-tertiary/20' : analysis.riskScore >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-secondary-container/20 text-secondary'}`}>
//                     {getRiskLabel(analysis.riskLevel)}
//                   </span>
//                 )}
//                 <button onClick={() => event && runAnalysis(event)} disabled={isAnalyzing} className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container transition-colors" title="Re-analyze">
//                   <RefreshCw size={14} className={isAnalyzing ? 'animate-spin' : ''} />
//                 </button>
//               </div>
//             </div>

//             {isAnalyzing ? (
//               <div className="space-y-4 py-4">
//                 <div className="flex items-center gap-3 text-primary">
//                   <Loader2 size={20} className="animate-spin" />
//                   <div>
//                     <p className="text-sm font-bold">Gemini AI Analyzing...</p>
//                     <p className="text-xs text-on-surface-variant">Checking content, pricing, flags...</p>
//                   </div>
//                 </div>
//                 <div className="animate-pulse space-y-3">
//                   <div className="h-3 bg-indigo-100 rounded w-full" /><div className="h-3 bg-indigo-100 rounded w-4/5" />
//                   <div className="h-3 bg-indigo-100 rounded w-3/5" /><div className="h-8 bg-indigo-100 rounded" />
//                 </div>
//               </div>
//             ) : analysis ? (
//               <>
//                 <div className="bg-white/60 p-4 rounded-lg mb-4">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-xs font-bold uppercase tracking-tighter text-on-surface-variant">Risk Score</span>
//                     <span className={`text-lg font-black ${getRiskColor(analysis.riskScore)}`}>{analysis.riskScore}/100</span>
//                   </div>
//                   <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
//                     <div className={`h-full transition-all duration-700 ${getRiskBarColor(analysis.riskScore)}`} style={{ width: `${analysis.riskScore}%` }} />
//                   </div>
//                   <p className="text-xs mt-3 leading-relaxed text-on-surface-variant">{analysis.summary}</p>
//                 </div>
//                 <div className="space-y-2 mb-4">
//                   {[
//                     { label: 'Semantic Integrity', value: analysis.semanticIntegrity },
//                     { label: 'Host Legitimacy', value: analysis.hostLegitimacy },
//                     { label: 'Engagement Pattern', value: analysis.engagementPattern },
//                   ].map(m => (
//                     <div key={m.label}>
//                       <div className="flex justify-between text-[11px] mb-0.5">
//                         <span className="text-on-surface-variant">{m.label}</span>
//                         <span className={`font-bold ${getRiskColor(100 - m.value)}`}>{m.value}/100</span>
//                       </div>
//                       <div className="w-full bg-indigo-50 h-1 rounded-full overflow-hidden">
//                         <div className={`h-full ${getRiskBarColor(100 - m.value)}`} style={{ width: `${m.value}%` }} />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 {analysis.flags.length > 0 ? (
//                   <div className="space-y-2 mb-4">
//                     {analysis.flags.map((flag, i) => (
//                       <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${flag.severity === 'high' ? 'bg-tertiary/5 border-l-2 border-tertiary' : 'bg-amber-50/50 border-l-2 border-amber-400'}`}>
//                         <AlertTriangle size={14} className={flag.severity === 'high' ? 'text-tertiary mt-0.5' : 'text-amber-600 mt-0.5'} />
//                         <div>
//                           <p className="text-sm font-bold text-on-surface">{flag.type}</p>
//                           <p className="text-[11px] text-on-surface-variant">{flag.description}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-2 p-3 bg-secondary-container/20 rounded-lg mb-4">
//                     <Shield size={16} className="text-secondary" />
//                     <p className="text-xs font-bold text-secondary">No issues detected by AI</p>
//                   </div>
//                 )}
//                 <div className="bg-surface-container-low p-4 rounded-2xl">
//                   <p className="text-[10px] font-bold text-primary uppercase mb-1">Moderator Recommendation</p>
//                   <p className="text-xs italic text-on-surface-variant">"{analysis.recommendation}"</p>
//                 </div>
//               </>
//             ) : null}
//           </section>

//           {/* Notes */}
//           <section className="bg-surface-container-low rounded-xl p-6 space-y-4 shadow-sm">
//             <div className="flex items-center justify-between">
//               <h3 className="font-bold text-on-surface text-sm uppercase tracking-wider">Collaboration Notes</h3>
//             </div>
//             {notes.length > 0 && (
//               <div className="space-y-3 max-h-40 overflow-y-auto">
//                 {notes.map((n, i) => (
//                   <div key={i} className="flex gap-3">
//                     <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">M</div>
//                     <div className="flex-1 bg-white p-3 rounded-xl rounded-tl-none shadow-sm text-xs">
//                       <p className="font-bold mb-0.5">Moderator <span className="font-normal text-on-surface-variant ml-1">{n.time}</span></p>
//                       <p className="text-on-surface-variant leading-snug">{n.text}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//             <div className="relative">
//               <textarea
//                 className="w-full bg-white border-none rounded-xl text-xs min-h-[70px] p-3 focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/50 shadow-inner"
//                 placeholder="Add internal note..."
//                 value={note}
//                 onChange={e => setNote(e.target.value)}
//               />
//               <button onClick={addNote} className="absolute bottom-2 right-2 p-1.5 bg-primary text-white rounded-lg hover:opacity-90">
//                 <Send size={14} />
//               </button>
//             </div>
//           </section>

//           {/* Final Action */}
//           <section className="bg-surface-container-highest rounded-xl p-6 shadow-sm border border-indigo-50/50">
//             <h3 className="font-bold text-on-surface text-sm uppercase tracking-wider mb-4">Final Action</h3>
//             <div className="flex flex-col gap-3">
//               <button
//                 onClick={() => handleAction('approve')}
//                 disabled={event.status === 'approved'}
//                 className="w-full py-3 bg-secondary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 shadow-md shadow-secondary/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
//               >
//                 <CheckCircle2 size={18} />
//                 {event.status === 'approved' ? 'Already Approved ✓' : 'Approve Event → List on MyApp'}
//               </button>
//               <button
//                 onClick={() => handleAction('send_edits')}
//                 className="w-full py-3 bg-white text-on-surface-variant font-bold border border-outline-variant rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all"
//               >
//                 <Undo2 size={18} /> Send Back for Edits
//               </button>
//               <button
//                 onClick={() => handleAction('reject')}
//                 disabled={event.status === 'rejected'}
//                 className="w-full py-3 bg-tertiary-container text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:brightness-110 shadow-md shadow-tertiary/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
//               >
//                 <XCircle size={18} />
//                 {event.status === 'rejected' ? 'Already Rejected' : 'Reject & Suspend Host'}
//               </button>
//             </div>
//             <p className="text-[10px] text-center mt-4 text-on-surface-variant uppercase font-bold tracking-widest">Action logged in Audit Trail</p>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ModerationDetail;
// frontend/src/pages/ModerationDetail.tsx
// ✅ MongoDB se event load karta hai (API via backend)
// ✅ Approve/Reject → MongoDB update karta hai

import React, { useState, useEffect } from 'react';
import {
  ExternalLink, Edit3, MapPin, Bot, AlertTriangle, Send,
  CheckCircle2, Undo2, XCircle, Loader2, RefreshCw, Shield, ChevronLeft,
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { analyzeEventWithOpenAI, getRiskColor, getRiskBarColor, getRiskLabel } from '../lib/openai';
import { getEventByIdAPI, updateEventStatusAPI, getEvents, updateEventStatus } from '../lib/mockEvents';
import type { Event, AIAnalysis } from '../types';

const ModerationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<{ text: string; time: string }[]>([]);
  const [actionDone, setActionDone] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'api' | 'local'>('api');

  useEffect(() => {
    if (!id) return;
    loadEvent(id);
  }, [id]);

  const loadEvent = async (eventId: string) => {
    setIsLoading(true);
    try {
      // Try API first
      const apiEvent = await getEventByIdAPI(eventId);
      if (apiEvent) {
        setEvent(apiEvent);
        setDataSource('api');
        runAnalysis(apiEvent);
        return;
      }
    } catch (_) {}

    // Fallback to localStorage
    const all = getEvents();
    const found = all.find(e => e.id === eventId) || null;
    setEvent(found);
    setDataSource('local');
    if (found) runAnalysis(found);
    setIsLoading(false);
  };

  const runAnalysis = async (evt: Event) => {
    setIsAnalyzing(true);
    setIsLoading(false);
    try {
      const result = await analyzeEventWithOpenAI(evt);
      setAnalysis({
        ...result,
        flags: result.flags ?? [],
        riskScore: result.riskScore ?? 0,
        riskLevel: result.riskLevel ?? 'low',
        semanticIntegrity: result.semanticIntegrity ?? 80,
        hostLegitimacy: result.hostLegitimacy ?? 80,
        engagementPattern: result.engagementPattern ?? 80,
        summary: result.summary ?? '',
        recommendation: result.recommendation ?? '',
        scannedAt: result.scannedAt ?? new Date().toISOString(),
        isLoading: false,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAction = async (action: 'approve' | 'reject' | 'send_edits') => {
    if (!event) return;

    if (action === 'approve' || action === 'reject') {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';

      // Update in MongoDB
      if (dataSource === 'api') {
        await updateEventStatusAPI(event.id, newStatus);
      } else {
        updateEventStatus(event.id, newStatus);
      }

      setEvent(prev => prev ? { ...prev, status: newStatus } : prev);
    }

    const msgs: Record<string, string> = {
      approve: '✓ Event approved! It will now be listed on MyApp.',
      reject: '✗ Event rejected & host notified.',
      send_edits: '↩ Sent back to host for edits.',
    };
    setActionDone(msgs[action]);
    setTimeout(() => navigate('/moderation'), 2000);
  };

  const addNote = () => {
    if (!note.trim()) return;
    setNotes(prev => [...prev, { text: note, time: 'Just now' }]);
    setNote('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-primary mx-auto mb-3" />
          <p className="text-on-surface-variant text-sm">Loading event from MyApp…</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-on-surface-variant mb-4">Event not found</p>
          <Link to="/moderation" className="text-primary font-bold hover:underline">← Back to Queue</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {actionDone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm">
            <CheckCircle2 size={48} className="text-secondary mx-auto mb-4" />
            <p className="font-bold text-lg">{actionDone}</p>
            <p className="text-xs text-on-surface-variant mt-2">Redirecting to queue...</p>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link to="/moderation" className="flex items-center gap-1 text-on-surface-variant hover:text-primary text-sm font-medium transition-colors">
          <ChevronLeft size={16} /> Back to Queue
        </Link>
        <span className="text-on-surface-variant">/</span>
        <span className="text-xs font-bold text-on-surface-variant uppercase">{event.id}</span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
          event.status === 'approved' ? 'bg-secondary-container text-on-secondary-container' :
          event.status === 'rejected' ? 'bg-tertiary/10 text-tertiary' :
          event.status === 'flagged' ? 'bg-amber-100 text-amber-700' :
          'bg-surface-container-highest text-on-surface-variant'
        }`}>{event.status}</span>
        <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${dataSource === 'api' ? 'bg-secondary/10 text-secondary' : 'bg-amber-50 text-amber-700'}`}>
          {dataSource === 'api' ? 'MONGODB' : 'LOCAL'}
        </span>
      </div>

      {/* Title */}
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">{event.title}</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-on-surface-variant text-sm">Organized by</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary-container flex items-center justify-center text-white text-[10px] font-bold">{event.host[0]}</div>
              <span className="text-primary font-semibold">{event.host}</span>
              {event.hostVerified && <span className="text-[9px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold">VERIFIED</span>}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface font-semibold hover:bg-surface-container-low transition-all">Preview as User</button>
          <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:opacity-90">
            <Edit3 size={16} /> Quick Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="grid grid-cols-3 gap-4 h-72">
            <div className="col-span-2 rounded-xl overflow-hidden group relative shadow-md">
              <img className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                src={event.image} alt={event.title} referrerPolicy="no-referrer"
                onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/e8eaf6/4355b9?text=Event'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full">{event.category}</span>
              </div>
            </div>
            <div className="grid grid-rows-2 gap-4">
              <div className="rounded-xl bg-surface-container-low flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-2xl font-bold text-primary">{event.capacity}</p>
                  <p className="text-xs text-on-surface-variant">Max Capacity</p>
                </div>
              </div>
              <div className="rounded-xl bg-surface-container-low flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-sm font-bold text-primary">{event.ticketPrice}</p>
                  <p className="text-xs text-on-surface-variant">Ticket Price</p>
                </div>
              </div>
            </div>
          </div>

          <section className="bg-surface-container-lowest rounded-xl p-8 space-y-6 shadow-sm border border-indigo-50/50">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="text-xl font-bold text-on-surface">Event Description</h3>
              <div className="flex gap-2 flex-wrap">
                {event.category.split(' & ').map(cat => (
                  <span key={cat} className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-bold text-on-surface-variant uppercase tracking-wider">{cat.trim()}</span>
                ))}
              </div>
            </div>
            <p className="text-on-surface-variant leading-relaxed">{event.description}</p>
            <div className="grid grid-cols-3 gap-8 py-6 border-t border-indigo-100/10">
              <div><p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">Ticket Price</p><p className="text-xl font-extrabold text-primary">{event.ticketPrice}</p></div>
              <div><p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">Date</p><p className="text-lg font-bold">{event.eventDate || 'TBD'}</p></div>
              <div><p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">Capacity</p><p className="text-lg font-bold text-secondary">{event.capacity} Max</p></div>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-3">Location</p>
              <div className="h-24 rounded-xl bg-surface-container-low flex items-center justify-center border border-indigo-100/30">
                <div className="bg-white p-3 rounded-2xl shadow-xl border border-indigo-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-white"><MapPin size={20} /></div>
                  <div><p className="font-bold text-sm">{event.location}</p><p className="text-xs text-on-surface-variant">Event Venue</p></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-indigo-50/30 text-xs">
              <div><p className="text-on-surface-variant font-bold uppercase tracking-widest text-[10px] mb-0.5">Submitted</p><p className="font-semibold">{new Date(event.dateSubmitted).toLocaleString()}</p></div>
              <div><p className="text-on-surface-variant font-bold uppercase tracking-widest text-[10px] mb-0.5">Event ID</p><p className="font-semibold font-mono text-xs break-all">{event.id}</p></div>
            </div>
          </section>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-24">
          <section className={`rounded-xl p-6 border-l-4 shadow-sm ${
            analysis && analysis.riskScore >= 70 ? 'bg-surface-container-highest/40 border-tertiary' :
            analysis && analysis.riskScore >= 40 ? 'bg-amber-50/40 border-amber-400' :
            'bg-secondary-container/10 border-secondary'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-on-surface flex items-center gap-2"><Bot size={18} className="text-primary" /> AI Moderation Report</h3>
                {analysis && !isAnalyzing && <p className="text-xs text-on-surface-variant mt-0.5 italic">Scanned at {new Date(analysis.scannedAt).toLocaleTimeString()}</p>}
              </div>
              <div className="flex items-center gap-2">
                {analysis && !isAnalyzing && (
                  <span className={`px-3 py-1 rounded-full font-bold text-xs ${analysis.riskScore >= 70 ? 'bg-tertiary/10 text-tertiary border border-tertiary/20' : analysis.riskScore >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-secondary-container/20 text-secondary'}`}>
                    {getRiskLabel(analysis.riskLevel)}
                  </span>
                )}
                <button onClick={() => event && runAnalysis(event)} disabled={isAnalyzing}
                  className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container transition-colors">
                  <RefreshCw size={14} className={isAnalyzing ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {isAnalyzing ? (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3 text-primary"><Loader2 size={20} className="animate-spin" /><div><p className="text-sm font-bold">AI Analyzing...</p><p className="text-xs text-on-surface-variant">Checking content, pricing, flags...</p></div></div>
                <div className="animate-pulse space-y-3"><div className="h-3 bg-indigo-100 rounded w-full" /><div className="h-3 bg-indigo-100 rounded w-4/5" /><div className="h-8 bg-indigo-100 rounded" /></div>
              </div>
            ) : analysis ? (
              <>
                <div className="bg-white/60 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-tighter text-on-surface-variant">Risk Score</span>
                    <span className={`text-lg font-black ${getRiskColor(analysis.riskScore)}`}>{analysis.riskScore}/100</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-700 ${getRiskBarColor(analysis.riskScore)}`} style={{ width: `${analysis.riskScore}%` }} />
                  </div>
                  <p className="text-xs mt-3 leading-relaxed text-on-surface-variant">{analysis.summary}</p>
                </div>
                <div className="space-y-2 mb-4">
                  {[
                    { label: 'Semantic Integrity', value: analysis.semanticIntegrity },
                    { label: 'Host Legitimacy', value: analysis.hostLegitimacy },
                    { label: 'Engagement Pattern', value: analysis.engagementPattern },
                  ].map(m => (
                    <div key={m.label}>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="text-on-surface-variant">{m.label}</span>
                        <span className={`font-bold ${getRiskColor(100 - m.value)}`}>{m.value}/100</span>
                      </div>
                      <div className="w-full bg-indigo-50 h-1 rounded-full overflow-hidden">
                        <div className={`h-full ${getRiskBarColor(100 - m.value)}`} style={{ width: `${m.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                {(analysis.flags?.length ?? 0) > 0 ? (
                  <div className="space-y-2 mb-4">
                    {analysis.flags.map((flag, i) => (
                      <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${flag.severity === 'high' ? 'bg-tertiary/5 border-l-2 border-tertiary' : 'bg-amber-50/50 border-l-2 border-amber-400'}`}>
                        <AlertTriangle size={14} className={flag.severity === 'high' ? 'text-tertiary mt-0.5' : 'text-amber-600 mt-0.5'} />
                        <div><p className="text-sm font-bold text-on-surface">{flag.type}</p><p className="text-[11px] text-on-surface-variant">{flag.description}</p></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-secondary-container/20 rounded-lg mb-4">
                    <Shield size={16} className="text-secondary" />
                    <p className="text-xs font-bold text-secondary">No issues detected by AI</p>
                  </div>
                )}
                <div className="bg-surface-container-low p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-primary uppercase mb-1">Moderator Recommendation</p>
                  <p className="text-xs italic text-on-surface-variant">"{analysis.recommendation}"</p>
                </div>
              </>
            ) : null}
          </section>

          <section className="bg-surface-container-low rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-on-surface text-sm uppercase tracking-wider">Collaboration Notes</h3>
            {notes.length > 0 && (
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {notes.map((n, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">M</div>
                    <div className="flex-1 bg-white p-3 rounded-xl rounded-tl-none shadow-sm text-xs">
                      <p className="font-bold mb-0.5">Moderator <span className="font-normal text-on-surface-variant ml-1">{n.time}</span></p>
                      <p className="text-on-surface-variant leading-snug">{n.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="relative">
              <textarea className="w-full bg-white border-none rounded-xl text-xs min-h-[70px] p-3 focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/50 shadow-inner" placeholder="Add internal note..." value={note} onChange={e => setNote(e.target.value)} />
              <button onClick={addNote} className="absolute bottom-2 right-2 p-1.5 bg-primary text-white rounded-lg hover:opacity-90"><Send size={14} /></button>
            </div>
          </section>

          <section className="bg-surface-container-highest rounded-xl p-6 shadow-sm border border-indigo-50/50">
            <h3 className="font-bold text-on-surface text-sm uppercase tracking-wider mb-4">Final Action</h3>
            <div className="flex flex-col gap-3">
              <button onClick={() => handleAction('approve')} disabled={event.status === 'approved'}
                className="w-full py-3 bg-secondary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 shadow-md shadow-secondary/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                <CheckCircle2 size={18} />
                {event.status === 'approved' ? 'Already Approved ✓' : 'Approve Event → List on MyApp'}
              </button>
              <button onClick={() => handleAction('send_edits')}
                className="w-full py-3 bg-white text-on-surface-variant font-bold border border-outline-variant rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all">
                <Undo2 size={18} /> Send Back for Edits
              </button>
              <button onClick={() => handleAction('reject')} disabled={event.status === 'rejected'}
                className="w-full py-3 bg-tertiary-container text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:brightness-110 shadow-md shadow-tertiary/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                <XCircle size={18} />
                {event.status === 'rejected' ? 'Already Rejected' : 'Reject & Suspend Host'}
              </button>
            </div>
            <p className="text-[10px] text-center mt-4 text-on-surface-variant uppercase font-bold tracking-widest">Action logged in MongoDB + Audit Trail</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ModerationDetail;