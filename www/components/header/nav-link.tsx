"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import type { LinkProps } from "next/link";

import { cn } from "~/lib/utils";

import { Link } from "../ui/link";

export const NavLink: React.FCC<LinkProps & { className?: string }> = ({
  href,
  className,
  children,
  ...props
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      {...props}
      className={cn(isActive && "text-red-500", className)}
      href={href}
    >
      {children}
    </Link>
  );
};
