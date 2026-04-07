// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import {
// //   Plus,
// //   Sparkles,
// //   CheckCircle2,
// //   XCircle,
// //   Undo2,
// //   Loader2,
// //   AlertTriangle,
// //   Shield,
// //   RefreshCw,
// //   Calendar,
// //   MapPin,
// //   Users,
// //   Tag,
// //   FileText,
// //   Image,
// //   ChevronRight,
// //   Bot,
// //   Send,
// //   X,
// // } from 'lucide-react';
// // import { addEvent } from '../lib/mockEvents';
// // import { getEvents } from '../lib/mockEvents';
// // import { analyzeEventWithGemini, getRiskColor, getRiskBarColor, getRiskLabel } from '../lib/gemini';
// // import type { Event, AIAnalysis } from '../types';

// // // ─── helpers ───────────────────────────────────────────────────────────────────


// // const generateId = () =>
// //   'EV-' + Math.floor(10000 + Math.random() * 90000);

// // const CATEGORIES = [
// //   'Music & Nightlife',
// //   'Technology',
// //   'Health & Wellness',
// //   'Business & Networking',
// //   'Educational Workshop',
// //   'Sports & Fitness',
// //   'Arts & Culture',
// //   'Food & Drink',
// //   'Community',
// //   'Other',
// // ];

// // const PLACEHOLDER_IMAGES = [
// //   'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
// //   'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600',
// //   'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
// //   'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600',
// //   'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600',
// // ];

// // // ─── Step indicator ────────────────────────────────────────────────────────────
// // const StepBadge = ({ step, current, label }: { step: number; current: number; label: string }) => {
// //   const done = current > step;
// //   const active = current === step;
// //   return (
// //     <div className="flex items-center gap-2">
// //       <div
// //         className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
// //           done
// //             ? 'bg-secondary text-white'
// //             : active
// //             ? 'bg-primary text-white shadow-md shadow-primary/30'
// //             : 'bg-surface-container-highest text-on-surface-variant'
// //         }`}
// //       >
// //         {done ? <CheckCircle2 size={16} /> : step}
// //       </div>
// //       <span
// //         className={`text-xs font-bold uppercase tracking-widest hidden sm:block ${
// //           active ? 'text-primary' : done ? 'text-secondary' : 'text-on-surface-variant'
// //         }`}
// //       >
// //         {label}
// //       </span>
// //     </div>
// //   );
// // };

// // // ─── Main component ─────────────────────────────────────────────────────────────
// // const CreateEvent = () => {
// // const navigate = useNavigate();
// //   const [step, setStep] = useState(1); // 1 = form, 2 = ai analysis, 3 = done
// //   const [isAnalyzing, setIsAnalyzing] = useState(false);
// //   const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
// //   const [note, setNote] = useState('');
// //   const [notes, setNotes] = useState<{ text: string; time: string }[]>([]);
// //   const [finalAction, setFinalAction] = useState<string | null>(null);
// //    const [events, setEvents] = useState(getEvents());
// //   const [form, setForm] = useState({
// //     title: '',
// //     host: '',
// //     hostVerified: false,
// //     category: '',
// //     eventDate: '',
// //     location: '',
// //     paymentType: '', // free | paid
// // ticketPrice: '',
// //     capacity: '',
// //     description: '',
// //     imageUrl: '',
// //   });

// //   const [errors, setErrors] = useState<Record<string, string>>({});

// //   const set = (k: string, v: string | boolean) =>
// //     setForm(prev => ({ ...prev, [k]: v }));

// //   // ── Validation ──
// //   const validate = () => {
// //     const e: Record<string, string> = {};
// //     if (!form.title.trim()) e.title = 'Event title is required';
// //     if (!form.host.trim()) e.host = 'Host name is required';
// //     if (!form.category) e.category = 'Please select a category';
// //     if (!form.eventDate) e.eventDate = 'Event date is required';
// //     if (!form.location.trim()) e.location = 'Location is required';
// //    if (!form.paymentType) e.paymentType = 'Select payment type';

// // if (form.paymentType === 'paid' && !form.ticketPrice.trim()) {
// //   e.ticketPrice = 'Enter ticket price for paid event';
// // }
// //     if (!form.capacity.trim() || isNaN(Number(form.capacity)))
// //       e.capacity = 'Valid capacity number required';
// //     if (!form.description.trim() || form.description.length < 30)
// //       e.description = 'Description must be at least 30 characters';
// //     setErrors(e);
// //     return Object.keys(e).length === 0;
// //   };

// //   // ── Build Event object ──
// //   const buildEvent = (): Partial<Event> => ({
// //     id: generateId(),
// //     title: form.title,
// //     host: form.host,
// //     hostVerified: form.hostVerified,
// //     image:
// //       form.imageUrl ||
// //       PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)],
// //     category: form.category,
// //     dateSubmitted: new Date().toISOString(),
// //     eventDate: form.eventDate,
// //     location: form.location,
// //    ticketPrice:
// //   form.paymentType === 'free'
// //     ? 'Free'
// //     : form.ticketPrice,
// //     capacity: Number(form.capacity),
// //     description: form.description,
// //     status: 'pending',
// //   });

// //   // ── Step 1 → 2: submit & analyze ──
// //   const handleAnalyze = async () => {
// //     if (!validate()) return;
// //     setStep(2);
// //     setIsAnalyzing(true);
// //     try {
// //       const result = await analyzeEventWithGemini(buildEvent());
// //       setAnalysis(result);
// //     } catch (err) {
// //       console.error(err);
// //     } finally {
// //       setIsAnalyzing(false);
// //     }
// //   };

// //   // ── Final actions ──
// //   const handleAction = (action: 'approve' | 'reject' | 'send_edits') => {

