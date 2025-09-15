// app/dashboard/userprofile/page.tsx
"use client";

// PERBAIKAN: Tambahkan 'useCallback'
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, ShieldOff } from 'lucide-react';
import { Role } from '@prisma/client';
import { QRCodeCanvas } from 'qrcode.react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type SafeUserProfile = {
    id: string;
    email: string;
    role: Role;
    twoFactorEnabled: boolean;
    createdAt: string;
};

// PENINGKATAN: Terapkan saran linter untuk props read-only
function ProfileDetailsCard({ user }: { readonly user: SafeUserProfile | null }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1">
                    <Label>Email Address</Label>
                    <p className="font-medium">{user?.email}</p>
                </div>
                <div className="space-y-1">
                    <Label>Role</Label>
                    <p className="font-medium">{user?.role}</p>
                </div>
                <div className="space-y-1">
                    <Label>User Since</Label>
                    <p className="font-medium">{user ? new Date(user.createdAt).toLocaleDateString() : '-'}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function ChangePasswordCard() {
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast({ title: 'Error', description: 'New passwords do not match.', variant: 'destructive' });
            return;
        }
        if (passwords.newPassword.length < 8) {
            toast({ title: 'Error', description: 'New password must be at least 8 characters long.', variant: 'destructive' });
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            toast({ title: 'Success', description: 'Your password has been updated.' });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            if (error instanceof Error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" value={passwords.currentPassword} onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} required />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} required />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" value={passwords.confirmPassword} onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))} required />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Password
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

// PENINGKATAN: Terapkan saran linter untuk props read-only

function TwoFactorAuthCard({ user, onUpdate }: { readonly user: SafeUserProfile | null, readonly onUpdate: () => void }) {
    const [otpauthUri, setOtpauthUri] = useState<string | null>(null);
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);
    const [disableToken, setDisableToken] = useState('');

    const { toast } = useToast();

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/profile/2fa/generate', { method: 'POST' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            // DIUBAH: Simpan data ke state yang benar
            setOtpauthUri(data.otpauthUri);
        } catch (error) {
            if (error instanceof Error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/profile/2fa/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            toast({ title: 'Success', description: '2FA has been enabled!' });

            // DIUBAH: Reset state yang benar
            setOtpauthUri(null);
            setToken('');
            onUpdate();
        } catch (error) {
            if (error instanceof Error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisable = async () => {
        if (disableToken.length !== 6) {
            toast({ title: 'Error', description: 'Please enter a valid 6-digit token.', variant: 'destructive' });
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch('/api/profile/2fa', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: disableToken }), // Kirim token di body
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            toast({ title: 'Success', description: '2FA has been disabled.' });
            onUpdate();
            setIsDisableDialogOpen(false); // Tutup dialog setelah berhasil
            setDisableToken(''); // Reset token
        } catch (error) {
            if (error instanceof Error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
                <CardDescription>Add an extra layer of security to your account.</CardDescription>
            </CardHeader>
            <CardContent>
                {user?.twoFactorEnabled ? (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-green-600">
                            <ShieldCheck />
                            <p className="font-semibold">2FA is Enabled</p>
                        </div>
                        <Button variant="destructive" onClick={() => setIsDisableDialogOpen(true)} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Disable 2FA
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-yellow-600">
                            <ShieldOff />
                            <p className="font-semibold">2FA is Disabled</p>
                        </div>
                        {!otpauthUri && <Button onClick={handleGenerate} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Enable 2FA</Button>}
                        {otpauthUri && (
                            <div className="p-4 border rounded-md space-y-4">
                                <p>1. Scan this QR code with your authenticator app (e.g., Google Authenticator, Authy).</p>
                                <div className="flex justify-center bg-white p-4 rounded-md">
                                    <QRCodeCanvas value={otpauthUri} size={160} />
                                </div>
                                <p>2. Enter the 6-digit code from your app below to verify and complete the setup.</p>
                                <div className="flex items-center gap-2">
                                    <Input value={token} onChange={e => setToken(e.target.value)} placeholder="123456" maxLength={6} />
                                    <Button onClick={handleVerify} disabled={isLoading || token.length !== 6}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Verify & Enable
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
            <Dialog open={isDisableDialogOpen} onOpenChange={setIsDisableDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Disabling 2FA</DialogTitle>
                        <DialogDescription>
                            To confirm, please enter a valid 6-digit code from your authenticator app.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        <Label htmlFor="disable-token">6-Digit Authentication Code</Label>
                        <Input
                            id="disable-token"
                            value={disableToken}
                            onChange={(e) => setDisableToken(e.target.value)}
                            placeholder="123456"
                            maxLength={6}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDisableDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDisable} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm & Disable
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

export default function UserProfilePage() {
    const [user, setUser] = useState<SafeUserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchUserData = useCallback(async () => {
        setIsLoading(true); // Selalu set loading true di awal fetch
        try {
            const res = await fetch('/api/profile');
            if (!res.ok) throw new Error("Failed to fetch user data.");
            setUser(await res.json());
        } catch (error) {
            if (error instanceof Error) toast({ title: "Error", description: error.message, variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-full p-6"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <ProfileDetailsCard user={user} />
                    <ChangePasswordCard />
                </div>
                <div className="space-y-6">
                    <TwoFactorAuthCard user={user} onUpdate={fetchUserData} />
                </div>
            </div>
        </div>
    );
}