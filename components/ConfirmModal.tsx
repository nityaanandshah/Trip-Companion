'use client';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-mustard hover:bg-mustard-dark text-charcoal',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-w-md w-full bg-white p-6 shadow-2xl transform transition-all" style={{ borderRadius: '2px' }}>
        <h3 className="text-xl font-display font-bold mb-3" style={{ color: '#33353B' }}>{title}</h3>
        <p className="mb-6 whitespace-pre-line" style={{ color: 'rgba(51, 53, 59, 0.7)' }}>{message}</p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ borderRadius: '2px', color: 'rgba(51, 53, 59, 0.9)', backgroundColor: 'rgba(51, 53, 59, 0.1)' }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-3 text-sm font-semibold transition-colors ${confirmButtonClass}`}
            style={{ borderRadius: '2px' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
