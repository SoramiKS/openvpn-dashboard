"use client";

import { useEffect, useRef, useCallback } from 'react';

// Daftar event yang menandakan aktivitas pengguna
const EVENTS: (keyof WindowEventMap)[] = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
];

/**
 * Custom hook untuk mendeteksi kapan pengguna tidak aktif.
 * @param onIdle - Callback yang akan dipanggil saat timeout tercapai.
 * @param timeout - Durasi inaktivitas dalam milidetik.
 */
export const useIdleTimeout = (onIdle: () => void, timeout: number) => {
  const timer = useRef<NodeJS.Timeout | null>(null);

  // Fungsi untuk mereset timer setiap kali ada aktivitas
  const resetTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(onIdle, timeout);
  }, [onIdle, timeout]);

  // Fungsi untuk membersihkan timer dan event listener
  const cleanup = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    EVENTS.forEach((event) => {
      window.removeEventListener(event, resetTimer, { capture: true });
    });
  }, [resetTimer]);

  useEffect(() => {
    // Mulai timer dan pasang event listener saat komponen dimuat
    EVENTS.forEach((event) => {
      window.addEventListener(event, resetTimer, { capture: true });
    });
    resetTimer();

    // Fungsi cleanup untuk saat komponen di-unmount
    return cleanup;
  }, [resetTimer, cleanup]);

  return { resetTimer, cleanup };
};

