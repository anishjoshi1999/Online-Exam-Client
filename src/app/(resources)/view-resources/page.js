"use client";

import Navbar from "@/components/Navbar/Navbar";
import React from "react";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ActionCard from "@/components/Dashboard/ActionCard";
import { Edit3, Upload } from "lucide-react";

const ViewResourcesPage = () => {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "View Resources", href: "/view-resources" },
  ];

  const actionCards = [
    {
      icon: Upload,
      title: "View Notes",
      description: "Upload study notes for all topics",
      href: "/view-resources/view-notes",
    },
    {
      icon: Upload,
      title: "View Lectures",
      description: "Upload video lectures and tutorials",
      href: "/view-resources/view-lectures",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb Section */}
          <div className="mt-16">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          {/* Page Title */}
          <div className="flex items-center gap-3 mt-8 lg:mt-12">
            <Edit3 className="text-green-600" size={27} />
            <h2 className="text-2xl font-bold text-black">View Resources</h2>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {actionCards.map((card, index) => (
              <ActionCard
                key={index}
                icon={card.icon}
                title={card.title}
                description={card.description}
                href={card.href}
              />
            ))}
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </>
  );
};

export default ViewResourcesPage;
