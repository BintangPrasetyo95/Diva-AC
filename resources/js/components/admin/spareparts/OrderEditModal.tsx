import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Modal } from '@/components/Modal';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useLanguage } from '@/hooks/use-language';
import { Plus, Trash } from 'lucide-react';

interface OrderItem {
    id_sparepart: number;
    nama_sparepart: string;
    jumlah: number;
    harga_satuan: string;
}

interface Sparepart {
    id: number;
    nama_sparepart: string;
    harga_sparepart: string;
    stock_sparepart: number;
}

interface Order {
    id: number;
    customer_name: string;
    customer_phone: string;
    address: string;
    tanggal_penjualan: string;
    total_harga: string;
    status: string;
    created_at: string;
    items: OrderItem[];
}

interface OrderEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    spareparts: Sparepart[];
}

export function OrderEditModal({
    isOpen,
    onClose,
    order,
    spareparts,
}: OrderEditModalProps) {
    const { t } = useLanguage();

    const {
        data: editData,
        setData: setEditData,
        put,
        reset,
        processing,
        clearErrors,
    } = useForm({
        customer_name: '',
        customer_phone: '',
        address: '',
        items: [] as {
            id: number;
            jumlah: number;
            harga_satuan: number;
            nama_sparepart?: string;
        }[],
    });

    useEffect(() => {
        if (isOpen && order) {
            setEditData({
                customer_name: order.customer_name,
                customer_phone: order.customer_phone,
                address: order.address,
                items: order.items.map((i) => ({
                    id: i.id_sparepart,
                    jumlah: i.jumlah,
                    harga_satuan: Number(i.harga_satuan),
                    nama_sparepart: i.nama_sparepart,
                })),
            });
        } else if (!isOpen) {
            reset();
            clearErrors();
        }
    }, [isOpen, order]);

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();

        if (order) {
            put(`/admin/spareparts/sell/${order.id}`, {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    const addItem = () => {
        if (spareparts.length === 0) {
            return;
        }

        const defaultSp = spareparts[0];
        setEditData('items', [
            ...editData.items,
            {
                id: defaultSp.id,
                jumlah: 1,
                harga_satuan: Number(defaultSp.harga_sparepart),
                nama_sparepart: defaultSp.nama_sparepart,
            },
        ]);
    };

    const removeItem = (idx: number) => {
        const newItems = [...editData.items];
        newItems.splice(idx, 1);
        setEditData('items', newItems);
    };

    const updateItem = (idx: number, field: string, value: any) => {
        const newItems = [...editData.items];
        const item = newItems[idx];

        if (field === 'id') {
            const sp = spareparts.find((s) => s.id === Number(value));

            if (sp) {
                item.id = sp.id;
                item.harga_satuan = Number(sp.harga_sparepart);
                item.nama_sparepart = sp.nama_sparepart;
            }
        } else if (field === 'jumlah') {
            item.jumlah = Number(value);
        }

        setEditData('items', newItems);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('sell_edit_title')}
            subtitle={t('sell_edit_desc')}
            maxWidthClassName="max-w-md"
        >
            <form onSubmit={submitEdit} className="space-y-4 py-2">
                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider text-[#1b1b18]/70 uppercase dark:text-white/70">
                        {t('sell_name_label')}
                    </label>
                    <input
                        required
                        value={editData.customer_name}
                        onChange={(e) =>
                            setEditData({
                                ...editData,
                                customer_name: e.target.value,
                            })
                        }
                        className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-2 text-sm text-[#1b1b18] focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none dark:border-white/20 dark:text-white"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider text-[#1b1b18]/70 uppercase dark:text-white/70">
                        {t('sell_phone')}
                    </label>
                    <input
                        required
                        value={editData.customer_phone}
                        onChange={(e) =>
                            setEditData({
                                ...editData,
                                customer_phone: e.target.value,
                            })
                        }
                        className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-2 text-sm text-[#1b1b18] focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none dark:border-white/20 dark:text-white"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold tracking-wider text-[#1b1b18]/70 uppercase dark:text-white/70">
                        {t('sell_address')}
                    </label>
                    <textarea
                        required
                        rows={3}
                        value={editData.address}
                        onChange={(e) =>
                            setEditData({
                                ...editData,
                                address: e.target.value,
                            })
                        }
                        className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-2 text-sm text-[#1b1b18] focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none dark:border-white/20 dark:text-white"
                    />
                </div>
                <div className="space-y-4 rounded-xl border border-[#1b1b18]/10 p-4 dark:border-white/10">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold tracking-wider text-[#1b1b18]/70 uppercase dark:text-white/70">
                            {t('sell_order_items')}
                        </label>
                        <button
                            type="button"
                            onClick={addItem}
                            className="flex items-center gap-1 rounded-lg bg-[#1b1b18]/5 px-2 py-1 text-xs font-bold text-[#1b1b18] hover:bg-[#1b1b18]/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                        >
                            <Plus className="size-3" /> Add Item
                        </button>
                    </div>

                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                        {editData.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <div className="flex-1 w-full">
                                    <SearchableSelect
                                        value={item.id}
                                        onChange={(val) =>
                                            updateItem(idx, 'id', val)
                                        }
                                        placeholder="Select a sparepart..."
                                        options={spareparts.map((sp) => ({
                                            value: sp.id,
                                            label: sp.nama_sparepart,
                                        }))}
                                        className="w-full!"
                                    />
                                </div>
                                <input
                                    type="number"
                                    min="1"
                                    value={item.jumlah}
                                    onChange={(e) =>
                                        updateItem(idx, 'jumlah', e.target.value)
                                    }
                                    className="w-20 rounded-xl border border-[#1b1b18]/20 bg-transparent px-3 py-2 text-sm text-[#1b1b18] focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none dark:border-white/20 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeItem(idx)}
                                    className="rounded-lg p-2 text-red-500 hover:bg-red-500/10"
                                >
                                    <Trash className="size-4" />
                                </button>
                            </div>
                        ))}
                        {editData.items.length === 0 && (
                            <div className="text-center text-xs text-red-500">
                                Must have at least one item.
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between border-t border-[#1b1b18]/10 pt-2 text-sm font-bold dark:border-white/10">
                        <span>Total:</span>
                        <span>
                            Rp{' '}
                            {editData.items
                                .reduce(
                                    (acc, curr) =>
                                        acc + curr.jumlah * curr.harga_satuan,
                                    0,
                                )
                                .toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-[#1b1b18]/10 dark:border-white/10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl px-4 py-2 text-sm font-bold text-[#1b1b18]/70 transition-colors hover:bg-[#1b1b18]/5 dark:text-white/70 dark:hover:bg-white/5"
                    >
                        {t('dash_cancel')}
                    </button>
                    <button
                        type="submit"
                        disabled={processing || editData.items.length === 0}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                    >
                        {t('sell_save_changes')}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
