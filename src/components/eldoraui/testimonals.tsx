"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import { Marquee } from "@/components/eldoraui/marquee";

export function Highlight({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "bg-[#82DBD0]/20 p-1 py-0.5 font-bold text-[#82DBD0]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export interface TestimonialCardProps {
  name: string;
  role: string;
  img?: string;
  description: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function TestimonialCard({
  description,
  name,
  img,
  role,
  className,
  ...props // Capture the rest of the props
}: TestimonialCardProps) {
  return (
    <div
  className={cn(
    "mb-4 flex w-full cursor-pointer break-inside-avoid flex-col items-center justify-between gap-6 rounded-xl p-4",
    "border border-white/10 bg-white/5 backdrop-blur-sm",
    className,
  )}
  {...props}
>
<div className="select-none text-sm font-normal text-white/80">
        {description}
        <div className="flex flex-row py-1">
          <Star className="size-4 fill-yellow-500 text-yellow-500" />
          <Star className="size-4 fill-yellow-500 text-yellow-500" />
          <Star className="size-4 fill-yellow-500 text-yellow-500" />
          <Star className="size-4 fill-yellow-500 text-yellow-500" />
          <Star className="size-4 fill-yellow-500 text-yellow-500" />
        </div>
      </div>

      <div className="flex w-full select-none items-center justify-start gap-5">
        <Image
          width={40}
          height={40}
          src={img || ""}
          alt={name}
          className="size-10 rounded-full ring-1 ring-border ring-offset-4"
        />

<div>
    <p className="font-medium text-white">{name}</p>
    <p className="text-xs font-normal text-white/60">{role}</p>
  </div>
      </div>
    </div>
  );
}
const testimonials = [
    {
        name: "Maria Rodriguez",
        role: "Registered Nurse",
        img: "https://randomuser.me/api/portraits/women/45.jpg",
        description: (
          <p>
            The traditional symptom analysis is incredibly thorough.
            <Highlight>
              It asks all the questions we would in triage
            </Highlight>{" "}
            and provides reliable guidance for patients.
          </p>
        ),
      },
      {
        name: "David Parker",
        role: "Physical Therapist",
        img: "https://randomuser.me/api/portraits/men/22.jpg",
        description: (
          <p>
            The body-based analysis feature is a game-changer for my practice.
            <Highlight>
              It helps patients articulate their symptoms more precisely
            </Highlight>{" "}
            before their first visit.
          </p>
        ),
      },
      {
        name: "Lisa Thompson",
        role: "Patient Advocate",
        img: "https://randomuser.me/api/portraits/women/67.jpg",
        description: (
          <p>
            MediSage empowers patients with knowledge.
            <Highlight>
              The clear, comprehensive reports help them have more productive conversations
            </Highlight>{" "}
            with their healthcare providers.
          </p>
        ),
      },
      {
        name: "Dr. Michael Chang",
        role: "Emergency Medicine Physician",
        img: "https://randomuser.me/api/portraits/men/64.jpg",
        description: (
          <p>
            The emergency indicators in MediSage&apos;s analysis are spot-on.
            <Highlight>
              It helps patients make appropriate decisions about emergency care
            </Highlight>{" "}
            while reducing panic about minor symptoms.
          </p>
        ),
      },
      {
        name: "Emma Stewart",
        role: "Occupational Health Nurse",
        img: "https://randomuser.me/api/portraits/women/89.jpg",
        description: (
          <p>
            Using MediSage in our corporate wellness program has been invaluable.
            <Highlight>
              It helps employees better understand their health concerns
            </Highlight>{" "}
            and when to seek professional care.
          </p>
        ),
      },
      {
        name: "Robert Martinez",
        role: "Telemedicine Provider",
        img: "https://randomuser.me/api/portraits/men/55.jpg",
        description: (
          <p>
            The detailed symptom analysis makes my virtual consultations more efficient.
            <Highlight>
              Patients come prepared with structured information
            </Highlight>{" "}
            about their conditions.
          </p>
        ),
      },
      {
        name: "Dr. Rachel Adams",
        role: "Sports Medicine Specialist",
        img: "https://randomuser.me/api/portraits/women/91.jpg",
        description: (
          <p>
            The body-based analysis is perfect for athletes and active individuals.
            <Highlight>
              It provides targeted recommendations for activity modification
            </Highlight>{" "}
            and injury prevention.
          </p>
        ),
      },
      {
        name: "Thomas Anderson",
        role: "Healthcare Technology Consultant",
        img: "https://randomuser.me/api/portraits/men/78.jpg",
        description: (
          <p>
            The AI-powered analysis is impressive in its accuracy.
            <Highlight>
              It&apos;s one of the most sophisticated symptom analysis tools
            </Highlight>{" "}
            I&apos;ve encountered in healthcare tech.
          </p>
        ),
      },
      {
        name: "Dr. Sarah Chen",
        role: "Family Physician",
        img: "https://randomuser.me/api/portraits/women/28.jpg",
        description: (
          <p>
            <Highlight>
              MediSage&apos;s detailed symptom analysis helps my patients make informed decisions
            </Highlight>{" "}
            before their appointments. The body-based analysis feature is particularly
            impressive for musculoskeletal complaints.
          </p>
        ),
      },
      {
        name: "James Wilson",
        role: "Healthcare Administrator",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
        description: (
          <p>
            Implementing MediSage in our telehealth system has
            <Highlight>
              reduced unnecessary emergency room visits by 30%
            </Highlight>{" "}
            by helping patients better understand their symptoms and when to seek care.
          </p>
        ),
      },
];

export function Testimonials() {
    return (
      <section id="testimonials">
        <h2 className="mb-4 text-center text-5xl font-bold leading-[1.2] tracking-tighter text-white">
  What People Are Saying
</h2>
<h3 className="mx-auto mb-8 max-w-lg text-balance text-center text-lg font-medium tracking-tight text-white/80">
  Don&apos;t just take our word for it. Here&apos;s what{" "}
  <span className="text-[#82DBD0]">real people</span>{" "}
  are saying about{" "}
  <span className="text-[#82DBD0]">MediSage</span>
</h3>
        <div className="relative mt-6 max-h-[350px] overflow-hidden">
          <div className="mx-auto max-w-[1400px] gap-4 md:columns-2 xl:columns-3 2xl:columns-4">
            {Array(Math.ceil(testimonials.length / 3))
              .fill(0)
              .map((_, i) => (
                <Marquee
                  vertical
                  key={i}
                  className={cn({
                    "[--duration:60s]": i === 1,
                    "[--duration:30s]": i === 2,
                    "[--duration:70s]": i === 3,
                  })}
                >
                  {testimonials.slice(i * 3, (i + 1) * 3).map((card, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: Math.random() * 0.8,
                        duration: 1.2,
                      }}
                    >
                      <TestimonialCard {...card} />
                    </motion.div>
                  ))}
                </Marquee>
              ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 w-full bg-gradient-to-t from-[#1E293B] from-20%"></div>
<div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 w-full bg-gradient-to-b from-[#1E293B] from-20%"></div>
        </div>
      </section>
    );
  }

