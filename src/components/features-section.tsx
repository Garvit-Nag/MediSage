"use client";

import React from 'react';
import { Clipboard, Zap, CheckCircle, Clock } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Clipboard className="w-8 h-8 text-emerald-400" />,
      title: "Two-Path Analysis",
      description: "Choose between traditional multi-symptom analysis or detailed body-based assessment"
    },
    {
      icon: <Zap className="w-8 h-8 text-emerald-400" />,
      title: "AI Integration",
      description: "Powered by Gemini AI for accurate and detailed health insights"
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-emerald-400" />,
      title: "Comprehensive Reports",
      description: "Detailed analysis of conditions, recommendations, and care guidance"
    },
    {
      icon: <Clock className="w-8 h-8 text-emerald-400" />,
      title: "Real-time Results",
      description: "Instant access to detailed health insights and recommendations"
    }
  ];

  return (
    <div className="w-full py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Comprehensive Health Analysis Features
          </h2>
          <p className="text-gray-600 text-lg">
            Powered by advanced AI technology for accurate and detailed health insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col"
            >
              <div className="bg-emerald-50 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600 flex-grow">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;