"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Loader2, Shield, AlertCircle } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ToastContainer } from "react-toastify";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState("");
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    receiveUpdates: true,
    userType: "",
  });

  const validateField = useCallback((name, value) => {
    switch (name) {
      case "firstName":
      case "lastName":
        return value.length < 2 ? "Must be at least 2 characters" : "";
      case "email":
        return !EMAIL_REGEX.test(value)
          ? "Please enter a valid email address"
          : "";
      case "password":
        return !PASSWORD_REGEX.test(value)
          ? "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
          : "";
      default:
        return "";
    }
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;

      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));

      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, newValue),
      }));
    },
    [validateField]
  );

  const handleUserTypeChange = useCallback((value) => {
    setSelectedUserType(value);
    setValues((prev) => ({
      ...prev,
      userType: value,
    }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    Object.keys(values).forEach((key) => {
      if (key !== "receiveUpdates" && key !== "userType") {
        const error = validateField(key, values[key]);
        if (error) newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validateField]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors before submitting");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Account Created Successfully");
        toast.success(
          "Verification email has been sent. Please check your inbox!"
        );
        setTimeout(() => router.push("/login"), 5000);
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Connection error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = useCallback(
    ({ id, label, icon: Icon, type = "text", placeholder }) => (
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
    ),
    [errors, values, handleChange]
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
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Register to access your dashboard
          </CardDescription>
        </CardHeader>

        {!selectedUserType ? (
          <CardContent className="space-y-4 text-center">
            <p className="text-gray-700 font-medium">Register as:</p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => handleUserTypeChange("user")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                Student
              </Button>
              <Button
                onClick={() => handleUserTypeChange("admin")}
                className="bg-green-600 hover:bg-green-700 text-white px-6"
              >
                Teacher
              </Button>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-700">
                  Registering as a {selectedUserType}.
                </AlertDescription>
              </Alert>

              {renderInput({
                id: "firstName",
                label: "First Name",
                icon: User,
                placeholder: "Enter your First Name",
              })}

              {renderInput({
                id: "lastName",
                label: "Last Name",
                icon: User,
                placeholder: "Enter your Last Name",
              })}

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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="receiveUpdates"
                  name="receiveUpdates"
                  checked={values.receiveUpdates}
                  onCheckedChange={(checked) =>
                    setValues((prev) => ({ ...prev, receiveUpdates: checked }))
                  }
                  className="border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <Label
                  htmlFor="receiveUpdates"
                  className="text-sm text-gray-600"
                >
                  Receive updates about new features and educational resources
                </Label>
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
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => router.push("/login")}
              >
                Already have an account? Login
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