// //   // ✅ SAVE EVENT ONLY IF APPROVED
// //   if (action === 'approve') {
// //     addEvent(buildEvent() as Event);
// //   }

// //   const msgs: Record<string, string> = {
// //     approve: '✓ Event approved and queued for MyApp listing!',
// //     reject: '✗ Event rejected. Host will be notified.',
// //     send_edits: '↩ Sent back to organizer for edits.',
// //   };

// //   setFinalAction(msgs[action]);
// //   setStep(3);

// // setTimeout(() => navigate('/moderation'), 2500);};

// //   const addNote = () => {
// //     if (!note.trim()) return;
// //     setNotes(prev => [...prev, { text: note, time: 'Just now' }]);
// //     setNote('');
// //   };

// //   const built = buildEvent();

// //   // ─── RENDER ─────────────────────────────────────────────────────────────────
// //   return (
// //     <div className="space-y-8">

// //       {/* ── Success overlay ── */}
// //       {step === 3 && finalAction && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
// //           <div className="bg-white rounded-2xl p-10 shadow-2xl text-center max-w-sm">
// //             <CheckCircle2 size={52} className="text-secondary mx-auto mb-4" />
// //             <p className="font-extrabold text-lg leading-snug">{finalAction}</p>
// //             <p className="text-xs text-on-surface-variant mt-2">Redirecting to moderation queue…</p>
// //           </div>
// //         </div>
// //       )}

// //       {/* ── Header ── */}
// //       <div className="flex justify-between items-end">
// //         <div>
// //           <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 block">
// //             Event Submission
// //           </span>
// //           <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">
// //             Create & Submit Event
// //           </h2>
// //           <p className="text-on-surface-variant text-sm mt-1">
// //             Fill in the event details — AI will analyze before it goes live on MyApp.
// //           </p>
// //         </div>

// //         {/* Steps */}
// //         <div className="hidden sm:flex items-center gap-3">
// //           <StepBadge step={1} current={step} label="Details" />
// //           <ChevronRight size={14} className="text-on-surface-variant" />
// //           <StepBadge step={2} current={step} label="AI Review" />
// //           <ChevronRight size={14} className="text-on-surface-variant" />
// //           <StepBadge step={3} current={step} label="Action" />
// //         </div>
// //       </div>

// //       {/* ══════════════ STEP 1 – FORM ══════════════ */}
// //       {step === 1 && (
// //         <div className="grid grid-cols-12 gap-8">
// //           {/* Left – form */}
// //           <div className="col-span-12 lg:col-span-8 space-y-6">

// //             {/* Basic info */}
// //             <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-indigo-50/50 space-y-5">
// //               <h3 className="text-sm font-extrabold text-on-surface uppercase tracking-widest flex items-center gap-2">
// //                 <FileText size={16} className="text-primary" /> Basic Information
// //               </h3>

// //               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
// //                 <div className="sm:col-span-2">
// //                   <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">
// //                     Event Title *
// //                   </label>
// //                   <input
// //                     className={`w-full bg-surface-container-low border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 ring-primary/20 ${
// //                       errors.title ? 'border-tertiary' : 'border-transparent'
// //                     }`}
// //                     placeholder="e.g. Techno Garden Summer Festival"
// //                     value={form.title}
// //                     onChange={e => set('title', e.target.value)}
// //                   />
// //                   {errors.title && (
// //                     <p className="text-[11px] text-tertiary mt-1 flex items-center gap-1">
// //                       <AlertTriangle size={11} /> {errors.title}
// //                     </p>
// //                   )}
// //                 </div>

// //                 <div>
// //                   <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">
// //                     Organizer / Host Name *
// //                   </label>
// //                   <input
// //                     className={`w-full bg-surface-container-low border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 ring-primary/20 ${
// //                       errors.host ? 'border-tertiary' : 'border-transparent'
// //                     }`}
// //                     placeholder="e.g. Midnight Rebels"
// //                     value={form.host}
// //                     onChange={e => set('host', e.target.value)}
// //                   />
// //                   {errors.host && (
// //                     <p className="text-[11px] text-tertiary mt-1 flex items-center gap-1">
// //                       <AlertTriangle size={11} /> {errors.host}
// //                     </p>
// //                   )}
// //                 </div>

// //                 <div>
// //                   <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5 flex items-center gap-1">
// //                     <Tag size={10} /> Category *
// //                   </label>
// //                   <select
// //                     className={`w-full bg-surface-container-low border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 ring-primary/20 ${
// //                       errors.category ? 'border-tertiary' : 'border-transparent'
// //                     }`}
// //                     value={form.category}
// //                     onChange={e => set('category', e.target.value)}
// //                   >
// //                     <option value="">Select category…</option>
// //                     {CATEGORIES.map(c => (
// //                       <option key={c} value={c}>{c}</option>
// //                     ))}
// //                   </select>
// //                   {errors.category && (
// //                     <p className="text-[11px] text-tertiary mt-1 flex items-center gap-1">
// //                       <AlertTriangle size={11} /> {errors.category}
// //                     </p>
// //                   )}
// //                 </div>

// //                 <div>
// //                   <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5 flex items-center gap-1">
// //                     <Calendar size={10} /> Event Date *
// //                   </label>
// //                   <input
// //                     type="date"
// //                     className={`w-full bg-surface-container-low border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 ring-primary/20 ${
// //                       errors.eventDate ? 'border-tertiary' : 'border-transparent'
// //                     }`}
// //                     value={form.eventDate}
// //                     onChange={e => set('eventDate', e.target.value)}
// //                   />
// //                   {errors.eventDate && (
// //                     <p className="text-[11px] text-tertiary mt-1 flex items-center gap-1">
// //                       <AlertTriangle size={11} /> {errors.eventDate}
// //                     </p>
// //                   )}
// //                 </div>

