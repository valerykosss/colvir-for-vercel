import CertificatePageClient from '@/components/certificates/CertificatePageClient/CertificatePageClient';
import { Suspense } from 'react';

export default function CertificatePage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <CertificatePageClient />
    </Suspense>
  );
}