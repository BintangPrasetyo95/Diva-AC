import { Head, Link, useForm, router } from '@inertiajs/react';
import type {
    Variants
} from 'framer-motion';
import {
    m,
    LazyMotion,
    domAnimation,
    AnimatePresence,
} from 'framer-motion';
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
    Car,
    X,
    Loader2,
    AlertTriangle,
    PlusCircle,
    Trash,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import {
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableHead,
    DataTableHeaderCell,
    DataTableInner,
} from '@/components/ui/DataTable';
import { useLanguage } from '@/hooks/use-language';
import { downloadInvoicePdf } from '@/lib/downloadInvoice';

interface Customer {
    id: number;
    nama_pelanggan: string;
}

interface Mobil {
    id: number;
    merk: string;
    no_polisi: string;
    pelanggan: Customer;
}

interface Mekanik {
    id: number;
    nama_mekanik: string;
}

interface Service {
    id: number;
    id_mobil: number;
    id_mekanik: number;
    tanggal_service: string;
    tipe_service: string;
    harga_service: string | number;
    bayar_service?: string | number;
    total_service: string | number;
    status_service: 'antri' | 'proses' | 'selesai' | 'batal';
    catatan: string | null;
    mobil: Mobil;
    mekanik: Mekanik;
    spareparts?: any[];
}

import { ServiceFormModal } from '@/components/admin/services/ServiceFormModal';
import { ServiceDeleteModal } from '@/components/admin/services/ServiceDeleteModal';
import { ServicePaymentModal } from '@/components/admin/services/ServicePaymentModal';

interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
}

interface Sparepart {
    id: number;
    nama_sparepart: string;
    harga_sparepart: string;
    stock_sparepart: number;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 12,
        },
    },
};

