import React from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  maxWidth?: string;
  children: React.ReactNode;
  className?: string;
  isDirty?: boolean;
}

export function ModalShell({
  isOpen,
  onClose,
  maxWidth = 'max-w-lg',
  children,
  className = '',
  isDirty = false,
}: ModalShellProps) {
  const { t } = useLanguage();

  const handleClose = () => {
    if (isDirty) {
      if (window.confirm(t('confirm_unsaved_changes') || 'Anda memiliki perubahan yang belum disimpan. Yakin ingin menutup?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#1b1b18]/80 backdrop-blur-sm"
          />
          <m.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`custom-scrollbar relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-4xl bg-white p-8 shadow-2xl dark:bg-[#121212] ${className}`}
          >
            {children}
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
