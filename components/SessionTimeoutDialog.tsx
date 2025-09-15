// components/SessionTimeoutDialog.tsx
"use client";

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';

interface SessionTimeoutDialogProps {
    isOpen: boolean;
    onStay: () => void;
}

const COUNTDOWN_SECONDS = 30; // Waktu peringatan sebelum logout otomatis

export const SessionTimeoutDialog = ({ isOpen, onStay }: SessionTimeoutDialogProps) => {
    const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

    useEffect(() => {
        if (!isOpen) {
            setCountdown(COUNTDOWN_SECONDS); // Reset countdown saat dialog ditutup
            return;
        }

        // Logout jika countdown habis
        if (countdown === 0) {
            signOut({ callbackUrl: '/login?error=Session%20timed%20out' });
            return;
        }

        // Kurangi countdown setiap detik
        const timerId = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerId); // Cleanup timer

    }, [isOpen, countdown]);

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Sesi Anda Akan Segera Berakhir</AlertDialogTitle>
                    <AlertDialogDescription>
                        Anda tidak melakukan aktivitas apa pun untuk beberapa saat. Untuk alasan keamanan, sesi Anda akan berakhir secara otomatis.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="text-center text-5xl font-mono my-4">
                    {countdown}
                </div>
                <AlertDialogFooter>
                    <Button variant="outline" onClick={() => signOut({ callbackUrl: '/login' })}>
                        Logout
                    </Button>
                    <AlertDialogAction onClick={onStay}>
                        Tetap Masuk
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};