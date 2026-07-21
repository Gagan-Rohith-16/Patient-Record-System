import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  ShieldAlert,
  ChevronRight,
  UserCheck,
  Grid,
  List,
  Activity,
  X,
  Phone,
  Mail,
  Home,
  Building,
} from 'lucide-react';
import { Patient, TriageCategory, AdmissionStatus } from '../types';

interface PatientsViewProps {
  patients: Patient[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenPatientModal: (patient: Patient) => void;
  onAddPatient: (newPatient: Patient) => void;
  doctors: { name: string; department: string }[];
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  searchQuery,
  setSearchQuery,
  onOpenPatientModal,
  onAddPatient,
  doctors,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [triageFilter, setTriageFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Patient Registration State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('45');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [dob, setDob] = useState('1981-05-12');
  const [bloodGroup, setBloodGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('O+');
  const [phone, setPhone] = useState('+1 (555) 000-1234');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('123 Main Street');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('BlueCross Premier');
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('BC-10029');
  const [triageCategory, setTriageCategory] = useState<TriageCategory>('routine');
  const [admissionStatus, setAdmissionStatus] = useState<AdmissionStatus>('Admitted');
  const [department, setDepartment] = useState('Cardiology');
  const [primaryPhysician, setPrimaryPhysician] = useState('Dr. Sarah Jenkins, MD');
  const [allergiesText, setAllergiesText] = useState('');

  // Filter Logic
  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      p.mrn.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q) ||
      p.wardRoomBed.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || p.admissionStatus === statusFilter;
    const matchesTriage = triageFilter === 'ALL' || p.triageCategory === triageFilter;

    return matchesQuery && matchesStatus && matchesTriage;
  });

  // Handle New Registration
  const handleSubmitNewPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const newMrn = `HSP-${Math.floor(10000 + Math.random() * 90000)}`;

    const newPatient: Patient = {
      id: `PAT-${Date.now()}`,
      mrn: newMrn,
      firstName,
      lastName,
      age: parseInt(age) || 30,
      gender,
      dob,
      bloodGroup,
      phone,
      email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      address,
      emergencyContact: {
        name: emergencyName || 'Family Contact',
        relationship: 'Relative',
        phone: emergencyPhone || phone,
      },
      insuranceProvider,
      insurancePolicyNumber,
      triageCategory,
      admissionStatus,
      department,
      wardRoomBed: `${department} Ward-Bed-0${Math.floor(1 + Math.random() * 8)}`,
      primaryPhysician,
      admissionDate: new Date().toISOString(),
      allergies: allergiesText ? allergiesText.split(',').map((a) => a.trim()) : [],
      chronicConditions: [],
      preExistingHistory: 'New patient intake admission.',
      familyHistory: 'Not documented.',
    };

    onAddPatient(newPatient);
    setShowAddModal(false);

    // Reset Form
    setFirstName('');
    setLastName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="glass rounded-3xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" /> Electronic Health Records (EHR) Directory
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {filteredPatients.length} patient records found matching criteria
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="bg-white/40 border border-white/60 rounded-xl p-1 flex items-center gap-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'cards' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid Cards View"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> New Admission
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/40">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, MRN, department, room..."
              className="w-full glass-input rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="glass-input rounded-xl text-xs text-slate-800 px-3 py-1.5 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Admitted">Admitted</option>
              <option value="ICU">ICU</option>
              <option value="Emergency">Emergency</option>
              <option value="Outpatient">Outpatient</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>

