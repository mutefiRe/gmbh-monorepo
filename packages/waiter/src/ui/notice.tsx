type NoticeProps = {
  message: string;
  variant?: "info" | "warning" | "error" | "success";
};

const variantClasses: Record<NonNullable<NoticeProps["variant"]>, string> = {
  info: "bg-slate-50 text-slate-700 border-slate-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  error: "bg-rose-50 text-rose-700 border-rose-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export function Notice({ message, variant = "info" }: NoticeProps) {
  return (
    <div className={`rounded-lg border px-3 py-2 text-sm font-semibold ${variantClasses[variant]}`}>
      {message}
    </div>
  );
}
