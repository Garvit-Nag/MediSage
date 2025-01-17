'use client';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import BodySymptomForm from '@/components/body-symptom-form';

export default function AnalyzerPage() {
  return (
    <div className="min-h-screen bg-[#1E293B]">
      <Navbar />
      <main className="pt-12 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">

          </div>
          <BodySymptomForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}