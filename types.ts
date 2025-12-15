export interface TemplateConfig {
  schoolName: string;
  address: string;
  logoUrl: string | null;
  signatureUrl: string | null; // Principal
  classTeacherSignatureUrl: string | null; // New
  sealUrl: string | null; // New
  signatureHeight: number; // New: control size
  sealHeight: number; // New: control size
  footerText: string;
  primaryColor: string;
  showGrade: boolean;
  showPercentage: boolean;
  passMarks: number;
}

export interface StudentData {
  [key: string]: string;
}

export interface FieldMapping {
  nameField: string;
  rollNoField: string;
  classField: string;
  sectionField: string;
  subjectFields: string[]; // List of CSV headers that represent subjects
}

export interface CalculatedResult {
  totalMarks: number;
  maxTotalMarks: number;
  percentage: number;
  grade: string;
  status: 'PASS' | 'FAIL';
  subjects: {
    name: string;
    marks: number;
    maxMarks: number; // Assuming 100 for simplicity or configurable later
    grade: string;
  }[];
}

export type AppStep = 'TEMPLATE' | 'UPLOAD' | 'MAPPING' | 'PREVIEW';