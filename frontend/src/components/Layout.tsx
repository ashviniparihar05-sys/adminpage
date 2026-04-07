// import React from 'react';
// import { 
//   Gavel, 
//   Users, 
//   BarChart3, 
//   CreditCard, 
//   FileText, 
//   Sparkles, 
//   Settings, 
//   HelpCircle,
//   Bell,
//   Moon,
//   LayoutGrid,
//   Search,
//   ExternalLink,
//   Edit3,
//   MapPin,
//   Bot,
//   AlertTriangle,
//   Layers,
//   Send,
//   CheckCircle2,
//   Undo2,
//   XCircle,
//   Filter,
//   BadgeCheck,
//   Eye,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   History,
//   MessageSquare,
//   MoreHorizontal,
//   Shield,
//   AlertCircle,
//   Activity,
//   Wallet,
//   TrendingUp,
//   Calendar,
//   UserPlus,
//   CalendarDays,
//   Ban,
//   TrendingDown
// } from 'lucide-react';
// import { NavLink, Outlet, useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'motion/react';

// const Sidebar = () => {
//   const navItems = [
//     { icon: Gavel, label: 'Moderation', path: '/moderation' },
//     { icon: Users, label: 'Users', path: '/users' },
//     { icon: BarChart3, label: 'Analytics', path: '/analytics' },
//     { icon: CreditCard, label: 'Financials', path: '/financials' },
//     { icon: FileText, label: 'Reports', path: '/reports' },
//   ];

//   return (
//     <aside className="fixed inset-y-0 left-0 flex flex-col h-screen w-64 bg-indigo-50 dark:bg-slate-900 font-sans antialiased text-sm font-medium border-r border-indigo-100/20">
//       <div className="p-6">
//         <h1 className="text-xl font-bold tracking-tight text-indigo-950 dark:text-white">EventHub Admin</h1>
//         <p className="text-[10px] uppercase tracking-widest text-indigo-700/60 mt-1 font-bold">Intelligent Curator</p>
//       </div>
      
//       <nav className="flex-1 px-4 space-y-1">
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

//       <div className="p-4 mt-auto border-t border-indigo-100/50">
//         <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-primary-container text-on-primary-container shadow-lg shadow-primary/10">
//           <Sparkles size={18} />
//           <span className="font-semibold">AI Insights</span>
//         </div>
        
//         <a className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-indigo-100 rounded-lg transition-colors" href="#">
//           <Settings size={18} />
//           <span>Settings</span>
//         </a>
//         <a className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-indigo-100 rounded-lg transition-colors" href="#">
//           <HelpCircle size={18} />
//           <span>Help</span>
//         </a>

//         <div className="flex items-center gap-3 mt-6 px-4 py-2 border-t border-indigo-100/50 pt-4">
//           <img 
//             src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqegx9hARHWwajc48cLGs0vsNfAlhfl_hiohmiYV7rnHJdbUU3cwkduqhcfRLm_Ur7GBs7yR38xdmEla2IkT6zhWn5d7vLsKJKiz-3Dk034ZY9q0vR8MdaplyHVaKjCU5AgO0gvCmEnfCItcqr8OK2ihwH6bB_9hM-pZVZZtCoCFPHd4fzcrIry0N6QvdzcnAGtK8ZxF4ZEbbdzA6rottEim6chLwon6gBBBNV7UtGANq5HlSqrcmWkzDJ1SZDSIu9e21gbGJEnWQ" 
//             alt="Admin" 
//             className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
//             referrerPolicy="no-referrer"
//           />
//           <div className="flex flex-col overflow-hidden">
//             <span className="text-xs font-bold text-slate-900 dark:text-white truncate">Marcus Vane</span>
//             <span className="text-[10px] text-slate-500 truncate">Chief Moderator</span>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// };

// const Header = () => {
//   const location = useLocation();
//   const pathSegments = location.pathname.split('/').filter(Boolean);

//   return (
//     <header className="h-16 w-full sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl flex justify-between items-center px-8 border-b border-indigo-100/20 shadow-sm">
//       <div className="flex items-center gap-4">
//         <nav className="flex text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
//           <NavLink to="/" className="hover:text-primary">Dashboard</NavLink>
//           {pathSegments.map((segment, index) => (
//             <React.Fragment key={segment}>
//               <span className="mx-2 text-outline">/</span>
//               <NavLink 
//                 to={`/${pathSegments.slice(0, index + 1).join('/')}`}
//                 className={index === pathSegments.length - 1 ? 'text-on-surface font-extrabold' : 'hover:text-primary'}
//               >
//                 {segment.replace(/-/g, ' ')}
//               </NavLink>
//             </React.Fragment>
//           ))}
//         </nav>
//       </div>
      
//       <div className="flex items-center gap-6">
//         <div className="relative group cursor-pointer">
//           <Bell size={20} className="text-on-surface-variant hover:text-primary transition-colors" />
//           <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
//         </div>
//         <Moon size={20} className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors" />
//         <LayoutGrid size={20} className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors" />
        
