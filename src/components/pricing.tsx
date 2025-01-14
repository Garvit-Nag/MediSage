"use client";
import React from 'react';
import { Check } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: "Basic Plan",
      price: "Free",
      period: "",
      isPopular: false,
      buttonVariant: "secondary",
      features: [
        "Symptom-based analysis system",
        "Limited to 5 analyses per day",
        "Initial assessment and summary",
        "Possible conditions analysis",
        "Severity assessment",
        "Care recommendations",
        "Prevention guidelines",
        "Educational resources"
      ]
    },
    {
      name: "Professional Plan",
      price: "$29",
      period: "/month",
      isPopular: true,
      buttonVariant: "primary",
      features: [
        "Everything in Basic plan",
        "Unlimited symptom analyses",
        "No daily rate limits"
      ]
    },
    {
      name: "Clinical Plan",
      price: "$49",
      period: "/month",
      isPopular: false,
      buttonVariant: "dark",
      features: [
        "Everything in Professional plan",
        "Body-part specific analysis system",
        "Anatomical assessment capabilities"
      ]
    }
  ];

  return (
    <div className="w-full py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 py-10">Select Your Plan</h2>
          <p className="text-gray-600 text-lg">
            Choose the assessment plan that matches your needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-zinc-100 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 ${
                plan.isPopular ? 'border-2 border-emerald-500' : ''
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3 right-8 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm">
                  Most Popular
                </span>
              )}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 ml-2">{plan.period}</span>
                </div>
              </div>
              <button
                className={`w-full py-3 rounded-lg mb-8 font-medium transition-colors duration-200 ${
                  plan.buttonVariant === 'primary'
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : plan.buttonVariant === 'dark'
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Get Started
              </button>
              <ul className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;