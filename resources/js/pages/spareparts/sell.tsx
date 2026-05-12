import { Head, router } from '@inertiajs/react';
import { m, Variants, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Eye, Edit } from 'lucide-react';
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

interface OrderItem {
    nama_sparepart: string;
    jumlah: number;
    harga_satuan: string;
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
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100, damping: 12 }
    }
};

export default function SparepartSellPage({ orders = [] }: Props) {
    const { t } = useLanguage();

    const [viewOrder, setViewOrder] = useState<Order | null>(null);
    const [editOrder, setEditOrder] = useState<Order | null>(null);
    const [editData, setEditData] = useState({
        customer_name: '',
        customer_phone: '',
        address: ''
    });

    const openEdit = (order: Order) => {
        setEditData({
            customer_name: order.customer_name,
            customer_phone: order.customer_phone,
            address: order.address
        });
        setEditOrder(order);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editOrder) {
            router.put(`/admin/spareparts/sell/${editOrder.id}`, editData, {
                onSuccess: () => setEditOrder(null),
            });
        }
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
                <m.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] dark:text-white uppercase">
                            {t('sell_page_title').split(' ')[0]} <span className="text-red-600">{t('sell_page_title').split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">{t('sell_page_subtitle')}</p>
                    </div>
                </m.div>

                {/* Orders Table */}
                <m.div variants={itemVariants} className="overflow-hidden rounded-3xl border border-[#1b1b18]/5 bg-white shadow-sm dark:border-white/5 dark:bg-[#121212]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#1b1b18]/2 dark:bg-white/2">
                                <tr>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('sell_col_id_date')}</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('sell_col_customer')}</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('sell_col_items')}</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('sell_col_total')}</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('sell_col_status')}</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 text-right">{t('sell_col_actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1b1b18]/5 dark:divide-white/5">
                                {orders.map((order) => (
                                    <tr key={order.id} className="group transition-colors hover:bg-[#1b1b18]/1 dark:hover:bg-white/1">
                                        <td className="px-6 py-4">
                                            <div className="font-bold">#{order.id}</div>
                                            <div className="text-xs text-[#1b1b18]/50 dark:text-white/50">{new Date(order.created_at).toLocaleString('id-ID')}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold">{order.customer_name}</div>
                                            <div className="text-xs text-[#1b1b18]/50 dark:text-white/50">{order.customer_phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <ul className="text-xs space-y-1">
                                                {order.items.map((item, idx) => (
                                                    <li key={idx}>- {item.nama_sparepart} ({item.jumlah}x)</li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="px-6 py-4 font-bold">
                                            Rp {Number(order.total_harga).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {statusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setViewOrder(order)}
                                                    className="rounded-xl border border-[#1b1b18]/10 px-2 py-1.5 text-xs font-bold text-[#1b1b18]/70 transition-colors hover:bg-[#1b1b18]/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
                                                    title={t('dash_view_details')}
                                                >
                                                    <Eye className="size-4" />
                                                </button>
                                                {order.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => openEdit(order)}
                                                            className="rounded-xl border border-blue-500/20 px-2 py-1.5 text-xs font-bold text-blue-500 transition-colors hover:bg-blue-500/10"
                                                            title={t('sell_edit_title')}
                                                        >
                                                            <Edit className="size-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => verifyOrder(order.id)}
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
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-[#1b1b18]/40 dark:text-white/40">
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
            <Dialog open={!!viewOrder} onOpenChange={(open: boolean) => !open && setViewOrder(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('sell_view_title')} #{viewOrder?.id}</DialogTitle>
                        <DialogDescription>{t('sell_view_desc')}</DialogDescription>
                    </DialogHeader>
                    {viewOrder && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-bold text-[#1b1b18]/50 dark:text-white/50 uppercase text-[10px] tracking-wider">{t('sell_customer_name')}</p>
                                    <p className="font-bold">{viewOrder.customer_name}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-[#1b1b18]/50 dark:text-white/50 uppercase text-[10px] tracking-wider">{t('sell_phone')}</p>
                                    <p className="font-bold">{viewOrder.customer_phone}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="font-bold text-[#1b1b18]/50 dark:text-white/50 uppercase text-[10px] tracking-wider">{t('sell_address')}</p>
                                    <p className="font-bold">{viewOrder.address}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="font-bold text-[#1b1b18]/50 dark:text-white/50 uppercase text-[10px] tracking-wider">{t('sell_order_items')}</p>
                                    <ul className="mt-2 divide-y divide-[#1b1b18]/5 dark:divide-white/5 border-t border-[#1b1b18]/5 dark:border-white/5">
                                        {viewOrder.items.map((item: OrderItem, idx: number) => (
                                            <li key={idx} className="py-2 flex justify-between items-center">
                                                <span>{item.nama_sparepart} x{item.jumlah}</span>
                                                <span className="font-bold">Rp {(item.jumlah * Number(item.harga_satuan)).toLocaleString('id-ID')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="col-span-2 flex justify-between items-center pt-2 border-t border-[#1b1b18]/5 dark:border-white/5">
                                    <p className="font-bold text-[#1b1b18]/50 dark:text-white/50 uppercase text-[10px] tracking-wider">{t('sell_total_price')}</p>
                                    <p className="font-black text-red-600 text-lg">Rp {Number(viewOrder.total_harga).toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={!!editOrder} onOpenChange={(open: boolean) => !open && setEditOrder(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t('sell_edit_title')}</DialogTitle>
                        <DialogDescription>{t('sell_edit_desc')}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#1b1b18]/70 dark:text-white/70">{t('sell_name_label')}</label>
                            <input
                                required
                                value={editData.customer_name}
                                onChange={e => setEditData({...editData, customer_name: e.target.value})}
                                className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-2 text-sm text-[#1b1b18] focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 dark:border-white/20 dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#1b1b18]/70 dark:text-white/70">{t('sell_phone')}</label>
                            <input
                                required
                                value={editData.customer_phone}
                                onChange={e => setEditData({...editData, customer_phone: e.target.value})}
                                className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-2 text-sm text-[#1b1b18] focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 dark:border-white/20 dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#1b1b18]/70 dark:text-white/70">{t('sell_address')}</label>
                            <textarea
                                required
                                rows={3}
                                value={editData.address}
                                onChange={e => setEditData({...editData, address: e.target.value})}
                                className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-2 text-sm text-[#1b1b18] focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 dark:border-white/20 dark:text-white"
                            />
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
                                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700"
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
