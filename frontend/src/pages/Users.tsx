// import React from 'react';
// import { 
//   Search, 
//   BadgeCheck, 
//   MoreHorizontal, 
//   Bot, 
//   History, 
//   MessageSquare, 
//   Send 
// } from 'lucide-react';

// const Users = () => {
//   const users = [
//     {
//       id: '1',
//       name: 'Julian Rossi',
//       username: '@julian_events_milan',
//       joined: 'Jan 2023',
//       location: 'Milan, IT',
//       type: 'Host',
//       activity: '142 Events',
//       lastActive: '2h ago',
//       reputation: 94,
//       status: 'Active',
//       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0B_A82hnzvoRtiztWcMjSTdr2hQRp9AZAqef68EeA2Kd-quXXmFGLg2MW0egbZIG4--O2KaDAg8QoRFluelZLShUmvsKHFeV1flx4o-TEj6tvp_ZFzT1x-Ui63Ml06NTfoWkcA_9ftrUKXJAJUxR69MxwCMjDVoeiUAgSgHFrBH9_NxbmxMDWJZPrMoWE9UK6LWQfpsiEcl4tkG6wG6vsc1UnQWCfQAFEhTeNJd4PgQIwtDLMoYsQO1NdzdGkBeHl8C54lmU5N_U'
//     },
//     {
//       id: '2',
//       name: 'Elena Vance',
//       username: '@elena_v',
//       joined: 'Mar 2022',
//       location: 'London, UK',
//       type: 'Both',
//       activity: '2,104 Attended',
//       lastActive: '10m ago',
//       reputation: 82,
//       status: 'Active',
//       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbXy-_aKO7Cho7PjRY-NS0brtkQM_fHlR4IzDyfI1FWgb3s4hmaLi418KsZ7u1sQrzaaAFAk-OWwli6toUptRTkIWz6ACCo1y9MWOI-cUkcpooY_zTmD5Xi-MQu2zNPlFt6N7XrL2TjBJ__1Y9nLPtr92V273xPesgy2q3t-tCtZmBXgrZslAWn2_ISBjkQeN13Mrsn4xtmHNAuWvzf6phI3bWUyJIgjB8FInKYvkpVrmHS1AboiOJq1PBzBwuQIuC1vxR3rxykWU'
//     },
//     {
//       id: '3',
//       name: 'Robert Thorne',
//       username: '@rthorne',
//       joined: 'Dec 2023',
//       location: 'NYC, US',
//       type: 'User',
//       activity: '12 Attended',
//       lastActive: '4d ago',
//       reputation: 41,
//       status: 'Suspended',
//       image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI8pI1FcZRC8zPrvJgvdCc-QaNl3Wp7v5uhpwAdWj6TWkcp-noNGFlXi-abIBuFiqsCa3CIZR5X1WRCFsBaXkzouircrGiaSU3qz4BB0Q3DBNE-IrYUyvd7boIW942S_q6xliqx5AaQvtf-jHE5mUkdTYGgNHijK9Qqn0A8B3g6_c4EYREk5l9mEjLudGPi0R7lWOThobp-GaRC1UD6EM1HrNjmM-DYEx2W07cXjEILRt6c83K-z5RT4SmXIPlRi_pSsR6Xz9PyMc'
//     }
//   ];

//   return (
//     <div className="space-y-8">
//       <div className="flex items-end justify-between">
//         <div>
//           <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Community Hub</h2>
//           <p className="text-on-surface-variant text-sm mt-1">Manage, verify and curate platform members.</p>
//         </div>
//         <div className="flex bg-surface-container-low p-1 rounded-xl">
//           <button className="px-4 py-2 text-xs font-bold rounded-lg bg-white shadow-sm text-primary">Overview</button>
//           <button className="px-4 py-2 text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors">Verification Queue</button>
//           <button className="px-4 py-2 text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors">Flagged History</button>
//         </div>
//       </div>

