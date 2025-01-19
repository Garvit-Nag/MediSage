'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import BodyPartSelector from './bodyhighlighter';
import { useRouter } from 'next/navigation';
import Preloader from './preloader';  

interface FormData {
  age: number;
  gender: string;
  body_parts: string[];
  symptom_types: string[];
  severity: string;
  duration: string;
  description: string;
}

export default function BodySymptomForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    age: 25,
    gender: '',
    body_parts: [],
    symptom_types: [],
    severity: '',
    duration: '',
    description: ''
  });
  const [symptomInput, setSymptomInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSymptomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && symptomInput.trim()) {
      setFormData(prev => ({
        ...prev,
        symptom_types: [...prev.symptom_types, symptomInput.trim()]
      }));
      setSymptomInput('');
    }
  };

  const removeSymptom = (index: number) => {
    setFormData(prev => ({
      ...prev,
      symptom_types: prev.symptom_types.filter((_, i) => i !== index)
    }));
  };

  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BODY_ANALYSER!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: formData.age,
          gender: formData.gender,
          body_parts: formData.body_parts,
          symptom_types: formData.symptom_types,
          severity: formData.severity,
          duration: formData.duration,
          description: formData.description
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      router.push(`/results?type=body-based&data=${encodeURIComponent(JSON.stringify(data))}`);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false); // Stop loading on error
    }
  };
  
  if (isLoading) {
    return <Preloader />;
  }


  return (
    <div className="bg-white rounded-lg shadow-xl p-6 relative font-sans">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8 relative">
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
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm 
                ${number === step
                  ? 'bg-[#14B8A6] text-white'
                  : number < step
                    ? 'bg-[#14B8A6] text-white'
                    : 'bg-gray-200 text-gray-600'}`}
              initial={false}
              animate={{
                scale: number === step ? 1.1 : 1,
                backgroundColor: number <= step ? '#14B8A6' : '#E5E7EB'
              }}
            >
              {number}
            </motion.div>
            <div
              className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium
                ${number <= step ? 'text-[#14B8A6]' : 'text-gray-600'}`}
            >
              {number === 1 ? 'Basic Info' : number === 2 ? 'Body Area' : 'Symptoms'}
            </div>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="mt-12">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="max-w-xl mx-auto">
                <label className="block text-gray-700 mb-2 text-center">Age</label>
                <div className="flex items-center justify-between space-x-4 px-8">
                  <button
                    onClick={() => handleAgeChange(-1)}
                    className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-2xl"
                  >
                    -
                  </button>
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
                  <button
                    onClick={() => handleAgeChange(1)}
                    className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-2xl"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Gender</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Male', 'Female'].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setFormData({ ...formData, gender: gender.toLowerCase() })}
                      className={`p-4 rounded-lg border-2 transition-all
                        ${formData.gender === gender.toLowerCase()
                          ? 'border-[#14B8A6] bg-[#14B8A6]/10'
                          : 'border-gray-200 hover:border-[#14B8A6]'
                        }
                        hover:shadow-[0_0_15px_rgba(20,184,166,0.3)]`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <BodyPartSelector
                onSelectBodyPart={(parts) =>
                  setFormData({ ...formData, body_parts: parts })
                }
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-gray-700 mb-2">Symptoms</label>
                <input
                  type="text"
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  onKeyDown={handleSymptomKeyDown}
                  placeholder="Type a symptom and press Enter"
                  className="w-full p-3 border rounded-lg"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.symptom_types.map((symptom, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-[#14B8A6] text-white rounded-full px-4 py-2"
                    >
                      <span>{symptom}</span>
                      <button
                        onClick={() => removeSymptom(index)}
                        className="ml-2 text-white/80 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Severity</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Mild', 'Moderate', 'Severe'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setFormData({ ...formData, severity: level.toLowerCase() })}
                      className={`p-3 rounded-lg transition-all
                        ${formData.severity === level.toLowerCase()
                          ? 'bg-[#14B8A6] text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="e.g., 2 days"
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your symptoms in detail"
                  className="w-full p-3 border rounded-lg h-32 resize-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button
            onClick={handleBack}
            className="flex items-center px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            <ChevronLeft className="mr-2" size={20} />
            Back
          </button>
        )}
        <div className="ml-auto">
          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && (!formData.age || !formData.gender)) ||
                (step === 2 && formData.body_parts.length === 0)
              }
              className="flex items-center px-6 py-2 bg-[#14B8A6] text-white rounded-lg hover:bg-[#14B8A6]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="ml-2" size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={
                !formData.symptom_types.length ||
                !formData.severity ||
                !formData.duration ||
                !formData.description
              }
              className="px-6 py-2 bg-[#14B8A6] text-white rounded-lg hover:bg-[#14B8A6]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}