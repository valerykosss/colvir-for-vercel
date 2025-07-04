'use client'
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function AdminAccountNav() {
    // console.log("logout btn");
    
   return (
    <nav>
        <Link href="/admin-dashboard">
            Admin Panel
        </Link>

        <Link href="/admin-generate-certificate">
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
