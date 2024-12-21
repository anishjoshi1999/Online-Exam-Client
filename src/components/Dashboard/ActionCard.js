import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

function ActionCard({ icon: Icon, title, description, href, disabled = false }) {
  const Wrapper = disabled ? "div" : Link;

  return (
    <Wrapper
      href={href}
      className={`group ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <div
        className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${
          disabled
            ? ""
            : "hover:shadow-md transition-all duration-300 group-hover:border-blue-100"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-3 bg-blue-50 rounded-lg ${
              disabled
                ? ""
                : "group-hover:bg-blue-100 transition-colors duration-300"
            }`}
          >
            <Icon className={`w-6 h-6 ${disabled ? "text-gray-400" : "text-blue-600"}`} />
          </div>
          {!disabled && (
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all duration-300" />
          )}
        </div>
        <h3
          className={`font-semibold mb-1 ${
            disabled
              ? "text-gray-400"
              : "text-gray-900 group-hover:text-blue-600 transition-colors duration-300"
          }`}
        >
          {title}
        </h3>
        <p className={`text-sm ${disabled ? "text-gray-400" : "text-gray-600"}`}>
          {description}
        </p>
      </div>
    </Wrapper>
  );
}

export default ActionCard;
