import React, { useState } from 'react';
import { TestTube, Plus, Search, CheckCircle2, AlertCircle, Clock, X } from 'lucide-react';
import { LabReport, Patient, Doctor } from '../types';

interface LabDiagnosticsViewProps {
  labReports: LabReport[];
  patients: Patient[];
  doctors: Doctor[];
  onAddLabReport: (report: LabReport) => void;
  onUpdateLabReport: (report: LabReport) => void;
}

export const LabDiagnosticsView: React.FC<LabDiagnosticsViewProps> = ({
  labReports,
  patients,
  doctors,
  onAddLabReport,
  onUpdateLabReport,
}) => {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedLabResultModal, setSelectedLabResultModal] = useState<LabReport | null>(null);

  // New Order State
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [testName, setTestName] = useState('Complete Blood Count (CBC)');
  const [category, setCategory] = useState<LabReport['category']>('Hematology');
  const [requestingDoctor, setRequestingDoctor] = useState(doctors[0]?.name || '');

  // Result Entry State
  const [param1Name, setParam1Name] = useState('WBC Count');
  const [param1Val, setParam1Val] = useState('8.5');
  const [param1Unit, setParam1Unit] = useState('x10^3/uL');
  const [param1Range, setParam1Range] = useState('4.5 - 11.0');

  const [param2Name, setParam2Name] = useState('Hemoglobin');
  const [param2Val, setParam2Val] = useState('14.2');
  const [param2Unit, setParam2Unit] = useState('g/dL');
  const [param2Range, setParam2Range] = useState('12.0 - 15.5');

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === selectedPatientId);
    if (!patient) return;

    const newReport: LabReport = {
      id: `LAB-${Date.now()}`,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      testName,
      category,
      orderDate: new Date().toISOString(),
      status: 'Ordered',
      requestingDoctor,
      labTechnician: 'Pending Assignment',
      resultsSummary: 'Awaiting lab specimen processing',
    };

    onAddLabReport(newReport);
    setShowOrderModal(false);
  };

  const handleSaveResults = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLabResultModal) return;

    const updated: LabReport = {
      ...selectedLabResultModal,
      status: 'Completed',
      resultDate: new Date().toISOString(),
      labTechnician: 'Senior CLS Technician',
      resultsSummary: 'Lab analysis completed and verified.',
      values: [
        {
          parameter: param1Name,
          value: param1Val,
          unit: param1Unit,
          normalRange: param1Range,
          status: 'normal',
        },
        {
          parameter: param2Name,
          value: param2Val,
          unit: param2Unit,
          normalRange: param2Range,
          status: 'normal',
        },
      ],
    };

    onUpdateLabReport(updated);
    setSelectedLabResultModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <TestTube className="w-5 h-5 text-amber-600" /> Laboratory & Diagnostic Reports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">STAT pathology, biochemistry, and radiology processing</p>
        </div>

        <button
          onClick={() => setShowOrderModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Request STAT Lab Test
        </button>
      </div>

      {/* Lab Order Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {labReports.map((lab) => (
          <div key={lab.id} className="glass rounded-3xl p-5 space-y-4 shadow-sm hover:bg-white/70 transition-all">
            <div className="flex items-start justify-between border-b border-white/60 pb-3">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">{lab.category}</span>
                <h3 className="font-bold text-slate-800 text-base">{lab.testName}</h3>
                <p className="text-xs text-blue-700 font-bold">{lab.patientName}</p>
              </div>

              <span
                className={`status-pill ${
                  lab.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : lab.status === 'In Progress'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {lab.status}
              </span>
            </div>

            <div className="text-xs space-y-1.5 text-slate-700 bg-white/50 p-3.5 rounded-2xl border border-white/70">
              <p>
                <span className="text-slate-500 font-medium">Requesting Doctor:</span> {lab.requestingDoctor}
              </p>
              <p>
                <span className="text-slate-500 font-medium">Ordered:</span> {new Date(lab.orderDate).toLocaleString()}
              </p>
              {lab.resultsSummary && (
                <p>
                  <span className="text-slate-500 font-medium">Summary:</span> {lab.resultsSummary}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-white/60 flex justify-end">
              {lab.status !== 'Completed' ? (
                <button
                  onClick={() => setSelectedLabResultModal(lab)}
                  className="bg-amber-100 hover:bg-amber-600 text-amber-800 hover:text-white border border-amber-200 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                >
                  Enter Lab Results
                </button>
              ) : (
                <button
                  onClick={() => setSelectedLabResultModal(lab)}
                  className="bg-white/60 hover:bg-white text-blue-600 font-bold px-3 py-1.5 rounded-xl border border-white/80 transition-colors cursor-pointer shadow-sm"
                >
                  View Parameters
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* REQUEST LAB MODAL */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass bg-white/80 border border-white/80 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-white/60 pb-3">
              <h3 className="font-bold text-slate-800 text-base">Request STAT Lab Order</h3>
              <button onClick={() => setShowOrderModal(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-3 text-xs">
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
                <label className="block text-slate-600 mb-1 font-semibold">Test Name</label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full glass-input rounded-xl p-2.5 text-slate-800 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full glass-input rounded-xl p-2.5 text-slate-800"
                >
                  <option value="Biochemistry">Biochemistry</option>
                  <option value="Hematology">Hematology</option>
                  <option value="Imaging">Imaging</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Microbiology">Microbiology</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/60">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-2 rounded-xl shadow-sm cursor-pointer"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LAB RESULT ENTRY / VIEW MODAL */}
      {selectedLabResultModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass bg-white/80 border border-white/80 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-white/60 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-base">{selectedLabResultModal.testName}</h3>
                <p className="text-xs text-slate-500">Patient: {selectedLabResultModal.patientName}</p>
              </div>
              <button
                onClick={() => setSelectedLabResultModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedLabResultModal.status === 'Completed' ? (
              <div className="space-y-3 text-xs">
                <p className="font-bold text-emerald-700">Status: Completed & Verified</p>
                <div className="divide-y divide-white/60">
                  {selectedLabResultModal.values?.map((v, i) => (
                    <div key={i} className="py-2 flex justify-between">
                      <div>
                        <span className="font-semibold text-slate-800">{v.parameter}</span>
                        <span className="text-slate-500 block text-[10px]">Range: {v.normalRange}</span>
                      </div>
                      <span className="font-bold font-mono text-blue-700">
                        {v.value} {v.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveResults} className="space-y-3 text-xs">
                <p className="text-slate-600 font-medium">Enter result parameter values from laboratory analyzer:</p>

                <div className="p-3 bg-white/50 rounded-2xl space-y-2 border border-white/70">
                  <span className="font-bold text-blue-700 block">Parameter 1</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={param1Name}
                      onChange={(e) => setParam1Name(e.target.value)}
                      className="glass-input rounded-xl p-2 text-slate-800"
                    />
                    <input
                      type="text"
                      value={param1Val}
                      onChange={(e) => setParam1Val(e.target.value)}
                      placeholder="Value"
                      className="glass-input rounded-xl p-2 text-slate-800 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="p-3 bg-white/50 rounded-2xl space-y-2 border border-white/70">
                  <span className="font-bold text-blue-700 block">Parameter 2</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={param2Name}
                      onChange={(e) => setParam2Name(e.target.value)}
                      className="glass-input rounded-xl p-2 text-slate-800"
                    />
                    <input
                      type="text"
                      value={param2Val}
                      onChange={(e) => setParam2Val(e.target.value)}
                      placeholder="Value"
                      className="glass-input rounded-xl p-2 text-slate-800 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-white/60">
                  <button
                    type="button"
                    onClick={() => setSelectedLabResultModal(null)}
                    className="px-4 py-2 text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2 rounded-xl shadow-sm cursor-pointer"
                  >
                    Approve & Save Lab Results
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
