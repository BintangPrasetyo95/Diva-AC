import { Head, Link } from '@inertiajs/react';

import { m, Variants, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import {
    Wrench,
    Plus,
    Search,
    MoreHorizontal,
    Clock,
    CheckCircle2,
    Calendar,
    Filter,
    ArrowUpDown,
    User,
    Car
} from 'lucide-react';
import React from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock Data for Services
const services = [
    { id: 'SRV-001', customer: 'Budi Santoso', car: 'Toyota Alphard', status: 'In Progress', type: 'Complete AC Service', date: '2026-05-01', total: 'Rp 1.200.000', mechanic: 'Agus' },
    { id: 'SRV-002', customer: 'Ani Wijaya', car: 'Honda CR-V', status: 'Pending', type: 'Freon Refill', date: '2026-05-01', total: 'Rp 350.000', mechanic: 'Bambang' },
    { id: 'SRV-003', customer: 'Doni Setiawan', car: 'BMW X5', status: 'Completed', type: 'Evaporator Clean', date: '2026-04-30', total: 'Rp 2.500.000', mechanic: 'Agus' },
    { id: 'SRV-004', customer: 'Siska Putri', car: 'Mitsubishi Pajero', status: 'In Progress', type: 'Odor Removal', date: '2026-04-30', total: 'Rp 450.000', mechanic: 'Dedi' },
    { id: 'SRV-005', customer: 'Rudi Hermawan', car: 'Suzuki Ertiga', status: 'Completed', type: 'General Checkup', date: '2026-04-29', total: 'Rp 150.000', mechanic: 'Bambang' },
    { id: 'SRV-006', customer: 'Maya Sari', car: 'Toyota Avanza', status: 'Pending', type: 'Magnetic Clutch Replace', date: '2026-04-29', total: 'Rp 850.000', mechanic: 'Dedi' },
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

export default function ServicesPage() {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('All');
    const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Completed':
                return (
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 gap-1 px-2 py-0.5 font-bold uppercase tracking-widest text-[9px]">
                        <CheckCircle2 className="size-3" />
                        {t('dash_status_completed')}
                    </Badge>
                );
            case 'Pending':
                return (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1 px-2 py-0.5 font-bold uppercase tracking-widest text-[9px]">
                        <Clock className="size-3" />
                        {t('dash_status_pending')}
                    </Badge>
                );
            case 'In Progress':
            default:
                return (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 gap-1 px-2 py-0.5 font-bold uppercase tracking-widest text-[9px]">
                        <Wrench className="size-3" />
                        {t('dash_status_in_progress')}
                    </Badge>
                );
        }
    };

    const stats = {
        total: services.length,
        pending: services.filter(s => s.status === 'Pending').length,
        inProgress: services.filter(s => s.status === 'In Progress').length,
        completed: services.filter(s => s.status === 'Completed').length,
    };

    const filteredServices = services
        .filter(s => {
            const matchesSearch = s.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 s.car.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 s.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            const direction = sortConfig.direction === 'asc' ? 1 : -1;
            if (sortConfig.key === 'date') {
                return (new Date(a.date).getTime() - new Date(b.date).getTime()) * direction;
            }
            if (sortConfig.key === 'customer') {
                return a.customer.localeCompare(b.customer) * direction;
            }
            if (sortConfig.key === 'id') {
                return a.id.localeCompare(b.id) * direction;
            }
            return 0;
        });

    return (
        <LazyMotion features={domAnimation}>
            <Head title={t('dash_stat_active')} />

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
                            {t('dash_stat_active')} <span className="text-red-600">{t('dash_management')}</span>
                        </h1>
                        <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">{t('dash_services_desc')}</p>
                    </div>

                    <Button className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-6 h-12 font-bold uppercase tracking-widest text-xs shadow-lg shadow-red-600/20 transition-all hover:scale-105 active:scale-95">
                        <Plus className="mr-2 size-4" />
                        {t('dash_new_service')}
                    </Button>
                </m.div>

                {/* Stats Cards */}
                <m.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-[#1b1b18]/5 dark:border-white/5 shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                            <Wrench className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-widest">{t('dash_total_services')}</p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">{stats.total}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-[#1b1b18]/5 dark:border-white/5 shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                            <Clock className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-widest">{t('dash_status_pending')}</p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">{stats.pending}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-[#1b1b18]/5 dark:border-white/5 shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600">
                            <Wrench className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-widest">{t('dash_status_in_progress')}</p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">{stats.inProgress}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-[#1b1b18]/5 dark:border-white/5 shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600">
                            <CheckCircle2 className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-widest">{t('dash_status_completed')}</p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">{stats.completed}</p>
                        </div>
                    </div>
                </m.div>

                {/* Filters & Search */}
                <m.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center justify-between bg-white dark:bg-[#121212] p-4 rounded-3xl border border-[#1b1b18]/5 dark:border-white/5 shadow-sm">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#1b1b18]/30 dark:text-white/30" />
                        <Input 
                            placeholder={t('dash_search')} 
                            className="pl-11 h-12 bg-[#1b1b18]/2 dark:bg-white/2 border-none rounded-2xl focus-visible:ring-1 focus-visible:ring-red-600/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="rounded-2xl h-12 px-5 border-[#1b1b18]/10 dark:border-white/10 font-bold uppercase tracking-widest text-[10px]">
                                    <Filter className="mr-2 size-3" />
                                    {t('dash_filter')}: {statusFilter === 'All' ? t('dash_filter_all') : t(`dash_status_${statusFilter.toLowerCase().replace(' ', '_')}`)}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-2xl border-[#1b1b18]/5 dark:border-white/5 shadow-xl">
                                <DropdownMenuItem onClick={() => setStatusFilter('All')} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_filter_all')}</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('Pending')} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_status_pending')}</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('In Progress')} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_status_in_progress')}</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('Completed')} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_status_completed')}</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="rounded-2xl h-12 px-5 border-[#1b1b18]/10 dark:border-white/10 font-bold uppercase tracking-widest text-[10px]">
                                    <ArrowUpDown className="mr-2 size-3" />
                                    {t('dash_sort')}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-2xl border-[#1b1b18]/5 dark:border-white/5 shadow-xl">
                                <DropdownMenuItem onClick={() => setSortConfig({ key: 'date', direction: 'desc' })} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_sort_date')} ({t('dash_newest')})</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortConfig({ key: 'date', direction: 'asc' })} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_sort_date')} ({t('dash_oldest')})</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortConfig({ key: 'customer', direction: 'asc' })} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_sort_name')} (A-Z)</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortConfig({ key: 'customer', direction: 'desc' })} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_sort_name')} (Z-A)</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortConfig({ key: 'id', direction: 'asc' })} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_sort_id')}</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </m.div>

                {/* Services Table */}
                <m.div variants={itemVariants} className="overflow-hidden rounded-3xl border border-[#1b1b18]/5 bg-white shadow-sm dark:border-white/5 dark:bg-[#121212]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#1b1b18]/2 dark:bg-white/2 border-b border-[#1b1b18]/5 dark:border-white/5">
                                <tr>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('dash_col_id')}</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('dash_col_customer')}</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('dash_col_car')}</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('dash_col_mechanic')}</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('dash_col_status')}</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('dash_col_total')}</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1b1b18]/5 dark:divide-white/5">
                                {filteredServices.length > 0 ? filteredServices.map((service) => (
                                    <tr key={service.id} className="group transition-colors hover:bg-[#1b1b18]/1 dark:hover:bg-white/1">
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-mono font-bold text-[#1b1b18]/40 dark:text-white/40 group-hover:text-red-600 transition-colors">{service.id}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-[#1b1b18]/5 dark:bg-white/5 flex items-center justify-center">
                                                    <User className="size-4 text-[#1b1b18]/50 dark:text-white/50" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-[#1b1b18] dark:text-white leading-tight">{service.customer}</span>
                                                    <span className="text-[10px] text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-wider">{service.type}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-[#1b1b18]/70 dark:text-white/70">
                                                <Car className="size-3" />
                                                <span className="text-sm">{service.car}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-medium text-[#1b1b18]/60 dark:text-white/60 italic">{service.mechanic}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            {getStatusBadge(service.status)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-black text-[#1b1b18] dark:text-white">{service.total}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="rounded-lg p-2 text-[#1b1b18]/20 hover:bg-[#1b1b18]/5 hover:text-[#1b1b18] dark:text-white/20 dark:hover:bg-white/5 dark:hover:text-white transition-all">
                                                        <MoreHorizontal className="size-4" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-2xl border-[#1b1b18]/5 dark:border-white/5 shadow-xl">
                                                    <DropdownMenuItem asChild className="rounded-xl focus:bg-red-600 focus:text-white font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">
                                                        <Link href={`/admin/services/${service.id}`}>{t('dash_view_details')}</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl focus:bg-red-600 focus:text-white font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_edit_order')}</DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl focus:bg-red-600 focus:text-white font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer text-red-600">{t('dash_cancel_service')}</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-2 opacity-20">
                                                <Wrench className="size-12" />
                                                <p className="text-lg font-black uppercase tracking-tighter">{t('dash_no_services')}</p>
                                            </div>
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

ServicesPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Services',
            href: '/admin/services',
        },
    ],
};
