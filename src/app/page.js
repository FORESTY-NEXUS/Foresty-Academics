import Navbar from "./landing page/Navbar";
import Hero from "./landing page/Hero";
import Features from "./landing page/Features";
import HowItWorks from "./landing page/HowItWorks";
import Pricing from "./landing page/Pricing";
import CTA from "./landing page/CTA";
import Footer from "./landing page/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-forest-950 overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
