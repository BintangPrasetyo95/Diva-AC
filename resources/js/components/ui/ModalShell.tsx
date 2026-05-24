import React from 'react';
import { AnimatePresence, m } from 'framer-motion';

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  maxWidth?: string;
  children: React.ReactNode;
  className?: string;
}

export function ModalShell({
  isOpen,
  onClose,
  maxWidth = 'max-w-lg',
  children,
  className = '',
}: ModalShellProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1b1b18]/80 backdrop-blur-sm"
          />
          <m.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full ${maxWidth} overflow-y-auto rounded-4xl bg-white p-8 shadow-2xl dark:bg-[#121212] ${className}`}
          >
            {children}
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
