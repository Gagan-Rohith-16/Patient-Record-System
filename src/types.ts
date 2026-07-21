export type TriageCategory = 'emergency' | 'urgent' | 'routine';

export type AdmissionStatus = 'Admitted' | 'Outpatient' | 'ICU' | 'Emergency' | 'Discharged';

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number e.g. "HSP-84920"
  firstName: string;
  lastName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insuranceProvider: string;
  insurancePolicyNumber: string;
  triageCategory: TriageCategory;
  admissionStatus: AdmissionStatus;
  department: string;
  wardRoomBed: string; // e.g. "ICU-Bed-04" or "General-Ward-12B"
  primaryPhysician: string;
  admissionDate: string;
  dischargeDate?: string;
  allergies: string[];
  chronicConditions: string[];
  preExistingHistory: string;
  familyHistory: string;
}

export interface VitalRecord {
  id: string;
  patientId: string;
  timestamp: string; // ISO string or format
  heartRate: number; // bpm
  bloodPressureSystolic: number; // mmHg
  bloodPressureDiastolic: number; // mmHg
  temperature: number; // °F
  spo2: number; // %
  respiratoryRate: number; // breaths/min
  painScale: number; // 1-10
  weightKg: number;
  heightCm: number;
  recordedBy: string;
  status: 'normal' | 'warning' | 'critical';
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  authorDoctor: string;
  doctorRole: string;
  date: string;
  category: 'SOAP' | 'Progress Note' | 'Consultation Note' | 'Nursing Note' | 'Procedure Note';
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  aiSummary?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName?: string;
  doctorName: string;
  date: string;
  medicationName: string;
  dosage: string; // e.g. "500 mg"
  frequency: string; // e.g. "Twice Daily after meals"
  route: string; // e.g. "Oral", "IV", "Subcutaneous"
  startDate: string;
  endDate: string;
  status: 'Active' | 'Discontinued' | 'Completed' | 'Pending Pharmacy';
  instructions: string;
  refillsRemaining: number;
  allergyWarning?: string;
}

export interface LabResultValue {
  parameter: string;
  value: string;
  unit: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low' | 'critical';
}

export interface LabReport {
  id: string;
  patientId: string;
  patientName?: string;
  testName: string;
  category: 'Hematology' | 'Biochemistry' | 'Imaging' | 'Cardiology' | 'Microbiology' | 'Pathology';
  orderDate: string;
  resultDate?: string;
  status: 'Ordered' | 'In Progress' | 'Completed';
  requestingDoctor: string;
  labTechnician?: string;
  resultsSummary?: string;
  values?: LabResultValue[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  department: string;
  dateTime: string;
  type: 'In-Person Consultation' | 'Telehealth' | 'Follow-Up' | 'Emergency Intake' | 'Routine Checkup';
  status: 'Scheduled' | 'In-Progress' | 'Completed' | 'Cancelled';
  reason: string;
  roomNumber: string;
}

export interface BedItem {
  id: string;
  wardName: 'ICU' | 'Emergency Ward' | 'Cardiology Unit' | 'General Ward' | 'Pediatric Ward' | 'Surgical Suite';
  bedNumber: string;
  status: 'Occupied' | 'Available' | 'Maintenance' | 'Reserved';
  patientId?: string;
  patientName?: string;
  admissionDate?: string;
  attendingDoctor?: string;
  mrn?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  category: 'Consultation Fee' | 'Room & Board' | 'Pharmacy' | 'Lab Tests' | 'Surgical / Procedure';
  cost: number;
  quantity: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  totalAmount: number;
  insuranceCovered: number;
  patientPayable: number;
  status: 'Paid' | 'Pending Insurance' | 'Unpaid' | 'Partial Payment';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  status: 'Available' | 'In Surgery' | 'On Call' | 'Off Duty';
  room: string;
  phone: string;
  email: string;
  avatarColor: string;
}
