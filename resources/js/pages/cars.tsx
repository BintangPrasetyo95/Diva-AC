import { Head } from '@inertiajs/react';
import { m, Variants, LazyMotion, domAnimation } from 'framer-motion';
import {
    Car,
    Search,
    User,
    Calendar,
    Wrench,
    ArrowUpDown,
    Filter,
} from 'lucide-react';
import React from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Sparepart {
    id: number;
    nama_sparepart: string;
    pivot: {
        jumlah: number;
        harga_satuan: number;
    };
}

interface Service {
    id: number;
    tanggal_service: string;
    tipe_service: string;
    total_service: number;
    status_service: 'menunggu' | 'proses' | 'selesai';
    catatan: string | null;
    spareparts: Sparepart[];
}

interface Customer {
    id: number;
    nama_pelanggan: string;
    no_telp: string;
}

interface Mobil {
    id: number;
    merk: string;
    model: string | null;
    tahun: number | null;
    no_polisi: string;
    warna: string | null;
    keterangan: string | null;
    pelanggan: Customer;
    services: Service[];
    created_at?: string;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0, opacity: 1,
        transition: { type: "spring", stiffness: 100, damping: 12 }
    }
};

export default function CarsPage({ cars }: { cars: Mobil[] }) {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const filteredCars = cars
        .filter(c => {
            const searchLower = searchQuery.toLowerCase();
            return (
                c.no_polisi.toLowerCase().includes(searchLower) ||
                c.merk.toLowerCase().includes(searchLower) ||
                (c.model && c.model.toLowerCase().includes(searchLower)) ||
                c.pelanggan.nama_pelanggan.toLowerCase().includes(searchLower) ||
                String(c.id).includes(searchLower)
            );
        })
        .sort((a, b) => {
            const direction = sortConfig.direction === 'asc' ? 1 : -1;
            if (sortConfig.key === 'date') {
                const dateA = new Date(a.created_at || 0).getTime();
                const dateB = new Date(b.created_at || 0).getTime();
                return (dateA - dateB) * direction;
            }
            if (sortConfig.key === 'plate') {
                return a.no_polisi.localeCompare(b.no_polisi) * direction;
            }
            if (sortConfig.key === 'merk') {
                return a.merk.localeCompare(b.merk) * direction;
            }
            if (sortConfig.key === 'customer') {
                return a.pelanggan.nama_pelanggan.localeCompare(b.pelanggan.nama_pelanggan) * direction;
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

    const totalCars = cars.length;
    const carsWithService = cars.filter(c => c.services && c.services.length > 0).length;

    return (
        <LazyMotion features={domAnimation}>
            <Head title="Cars Database" />

            <m.div initial="hidden" animate="visible" variants={containerVariants} className="flex flex-col gap-8 p-6 lg:p-8">
                {/* Header Section */}
                <m.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] dark:text-white uppercase">
                            CARS <span className="text-red-600">{t('dash_database')}</span>
                        </h1>
                        <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">Manage registered vehicles and view their service history.</p>
                    </div>
                </m.div>

                {/* Stats Summary */}
                <m.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-[#1b1b18]/5 dark:border-white/5 shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                            <Car className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-widest">{t('dash_total_vehicles')}</p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">{totalCars}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#121212] p-6 rounded-3xl border border-[#1b1b18]/5 dark:border-white/5 shadow-sm flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600">
                            <Wrench className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-widest">Serviced Vehicles</p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">{carsWithService}</p>
                        </div>
                    </div>
                </m.div>

                {/* Filters & Search */}
                <m.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center justify-between bg-white dark:bg-[#121212] p-4 rounded-3xl border border-[#1b1b18]/5 dark:border-white/5 shadow-sm">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#1b1b18]/30 dark:text-white/30" />
                        <Input 
                            placeholder={t('dash_search')} 
                            className="pl-11 h-12 bg-[#1b1b18]/2 dark:bg-white/2 border-none rounded-2xl focus-visible:ring-1 focus-visible:ring-red-600/50 uppercase"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
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
                                <DropdownMenuItem onClick={() => setSortConfig({ key: 'plate', direction: 'asc' })} className="rounded-xl font-bold text-xs uppercase tracking-widest px-4 py-3 cursor-pointer">No Polisi (A-Z)</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </m.div>

                {/* Cars Table */}
                <m.div variants={itemVariants} className="overflow-hidden rounded-3xl border border-[#1b1b18]/5 bg-white shadow-sm dark:border-white/5 dark:bg-[#121212]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#1b1b18]/2 dark:bg-white/2 border-b border-[#1b1b18]/5 dark:border-white/5">
                                <tr>
                                    <th onClick={() => handleSort('plate')} className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 cursor-pointer group hover:bg-[#1b1b18]/5 transition-colors">
                                        <div className="flex items-center gap-2">Vehicle Info {getSortIcon('plate')}</div>
                                    </th>
                                    <th onClick={() => handleSort('customer')} className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 cursor-pointer group hover:bg-[#1b1b18]/5 transition-colors">
                                        <div className="flex items-center gap-2">Owner {getSortIcon('customer')}</div>
                                    </th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">
                                        Service History
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1b1b18]/5 dark:divide-white/5">
                                {filteredCars.length > 0 ? filteredCars.map((car) => (
                                    <tr key={car.id} className="group transition-colors hover:bg-[#1b1b18]/1 dark:hover:bg-white/1 align-top">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-red-600/10 dark:bg-red-600/20 flex items-center justify-center">
                                                    <Car className="size-5 text-red-600" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-[#1b1b18] dark:text-white">{car.merk} {car.model}</span>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="text-[10px] font-mono border-red-600/20 text-red-600 uppercase">
                                                            {car.no_polisi}
                                                        </Badge>
                                                        {car.tahun && <span className="text-[10px] text-[#1b1b18]/40 dark:text-white/40">{car.tahun}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#1b1b18] dark:text-white">{car.pelanggan.nama_pelanggan}</span>
                                                <span className="text-[10px] text-[#1b1b18]/40 dark:text-white/40 mt-1">{car.pelanggan.no_telp}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {car.services && car.services.length > 0 ? (
                                                <div className="flex flex-col gap-3">
                                                    {car.services.map(service => (
                                                        <div key={service.id} className="rounded-xl border border-[#1b1b18]/5 dark:border-white/5 p-3 bg-[#1b1b18]/2 dark:bg-white/2">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-xs font-bold uppercase tracking-widest text-[#1b1b18]/60 dark:text-white/60 flex items-center gap-1">
                                                                    <Calendar className="size-3" />
                                                                    {new Date(service.tanggal_service).toLocaleDateString('id-ID')}
                                                                </span>
                                                                <Badge className={
                                                                    service.status_service === 'selesai' ? 'bg-green-500' :
                                                                    service.status_service === 'proses' ? 'bg-blue-500' : 'bg-orange-500'
                                                                }>
                                                                    {service.status_service}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-[11px] text-[#1b1b18] dark:text-white font-medium mb-1">
                                                                Type: {service.tipe_service.replace(/_/g, ' ').toUpperCase()}
                                                            </p>
                                                            {service.catatan && (
                                                                <p className="text-[10px] text-[#1b1b18]/60 dark:text-white/60 mb-2 italic">"{service.catatan}"</p>
                                                            )}
                                                            <div className="flex items-center justify-between border-t border-[#1b1b18]/5 dark:border-white/5 pt-2 mt-2">
                                                                <span className="text-[10px] font-bold uppercase text-[#1b1b18]/40">Total</span>
                                                                <span className="text-xs font-black text-red-600">{formatCurrency(service.total_service)}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-[11px] font-medium text-[#1b1b18]/40 dark:text-white/40 italic">No service history found</span>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-2 opacity-20">
                                                <Car className="size-12" />
                                                <p className="text-lg font-black uppercase tracking-tighter">No cars found</p>
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

CarsPage.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Customers', href: '/admin/customers' },
        { title: 'Cars', href: '/admin/cars' },
    ],
};
