import React, { useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Loader2, Upload, PackagePlus, Edit3 } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/hooks/use-language';
import { ModalShell } from '@/components/ui/ModalShell';
import { Sparepart } from '@/types/admin'; // Make sure type exists or adjust import

interface InventoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingPart: Sparepart | null;
}

export function InventoryFormModal({
    isOpen,
    onClose,
    editingPart,
}: InventoryFormModalProps) {
    const { t } = useLanguage();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            nama_sparepart: '',
            tipe_sparepart: '',
            harga_sparepart: '',
            stock_sparepart: '',
            is_public: true,
            keterangan: '',
            image_file: null as File | null,
            _method: 'post',
        });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            if (editingPart) {
                setData({
                    nama_sparepart: editingPart.nama_sparepart,
                    tipe_sparepart: editingPart.tipe_sparepart,
                    harga_sparepart: editingPart.harga_sparepart.toString(),
                    stock_sparepart: editingPart.stock_sparepart.toString(),
                    is_public: editingPart.is_public,
                    keterangan: editingPart.keterangan || '',
                    image_file: null,
                    _method: 'put',
                });
            } else {
                reset();
                setData({
                    nama_sparepart: '',
                    tipe_sparepart: '',
                    harga_sparepart: '',
                    stock_sparepart: '',
                    is_public: true,
                    keterangan: '',
                    image_file: null,
                    _method: 'post',
                });
            }
        }
    }, [isOpen, editingPart]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingPart) {
            post(`/admin/inventory/${editingPart.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                    toast.success('Sparepart updated successfully');
                    reset();
                },
                onError: () => {
                    toast.error('Failed to update sparepart');
                },
            });
        } else {
            post('/admin/inventory', {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                    toast.success('Sparepart added successfully');
                    reset();
                },
                onError: () => {
                    toast.error('Failed to add sparepart');
                },
            });
        }
    };

    return (
        <ModalShell isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                    {editingPart
                        ? t('dash_edit_item')
                        : t('dash_add_new_item')}
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
                        <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 dark:text-white/60 uppercase">
                            Item Name *
                        </label>
                        <Input
                            value={data.nama_sparepart}
                            onChange={(e) =>
                                setData('nama_sparepart', e.target.value)
                            }
                            className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                            placeholder="e.g. Brake Pad"
                            required
                        />
                        {errors.nama_sparepart && (
                            <span className="text-xs text-red-600">
                                {errors.nama_sparepart}
                            </span>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 dark:text-white/60 uppercase">
                            Category/Type *
                        </label>
                        <Input
                            value={data.tipe_sparepart}
                            onChange={(e) =>
                                setData('tipe_sparepart', e.target.value)
                            }
                            className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                            placeholder="e.g. Brakes"
                            required
                        />
                        {errors.tipe_sparepart && (
                            <span className="text-xs text-red-600">
                                {errors.tipe_sparepart}
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 dark:text-white/60 uppercase">
                                Price *
                            </label>
                            <Input
                                type="number"
                                value={data.harga_sparepart}
                                onChange={(e) =>
                                    setData('harga_sparepart', e.target.value)
                                }
                                className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                placeholder="0"
                                required
                            />
                            {errors.harga_sparepart && (
                                <span className="text-xs text-red-600">
                                    {errors.harga_sparepart}
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 dark:text-white/60 uppercase">
                                Stock *
                            </label>
                            <Input
                                type="number"
                                value={data.stock_sparepart}
                                onChange={(e) =>
                                    setData('stock_sparepart', e.target.value)
                                }
                                className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                placeholder="0"
                                required
                            />
                            {errors.stock_sparepart && (
                                <span className="text-xs text-red-600">
                                    {errors.stock_sparepart}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 dark:text-white/60 uppercase">
                            Notes
                        </label>
                        <textarea
                            value={data.keterangan}
                            onChange={(e) =>
                                setData('keterangan', e.target.value)
                            }
                            className="flex min-h-[80px] w-full rounded-2xl border border-transparent bg-[#1b1b18]/5 px-3 py-2 text-sm text-[#1b1b18] ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b1b18] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 dark:text-white dark:ring-offset-[#1b1b18] dark:focus-visible:ring-white"
                            placeholder="Additional info..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 dark:text-white/60 uppercase">
                            Item Image (Optional)
                        </label>
                        <div className="flex flex-col gap-2">
                            <div
                                className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#1b1b18]/10 bg-[#1b1b18]/5 transition-colors hover:bg-[#1b1b18]/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {data.image_file ? (
                                    <div className="flex flex-col items-center text-[#1b1b18] dark:text-white">
                                        <span className="font-bold">
                                            {data.image_file.name}
                                        </span>
                                        <span className="text-xs opacity-50">
                                            Click to change
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="size-8 text-[#1b1b18]/40 dark:text-white/40" />
                                        <span className="text-sm font-bold text-[#1b1b18]/60 dark:text-white/60">
                                            Click to upload image
                                        </span>
                                    </>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        setData('image_file', e.target.files[0]);
                                    }
                                }}
                            />
                            {errors.image_file && (
                                <span className="text-xs text-red-600">
                                    {errors.image_file}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 rounded-2xl border border-transparent bg-[#1b1b18]/5 p-4 dark:bg-white/5">
                        <Checkbox
                            id="is_public"
                            checked={data.is_public}
                            onCheckedChange={(checked) =>
                                setData('is_public', checked as boolean)
                            }
                            className="h-5 w-5 rounded-md"
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label
                                htmlFor="is_public"
                                className="font-bold text-[#1b1b18] dark:text-white"
                            >
                                Make Public
                            </Label>
                            <p className="text-xs text-[#1b1b18]/60 dark:text-white/60">
                                Allow customers to view this item on the public catalog.
                            </p>
                        </div>
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
                            {editingPart ? (
                                <Edit3 className="size-5" />
                            ) : (
                                <PackagePlus className="size-5" />
                            )}
                            {t('dash_save_changes')}
                        </>
                    )}
                </button>
            </form>
        </ModalShell>
    );
}
