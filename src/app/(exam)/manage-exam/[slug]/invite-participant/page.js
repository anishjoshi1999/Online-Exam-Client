"use client";
import React, {  use } from "react";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import withAuth from "@/components/Auth/withAuth";
import Navbar from "@/components/Navbar/Navbar";
import InviteParticipantForm from "@/components/InviteParticipant/InviteParticipantForm";
import { Users } from "lucide-react";

function InviteParticipantPage({ params }) {
  const { slug } = use(params);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Manage Exam", href: "/manage-exam" },
    { label: `${slug}`, href: `/manage-exam/${slug}/invite-participant` },
    {
      label: "Invite Participant",
      href: `/manage-exam/${slug}/invite-participant`,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mt-16">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="text-blue-600" size={32} />
              <h2 className="text-2xl font-bold text-gray-900">
                Provide Access & Invite Participants
              </h2>
            </div>
            <InviteParticipantForm examSlug={slug} />
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(InviteParticipantPage);
