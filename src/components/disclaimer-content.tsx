"use client";
import React, { useState, useEffect, JSX } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { X, AlertTriangle, Shield, AlertCircle, BookOpen, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Section {
  title: string;
  icon: JSX.Element;
  content: string;
  subsections: {
    title: string;
    items?: string[];
    content?: string;
  }[];
}

const DisclaimerPage = () => {
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const sections: Section[] = [
    {
      title: "Medical Disclaimer",
      icon: <Shield className="w-6 h-6 text-[#14B8A6]" />,
      content: "MediSage provides an AI-powered symptom analysis tool for informational purposes only. By using this service, you acknowledge and agree to the following:",
      subsections: [
        {
          title: "General Disclaimer",
          content: "The information and analysis provided through MediSage, including all symptom evaluations, recommendations, and insights, do not constitute professional medical advice, diagnosis, or treatment. The service is designed to provide general information and should not be used as a substitute for professional medical consultation."
        },
        {
          title: "Key Points",
          items: [
            "Not Medical Advice",
            "AI-Based Analysis",
            "Emergency Situations",
            "No Doctor-Patient Relationship",
            "Personal Responsibility",
            "Data Privacy"
          ]
        }
      ]
    },
    {
      title: "Emergency Guidelines",
      icon: <AlertTriangle className="w-6 h-6 text-[#14B8A6]" />,
      content: "Seek immediate emergency medical attention if you experience any of the following:",
      subsections: [
        {
          title: "Life-Threatening Symptoms",
          items: [
            "Difficulty breathing or shortness of breath",
            "Chest pain or pressure",
            "Sudden severe headache",
            "Sudden confusion or difficulty speaking",
            "Sudden loss of vision or double vision",
            "Seizures",
            "Severe abdominal pain",
            "Fainting or loss of consciousness",
            "Severe allergic reactions",
            "Suicidal thoughts or intentions"
          ]
        },
        {
          title: "Serious Injuries",
          items: [
            "Head injuries with loss of consciousness",
            "Deep wounds with heavy bleeding",
            "Broken bones with visible deformity",
            "Severe burns",
            "Electric shocks",
            "Poisoning or overdose"
          ]
        }
      ]
    },
    {
      title: "Emergency Action Steps",
      icon: <AlertCircle className="w-6 h-6 text-[#14B8A6]" />,
      content: "Follow these important steps during emergencies:",
      subsections: [
        {
          title: "DO",
          items: [
            "Call emergency services immediately (911 in the US) if experiencing any life-threatening symptoms",
            "Stay calm and find a safe location",
            "Have someone stay with you if possible",
            "Gather any relevant medical information (medications, allergies, medical conditions)",
            "Keep your airways clear and lie down if feeling faint",
            "Apply direct pressure to any bleeding wounds",
            "Follow emergency dispatcher instructions if on the phone with them"
          ]
        },
        {
          title: "DON'T",
          items: [
            "Don't delay seeking emergency care if symptoms are severe",
            "Don't drive yourself to the hospital if experiencing severe symptoms",
            "Don't take new medications without medical supervision",
            "Don't move someone who may have spine or neck injuries",
            "Don't ignore warning signs hoping they will go away",
            "Don't waste time looking up symptoms online during an emergency",
            "Don't take food or drink if you're having severe symptoms"
          ]
        }
      ]
    },
    {
      title: "Using MediSage Responsibly",
      icon: <BookOpen className="w-6 h-6 text-[#14B8A6]" />,
      content: "Understanding when and how to use MediSage effectively:",
      subsections: [
        {
          title: "When to Use MediSage",
          items: [
            "For non-emergency symptom assessment",
            "To better understand minor health concerns",
            "To prepare for medical appointments",
            "For general health information and education"
          ]
        },
        {
          title: "When NOT to Use MediSage",
          items: [
            "During medical emergencies",
            "As a replacement for emergency services",
            "Instead of seeking professional medical care",
            "For critical medical decisions",
            "For mental health crises"
          ]
        }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`min-h-screen bg-gray-100 ${showModal ? 'blur-sm' : ''}`}>
        {/* Header */}
        <div className="bg-[#1E293B] text-white py-12">
  <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
    <h1 className="text-4xl font-bold mb-4 flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
      <AlertCircle className="w-8 h-8 text-[#14B8A6]" />
      <span>Medical Disclaimer & Guidelines</span>
    </h1>
    <p className="text-gray-300 max-w-2xl mx-auto md:mx-0 text-center md:text-left">
      Important information about using MediSage&apos;s AI-powered symptom analysis platform and emergency guidelines.
    </p>
  </div>
</div>


        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, idx) => (
              <Card
                key={idx}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => {
                  setSelectedSection(section);
                  setShowModal(true);
                }}
              >
                <CardContent className="p-0">
                  <div className="bg-[#1E293B] p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {section.icon}
                        <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#14B8A6] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{section.content}</p>
                    <div className="space-y-2">
                      {section.subsections.map((subsection, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
                          <span>{subsection.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && selectedSection && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {selectedSection.icon}
                    <h2 className="text-2xl font-bold text-[#1E293B]">{selectedSection.title}</h2>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-8">{selectedSection.content}</p>
                {selectedSection.subsections.map((subsection, idx) => (
                  <div key={idx} className="mb-8">
                    <h3 className="text-xl font-semibold text-[#1E293B] mb-4">{subsection.title}</h3>
                    {subsection.content && (
                      <p className="text-gray-600 mb-4">{subsection.content}</p>
                    )}
                    {subsection.items && (
                      <ul className="space-y-3">
                        {subsection.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#14B8A6] mt-2 flex-shrink-0" />
                            <span className="text-gray-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DisclaimerPage;