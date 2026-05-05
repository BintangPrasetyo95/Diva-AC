import { Head } from '@inertiajs/react';
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
    PackagePlus
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

// Mock Data for Spare Parts
const inventory = [
    { id: 'SP-001', name: 'Compressor R134a', type: 'Compressor', price: 'Rp 2.500.000', stock: 2, status: 'Critical', category: 'AC System' },
    { id: 'SP-002', name: 'Cabin Filter (Alphard)', type: 'Filter', price: 'Rp 150.000', stock: 4, status: 'Low', category: 'Maintenance' },
    { id: 'SP-003', name: 'Freon R134a 1kg', type: 'Refrigerant', price: 'Rp 120.000', stock: 0, status: 'Out of Stock', category: 'Chemicals' },
    { id: 'SP-004', name: 'Condenser Universal', type: 'Condenser', price: 'Rp 850.000', stock: 12, status: 'Normal', category: 'AC System' },
    { id: 'SP-005', name: 'Expansion Valve', type: 'Valve', price: 'Rp 450.000', stock: 8, status: 'Normal', category: 'AC System' },
    { id: 'SP-006', name: 'Blower Motor', type: 'Motor', price: 'Rp 650.000', stock: 3, status: 'Low', category: 'AC System' },
    { id: 'SP-007', name: 'Magnetic Clutch', type: 'Clutch', price: 'Rp 950.000', stock: 15, status: 'Normal', category: 'AC System' },
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

export default function InventoryPage() {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('All');
    const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });

    const getStockBadge = (stock: number, status: string) => {
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

    const filteredInventory = inventory
        .filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 item.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            const direction = sortConfig.direction === 'asc' ? 1 : -1;
            if (sortConfig.key === 'stock') {
                return (a.stock - b.stock) * direction;
            }
            if (sortConfig.key === 'price') {
                const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
                const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
                return (priceA - priceB) * direction;
            }
            if (sortConfig.key === 'name') {
                return a.name.localeCompare(b.name) * direction;
            }
            return 0;
        });

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
                        <Button className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-6 h-12 font-bold uppercase tracking-widest text-xs shadow-lg shadow-red-600/20 transition-all hover:scale-105 active:scale-95">
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
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">124</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-[#1b1b18]/5 dark:border-white/5 shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600">
                            <AlertTriangle className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-widest">{t('dash_low_stock')}</p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">8 Items</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-[#1b1b18]/5 dark:border-white/5 shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600">
                            <Tag className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-widest">{t('dash_total_value')}</p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">Rp 84.5M</p>
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
                                <DropdownMenuItem onClick={() => setStatusFilter('Critical')} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">Critical</DropdownMenuItem>
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
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('dash_col_id')}</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('dash_col_item_name')}</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('dash_col_category')}</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('dash_col_stock_status')}</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('dash_col_price')}</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1b1b18]/5 dark:divide-white/5">
                                {filteredInventory.length > 0 ? filteredInventory.map((item) => (
                                    <tr key={item.id} className="group transition-colors hover:bg-[#1b1b18]/1 dark:hover:bg-white/1">
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-mono font-bold text-[#1b1b18]/40 dark:text-white/40">{item.id}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#1b1b18] dark:text-white leading-tight">{item.name}</span>
                                                <span className="text-[10px] text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-wider">{item.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm text-[#1b1b18]/70 dark:text-white/70">{item.category}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            {getStockBadge(item.stock, item.status)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-black text-[#1b1b18] dark:text-white">{item.price}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="rounded-lg p-2 text-[#1b1b18]/20 hover:bg-[#1b1b18]/5 hover:text-[#1b1b18] dark:text-white/20 dark:hover:bg-white/5 dark:hover:text-white transition-all">
                                                        <MoreHorizontal className="size-4" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-2xl border-[#1b1b18]/5 dark:border-white/5 shadow-xl">
                                                    <DropdownMenuItem className="rounded-xl focus:bg-red-600 focus:text-white font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">
                                                        <Edit3 className="mr-2 size-3" />
                                                        {t('dash_edit_details')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl focus:bg-red-600 focus:text-white font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">
                                                        <PackagePlus className="mr-2 size-3" />
                                                        {t('dash_update_stock')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="rounded-xl focus:bg-red-600 focus:text-white font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer text-red-600">
                                                        <Trash2 className="mr-2 size-3" />
                                                        {t('dash_delete_item')}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
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
