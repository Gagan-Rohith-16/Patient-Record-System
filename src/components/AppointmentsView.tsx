import React, { useState } from 'react';
import { Calendar, Plus, Clock, User, CheckCircle2, XCircle, Search, Filter, X } from 'lucide-react';
import { Appointment, Doctor, Patient } from '../types';

interface AppointmentsViewProps {
  appointments: Appointment[];
  doctors: Doctor[];
  patients: Patient[];
  onAddAppointment: (apt: Appointment) => void;
  onUpdateAppointment: (apt: Appointment) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  doctors,
  patients,
  onAddAppointment,
  onUpdateAppointment,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showBookModal, setShowBookModal] = useState(false);

  // New Appointment Form State
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDoctorName, setSelectedDoctorName] = useState(doctors[0]?.name || '');
  const [department, setDepartment] = useState('Cardiology');
  const [appointmentType, setAppointmentType] = useState<Appointment['type']>('In-Person Consultation');
  const [dateTime, setDateTime] = useState('2026-07-21T11:00');
  const [reason, setReason] = useState('');

  const filteredAppointments = appointments.filter(
    (a) => filterStatus === 'ALL' || a.status === filterStatus
  );

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === selectedPatientId);
    if (!patient) return;

    const newApt: Appointment = {
      id: `APT-${Date.now()}`,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientPhone: patient.phone,
      doctorName: selectedDoctorName,
      department,
      dateTime: new Date(dateTime).toISOString(),
      type: appointmentType,
      status: 'Scheduled',
      reason: reason || 'Routine OPD Consultation',
      roomNumber: 'Suite 302',
    };

    onAddAppointment(newApt);
    setShowBookModal(false);
    setReason('');
  };

  const handleStatusChange = (apt: Appointment, newStatus: Appointment['status']) => {
    onUpdateAppointment({ ...apt, status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> Outpatient (OPD) & Specialist Schedule
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage doctor appointments and consultation time slots</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="glass-input rounded-xl text-xs text-slate-800 px-3 py-2 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button
            onClick={() => setShowBookModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Book Appointment
          </button>
        </div>
      </div>

      {/* Appointment Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppointments.map((apt) => (
          <div key={apt.id} className="glass rounded-3xl p-5 space-y-4 shadow-sm hover:bg-white/70 transition-all">
            <div className="flex items-start justify-between border-b border-white/60 pb-3">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">{apt.type}</span>
                <h3 className="font-bold text-slate-800 text-base">{apt.patientName}</h3>
                <p className="text-xs text-slate-500">{apt.patientPhone}</p>
              </div>

              <span
                className={`status-pill ${
                  apt.status === 'Scheduled'
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : apt.status === 'In-Progress'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                    : apt.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-100 text-rose-700 border border-rose-200'
                }`}
              >
                {apt.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-700 flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-blue-600" /> <span className="font-bold">{apt.doctorName}</span> (
                {apt.department})
              </p>
              <p className="text-slate-700 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> {new Date(apt.dateTime).toLocaleString()}
              </p>
              <p className="text-slate-600 bg-white/50 p-3 rounded-2xl border border-white/70">
                Reason: {apt.reason}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-white/60">
              {apt.status === 'Scheduled' && (
                <button
                  onClick={() => handleStatusChange(apt, 'In-Progress')}
                  className="flex-1 bg-amber-100 hover:bg-amber-600 text-amber-800 hover:text-white border border-amber-200 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Start Consultation
                </button>
              )}
              {apt.status === 'In-Progress' && (
                <button
                  onClick={() => handleStatusChange(apt, 'Completed')}
                  className="flex-1 bg-emerald-100 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Mark Completed
                </button>
              )}
              {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                <button
                  onClick={() => handleStatusChange(apt, 'Cancelled')}
                  className="px-3 bg-white/50 hover:bg-rose-100 text-slate-600 hover:text-rose-700 py-1.5 rounded-xl text-xs font-semibold border border-white/70 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* BOOK APPOINTMENT MODAL */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass bg-white/80 border border-white/80 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-white/60 pb-3">
              <h3 className="font-bold text-slate-800 text-base">Book Doctor Appointment</h3>
              <button onClick={() => setShowBookModal(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Select Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 text-slate-800"
                  required
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.mrn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Select Doctor</label>
                <select
                  value={selectedDoctorName}
                  onChange={(e) => {
                    setSelectedDoctorName(e.target.value);
                    const doc = doctors.find((d) => d.name === e.target.value);
                    if (doc) setDepartment(doc.department);
                  }}
                  className="w-full glass-input rounded-xl p-2.5 text-slate-800"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} - {d.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Appointment Type</label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value as any)}
                  className="w-full glass-input rounded-xl p-2.5 text-slate-800"
                >
                  <option value="In-Person Consultation">In-Person Consultation</option>
                  <option value="Telehealth">Telehealth</option>
                  <option value="Follow-Up">Follow-Up</option>
                  <option value="Routine Checkup">Routine Checkup</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Date & Time</label>
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Reason for Visit</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Follow up on BP medications"
                  className="w-full glass-input rounded-xl p-2.5 text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/60">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl shadow-sm cursor-pointer"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
