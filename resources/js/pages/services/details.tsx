import { Head, Link, usePage } from '@inertiajs/react';
import type { Variants} from 'framer-motion';
import { m, LazyMotion, domAnimation } from 'framer-motion';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';

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

export default function ServiceDetails({ id, service }: { id: string, service: any }) {
    const { t } = useLanguage();
    const { auth } = usePage().props as any;
    const backUrl = auth.user.role === 'customer' ? '/admin/my-account' : '/admin/services';

    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(Number(amount));
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const invoiceItems: any[] = [];
    if (service.jasas && service.jasas.length > 0) {
        service.jasas.forEach((jasa: any) => {
            invoiceItems.push({
                name: `Jasa: ${jasa.nama_jasa}`,
                qty: 1,
                price: formatCurrency(jasa.harga_jasa),
                total: formatCurrency(jasa.harga_jasa),
            });
        });
    } else {
        invoiceItems.push({
            name: `Jasa Service (${service.tipe_service})`,
            qty: 1,
            price: formatCurrency(service.harga_service),
            total: formatCurrency(service.harga_service),
        });
    }

    service.spareparts?.forEach((sp: any) => {
        invoiceItems.push({
            name: sp.nama_sparepart,
            qty: sp.pivot.jumlah,
            price: formatCurrency(sp.pivot.harga_satuan),
            total: formatCurrency(sp.pivot.jumlah * sp.pivot.harga_satuan),
        });
    });
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'selesai':
                return (
                    <Badge
                        variant="outline"
                        className="gap-1.5 border-green-500/20 bg-green-500/10 px-3 py-1 text-[10px] font-bold tracking-widest text-green-600 uppercase"
                    >
                        <CheckCircle2 className="size-3.5" />
                        {t('dash_status_completed')}
                    </Badge>
                );
            case 'antri':
                return (
                    <Badge
                        variant="outline"
                        className="gap-1.5 border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-bold tracking-widest text-amber-600 uppercase"
                    >
                        <Clock className="size-3.5" />
                        {t('dash_status_pending')}
                    </Badge>
                );
            case 'proses':
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
                            href={backUrl}
                            className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#1b1b18]/40 uppercase transition-colors hover:text-red-600 dark:text-white/40 dark:hover:text-red-600"
                        >
                            <ArrowLeft className="size-3" />
                            {t('dash_back_to_services')}
                        </Link>
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                                SRV-{String(service.id).padStart(4, '0')}
                            </h1>
                            {getStatusBadge(service.status_service)}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href={`/admin/invoice?type=service&id=${service.id}`}
                            target="_blank"
                            className="flex h-12 items-center gap-2 rounded-2xl border border-[#1b1b18]/10 px-6 text-[10px] font-bold tracking-widest uppercase hover:bg-[#1b1b18]/5 transition-colors dark:border-white/10 dark:hover:bg-white/5"
                        >
                            <Printer className="size-4" />
                            {t('dash_print_invoice')}
                        </a>
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
                                        {service.mobil?.pelanggan?.nama_pelanggan || '-'}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold tracking-wider text-[#1b1b18]/30 uppercase dark:text-white/30">
                                        {t('phone')}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Phone className="size-3 text-red-600" />
                                        <span className="text-sm font-medium text-[#1b1b18]/70 dark:text-white/70">
                                            {service.mobil?.pelanggan?.no_telp || '-'}
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
                                            {service.mobil?.pelanggan?.alamat || '-'}
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
                                        {service.mobil?.merk} {service.mobil?.model}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold tracking-wider text-[#1b1b18]/30 uppercase dark:text-white/30">
                                        Plate
                                    </span>
                                    <span className="text-sm font-bold text-[#1b1b18] dark:text-white">
                                        {service.mobil?.no_polisi}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold tracking-wider text-[#1b1b18]/30 uppercase dark:text-white/30">
                                        Year
                                    </span>
                                    <span className="text-sm font-bold text-[#1b1b18] dark:text-white">
                                        {'-'}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold tracking-wider text-[#1b1b18]/30 uppercase dark:text-white/30">
                                        Color
                                    </span>
                                    <span className="text-sm font-bold text-[#1b1b18] dark:text-white">
                                        {service.mobil?.warna || '-'}
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
                                            {service.tipe_service}
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
                                            {service.mekanik?.nama_mekanik || '-'}
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
                                            {formatDate(service.tanggal_service)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 rounded-2xl border border-[#1b1b18]/5 bg-[#1b1b18]/2 p-4 dark:border-white/5 dark:bg-white/2">
                                <span className="text-[10px] font-bold tracking-wider text-[#1b1b18]/30 uppercase dark:text-white/30">
                                    {t('notes')}
                                </span>
                                <p className="text-sm text-[#1b1b18]/70 italic dark:text-white/70">
                                    {service.catatan || '-'}
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
                                        {invoiceItems.map((item, index) => (
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
                                            {formatCurrency(service.total_service)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-[10px] font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                            {t('dash_tax')} (0%)
                                        </span>
                                        <span className="font-bold text-[#1b1b18] dark:text-white">
                                            Rp 0
                                        </span>
                                    </div>
                                    <div className="my-1 h-px bg-[#1b1b18]/10 dark:bg-white/10" />
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-xs font-black tracking-widest text-red-600 uppercase">
                                            <CreditCard className="size-4" />
                                            {t('dash_grand_total')}
                                        </span>
                                        <span className="text-xl font-black tracking-tighter text-[#1b1b18] dark:text-white">
                                            {formatCurrency(service.total_service)}
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

import AppLayout from '@/layouts/app-layout';

const DetailsLayout = (page: any) => {
    // If page is a React element, we can extract its props
    const props = page?.props || {};
    const role = props.auth?.user?.role;
    
    const breadcrumbs = role === 'customer'
        ? [
              { title: 'My Account', href: '/admin/my-account' },
              { title: 'Details', href: '' },
          ]
        : [
              { title: 'Dashboard', href: '/admin/dashboard' },
              { title: 'Services', href: '/admin/services' },
              { title: 'Details', href: '' },
          ];

    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};

ServiceDetails.layout = DetailsLayout;
