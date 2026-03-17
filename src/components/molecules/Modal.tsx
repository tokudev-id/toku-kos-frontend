import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'max-w-sm' | 'max-w-md' | 'max-w-lg' | 'max-w-xl' | 'max-w-2xl' | 'max-w-3xl' | 'max-w-4xl';
}

const MAX_WIDTH_CLASSES = {
  'max-w-sm': 'max-w-sm',
  'max-w-md': 'max-w-md',
  'max-w-lg': 'max-w-lg',
  'max-w-xl': 'max-w-xl',
  'max-w-2xl': 'max-w-2xl',
  'max-w-3xl': 'max-w-3xl',
  'max-w-4xl': 'max-w-4xl',
} as const;

export function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-3xl" }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10">
      <div 
        className="absolute inset-0 bg-text-primary/10 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div 
        ref={modalRef}
        className={cn(
          "bg-white w-full min-w-[320px] rounded-3xl shadow-elevated z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 fade-in duration-300",
          MAX_WIDTH_CLASSES[maxWidth]
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-8 py-5 border-b border-border-default flex items-center justify-between bg-surface-bg/30">
          <h3 className="text-xl font-bold font-display">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-brand-primary hover:bg-brand-primary-soft rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-8 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

