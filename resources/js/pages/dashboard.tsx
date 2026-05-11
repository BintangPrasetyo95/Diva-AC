import { Head, Link, router } from '@inertiajs/react';
import { m, Variants, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    Wrench,
    Package,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    Plus,
    Globe,
    Moon,
    Sun,
    MoreHorizontal,
} from 'lucide-react';
import React from 'react';
import { useLanguage } from '@/hooks/use-language';
import { useAppearance } from '@/hooks/use-appearance';

// ── Types ────────────────────────────────────────────────────────────────────
interface RecentService {
    id: number;
    customer: string;
    car: string;
    type: string;
    status: string;
    date: string;
}

interface StockAlert {
    name: string;
    stock: number;
}

interface Props {
    monthlyRevenue: number;
    revenueDelta: number | null;
    activeServices: number;
    urgentServices: number;
    lowStockParts: number;
    outOfStockParts: number;
    newCustomers: number;
    customerDelta: number | null;
    recentServices: RecentService[];
    stockAlerts: StockAlert[];
    isStoreOpen: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatRp(value: number): string {
    if (value >= 1_000_000) return 'Rp ' + (value / 1_000_000).toFixed(1).replace('.', ',') + ' Jt';
    if (value >= 1_000)     return 'Rp ' + (value / 1_000).toFixed(0) + ' Rb';
    return 'Rp ' + value.toLocaleString('id-ID');
}

// ── Animation variants ────────────────────────────────────────────────────────
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 12 } },
};

