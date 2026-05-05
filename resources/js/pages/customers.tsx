import { Head } from '@inertiajs/react';
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
    User
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

// Mock Data for Customers
const customers = [
    { id: 'C-001', name: 'Budi Santoso', phone: '081234567890', email: 'budi.s@example.com', gender: 'L', address: 'Jl. Sudirman No. 123, Jakarta', cars: ['Toyota Alphard (B 1234 ABC)'], joined: '2026-01-15' },
    { id: 'C-002', name: 'Ani Wijaya', phone: '082234567891', email: 'ani.w@example.com', gender: 'P', address: 'Jl. Thamrin No. 45, Jakarta', cars: ['Honda CR-V (B 5678 DEF)'], joined: '2026-02-10' },
    { id: 'C-003', name: 'Doni Setiawan', phone: '083234567892', email: 'doni.s@example.com', gender: 'L', address: 'Jl. Gatot Subroto No. 67, Jakarta', cars: ['BMW X5 (B 9012 GHI)', 'BMW 320i (B 3456 JKL)'], joined: '2026-03-05' },
    { id: 'C-004', name: 'Siska Putri', phone: '084234567893', email: 'siska.p@example.com', gender: 'P', address: 'Jl. Rasuna Said No. 89, Jakarta', cars: ['Mitsubishi Pajero (B 7890 MNO)'], joined: '2026-03-20' },
    { id: 'C-005', name: 'Rudi Hermawan', phone: '085234567894', email: 'rudi.h@example.com', gender: 'L', address: 'Jl. Gatot Subroto No. 12, Jakarta', cars: ['Suzuki Ertiga (B 1234 PQR)'], joined: '2026-04-12' },
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

export default function CustomersPage() {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [genderFilter, setGenderFilter] = React.useState('All');
    const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'joined', direction: 'desc' });

    const filteredCustomers = customers
        .filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 c.phone.includes(searchQuery) ||
                                 c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 c.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesGender = genderFilter === 'All' || c.gender === genderFilter;
            return matchesSearch && matchesGender;
        })
        .sort((a, b) => {
            const direction = sortConfig.direction === 'asc' ? 1 : -1;
            if (sortConfig.key === 'joined') {
                return (new Date(a.joined).getTime() - new Date(b.joined).getTime()) * direction;
            }
            if (sortConfig.key === 'name') {
                return a.name.localeCompare(b.name) * direction;
            }
            return 0;
        });

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
                        <Button className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-6 h-12 font-bold uppercase tracking-widest text-xs shadow-lg shadow-red-600/20 transition-all hover:scale-105 active:scale-95">
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
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">1,240</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-[#1b1b18]/5 dark:border-white/5 shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600">
                            <Car className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-widest">{t('dash_total_vehicles')}</p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">1,582</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-[#1b1b18]/5 dark:border-white/5 shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600">
                            <Calendar className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-widest">{t('dash_new_this_month')}</p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">45</p>
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
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('dash_col_id')}</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('dash_col_customer')} Info</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('dash_col_car')}</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('dash_col_joined_date')}</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1b1b18]/5 dark:divide-white/5">
                                {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="group transition-colors hover:bg-[#1b1b18]/1 dark:hover:bg-white/1">
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-mono font-bold text-[#1b1b18]/40 dark:text-white/40">{customer.id}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-[#1b1b18]/5 dark:bg-white/5 flex items-center justify-center">
                                                    <User className="size-5 text-[#1b1b18]/50 dark:text-white/50" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-[#1b1b18] dark:text-white leading-tight">{customer.name}</span>
                                                        <Badge variant="outline" className="text-[8px] px-1 py-0 border-[#1b1b18]/10 dark:border-white/10 uppercase tracking-tighter">
                                                            {customer.gender === 'L' ? t('dash_male') : t('dash_female')}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[10px] text-[#1b1b18]/40 dark:text-white/40 flex items-center gap-1">
                                                            <Phone className="size-3" />
                                                            {customer.phone}
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
                                                {customer.cars.map((car, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-[#1b1b18]/70 dark:text-white/70">
                                                        <Car className="size-3" />
                                                        <span className="text-[11px] font-medium">{car}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-[#1b1b18]/70 dark:text-white/70">{customer.joined}</span>
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
                                                    <DropdownMenuItem className="rounded-xl focus:bg-red-600 focus:text-white font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">
                                                        <Edit3 className="mr-2 size-3" />
                                                        {t('dash_edit_profile')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl focus:bg-red-600 focus:text-white font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">
                                                        <Car className="mr-2 size-3" />
                                                        {t('dash_manage_cars')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="rounded-xl focus:bg-red-600 focus:text-white font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer text-red-600">
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
