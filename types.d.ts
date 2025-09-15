// types.d.ts

declare module '2fa-util' {
  /**
   * Generates a new 2FA secret and QR code data URI.
   */
  export function generateSecret(
    email: string,
    appName: string
    // PERBAIKAN: Properti yang benar adalah 'qr', bukan 'qrCode'.
  ): Promise<{ secret: string; qr: string; uri: string; }>;

  /**
   * Verifies a 2FA token against a secret.
   * Returns true if valid, null if invalid.
   */
  export function verifyToken(
    secret: string,
    token: string
  ): Promise<boolean | null>;
}