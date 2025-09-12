"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

interface SessionTimeoutDialogProps {
  isOpen: boolean;
  onStay: () => void;
}

export const SessionTimeoutDialog = ({ isOpen, onStay }: SessionTimeoutDialogProps) => {
  const [countdown, setCountdown] = useState(60); // Peringatan selama 60 detik

  useEffect(() => {
    if (isOpen) {
      setCountdown(60); // Reset countdown setiap kali dialog terbuka
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            signOut({ callbackUrl: '/login' }); // Logout otomatis jika countdown habis
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleStay = () => {
    setCountdown(60);
    onStay();
  };
  
  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sesi Anda Akan Segera Berakhir</DialogTitle>
          <DialogDescription>
            Karena tidak ada aktivitas, Anda akan otomatis keluar dalam{' '}
            <span className="font-bold text-destructive">{countdown}</span> detik.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleLogout}>
            Keluar Sekarang
          </Button>
          <Button onClick={handleStay}>
            Tetap Masuk
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

