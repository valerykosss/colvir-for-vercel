'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './CertificatePageClient.module.css';

export default function CertificatePageClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const code = searchParams.get('code');

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('certificate.pdf');
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      const url = `/api/generate-certificate?id=${id}${code ? `&code=${code}` : ''}`;
      setPdfUrl(url);
      setFileName(`${id}`);
    }
  }, [id, code]);

  const handleDownload = async () => {
    if (!pdfUrl) return;

    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();

      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Certificate</h2>

      {!iframeLoaded && <p className={styles.loadingText}>Please wait...</p>}

      {pdfUrl && (
        <>
          {iframeLoaded && (
            <button onClick={handleDownload} className={styles.button}>
              Download certificate
            </button>
          )}
          <iframe
            src={pdfUrl}
            className={styles.pdfViewer}
            title="Certificate Preview"
            onLoad={() => setIframeLoaded(true)}
          />
        </>
      )}
    </div>
  );
}