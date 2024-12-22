"use client";

import useForm from "@/components/Auth/useForm";
import InputField from "@/components/Auth/InputField";
import AuthForm from "@/components/Auth/AuthForm";
import { useRouter } from "next/navigation";
import { User, Mail, Briefcase, MapPin, GraduationCap } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function WaitingList() {
  const { values, error, setError, loading, setLoading, handleChange } =
    useForm({
      fullName: "",
      email: "",
      profession: "",
      education: "",
      location: "",
      receiveUpdates: true, // New state for the checkbox
    });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !values.fullName ||
      !values.email ||
      !values.profession ||
      !values.education ||
      !values.location
    ) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/waiting-list`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(
          data.message || "You've been added to the waiting list successfully!"
        );
       
      } else {
        toast.error(data.message || "Failed to join the waiting list");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        router.push(`/`);
      }, 1500); // Wait for the toast to display
    }
  };

  return (
    <>
      {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />

      <AuthForm
        title="Join the Waiting List"
        subtitle="Be among the first to gain early access"
        buttonText="Join Waiting List"
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
        fields={
          <>
            <InputField
              label="Full Name"
              id="fullName"
              type="text"
              value={values.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              icon={<User />}
            />
            <InputField
              label="Email"
              id="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="Enter your email"
              icon={<Mail />}
            />
            <InputField
              label="Profession"
              id="profession"
              type="text"
              value={values.profession}
              onChange={handleChange}
              placeholder="Enter your profession"
              icon={<Briefcase />}
            />
            <InputField
              label="Education Qualification"
              id="education"
              type="text"
              value={values.education}
              onChange={handleChange}
              placeholder="Enter your highest qualification"
              icon={<GraduationCap />}
            />
            <InputField
              label="Location"
              id="location"
              type="text"
              value={values.location}
              onChange={handleChange}
              placeholder="Enter your location"
              icon={<MapPin />}
            />
            {/* Checkbox for receiving updates */}
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="receiveUpdates"
                name="receiveUpdates"
                checked={values.receiveUpdates}
                onChange={handleChange}
                className="h-4 w-4 text-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="receiveUpdates"
                className="ml-2 text-sm text-gray-700"
              >
                Receive updates, newsletters, and exclusive offers
              </label>
            </div>
          </>
        }
      />
    </>
  );
}
