import React from "react";
import Link from "next/link";

const Breadcrumbs = ({ items }) => {
  return (
    <nav aria-label="breadcrumb" className="text-sm mb-4">
      {items.map((item, index) => (
        <span key={index} className="inline-block text-black">
          {index !== 0 && <span className="mx-2">/</span>}
          {item.href ? (
            <Link href={item.href} className="text-blue-600 hover:underline">
           {item.label}
            </Link>
          ) : (
            <span className="text-gray-500">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
