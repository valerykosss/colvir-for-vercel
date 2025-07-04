'use client'
import { signOut } from "next-auth/react";
import Link from "next/link";
import styles from './AdminAccountNav.module.css';

export default function AdminAccountNav() {
    // console.log("logout btn");
    
   return (
    <nav className={styles.nav}>
        <Link className={styles.link} href="/admin-dashboard">
            Admin Panel
        </Link>

        <Link className={styles.link} href="/admin-generate-certificate">
            Certificates Generation
        </Link>
        <button 
        onClick={() => 
            signOut({
                redirect: true,
                callbackUrl: `${window.location.origin}/login`
            })} 
        >
            Exit
        </button>
    </nav>)
}
