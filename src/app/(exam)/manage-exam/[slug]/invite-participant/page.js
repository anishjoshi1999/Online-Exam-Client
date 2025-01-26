"use client";
import React, { useState, useEffect, use } from "react";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import withAuth from "@/components/Auth/withAuth";
import Navbar from "@/components/Navbar/Navbar";
import { Users, Mail, UserPlus, Trash2, SendHorizontal } from "lucide-react";
import renewAccessToken from "@/lib/token/renewAccessToken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function InviteParticipantPage({ params }) {
  const { slug } = use(params);
  const [email, setEmail] = useState("");
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Manage Exam", href: "/manage-exam" },
    { label: `${slug}`, href: `/manage-exam/${slug}/invite-participant` },
    {
      label: "Invite Participant",
      href: `/manage-exam/${slug}/invite-participant`,
    },
  ];

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        let token = await renewAccessToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/invite/get-all-participants-for-a-specific-slug`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ slug }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setParticipants(data);
        } else {
          toast.error("Failed to fetch participants.");
        }
      } catch (error) {
        toast.error("Error fetching participants.");
      }
    };

    fetchParticipants();
  }, [slug]);

  const handleAddParticipant = async () => {
    if (!email.trim()) {
      toast.error("Email cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      let token = await renewAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/invite/add-participant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, slug }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setParticipants([...participants, data.participant]);
        setEmail("");
        toast.success("Participant added successfully.");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Error adding participant.");
      }
    } catch (error) {
      toast.error("Error adding participant.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveParticipant = async (participantEmail) => {
    try {
      setLoading(true);
      let token = await renewAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/invite/remove-participant`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: participantEmail, slug }),
        }
      );

      if (response.ok) {
        setParticipants(
          participants.filter(
            (participant) => participant.email !== participantEmail
          )
        );
        toast.success("Participant removed successfully.");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Error removing participant.");
      }
    } catch (error) {
      toast.error("Error removing participant.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (participantEmail) => {
    try {
      setLoading(true);
      let token = await renewAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/invite/sent-invite-to-a-participant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: participantEmail, slug }),
        }
      );

      if (response.ok) {
        toast.success(`Invitation sent to ${participantEmail}`);
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.message ||
            `Failed to send invitation to ${participantEmail}.`
        );
      }
    } catch (error) {
      toast.error("Error sending invitation.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvitations = async () => {
    if (participants.length === 0) {
      toast.error("No participants to send invitations to.");
      return;
    }

    try {
      setLoading(true);
      let token = await renewAccessToken();
      const promises = participants.map((participant) =>
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/invite/sent-invite-to-a-participant`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ email: participant.email, slug }),
          }
        )
      );

      await Promise.all(promises);
      toast.success("Invitations sent to all participants.");
    } catch (error) {
      toast.error("Error sending invitations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mt-16">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <Users className="text-white" size={24} />
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    Manage Exam Participants
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Add Participant Form */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add New Participant
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Enter participant email"
                        disabled={loading}
                      />
                    </div>
                    <button
                      onClick={handleAddParticipant}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Participant
                    </button>
                  </div>
                </div>

                {/* Participants List */}
                <div className="bg-white rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Participants ({participants.length})
                    </h3>
                    {participants.length > 0 && (
                      <button
                        onClick={handleSendInvitations}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <SendHorizontal className="h-4 w-4 mr-2" />
                        Send All Invitations
                      </button>
                    )}
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    {participants.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        No participants added yet
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {participants.map((participant, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-150"
                          >
                            <div className="flex items-center">
                              <Mail className="h-5 w-5 text-gray-400 mr-3" />
                              <span className="text-sm font-medium text-gray-900">
                                {participant.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() =>
                                  handleSendEmail(participant.email)
                                }
                                disabled={loading}
                                className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <SendHorizontal className="h-4 w-4 mr-1" />
                                Send Invite
                              </button>
                              <button
                                onClick={() =>
                                  handleRemoveParticipant(participant.email)
                                }
                                disabled={loading}
                                className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(InviteParticipantPage);
