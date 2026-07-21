import React, { useState } from 'react';
import { Receipt, Plus, DollarSign, ShieldCheck, CheckCircle2, Clock, X } from 'lucide-react';
import { Invoice, Patient } from '../types';

interface BillingViewProps {
  invoices: Invoice[];
  patients: Patient[];
  onAddInvoice: (inv: Invoice) => void;
  onUpdateInvoice: (inv: Invoice) => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  invoices,
  patients,
  onAddInvoice,
  onUpdateInvoice,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');

  // Invoice Items
  const [consultFee, setConsultFee] = useState('250');
  const [roomFee, setRoomFee] = useState('1500');
  const [labFee, setLabFee] = useState('450');

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === selectedPatientId);
    if (!patient) return;

    const consult = parseFloat(consultFee) || 0;
    const room = parseFloat(roomFee) || 0;
    const lab = parseFloat(labFee) || 0;
    const total = consult + room + lab;

    const insCovered = Math.round(total * 0.8);
    const patientPayable = total - insCovered;

    const newInv: Invoice = {
      id: `INV-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      items: [
        { id: '1', description: 'Specialist Consultation Fee', category: 'Consultation Fee', cost: consult, quantity: 1 },
        { id: '2', description: 'Ward Room & Inpatient Bed Charges', category: 'Room & Board', cost: room, quantity: 1 },
        { id: '3', description: 'Diagnostic & Lab Work Charges', category: 'Lab Tests', cost: lab, quantity: 1 },
      ],
      totalAmount: total,
      insuranceCovered: insCovered,
      patientPayable,
      status: 'Pending Insurance',
    };

    onAddInvoice(newInv);
    setShowAddModal(false);
  };

  const handleMarkPaid = (inv: Invoice) => {
    onUpdateInvoice({ ...inv, status: 'Paid' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-600" /> Hospital Billing & Insurance Claims Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Patient invoice generation and insurance settlement tracking</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Invoice
        </button>
      </div>

      {/* Invoice Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {invoices.map((inv) => (
          <div key={inv.id} className="glass rounded-3xl p-5 space-y-4 shadow-sm hover:bg-white/70 transition-all">
            <div className="flex items-center justify-between border-b border-white/60 pb-3">
              <div>
                <span className="text-[10px] text-slate-500 font-mono font-semibold">{inv.invoiceNumber}</span>
                <h3 className="font-bold text-slate-800 text-base">{inv.patientName}</h3>
              </div>

              <span
                className={`status-pill ${
                  inv.status === 'Paid'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                {inv.status}
              </span>
            </div>

            <div className="divide-y divide-white/60 text-xs">
              {inv.items.map((item) => (
                <div key={item.id} className="py-2 flex justify-between">
                  <span className="text-slate-700 font-medium">{item.description}</span>
                  <span className="font-mono text-slate-800 font-bold">${item.cost.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="bg-white/50 p-3.5 rounded-2xl border border-white/70 flex justify-between text-xs font-semibold">
              <div>
                <span className="text-slate-500 block text-[10px]">Total Charges</span>
                <span className="text-slate-800 font-mono text-sm font-bold">${inv.totalAmount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Insurance Coverage</span>
                <span className="text-emerald-700 font-mono text-sm font-bold">${inv.insuranceCovered.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Patient Copay</span>
                <span className="text-blue-700 font-mono text-sm font-bold">${inv.patientPayable.toLocaleString()}</span>
              </div>
            </div>

            {inv.status !== 'Paid' && (
              <div className="pt-2 border-t border-white/60 flex justify-end">
                <button
                  onClick={() => handleMarkPaid(inv)}
                  className="bg-emerald-100 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                >
                  Record Settlement Payment
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CREATE INVOICE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass bg-white/80 border border-white/80 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-white/60 pb-3">
              <h3 className="font-bold text-slate-800 text-base">Generate Patient Hospital Bill</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3 text-xs">
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

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Consultation Fee ($)</label>
                <input
                  type="number"
                  value={consultFee}
                  onChange={(e) => setConsultFee(e.target.value)}
                  className="w-full glass-input rounded-xl p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Inpatient Room & Bed Charges ($)</label>
                <input
                  type="number"
                  value={roomFee}
                  onChange={(e) => setRoomFee(e.target.value)}
                  className="w-full glass-input rounded-xl p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Lab Tests & Imaging Charges ($)</label>
                <input
                  type="number"
                  value={labFee}
                  onChange={(e) => setLabFee(e.target.value)}
                  className="w-full glass-input rounded-xl p-2 text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/60">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2 rounded-xl shadow-sm cursor-pointer"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
