import React from 'react';
import {
  Users,
  BedDouble,
  Calendar,
  AlertTriangle,
  UserCheck,
  Plus,
  Pill,
  TestTube,
  Sparkles,
  Activity,
  ArrowUpRight,
  Clock,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Patient, BedItem, Appointment, Doctor } from '../types';

interface DashboardViewProps {
  patients: Patient[];
  beds: BedItem[];
  appointments: Appointment[];
  doctors: Doctor[];
  onOpenNewAdmission: () => void;
  onOpenPatientModal: (patient: Patient) => void;
  onNavigateTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patients,
  beds,
  appointments,
  doctors,
  onOpenNewAdmission,
  onOpenPatientModal,
  onNavigateTab,
}) => {
  // Key Stats Calculations
  const totalPatients = patients.length;
  const admittedCount = patients.filter((p) => p.admissionStatus !== 'Discharged').length;

  const totalBeds = beds.length;
  const occupiedBeds = beds.filter((b) => b.status === 'Occupied').length;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const todayAppointments = appointments.length;
  const emergencyPatients = patients.filter(
    (p) => p.triageCategory === 'emergency' && p.admissionStatus !== 'Discharged'
  );
  const availableDoctors = doctors.filter((d) => d.status === 'Available').length;

  // Department Occupancy Stats
  const wards = Array.from(new Set(beds.map((b) => b.wardName)));
  const wardStats = wards.map((ward) => {
    const wardBeds = beds.filter((b) => b.wardName === ward);
    const occupied = wardBeds.filter((b) => b.status === 'Occupied').length;
    return {
      ward,
      total: wardBeds.length,
      occupied,
      percentage: wardBeds.length > 0 ? Math.round((occupied / wardBeds.length) * 100) : 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Patients */}
        <div className="glass rounded-3xl p-5 space-y-2 hover:bg-white/60 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Patients</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">{totalPatients}</span>
            <span className="text-xs text-slate-500 font-medium">({admittedCount} admitted)</span>
          </div>
          <p className="text-[11px] text-slate-500">Active records in hospital system</p>
        </div>

        {/* Bed Occupancy */}
        <div className="glass rounded-3xl p-5 space-y-2 hover:bg-white/60 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ward Occupancy</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">{occupancyRate}%</span>
            <span className="text-xs text-slate-500">
              ({occupiedBeds}/{totalBeds} beds)
            </span>
          </div>
          <div className="w-full bg-white/60 rounded-full h-1.5 overflow-hidden border border-white/60">
            <div
              className={`h-full rounded-full ${
                occupancyRate > 85 ? 'bg-rose-500' : occupancyRate > 60 ? 'bg-amber-500' : 'bg-blue-600'
              }`}
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="glass rounded-3xl p-5 space-y-2 hover:bg-white/60 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Appointments</span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">{todayAppointments}</span>
            <span className="text-xs text-slate-500">Scheduled today</span>
          </div>
          <p className="text-[11px] text-slate-500">OPD & Specialist consultations</p>
        </div>

        {/* Critical Emergency Triage */}
        <div className="glass rounded-3xl p-5 space-y-2 hover:bg-white/60 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Emergency Triage</span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-600">{emergencyPatients.length}</span>
            <span className="status-pill bg-rose-100 text-rose-700">Critical</span>
          </div>
          <p className="text-[11px] text-slate-500">Requires high-priority care</p>
        </div>

        {/* Doctors Available */}
        <div className="glass rounded-3xl p-5 space-y-2 hover:bg-white/60 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Doctors</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">{availableDoctors}</span>
            <span className="text-xs text-slate-500">/ {doctors.length} On Duty</span>
          </div>
          <p className="text-[11px] text-slate-500">Available across wards</p>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="glass rounded-3xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Quick Actions & Workflows</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            onClick={onOpenNewAdmission}
            className="glass-row p-3.5 rounded-2xl text-xs font-semibold text-slate-800 transition-all text-left flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-800 font-bold">New Admission</p>
              <p className="text-[10px] text-slate-500">Register intake</p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('appointments')}
            className="glass-row p-3.5 rounded-2xl text-xs font-semibold text-slate-800 transition-all text-left flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-800 font-bold">Book OPD</p>
              <p className="text-[10px] text-slate-500">Doctor slots</p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('pharmacy')}
            className="glass-row p-3.5 rounded-2xl text-xs font-semibold text-slate-800 transition-all text-left flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-800 font-bold">E-Prescribe</p>
              <p className="text-[10px] text-slate-500">Rx generator</p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('labs')}
            className="glass-row p-3.5 rounded-2xl text-xs font-semibold text-slate-800 transition-all text-left flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <TestTube className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-800 font-bold">Order Lab Test</p>
              <p className="text-[10px] text-slate-500">Blood/imaging</p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('ai')}
            className="glass-row p-3.5 rounded-2xl text-xs font-semibold text-slate-800 transition-all text-left flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-800 font-bold">AI Clinical Hub</p>
              <p className="text-[10px] text-slate-500">Triage & notes</p>
            </div>
          </button>
        </div>
      </div>

      {/* Grid Layout for Critical Emergency Board & Ward Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Critical Emergency Triage List */}
        <div className="lg:col-span-2 glass rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/50 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 animate-pulse" />
              <h3 className="font-bold text-slate-800 text-base">Critical Triage & Emergency Alerts</h3>
            </div>
            <button
              onClick={() => onNavigateTab('patients')}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold uppercase tracking-wider cursor-pointer"
            >
              View All Patients <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {emergencyPatients.length > 0 ? (
              emergencyPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => onOpenPatientModal(patient)}
                  className="glass-row p-4 rounded-2xl flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 font-bold text-sm flex items-center justify-center border border-rose-200 shadow-sm">
                      {patient.firstName[0]}
                      {patient.lastName[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 text-sm">
                          {patient.firstName} {patient.lastName}
                        </h4>
                        <span className="text-[10px] font-mono bg-white/60 text-slate-600 px-2 py-0.5 rounded-md border border-white/80">
                          {patient.mrn}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {patient.age} yrs • {patient.gender} • {patient.department} ({patient.wardRoomBed})
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="status-pill bg-rose-100 text-rose-700 border border-rose-200">
                      HIGH RISK
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center justify-end gap-1 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" /> Dr: {patient.primaryPhysician.split(',')[0]}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic py-6 text-center">No critical emergency alerts currently.</p>
            )}
          </div>
        </div>

        {/* Department Ward Occupancy Breakdown */}
        <div className="glass rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/50 pb-3">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-blue-600" /> Ward Bed Distribution
            </h3>
            <button
              onClick={() => onNavigateTab('beds')}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold uppercase tracking-wider cursor-pointer"
            >
              Bed Map <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {wardStats.map((stat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800">{stat.ward}</span>
                  <span className="text-slate-500 font-mono">
                    {stat.occupied} / {stat.total} beds ({stat.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-white/60 rounded-full h-2 overflow-hidden border border-white/70">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stat.percentage >= 80 ? 'bg-rose-500' : stat.percentage >= 50 ? 'bg-blue-600' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
