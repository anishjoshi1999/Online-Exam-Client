"use client";
import useForm from "@/components/Auth/useForm";
import InputField from "@/components/Auth/InputField";
import AuthForm from "@/components/Auth/AuthForm";
import { useRouter } from "next/navigation";
import { User, Mail, Lock } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const { values, error, setError, loading, setLoading, handleChange } = useForm({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    receiveUpdates: true,
    userType: "user", // Default to "Take Test"
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!values.firstName || !values.lastName || !values.email || !values.password || !values.userType) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        toast.success("Account Created Successfully");
        toast.success("Verification email has been sent. Please check your inbox!");
        setTimeout(() => {
          router.push(`/login`);
        }, 1000);
      } else {
        const data = await res.json();
        toast.error(data.error || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
        <AuthForm
          title="Create Account"
          subtitle="Register to access your dashboard"
          buttonText="Create Account"
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
          fields={
            <div className="grid grid-cols-1 gap-4">
              <InputField
                label="First Name"
                id="firstName"
                type="text"
                value={values.firstName}
                onChange={handleChange}
                placeholder="Enter your First Name"
                icon={<User />}
              />
              <InputField
                label="Last Name"
                id="lastName"
                type="text"
                value={values.lastName}
                onChange={handleChange}
                placeholder="Enter your Last Name"
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
                label="Password"
                id="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                placeholder="Enter your password"
                icon={<Lock />}
              />
              {/* Radio buttons for user type */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700">
                  How do you want to use the platform?
                </label>
                <div className="mt-2 flex flex-col gap-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="userType"
                      value="user"
                      checked={values.userType === "user"}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Take Test</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="userType"
                      value="admin"
                      checked={values.userType === "admin"}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Conduct Test</span>
                  </label>
                </div>
              </div> */}
              {/* Checkbox for receiving updates */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="receiveUpdates"
                  name="receiveUpdates"
                  checked={values.receiveUpdates}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="receiveUpdates" className="ml-2 text-sm text-gray-700">
                  Receive updates, newsletters, and exclusive offers
                </label>
              </div>
            </div>
          }
        >
          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-sm text-blue-500 hover:underline"
              onClick={handleLoginClick}
            >
              Already have an account? Login
            </button>
          </div>
        </AuthForm>
      </div>
    </>
  );
}
