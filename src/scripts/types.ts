export interface CertificateData {
  fullName: string;
  courseName: string;
  hours: number | null;
  format?: string;
  code?: string;
  oldId?: number;
  createdAt: Date;
  updatedAt: Date;
  background: string;
}