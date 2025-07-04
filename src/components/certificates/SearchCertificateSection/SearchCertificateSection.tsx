'use client';

import { useState } from 'react';
import { SearchCertificateForm } from '../SearchCertificateForm/SearchCertificateForm';
import type { Certificate } from '@prisma/client';
import { CertificateList } from '../CertificateList/CertificateList';
import styles from './SearchCertificateSection.module.css';

export default function SearchCertificateSection() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  // const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleSearch = async (name: string, id: string) => {
    if (!name.trim() || !id.trim()) {
      setSearchError('Fill in all the fields for the search');
      return;
    }

    setIsLoading(true);
    setSearchError('');
    
    try {
      const params = new URLSearchParams();
      params.append('name', name.trim());
      params.append('id', id.trim());

      const response = await fetch(`/api/certificates/search?${params.toString()}`);
      
      if (!response.ok) throw new Error('Search error');

      const result = await response.json();
      
      if (result.length === 0) {
        setSearchError('The certificate was not found. Check the entered data');
      }

      setCertificates(result);
      // setSearchQuery(`${name} / ${id}`);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('An error occurred during the search');
      setCertificates([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formTitleContainer}>
      <h2 className={styles.heading}>Enter the search parameters:</h2>
      <SearchCertificateForm onSearch={handleSearch} />
      
      {searchError && (
        <div className={styles.errorMessage}>
          {searchError}
        </div>
      )}

      {isLoading ? (
        <div className={styles.loadingMessage}>The search for certificates is underway, please wait...</div>
      ) : (
        <CertificateList 
          certificates={certificates} 
          // searchQuery={searchQuery} 
        />
      )}
    </div>
  );
}