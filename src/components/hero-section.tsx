/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = ['/images/mainimg1.jpg', '/images/mainimg2.jpg', '/images/mainimg3.jpg'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="min-h-[80vh] pt-16 relative w-full"
      style={{
        backgroundImage: "url('/bgmain.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-navy-900/90 bg-gradient-to-br from-navy-900/95 to-navy-800/90" />
      
      <div className="relative w-full px-4 md:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div 
            className="space-y-8 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left lg:pl-14"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              AI-Powered Symptom Analysis for{' '}
              <span className="text-[#14B8A6]">
                Informed Health Decisions
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Comprehensive symptom evaluation through traditional multi-symptom analysis or detailed body-based assessment
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link 
                href="/analyse"
                className="bg-[#14B8A6] text-white px-8 py-3 rounded-full text-lg hover:bg-[#129687] transition-all hover:scale-105 text-center"
              >
                Analyse Now
              </Link>
              <Link 
                href="/learn-more"
                className="border border-gray-600 text-white px-8 py-3 rounded-full text-lg hover:bg-gray-800 transition-all hover:scale-105 text-center"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className="relative h-[300px] lg:h-[500px] w-full max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6]/20 to-blue-500/20 rounded-[3rem] rotate-6 scale-95 blur-xl" />
            <div className="absolute inset-0 border-2 border-[#14B8A6]/30 rounded-[3rem] rotate-3" />
            <div className="relative h-full w-full overflow-hidden rounded-[3rem] bg-gradient-to-br from-navy-800/50 to-navy-900/50 backdrop-blur-sm border border-white/10">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative h-full w-full"
              >
                <Image
                  src={images[currentImageIndex]}
                  alt="Medical Dashboard Interface"
                  fill
                  className="object-cover object-center"
                  priority
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;