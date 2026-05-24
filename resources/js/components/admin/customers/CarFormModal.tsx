import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Loader2, Car } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/hooks/use-language';
import { ModalShell } from '@/components/ui/ModalShell';
import { Customer } from '@/types/admin';

interface CarFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetCustomerForCar: Customer | null;
}

export function CarFormModal({
    isOpen,
    onClose,
    targetCustomerForCar,
}: CarFormModalProps) {
    const { t } = useLanguage();

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        merk: '',
        model: '',
        tahun: '',
        no_polisi: '',
        warna: '',
        keterangan: '',
    });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            reset();
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!targetCustomerForCar) return;

        post(`/admin/customers/${targetCustomerForCar.id}/mobils`, {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                toast.success('Car added successfully');
                reset();
            },
        });
    };

    return (
        <ModalShell isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                        {t('dash_add_car')}
                    </h2>
                    <p className="text-xs text-[#1b1b18]/40 dark:text-white/40">
                        For {targetCustomerForCar?.nama_pelanggan}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="rounded-full p-2 text-[#1b1b18]/40 hover:bg-[#1b1b18]/5 dark:text-white/40 dark:hover:bg-white/5"
                >
                    <X className="size-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                Brand/Merk *
                            </label>
                            <Input
                                value={data.merk}
                                onChange={(e) =>
                                    setData('merk', e.target.value)
                                }
                                className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                placeholder="Toyota, Honda..."
                                required
                            />
                            {errors.merk && (
                                <span className="text-xs text-red-600">
                                    {errors.merk}
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                Model
                            </label>
                            <Input
                                value={data.model}
                                onChange={(e) =>
                                    setData('model', e.target.value)
                                }
                                className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                placeholder="Avanza, Civic..."
                            />
                            {errors.model && (
                                <span className="text-xs text-red-600">
                                    {errors.model}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                Plate Number *
                            </label>
                            <Input
                                value={data.no_polisi}
                                onChange={(e) =>
                                    setData('no_polisi', e.target.value)
                                }
                                className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                placeholder="B 1234 ABC"
                                required
                            />
                            {errors.no_polisi && (
                                <span className="text-xs text-red-600">
                                    {errors.no_polisi}
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                Year
                            </label>
                            <Input
                                type="number"
                                value={data.tahun}
                                onChange={(e) =>
                                    setData('tahun', e.target.value)
                                }
                                className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                placeholder="2020"
                            />
                            {errors.tahun && (
                                <span className="text-xs text-red-600">
                                    {errors.tahun}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                            Color
                        </label>
                        <Input
                            value={data.warna}
                            onChange={(e) =>
                                setData('warna', e.target.value)
                            }
                            className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                            placeholder="Black, White..."
                        />
                        {errors.warna && (
                            <span className="text-xs text-red-600">
                                {errors.warna}
                            </span>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                            Notes
                        </label>
                        <textarea
                            value={data.keterangan}
                            onChange={(e) =>
                                setData('keterangan', e.target.value)
                            }
                            className="flex min-h-[80px] w-full rounded-2xl border border-transparent bg-[#1b1b18]/5 px-3 py-2 text-sm text-[#1b1b18] ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b1b18] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 dark:text-white dark:ring-offset-[#1b1b18] dark:focus-visible:ring-white"
                            placeholder="Additional notes..."
                        />
                        {errors.keterangan && (
                            <span className="text-xs text-red-600">
                                {errors.keterangan}
                            </span>
                        )}
                    </div>
                </div>
                <button
                    disabled={processing}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#1b1b18] text-sm font-black tracking-widest text-white uppercase shadow-xl transition-all hover:bg-black disabled:opacity-50 dark:bg-white dark:text-[#1b1b18]"
                >
                    {processing ? (
                        <Loader2 className="size-5 animate-spin" />
                    ) : (
                        <>
                            <Car className="size-5" />
                            {t('dash_save_changes')}
                        </>
                    )}
                </button>
            </form>
        </ModalShell>
    );
}
