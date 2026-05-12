import { Head, useForm } from '@inertiajs/react';
import { m, Variants, LazyMotion, domAnimation } from 'framer-motion';
import {
    Car,
    Search,
    User,
    Calendar,
    Wrench,
    ArrowUpDown,
    Filter,
    Plus,
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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

interface CustomerOption {
    id: number;
    name: string;
    telp: string;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 100, damping: 12 },
    },
};

export default function CarsPage({
    cars,
    customers,
}: {
    cars: Mobil[];
    customers: CustomerOption[];
}) {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [sortConfig, setSortConfig] = React.useState<{
        key: string;
        direction: 'asc' | 'desc';
    }>({ key: 'date', direction: 'desc' });
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isNewUser, setIsNewUser] = React.useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            id_pelanggan: '',
            nama_pelanggan: '',
            no_telp: '',
            email: '',
            jenis_kelamin: 'L',
            alamat: '',
            merk: '',
            model: '',
            tahun: '',
            no_polisi: '',
            warna: '',
            keterangan: '',
        });

    React.useEffect(() => {
        if (!isDialogOpen) {
            reset();
            clearErrors();
            setIsNewUser(false);
        }
    }, [isDialogOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const routeName = isNewUser ? '/admin/cars/with-user' : '/admin/cars';

        post(routeName, {
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
                toast.success('Car successfully created');
            },
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const filteredCars = cars
        .filter((c) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                c.no_polisi.toLowerCase().includes(searchLower) ||
                c.merk.toLowerCase().includes(searchLower) ||
                (c.model && c.model.toLowerCase().includes(searchLower)) ||
                c.pelanggan.nama_pelanggan
                    .toLowerCase()
                    .includes(searchLower) ||
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
                return (
                    a.pelanggan.nama_pelanggan.localeCompare(
                        b.pelanggan.nama_pelanggan,
                    ) * direction
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

    const totalCars = cars.length;
    const carsWithService = cars.filter(
        (c) => c.services && c.services.length > 0,
    ).length;

    return (
        <LazyMotion features={domAnimation}>
            <Head title="Cars Database" />

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
                            CARS{' '}
                            <span className="text-red-600">
                                {t('dash_database')}
                            </span>
                        </h1>
                        <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">
                            Manage registered vehicles and view their service
                            history.
                        </p>
                    </div>
                </m.div>

                {/* Stats Summary */}
                <m.div
                    variants={itemVariants}
                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                >
                    <div className="flex items-center gap-4 rounded-3xl border border-[#1b1b18]/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#121212]">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                            <Car className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                {t('dash_total_vehicles')}
                            </p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">
                                {totalCars}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-3xl border border-[#1b1b18]/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#121212]">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-600">
                            <Wrench className="size-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                Serviced Vehicles
                            </p>
                            <p className="text-2xl font-black text-[#1b1b18] dark:text-white">
                                {carsWithService}
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
                            className="h-12 rounded-2xl border-none bg-[#1b1b18]/2 pl-11 uppercase focus-visible:ring-1 focus-visible:ring-red-600/50 dark:bg-white/2"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button className="h-12 rounded-2xl bg-red-600 px-5 text-[10px] font-bold tracking-widest text-white uppercase hover:bg-red-700">
                                    <Plus className="mr-2 size-4" />
                                    Create Mobil
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Car</DialogTitle>
                                    <DialogDescription>
                                        Add a new car to the database. You can
                                        assign it to an existing customer or
                                        create a new one.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="mt-2 mb-4 flex items-center gap-4">
                                    <Button
                                        type="button"
                                        variant={
                                            !isNewUser ? 'default' : 'outline'
                                        }
                                        onClick={() => setIsNewUser(false)}
                                        className={`flex-1 rounded-xl text-xs font-bold tracking-widest uppercase ${!isNewUser ? 'bg-[#1b1b18] text-white dark:bg-white dark:text-[#1b1b18]' : ''}`}
                                    >
                                        Existing Customer
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={
                                            isNewUser ? 'default' : 'outline'
                                        }
                                        onClick={() => setIsNewUser(true)}
                                        className={`flex-1 rounded-xl text-xs font-bold tracking-widest uppercase ${isNewUser ? 'bg-[#1b1b18] text-white dark:bg-white dark:text-[#1b1b18]' : ''}`}
                                    >
                                        New Customer
                                    </Button>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    {!isNewUser ? (
                                        <div className="space-y-2">
                                            <Label>Select Customer</Label>
                                            <Select
                                                value={data.id_pelanggan}
                                                onValueChange={(val) =>
                                                    setData('id_pelanggan', val)
                                                }
                                            >
                                                <SelectTrigger className="h-12 rounded-xl">
                                                    <SelectValue placeholder="Select an existing customer" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {customers?.map((c) => (
                                                        <SelectItem
                                                            key={c.id}
                                                            value={c.id.toString()}
                                                        >
                                                            {c.name} ({c.telp})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.id_pelanggan && (
                                                <p className="text-xs text-red-500">
                                                    {errors.id_pelanggan}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2 space-y-2 md:col-span-1">
                                                <Label>Customer Name</Label>
                                                <Input
                                                    value={data.nama_pelanggan}
                                                    onChange={(e) =>
                                                        setData(
                                                            'nama_pelanggan',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-12 rounded-xl"
                                                />
                                                {errors.nama_pelanggan && (
                                                    <p className="text-xs text-red-500">
                                                        {errors.nama_pelanggan}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="col-span-2 space-y-2 md:col-span-1">
                                                <Label>Phone Number</Label>
                                                <Input
                                                    value={data.no_telp}
                                                    onChange={(e) =>
                                                        setData(
                                                            'no_telp',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-12 rounded-xl"
                                                />
                                                {errors.no_telp && (
                                                    <p className="text-xs text-red-500">
                                                        {errors.no_telp}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="col-span-2 space-y-2 md:col-span-1">
                                                <Label>Email</Label>
                                                <Input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        setData(
                                                            'email',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-12 rounded-xl"
                                                />
                                                {errors.email && (
                                                    <p className="text-xs text-red-500">
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="col-span-2 space-y-2 md:col-span-1">
                                                <Label>Gender</Label>
                                                <Select
                                                    value={data.jenis_kelamin}
                                                    onValueChange={(val) =>
                                                        setData(
                                                            'jenis_kelamin',
                                                            val,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="h-12 rounded-xl">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="L">
                                                            Male (Laki-laki)
                                                        </SelectItem>
                                                        <SelectItem value="P">
                                                            Female (Perempuan)
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.jenis_kelamin && (
                                                    <p className="text-xs text-red-500">
                                                        {errors.jenis_kelamin}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <Label>Address</Label>
                                                <Input
                                                    value={data.alamat}
                                                    onChange={(e) =>
                                                        setData(
                                                            'alamat',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-12 rounded-xl"
                                                />
                                                {errors.alamat && (
                                                    <p className="text-xs text-red-500">
                                                        {errors.alamat}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-4 border-t border-[#1b1b18]/10 pt-4 dark:border-white/10">
                                        <h3 className="mb-4 text-sm font-bold uppercase">
                                            Car Details
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Brand (Merk)</Label>
                                                <Input
                                                    value={data.merk}
                                                    onChange={(e) =>
                                                        setData(
                                                            'merk',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="e.g. Toyota"
                                                    className="h-12 rounded-xl"
                                                />
                                                {errors.merk && (
                                                    <p className="text-xs text-red-500">
                                                        {errors.merk}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Model</Label>
                                                <Input
                                                    value={data.model}
                                                    onChange={(e) =>
                                                        setData(
                                                            'model',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="e.g. Avanza"
                                                    className="h-12 rounded-xl"
                                                />
                                                {errors.model && (
                                                    <p className="text-xs text-red-500">
                                                        {errors.model}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>
                                                    License Plate (No Polisi)
                                                </Label>
                                                <Input
                                                    value={data.no_polisi}
                                                    onChange={(e) =>
                                                        setData(
                                                            'no_polisi',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="e.g. B 1234 CD"
                                                    className="h-12 rounded-xl uppercase"
                                                />
                                                {errors.no_polisi && (
                                                    <p className="text-xs text-red-500">
                                                        {errors.no_polisi}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Year (Tahun)</Label>
                                                <Input
                                                    type="number"
                                                    value={data.tahun}
                                                    onChange={(e) =>
                                                        setData(
                                                            'tahun',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="e.g. 2020"
                                                    className="h-12 rounded-xl"
                                                />
                                                {errors.tahun && (
                                                    <p className="text-xs text-red-500">
                                                        {errors.tahun}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Color (Warna)</Label>
                                                <Input
                                                    value={data.warna}
                                                    onChange={(e) =>
                                                        setData(
                                                            'warna',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="e.g. Black"
                                                    className="h-12 rounded-xl"
                                                />
                                                {errors.warna && (
                                                    <p className="text-xs text-red-500">
                                                        {errors.warna}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>
                                                    Notes (Keterangan)
                                                </Label>
                                                <Input
                                                    value={data.keterangan}
                                                    onChange={(e) =>
                                                        setData(
                                                            'keterangan',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-12 rounded-xl"
                                                />
                                                {errors.keterangan && (
                                                    <p className="text-xs text-red-500">
                                                        {errors.keterangan}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-12 rounded-xl bg-[#1b1b18] px-8 font-bold tracking-widest text-white uppercase hover:bg-[#1b1b18]/80 dark:bg-white dark:text-[#1b1b18] dark:hover:bg-white/80"
                                        >
                                            {processing
                                                ? 'Saving...'
                                                : 'Save Car'}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>

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
                                            key: 'plate',
                                            direction: 'asc',
                                        })
                                    }
                                    className="cursor-pointer rounded-xl px-4 py-3 text-xs font-bold tracking-widest uppercase"
                                >
                                    No Polisi (A-Z)
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </m.div>

                {/* Cars Table */}
                <m.div
                    variants={itemVariants}
                    className="overflow-hidden rounded-3xl border border-[#1b1b18]/5 bg-white shadow-sm dark:border-white/5 dark:bg-[#121212]"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-[#1b1b18]/5 bg-[#1b1b18]/2 dark:border-white/5 dark:bg-white/2">
                                <tr>
                                    <th
                                        onClick={() => handleSort('plate')}
                                        className="group cursor-pointer px-6 py-5 text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase transition-colors hover:bg-[#1b1b18]/5 dark:text-white/40"
                                    >
                                        <div className="flex items-center gap-2">
                                            Vehicle Info {getSortIcon('plate')}
                                        </div>
                                    </th>
                                    <th
                                        onClick={() => handleSort('customer')}
                                        className="group cursor-pointer px-6 py-5 text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase transition-colors hover:bg-[#1b1b18]/5 dark:text-white/40"
                                    >
                                        <div className="flex items-center gap-2">
                                            Owner {getSortIcon('customer')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-5 text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                        Service History
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1b1b18]/5 dark:divide-white/5">
                                {filteredCars.length > 0 ? (
                                    filteredCars.map((car) => (
                                        <tr
                                            key={car.id}
                                            className="group align-top transition-colors hover:bg-[#1b1b18]/1 dark:hover:bg-white/1"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-10 items-center justify-center rounded-full bg-red-600/10 dark:bg-red-600/20">
                                                        <Car className="size-5 text-red-600" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-[#1b1b18] dark:text-white">
                                                            {car.merk}{' '}
                                                            {car.model}
                                                        </span>
                                                        <div className="mt-1 flex items-center gap-2">
                                                            <Badge
                                                                variant="outline"
                                                                className="border-red-600/20 font-mono text-[10px] text-red-600 uppercase"
                                                            >
                                                                {car.no_polisi}
                                                            </Badge>
                                                            {car.tahun && (
                                                                <span className="text-[10px] text-[#1b1b18]/40 dark:text-white/40">
                                                                    {car.tahun}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-[#1b1b18] dark:text-white">
                                                        {
                                                            car.pelanggan
                                                                .nama_pelanggan
                                                        }
                                                    </span>
                                                    <span className="mt-1 text-[10px] text-[#1b1b18]/40 dark:text-white/40">
                                                        {car.pelanggan.no_telp}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                {car.services &&
                                                car.services.length > 0 ? (
                                                    <div className="flex flex-col gap-3">
                                                        {car.services.map(
                                                            (service) => (
                                                                <div
                                                                    key={
                                                                        service.id
                                                                    }
                                                                    className="rounded-xl border border-[#1b1b18]/5 bg-[#1b1b18]/2 p-3 dark:border-white/5 dark:bg-white/2"
                                                                >
                                                                    <div className="mb-2 flex items-center justify-between">
                                                                        <span className="flex items-center gap-1 text-xs font-bold tracking-widest text-[#1b1b18]/60 uppercase dark:text-white/60">
                                                                            <Calendar className="size-3" />
                                                                            {new Date(
                                                                                service.tanggal_service,
                                                                            ).toLocaleDateString(
                                                                                'id-ID',
                                                                            )}
                                                                        </span>
                                                                        <Badge
                                                                            className={
                                                                                service.status_service ===
                                                                                'selesai'
                                                                                    ? 'bg-green-500'
                                                                                    : service.status_service ===
                                                                                        'proses'
                                                                                      ? 'bg-blue-500'
                                                                                      : 'bg-orange-500'
                                                                            }
                                                                        >
                                                                            {
                                                                                service.status_service
                                                                            }
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="mb-1 text-[11px] font-medium text-[#1b1b18] dark:text-white">
                                                                        Type:{' '}
                                                                        {service.tipe_service
                                                                            .replace(
                                                                                /_/g,
                                                                                ' ',
                                                                            )
                                                                            .toUpperCase()}
                                                                    </p>
                                                                    {service.catatan && (
                                                                        <p className="mb-2 text-[10px] text-[#1b1b18]/60 italic dark:text-white/60">
                                                                            "
                                                                            {
                                                                                service.catatan
                                                                            }
                                                                            "
                                                                        </p>
                                                                    )}
                                                                    <div className="mt-2 flex items-center justify-between border-t border-[#1b1b18]/5 pt-2 dark:border-white/5">
                                                                        <span className="text-[10px] font-bold text-[#1b1b18]/40 uppercase">
                                                                            Total
                                                                        </span>
                                                                        <span className="text-xs font-black text-red-600">
                                                                            {formatCurrency(
                                                                                service.total_service,
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-[11px] font-medium text-[#1b1b18]/40 italic dark:text-white/40">
                                                        No service history found
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-6 py-20 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2 opacity-20">
                                                <Car className="size-12" />
                                                <p className="text-lg font-black tracking-tighter uppercase">
                                                    No cars found
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
