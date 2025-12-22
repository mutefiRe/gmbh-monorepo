import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  icon?: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      type={props.type || 'button'}
      className={`px-8 py-3 bg-primary-600 text-white hover:bg-primary-700 rounded-xl font-semibold shadow-md shadow-blue-200 flex items-center gap-2 active:scale-95 transition-transform ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {icon}
      {loading ? 'Lädt...' : children}
    </button>
  );
};
