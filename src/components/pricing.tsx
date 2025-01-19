"use client";
import React, { useState, useEffect } from 'react';
import { Check, Crown } from 'lucide-react';
import { useUser, useAuth } from '@clerk/nextjs';
import { loadStripe } from '@stripe/stripe-js';
import { setUserPlan } from '@/lib/session-storage';
import { AuthModal } from '@/components/auth/auth-modal';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PlanType {
  name: string;
  price: string;
  period: string;
  isPopular: boolean;
  buttonVariant: string;
  priceId: string | null;
  features: string[];
}

interface SubscriptionData {
  planName: string;
  status: string;
  currentPeriodEnd?: string;
}

const PricingSection = () => {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const { isLoaded: authLoaded } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Exact subscription check effect from analyze page
  useEffect(() => {
    if (!authLoaded) return;

    if (!isSignedIn) {
      setShowAuthModal(true);
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
      } catch (error) {
        console.error('Error checking subscription:', error);
        setSubscription({ planName: 'basic', status: 'active' });
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscriptionAndLimits();
  }, [authLoaded, isSignedIn]);

  const plans: PlanType[] = [
    {
      name: "Basic Plan",
      price: "Free",
      period: "",
      isPopular: false,
      buttonVariant: "secondary",
      priceId: null,
      features: [
        "Symptom-based analysis system",
        "Limited to 5 analyses per day",
        "Initial assessment and summary",
        "Possible conditions analysis",
        "Severity assessment",
        "Care recommendations",
        "Prevention guidelines",
        "Educational resources"
      ]
    },
    {
      name: "Professional Plan",
      price: "$29",
      period: "/month",
      isPopular: true,
      buttonVariant: "primary",
      priceId: process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRICE_ID || null,
      features: [
        "Everything in Basic plan",
        "Unlimited symptom analyses",
        "No daily rate limits"
      ]
    },
    {
      name: "Clinical Plan",
      price: "$49",
      period: "/month",
      isPopular: false,
      buttonVariant: "dark",
      priceId: process.env.NEXT_PUBLIC_STRIPE_CLINICAL_PRICE_ID || null,
      features: [
        "Everything in Professional plan",
        "Body-part specific analysis system",
        "Anatomical assessment capabilities"
      ]
    }
  ];

  const isActivePlan = (planName: string) => {
    if (!subscription) return false;
    return subscription.status === 'active' && 
           subscription.planName === planName;
  };

  const handleSubscription = async (priceId: string | null, planName: string) => {
    if (!isSignedIn) {
      setShowAuthModal(true);
      return;
    }

    if (!priceId) {
      if (user?.emailAddresses?.[0]?.emailAddress) {
        setUserPlan(user.emailAddresses[0].emailAddress, 'basic', '');
        return;
      }
    }

    try {
      setLoading(planName);
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          priceId, 
          planName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe not initialized');
      }

      const { error } = await stripe.redirectToCheckout({ 
        sessionId: data.sessionId 
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was a problem processing your request. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const renderButton = (plan: PlanType) => {
    const isActive = isActivePlan(plan.name);

    if (isActive) {
      return (
        <div className="w-full py-3 rounded-lg mb-8 font-medium bg-emerald-500 text-white text-center">
          Active Plan
        </div>
      );
    }

    if (plan.name === "Basic Plan") {
      return (
        <button
          onClick={() => router.push('/analyse')}
          className="w-full py-3 rounded-lg mb-8 font-medium transition-colors duration-300 bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          Default
        </button>
      );
    }

    return (
      <button
        onClick={() => handleSubscription(plan.priceId, plan.name)}
        disabled={loading === plan.name || isActive}
        className={`w-full py-3 rounded-lg mb-8 font-medium transition-colors duration-300 ${
          loading === plan.name ? 'opacity-50 cursor-not-allowed' : ''
        } ${
          plan.buttonVariant === 'primary'
            ? 'bg-[#14B8A6] text-white hover:bg-[#0E9888]'
            : plan.buttonVariant === 'dark'
              ? 'bg-[#1E293B] text-white hover:bg-[#334155]'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }`}
      >
        {loading === plan.name ? 'Processing...' : 'Get Started'}
      </button>
    );
  };

  const LoadingSkeleton = () => (
    <div className="grid md:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-8"></div>
          <div className="h-10 bg-gray-200 rounded mb-8"></div>
          {[1, 2, 3, 4].map((j) => (
            <div key={j} className="flex items-center mb-4">
              <div className="w-5 h-5 bg-gray-200 rounded-full mr-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full py-16 px-4 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-4 py-10">Select Your Plan</h2>
        </motion.div>
        
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const isActive = isActivePlan(plan.name);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: isActive ? 1 : 1.02,
                    transition: { duration: 0.2 }
                  }}
                  onHoverStart={() => setHoveredCard(plan.name)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className={`relative bg-white rounded-2xl shadow-lg p-8
                    transition-all duration-300 group 
                    ${isActive ? 'cursor-default' : 'cursor-pointer'}
                    hover:shadow-xl hover:border-[#14B8A6] 
                    ${plan.isPopular ? 'border-2 border-[#14B8A6]' : 'border border-gray-200'}`}
                >
                  {plan.isPopular && !isActive && (
                    <span className="absolute -top-3 right-8 bg-[#14B8A6] text-white px-4 py-1 rounded-full text-sm">
                      Most Popular
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute -top-3 right-8 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Active Plan
                    </span>
                  )}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{plan.name}</h3>
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-500 ml-2">{plan.period}</span>
                    </div>
                  </div>
                  {renderButton(plan)}
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-[#14B8A6] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <AnimatePresence>
                    {isActive && hoveredCard === plan.name && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 rounded-2xl z-10"
                      >
                        <Crown className="text-emerald-500 w-14 h-14 mb-6" />
                        <h3 className="text-2xl font-bold text-emerald-700 text-center">
                          Current Active Plan
                        </h3>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        view={authView}
        onViewChange={setAuthView}
      />
    </div>
  );
};

export default PricingSection;