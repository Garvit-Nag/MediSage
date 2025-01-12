'use client';

import { useState, useEffect, JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar(): JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/features', label: 'Features' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/faq', label: 'FAQ' },
  ];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg' : 'bg-gray-900'
      }`}
    >
      <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-14">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0 pl-4 min-[1150px]:pl-4 w-full min-[1150px]:w-auto flex min-[1150px]:block justify-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={150}
                height={150}
                className="w-auto h-12 my-2"
                priority
                quality={100}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden min-[1150px]:flex items-center gap-2 xl:gap-6">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-100 hover:text-white px-4 py-2 text-base font-medium transition-colors rounded-md hover:bg-gray-800"
              >
                {link.label}
              </Link>
            ))}
            <Link 
              href="/get-started"
              className="bg-teal-500 text-white px-6 py-2.5 rounded-lg hover:bg-teal-600 transition-all text-base font-semibold hover:shadow-lg ml-4"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="min-[1150px]:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-3 rounded-md text-gray-100 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="h-7 w-7"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`min-[1150px]:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-screen opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible'
        }`}
      >
        <div className="px-4 pt-2 pb-3 space-y-2 bg-gray-900/95 backdrop-blur-sm shadow-lg">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-gray-100 hover:text-white hover:bg-gray-800 px-4 py-3 text-base font-medium rounded-md transition-colors text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link 
            href="/get-started"
            className="block bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-all text-base font-semibold hover:shadow-lg mt-4 text-center"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}