//       <section className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-surface-container-low p-4 rounded-2xl">
//         <div className="flex flex-col gap-1">
//           <label className="text-[10px] font-bold text-on-surface-variant uppercase px-1">Account Type</label>
//           <select className="bg-surface-container-lowest border-none rounded-xl text-sm focus:ring-2 ring-primary/10 p-2">
//             <option>All Types</option>
//             <option>Hosts</option>
//             <option>Users</option>
//             <option>Both</option>
//           </select>
//         </div>
//         <div className="flex flex-col gap-1">
//           <label className="text-[10px] font-bold text-on-surface-variant uppercase px-1">Status</label>
//           <select className="bg-surface-container-lowest border-none rounded-xl text-sm focus:ring-2 ring-primary/10 p-2">
//             <option>Active</option>
//             <option>Suspended</option>
//             <option>Banned</option>
//             <option>Pending</option>
//           </select>
//         </div>
//         <div className="flex flex-col gap-1">
//           <label className="text-[10px] font-bold text-on-surface-variant uppercase px-1">Reputation Score</label>
//           <div className="flex gap-2">
//             <input type="number" className="w-full bg-surface-container-lowest border-none rounded-xl text-sm focus:ring-2 ring-primary/10 p-2" placeholder="Min" />
//             <input type="number" className="w-full bg-surface-container-lowest border-none rounded-xl text-sm focus:ring-2 ring-primary/10 p-2" placeholder="Max" />
//           </div>
//         </div>
//         <div className="flex items-end">
//           <button className="w-full py-2.5 bg-on-surface text-surface rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">Apply Filters</button>
//         </div>
//       </section>

//       <div className="grid grid-cols-12 gap-8 items-start">
//         <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-indigo-50/50">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-indigo-50/50">
//                 <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Profile</th>
//                 <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Type</th>
//                 <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Activity</th>
//                 <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Reputation</th>
//                 <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-surface-container-low">
//               {users.map((user) => (
//                 <tr key={user.id} className="hover:bg-surface-container-low/30 transition-colors cursor-pointer group">
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <img 
//                         src={user.image} 
//                         alt={user.name} 
//                         className="w-10 h-10 rounded-full object-cover shadow-sm"
//                         referrerPolicy="no-referrer"
//                       />
//                       <div>
//                         <div className="text-sm font-bold text-on-surface">{user.name}</div>
//                         <div className="text-[11px] text-on-surface-variant">Joined {user.joined} • {user.location}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${user.type === 'Host' ? 'bg-secondary-container/30 text-on-secondary-container' : 'bg-surface-variant text-on-surface-variant'}`}>
//                       {user.type}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="text-sm font-semibold">{user.activity}</div>
//                     <div className="text-[11px] text-on-surface-variant">Last active: {user.lastActive}</div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2">
//                       <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
//                         <div 
//                           className={`h-full ${user.reputation > 80 ? 'bg-secondary' : user.reputation > 40 ? 'bg-primary' : 'bg-tertiary-container'}`} 
//                           style={{ width: `${user.reputation}%` }}
//                         ></div>
//                       </div>
//                       <span className={`text-xs font-bold ${user.reputation > 80 ? 'text-secondary' : user.reputation > 40 ? 'text-primary' : 'text-tertiary'}`}>
//                         {user.reputation}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${user.status === 'Active' ? 'text-on-secondary-container bg-secondary-container' : 'text-on-tertiary-container bg-tertiary-container/20 text-tertiary'}`}>
//                       {user.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <div className="p-6 bg-surface-container-low/30 flex justify-center">
//             <button className="text-primary text-xs font-bold hover:underline">View All 12,482 Users</button>
//           </div>
//         </div>

//         <div className="col-span-12 lg:col-span-4 space-y-6">
//           <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-indigo-100/10">
//             <div className="flex justify-between items-start mb-6">
//               <div className="flex flex-col items-center flex-1">
//                 <div className="relative">
//                   <img 
//                     src={users[0].image} 
//                     alt={users[0].name} 
//                     className="w-24 h-24 rounded-3xl object-cover shadow-lg"
//                     referrerPolicy="no-referrer"
//                   />
//                   <div className="absolute -bottom-2 -right-2 bg-secondary text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-white">
//                     <BadgeCheck size={14} />
//                   </div>
//                 </div>
//                 <h3 className="mt-4 text-xl font-bold">{users[0].name}</h3>
//                 <p className="text-xs text-on-surface-variant font-medium">{users[0].username}</p>
//               </div>
//               <button className="text-slate-400 hover:text-on-surface">
//                 <MoreHorizontal size={20} />
//               </button>
//             </div>

