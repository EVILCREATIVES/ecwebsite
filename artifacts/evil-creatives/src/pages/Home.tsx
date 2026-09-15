import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Methodology from "@/components/Methodology";
import AppDevelopment from "@/components/AppDevelopment";
import WebDevelopment from "@/components/WebDevelopment";
import AdsCampaign from "@/components/AdsCampaign";
import Capabilities from "@/components/Capabilities";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    // Force dark mode on document body
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full">
        <Hero />
        <Gallery />
        <Methodology />
        <AdsCampaign />
        <WebDevelopment />
        <AppDevelopment />
        <Capabilities />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