export default function Dashboard({
    monthlyRevenue,
    revenueDelta,
    activeServices,
    urgentServices,
    lowStockParts,
    outOfStockParts,
    newCustomers,
    customerDelta,
    recentServices,
    stockAlerts,
    isStoreOpen,
}: Props) {
    const { t } = useLanguage();
    const { appearance, updateAppearance } = useAppearance();
    const [showConfirm, setShowConfirm] = React.useState(false);

    const toggleStoreStatus = () => {
        router.post('/admin/store-status', { is_open: !isStoreOpen }, {
            preserveScroll: true,
            onSuccess: () => setShowConfirm(false),
        });
    };

    const stats = [
        {
            name: t('dash_stat_revenue'),
            value: formatRp(monthlyRevenue),
            delta: revenueDelta,
            icon: TrendingUp,
            color: 'text-green-600',
            bg: 'bg-green-500/10',
        },
        {
            name: t('dash_stat_active'),
            value: String(activeServices),
            subtitle: urgentServices > 0 ? `${urgentServices} antri` : null,
            icon: Wrench,
            color: 'text-red-600',
            bg: 'bg-red-500/10',
        },
        {
            name: t('dash_stat_stock'),
            value: String(lowStockParts),
            subtitle: outOfStockParts > 0 ? `${outOfStockParts} habis` : null,
            icon: Package,
            color: 'text-amber-600',
            bg: 'bg-amber-500/10',
        },
        {
            name: t('dash_stat_customers'),
            value: String(newCustomers),
            delta: customerDelta,
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-500/10',
        },
    ];

    const statusColor = (s: string) => {
        if (s === 'selesai') return 'bg-green-500/10 text-green-600';
        if (s === 'antri')   return 'bg-amber-500/10 text-amber-600';
        if (s === 'batal')   return 'bg-red-500/10 text-red-600';
        return 'bg-blue-500/10 text-blue-600'; // proses
    };

    const statusIcon = (s: string) => {
        if (s === 'selesai') return <CheckCircle2 className="size-3" />;
        if (s === 'antri')   return <Clock className="size-3" />;
        if (s === 'batal')   return <AlertCircle className="size-3" />;
        return <Wrench className="size-3" />;
    };

    const statusLabel = (s: string) => {
        if (s === 'selesai') return t('dash_status_completed');
        if (s === 'antri')   return t('dash_status_pending');
        if (s === 'proses')  return t('dash_status_in_progress');
        return s;
    };

    return (
        <LazyMotion features={domAnimation}>
            <Head title={t('dash_title')} />

            <m.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="flex flex-col gap-8 p-6 lg:p-8"
            >
                {/* ── Header ── */}
                <m.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] dark:text-white uppercase">
                            {t('dash_title')} <span className="text-red-600">{t('dash_overview')}</span>
                        </h1>
                        <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">{t('dash_welcome')}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Store Status */}
                        <div className="relative">
                            <AnimatePresence mode="wait">
                                {!showConfirm ? (
                                    <m.button
                                        key="status-btn"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        onClick={() => setShowConfirm(true)}
                                        className={`flex h-10 items-center gap-2 rounded-full px-5 text-xs font-black uppercase tracking-widest transition-all shadow-lg ${
                                            isStoreOpen
                                                ? 'bg-green-500 text-white shadow-green-500/20 hover:bg-green-600'
                                                : 'bg-[#1b1b18] text-white shadow-[#1b1b18]/20 hover:bg-[#2b2b28] dark:bg-white dark:text-black'
                                        }`}
                                    >
                                        <div className={`size-2 rounded-full ${isStoreOpen ? 'bg-white animate-pulse' : 'bg-red-500'}`} />
                                        {isStoreOpen ? t('dash_store_open') : t('dash_store_closed')}
                                    </m.button>
                                ) : (
                                    <m.div
                                        key="confirm-box"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex items-center gap-2 rounded-full bg-[#1b1b18] p-1 dark:bg-white"
                                    >
                                        <span className="px-3 text-[10px] font-bold text-white dark:text-black uppercase">{t('dash_confirm_q')}</span>
                                        <button
                                            onClick={toggleStoreStatus}
                                            className="rounded-full bg-red-600 px-4 py-1.5 text-[10px] font-black text-white hover:bg-red-700"
                                        >
                                            {t('dash_yes')}
                                        </button>
                                        <button
                                            onClick={() => setShowConfirm(false)}
                                            className="px-3 py-1.5 text-[10px] font-black text-white/50 hover:text-white dark:text-black/50 dark:hover:text-black"
                                        >
                                            {t('dash_no')}
                                        </button>
                                    </m.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link
                            href="/admin/services"
                            className="flex h-10 items-center gap-2 rounded-full bg-red-600 px-6 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 active:scale-95"
                        >
                            <Plus className="size-4" />
                            {t('dash_new_service')}
                        </Link>
                    </div>
                </m.div>

                {/* ── Stats Grid ── */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <m.div
                            key={stat.name}
                            variants={itemVariants}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="group relative overflow-hidden rounded-3xl border border-[#1b1b18]/5 bg-white p-6 shadow-sm transition-all hover:shadow-xl dark:border-white/5 dark:bg-[#121212]"
                        >
                            <div className="flex items-center justify-between">
                                <div className={`flex size-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="size-6" />
                                </div>
                                {'delta' in stat && stat.delta !== null && stat.delta !== undefined && (
                                    <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${
                                        stat.delta >= 0 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
                                    }`}>
                                        {stat.delta >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                                        {Math.abs(stat.delta)}%
                                    </span>
                                )}
                            </div>
                            <div className="mt-4">
                                <p className="text-sm font-medium text-[#1b1b18]/50 dark:text-white/50">{stat.name}</p>
                                <h3 className="text-2xl font-black tracking-tight text-[#1b1b18] dark:text-white">{stat.value}</h3>
                                {'subtitle' in stat && stat.subtitle && (
                                    <p className="mt-1 text-xs font-medium text-red-600/70">{stat.subtitle}</p>
                                )}
                            </div>
                            <m.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -right-4 -top-4 size-24 rounded-full bg-red-600/10 blur-3xl"
                            />
                        </m.div>
                    ))}
                </div>

                {/* ── Main Content ── */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Recent Services */}
                    <m.div
                        variants={itemVariants}
                        className="overflow-hidden rounded-3xl border border-[#1b1b18]/5 bg-white shadow-sm dark:border-white/5 dark:bg-[#121212] lg:col-span-2"
                    >
                        <div className="flex items-center justify-between border-b border-[#1b1b18]/5 p-6 dark:border-white/5">
                            <h2 className="text-lg font-black tracking-tight text-[#1b1b18] dark:text-white uppercase">{t('dash_active_orders')}</h2>
                            <Link href="/admin/services" className="text-xs font-bold text-red-600 hover:underline uppercase tracking-widest">
                                {t('dash_view_all')}
                            </Link>
                        </div>

                        {recentServices.length === 0 ? (
                            <div className="flex items-center justify-center py-16 text-sm text-[#1b1b18]/30 dark:text-white/30">
                                Belum ada data service.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#1b1b18]/2 dark:bg-white/2">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('dash_col_customer')}</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('dash_col_car')}</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('dash_col_status')}</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('dash_col_date')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#1b1b18]/5 dark:divide-white/5">
                                        {recentServices.map((svc) => (
                                            <tr key={svc.id} className="group transition-colors hover:bg-[#1b1b18]/1 dark:hover:bg-white/1">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-[#1b1b18] dark:text-white">{svc.customer}</span>
                                                        <span className="text-[10px] text-[#1b1b18]/40 dark:text-white/40">#{svc.id} • {svc.type}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-[#1b1b18]/70 dark:text-white/70">{svc.car}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${statusColor(svc.status)}`}>
                                                        {statusIcon(svc.status)}
                                                        {statusLabel(svc.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-[#1b1b18]/50 dark:text-white/40 whitespace-nowrap">
                                                    {new Date(svc.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </m.div>

                    {/* Stock Alerts */}
                    <m.div
                        variants={itemVariants}
                        className="rounded-3xl border border-[#1b1b18]/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#121212]"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-black tracking-tight text-[#1b1b18] dark:text-white uppercase">{t('dash_stock_alerts')}</h2>
                            <Package className="size-5 text-red-600" />
                        </div>

                        {stockAlerts.length === 0 ? (
                            <div className="flex items-center justify-center py-10 text-sm text-[#1b1b18]/30 dark:text-white/30">
                                Stok aman ✓
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {stockAlerts.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 rounded-2xl bg-[#1b1b18]/2 p-4 dark:bg-white/2">
                                        <div className={`size-2 shrink-0 rounded-full ${item.stock === 0 ? 'bg-red-600' : 'bg-amber-500'}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-sm font-bold text-[#1b1b18] dark:text-white">{item.name}</p>
                                            <p className="text-[10px] text-[#1b1b18]/40 dark:text-white/40">
                                                {item.stock === 0 ? 'Habis' : 'Stok rendah'} • {item.stock} tersisa
                                            </p>
                                        </div>
                                        <Link
                                            href="/admin/inventory"
                                            className="shrink-0 text-[10px] font-bold text-red-600 uppercase hover:underline"
                                        >
                                            {t('dash_order')}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Link
                            href="/admin/inventory"
                            className="mt-8 block w-full rounded-2xl border border-[#1b1b18]/10 py-3 text-center text-sm font-bold text-[#1b1b18]/60 hover:bg-[#1b1b18]/5 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/5 transition-all"
                        >
                            {t('dash_manage_inventory')}
                        </Link>
                    </m.div>
                </div>
            </m.div>
        </LazyMotion>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
    ],
};
