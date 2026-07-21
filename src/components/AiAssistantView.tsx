import React, { useState } from 'react';
import { Sparkles, FileText, AlertTriangle, Pill, LogOut, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { Patient } from '../types';

interface AiAssistantViewProps {
  patients: Patient[];
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ patients }) => {
  const [activeTool, setActiveTool] = useState<'triage' | 'notes' | 'pharmacy' | 'discharge'>('triage');

  // Tool 1: Triage Assistant State
  const [triagePatientId, setTriagePatientId] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('Substernal chest tightness radiating to left arm with diaphoresis');
  const [hr, setHr] = useState('110');
  const [sysBp, setSysBp] = useState('155');
  const [diaBp, setDiaBp] = useState('95');
  const [temp, setTemp] = useState('99.0');
  const [spo2, setSpo2] = useState('94');
  const [loadingTriage, setLoadingTriage] = useState(false);
  const [triageResult, setTriageResult] = useState('');

  // Tool 2: Notes Summarizer State
  const [rawNoteText, setRawNoteText] = useState(
    'Patient admitted with severe shortness of breath and fever. Auscultation reveals bilateral crepitations. ABG shows mild hypoxemia. Started on supplemental oxygen and IV broad-spectrum antibiotics. Blood cultures drawn.'
  );
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [notesSummaryResult, setNotesSummaryResult] = useState('');

  // Tool 3: Drug Interaction State
  const [proposedDrug, setProposedDrug] = useState('Warfarin 5mg');
  const [existingMeds, setExistingMeds] = useState('Aspirin 81mg, Clopidogrel 75mg');
  const [knownAllergies, setKnownAllergies] = useState('Penicillin');
  const [loadingDrugCheck, setLoadingDrugCheck] = useState(false);
  const [drugCheckResult, setDrugCheckResult] = useState('');

  // Tool 4: Discharge Doc State
  const [dischargePatientName, setDischargePatientName] = useState('Eleanor Vance');
  const [dischargeDiagnosis, setDischargeDiagnosis] = useState('Acute STEMI post primary PCI with drug-eluting stent');
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const [dischargeDocResult, setDischargeDocResult] = useState('');

  // Call API 1: Triage
  const handleRunTriage = async () => {
    if (!chiefComplaint) return;
    setLoadingTriage(true);
    try {
      const selectedP = patients.find((p) => p.id === triagePatientId);
      const res = await fetch('/api/ai/triage-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chiefComplaint,
          patientAge: selectedP?.age || 55,
          patientGender: selectedP?.gender || 'Male',
          preExisting: selectedP?.chronicConditions.join(', ') || 'Hypertension',
          vitals: { heartRate: hr, bloodPressure: `${sysBp}/${diaBp}`, temp, spo2 },
        }),
      });
      const data = await res.json();
      if (data.triageAnalysis) setTriageResult(data.triageAnalysis);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTriage(false);
    }
  };

  // Call API 2: Notes Summarizer
  const handleRunNoteSummarizer = async () => {
    if (!rawNoteText) return;
    setLoadingNotes(true);
    try {
      const res = await fetch('/api/ai/summarize-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: 'Clinical Patient',
          notesText: rawNoteText,
        }),
      });
      const data = await res.json();
      if (data.summary) setNotesSummaryResult(data.summary);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingNotes(false);
    }
  };

  // Call API 3: Drug Interaction
  const handleRunDrugCheck = async () => {
    if (!proposedDrug) return;
    setLoadingDrugCheck(true);
    try {
      const res = await fetch('/api/ai/check-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newMedication: proposedDrug,
          existingMedications: existingMeds.split(','),
          knownAllergies: knownAllergies.split(','),
        }),
      });
      const data = await res.json();
      if (data.safetyAnalysis) setDrugCheckResult(data.safetyAnalysis);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDrugCheck(false);
    }
  };

  // Call API 4: Discharge Summary
  const handleRunDischargeGen = async () => {
    setLoadingDischarge(true);
    try {
      const res = await fetch('/api/ai/discharge-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: dischargePatientName,
          age: 64,
          gender: 'Female',
          diagnosis: dischargeDiagnosis,
          admissionDate: '2026-07-19',
          dischargeDate: '2026-07-21',
          prescriptions: [
            { name: 'Ticagrelor', dosage: '90mg', frequency: 'Twice daily' },
            { name: 'Atorvastatin', dosage: '80mg', frequency: 'Bedtime' },
          ],
        }),
      });
      const data = await res.json();
      if (data.dischargeDocument) setDischargeDocResult(data.dischargeDocument);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDischarge(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" /> AI Clinical Intelligence Hub
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Powered by Gemini AI for emergency triage, clinical note summarization, drug safety, and discharge reports
          </p>
        </div>
      </div>

      {/* Tool Switcher */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { id: 'triage', label: '1. ER Symptom Triage', icon: <AlertTriangle className="w-4 h-4 text-rose-600" /> },
          { id: 'notes', label: '2. SOAP Note Summarizer', icon: <FileText className="w-4 h-4 text-blue-600" /> },
          { id: 'pharmacy', label: '3. Drug Interaction Check', icon: <Pill className="w-4 h-4 text-emerald-600" /> },
          { id: 'discharge', label: '4. Discharge Generator', icon: <LogOut className="w-4 h-4 text-amber-600" /> },
        ].map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id as any)}
            className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer shadow-sm ${
              activeTool === tool.id
                ? 'glass bg-white/90 border-blue-300 text-blue-900 shadow-md ring-2 ring-blue-400/20'
                : 'bg-white/40 border-white/60 text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            {tool.icon}
            <span>{tool.label}</span>
          </button>
        ))}
      </div>

      {/* TOOL 1: ER TRIAGE */}
      {activeTool === 'triage' && (
        <div className="glass rounded-3xl p-6 space-y-5">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" /> Emergency Triage & Preliminary Diagnostic AI Assister
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Select Hospital Patient (Optional)</label>
              <select
                value={triagePatientId}
                onChange={(e) => setTriagePatientId(e.target.value)}
                className="w-full glass-input rounded-xl p-2.5 text-slate-800"
              >
                <option value="">-- Custom Intake --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} ({p.age}y {p.gender})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Chief Complaint & Present Symptoms</label>
              <textarea
                rows={2}
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="w-full glass-input rounded-xl p-2.5 text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">HR (bpm)</label>
                <input
                  type="number"
                  value={hr}
                  onChange={(e) => setHr(e.target.value)}
                  className="w-full glass-input rounded-xl p-2 text-slate-800 font-semibold"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Systolic BP</label>
                <input
                  type="number"
                  value={sysBp}
                  onChange={(e) => setSysBp(e.target.value)}
                  className="w-full glass-input rounded-xl p-2 text-slate-800 font-semibold"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Diastolic BP</label>
                <input
                  type="number"
                  value={diaBp}
                  onChange={(e) => setDiaBp(e.target.value)}
                  className="w-full glass-input rounded-xl p-2 text-slate-800 font-semibold"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Temp (°F)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  className="w-full glass-input rounded-xl p-2 text-slate-800 font-semibold"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">SpO2 (%)</label>
                <input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value)}
                  className="w-full glass-input rounded-xl p-2 text-slate-800 font-semibold"
                />
              </div>
            </div>

            <button
              onClick={handleRunTriage}
              disabled={loadingTriage}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              {loadingTriage ? 'Evaluating Triage Risk with Gemini AI...' : 'Evaluate Triage Priority & Test Orders'}
            </button>
          </div>

          {triageResult && (
            <div className="bg-white/60 border border-white/80 p-5 rounded-2xl space-y-2 text-xs leading-relaxed text-slate-800 shadow-sm">
              <h4 className="font-bold text-sm text-rose-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> AI Emergency Triage Assessment:
              </h4>
              <div className="whitespace-pre-line bg-white/70 p-4 rounded-xl border border-white/90 text-slate-800 font-medium">
                {triageResult}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 2: SOAP NOTES SUMMARIZER */}
      {activeTool === 'notes' && (
        <div className="glass rounded-3xl p-6 space-y-5">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" /> Clinical Progress Note Handover Summarizer
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Paste Full Clinical / Consultation Notes</label>
              <textarea
                rows={5}
                value={rawNoteText}
                onChange={(e) => setRawNoteText(e.target.value)}
                className="w-full glass-input rounded-xl p-3 text-slate-800"
              />
            </div>

            <button
              onClick={handleRunNoteSummarizer}
              disabled={loadingNotes}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              {loadingNotes ? 'Generating Handover Summary...' : 'Summarize for Doctor Shift Handover'}
            </button>
          </div>

          {notesSummaryResult && (
            <div className="bg-white/60 border border-white/80 p-5 rounded-2xl space-y-2 text-xs leading-relaxed text-slate-800 shadow-sm">
              <h4 className="font-bold text-sm text-blue-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Structured Shift Handover Summary:
              </h4>
              <div className="whitespace-pre-line bg-white/70 p-4 rounded-xl border border-white/90 text-slate-800 font-medium">
                {notesSummaryResult}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 3: DRUG INTERACTION CHECK */}
      {activeTool === 'pharmacy' && (
        <div className="glass rounded-3xl p-6 space-y-5">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Pill className="w-4 h-4 text-emerald-600" /> Multi-Drug Interaction & Allergy Safety Evaluator
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Proposed New Drug</label>
              <input
                type="text"
                value={proposedDrug}
                onChange={(e) => setProposedDrug(e.target.value)}
                className="w-full glass-input rounded-xl p-2.5 text-slate-800 font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Patient's Existing Active Medications (Comma separated)</label>
              <input
                type="text"
                value={existingMeds}
                onChange={(e) => setExistingMeds(e.target.value)}
                className="w-full glass-input rounded-xl p-2.5 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Known Drug Allergies</label>
              <input
                type="text"
                value={knownAllergies}
                onChange={(e) => setKnownAllergies(e.target.value)}
                className="w-full glass-input rounded-xl p-2.5 text-slate-800"
              />
            </div>

            <button
              onClick={handleRunDrugCheck}
              disabled={loadingDrugCheck}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              {loadingDrugCheck ? 'Checking Safety with Gemini AI...' : 'Run Pharmacological Interaction Check'}
            </button>
          </div>

          {drugCheckResult && (
            <div className="bg-white/60 border border-white/80 p-5 rounded-2xl space-y-2 text-xs leading-relaxed text-slate-800 shadow-sm">
              <h4 className="font-bold text-sm text-emerald-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> AI Pharmacological Safety Report:
              </h4>
              <div className="whitespace-pre-line bg-white/70 p-4 rounded-xl border border-white/90 text-slate-800 font-medium">
                {drugCheckResult}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 4: DISCHARGE SUMMARY */}
      {activeTool === 'discharge' && (
        <div className="glass rounded-3xl p-6 space-y-5">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <LogOut className="w-4 h-4 text-amber-600" /> Patient-Friendly Discharge Document Generator
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Patient Name</label>
              <input
                type="text"
                value={dischargePatientName}
                onChange={(e) => setDischargePatientName(e.target.value)}
                className="w-full glass-input rounded-xl p-2.5 text-slate-800 font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Primary Discharge Diagnosis</label>
              <input
                type="text"
                value={dischargeDiagnosis}
                onChange={(e) => setDischargeDiagnosis(e.target.value)}
                className="w-full glass-input rounded-xl p-2.5 text-slate-800"
              />
            </div>

            <button
              onClick={handleRunDischargeGen}
              disabled={loadingDischarge}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              {loadingDischarge ? 'Drafting Discharge Document...' : 'Generate Discharge Document'}
            </button>
          </div>

          {dischargeDocResult && (
            <div className="bg-white/60 border border-white/80 p-5 rounded-2xl space-y-2 text-xs leading-relaxed text-slate-800 shadow-sm">
              <h4 className="font-bold text-sm text-amber-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Generated Hospital Discharge Summary:
              </h4>
              <div className="whitespace-pre-line bg-white/70 p-4 rounded-xl border border-white/90 text-slate-800 font-medium">
                {dischargeDocResult}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