export default function ServicesPage({
    services,
    mobils,
    mekaniks,
    spareparts,
    users,
}: {
    services: Service[];
    mobils: Mobil[];
    mekaniks: Mekanik[];
    spareparts: Sparepart[];
    users: User[];
}) {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('All');
    const [sortConfig, setSortConfig] = React.useState<{
        key: string;
        direction: 'asc' | 'desc';
    }>({ key: 'date', direction: 'desc' });

    // Modal State
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingService, setEditingService] = React.useState<Service | null>(
        null,
    );
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [deletingService, setDeletingService] =
        React.useState<Service | null>(null);

    const openAddModal = () => {
        setEditingService(null);
        setIsModalOpen(true);
    };

    const openEditModal = (service: Service) => {
        setEditingService(service);
        setIsModalOpen(true);
    };

    const openDeleteModal = (service: Service) => {
        setDeletingService(service);
        setIsDeleteModalOpen(true);
    };

    const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
    const [payingService, setPayingService] = React.useState<Service | null>(null);

    const openPayModal = (service: Service) => {
        setPayingService(service);
        setIsPaymentModalOpen(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'selesai':
                return (
                    <Badge
                        variant="outline"
                        className="gap-1 border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-green-600 uppercase"
                    >
                        <CheckCircle2 className="size-3" />
                        {t('dash_service_done')}
                    </Badge>
                );
            case 'antri':
                return (
                    <Badge
                        variant="outline"
                        className="gap-1 border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-amber-600 uppercase"
                    >
                        <Clock className="size-3" />
                        {t('dash_service_queue')}
                    </Badge>
                );
            case 'batal':
                return (
                    <Badge
                        variant="outline"
                        className="gap-1 border-transparent bg-[#1b1b18]/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-[#1b1b18]/50 uppercase"
                    >
                        <X className="size-3" />
                        {t('dash_service_cancel')}
                    </Badge>
                );
            case 'proses':
            default:
                return (
                    <Badge
                        variant="outline"
                        className="gap-1 border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-blue-600 uppercase"
                    >
                        <Wrench className="size-3" />
                        {t('dash_service_process')}
                    </Badge>
                );
        }
    };

    const stats = {
        total: services.length,
        pending: services.filter((s) => s.status_service === 'antri').length,
        inProgress: services.filter((s) => s.status_service === 'proses')
            .length,
        completed: services.filter((s) => s.status_service === 'selesai')
            .length,
    };

    const filteredServices = services
        .filter((s) => {
            const matchesSearch =
                (s.mobil?.pelanggan?.nama_pelanggan || '')
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                (s.mobil?.no_polisi || '')
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                String(s.id || '')
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            const matchesStatus =
                statusFilter === 'All' || s.status_service === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            const direction = sortConfig.direction === 'asc' ? 1 : -1;

            if (sortConfig.key === 'date') {
                return (
                    (new Date(a.tanggal_service).getTime() -
                        new Date(b.tanggal_service).getTime()) *
                    direction
                );
            }

            if (sortConfig.key === 'customer') {
                const nameA = a.mobil?.pelanggan?.nama_pelanggan || '';
                const nameB = b.mobil?.pelanggan?.nama_pelanggan || '';

                return nameA.localeCompare(nameB) * direction;
            }

            if (sortConfig.key === 'id') {
                return (a.id - b.id) * direction;
            }

            if (sortConfig.key === 'car') {
                const carA = a.mobil?.no_polisi || '';
                const carB = b.mobil?.no_polisi || '';

                return carA.localeCompare(carB) * direction;
            }

            if (sortConfig.key === 'mechanic') {
                const mekA = a.mekanik?.nama_mekanik || '';
                const mekB = b.mekanik?.nama_mekanik || '';

                return mekA.localeCompare(mekB) * direction;
            }

            if (sortConfig.key === 'status') {
                return (
                    a.status_service.localeCompare(b.status_service) * direction
                );
            }

            if (sortConfig.key === 'total') {
                const totalA = Number(a.total_service);
                const totalB = Number(b.total_service);

                return (totalA - totalB) * direction;
            }

            return 0;
        });

    const handleSort = (key: string) => {
        setSortConfig((current) => ({
            key,
            direction:
                current.key === key && current.direction === 'asc'
                    ? 'desc'
                    : 'asc',
        }));
    };

    const getSortIcon = (key: string) => {
        if (sortConfig.key !== key) {
            return (
                <ArrowUpDown className="size-3 opacity-20 transition-opacity group-hover:opacity-50" />
            );
        }

        return sortConfig.direction === 'asc' ? (
            <ArrowUpDown className="size-3 text-red-600" />
        ) : (
            <ArrowUpDown className="size-3 rotate-180 text-red-600 transition-transform" />
        );
    };

    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(Number(amount));
    };

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
                <m.div
                    variants={itemVariants}
                    className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                            {t('dash_stat_active')}{' '}
                            <span className="text-red-600">
                                {t('dash_management')}
                            </span>
                        </h1>
                        <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">
                            {t('dash_services_desc')}
                        </p>
                    </div>

                    <Button
                        onClick={openAddModal}
                        className="h-12 rounded-2xl bg-red-600 px-6 text-xs font-bold tracking-widest text-white uppercase shadow-lg shadow-red-600/20 transition-all hover:scale-105 hover:bg-red-700 active:scale-95"
                    >
                        <Plus className="mr-2 size-4" />
                        {t('dash_new_service')}
                    </Button>
                </m.div>

                {/* Stats Cards */}
                <m.div
                    variants={itemVariants}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                    <div className="flex items-center gap-4 rounded-3xl border border-[#1b1b18]/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#121212]">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                            <Wrench className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                {t('dash_total_services')}
                            </p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">
                                {stats.total}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-3xl border border-[#1b1b18]/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#121212]">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                            <Clock className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                {t('dash_service_queue')}
                            </p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">
                                {stats.pending}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-3xl border border-[#1b1b18]/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#121212]">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600">
                            <Wrench className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                {t('dash_service_process')}
                            </p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">
                                {stats.inProgress}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-3xl border border-[#1b1b18]/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#121212]">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-600">
                            <CheckCircle2 className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                {t('dash_service_done')}
                            </p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">
                                {stats.completed}
                            </p>
                        </div>
                    </div>
                </m.div>

                {/* Filters & Search */}
                <m.div
                    variants={itemVariants}
                    className="flex flex-col justify-between gap-4 rounded-3xl border border-[#1b1b18]/5 bg-white p-4 shadow-sm md:flex-row md:items-center dark:border-white/5 dark:bg-[#121212]"
                >
                    <div className="relative w-full md:w-96">
                        <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#1b1b18]/30 dark:text-white/30" />
                        <Input
                            placeholder={t('dash_search')}
                            className="h-12 rounded-2xl border-none bg-[#1b1b18]/2 pl-11 focus-visible:ring-1 focus-visible:ring-red-600/50 dark:bg-white/2"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-12 rounded-2xl border-[#1b1b18]/10 px-5 text-[10px] font-bold tracking-widest uppercase dark:border-white/10"
                                >
                                    <Filter className="mr-2 size-3" />
                                    {t('dash_filter')}:{' '}
                                    {statusFilter === 'All'
                                        ? t('dash_filter_all')
                                        : t(
                                            `dash_service_${statusFilter === 'antri' ? 'queue' : statusFilter === 'proses' ? 'process' : statusFilter === 'selesai' ? 'done' : 'cancel'}`,
                                        )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-48 rounded-2xl border-[#1b1b18]/5 shadow-xl dark:border-white/5"
                            >
                                <DropdownMenuItem
                                    onClick={() => setStatusFilter('All')}
                                    className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase"
                                >
                                    {t('dash_filter_all')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setStatusFilter('antri')}
                                    className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase"
                                >
                                    {t('dash_service_queue')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setStatusFilter('proses')}
                                    className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase"
                                >
                                    {t('dash_service_process')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setStatusFilter('selesai')}
                                    className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase"
                                >
                                    {t('dash_service_done')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setStatusFilter('batal')}
                                    className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase"
                                >
                                    {t('dash_service_cancel')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-12 rounded-2xl border-[#1b1b18]/10 px-5 text-[10px] font-bold tracking-widest uppercase dark:border-white/10"
                                >
                                    <ArrowUpDown className="mr-2 size-3" />
                                    {t('dash_sort')}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-48 rounded-2xl border-[#1b1b18]/5 shadow-xl dark:border-white/5"
                            >
                                <DropdownMenuItem
                                    onClick={() =>
                                        setSortConfig({
                                            key: 'date',
                                            direction: 'desc',
                                        })
                                    }
                                    className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase"
                                >
                                    {t('dash_sort_date')} ({t('dash_newest')})
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        setSortConfig({
                                            key: 'date',
                                            direction: 'asc',
                                        })
                                    }
                                    className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase"
                                >
                                    {t('dash_sort_date')} ({t('dash_oldest')})
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        setSortConfig({
                                            key: 'customer',
                                            direction: 'asc',
                                        })
                                    }
                                    className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase"
                                >
                                    {t('dash_sort_name')} (A-Z)
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        setSortConfig({
                                            key: 'customer',
                                            direction: 'desc',
                                        })
                                    }
                                    className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase"
                                >
                                    {t('dash_sort_name')} (Z-A)
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        setSortConfig({
                                            key: 'id',
                                            direction: 'desc',
                                        })
                                    }
                                    className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase"
                                >
                                    {t('dash_sort_id')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </m.div>

                {/* Services Table */}
                <m.div variants={itemVariants}>
                    <DataTable>
                        <DataTableInner>
                            <table className="w-full text-left">
                                <DataTableHead>
                                    <tr>
                                        <th
                                            onClick={() => handleSort('id')}
                                            className="group cursor-pointer px-6 py-5 text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase transition-colors hover:bg-[#1b1b18]/5 dark:text-white/40"
                                        >
                                            <div className="flex items-center gap-2">
                                                {t('dash_col_id')}
                                                {getSortIcon('id')}
                                            </div>
                                        </th>
                                        <th
                                            onClick={() => handleSort('customer')}
                                            className="group cursor-pointer px-6 py-5 text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase transition-colors hover:bg-[#1b1b18]/5 dark:text-white/40"
                                        >
                                            <div className="flex items-center gap-2">
                                                {t('dash_col_customer')}
                                                {getSortIcon('customer')}
                                            </div>
                                        </th>
                                        <th
                                            onClick={() => handleSort('car')}
                                            className="group cursor-pointer px-6 py-5 text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase transition-colors hover:bg-[#1b1b18]/5 dark:text-white/40"
                                        >
                                            <div className="flex items-center gap-2">
                                                {t('dash_col_car')}
                                                {getSortIcon('car')}
                                            </div>
                                        </th>
                                        <th
                                            onClick={() => handleSort('mechanic')}
                                            className="group cursor-pointer px-6 py-5 text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase transition-colors hover:bg-[#1b1b18]/5 dark:text-white/40"
                                        >
                                            <div className="flex items-center gap-2">
                                                {t('dash_col_mechanic')}
                                                {getSortIcon('mechanic')}
                                            </div>
                                        </th>
                                        <th
                                            onClick={() => handleSort('status')}
                                            className="group cursor-pointer px-6 py-5 text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase transition-colors hover:bg-[#1b1b18]/5 dark:text-white/40"
                                        >
                                            <div className="flex items-center gap-2">
                                                {t('dash_col_status')}
                                                {getSortIcon('status')}
                                            </div>
                                        </th>
                                        <th
                                            onClick={() => handleSort('date')}
                                            className="group cursor-pointer px-6 py-5 text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase transition-colors hover:bg-[#1b1b18]/5 dark:text-white/40"
                                        >
                                            <div className="flex items-center gap-2">
                                                {t('dash_col_date')}
                                                {getSortIcon('date')}
                                            </div>
                                        </th>
                                        <th
                                            onClick={() => handleSort('total')}
                                            className="group cursor-pointer px-6 py-5 text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase transition-colors hover:bg-[#1b1b18]/5 dark:text-white/40"
                                        >
                                            <div className="flex items-center gap-2">
                                                {t('dash_col_total')}
                                                {getSortIcon('total')}
                                            </div>
                                        </th>
                                        <th className="px-6 py-5 text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40"></th>
                                    </tr>
                                </DataTableHead>
                                <DataTableBody>
                                    {filteredServices.length > 0 ? (
                                        filteredServices.map((service) => (
                                            <tr
                                                key={service.id}
                                                className="group transition-colors hover:bg-[#1b1b18]/1 dark:hover:bg-white/1"
                                            >
                                                <td className="px-6 py-5">
                                                    <span className="font-mono text-xs font-bold text-[#1b1b18]/40 transition-colors group-hover:text-red-600 dark:text-white/40">
                                                        SRV-{service.id}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-8 items-center justify-center rounded-full bg-[#1b1b18]/5 dark:bg-white/5">
                                                            <User className="size-4 text-[#1b1b18]/50 dark:text-white/50" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm leading-tight font-bold text-[#1b1b18] dark:text-white">
                                                                {
                                                                    service.mobil
                                                                        ?.pelanggan
                                                                        ?.nama_pelanggan
                                                                }
                                                            </span>
                                                            <span className="text-[10px] tracking-wider text-[#1b1b18]/40 uppercase dark:text-white/40">
                                                                {
                                                                    service.tipe_service
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 text-[#1b1b18]/70 dark:text-white/70">
                                                        <Car className="size-3" />
                                                        <span className="text-sm">
                                                            {service.mobil?.merk} (
                                                            {
                                                                service.mobil
                                                                    ?.no_polisi
                                                            }
                                                            )
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-sm font-medium text-[#1b1b18]/60 italic dark:text-white/60">
                                                        {
                                                            service.mekanik
                                                                ?.nama_mekanik
                                                        }
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {getStatusBadge(
                                                        service.status_service,
                                                    )}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 text-[#1b1b18]/70 dark:text-white/70">
                                                        <Calendar className="size-3" />
                                                        <span className="text-sm whitespace-nowrap">
                                                            {new Date(
                                                                service.tanggal_service,
                                                            ).toLocaleDateString(
                                                                'id-ID',
                                                                {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                },
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-black text-[#1b1b18] dark:text-white">
                                                            {formatCurrency(
                                                                service.total_service || 0,
                                                            )}
                                                        </span>
                                                        {Number(service.bayar_service) > 0 ? (
                                                            <span className="text-[10px] font-bold tracking-widest uppercase text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full w-fit">
                                                                {t('dash_paid') || 'PAID'}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] font-bold tracking-widest uppercase text-red-600 bg-red-500/10 px-2 py-0.5 rounded-full w-fit">
                                                                {t('dash_unpaid') || 'UNPAID'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <button className="rounded-lg p-2 text-[#1b1b18]/20 transition-all hover:bg-[#1b1b18]/5 hover:text-[#1b1b18] dark:text-white/20 dark:hover:bg-white/5 dark:hover:text-white">
                                                                <MoreHorizontal className="size-4" />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-48 rounded-2xl border-[#1b1b18]/5 shadow-xl dark:border-white/5"
                                                        >
                                                            <DropdownMenuItem
                                                                asChild
                                                                className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase focus:bg-red-600 focus:text-white"
                                                            >
                                                                <Link
                                                                    href={`/admin/services/${service.id}`}
                                                                >
                                                                    {t(
                                                                        'dash_view_details',
                                                                    )}
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        service,
                                                                    )
                                                                }
                                                                className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase focus:bg-red-600 focus:text-white"
                                                            >
                                                                {t(
                                                                    'dash_edit_order',
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    openPayModal(
                                                                        service,
                                                                    )
                                                                }
                                                                className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase focus:bg-green-600 focus:text-white text-green-600"
                                                            >
                                                                Bayar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    openDeleteModal(
                                                                        service,
                                                                    )
                                                                }
                                                                className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest text-red-600 uppercase focus:bg-red-600 focus:text-white"
                                                            >
                                                                {t(
                                                                    'dash_cancel_service',
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                asChild
                                                                className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase focus:bg-gray-600 focus:text-white"
                                                            >
                                                                <a href={`/admin/invoice?type=service&id=${service.id}`} target="_blank">
                                                                    Print Invoice
                                                                </a>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase focus:bg-gray-600 focus:text-white"
                                                                onSelect={(e) => {
                                                                    e.preventDefault();
                                                                    toast.loading('Generating PDF...', { id: `pdf-${service.id}` });
                                                                    downloadInvoicePdf('service', service).then(() => {
                                                                        toast.success('Invoice downloaded successfully!', { id: `pdf-${service.id}` });
                                                                    }).catch((err) => {
                                                                        console.error("PDF Error:", err);
                                                                        toast.error('Failed to generate PDF', { id: `pdf-${service.id}` });
                                                                    });
                                                                }}
                                                            >
                                                                Download Invoice
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase focus:bg-gray-600 focus:text-white"
                                                                onSelect={(e) => {
                                                                    e.preventDefault();
                                                                    toast.loading('Preparing PDF for sharing...', { id: `share-${service.id}` });
                                                                    import('@/lib/downloadInvoice').then(({ shareInvoicePdf }) => {
                                                                        shareInvoicePdf('service', service).then(() => {
                                                                            toast.success('Ready to share!', { id: `share-${service.id}` });
                                                                        }).catch((err) => {
                                                                            console.error("Share Error:", err);
                                                                            toast.error(err.message || 'Failed to share PDF', { id: `share-${service.id}` });
                                                                        });
                                                                    });
                                                                }}
                                                            >
                                                                Share Invoice
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="px-6 py-20 text-center"
                                            >
                                                <div className="flex flex-col items-center gap-2 opacity-20">
                                                    <Wrench className="size-12" />
                                                    <p className="text-lg font-black tracking-tighter uppercase">
                                                        {t('dash_no_services')}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </DataTableBody>
                            </table>
                        </DataTableInner>
                    </DataTable>
                </m.div>
            </m.div>

            <ServiceFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingService(null);
                }}
                editingService={editingService}
                mobils={mobils}
                mekaniks={mekaniks}
                spareparts={spareparts}
                users={users}
            />

            <ServiceDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeletingService(null);
                }}
                deletingService={deletingService}
            />
            <ServicePaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => {
                    setIsPaymentModalOpen(false);
                    setPayingService(null);
                }}
                payingService={payingService}
            />
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
