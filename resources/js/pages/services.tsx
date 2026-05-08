import { Head, Link, useForm, router } from '@inertiajs/react';
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
    Car,
    X,
    Loader2,
    AlertTriangle
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
    DropdownMenuSeparator
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

export default function ServicesPage({ services, mobils, mekaniks }: { services: Service[], mobils: Mobil[], mekaniks: Mekanik[] }) {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('All');
    const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });

    // Modal State
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingService, setEditingService] = React.useState<Service | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [deletingService, setDeletingService] = React.useState<Service | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        id_mobil: '',
        id_mekanik: '',
        tanggal_service: new Date().toISOString().split('T')[0],
        tipe_service: '',
        status_service: 'antri' as 'antri' | 'proses' | 'selesai' | 'batal',
        catatan: '',
    });

    const openAddModal = () => {
        clearErrors();
        reset();
        setEditingService(null);
        setIsModalOpen(true);
    };

    const openEditModal = (service: Service) => {
        clearErrors();
        setEditingService(service);
        setData({
            id_mobil: service.id_mobil.toString(),
            id_mekanik: service.id_mekanik.toString(),
            tanggal_service: service.tanggal_service.split('T')[0],
            tipe_service: service.tipe_service,
            status_service: service.status_service,
            catatan: service.catatan || '',
        });
        setIsModalOpen(true);
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
            post('/admin/services', {
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
            }
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'selesai':
                return (
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 gap-1 px-2 py-0.5 font-bold uppercase tracking-widest text-[9px]">
                        <CheckCircle2 className="size-3" />
                        {t('dash_service_done')}
                    </Badge>
                );
            case 'antri':
                return (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1 px-2 py-0.5 font-bold uppercase tracking-widest text-[9px]">
                        <Clock className="size-3" />
                        {t('dash_service_queue')}
                    </Badge>
                );
            case 'batal':
                return (
                    <Badge variant="outline" className="bg-[#1b1b18]/10 text-[#1b1b18]/50 border-transparent gap-1 px-2 py-0.5 font-bold uppercase tracking-widest text-[9px]">
                        <X className="size-3" />
                        {t('dash_service_cancel')}
                    </Badge>
                );
            case 'proses':
            default:
                return (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 gap-1 px-2 py-0.5 font-bold uppercase tracking-widest text-[9px]">
                        <Wrench className="size-3" />
                        {t('dash_service_process')}
                    </Badge>
                );
        }
    };

    const stats = {
        total: services.length,
        pending: services.filter(s => s.status_service === 'antri').length,
        inProgress: services.filter(s => s.status_service === 'proses').length,
        completed: services.filter(s => s.status_service === 'selesai').length,
    };

    const filteredServices = services
        .filter(s => {
            const matchesSearch = (s.mobil?.pelanggan?.nama_pelanggan || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 (s.mobil?.no_polisi || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 String(s.id || '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All' || s.status_service === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            const direction = sortConfig.direction === 'asc' ? 1 : -1;
            if (sortConfig.key === 'date') {
                return (new Date(a.tanggal_service).getTime() - new Date(b.tanggal_service).getTime()) * direction;
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
                return a.status_service.localeCompare(b.status_service) * direction;
            }
            if (sortConfig.key === 'total') {
                const totalA = Number(a.total_service);
                const totalB = Number(b.total_service);
                return (totalA - totalB) * direction;
            }
            return 0;
        });

    const handleSort = (key: string) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const getSortIcon = (key: string) => {
        if (sortConfig.key !== key) return <ArrowUpDown className="size-3 opacity-20 group-hover:opacity-50 transition-opacity" />;
        return sortConfig.direction === 'asc' 
            ? <ArrowUpDown className="size-3 text-red-600" /> 
            : <ArrowUpDown className="size-3 text-red-600 rotate-180 transition-transform" />;
    };

    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(amount));
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
                <m.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] dark:text-white uppercase">
                            {t('dash_stat_active')} <span className="text-red-600">{t('dash_management')}</span>
                        </h1>
                        <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">{t('dash_services_desc')}</p>
                    </div>

                    <Button onClick={openAddModal} className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-6 h-12 font-bold uppercase tracking-widest text-xs shadow-lg shadow-red-600/20 transition-all hover:scale-105 active:scale-95">
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
                            <p className="text-xs font-bold text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-widest">{t('dash_service_queue')}</p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">{stats.pending}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-[#1b1b18]/5 dark:border-white/5 shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600">
                            <Wrench className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-widest">{t('dash_service_process')}</p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">{stats.inProgress}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-[#1b1b18]/5 dark:border-white/5 shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600">
                            <CheckCircle2 className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-widest">{t('dash_service_done')}</p>
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
                                    {t('dash_filter')}: {statusFilter === 'All' ? t('dash_filter_all') : t(`dash_service_${statusFilter === 'antri' ? 'queue' : statusFilter === 'proses' ? 'process' : statusFilter === 'selesai' ? 'done' : 'cancel'}`)}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-2xl border-[#1b1b18]/5 dark:border-white/5 shadow-xl">
                                <DropdownMenuItem onClick={() => setStatusFilter('All')} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_filter_all')}</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('antri')} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_service_queue')}</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('proses')} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_service_process')}</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('selesai')} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_service_done')}</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('batal')} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_service_cancel')}</DropdownMenuItem>
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
                                <DropdownMenuItem onClick={() => setSortConfig({ key: 'id', direction: 'desc' })} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_sort_id')}</DropdownMenuItem>
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
                                    <th 
                                        onClick={() => handleSort('id')}
                                        className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 cursor-pointer group hover:bg-[#1b1b18]/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {t('dash_col_id')}
                                            {getSortIcon('id')}
                                        </div>
                                    </th>
                                    <th 
                                        onClick={() => handleSort('customer')}
                                        className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 cursor-pointer group hover:bg-[#1b1b18]/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {t('dash_col_customer')}
                                            {getSortIcon('customer')}
                                        </div>
                                    </th>
                                    <th 
                                        onClick={() => handleSort('car')}
                                        className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 cursor-pointer group hover:bg-[#1b1b18]/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {t('dash_col_car')}
                                            {getSortIcon('car')}
                                        </div>
                                    </th>
                                    <th 
                                        onClick={() => handleSort('mechanic')}
                                        className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 cursor-pointer group hover:bg-[#1b1b18]/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {t('dash_col_mechanic')}
                                            {getSortIcon('mechanic')}
                                        </div>
                                    </th>
                                    <th 
                                        onClick={() => handleSort('status')}
                                        className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 cursor-pointer group hover:bg-[#1b1b18]/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {t('dash_col_status')}
                                            {getSortIcon('status')}
                                        </div>
                                    </th>
                                    <th 
                                        onClick={() => handleSort('date')}
                                        className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 cursor-pointer group hover:bg-[#1b1b18]/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {t('dash_col_date')}
                                            {getSortIcon('date')}
                                        </div>
                                    </th>
                                    <th 
                                        onClick={() => handleSort('total')}
                                        className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 cursor-pointer group hover:bg-[#1b1b18]/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {t('dash_col_total')}
                                            {getSortIcon('total')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1b1b18]/5 dark:divide-white/5">
                                {filteredServices.length > 0 ? filteredServices.map((service) => (
                                    <tr key={service.id} className="group transition-colors hover:bg-[#1b1b18]/1 dark:hover:bg-white/1">
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-mono font-bold text-[#1b1b18]/40 dark:text-white/40 group-hover:text-red-600 transition-colors">SRV-{service.id}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-[#1b1b18]/5 dark:bg-white/5 flex items-center justify-center">
                                                    <User className="size-4 text-[#1b1b18]/50 dark:text-white/50" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-[#1b1b18] dark:text-white leading-tight">{service.mobil?.pelanggan?.nama_pelanggan}</span>
                                                    <span className="text-[10px] text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-wider">{service.tipe_service}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-[#1b1b18]/70 dark:text-white/70">
                                                <Car className="size-3" />
                                                <span className="text-sm">{service.mobil?.merk} ({service.mobil?.no_polisi})</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-medium text-[#1b1b18]/60 dark:text-white/60 italic">{service.mekanik?.nama_mekanik}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            {getStatusBadge(service.status_service)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-[#1b1b18]/70 dark:text-white/70">
                                                <Calendar className="size-3" />
                                                <span className="text-sm whitespace-nowrap">{new Date(service.tanggal_service).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-black text-[#1b1b18] dark:text-white">{formatCurrency(service.total_service || 0)}</span>
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
                                                    <DropdownMenuItem onClick={() => openEditModal(service)} className="rounded-xl focus:bg-red-600 focus:text-white font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_edit_order')}</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => openDeleteModal(service)} className="rounded-xl focus:bg-red-600 focus:text-white font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer text-red-600">{t('dash_cancel_service')}</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-20 text-center">
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
                            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-4xl bg-white p-8 shadow-2xl dark:bg-[#121212] custom-scrollbar"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-black uppercase tracking-tight text-[#1b1b18] dark:text-white">
                                    {editingService ? t('dash_edit_order') : t('dash_new_service')}
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
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Pelanggan / Mobil</label>
                                        <select 
                                            value={data.id_mobil}
                                            onChange={e => setData('id_mobil', e.target.value)}
                                            className="w-full rounded-2xl h-12 px-4 bg-[#1b1b18]/5 dark:bg-white/5 border-transparent outline-none focus:ring-2 focus:ring-red-600/50"
                                            required
                                        >
                                            <option value="" disabled>Pilih Mobil</option>
                                            {mobils.map(m => (
                                                <option key={m.id} value={m.id}>{m.pelanggan?.nama_pelanggan} - {m.merk} ({m.no_polisi})</option>
                                            ))}
                                        </select>
                                        {errors.id_mobil && <span className="text-xs text-red-600">{errors.id_mobil}</span>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Mekanik</label>
                                        <select 
                                            value={data.id_mekanik}
                                            onChange={e => setData('id_mekanik', e.target.value)}
                                            className="w-full rounded-2xl h-12 px-4 bg-[#1b1b18]/5 dark:bg-white/5 border-transparent outline-none focus:ring-2 focus:ring-red-600/50"
                                            required
                                        >
                                            <option value="" disabled>Pilih Mekanik</option>
                                            {mekaniks.map(m => (
                                                <option key={m.id} value={m.id}>{m.nama_mekanik}</option>
                                            ))}
                                        </select>
                                        {errors.id_mekanik && <span className="text-xs text-red-600">{errors.id_mekanik}</span>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Tipe Service</label>
                                            <Input 
                                                value={data.tipe_service}
                                                onChange={e => setData('tipe_service', e.target.value)}
                                                className="rounded-2xl h-12 bg-[#1b1b18]/5 dark:bg-white/5 border-transparent"
                                                required
                                            />
                                            {errors.tipe_service && <span className="text-xs text-red-600">{errors.tipe_service}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Tanggal Service</label>
                                            <Input 
                                                type="date"
                                                value={data.tanggal_service}
                                                onChange={e => setData('tanggal_service', e.target.value)}
                                                className="rounded-2xl h-12 bg-[#1b1b18]/5 dark:bg-white/5 border-transparent"
                                                required
                                            />
                                            {errors.tanggal_service && <span className="text-xs text-red-600">{errors.tanggal_service}</span>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Status</label>
                                        <select 
                                            value={data.status_service}
                                            onChange={e => setData('status_service', e.target.value as any)}
                                            className="w-full rounded-2xl h-12 px-4 bg-[#1b1b18]/5 dark:bg-white/5 border-transparent outline-none focus:ring-2 focus:ring-red-600/50"
                                            required
                                        >
                                            <option value="antri">{t('dash_service_queue')}</option>
                                            <option value="proses">{t('dash_service_process')}</option>
                                            <option value="selesai">{t('dash_service_done')}</option>
                                            <option value="batal">{t('dash_service_cancel')}</option>
                                        </select>
                                        {errors.status_service && <span className="text-xs text-red-600">{errors.status_service}</span>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Catatan Tambahan</label>
                                        <Input 
                                            value={data.catatan}
                                            onChange={e => setData('catatan', e.target.value)}
                                            className="rounded-2xl h-12 bg-[#1b1b18]/5 dark:bg-white/5 border-transparent"
                                            placeholder="Opsional"
                                        />
                                        {errors.catatan && <span className="text-xs text-red-600">{errors.catatan}</span>}
                                    </div>
                                </div>

                                <button 
                                    disabled={processing}
                                    className="flex w-full h-14 items-center justify-center gap-2 rounded-2xl bg-[#1b1b18] text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-black dark:bg-white dark:text-[#1b1b18] disabled:opacity-50"
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
                            className="relative w-full max-w-md overflow-hidden rounded-4xl bg-white p-8 shadow-2xl dark:bg-[#121212] text-center"
                        >
                            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-600/10 mb-6">
                                <AlertTriangle className="size-8 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight text-[#1b1b18] dark:text-white mb-2">
                                {t('dash_confirm_q')}
                            </h2>
                            <p className="text-sm text-[#1b1b18]/60 dark:text-white/60 mb-8">
                                You are about to delete service <span className="font-bold text-[#1b1b18] dark:text-white">SRV-{deletingService?.id}</span>. This action cannot be undone. 
                                Note: Cannot delete a service that already has spareparts attached. Cancel it instead.
                            </p>
                            <div className="flex gap-4">
                                <Button 
                                    variant="outline" 
                                    className="flex-1 rounded-2xl h-12 font-bold uppercase tracking-widest text-[10px]"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                >
                                    {t('dash_no')}
                                </Button>
                                <Button 
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-2xl h-12 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-red-600/20"
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
