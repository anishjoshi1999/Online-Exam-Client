"use client"
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { User, Mail, Briefcase, MapPin, GraduationCap, Loader2, ClipboardList, AlertCircle } from "lucide-react";
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WaitingList() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    profession: "",
    education: "",
    location: "",
    receiveUpdates: true,
  });

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        return !value.trim() ? 'Full name is required' : '';
      case 'email':
        return !EMAIL_REGEX.test(value) ? 'Please enter a valid email address' : '';
      case 'profession':
        return !value.trim() ? 'Profession is required' : '';
      case 'education':
        return !value.trim() ? 'Education qualification is required' : '';
      case 'location':
        return !value.trim() ? 'Location is required' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (type !== 'checkbox') {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, newValue)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(values).forEach(key => {
      if (key !== 'receiveUpdates') {
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
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);

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
        toast.success("You've been added to the waiting list successfully!");
        setTimeout(() => router.push("/dashboard"), 2500);
      } else {
        toast.error(data.message || "Failed to join the waiting list");
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("Connection error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = ({ id, label, icon: Icon, type = "text", placeholder }) => (
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
            errors[id] ? 'border-red-500' : ''
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
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            Join the Waiting List
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Be among the first to gain early access
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {renderInput({
              id: "fullName",
              label: "Full Name",
              icon: User,
              placeholder: "Enter your full name"
            })}

            {renderInput({
              id: "email",
              label: "Email",
              icon: Mail,
              type: "email",
              placeholder: "Enter your email"
            })}

            {renderInput({
              id: "profession",
              label: "Profession",
              icon: Briefcase,
              placeholder: "Enter your profession"
            })}

            {renderInput({
              id: "education",
              label: "Education Qualification",
              icon: GraduationCap,
              placeholder: "Enter your highest qualification"
            })}

            {renderInput({
              id: "location",
              label: "Location",
              icon: MapPin,
              placeholder: "Enter your location"
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
              <Label htmlFor="receiveUpdates" className="text-sm text-gray-600">
                Receive updates, newsletters, and exclusive offers
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining Waiting List...
                </>
              ) : (
                "Join Waiting List"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}