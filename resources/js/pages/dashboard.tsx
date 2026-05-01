import { Head } from '@inertiajs/react';
import { m, Variants, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    Wrench,
    Package,
    Users,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    Plus,
    Search,
    MoreHorizontal,
    Globe,
    Moon,
    Sun
} from 'lucide-react';
import React from 'react';
import { dashboard } from '@/routes';
import { useLanguage } from '@/hooks/use-language';
import { useAppearance } from '@/hooks/use-appearance';

// Mock Data
const stats = [
    { name: 'Monthly Revenue', value: 'Rp 45.200.000', change: '+12.5%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-500/10' },
    { name: 'Active Services', value: '12', subtitle: '3 urgent', icon: Wrench, color: 'text-red-600', bg: 'bg-red-500/10' },
    { name: 'Low Stock Parts', value: '8', subtitle: 'Items < 5', icon: Package, color: 'text-amber-600', bg: 'bg-amber-500/10' },
    { name: 'New Customers', value: '24', change: '+18%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-500/10' },
];

const recentServices = [
    { id: 'SRV-001', customer: 'Budi Santoso', car: 'Toyota Alphard', status: 'In Progress', type: 'Complete AC Service', time: '2h ago' },
    { id: 'SRV-002', customer: 'Ani Wijaya', car: 'Honda CR-V', status: 'Pending', type: 'Freon Refill', time: '4h ago' },
    { id: 'SRV-003', customer: 'Doni Setiawan', car: 'BMW X5', status: 'Completed', type: 'Evaporator Clean', time: 'Yesterday' },
    { id: 'SRV-004', customer: 'Siska Putri', car: 'Mitsubishi Pajero', status: 'In Progress', type: 'Odor Removal', time: 'Yesterday' },
];

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

