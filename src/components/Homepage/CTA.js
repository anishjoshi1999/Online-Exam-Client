import React from "react";

function CTA() {
  return (
    <section className="bg-blue-600 text-white py-20">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">
          Ready to Transform Your Examination Process?
        </h2>
        <p className="text-xl text-blue-100 mb-8 animate-slide-up">
          Join 500+ institutions already using our platform
        </p>
        <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl animate-fade-in-up">
          Start Free Trial
        </button>
      </div>
    </section>
  );
}

export default CTA;
