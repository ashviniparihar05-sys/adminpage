// // // frontend/src/lib/mockEvents.ts
// // import type { Event } from '../types';

// // const STORAGE_KEY = 'eventhub_events';

// // // ─── Default seed data (only used if localStorage is empty) ───────────────────
// // const DEFAULT_EVENTS: Event[] = [
// //   {
// //     id: 'EV-90210',
// //     title: 'Neon Pulse: Deep Tech Night',
// //     host: 'Midnight Rebels',
// //     hostVerified: true,
// //     image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600',
// //     category: 'Music & Nightlife',
// //     dateSubmitted: '2024-10-24T14:32:00Z',
// //     eventDate: '2024-11-15',
// //     location: 'Mumbai, Maharashtra',
// //     ticketPrice: '₹500 - ₹2000',
// //     capacity: 500,
// //     description:
// //       'An underground deep tech night featuring the best local DJs. Featuring special substances for an enhanced experience. Doors open at 10 PM. Strictly 21+. Special pre-party packages available on our Telegram channel.',
// //     status: 'pending',
// //   }
 
// // ];

// // // ─── Read all events (localStorage first, fallback to defaults) ────────────────
// // export const getEvents = (): Event[] => {
// //   try {
// //     const stored = localStorage.getItem(STORAGE_KEY);
// //     if (stored) {
// //       const parsed: Event[] = JSON.parse(stored);
// //       if (Array.isArray(parsed) && parsed.length > 0) return parsed;
// //     }
// //   } catch (_) {
// //     // corrupted storage — fall through to defaults
// //   }
// //   // Seed defaults into storage so subsequent reads are consistent
// //   localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EVENTS));
// //   return DEFAULT_EVENTS;
// // };

// // // ─── Add a new event (prepend so it shows first in queue) ─────────────────────
// // export const addEvent = (event: Event): void => {
// //   const current = getEvents();
// //   // Avoid duplicates (re-submit scenario)
// //   const withoutDupe = current.filter(e => e.id !== event.id);
// //   const updated = [event, ...withoutDupe];
// //   localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
// // };

// // // ─── Update event status ───────────────────────────────────────────────────────
// // export const updateEventStatus = (
// //   id: string,
// //   status: Event['status'],
// // ): void => {
// //   const current = getEvents();
// //   const updated = current.map(e => (e.id === id ? { ...e, status } : e));
// //   localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
// // };

// // // ─── Legacy export — keep so existing imports don't break ─────────────────────
// // // Components that still import MOCK_INCOMING_EVENTS will get live data
// // export const MOCK_INCOMING_EVENTS: Event[] = getEvents();
// // frontend/src/lib/mockEvents.ts
// import type { Event } from '../types';

// const STORAGE_KEY = 'eventhub_events';

// const SEED_EVENTS: Event[] = [
//   {
//     id: 'EV-90210',
//     title: 'Neon Pulse: Deep Tech Night',
//     host: 'Midnight Rebels',
//     hostVerified: true,
//     image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600',
//     category: 'Music & Nightlife',
//     dateSubmitted: '2024-10-24T14:32:00Z',
//     eventDate: '2024-11-15',
//     location: 'Mumbai, Maharashtra',
//     ticketPrice: '₹500 - ₹2000',
//     capacity: 500,
//     description: 'An underground deep tech night featuring the best local DJs. Featuring special substances for an enhanced experience. Doors open at 10 PM. Strictly 21+. Special pre-party packages available on our Telegram channel.',
//     status: 'pending',
//   },
//   {
//     id: 'EV-90211',
//     title: 'Future of Web3: London',
//     host: 'Block Ventures',
//     hostVerified: false,
//     image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
//     category: 'Technology',
//     dateSubmitted: '2024-10-24T12:00:00Z',
//     eventDate: '2024-12-05',
//     location: 'Canary Wharf, London',
//     ticketPrice: 'Free',
//     capacity: 200,
//     description: 'Join us for an evening of talks and networking around the future of decentralized technology, blockchain applications, and Web3 innovations. Featuring speakers from leading crypto firms.',
//     status: 'pending',
//   },
//   {
//     id: 'EV-90212',
//     title: 'Private Gala Dinner',
//     host: 'Sarah Jenkins',
//     hostVerified: false,
//     image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600',
//     category: 'Educational Workshop',
//     dateSubmitted: '2024-10-24T09:15:00Z',
//     eventDate: '2024-11-20',
//     location: 'Delhi, India',
//     ticketPrice: '$80 deposit required, remaining $200 at door',
//     capacity: 50,
//     description: 'An exclusive educational dinner workshop for professionals. Learn networking strategies from industry leaders. Limited seats. Pay $80 deposit now via link bit.ly/promo-xyz to reserve your spot.',
//     status: 'pending',
//   },
//   {
//     id: 'EV-90213',
//     title: 'Yoga & Wellness Retreat',
//     host: 'Priya Sharma',
//     hostVerified: true,
//     image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
//     category: 'Health & Wellness',
//     dateSubmitted: '2024-10-23T08:00:00Z',
//     eventDate: '2024-11-30',
//     location: 'Rishikesh, Uttarakhand',
//     ticketPrice: '₹3500 per person',
//     capacity: 30,
//     description: 'A weekend yoga and meditation retreat in the foothills of the Himalayas. Includes 2 nights accommodation, all meals, yoga sessions, and guided meditation. Led by certified yoga instructor with 10 years experience.',
//     status: 'pending',
//   },
//   {
//     id: 'EV-90214',
//     title: 'Startup Pitch Night',
//     host: 'TechHub Bangalore',
//     hostVerified: true,
//     image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600',
//     category: 'Business & Networking',
//     dateSubmitted: '2024-10-22T16:30:00Z',
//     eventDate: '2024-11-10',
//     location: 'Indiranagar, Bangalore',
//     ticketPrice: 'Free for founders, ₹500 for investors',
//     capacity: 150,
//     description: 'Monthly startup pitch night where 8 early-stage startups present to a panel of investors and the startup community. Networking, food, and drinks included. Previous companies have raised $2M+ from these events.',
//     status: 'pending',
//   },
// ];

