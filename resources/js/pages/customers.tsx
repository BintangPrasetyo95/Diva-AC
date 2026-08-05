import { Head, useForm, router } from '@inertiajs/react';
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
    Users,
    Plus,
    Search,
    MoreHorizontal,
    Phone,
    Mail,
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
    AlertTriangle,
} from 'lucide-react';
import React from 'react';
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
import {
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableHead,
    DataTableHeaderCell,
    DataTableInner,
} from '@/components/ui/DataTable';
import { useLanguage } from '@/hooks/use-language';
import { useDebounce } from '@/hooks/use-debounce';

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

import { CustomerFormModal } from '@/components/admin/customers/CustomerFormModal';
import { CarFormModal } from '@/components/admin/customers/CarFormModal';
import { CustomerDeleteModal } from '@/components/admin/customers/CustomerDeleteModal';

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

export default function CustomersPage({
    customers,
}: {
    customers: Customer[];
}) {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = React.useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const [genderFilter, setGenderFilter] = React.useState('All');
    const [sortConfig, setSortConfig] = React.useState<{
        key: string;
        direction: 'asc' | 'desc';
    }>({ key: 'joined', direction: 'desc' });

    // Modals state
    const [isCustomerModalOpen, setIsCustomerModalOpen] = React.useState(false);
    const [editingCustomer, setEditingCustomer] =
        React.useState<Customer | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [deletingCustomer, setDeletingCustomer] =
        React.useState<Customer | null>(null);
    const [isCarModalOpen, setIsCarModalOpen] = React.useState(false);
    const [targetCustomerForCar, setTargetCustomerForCar] =
        React.useState<Customer | null>(null);

    const openAddCustomerModal = () => {
        setEditingCustomer(null);
        setIsCustomerModalOpen(true);
    };

    const openEditCustomerModal = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsCustomerModalOpen(true);
    };

    const openDeleteModal = (customer: Customer) => {
        setDeletingCustomer(customer);
        setIsDeleteModalOpen(true);
    };

    const openAddCarModal = (customer: Customer) => {
        setTargetCustomerForCar(customer);
        setIsCarModalOpen(true);
    };

    const filteredCustomers = customers
        .filter((c) => {
            const matchesSearch =
                (c.nama_pelanggan || '')
                    .toLowerCase()
                    .includes(debouncedSearchQuery.toLowerCase()) ||
                (c.no_telp || '').includes(debouncedSearchQuery) ||
                (c.email || '')
                    .toLowerCase()
                    .includes(debouncedSearchQuery.toLowerCase()) ||
                String(c.id || '')
                    .toLowerCase()
                    .includes(debouncedSearchQuery.toLowerCase());
            const matchesGender =
                genderFilter === 'All' || c.jenis_kelamin === genderFilter;

            return matchesSearch && matchesGender;
        })
        .sort((a, b) => {
            const direction = sortConfig.direction === 'asc' ? 1 : -1;

            if (sortConfig.key === 'joined') {
                const dateA = new Date(
                    a.created_at || a.tanggal_daftar,
                ).getTime();
                const dateB = new Date(
                    b.created_at || b.tanggal_daftar,
                ).getTime();

                return (dateA - dateB) * direction;
            }

            if (sortConfig.key === 'name') {
                return (
                    a.nama_pelanggan.localeCompare(b.nama_pelanggan) * direction
                );
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

    const totalCustomers = customers.length;
    const totalVehicles = customers.reduce(
        (sum, c) => sum + c.mobils.length,
        0,
    );
    // Rough estimation of new this month
    const newThisMonth = customers.filter((c) => {
        const d = new Date(c.created_at || c.tanggal_daftar);
        const now = new Date();

        return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
        );
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
                <m.div
                    variants={itemVariants}
                    className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                            {t('dash_stat_customers')}{' '}
                            <span className="text-red-600">
                                {t('dash_database')}
                            </span>
                        </h1>
                        <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">
                            {t('dash_customers_desc')}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={openAddCustomerModal}
                            className="h-12 rounded-2xl bg-red-600 px-6 text-xs font-bold tracking-widest text-white uppercase shadow-lg shadow-red-600/20 transition-all hover:scale-105 hover:bg-red-700 active:scale-95"
                        >
                            <UserPlus className="mr-2 size-4" />
                            {t('dash_add_customer')}
                        </Button>
                    </div>
                </m.div>

                {/* Stats Summary */}
                <m.div
                    variants={itemVariants}
                    className="grid grid-cols-1 gap-4 md:grid-cols-3"
                >
                    <div className="flex items-center gap-4 rounded-3xl border border-[#1b1b18]/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#121212]">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                            <Users className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                {t('dash_stat_customers')}
                            </p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">
                                {totalCustomers}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-3xl border border-[#1b1b18]/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#121212]">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600">
                            <Car className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                {t('dash_total_vehicles')}
                            </p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">
                                {totalVehicles}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-3xl border border-[#1b1b18]/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#121212]">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-600">
                            <Calendar className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                {t('dash_new_this_month')}
                            </p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">
                                {newThisMonth}
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
                                    {genderFilter === 'All'
                                        ? t('dash_filter_all')
                                        : genderFilter === 'L'
                                            ? t('dash_male')
                                            : t('dash_female')}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-48 rounded-2xl border-[#1b1b18]/5 shadow-xl dark:border-white/5"
                            >
                                <DropdownMenuItem
                                    onClick={() => setGenderFilter('All')}
                                    className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase"
                                >
                                    {t('dash_filter_all')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setGenderFilter('L')}
                                    className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase"
                                >
                                    {t('dash_male')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setGenderFilter('P')}
                                    className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase"
                                >
                                    {t('dash_female')}
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
                                            key: 'joined',
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
                                            key: 'joined',
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
                                            key: 'name',
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
                                            key: 'name',
                                            direction: 'desc',
                                        })
                                    }
                                    className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase"
                                >
                                    {t('dash_sort_name')} (Z-A)
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </m.div>

                {/* Customers Table */}
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
                                            onClick={() => handleSort('name')}
                                            className="group cursor-pointer px-6 py-5 text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase transition-colors hover:bg-[#1b1b18]/5 dark:text-white/40"
                                        >
                                            <div className="flex items-center gap-2">
                                                {t('dash_col_customer')} Info
                                                {getSortIcon('name')}
                                            </div>
                                        </th>
                                        <th
                                            onClick={() => handleSort('cars')}
                                            className="group cursor-pointer px-6 py-5 text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase transition-colors hover:bg-[#1b1b18]/5 dark:text-white/40"
                                        >
                                            <div className="flex items-center gap-2">
                                                {t('dash_col_car')}
                                                {getSortIcon('cars')}
                                            </div>
                                        </th>
                                        <th
                                            onClick={() => handleSort('joined')}
                                            className="group cursor-pointer px-6 py-5 text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase transition-colors hover:bg-[#1b1b18]/5 dark:text-white/40"
                                        >
                                            <div className="flex items-center gap-2">
                                                {t('dash_col_joined_date')}
                                                {getSortIcon('joined')}
                                            </div>
                                        </th>
                                        <th className="px-6 py-5 text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40"></th>
                                    </tr>
                                </DataTableHead>
                                <DataTableBody>
                                    {filteredCustomers.length > 0 ? (
                                        filteredCustomers.map((customer) => (
                                            <tr
                                                key={customer.id}
                                                className="group transition-colors hover:bg-[#1b1b18]/1 dark:hover:bg-white/1"
                                            >
                                                <td className="px-6 py-5">
                                                    <span className="font-mono text-xs font-bold text-[#1b1b18]/40 dark:text-white/40">
                                                        CUS-{customer.id}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-10 items-center justify-center rounded-full bg-[#1b1b18]/5 dark:bg-white/5">
                                                            <User className="size-5 text-[#1b1b18]/50 dark:text-white/50" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm leading-tight font-bold text-[#1b1b18] dark:text-white">
                                                                    {
                                                                        customer.nama_pelanggan
                                                                    }
                                                                </span>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="border-[#1b1b18]/10 px-1 py-0 text-[8px] tracking-tighter uppercase dark:border-white/10"
                                                                >
                                                                    {customer.jenis_kelamin ===
                                                                        'L'
                                                                        ? t(
                                                                            'dash_male',
                                                                        )
                                                                        : t(
                                                                            'dash_female',
                                                                        )}
                                                                </Badge>
                                                            </div>
                                                            <div className="mt-1 flex items-center gap-3">
                                                                <span className="flex items-center gap-1 text-[10px] text-[#1b1b18]/40 dark:text-white/40">
                                                                    <Phone className="size-3" />
                                                                    {
                                                                        customer.no_telp
                                                                    }
                                                                </span>
                                                                <span className="flex items-center gap-1 text-[10px] text-[#1b1b18]/40 dark:text-white/40">
                                                                    <Mail className="size-3" />
                                                                    {customer.email}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-1">
                                                        {customer.mobils &&
                                                            customer.mobils.length >
                                                            0 ? (
                                                            customer.mobils.map(
                                                                (car, idx) => (
                                                                    <div
                                                                        key={idx}
                                                                        className="flex items-center gap-2 text-[#1b1b18]/70 dark:text-white/70"
                                                                    >
                                                                        <Car className="size-3" />
                                                                        <span className="text-[11px] font-medium">
                                                                            {
                                                                                car.merk
                                                                            }{' '}
                                                                            {
                                                                                car.model
                                                                            }{' '}
                                                                            (
                                                                            {
                                                                                car.no_polisi
                                                                            }
                                                                            )
                                                                        </span>
                                                                    </div>
                                                                ),
                                                            )
                                                        ) : (
                                                            <span className="text-[11px] font-medium text-[#1b1b18]/40 italic dark:text-white/40">
                                                                No cars assigned
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm text-[#1b1b18]/70 dark:text-white/70">
                                                            {new Date(
                                                                customer.created_at ||
                                                                customer.tanggal_daftar ||
                                                                '',
                                                            ).toLocaleDateString(
                                                                'id-ID',
                                                            )}
                                                        </span>
                                                        <span className="text-[10px] font-bold tracking-widest text-[#1b1b18]/30 uppercase dark:text-white/30">
                                                            {t('dash_registration')}
                                                        </span>
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
                                                                onClick={() =>
                                                                    openEditCustomerModal(
                                                                        customer,
                                                                    )
                                                                }
                                                                className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase focus:bg-red-600 focus:text-white"
                                                            >
                                                                <Edit3 className="mr-2 size-3" />
                                                                {t(
                                                                    'dash_edit_profile',
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    openAddCarModal(
                                                                        customer,
                                                                    )
                                                                }
                                                                className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase focus:bg-red-600 focus:text-white"
                                                            >
                                                                <Plus className="mr-2 size-3" />
                                                                Add Car
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    openDeleteModal(
                                                                        customer,
                                                                    )
                                                                }
                                                                className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest text-red-600 uppercase focus:bg-red-600 focus:text-white"
                                                            >
                                                                <Trash2 className="mr-2 size-3" />
                                                                {t(
                                                                    'dash_delete_customer',
                                                                )}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-20 text-center"
                                            >
                                                <div className="flex flex-col items-center gap-2 opacity-20">
                                                    <Users className="size-12" />
                                                    <p className="text-lg font-black tracking-tighter uppercase">
                                                        {t('dash_no_customers')}
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

            <CustomerFormModal
                isOpen={isCustomerModalOpen}
                onClose={() => {
                    setIsCustomerModalOpen(false);
                    setEditingCustomer(null);
                }}
                editingCustomer={editingCustomer}
            />

            <CarFormModal
                isOpen={isCarModalOpen}
                onClose={() => {
                    setIsCarModalOpen(false);
                    setTargetCustomerForCar(null);
                }}
                targetCustomerForCar={targetCustomerForCar}
            />

            <CustomerDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeletingCustomer(null);
                }}
                deletingCustomer={deletingCustomer}
            />
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
