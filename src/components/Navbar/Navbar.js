"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  LogOut,
  Menu,
  Layout,
  UserPlus,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavLink from "./NavLink";
import renewAccessToken from "@/lib/token/renewAccessToken";

export default function Navbar() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function fetchToken() {
      let newToken = await renewAccessToken();
      setToken(newToken);
    }
    fetchToken();
  }, []);

  const handleLogout = async () => {
    try {
      if (token) {
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
  
        if (response.ok || response.status === 401) {
          // Remove token regardless of the response since session is invalid
          localStorage.removeItem("token");
          setToken(null);
          window.location.href = "/";
        } else {
          console.error("Logout failed:", response.statusText);
        }
      } else {
        localStorage.removeItem("token");
        setToken(null);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Ensure token is cleared even if the request fails
      localStorage.removeItem("token");
      setToken(null);
      window.location.href = "/";
    }
  };
  

  return (
    <nav className="bg-white border-b fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
          <Award className="h-8 w-8" />
          <span className="text-2xl font-bold">Start Test</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLink href="/" icon={Home}>Home</NavLink>
          {token ? (
            <>
              <NavLink href="/dashboard" icon={Layout}>Dashboard</NavLink>
              <Button variant="ghost" onClick={handleLogout} className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink href="/login" icon={UserPlus}>Login</NavLink>
              <NavLink href="/register" icon={UserPlus}>Register</NavLink>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="space-y-4 pt-4">
              <NavLink href="/" icon={Home}>Home</NavLink>
              {token ? (
                <>
                  <NavLink href="/dashboard" icon={Layout}>Dashboard</NavLink>
                  <Button variant="ghost" onClick={handleLogout} className="w-full text-red-600">
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <NavLink href="/login" icon={UserPlus}>Login</NavLink>
                  <NavLink href="/register" icon={UserPlus}>Register</NavLink>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
