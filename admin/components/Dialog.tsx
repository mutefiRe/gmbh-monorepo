import React, { ReactNode, useEffect, useRef } from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({ open, onClose, title, actions, children, className }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onMouseDown={handleOverlayClick}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-zoomIn ${className || ''}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
            <div>{title}</div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
                aria-label="Schließen"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            )}
          </div>
        )}
        {/* Content */}
        <div className="flex-1 overflow-auto">{children}</div>
        {/* Actions */}
        {actions && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">{actions}</div>
        )}
      </div>
    </div>
  );
};
