"use client";

import { useState, useEffect } from "react";
import { Clock, ArrowRight, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import moment from "moment-timezone";

export default function TimeStatusCheck() {
  const [timeStatus, setTimeStatus] = useState(null);
  const [localTime, setLocalTime] = useState(moment().format("hh:mm:ss A"));
  const [referenceTime, setReferenceTime] = useState(
    moment().tz("Asia/Kolkata").format("hh:mm:ss A")
  );
  const [browserTimezone, setBrowserTimezone] = useState("");
  const [location, setLocation] = useState(null);
  const [ipAddress, setIpAddress] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Automatically detect the browser's timezone
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setBrowserTimezone(detectedTimezone);

    // Update local time every second
    const interval = setInterval(() => {
      setLocalTime(moment().format("hh:mm:ss A"));
      setReferenceTime(moment().tz("Asia/Kolkata").format("hh:mm:ss A"));
    }, 1000);

    // Fetch IP address and location
    fetch("https://ipapi.co/json/")
      .then((response) => response.json())
      .then((data) => {
        setIpAddress(data.ip);
        setLocation({
          city: data.city,
          region: data.region,
          country: data.country_name,
        });
      })
      .catch((error) => {
        console.error("Error fetching location data:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false after fetching data
      });

    return () => clearInterval(interval);
  }, []);

  const verifyTimeZone = () => {
    const localTimeMoment = moment().tz(browserTimezone);
    const referenceTimeMoment = moment().tz("Asia/Kolkata");

    // Check if the local time matches the reference time within a tolerance (e.g., 1 minute)
    const timeDifference = Math.abs(
      localTimeMoment.diff(referenceTimeMoment, "minutes")
    );

    if (timeDifference <= 1) {
      setTimeStatus(true); // Time is correct
    } else {
      setTimeStatus(false); // Time is incorrect
    }
  };

  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Time Zone</h3>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Local Time: {localTime}</p>
          <p className="text-sm text-gray-600">
            Detected Timezone: {browserTimezone}
          </p>

          {loading ? (
            <div className="flex items-center text-sm text-gray-600">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Fetching location...
            </div>
          ) : (
            location && (
              <p className="text-sm text-gray-600">
                Your Location: {location.city}, {location.region},{" "}
                {location.country}
              </p>
            )
          )}

          <button
            onClick={verifyTimeZone}
            className="inline-flex items-center text-sm text-orange-600 hover:text-orange-700 mt-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...
              </>
            ) : (
              <>
                Check Timezone <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </Card>
  );
}