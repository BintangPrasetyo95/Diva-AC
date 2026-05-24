import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { ModalShell } from '@/components/ui/ModalShell';
import { useLanguage } from '@/hooks/use-language';
import { Customer } from '@/types/admin'; // assume we'll move types to a shared file or we can define here

interface CustomerFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingCustomer: Customer | null;
}

export function CustomerFormModal({
    isOpen,
    onClose,
    editingCustomer,
}: CustomerFormModalProps) {
    const { t } = useLanguage();

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        nama_pelanggan: '',
        no_telp: '',
        email: '',
        jenis_kelamin: 'L' as 'L' | 'P',
        alamat: '',
    });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            if (editingCustomer) {
                setData({
                    nama_pelanggan: editingCustomer.nama_pelanggan,
                    no_telp: editingCustomer.no_telp,
                    email: editingCustomer.email,
                    jenis_kelamin: editingCustomer.jenis_kelamin,
                    alamat: editingCustomer.alamat,
                });
            } else {
                reset();
            }
        }
    }, [isOpen, editingCustomer]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingCustomer) {
            put(`/admin/customers/${editingCustomer.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                    toast.success('Customer updated successfully');
                    reset();
                },
            });
        } else {
            post('/admin/customers', {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                    toast.success('Customer added successfully');
                    reset();
                },
            });
        }
    };

    return (
        <ModalShell isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                                {editingCustomer
                                    ? t('dash_edit_user')
                                    : t('dash_add_user')}
                            </h2>
                            <button
                                onClick={onClose}
                                className="rounded-full p-2 text-[#1b1b18]/40 hover:bg-[#1b1b18]/5 dark:text-white/40 dark:hover:bg-white/5"
                            >
                                <X className="size-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                        Full Name
                                    </label>
                                    <Input
                                        value={data.nama_pelanggan}
                                        onChange={(e) =>
                                            setData('nama_pelanggan', e.target.value)
                                        }
                                        className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                        placeholder="John Doe"
                                    />
                                    {errors.nama_pelanggan && (
                                        <span className="text-xs text-red-600">
                                            {errors.nama_pelanggan}
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                        Phone Number
                                    </label>
                                    <Input
                                        value={data.no_telp}
                                        onChange={(e) =>
                                            setData('no_telp', e.target.value)
                                        }
                                        className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                        placeholder="08123456789"
                                    />
                                    {errors.no_telp && (
                                        <span className="text-xs text-red-600">
                                            {errors.no_telp}
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                        Email Address
                                    </label>
                                    <Input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                        placeholder="john@example.com"
                                    />
                                    {errors.email && (
                                        <span className="text-xs text-red-600">
                                            {errors.email}
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                        Gender
                                    </label>
                                    <select
                                        value={data.jenis_kelamin}
                                        onChange={(e) =>
                                            setData(
                                                'jenis_kelamin',
                                                e.target.value as 'L' | 'P'
                                            )
                                        }
                                        className="flex h-12 w-full rounded-2xl border border-transparent bg-[#1b1b18]/5 px-3 py-2 text-sm text-[#1b1b18] ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b1b18] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 dark:text-white dark:ring-offset-[#1b1b18] dark:focus-visible:ring-white"
                                    >
                                        <option value="L">Laki-laki (Male)</option>
                                        <option value="P">Perempuan (Female)</option>
                                    </select>
                                    {errors.jenis_kelamin && (
                                        <span className="text-xs text-red-600">
                                            {errors.jenis_kelamin}
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                        Address
                                    </label>
                                    <textarea
                                        value={data.alamat}
                                        onChange={(e) =>
                                            setData('alamat', e.target.value)
                                        }
                                        className="flex min-h-[80px] w-full rounded-2xl border border-transparent bg-[#1b1b18]/5 px-3 py-2 text-sm text-[#1b1b18] ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b1b18] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 dark:text-white dark:ring-offset-[#1b1b18] dark:focus-visible:ring-white"
                                        placeholder="Full address"
                                    />
                                    {errors.alamat && (
                                        <span className="text-xs text-red-600">
                                            {errors.alamat}
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
                                        <Users className="size-5" />
                                        {t('dash_save_changes')}
                                    </>
                                )}
                            </button>
                        </form>
        </ModalShell>
    );
}
