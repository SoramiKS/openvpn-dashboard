"use client";

import { useState } from 'react';
import { useIdleTimeout } from '@/lib/hooks/useIdleTimeout';
import { SessionTimeoutDialog } from './SessionTimeoutDialog';
import { useSession } from 'next-auth/react';


// Durasi inaktivitas dalam milidetik (1 jam)
// (60 menit * 60 detik * 1000 milidetik) - 60 detik untuk peringatan
const IDLE_TIMEOUT_MS = (30 * 60 * 1000) - (60 * 1000); // 59 menit

export const IdleSessionProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session, status } = useSession();
    const [isIdle, setIsIdle] = useState(false);

    // Callback yang dipanggil saat timer habis
    const handleIdle = () => {
        setIsIdle(true);
    };

    const { resetTimer } = useIdleTimeout(handleIdle, IDLE_TIMEOUT_MS);

    // Callback saat pengguna memilih "Tetap Masuk"
    const handleStay = () => {
        setIsIdle(false);
        resetTimer();
    };

    // Hanya aktifkan timer jika pengguna sudah login dan sesi aktif
    if (status !== 'authenticated') {
        return <>{children}</>;
    }

    return (
        <>
            {children}
            <SessionTimeoutDialog isOpen={isIdle} onStay={handleStay} />
        </>
    );
};
