'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { setUserPlan } from '@/lib/session-storage';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId && user?.emailAddresses?.[0]?.emailAddress) {
      // Get subscription details from your backend
      fetch(`/api/verify-subscription?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          // Store in session storage
          setUserPlan(
            user.emailAddresses[0].emailAddress,
            data.planName,
            data.expiryDate
          );
          router.push('/');
        })
        .catch(console.error);
    }
  }, [searchParams, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Thank you for subscribing!</h1>
        <p className="text-gray-600">Processing your subscription...</p>
      </div>
    </div>
  );
}