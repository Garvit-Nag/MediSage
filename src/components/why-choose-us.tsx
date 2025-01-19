/* eslint-disable @next/next/no-img-element */

"use client";
import { useEffect, useState } from "react";
import { TextComponent } from "@/components/eldoraui/featurefour";
import { cn } from "@/lib/utils";

const data = [
  {
    title: "Detailed Symptom Analysis",
    content: "Comprehensive evaluation of symptoms using advanced AI algorithms for accurate results. Our system analyzes multiple symptoms simultaneously, considering their relationships and potential underlying causes.",
    srcImage: "/images/symptom-analysis.jpg",
  },
  {
    title: "Emergency Indicators",
    content: "Immediate alerts for critical symptoms requiring urgent medical attention. Our system uses color-coded warnings and clear instructions to help you understand when immediate medical care is necessary.",
    srcImage: "/images/emergency-alerts.jpg",
  },
  {
    title: "Prevention Strategies",
    content: "Personalized preventive measures and lifestyle recommendations based on your health profile. Get tailored advice on diet, exercise, and daily habits to maintain optimal health.",
    srcImage: "/images/prevention.jpg",
  },
  {
    title: "Follow-up Guidance",
    content: "Structured follow-up recommendations and progress monitoring to ensure your health stays on track. Regular check-ins and adjustments to your care plan based on your progress.",
    srcImage: "/images/follow-up.jpg",
  },
];

export function WhyChooseUs() {
  const [featureOpen, setFeatureOpen] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 20);
    }, 10);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer > 10000) {
      setFeatureOpen((prev) => (prev + 1) % data.length);
      setTimer(0);
    }
  }, [timer]);

  return (
    <section className="w-full py-16 bg-[#1E293B]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
  Why Choose Our Platform
</h2>
<p className="mt-4 text-lg leading-8 text-neutral-400">
  Comprehensive health analysis backed by cutting-edge technology
</p>
        </div>

        {/* Mobile Layout */}
        <div className="block md:hidden">
          <div className="space-y-8">
            {data.map((item, index) => (
              <div key={item.title} className="space-y-4">
                <button
                  className="w-full"
                  onClick={() => {
                    setFeatureOpen(index);
                    setTimer(0);
                  }}
                  type="button"
                >
                  <TextComponent
                    content={item.content}
                    isOpen={featureOpen === index}
                    loadingWidthPercent={featureOpen === index ? timer / 100 : 0}
                    number={index + 1}
                    title={item.title}
                  />
                </button>
                <div 
                  className={cn(
                    "h-64 w-full overflow-hidden rounded-lg transition-all duration-300",
                    featureOpen === index ? "opacity-100" : "opacity-50"
                  )}
                >
                  <img
                    alt={item.title}
                    className="h-full w-full object-cover"
                    src={item.srcImage}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-8 lg:gap-12">
          <div className="space-y-6">
            {data.map((item, index) => (
              <button
                className="w-full"
                key={item.title}
                onClick={() => {
                  setFeatureOpen(index);
                  setTimer(0);
                }}
                type="button"
              >
                <TextComponent
                  content={item.content}
                  isOpen={featureOpen === index}
                  loadingWidthPercent={featureOpen === index ? timer / 100 : 0}
                  number={index + 1}
                  title={item.title}
                />
              </button>
            ))}
          </div>
          <div className="relative h-[600px]">
            <div className="sticky top-8 h-[500px] w-full overflow-hidden rounded-lg">
              {data.map((item, index) => (
                <img
                  alt={item.title}
                  className={cn(
                    "absolute h-full w-full transform-gpu rounded-lg object-cover transition-all duration-500",
                    featureOpen === index ? "scale-100 opacity-100" : "scale-95 opacity-0"
                  )}
                  key={item.title}
                  src={item.srcImage}
                  style={{ zIndex: featureOpen === index ? 10 : 0 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}