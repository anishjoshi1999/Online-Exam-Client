import React from "react";
import { TestimonialCard } from "./TestimonialCard";
function TestimonalCards() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gray-100">
      <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
        Success Stories
      </h2>
      <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto text-lg">
        Join hundreds of satisfied institutions
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <TestimonialCard
          quote="This platform revolutionized our examination process. The AI-powered features are game-changing."
          author="Dr. Sarah Chen"
          role="Dean of Engineering"
          rating={5}
        />
        <TestimonialCard
          quote="Exceptional security features and real-time monitoring capabilities. Exactly what we needed."
          author="Prof. James Miller"
          role="Department Head"
          rating={5}
        />
        <TestimonialCard
          quote="The analytics dashboard provides invaluable insights into student performance trends."
          author="Dr. Emily Watson"
          role="Academic Director"
          rating={5}
        />
      </div>
    </section>
  );
}

export default TestimonalCards;
