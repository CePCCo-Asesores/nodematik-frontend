"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
  maxWidth?: string;
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  icon,
  maxWidth = "560px",
}: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-[rgba(10,12,36,.55)] backdrop-blur-sm z-[100] flex items-center justify-center p-6"
      style={{ animation: "fadeIn 0.25s ease" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-[22px] shadow-[0_40px_90px_rgba(27,31,90,.24)] w-full overflow-hidden"
        style={{
          maxWidth,
          animation: "pop 0.3s cubic-bezier(0.2,0.7,0.2,1)",
        }}
      >
        {(title || icon) && (
          <div className="px-[26px] py-[22px] border-b border-[#EAECF4] flex items-center gap-3">
            {icon && (
              <div className="w-[38px] h-[38px] rounded-[10px] bg-[#FBF3D6] text-[#A8861C] flex items-center justify-center text-[18px] font-bold flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="flex-1">
              {title && (
                <h3 className="text-[18px] font-bold text-[#1B1F5A] tracking-[-0.02em]">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[13px] text-[#9094AC]">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9094AC] hover:bg-[#F7F8FC] hover:text-[#14162E] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <div className="px-[26px] py-[24px]">{children}</div>
        {footer && (
          <div className="px-[26px] py-[18px] border-t border-[#EAECF4] flex gap-[11px] justify-end bg-[#FAFBFE]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