//         <div className="flex items-center gap-3 pl-4 border-l border-indigo-100/30">
//           <div className="text-right hidden sm:block">
//             <p className="text-sm font-bold leading-tight">Sarah Jenkins</p>
//             <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Lead Curator</p>
//           </div>
//           <img 
//             src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPr0XzAiml2aFuuo3vnsy2d7rx5Cdd-6yaMvQZpbC3SATe7aMNkcNFSH0S2vIEmUEcoaMTQAcgF1pBRa-jtkey-WvWbLo7PPc4Hsa4H2IlALKlPmuTywjbSp7oFrMNAO4N8wnZRtsZkxfbfNg5FCzjVtH4_ECb_7liuz0AoJ0RtAM8zpdOErwkTqlOVposTXM7D09y8UcDBkFZcCa3rkjQ9_Z_MnkJ4P-IiOwXeKhuKvejJkS2gTgQhHKwaCFsLSeyPdkv_hE-45Y" 
//             alt="Profile" 
//             className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100"
//             referrerPolicy="no-referrer"
//           />
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
// ✅ Create Event + Live Events nav items added

import React from 'react';
import {
  Gavel, Users, BarChart3, CreditCard, FileText,
  Sparkles, Settings, HelpCircle, Bell, Moon, LayoutGrid,
  Plus, CheckCircle2,
} from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const Sidebar = () => {
  const navItems = [
    { icon: Gavel,        label: 'Moderation',   path: '/moderation' },
    { icon: Users,        label: 'Users',         path: '/users' },
    { icon: BarChart3,    label: 'Analytics',     path: '/analytics' },
    { icon: CreditCard,   label: 'Financials',    path: '/financials' },
    { icon: FileText,     label: 'Reports',       path: '/reports' },
    { icon: CheckCircle2, label: 'Live Events',   path: '/events/approved' },
    { icon: Plus,         label: 'Create Event',  path: '/events/create' },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 flex flex-col h-screen w-64 bg-indigo-50 dark:bg-slate-900 font-sans antialiased text-sm font-medium border-r border-indigo-100/20">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight text-indigo-950 dark:text-white">EventHub Admin</h1>
        <p className="text-[10px] uppercase tracking-widest text-indigo-700/60 mt-1 font-bold">Intelligent Curator</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200 scale-[0.99]'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/20'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-indigo-100/50">
        <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-primary-container text-on-primary-container shadow-lg shadow-primary/10">
          <Sparkles size={18} />
          <span className="font-semibold">AI Insights</span>
        </div>
        <a className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-indigo-100 rounded-lg transition-colors" href="#">
          <Settings size={18} /><span>Settings</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-indigo-100 rounded-lg transition-colors" href="#">
          <HelpCircle size={18} /><span>Help</span>
        </a>
        <div className="flex items-center gap-3 mt-6 px-4 py-2 border-t border-indigo-100/50 pt-4">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqegx9hARHWwajc48cLGs0vsNfAlhfl_hiohmiYV7rnHJdbUU3cwkduqhcfRLm_Ur7GBs7yR38xdmEla2IkT6zhWn5d7vLsKJKiz-3Dk034ZY9q0vR8MdaplyHVaKjCU5AgO0gvCmEnfCItcqr8OK2ihwH6bB_9hM-pZVZZtCoCFPHd4fzcrIry0N6QvdzcnAGtK8ZxF4ZEbbdzA6rottEim6chLwon6gBBBNV7UtGANq5HlSqrcmWkzDJ1SZDSIu9e21gbGJEnWQ"
            alt="Admin" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" referrerPolicy="no-referrer"
          />
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">Marcus Vane</span>
            <span className="text-[10px] text-slate-500 truncate">Chief Moderator</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

const Header = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <header className="h-16 w-full sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl flex justify-between items-center px-8 border-b border-indigo-100/20 shadow-sm">
      <nav className="flex text-[10px] text-on-surface-variant font-bold uppercase tracking-widest items-center">
        <NavLink to="/" className="hover:text-primary">Dashboard</NavLink>
        {pathSegments.map((segment, index) => (
          <React.Fragment key={segment}>
            <span className="mx-2 text-outline">/</span>
            <NavLink
              to={`/${pathSegments.slice(0, index + 1).join('/')}`}
              className={index === pathSegments.length - 1 ? 'text-on-surface font-extrabold' : 'hover:text-primary'}
            >
              {segment.replace(/-/g, ' ')}
            </NavLink>
          </React.Fragment>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer">
          <Bell size={20} className="text-on-surface-variant hover:text-primary transition-colors" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full border-2 border-white" />
        </div>
        <Moon size={20} className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors" />
        <LayoutGrid size={20} className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors" />
        <div className="flex items-center gap-3 pl-4 border-l border-indigo-100/30">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-tight">Sarah Jenkins</p>
            <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Lead Curator</p>
          </div>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPr0XzAiml2aFuuo3vnsy2d7rx5Cdd-6yaMvQZpbC3SATe7aMNkcNFSH0S2vIEmUEcoaMTQAcgF1pBRa-jtkey-WvWbLo7PPc4Hsa4H2IlALKlPmuTywjbSp7oFrMNAO4N8wnZRtsZkxfbfNg5FCzjVtH4_ECb_7liuz0AoJ0RtAM8zpdOErwkTqlOVposTXM7D09y8UcDBkFZcCa3rkjQ9_Z_MnkJ4P-IiOwXeKhuKvejJkS2gTgQhHKwaCFsLSeyPdkv_hE-45Y"
            alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100" referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
};

export default function Layout() {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={useLocation().pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}