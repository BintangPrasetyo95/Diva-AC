import { Head, useForm, router } from '@inertiajs/react';
import { m, Variants, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
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
    Loader2
} from 'lucide-react';
import React, { useRef } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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

export default function InventoryPage({ spareparts }: { spareparts: Sparepart[] }) {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('All');
    const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });

    // Modal States
    const [isAddEditModalOpen, setIsAddEditModalOpen] = React.useState(false);
    const [editingPart, setEditingPart] = React.useState<Sparepart | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [deletingPart, setDeletingPart] = React.useState<Sparepart | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        nama_sparepart: '',
        tipe_sparepart: '',
        harga_sparepart: '',
        stock_sparepart: '',
        is_public: true,
        keterangan: '',
        image_file: null as File | null,
        _method: 'post'
    });

    const openAddModal = () => {
        clearErrors();
        reset();
        setEditingPart(null);
        setData({
            nama_sparepart: '',
            tipe_sparepart: '',
            harga_sparepart: '',
            stock_sparepart: '',
            is_public: true,
            keterangan: '',
            image_file: null,
            _method: 'post'
        });
        setIsAddEditModalOpen(true);
    };

    const openEditModal = (part: Sparepart) => {
        clearErrors();
        setEditingPart(part);
        setData({
            nama_sparepart: part.nama_sparepart,
            tipe_sparepart: part.tipe_sparepart,
            harga_sparepart: part.harga_sparepart.toString(),
            stock_sparepart: part.stock_sparepart.toString(),
            is_public: part.is_public,
            keterangan: part.keterangan || '',
            image_file: null,
            _method: 'put'
        });
        setIsAddEditModalOpen(true);
    };

    const openDeleteModal = (part: Sparepart) => {
        setDeletingPart(part);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingPart) {
            post(`/admin/inventory/${editingPart.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsAddEditModalOpen(false);
                    toast.success('Sparepart updated successfully');
                    reset();
                },
                onError: (err) => {
                    toast.error('Failed to update sparepart');
                }
            });
        } else {
            post('/admin/inventory', {
                preserveScroll: true,
                onSuccess: () => {
                    setIsAddEditModalOpen(false);
                    toast.success('Sparepart added successfully');
                    reset();
                },
                onError: (err) => {
                    toast.error('Failed to add sparepart');
                }
            });
        }
    };

    const handleDelete = () => {
        if (!deletingPart) return;
        
        router.delete(`/admin/inventory/${deletingPart.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setDeletingPart(null);
                toast.success('Sparepart deleted successfully');
            },
            onError: (err) => {
                toast.error(err.error || 'Failed to delete sparepart');
            }
        });
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return 'Out of Stock';
        if (stock < 5) return 'Low';
        return 'Normal';
    };

    const getStockBadge = (stock: number) => {
        if (stock === 0) {
            return (
                <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 gap-1 px-2 py-0.5 font-bold uppercase tracking-widest text-[9px]">
                    <AlertTriangle className="size-3" />
                    {t('dash_out_of_stock')}
                </Badge>
            );
        }
        if (stock < 5) {
            return (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1 px-2 py-0.5 font-bold uppercase tracking-widest text-[9px]">
                    <AlertTriangle className="size-3" />
                    {t('dash_low_stock_alert')}: {stock}
                </Badge>
            );
        }
        return (
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 gap-1 px-2 py-0.5 font-bold uppercase tracking-widest text-[9px]">
                {t('dash_in_stock')}: {stock}
            </Badge>
        );
    };

    const filteredInventory = spareparts
        .filter(item => {
            const matchesSearch = item.nama_sparepart.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 item.tipe_sparepart.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 String(item.id).toLowerCase().includes(searchQuery.toLowerCase());
            const status = getStockStatus(item.stock_sparepart);
            const matchesStatus = statusFilter === 'All' || status === statusFilter;
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
                return a.nama_sparepart.localeCompare(b.nama_sparepart) * direction;
            }
            if (sortConfig.key === 'id') {
                return (a.id - b.id) * direction;
            }
            if (sortConfig.key === 'category') {
                return a.tipe_sparepart.localeCompare(b.tipe_sparepart) * direction;
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

    // Derived stats
    const totalItems = spareparts.length;
    const lowStockItems = spareparts.filter(p => p.stock_sparepart > 0 && p.stock_sparepart < 5).length;
    const totalValue = spareparts.reduce((sum, p) => sum + (Number(p.harga_sparepart) * p.stock_sparepart), 0);

    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(amount));
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
                <m.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] dark:text-white uppercase">
                            {t('dash_stat_stock')} <span className="text-red-600">{t('dash_inventory')}</span>
                        </h1>
                        <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">{t('dash_inventory_desc')}</p>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-2xl h-12 px-6 border-[#1b1b18]/10 dark:border-white/10 font-bold uppercase tracking-widest text-[10px]">
                            <History className="mr-2 size-4" />
                            {t('dash_logs')}
                        </Button>
                        <Button onClick={openAddModal} className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-6 h-12 font-bold uppercase tracking-widest text-xs shadow-lg shadow-red-600/20 transition-all hover:scale-105 active:scale-95">
                            <Plus className="mr-2 size-4" />
                            {t('dash_add_part')}
                        </Button>
                    </div>
                </m.div>

                {/* Stats Summary */}
                <m.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-[#1b1b18]/5 dark:border-white/5 shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                            <Layers className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-widest">{t('dash_total_items')}</p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">{totalItems}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-[#1b1b18]/5 dark:border-white/5 shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                            <AlertTriangle className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-widest">{t('dash_low_stock')}</p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">{lowStockItems} Items</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-[#1b1b18]/5 dark:border-white/5 shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600">
                            <Tag className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-widest">{t('dash_total_value')}</p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">{formatCurrency(totalValue)}</p>
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
                                    {t('dash_filter')}: {statusFilter === 'All' ? t('dash_filter_all') : statusFilter}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-2xl border-[#1b1b18]/5 dark:border-white/5 shadow-xl">
                                <DropdownMenuItem onClick={() => setStatusFilter('All')} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_filter_all')}</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('Normal')} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">Normal</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('Low')} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">Low</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter('Out of Stock')} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">Out of Stock</DropdownMenuItem>
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
                                <DropdownMenuItem onClick={() => setSortConfig({ key: 'name', direction: 'asc' })} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_sort_name')} (A-Z)</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortConfig({ key: 'name', direction: 'desc' })} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_sort_name')} (Z-A)</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortConfig({ key: 'stock', direction: 'desc' })} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_sort_stock')} (High-Low)</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortConfig({ key: 'stock', direction: 'asc' })} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_sort_stock')} (Low-High)</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortConfig({ key: 'price', direction: 'desc' })} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_sort_price')} (High-Low)</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortConfig({ key: 'price', direction: 'asc' })} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">{t('dash_sort_price')} (Low-High)</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </m.div>

                {/* Inventory Table */}
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
                                            {t('dash_col_item_name')}
                                            {getSortIcon('name')}
                                        </div>
                                    </th>
                                    <th 
                                        onClick={() => handleSort('category')}
                                        className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 cursor-pointer group hover:bg-[#1b1b18]/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {t('dash_part_type')}
                                            {getSortIcon('category')}
                                        </div>
                                    </th>
                                    <th 
                                        onClick={() => handleSort('stock')}
                                        className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 cursor-pointer group hover:bg-[#1b1b18]/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {t('dash_col_stock_status')}
                                            {getSortIcon('stock')}
                                        </div>
                                    </th>
                                    <th 
                                        onClick={() => handleSort('price')}
                                        className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 cursor-pointer group hover:bg-[#1b1b18]/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {t('dash_col_price')}
                                            {getSortIcon('price')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 text-center">
                                        {t('dash_public_visibility')}
                                    </th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1b1b18]/5 dark:divide-white/5">
                                {filteredInventory.length > 0 ? filteredInventory.map((item) => (
                                    <tr key={item.id} className="group transition-colors hover:bg-[#1b1b18]/1 dark:hover:bg-white/1">
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-mono font-bold text-[#1b1b18]/40 dark:text-white/40">SP-{item.id}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                {item.image_url ? (
                                                    <img src={item.image_url} alt={item.nama_sparepart} className="w-10 h-10 rounded-lg object-cover" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-[#1b1b18]/5 dark:bg-white/5 flex items-center justify-center">
                                                        <Package className="size-5 text-[#1b1b18]/30 dark:text-white/30" />
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-[#1b1b18] dark:text-white leading-tight">{item.nama_sparepart}</span>
                                                    <span className="text-[10px] text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-wider">{item.tipe_sparepart}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm text-[#1b1b18]/70 dark:text-white/70">{item.tipe_sparepart}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            {getStockBadge(item.stock_sparepart)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-black text-[#1b1b18] dark:text-white">{formatCurrency(item.harga_sparepart)}</span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <Badge variant="outline" className={`gap-1 px-2 py-0.5 font-bold uppercase tracking-widest text-[9px] ${item.is_public ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-[#1b1b18]/10 text-[#1b1b18]/50 dark:bg-white/10 dark:text-white/50 border-transparent'}`}>
                                                {item.is_public ? t('dash_show_in_public') : t('dash_hide_from_public')}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="rounded-lg p-2 text-[#1b1b18]/20 hover:bg-[#1b1b18]/5 hover:text-[#1b1b18] dark:text-white/20 dark:hover:bg-white/5 dark:hover:text-white transition-all">
                                                        <MoreHorizontal className="size-4" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-2xl border-[#1b1b18]/5 dark:border-white/5 shadow-xl">
                                                    <DropdownMenuItem onClick={() => openEditModal(item)} className="rounded-xl focus:bg-red-600 focus:text-white font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">
                                                        <Edit3 className="mr-2 size-3" />
                                                        {t('dash_edit_details')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => openDeleteModal(item)} className="rounded-xl focus:bg-red-600 focus:text-white font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer text-red-600">
                                                        <Trash2 className="mr-2 size-3" />
                                                        {t('dash_delete_item')}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-2 opacity-20">
                                                <Package className="size-12" />
                                                <p className="text-lg font-black uppercase tracking-tighter">{t('dash_no_items')}</p>
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
                {isAddEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddEditModalOpen(false)}
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
                                    {editingPart ? t('dash_edit_info') : t('dash_add_part')}
                                </h2>
                                <button 
                                    onClick={() => setIsAddEditModalOpen(false)}
                                    className="rounded-full p-2 text-[#1b1b18]/40 hover:bg-[#1b1b18]/5 dark:text-white/40 dark:hover:bg-white/5"
                                >
                                    <X className="size-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Image (Optional)</label>
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="group relative flex h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-[#1b1b18]/10 bg-[#1b1b18]/5 transition-all hover:border-red-600 hover:bg-red-600/5 dark:border-white/10 dark:bg-white/5 dark:hover:border-red-600 dark:hover:bg-red-600/5"
                                    >
                                        <input 
                                            type="file" 
                                            ref={fileInputRef}
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={(e) => setData('image_file', e.target.files?.[0] || null)}
                                        />
                                        {data.image_file ? (
                                            <div className="flex h-full flex-col items-center justify-center gap-2">
                                                <CheckCircle2 className="size-10 text-green-500" />
                                                <p className="text-xs font-bold text-green-600">{data.image_file.name}</p>
                                            </div>
                                        ) : editingPart && editingPart.image_url ? (
                                            <div className="relative w-full h-full">
                                                <img src={editingPart.image_url} className="w-full h-full object-cover opacity-50" />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-[#1b1b18] dark:text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 dark:bg-black/20 backdrop-blur-sm">
                                                    <Upload className="size-8 mb-2" />
                                                    Change Image
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex h-full flex-col items-center justify-center gap-2 text-[#1b1b18]/40">
                                                <Upload className="size-10" />
                                                <p className="text-xs font-bold uppercase tracking-widest">Click to browse</p>
                                            </div>
                                        )}
                                    </div>
                                    {errors.image_file && <span className="text-xs text-red-600">{errors.image_file}</span>}
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">{t('dash_part_name')}</label>
                                            <Input 
                                                value={data.nama_sparepart}
                                                onChange={e => setData('nama_sparepart', e.target.value)}
                                                className="rounded-2xl h-12 bg-[#1b1b18]/5 dark:bg-white/5 border-transparent"
                                                required
                                            />
                                            {errors.nama_sparepart && <span className="text-xs text-red-600">{errors.nama_sparepart}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">{t('dash_part_type')}</label>
                                            <Input 
                                                value={data.tipe_sparepart}
                                                onChange={e => setData('tipe_sparepart', e.target.value)}
                                                className="rounded-2xl h-12 bg-[#1b1b18]/5 dark:bg-white/5 border-transparent"
                                                required
                                            />
                                            {errors.tipe_sparepart && <span className="text-xs text-red-600">{errors.tipe_sparepart}</span>}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">{t('dash_col_price')}</label>
                                            <Input 
                                                type="number"
                                                value={data.harga_sparepart}
                                                onChange={e => setData('harga_sparepart', e.target.value)}
                                                className="rounded-2xl h-12 bg-[#1b1b18]/5 dark:bg-white/5 border-transparent"
                                                required
                                            />
                                            {errors.harga_sparepart && <span className="text-xs text-red-600">{errors.harga_sparepart}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">{t('dash_stock_amount')}</label>
                                            <Input 
                                                type="number"
                                                value={data.stock_sparepart}
                                                onChange={e => setData('stock_sparepart', e.target.value)}
                                                className="rounded-2xl h-12 bg-[#1b1b18]/5 dark:bg-white/5 border-transparent"
                                                required
                                            />
                                            {errors.stock_sparepart && <span className="text-xs text-red-600">{errors.stock_sparepart}</span>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">{t('dash_description')}</label>
                                        <Input 
                                            value={data.keterangan}
                                            onChange={e => setData('keterangan', e.target.value)}
                                            className="rounded-2xl h-12 bg-[#1b1b18]/5 dark:bg-white/5 border-transparent"
                                        />
                                        {errors.keterangan && <span className="text-xs text-red-600">{errors.keterangan}</span>}
                                    </div>

                                    <div className="flex items-center space-x-2 bg-[#1b1b18]/2 dark:bg-white/2 p-4 rounded-2xl border border-[#1b1b18]/5 dark:border-white/5">
                                        <Checkbox 
                                            id="is_public" 
                                            checked={data.is_public}
                                            onCheckedChange={(checked) => setData('is_public', checked as boolean)}
                                        />
                                        <Label htmlFor="is_public" className="text-sm font-bold cursor-pointer">
                                            {t('dash_show_in_public')}
                                        </Label>
                                    </div>
                                    {errors.is_public && <span className="text-xs text-red-600">{errors.is_public}</span>}
                                </div>

                                <button 
                                    disabled={processing}
                                    className="flex w-full h-14 items-center justify-center gap-2 rounded-2xl bg-[#1b1b18] text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-black dark:bg-white dark:text-[#1b1b18] disabled:opacity-50"
                                >
                                    {processing ? (
                                        <Loader2 className="size-5 animate-spin" />
                                    ) : (
                                        <>
                                            <PackagePlus className="size-5" />
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
                                You are about to delete <span className="font-bold text-[#1b1b18] dark:text-white">{deletingPart?.nama_sparepart}</span>. This action cannot be undone.
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
