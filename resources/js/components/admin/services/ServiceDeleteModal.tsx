import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { Service } from '@/types/admin';

interface ServiceDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    deletingService: Service | null;
}

export function ServiceDeleteModal({
    isOpen,
    onClose,
    deletingService,
}: ServiceDeleteModalProps) {
    const { t } = useLanguage();

    const handleDelete = () => {
        if (!deletingService) return;

        router.delete(`/admin/services/${deletingService.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                toast.success('Service deleted successfully');
            },
            onError: (err) => {
                toast.error(err.error || 'Failed to delete service');
            },
        });
    };

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
                        className="relative w-full max-w-md overflow-hidden rounded-4xl bg-white p-8 text-center shadow-2xl dark:bg-[#121212]"
                    >
                        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-red-600/10">
                            <AlertTriangle className="size-8 text-red-600" />
                        </div>
                        <h2 className="mb-2 text-2xl font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                            {t('dash_confirm_q')}
                        </h2>
                        <p className="mb-8 text-sm text-[#1b1b18]/60 dark:text-white/60">
                            You are about to delete service{' '}
                            <span className="font-bold text-[#1b1b18] dark:text-white">
                                SRV-{deletingService?.id}
                            </span>
                            . This action cannot be undone. Note: Cannot delete a service that already has spareparts attached. Cancel it instead.
                        </p>
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                className="h-12 flex-1 rounded-2xl text-[10px] font-bold tracking-widest uppercase"
                                onClick={onClose}
                            >
                                {t('dash_no')}
                            </Button>
                            <Button
                                className="h-12 flex-1 rounded-2xl bg-red-600 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg shadow-red-600/20 hover:bg-red-700"
                                onClick={handleDelete}
                            >
                                {t('dash_yes')}
                            </Button>
                        </div>
                    </m.div>
                </div>
            )}
        </AnimatePresence>
    );
}