//             <div className="relative bg-secondary-container/20 rounded-xl p-4 overflow-hidden mb-6">
//               <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>
//               <div className="flex items-start gap-3">
//                 <Bot size={20} className="text-secondary" />
//                 <div>
//                   <p className="text-[11px] font-bold text-on-secondary-container uppercase">AI Curator Analysis</p>
//                   <p className="text-xs text-on-secondary-container leading-relaxed">High host reliability. Consistent 4.9-star ratings across 142 events. No pending reports.</p>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4 mb-6">
//               <div className="bg-surface-container-low p-3 rounded-2xl text-center">
//                 <span className="block text-[10px] text-on-surface-variant font-bold uppercase">Events</span>
//                 <span className="text-lg font-bold">142</span>
//               </div>
//               <div className="bg-surface-container-low p-3 rounded-2xl text-center">
//                 <span className="block text-[10px] text-on-surface-variant font-bold uppercase">Reports</span>
//                 <span className="text-lg font-bold text-secondary">0</span>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <button className="w-full py-3 bg-on-surface text-surface rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">Contact User</button>
//               <div className="grid grid-cols-2 gap-2">
//                 <button className="py-2.5 bg-surface-container-highest text-on-surface rounded-xl text-[10px] font-bold uppercase hover:bg-surface-variant transition-colors">Suspend</button>
//                 <button className="py-2.5 border border-tertiary/20 text-tertiary rounded-xl text-[10px] font-bold uppercase hover:bg-tertiary/5 transition-colors">Ban User</button>
//               </div>
//             </div>
//           </div>

//           <div className="bg-indigo-50/40 rounded-3xl p-6 border border-indigo-100/30">
//             <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Moderator Notes & Log</h4>
//             <div className="space-y-4">
//               <div className="flex gap-3">
//                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
//                   <History size={16} className="text-primary" />
//                 </div>
//                 <div>
//                   <p className="text-xs font-semibold">Account Verified</p>
//                   <p className="text-[11px] text-on-surface-variant">By Admin Marcus V. • Feb 12, 2023</p>
//                 </div>
//               </div>
//               <div className="flex gap-3">
//                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
//                   <MessageSquare size={16} className="text-primary" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-xs font-semibold">Warning Issued: Late Cancellation</p>
//                   <p className="text-[11px] text-on-surface-variant">Internal note: User apologized, technical glitch confirmed. No penalty.</p>
//                   <span className="text-[9px] text-on-surface-variant mt-1 block">Oct 05, 2023</span>
//                 </div>
//               </div>
//             </div>
//             <div className="mt-6 pt-6 border-t border-indigo-100/50">
//               <div className="relative group">
//                 <input className="w-full bg-white border-none rounded-xl text-[11px] focus:ring-2 ring-primary/20 p-3 pr-10 shadow-inner" placeholder="Add internal moderator note..." type="text" />
//                 <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform">
//                   <Send size={14} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Users;
// frontend/src/pages/Users.tsx
// ✅ Real data from MongoDB via backend API
// users + user_stats + events collections combined

import React, { useState, useEffect } from 'react';
import {
  BadgeCheck, MoreHorizontal, Bot, History, MessageSquare,
  Send, RefreshCw, Loader2, Search, Star, Calendar, MapPin,
} from 'lucide-react';

const API_BASE = 'http://localhost:5006';

