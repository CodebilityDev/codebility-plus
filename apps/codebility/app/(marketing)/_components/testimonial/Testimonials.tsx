import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { createClientAnon } from "@/utils/supabase/anon";

import TestimonialsCarousel from "./TestimonialsCarousel";

export type ClientTestimonyType = {
  id: string;
  testimony: string;
  name: string;
  company_logo: string;
};

const getLandingTestimonials = unstable_cache(
  async () => {
    const supabase = createClientAnon();
    const { data, error } = await supabase
      .from("clients")
      .select("id, testimony, name, company_logo")
      // .not("testimony", "is", null)
      // .not("company_logo", "is", null);

    if (error) return null;
    return (data ?? []) as ClientTestimonyType[];
  },
  ["landing-testimonials"],
  { revalidate: 3600, tags: ["landing-testimonials"] },
);

async function TestimonialsContent() {
  const testimonials = await getLandingTestimonials();
  if (!testimonials || testimonials.length === 0) return null;

  return <TestimonialsCarousel testimonials={testimonials} />;
}

export default function Testimonials() {
  return (
    <Suspense fallback={null}>
      <TestimonialsContent />
    </Suspense>
  );
}
