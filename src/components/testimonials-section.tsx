"use client";

import { Testimonials } from "./eldoraui/testimonals";

export function TestimonialsSection() {
  return (
    <section className="w-full bg-[#1E293B] py-12 dark:bg-[#1E293B]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Testimonials />
      </div>
    </section>
  );
}