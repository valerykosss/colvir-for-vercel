'use client';

import { Certificate } from '@prisma/client';
import { CertificateCard } from '../CertificateCard/CertificateCard';
import styles from './CertificateList.module.css';

interface CertificateListProps {
  certificates: Certificate[];
  // searchQuery?: string;
}

// export function CertificateList({ certificates, searchQuery }: CertificateListProps) {
export function CertificateList({ certificates }: CertificateListProps) {
  if (!certificates.length) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Certificates found: {certificates.length}
      </h2>
      <div className={styles.list}>
        {certificates.map(cert => (
          <CertificateCard key={cert.id} certificate={cert} />
        ))}
      </div>
    </div>
  );
}