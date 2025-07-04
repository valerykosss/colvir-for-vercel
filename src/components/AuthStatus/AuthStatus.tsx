'use client';

import { useSession } from 'next-auth/react';
import AdminAccountNav from '../AdminAccountNav/AdminAccountNav';

export default function AuthStatus() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return null;
  
  if (!session?.user) return null;
  
  return <AdminAccountNav />;
}