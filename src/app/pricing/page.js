"use client";
import React, { useState } from "react";
import Head from "next/head";
import { Check, Star, Zap, Crown } from "lucide-react";

const PlanBadge = ({ text, variant = "default" }) => (
  <span
    className={`px-3 py-1 text-xs font-medium rounded-full ${
      variant === "popular" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
    }`}
    role="badge"
    aria-label={`${text} plan badge`}
  >
    {text}
  </span>
);

const PricingCard = ({ plan, price, features, isPopular, icon: Icon, yearlyPrice }) => {
  const [isYearly, setIsYearly] = useState(false);
  const currentPrice = isYearly ? yearlyPrice : price;
  const billingPeriod = isYearly ? "yearly" : "monthly";

  return (
    <article
      className={`relative bg-white p-8 rounded-xl transition-all duration-300 ${
        isPopular ? "ring-2 ring-blue-600 scale-105 shadow-lg" : "border border-gray-200 shadow-md hover:shadow-xl"
      }`}
      itemScope
      itemType="https://schema.org/Product"
    >
      {isPopular && (
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
          <PlanBadge text="Most Popular" variant="popular" />
        </div>
      )}

      <div className="flex items-center justify-center space-x-3 mb-8">
        <Icon className={`w-6 h-6 ${isPopular ? "text-blue-600" : "text-gray-600"}`} aria-hidden="true" />
        <h3 className="text-2xl font-bold text-gray-900" itemProp="name">
          {plan} Plan
        </h3>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="flex items-baseline" itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <meta itemProp="priceCurrency" content="USD" />
          <span
            className="text-3xl font-bold text-gray-900"
            itemProp="price"
            content={currentPrice.replace("$", "")}
          >
            {currentPrice}
          </span>
          <span className="ml-1 text-gray-500">/month</span>
          <meta itemProp="availability" content="https://schema.org/InStock" />
        </div>

        <div className="mt-4 flex items-center space-x-2" role="group" aria-label="Billing period selection">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-3 py-1 rounded-l-full ${!isYearly ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}
            aria-pressed={!isYearly}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-3 py-1 rounded-r-full ${isYearly ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}
            aria-pressed={isYearly}
          >
            Yearly
          </button>
        </div>
      </div>

      <ul className="space-y-4 mb-8" itemProp="description">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-3">
            <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
          isPopular
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
        }`}
        aria-label={`Get started with ${plan} plan`}
      >
        Get Started
      </button>
    </article>
  );
};

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Start Test Exam Platform",
    "description": "Online exam platform with various subscription plans",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "19",
      "highPrice": "99",
      "offerCount": "3",
      "offers": [
        {
          "@type": "Offer",
          "name": "Basic Plan",
          "price": "19",
          "priceCurrency": "USD",
          "description": "Access to basic exam features with up to 5 exams per month",
          "availability": "https://schema.org/InStock",
        },
        {
          "@type": "Offer",
          "name": "Standard Plan",
          "price": "49",
          "priceCurrency": "USD",
          "description": "Unlimited exams with advanced analytics and API access",
          "availability": "https://schema.org/InStock",
        },
        {
          "@type": "Offer",
          "name": "Premium Plan",
          "price": "99",
          "priceCurrency": "USD",
          "description": "Complete platform access with AI features and dedicated support",
          "availability": "https://schema.org/InStock",
        },
      ],
    },
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <>
      <Head>
        <title>Pricing Plans | Start Test - Online Exam Platform</title>
        <meta
          name="description"
          content="Choose from our flexible pricing plans. Starting from $19/month with a 14-day free trial. Access advanced exam features, analytics, and dedicated support."
        />
        <meta name="keywords" content="exam platform pricing, online testing plans, exam software pricing, educational platform costs" />
        <meta property="og:title" content="Pricing Plans | Start Test" />
        <meta
          property="og:description"
          content="Choose from our flexible pricing plans. Starting from $19/month with a 14-day free trial."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pricing Plans | Start Test" />
        <meta
          name="twitter:description"
          content="Choose from our flexible pricing plans. Starting from $19/month with a 14-day free trial."
        />
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_SITE_URL}/pricing`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <section className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your needs. All plans include a 14-day free trial.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div 
              onClick={() => handlePlanSelect('Basic')}
              className={`cursor-pointer transform transition-transform duration-300 ${
                selectedPlan === 'Basic' ? 'scale-105' : ''
              }`}
            >
              <PricingCard
                plan="Basic"
                price="$19"
                yearlyPrice="$15"
                icon={Zap}
                features={[
                  "Access to basic exam features",
                  "Up to 5 exams per month",
                  "Basic analytics and reporting",
                  "Email support",
                ]}
              />
            </div>
            <div 
              onClick={() => handlePlanSelect('Standard')}
              className={`cursor-pointer transform transition-transform duration-300 ${
                selectedPlan === 'Standard' ? 'scale-105' : ''
              }`}
            >
              <PricingCard
                plan="Standard"
                price="$49"
                yearlyPrice="$39"
                icon={Star}
                isPopular={true}
                features={[
                  "All Basic features",
                  "Unlimited exams",
                  "Advanced analytics and reporting",
                  "Priority support",
                  "API access",
                ]}
              />
            </div>
            <div 
              onClick={() => handlePlanSelect('Premium')}
              className={`cursor-pointer transform transition-transform duration-300 ${
                selectedPlan === 'Premium' ? 'scale-105' : ''
              }`}
            >
              <PricingCard
                plan="Premium"
                price="$99"
                yearlyPrice="$79"
                icon={Crown}
                features={[
                  "All Standard features",
                  "AI-powered question generation",
                  "Advanced security features",
                  "Dedicated account manager",
                  "Custom branding",
                  "24/7 phone support",
                ]}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}