import type { Metadata } from "next";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { HomeGallery } from "@/components/home/HomeGallery";
import { Intro } from "@/components/home/Intro";
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
      <HomeGallery />
      <VisitInvite />
    </>
  );
}
