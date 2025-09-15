// components/IdleSessionProvider.tsx
"use client";

import { useState } from 'react';
import { useIdleTimeout } from '@/lib/hooks/useIdleTimeout';
import { SessionTimeoutDialog } from './SessionTimeoutDialog';
import { useSession } from 'next-auth/react';

// Durasi idle sebelum dialog muncul (Total Sesi - Waktu Peringatan)
// Misal: 1 jam (3600 detik) - 30 detik peringatan
const IDLE_TIMEOUT_MS = (60 * 60 * 1000) - (30 * 1000); // 59 menit 30 detik

// components/IdleSessionProvider.tsx
export const IdleSessionProvider = ({ children }: { children: React.ReactNode }) => {
    const { status } = useSession();
    const [isIdle, setIsIdle] = useState(false);

    const handleIdle = () => setIsIdle(true);
    const { resetTimer } = useIdleTimeout(handleIdle, IDLE_TIMEOUT_MS);

    const handleStay = async () => {
        setIsIdle(false);
        resetTimer();
        try {
            await fetch('/api/auth/session');
        } catch (error) {
            console.error("Failed to refresh session:", error);
        }
    };

    if (status !== 'authenticated') {
        // 🚀 FIX: jangan balikin fragment kosong, kasih wrapper biar ga jadi whitespace node
        return <div style={{ display: "contents" }}>{children}</div>;
    }

    return (
        <div style={{ display: "contents" }}>
            {children}
            <SessionTimeoutDialog isOpen={isIdle} onStay={handleStay} />
        </div>
    );
};
