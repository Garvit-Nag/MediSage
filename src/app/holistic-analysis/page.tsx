"use client"

import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import SymptomForm from '@/components/symptom-form'
import { motion } from 'framer-motion'

export default function TraditionalAnalysisPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#1E293B]">
      <Navbar />
      
      <motion.div 
        className="flex-grow py-24 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-5xl mx-auto">

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <SymptomForm />
          </motion.div>
        </div>
      </motion.div>

      <Footer />
    </main>
  )
}