// //                 <div>
// //                   <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5 flex items-center gap-1">
// //                     <MapPin size={10} /> Location *
// //                   </label>
// //                   <input
// //                     className={`w-full bg-surface-container-low border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 ring-primary/20 ${
// //                       errors.location ? 'border-tertiary' : 'border-transparent'
// //                     }`}
// //                     placeholder="e.g. Mumbai, Maharashtra"
// //                     value={form.location}
// //                     onChange={e => set('location', e.target.value)}
// //                   />
// //                   {errors.location && (
// //                     <p className="text-[11px] text-tertiary mt-1 flex items-center gap-1">
// //                       <AlertTriangle size={11} /> {errors.location}
// //                     </p>
// //                   )}
// //                 </div>

// //                <div>
// //   <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">
// //     Payment Type *
// //   </label>

// //   <select
// //     className={`w-full bg-surface-container-low border rounded-xl p-3 text-sm ${
// //       errors.paymentType ? 'border-tertiary' : 'border-transparent'
// //     }`}
// //     value={form.paymentType}
// //     onChange={e => set('paymentType', e.target.value)}
// //   >
// //     <option value="">Select type...</option>
// //     <option value="free">Free</option>
// //     <option value="paid">Paid</option>
// //   </select>

// //   {errors.paymentType && (
// //     <p className="text-[11px] text-tertiary mt-1">{errors.paymentType}</p>
// //   )}
// // </div>

// // {/* Show price only if PAID */}
// // {form.paymentType === 'paid' && (
// //   <div>
// //     <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">
// //       Ticket Price *
// //     </label>

// //     <input
// //       className={`w-full bg-surface-container-low border rounded-xl p-3 text-sm ${
// //         errors.ticketPrice ? 'border-tertiary' : 'border-transparent'
// //       }`}
// //       placeholder="e.g. ₹500"
// //       value={form.ticketPrice}
// //       onChange={e => set('ticketPrice', e.target.value)}
// //     />

// //     {errors.ticketPrice && (
// //       <p className="text-[11px] text-tertiary mt-1">{errors.ticketPrice}</p>
// //     )}
// //   </div>
// // )}

// //                 <div>
// //                   <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5 flex items-center gap-1">
// //                     <Users size={10} /> Max Capacity *
// //                   </label>
// //                   <input
// //                     type="number"
// //                     className={`w-full bg-surface-container-low border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 ring-primary/20 ${
// //                       errors.capacity ? 'border-tertiary' : 'border-transparent'
// //                     }`}
// //                     placeholder="e.g. 500"
// //                     value={form.capacity}
// //                     onChange={e => set('capacity', e.target.value)}
// //                   />
// //                   {errors.capacity && (
// //                     <p className="text-[11px] text-tertiary mt-1 flex items-center gap-1">
// //                       <AlertTriangle size={11} /> {errors.capacity}
// //                     </p>
// //                   )}
// //                 </div>

// //                 <div className="sm:col-span-2">
// //                   <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5 flex items-center gap-1">
// //                     <Image size={10} /> Banner Image URL (optional)
// //                   </label>
// //                   <input
// //                     className="w-full bg-surface-container-low border border-transparent rounded-xl p-3 text-sm focus:outline-none focus:ring-2 ring-primary/20"
// //                     placeholder="https://… (leave blank for auto-assign)"
// //                     value={form.imageUrl}
// //                     onChange={e => set('imageUrl', e.target.value)}
// //                   />
// //                 </div>

// //                 <div className="sm:col-span-2">
// //                   <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">
// //                     Event Description * (min 30 chars)
// //                   </label>
// //                   <textarea
// //                     rows={5}
// //                     className={`w-full bg-surface-container-low border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 ring-primary/20 resize-none ${
// //                       errors.description ? 'border-tertiary' : 'border-transparent'
// //                     }`}
// //                     placeholder="Describe the event in detail. Include schedule, highlights, and what attendees can expect…"
// //                     value={form.description}
// //                     onChange={e => set('description', e.target.value)}
// //                   />
// //                   <div className="flex justify-between items-center mt-1">
// //                     {errors.description ? (
// //                       <p className="text-[11px] text-tertiary flex items-center gap-1">
// //                         <AlertTriangle size={11} /> {errors.description}
// //                       </p>
// //                     ) : (
// //                       <span />
// //                     )}
// //                     <span className="text-[10px] text-on-surface-variant">
// //                       {form.description.length} chars
// //                     </span>
// //                   </div>
// //                 </div>

// //                 {/* Verified toggle */}
// //                 <div className="sm:col-span-2 flex items-center gap-3 p-4 bg-secondary-container/10 rounded-xl">
// //                   <div
// //                     onClick={() => set('hostVerified', !form.hostVerified)}
// //                     className={`w-10 h-6 rounded-full cursor-pointer transition-colors relative ${
// //                       form.hostVerified ? 'bg-secondary' : 'bg-surface-container-highest'
// //                     }`}
// //                   >
// //                     <div
// //                       className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
// //                         form.hostVerified ? 'left-5' : 'left-1'
// //                       }`}
// //                     />
// //                   </div>
// //                   <div>
// //                     <p className="text-sm font-bold text-on-surface">Mark Host as Verified</p>
// //                     <p className="text-[11px] text-on-surface-variant">
// //                       Toggle if this host has passed ID verification on MyApp
// //                     </p>
// //                   </div>
// //                 </div>
// //               </div>
// //             </section>

// //             {/* CTA */}
// //             <button
// //               onClick={handleAnalyze}
// //               className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white font-extrabold rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 text-base hover:opacity-90 transition-all"
// //             >
// //               <Sparkles size={20} />
// //               Analyze with Gemini AI &amp; Proceed
// //             </button>
// //           </div>

