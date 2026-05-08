"use client";

import type { ReactNode } from "react";

type Props = {
  title: string;
  eyebrow?: string;
  children?: ReactNode;
  /** Highlight line (z. B. E-Mail-Adresse) */
  detail?: ReactNode;
  className?: string;
};

function SuccessMark() {
  return (
    <div
      className="relative mx-auto flex size-16 items-center justify-center sm:size-[4.25rem]"
      aria-hidden
    >
      <div className="absolute inset-0 rounded-full bg-tint/[0.12] motion-safe:animate-[bp-success-pulse_1.8s_ease-out_both] motion-reduce:animate-none" />
      <div className="relative flex size-[3.35rem] items-center justify-center rounded-full bg-gradient-to-br from-tint to-tint/80 text-white shadow-[0_12px_32px_-12px_rgba(0,102,204,0.55)] motion-safe:animate-[bp-success-scale-in_0.65s_cubic-bezier(0.34,1.35,0.64,1)_both] motion-reduce:animate-none sm:size-14">
        <svg
          className="size-[1.65rem] motion-safe:animate-[bp-success-check_0.48s_cubic-bezier(0.34,1.35,0.64,1)_0.32s_both] motion-reduce:animate-none"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M6 12.5l4 4 8-9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

export function FormSuccessCelebration({ title, eyebrow = "Geschafft", children, detail, className = "" }: Props) {
  return (
    <div
      className={`space-y-5 text-center motion-safe:animate-[bp-fade-up_0.6s_ease-out_both] motion-reduce:animate-none ${className}`}
      role="status"
      aria-live="polite"
    >
      <SuccessMark />
      <div>
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-tint">{eyebrow}</p>
        ) : null}
        <h3 className={`mt-1.5 text-[1.35rem] font-semibold leading-tight tracking-tight text-foreground sm:text-[1.5rem] ${eyebrow ? "" : "mt-0"}`}>
          {title}
        </h3>
        {detail ? (
          <div className="mt-3 motion-safe:animate-[bp-fade-up_0.55s_ease-out_0.12s_both] motion-reduce:animate-none">
            {detail}
          </div>
        ) : null}
        {children ? (
          <div className="mt-4 space-y-3 text-left text-[14px] leading-relaxed text-muted motion-safe:animate-[bp-fade-up_0.55s_ease-out_0.2s_both] motion-reduce:animate-none sm:text-[15px]">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
