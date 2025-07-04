import Link from 'next/link';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
import styles from './Header.module.css';
import Image from 'next/image'; 
import AuthStatus from '../AuthStatus/AuthStatus';

const Header = async () => {
  // const session = await getServerSession(authOptions);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href='/' className={styles.logoLink}>
         <Image 
            src="/logo.svg" 
            alt="Logo"
            width={160}
            height={40}
          />
        </Link>

        {/* {session?.user && <AdminAccountNav />} */}
        <AuthStatus />
      </div>
    </header>
  );
};

export default Header;