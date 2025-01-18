'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Crown, AlertTriangle  } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { useAuth } from '@clerk/nextjs';
import { AuthModal } from '@/components/auth/auth-modal';
import { loadStripe } from '@stripe/stripe-js';


interface SubscriptionData {
  planName: string;
  status: string;
  currentPeriodEnd?: string;
}

interface AnalysisLimit {
  allowed: boolean;
  remaining: number;
  total: number;
  planName: string;
}

export default function AnalysisPage() {
  const router = useRouter();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [analysisLimit, setAnalysisLimit] = useState<AnalysisLimit | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoaded) return;

    if (!isSignedIn) {
      setIsAuthModalOpen(true);
      setIsLoading(false);
      return;
    }

    const checkSubscriptionAndLimits = async () => {
      try {
        // Check subscription
        const subResponse = await fetch('/api/verify-subscription');
        if (!subResponse.ok) {
          throw new Error('Failed to fetch subscription');
        }
        const subData = await subResponse.json();
        setSubscription(subData);

        // Check analysis limits for basic plan
        if (subData.planName?.toLowerCase() === 'basic') {
          const limitResponse = await fetch('/api/check-analysis-limit');
          if (limitResponse.ok) {
            const limitData = await limitResponse.json();
            setAnalysisLimit(limitData);
          }
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        setSubscription({ planName: 'basic', status: 'active' });
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscriptionAndLimits();
  }, [authLoaded, isSignedIn]);

  const hasClinicalAccess = subscription?.status === 'active' && 
    (subscription?.planName?.toLowerCase().includes('clinical') || 
     subscription?.planName?.toLowerCase() === 'clinical plan' ||
     subscription?.planName?.toLowerCase() === 'clinical');

     const handleDirectCheckout = async (planType: 'professional' | 'clinical') => {
      if (!isSignedIn) {
        setIsAuthModalOpen(true);
        return;
      }
  
      const priceId = planType === 'professional' 
        ? process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRICE_ID 
        : process.env.NEXT_PUBLIC_STRIPE_CLINICAL_PRICE_ID;
  
      try {
        setIsLoading(true);
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            priceId, 
            planName: planType === 'professional' ? 'Professional Plan' : 'Clinical Plan',
          }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.error || 'Failed to create checkout session');
        }
  
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        
        if (!stripe) {
          throw new Error('Stripe not initialized');
        }
  
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to process checkout. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

  const handleAnalysisClick = async (type: 'holistic' | 'anatomical') => {
    if (!isSignedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    if (type === 'anatomical' && !hasClinicalAccess) {
      return;
    }

    // For basic plan users, check and increment analysis count
    if (subscription?.planName?.toLowerCase() === 'basic') {
      try {
        const response = await fetch('/api/check-analysis-limit', {
          method: 'POST'
        });
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 429) {
            setError('Daily analysis limit reached. Please upgrade your plan for unlimited analyses.');
            return;
          }
          throw new Error(data.error || 'Failed to process analysis');
        }

        setAnalysisLimit(data);
        router.push(type === 'holistic' ? '/holistic-analysis' : '/anatomical-analysis');
      } catch (err) {
        setError('Failed to process analysis. Please try again later.');
        console.error('Error processing analysis:', err);
      }
    } else {
      // Premium users can proceed directly
      router.push(type === 'holistic' ? '/holistic-analysis' : '/anatomical-analysis');
    }
  };

  const LoadingSkeleton = () => (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
          <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
            <AuthModal
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
              view={authView}
              onViewChange={setAuthView}
            />
          </div>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 py-16">
        <motion.button
          onClick={() => router.back()}
          className="flex items-center text-[#14B8A6] hover:text-[#0E9888] mb-12 transition-colors"
          whileHover={{ x: -5 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowLeft className="mr-2" size={20} />
          Back
        </motion.button>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <AlertTriangle className="text-amber-500 w-6 h-6" />
              <p className="text-amber-800 font-medium">{error}</p>
            </div>
            <button
              onClick={() => handleDirectCheckout('professional')}
              className="bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors"
            >
              Upgrade to Professional
            </button>
          </motion.div>
        )}

        <motion.h1
          className="text-4xl font-bold text-gray-900 mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Choose Your Analysis Method
        </motion.h1>

        {isLoading || !authLoaded ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Holistic Health Assessment Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              onClick={() => handleAnalysisClick('holistic')}
              className="bg-white border border-gray-200 rounded-2xl p-8 cursor-pointer shadow-lg transition-all duration-300 relative overflow-hidden group hover:border-[#14B8A6] hover:shadow-xl"
            >
              <div className="relative w-full h-56 mb-6 transform group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/option1.jpg"
                  alt="Holistic Health Assessment"
                  fill
                  className="rounded-xl object-cover"
                  priority
                />
              </div>
              <h2 className="text-2xl font-bold text-[#14B8A6] mb-4 group-hover:text-[#0E9888] transition-colors">
                Holistic Health Assessment
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Comprehensive analysis of multiple symptoms for a complete health evaluation.
              </p>
              {subscription?.planName?.toLowerCase() === 'basic' && 
               analysisLimit?.remaining === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-amber-50/90 backdrop-blur-sm flex flex-col items-center justify-center p-8"
                >
                  <AlertTriangle className="text-amber-500 w-14 h-14 mb-6" />
                  <h3 className="text-xl font-bold text-amber-800 mb-3 text-center">
                    Daily Analysis Limit Reached
                  </h3>
                  <button 
                    className="bg-amber-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-amber-600 transition-colors duration-300 flex items-center space-x-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDirectCheckout('professional');
                    }}
                  >
                    <span>Upgrade to Professional</span>
                  </button>
                </motion.div>
              )}
            </motion.div>

            {/* Anatomical Precision Analysis Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ 
                scale: hasClinicalAccess ? 1.02 : 1,
                transition: { duration: 0.2 }
              }}
              onHoverStart={() => !hasClinicalAccess && setHoveredCard(2)}
              onHoverEnd={() => setHoveredCard(null)}
              onClick={() => handleAnalysisClick('anatomical')}
              className={`bg-white border border-gray-200 rounded-2xl p-8 shadow-lg relative overflow-hidden group hover:border-[#14B8A6] hover:shadow-xl ${hasClinicalAccess ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className="relative w-full h-56 mb-6 transform group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/option2.jpg"
                  alt="Anatomical Precision Analysis"
                  fill
                  className="rounded-xl object-cover"
                  priority
                />
              </div>
              <h2 className="text-2xl font-bold text-[#14B8A6] mb-4 group-hover:text-[#0E9888] transition-colors">
                Anatomical Precision Analysis
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Targeted analysis focusing on specific body regions for precise evaluation.
              </p>

              {!hasClinicalAccess && (
                <AnimatePresence>
                  {hoveredCard === 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8"
                    >
                      <Crown className="text-[#14B8A6] w-14 h-14 mb-6" />
                      <button 
                        className="bg-[#14B8A6] text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-[#0E9888] transition-colors duration-300 flex items-center space-x-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDirectCheckout('clinical');
                        }}
                      >
                        <span>Upgrade to Clinical Plan</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}