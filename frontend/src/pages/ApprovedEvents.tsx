// frontend/src/pages/ApprovedEvents.tsx
// ✅ Shows only approved events from localStorage
// ✅ Cards clickable → opens ModerationDetail
// ✅ Refresh picks up newly approved events

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, MapPin, Calendar, Users, Eye,
  Search, RefreshCw, Sparkles, ExternalLink, Tag,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getEvents } from '../lib/mockEvents';
import type { Event } from '../types';

const ApprovedEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const load = () => {
    const approved = getEvents().filter(e => e.status === 'approved');
    setEvents(approved);
    if (approved.length > 0) setSelectedEvent(approved[0]);
  };

  useEffect(() => { load(); }, []);

  const categories = ['all', ...Array.from(new Set(events.map(e => e.category)))];
  const filtered = events.filter(e => {
    const q = search.toLowerCase();
    return (
      (!q || e.title.toLowerCase().includes(q) || e.host.toLowerCase().includes(q) || e.location.toLowerCase().includes(q)) &&
      (selectedCategory === 'all' || e.category === selectedCategory)
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1 block">Live on MyApp</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Approved Events</h2>
          <p className="text-on-surface-variant text-sm mt-1">Events that passed AI moderation and are live on MyApp.</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-indigo-50/20">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase">Live Events</p>
            <p className="text-xl font-extrabold text-secondary">{events.length}</p>
          </div>
          <button onClick={load} className="bg-surface-container-highest text-primary px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-surface-variant transition-colors">
            <RefreshCw size={16} /> Refresh
          </button>
          <Link to="/events/create" className="bg-gradient-to-r from-primary to-primary-container text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:opacity-90">
            <Sparkles size={16} /> Add Event
          </Link>
        </div>
      </div>

      {/* Search + filter */}
      <div className="bg-surface-container-low p-4 rounded-2xl flex flex-wrap gap-4">
        <div className="flex-1 min-w-[220px] relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            className="w-full bg-surface-container-highest border-none rounded-xl text-sm p-2 pl-8"
            placeholder="Search events, hosts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <select className="w-full bg-surface-container-highest border-none rounded-xl text-sm p-2" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
          </select>
        </div>
      </div>

      {/* Empty state */}
      {events.length === 0 && (
        <div className="bg-surface-container-lowest rounded-2xl p-16 text-center border border-indigo-50/50 shadow-sm">
          <CheckCircle2 size={48} className="text-on-surface-variant mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-bold text-on-surface mb-2">No approved events yet</h3>
          <p className="text-on-surface-variant text-sm mb-6">Create events and approve them to see them listed here.</p>
          <Link to="/events/create" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90">
            <Sparkles size={16} /> Create Event
          </Link>
        </div>
      )}

      {events.length > 0 && (
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Cards */}
          <div className="col-span-12 lg:col-span-8">
            {filtered.length === 0 ? (
              <p className="text-center py-12 text-on-surface-variant">No events match your search.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map(event => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${selectedEvent?.id === event.id ? 'border-secondary ring-2 ring-secondary/20' : 'border-indigo-50/50'}`}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={event.image} alt={event.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x200/e8eaf6/4355b9?text=Event'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-3 right-3">
                        <span className="bg-secondary text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={9} /> LIVE
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-white/20 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{event.category}</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-extrabold text-on-surface text-sm leading-tight line-clamp-1">{event.title}</h4>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          by {event.host}
                          {event.hostVerified && <span className="ml-1 text-[9px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-bold">VERIFIED</span>}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1 text-on-surface-variant"><Calendar size={11} className="text-primary" /><span>{event.eventDate}</span></div>
                        <div className="flex items-center gap-1 text-on-surface-variant"><Users size={11} className="text-primary" /><span>{event.capacity} max</span></div>
                        <div className="flex items-center gap-1 text-on-surface-variant col-span-2"><MapPin size={11} className="text-primary" /><span className="truncate">{event.location}</span></div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-indigo-50/50">
                        <span className="text-sm font-extrabold text-primary">{event.ticketPrice}</span>
                        <Link
                          to={`/moderation/${event.id}`}
                          className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                          onClick={e => e.stopPropagation()}
                        >
                          <Eye size={11} /> View Detail
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {filtered.length > 0 && (
              <p className="mt-4 text-xs text-on-surface-variant">Showing {filtered.length} of {events.length} approved events</p>
            )}
          </div>

          {/* Detail panel */}
          {selectedEvent && (
            <div className="col-span-12 lg:col-span-4 space-y-5 sticky top-24">
              <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-indigo-50/50">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={selectedEvent.image} alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x200/e8eaf6/4355b9?text=Event'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[10px] text-white/70 uppercase font-bold">{selectedEvent.category}</p>
                    <h3 className="text-lg font-extrabold text-white leading-tight">{selectedEvent.title}</h3>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary-container flex items-center justify-center text-white text-[11px] font-bold">{selectedEvent.host[0]}</div>
                    <div>
                      <p className="text-sm font-bold">{selectedEvent.host}</p>
                      {selectedEvent.hostVerified && <span className="text-[9px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-bold">VERIFIED</span>}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    {[
                      { icon: Calendar, label: 'Date', val: selectedEvent.eventDate },
                      { icon: MapPin, label: 'Location', val: selectedEvent.location },
                      { icon: Users, label: 'Capacity', val: `${selectedEvent.capacity}` },
                      { icon: Tag, label: 'Price', val: selectedEvent.ticketPrice },
                    ].map(r => (
                      <div key={r.label} className="flex items-center gap-2">
                        <r.icon size={14} className="text-primary flex-shrink-0" />
                        <span className="text-on-surface-variant">{r.label}:</span>
                        <span className="font-semibold truncate">{r.val}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">{selectedEvent.description}</p>
                  <div className="flex items-center gap-2 p-3 bg-secondary-container/20 rounded-xl">
                    <CheckCircle2 size={16} className="text-secondary" />
                    <div>
                      <p className="text-xs font-bold text-secondary">Approved & Live on MyApp</p>
                      <p className="text-[10px] text-on-surface-variant">ID: {selectedEvent.id}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/moderation/${selectedEvent.id}`} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-xs font-bold text-center hover:opacity-90 flex items-center justify-center gap-1">
                      <Eye size={13} /> Full Detail
                    </Link>
                    <a href="#" className="flex-1 py-2.5 bg-surface-container-highest text-primary rounded-xl text-xs font-bold text-center hover:bg-surface-variant flex items-center justify-center gap-1">
                      <ExternalLink size={13} /> MyApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApprovedEvents;