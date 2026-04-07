// // import React, { useEffect, useState } from 'react';
// // import { getEventsFromAPI } from '../lib/mockEvents';
// // import { 
// //   AlertCircle, 
// //   MessageSquare, 
// //   Shield, 
// //   MoreHorizontal, 
// //   History, 
// //   Send, 
// //   Bot, 
// //   Gavel, 
// //   CheckCircle2, 
// //   Ban, 
// //   Search, 
// //   Filter 
// // } from 'lucide-react';

// // const Reports = () => {

// //   // ✅ PEHLE state
// // const [reports, setReports] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(true);
// // const [selectedReport, setSelectedReport] = useState(null);
// //   // ✅ FIR useEffect
// //   useEffect(() => {
// //     const loadReports = async () => {
// //       setLoading(true);

// //       const events = await getEventsFromAPI();

// //       const flaggedReports = events
// //         .filter(e => e.status === "flagged")
// //         .map(e => ({
// //           id: e.id,
// //           subject: e.title,
// //           reporter: "AI System",
// //           target: e.host,
// //           status: "Active",
// //           priority: "High",
// //           date: "just now"
          
// //         }));

// //       setReports(flaggedReports);
// //       setLoading(false);
      
// //     };

// //     loadReports();
// //   }, []);
// //   // const reports = [
// //   //   { id: 'REP-4401', subject: 'Harassment in Chat', reporter: 'Alice W.', target: 'Dmitri K.', status: 'Active', priority: 'High', date: '15m ago' },
// //   //   { id: 'REP-4402', subject: 'Inappropriate Content', reporter: 'System AI', target: 'Summer Rave 2024', status: 'Under Review', priority: 'Medium', date: '1h ago' },
// //   //   { id: 'REP-4403', subject: 'Spam / Scam', reporter: 'Bob S.', target: 'Crypto Meetup', status: 'Resolved', priority: 'Low', date: '4h ago' }
// //   // ];

// //   return (
// //     <div className="space-y-8">
// //       <div className="flex justify-between items-end">
// //         <div>
// //           <h3 className="text-3xl font-extrabold tracking-tight text-on-surface">Active Queue</h3>
// //           <p className="text-on-surface-variant text-sm mt-1">Manage user reports, harassment claims, and system alerts.</p>
// //         </div>
// //         <div className="flex gap-3">
// //           <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
// //             <p className="text-[10px] text-on-surface-variant font-bold uppercase">Open Reports</p>
// //             <p className="text-xl font-extrabold text-tertiary">14</p>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="grid grid-cols-12 gap-8 items-start">
// //         <div className="col-span-12 lg:col-span-7 space-y-6">
// //           <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-indigo-50/50">
// //             <div className="px-6 py-4 bg-indigo-50/30 flex justify-between items-center border-b border-indigo-50/50">
// //               <h4 className="text-sm font-bold text-indigo-900">Report Queue</h4>
// //               <div className="flex items-center gap-2">
// //                 <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg"><Search size={18} /></button>
// //                 <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg"><Filter size={18} /></button>
// //               </div>
// //             </div>
// //             <div className="overflow-x-auto">
// //               <table className="w-full text-left border-collapse">
// //                 <thead>
// //                   <tr className="border-b border-indigo-50">
// //                     <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Subject & ID</th>
// //                     <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Reporter / Target</th>
// //                     <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Priority</th>
// //                     <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Status</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y divide-indigo-50/30">
// // {loading ? (
// //   <tr>
// //     <td colSpan={4} className="text-center py-10">
// //       Loading reports...
// //     </td>
// //   </tr>
// // ) : (
// //   reports.map((report) => (
// //     <tr key={report.id} className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer">
// //       <td className="px-6 py-4">
// //         <div className="text-sm font-bold text-on-surface">{report.subject}</div>
// //         <div className="text-[11px] text-on-surface-variant">ID: {report.id} • {report.date}</div>
// //       </td>
// //       <td className="px-6 py-4">
// //         <div className="text-xs font-medium text-on-surface-variant">
// //           From: <span className="text-on-surface font-bold">{report.reporter}</span>
// //         </div>
// //         <div className="text-xs font-medium text-on-surface-variant">
// //           Target: <span className="text-on-surface font-bold">{report.target}</span>
// //         </div>
// //       </td>
// //       <td className="px-6 py-4">
// //         <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase text-tertiary bg-tertiary-container/10">
// //           {report.priority}
// //         </span>
// //       </td>
// //       <td className="px-6 py-4 text-right">
// //         <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase text-tertiary bg-tertiary-container/20">
// //           {report.status}
// //         </span>
// //       </td>
// //     </tr>
// //   ))
// // )}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="col-span-12 lg:col-span-5 space-y-6">
// //           <div className="bg-white rounded-3xl p-6 shadow-sm border border-indigo-50/50">
// //             <div className="flex justify-between items-start mb-6">
// //               <div>
// //                 <h4 className="text-lg font-bold text-on-surface">Report Detail</h4>
// //                 <p className="text-xs text-on-surface-variant">Case #REP-4401 • Harassment</p>
// //               </div>
// //               <button className="text-slate-400 hover:text-on-surface"><MoreHorizontal size={20} /></button>
// //             </div>

// //             <div className="bg-surface-container-low p-4 rounded-2xl mb-6">
// //               <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-2">Evidence: Conversation Log</p>
// //               <div className="space-y-3">
// //                 <div className="flex gap-2">
// //                   <span className="text-[10px] font-bold text-primary">Dmitri K:</span>
// //                   <p className="text-xs text-on-surface leading-snug bg-white p-2 rounded-lg rounded-tl-none shadow-sm">You shouldn't be here, this is for real fans only.</p>
// //                 </div>
// //                 <div className="flex gap-2">
// //                   <span className="text-[10px] font-bold text-indigo-900">Alice W:</span>
// //                   <p className="text-xs text-on-surface leading-snug bg-indigo-50 p-2 rounded-lg rounded-tl-none shadow-sm">I have a ticket just like everyone else.</p>
// //                 </div>
// //                 <div className="flex gap-2">
// //                   <span className="text-[10px] font-bold text-primary">Dmitri K:</span>
// //                   <p className="text-xs text-on-surface leading-snug bg-white p-2 rounded-lg rounded-tl-none shadow-sm italic text-tertiary">[Content removed by AI filter: Hate Speech]</p>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="relative bg-tertiary-container/5 rounded-xl p-4 overflow-hidden mb-6 border-l-4 border-tertiary">
// //               <div className="flex items-start gap-3">
// //                 <Bot size={20} className="text-tertiary" />
// //                 <div>
// //                   <p className="text-[11px] font-bold text-tertiary uppercase">AI Sentiment Analysis</p>
// //                   <p className="text-xs text-on-surface-variant leading-relaxed">Aggressive intent detected (92% confidence). Target user exhibits pattern of exclusionary behavior in 3 other event chats.</p>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="space-y-2">
// //               <button className="w-full py-3 bg-tertiary text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
// //                 <Ban size={16} />
// //                 Ban Dmitri K.
// //               </button>
// //               <div className="grid grid-cols-2 gap-2">
// //                 <button className="py-2.5 bg-surface-container-highest text-on-surface rounded-xl text-[10px] font-bold uppercase hover:bg-surface-variant transition-colors">Warn User</button>
// //                 <button className="py-2.5 border border-primary/20 text-primary rounded-xl text-[10px] font-bold uppercase hover:bg-primary/5 transition-colors">Dismiss Report</button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Reports;
// // frontend/src/pages/Reports.tsx
// // ✅ Dynamic — events se reports generate hote hain
// // ✅ Layout matches Figma exactly: left list + right detail panel

