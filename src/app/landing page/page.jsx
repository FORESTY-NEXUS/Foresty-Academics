import dynamic from "next/dynamic";
import Image from "next/image";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Footer from "./Footer";

// Lazy load below-the-fold components to reduce initial JavaScript payload
const Features = dynamic(() => import("./Features"));
const HowItWorks = dynamic(() => import("./HowItWorks"));
const Pricing = dynamic(() => import("./Pricing"));
const CTA = dynamic(() => import("./CTA"));

export default function Home() {
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
        {/* Persistent dark overlay for the whole page content */}
        <div className="absolute inset-0 bg-forest-950/65 pointer-events-none" />
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
