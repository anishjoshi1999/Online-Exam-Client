"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "@/components/Navbar/Navbar";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import renewAccessToken from "@/lib/token/renewAccessToken";
import { Progress } from "@/components/ui/progress";
import axios from "axios";

// Constants
const BREADCRUMB_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Upload Resources", href: "/upload-resources" },
  { label: "Upload Lectures", href: "/upload-resources/upload-lectures" },
];

const INITIAL_FORM_STATE = {
  subjectName: "",
  title: "",
  description: "",
};

const UploadLecturesPage = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [subjectInputMethod, setSubjectInputMethod] = useState(null); // 'new' or 'existing'
  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
    setUploadProgress(0);
  };
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", videoFile);
    uploadData.append(
      "subjectName",
      subjectInputMethod === "new" ? newSubject : formData.subjectName
    );
    uploadData.append("title", formData.title);
    uploadData.append("description", formData.description);

    try {
      const token = await renewAccessToken();
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-resources/upload-lectures`,
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      toast.success("Upload successful!");
      setVideoFile(null);
      setFormData(INITIAL_FORM_STATE); // Reset form data after successful upload
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

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

  const renderFormField = (label, name, type = "text", options = null) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 mb-2">
        {label}
      </label>
      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md ${
            errors[name] ? "border-red-500" : "border-gray-300"
          }`}
        >
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          rows="4"
          className={`w-full p-2 border rounded-md ${
            errors[name] ? "border-red-500" : "border-gray-300"
          } ${errors[name] ? "border-red-500" : ""}`}
          aria-invalid={errors[name] ? "true" : "false"}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md ${
            errors[name] ? "border-red-500" : "border-gray-300"
          }`}
          aria-invalid={errors[name] ? "true" : "false"}
        />
      )}
      {errors[name] && (
        <p className="mt-1 text-sm text-red-500" role="alert">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mt-16">
            <Breadcrumbs items={BREADCRUMB_ITEMS} />
          </div>

          <div className="flex items-center gap-3 mt-8 lg:mt-12">
            <h2 className="text-2xl font-bold text-black">Upload Lectures</h2>
          </div>
          <form
            onSubmit={handleUpload}
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

            {renderFormField("Resource Title", "title")}
            {renderFormField("Description", "description", "textarea")}
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md mb-4"
              disabled={isUploading}
            />
            {videoFile && (
              <div className="space-y-4">
                <Progress value={uploadProgress} className="w-full" />
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {isUploading
                    ? `Uploading ${uploadProgress}%`
                    : "Upload Video"}
                </button>
              </div>
            )}
          </form>
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </>
  );
};

export default UploadLecturesPage;
