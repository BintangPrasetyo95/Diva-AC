import { Head } from '@inertiajs/react';
import { m, LazyMotion, domAnimation, Variants } from 'framer-motion';
import {
    User,
    Car,
    Wrench,
    ShoppingBag,
    Phone,
    Mail,
    MapPin,
    Calendar,
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle,
    Star,
    Package,
    Hash,
} from 'lucide-react';
import React from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Profile {
    id: number;
    name: string;
    username: string;
    email: string;
    no_telp: string;
    alamat: string;
    jenis_kelamin: 'L' | 'P' | null;
    tanggal_daftar: string;
    role: string;
}
interface CarItem {
    id: number;
    merk: string;
    model: string;
    tahun: number;
    no_polisi: string;
    warna: string;
    keterangan: string;
    service_count: number;
}
interface ServiceItem {
    id: number;
    car: string;
    no_polisi: string;
    mekanik: string;
    tanggal_service: string;
    tipe_service: string;
    status_service: string;
    total_service: number;
    catatan: string;
}
interface SparepartItem {
    name: string;
    qty: number;
    harga: number;
}
interface SparepartOrder {
    id: number;
    tanggal_penjualan: string;
    status: string;
    total_harga: number;
    bayar: number;
    kembali: number;
    items: SparepartItem[];
}
interface Props {
    profile: Profile;
    cars: CarItem[];
    services: ServiceItem[];
    sparepartOrders: SparepartOrder[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatRp = (v: number) => 'Rp ' + (v ?? 0).toLocaleString('id-ID');

const fmt = (d: string) =>
    d
        ? new Date(d).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
          })
        : '-';

// ── Animation ─────────────────────────────────────────────────────────────────
const container: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
    hidden: { y: 16, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 120, damping: 14 },
    },
};

// ── Status helpers ─────────────────────────────────────────────────────────────
const svcStatusColor = (s: string) => {
    if (s === 'selesai') return 'bg-emerald-500/10 text-emerald-600';
    if (s === 'antri') return 'bg-amber-500/10 text-amber-600';
    if (s === 'batal') return 'bg-red-500/10 text-red-600';
    return 'bg-blue-500/10 text-blue-600';
};
const svcStatusIcon = (s: string) => {
    if (s === 'selesai') return <CheckCircle2 className="size-3" />;
    if (s === 'antri') return <Clock className="size-3" />;
    if (s === 'batal') return <XCircle className="size-3" />;
    return <Wrench className="size-3" />;
};
const orderStatusColor = (s: string) => {
    if (s === 'selesai') return 'bg-emerald-500/10 text-emerald-600';
    if (s === 'pending') return 'bg-amber-500/10 text-amber-600';
    if (s === 'batal') return 'bg-red-500/10 text-red-600';
    return 'bg-blue-500/10 text-blue-600';
};

