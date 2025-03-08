"use client";
import React, { useState, useEffect, use } from "react";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import withAuth from "@/components/Auth/withAuth";
import Navbar from "@/components/Navbar/Navbar";
import { Mail, Filter, Shield, Lock, Unlock, UserCheck } from "lucide-react";
import renewAccessToken from "@/lib/token/renewAccessToken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ExamParticipantAccessPage({ params }) {
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [accessStatus, setAccessStatus] = useState({});
  const [accessList, setAccessList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { slug } = use(params);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Manage Exam", href: "/manage-exam" },
    { label: slug, href: `/manage-exam/${slug}` },
    {
      label: "Participant Access",
      href: `/manage-exam/${slug}/invite-participant`,
    },
  ];

  // Fetch repositories on mount
  useEffect(() => {
    const fetchRepositories = async () => {
      setIsLoading(true);
      try {
        const token = await renewAccessToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/repository`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setRepositories(data);
        } else {
          const errorData = await response.json();
          toast.error(
            `Failed to fetch repositories: ${
              errorData.message || "Unknown error"
            }`
          );
        }
      } catch (error) {
        console.error("Error fetching repositories:", error);
        toast.error("Network error while fetching repositories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEmails(emails);
    } else {
      const filtered = emails.filter((email) =>
        email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmails(filtered);
    }
  }, [emails, searchTerm]);

  const handleRepositoryChange = (event) => {
    const repoName = event.target.value;
    setSelectedRepo(repoName);
    setSearchTerm("");

    const selectedRepoData = repositories.find(
      (repo) => repo.name === repoName
    );
    if (selectedRepoData) {
      const repoEmails = selectedRepoData.emails || [];
      setEmails(repoEmails);
      setFilteredEmails(repoEmails);

      // Initialize access status to false for all emails
      // (will be overridden by fetchExamAccessStatus when it completes)
      setAccessStatus(
        repoEmails.reduce((acc, email) => {
          acc[email] = false;
          return acc;
        }, {})
      );
    } else {
      setEmails([]);
      setFilteredEmails([]);
      setAccessStatus({});
    }
  };

  const toggleAccessAll = () => {
    const areAllGranted = Object.values(accessStatus).every(
      (status) => status === true
    );
    const newAccessStatus = { ...accessStatus };

    filteredEmails.forEach((email) => {
      newAccessStatus[email] = !areAllGranted;
    });

    setAccessStatus(newAccessStatus);
  };

  const toggleAccess = (email) => {
    setAccessStatus((prev) => ({
      ...prev,
      [email]: !prev[email],
    }));
  };

  const saveAccessSettings = async () => {
    if (!selectedRepo) {
      toast.warning("Please select a repository first");
      return;
    }

    setIsSaving(true);

    try {
      const token = await renewAccessToken();
      const accessUpdates = Object.entries(accessStatus).map(
        ([email, hasAccess]) => ({
          email,
          hasAccess,
        })
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/repository/${slug}/provide-access`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            repository: selectedRepo,
            accessUpdates,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success("Participant access updated successfully");
        // Refresh access list after saving
        fetchExamAccessStatus();
      } else {
        const errorData = await response.json();
        toast.error(
          `Failed to update access: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error updating access:", error);
      toast.error("Network error while updating access settings");
    } finally {
      setIsSaving(false);
    }
  };

  const getAccessStats = () => {
    const totalWithAccess = Object.values(accessStatus).filter(
      (status) => status
    ).length;
    return {
      totalWithAccess,
      totalEmails: filteredEmails.length,
    };
  };

  const fetchExamAccessStatus = async () => {
    setIsLoading(true);
    try {
      const token = await renewAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/repository/${slug}/fetch-access`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAccessList(data.invitedParticipants);
      } else {
        setAccessList([]);
      }
    } catch (error) {
      console.error("Error fetching access status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExamAccessStatus();
  }, []);

  const stats = getAccessStats();

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
              <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2.5 rounded-lg">
                    <Shield className="text-white" size={22} />
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    Manage Exam Access Control
                  </h2>
                </div>

                {filteredEmails.length > 0 && (
                  <button
                    className="flex items-center gap-2 bg-white text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    onClick={saveAccessSettings}
                    disabled={isSaving}
                  >
                    <Lock size={16} />
                    {isSaving ? "Saving..." : "Save Access Settings"}
                  </button>
                )}
              </div>

              {/* Current Access List Section */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <UserCheck size={18} className="text-indigo-600" />
                  <h3 className="text-lg font-medium text-gray-800">
                    Current Exam Access
                  </h3>
                </div>

                {accessList.length > 0 ? (
                  <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {accessList.map((access, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                              <div className="flex items-center gap-2">
                                <Mail size={16} className="text-gray-400" />
                                {access.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  access.IsInvited
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {access.IsInvited ? "Invited" : "Not Invited"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center text-gray-500">
                    No participants currently have access to this exam.
                  </div>
                )}
              </div>

              <div className="p-6 space-y-6">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-700"></div>
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Participant Repository
                      </label>
                      <select
                        value={selectedRepo}
                        onChange={handleRepositoryChange}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      >
                        <option value="">Select a repository</option>
                        {repositories.map((repo, index) => (
                          <option key={index} value={repo.name}>
                            {repo.name}
                          </option>
                        ))}
                      </select>
                      <p className="mt-2 text-sm text-gray-500">
                        Select a repository to manage which participants can
                        access the "{slug}" exam.
                      </p>
                    </div>

                    {selectedRepo && (
                      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-gray-800">
                            Participant Access Control
                          </h3>

                          {filteredEmails.length > 0 && (
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-500">
                                {stats.totalWithAccess} of {stats.totalEmails}{" "}
                                have access
                              </span>
                              <button
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-sm bg-indigo-600 hover:bg-indigo-700 transition-colors"
                                onClick={toggleAccessAll}
                              >
                                {stats.totalWithAccess === stats.totalEmails ? (
                                  <>
                                    <Lock size={14} />
                                    Revoke All Access
                                  </>
                                ) : (
                                  <>
                                    <Unlock size={14} />
                                    Grant All Access
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>

                        {emails.length > 0 ? (
                          <>
                            <div className="relative mb-4">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Filter size={16} className="text-gray-400" />
                              </div>
                              <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Filter participants by email..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                              />
                            </div>

                            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                              {filteredEmails.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                  {filteredEmails.map((email, index) => (
                                    <li
                                      key={index}
                                      className={`flex justify-between items-center p-3 hover:bg-gray-50 ${
                                        accessStatus[email] ? "bg-green-50" : ""
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <Mail
                                          size={16}
                                          className="text-gray-400"
                                        />
                                        <span
                                          className={`text-gray-700 ${
                                            accessStatus[email]
                                              ? "font-medium"
                                              : ""
                                          }`}
                                        >
                                          {email}
                                        </span>
                                      </div>
                                      <button
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white text-sm transition-colors ${
                                          accessStatus[email]
                                            ? "bg-green-600 hover:bg-green-700"
                                            : "bg-gray-400 hover:bg-gray-500"
                                        }`}
                                        onClick={() => toggleAccess(email)}
                                      >
                                        {accessStatus[email] ? (
                                          <>
                                            <Unlock size={14} />
                                            Has Access
                                          </>
                                        ) : (
                                          <>
                                            <Lock size={14} />
                                            No Access
                                          </>
                                        )}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="p-6 text-center text-gray-500">
                                  No matching emails found. Try adjusting your
                                  filter.
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="p-6 text-center text-gray-500 border border-gray-200 rounded-lg">
                            This repository does not contain any participant
                            emails.
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(ExamParticipantAccessPage);
