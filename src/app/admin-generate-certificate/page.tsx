import { CreateCertificateForm } from "@/components/certificates/CreateCertificateForm/CreateCertificateForm";
import styles from './page.module.css';

export default function AdminGenerateCertificatePage() {
    return (
        <div>
            <h2 className={styles.heading}>
                Create a new certificate
            </h2>
            <CreateCertificateForm />
        </div>
    );
}