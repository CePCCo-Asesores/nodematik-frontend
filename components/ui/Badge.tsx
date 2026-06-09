import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BadgeProps {
  variant?: "ok" | "warn" | "err" | "info" | "paused" | "line" | "gold";
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = "ok", children, className }: BadgeProps) {
  const variants = {
    ok: "bg-[rgba(52,209,127,.13)] text-[#34D17F]",
    warn: "bg-[rgba(227,180,60,.13)] text-[#E3B43C]",
    err: "bg-[rgba(255,107,107,.13)] text-[#FF6B6B]",
    info: "bg-[rgba(91,168,227,.13)] text-[#5BA8E3]",
    paused: "bg-[rgba(138,144,180,.13)] text-[#8A90B4]",
    line: "bg-transparent border border-[#2E3458] text-[#A7ACCB]",
    gold: "bg-[#FBF3D6] text-[#A8861C]",
  };

  return (
    <span
      className={cn(
        "text-[11px] font-semibold px-[10px] py-[3px] rounded-[6px] inline-block",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
