"use client";

import { useState, useEffect } from "react";
import { CheckCircle, ArrowRight, Shield, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function BrowserCompatibilityCheck() {
  const [browserInfo, setBrowserInfo] = useState({
    name: "Detecting...",
    version: "",
    ip: "Fetching...",
  });
  const [loading, setLoading] = useState(true); // Add loading state

  // Detect browser type and version
  const detectBrowser = () => {
    const userAgent = navigator.userAgent;
    let name = "Unknown";
    let version = "";

    // Chrome, Chromium, or Edge (Chromium-based)
    if (/chrome|chromium|crios/i.test(userAgent)) {
      if (/edg/i.test(userAgent)) {
        name = "Edge";
        version = userAgent.match(/edg\/([\d.]+)/i)?.[1] || "";
      } else {
        name = "Chrome";
        version = userAgent.match(/chrome\/([\d.]+)/i)?.[1] || "";
      }
    }
    // Firefox
    else if (/firefox|fxios/i.test(userAgent)) {
      name = "Firefox";
      version = userAgent.match(/firefox\/([\d.]+)/i)?.[1] || "";
    }
    // Safari (not Chrome/Chromium-based)
    else if (/safari/i.test(userAgent) && !/chrome|chromium|crios/i.test(userAgent)) {
      name = "Safari";
      version = userAgent.match(/version\/([\d.]+)/i)?.[1] || "";
    }
    // Internet Explorer
    else if (/trident/i.test(userAgent)) {
      name = "Internet Explorer";
      version = userAgent.match(/rv:([\d.]+)/i)?.[1] || "";
    }

    setBrowserInfo((prev) => ({ ...prev, name, version }));
  };

  // Fetch IP address
  const fetchIPAddress = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      setBrowserInfo((prev) => ({ ...prev, ip: data.ip }));
    } catch (error) {
      setBrowserInfo((prev) => ({ ...prev, ip: "Unable to fetch IP" }));
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  useEffect(() => {
    detectBrowser();
    fetchIPAddress();
  }, []);

  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Browser Status</h3>
        </div>
        <div className="space-y-2">
          {loading ? (
            <div className="flex items-center text-sm text-gray-600">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Detecting browser and IP...
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                Browser: {browserInfo.name} 
              </p>
              <p className="text-sm text-gray-600">
                Browser Version: {browserInfo.version}
              </p>
              <p className="text-sm text-gray-600">IP Address: {browserInfo.ip}</p>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                {browserInfo.name !== "Unknown" ? "Latest Version Detected" : "Browser Not Recognized"}
              </div>
            </>
          )}
          <Link
            href="#"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mt-2"
            onClick={(e) => {
              e.preventDefault();
              setLoading(true); // Show loader when re-checking
              detectBrowser();
              fetchIPAddress();
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Checking...
              </>
            ) : (
              <>
                Run Full Check <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Link>
        </div>
      </div>
    </Card>
  );
}