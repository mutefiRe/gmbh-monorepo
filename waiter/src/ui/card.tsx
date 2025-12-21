import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      {...props}
      className={[
        "bg-white rounded-xl border border-slate-200 shadow-sm",
        className
      ].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}
