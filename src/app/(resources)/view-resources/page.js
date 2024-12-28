"use client";
import Navbar from "@/components/Navbar/Navbar";
import React from "react";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function page() {
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "View Resources", href: "/view-resources" },
  ];
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mt-16">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </>
  );
}

export default page;
