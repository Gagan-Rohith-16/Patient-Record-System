import React, { useState } from 'react';
import { Pill, Plus, AlertTriangle, Sparkles, ShieldCheck, Search, CheckCircle2, X } from 'lucide-react';
import { Prescription, Patient, Doctor } from '../types';

interface PharmacyViewProps {
  prescriptions: Prescription[];
  patients: Patient[];
  doctors: Doctor[];
  onAddPrescription: (rx: Prescription) => void;
}

interface MedicationStock {
  name: string;
  category: string;
  dosage: string;
  stock: number;
  unit: string;
  warningStock: number;
}

const INITIAL_MEDICATIONS: MedicationStock[] = [
  { name: 'Ticagrelor (Brilinta)', category: 'Antiplatelet', dosage: '90 mg', stock: 450, unit: 'tablets', warningStock: 100 },
  { name: 'Atorvastatin', category: 'Statin', dosage: '80 mg', stock: 820, unit: 'tablets', warningStock: 150 },
  { name: 'Regular Insulin (Humulin R)', category: 'Antidiabetic', dosage: '100 U/mL', stock: 24, unit: 'vials', warningStock: 30 },
  { name: 'Albuterol Nebulizer', category: 'Bronchodilator', dosage: '2.5 mg/3mL', stock: 120, unit: 'amps', warningStock: 50 },
  { name: 'Amoxicillin / Clavulanate', category: 'Antibiotic', dosage: '875 mg', stock: 320, unit: 'tablets', warningStock: 100 },
  { name: 'Heparin Sodium', category: 'Anticoagulant', dosage: '5000 U/mL', stock: 42, unit: 'vials', warningStock: 25 },
  { name: 'Metformin', category: 'Antidiabetic', dosage: '500 mg', stock: 1100, unit: 'tablets', warningStock: 200 },
  { name: 'Lisopril', category: 'ACE Inhibitor', dosage: '10 mg', stock: 680, unit: 'tablets', warningStock: 100 },
];