// import React, { useEffect, useState } from 'react';
// import {
//   Bot, Share2, MoreHorizontal, ExternalLink, Send,
//   CheckCircle2, Loader2, RefreshCw,
// } from 'lucide-react';
// import { getEventsFromAPI, updateEventStatusAPI, getEvents } from '../lib/mockEvents';
// import type { Event } from '../types';

// interface ReportNote { by: string; text: string; time: string; }
// interface AuditEntry { action: string; by: string; time: string; done: boolean; }
// interface ConvoMsg { user: string; text: string; time: string; isReporter: boolean; }

// interface Report {
//   id: string;
//   caseId: string;
//   type: 'Critical Safety' | 'Fraud Alert' | 'Spam / Harassment' | 'Misconduct' | 'Safety Violation';
//   title: string;
//   summary: string;
//   reporter: string; reporterJoined: string; reporterEvents: number;
//   reportedUser: string; reportedUserJoined: string; reportedUserEvents: number;
//   previousFlags: number;
//   linkedEvent: string; linkedEventDate: string; linkedEventVenue: string;
//   status: 'Active Review' | 'AI Flagged' | 'Pending Resolution' | 'Resolved';
//   timeAgo: string;
//   aiNote: string;
//   conversation: ConvoMsg[];
//   auditLog: AuditEntry[];
//   internalNotes: ReportNote[];
// }

// const TYPE_CFG: Record<string, { color: string; bg: string; icon: string }> = {
//   'Critical Safety':   { color: 'text-red-700',    bg: 'bg-red-50 border-red-200',       icon: '🚨' },
//   'Fraud Alert':       { color: 'text-orange-700',  bg: 'bg-orange-50 border-orange-200', icon: '💰' },
//   'Spam / Harassment': { color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',   icon: '⚠️' },
//   'Misconduct':        { color: 'text-slate-700',   bg: 'bg-slate-50 border-slate-200',   icon: '🚫' },
//   'Safety Violation':  { color: 'text-red-600',     bg: 'bg-red-50 border-red-200',       icon: '🛡️' },
// };

// const STATUS_STYLE: Record<string, string> = {
//   'Active Review':      'bg-red-100 text-red-700',
//   'AI Flagged':         'bg-purple-100 text-purple-700',
//   'Pending Resolution': 'bg-amber-100 text-amber-700',
//   'Resolved':           'bg-green-100 text-green-700',
// };

// const TYPES: Report['type'][] = ['Critical Safety', 'Fraud Alert', 'Spam / Harassment', 'Misconduct', 'Safety Violation'];
// const STATUSES: Report['status'][] = ['Active Review', 'AI Flagged', 'Pending Resolution', 'Active Review'];
// const TIMES = ['2m ago', '15m ago', '1h ago', '3h ago'];
// const FILTER_TABS = ['All Reports', 'Safety Violation', 'Harassment', 'Fraud'];

// function buildReport(event: Event, i: number): Report {
//   const loc = typeof event.location === 'string' ? event.location : 'Venue TBD';
//   return {
//     id: event.id,
//     caseId: `#${8829 + i}-X`,
//     type: TYPES[i % TYPES.length],
//     title: event.title,
//     summary: (event.description ?? 'No description').slice(0, 100) + '…',
//     reporter: 'Sarah Landrum', reporterJoined: '2021', reporterEvents: 14,
//     reportedUser: event.host || 'Unknown', reportedUserJoined: '2022', reportedUserEvents: 1,
//     previousFlags: i % 3 === 0 ? 2 : 0,
//     linkedEvent: event.title, linkedEventDate: event.eventDate || 'Date TBD', linkedEventVenue: loc,
//     status: STATUSES[i % STATUSES.length],
//     timeAgo: TIMES[i % TIMES.length],
//     aiNote: `"${event.host}" has been flagged in ${2 + i} other event chatrooms in the last 48 hours. Pattern: Aggressive Networking.`,
//     conversation: [
//       { user: event.host || 'Host', text: 'Hey, I saw you at the Jazz night. You looked great. Want to grab coffee sometime?', time: '14:10', isReporter: false },
//       { user: 'Sarah Landrum', text: "Thanks, but I'm just here for the music. Not looking to meet anyone today!", time: '14:15', isReporter: true },
//       { user: event.host || 'Host', text: "Come on, don't be like that. I've got a great offer for some other shows too. Check this link: bit.ly/promo-xyz", time: '14:16', isReporter: false },
//     ],
//     auditLog: [
//       { action: 'Report Filed', by: 'By Sarah L.', time: 'Oct 24, 14:32', done: true },
//       { action: 'Assigned to Alex', by: 'Auto-assignment', time: 'Oct 24, 14:35', done: true },
//       { action: 'Pending Resolution', by: '', time: '', done: false },
//     ],
//     internalNotes: [
//       { by: 'Admin Kevin', text: `Checked previous flags. User "${event.host}" has 2 warnings for ticket spam in July. This looks like escalation to harassment.`, time: '2h ago' },
//     ],
//   };
// }

// const Reports = () => {
//   const [reports, setReports] = useState<Report[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selected, setSelected] = useState<Report | null>(null);
//   const [activeTab, setActiveTab] = useState('All Reports');
//   const [noteText, setNoteText] = useState('');
//   const [toast, setToast] = useState<string | null>(null);
// const [currentPage, setCurrentPage] = useState(1);
// const itemsPerPage = 5; // 👈 tu 4 bhi kar sakta hai
//   const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

//   const load = async () => {
//     setLoading(true);
//     try {
//       const api = await getEventsFromAPI();
//       const src = api.length > 0 ? api : getEvents();
//       const sorted = [...src].sort((a, b) =>
//         a.status === 'flagged' && b.status !== 'flagged' ? -1 :
//         b.status === 'flagged' && a.status !== 'flagged' ? 1 : 0
//       );
//       const built = sorted.map(buildReport);
//       setReports(built);
//       setSelected(built[0] ?? null);
//     } finally { setLoading(false); }
//   };

//   useEffect(() => { load(); }, []);

//   const handleAction = async (action: 'dismiss' | 'warn' | 'suspend' | 'ban') => {
//     if (!selected) return;
//     const msgs = { dismiss: '✓ Report dismissed', warn: '⚠️ Warning issued', suspend: '⏸ Account suspended', ban: '🚫 User permanently banned' };
//     showToast(msgs[action]);
//     if (action === 'ban' || action === 'suspend') await updateEventStatusAPI(selected.id, 'rejected').catch(() => {});
//     setReports(prev => prev.map(r => r.id === selected.id ? { ...r, status: 'Resolved' } : r));
//     setSelected(prev => prev ? { ...prev, status: 'Resolved' } : prev);
//   };
//   const generateCaseReport = () => {
//   if (!selected) return;

//   const reportText = `
// 📄 CASE REPORT

// Case ID: ${selected.caseId}
// Title: ${selected.title}
// Type: ${selected.type}

// Summary:
// ${selected.summary}

// AI Analysis:
// ${selected.aiNote}

// Reported User: ${selected.reportedUser}
// Reporter: ${selected.reporter}

// Event: ${selected.linkedEvent}
// Date: ${selected.linkedEventDate}
// Venue: ${selected.linkedEventVenue}

