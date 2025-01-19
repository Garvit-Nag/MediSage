'use client';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import DisclaimerPage from '@/components/disclaimer-content';

export default function Disclaimer() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow mt-12">
        <DisclaimerPage />
      </main>
      <Footer />
    </div>
  );
}