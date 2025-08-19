"use client";

import { useEffect } from 'react';

const GoogleTranslateWidget = () => {
  useEffect(() => {
    // Cek apakah skrip sudah ada untuk menghindari duplikasi
    if (document.getElementById('google-translate-script')) {
      return;
    }

    // Fungsi ini akan dipanggil oleh skrip Google setelah dimuat
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: 'en' }, // Ganti 'en' dengan bahasa asli situs Anda
        'google_translate_element'
      );
    };

    // Buat dan tambahkan elemen skrip ke body
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup: Hapus skrip dan fungsi global saat komponen dilepas
    return () => {
      const existingScript = document.getElementById('google-translate-script');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      delete (window as any).googleTranslateElementInit;
    };
  }, []);

  return <div id="google_translate_element" className="notranslate"></div>;
};

export default GoogleTranslateWidget;