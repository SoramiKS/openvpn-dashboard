// app/dashboard/profiles/page.tsx

import { Suspense } from 'react';
import ProfilesClient from './ProfilesClient';
import { Loader2 } from 'lucide-react';

// Ini adalah komponen fallback sederhana untuk loading
function LoadingFallback() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-12 w-12 animate-spin" />
    </div>
  );
}

export default function VpnProfilesPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProfilesClient />
    </Suspense>
  );
}