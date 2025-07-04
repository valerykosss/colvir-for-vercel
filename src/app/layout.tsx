import "./globals.css";
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { Toaster } from 'sonner';
import Provider from "@/components/Provider/Provider";
import Header from "@/components/Header/Header";
import styles from './layout.module.css'

const roboto = Roboto({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Colvir',
  // description: 'Generated by create next app',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang='ru' className={roboto.className}>
        <body>
          <Provider>
            <Header />
            <main>
              <div className={styles.container}>
                {children}
              </div>
            </main>
            <Toaster richColors/>
          </Provider>
        </body>
      </html>
  );
}