import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;             // controlled from outside
  onClose?: () => void;       // called on backdrop click / close / Escape
  title?: string;
  subtitle?: ReactNode;
  children?: ReactNode;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  actions?: ReactNode;
  showCloseAction?: boolean;
  contentClassName?: string;
};

import { Dialog } from '@base-ui-components/react/dialog';

export function Modal({
  open, onClose,
  title,
  subtitle,
  children,
  closeOnBackdropClick = true,
  closeOnEsc = true,
  actions,
  showCloseAction = true,
  contentClassName,
}: ModalProps) {
  void closeOnBackdropClick;
  void closeOnEsc;
  return (
    <Dialog.Root open={open} onOpenChange={onClose} modal>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <Dialog.Popup className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col ${contentClassName ?? ""}`}>
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
              <Dialog.Title className="text-base font-semibold text-slate-800">{title}</Dialog.Title>
              {subtitle ? (
                <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
              ) : null}
            </div>
            <div className="flex-1 overflow-auto p-6 text-slate-600">
              {children}
            </div>
            {(actions || onClose) && (
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                {showCloseAction && (
                  <Dialog.Close
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                    autoFocus
                  >
                    Abbrechen
                  </Dialog.Close>
                )}
                {actions}
              </div>
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
