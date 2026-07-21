import React, { useState } from 'react';
import { BedDouble, User, Activity, AlertCircle, CheckCircle2, RefreshCw, X, LogOut, ChevronRight } from 'lucide-react';
import { BedItem, Patient } from '../types';

interface BedWardViewProps {
  beds: BedItem[];
  patients: Patient[];
  onUpdateBeds: (beds: BedItem[]) => void;
  onOpenPatientModal: (patient: Patient) => void;
}

export const BedWardView: React.FC<BedWardViewProps> = ({
  beds,
  patients,
  onUpdateBeds,
  onOpenPatientModal,
}) => {
  const [selectedWard, setSelectedWard] = useState<string>('ALL');
  const [showAssignModal, setShowAssignModal] = useState<BedItem | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  const wards = ['ALL', 'ICU', 'Emergency Ward', 'Cardiology Unit', 'General Ward', 'Pediatric Ward', 'Surgical Suite'];

  const filteredBeds = selectedWard === 'ALL' ? beds : beds.filter((b) => b.wardName === selectedWard);

  // Unassigned Patients (Admitted but no bed assigned or need relocation)
  const unassignedPatients = patients.filter((p) => p.admissionStatus !== 'Discharged');

  // Handle Bed Assignment
  const handleAssignBedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAssignModal || !selectedPatientId) return;

    const targetPatient = patients.find((p) => p.id === selectedPatientId);
    if (!targetPatient) return;

    const updatedBeds = beds.map((b) => {
      if (b.id === showAssignModal.id) {
        return {
          ...b,
          status: 'Occupied' as const,
          patientId: targetPatient.id,
          patientName: `${targetPatient.firstName} ${targetPatient.lastName}`,
          mrn: targetPatient.mrn,
          admissionDate: new Date().toISOString().split('T')[0],
          attendingDoctor: targetPatient.primaryPhysician,
        };
      }
      return b;
    });

    onUpdateBeds(updatedBeds);
    setShowAssignModal(null);
    setSelectedPatientId('');
  };

  // Handle Freeing / Discharging Bed
  const handleFreeBed = (bedId: string) => {
    if (!confirm('Are you sure you want to release and mark this bed for cleaning?')) return;

    const updatedBeds = beds.map((b) => {
      if (b.id === bedId) {
        return {
          ...b,
          status: 'Available' as const,
          patientId: undefined,
          patientName: undefined,
          mrn: undefined,
          admissionDate: undefined,
          attendingDoctor: undefined,
        };
      }
      return b;
    });

    onUpdateBeds(updatedBeds);
  };

  return (
    <div className="space-y-6">
      {/* Header & Ward Selector */}
      <div className="glass rounded-3xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-blue-600" /> Ward Bed Allocation & Occupancy Map
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time monitoring of hospital inpatient beds across departments
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-rose-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Occupied
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-amber-800">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Cleaning / Maintenance
            </span>
          </div>
        </div>

        {/* Ward Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 border-t border-white/40">
          {wards.map((ward) => (
            <button
              key={ward}
              onClick={() => setSelectedWard(ward)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedWard === ward
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white/40 text-slate-700 hover:bg-white/70 border border-white/60'
              }`}
            >
              {ward}
            </button>
          ))}
        </div>
      </div>

      {/* Bed Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBeds.map((bed) => {
          const isOccupied = bed.status === 'Occupied';
          const isAvailable = bed.status === 'Available';
          const isMaintenance = bed.status === 'Maintenance';

          const matchingPatient = patients.find((p) => p.id === bed.patientId);

          return (
            <div
              key={bed.id}
              className={`glass rounded-3xl p-5 space-y-4 transition-all shadow-sm ${
                isOccupied
                  ? 'bg-rose-50/40 border-rose-200'
                  : isAvailable
                  ? 'hover:bg-white/70 border-white/70'
                  : 'bg-amber-50/40 border-amber-200'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">{bed.wardName}</span>
                  <h3 className="font-bold text-slate-800 text-base font-mono">{bed.bedNumber}</h3>
                </div>

                <span
                  className={`status-pill ${
                    isOccupied
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : isAvailable
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {bed.status}
                </span>
              </div>

              {/* Patient Details if Occupied */}
              {isOccupied && bed.patientName ? (
                <div className="bg-white/50 p-3.5 rounded-2xl border border-white/70 space-y-2 text-xs shadow-inner">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-800 text-sm">{bed.patientName}</p>
                    <span className="font-mono text-[11px] text-slate-500">{bed.mrn}</span>
                  </div>
                  <p className="text-slate-500">Admitted: {bed.admissionDate}</p>
                  <p className="text-blue-700 font-semibold">Physician: {bed.attendingDoctor}</p>

                  <div className="flex gap-2 pt-2 border-t border-white/60">
                    {matchingPatient && (
                      <button
                        onClick={() => onOpenPatientModal(matchingPatient)}
                        className="flex-1 bg-blue-100 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 py-1.5 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer"
                      >
                        View EHR
                      </button>
                    )}
                    <button
                      onClick={() => handleFreeBed(bed.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                      title="Release Bed"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : isAvailable ? (
                <div className="py-4 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">Bed is disinfected & ready</p>
                  <button
                    onClick={() => setShowAssignModal(bed)}
                    className="bg-emerald-100 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200 font-bold px-4 py-2 rounded-xl text-xs transition-all w-full cursor-pointer shadow-sm"
                  >
                    Assign Inpatient
                  </button>
                </div>
              ) : (
                <div className="py-4 text-center space-y-1">
                  <RefreshCw className="w-8 h-8 text-amber-600 mx-auto animate-spin" />
                  <p className="text-xs text-amber-800 font-semibold">Sanitizing / Maintenance</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ASSIGN BED MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass bg-white/80 border border-white/80 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-white/60 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Assign Inpatient to Bed</h3>
                <p className="text-xs text-slate-500">
                  {showAssignModal.wardName} - {showAssignModal.bedNumber}
                </p>
              </div>
              <button onClick={() => setShowAssignModal(null)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignBedSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 mb-1.5 font-semibold">Select Patient to Allocate</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 text-slate-800"
                  required
                >
                  <option value="">-- Choose Admitted Patient --</option>
                  {unassignedPatients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.mrn}) - {p.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/60">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(null)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2 rounded-xl shadow-sm cursor-pointer"
                >
                  Confirm Bed Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