type User = {
  id: string;
  clerkUserId: string;
  name: string;
  username: string;
  joined: string;
  location: string;
  type: string;
  activity: string;
  lastActive: string;
  reputation: number;
  status: string;
  image: string;
  eventsHosted: number;
  eventsAttended: number;
  rating: number;
  reviewsCount: number;
  totalEarnings: number;
  isBanned: boolean;
  isSuspended: boolean;
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [filterStatus, setFilterStatus] = useState('All');
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState<'Overview' | 'Verification Queue' | 'Flagged History'>('Overview');
const [showAll, setShowAll] = useState(false);
const previewCount = 5;
  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: User[] = await res.json();
      setUsers(data);
      if (data.length > 0 && !selectedUser) setSelectedUser(data[0]);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
      console.error('Failed to load users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  // Filter users
  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.location.toLowerCase().includes(q);
    const matchType = filterType === 'All Types' || u.type === filterType;
    const matchStatus = filterStatus === 'All' || u.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  // Reputation bar color
  const repColor = (rep: number) =>
    rep > 80 ? 'bg-secondary' : rep > 40 ? 'bg-primary' : 'bg-tertiary-container';
  const repTextColor = (rep: number) =>
    rep > 80 ? 'text-secondary' : rep > 40 ? 'text-primary' : 'text-tertiary';

  // Status badge
  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      Active: 'text-on-secondary-container bg-secondary-container',
      Suspended: 'text-tertiary bg-tertiary-container/20',
      Banned: 'text-red-700 bg-red-50',
      Inactive: 'text-on-surface-variant bg-surface-container-highest',
    };
    return map[status] || 'text-on-surface-variant bg-surface-container-highest';
  };

  // Type badge
  const typeBadge = (type: string) =>
    type === 'Host' || type === 'Both'
      ? 'bg-secondary-container/30 text-on-secondary-container'
      : 'bg-surface-variant text-on-surface-variant';

  // Stats for summary
  const totalUsers = users.length;
  const activeCount = users.filter(u => u.status === 'Active').length;
  const hostCount = users.filter(u => u.type === 'Host' || u.type === 'Both').length;
  const suspendedCount = users.filter(u => u.status === 'Suspended' || u.status === 'Banned').length;