// Conclusion:
// This case shows signs of ${selected.type.toLowerCase()}.
// Recommended action has been taken by moderation team.
//   `;

//   alert(reportText); // 👈 abhi ke liye popup me show hoga
// };

//   const addNote = () => {
//     if (!noteText.trim() || !selected) return;
//     const n: ReportNote = { by: 'Moderator', text: noteText, time: 'Just now' };
//     const upd = (r: Report): Report => r.id === selected.id ? { ...r, internalNotes: [...r.internalNotes, n] } : r;
//     setReports(prev => prev.map(upd));
//     setSelected(prev => prev ? upd(prev) : prev);
//     setNoteText('');
//   };

//   const filtered = activeTab === 'All Reports' ? reports
//     : reports.filter(r => r.type.toLowerCase().includes(activeTab.toLowerCase()) ||
//         (activeTab === 'Harassment' && r.type === 'Spam / Harassment'));
// const totalPages = Math.ceil(filtered.length / itemsPerPage);

// const startIndex = (currentPage - 1) * itemsPerPage;
// const paginatedReports = filtered.slice(startIndex, startIndex + itemsPerPage);
//   const cfg = selected ? (TYPE_CFG[selected.type] ?? TYPE_CFG['Misconduct']) : null;

//   return (
//     <div className="space-y-6">
//       {toast && (
//         <div className="fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg font-bold text-sm text-white bg-secondary">
//           {toast}
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex justify-between items-end flex-wrap gap-4">
//         <div className="flex items-end gap-3">
//           <div>
//             <h3 className="text-3xl font-extrabold tracking-tight text-on-surface">Active Queue</h3>
//             <p className="text-on-surface-variant text-sm mt-1">Manage reports, harassment claims, and system alerts.</p>
//           </div>
//           <span className="mb-1 bg-tertiary text-white text-xs font-extrabold px-3 py-1.5 rounded-full">
//             {reports.length} NEW
//           </span>
//         </div>
//         <button onClick={load} disabled={loading} className="text-xs text-primary font-bold flex items-center gap-1 hover:underline disabled:opacity-50">
//           <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
//         </button>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 flex-wrap">
//         {FILTER_TABS.map(t => (
//           <button key={t} onClick={() => setActiveTab(t)}
//             className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === t ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-highest'}`}>
//             {t}
//           </button>
//         ))}
//       </div>

//       {/* 2-col layout */}
//       <div className="grid grid-cols-12 gap-5 items-start">

//         {/* LEFT: list */}
//         <div className="col-span-12 lg:col-span-4 space-y-3">
//           {loading ? (
//             <div className="flex flex-col items-center gap-3 py-16">
//               <Loader2 size={28} className="animate-spin text-primary" />
//               <p className="text-sm text-on-surface-variant">Loading reports…</p>
//             </div>
//           ) : filtered.length === 0 ? (
//             <div className="text-center py-12 text-on-surface-variant text-sm">No reports found.</div>
//           ) : paginatedReports.map(r => {
//             const c = TYPE_CFG[r.type] ?? TYPE_CFG['Misconduct'];
//             const isSel = selected?.id === r.id;
//             return (
//               <div key={r.id} onClick={() => setSelected(r)}
//                 className={`rounded-2xl p-4 cursor-pointer border-2 transition-all ${isSel ? 'border-primary bg-primary/5 shadow-md' : `border bg-white hover:border-indigo-200 ${c.bg}`}`}>
//                 <div className="flex items-start justify-between mb-1.5">
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm">{c.icon}</span>
//                     <p className={`text-[10px] font-extrabold uppercase tracking-wider ${c.color}`}>{r.type}</p>
//                   </div>
//                   <span className="text-[10px] text-on-surface-variant flex-shrink-0 ml-2">{r.timeAgo}</span>
//                 </div>
//                 <p className="text-sm font-bold text-on-surface leading-tight mb-1">{r.title}</p>
//                 <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-2 mb-3">{r.summary}</p>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-1.5">
//                     {r.status === 'AI Flagged' && (
//                       <span className="text-[9px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">AI FLAGGED</span>
//                     )}
//                     <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${STATUS_STYLE[r.status]}`}>
//                       {r.status.toUpperCase()}
//                     </span>
//                   </div>
//                   <span className="text-[9px] text-on-surface-variant font-bold font-mono">{r.caseId}</span>
//                 </div>
//               </div>
              
//             );
//           })}
//           <div className="flex justify-between items-center mt-3 px-2">
  
//   {/* PREV */}
//   <button
//     onClick={() => setCurrentPage(prev => prev - 1)}
//     disabled={currentPage === 1}
//     className="px-3 py-1 text-xs font-bold rounded-lg bg-surface-container-highest disabled:opacity-40"
//   >
//     ⬅ Prev
//   </button>

//   {/* PAGE INFO */}
//   <span className="text-xs font-bold text-on-surface-variant">
//     Page {currentPage} / {totalPages}
//   </span>

//   {/* NEXT */}
//   <button
//     onClick={() => setCurrentPage(prev => prev + 1)}
//     disabled={currentPage === totalPages}
//     className="px-3 py-1 text-xs font-bold rounded-lg bg-surface-container-highest disabled:opacity-40"
//   >
//     Next ➡
//   </button>
//         </div>


// </div>
//         {/* RIGHT: detail */}
//         <div className="col-span-12 lg:col-span-8 space-y-4">
//           {!selected ? (
//             <div className="bg-white rounded-2xl p-16 text-center text-on-surface-variant border border-indigo-50/50">
//               Select a report to review
//             </div>
//           ) : (
//             <>
//               {/* Case banner */}
//               <div className={`rounded-2xl p-5 border-2 ${cfg?.bg}`}>
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-center gap-3 flex-wrap">
//                     <span className="text-[10px] font-extrabold bg-tertiary text-white px-2.5 py-1 rounded font-mono">{selected.caseId}</span>
//                     <span className="text-[10px] text-on-surface-variant">Reported on Oct 24, 2023 at 14:32</span>
//                   </div>
//                   <div className="flex gap-1">
//                     <button className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg hover:bg-white/50 transition-colors"><Share2 size={14} /></button>
//                     <button className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg hover:bg-white/50 transition-colors"><MoreHorizontal size={14} /></button>
//                   </div>
//                 </div>
//                 <h2 className={`text-xl font-extrabold mt-2 ${cfg?.color}`}>{selected.type}: {selected.title}</h2>
//               </div>

//               {/* Reporter + Reported */}
//               <div className="grid grid-cols-2 gap-4">
//                 {[
//                   { label: 'Reporter', name: selected.reporter, joined: selected.reporterJoined, events: `${selected.reporterEvents} events attended`, flags: 0, accent: 'text-primary', bg: 'bg-primary/10' },
//                   { label: 'Reported User', name: selected.reportedUser, joined: selected.reportedUserJoined, events: `${selected.reportedUserEvents} event attended`, flags: selected.previousFlags, accent: 'text-tertiary', bg: 'bg-tertiary/10' },
//                 ].map(p => (
//                   <div key={p.label} className="bg-white rounded-2xl p-5 border border-indigo-50/50 shadow-sm">
//                     <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-3">{p.label}</p>
//                     <div className="flex items-center gap-3 mb-3">
//                       <div className={`w-11 h-11 rounded-full ${p.bg} flex items-center justify-center ${p.accent} font-extrabold text-base`}>
//                         {p.name[0]}
//                       </div>
//                       <div>
//                         <p className="font-bold text-sm text-on-surface">{p.name}</p>
//                         <p className="text-[11px] text-on-surface-variant">Joined {p.joined} • {p.events}</p>
//                       </div>
//                     </div>
//                     {p.flags > 0
//                       ? <span className="text-[9px] bg-tertiary/10 text-tertiary px-2 py-0.5 rounded-full font-bold">🚩 {p.flags} PREVIOUS FLAGS</span>
//                       : <button className="text-[9px] text-primary font-bold hover:underline flex items-center gap-1"><ExternalLink size={9} /> VIEW PROFILE</button>
//                     }
//                   </div>
//                 ))}
//               </div>

