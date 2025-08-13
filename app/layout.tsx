import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OpenVPN Dashboard',
  description: 'Centralized OpenVPN Server',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
        <div className="gtranslate_wrapper"></div>
        <Script id="gtranslate-settings" strategy="afterInteractive">
          {`window.gtranslateSettings = {"default_language":"id","languages":["id","en"],"wrapper_selector":".gtranslate_wrapper"}`}
        </Script>
        <Script
          src="https://cdn.gtranslate.net/widgets/latest/float.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
