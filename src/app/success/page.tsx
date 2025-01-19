'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { setUserPlan } from '@/lib/session-storage';
import confetti from 'canvas-confetti';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  
  useEffect(() => {
    // Trigger confetti effect on load
    const end = Date.now() + 3 * 1000; // 4 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"]; // Gold, Orange, Your theme green, Yellow
    
    const frame = () => {
      if (Date.now() > end) return;
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });
      requestAnimationFrame(frame);
    };
    
    frame();
    
    const sessionId = searchParams.get('session_id');
    
    if (sessionId && user?.emailAddresses?.[0]?.emailAddress) {
      // Get subscription details from your backend
      fetch(`${window.location.origin}/api/verify-subscription?session_id=${sessionId}`)
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-50 rounded-lg shadow-sm p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-[#14B8A6] mx-auto" />
        </div>
        <h1 className="text-4xl font-bold mb-3 text-[#14B8A6]">
          Payment Successful!
        </h1>
        <p className="text-[#1E293B] text-xl font-medium mb-2">
          Thank you for subscribing
        </p>
        <div className="bg-white rounded-md p-4 mt-6 border border-gray-100">
          <p className="text-[#1E293B]">
            We&apos;re processing your subscription. Please don&apos;t close this window...
          </p>
        </div>
      </div>
    </div>
  );
}