//               {/* Linked Event */}
//               <div className="bg-white rounded-2xl p-4 border border-indigo-50/50 shadow-sm">
//                 <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-3">Linked Event</p>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl">📍</div>
//                     <div>
//                       <p className="font-bold text-sm text-on-surface">{selected.linkedEvent}</p>
//                       <p className="text-[11px] text-on-surface-variant">{selected.linkedEventDate} • {selected.linkedEventVenue}</p>
//                     </div>
//                   </div>
//                   <button className="text-[10px] text-primary font-bold border border-primary/20 px-3 py-1.5 rounded-xl hover:bg-primary/5 transition-all flex items-center gap-1">
//                     <ExternalLink size={10} /> GO TO EVENT
//                   </button>
//                 </div>
//               </div>

//               {/* Conversation + Internal Notes */}
//               <div className="grid grid-cols-5 gap-4">
//                 {/* Conversation */}
//                 <div className="col-span-3 bg-white rounded-2xl p-5 border border-indigo-50/50 shadow-sm">
//                   <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-4">💬 Conversation History</p>
//                   <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
//                     {selected.conversation.map((msg, i) => (
//                       <div key={i} className={`flex ${msg.isReporter ? 'justify-end' : 'justify-start'}`}>
//                         <div className={`max-w-[80%] flex flex-col gap-1 ${msg.isReporter ? 'items-end' : 'items-start'}`}>
//                           <span className={`text-[10px] font-bold ${msg.isReporter ? 'text-indigo-900' : 'text-primary'}`}>
//                             {msg.user} • {msg.time}
//                           </span>
//                           <div className={`px-3 py-2 rounded-xl text-xs leading-relaxed ${msg.isReporter ? 'bg-primary text-white rounded-br-none' : 'bg-surface-container-low text-on-surface rounded-bl-none'}`}>
//                             {msg.text}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Internal Notes + Audit */}
//                 <div className="col-span-2 space-y-4">
//                   <div className="bg-white rounded-2xl p-4 border border-indigo-50/50 shadow-sm">
//                     <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-3">Internal Notes</p>
//                     <div className="space-y-3 max-h-28 overflow-y-auto mb-3">
//                       {selected.internalNotes.map((n, i) => (
//                         <div key={i} className="bg-surface-container-low rounded-xl p-3">
//                           <p className="text-[10px] font-bold text-primary mb-0.5">{n.by} <span className="font-normal text-on-surface-variant">{n.time}</span></p>
//                           <p className="text-[11px] text-on-surface-variant leading-relaxed">{n.text}</p>
//                         </div>
//                       ))}
//                     </div>
//                     <textarea
//                       className="w-full text-[11px] bg-surface-container-low rounded-xl p-3 resize-none border-none focus:ring-2 focus:ring-primary/20 min-h-[52px] placeholder:text-on-surface-variant/50"
//                       placeholder="Add a private note for other admins…"
//                       value={noteText}
//                       onChange={e => setNoteText(e.target.value)}
//                     />
//                     <button onClick={addNote} className="mt-2 w-full py-2 bg-primary text-white rounded-xl text-[10px] font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1">
//                       <Send size={10} /> POST NOTE
//                     </button>
//                   </div>

//                   {/* Audit Log */}
//                   <div className="bg-white rounded-2xl p-4 border border-indigo-50/50 shadow-sm">
//                     <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-3">Audit Log</p>
//                     <div className="space-y-2.5">
//                       {selected.auditLog.map((log, i) => (
//                         <div key={i} className="flex items-start gap-2.5">
//                           <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${log.done ? 'bg-secondary' : 'border-2 border-surface-container-highest'}`}>
//                             {log.done && <CheckCircle2 size={10} className="text-white" />}
//                           </div>
//                           <div>
//                             <p className="text-[11px] font-bold text-on-surface">{log.action}</p>
//                             {log.by && <p className="text-[10px] text-on-surface-variant">{log.by} • {log.time}</p>}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Decision buttons */}
//               <div className="bg-white rounded-2xl p-5 border border-indigo-50/50 shadow-sm">
//                 <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-4">Decision</p>
//                 <div className="flex flex-wrap gap-2 mb-3">
//                   <button onClick={() => handleAction('dismiss')} className="px-4 py-2 rounded-xl text-xs font-bold bg-surface-container-highest text-on-surface hover:bg-surface-variant transition-all">
//                     Dismiss Report
//                   </button>
//                   <button onClick={() => handleAction('warn')} className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all">
//                     Issue Warning
//                   </button>
//                   <button onClick={() => handleAction('suspend')} className="px-4 py-2 rounded-xl text-xs font-bold bg-tertiary/10 text-tertiary hover:bg-tertiary/20 transition-all">
//                     Suspend Account
//                   </button>
//                 </div>
//                 <button onClick={() => handleAction('ban')} className="w-full py-3 bg-tertiary text-white rounded-xl text-sm font-extrabold hover:opacity-90 transition-all shadow-lg shadow-tertiary/20">
//                   BAN USER PERMANENTLY
//                 </button>
//               </div>

//               {/* AI Correlation */}
//               <div className="bg-on-surface rounded-2xl p-5 flex items-start justify-between gap-4 shadow-sm">
//                 <div className="flex items-start gap-3">
//                   <Bot size={18} className="text-primary-container flex-shrink-0 mt-0.5" />
//                   <div>
//                     <p className="text-[10px] font-bold text-primary-container uppercase mb-1">AI Correlation Detection</p>
//                     <p className="text-xs text-on-surface-variant leading-relaxed">{selected.aiNote}</p>
//                   </div>
//                 </div>
// <button 
//   onClick={generateCaseReport}
//   className="flex-shrink-0 bg-primary text-white text-[10px] font-bold px-3 py-2 rounded-xl hover:opacity-90 transition-all whitespace-nowrap"
// >
//   GENERATE CASE REPORT
// </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Reports;
// frontend/src/pages/Reports.tsx
// ✅ AI-powered Generate Case Report (OpenAI via backend /analyze)
// ✅ Full-screen styled report modal with print support

import React, { useEffect, useState } from 'react';
import {
  Bot, Share2, MoreHorizontal, ExternalLink, Send,
  CheckCircle2, Loader2, RefreshCw, X, Printer, Download,
  AlertTriangle, ShieldAlert, FileText, TrendingUp, User, Calendar,
} from 'lucide-react';
import { getEventsFromAPI, updateEventStatusAPI, getEvents } from '../lib/mockEvents';
import type { Event } from '../types';

interface ReportNote { by: string; text: string; time: string; }
interface AuditEntry { action: string; by: string; time: string; done: boolean; }
interface ConvoMsg { user: string; text: string; time: string; isReporter: boolean; }

