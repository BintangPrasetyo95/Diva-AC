import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    m,
    Variants,
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
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

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
    total_service: string | number;
    status_service: 'antri' | 'proses' | 'selesai' | 'batal';
    catatan: string | null;
    mobil: Mobil;
    mekanik: Mekanik;
    spareparts?: any[];
}

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

    const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing');

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            id_mobil: '',
            id_pelanggan: 'new',
            customer_name: '',
            customer_email: '',
            customer_phone: '',
            no_polisi: '',
            merk: '',
            tipe: '',
            warna: '',
            id_mekanik: '',
            tanggal_service: new Date().toISOString().split('T')[0],
            tipe_service: '',
            harga_service: '',
            status_service: 'antri' as 'antri' | 'proses' | 'selesai' | 'batal',
            catatan: '',
            spareparts: [] as any[],
        });

    const openAddModal = () => {
        clearErrors();
        reset();
        setEditingService(null);
        setActiveTab('existing');
        setIsModalOpen(true);
    };

    const openEditModal = (service: Service) => {
        clearErrors();
        setEditingService(service);
        setActiveTab('existing');
        setData({
            id_mobil: service.id_mobil.toString(),
            id_pelanggan: 'new',
            customer_name: '',
            customer_email: '',
            customer_phone: '',
            no_polisi: '',
            merk: '',
            tipe: '',
            warna: '',
            id_mekanik: service.id_mekanik.toString(),
            tanggal_service: service.tanggal_service.split('T')[0],
            tipe_service: service.tipe_service,
            harga_service: service.harga_service.toString(),
            status_service: service.status_service,
            catatan: service.catatan || '',
            spareparts: service.spareparts ? service.spareparts.map(sp => ({
                id: sp.id,
                jumlah: sp.pivot.jumlah,
                harga_satuan: Number(sp.pivot.harga_satuan),
                nama_sparepart: sp.nama_sparepart
            })) : [],
        });
        setIsModalOpen(true);
    };

    const addSparepart = () => {
        if (spareparts.length === 0) return;
        const sp = spareparts[0];
        setData('spareparts', [...data.spareparts, { id: sp.id, jumlah: 1, harga_satuan: Number(sp.harga_sparepart), nama_sparepart: sp.nama_sparepart }]);
    };

    const removeSparepart = (index: number) => {
        const newItems = [...data.spareparts];
        newItems.splice(index, 1);
        setData('spareparts', newItems);
    };

    const updateSparepart = (index: number, field: string, value: any) => {
        const newItems = [...data.spareparts];
        const item = newItems[index];
        if (field === 'id') {
            const sp = spareparts.find(s => s.id === Number(value));
            if (sp) {
                item.id = sp.id;
                item.harga_satuan = Number(sp.harga_sparepart);
                item.nama_sparepart = sp.nama_sparepart;
            }
        } else {
            item[field] = Number(value);
        }
        setData('spareparts', newItems);
    };

    const openDeleteModal = (service: Service) => {
        setDeletingService(service);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingService) {
            put(`/admin/services/${editingService.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success('Service updated successfully');
                    reset();
                },
            });
        } else {
            const url = activeTab === 'new' ? '/admin/services/with-car' : '/admin/services';
            post(url, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsModalOpen(false);
                    toast.success('Service created successfully');
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (!deletingService) return;
        router.delete(`/admin/services/${deletingService.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setDeletingService(null);
                toast.success('Service deleted successfully');
            },
            onError: (err) => {
                toast.error(err.error || 'Failed to delete service');
            },
        });
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
        if (sortConfig.key !== key)
            return (
                <ArrowUpDown className="size-3 opacity-20 transition-opacity group-hover:opacity-50" />
            );
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
                <m.div
                    variants={itemVariants}
                    className="overflow-hidden rounded-3xl border border-[#1b1b18]/5 bg-white shadow-sm dark:border-white/5 dark:bg-[#121212]"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-[#1b1b18]/5 bg-[#1b1b18]/2 dark:border-white/5 dark:bg-white/2">
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
                            </thead>
                            <tbody className="divide-y divide-[#1b1b18]/5 dark:divide-white/5">
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
                                                <span className="text-sm font-black text-[#1b1b18] dark:text-white">
                                                    {formatCurrency(
                                                        service.total_service ||
                                                            0,
                                                    )}
                                                </span>
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
                            </tbody>
                        </table>
                    </div>
                </m.div>
            </m.div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-[#1b1b18]/80 backdrop-blur-sm"
                        />
                        <m.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="custom-scrollbar relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-4xl bg-white p-8 shadow-2xl dark:bg-[#121212]"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                                    {editingService
                                        ? t('dash_edit_order')
                                        : t('dash_new_service')}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-full p-2 text-[#1b1b18]/40 hover:bg-[#1b1b18]/5 dark:text-white/40 dark:hover:bg-white/5"
                                >
                                    <X className="size-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    {!editingService && (
                                        <div className="flex w-full gap-2 rounded-2xl bg-[#1b1b18]/5 p-1 dark:bg-white/5 mb-4">
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('existing')}
                                                className={`flex-1 rounded-xl py-2 text-xs font-bold tracking-widest uppercase transition-all ${activeTab === 'existing' ? 'bg-white text-[#1b1b18] shadow-sm dark:bg-[#121212] dark:text-white' : 'text-[#1b1b18]/40 hover:text-[#1b1b18] dark:text-white/40 dark:hover:text-white'}`}
                                            >
                                                Pilih Existing
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('new')}
                                                className={`flex-1 rounded-xl py-2 text-xs font-bold tracking-widest uppercase transition-all ${activeTab === 'new' ? 'bg-white text-[#1b1b18] shadow-sm dark:bg-[#121212] dark:text-white' : 'text-[#1b1b18]/40 hover:text-[#1b1b18] dark:text-white/40 dark:hover:text-white'}`}
                                            >
                                                + Mobil Baru
                                            </button>
                                        </div>
                                    )}

                                    {activeTab === 'existing' || editingService ? (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                                Pelanggan / Mobil
                                            </label>
                                            <select
                                                value={data.id_mobil}
                                                onChange={(e) =>
                                                    setData(
                                                        'id_mobil',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-12 w-full rounded-2xl border-transparent bg-[#1b1b18]/5 px-4 outline-none focus:ring-2 focus:ring-red-600/50 dark:bg-white/5"
                                                required={activeTab === 'existing' || !!editingService}
                                            >
                                                <option value="" disabled>
                                                    Pilih Mobil
                                                </option>
                                                {mobils.map((m) => (
                                                    <option key={m.id} value={m.id} className="text-black">
                                                        {
                                                            m.pelanggan
                                                                ?.nama_pelanggan
                                                        }{' '}
                                                        - {m.merk} ({m.no_polisi})
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.id_mobil && (
                                                <span className="text-xs text-red-600">
                                                    {errors.id_mobil}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-4 rounded-2xl border border-red-600/20 bg-red-600/5 p-4">
                                            <h3 className="text-sm font-bold text-red-600 uppercase">Input Kendaraan & Pelanggan Baru</h3>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">Pelanggan</label>
                                                <select
                                                    value={data.id_pelanggan}
                                                    onChange={(e) => setData('id_pelanggan', e.target.value)}
                                                    className="h-12 w-full rounded-2xl border-transparent bg-white px-4 outline-none focus:ring-2 focus:ring-red-600/50 dark:bg-[#121212]"
                                                    required={activeTab === 'new'}
                                                >
                                                    <option value="new" className="font-bold text-red-600">+ Pelanggan Baru</option>
                                                    {users.map(u => (
                                                        <option key={u.id} value={u.id} className="text-black">{u.name} ({u.email})</option>
                                                    ))}
                                                </select>
                                                {errors.id_pelanggan && <span className="text-xs text-red-600">{errors.id_pelanggan}</span>}
                                            </div>

                                            {data.id_pelanggan === 'new' && (
                                                <>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <Input
                                                            placeholder="Nama Pelanggan Baru"
                                                            value={data.customer_name}
                                                            onChange={e => setData('customer_name', e.target.value)}
                                                            className="h-12 bg-white dark:bg-[#121212]"
                                                            required={activeTab === 'new' && data.id_pelanggan === 'new'}
                                                        />
                                                        <Input
                                                            type="email"
                                                            placeholder="Email Pelanggan"
                                                            value={data.customer_email}
                                                            onChange={e => setData('customer_email', e.target.value)}
                                                            className="h-12 bg-white dark:bg-[#121212]"
                                                            required={activeTab === 'new' && data.id_pelanggan === 'new'}
                                                        />
                                                    </div>
                                                    <Input
                                                        placeholder="No. WhatsApp / Telepon"
                                                        value={data.customer_phone}
                                                        onChange={e => setData('customer_phone', e.target.value)}
                                                        className="h-12 bg-white dark:bg-[#121212]"
                                                    />
                                                </>
                                            )}

                                            <div className="grid grid-cols-2 gap-4 border-t border-red-600/20 pt-4">
                                                <Input
                                                    placeholder="No Polisi (Mis. B 1234 CD)"
                                                    value={data.no_polisi}
                                                    onChange={e => setData('no_polisi', e.target.value)}
                                                    className="h-12 bg-white dark:bg-[#121212]"
                                                    required={activeTab === 'new'}
                                                />
                                                <Input
                                                    placeholder="Merk (Mis. Toyota)"
                                                    value={data.merk}
                                                    onChange={e => setData('merk', e.target.value)}
                                                    className="h-12 bg-white dark:bg-[#121212]"
                                                    required={activeTab === 'new'}
                                                />
                                                <Input
                                                    placeholder="Tipe (Mis. Avanza)"
                                                    value={data.tipe}
                                                    onChange={e => setData('tipe', e.target.value)}
                                                    className="h-12 bg-white dark:bg-[#121212]"
                                                    required={activeTab === 'new'}
                                                />
                                                <Input
                                                    placeholder="Warna (Opsional)"
                                                    value={data.warna}
                                                    onChange={e => setData('warna', e.target.value)}
                                                    className="h-12 bg-white dark:bg-[#121212]"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                            Mekanik
                                        </label>
                                        <select
                                            value={data.id_mekanik}
                                            onChange={(e) =>
                                                setData(
                                                    'id_mekanik',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-12 w-full rounded-2xl border-transparent bg-[#1b1b18]/5 px-4 outline-none focus:ring-2 focus:ring-red-600/50 dark:bg-white/5"
                                            required
                                        >
                                            <option value="" disabled>
                                                Pilih Mekanik
                                            </option>
                                            {mekaniks.map((m) => (
                                                <option key={m.id} value={m.id}>
                                                    {m.nama_mekanik}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.id_mekanik && (
                                            <span className="text-xs text-red-600">
                                                {errors.id_mekanik}
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                                Tipe Service
                                            </label>
                                            <Input
                                                value={data.tipe_service}
                                                onChange={(e) =>
                                                    setData(
                                                        'tipe_service',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                                required
                                            />
                                            {errors.tipe_service && (
                                                <span className="text-xs text-red-600">
                                                    {errors.tipe_service}
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                                Harga Jasa Service
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={data.harga_service}
                                                onChange={(e) =>
                                                    setData(
                                                        'harga_service',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                                required
                                            />
                                            {errors.harga_service && (
                                                <span className="text-xs text-red-600">
                                                    {errors.harga_service}
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                                Tanggal Service
                                            </label>
                                            <Input
                                                type="date"
                                                value={data.tanggal_service}
                                                onChange={(e) =>
                                                    setData(
                                                        'tanggal_service',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                                required
                                            />
                                            {errors.tanggal_service && (
                                                <span className="text-xs text-red-600">
                                                    {errors.tanggal_service}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                            Status
                                        </label>
                                        <select
                                            value={data.status_service}
                                            onChange={(e) =>
                                                setData(
                                                    'status_service',
                                                    e.target.value as any,
                                                )
                                            }
                                            className="h-12 w-full rounded-2xl border-transparent bg-[#1b1b18]/5 px-4 outline-none focus:ring-2 focus:ring-red-600/50 dark:bg-white/5"
                                            required
                                        >
                                            <option value="antri">
                                                {t('dash_service_queue')}
                                            </option>
                                            <option value="proses">
                                                {t('dash_service_process')}
                                            </option>
                                            <option value="selesai">
                                                {t('dash_service_done')}
                                            </option>
                                            <option value="batal">
                                                {t('dash_service_cancel')}
                                            </option>
                                        </select>
                                        {errors.status_service && (
                                            <span className="text-xs text-red-600">
                                                {errors.status_service}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                            Catatan Tambahan
                                        </label>
                                        <Input
                                            value={data.catatan}
                                            onChange={(e) =>
                                                setData(
                                                    'catatan',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                            placeholder="Opsional"
                                        />
                                        {errors.catatan && (
                                            <span className="text-xs text-red-600">
                                                {errors.catatan}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 rounded-2xl border border-[#1b1b18]/10 p-4 dark:border-white/10">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                            Penggunaan Sparepart
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addSparepart}
                                            className="flex items-center gap-1 rounded-lg bg-[#1b1b18]/5 px-2 py-1 text-xs font-bold text-[#1b1b18] hover:bg-[#1b1b18]/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                                        >
                                            <PlusCircle className="size-3" /> Tambah Part
                                        </button>
                                    </div>

                                    {data.spareparts.map((sp, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <select
                                                value={sp.id}
                                                onChange={(e) => updateSparepart(idx, 'id', e.target.value)}
                                                className="h-10 w-full rounded-xl border-transparent bg-[#1b1b18]/5 px-3 text-sm outline-none focus:ring-2 focus:ring-red-600/50 dark:bg-white/5"
                                            >
                                                {spareparts.map((part) => (
                                                    <option key={part.id} value={part.id} className="text-black">
                                                        {part.nama_sparepart} - Rp {Number(part.harga_sparepart).toLocaleString('id-ID')}
                                                    </option>
                                                ))}
                                            </select>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={sp.jumlah}
                                                onChange={(e) => updateSparepart(idx, 'jumlah', e.target.value)}
                                                className="h-10 w-20 rounded-xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeSparepart(idx)}
                                                className="rounded-lg p-2 text-red-500 hover:bg-red-500/10"
                                            >
                                                <Trash className="size-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {data.spareparts.length === 0 && (
                                        <div className="text-center text-xs text-[#1b1b18]/40 dark:text-white/40">
                                            Belum ada sparepart yang ditambahkan
                                        </div>
                                    )}
                                </div>

                                <button
                                    disabled={processing}
                                    className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#1b1b18] text-sm font-black tracking-widest text-white uppercase shadow-xl transition-all hover:bg-black disabled:opacity-50 dark:bg-white dark:text-[#1b1b18]"
                                >
                                    {processing ? (
                                        <Loader2 className="size-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Wrench className="size-5" />
                                            {t('dash_save_changes')}
                                        </>
                                    )}
                                </button>
                            </form>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="absolute inset-0 bg-[#1b1b18]/80 backdrop-blur-sm"
                        />
                        <m.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md overflow-hidden rounded-4xl bg-white p-8 text-center shadow-2xl dark:bg-[#121212]"
                        >
                            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-red-600/10">
                                <AlertTriangle className="size-8 text-red-600" />
                            </div>
                            <h2 className="mb-2 text-2xl font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                                {t('dash_confirm_q')}
                            </h2>
                            <p className="mb-8 text-sm text-[#1b1b18]/60 dark:text-white/60">
                                You are about to delete service{' '}
                                <span className="font-bold text-[#1b1b18] dark:text-white">
                                    SRV-{deletingService?.id}
                                </span>
                                . This action cannot be undone. Note: Cannot
                                delete a service that already has spareparts
                                attached. Cancel it instead.
                            </p>
                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    className="h-12 flex-1 rounded-2xl text-[10px] font-bold tracking-widest uppercase"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                >
                                    {t('dash_no')}
                                </Button>
                                <Button
                                    className="h-12 flex-1 rounded-2xl bg-red-600 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg shadow-red-600/20 hover:bg-red-700"
                                    onClick={handleDelete}
                                >
                                    {t('dash_yes')}
                                </Button>
                            </div>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>
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
