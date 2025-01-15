"use client";
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { loadStripe } from '@stripe/stripe-js';
import { setUserPlan } from '@/lib/session-storage';
import { AuthModal } from '@/components/auth/auth-modal';

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

const PricingSection = () => {
  const { user, isSignedIn } = useUser();
  const [loading, setLoading] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState<'sign-in' | 'sign-up'>('sign-in');

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

  const handleSubscription = async (priceId: string | null, planName: string) => {
    if (!isSignedIn) {
      setShowAuthModal(true);
      return;
    }

    if (!priceId) {
      // Handle free plan
      if (user?.emailAddresses?.[0]?.emailAddress) {
        setUserPlan(user.emailAddresses[0].emailAddress, 'basic', '');
        // Redirect to dashboard or show success message
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
      // Using a more user-friendly error message
      alert('There was a problem processing your request. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <><div className="w-full py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 py-10">Select Your Plan</h2>
          <p className="text-gray-600 text-lg">
            Choose the assessment plan that matches your needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-zinc-100 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 ${plan.isPopular ? 'border-2 border-emerald-500' : ''}`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3 right-8 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm">
                  Most Popular
                </span>
              )}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 ml-2">{plan.period}</span>
                </div>
              </div>
              <button
                onClick={() => handleSubscription(plan.priceId, plan.name)}
                disabled={loading === plan.name}
                className={`w-full py-3 rounded-lg mb-8 font-medium transition-colors duration-200 ${loading === plan.name ? 'opacity-50 cursor-not-allowed' : ''} ${plan.buttonVariant === 'primary'
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : plan.buttonVariant === 'dark'
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                {loading === plan.name ? 'Processing...' : 'Get Started'}
              </button>
              <ul className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div><AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        view={authView}
        onViewChange={setAuthView} /></>
  );
};

export default PricingSection;