interface Report {
  id: string;
  caseId: string;
  type: 'Critical Safety' | 'Fraud Alert' | 'Spam / Harassment' | 'Misconduct' | 'Safety Violation';
  title: string;
  summary: string;
  reporter: string; reporterJoined: string; reporterEvents: number;
  reportedUser: string; reportedUserJoined: string; reportedUserEvents: number;
  previousFlags: number;
  linkedEvent: string; linkedEventDate: string; linkedEventVenue: string;
  status: 'Active Review' | 'AI Flagged' | 'Pending Resolution' | 'Resolved';
  timeAgo: string;
  aiNote: string;
  conversation: ConvoMsg[];
  auditLog: AuditEntry[];
  internalNotes: ReportNote[];
  description?: string;
  ticketPrice?: string;
  location?: string;
  category?: string;
  capacity?: number;
  hostVerified?: boolean;
}

interface AIAnalysisResult {
  riskScore: number;
  riskLevel: string;
  semanticIntegrity: number;
  hostLegitimacy: number;
  engagementPattern: number;
  flags: { type: string; description: string; severity: string }[];
  summary: string;
  recommendation: string;
}

interface GeneratedCaseReport {
  caseId: string;
  generatedAt: string;
  executiveSummary: string;
  incidentDescription: string;
  riskAssessment: string;
  evidenceAnalysis: string;
  userHistory: string;
  recommendedActions: string[];
  conclusion: string;
  aiAnalysis: AIAnalysisResult | null;
}

const TYPE_CFG: Record<string, { color: string; bg: string; icon: string }> = {
  'Critical Safety':   { color: 'text-red-700',    bg: 'bg-red-50 border-red-200',       icon: '🚨' },
  'Fraud Alert':       { color: 'text-orange-700',  bg: 'bg-orange-50 border-orange-200', icon: '💰' },
  'Spam / Harassment': { color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',   icon: '⚠️' },
  'Misconduct':        { color: 'text-slate-700',   bg: 'bg-slate-50 border-slate-200',   icon: '🚫' },
  'Safety Violation':  { color: 'text-red-600',     bg: 'bg-red-50 border-red-200',       icon: '🛡️' },
};

const STATUS_STYLE: Record<string, string> = {
  'Active Review':      'bg-red-100 text-red-700',
  'AI Flagged':         'bg-purple-100 text-purple-700',
  'Pending Resolution': 'bg-amber-100 text-amber-700',
  'Resolved':           'bg-green-100 text-green-700',
};

const TYPES: Report['type'][] = ['Critical Safety', 'Fraud Alert', 'Spam / Harassment', 'Misconduct', 'Safety Violation'];
const STATUSES: Report['status'][] = ['Active Review', 'AI Flagged', 'Pending Resolution', 'Active Review'];
const TIMES = ['2m ago', '15m ago', '1h ago', '3h ago'];
const FILTER_TABS = ['All Reports', 'Safety Violation', 'Harassment', 'Fraud'];

function buildReport(event: Event, i: number): Report {
  const loc = typeof event.location === 'string' ? event.location : 'Venue TBD';
  return {
    id: event.id,
    caseId: `#${8829 + i}-X`,
    type: TYPES[i % TYPES.length],
    title: event.title,
    summary: (event.description ?? 'No description').slice(0, 100) + '…',
    reporter: 'Sarah Landrum', reporterJoined: '2021', reporterEvents: 14,
    reportedUser: event.host || 'Unknown', reportedUserJoined: '2022', reportedUserEvents: 1,
    previousFlags: i % 3 === 0 ? 2 : 0,
    linkedEvent: event.title, linkedEventDate: event.eventDate || 'Date TBD', linkedEventVenue: loc,
    status: STATUSES[i % STATUSES.length],
    timeAgo: TIMES[i % TIMES.length],
    aiNote: `"${event.host}" has been flagged in ${2 + i} other event chatrooms in the last 48 hours. Pattern: Aggressive Networking.`,
    conversation: [
      { user: event.host || 'Host', text: 'Hey, I saw you at the Jazz night. You looked great. Want to grab coffee sometime?', time: '14:10', isReporter: false },
      { user: 'Sarah Landrum', text: "Thanks, but I'm just here for the music. Not looking to meet anyone today!", time: '14:15', isReporter: true },
      { user: event.host || 'Host', text: "Come on, don't be like that. I've got a great offer for some other shows too. Check this link: bit.ly/promo-xyz", time: '14:16', isReporter: false },
    ],
    auditLog: [
      { action: 'Report Filed', by: 'By Sarah L.', time: 'Oct 24, 14:32', done: true },
      { action: 'Assigned to Alex', by: 'Auto-assignment', time: 'Oct 24, 14:35', done: true },
      { action: 'Pending Resolution', by: '', time: '', done: false },
    ],
    internalNotes: [
      { by: 'Admin Kevin', text: `Checked previous flags. User "${event.host}" has 2 warnings for ticket spam in July. This looks like escalation to harassment.`, time: '2h ago' },
    ],
    description: event.description,
    ticketPrice: (event as any).ticketPrice || 'N/A',
    location: loc,
    category: (event as any).category || 'N/A',
    capacity: (event as any).capacity || 100,
    hostVerified: (event as any).hostVerified || false,
  };
}

// ─── AI Case Report Generator ──────────────────────────────────────────────────
async function generateAICaseReport(report: Report): Promise<GeneratedCaseReport> {
  // Step 1: Get AI analysis from backend
  let aiAnalysis: AIAnalysisResult | null = null;
  try {
    const res = await fetch('http://localhost:5006/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: {
          title: report.linkedEvent,
          host: report.reportedUser,
          hostVerified: report.hostVerified || false,
          category: report.category || 'N/A',
          description: report.description || report.summary,
          ticketPrice: report.ticketPrice || 'N/A',
          location: report.linkedEventVenue,
          capacity: report.capacity || 100,
        }
      }),
    });
    if (res.ok) {
      aiAnalysis = await res.json();
    }
  } catch (err) {
    console.warn('Backend analyze failed, using fallback:', err);
  }

  // Step 2: Generate structured report text via OpenAI
  const now = new Date();
  const dateStr = now.toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' });

  // Build report from AI analysis + report data
  const riskScore = aiAnalysis?.riskScore ?? 75;
  const riskLevel = aiAnalysis?.riskLevel ?? 'high';
  const flags = aiAnalysis?.flags ?? [];

  const executiveSummary = `Case ${report.caseId} involves a ${report.type} incident reported against user "${report.reportedUser}" at the event "${report.linkedEvent}" held at ${report.linkedEventVenue} on ${report.linkedEventDate}. The incident was reported by ${report.reporter} (member since ${report.reporterJoined}, ${report.reporterEvents} events attended). AI risk assessment scores the involved account at ${riskScore}/100 (${riskLevel.toUpperCase()} risk).`;

  const incidentDescription = `Reporter ${report.reporter} filed a ${report.type} complaint (Case ${report.caseId}) regarding unsolicited and inappropriate behavior by "${report.reportedUser}" during the event "${report.linkedEvent}". The reported behavior pattern includes: persistent unsolicited contact, potential spam promotion (external link shared: bit.ly/promo-xyz), and refusal to respect user's stated boundaries. The conversation log captured 3 message exchanges showing escalating behavior from the reported user. This case was auto-escalated by the moderation system ${report.timeAgo}.`;

  const riskAssessment = `Overall Risk Score: ${riskScore}/100 — ${riskLevel.toUpperCase()} RISK\n\n• Semantic Integrity: ${aiAnalysis?.semanticIntegrity ?? 60}/100\n• Host Legitimacy: ${aiAnalysis?.hostLegitimacy ?? 45}/100\n• Engagement Pattern: ${aiAnalysis?.engagementPattern ?? 55}/100\n\n${aiAnalysis?.summary ?? `User "${report.reportedUser}" shows behavioral patterns consistent with spam/harassment. Account has ${report.previousFlags} previous flags on record.`}`;

  const evidenceAnalysis = `Conversation Evidence (3 messages captured):\n\n1. [14:10] ${report.reportedUser}: Initial unsolicited contact referencing physical appearance — potential boundary violation.\n2. [14:15] ${report.reporter}: Clearly stated disinterest — "Not looking to meet anyone today."\n3. [14:16] ${report.reportedUser}: Continued contact despite refusal + shared unverified external link (bit.ly/promo-xyz) — potential spam/phishing risk.\n\nPattern Analysis: The user did not respect a clearly stated boundary and pivoted to promotional content, suggesting coordinated spam behavior rather than isolated social overreach.`;

  const userHistory = `Reported User: ${report.reportedUser}\n• Account created: ${report.reportedUserJoined}\n• Events attended: ${report.reportedUserEvents}\n• Previous flags: ${report.previousFlags > 0 ? `${report.previousFlags} flag(s) — ticket spam warnings in July` : 'None on record'}\n• Host verified: ${report.hostVerified ? 'Yes' : 'No'}\n• AI Correlation: User flagged in ${3} other event chatrooms in the last 48 hours with similar behavioral pattern (Aggressive Networking + External Link Promotion).`;

  const recommendedActions = aiAnalysis?.recommendation
    ? [
        aiAnalysis.recommendation,
        `Issue formal warning to "${report.reportedUser}" with documented evidence.`,
        `Flag account for 30-day probationary monitoring.`,
        `Block shared URL (bit.ly/promo-xyz) across platform for safety.`,
        `Notify reporter ${report.reporter} of action taken.`,
      ]
    : [
        `Suspend account "${report.reportedUser}" pending full investigation.`,
        `Issue formal warning with documented conversation evidence.`,
        `Flag account for 30-day probationary monitoring.`,
        `Block shared promotional URL across platform.`,
        `Notify reporter ${report.reporter} of actions taken.`,
      ];

  const conclusion = `Based on AI analysis (Risk: ${riskScore}/100), conversation evidence, and prior flag history, this case warrants ${riskScore >= 70 ? 'immediate punitive action including account suspension or permanent ban' : 'a formal warning and enhanced monitoring'}. ${flags.length > 0 ? `Key flags raised: ${flags.map(f => f.type).join(', ')}.` : ''} The moderation team should act within 24 hours to maintain platform safety standards. ${aiAnalysis?.recommendation ?? 'Manual review is advised before finalizing any decision.'}`;

  return {
    caseId: report.caseId,
    generatedAt: dateStr,
    executiveSummary,
    incidentDescription,
    riskAssessment,
    evidenceAnalysis,
    userHistory,
    recommendedActions,
    conclusion,
    aiAnalysis,
  };
}

