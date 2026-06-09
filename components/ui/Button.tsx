"use client";

import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gold" | "indigo" | "ghost" | "outline" | "dark" | "link";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "gold",
  size = "md",
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const variants = {
    gold: "bg-gold-500 text-[#070920] hover:bg-gold-400 shadow-[0_10px_30px_rgba(201,162,39,.3)]",
    indigo: "bg-[#1B1F5A] text-white hover:bg-[#252A78] shadow-[0_6px_16px_rgba(27,31,90,.22)]",
    ghost: "bg-white text-[#14162E] border border-[#DCDFEC] hover:bg-[#F7F8FC]",
    outline: "bg-transparent text-white border border-[#313861] hover:bg-[#11142F] hover:border-[#6B72C9]",
    dark: "bg-[#0C0E2A] text-white hover:bg-[#161A4A]",
    link: "bg-transparent text-[#2D3480] hover:bg-[#EEF0FB] border-none shadow-none",
  };

  const sizes = {
    sm: "px-[15px] py-[9px] text-[13px] rounded-[9px]",
    md: "px-[26px] py-[14px] text-[15px] rounded-[12px]",
    lg: "px-[30px] py-[16px] text-[15px] rounded-[12px]",
  };

  return (
    <button
      className={cn(
        "font-semibold inline-flex items-center justify-center gap-[9px] border-none cursor-pointer transition-all duration-[0.18s]",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Spinner
          light={variant === "gold" ? false : true}
          size="sm"
        />
      )}
      {children}
    </button>
  );
}
