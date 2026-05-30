import dynamic from "next/dynamic";
import Image from "next/image";
import Navbar from "./landing page/Navbar";
import Hero from "./landing page/Hero";
import Footer from "./landing page/Footer";

// Lazy load below-the-fold components to reduce initial JavaScript payload
const Features = dynamic(() => import("./landing page/Features"));
const HowItWorks = dynamic(() => import("./landing page/HowItWorks"));
const Pricing = dynamic(() => import("./landing page/Pricing"));
const CTA = dynamic(() => import("./landing page/CTA"));

export default function HomePage() {
  return (
    <main className="min-h-screen bg-forest-950 overflow-x-hidden">
      {/* Optimized Background Image Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/LandingPage.png"
          alt="Foresty Academics Background"
          fill
          priority
          quality={85}
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-forest-950/65 backdrop-blur-[1px]" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <CTA />
      </div>

      {/* Footer Layer */}
      <div className="relative z-10 bg-forest-950">
        <Footer />
      </div>
    </main>
  );
}
