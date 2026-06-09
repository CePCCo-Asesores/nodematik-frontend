"use client";

import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  light?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Spinner({ className, light = false, size = "md" }: SpinnerProps) {
  const sizes = {
    sm: "w-3.5 h-3.5",
    md: "w-[17px] h-[17px]",
    lg: "w-6 h-6",
  };

  return (
    <span
      className={cn(
        "rounded-full inline-block flex-shrink-0",
        "border-[2.5px]",
        light
          ? "border-white/30 border-t-white"
          : "border-[rgba(12,14,42,0.3)] border-t-[#0C0E2A]",
        "animate-spin",
        sizes[size],
        className
      )}
      style={{ animationDuration: "0.7s" }}
    />
  );
}
