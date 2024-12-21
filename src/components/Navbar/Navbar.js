"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  LogOut,
  Menu,
  X,
  Layout,
  UserPlus,
  Award,
  Wallet,
  User,
} from "lucide-react";
import NavLink from "./NavLink";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleLogout = async () => {
    if (token) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (response.ok) {
          localStorage.removeItem("token");
          setToken(null);
          window.location.href = "/";
        } else {
          console.error("Logout failed:", response.statusText);
        }
      } catch (error) {
        console.error("Error during logout:", error);
      }
    } else {
      localStorage.removeItem("token");
      setToken(null);
      window.location.href = "/";
    }
  };

  const renderAuthLinks = () => (
    <>
      {!token ? (
        <>
          <NavLink href="/pricing" icon={Wallet} ariaLabel="View Pricing Plans">
            Pricing
          </NavLink>
          <NavLink href="/login" icon={User} ariaLabel="Login to Your Account">
            Login
          </NavLink>
          <NavLink
            href="/register"
            icon={UserPlus}
            ariaLabel="Create New Account"
          >
            Register
          </NavLink>
        </>
      ) : (
        <>
          <NavLink href="/dashboard" icon={Layout} ariaLabel="Go to Dashboard">
            Dashboard
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            aria-label="Logout from Account"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </>
      )}
    </>
  );

  return (
    <nav
      className="bg-white border-b border-gray-100 fixed w-full top-0 z-50"
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
              aria-label="Start Test Home"
            >
              <Award className="h-8 w-8" />
              <span className="text-2xl font-bold">Start Test</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
              aria-label={isOpen ? "Close Menu" : "Open Menu"}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <NavLink href="/" icon={Home} ariaLabel="Go to Home Page">
              Home
            </NavLink>
            {renderAuthLinks()}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        } md:hidden fixed inset-0 z-50 bg-white transition-all duration-300 ease-in-out`}
        style={{ top: "64px" }}
        aria-hidden={!isOpen}
      >
        <div className="px-4 pt-2 pb-3 space-y-1">
          <NavLink href="/" icon={Home} ariaLabel="Go to Home Page">
            Home
          </NavLink>
          <div className="pt-4 border-t border-gray-200">
            {renderAuthLinks()}
          </div>
        </div>
      </div>
    </nav>
  );
}
