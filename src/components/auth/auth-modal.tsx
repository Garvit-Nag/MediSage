import { SignIn, SignUp } from '@clerk/nextjs';
import { Modal } from '../ui/modal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  view: 'sign-in' | 'sign-up';
  onViewChange: (view: 'sign-in' | 'sign-up') => void;
}

export const AuthModal = ({ isOpen, onClose, view, onViewChange }: AuthModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex min-h-[500px] w-[400px] items-center justify-center">
        {view === 'sign-in' ? (
          <div className="w-full">
            <SignIn
              routing="hash"
              appearance={{
                layout: {
                  socialButtonsPlacement: 'bottom',
                  socialButtonsVariant: 'iconButton',
                  privacyPageUrl: 'https://clerk.com/privacy',
                  termsPageUrl: 'https://clerk.com/terms',
                  showOptionalFields: false,
                },
                elements: {
                  rootBox: 'mx-auto',
                  card: 'bg-white shadow-md rounded-lg',
                  socialButtonsIconButton: 'hover:bg-gray-100',
                  formButtonPrimary: 'bg-[#14B8A6] hover:bg-[#14B8A6]/90',
                  footerActionLink: 'hidden',
                  footer: {
                    display: 'none'
                  }
                },
              }}
              redirectUrl="#"
            />
            <div className="text-center mt-4 bg-white rounded-lg py-3 shadow-md">
              <span className="text-gray-600">Don&apos;t have an account?</span>{' '}
              <button
                onClick={() => onViewChange('sign-up')}
                className="text-[#14B8A6] hover:text-[#14B8A6]/90 font-medium"
              >
                Sign up
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <SignUp
              routing="hash"
              appearance={{
                layout: {
                  socialButtonsPlacement: 'bottom',
                  socialButtonsVariant: 'iconButton',
                  privacyPageUrl: 'https://clerk.com/privacy',
                  termsPageUrl: 'https://clerk.com/terms',
                  showOptionalFields: false,
                },
                elements: {
                  rootBox: 'mx-auto',
                  card: 'bg-white shadow-md rounded-lg',
                  socialButtonsIconButton: 'hover:bg-gray-100',
                  formButtonPrimary: 'bg-[#14B8A6] hover:bg-[#14B8A6]/90',
                  footerActionLink: 'hidden',
                  footer: {
                    display: 'none'
                  }
                },
              }}
              redirectUrl="#"
            />
            <div className="text-center mt-4 bg-white rounded-lg py-3 shadow-md">
              <span className="text-gray-600">Already have an account?</span>{' '}
              <button
                onClick={() => onViewChange('sign-in')}
                className="text-[#14B8A6] hover:text-[#14B8A6]/90 font-medium"
              >
                Sign in
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};