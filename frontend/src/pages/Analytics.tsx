import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  BarChart3, 
  Activity, 
  Shield, 
  AlertCircle, 
  UserPlus, 
  CalendarDays, 
  Ban, 
  CheckCircle2, 
  Sparkles,
  Search,
  Filter,
  Gavel
} from 'lucide-react';

const Analytics = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-extrabold tracking-tight text-on-surface">Platform Analytics</h3>
          <p className="text-on-surface-variant text-sm mt-1">Real-time health metrics and curator insights.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-highest px-4 py-2 rounded-xl text-sm font-semibold text-primary flex items-center gap-2 hover:bg-surface-variant transition-colors">
            <Calendar size={16} />
            Last 30 Days
          </button>
          <button className="bg-gradient-to-r from-primary to-primary-container text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Bookings', value: '24,892', change: '+12%', icon: BarChart3, color: 'text-primary', bg: 'bg-indigo-50', trend: 'up' },
          { label: 'Revenue', value: '$1.2M', change: '+8%', icon: Activity, color: 'text-primary', bg: 'bg-indigo-50', trend: 'up' },
          { label: 'Active Hosts', value: '3,410', change: '+4%', icon: UserPlus, color: 'text-primary', bg: 'bg-indigo-50', trend: 'up' },
          { label: 'Flagged Events', value: '182', change: '-15%', icon: AlertCircle, color: 'text-tertiary', bg: 'bg-tertiary-fixed', trend: 'down' },
          { label: 'Abuse Trends', value: 'Elevated', change: 'Alert', icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'alert' },
        ].map((kpi, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-xl space-y-4 shadow-sm border border-indigo-50/50 hover:border-indigo-100 transition-all">
            <div className="flex justify-between items-start">
              <div className={`p-2 ${kpi.bg} rounded-lg ${kpi.color}`}>
                <kpi.icon size={20} />
              </div>
              <span className={`text-xs font-bold flex items-center gap-1 ${kpi.trend === 'up' ? 'text-secondary' : kpi.trend === 'down' ? 'text-tertiary' : 'text-amber-600'}`}>
                {kpi.change} 
                {kpi.trend === 'up' && <TrendingUp size={12} />}
                {kpi.trend === 'down' && <TrendingDown size={12} />}
                {kpi.trend === 'alert' && <AlertCircle size={12} className="fill-amber-600 text-white" />}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{kpi.label}</p>
              <h4 className="text-2xl font-bold mt-1">{kpi.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-indigo-50/50">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h5 className="text-lg font-bold text-on-surface">Revenue Performance</h5>
              <p className="text-sm text-on-surface-variant">Comparison between revenue and volume</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                <span className="text-xs font-medium text-on-surface-variant">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary"></span>
                <span className="text-xs font-medium text-on-surface-variant">Bookings</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-1 group">
            {[40, 55, 45, 75, 60, 85, 50, 40, 65, 95, 70, 60].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
                <div 
                  className={`w-full rounded-t-lg transition-all duration-300 cursor-pointer relative ${i === 3 ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-surface-container hover:bg-primary/20'}`} 
                  style={{ height: `${h}%` }}
                >
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <span key={m}>{m}</span>)}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-surface-container-low rounded-xl p-8 relative overflow-hidden shadow-sm border border-indigo-50/50">
          <h5 className="text-lg font-bold text-on-surface mb-2">Location Moderation</h5>
          <p className="text-sm text-on-surface-variant mb-6">Density of reported incidents by region.</p>
          <div className="relative h-64 bg-surface-container-highest rounded-lg overflow-hidden group border border-indigo-100/30">
            <img 
              src="https://picsum.photos/seed/map/800/600" 
              alt="World Map" 
              className="w-full h-full object-cover opacity-20 grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-error/20 rounded-full animate-pulse flex items-center justify-center">
              <div className="w-4 h-4 bg-error rounded-full shadow-lg shadow-error/50"></div>
            </div>
            <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-amber-500/20 rounded-full animate-pulse flex items-center justify-center">
              <div className="w-3 h-3 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50"></div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant">North America</span>
              <span className="font-bold text-on-surface">42 High Risk</span>
            </div>
            <div className="w-full bg-surface-container-highest h-1 rounded-full">
              <div className="bg-error w-3/4 h-full rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
