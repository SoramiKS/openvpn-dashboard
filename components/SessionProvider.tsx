"use client";

import { useState } from 'react';
import { useIdleTimeout } from '@/lib/hooks/useIdleTimeout';
import { SessionTimeoutDialog } from './SessionTimeoutDialog';
import { useSession } from 'next-auth/react';

// Durasi inactivity dalam milidetik
const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 menit

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [isIdle, setIsIdle] = useState(false);

  const handleIdle = () => {
    setIsIdle(true);
  };

  const { resetTimer } = useIdleTimeout(handleIdle, IDLE_TIMEOUT_MS);

  const handleStay = () => {
    setIsIdle(false);
    resetTimer();
  };
  
  // Hanya aktifkan timer jika pengguna sudah login
  if (!session) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <SessionTimeoutDialog isOpen={isIdle} onStay={handleStay} />
    </>
  );
};
