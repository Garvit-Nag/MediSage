'use client';

import { useSearchParams } from 'next/navigation';
import MedicalReport from '@/components/display-results';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const encodedData = searchParams.get('data');
  
  if (!encodedData || !type) {
    return <div>No data available</div>;
  }

  const data = JSON.parse(decodeURIComponent(encodedData));

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="print:hidden">
        <Navbar />
      </div>
      <div className="pt-14 print:pt-0">
        <MedicalReport
          data={data}
          type={type as 'traditional' | 'body-based'}
        />
      </div>
      <div className="print:hidden">
        <Footer />
      </div>

      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
          }
          
          body * {
            visibility: hidden;
          }
          
          .medical-report-container,
          .medical-report-container * {
            visibility: visible;
          }
          
          .medical-report-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          @page {
            size: A4;
            margin: 20mm;
          }
        }
      `}</style>
    </div>
  );
}