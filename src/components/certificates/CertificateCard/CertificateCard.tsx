import { Certificate } from '@prisma/client';
import styles from './CertificateCard.module.css';

interface CertificateCardProps {
  certificate: Certificate;
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const isOldCertificate = certificate.oldId && certificate.code;
  
  const certificateUrl = isOldCertificate
    ? `/certificate/?id=${certificate.oldId}&code=${certificate.code}`
    : `/certificate/?id=${certificate.id}`;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.courseTitle}>{certificate.courseName}</h3>
      </div>
      
      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Participant:</span>
          <span className={styles.detailValue}>{certificate.fullName}</span>
        </div>
        
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Date of issue:</span>
          <span className={styles.detailValue}>
            {new Date(certificate.createdAt).toLocaleDateString('ru-RU')}
          </span>
        </div>
      </div>
      
      <a 
        href={certificateUrl} 
        target="_blank"
        rel="noopener noreferrer"
        className={styles.button}
      >
        View certificate
      </a>
    </div>
  );
}