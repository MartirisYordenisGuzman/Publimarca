import React from "react";
import { Preloader } from "@/components/Preloader";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ManifestoSection } from "@/components/ManifestoSection";
import { ServicesSection } from "@/components/ServicesSection";
import { IndustriesSection } from "@/components/IndustriesSection";
import { PortfolioSection } from "@/components/PortfolioSection";
import { ProcessSection } from "@/components/ProcessSection";
import { TestimonialSection } from "@/components/TestimonialSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Preloader />
      <Header />
      <main
        id="main-content"
        className="w-full pt-20 bg-[#FBFBF9] min-h-screen"
      >
        <div className="flex flex-col w-full">
          <HeroSection />
          <ManifestoSection />
          <ServicesSection />
          <IndustriesSection />
          <PortfolioSection />
          <ProcessSection />
          <TestimonialSection />
          <ContactSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
