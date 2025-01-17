import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import PricingSection from "@/components/pricing";



export default function Pricing() {
  return (
    <main className="min-h-screen bg-gray-100">
    <Navbar />
      <PricingSection />
      <Footer />
    </main>
  )
}