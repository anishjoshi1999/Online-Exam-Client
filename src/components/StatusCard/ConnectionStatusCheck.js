import React, { useState } from 'react';
import { CheckCircle, ArrowRight, Wifi, Loader } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import SpeedTest from '@cloudflare/speedtest';

function ConnectionStatusCheck() {
  const [isTesting, setIsTesting] = useState(false);
  const [latency, setLatency] = useState(0); // Default latency
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('Strong Connection');

  const handleSpeedTest = async () => {
    setIsTesting(true);
    setConnectionStatus('Testing...');

    const speedTest = new SpeedTest({
      autoStart: false,
      measurements: [
        { type: 'latency', numPackets: 5 }, // Fewer latency packets
        { type: 'download', bytes: 1e6, count: 5 }, // Smaller file size and fewer requests
        { type: 'upload', bytes: 1e6, count: 5 }, // Smaller file size and fewer requests
      ],
    });

    speedTest.onFinish = (results) => {
      const summary = results.getSummary();
      console.log(summary); // Debugging: Log the summary object
      setLatency(summary.latency); // Use summary.latency instead of summary.unloadedLatency
      setDownloadSpeed(summary.download / 1e6); // Convert download speed to Mbps
      setUploadSpeed(summary.upload / 1e6); // Convert upload speed to Mbps
      setConnectionStatus('Strong Connection');
      setIsTesting(false);
    };

    speedTest.onError = (error) => {
      console.error('Error:', error);
      setConnectionStatus('Test Failed');
      setIsTesting(false);
    };

    speedTest.play(); // Start the test
  };

  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Wifi className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Network Check</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            {connectionStatus}
          </div>
          <p className="text-sm text-gray-600">Latency: {latency.toFixed(2)}ms</p>
          <p className="text-sm text-gray-600">Download: {downloadSpeed.toFixed(2)} Mbps</p>
          <p className="text-sm text-gray-600">Upload: {uploadSpeed.toFixed(2)} Mbps</p>
          {/* {downloadSpeed && (
            <p className="text-sm text-gray-600">Download: {downloadSpeed.toFixed(2)} Mbps</p>
          )}
          {uploadSpeed && (
            <p className="text-sm text-gray-600">Upload: {uploadSpeed.toFixed(2)} Mbps</p>
          )} */}
          <Link
            href="#"
            className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 mt-2"
            onClick={(e) => {
              e.preventDefault();
              handleSpeedTest();
            }}
          >
            {isTesting ? (
              <>
                Testing... <Loader className="w-4 h-4 ml-1 animate-spin" />
              </>
            ) : (
              <>
                Test Connection <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Link>
        </div>
      </div>
    </Card>
  );
}

export default ConnectionStatusCheck;