import type { ReactNode } from "react";
import { Link } from "wouter";

type MenuLinkProps = {
  href: string;
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  showIndicator?: boolean;
};

export function MenuLink({ href, label, icon, onClick, showIndicator }: MenuLinkProps) {
  return (
    <Link
      className={() => "relative flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"}
      href={href}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
      {showIndicator && (
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary-600" />
      )}
    </Link>
  );
}
