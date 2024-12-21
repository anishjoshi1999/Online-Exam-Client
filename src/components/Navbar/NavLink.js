import React from "react";
import Link from "next/link";
function NavLink({ href, icon: Icon, children, ariaLabel }) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
      aria-label={ariaLabel || children}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  );
}

export default NavLink;