          {/* Triage Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Triage:</span>
            <select
              value={triageFilter}
              onChange={(e) => setTriageFilter(e.target.value)}
              className="glass-input rounded-xl text-xs text-slate-800 px-3 py-1.5 focus:outline-none"
            >
              <option value="ALL">All Triage Levels</option>
              <option value="emergency">Emergency (Red)</option>
              <option value="urgent">Urgent (Yellow)</option>
              <option value="routine">Routine (Green)</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="glass rounded-3xl overflow-hidden shadow-sm border border-white/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-white/60">
                <tr>
                  <th className="py-3.5 px-4">Patient Name & MRN</th>
                  <th className="py-3.5 px-4">Age / Gender / Blood</th>
                  <th className="py-3.5 px-4">Triage Priority</th>
                  <th className="py-3.5 px-4">Admission Status</th>
                  <th className="py-3.5 px-4">Department & Bed</th>
                  <th className="py-3.5 px-4">Attending Physician</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40 text-slate-800">
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    onClick={() => onOpenPatientModal(patient)}
                    className="glass-row cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center border border-blue-200">
                          {patient.firstName[0]}
                          {patient.lastName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">
                            {patient.firstName} {patient.lastName}
                          </p>
                          <p className="font-mono text-[11px] text-slate-500">{patient.mrn}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">
                        {patient.age} yrs • {patient.gender}
                      </p>
                      <p className="text-slate-500 font-semibold">Blood: {patient.bloodGroup}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`status-pill ${
                          patient.triageCategory === 'emergency'
                            ? 'bg-rose-100 text-rose-700 border border-rose-200 animate-pulse'
                            : patient.triageCategory === 'urgent'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {patient.triageCategory}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-full border border-blue-200">
                        {patient.admissionStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{patient.department}</p>
                      <p className="text-slate-500 text-[11px]">{patient.wardRoomBed}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-700">{patient.primaryPhysician}</p>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button className="bg-white/60 hover:bg-white text-blue-600 font-bold px-3 py-1.5 rounded-xl border border-white/80 transition-colors inline-flex items-center gap-1 shadow-sm cursor-pointer">
                        View EHR <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => onOpenPatientModal(patient)}
              className="glass rounded-3xl p-5 space-y-4 cursor-pointer hover:bg-white/70 transition-all shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center border border-blue-200 text-base shadow-sm">
                    {patient.firstName[0]}
                    {patient.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <p className="font-mono text-xs text-slate-500">{patient.mrn}</p>
                  </div>
                </div>

                <span
                  className={`status-pill ${
                    patient.triageCategory === 'emergency'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : patient.triageCategory === 'urgent'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {patient.triageCategory}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-white/40 p-3.5 rounded-2xl border border-white/60">
                <div>
                  <span className="text-slate-500 block text-[11px] font-medium">Age & Gender</span>
                  <span className="font-semibold text-slate-800">
                    {patient.age} yrs • {patient.gender}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px] font-medium">Blood Group</span>
                  <span className="font-bold text-rose-600">{patient.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px] font-medium">Department</span>
                  <span className="font-semibold text-slate-800">{patient.department}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px] font-medium">Room / Bed</span>
                  <span className="font-bold text-blue-700">{patient.wardRoomBed}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500 font-medium">Physician: {patient.primaryPhysician.split(',')[0]}</span>
                <span className="text-blue-600 font-bold flex items-center gap-1">
                  Open Records <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NEW PATIENT ADMISSION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass bg-white/80 border border-white/80 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-white/60 pb-4">
              <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" /> New Patient Intake Registration
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewPatient} className="space-y-4 pt-4 overflow-y-auto pr-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="e.g. John"
                    className="w-full glass-input rounded-xl p-2.5 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="e.g. Doe"
                    className="w-full glass-input rounded-xl p-2.5 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    className="w-full glass-input rounded-xl p-2.5 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full glass-input rounded-xl p-2.5 text-slate-800"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as any)}
                    className="w-full glass-input rounded-xl p-2.5 text-slate-800"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full glass-input rounded-xl p-2.5 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full glass-input rounded-xl p-2.5 text-slate-800"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Surgery">Surgery</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Pediatrics">Pediatrics</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Triage Priority</label>
                  <select
                    value={triageCategory}
                    onChange={(e) => setTriageCategory(e.target.value as any)}
                    className="w-full glass-input rounded-xl p-2.5 text-slate-800 font-semibold"
                  >
                    <option value="routine">Routine (Green)</option>
                    <option value="urgent">Urgent (Yellow)</option>
                    <option value="emergency">Emergency (Red)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Attending Physician</label>
                  <select
                    value={primaryPhysician}
                    onChange={(e) => setPrimaryPhysician(e.target.value)}
                    className="w-full glass-input rounded-xl p-2.5 text-slate-800"
                  >
                    {doctors.map((d, i) => (
                      <option key={i} value={d.name}>
                        {d.name} ({d.department})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Drug Allergies (Comma separated)</label>
                <input
                  type="text"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  placeholder="e.g. Penicillin, Sulfa, Latex"
                  className="w-full glass-input rounded-xl p-2.5 text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/60">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl shadow-sm cursor-pointer"
                >
                  Register Patient Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
