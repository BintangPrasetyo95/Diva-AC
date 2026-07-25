import { Head, router } from '@inertiajs/react';
import type {
    Variants
} from 'framer-motion';
import {
    m,
    LazyMotion,
    domAnimation,
} from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Eye, Edit, Printer, Download, Share2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/hooks/use-language';
import {
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableHead,
    DataTableHeaderCell,
    DataTableInner,
} from '@/components/ui/DataTable';
import { OrderViewModal } from '@/components/admin/spareparts/OrderViewModal';
import { OrderEditModal } from '@/components/admin/spareparts/OrderEditModal';
import { downloadInvoicePdf } from '@/lib/downloadInvoice';

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

    const openEdit = (order: Order) => {
        setEditOrder(order);
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
                <m.div variants={itemVariants}>
                    <DataTable>
                        <DataTableInner>
                            <table className="w-full text-left text-sm">
                                <DataTableHead className="bg-[#1b1b18]/2 dark:bg-white/2">
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
                                </DataTableHead>
                                <DataTableBody>
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
                                                    <button
                                                        onClick={async () => {
                                                            toast.loading('Generating PDF...', { id: `pdf-${order.id}` });
                                                            try {
                                                                await downloadInvoicePdf('sparepart', order);
                                                                toast.success('Invoice downloaded successfully!', { id: `pdf-${order.id}` });
                                                            } catch (err) {
                                                                toast.error('Failed to generate PDF', { id: `pdf-${order.id}` });
                                                            }
                                                        }}
                                                        className="flex items-center gap-1 rounded-xl border border-gray-500/20 px-2 py-1.5 text-xs font-bold text-gray-500 transition-colors hover:bg-gray-500/10"
                                                        title="Download Invoice"
                                                    >
                                                        <Download className="size-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            toast.loading('Preparing PDF for sharing...', { id: `share-${order.id}` });
                                                            import('@/lib/downloadInvoice').then(({ shareInvoicePdf }) => {
                                                                shareInvoicePdf('sparepart', order).then(() => {
                                                                    toast.success('Ready to share!', { id: `share-${order.id}` });
                                                                }).catch((err) => {
                                                                    console.error("Share Error:", err);
                                                                    toast.error(err.message || 'Failed to share PDF', { id: `share-${order.id}` });
                                                                });
                                                            });
                                                        }}
                                                        className="flex items-center gap-1 rounded-xl border border-gray-500/20 px-2 py-1.5 text-xs font-bold text-gray-500 transition-colors hover:bg-gray-500/10"
                                                        title="Share Invoice"
                                                    >
                                                        <Share2 className="size-4" />
                                                    </button>
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
                                </DataTableBody>
                            </table>
                        </DataTableInner>
                    </DataTable>
                </m.div>
            </m.div>            <OrderViewModal
                isOpen={!!viewOrder}
                onClose={() => setViewOrder(null)}
                order={viewOrder}
            />

            <OrderEditModal
                isOpen={!!editOrder}
                onClose={() => setEditOrder(null)}
                order={editOrder}
                spareparts={spareparts}
            />
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
