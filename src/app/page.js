import { Hero } from "@/components/Homepage/Hero";
import { Features } from "@/components/Homepage/Features";
import ProcessSteps from "@/components/Homepage/Steps/ProcessSteps";
import TestimonalCards from "@/components/Homepage/TestimonalCards";
import Navbar from "@/components/Navbar/Navbar";
import CTA from "@/components/Homepage/CTA";

import "@/styles/animations.css";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar/>
      {/* Hero Section */}
      <Hero />

      {/* How It Works Section */}
      <ProcessSteps />

      {/* Features Section */}
      <Features />

      {/* Testimonials Section */}
      <TestimonalCards />

      {/* CTA Section */}
      <CTA />
    </div>
  );
}

export default Home;