// //           {/* Right – preview */}
// //           <div className="col-span-12 lg:col-span-4 space-y-6">
// //             <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-indigo-50/50 sticky top-24">
// //               <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">
// //                 Live Preview
// //               </h4>
// //               <div className="rounded-xl overflow-hidden bg-surface-container-low h-36 flex items-center justify-center mb-4">
// //                 {form.imageUrl ? (
// //                   <img
// //                     src={form.imageUrl}
// //                     alt="preview"
// //                     className="w-full h-full object-cover"
// //                     onError={e => {
// //                       (e.target as HTMLImageElement).src =
// //                         'https://placehold.co/400x200/e8eaf6/4355b9?text=Preview';
// //                     }}
// //                   />
// //                 ) : (
// //                   <div className="text-center">
// //                     <Image size={28} className="text-on-surface-variant mx-auto mb-1" />
// //                     <p className="text-[11px] text-on-surface-variant">Auto image assigned</p>
// //                   </div>
// //                 )}
// //               </div>
// //               <h5 className="font-extrabold text-on-surface text-base leading-snug mb-1">
// //                 {form.title || <span className="text-on-surface-variant italic font-normal">Event Title…</span>}
// //               </h5>
// //               <p className="text-xs text-on-surface-variant mb-3">
// //                 by {form.host || '—'}{' '}
// //                 {form.hostVerified && (
// //                   <span className="text-[9px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-bold">
// //                     VERIFIED
// //                   </span>
// //                 )}
// //               </p>
// //               <div className="space-y-2 text-xs">
// //                 {[
// //                   { label: 'Category', val: form.category || '—' },
// //                   { label: 'Date', val: form.eventDate || '—' },
// //                   { label: 'Location', val: form.location || '—' },
// //                  {
// //   label: 'Price',
// //   val:
// //     form.paymentType === 'free'
// //       ? 'Free'
// //       : form.ticketPrice || '—',
// // },
// //                   { label: 'Capacity', val: form.capacity || '—' },
// //                 ].map(r => (
// //                   <div key={r.label} className="flex justify-between">
// //                     <span className="text-on-surface-variant font-bold">{r.label}</span>
// //                     <span className="font-semibold text-right max-w-[55%] truncate">{r.val}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //               <div className="mt-4 pt-4 border-t border-indigo-50/50">
// //                 <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-2">
// //                   Description preview
// //                 </p>
// //                 <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-4">
// //                   {form.description || 'Your description will appear here…'}
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* ══════════════ STEP 2 – AI ANALYSIS ══════════════ */}
// //       {step === 2 && (
// //         <div className="grid grid-cols-12 gap-8 items-start">
// //           {/* Event summary left */}
// //           <div className="col-span-12 lg:col-span-8 space-y-6">
// //             {/* Banner */}
// //             <div className="rounded-2xl overflow-hidden h-56 relative shadow-md">
// //               <img
// //                 src={
// //                   form.imageUrl ||
// //                   PLACEHOLDER_IMAGES[0]
// //                 }
// //                 alt={form.title}
// //                 className="w-full h-full object-cover"
// //                 onError={e => {
// //                   (e.target as HTMLImageElement).src =
// //                     'https://placehold.co/800x300/e8eaf6/4355b9?text=Event';
// //                 }}
// //               />
// //               <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
// //               <div className="absolute bottom-5 left-6">
// //                 <span className="text-[10px] bg-white/20 backdrop-blur text-white font-bold px-3 py-1 rounded-full uppercase tracking-wider">
// //                   {form.category}
// //                 </span>
// //                 <h3 className="text-2xl font-extrabold text-white mt-2">{form.title}</h3>
// //                 <p className="text-sm text-white/80">by {form.host}{form.hostVerified && ' ✓'}</p>
// //               </div>
// //             </div>

// //             {/* Details card */}
// //             <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-indigo-50/50">
// //               <h3 className="text-sm font-extrabold text-on-surface uppercase tracking-widest mb-5">
// //                 Event Details
// //               </h3>
// //               <p className="text-on-surface-variant leading-relaxed mb-6">{form.description}</p>
// //               <div className="grid grid-cols-3 gap-6 py-5 border-t border-indigo-100/10">
// //                 <div>
// //                   <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">
// //                     Ticket Price
// //                   </p>
// //                   <p className="text-lg font-extrabold text-primary">{form.ticketPrice}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">
// //                     Date
// //                   </p>
// //                   <p className="text-lg font-bold">{form.eventDate}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">
// //                     Capacity
// //                   </p>
// //                   <p className="text-lg font-bold text-secondary">{form.capacity} Max</p>
// //                 </div>
// //               </div>
// //               <div className="mt-4 flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
// //                 <MapPin size={18} className="text-primary" />
// //                 <div>
// //                   <p className="font-bold text-sm">{form.location}</p>
// //                   <p className="text-xs text-on-surface-variant">Event Venue</p>
// //                 </div>
// //               </div>
// //             </section>

