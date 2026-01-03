import type { ReactNode } from "react";

type IconLabelProps = {
  icon: ReactNode;
  children: ReactNode;
  position?: "left" | "right";
  className?: string;
};

export function IconLabel({ icon, children, position = "left", className }: IconLabelProps) {
  return (
    <span className={`icon-label ${position === "right" ? "icon-right" : ""} ${className || ""}`}>
      {position === "left" && <span className="icon-label__icon">{icon}</span>}
      <span className="icon-label__text">{children}</span>
      {position === "right" && <span className="icon-label__icon">{icon}</span>}
    </span>
  );
}
