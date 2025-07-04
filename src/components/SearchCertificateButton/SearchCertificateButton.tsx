'use client';

import { useState } from 'react';
import SearchCertificateSection from '../certificates/SearchCertificateSection/SearchCertificateSection';
// import styles from "./SearchCerificateButton.module.css";


export function SearchCertificateButton() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowSearch(!showSearch)}
      >
        {/* {showSearch ? 'Скрыть поиск сертификата' : 'Найти сертификат'} */}
        {showSearch ? 'Hide certificate fields' : 'Find certificate '}
      </button>

      {showSearch && <SearchCertificateSection />}
    </>
  );
}