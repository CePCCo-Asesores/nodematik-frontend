"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  dark?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, dark = true, className, ...props }, ref) => {
    return (
      <div className="mb-[15px]">
        {label && (
          <label className={cn(
            "block text-[12.5px] font-semibold mb-[7px]",
            dark ? "text-[#B0B5D6]" : "text-[#54586F]"
          )}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-[11px] px-[15px] py-[13px] text-[15px] outline-none transition-all duration-[0.15s]",
            dark
              ? "bg-[#151935] border border-[#313861] text-[#F4F5FD] placeholder-[#777CA4] focus:border-[#6B72C9] focus:shadow-[0_0_0_4px_rgba(107,114,201,.13)]"
              : "bg-white border border-[#DCDFEC] text-[#14162E] placeholder-[#9094AC] focus:border-[#6B72C9] focus:shadow-[0_0_0_4px_rgba(107,114,201,.12)]",
            error && "border-[#FF6B6B]",
            className
          )}
          {...props}
        />
        {hint && (
          <p className="text-[11.5px] text-[#777CA4] mt-[6px] leading-[1.5]">
            {hint}
          </p>
        )}
        {error && (
          <p className="text-[11.5px] text-[#FF6B6B] mt-[6px]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
