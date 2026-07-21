import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { PatientsView } from './components/PatientsView';
import { BedWardView } from './components/BedWardView';
import { AppointmentsView } from './components/AppointmentsView';
import { PharmacyView } from './components/PharmacyView';
import { LabDiagnosticsView } from './components/LabDiagnosticsView';
import { BillingView } from './components/BillingView';
import { AiAssistantView } from './components/AiAssistantView';
import { PatientProfileModal } from './components/PatientProfileModal';

import { StorageService } from './services/storageService';

import {
  Patient,
  BedItem,
  Appointment,
  Prescription,
  LabReport,
  Invoice,
  Doctor,
  ClinicalNote,
  VitalRecord,
} from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'patients' | 'beds' | 'appointments' | 'pharmacy' | 'labs' | 'billing' | 'ai'
  >('dashboard');

  const [searchQuery, setSearchQuery] = useState('');

  // Domain State
  const [patients, setPatients] = useState<Patient[]>([]);
  const [beds, setBeds] = useState<BedItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  // Selected Patient Modal State
  const [selectedPatientModal, setSelectedPatientModal] = useState<Patient | null>(null);

  // Initialize Data
  useEffect(() => {
    setPatients(StorageService.getPatients());
    setBeds(StorageService.getBeds());
    setAppointments(StorageService.getAppointments());
    setPrescriptions(StorageService.getPrescriptions());
    setLabReports(StorageService.getLabReports());
    setInvoices(StorageService.getInvoices());
    setDoctors(StorageService.getDoctors());
  }, []);

  // Handlers
  const handleAddPatient = (newPatient: Patient) => {
    const updated = StorageService.addPatient(newPatient);
    setPatients(updated);
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    const updated = StorageService.updatePatient(updatedPatient);
    setPatients(updated);
    if (selectedPatientModal?.id === updatedPatient.id) {
      setSelectedPatientModal(updatedPatient);
    }
  };

  const handleAddVital = (patientId: string, newVital: VitalRecord) => {
    const updated = patients.map((p) => {
      if (p.id === patientId) {
        return {
          ...p,
          vitalsHistory: [newVital, ...(p.vitalsHistory || [])],
        };
      }
      return p;
    });
    setPatients(updated);
    StorageService.savePatients(updated);

    const match = updated.find((p) => p.id === patientId);
    if (match) setSelectedPatientModal(match);
  };

  const handleAddClinicalNote = (patientId: string, newNote: ClinicalNote) => {
    const updated = patients.map((p) => {
      if (p.id === patientId) {
        return {
          ...p,
          clinicalNotes: [newNote, ...(p.clinicalNotes || [])],
        };
      }
      return p;
    });
    setPatients(updated);
    StorageService.savePatients(updated);

    const match = updated.find((p) => p.id === patientId);
    if (match) setSelectedPatientModal(match);
  };

  const handleUpdateBeds = (updatedBeds: BedItem[]) => {
    setBeds(updatedBeds);
    StorageService.updateBeds(updatedBeds);
  };

  const handleAddAppointment = (newApt: Appointment) => {
    const updated = StorageService.addAppointment(newApt);
    setAppointments(updated);
  };

  const handleUpdateAppointment = (updatedApt: Appointment) => {
    const updated = StorageService.updateAppointment(updatedApt);
    setAppointments(updated);
  };

  const handleAddPrescription = (newRx: Prescription) => {
    const updated = StorageService.addPrescription(newRx);
    setPrescriptions(updated);
  };

  const handleAddLabReport = (newLab: LabReport) => {
    const updated = StorageService.addLabReport(newLab);
    setLabReports(updated);
  };

  const handleUpdateLabReport = (updatedLab: LabReport) => {
    const updated = StorageService.updateLabReport(updatedLab);
    setLabReports(updated);
  };

  const handleAddInvoice = (newInv: Invoice) => {
    const updated = StorageService.addInvoice(newInv);
    setInvoices(updated);
  };

  const handleUpdateInvoice = (updatedInv: Invoice) => {
    const updated = StorageService.updateInvoice(updatedInv);
    setInvoices(updated);
  };

  return (
    <div className="mesh-bg min-h-screen text-slate-800 font-sans antialiased selection:bg-blue-500 selection:text-white flex flex-col">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenNewAdmission={() => setActiveTab('patients')}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            patients={patients}
            beds={beds}
            appointments={appointments}
            doctors={doctors}
            onOpenNewAdmission={() => setActiveTab('patients')}
            onOpenPatientModal={setSelectedPatientModal}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'patients' && (
          <PatientsView
            patients={patients}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenPatientModal={setSelectedPatientModal}
            onAddPatient={handleAddPatient}
            doctors={doctors}
          />
        )}

        {activeTab === 'beds' && (
          <BedWardView
            beds={beds}
            patients={patients}
            onUpdateBeds={handleUpdateBeds}
            onOpenPatientModal={setSelectedPatientModal}
          />
        )}

        {activeTab === 'appointments' && (
          <AppointmentsView
            appointments={appointments}
            doctors={doctors}
            patients={patients}
            onAddAppointment={handleAddAppointment}
            onUpdateAppointment={handleUpdateAppointment}
          />
        )}

        {activeTab === 'pharmacy' && (
          <PharmacyView
            prescriptions={prescriptions}
            patients={patients}
            doctors={doctors}
            onAddPrescription={handleAddPrescription}
          />
        )}

        {activeTab === 'labs' && (
          <LabDiagnosticsView
            labReports={labReports}
            patients={patients}
            doctors={doctors}
            onAddLabReport={handleAddLabReport}
            onUpdateLabReport={handleUpdateLabReport}
          />
        )}

        {activeTab === 'billing' && (
          <BillingView
            invoices={invoices}
            patients={patients}
            onAddInvoice={handleAddInvoice}
            onUpdateInvoice={handleUpdateInvoice}
          />
        )}

        {activeTab === 'ai' && <AiAssistantView patients={patients} />}
      </main>

      {/* EHR Patient Profile & Clinical Workspace Modal */}
      {selectedPatientModal && (
        <PatientProfileModal
          patient={selectedPatientModal}
          onClose={() => setSelectedPatientModal(null)}
          onAddVital={(v) => handleAddVital(selectedPatientModal.id, v)}
          onAddClinicalNote={(n) => handleAddClinicalNote(selectedPatientModal.id, n)}
          prescriptions={prescriptions.filter((p) => p.patientId === selectedPatientModal.id)}
          labReports={labReports.filter((l) => l.patientId === selectedPatientModal.id)}
          invoices={invoices.filter((i) => i.patientId === selectedPatientModal.id)}
        />
      )}
    </div>
  );
}

export default App;
