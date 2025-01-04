"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "@/components/Navbar/Navbar";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import renewAccessToken from "@/lib/token/renewAccessToken";

// Constants
const BREADCRUMB_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Manage Subject", href: "/manage-subjects" },
];

const INITIAL_FORM_STATE = {
  subjectName: "",
};

const UploadSubject = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [subjectInputMethod, setSubjectInputMethod] = useState(null); // 'new' or 'existing'

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const token = await renewAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-resources/get-all-subjects`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }

      const data = await response.json();
      setSubjects(data.subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to load subjects. Please try again later.");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Subject validation
    if (!subjectInputMethod) {
      newErrors.subject =
        "Please either select an existing subject or create a new one";
    } else if (subjectInputMethod === "new") {
      if (!newSubject.trim()) {
        newErrors.subject = "Please enter a new subject name";
      } else if (newSubject.length < 3) {
        newErrors.subject = "Subject name must be at least 3 characters long";
      } else if (
        subjects.some(
          (subject) => subject.name.toLowerCase() === newSubject.toLowerCase()
        )
      ) {
        newErrors.subject =
          "This subject already exists. Please select it from the dropdown";
      }
    } else if (subjectInputMethod === "existing" && !formData.subjectName) {
      newErrors.subject = "Please select a subject";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "subjectName" && value) {
      setSubjectInputMethod("existing");
      setNewSubject("");
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleNewSubjectChange = (e) => {
    const value = e.target.value;
    setNewSubject(value);
    if (value) {
      setSubjectInputMethod("new");
      setFormData((prev) => ({ ...prev, subjectName: "" }));
    } else {
      setSubjectInputMethod(null);
    }
    if (errors.subject) {
      setErrors((prev) => ({ ...prev, subject: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      const token = await renewAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-resources/upload-subject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            subjectName:
              subjectInputMethod === "new" ? newSubject : formData.subjectName,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload resource");
      }

      toast.success("Resource uploaded successfully!");
      setFormData(INITIAL_FORM_STATE);
      setNewSubject("");
      setSubjectInputMethod(null);
    } catch (error) {
      console.error("Error uploading resource:", error);
      toast.error(
        error.message || "Failed to upload resource. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mt-16">
            <Breadcrumbs items={BREADCRUMB_ITEMS} />
          </div>

          <div className="flex items-center gap-3 mt-8 lg:mt-12">
            <h2 className="text-2xl font-bold text-black">Upload Subject</h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-6"
          >
            <h2 className="text-xl font-semibold mb-4">Upload Resource</h2>

            <div className="mb-4">
              <label htmlFor="subjectName" className="block text-gray-700 mb-2">
                Subject Name
              </label>
              <select
                name="subjectName"
                id="subjectName"
                value={formData.subjectName}
                onChange={handleChange}
                disabled={subjectInputMethod === "new"}
                className={`w-full p-2 border rounded-md ${
                  errors.subject ? "border-red-500" : "border-gray-300"
                } ${subjectInputMethod === "new" ? "bg-gray-100" : ""}`}
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>

              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Or create a new subject"
                  value={newSubject}
                  onChange={handleNewSubjectChange}
                  disabled={subjectInputMethod === "existing"}
                  className={`w-full p-2 border rounded-md ${
                    errors.subject ? "border-red-500" : "border-gray-300"
                  } ${subjectInputMethod === "existing" ? "bg-gray-100" : ""}`}
                />
              </div>
              {errors.subject && (
                <p className="mt-1 text-sm text-red-500" role="alert">
                  {errors.subject}
                </p>
              )}
              {subjectInputMethod && (
                <button
                  type="button"
                  onClick={() => {
                    setSubjectInputMethod(null);
                    setNewSubject("");
                    setFormData((prev) => ({ ...prev, subjectName: "" }));
                  }}
                  className="mt-2 text-sm text-blue-500 hover:text-blue-700"
                >
                  Clear selection
                </button>
              )}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full p-2 bg-blue-500 text-white rounded-md transition-colors
                  ${
                    isLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "hover:bg-blue-600"
                  }`}
              >
                {isLoading ? "Uploading..." : "Upload Resource"}
              </button>
            </div>
          </form>
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </>
  );
};

export default UploadSubject;
