import { Head, useForm, router } from '@inertiajs/react';
import { m, Variants, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import {
    Users,
    Plus,
    Search,
    MoreHorizontal,
    Phone,
    Mail,
    MapPin,
    Car,
    Edit3,
    Trash2,
    Filter,
    ArrowUpDown,
    UserPlus,
    Calendar,
    User,
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
import { Label } from '@/components/ui/label';

interface Mobil {
    id: number;
    id_pelanggan: number;
    merk: string;
    model: string | null;
    tahun: number | null;
    no_polisi: string;
    warna: string | null;
    keterangan: string | null;
}

interface Customer {
    id: number;
    nama_pelanggan: string;
    no_telp: string;
    email: string;
    jenis_kelamin: 'L' | 'P';
    alamat: string;
    tanggal_daftar: string;
    mobils: Mobil[];
    created_at?: string;
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

export default function CustomersPage({ customers }: { customers: Customer[] }) {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [genderFilter, setGenderFilter] = React.useState('All');
    const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'joined', direction: 'desc' });

    // Modals state
    const [isCustomerModalOpen, setIsCustomerModalOpen] = React.useState(false);
    const [editingCustomer, setEditingCustomer] = React.useState<Customer | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [deletingCustomer, setDeletingCustomer] = React.useState<Customer | null>(null);
    const [isCarModalOpen, setIsCarModalOpen] = React.useState(false);
    const [targetCustomerForCar, setTargetCustomerForCar] = React.useState<Customer | null>(null);

    // Customer Form
    const { data: customerData, setData: setCustomerData, post: postCustomer, put: putCustomer, processing: processingCustomer, errors: customerErrors, reset: resetCustomer, clearErrors: clearCustomerErrors } = useForm({
        nama_pelanggan: '',
        no_telp: '',
        email: '',
        jenis_kelamin: 'L' as 'L' | 'P',
        alamat: '',
    });

    // Car Form
    const { data: carData, setData: setCarData, post: postCar, processing: processingCar, errors: carErrors, reset: resetCar, clearErrors: clearCarErrors } = useForm({
        merk: '',
        model: '',
        tahun: '',
        no_polisi: '',
        warna: '',
        keterangan: '',
    });

    // Helpers
    const openAddCustomerModal = () => {
        clearCustomerErrors();
        resetCustomer();
        setEditingCustomer(null);
        setIsCustomerModalOpen(true);
    };

    const openEditCustomerModal = (customer: Customer) => {
        clearCustomerErrors();
        setEditingCustomer(customer);
        setCustomerData({
            nama_pelanggan: customer.nama_pelanggan,
            no_telp: customer.no_telp,
            email: customer.email,
            jenis_kelamin: customer.jenis_kelamin,
            alamat: customer.alamat,
        });
        setIsCustomerModalOpen(true);
    };

    const openDeleteModal = (customer: Customer) => {
        setDeletingCustomer(customer);
        setIsDeleteModalOpen(true);
    };

    const openAddCarModal = (customer: Customer) => {
        clearCarErrors();
        resetCar();
        setTargetCustomerForCar(customer);
        setIsCarModalOpen(true);
    };

    // Submits
    const handleCustomerSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCustomer) {
            putCustomer(`/admin/customers/${editingCustomer.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsCustomerModalOpen(false);
                    toast.success('Customer updated successfully');
                    resetCustomer();
                },
            });
        } else {
            postCustomer('/admin/customers', {
                preserveScroll: true,
                onSuccess: () => {
                    setIsCustomerModalOpen(false);
                    toast.success('Customer added successfully');
                    resetCustomer();
                },
            });
        }
    };

    const handleCarSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetCustomerForCar) return;
        postCar(`/admin/customers/${targetCustomerForCar.id}/mobils`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsCarModalOpen(false);
                toast.success('Car added successfully');
                resetCar();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingCustomer) return;
        router.delete(`/admin/customers/${deletingCustomer.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setDeletingCustomer(null);
                toast.success('Customer deleted successfully');
            },
            onError: (err) => {
                toast.error(err.error || 'Failed to delete customer');
            }
        });
    };

    const filteredCustomers = customers
        .filter(c => {
            const matchesSearch = c.nama_pelanggan.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 c.no_telp.includes(searchQuery) ||
                                 c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 String(c.id).toLowerCase().includes(searchQuery.toLowerCase());
            const matchesGender = genderFilter === 'All' || c.jenis_kelamin === genderFilter;
            return matchesSearch && matchesGender;
        })
        .sort((a, b) => {
            const direction = sortConfig.direction === 'asc' ? 1 : -1;
            if (sortConfig.key === 'joined') {
                const dateA = new Date(a.created_at || a.tanggal_daftar).getTime();
                const dateB = new Date(b.created_at || b.tanggal_daftar).getTime();
                return (dateA - dateB) * direction;
            }
            if (sortConfig.key === 'name') {
                return a.nama_pelanggan.localeCompare(b.nama_pelanggan) * direction;
            }
            if (sortConfig.key === 'id') {
                return (a.id - b.id) * direction;
            }
            if (sortConfig.key === 'cars') {
                return (a.mobils.length - b.mobils.length) * direction;
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

    const totalCustomers = customers.length;
    const totalVehicles = customers.reduce((sum, c) => sum + c.mobils.length, 0);
    // Rough estimation of new this month
    const newThisMonth = customers.filter(c => {
        const d = new Date(c.created_at || c.tanggal_daftar);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    return (
        <LazyMotion features={domAnimation}>
            <Head title={t('dash_stat_customers')} />

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
                            {t('dash_stat_customers')} <span className="text-red-600">{t('dash_database')}</span>
                        </h1>
                        <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">{t('dash_customers_desc')}</p>
                    </div>

                    <div className="flex gap-3">
                        <Button onClick={openAddCustomerModal} className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-6 h-12 font-bold uppercase tracking-widest text-xs shadow-lg shadow-red-600/20 transition-all hover:scale-105 active:scale-95">
                            <UserPlus className="mr-2 size-4" />
                            {t('dash_add_customer')}
                        </Button>
                    </div>
                </m.div>

                {/* Stats Summary */}
                <m.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-[#1b1b18]/5 dark:border-white/5 shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                            <Users className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-widest">{t('dash_stat_customers')}</p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">{totalCustomers}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-[#1b1b18]/5 dark:border-white/5 shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600">
                            <Car className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-widest">{t('dash_total_vehicles')}</p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">{totalVehicles}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-[#1b1b18]/5 dark:border-white/5 shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600">
                            <Calendar className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-widest">{t('dash_new_this_month')}</p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">{newThisMonth}</p>
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
                                    {t('dash_filter')}: {genderFilter === 'All' ? t('dash_filter_all') : (genderFilter === 'L' ? t('dash_male') : t('dash_female'))}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-2xl border-[#1b1b18]/5 dark:border-white/5 shadow-xl">
                                <DropdownMenuItem onClick={() => setGenderFilter('All')} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_filter_all')}</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setGenderFilter('L')} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_male')}</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setGenderFilter('P')} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_female')}</DropdownMenuItem>
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
                                <DropdownMenuItem onClick={() => setSortConfig({ key: 'joined', direction: 'desc' })} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_sort_date')} ({t('dash_newest')})</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortConfig({ key: 'joined', direction: 'asc' })} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_sort_date')} ({t('dash_oldest')})</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortConfig({ key: 'name', direction: 'asc' })} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_sort_name')} (A-Z)</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortConfig({ key: 'name', direction: 'desc' })} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_sort_name')} (Z-A)</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </m.div>

                {/* Customers Table */}
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
                                        onClick={() => handleSort('name')}
                                        className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 cursor-pointer group hover:bg-[#1b1b18]/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {t('dash_col_customer')} Info
                                            {getSortIcon('name')}
                                        </div>
                                    </th>
                                    <th 
                                        onClick={() => handleSort('cars')}
                                        className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 cursor-pointer group hover:bg-[#1b1b18]/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {t('dash_col_car')}
                                            {getSortIcon('cars')}
                                        </div>
                                    </th>
                                    <th 
                                        onClick={() => handleSort('joined')}
                                        className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 cursor-pointer group hover:bg-[#1b1b18]/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {t('dash_col_joined_date')}
                                            {getSortIcon('joined')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1b1b18]/5 dark:divide-white/5">
                                {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="group transition-colors hover:bg-[#1b1b18]/1 dark:hover:bg-white/1">
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-mono font-bold text-[#1b1b18]/40 dark:text-white/40">CUS-{customer.id}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-[#1b1b18]/5 dark:bg-white/5 flex items-center justify-center">
                                                    <User className="size-5 text-[#1b1b18]/50 dark:text-white/50" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-[#1b1b18] dark:text-white leading-tight">{customer.nama_pelanggan}</span>
                                                        <Badge variant="outline" className="text-[8px] px-1 py-0 border-[#1b1b18]/10 dark:border-white/10 uppercase tracking-tighter">
                                                            {customer.jenis_kelamin === 'L' ? t('dash_male') : t('dash_female')}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[10px] text-[#1b1b18]/40 dark:text-white/40 flex items-center gap-1">
                                                            <Phone className="size-3" />
                                                            {customer.no_telp}
                                                        </span>
                                                        <span className="text-[10px] text-[#1b1b18]/40 dark:text-white/40 flex items-center gap-1">
                                                            <Mail className="size-3" />
                                                            {customer.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                {customer.mobils && customer.mobils.length > 0 ? customer.mobils.map((car, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-[#1b1b18]/70 dark:text-white/70">
                                                        <Car className="size-3" />
                                                        <span className="text-[11px] font-medium">{car.merk} {car.model} ({car.no_polisi})</span>
                                                    </div>
                                                )) : (
                                                    <span className="text-[11px] font-medium text-[#1b1b18]/40 dark:text-white/40 italic">No cars assigned</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-[#1b1b18]/70 dark:text-white/70">{new Date(customer.created_at || customer.tanggal_daftar || '').toLocaleDateString('id-ID')}</span>
                                                <span className="text-[10px] text-[#1b1b18]/30 dark:text-white/30 uppercase tracking-widest font-bold">{t('dash_registration')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="rounded-lg p-2 text-[#1b1b18]/20 hover:bg-[#1b1b18]/5 hover:text-[#1b1b18] dark:text-white/20 dark:hover:bg-white/5 dark:hover:text-white transition-all">
                                                        <MoreHorizontal className="size-4" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-2xl border-[#1b1b18]/5 dark:border-white/5 shadow-xl">
                                                    <DropdownMenuItem onClick={() => openEditCustomerModal(customer)} className="rounded-xl focus:bg-red-600 focus:text-white font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">
                                                        <Edit3 className="mr-2 size-3" />
                                                        {t('dash_edit_profile')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openAddCarModal(customer)} className="rounded-xl focus:bg-red-600 focus:text-white font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">
                                                        <Plus className="mr-2 size-3" />
                                                        Add Car
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => openDeleteModal(customer)} className="rounded-xl focus:bg-red-600 focus:text-white font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer text-red-600">
                                                        <Trash2 className="mr-2 size-3" />
                                                        {t('dash_delete_customer')}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-2 opacity-20">
                                                <Users className="size-12" />
                                                <p className="text-lg font-black uppercase tracking-tighter">{t('dash_no_customers')}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </m.div>
            </m.div>

            {/* Customer Add/Edit Modal */}
            <AnimatePresence>
                {isCustomerModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCustomerModalOpen(false)}
                            className="absolute inset-0 bg-[#1b1b18]/80 backdrop-blur-sm"
                        />
                        <m.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg overflow-y-auto max-h-[90vh] rounded-4xl bg-white p-8 shadow-2xl dark:bg-[#121212] custom-scrollbar"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-black uppercase tracking-tight text-[#1b1b18] dark:text-white">
                                    {editingCustomer ? t('dash_edit_profile') : t('dash_add_customer')}
                                </h2>
                                <button 
                                    onClick={() => setIsCustomerModalOpen(false)}
                                    className="rounded-full p-2 text-[#1b1b18]/40 hover:bg-[#1b1b18]/5 dark:text-white/40 dark:hover:bg-white/5"
                                >
                                    <X className="size-6" />
                                </button>
                            </div>

                            <form onSubmit={handleCustomerSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Nama Pelanggan</label>
                                        <Input 
                                            value={customerData.nama_pelanggan}
                                            onChange={e => setCustomerData('nama_pelanggan', e.target.value)}
                                            className="rounded-2xl h-12 bg-[#1b1b18]/5 dark:bg-white/5 border-transparent"
                                            required
                                        />
                                        {customerErrors.nama_pelanggan && <span className="text-xs text-red-600">{customerErrors.nama_pelanggan}</span>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">No Telepon</label>
                                            <Input 
                                                value={customerData.no_telp}
                                                onChange={e => setCustomerData('no_telp', e.target.value)}
                                                className="rounded-2xl h-12 bg-[#1b1b18]/5 dark:bg-white/5 border-transparent"
                                                required
                                            />
                                            {customerErrors.no_telp && <span className="text-xs text-red-600">{customerErrors.no_telp}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Email</label>
                                            <Input 
                                                type="email"
                                                value={customerData.email}
                                                onChange={e => setCustomerData('email', e.target.value)}
                                                className="rounded-2xl h-12 bg-[#1b1b18]/5 dark:bg-white/5 border-transparent"
                                                required
                                            />
                                            {customerErrors.email && <span className="text-xs text-red-600">{customerErrors.email}</span>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Jenis Kelamin</label>
                                        <div className="flex gap-4 h-12 items-center px-2">
                                            <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name="jenis_kelamin" 
                                                    value="L" 
                                                    checked={customerData.jenis_kelamin === 'L'} 
                                                    onChange={() => setCustomerData('jenis_kelamin', 'L')}
                                                    className="accent-red-600"
                                                />
                                                Laki-laki
                                            </label>
                                            <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name="jenis_kelamin" 
                                                    value="P" 
                                                    checked={customerData.jenis_kelamin === 'P'} 
                                                    onChange={() => setCustomerData('jenis_kelamin', 'P')}
                                                    className="accent-red-600"
                                                />
                                                Perempuan
                                            </label>
                                        </div>
                                        {customerErrors.jenis_kelamin && <span className="text-xs text-red-600">{customerErrors.jenis_kelamin}</span>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Alamat</label>
                                        <Input 
                                            value={customerData.alamat}
                                            onChange={e => setCustomerData('alamat', e.target.value)}
                                            className="rounded-2xl h-12 bg-[#1b1b18]/5 dark:bg-white/5 border-transparent"
                                            required
                                        />
                                        {customerErrors.alamat && <span className="text-xs text-red-600">{customerErrors.alamat}</span>}
                                    </div>
                                </div>

                                <button 
                                    disabled={processingCustomer}
                                    className="flex w-full h-14 items-center justify-center gap-2 rounded-2xl bg-[#1b1b18] text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-black dark:bg-white dark:text-[#1b1b18] disabled:opacity-50"
                                >
                                    {processingCustomer ? (
                                        <Loader2 className="size-5 animate-spin" />
                                    ) : (
                                        <>
                                            <UserPlus className="size-5" />
                                            {t('dash_save_changes')}
                                        </>
                                    )}
                                </button>
                            </form>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Car Modal */}
            <AnimatePresence>
                {isCarModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCarModalOpen(false)}
                            className="absolute inset-0 bg-[#1b1b18]/80 backdrop-blur-sm"
                        />
                        <m.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg overflow-y-auto max-h-[90vh] rounded-4xl bg-white p-8 shadow-2xl dark:bg-[#121212] custom-scrollbar"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-[#1b1b18] dark:text-white">
                                        Add Car
                                    </h2>
                                    <p className="text-sm text-[#1b1b18]/50 dark:text-white/50 font-medium">For {targetCustomerForCar?.nama_pelanggan}</p>
                                </div>
                                <button 
                                    onClick={() => setIsCarModalOpen(false)}
                                    className="rounded-full p-2 text-[#1b1b18]/40 hover:bg-[#1b1b18]/5 dark:text-white/40 dark:hover:bg-white/5"
                                >
                                    <X className="size-6" />
                                </button>
                            </div>

                            <form onSubmit={handleCarSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Merk</label>
                                            <Input 
                                                value={carData.merk}
                                                onChange={e => setCarData('merk', e.target.value)}
                                                className="rounded-2xl h-12 bg-[#1b1b18]/5 dark:bg-white/5 border-transparent"
                                                required
                                                placeholder="e.g. Toyota"
                                            />
                                            {carErrors.merk && <span className="text-xs text-red-600">{carErrors.merk}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Model</label>
                                            <Input 
                                                value={carData.model}
                                                onChange={e => setCarData('model', e.target.value)}
                                                className="rounded-2xl h-12 bg-[#1b1b18]/5 dark:bg-white/5 border-transparent"
                                                placeholder="e.g. Avanza"
                                            />
                                            {carErrors.model && <span className="text-xs text-red-600">{carErrors.model}</span>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Tahun</label>
                                            <Input 
                                                type="number"
                                                value={carData.tahun}
                                                onChange={e => setCarData('tahun', e.target.value)}
                                                className="rounded-2xl h-12 bg-[#1b1b18]/5 dark:bg-white/5 border-transparent"
                                                placeholder="e.g. 2021"
                                            />
                                            {carErrors.tahun && <span className="text-xs text-red-600">{carErrors.tahun}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">No Polisi</label>
                                            <Input 
                                                value={carData.no_polisi}
                                                onChange={e => setCarData('no_polisi', e.target.value)}
                                                className="rounded-2xl h-12 bg-[#1b1b18]/5 dark:bg-white/5 border-transparent uppercase"
                                                required
                                                placeholder="B 1234 ABC"
                                            />
                                            {carErrors.no_polisi && <span className="text-xs text-red-600">{carErrors.no_polisi}</span>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Warna</label>
                                        <Input 
                                            value={carData.warna}
                                            onChange={e => setCarData('warna', e.target.value)}
                                            className="rounded-2xl h-12 bg-[#1b1b18]/5 dark:bg-white/5 border-transparent"
                                            placeholder="e.g. Hitam"
                                        />
                                        {carErrors.warna && <span className="text-xs text-red-600">{carErrors.warna}</span>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Keterangan</label>
                                        <Input 
                                            value={carData.keterangan}
                                            onChange={e => setCarData('keterangan', e.target.value)}
                                            className="rounded-2xl h-12 bg-[#1b1b18]/5 dark:bg-white/5 border-transparent"
                                        />
                                        {carErrors.keterangan && <span className="text-xs text-red-600">{carErrors.keterangan}</span>}
                                    </div>
                                </div>

                                <button 
                                    disabled={processingCar}
                                    className="flex w-full h-14 items-center justify-center gap-2 rounded-2xl bg-[#1b1b18] text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-black dark:bg-white dark:text-[#1b1b18] disabled:opacity-50"
                                >
                                    {processingCar ? (
                                        <Loader2 className="size-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Car className="size-5" />
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
                                You are about to delete customer <span className="font-bold text-[#1b1b18] dark:text-white">{deletingCustomer?.nama_pelanggan}</span> and all their associated cars. This action cannot be undone.
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

CustomersPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Customers',
            href: '/admin/customers',
        },
    ],
};
