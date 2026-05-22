import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    children: React.ReactNode;
    maxWidthClassName?: string; // defaults to 'max-w-md'
}

export function Modal({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    maxWidthClassName = 'max-w-md',
}: ModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#1b1b18]/80 backdrop-blur-sm"
                    />

                    {/* Modal Content Container */}
                    <m.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                        className={`custom-scrollbar relative max-h-[90vh] w-full ${maxWidthClassName} overflow-y-auto rounded-4xl bg-white p-8 shadow-2xl dark:bg-[#121212]`}
                    >
                        {/* Header */}
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                                    {title}
                                </h2>
                                {subtitle && (
                                    <p className="text-xs text-[#1b1b18]/40 dark:text-white/40">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-full p-2 text-[#1b1b18]/40 hover:bg-[#1b1b18]/5 dark:text-white/40 dark:hover:bg-white/5 transition-colors focus:outline-none"
                            >
                                <X className="size-6" />
                            </button>
                        </div>

                        {/* Body */}
                        {children}
                    </m.div>
                </div>
            )}
        </AnimatePresence>
    );
}
