'use client'
import { signOut } from "next-auth/react";

export default function AdminAccountNav() {
    console.log("logout btn")
   return (
    <button 
        onClick={() => 
            signOut({
                redirect: true,
                callbackUrl: `${window.location.origin}/login`
            })} 
    >
        Выйти
    </button>)
}
