"use client"
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, Shield, AlertCircle, KeyRound, ArrowLeft } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ToastContainer } from "react-toastify";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    email: "",
    token: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return !EMAIL_REGEX.test(value) ? 'Please enter a valid email address' : '';
      case 'token':
        return !value ? 'Reset token is required' : '';
      case 'newPassword':
        return !PASSWORD_REGEX.test(value) 
          ? 'Password must meet all requirements' : '';
      case 'confirmPassword':
        return value !== values.newPassword ? 'Passwords do not match' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = step === 1 ? ['email'] : ['token', 'newPassword', 'confirmPassword'];
    
    fieldsToValidate.forEach(key => {
      const error = validateField(key, values[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the errors before submitting");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Reset token sent to your email");
        setStep(2);
      } else {
        toast.error(data.message || "Failed to send reset token");
      }
    } catch (error) {
      toast.error("Connection error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the errors before submitting");
      return;
    }

    setLoading(true);

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
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (error) {
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
        {Icon && <Icon className="absolute left-3 top-3 h-4 w-4 text-blue-600" />}
        <Input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          className={`${Icon ? 'pl-9' : 'pl-3'} border-gray-200 focus:border-blue-600 focus:ring-blue-600 ${
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
              <KeyRound className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            {step === 1 ? 'Forgot Password' : 'Reset Password'}
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            {step === 1 
              ? 'Enter your email to receive a reset token' 
              : 'Enter the reset token and your new password'}
          </CardDescription>
        </CardHeader>

        <form onSubmit={step === 1 ? handleRequestReset : handleResetPassword}>
          <CardContent className="space-y-6">
            {step === 1 ? (
              renderInput({
                id: "email",
                label: "Email",
                icon: Mail,
                type: "email",
                placeholder: "Enter your email address"
              })
            ) : (
              <>
                {renderInput({
                  id: "token",
                  label: "Reset Token",
                  placeholder: "Enter the token from your email"
                })}
                
                {renderInput({
                  id: "newPassword",
                  label: "New Password",
                  icon: Lock,
                  type: "password",
                  placeholder: "Enter your new password"
                })}
                
                {renderInput({
                  id: "confirmPassword",
                  label: "Confirm Password",
                  icon: Lock,
                  type: "password",
                  placeholder: "Confirm your new password"
                })}

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription className="text-sm text-blue-700">
                    Password must contain:
                    <ul className="list-disc ml-4 mt-1">
                      <li>At least 8 characters</li>
                      <li>One uppercase letter</li>
                      <li>One lowercase letter</li>
                      <li>One number</li>
                      <li>One special character (!@#$%^&*)</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading }
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {step === 1 ? 'Sending Token...' : 'Resetting Password...'}
                </>
              ) : (
                step === 1 ? 'Send Reset Token' : 'Reset Password'
              )}
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50" 
              onClick={() => router.push("/login")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}