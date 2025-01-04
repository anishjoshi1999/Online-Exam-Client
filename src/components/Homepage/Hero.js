"use client";
import React from "react";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const useInView = () => {
  const [isInView, setIsInView] = React.useState(false);
  const [hasAnimated, setHasAnimated] = React.useState(false); // Track if animation has played
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsInView(true);
          setHasAnimated(true); // Set animation flag to true
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasAnimated]); // Dependency array includes hasAnimated to prevent re-triggering

  return [ref, isInView];
};

export function Hero() {
  const [sectionRef, isInView] = useInView();

  // SEO Schema markup
  React.useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "StartTest.Online",
      url: "https://starttest.online",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web-based",
      description:
        "StartTest.Online - The leading AI-powered online examination platform for educational institutions. Create, manage, and evaluate tests securely with real-time analytics.",
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        price: "0",
        priceCurrency: "USD",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "500",
      },
      provider: {
        "@type": "Organization",
        name: "StartTest.Online",
        sameAs: "https://starttest.online",
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <main lang="en">
      <article>
        <section
          ref={sectionRef}
          className="bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden min-h-[90vh] flex items-center"
          aria-label="StartTest.Online - AI-Powered Examination Platform"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/image.webp" // Local image path
              alt="Students taking online exam in a modern classroom setting - StartTest.Online"
              fill // Enables the image to fill the parent container
              style={{ objectFit: "cover" }} // CSS for scaling
              className={`opacity-20 transform scale-105 ${
                isInView ? "animate-slow-zoom" : ""
              }`}
              priority // Loads the image eagerly for better UX
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
            <div
              className={`text-center max-w-3xl mx-auto ${
                isInView ? "animate-fade-in" : ""
              }`}
            >
              <div
                className="inline-block mb-4 px-4 py-1 bg-blue-500/30 rounded-full backdrop-blur-sm"
                role="presentation"
              >
                <span className="text-sm font-medium text-blue-100">
                  <strong>
                    Create, Conduct, and Evaluate Online Exams with Confidence
                  </strong>
                </span>
              </div>

              <h1
                className={`text-4xl md:text-6xl font-bold mb-6 leading-tight ${
                  isInView ? "animate-slide-up" : ""
                }`}
              >
                Start Your Online <span className="text-blue-300">Tests</span>{" "}
                With Confidence
              </h1>

              <p
                className={`text-xl mb-8 text-blue-100 leading-relaxed ${
                  isInView ? "animate-slide-up-delay" : ""
                }`}
              >
                StartTest.Online provides secure, AI-powered examination
                solutions with real-time proctoring, instant grading, and
                comprehensive analytics. Perfect for schools, universities, and
                certification providers.
              </p>

              <div
                className={`flex flex-col sm:flex-row gap-4 justify-center items-center w-full ${
                  isInView ? "animate-fade-in-up" : ""
                }`}
              >
                <Link
                  href={"/login"}
                  className="group bg-white text-blue-600 w-full sm:w-auto px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 focus:outline-none"
                  aria-label="Start your free trial with StartTest.Online"
                >
                  {" "}
                  <ArrowRight
                    className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                  Start Testing Now
                </Link>

                <button
                  className="group bg-transparent border-2 w-full sm:w-auto border-white/70 px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2 focus:ring-2 focus:ring-white focus:outline-none"
                  aria-label="Watch StartTest.Online platform demo"
                >
                  <Play className="h-5 w-5" aria-hidden="true" />
                  Watch Platform Demo
                </button>
              </div>

              <aside>
                {/* Trust Indicators */}
                <div
                  className={`mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-100 ${
                    isInView ? "animate-fade-in-up delay-300" : ""
                  }`}
                >
                  <div className="flex flex-col items-center p-4 rounded-lg bg-white/5 backdrop-blur-sm">
                    <strong className="text-2xl">99.9%</strong>
                    <span>Uptime</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-white/5 backdrop-blur-sm">
                    <strong className="text-2xl">500+</strong>
                    <span>Institutions</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-white/5 backdrop-blur-sm">
                    <strong className="text-2xl">1M+</strong>
                    <span>Tests Delivered</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-lg bg-white/5 backdrop-blur-sm">
                    <strong className="text-2xl">4.8/5</strong>
                    <span>User Rating</span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}

export default Hero;
