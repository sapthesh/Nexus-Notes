import React from 'react';
import { WarningIcon } from './icons/Icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonVariant?: 'primary' | 'destructive';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  confirmButtonVariant = 'destructive',
}) => {
  if (!isOpen) return null;

  const confirmButtonClasses = {
    primary: 'bg-accent text-white font-semibold hover:opacity-90 focus:ring-accent',
    destructive: 'bg-red-600 text-white font-semibold hover:bg-red-700 focus:ring-red-500',
  };

  const iconClasses = {
    primary: 'text-accent',
    destructive: 'text-red-500',
  };
  
  const iconBgClasses = {
      primary: 'bg-accent/10',
      destructive: 'bg-red-600/10'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-secondary rounded-lg shadow-xl w-full max-w-md border border-border-color" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-start">
            <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${iconBgClasses[confirmButtonVariant]} sm:h-10 sm:w-10`}>
              <WarningIcon className={`h-6 w-6 ${iconClasses[confirmButtonVariant]}`} aria-hidden="true" />
            </div>
            <div className="ml-4 text-left">
              <h2 className="text-xl font-bold text-text-primary" id="modal-title">{title}</h2>
              <div className="mt-1">
                <p className="text-sm text-text-secondary">{message}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-highlight px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-transparent border border-border-color text-text-primary hover:bg-border-color transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary focus:ring-accent"
          >
            {cancelButtonText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary ${confirmButtonClasses[confirmButtonVariant]}`}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
