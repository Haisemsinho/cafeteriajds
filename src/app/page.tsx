import type { Metadata } from "next";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { Reviews } from "@/components/home/Reviews";
import { StoryTeaser } from "@/components/home/StoryTeaser";
import { VisitInvite } from "@/components/home/VisitInvite";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <FeaturedProducts />
      <StoryTeaser />
      <Reviews />
      <VisitInvite />
    </>
  );
}
