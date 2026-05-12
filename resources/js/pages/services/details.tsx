import { Head, Link } from '@inertiajs/react';
import { m, Variants, LazyMotion, domAnimation } from 'framer-motion';
import {
    Wrench,
    ArrowLeft,
    Printer,
    CheckCircle2,
    Clock,
    User,
    Car,
    Phone,
    Calendar,
    Settings,
    ShieldCheck,
    ChevronRight,
    MapPin,
    Package,
    CreditCard,
} from 'lucide-react';
import React from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

export default function ServiceDetails({ id }: { id: string }) {
    const { t } = useLanguage();

    // Mock Detail Data
    const service = {
        id: id || 'SRV-001',
        customer: {
            name: 'Budi Santoso',
            phone: '+62 812-3456-7890',
            address: 'Jl. Ahmad Yani No. 123, Jakarta',
            avatar: null,
        },
        vehicle: {
            model: 'Toyota Alphard',
            plate: 'B 1234 ABC',
            year: '2022',
            color: 'Black',
        },
        details: {
            type: 'Complete AC Service',
            status: 'In Progress',
            date: '2026-05-01',
            mechanic: 'Agus',
            notes: 'Customer complaints about weak cooling and unusual noise from compressor.',
        },
        items: [
            {
                name: 'Freon R134a',
                qty: 1,
                price: 'Rp 350.000',
                total: 'Rp 350.000',
            },
            {
                name: 'Compressor Oil',
                qty: 1,
                price: 'Rp 150.000',
                total: 'Rp 150.000',
            },
            {
                name: 'Cabin Filter',
                qty: 1,
                price: 'Rp 200.000',
                total: 'Rp 200.000',
            },
            {
                name: 'Service Fee',
                qty: 1,
                price: 'Rp 500.000',
                total: 'Rp 500.000',
            },
        ],
        summary: {
            subtotal: 'Rp 1.200.000',
            tax: 'Rp 0',
            total: 'Rp 1.200.000',
        },
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Completed':
                return (
                    <Badge
                        variant="outline"
                        className="gap-1.5 border-green-500/20 bg-green-500/10 px-3 py-1 text-[10px] font-bold tracking-widest text-green-600 uppercase"
                    >
                        <CheckCircle2 className="size-3.5" />
                        {t('dash_status_completed')}
                    </Badge>
                );
            case 'Pending':
                return (
                    <Badge
                        variant="outline"
                        className="gap-1.5 border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-bold tracking-widest text-amber-600 uppercase"
                    >
                        <Clock className="size-3.5" />
                        {t('dash_status_pending')}
                    </Badge>
                );
            case 'In Progress':
            default:
                return (
                    <Badge
                        variant="outline"
                        className="gap-1.5 border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-bold tracking-widest text-blue-600 uppercase"
                    >
                        <Wrench className="size-3.5" />
                        {t('dash_status_in_progress')}
                    </Badge>
                );
        }
    };

    return (
        <LazyMotion features={domAnimation}>
            <Head title={`${t('dash_service_details')} - ${service.id}`} />

            <m.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="flex flex-col gap-8 p-6 lg:p-8"
            >
                {/* Header Section */}
                <m.div
                    variants={itemVariants}
                    className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
                >
                    <div className="flex flex-col gap-4">
                        <Link
                            href="/admin/services"
                            className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase transition-colors hover:text-red-600"
                        >
                            <ArrowLeft className="size-3" />
                            {t('dash_back_to_services')}
                        </Link>
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                                {service.id}
                            </h1>
                            {getStatusBadge(service.details.status)}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="h-12 gap-2 rounded-2xl border-[#1b1b18]/10 px-6 text-[10px] font-bold tracking-widest uppercase dark:border-white/10"
                        >
                            <Printer className="size-4" />
                            {t('dash_print_invoice')}
                        </Button>
                        <Button className="h-12 gap-2 rounded-2xl bg-red-600 px-8 text-[10px] font-bold tracking-widest text-white uppercase shadow-lg shadow-red-600/20 transition-all hover:scale-105 hover:bg-red-700 active:scale-95">
                            <CheckCircle2 className="size-4" />
                            {t('dash_complete_service')}
                        </Button>
                    </div>
                </m.div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Left Column: Info Cards */}
                    <div className="flex flex-col gap-6 lg:col-span-1">
                        {/* Customer Info */}
                        <m.div
                            variants={itemVariants}
                            className="rounded-[2.5rem] border border-[#1b1b18]/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#121212]"
                        >
                            <div className="mb-6 flex items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-red-600/10">
                                    <User className="size-6 text-red-600" />
                                </div>
                                <h2 className="text-sm font-black tracking-widest text-[#1b1b18] uppercase dark:text-white">
                                    {t('dash_customer_info')}
                                </h2>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold tracking-wider text-[#1b1b18]/30 uppercase dark:text-white/30">
                                        {t('dash_col_customer')}
                                    </span>
                                    <span className="text-sm font-bold text-[#1b1b18] dark:text-white">
                                        {service.customer.name}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold tracking-wider text-[#1b1b18]/30 uppercase dark:text-white/30">
                                        {t('phone')}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Phone className="size-3 text-red-600" />
                                        <span className="text-sm font-medium text-[#1b1b18]/70 dark:text-white/70">
                                            {service.customer.phone}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold tracking-wider text-[#1b1b18]/30 uppercase dark:text-white/30">
                                        {t('form_address')}
                                    </span>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="mt-1 size-3 text-red-600" />
                                        <span className="text-sm font-medium text-[#1b1b18]/70 dark:text-white/70">
                                            {service.customer.address}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </m.div>

                        {/* Vehicle Info */}
                        <m.div
                            variants={itemVariants}
                            className="rounded-[2.5rem] border border-[#1b1b18]/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#121212]"
                        >
                            <div className="mb-6 flex items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-600/10">
                                    <Car className="size-6 text-blue-600" />
                                </div>
                                <h2 className="text-sm font-black tracking-widest text-[#1b1b18] uppercase dark:text-white">
                                    {t('dash_vehicle_info')}
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold tracking-wider text-[#1b1b18]/30 uppercase dark:text-white/30">
                                        {t('dash_col_car')}
                                    </span>
                                    <span className="text-sm font-bold text-[#1b1b18] dark:text-white">
                                        {service.vehicle.model}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold tracking-wider text-[#1b1b18]/30 uppercase dark:text-white/30">
                                        Plate
                                    </span>
                                    <span className="text-sm font-bold text-[#1b1b18] dark:text-white">
                                        {service.vehicle.plate}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold tracking-wider text-[#1b1b18]/30 uppercase dark:text-white/30">
                                        Year
                                    </span>
                                    <span className="text-sm font-bold text-[#1b1b18] dark:text-white">
                                        {service.vehicle.year}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold tracking-wider text-[#1b1b18]/30 uppercase dark:text-white/30">
                                        Color
                                    </span>
                                    <span className="text-sm font-bold text-[#1b1b18] dark:text-white">
                                        {service.vehicle.color}
                                    </span>
                                </div>
                            </div>
                        </m.div>
                    </div>

                    {/* Right Column: Service Details & Items */}
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        {/* Service Info */}
                        <m.div
                            variants={itemVariants}
                            className="rounded-[2.5rem] border border-[#1b1b18]/5 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#121212]"
                        >
                            <div className="mb-8 flex items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-600/10">
                                    <Settings className="size-6 text-amber-600" />
                                </div>
                                <h2 className="text-sm font-black tracking-widest text-[#1b1b18] uppercase dark:text-white">
                                    {t('dash_service_info')}
                                </h2>
                            </div>
                            <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold tracking-wider text-[#1b1b18]/30 uppercase dark:text-white/30">
                                        {t('service_type')}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="size-4 text-red-600" />
                                        <span className="text-sm font-black text-[#1b1b18] dark:text-white">
                                            {service.details.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold tracking-wider text-[#1b1b18]/30 uppercase dark:text-white/30">
                                        {t('dash_col_mechanic')}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Wrench className="size-4 text-[#1b1b18]/40 dark:text-white/40" />
                                        <span className="text-sm font-bold text-[#1b1b18] dark:text-white">
                                            {service.details.mechanic}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold tracking-wider text-[#1b1b18]/30 uppercase dark:text-white/30">
                                        {t('date')}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="size-4 text-[#1b1b18]/40 dark:text-white/40" />
                                        <span className="text-sm font-bold text-[#1b1b18] dark:text-white">
                                            {service.details.date}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 rounded-2xl border border-[#1b1b18]/5 bg-[#1b1b18]/2 p-4 dark:border-white/5 dark:bg-white/2">
                                <span className="text-[10px] font-bold tracking-wider text-[#1b1b18]/30 uppercase dark:text-white/30">
                                    {t('notes')}
                                </span>
                                <p className="text-sm text-[#1b1b18]/70 italic dark:text-white/70">
                                    "{service.details.notes}"
                                </p>
                            </div>
                        </m.div>

                        {/* Items Summary Table */}
                        <m.div
                            variants={itemVariants}
                            className="overflow-hidden rounded-[2.5rem] border border-[#1b1b18]/5 bg-white shadow-sm dark:border-white/5 dark:bg-[#121212]"
                        >
                            <div className="flex items-center justify-between border-b border-[#1b1b18]/5 p-8 dark:border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-600/10">
                                        <Package className="size-6 text-purple-600" />
                                    </div>
                                    <h2 className="text-sm font-black tracking-widest text-[#1b1b18] uppercase dark:text-white">
                                        {t('dash_items_summary')}
                                    </h2>
                                </div>
                                <Button
                                    variant="ghost"
                                    className="text-[10px] font-bold tracking-widest text-red-600 uppercase"
                                >
                                    {t('dash_edit_order')}
                                    <ChevronRight className="ml-1 size-3" />
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#1b1b18]/2 dark:bg-white/2">
                                        <tr>
                                            <th className="px-8 py-4 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                                {t('dash_col_item_name')}
                                            </th>
                                            <th className="px-8 py-4 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                                {t('dash_col_qty')}
                                            </th>
                                            <th className="px-8 py-4 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                                {t('dash_col_price')}
                                            </th>
                                            <th className="px-8 py-4 text-right text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                                {t('dash_col_total')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#1b1b18]/5 dark:divide-white/5">
                                        {service.items.map((item, index) => (
                                            <tr key={index} className="group">
                                                <td className="px-8 py-5 text-sm font-bold text-[#1b1b18] dark:text-white">
                                                    {item.name}
                                                </td>
                                                <td className="px-8 py-5 text-sm text-[#1b1b18]/60 dark:text-white/60">
                                                    {item.qty}
                                                </td>
                                                <td className="px-8 py-5 text-sm text-[#1b1b18]/60 dark:text-white/60">
                                                    {item.price}
                                                </td>
                                                <td className="px-8 py-5 text-right text-sm font-black text-[#1b1b18] dark:text-white">
                                                    {item.total}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary Totals */}
                            <div className="border-t border-[#1b1b18]/5 bg-[#1b1b18]/2 p-8 dark:border-white/5 dark:bg-white/2">
                                <div className="ml-auto flex max-w-xs flex-col gap-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-[10px] font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                            {t('dash_subtotal')}
                                        </span>
                                        <span className="font-bold text-[#1b1b18] dark:text-white">
                                            {service.summary.subtotal}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-[10px] font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                            {t('dash_tax')} (0%)
                                        </span>
                                        <span className="font-bold text-[#1b1b18] dark:text-white">
                                            {service.summary.tax}
                                        </span>
                                    </div>
                                    <div className="my-1 h-px bg-[#1b1b18]/10 dark:bg-white/10" />
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-xs font-black tracking-widest text-red-600 uppercase">
                                            <CreditCard className="size-4" />
                                            {t('dash_grand_total')}
                                        </span>
                                        <span className="text-xl font-black tracking-tighter text-[#1b1b18] dark:text-white">
                                            {service.summary.total}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </m.div>
                    </div>
                </div>
            </m.div>
        </LazyMotion>
    );
}

ServiceDetails.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Services',
            href: '/admin/services',
        },
        {
            title: 'Details',
            href: '',
        },
    ],
};
