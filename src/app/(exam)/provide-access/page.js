"use client";
import React, { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import withAuth from "@/components/Auth/withAuth";
import Navbar from "@/components/Navbar/Navbar";
import {
  Users,
  UserPlus,
  Trash2,
  FolderPlus,
  Search,
  AlertCircle,
  Loader2,
  RefreshCw,
  Shield,
  Info,
  CheckCircle2,
  XCircle
} from "lucide-react";
import renewAccessToken from "@/lib/token/renewAccessToken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProvideAccess() {
  // State management
  const [repositoryData, setRepositoryData] = useState({
    name: "",
    list: [],
    selected: "",
  });
  const [userEmail, setUserEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState(""); // For tracking specific loading actions
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [repoToDelete, setRepoToDelete] = useState(null);
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // API request wrapper with error handling
  const apiRequest = async (endpoint, method, body = null) => {
    try {
      const token = await renewAccessToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        ...(body && { body: JSON.stringify(body) }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log(errorData.message || `Request failed with status: ${response.status}`)
      }

      return await response.json();
    } catch (error) {
      console.log(`API Error (${endpoint}):`, error);
    }
  };

  // Fetch repositories on component mount
  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    setIsLoading(true);
    setActionType("fetch");
    try {
      const data = await apiRequest("/repository", "GET");
      setRepositoryData(prev => ({ ...prev, list: data }));
    } catch (error) {
      toast.error("Failed to fetch repositories");
    } finally {
      setIsLoading(false);
      setActionType("");
    }
  };

  // Repository operations
  const handleCreateRepository = async () => {
    const name = repositoryData.name.trim();
    if (!name) {
      toast.error("Please enter a valid repository name");
      return;
    }

    setIsLoading(true);
    setActionType("create");
    try {
      const newRepo = await apiRequest("/repository", "POST", { name });
      setRepositoryData(prev => ({
        ...prev,
        list: [...prev.list, newRepo],
        name: "",
      }));
      toast.success(`Repository "${name}" created successfully`);
    } catch (error) {
      // toast.error(error.message || "Failed to create repository");
    } finally {
      setIsLoading(false);
      setActionType("");
    }
  };

  const initiateDeleteRepository = () => {
    const { selected } = repositoryData;
    if (!selected) {
      toast.error("Please select a repository first");
      return;
    }

    setRepoToDelete(selected);
    setShowConfirmDialog(true);
  };

  const handleDeleteRepository = async () => {
    setShowConfirmDialog(false);
    if (!repoToDelete) return;

    setIsLoading(true);
    setActionType("delete");
    try {
      await apiRequest("/repository", "DELETE", { name: repoToDelete });
      setRepositoryData(prev => ({
        ...prev,
        list: prev.list.filter(repo => repo.name !== repoToDelete),
        selected: "",
      }));
      toast.success(`Repository "${repoToDelete}" deleted successfully`);
    } catch (error) {
      toast.error(error.message || "Failed to delete repository");
    } finally {
      setIsLoading(false);
      setActionType("");
      setRepoToDelete(null);
    }
  };

  // Email access operations
  const handleAddEmail = async () => {
    const email = userEmail.trim();
    const { selected } = repositoryData;

    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    if (!selected) {
      toast.error("Please select a repository first");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setActionType("addEmail");
    try {
      const updatedRepo = await apiRequest(`/repository/${selected}/add-email`, "POST", { email });
      updateRepositoryEmails(selected, updatedRepo.emails);
      setUserEmail("");
      toast.success(`Access granted to ${email}`);
    } catch (error) {
      toast.error("Email Already exists");
    } finally {
      setIsLoading(false);
      setActionType("");
    }
  };

  const handleRemoveEmail = async (emailToRemove) => {
    const { selected } = repositoryData;
    if (!selected) return;

    setIsLoading(true);
    setActionType("removeEmail");
    try {
      const updatedRepo = await apiRequest(
        `/repository/${selected}/remove-email`, 
        "DELETE", 
        { email: emailToRemove }
      );
      
      updateRepositoryEmails(selected, updatedRepo.emails);
      toast.info(`Access revoked for ${emailToRemove}`);
    } catch (error) {
      toast.error(error.message || "Failed to remove user");
    } finally {
      setIsLoading(false);
      setActionType("");
    }
  };

  // Helper functions
  const updateRepositoryEmails = (repoName, emails) => {
    setRepositoryData(prev => ({
      ...prev,
      list: prev.list.map(repo => 
        repo.name === repoName ? { ...repo, emails } : repo
      )
    }));
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Event handlers
  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  // Derived state
  const selectedRepository = repositoryData.selected 
    ? repositoryData.list.find(repo => repo.name === repositoryData.selected) 
    : null;

  const filteredEmails = selectedRepository
    ? selectedRepository.emails.filter(email => 
        email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // UI elements
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Access Management", href: "/provide-access" },
  ];

  return (
    <>
        {/* <Navbar /> */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      
      {/* Confirm Delete Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
            <div className="flex items-center mb-4 text-red-600">
              <AlertCircle size={24} className="mr-2" />
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            </div>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete the repository "{repoToDelete}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRepository}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
              >
                {isLoading && actionType === "delete" ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header Section */}
          <div className="mt-16 mb-8">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="flex justify-between items-center mt-2">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Access Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage repository access for your team members and collaborators
                </p>
              </div>
              <button 
                onClick={fetchRepositories}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                disabled={isLoading && actionType === "fetch"}
              >
                {isLoading && actionType === "fetch" ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <RefreshCw size={18} />
                )}
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left panel - Repository management */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden h-full transition-all hover:shadow-lg">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-lg">
                      <FolderPlus className="text-white" size={20} />
                    </div>
                    <h2 className="text-lg font-semibold text-white">
                      Repositories
                    </h2>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label
                        htmlFor="repoName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Create New Repository
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="repoName"
                          type="text"
                          placeholder="Repository name"
                          value={repositoryData.name}
                          onChange={(e) => setRepositoryData(prev => ({ ...prev, name: e.target.value }))}
                          onKeyPress={(e) => handleKeyPress(e, handleCreateRepository)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          disabled={isLoading}
                        />
                        <button
                          onClick={handleCreateRepository}
                          className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-all ${
                            isLoading && actionType === "create" ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                          disabled={isLoading}
                        >
                          {isLoading && actionType === "create" ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            "Create"
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <label
                        htmlFor="repoSelect"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Select Repository
                      </label>
                      
                      {isLoading && actionType === "fetch" ? (
                        <div className="flex justify-center items-center py-8">
                          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                        </div>
                      ) : repositoryData.list.length > 0 ? (
                        <div className="bg-gray-50 rounded-lg border border-gray-200">
                          {repositoryData.list.map((repo, index) => (
                            <div 
                              key={index}
                              className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${
                                index !== repositoryData.list.length - 1 ? "border-b border-gray-200" : ""
                              } ${
                                repositoryData.selected === repo.name
                                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                                  : "hover:bg-gray-100"
                              }`}
                              onClick={() => setRepositoryData(prev => ({ ...prev, selected: repo.name }))}
                            >
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">{repo.name}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {repo.emails?.length || 0} user{repo.emails?.length !== 1 ? "s" : ""} with access
                                </p>
                              </div>
                              {repositoryData.selected === repo.name && (
                                <CheckCircle2 className="h-5 w-5 text-blue-500" />
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                          <AlertCircle
                            className="mx-auto text-gray-400 mb-2"
                            size={24}
                          />
                          <p className="text-gray-500 text-sm">
                            No repositories found
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            Create your first repository using the form above
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right panel - Email management */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden h-full transition-all hover:shadow-lg">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/10 p-2 rounded-lg">
                        <Shield className="text-white" size={20} />
                      </div>
                      <h2 className="text-lg font-semibold text-white">
                        {repositoryData.selected
                          ? `Manage Access: ${repositoryData.selected}`
                          : "Repository Access"}
                      </h2>
                    </div>
                    {repositoryData.selected && (
                      <button
                        onClick={initiateDeleteRepository}
                        className={`bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg flex items-center justify-center transition-all text-sm ${
                          isLoading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                        disabled={isLoading}
                      >
                        <Trash2 size={16} className="mr-1.5" />
                        Delete Repository
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {repositoryData.selected ? (
                    <div className="space-y-6">
                      <div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                          <label
                            htmlFor="emailInput"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Grant Repository Access
                          </label>
                          {selectedRepository && selectedRepository.emails && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Info size={14} className="mr-1" />
                              {selectedRepository.emails.length} user{selectedRepository.emails.length !== 1 ? "s" : ""} with access
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            id="emailInput"
                            type="email"
                            placeholder="user@example.com"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            onKeyPress={(e) => handleKeyPress(e, handleAddEmail)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            disabled={isLoading}
                          />
                          <button
                            onClick={handleAddEmail}
                            className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                              isLoading && actionType === "addEmail" ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                            disabled={isLoading}
                          >
                            {isLoading && actionType === "addEmail" ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <>
                                <UserPlus size={18} />
                                Add User
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Authorized Users
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Search emails"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-8 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Search
                              className="absolute left-2 top-2 text-gray-400"
                              size={16}
                            />
                            {searchTerm && (
                              <button 
                                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                                onClick={() => setSearchTerm("")}
                              >
                                <XCircle size={16} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg border border-gray-200 max-h-[calc(100vh-26rem)] overflow-y-auto">
                          {isLoading && actionType === "fetch" ? (
                            <div className="flex justify-center items-center py-12">
                              <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                            </div>
                          ) : filteredEmails.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email Address
                                  </th>
                                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {filteredEmails.map((email, index) => (
                                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                      {email}
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                      <button
                                        onClick={() => handleRemoveEmail(email)}
                                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                        aria-label={`Revoke access for ${email}`}
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <div className="text-center py-8">
                              <Users className="mx-auto text-gray-400 mb-2" size={24} />
                              <p className="text-gray-500 text-sm">
                                {searchTerm 
                                  ? "No matching email addresses found" 
                                  : "No users have access to this repository yet"}
                              </p>
                              <p className="text-gray-400 text-xs mt-1">
                                {searchTerm 
                                  ? "Try a different search term" 
                                  : "Add users using the form above"}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                      <Shield
                        className="mx-auto text-gray-400 mb-4"
                        size={40}
                      />
                      <h3 className="text-gray-700 font-medium text-lg">
                        Select a Repository
                      </h3>
                      <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
                        Choose an existing repository or create a new one to
                        manage user access and permissions
                      </p>
                      <div className="mt-6">
                        <button
                          onClick={() => document.getElementById('repoName').focus()}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FolderPlus className="mr-2" size={16} />
                          Create Repository
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Help Section */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-start">
              <Info className="text-blue-500 mt-1 mr-4 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-medium text-blue-800">Managing Repository Access</h3>
                <p className="mt-1 text-sm text-blue-700">
                  Repositories allow you to organize your projects and control who has access to them. 
                  Share access with team members by adding their email addresses, and they'll receive 
                  access to view and collaborate on repository content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(ProvideAccess);