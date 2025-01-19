'use client';

import AccountDashboard from '@/components/account';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow mt-20">
        <AccountDashboard />
      </main>
      <Footer />
    </div>
  );
}