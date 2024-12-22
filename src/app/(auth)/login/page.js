"use client";
import useForm from "@/components/Auth/useForm";
import InputField from "@/components/Auth/InputField";
import AuthForm from "@/components/Auth/AuthForm";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const { values, error, setError, loading, setLoading, handleChange } =
    useForm({
      password: "",
      email: "",
    });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!values.email || !values.password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: values.password,
            email: values.email,
          }),
          credentials: "include", // Include cookies
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        toast.success("Login Successfully");
        //delay for 2 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        toast.error(data.error || "Invalid Credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    router.push(`/register`);
  };
  const handleForgetPasswordClick = () => {
    router.push(`/forget-password`);
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
        title="Welcome Back"
        subtitle="Login to access your dashboard"
        buttonText="Sign In"
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
        fields={
          <>
            <InputField
              label="Email"
              id="email"
              type="email"
              value={values.email || ""}
              onChange={handleChange}
              placeholder="Enter your Email"
              icon={<Mail />}
            />

            <InputField
              label="Password"
              id="password"
              type="password"
              value={values.password || ""}
              onChange={handleChange}
              placeholder="Enter your password"
              icon={<Lock />}
            />
          </>
        }
      >
        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="text-sm text-blue-500 hover:underline"
            onClick={handleForgetPasswordClick}
          >
            Forgot Password?
          </button>
          <button
            type="button"
            className="text-sm text-blue-500 hover:underline"
            onClick={handleRegisterClick}
          >
            Don&apos;t have an account? Register
          </button>
        </div>
      </AuthForm>
    </>
  );
}
