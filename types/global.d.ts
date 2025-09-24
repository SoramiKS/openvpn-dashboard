// types/global.d.ts
declare module "*.css";
// Memberitahu TypeScript untuk menambahkan properti baru ke tipe Window global
declare global {
  interface Window {
    // Deklarasikan 'doGTranslate' sebagai fungsi opsional (?)
    // yang menerima satu argumen string dan tidak mengembalikan apa-apa (void).
    doGTranslate?: (lang_pair: string) => void;
  }
}

// Baris ini penting untuk memastikan file ini diperlakukan sebagai module.
export {};