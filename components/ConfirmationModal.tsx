
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary' | 'warning';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'primary'
}) => {
  if (!isOpen) return null;

  const variantClasses = {
    danger: 'bg-[#ff3131] hover:bg-red-700 text-white',
    primary: 'bg-[#002E5A] hover:bg-[#2d5a8e] text-white',
    warning: 'bg-[#fe740e] hover:bg-orange-600 text-white'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#002E5A]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#002E5A] uppercase tracking-widest">{title}</h3>
        </div>
        <div className="p-8">
          <p className="text-sm text-gray-600 font-medium leading-relaxed">{message}</p>
        </div>
        <div className="p-6 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase hover:underline transition"
          >
            {cancelLabel}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-8 py-3 text-[10px] font-bold rounded-xl shadow-lg transition uppercase tracking-widest ${variantClasses[variant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
