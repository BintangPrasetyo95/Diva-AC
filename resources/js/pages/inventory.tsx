import { Head, useForm, router } from '@inertiajs/react';
import type {
    Variants} from 'framer-motion';
import {
    m,
    LazyMotion,
    domAnimation,
    AnimatePresence,
} from 'framer-motion';
import {
    Package,
    Plus,
    Search,
    MoreHorizontal,
    AlertTriangle,
    ArrowUpDown,
    Filter,
    Layers,
    Tag,
    History,
    Edit3,
    Trash2,
    PackagePlus,
    X,
    Upload,
    CheckCircle2,
    Loader2,
} from 'lucide-react';
import React, { useRef } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/hooks/use-language';

interface Sparepart {
    id: number;
    nama_sparepart: string;
    tipe_sparepart: string;
    harga_sparepart: string | number;
    stock_sparepart: number;
    image: string | null;
    image_url: string | null;
    is_public: boolean;
    keterangan: string | null;
    created_at?: string;
    updated_at?: string;
}

import { InventoryFormModal } from '@/components/admin/inventory/InventoryFormModal';
import { InventoryDeleteModal } from '@/components/admin/inventory/InventoryDeleteModal';

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

export default function InventoryPage({
    spareparts,
}: {
    spareparts: Sparepart[];
}) {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('All');
    const [sortConfig, setSortConfig] = React.useState<{
        key: string;
        direction: 'asc' | 'desc';
    }>({ key: 'name', direction: 'asc' });

    // Modal States
    const [isAddEditModalOpen, setIsAddEditModalOpen] = React.useState(false);
    const [editingPart, setEditingPart] = React.useState<Sparepart | null>(
        null,
    );
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [deletingPart, setDeletingPart] = React.useState<Sparepart | null>(
        null,
    );
    const openAddModal = () => {
        setEditingPart(null);
        setIsAddEditModalOpen(true);
    };

    const openEditModal = (part: Sparepart) => {
        setEditingPart(part);
        setIsAddEditModalOpen(true);
    };

    const openDeleteModal = (part: Sparepart) => {
        setDeletingPart(part);
        setIsDeleteModalOpen(true);
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) {
return 'Out of Stock';
}

        if (stock < 5) {
return 'Low';
}

        return 'Normal';
    };

    const getStockBadge = (stock: number) => {
        if (stock === 0) {
            return (
                <Badge
                    variant="outline"
                    className="gap-1 border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-red-600 uppercase"
                >
                    <AlertTriangle className="size-3" />
                    {t('dash_out_of_stock')}
                </Badge>
            );
        }

        if (stock < 5) {
            return (
                <Badge
                    variant="outline"
                    className="gap-1 border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-amber-600 uppercase"
                >
                    <AlertTriangle className="size-3" />
                    {t('dash_low_stock_alert')}: {stock}
                </Badge>
            );
        }

        return (
            <Badge
                variant="outline"
                className="gap-1 border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-green-600 uppercase"
            >
                {t('dash_in_stock')}: {stock}
            </Badge>
        );
    };

    const filteredInventory = spareparts
        .filter((item) => {
            const matchesSearch =
                item.nama_sparepart
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                item.tipe_sparepart
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                String(item.id)
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            const status = getStockStatus(item.stock_sparepart);
            const matchesStatus =
                statusFilter === 'All' || status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            const direction = sortConfig.direction === 'asc' ? 1 : -1;

            if (sortConfig.key === 'stock') {
                return (a.stock_sparepart - b.stock_sparepart) * direction;
            }

            if (sortConfig.key === 'price') {
                const priceA = Number(a.harga_sparepart);
                const priceB = Number(b.harga_sparepart);

                return (priceA - priceB) * direction;
            }

            if (sortConfig.key === 'name') {
                return (
                    a.nama_sparepart.localeCompare(b.nama_sparepart) * direction
                );
            }

            if (sortConfig.key === 'id') {
                return (a.id - b.id) * direction;
            }

            if (sortConfig.key === 'category') {
                return (
                    a.tipe_sparepart.localeCompare(b.tipe_sparepart) * direction
                );
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

    // Derived stats
    const totalItems = spareparts.length;
    const lowStockItems = spareparts.filter(
        (p) => p.stock_sparepart > 0 && p.stock_sparepart < 5,
    ).length;
    const totalValue = spareparts.reduce(
        (sum, p) => sum + Number(p.harga_sparepart) * p.stock_sparepart,
        0,
    );

    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(Number(amount));
    };

    return (
        <LazyMotion features={domAnimation}>
            <Head title={t('dash_stat_stock')} />

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
                            {t('dash_stat_stock')}{' '}
                            <span className="text-red-600">
                                {t('dash_inventory')}
                            </span>
                        </h1>
                        <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">
                            {t('dash_inventory_desc')}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="h-12 rounded-2xl border-[#1b1b18]/10 px-6 text-[10px] font-bold tracking-widest uppercase dark:border-white/10"
                        >
                            <History className="mr-2 size-4" />
                            {t('dash_logs')}
                        </Button>
                        <Button
                            onClick={openAddModal}
                            className="h-12 rounded-2xl bg-red-600 px-6 text-xs font-bold tracking-widest text-white uppercase shadow-lg shadow-red-600/20 transition-all hover:scale-105 hover:bg-red-700 active:scale-95"
                        >
                            <Plus className="mr-2 size-4" />
                            {t('dash_add_part')}
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
                            <Layers className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                {t('dash_total_items')}
                            </p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">
                                {totalItems}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-3xl border border-[#1b1b18]/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#121212]">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                            <AlertTriangle className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                {t('dash_low_stock')}
                            </p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">
                                {lowStockItems} Items
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-3xl border border-[#1b1b18]/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#121212]">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-600">
                            <Tag className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                {t('dash_total_value')}
                            </p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">
                                {formatCurrency(totalValue)}
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
                                        : statusFilter}
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
                                    onClick={() => setStatusFilter('Normal')}
                                    className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase"
                                >
                                    Normal
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setStatusFilter('Low')}
                                    className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase"
                                >
                                    Low
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        setStatusFilter('Out of Stock')
                                    }
                                    className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase"
                                >
                                    Out of Stock
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
                                <DropdownMenuItem
                                    onClick={() =>
                                        setSortConfig({
                                            key: 'stock',
                                            direction: 'desc',
                                        })
                                    }
                                    className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase"
                                >
                                    {t('dash_sort_stock')} (High-Low)
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        setSortConfig({
                                            key: 'stock',
                                            direction: 'asc',
                                        })
                                    }
                                    className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase"
                                >
                                    {t('dash_sort_stock')} (Low-High)
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        setSortConfig({
                                            key: 'price',
                                            direction: 'desc',
                                        })
                                    }
                                    className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase"
                                >
                                    {t('dash_sort_price')} (High-Low)
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        setSortConfig({
                                            key: 'price',
                                            direction: 'asc',
                                        })
                                    }
                                    className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase"
                                >
                                    {t('dash_sort_price')} (Low-High)
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </m.div>

                {/* Inventory Table */}
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
                                            {t('dash_col_item_name')}
                                            {getSortIcon('name')}
                                        </div>
                                    </th>
                                    <th
                                        onClick={() => handleSort('category')}
                                        className="group cursor-pointer px-6 py-5 text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase transition-colors hover:bg-[#1b1b18]/5 dark:text-white/40"
                                    >
                                        <div className="flex items-center gap-2">
                                            {t('dash_part_type')}
                                            {getSortIcon('category')}
                                        </div>
                                    </th>
                                    <th
                                        onClick={() => handleSort('stock')}
                                        className="group cursor-pointer px-6 py-5 text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase transition-colors hover:bg-[#1b1b18]/5 dark:text-white/40"
                                    >
                                        <div className="flex items-center gap-2">
                                            {t('dash_col_stock_status')}
                                            {getSortIcon('stock')}
                                        </div>
                                    </th>
                                    <th
                                        onClick={() => handleSort('price')}
                                        className="group cursor-pointer px-6 py-5 text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase transition-colors hover:bg-[#1b1b18]/5 dark:text-white/40"
                                    >
                                        <div className="flex items-center gap-2">
                                            {t('dash_col_price')}
                                            {getSortIcon('price')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-5 text-center text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                        {t('dash_public_visibility')}
                                    </th>
                                    <th className="px-6 py-5 text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40"></th>
                                </tr>
                            </DataTableHead>
                            <DataTableBody>
                                {filteredInventory.length > 0 ? (
                                    filteredInventory.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="group transition-colors hover:bg-[#1b1b18]/1 dark:hover:bg-white/1"
                                        >
                                            <td className="px-6 py-5">
                                                <span className="font-mono text-xs font-bold text-[#1b1b18]/40 dark:text-white/40">
                                                    SP-{item.id}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    {item.image_url ? (
                                                        <img
                                                            src={item.image_url}
                                                            alt={
                                                                item.nama_sparepart
                                                            }
                                                            className="h-10 w-10 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1b1b18]/5 dark:bg-white/5">
                                                            <Package className="size-5 text-[#1b1b18]/30 dark:text-white/30" />
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="text-sm leading-tight font-bold text-[#1b1b18] dark:text-white">
                                                            {
                                                                item.nama_sparepart
                                                            }
                                                        </span>
                                                        <span className="text-[10px] tracking-wider text-[#1b1b18]/40 uppercase dark:text-white/40">
                                                            {
                                                                item.tipe_sparepart
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm text-[#1b1b18]/70 dark:text-white/70">
                                                    {item.tipe_sparepart}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                {getStockBadge(
                                                    item.stock_sparepart,
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm font-black text-[#1b1b18] dark:text-white">
                                                    {formatCurrency(
                                                        item.harga_sparepart,
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <Badge
                                                    variant="outline"
                                                    className={`gap-1 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase ${item.is_public ? 'border-green-500/20 bg-green-500/10 text-green-600' : 'border-transparent bg-[#1b1b18]/10 text-[#1b1b18]/50 dark:bg-white/10 dark:text-white/50'}`}
                                                >
                                                    {item.is_public
                                                        ? t(
                                                              'dash_show_in_public',
                                                          )
                                                        : t(
                                                              'dash_hide_from_public',
                                                          )}
                                                </Badge>
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
                                                                openEditModal(
                                                                    item,
                                                                )
                                                            }
                                                            className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase focus:bg-red-600 focus:text-white"
                                                        >
                                                            <Edit3 className="mr-2 size-3" />
                                                            {t(
                                                                'dash_edit_details',
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                openDeleteModal(
                                                                    item,
                                                                )
                                                            }
                                                            className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest text-red-600 uppercase focus:bg-red-600 focus:text-white"
                                                        >
                                                            <Trash2 className="mr-2 size-3" />
                                                            {t(
                                                                'dash_delete_item',
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
                                            colSpan={7}
                                            className="px-6 py-20 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2 opacity-20">
                                                <Package className="size-12" />
                                                <p className="text-lg font-black tracking-tighter uppercase">
                                                    {t('dash_no_items')}
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

            <InventoryFormModal
                isOpen={isAddEditModalOpen}
                onClose={() => {
                    setIsAddEditModalOpen(false);
                    setEditingPart(null);
                }}
                editingPart={editingPart}
            />

            <InventoryDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeletingPart(null);
                }}
                deletingPart={deletingPart}
            />
        </LazyMotion>
    );
}

InventoryPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Inventory',
            href: '/admin/inventory',
        },
    ],
};
