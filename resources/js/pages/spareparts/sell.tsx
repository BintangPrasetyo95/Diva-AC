import { Head, Link, router } from '@inertiajs/react';
import { m, Variants, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import { ShoppingCart, CheckCircle2, XCircle, Clock } from 'lucide-react';
import React from 'react';
import { useLanguage } from '@/hooks/use-language';

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
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 12
        }
    }
};

export default function SparepartSellPage({ orders = [] }: Props) {
    const { t } = useLanguage();

    const verifyOrder = (id: number) => {
        if (confirm('Are you sure you want to verify this order? This will deduct the sparepart stock.')) {
            router.patch(`/admin/spareparts/sell/${id}/verify`);
        }
    };

    const cancelOrder = (id: number) => {
        if (confirm('Are you sure you want to cancel this order?')) {
            router.patch(`/admin/spareparts/sell/${id}/cancel`);
        }
    };

    const statusBadge = (status: string) => {
        switch (status) {
            case 'selesai':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-bold text-green-600">
                        <CheckCircle2 className="size-3" />
                        Selesai
                    </span>
                );
            case 'batal':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 text-xs font-bold text-red-600">
                        <XCircle className="size-3" />
                        Batal
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-xs font-bold text-amber-600">
                        <Clock className="size-3" />
                        Pending
                    </span>
                );
        }
    };

    return (
        <LazyMotion features={domAnimation}>
            <Head title="Penjualan Sparepart" />

            <m.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="flex flex-col gap-8 p-6 lg:p-8"
            >
                {/* Header Section */}
                <m.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] dark:text-white uppercase">
                            Sparepart <span className="text-red-600">Orders</span>
                        </h1>
                        <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">Manage sparepart sales and transactions.</p>
                    </div>
                </m.div>

                {/* Orders List */}
                <m.div variants={itemVariants} className="overflow-hidden rounded-3xl border border-[#1b1b18]/5 bg-white shadow-sm dark:border-white/5 dark:bg-[#121212]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#1b1b18]/2 dark:bg-white/2">
                                <tr>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">ID / Date</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">Customer</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">Items</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">Total</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">Status</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 text-right">Actions</th>
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
                                            {order.status === 'pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => verifyOrder(order.id)}
                                                        className="rounded-xl bg-green-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-green-600"
                                                    >
                                                        Verify
                                                    </button>
                                                    <button 
                                                        onClick={() => cancelOrder(order.id)}
                                                        className="rounded-xl border border-red-500/20 px-3 py-1.5 text-xs font-bold text-red-500 transition-colors hover:bg-red-500/10"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-[#1b1b18]/40 dark:text-white/40">
                                            No sparepart orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </m.div>
            </m.div>
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
