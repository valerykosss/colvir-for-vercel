'use client';

import { Search } from 'lucide-react';
import { FormEvent } from 'react';
import styles from './SearchCertificateForm.module.css';

export function SearchCertificateForm({
  onSearch,
}: {
  onSearch: (name: string, id: string) => void;
}) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const id = formData.get('id') as string;
    onSearch(name, id);
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Full name (as in the certificate)</label>
            <input
              name="name"
              placeholder="For example: Ivanov Ivan (Dative case)"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Certificate ID</label>
            <input
              name="id"
              placeholder="Enter the ID (number or letters)"
              required
              className={styles.input}
            />
          </div>
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.button}>
            <Search className={styles.searchIcon} />
            {/* Найти сертификат */}
            Find certificate
          </button>
        </div>
      </form>
      <div className={styles.helpText}>
        {/* <p>• Для поиска введите <strong>точное ФИО</strong> и <strong>ID</strong> из сертификата</p>
        <p>• Поиск работает только при полном совпадении ID и частичном совпадении ФИО</p> */}
        <p>• To search, enter <strong>the exact full name</strong> and <strong>ID</strong> from the certificate</p>
        <p>• The search only works if the ID is a complete match and the full name is a partial match</p>
      </div>
    </div>
  );
}