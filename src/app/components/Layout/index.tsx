"use client";

import React from "react";

export const Layout: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};
