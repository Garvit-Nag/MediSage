"use client";
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does the symptom analysis work?",
      answer: "Our AI-powered system analyzes your symptoms using advanced algorithms and medical databases. It considers multiple factors including symptom combinations, duration, and severity to provide comprehensive health insights."
    },
    {
      question: "What is the accuracy rate of the analysis?",
      answer: "Our system maintains a high accuracy rate for initial health assessments. However, it's important to note that this is meant as a preliminary analysis and should not replace professional medical consultation."
    },
    {
      question: "What are the usage guidelines?",
      answer: "The system is designed for initial health assessment and guidance. For emergencies, always contact emergency services immediately. Follow recommended actions and consult healthcare professionals when advised."
    },
    {
      question: "What are the medical disclaimer details?",
      answer: "Our service provides health information and guidance but is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers for medical concerns."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg">
            Find answers to common questions about our AI-powered health analysis
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors duration-150 focus:outline-none"
              >
                <span className="text-lg font-medium">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="p-6 pt-0 text-gray-600">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;