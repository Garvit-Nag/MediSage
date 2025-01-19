/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { Crown, ChevronRight, Loader2, CreditCard, UserCheck, ArrowLeftRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';

interface SubscriptionData {
  planName: string;
  status: string;
  currentPeriodEnd?: string;
  customerId?: string;
  subscriptionId?: string;
}

const AccountDashboard = () => {
  const { user, isLoaded } = useUser();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/verify-subscription');
        if (!response.ok) {
          throw new Error('Failed to fetch subscription data');
        }
        const data = await response.json();
        setSubscription(data);
      } catch (error) {
        console.error('Error fetching subscription:', error);
        setError('Failed to load subscription details');
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded && user) {
      fetchSubscription();
    }
  }, [isLoaded, user]);

  const handlePlanChange = async (planType: 'professional' | 'clinical') => {
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

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 w-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <Loader2 className="h-8 w-8 animate-spin text-[#14B8A6]" />
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  const currentPlan = subscription?.planName?.toLowerCase() || '';
  const isClinical = currentPlan.includes('clinical');
  const isProfessional = currentPlan.includes('professional');
  const isPremium = isClinical || isProfessional;
  
  const subscriptionEnd = subscription?.currentPeriodEnd 
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
    : 'N/A';

  return (
    <div className="bg-gray-100">
      {error && (
        <div className="max-w-6xl mx-auto px-6 pt-6">
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg">
            {error}
          </div>
        </div>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto p-6 space-y-8"
      >
        <motion.div 
          className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <img
                src={user?.imageUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-[#14B8A6] shadow-lg"
              />
              {isPremium && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ rotate: 10 }}
                  className="absolute -top-2 -right-2 bg-[#14B8A6] rounded-full p-1.5 shadow-lg"
                >
                  <Crown className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.fullName || 'User'}</h1>
              <p className="text-gray-600">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
  {isProfessional && (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handlePlanChange('clinical')}
      className="bg-[#14B8A6] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#14B8A6]/90 transition-all flex items-center space-x-2 shadow-lg"
    >
      <span>Upgrade to Clinical</span>
      <ChevronRight className="w-4 h-4" />
    </motion.button>
  )}
  {!isPremium && (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push('/pricing')}
      className="bg-[#14B8A6] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#14B8A6]/90 transition-all flex items-center space-x-2 shadow-lg"
    >
      <span>Upgrade Plan</span>
      <ChevronRight className="w-4 h-4" />
    </motion.button>
  )}
</div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-[#14B8A6] flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Subscription Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Current Plan</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-[#1E293B]">
                        {subscription?.planName || 'Basic'}
                      </span>
                      {isPremium && (
                        <span className="bg-[#14B8A6]/10 text-[#14B8A6] px-2 py-1 rounded-full text-sm font-medium">
                          Premium
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="font-semibold text-[#1E293B] capitalize">
                      {subscription?.status || 'Active'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-[#14B8A6] flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Account Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-semibold text-[#1E293B]">
                      {new Date(user?.createdAt || '').toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Email Verified</span>
                    <span className={`font-semibold ${
                      user?.primaryEmailAddress?.verification?.status === 'verified' 
                        ? 'text-green-600' 
                        : 'text-amber-600'
                    }`}>
                      {user?.primaryEmailAddress?.verification?.status === 'verified' ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountDashboard;

function setIsAuthModalOpen(arg0: boolean) {
    throw new Error('Function not implemented.');
}
