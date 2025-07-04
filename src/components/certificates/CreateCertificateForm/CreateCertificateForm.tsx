'use client';

import { FormEvent, useState } from 'react';
import styles from './CreateCertificateForm.module.css';
import { toast } from 'sonner';

export function CreateCertificateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const fullName = formData.get('fullName') as string;
    const courseName = formData.get('courseName') as string;
    const hours = formData.get('hours') as string;
    const format = formData.get('format') as string;

    if (!fullName.trim() || !courseName.trim() || !hours.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const hoursFloat = parseFloat(hours);
    if (isNaN(hoursFloat) || hoursFloat <= 0) {
      toast.error('Invalid hours');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/certificates/create', {
        method: 'POST',
        body: JSON.stringify({
          fullName,
          courseName,
          hours: hoursFloat,
          format,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error');
      }

      toast.success('Certificate created successfully!');
      e.currentTarget.reset();
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Full Name (Dative)</label>
          <input
            name="fullName"
            placeholder="Ivanov Ivan Ivanovich"
            required
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Course Name</label>
          <input
            name="courseName"
            placeholder="Advanced React Development"
            required
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Hours</label>
          <input
            name="hours"
            type="number"
            step="0.1"
            placeholder="e.g. 40"
            required
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Format</label>
          <input
            name="format"
            placeholder="e.g. online / offline"
            className={styles.input}
          />
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Certificate'}
          </button>
        </div>
      </form>
    </div>
  );
}