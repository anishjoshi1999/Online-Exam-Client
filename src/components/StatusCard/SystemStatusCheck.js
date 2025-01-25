"use client";

import { useState, useEffect } from "react";
import { CheckCircle, ArrowRight, AlertTriangle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { generate} from "random-words";
export default function SystemStatusCheck() {
  const [cameraStatus, setCameraStatus] = useState(null);
  const [microphoneStatus, setMicrophoneStatus] = useState(null);
  const [keywordStatus, setKeywordStatus] = useState(null);
  const [mouseStatus, setMouseStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkSystemStatus = async () => {
    setLoading(true);

    // Camera check
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStatus(true);
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      setCameraStatus(false);
    }

    // Microphone check
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophoneStatus(true);
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      setMicrophoneStatus(false);
    }
    let randomWord = generate({ minLength: 5, maxLength: 13 });  
    // Keyword check
    const keyword = prompt(`Please type the keyword '${randomWord}' to verify your keyboard:`);
    if (keyword === randomWord) {
      setKeywordStatus(true);
    } else {
      setKeywordStatus(false);
    }

    // Mouse check
    const mouseCheck = confirm("Please move your mouse and click OK to verify your mouse:");
    setMouseStatus(mouseCheck);

    setLoading(false);
  };

  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900">System Check</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            {cameraStatus === null ? (
              <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
            ) : cameraStatus ? (
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
            )}
            Camera {cameraStatus === null ? "Not Checked" : cameraStatus ? "Enabled" : "Disabled"}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            {microphoneStatus === null ? (
              <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
            ) : microphoneStatus ? (
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
            )}
            Microphone {microphoneStatus === null ? "Not Checked" : microphoneStatus ? "Connected" : "Not Connected"}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            {keywordStatus === null ? (
              <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
            ) : keywordStatus ? (
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
            )}
            Keyboard {keywordStatus === null ? "Not Checked" : keywordStatus ? "Verified" : "Not Verified"}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            {mouseStatus === null ? (
              <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
            ) : mouseStatus ? (
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
            )}
            Mouse {mouseStatus === null ? "Not Checked" : mouseStatus ? "Verified" : "Not Verified"}
          </div>
          <button
            onClick={checkSystemStatus}
            className="inline-flex items-center text-sm text-green-600 hover:text-green-700 mt-2"
            disabled={loading}
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
          </button>
        </div>
      </div>
    </Card>
  );
}