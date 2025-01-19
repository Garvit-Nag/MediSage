'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';
import { AuthModal } from './auth/auth-modal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'sign-in' | 'sign-up'>('sign-in');
  const { isSignedIn } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/analyse', label: 'Analyse Now' },
    { href: '/disclaimer', label: 'Disclaimer' },
  ];

  const handleAuthClick = (view: 'sign-in' | 'sign-up') => {
    setAuthView(view);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <nav 
        className={`fixed w-full z-40 transition-all duration-300 ${
          isScrolled ? 'bg-[#131A29]/95 backdrop-blur-sm shadow-lg' : 'bg-[#131A29]'
        }`}
      >
        <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-14">
          <div className="flex items-center justify-between h-16 sm:h-20">
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
            
            <div className="hidden min-[1150px]:flex items-center gap-2 xl:gap-6">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-100 hover:text-white px-4 py-2 text-base font-medium transition-all duration-300 rounded-md group relative hover:-translate-y-0.5 hover:scale-105"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#14B8A6] group-hover:w-full group-hover:left-0 transition-all duration-300" />
                </Link>
              ))}
              
              {isSignedIn ? (
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                      userButtonAvatarBox: "border-2 border-[#14B8A6] rounded-full", 
                      userButtonPopoverCard: "py-2",
                      userPreviewMainIdentifier: "font-semibold",
                    },
                  }}
                  userProfileMode="navigation"
                  userProfileUrl="/dashboard"
                />
              ) : (
                <button 
                  onClick={() => handleAuthClick('sign-in')}
                  className="bg-[#14B8A6] text-white px-6 py-2.5 rounded-lg hover:bg-[#14B8A6]/90 transition-all text-base font-semibold hover:shadow-lg ml-4"
                >
                  Sign In
                </button>
              )}
            </div>

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

        <div 
          className={`min-[1150px]:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? 'max-h-screen opacity-100 visible' 
              : 'max-h-0 opacity-0 invisible'
          }`}
        >
          <div className="px-4 pt-2 pb-3 space-y-2 bg-[#131A29]/95 backdrop-blur-sm shadow-lg">
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
            
            {isSignedIn ? (
              <div className="flex justify-center pt-4">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                      userButtonPopoverCard: "py-2",
                      userPreviewMainIdentifier: "font-semibold",
                    },
                  }}
                  userProfileMode="navigation"
                  userProfileUrl="/account"
                />
              </div>
            ) : (
              <button 
                onClick={() => handleAuthClick('sign-in')}
                className="w-full bg-[#14B8A6] text-white px-6 py-3 rounded-lg hover:bg-[#14B8A6]/90 transition-all text-base font-semibold hover:shadow-lg mt-4"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        view={authView}
        onViewChange={(newView) => setAuthView(newView)}
      />
    </>
  );
}