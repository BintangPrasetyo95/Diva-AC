import { Head, router } from '@inertiajs/react';
import {
    m,
    Variants,
    LazyMotion,
    domAnimation,
    AnimatePresence,
} from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Eye, Edit, Plus, Trash, Printer } from 'lucide-react';
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { useForm } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { SearchableSelect } from '@/components/ui/searchable-select';

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

interface Props {
    orders: Order[];
    spareparts: Sparepart[];
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 100, damping: 12 },
    },
};

export default function SparepartSellPage({ orders = [], spareparts = [] }: Props) {
    const { t } = useLanguage();

    const [viewOrder, setViewOrder] = useState<Order | null>(null);
    const [editOrder, setEditOrder] = useState<Order | null>(null);
    
    const { data: editData, setData: setEditData, put, reset, processing } = useForm({
        customer_name: '',
        customer_phone: '',
        address: '',
        items: [] as { id: number; jumlah: number; harga_satuan: number; nama_sparepart?: string }[],
    });

    const openEdit = (order: Order) => {
        setEditData({
            customer_name: order.customer_name,
            customer_phone: order.customer_phone,
            address: order.address,
            items: order.items.map(i => ({ 
                id: i.id_sparepart, 
                jumlah: i.jumlah, 
                harga_satuan: Number(i.harga_satuan),
                nama_sparepart: i.nama_sparepart 
            })),
        });
        setEditOrder(order);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editOrder) {
            put(`/admin/spareparts/sell/${editOrder.id}`, {
                onSuccess: () => {
                    setEditOrder(null);
                    reset();
                },
            });
        }
    };

    const addItem = () => {
        if (spareparts.length === 0) return;
        const defaultSp = spareparts[0];
        setEditData('items', [...editData.items, { id: defaultSp.id, jumlah: 1, harga_satuan: Number(defaultSp.harga_sparepart), nama_sparepart: defaultSp.nama_sparepart }]);
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
            const sp = spareparts.find(s => s.id === Number(value));
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

    const verifyOrder = (id: number) => {
        if (confirm(t('sell_verify_confirm'))) {
            router.patch(`/admin/spareparts/sell/${id}/verify`);
        }
    };

    const cancelOrder = (id: number) => {
        if (confirm(t('sell_cancel_confirm'))) {
            router.patch(`/admin/spareparts/sell/${id}/cancel`);
        }
    };

    const statusBadge = (status: string) => {
        switch (status) {
            case 'selesai':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-bold text-green-600">
                        <CheckCircle2 className="size-3" />
                        {t('sell_status_selesai')}
                    </span>
                );
            case 'batal':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 text-xs font-bold text-red-600">
                        <XCircle className="size-3" />
                        {t('sell_status_batal')}
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-xs font-bold text-amber-600">
                        <Clock className="size-3" />
                        {t('sell_status_pending')}
                    </span>
                );
        }
    };

    return (
        <LazyMotion features={domAnimation}>
            <Head title={t('sell_page_title')} />

            <m.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="flex flex-col gap-8 p-6 lg:p-8"
            >
                {/* Header */}
                <m.div
                    variants={itemVariants}
                    className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                            {t('sell_page_title').split(' ')[0]}{' '}
                            <span className="text-red-600">
                                {t('sell_page_title')
                                    .split(' ')
                                    .slice(1)
                                    .join(' ')}
                            </span>
                        </h1>
                        <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">
                            {t('sell_page_subtitle')}
                        </p>
                    </div>
                </m.div>

                {/* Orders Table */}
                <m.div
                    variants={itemVariants}
                    className="overflow-hidden rounded-3xl border border-[#1b1b18]/5 bg-white shadow-sm dark:border-white/5 dark:bg-[#121212]"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#1b1b18]/2 dark:bg-white/2">
                                <tr>
                                    <th className="px-6 py-4 font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                        {t('sell_col_id_date')}
                                    </th>
                                    <th className="px-6 py-4 font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                        {t('sell_col_customer')}
                                    </th>
                                    <th className="px-6 py-4 font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                        {t('sell_col_items')}
                                    </th>
                                    <th className="px-6 py-4 font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                        {t('sell_col_total')}
                                    </th>
                                    <th className="px-6 py-4 font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                        {t('sell_col_status')}
                                    </th>
                                    <th className="px-6 py-4 text-right font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                        {t('sell_col_actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1b1b18]/5 dark:divide-white/5">
                                {orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="group transition-colors hover:bg-[#1b1b18]/1 dark:hover:bg-white/1"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-bold">
                                                #{order.id}
                                            </div>
                                            <div className="text-xs text-[#1b1b18]/50 dark:text-white/50">
                                                {new Date(
                                                    order.created_at,
                                                ).toLocaleString('id-ID')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold">
                                                {order.customer_name}
                                            </div>
                                            <div className="text-xs text-[#1b1b18]/50 dark:text-white/50">
                                                {order.customer_phone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <ul className="space-y-1 text-xs">
                                                {order.items.map(
                                                    (item, idx) => (
                                                        <li key={idx}>
                                                            -{' '}
                                                            {
                                                                item.nama_sparepart
                                                            }{' '}
                                                            ({item.jumlah}x)
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </td>
                                        <td className="px-6 py-4 font-bold">
                                            Rp{' '}
                                            {Number(
                                                order.total_harga,
                                            ).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {statusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        setViewOrder(order)
                                                    }
                                                    className="rounded-xl border border-[#1b1b18]/10 px-2 py-1.5 text-xs font-bold text-[#1b1b18]/70 transition-colors hover:bg-[#1b1b18]/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
                                                    title={t(
                                                        'dash_view_details',
                                                    )}
                                                >
                                                    <Eye className="size-4" />
                                                </button>
                                                {order.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                openEdit(order)
                                                            }
                                                            className="rounded-xl border border-blue-500/20 px-2 py-1.5 text-xs font-bold text-blue-500 transition-colors hover:bg-blue-500/10"
                                                            title={t(
                                                                'sell_edit_title',
                                                            )}
                                                        >
                                                            <Edit className="size-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                verifyOrder(
                                                                    order.id,
                                                                )
                                                            }
                                                            className="rounded-xl bg-green-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-green-600"
                                                        >
                                                            {t('sell_verify')}
                                                        </button>
                                                        <button
                                                            onClick={() => cancelOrder(order.id)}
                                                            className="rounded-xl border border-red-500/20 px-3 py-1.5 text-xs font-bold text-red-500 transition-colors hover:bg-red-500/10"
                                                        >
                                                            {t('sell_cancel')}
                                                        </button>
                                                    </>
                                                )}
                                                <a
                                                    href={`/admin/invoice?type=sparepart&id=${order.id}`}
                                                    target="_blank"
                                                    className="flex items-center gap-1 rounded-xl border border-gray-500/20 px-2 py-1.5 text-xs font-bold text-gray-500 transition-colors hover:bg-gray-500/10"
                                                    title="Print Invoice"
                                                >
                                                    <Printer className="size-4" />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-12 text-center text-[#1b1b18]/40 dark:text-white/40"
                                        >
                                            {t('sell_no_orders')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </m.div>
            </m.div>

            {/* View Modal */}
            <Dialog
                open={!!viewOrder}
                onOpenChange={(open: boolean) => !open && setViewOrder(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {t('sell_view_title')} #{viewOrder?.id}
                        </DialogTitle>
                        <DialogDescription>
                            {t('sell_view_desc')}
                        </DialogDescription>
                    </DialogHeader>
                    {viewOrder && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-[10px] font-bold tracking-wider text-[#1b1b18]/50 uppercase dark:text-white/50">
                                        {t('sell_customer_name')}
                                    </p>
                                    <p className="font-bold">
                                        {viewOrder.customer_name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold tracking-wider text-[#1b1b18]/50 uppercase dark:text-white/50">
                                        {t('sell_phone')}
                                    </p>
                                    <p className="font-bold">
                                        {viewOrder.customer_phone}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] font-bold tracking-wider text-[#1b1b18]/50 uppercase dark:text-white/50">
                                        {t('sell_address')}
                                    </p>
                                    <p className="font-bold">
                                        {viewOrder.address}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] font-bold tracking-wider text-[#1b1b18]/50 uppercase dark:text-white/50">
                                        {t('sell_order_items')}
                                    </p>
                                    <ul className="mt-2 divide-y divide-[#1b1b18]/5 border-t border-[#1b1b18]/5 dark:divide-white/5 dark:border-white/5">
                                        {viewOrder.items.map(
                                            (item: OrderItem, idx: number) => (
                                                <li
                                                    key={idx}
                                                    className="flex items-center justify-between py-2"
                                                >
                                                    <span>
                                                        {item.nama_sparepart} x
                                                        {item.jumlah}
                                                    </span>
                                                    <span className="font-bold">
                                                        Rp{' '}
                                                        {(
                                                            item.jumlah *
                                                            Number(
                                                                item.harga_satuan,
                                                            )
                                                        ).toLocaleString(
                                                            'id-ID',
                                                        )}
                                                    </span>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                                <div className="col-span-2 flex items-center justify-between border-t border-[#1b1b18]/5 pt-2 dark:border-white/5">
                                    <p className="text-[10px] font-bold tracking-wider text-[#1b1b18]/50 uppercase dark:text-white/50">
                                        {t('sell_total_price')}
                                    </p>
                                    <p className="text-lg font-black text-red-600">
                                        Rp{' '}
                                        {Number(
                                            viewOrder.total_harga,
                                        ).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog
                open={!!editOrder}
                onOpenChange={(open: boolean) => !open && setEditOrder(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('sell_edit_title')}</DialogTitle>
                        <DialogDescription>
                            {t('sell_edit_desc')}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="space-y-4 py-4">
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
                            
                            <div className="space-y-2">
                                {editData.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className="flex-1 w-full">
                                            <SearchableSelect
                                                value={item.id}
                                                onChange={(val) => updateItem(idx, 'id', val)}
                                                placeholder="Select a sparepart..."
                                                options={spareparts.map(sp => ({
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
                                            onChange={(e) => updateItem(idx, 'jumlah', e.target.value)}
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
                                    Rp {editData.items.reduce((acc, curr) => acc + (curr.jumlah * curr.harga_satuan), 0).toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <button
                                type="button"
                                onClick={() => setEditOrder(null)}
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
                </DialogContent>
            </Dialog>
        </LazyMotion>
    );
}

SparepartSellPage.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Inventory', href: '/admin/inventory' },
        { title: 'Sparepart Orders', href: '/admin/spareparts/sell' },
    ],
};
