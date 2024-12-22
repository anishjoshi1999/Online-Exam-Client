"use client";
import { useState } from "react";
import useForm from "@/components/Auth/useForm";
import InputField from "@/components/Auth/InputField";
import AuthForm from "@/components/Auth/AuthForm";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const { values, error, setError, loading, setLoading, handleChange } =
    useForm({
      email: "",
      token: "",
      newPassword: "",
      confirmPassword: "",
    });
  const router = useRouter();

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/;
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!passwordRegex.test(password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)";
    }
    return null;
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!values.email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Reset token sent to your email");
        setStep(2);
      } else {
        toast.error(data.message || "Failed to process request");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!values.token) {
      setError("Please enter the reset token");
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(values.newPassword);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    if (values.newPassword !== values.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: values.token,
            newPassword: values.newPassword,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset successful");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      {step === 1 ? (
        <AuthForm
          title="Forgot Password"
          subtitle="Enter your email to receive a reset token"
          buttonText="Send Reset Token"
          loading={loading}
          error={error}
          onSubmit={handleRequestReset}
          fields={
            <InputField
              label="Email"
              id="email"
              type="email"
              value={values.email || ""}
              onChange={handleChange}
              placeholder="Enter your email address"
              icon={<Mail />}
            />
          }
        >
          <div className="flex justify-center mt-4">
            <button
              type="button"
              className="text-sm text-blue-500 hover:underline"
              onClick={handleLoginClick}
            >
              Back to Login
            </button>
          </div>
        </AuthForm>
      ) : (
        <AuthForm
          title="Reset Password"
          subtitle="Enter the reset token and your new password"
          buttonText="Reset Password"
          loading={loading}
          error={error}
          onSubmit={handleResetPassword}
          fields={
            <>
              <div className="relative">
                <InputField
                  label="Reset Token"
                  id="token"
                  type="text"
                  value={values.token || ""}
                  onChange={handleChange}
                  placeholder="Enter your reset token"
                />
              </div>
              <InputField
                label="New Password"
                id="newPassword"
                type="password"
                value={values.newPassword || ""}
                onChange={handleChange}
                placeholder="Enter your new password"
                icon={<Lock />}
              />
              <InputField
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                value={values.confirmPassword || ""}
                onChange={handleChange}
                placeholder="Confirm your new password"
                icon={<Lock />}
              />
              <div className="text-xs text-gray-600 mt-2">
                Password must contain:
                <ul className="list-disc ml-4 mt-1">
                  <li>At least 8 characters</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                  <li>One special character (!@#$%^&*)</li>
                </ul>
              </div>
            </>
          }
        >
          <div className="flex justify-center mt-4">
            <button
              type="button"
              className="text-sm text-blue-500 hover:underline"
              onClick={handleLoginClick}
            >
              Back to Login
            </button>
          </div>
        </AuthForm>
      )}
    </>
  );
}
