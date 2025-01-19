// components/modals/policy-modal.tsx
import { JSX, useEffect } from 'react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: JSX.Element;
}

export function PolicyModal({ isOpen, onClose, title, content }: PolicyModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}

export const PrivacyPolicyContent = () => (
  <div className="space-y-4 text-gray-600">
    <h3 className="text-lg font-semibold text-gray-900">Privacy Policy for MediSage</h3>
    
    <section className="space-y-2">
      <h4 className="font-medium text-gray-900">Information We Collect</h4>
      <p>We only collect and store:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Your email address for account management</li>
        <li>Your active subscription plan details</li>
      </ul>
      <p>We do NOT store any health-related information or symptom analysis data.</p>
    </section>

    <section className="space-y-2">
      <h4 className="font-medium text-gray-900">How We Use Your Information</h4>
      <ul className="list-disc pl-5 space-y-1">
        <li>Account authentication and management</li>
        <li>Subscription service delivery</li>
        <li>Communication about your account and services</li>
      </ul>
    </section>

    <section className="space-y-2">
      <h4 className="font-medium text-gray-900">Data Security</h4>
      <p>We implement industry-standard security measures to protect your personal information. All analysis sessions are processed in real-time and not stored.</p>
    </section>

    <section className="space-y-2">
      <h4 className="font-medium text-gray-900">Third-Party Services</h4>
      <p>We use:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Stripe for payment processing</li>
        <li>MongoDB for user account storage</li>
        <li>Upstash Redis for rate limiting</li>
      </ul>
    </section>
  </div>
);

export const TermsOfServiceContent = () => (
  <div className="space-y-4 text-gray-600">
    <h3 className="text-lg font-semibold text-gray-900">Terms of Service for MediSage</h3>
    
    <section className="space-y-2">
      <h4 className="font-medium text-gray-900">Service Description</h4>
      <p>MediSage provides AI-powered symptom analysis through:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Basic symptom analysis (Free Plan - with rate limits)</li>
        <li>Unlimited basic analysis (Professional Plan)</li>
        <li>Advanced body-map based analysis (Clinical Plan)</li>
      </ul>
    </section>

    <section className="space-y-2">
      <h4 className="font-medium text-gray-900">User Plans and Access</h4>
      <ul className="list-disc pl-5 space-y-1">
        <li>Free Plan: Limited symptom analysis with rate limiting</li>
        <li>Professional Plan: Unlimited access to basic analysis</li>
        <li>Clinical Plan: Full access to all features including body-map analysis</li>
      </ul>
    </section>

    <section className="space-y-2">
      <h4 className="font-medium text-gray-900">Usage Guidelines</h4>
      <p>Users agree to:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Provide accurate information during analysis</li>
        <li>Not use the service as a substitute for professional medical advice</li>
        <li>Respect rate limits for free plan usage</li>
      </ul>
    </section>

    <section className="space-y-2">
      <h4 className="font-medium text-gray-900">Service Limitations</h4>
      <p>MediSage is an informational tool only and should not be used for:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Emergency medical situations</li>
        <li>Replacing professional medical advice</li>
        <li>Self-diagnosis or self-treatment</li>
      </ul>
    </section>
  </div>
);