'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserRoundSearch, FileText, Microscope } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Choose Your Analysis Method",
      description: "Select between traditional symptom analysis or body-based assessment",
      icon: UserRoundSearch,
    },
    {
      number: 2,
      title: "Enter Your Symptoms & Details",
      description: "Provide detailed information about your symptoms and health concerns",
      icon: FileText,
    },
    {
      number: 3,
      title: "Get Comprehensive Health Insights",
      description: "Receive detailed analysis and personalized health recommendations",
      icon: Microscope,
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="w-full bg-gray-50">
      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Get your health insights in three simple steps
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4 relative"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="flex"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 w-full flex flex-col hover:shadow-xl transition-shadow duration-300">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold mb-6 mx-auto flex-shrink-0"
                >
                  {step.number}
                </motion.div>
                <div className="p-4 bg-teal-50 rounded-lg mb-6 mx-auto w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-8 h-8 text-teal-500" />
                </div>
                <div className="flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-4 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center mt-12"
        >
          <button className="bg-teal-500 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors duration-300 transform hover:scale-105">
            Start Your Analysis Now
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default HowItWorks;