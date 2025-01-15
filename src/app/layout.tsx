import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MediSage - AI-Powered Symptom Analysis',
  description: 'Advanced healthcare management platform',
};

import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
