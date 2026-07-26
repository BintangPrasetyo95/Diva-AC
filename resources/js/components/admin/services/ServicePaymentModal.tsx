import React, { useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useForm, router } from '@inertiajs/react';
import { Banknote, XCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { Service } from '@/types/admin';

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

    const isCurrentlyPaid = payingService ? Number(payingService.bayar_service || 0) >= Number(payingService.total_service || 0) : false;
    const [processing, setProcessing] = React.useState(false);

    const handleUpdatePayment = (isPaid: boolean) => {
        if (!payingService) return;
        setProcessing(true);

        router.patch(`/admin/services/${payingService.id}/pay`, {
            is_paid: isPaid,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                toast.success('Status pembayaran berhasil diubah');
            },
            onError: () => {
                toast.error('Gagal mengubah status pembayaran');
            },
            onFinish: () => setProcessing(false),
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
                            Status Pembayaran
                        </h2>
                        <p className="mb-8 text-center text-sm text-[#1b1b18]/60 dark:text-white/60">
                            Total Tagihan:{' '}
                            <span className="font-bold text-[#1b1b18] dark:text-white">
                                {formatCurrency(payingService?.total_service || 0)}
                            </span>
                        </p>
                        
                        <div className="flex flex-col gap-4">
                            {!isCurrentlyPaid ? (
                                <Button
                                    type="button"
                                    disabled={processing}
                                    onClick={() => handleUpdatePayment(true)}
                                    className="h-14 w-full rounded-2xl bg-green-600 text-xs font-bold tracking-widest text-white uppercase shadow-lg shadow-green-600/20 hover:bg-green-700"
                                >
                                    <CheckCircle2 className="mr-2 size-4" />
                                    Tandai Sudah Lunas
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    disabled={processing}
                                    onClick={() => handleUpdatePayment(false)}
                                    className="h-14 w-full rounded-2xl bg-red-600 text-xs font-bold tracking-widest text-white uppercase shadow-lg shadow-red-600/20 hover:bg-red-700"
                                >
                                    <XCircle className="mr-2 size-4" />
                                    Tandai Belum Lunas
                                </Button>
                            )}

                            <Button
                                type="button"
                                variant="outline"
                                className="h-12 w-full rounded-2xl text-[10px] font-bold tracking-widest uppercase mt-2"
                                onClick={onClose}
                            >
                                Batal
                            </Button>
                        </div>
                    </m.div>
                </div>
            )}
        </AnimatePresence>
    );
}
