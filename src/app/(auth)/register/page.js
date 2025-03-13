"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Loader2,
  Shield,
  AlertCircle,
  User,
} from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userType: "Student",
    receiveUpdates: false,
  });

  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
        return !value
          ? "First name is required"
          : !NAME_REGEX.test(value)
          ? "Please enter a valid first name"
          : "";
      case "lastName":
        return !value
          ? "Last name is required"
          : !NAME_REGEX.test(value)
          ? "Please enter a valid last name"
          : "";
      case "email":
        return !value
          ? "Email is required"
          : !EMAIL_REGEX.test(value)
          ? "Please enter a valid email address"
          : "";
      case "password":
        return !value
          ? "Password is required"
          : value.length < 8
          ? "Password must be at least 8 characters long"
          : "";
      case "userType":
        return !value ? "Please select a user type" : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (type !== "checkbox") {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleRadioChange = (value) => {
    setValues((prev) => ({
      ...prev,
      userType: value,
    }));
  };

  const handleCheckboxChange = (checked) => {
    setValues((prev) => ({
      ...prev,
      receiveUpdates: checked,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(values).forEach((key) => {
      if (key !== "receiveUpdates") {
        // Skip validation for optional checkbox
        const error = validateField(key, values[key]);
        if (error) newErrors[key] = error;
      }
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Registration Successful");
        setTimeout(() => router.push("/login"), 1000);
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
            Create an Account
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Register to access the platform
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput({
                id: "firstName",
                label: "First Name",
                icon: User,
                placeholder: "Enter your first name",
              })}

              {renderInput({
                id: "lastName",
                label: "Last Name",
                icon: User,
                placeholder: "Enter your last name",
              })}
            </div>

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
              placeholder: "Create a strong password",
            })}

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">User Type</Label>
              <RadioGroup
                defaultValue="Student"
                value={values.userType}
                onValueChange={handleRadioChange}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Student" id="student" />
                  <Label htmlFor="student" className="text-gray-700">
                    Student
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Teacher" id="teacher" />
                  <Label htmlFor="teacher" className="text-gray-700">
                    Teacher
                  </Label>
                </div>
              </RadioGroup>
              {errors.userType && (
                <div className="flex items-center mt-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.userType}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="receiveUpdates"
                checked={values.receiveUpdates}
                onCheckedChange={handleCheckboxChange}
              />
              <Label
                htmlFor="receiveUpdates"
                className="text-gray-600 text-sm cursor-pointer"
              >
                I want to receive updates about products, features and
                announcements
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
              Already have an account? Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
