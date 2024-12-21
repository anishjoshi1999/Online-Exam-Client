import React from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  AlertCircle,
  Clock,
} from "lucide-react";
function ActivityItem({ title, time, type, href }) {
  return (
    <Link href={href} className="group">
      <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
        <div className="flex items-center space-x-4">
          <div
            className={`
          p-2 rounded-lg
          ${
            type === "exam"
              ? "bg-blue-100"
              : type === "alert"
              ? "bg-yellow-100"
              : "bg-green-100"
          }
        `}
          >
            {type === "exam" ? (
              <BookOpen className="w-5 h-5 text-blue-600" />
            ) : type === "alert" ? (
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              {title}
            </h3>
            <p className="text-sm text-gray-500 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {time}
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all duration-300" />
      </div>
    </Link>
  );
}

export default ActivityItem;