// //             {/* Collaboration notes */}
// //             <section className="bg-surface-container-low rounded-2xl p-6 space-y-4 shadow-sm">
// //               <div className="flex items-center justify-between">
// //                 <h3 className="font-bold text-on-surface text-sm uppercase tracking-wider">
// //                   Collaboration Notes
// //                 </h3>
// //               </div>
// //               {notes.length > 0 && (
// //                 <div className="space-y-3 max-h-40 overflow-y-auto">
// //                   {notes.map((n, i) => (
// //                     <div key={i} className="flex gap-3">
// //                       <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
// //                         M
// //                       </div>
// //                       <div className="flex-1 bg-white p-3 rounded-xl rounded-tl-none shadow-sm text-xs">
// //                         <p className="font-bold mb-0.5">
// //                           Moderator{' '}
// //                           <span className="font-normal text-on-surface-variant ml-1">{n.time}</span>
// //                         </p>
// //                         <p className="text-on-surface-variant leading-snug">{n.text}</p>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //               <div className="relative">
// //                 <textarea
// //                   className="w-full bg-white border-none rounded-xl text-xs min-h-[70px] p-3 focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/50 shadow-inner"
// //                   placeholder="Add internal note... Use @ to tag"
// //                   value={note}
// //                   onChange={e => setNote(e.target.value)}
// //                 />
// //                 <button
// //                   onClick={addNote}
// //                   className="absolute bottom-2 right-2 p-1.5 bg-primary text-white rounded-lg hover:opacity-90 transition-all"
// //                 >
// //                   <Send size={14} />
// //                 </button>
// //               </div>
// //             </section>
// //           </div>

// //           {/* Right – AI Report + Actions */}
// //           <div className="col-span-12 lg:col-span-4 space-y-6 sticky top-24">
// //             {/* AI Report */}
// //             <section
// //               className={`rounded-2xl p-6 border-l-4 shadow-sm ${
// //                 analysis && analysis.riskScore >= 70
// //                   ? 'bg-surface-container-highest/40 border-tertiary'
// //                   : analysis && analysis.riskScore >= 40
// //                   ? 'bg-amber-50/40 border-amber-400'
// //                   : 'bg-secondary-container/10 border-secondary'
// //               }`}
// //             >
// //               <div className="flex items-start justify-between mb-4">
// //                 <div>
// //                   <h3 className="font-bold text-on-surface flex items-center gap-2">
// //                     <Bot size={18} className="text-primary" />
// //                     AI Moderation Report
// //                   </h3>
// //                   {analysis && !isAnalyzing && (
// //                     <p className="text-xs text-on-surface-variant mt-0.5 italic">
// //                       Scanned at {new Date(analysis.scannedAt).toLocaleTimeString()}
// //                     </p>
// //                   )}
// //                 </div>
// //                 <div className="flex items-center gap-2">
// //                   {analysis && !isAnalyzing && (
// //                     <span
// //                       className={`px-3 py-1 rounded-full font-bold text-xs ${
// //                         analysis.riskScore >= 70
// //                           ? 'bg-tertiary/10 text-tertiary border border-tertiary/20'
// //                           : analysis.riskScore >= 40
// //                           ? 'bg-amber-100 text-amber-700'
// //                           : 'bg-secondary-container/20 text-secondary'
// //                       }`}
// //                     >
// //                       {getRiskLabel(analysis.riskLevel)}
// //                     </span>
// //                   )}
// //                   {analysis && !isAnalyzing && (
// //                     <button
// //                       onClick={async () => {
// //                         setIsAnalyzing(true);
// //                         const r = await analyzeEventWithGemini(buildEvent());
// //                         setAnalysis(r);
// //                         setIsAnalyzing(false);
// //                       }}
// //                       className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container transition-colors"
// //                       title="Re-analyze"
// //                     >
// //                       <RefreshCw size={14} />
// //                     </button>
// //                   )}
// //                 </div>
// //               </div>

// //               {isAnalyzing ? (
// //                 <div className="space-y-4 py-4">
// //                   <div className="flex items-center gap-3 text-primary">
// //                     <Loader2 size={20} className="animate-spin" />
// //                     <div>
// //                       <p className="text-sm font-bold">Gemini AI Analyzing…</p>
// //                       <p className="text-xs text-on-surface-variant">
// //                         Checking content, pricing, flags…
// //                       </p>
// //                     </div>
// //                   </div>
// //                   <div className="animate-pulse space-y-3">
// //                     <div className="h-3 bg-indigo-100 rounded w-full" />
// //                     <div className="h-3 bg-indigo-100 rounded w-4/5" />
// //                     <div className="h-3 bg-indigo-100 rounded w-3/5" />
// //                     <div className="h-8 bg-indigo-100 rounded" />
// //                     <div className="h-8 bg-indigo-100 rounded" />
// //                   </div>
// //                 </div>
// //               ) : analysis ? (
// //                 <>
// //                   {/* Risk score bar */}
// //                   <div className="bg-white/60 p-4 rounded-lg mb-4">
// //                     <div className="flex justify-between items-center mb-2">
// //                       <span className="text-xs font-bold uppercase tracking-tighter text-on-surface-variant">
// //                         Risk Score
// //                       </span>
// //                       <span className={`text-lg font-black ${getRiskColor(analysis.riskScore)}`}>
// //                         {analysis.riskScore}/100
// //                       </span>
// //                     </div>
// //                     <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
// //                       <div
// //                         className={`h-full transition-all duration-700 ${getRiskBarColor(analysis.riskScore)}`}
// //                         style={{ width: `${analysis.riskScore}%` }}
// //                       />
// //                     </div>
// //                     <p className="text-xs mt-3 leading-relaxed text-on-surface-variant">
// //                       {analysis.summary}
// //                     </p>
// //                   </div>

// //                   {/* Metric bars */}
// //                   <div className="space-y-2 mb-4">
// //                     {[
// //                       { label: 'Semantic Integrity', value: analysis.semanticIntegrity },
// //                       { label: 'Host Legitimacy', value: analysis.hostLegitimacy },
// //                       { label: 'Engagement Pattern', value: analysis.engagementPattern },
// //                     ].map(m => (
// //                       <div key={m.label}>
// //                         <div className="flex justify-between text-[11px] mb-0.5">
// //                           <span className="text-on-surface-variant">{m.label}</span>
// //                           <span className={`font-bold ${getRiskColor(100 - m.value)}`}>
// //                             {m.value}/100
// //                           </span>
// //                         </div>
// //                         <div className="w-full bg-indigo-50 h-1 rounded-full overflow-hidden">
// //                           <div
// //                             className={`h-full ${getRiskBarColor(100 - m.value)}`}
// //                             style={{ width: `${m.value}%` }}
// //                           />
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>

