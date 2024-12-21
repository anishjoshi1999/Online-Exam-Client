import React, { useEffect, useState } from "react";
import moment from "moment";
import getExamStatus from "@/lib/exam/examStatus";

const ExamHeader = ({ examData }) => {
  const [remainingTime, setRemainingTime] = useState(0);
  const [status, setStatus] = useState(
    getExamStatus(examData.startDate, examData.endDate)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const now = moment();
      let timeLeft;

      // Recalculate status based on current time
      const currentStatus = getExamStatus(examData.startDate, examData.endDate);
      setStatus(currentStatus);

      if (currentStatus.status === "Upcoming") {
        // Countdown until start time
        timeLeft = moment(examData.startDate).diff(now, "seconds");
      } else if (currentStatus.status === "Active") {
        // Countdown until end time
        timeLeft = moment(examData.endDate).diff(now, "seconds");
      } else {
        timeLeft = 0; // Exam is finished
      }

      setRemainingTime(timeLeft > 0 ? timeLeft : 0);
    }, 1000);

    return () => clearInterval(timer); // Clear interval on component unmount
  }, [examData.startDate, examData.endDate]);

  const formatTime = (seconds) => {
    const duration = moment.duration(seconds, "seconds");
    return `${Math.floor(
      duration.asHours()
    )}:${duration.minutes()}:${duration.seconds()}`;
  };

  return (
    <div className="max-w-3xl mx-auto py-10 bg-white shadow-lg rounded-lg border border-gray-200">
      {/* Exam Title */}
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
        Exam Information:{" "}
        <span
          className={`inline-block px-4 py-1 text-lg font-medium ${status.className}`}
        >
          {status.status}
        </span>
      </h1>

      {/* Exam Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center px-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-700">Start Time:</h2>
          <p className="text-gray-500">
            {moment(examData.startDate).format("MMMM Do YYYY, h:mm:ss a")}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700">End Time:</h2>
          <p className="text-gray-500">
            {moment(examData.endDate).format("MMMM Do YYYY, h:mm:ss a")}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700">Duration:</h2>
          <p className="text-gray-500">
            {moment(examData.endDate).diff(
              moment(examData.startDate),
              "minutes"
            )}{" "}
            minutes
          </p>
        </div>

        {/* Countdown for Remaining Time or Starts In */}
        {status.status === "Active" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700">
              Remaining Time:
            </h2>
            <p className="text-gray-500">{formatTime(remainingTime)}</p>
          </div>
        )}

        {status.status === "Upcoming" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Starts in:</h2>
            <p className="text-gray-500">{formatTime(remainingTime)}</p>
          </div>
        )}
        {status.status === "Expired" && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Ended</h2>
            <p className="text-gray-500">-</p>
          </div>
        )}
      </div>
      <div className="mt-8 p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800 text-center">
        <h2 className="text-lg font-medium">
          Note: Everything is monitored. Please avoid any form of cheating.
        </h2>
      </div>
    </div>
  );
};

export default ExamHeader;
