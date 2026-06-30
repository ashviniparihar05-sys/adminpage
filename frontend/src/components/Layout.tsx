
// // // frontend/src/components/Layout.tsx
// // // ✅ Profile images replaced with initials avatars

// // import React from 'react';
// // import {
// //   Gavel, Users, BarChart3, CreditCard, FileText,
// //   Sparkles, Settings, HelpCircle, Bell, Moon, LayoutGrid,
// //   Plus, CheckCircle2,
// // } from 'lucide-react';
// // import { NavLink, Outlet, useLocation } from 'react-router-dom';
// // import { motion, AnimatePresence } from 'motion/react';

// // const Sidebar = () => {
// //   const navItems = [
// //     { icon: Gavel,        label: 'Moderation',   path: '/moderation' },
// //     { icon: Users,        label: 'Users',         path: '/users' },
// //     { icon: BarChart3,    label: 'Analytics',     path: '/analytics' },
// //     { icon: CreditCard,   label: 'Financials',    path: '/financials' },
// //     { icon: FileText,     label: 'Reports',       path: '/reports' },


// //   ];

// //   return (
// //     <aside className="fixed inset-y-0 left-0 flex flex-col h-screen w-64 bg-indigo-50 dark:bg-slate-900 font-sans antialiased text-sm font-medium border-r border-indigo-100/20">
// //       <div className="p-6">
// //         <h1 className="text-xl font-bold tracking-tight text-indigo-950 dark:text-white">EventHub Admin</h1>
// //         <p className="text-[10px] uppercase tracking-widest text-indigo-700/60 mt-1 font-bold">Intelligent Curator</p>
// //       </div>

// //       <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
// //         {navItems.map((item) => (
// //           <NavLink
// //             key={item.path}
// //             to={item.path}
// //             className={({ isActive }) =>
// //               `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
// //                 isActive
// //                   ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200 scale-[0.99]'
// //                   : 'text-slate-600 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/20'
// //               }`
// //             }
// //           >
// //             <item.icon size={20} />
// //             <span>{item.label}</span>
// //           </NavLink>
// //         ))}
// //       </nav>


// //     </aside>
// //   );
// // };

// // const Header = () => {
// //   const location = useLocation();
// //   const pathSegments = location.pathname.split('/').filter(Boolean);

// //   return (
// //     <header className="h-16 w-full sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl flex justify-between items-center px-8 border-b border-indigo-100/20 shadow-sm">
// //       <nav className="flex text-[10px] text-on-surface-variant font-bold uppercase tracking-widest items-center">
// //         <NavLink to="/" className="hover:text-primary">Dashboard</NavLink>
// //         {pathSegments.map((segment, index) => (
// //           <React.Fragment key={segment}>
// //             <span className="mx-2 text-outline">/</span>
// //             <NavLink
// //               to={`/${pathSegments.slice(0, index + 1).join('/')}`}
// //               className={index === pathSegments.length - 1 ? 'text-on-surface font-extrabold' : 'hover:text-primary'}
// //             >
// //               {segment.replace(/-/g, ' ')}
// //             </NavLink>
// //           </React.Fragment>
// //         ))}
// //       </nav>

// //       <div className="flex items-center gap-6">
// //         <div className="relative cursor-pointer">

// //         </div>


// //       </div>
// //     </header>
// //   );
// // };

// // export default function Layout() {
// //   return (
// //     <div className="min-h-screen bg-surface">
// //       <Sidebar />
// //       <div className="ml-64">
// //         <Header />
// //         <main className="p-8 max-w-7xl mx-auto">
// //           <AnimatePresence mode="wait">
// //             <motion.div
// //               key={useLocation().pathname}
// //               initial={{ opacity: 0, y: 10 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               exit={{ opacity: 0, y: -10 }}
// //               transition={{ duration: 0.2 }}
// //             >
// //               <Outlet />
// //             </motion.div>
// //           </AnimatePresence>
// //         </main>
// //       </div>
// //     </div>
// //   );
// // }


// // frontend/src/components/Layout.tsx
// // ✅ Profile images replaced with initials avatars

// import React from 'react';
// import {
//   Gavel, Users, BarChart3, CreditCard, FileText,
//   Sparkles, Settings, HelpCircle, Bell, Moon, LayoutGrid,
//   Plus, CheckCircle2,
// } from 'lucide-react';
// import { NavLink, Outlet, useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'motion/react';

// const Sidebar = () => {
//   const navItems = [
//     { icon: Gavel,        label: 'Moderation',   path: '/moderation' },
//     { icon: Users,        label: 'Users',         path: '/users' },
//     { icon: BarChart3,    label: 'Analytics',     path: '/analytics' },
//     { icon: CreditCard,   label: 'Financials',    path: '/financials' },
//     { icon: FileText,     label: 'Reports',       path: '/reports' },


//   ];

//   return (
//     <aside className="fixed inset-y-0 left-0 flex flex-col h-screen w-64 bg-indigo-50 dark:bg-slate-900 font-sans antialiased text-sm font-medium border-r border-indigo-100/20">
//       <div className="p-6">
//         <h1 className="text-xl font-bold tracking-tight text-indigo-950 dark:text-white">EventHub Admin</h1>
//         <p className="text-[10px] uppercase tracking-widest text-indigo-700/60 mt-1 font-bold">Intelligent Curator</p>
//       </div>

