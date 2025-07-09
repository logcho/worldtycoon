"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import type { LinkProps } from "next/link";

import { Link } from "@/components/ui/link"; // assuming your custom Link supports `className`, `href`, etc.

interface NavLinkProps extends LinkProps {
  className?: string;
  children: React.ReactNode;
}

export const NavLink: React.FC<NavLinkProps> = ({
  href,
  className = "",
  children,
  ...props
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const combinedClassName = `${isActive ? "text-yellow-500" : ""} ${className}`.trim();

  return (
    <Link
      {...props}
      className={combinedClassName}
      href={href}
    >
      {children}
    </Link>
  );
};
