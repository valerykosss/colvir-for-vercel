'use client'
import { Download } from "lucide-react";
import styles from './DownloadCatalogButton.module.css'

export function DownloadCatalogButton() {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/catalog.pdf";
    link.download = "catalog.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={handleDownload}>
      <Download className={styles.downloadIcon}/>
      {/* Скачать каталог */}
      Download catalog
    </button>
  );
}