export default function Dashboard() {
    const { language, setLanguage, t } = useLanguage();
    const { appearance, updateAppearance } = useAppearance();
    const [isStoreOpen, setIsStoreOpen] = React.useState(true);
    const [showConfirm, setShowConfirm] = React.useState(false);

    const translatedStats = [
        { ...stats[0], name: t('dash_stat_revenue') },
        { ...stats[1], name: t('dash_stat_active') },
        { ...stats[2], name: t('dash_stat_stock') },
        { ...stats[3], name: t('dash_stat_customers') },
    ];

    const getStatusText = (status: string) => {
        if (status === 'In Progress') return t('dash_status_in_progress');
        if (status === 'Pending') return t('dash_status_pending');
        if (status === 'Completed') return t('dash_status_completed');
        return status;
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
                {/* Header Section */}
                <m.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] dark:text-white uppercase">
                            {t('dash_title')} <span className="text-red-600">{t('dash_overview')}</span>
                        </h1>
                        <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">{t('dash_welcome')}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Store Status Toggle */}
                        <div className="relative">
                            <AnimatePresence mode="wait">
                                {!showConfirm ? (
                                    <m.button
                                        key="status-btn"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        onClick={() => setShowConfirm(true)}
                                        className={`flex h-10 items-center gap-2 rounded-full px-5 text-xs font-black uppercase tracking-widest transition-all shadow-lg ${isStoreOpen
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
                                            onClick={() => {
                                                setIsStoreOpen(!isStoreOpen);
                                                setShowConfirm(false);
                                            }}
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

                        <button className="flex h-10 items-center gap-2 rounded-full bg-red-600 px-6 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 active:scale-95">
                            <Plus className="size-4" />
                            {t('dash_new_service')}
                        </button>
                    </div>
                </m.div>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {translatedStats.map((stat) => (
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
                                {stat.change && (
                                    <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
                                        <ArrowUpRight className="size-3" />
                                        {stat.change}
                                    </span>
                                )}
                            </div>
                            <div className="mt-4">
                                <p className="text-sm font-medium text-[#1b1b18]/50 dark:text-white/50">{stat.name}</p>
                                <h3 className="text-2xl font-black tracking-tight text-[#1b1b18] dark:text-white">{stat.value}</h3>
                                {stat.subtitle && <p className="mt-1 text-xs font-medium text-red-600/70">{stat.subtitle}</p>}
                            </div>
                            {/* Decorative Floating Element */}
                            <m.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.05, 0.1, 0.05]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute -right-4 -top-4 size-24 rounded-full bg-red-600/10 blur-3xl"
                            />
                        </m.div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Recent Services Table */}
                    <m.div
                        variants={itemVariants}
                        className="overflow-hidden rounded-3xl border border-[#1b1b18]/5 bg-white shadow-sm dark:border-white/5 dark:bg-[#121212] lg:col-span-2"
                    >
                        <div className="flex items-center justify-between border-b border-[#1b1b18]/5 p-6 dark:border-white/5">
                            <h2 className="text-lg font-black tracking-tight text-[#1b1b18] dark:text-white uppercase">{t('dash_active_orders')}</h2>
                            <button className="text-xs font-bold text-red-600 hover:underline uppercase tracking-widest">{t('dash_view_all')}</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#1b1b18]/2 dark:bg-white/2">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('dash_col_customer')}</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('dash_col_car')}</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('dash_col_status')}</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1b1b18]/5 dark:divide-white/5">
                                    {recentServices.map((service) => (
                                        <tr key={service.id} className="group transition-colors hover:bg-[#1b1b18]/1 dark:hover:bg-white/1">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-[#1b1b18] dark:text-white">{service.customer}</span>
                                                    <span className="text-[10px] text-[#1b1b18]/40 dark:text-white/40">{service.id} • {service.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-[#1b1b18]/70 dark:text-white/70">{service.car}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {service.status === 'Completed' ? (
                                                        <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-[10px] font-bold text-green-600">
                                                            <CheckCircle2 className="size-3" />
                                                            {getStatusText(service.status)}
                                                        </span>
                                                    ) : service.status === 'Pending' ? (
                                                        <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-600">
                                                            <Clock className="size-3" />
                                                            {getStatusText(service.status)}
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-1 text-[10px] font-bold text-blue-600">
                                                            <Wrench className="size-3" />
                                                            {getStatusText(service.status)}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="rounded-lg p-2 text-[#1b1b18]/20 hover:bg-[#1b1b18]/5 hover:text-[#1b1b18] dark:text-white/20 dark:hover:bg-white/5 dark:hover:text-white">
                                                    <MoreHorizontal className="size-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </m.div>

                    {/* Inventory Alerts */}
                    <m.div
                        variants={itemVariants}
                        className="rounded-3xl border border-[#1b1b18]/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#121212]"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-black tracking-tight text-[#1b1b18] dark:text-white uppercase">{t('dash_stock_alerts')}</h2>
                            <Package className="size-5 text-red-600" />
                        </div>
                        <div className="flex flex-col gap-4">
                            {[
                                { name: 'Compressor R134a', stock: 2, status: 'Critical' },
                                { name: 'Cabin Filter (Alphard)', stock: 4, status: 'Low' },
                                { name: 'Freon 1kg Can', stock: 0, status: 'Out of Stock' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 rounded-2xl bg-[#1b1b18]/2 p-4 dark:bg-white/2">
                                    <div className={`size-2 rounded-full ${item.stock === 0 ? 'bg-red-600' : 'bg-amber-500'}`} />
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-[#1b1b18] dark:text-white">{item.name}</p>
                                        <p className="text-[10px] text-[#1b1b18]/40 dark:text-white/40">
                                            {item.stock === 0 ? t('dash_out_of_stock') : t('dash_low_stock_alert')} • {item.stock} {t('dash_in_stock')}
                                        </p>
                                    </div>
                                    <button className="text-[10px] font-bold text-red-600 uppercase">{t('dash_order')}</button>
                                </div>
                            ))}
                        </div>
                        <button className="mt-8 w-full rounded-2xl border border-[#1b1b18]/10 py-3 text-sm font-bold text-[#1b1b18]/60 hover:bg-[#1b1b18]/5 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/5 transition-all">
                            {t('dash_manage_inventory')}
                        </button>
                    </m.div>
                </div>
            </m.div>
        </LazyMotion>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};