const visibleUsers = showAll ? filtered : filtered.slice(0, previewCount);
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Community Hub</h2>
          <p className="text-on-surface-variant text-sm mt-1">Manage, verify and curate platform members.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Summary stats */}
          <div className="hidden sm:flex gap-3">
            {[
              { label: 'Total', val: totalUsers, color: 'text-primary' },
              { label: 'Active', val: activeCount, color: 'text-secondary' },
              { label: 'Hosts', val: hostCount, color: 'text-primary' },
              { label: 'Flagged', val: suspendedCount, color: 'text-tertiary' },
            ].map(s => (
              <div key={s.label} className="bg-surface-container-lowest px-3 py-1.5 rounded-xl border border-indigo-50/20 text-center">
                <p className={`text-lg font-extrabold ${s.color}`}>{isLoading ? '…' : s.val}</p>
                <p className="text-[10px] text-on-surface-variant uppercase font-bold">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tab switcher */}
          <div className="flex bg-surface-container-low p-1 rounded-xl">
            {(['Overview', 'Verification Queue', 'Flagged History'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-surface-container-low p-4 rounded-2xl">
        {/* Search */}
        <div className="flex flex-col gap-1 md:col-span-1">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase px-1">Search</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              className="w-full bg-surface-container-lowest border-none rounded-xl text-sm p-2 pl-8 focus:ring-2 ring-primary/10"
              placeholder="Name, username..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase px-1">Account Type</label>
          <select
            className="bg-surface-container-lowest border-none rounded-xl text-sm focus:ring-2 ring-primary/10 p-2"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
          >
            <option>All Types</option>
            <option>Host</option>
            <option>User</option>
            <option>Both</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase px-1">Status</label>
          <select
            className="bg-surface-container-lowest border-none rounded-xl text-sm focus:ring-2 ring-primary/10 p-2"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option>Active</option>
            <option>Suspended</option>
            <option>Banned</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={loadUsers}
            disabled={isLoading}
            className="flex-1 py-2.5 bg-on-surface text-surface rounded-xl text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </section>

      {/* Error state */}
      {error && (
        <div className="bg-tertiary/5 border border-tertiary/20 rounded-xl p-4 text-sm text-tertiary font-medium">
          ⚠️ {error} — Make sure backend is running on port 5006
        </div>
      )}

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Users Table */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-indigo-50/50">
          {/* Table header */}
          <div className="px-6 py-4 bg-indigo-50/30 flex justify-between items-center border-b border-indigo-50/50">
            <span className="text-sm font-bold text-indigo-900">{filtered.length} of {totalUsers} members</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isLoading ? 'bg-amber-50 text-amber-700' : 'bg-secondary/10 text-secondary'}`}>
              {isLoading ? 'LOADING...' : 'MONGODB LIVE'}
            </span>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-indigo-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Profile</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Activity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Reputation</th>
                <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={28} className="animate-spin text-primary" />
                      <p className="text-sm text-on-surface-variant">Fetching users from MongoDB…</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-on-surface-variant text-sm">
                    {users.length === 0 ? 'No users found. Check backend connection.' : 'No users match your filters.'}
                  </td>
                </tr>
              ) : visibleUsers.map(user => (
                <tr
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`hover:bg-surface-container-low/30 transition-colors cursor-pointer ${selectedUser?.id === user.id ? 'bg-primary/5 border-l-2 border-primary' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover shadow-sm flex-shrink-0"
                        referrerPolicy="no-referrer"
                        onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`; }}
                      />
                      <div>
                        <div className="text-sm font-bold text-on-surface">{user.name}</div>
                        <div className="text-[11px] text-on-surface-variant">
                          {user.username} • Joined {user.joined}
                        </div>
                        <div className="text-[10px] text-on-surface-variant">{user.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeBadge(user.type)}`}>
                      {user.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold">{user.activity}</div>
                    <div className="text-[11px] text-on-surface-variant">Last active: {user.lastActive}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div className={`h-full ${repColor(user.reputation)}`} style={{ width: `${user.reputation}%` }} />
                      </div>
                      <span className={`text-xs font-bold ${repTextColor(user.reputation)}`}>{user.reputation}</span>
                    </div>
                    {user.rating > 0 && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={10} className="text-amber-400 fill-amber-400" />
                        <span className="text-[10px] text-on-surface-variant">{user.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${statusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
<div className="p-6 bg-surface-container-low/30 flex justify-center">

  {!showAll ? (
    <button
      onClick={() => setShowAll(true)}
      className="text-primary font-semibold text-sm hover:underline"
    >
      View All {filtered.length.toLocaleString()} Users
    </button>
  ) : (
    <button
      onClick={() => setShowAll(false)}
      className="text-primary font-semibold text-sm hover:underline"
    >
      Show Less
    </button>
  )}

</div>
          {/* <div className="p-6 bg-surface-container-low/30 flex justify-center">
            <span className="text-on-surface-variant text-xs font-semibold">
              Showing {filtered.length} of {totalUsers} total users from MongoDB
            </span>
          </div> */}
        </div>

        {/* User Detail Panel */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {selectedUser ? (
            <>
              <div className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-indigo-100/10">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col items-center flex-1">
                    <div className="relative">
                      <img
                        src={selectedUser.image}
                        alt={selectedUser.name}
                        className="w-24 h-24 rounded-3xl object-cover shadow-lg"
                        referrerPolicy="no-referrer"
                        onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}&background=6366f1&color=fff&size=128`; }}
                      />
                      {selectedUser.status === 'Active' && (
                        <div className="absolute -bottom-2 -right-2 bg-secondary text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-white">
                          <BadgeCheck size={14} />
                        </div>
                      )}
                    </div>
                    <h3 className="mt-4 text-xl font-bold">{selectedUser.name}</h3>
                    <p className="text-xs text-on-surface-variant font-medium">{selectedUser.username}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-on-surface-variant">
                      <MapPin size={11} /><span>{selectedUser.location}</span>
                    </div>
                    {selectedUser.rating > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-amber-600">{selectedUser.rating.toFixed(1)}</span>
                        <span className="text-xs text-on-surface-variant">({selectedUser.reviewsCount} reviews)</span>
                      </div>
                    )}
                  </div>
                  <button className="text-slate-400 hover:text-on-surface">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                {/* AI Curator Analysis */}
                <div className="relative bg-secondary-container/20 rounded-xl p-4 overflow-hidden mb-6">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary" />
                  <div className="flex items-start gap-3">
                    <Bot size={20} className="text-secondary" />
                    <div>
                      <p className="text-[11px] font-bold text-on-secondary-container uppercase">AI Curator Analysis</p>
                      <p className="text-xs text-on-secondary-container leading-relaxed">
                        {selectedUser.type === 'Host' || selectedUser.type === 'Both'
                          ? `${selectedUser.rating > 4 ? 'High' : selectedUser.rating > 2 ? 'Moderate' : 'Low'} host reliability. ${selectedUser.eventsHosted} events hosted with ${selectedUser.reputation}% reputation score.`
                          : `Regular attendee with ${selectedUser.eventsAttended} events attended. Reputation score: ${selectedUser.reputation}/100.`
                        }
                        {selectedUser.status !== 'Active' ? ` ⚠️ Account is ${selectedUser.status.toLowerCase()}.` : ' No pending reports.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-surface-container-low p-3 rounded-2xl text-center">
                    <span className="block text-[10px] text-on-surface-variant font-bold uppercase">Hosted</span>
                    <span className="text-lg font-bold">{selectedUser.eventsHosted}</span>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-2xl text-center">
                    <span className="block text-[10px] text-on-surface-variant font-bold uppercase">Attended</span>
                    <span className="text-lg font-bold text-primary">{selectedUser.eventsAttended}</span>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-2xl text-center">
                    <span className="block text-[10px] text-on-surface-variant font-bold uppercase">Reputation</span>
                    <span className={`text-lg font-bold ${repTextColor(selectedUser.reputation)}`}>{selectedUser.reputation}</span>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-2xl text-center">
                    <span className="block text-[10px] text-on-surface-variant font-bold uppercase">Status</span>
                    <span className={`text-sm font-bold ${selectedUser.status === 'Active' ? 'text-secondary' : 'text-tertiary'}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>

                {/* Joined + Type info */}
                <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl mb-4">
                  <Calendar size={14} className="text-primary" />
                  <span className="text-xs text-on-surface-variant">Joined {selectedUser.joined}</span>
                  <span className="ml-auto">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeBadge(selectedUser.type)}`}>{selectedUser.type}</span>
                  </span>
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                  <button className="w-full py-3 bg-on-surface text-surface rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">
                    Contact User
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-2.5 bg-surface-container-highest text-on-surface rounded-xl text-[10px] font-bold uppercase hover:bg-surface-variant transition-colors">
                      {selectedUser.isSuspended ? 'Unsuspend' : 'Suspend'}
                    </button>
                    <button className="py-2.5 border border-tertiary/20 text-tertiary rounded-xl text-[10px] font-bold uppercase hover:bg-tertiary/5 transition-colors">
                      {selectedUser.isBanned ? 'Unban' : 'Ban User'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Moderator Notes */}
              <div className="bg-indigo-50/40 rounded-3xl p-6 border border-indigo-100/30">
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Moderator Notes &amp; Log</h4>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <History size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">Account Created</p>
                      <p className="text-[11px] text-on-surface-variant">Joined {selectedUser.joined} • {selectedUser.type}</p>
                    </div>
                  </div>
                  {selectedUser.status !== 'Active' && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center">
                        <MessageSquare size={16} className="text-tertiary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-tertiary">Account {selectedUser.status}</p>
                        <p className="text-[11px] text-on-surface-variant">Review required for account reinstatement.</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6 pt-6 border-t border-indigo-100/50">
                  <div className="relative group">
                    <input
                      className="w-full bg-white border-none rounded-xl text-[11px] focus:ring-2 ring-primary/20 p-3 pr-10 shadow-inner"
                      placeholder="Add internal moderator note..."
                      type="text"
                      value={note}
                      onChange={e => setNote(e.target.value)}
                    />
                    <button
                      onClick={() => setNote('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-surface-container-lowest rounded-3xl p-8 text-center border border-indigo-50/50 shadow-sm">
              <p className="text-on-surface-variant text-sm">Select a user to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;