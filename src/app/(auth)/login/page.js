"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, Shield, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToastContainer } from "react-toastify";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        return !EMAIL_REGEX.test(value)
          ? "Please enter a valid email address"
          : "";
      case "password":
        return !value ? "Password is required" : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(values).forEach((key) => {
      const error = validateField(key, values[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors before submitting");
      return;
    }

    setLoading(true);

    
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        toast.success("Login Successful");
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        toast.error(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Connection error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = ({
    id,
    label,
    icon: Icon,
    type = "text",
    placeholder,
  }) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-700 font-medium">
        {label}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3 top-3 h-4 w-4 text-blue-600" />
        <Input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          className={`pl-9 border-gray-200 focus:border-blue-600 focus:ring-blue-600 ${
            errors[id] ? "border-red-500" : ""
          }`}
          value={values[id]}
          onChange={handleChange}
        />
        {errors[id] && (
          <div className="flex items-center mt-1 text-sm text-red-500">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors[id]}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <ToastContainer position="top-right" autoClose={5000} />

      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader className="space-y-1 pb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-3 rounded-full">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Login to access your dashboard
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {renderInput({
              id: "email",
              label: "Email",
              icon: Mail,
              type: "email",
              placeholder: "Enter your email",
            })}

            {renderInput({
              id: "password",
              label: "Password",
              icon: Lock,
              type: "password",
              placeholder: "Enter your password",
            })}

            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                className="text-sm text-blue-600 hover:text-blue-700 p-0"
                onClick={() => router.push("/forget-password")}
              >
                Forgot Password?
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              // disabled={loading || Object.keys(errors).length > 0}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => router.push("/register")}
            >
              Don&apos;t have an account? Register
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
