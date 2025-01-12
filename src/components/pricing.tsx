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
        "Basic symptom analysis",
        "Limited analyses per month",
        "Basic health recommendations",
        "Emergency indicators"
      ]
    },
    {
      name: "Professional Plan",
      price: "$29",
      period: "/month",
      isPopular: true,
      buttonVariant: "primary",
      features: [
        "Unlimited symptom analyses",
        "Detailed condition descriptions",
        "Full prevention strategies",
        "Complete care guidance",
        "Educational resources access"
      ]
    },
    {
      name: "Premium Plan",
      price: "$49",
      period: "/month",
      isPopular: false,
      buttonVariant: "dark",
      features: [
        "Everything in Professional",
        "Detailed prognosis information",
        "Comprehensive diagnoses",
        "Detailed monitoring guidelines",
        "Complete diagnostic approach"
      ]
    }
  ];

  return (
    <div className="w-full py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 py-10">Choose Your Plan</h2>
          <p className="text-gray-600 text-lg">
            Select the perfect plan for your health monitoring needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="relative bg-zinc-100 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8"
            >
              {plan.isPopular && (
                <span className="absolute -top-3 right-8 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm">
                  Popular
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
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Get Started
              </button>

              <ul className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-emerald-500 mr-3 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            All plans include 24/7 access to emergency indicators and basic health recommendations.{' '}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;