// ── Tabs ──────────────────────────────────────────────────────────────────────
type Tab = 'profile' | 'cars' | 'services' | 'spareparts';
const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Profil Saya', icon: User },
    { id: 'cars', label: 'Kendaraan', icon: Car },
    { id: 'services', label: 'Riwayat Servis', icon: Wrench },
    { id: 'spareparts', label: 'Pembelian', icon: ShoppingBag },
];

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MyAccount({
    profile,
    cars,
    services,
    sparepartOrders,
}: Props) {
    const [activeTab, setActiveTab] = React.useState<Tab>('profile');

    const initials = (profile.name || '?')
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();

    return (
        <LazyMotion features={domAnimation}>
            <Head title="Akun Saya" />

            <m.div
                initial="hidden"
                animate="visible"
                variants={container}
                className="flex min-h-screen flex-col gap-8 p-6 lg:p-8"
            >
                {/* ── Hero Header ── */}
                <m.div
                    variants={item}
                    className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#1b1b18] via-[#2b1515] to-red-950 p-8 text-white shadow-2xl"
                >
                    {/* decorative blobs */}
                    <div className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-red-600/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-8 -left-8 size-48 rounded-full bg-red-800/20 blur-3xl" />

                    <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="flex size-24 items-center justify-center rounded-3xl bg-white/10 text-4xl font-black ring-2 ring-white/20 backdrop-blur-sm">
                                {initials}
                            </div>
                            <div className="absolute -right-1 -bottom-1 rounded-full bg-red-600 p-1.5 ring-2 ring-[#1b1b18]">
                                <Star className="size-3 fill-white text-white" />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <p className="text-xs font-black tracking-[0.2em] text-white/40 uppercase">
                                {profile.role === 'admin'
                                    ? 'Administrator'
                                    : profile.role === 'mekanik'
                                      ? 'Mekanik'
                                      : 'Pelanggan'}
                            </p>
                            <h1 className="mt-1 text-3xl font-black tracking-tight">
                                {profile.name}
                            </h1>
                            <p className="mt-0.5 text-sm text-white/50">
                                @{profile.username || profile.email}
                            </p>
                        </div>

                        {/* Quick stats */}
                        <div className="flex gap-4">
                            {[
                                {
                                    label: 'Kendaraan',
                                    value: cars.length,
                                    icon: Car,
                                },
                                {
                                    label: 'Servis',
                                    value: services.length,
                                    icon: Wrench,
                                },
                                {
                                    label: 'Pembelian',
                                    value: sparepartOrders.length,
                                    icon: ShoppingBag,
                                },
                            ].map((s) => (
                                <div
                                    key={s.label}
                                    className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-sm"
                                >
                                    <s.icon className="size-4 text-red-300" />
                                    <span className="text-2xl font-black">
                                        {s.value}
                                    </span>
                                    <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase">
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </m.div>

                {/* ── Tab Bar ── */}
                <m.div
                    variants={item}
                    className="flex gap-1 rounded-2xl border border-[#1b1b18]/5 bg-white p-1.5 shadow-sm dark:border-white/5 dark:bg-[#121212]"
                >
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            id={`tab-${tab.id}`}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black tracking-widest uppercase transition-all ${
                                activeTab === tab.id
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                                    : 'text-[#1b1b18]/40 hover:bg-[#1b1b18]/5 dark:text-white/40 dark:hover:bg-white/5'
                            }`}
                        >
                            <tab.icon className="size-3.5" />
                            <span className="hidden sm:inline">
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </m.div>

                {/* ── Tab Content ── */}
                {activeTab === 'profile' && (
                    <m.div
                        variants={item}
                        key="profile"
                        className="grid gap-6 md:grid-cols-2"
                    >
                        {[
                            {
                                icon: User,
                                label: 'Nama Lengkap',
                                value: profile.name,
                            },
                            {
                                icon: Hash,
                                label: 'Username',
                                value: profile.username || '-',
                            },
                            {
                                icon: Mail,
                                label: 'Email',
                                value: profile.email || '-',
                            },
                            {
                                icon: Phone,
                                label: 'No. Telepon',
                                value: profile.no_telp || '-',
                            },
                            {
                                icon: MapPin,
                                label: 'Alamat',
                                value: profile.alamat || '-',
                            },
                            {
                                icon: User,
                                label: 'Jenis Kelamin',
                                value:
                                    profile.jenis_kelamin === 'L'
                                        ? 'Laki-laki'
                                        : profile.jenis_kelamin === 'P'
                                          ? 'Perempuan'
                                          : '-',
                            },
                            {
                                icon: Calendar,
                                label: 'Tanggal Daftar',
                                value: fmt(profile.tanggal_daftar),
                            },
                        ].map((f) => (
                            <div
                                key={f.label}
                                className="flex items-start gap-4 rounded-3xl border border-[#1b1b18]/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#121212]"
                            >
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-600">
                                    <f.icon className="size-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                        {f.label}
                                    </p>
                                    <p className="mt-0.5 text-sm font-bold break-all text-[#1b1b18] dark:text-white">
                                        {f.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </m.div>
                )}

                {activeTab === 'cars' && (
                    <m.div
                        variants={container}
                        key="cars"
                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {cars.length === 0 ? (
                            <EmptyState
                                icon={Car}
                                label="Belum ada kendaraan terdaftar"
                            />
                        ) : (
                            cars.map((car) => (
                                <m.div
                                    key={car.id}
                                    variants={item}
                                    whileHover={{
                                        y: -4,
                                        transition: { duration: 0.18 },
                                    }}
                                    className="relative overflow-hidden rounded-3xl border border-[#1b1b18]/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#121212]"
                                >
                                    {/* accent blob */}
                                    <div className="pointer-events-none absolute -top-6 -right-6 size-24 rounded-full bg-red-600/8 blur-2xl" />

                                    <div className="flex items-start justify-between">
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-red-500/10">
                                            <Car className="size-6 text-red-600" />
                                        </div>
                                        <span className="rounded-full bg-[#1b1b18]/5 px-3 py-1 text-[10px] font-black tracking-widest text-[#1b1b18]/50 uppercase dark:bg-white/5 dark:text-white/50">
                                            {car.warna || '-'}
                                        </span>
                                    </div>

                                    <div className="mt-4">
                                        <h3 className="text-lg font-black tracking-tight text-[#1b1b18] dark:text-white">
                                            {car.merk} {car.model}
                                        </h3>
                                        <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">
                                            {car.tahun || '-'}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-[#1b1b18]/5 pt-4 dark:border-white/5">
                                        <div>
                                            <p className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                                No. Polisi
                                            </p>
                                            <p className="font-black tracking-widest text-[#1b1b18] dark:text-white">
                                                {car.no_polisi}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-600">
                                            <Wrench className="size-3" />
                                            {car.service_count}x servis
                                        </div>
                                    </div>

                                    {car.keterangan && (
                                        <p className="mt-3 text-xs text-[#1b1b18]/40 italic dark:text-white/40">
                                            {car.keterangan}
                                        </p>
                                    )}
                                </m.div>
                            ))
                        )}
                    </m.div>
                )}

                {activeTab === 'services' && (
                    <m.div
                        variants={item}
                        key="services"
                        className="overflow-hidden rounded-3xl border border-[#1b1b18]/5 bg-white shadow-sm dark:border-white/5 dark:bg-[#121212]"
                    >
                        {services.length === 0 ? (
                            <EmptyState
                                icon={Wrench}
                                label="Belum ada riwayat servis"
                            />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="border-b border-[#1b1b18]/5 bg-[#1b1b18]/2 dark:border-white/5 dark:bg-white/2">
                                        <tr>
                                            {[
                                                '#',
                                                'Kendaraan',
                                                'Mekanik',
                                                'Tipe',
                                                'Tanggal',
                                                'Total',
                                                'Status',
                                            ].map((h) => (
                                                <th
                                                    key={h}
                                                    className="px-5 py-4 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40"
                                                >
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#1b1b18]/5 dark:divide-white/5">
                                        {services.map((svc) => (
                                            <tr
                                                key={svc.id}
                                                className="transition-colors hover:bg-[#1b1b18]/1 dark:hover:bg-white/1"
                                            >
                                                <td className="px-5 py-4 font-mono text-xs font-bold text-[#1b1b18]/40 dark:text-white/40">
                                                    #{svc.id}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <p className="text-sm font-bold text-[#1b1b18] dark:text-white">
                                                        {svc.car}
                                                    </p>
                                                    <p className="text-[10px] text-[#1b1b18]/40 dark:text-white/40">
                                                        {svc.no_polisi}
                                                    </p>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-[#1b1b18]/70 dark:text-white/70">
                                                    {svc.mekanik}
                                                </td>
                                                <td className="px-5 py-4 text-sm text-[#1b1b18]/70 dark:text-white/70">
                                                    {svc.tipe_service}
                                                </td>
                                                <td className="px-5 py-4 text-sm whitespace-nowrap text-[#1b1b18]/60 dark:text-white/60">
                                                    {fmt(svc.tanggal_service)}
                                                </td>
                                                <td className="px-5 py-4 text-sm font-bold whitespace-nowrap text-[#1b1b18] dark:text-white">
                                                    {formatRp(
                                                        svc.total_service,
                                                    )}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${svcStatusColor(svc.status_service)}`}
                                                    >
                                                        {svcStatusIcon(
                                                            svc.status_service,
                                                        )}
                                                        {svc.status_service}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </m.div>
                )}

                {activeTab === 'spareparts' && (
                    <m.div
                        variants={container}
                        key="spareparts"
                        className="flex flex-col gap-4"
                    >
                        {sparepartOrders.length === 0 ? (
                            <EmptyState
                                icon={ShoppingBag}
                                label="Belum ada pembelian sparepart"
                            />
                        ) : (
                            sparepartOrders.map((order) => (
                                <m.div
                                    key={order.id}
                                    variants={item}
                                    className="overflow-hidden rounded-3xl border border-[#1b1b18]/5 bg-white shadow-sm dark:border-white/5 dark:bg-[#121212]"
                                >
                                    {/* Order header */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1b1b18]/5 bg-[#1b1b18]/2 px-6 py-4 dark:border-white/5 dark:bg-white/2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-9 items-center justify-center rounded-xl bg-red-500/10">
                                                <Package className="size-4 text-red-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                                    Order
                                                </p>
                                                <p className="text-sm font-black text-[#1b1b18] dark:text-white">
                                                    #{order.id}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-[#1b1b18]/50 dark:text-white/50">
                                                {fmt(order.tanggal_penjualan)}
                                            </span>
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase ${orderStatusColor(order.status)}`}
                                            >
                                                {order.status === 'selesai' ? (
                                                    <CheckCircle2 className="size-3" />
                                                ) : order.status ===
                                                  'pending' ? (
                                                    <Clock className="size-3" />
                                                ) : (
                                                    <AlertCircle className="size-3" />
                                                )}
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="divide-y divide-[#1b1b18]/5 dark:divide-white/5">
                                        {order.items.map((it, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between px-6 py-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="size-1.5 rounded-full bg-red-600" />
                                                    <span className="text-sm font-medium text-[#1b1b18] dark:text-white">
                                                        {it.name}
                                                    </span>
                                                    <span className="text-xs text-[#1b1b18]/40 dark:text-white/40">
                                                        x{it.qty}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-bold text-[#1b1b18] dark:text-white">
                                                    {formatRp(
                                                        it.harga * it.qty,
                                                    )}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order footer */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#1b1b18]/5 px-6 py-4 dark:border-white/5">
                                        <div className="flex gap-6">
                                            <div>
                                                <p className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                                    Bayar
                                                </p>
                                                <p className="text-sm font-bold text-[#1b1b18] dark:text-white">
                                                    {formatRp(order.bayar)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                                    Kembali
                                                </p>
                                                <p className="text-sm font-bold text-[#1b1b18] dark:text-white">
                                                    {formatRp(order.kembali)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                                Total
                                            </p>
                                            <p className="text-xl font-black text-red-600">
                                                {formatRp(order.total_harga)}
                                            </p>
                                        </div>
                                    </div>
                                </m.div>
                            ))
                        )}
                    </m.div>
                )}
            </m.div>
        </LazyMotion>
    );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({
    icon: Icon,
    label,
}: {
    icon: React.ElementType;
    label: string;
}) {
    return (
        <div className="col-span-full flex flex-col items-center gap-3 py-20 opacity-25">
            <Icon className="size-14" />
            <p className="text-sm font-black tracking-widest uppercase">
                {label}
            </p>
        </div>
    );
}

MyAccount.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Akun Saya', href: '/admin/my-account' },
    ],
};
