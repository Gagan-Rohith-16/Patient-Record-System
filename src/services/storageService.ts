import {
  Patient,
  VitalRecord,
  ClinicalNote,
  Prescription,
  LabReport,
  Appointment,
  BedItem,
  Invoice,
  Doctor,
} from '../types';
import {
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_VITALS,
  INITIAL_CLINICAL_NOTES,
  INITIAL_PRESCRIPTIONS,
  INITIAL_LAB_REPORTS,
  INITIAL_BEDS,
  INITIAL_APPOINTMENTS,
  INITIAL_INVOICES,
} from '../data/initialData';

const KEYS = {
  PATIENTS: 'hsp_patients_v1',
  VITALS: 'hsp_vitals_v1',
  CLINICAL_NOTES: 'hsp_clinical_notes_v1',
  PRESCRIPTIONS: 'hsp_prescriptions_v1',
  LAB_REPORTS: 'hsp_lab_reports_v1',
  BEDS: 'hsp_beds_v1',
  APPOINTMENTS: 'hsp_appointments_v1',
  INVOICES: 'hsp_invoices_v1',
  DOCTORS: 'hsp_doctors_v1',
};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

export const StorageService = {
  // Patients
  getPatients(): Patient[] {
    return getItem<Patient[]>(KEYS.PATIENTS, INITIAL_PATIENTS);
  },
  savePatients(patients: Patient[]): void {
    setItem(KEYS.PATIENTS, patients);
  },
  addPatient(patient: Patient): Patient[] {
    const patients = this.getPatients();
    const updated = [patient, ...patients];
    this.savePatients(updated);
    return updated;
  },
  updatePatient(updatedPatient: Patient): Patient[] {
    const patients = this.getPatients();
    const updated = patients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p));
    this.savePatients(updated);
    return updated;
  },

  // Doctors
  getDoctors(): Doctor[] {
    return getItem<Doctor[]>(KEYS.DOCTORS, INITIAL_DOCTORS);
  },

  // Vitals
  getVitals(): VitalRecord[] {
    return getItem<VitalRecord[]>(KEYS.VITALS, INITIAL_VITALS);
  },
  addVital(vital: VitalRecord): VitalRecord[] {
    const vitals = this.getVitals();
    const updated = [vital, ...vitals];
    setItem(KEYS.VITALS, updated);
    return updated;
  },

  // Clinical Notes
  getClinicalNotes(): ClinicalNote[] {
    return getItem<ClinicalNote[]>(KEYS.CLINICAL_NOTES, INITIAL_CLINICAL_NOTES);
  },
  addClinicalNote(note: ClinicalNote): ClinicalNote[] {
    const notes = this.getClinicalNotes();
    const updated = [note, ...notes];
    setItem(KEYS.CLINICAL_NOTES, updated);
    return updated;
  },

  // Prescriptions
  getPrescriptions(): Prescription[] {
    return getItem<Prescription[]>(KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
  },
  addPrescription(rx: Prescription): Prescription[] {
    const prescriptions = this.getPrescriptions();
    const updated = [rx, ...prescriptions];
    setItem(KEYS.PRESCRIPTIONS, updated);
    return updated;
  },

  // Lab Reports
  getLabReports(): LabReport[] {
    return getItem<LabReport[]>(KEYS.LAB_REPORTS, INITIAL_LAB_REPORTS);
  },
  addLabReport(lab: LabReport): LabReport[] {
    const labs = this.getLabReports();
    const updated = [lab, ...labs];
    setItem(KEYS.LAB_REPORTS, updated);
    return updated;
  },
  updateLabReport(updatedLab: LabReport): LabReport[] {
    const labs = this.getLabReports();
    const updated = labs.map((l) => (l.id === updatedLab.id ? updatedLab : l));
    setItem(KEYS.LAB_REPORTS, updated);
    return updated;
  },

  // Beds
  getBeds(): BedItem[] {
    return getItem<BedItem[]>(KEYS.BEDS, INITIAL_BEDS);
  },
  updateBeds(beds: BedItem[]): void {
    setItem(KEYS.BEDS, beds);
  },

  // Appointments
  getAppointments(): Appointment[] {
    return getItem<Appointment[]>(KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  },
  addAppointment(apt: Appointment): Appointment[] {
    const appointments = this.getAppointments();
    const updated = [apt, ...appointments];
    setItem(KEYS.APPOINTMENTS, updated);
    return updated;
  },
  updateAppointment(updatedApt: Appointment): Appointment[] {
    const appointments = this.getAppointments();
    const updated = appointments.map((a) => (a.id === updatedApt.id ? updatedApt : a));
    setItem(KEYS.APPOINTMENTS, updated);
    return updated;
  },

  // Invoices
  getInvoices(): Invoice[] {
    return getItem<Invoice[]>(KEYS.INVOICES, INITIAL_INVOICES);
  },
  addInvoice(inv: Invoice): Invoice[] {
    const invoices = this.getInvoices();
    const updated = [inv, ...invoices];
    setItem(KEYS.INVOICES, updated);
    return updated;
  },
  updateInvoice(updatedInv: Invoice): Invoice[] {
    const invoices = this.getInvoices();
    const updated = invoices.map((i) => (i.id === updatedInv.id ? updatedInv : i));
    setItem(KEYS.INVOICES, updated);
    return updated;
  },

  // Reset to initial
  resetAll(): void {
    localStorage.removeItem(KEYS.PATIENTS);
    localStorage.removeItem(KEYS.VITALS);
    localStorage.removeItem(KEYS.CLINICAL_NOTES);
    localStorage.removeItem(KEYS.PRESCRIPTIONS);
    localStorage.removeItem(KEYS.LAB_REPORTS);
    localStorage.removeItem(KEYS.BEDS);
    localStorage.removeItem(KEYS.APPOINTMENTS);
    localStorage.removeItem(KEYS.INVOICES);
    localStorage.removeItem(KEYS.DOCTORS);
  },
};
