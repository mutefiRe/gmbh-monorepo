import { Loader2 } from 'lucide-react';

type LoadingNoticeProps = {
  active: boolean;
  label?: string;
};

export const LoadingNotice = ({ active, label = 'Daten werden geladen…' }: LoadingNoticeProps) => {
  if (!active) return null;

  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">
      <Loader2 size={16} className="animate-spin" />
      <span>{label}</span>
    </div>
  );
};
