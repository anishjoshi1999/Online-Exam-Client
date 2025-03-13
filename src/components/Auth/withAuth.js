"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "../Common/Loader";
import renewAccessToken from "@/lib/token/renewAccessToken";

// Enhanced shield icon with better styling
const LogoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-12 h-12"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const AuthMessage = ({ title, message }) => (
  <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
    <div className="max-w-md w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-6 shadow-lg">
          <LogoIcon />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-600 mt-2 max-w-xs mx-auto">{message}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <Link
          href="/login"
          className="block w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-center"
        >
          Go to Login
        </Link>
        
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Start Test. All rights reserved.
        </p>
      </div>
    </div>
  </div>
);

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const checkAuthentication = async () => {
        let token = await renewAccessToken();

        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        } else {
          // Token is valid
          setIsAuthenticated(true);
        }
        setLoading(false);
      };
      checkAuthentication();
    }, []);

    if (loading) {
      return <Loader />;
    }

    if (!isAuthenticated) {
      return (
        <AuthMessage
          title="Login Required"
          message="Please log in to access this page"
        />
      );
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AuthenticatedComponent;
};

export default withAuth;