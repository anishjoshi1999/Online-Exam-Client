"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "../Common/Loader";
import refreshToken from "@/lib/token/refreshToken";
import isAccessTokenExpired from "@/lib/token/isAccessTokenExpired";
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
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
    <div className="max-w-md w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-600 text-white mb-4">
          <LogoIcon />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-2">{message}</p>
      </div>

      <div className="bg-white rounded-xl shadow-xl p-8">
        <Link
          href="/login"
          className="block w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 text-center"
        >
          Go to Login
        </Link>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          &copy; 2024 Start Test. All rights reserved.
        </p>
      </div>
    </div>
  </div>
);

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expired, setExpired] = useState(false);

    useEffect(() => {
      const checkAuthentication = async () => {
        let token = localStorage.getItem("token");

        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Check if token is expired
        const isExpired = isAccessTokenExpired(token);
        if (isExpired) {
          console.log("Token Expired");
          try {
            await refreshToken();
            token = localStorage.getItem("token");
          } catch (error) {
            console.error("Error refreshing token:", error);
            setIsAuthenticated(false);
            setLoading(false);
            return;
          }
        }

        if (isAccessTokenExpired(token)) {
          setExpired(true);
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }

        setLoading(false);
      };

      checkAuthentication();
    }, []);

    if (loading) {
      return <Loader />;
    }

    if (expired) {
      return (
        <AuthMessage
          title="Session Expired"
          message="Your session has expired. Please log in again to continue."
        />
      );
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
