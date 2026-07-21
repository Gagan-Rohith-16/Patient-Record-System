import React from 'react';
import {
  Activity,
  Users,
  BedDouble,
  Calendar,
  Pill,
  TestTube,
  Receipt,
  Sparkles,
  Search,
  Plus,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'patients'
  | 'beds'
  | 'appointments'
  | 'pharmacy'
  | 'labs'
  | 'billing'
  | 'ai';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenNewAdmission: () => void;
  onResetData: () => void;
  emergencyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenNewAdmission,
  onResetData,
  emergencyCount,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Activity className="w-4 h-4" /> },
    { id: 'patients', label: 'Patients & EHR', icon: <Users className="w-4 h-4" /> },
    { id: 'beds', label: 'Bed & Ward Map', icon: <BedDouble className="w-4 h-4" /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" /> },
    { id: 'pharmacy', label: 'Pharmacy & RX', icon: <Pill className="w-4 h-4" /> },
    { id: 'labs', label: 'Lab & Diagnostics', icon: <TestTube className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing & Claims', icon: <Receipt className="w-4 h-4" /> },
    { id: 'ai', label: 'AI Clinical Hub', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
  ];

  return (
    <header className="glass sticky top-0 z-40 bg-white/40 backdrop-blur-xl border-b border-white/60 shadow-sm text-slate-800">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-slate-800 tracking-tight leading-none">
                  MediFlow
                </h1>
                <span className="bg-blue-600/10 text-blue-700 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
                  Health Systems
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Patient Record & Operations</p>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient records..."
                className="w-full bg-white/40 border border-white/60 rounded-full pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/70 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            {emergencyCount > 0 && (
              <button
                onClick={() => setActiveTab('patients')}
                className="hidden sm:flex items-center gap-1.5 bg-rose-500/15 border border-rose-300 text-rose-700 text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-rose-500/25 transition-colors animate-pulse"
                title="Critical Emergency Alerts"
              >
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{emergencyCount} Emergency</span>
              </button>
            )}

            <button
              onClick={onOpenNewAdmission}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Admission</span>
            </button>

            <button
              onClick={onResetData}
              title="Reset Demo Data"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white/50 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-white/40 pt-1.5 pb-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white/70 text-blue-600 border border-white/80 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-white/30 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