// export const getEvents = (): Event[] => {
//   try {
//     const raw = localStorage.getItem(STORAGE_KEY);
//     if (raw) {
//       const parsed: Event[] = JSON.parse(raw);
//       if (Array.isArray(parsed) && parsed.length > 0) return parsed;
//     }
//   } catch (_) {}
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_EVENTS));
//   return [...SEED_EVENTS];
// };

// export const addEvent = (event: Event): void => {
//   const all = getEvents();
//   const deduped = all.filter(e => e.id !== event.id);
//   localStorage.setItem(STORAGE_KEY, JSON.stringify([event, ...deduped]));
// };

// export const updateEventStatus = (id: string, status: Event['status']): void => {
//   const all = getEvents();
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(all.map(e => e.id === id ? { ...e, status } : e)));
// };

// export const resetToDefaults = (): void => {
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_EVENTS));
// };

// // Legacy — keeps old imports working
// export const MOCK_INCOMING_EVENTS = getEvents();
// frontend/src/lib/mockEvents.ts
// ✅ Ab localStorage NAHI — direct MongoDB se via backend API
// ✅ MyApp ke events yahan aate hain

import type { Event } from '../types';

const API_BASE = 'http://localhost:5006';

// ─── Fetch all events from backend (which reads MyApp MongoDB) ────────────────
export const getEventsFromAPI = async (): Promise<Event[]> => {
  try {
    const res = await fetch(`${API_BASE}/events`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('❌ Failed to fetch events from API:', err);
    return [];
  }
};

// ─── Update event status (approve/reject) ─────────────────────────────────────
export const updateEventStatusAPI = async (
  id: string,
  status: Event['status'],
  moderatorNote?: string
): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE}/events/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, moderatorNote }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log('✅ Status updated:', data);
    return true;
  } catch (err) {
    console.error('❌ Failed to update status:', err);
    return false;
  }
};

// ─── Get single event by ID ────────────────────────────────────────────────────
export const getEventByIdAPI = async (id: string): Promise<Event | null> => {
  try {
    const res = await fetch(`${API_BASE}/events/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('❌ Failed to fetch event:', err);
    return null;
  }
};

// ─── Legacy localStorage functions (kept for backward compat / offline fallback)
const STORAGE_KEY = 'eventhub_events';

export const getEvents = (): Event[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: Event[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  return [];
};

export const addEvent = (event: Event): void => {
  const all = getEvents();
  const deduped = all.filter(e => e.id !== event.id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([event, ...deduped]));
};

export const updateEventStatus = (id: string, status: Event['status']): void => {
  const all = getEvents();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all.map(e => e.id === id ? { ...e, status } : e)));
};

export const resetToDefaults = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// Legacy export
export const MOCK_INCOMING_EVENTS: Event[] = getEvents();