// //                   {/* Flags */}
// //                   {analysis.flags.length > 0 ? (
// //                     <div className="space-y-2 mb-4">
// //                       {analysis.flags.map((flag, i) => (
// //                         <div
// //                           key={i}
// //                           className={`flex items-start gap-3 p-3 rounded-lg ${
// //                             flag.severity === 'high'
// //                               ? 'bg-tertiary/5 border-l-2 border-tertiary'
// //                               : 'bg-amber-50/50 border-l-2 border-amber-400'
// //                           }`}
// //                         >
// //                           <AlertTriangle
// //                             size={14}
// //                             className={
// //                               flag.severity === 'high' ? 'text-tertiary mt-0.5' : 'text-amber-600 mt-0.5'
// //                             }
// //                           />
// //                           <div>
// //                             <p className="text-sm font-bold text-on-surface">{flag.type}</p>
// //                             <p className="text-[11px] text-on-surface-variant">{flag.description}</p>
// //                           </div>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   ) : (
// //                     <div className="flex items-center gap-2 p-3 bg-secondary-container/20 rounded-lg mb-4">
// //                       <Shield size={16} className="text-secondary" />
// //                       <p className="text-xs font-bold text-secondary">No issues detected by AI</p>
// //                     </div>
// //                   )}

// //                   {/* Recommendation */}
// //                   <div className="bg-surface-container-low p-4 rounded-2xl">
// //                     <p className="text-[10px] font-bold text-primary uppercase mb-1">
// //                       Moderator Recommendation
// //                     </p>
// //                     <p className="text-xs italic text-on-surface-variant">
// //                       "{analysis.recommendation}"
// //                     </p>
// //                   </div>
// //                 </>
// //               ) : null}
// //             </section>

// //             {/* Final Action */}
// //             <section className="bg-surface-container-highest rounded-2xl p-6 shadow-sm border border-indigo-50/50">
// //               <h3 className="font-bold text-on-surface text-sm uppercase tracking-wider mb-4">
// //                 Final Action
// //               </h3>
// //               <div className="flex flex-col gap-3">
// //                 <button
// //                   onClick={() => handleAction('approve')}
// //                   disabled={isAnalyzing}
// //                   className="w-full py-3 bg-secondary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 shadow-md shadow-secondary/10 transition-all disabled:opacity-50"
// //                 >
// //                   <CheckCircle2 size={18} />
// //                   Approve Event → List on MyApp
// //                 </button>
// //                 <button
// //                   onClick={() => handleAction('send_edits')}
// //                   disabled={isAnalyzing}
// //                   className="w-full py-3 bg-white text-on-surface-variant font-bold border border-outline-variant rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all disabled:opacity-50"
// //                 >
// //                   <Undo2 size={18} />
// //                   Send Back for Edits
// //                 </button>
// //                 <button
// //                   onClick={() => handleAction('reject')}
// //                   disabled={isAnalyzing}
// //                   className="w-full py-3 bg-tertiary-container text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:brightness-110 shadow-md shadow-tertiary/10 transition-all disabled:opacity-50"
// //                 >
// //                   <XCircle size={18} />
// //                   Reject &amp; Suspend Host
// //                 </button>

// //                 {/* Back button */}
// //                 <button
// //                   onClick={() => { setStep(1); setAnalysis(null); }}
// //                   className="w-full py-2 text-xs text-on-surface-variant hover:text-primary flex items-center justify-center gap-1 transition-colors"
// //                 >
// //                   <X size={12} /> Back to Edit Form
// //                 </button>
// //               </div>
// //               <p className="text-[10px] text-center mt-4 text-on-surface-variant uppercase font-bold tracking-widest">
// //                 Action will be logged in Audit Trail
// //               </p>
// //             </section>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default CreateEvent;
// import React, { useState } from "react";

// const CreateEvent = () => {
//   const [description, setDescription] = useState("");
//   const [analysis, setAnalysis] = useState<any>(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);

//   // 🔥 BACKEND CALL
//   const analyzeEvent = async (event: any) => {
//     const res = await fetch("http://localhost:5000/analyze", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         description: event.description,
//       }),
//     });

//     return await res.json();
//   };

//   // 🔥 BUILD EVENT
//   const buildEvent = () => {
//     return {
//       description: description,
//     };
//   };

//   // 🔥 HANDLE ANALYZE
//   const handleAnalyze = async () => {
//     setIsAnalyzing(true);

//     try {
//       const result = await analyzeEvent(buildEvent());

//       // 👉 UI ke hisaab se format
//       setAnalysis({
//         riskScore: 50,
//         riskLevel: "medium",
//         summary: result.result,
//         recommendation: result.result,
//         flags: [],
//         scannedAt: new Date().toISOString(),
//       });
//     } catch (err) {
//       console.error(err);
//       alert("Error analyzing event");
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Create Event</h2>

//       {/* INPUT */}
//       <textarea
//         placeholder="Enter event description..."
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//         style={{
//           width: "100%",
//           height: "100px",
//           marginBottom: "10px",
//         }}
//       />

//       {/* BUTTON */}
//       <button onClick={handleAnalyze} disabled={isAnalyzing}>
//         {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
//       </button>

//       {/* RESULT */}
//       {analysis && (
//         <div style={{ marginTop: "20px" }}>
//           <h3>Analysis Result</h3>
//           <p><b>Risk Level:</b> {analysis.riskLevel}</p>
//           <p><b>Summary:</b> {analysis.summary}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateEvent;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addEvent } from "../lib/mockEvents";

const generateId = () => "EV-" + Math.floor(10000 + Math.random() * 90000);

const CATEGORIES = [
  "Music & Nightlife", "Technology", "Health & Wellness",
  "Business & Networking", "Educational Workshop", "Sports & Fitness",
  "Arts & Culture", "Food & Drink", "Community", "Other",
];

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",
];

const CreateEvent = () => {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    title: "", host: "", hostVerified: false,
    category: "", eventDate: "", location: "",
    paymentType: "", ticketPrice: "", capacity: "", description: "", imageUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string | boolean) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Event title is required";
    if (!form.host.trim()) e.host = "Host name is required";
    if (!form.category) e.category = "Please select a category";
    if (!form.eventDate) e.eventDate = "Event date is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.paymentType) e.paymentType = "Select payment type";
    if (form.paymentType === "paid" && !form.ticketPrice.trim())
      e.ticketPrice = "Enter ticket price";
    if (!form.capacity.trim() || isNaN(Number(form.capacity)))
      e.capacity = "Valid capacity number required";
    if (!form.description.trim() || form.description.length < 30)
      e.description = "Description must be at least 30 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildEvent = () => ({
    id: generateId(),
    title: form.title,
    host: form.host,
    hostVerified: form.hostVerified,
    image: form.imageUrl || PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)],
    category: form.category,
    dateSubmitted: new Date().toISOString(),
    eventDate: form.eventDate,
    location: form.location,
    ticketPrice: form.paymentType === "free" ? "Free" : form.ticketPrice,
    capacity: Number(form.capacity),
    description: form.description,
    status: "pending" as const,
  });

  // ✅ FIXED: Full event object bhejta hai backend ko
  const handleAnalyze = async () => {
    if (!validate()) return;
    setIsAnalyzing(true);
    const eventData = buildEvent();
    try {
      const res = await fetch("http://localhost:5006/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: eventData }), // ✅ { event: ... } format
      });
      const result = await res.json();
      setAnalysis({
        riskScore: result.riskScore ?? 50,
        riskLevel: result.riskLevel ?? "medium",
        summary: result.summary ?? "No summary available",
        recommendation: result.recommendation ?? "",
        flags: result.flags ?? [],
        semanticIntegrity: result.semanticIntegrity ?? 80,
        hostLegitimacy: result.hostLegitimacy ?? 80,
        engagementPattern: result.engagementPattern ?? 80,
        scannedAt: new Date().toISOString(),
      });
      setStep(2);
    } catch (err) {
      console.error(err);
      alert("Error analyzing event. Is the backend running on port 5006?");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAction = (action: "approve" | "reject" | "send_edits") => {
    if (action === "approve") {
      addEvent(buildEvent() as any);
    }
    navigate("/moderation");
  };

  // ── STEP 1: Form ──
  if (step === 1) return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-extrabold text-on-surface">Create & Submit Event</h2>
        <p className="text-on-surface-variant text-sm mt-1">Fill details — AI will analyze before going live.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-indigo-50/50 space-y-5">
        {/* Title */}
        <div>
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">Event Title *</label>
          <input className={`w-full bg-surface-container-low border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 ring-primary/20 ${errors.title ? "border-red-400" : "border-transparent"}`}
            placeholder="e.g. Techno Garden Summer Festival" value={form.title} onChange={e => set("title", e.target.value)} />
          {errors.title && <p className="text-[11px] text-red-500 mt-1">{errors.title}</p>}
        </div>

        {/* Host */}
        <div>
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">Organizer / Host *</label>
          <input className={`w-full bg-surface-container-low border rounded-xl p-3 text-sm focus:outline-none ${errors.host ? "border-red-400" : "border-transparent"}`}
            placeholder="e.g. Midnight Rebels" value={form.host} onChange={e => set("host", e.target.value)} />
          {errors.host && <p className="text-[11px] text-red-500 mt-1">{errors.host}</p>}
        </div>

        {/* Category + Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">Category *</label>
            <select className={`w-full bg-surface-container-low border rounded-xl p-3 text-sm ${errors.category ? "border-red-400" : "border-transparent"}`}
              value={form.category} onChange={e => set("category", e.target.value)}>
              <option value="">Select category…</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-[11px] text-red-500 mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">Event Date *</label>
            <input type="date" className={`w-full bg-surface-container-low border rounded-xl p-3 text-sm ${errors.eventDate ? "border-red-400" : "border-transparent"}`}
              value={form.eventDate} onChange={e => set("eventDate", e.target.value)} />
            {errors.eventDate && <p className="text-[11px] text-red-500 mt-1">{errors.eventDate}</p>}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">Location *</label>
          <input className={`w-full bg-surface-container-low border rounded-xl p-3 text-sm ${errors.location ? "border-red-400" : "border-transparent"}`}
            placeholder="e.g. Mumbai, Maharashtra" value={form.location} onChange={e => set("location", e.target.value)} />
          {errors.location && <p className="text-[11px] text-red-500 mt-1">{errors.location}</p>}
        </div>

        {/* Payment Type + Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">Payment Type *</label>
            <select className={`w-full bg-surface-container-low border rounded-xl p-3 text-sm ${errors.paymentType ? "border-red-400" : "border-transparent"}`}
              value={form.paymentType} onChange={e => set("paymentType", e.target.value)}>
              <option value="">Select type…</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
            {errors.paymentType && <p className="text-[11px] text-red-500 mt-1">{errors.paymentType}</p>}
          </div>
          {form.paymentType === "paid" && (
            <div>
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">Ticket Price *</label>
              <input className={`w-full bg-surface-container-low border rounded-xl p-3 text-sm ${errors.ticketPrice ? "border-red-400" : "border-transparent"}`}
                placeholder="e.g. ₹500" value={form.ticketPrice} onChange={e => set("ticketPrice", e.target.value)} />
              {errors.ticketPrice && <p className="text-[11px] text-red-500 mt-1">{errors.ticketPrice}</p>}
            </div>
          )}
        </div>

        {/* Capacity */}
        <div>
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">Max Capacity *</label>
          <input type="number" className={`w-full bg-surface-container-low border rounded-xl p-3 text-sm ${errors.capacity ? "border-red-400" : "border-transparent"}`}
            placeholder="e.g. 500" value={form.capacity} onChange={e => set("capacity", e.target.value)} />
          {errors.capacity && <p className="text-[11px] text-red-500 mt-1">{errors.capacity}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">Description * (min 30 chars)</label>
          <textarea rows={5} className={`w-full bg-surface-container-low border rounded-xl p-3 text-sm resize-none ${errors.description ? "border-red-400" : "border-transparent"}`}
            placeholder="Describe the event in detail…" value={form.description} onChange={e => set("description", e.target.value)} />
          <div className="flex justify-between mt-1">
            {errors.description && <p className="text-[11px] text-red-500">{errors.description}</p>}
            <span className="text-[10px] text-on-surface-variant ml-auto">{form.description.length} chars</span>
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">Banner Image URL (optional)</label>
          <input className="w-full bg-surface-container-low border border-transparent rounded-xl p-3 text-sm"
            placeholder="https://… (leave blank for auto)" value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)} />
        </div>

        {/* Host Verified Toggle */}
        <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl">
          <div onClick={() => set("hostVerified", !form.hostVerified)}
            className={`w-10 h-6 rounded-full cursor-pointer transition-colors relative ${form.hostVerified ? "bg-green-500" : "bg-gray-300"}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.hostVerified ? "left-5" : "left-1"}`} />
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">Mark Host as Verified</p>
            <p className="text-[11px] text-on-surface-variant">Toggle if host has passed ID verification</p>
          </div>
        </div>
      </div>

      <button onClick={handleAnalyze} disabled={isAnalyzing}
        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white font-extrabold rounded-2xl shadow-xl flex items-center justify-center gap-3 text-base hover:opacity-90 transition-all disabled:opacity-60">
        {isAnalyzing ? "⏳ Analyzing with AI..." : "✨ Analyze with AI & Proceed"}
      </button>
    </div>
  );

  // ── STEP 2: AI Result + Actions ──
  if (step === 2 && analysis) return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-extrabold text-on-surface">AI Analysis Report</h2>
        <p className="text-on-surface-variant text-sm mt-1">Review the AI analysis before taking action.</p>
      </div>

      {/* Risk Score Card */}
      <div className={`rounded-2xl p-6 border-l-4 shadow-sm ${analysis.riskScore >= 70 ? "bg-red-50 border-red-400" : analysis.riskScore >= 40 ? "bg-amber-50 border-amber-400" : "bg-green-50 border-green-400"}`}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg">Risk Score</h3>
          <span className={`text-2xl font-black ${analysis.riskScore >= 70 ? "text-red-500" : analysis.riskScore >= 40 ? "text-amber-500" : "text-green-500"}`}>
            {analysis.riskScore}/100
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div className={`h-full transition-all duration-700 ${analysis.riskScore >= 70 ? "bg-red-500" : analysis.riskScore >= 40 ? "bg-amber-400" : "bg-green-500"}`}
            style={{ width: `${analysis.riskScore}%` }} />
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{analysis.summary}</p>
      </div>

      {/* Metrics */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 space-y-4 shadow-sm">
        {[
          { label: "Semantic Integrity", value: analysis.semanticIntegrity },
          { label: "Host Legitimacy", value: analysis.hostLegitimacy },
          { label: "Engagement Pattern", value: analysis.engagementPattern },
        ].map(m => (
          <div key={m.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-on-surface-variant">{m.label}</span>
              <span className="font-bold">{m.value}/100</span>
            </div>
            <div className="w-full bg-indigo-100 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${m.value}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Flags */}
      {(analysis.flags?.length ?? 0) > 0 && (
        <div className="space-y-2">
          {analysis.flags.map((flag: any, i: number) => (
            <div key={i} className={`p-4 rounded-xl flex gap-3 ${flag.severity === "high" ? "bg-red-50 border-l-4 border-red-400" : "bg-amber-50 border-l-4 border-amber-400"}`}>
              <div>
                <p className="font-bold text-sm">{flag.type}</p>
                <p className="text-[11px] text-gray-600">{flag.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendation */}
      <div className="bg-indigo-50 p-4 rounded-xl">
        <p className="text-[10px] font-bold text-indigo-600 uppercase mb-1">AI Recommendation</p>
        <p className="text-sm italic text-gray-700">"{analysis.recommendation}"</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <button onClick={() => handleAction("approve")}
          className="w-full py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all">
          ✓ Approve Event → List on MyApp
        </button>
        <button onClick={() => handleAction("send_edits")}
          className="w-full py-3 bg-white border border-gray-300 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all">
          ↩ Send Back for Edits
        </button>
        <button onClick={() => handleAction("reject")}
          className="w-full py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all">
          ✗ Reject & Suspend Host
        </button>
        <button onClick={() => { setStep(1); setAnalysis(null); }}
          className="text-sm text-gray-500 hover:text-indigo-600 text-center py-2">
          ← Back to Edit Form
        </button>
      </div>
    </div>
  );

  return null;
};

export default CreateEvent;