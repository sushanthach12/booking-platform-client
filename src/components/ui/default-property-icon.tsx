"use client";

import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface DefaultPropertyIconProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "size-8",
  md: "size-12",
  lg: "size-16",
  xl: "size-24"
};

const iconSizes = {
  sm: "size-4",
  md: "size-6", 
  lg: "size-8",
  xl: "size-12"
};

export function DefaultPropertyIcon({ 
  size = "md",
  className 
}: DefaultPropertyIconProps) {
  return (
    <div 
      className={cn(
        "flex items-center justify-center rounded-lg bg-gray-100",
        sizeClasses[size],
        className
      )}
    >
      <Home className={cn("text-gray-400", iconSizes[size])} />
    </div>
  );
}
