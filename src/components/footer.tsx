// components/footer.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { PolicyModal, PrivacyPolicyContent, TermsOfServiceContent } from './modals/policy-modal';

export default function Footer() {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/analyse', label: 'Analyse Now' },
  ];

  return (
    <>
      <footer className="bg-[#111] text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-[#00C6AE] text-xl font-semibold">MediSage</h3>
              <p className="text-sm text-gray-400">
                AI-powered health analysis platform providing comprehensive symptom evaluation and detailed analysis.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {navigationLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-105 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setShowPrivacyPolicy(true)}
                    className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-105 inline-block"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowTerms(true)}
                    className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-105 inline-block"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <Link 
                    href="/disclaimer" 
                    className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-105 inline-block"
                  >
                    Medical Disclaimer
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div className="space-y-4">
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                  <MapPin className="w-4 h-4 text-[#00C6AE]" />
                  <span>Chandigarh, India</span>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                  <Mail className="w-4 h-4 text-[#00C6AE]" />
                  <a 
                    href="mailto:garvitcpp@gmail.com"
                    className="hover:text-white transition-all duration-300"
                  >
                    garvitcpp@gmail.com
                  </a>
                </li>
                <li className="flex justify-center md:justify-start space-x-4 pt-2">
                  <a 
                    href="https://github.com/Garvit-Nag" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#00C6AE] transition-all duration-300 hover:scale-110"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/garvit-nag/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#00C6AE] transition-all duration-300 hover:scale-110"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>

                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} MediSage. All rights reserved.
          </div>
        </div>
      </footer>

      <PolicyModal
        isOpen={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
        title="Privacy Policy"
        content={<PrivacyPolicyContent />}
      />

      <PolicyModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Terms of Service"
        content={<TermsOfServiceContent />}
      />
    </>
  );
}