export const PharmacyView: React.FC<PharmacyViewProps> = ({
  prescriptions,
  patients,
  doctors,
  onAddPrescription,
}) => {
  const [showAddRxModal, setShowAddRxModal] = useState(false);
  const [rxSearch, setRxSearch] = useState('');

  // New Rx State
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]?.name || '');
  const [medicationName, setMedicationName] = useState('Ticagrelor (Brilinta)');
  const [dosage, setDosage] = useState('90 mg');
  const [frequency, setFrequency] = useState('Twice daily');
  const [route, setRoute] = useState('Oral');
  const [instructions, setInstructions] = useState('Take with or without food');
  const [isEvaluatingAi, setIsEvaluatingAi] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  // Check Allergy Warning
  const allergyWarning =
    selectedPatient && medicationName
      ? selectedPatient.allergies.find((a) => medicationName.toLowerCase().includes(a.toLowerCase()))
      : null;

  // AI Safety Analysis Call
  const handleRunAiSafetyCheck = async () => {
    if (!medicationName || !selectedPatient) return;

    setIsEvaluatingAi(true);
    try {
      const res = await fetch('/api/ai/check-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newMedication: `${medicationName} ${dosage}`,
          existingMedications: prescriptions.filter((p) => p.patientId === selectedPatient.id).map((p) => p.medicationName),
          knownAllergies: selectedPatient.allergies,
          chronicConditions: selectedPatient.chronicConditions.join(', '),
        }),
      });
      const data = await res.json();
      if (data.safetyAnalysis) {
        setAiAnalysis(data.safetyAnalysis);
      }
    } catch (err) {
      console.error('AI check error:', err);
    } finally {
      setIsEvaluatingAi(false);
    }
  };

  const handleSavePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const newRx: Prescription = {
      id: `RX-${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      doctorName: selectedDoctor,
      date: new Date().toISOString().split('T')[0],
      medicationName,
      dosage,
      frequency,
      route,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'Active',
      instructions,
      refillsRemaining: 3,
      allergyWarning: allergyWarning ? `Patient allergic to ${allergyWarning}` : undefined,
    };

    onAddPrescription(newRx);
    setShowAddRxModal(false);
    setAiAnalysis('');
  };

  const filteredRx = prescriptions.filter(
    (p) =>
      !rxSearch ||
      p.medicationName.toLowerCase().includes(rxSearch.toLowerCase()) ||
      p.patientName?.toLowerCase().includes(rxSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Pill className="w-5 h-5 text-emerald-600" /> Hospital Pharmacy & E-Prescription Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Pharmaceutical inventory and digital doctor prescriptions</p>
        </div>

        <button
          onClick={() => setShowAddRxModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Issue E-Prescription
        </button>
      </div>

      {/* Medication Inventory Stock Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Hospital Medication Inventory Stock</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {INITIAL_MEDICATIONS.map((med, idx) => {
            const isLow = med.stock <= med.warningStock;
            return (
              <div
                key={idx}
                className={`glass rounded-2xl p-3 space-y-1 shadow-sm ${
                  isLow ? 'bg-amber-50/60 border-amber-200' : ''
                }`}
              >
                <p className="text-[11px] font-bold text-slate-800 truncate">{med.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">{med.dosage}</p>
                <div className="flex items-baseline justify-between pt-1">
                  <span className={`text-sm font-extrabold font-mono ${isLow ? 'text-amber-800' : 'text-emerald-700'}`}>
                    {med.stock}
                  </span>
                  <span className="text-[10px] text-slate-500">{med.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Prescriptions Table */}
      <div className="glass rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-bold text-slate-800 text-sm">Active Patient Prescriptions</h3>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={rxSearch}
              onChange={(e) => setRxSearch(e.target.value)}
              placeholder="Search prescription or patient..."
              className="w-full glass-input rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRx.map((rx) => (
            <div key={rx.id} className="bg-white/50 border border-white/70 rounded-2xl p-4 space-y-3 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{rx.medicationName}</h4>
                  <p className="text-xs text-blue-700 font-bold">{rx.patientName}</p>
                </div>
                <span className="status-pill bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {rx.status}
                </span>
              </div>

              <div className="text-xs space-y-1 text-slate-700 bg-white/60 p-3 rounded-xl border border-white/80">
                <p>
                  <span className="text-slate-500 font-medium">Dosage:</span> <span className="font-semibold">{rx.dosage}</span> ({rx.frequency})
                </p>
                <p>
                  <span className="text-slate-500 font-medium">Instructions:</span> {rx.instructions}
                </p>
                <p>
                  <span className="text-slate-500 font-medium">Prescribed by:</span> {rx.doctorName}
                </p>
              </div>

              {rx.allergyWarning && (
                <p className="text-[11px] font-bold text-rose-700 bg-rose-100/80 border border-rose-200 p-2.5 rounded-xl flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> {rx.allergyWarning}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ISSUE E-PRESCRIPTION MODAL */}
      {showAddRxModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass bg-white/80 border border-white/80 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-white/60 pb-3">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-600" /> Issue E-Prescription
              </h3>
              <button onClick={() => setShowAddRxModal(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePrescription} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Select Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 text-slate-800 font-semibold"
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

              {/* Patient Allergy Warning Badge */}
              {selectedPatient && selectedPatient.allergies.length > 0 && (
                <div className="bg-rose-100 border border-rose-200 p-2.5 rounded-xl text-rose-800">
                  <p className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Known Allergies:
                  </p>
                  <p className="text-[11px] mt-0.5">{selectedPatient.allergies.join(', ')}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Medication Name</label>
                  <input
                    type="text"
                    value={medicationName}
                    onChange={(e) => setMedicationName(e.target.value)}
                    required
                    className="w-full glass-input rounded-xl p-2.5 text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Dosage</label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    required
                    className="w-full glass-input rounded-xl p-2.5 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Frequency</label>
                  <input
                    type="text"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    required
                    className="w-full glass-input rounded-xl p-2.5 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Route</label>
                  <select
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    className="w-full glass-input rounded-xl p-2.5 text-slate-800"
                  >
                    <option value="Oral">Oral</option>
                    <option value="IV Continuous">IV Continuous</option>
                    <option value="Inhalation">Inhalation</option>
                    <option value="Subcutaneous">Subcutaneous</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Special Instructions</label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 text-slate-800"
                />
              </div>

              {/* AI Drug Interaction Check Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleRunAiSafetyCheck}
                  disabled={isEvaluatingAi || !selectedPatient}
                  className="w-full bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  {isEvaluatingAi ? 'Analyzing Interactions with Gemini AI...' : 'Run Gemini AI Drug Safety & Allergy Check'}
                </button>
              </div>

              {aiAnalysis && (
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-amber-900 text-xs space-y-1">
                  <p className="font-bold flex items-center gap-1 text-amber-800">
                    <ShieldCheck className="w-4 h-4 text-amber-600" /> AI Pharmacologist Safety Report:
                  </p>
                  <p className="whitespace-pre-line leading-relaxed">{aiAnalysis}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-white/60">
                <button
                  type="button"
                  onClick={() => setShowAddRxModal(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2 rounded-xl shadow-sm cursor-pointer"
                >
                  Issue E-Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
