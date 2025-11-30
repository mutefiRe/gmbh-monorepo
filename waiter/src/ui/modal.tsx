import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;             // controlled from outside
  onClose?: () => void;       // called on backdrop click / close / Escape
  title?: string;
  children?: ReactNode;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  actions?: ReactNode;
};

import { Dialog } from '@base-ui-components/react/dialog';

export function Modal({
  open, onClose,
  title,
  children,
  closeOnBackdropClick = true,
  closeOnEsc = true,
  actions,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onClose} modal>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black  z-40" style={{ opacity: 0.8 }} />
        <Dialog.Popup className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] max-w-[90vw]">
            <Dialog.Title className="text-lg font-bold mb-2">{title}</Dialog.Title>
            <div className="mb-4 text-gray-600" >
              {children}
            </div>
            <div className="flex justify-end gap-2">
              {actions}
              <Dialog.Close className="px-4 py-2 bg-gray-200 rounded">Close</Dialog.Close>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}