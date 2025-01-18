"use client";
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';


interface FormData {
  symptoms: string[];
  age: number;
  gender: string;
  duration: string;
}

const COMMON_SYMPTOMS = [
  'Headache',
  'Fever',
  'Cough',
  'Fatigue',
  'Nausea',
  'Dizziness',
  'Shortness of breath',
  'Body ache',
  'Sore throat',
  'Chills'
] as const;

export default function SymptomForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    symptoms: [],
    age: 25,
    gender: '',
    duration: ''
  });
  const [symptomInput, setSymptomInput] = useState('');

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAgeChange = (increment: number) => {
    setFormData(prev => ({
      ...prev,
      age: Math.max(0, Math.min(120, prev.age + increment))
    }));
  };

  const handleSymptomKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && symptomInput.trim()) {
      addSymptom(symptomInput.trim());
      setSymptomInput('');
    }
  };

  const addSymptom = (symptom: string) => {
    if (!formData.symptoms.includes(symptom)) {
      setFormData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, symptom]
      }));
    }
  };

  const removeSymptom = (symptomToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter(symptom => symptom !== symptomToRemove)
    }));
  };

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_TRADITIONAL_ANALYSIS!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms: formData.symptoms,
          age: formData.age,
          gender: formData.gender,
          duration: formData.duration
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      router.push(`/results?type=traditional&data=${encodeURIComponent(JSON.stringify(data))}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 relative max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="flex justify-between mb-12 px-4 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2">
          <motion.div
            className="h-full bg-[#14B8A6]"
            initial={{ width: '0%' }}
            animate={{ width: `${((step - 1) / 2) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {[1, 2, 3].map((number) => (
          <div key={number} className="relative z-10">
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold
                ${number <= step ? 'bg-[#14B8A6] text-white' : 'bg-gray-200 text-gray-600'}`}
              initial={false}
              animate={{
                scale: number === step ? 1.1 : 1,
                backgroundColor: number <= step ? '#14B8A6' : '#E5E7EB'
              }}
              transition={{ duration: 0.2 }}
            >
              {number}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="symptoms"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-xl font-semibold text-gray-700 mb-4">
                  What symptoms are you experiencing?
                </label>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    onKeyDown={handleSymptomKeyDown}
                    placeholder="Type a symptom and press Enter"
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 outline-none transition-all"
                  />

                  <div className="flex flex-wrap gap-2">
                    {COMMON_SYMPTOMS.map((symptom) => (
                      <button
                        key={symptom}
                        onClick={() => addSymptom(symptom)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                          ${formData.symptoms.includes(symptom)
                            ? 'bg-[#14B8A6] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>

                  {formData.symptoms.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Selected Symptoms</h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.symptoms.map((symptom) => (
                          <div
                            key={symptom}
                            className="flex items-center bg-[#14B8A6] text-white rounded-full px-4 py-2"
                          >
                            <span>{symptom}</span>
                            <button
                              onClick={() => removeSymptom(symptom)}
                              className="ml-2 text-white/80 hover:text-white"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="demographics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <label className="block text-xl font-semibold text-gray-700 mb-6">Age</label>
                <div className="flex items-center justify-center space-x-6">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAgeChange(-1)}
                    className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-2xl font-medium"
                  >
                    -
                  </motion.button>
                  <div className="relative w-24">
                  <input
  type="number"
  value={formData.age}
  onChange={(e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setFormData(prev => ({
        ...prev,
        age: Math.max(0, Math.min(120, value))
      }));
    }
  }}
  className="text-4xl font-semibold w-full text-center bg-transparent focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
  min="0"
  max="120"
/>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAgeChange(1)}
                    className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-2xl font-medium"
                  >
                    +
                  </motion.button>
                </div>
              </div>

              <div>
                <label className="block text-xl font-semibold text-gray-700 mb-4">Gender</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Male', 'Female'].map((gender) => (
                    <motion.button
                      key={gender}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, gender: gender.toLowerCase() })}
                      className={`p-4 rounded-lg border-2 transition-all text-lg font-medium
                        ${formData.gender === gender.toLowerCase()
                          ? 'border-[#14B8A6] bg-[#14B8A6]/10 text-[#14B8A6]'
                          : 'border-gray-200 hover:border-[#14B8A6]'
                        }`}
                    >
                      {gender}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="duration"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div>
                <label className="block text-xl font-semibold text-gray-700 mb-4">
                  How long have you been experiencing these symptoms?
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 3 days"
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20 outline-none transition-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-12">
        {step > 1 ? (
          <button
            onClick={handleBack}
            className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
          >
            <ChevronLeft className="mr-2" size={20} />
            Back
          </button>
        ) : (
          <div /> // Empty div to maintain spacing
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={step < 3 ? handleNext : handleSubmit}
          disabled={
            (step === 1 && formData.symptoms.length === 0) ||
            (step === 2 && (!formData.age || !formData.gender)) ||
            (step === 3 && !formData.duration)
          }
          className="flex items-center px-8 py-3 bg-[#14B8A6] text-white rounded-lg hover:bg-[#14B8A6]/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {step < 3 ? (
            <>
              Next
              <ChevronRight className="ml-2" size={20} />
            </>
          ) : (
            'Submit'
          )}
        </motion.button>
      </div>
    </div>
  );
}