//       <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
//         {navItems.map((item) => (
//           <NavLink
//             key={item.path}
//             to={item.path}
//             className={({ isActive }) =>
//               `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
//                 isActive
//                   ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200 scale-[0.99]'
//                   : 'text-slate-600 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/20'
//               }`
//             }
//           >
//             <item.icon size={20} />
//             <span>{item.label}</span>
//           </NavLink>
//         ))}
//       </nav>


//     </aside>
//   );
// };

// const Header = () => {
//   const location = useLocation();
//   const pathSegments = location.pathname.split('/').filter(Boolean);

//   return (
//     <header className="h-16 w-full sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl flex justify-between items-center px-8 border-b border-indigo-100/20 shadow-sm">
//       <nav className="flex text-[10px] text-on-surface-variant font-bold uppercase tracking-widest items-center">
//         <NavLink to="/" className="hover:text-primary">Dashboard</NavLink>
//         {pathSegments.map((segment, index) => (
//           <React.Fragment key={segment}>
//             <span className="mx-2 text-outline">/</span>
//             <NavLink
//               to={`/${pathSegments.slice(0, index + 1).join('/')}`}
//               className={index === pathSegments.length - 1 ? 'text-on-surface font-extrabold' : 'hover:text-primary'}
//             >
//               {segment.replace(/-/g, ' ')}
//             </NavLink>
//           </React.Fragment>
//         ))}
//       </nav>

//       <div className="flex items-center gap-6">
//         <div className="relative cursor-pointer">

//         </div>


//       </div>
//     </header>
//   );
// };

// export default function Layout() {
//   return (
//     <div className="min-h-screen bg-surface">
//       <Sidebar />
//       <div className="ml-64">
//         <Header />
//         <main className="p-8 max-w-7xl mx-auto">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={useLocation().pathname}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               transition={{ duration: 0.2 }}
//             >
//               <Outlet />
//             </motion.div>
//           </AnimatePresence>
//         </main>
//       </div>
//     </div>
//   );
// } 
// frontend/src/components/Layout.tsx

import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Gavel, Users, BarChart3, CreditCard, FileText, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const navItems = [
  { icon: Gavel, label: 'Moderation', path: '/moderation' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: CreditCard, label: 'Financials', path: '/financials' },
  { icon: FileText, label: 'Reports', path: '/reports' },
];

const Sidebar = ({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean, setIsCollapsed: any }) => (
  <aside className={`fixed inset-y-0 left-0 flex flex-col bg-slate-900 border-r border-white/[0.06] transition-all duration-300 z-50 ${isCollapsed ? 'w-[72px]' : 'w-[220px]'}`}>
    <div className={`px-4 border-b border-white/[0.06] flex items-center h-[72px] overflow-hidden ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
      {!isCollapsed && (
        <div className="whitespace-nowrap flex flex-col justify-center">
          <h1 className="text-[15px] font-medium text-slate-100 tracking-tight">EventHub Admin</h1>
          <p className="text-[9px] uppercase tracking-[0.12em] text-blue-400 mt-0.5 font-medium">Intelligent Curator</p>
        </div>
      )}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
      </button>
    </div>

    <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto overflow-x-hidden">
      {navItems.map(({ icon: Icon, label, path }) => (
        <NavLink
          key={path}
          to={path}
          title={isCollapsed ? label : undefined}
          className={({ isActive }) =>
            `flex items-center px-3 py-2.5 rounded-lg text-[13px] transition-all duration-150 ${isCollapsed ? 'justify-center' : 'gap-2.5'} ${isActive
              ? 'bg-blue-500/[0.18] text-blue-300'
              : 'text-slate-400 hover:bg-blue-500/10 hover:text-blue-200'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={isCollapsed ? 19 : 17} className="flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 whitespace-nowrap">{label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />}
                </>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  </aside>
);

const Header = () => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  return (
    <header className="h-[52px] sticky top-4 z-40 mx-4 md:mx-6 mt-4 bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-slate-200/60 flex justify-between items-center px-5 transition-all duration-300">
      <nav className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] font-medium text-slate-400">
        <NavLink to="/" className="hover:text-blue-600 transition-colors">
          Dashboard
        </NavLink>
        {segments.map((seg, i) => (
          <React.Fragment key={seg}>
            <span className="opacity-30">/</span>
            <NavLink
              to={`/${segments.slice(0, i + 1).join('/')}`}
              className={
                i === segments.length - 1
                  ? 'text-slate-800 font-bold'
                  : 'hover:text-blue-600 transition-colors'
              }
            >
              {seg.replace(/-/g, ' ')}
            </NavLink>
          </React.Fragment>
        ))}
      </nav>
      <div className="flex items-center">
        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm cursor-pointer hover:bg-slate-200 transition-colors">
          AD
        </div>
      </div>
    </header>
  );
};

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`transition-all duration-300 ${isCollapsed ? 'ml-[72px]' : 'ml-[220px]'}`}>
        <Header />
        <main className="p-6 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={useLocation().pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}