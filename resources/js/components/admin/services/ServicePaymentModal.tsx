import React, { useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useForm } from '@inertiajs/react';
import { Banknote } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { Service } from '@/types/admin';
import { Input } from '@/components/ui/input';

interface ServicePaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    payingService: Service | null;
}

export function ServicePaymentModal({
    isOpen,
    onClose,
    payingService,
}: ServicePaymentModalProps) {
    const { t } = useLanguage();

    const { data, setData, patch, processing, errors, reset, clearErrors } = useForm({
        bayar_service: '',
    });

    useEffect(() => {
        if (isOpen && payingService) {
            setData({
                bayar_service: (payingService.bayar_service || 0).toString(),
            });
        } else {
            reset();
            clearErrors();
        }
    }, [isOpen, payingService]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!payingService) return;

        patch(`/admin/services/${payingService.id}/pay`, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                toast.success('Payment updated successfully');
            },
            onError: () => {
                toast.error('Failed to update payment');
            },
        });
    };

    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(Number(amount));
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
                        className="relative w-full max-w-md overflow-hidden rounded-4xl bg-white p-8 shadow-2xl dark:bg-[#121212]"
                    >
                        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-green-600/10">
                            <Banknote className="size-8 text-green-600" />
                        </div>
                        <h2 className="mb-2 text-center text-2xl font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                            Payment
                        </h2>
                        <p className="mb-8 text-center text-sm text-[#1b1b18]/60 dark:text-white/60">
                            Total Tagihan:{' '}
                            <span className="font-bold text-[#1b1b18] dark:text-white">
                                {formatCurrency(payingService?.total_service || 0)}
                            </span>
                        </p>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                    Payment Amount (Rp)
                                </label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={data.bayar_service}
                                    onChange={(e) =>
                                        setData('bayar_service', e.target.value)
                                    }
                                    className="h-12 rounded-2xl bg-[#1b1b18]/5 px-4 text-sm font-bold shadow-inner border-0 dark:bg-white/5"
                                    placeholder="0"
                                />
                                {errors.bayar_service && (
                                    <span className="text-xs font-bold text-red-500">
                                        {errors.bayar_service}
                                    </span>
                                )}
                            </div>
                            
                            <div className="mt-4 flex gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-12 flex-1 rounded-2xl text-[10px] font-bold tracking-widest uppercase"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="h-12 flex-1 rounded-2xl bg-green-600 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg shadow-green-600/20 hover:bg-green-700"
                                >
                                    {processing ? 'Saving...' : 'Save Payment'}
                                </Button>
                            </div>
                        </form>
                    </m.div>
                </div>
            )}
        </AnimatePresence>
    );
}