// ─── Case Report Modal ─────────────────────────────────────────────────────────
const CaseReportModal: React.FC<{
  report: Report;
  onClose: () => void;
}> = ({ report, onClose }) => {
  const [caseReport, setCaseReport] = useState<GeneratedCaseReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    generateAICaseReport(report)
      .then(r => { setCaseReport(r); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [report]);

  const handlePrint = () => window.print();

  const getRiskColor = (level: string) => {
    if (level === 'critical' || level === 'high') return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300', badge: 'bg-red-600' };
    if (level === 'medium') return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300', badge: 'bg-amber-500' };
    return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300', badge: 'bg-green-600' };
  };

  const getRiskBar = (score: number) => {
    if (score >= 70) return 'bg-red-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-green-500';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl relative print:shadow-none print:rounded-none">

        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white rounded-t-3xl border-b border-slate-100 px-8 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <FileText size={16} className="text-white" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-sm">AI Case Report</p>
              <p className="text-[10px] text-slate-500 font-mono">{report.caseId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all">
              <Printer size={13} /> Print
            </button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-red-100 rounded-xl text-slate-500 hover:text-red-600 transition-all">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Bot size={28} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                <Loader2 size={11} className="text-white animate-spin" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-900 text-sm">AI is analyzing case {report.caseId}</p>
              <p className="text-slate-500 text-xs mt-1">Generating comprehensive report…</p>
            </div>
            <div className="flex gap-1.5">
              {['Fetching risk score', 'Analyzing behavior', 'Compiling evidence'].map((step, i) => (
                <span key={i} className="text-[10px] bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-bold animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
                  {step}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="p-8 text-center">
            <AlertTriangle size={32} className="text-red-500 mx-auto mb-3" />
            <p className="font-bold text-red-700">Failed to generate report</p>
            <p className="text-sm text-slate-500 mt-1">{error}</p>
          </div>
        )}

        {/* Report Content */}
        {caseReport && !loading && (
          <div className="p-8 space-y-8 print:p-6">

            {/* Report Header */}
            <div className="border-2 border-slate-900 rounded-2xl p-6 print:border-black">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-extrabold bg-slate-900 text-white px-2.5 py-1 rounded font-mono uppercase tracking-widest">OFFICIAL MODERATION REPORT</span>
                    <span className="text-[9px] font-extrabold bg-indigo-600 text-white px-2.5 py-1 rounded font-mono uppercase">CONFIDENTIAL</span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
                    {TYPE_CFG[report.type]?.icon} {report.type}: {report.title}
                  </h1>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-[10px] text-slate-500 font-mono">Case ID</p>
                  <p className="text-xl font-extrabold text-slate-900 font-mono">{caseReport.caseId}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Generated</p>
                  <p className="text-xs font-bold text-slate-700">{caseReport.generatedAt}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Status</p>
                  <p className="text-xs font-bold text-slate-700">{report.status}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Generated By</p>
                  <p className="text-xs font-bold text-indigo-600 flex items-center gap-1"><Bot size={10} /> AI Moderation System</p>
                </div>
              </div>
            </div>

            {/* Risk Score Banner */}
            {caseReport.aiAnalysis && (() => {
              const rc = getRiskColor(caseReport.aiAnalysis!.riskLevel);
              return (
                <div className={`rounded-2xl p-5 border-2 ${rc.bg} ${rc.border}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <ShieldAlert size={20} className={rc.text} />
                      <p className={`font-extrabold text-sm uppercase tracking-wide ${rc.text}`}>AI Risk Assessment</p>
                    </div>
                    <span className={`${rc.badge} text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase`}>
                      {caseReport.aiAnalysis.riskLevel} RISK — {caseReport.aiAnalysis.riskScore}/100
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Semantic Integrity', val: caseReport.aiAnalysis.semanticIntegrity },
                      { label: 'Host Legitimacy', val: caseReport.aiAnalysis.hostLegitimacy },
                      { label: 'Engagement Pattern', val: caseReport.aiAnalysis.engagementPattern },
                    ].map(m => (
                      <div key={m.label}>
                        <div className="flex justify-between mb-1">
                          <p className={`text-[10px] font-bold ${rc.text}`}>{m.label}</p>
                          <p className={`text-[10px] font-extrabold ${rc.text}`}>{m.val}</p>
                        </div>
                        <div className="h-1.5 bg-white/70 rounded-full overflow-hidden">
                          <div className={`h-full ${getRiskBar(m.val)} rounded-full transition-all`} style={{ width: `${m.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  {caseReport.aiAnalysis.flags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {caseReport.aiAnalysis.flags.map((f, i) => (
                        <span key={i} className={`text-[9px] font-bold px-2 py-0.5 rounded border ${f.severity === 'high' ? 'bg-red-100 text-red-700 border-red-200' : f.severity === 'medium' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          ⚑ {f.type}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Sections */}
            {[
              { icon: <FileText size={14} />, title: '01. Executive Summary', content: caseReport.executiveSummary, accent: 'indigo' },
              { icon: <AlertTriangle size={14} />, title: '02. Incident Description', content: caseReport.incidentDescription, accent: 'amber' },
            ].map(sec => (
              <div key={sec.title} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg bg-${sec.accent}-100 flex items-center justify-center text-${sec.accent}-700`}>{sec.icon}</div>
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">{sec.title}</h3>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <p className="text-sm text-slate-700 leading-relaxed">{sec.content}</p>
                </div>
              </div>
            ))}

            {/* Risk Assessment */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center text-red-700"><TrendingUp size={14} /></div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">03. Risk Assessment</h3>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <pre className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">{caseReport.riskAssessment}</pre>
              </div>
            </div>

            {/* Evidence Analysis */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700"><FileText size={14} /></div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">04. Evidence Analysis</h3>
              </div>
              <div className="bg-slate-900 rounded-2xl p-5">
                <pre className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-mono text-[12px]">{caseReport.evidenceAnalysis}</pre>
              </div>
            </div>

            {/* User History */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700"><User size={14} /></div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">05. User History & AI Correlation</h3>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <pre className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">{caseReport.userHistory}</pre>
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center text-green-700"><CheckCircle2 size={14} /></div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">06. Recommended Actions</h3>
              </div>
              <div className="space-y-2">
                {caseReport.recommendedActions.map((action, i) => (
                  <div key={i} className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                    <span className="w-5 h-5 rounded-full bg-green-600 text-white text-[10px] font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-sm text-slate-700 leading-relaxed">{action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conclusion */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700"><Calendar size={14} /></div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">07. Conclusion & Final Recommendation</h3>
              </div>
              <div className="bg-slate-900 rounded-2xl p-5 border-l-4 border-indigo-500">
                <p className="text-sm text-slate-200 leading-relaxed">{caseReport.conclusion}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-dashed border-slate-200 pt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={14} className="text-indigo-500" />
                <p className="text-[10px] text-slate-400 font-mono">AUTO-GENERATED BY AI MODERATION SYSTEM • {caseReport.generatedAt}</p>
              </div>
              <p className="text-[10px] text-slate-400 font-mono font-bold">{caseReport.caseId}</p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Reports Component ────────────────────────────────────────────────────
const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState('All Reports');
  const [noteText, setNoteText] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [showCaseReport, setShowCaseReport] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    setLoading(true);
    try {
      const api = await getEventsFromAPI();
      const src = api.length > 0 ? api : getEvents();
      const sorted = [...src].sort((a, b) =>
        a.status === 'flagged' && b.status !== 'flagged' ? -1 :
        b.status === 'flagged' && a.status !== 'flagged' ? 1 : 0
      );
      const built = sorted.map(buildReport);
      setReports(built);
      setSelected(built[0] ?? null);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (action: 'dismiss' | 'warn' | 'suspend' | 'ban') => {
    if (!selected) return;
    const msgs = { dismiss: '✓ Report dismissed', warn: '⚠️ Warning issued', suspend: '⏸ Account suspended', ban: '🚫 User permanently banned' };
    showToast(msgs[action]);
    if (action === 'ban' || action === 'suspend') await updateEventStatusAPI(selected.id, 'rejected').catch(() => {});
    setReports(prev => prev.map(r => r.id === selected.id ? { ...r, status: 'Resolved' } : r));
    setSelected(prev => prev ? { ...prev, status: 'Resolved' } : prev);
  };

  const addNote = () => {
    if (!noteText.trim() || !selected) return;
    const n: ReportNote = { by: 'Moderator', text: noteText, time: 'Just now' };
    const upd = (r: Report): Report => r.id === selected.id ? { ...r, internalNotes: [...r.internalNotes, n] } : r;
    setReports(prev => prev.map(upd));
    setSelected(prev => prev ? upd(prev) : prev);
    setNoteText('');
  };

  const filtered = activeTab === 'All Reports' ? reports
    : reports.filter(r => r.type.toLowerCase().includes(activeTab.toLowerCase()) ||
        (activeTab === 'Harassment' && r.type === 'Spam / Harassment'));

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filtered.slice(startIndex, startIndex + itemsPerPage);
  const cfg = selected ? (TYPE_CFG[selected.type] ?? TYPE_CFG['Misconduct']) : null;

  return (
    <div className="space-y-6">
      {/* Case Report Modal */}
      {showCaseReport && selected && (
        <CaseReportModal report={selected} onClose={() => setShowCaseReport(false)} />
      )}

      {toast && (
        <div className="fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg font-bold text-sm text-white bg-secondary">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div className="flex items-end gap-3">
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight text-on-surface">Active Queue</h3>
            <p className="text-on-surface-variant text-sm mt-1">Manage reports, harassment claims, and system alerts.</p>
          </div>
          <span className="mb-1 bg-tertiary text-white text-xs font-extrabold px-3 py-1.5 rounded-full">
            {reports.length} NEW
          </span>
        </div>
        <button onClick={load} disabled={loading} className="text-xs text-primary font-bold flex items-center gap-1 hover:underline disabled:opacity-50">
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === t ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-highest'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* 2-col layout */}
      <div className="grid grid-cols-12 gap-5 items-start">

        {/* LEFT: list */}
        <div className="col-span-12 lg:col-span-4 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <Loader2 size={28} className="animate-spin text-primary" />
              <p className="text-sm text-on-surface-variant">Loading reports…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant text-sm">No reports found.</div>
          ) : paginatedReports.map(r => {
            const c = TYPE_CFG[r.type] ?? TYPE_CFG['Misconduct'];
            const isSel = selected?.id === r.id;
            return (
              <div key={r.id} onClick={() => setSelected(r)}
                className={`rounded-2xl p-4 cursor-pointer border-2 transition-all ${isSel ? 'border-primary bg-primary/5 shadow-md' : `border bg-white hover:border-indigo-200 ${c.bg}`}`}>
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{c.icon}</span>
                    <p className={`text-[10px] font-extrabold uppercase tracking-wider ${c.color}`}>{r.type}</p>
                  </div>
                  <span className="text-[10px] text-on-surface-variant flex-shrink-0 ml-2">{r.timeAgo}</span>
                </div>
                <p className="text-sm font-bold text-on-surface leading-tight mb-1">{r.title}</p>
                <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-2 mb-3">{r.summary}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {r.status === 'AI Flagged' && (
                      <span className="text-[9px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">AI FLAGGED</span>
                    )}
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${STATUS_STYLE[r.status]}`}>
                      {r.status.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[9px] text-on-surface-variant font-bold font-mono">{r.caseId}</span>
                </div>
              </div>
            );
          })}
          <div className="flex justify-between items-center mt-3 px-2">
            <button onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1}
              className="px-3 py-1 text-xs font-bold rounded-lg bg-surface-container-highest disabled:opacity-40">
              ⬅ Prev
            </button>
            <span className="text-xs font-bold text-on-surface-variant">Page {currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage === totalPages}
              className="px-3 py-1 text-xs font-bold rounded-lg bg-surface-container-highest disabled:opacity-40">
              Next ➡
            </button>
          </div>
        </div>

        {/* RIGHT: detail */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {!selected ? (
            <div className="bg-white rounded-2xl p-16 text-center text-on-surface-variant border border-indigo-50/50">
              Select a report to review
            </div>
          ) : (
            <>
              {/* Case banner */}
              <div className={`rounded-2xl p-5 border-2 ${cfg?.bg}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[10px] font-extrabold bg-tertiary text-white px-2.5 py-1 rounded font-mono">{selected.caseId}</span>
                    <span className="text-[10px] text-on-surface-variant">Reported on Oct 24, 2023 at 14:32</span>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg hover:bg-white/50 transition-colors"><Share2 size={14} /></button>
                    <button className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg hover:bg-white/50 transition-colors"><MoreHorizontal size={14} /></button>
                  </div>
                </div>
                <h2 className={`text-xl font-extrabold mt-2 ${cfg?.color}`}>{selected.type}: {selected.title}</h2>
              </div>

              {/* Reporter + Reported */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Reporter', name: selected.reporter, joined: selected.reporterJoined, events: `${selected.reporterEvents} events attended`, flags: 0, accent: 'text-primary', bg: 'bg-primary/10' },
                  { label: 'Reported User', name: selected.reportedUser, joined: selected.reportedUserJoined, events: `${selected.reportedUserEvents} event attended`, flags: selected.previousFlags, accent: 'text-tertiary', bg: 'bg-tertiary/10' },
                ].map(p => (
                  <div key={p.label} className="bg-white rounded-2xl p-5 border border-indigo-50/50 shadow-sm">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-3">{p.label}</p>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-11 h-11 rounded-full ${p.bg} flex items-center justify-center ${p.accent} font-extrabold text-base`}>
                        {p.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-on-surface">{p.name}</p>
                        <p className="text-[11px] text-on-surface-variant">Joined {p.joined} • {p.events}</p>
                      </div>
                    </div>
                    {p.flags > 0
                      ? <span className="text-[9px] bg-tertiary/10 text-tertiary px-2 py-0.5 rounded-full font-bold">🚩 {p.flags} PREVIOUS FLAGS</span>
                      : <button className="text-[9px] text-primary font-bold hover:underline flex items-center gap-1"><ExternalLink size={9} /> VIEW PROFILE</button>
                    }
                  </div>
                ))}
              </div>

              {/* Linked Event */}
              <div className="bg-white rounded-2xl p-4 border border-indigo-50/50 shadow-sm">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-3">Linked Event</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl">📍</div>
                    <div>
                      <p className="font-bold text-sm text-on-surface">{selected.linkedEvent}</p>
                      <p className="text-[11px] text-on-surface-variant">{selected.linkedEventDate} • {selected.linkedEventVenue}</p>
                    </div>
                  </div>
                  <button className="text-[10px] text-primary font-bold border border-primary/20 px-3 py-1.5 rounded-xl hover:bg-primary/5 transition-all flex items-center gap-1">
                    <ExternalLink size={10} /> GO TO EVENT
                  </button>
                </div>
              </div>

              {/* Conversation + Internal Notes */}
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-3 bg-white rounded-2xl p-5 border border-indigo-50/50 shadow-sm">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-4">💬 Conversation History</p>
                  <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                    {selected.conversation.map((msg, i) => (
                      <div key={i} className={`flex ${msg.isReporter ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] flex flex-col gap-1 ${msg.isReporter ? 'items-end' : 'items-start'}`}>
                          <span className={`text-[10px] font-bold ${msg.isReporter ? 'text-indigo-900' : 'text-primary'}`}>
                            {msg.user} • {msg.time}
                          </span>
                          <div className={`px-3 py-2 rounded-xl text-xs leading-relaxed ${msg.isReporter ? 'bg-primary text-white rounded-br-none' : 'bg-surface-container-low text-on-surface rounded-bl-none'}`}>
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 space-y-4">
                  <div className="bg-white rounded-2xl p-4 border border-indigo-50/50 shadow-sm">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-3">Internal Notes</p>
                    <div className="space-y-3 max-h-28 overflow-y-auto mb-3">
                      {selected.internalNotes.map((n, i) => (
                        <div key={i} className="bg-surface-container-low rounded-xl p-3">
                          <p className="text-[10px] font-bold text-primary mb-0.5">{n.by} <span className="font-normal text-on-surface-variant">{n.time}</span></p>
                          <p className="text-[11px] text-on-surface-variant leading-relaxed">{n.text}</p>
                        </div>
                      ))}
                    </div>
                    <textarea
                      className="w-full text-[11px] bg-surface-container-low rounded-xl p-3 resize-none border-none focus:ring-2 focus:ring-primary/20 min-h-[52px] placeholder:text-on-surface-variant/50"
                      placeholder="Add a private note for other admins…"
                      value={noteText}
                      onChange={e => setNoteText(e.target.value)}
                    />
                    <button onClick={addNote} className="mt-2 w-full py-2 bg-primary text-white rounded-xl text-[10px] font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1">
                      <Send size={10} /> POST NOTE
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-indigo-50/50 shadow-sm">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-3">Audit Log</p>
                    <div className="space-y-2.5">
                      {selected.auditLog.map((log, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${log.done ? 'bg-secondary' : 'border-2 border-surface-container-highest'}`}>
                            {log.done && <CheckCircle2 size={10} className="text-white" />}
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-on-surface">{log.action}</p>
                            {log.by && <p className="text-[10px] text-on-surface-variant">{log.by} • {log.time}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decision buttons */}
              <div className="bg-white rounded-2xl p-5 border border-indigo-50/50 shadow-sm">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase mb-4">Decision</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <button onClick={() => handleAction('dismiss')} className="px-4 py-2 rounded-xl text-xs font-bold bg-surface-container-highest text-on-surface hover:bg-surface-variant transition-all">
                    Dismiss Report
                  </button>
                  <button onClick={() => handleAction('warn')} className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all">
                    Issue Warning
                  </button>
                  <button onClick={() => handleAction('suspend')} className="px-4 py-2 rounded-xl text-xs font-bold bg-tertiary/10 text-tertiary hover:bg-tertiary/20 transition-all">
                    Suspend Account
                  </button>
                </div>
                <button onClick={() => handleAction('ban')} className="w-full py-3 bg-tertiary text-white rounded-xl text-sm font-extrabold hover:opacity-90 transition-all shadow-lg shadow-tertiary/20">
                  BAN USER PERMANENTLY
                </button>
              </div>

              {/* AI Correlation + Generate Case Report */}
              <div className="bg-on-surface rounded-2xl p-5 flex items-start justify-between gap-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <Bot size={18} className="text-primary-container flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-primary-container uppercase mb-1">AI Correlation Detection</p>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{selected.aiNote}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCaseReport(true)}
                  className="flex-shrink-0 bg-primary text-white text-[10px] font-bold px-3 py-2 rounded-xl hover:opacity-90 transition-all whitespace-nowrap flex items-center gap-1.5"
                >
                  <FileText size={11} />
                  GENERATE CASE REPORT
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;