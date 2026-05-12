import { Head, router } from '@inertiajs/react';
import { m, LazyMotion, domAnimation, Variants } from 'framer-motion';
import {
    TrendingUp,
    Wrench,
    Package,
    DollarSign,
    CalendarDays,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';
import React from 'react';

// ── Types ────────────────────────────────────────────────────────────────────
interface Transaction {
    id: number;
    date: string;
    label: string;
    customer: string;
    amount: number;
    type: 'service' | 'sparepart';
}

interface MonthData {
    month: number;
    service: number;
    sparepart: number;
    total: number;
}

interface Props {
    transactions: Transaction[];
    serviceTotal: number;
    spareTotal: number;
    grandTotal: number;
    monthlyChart: MonthData[];
    currentYear: number;
    currentMonth: number;
    availableYears: number[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const MONTH_LABELS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

function formatRp(value: number): string {
    return 'Rp ' + value.toLocaleString('id-ID');
}

// ── Animation variants ────────────────────────────────────────────────────────
const container: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 100, damping: 14 },
    },
};

// ── Bar Chart ─────────────────────────────────────────────────────────────────
function BarChart({
    data,
    activeMonth,
}: {
    data: MonthData[];
    activeMonth: number;
}) {
    const max = Math.max(...data.map((d) => d.total), 1);

    return (
        <div className="flex h-36 w-full items-end gap-1.5 pt-2">
            {data.map((d) => {
                const isActive = d.month === activeMonth;
                const svcH = (d.service / max) * 100;
                const sprH = (d.sparepart / max) * 100;
                return (
                    <div
                        key={d.month}
                        className="group flex flex-1 cursor-default flex-col items-center gap-1"
                        title={`${MONTH_LABELS[d.month - 1]}: ${formatRp(d.total)}`}
                    >
                        <div
                            className="relative flex w-full flex-col justify-end"
                            style={{ height: '112px' }}
                        >
                            {/* Sparepart segment */}
                            <div
                                className={`w-full rounded-t transition-all duration-500 ${isActive ? 'bg-amber-400' : 'bg-amber-400/40 group-hover:bg-amber-400/70'}`}
                                style={{
                                    height: `${sprH}%`,
                                    minHeight: d.sparepart > 0 ? 2 : 0,
                                }}
                            />
                            {/* Service segment */}
                            <div
                                className={`w-full transition-all duration-500 ${isActive ? 'bg-red-500' : 'bg-red-500/40 group-hover:bg-red-500/70'} ${d.sparepart > 0 ? '' : 'rounded-t'}`}
                                style={{
                                    height: `${svcH}%`,
                                    minHeight: d.service > 0 ? 2 : 0,
                                }}
                            />
                        </div>
                        <span
                            className={`text-[9px] font-bold uppercase ${isActive ? 'text-red-600 dark:text-red-400' : 'text-[#1b1b18]/30 dark:text-white/30'}`}
                        >
                            {MONTH_LABELS[d.month - 1]}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function IncomePage({
    transactions,
    serviceTotal,
    spareTotal,
    grandTotal,
    monthlyChart,
    currentYear,
    currentMonth,
    availableYears,
}: Props) {
    const [year, setYear] = React.useState(currentYear);
    const [month, setMonth] = React.useState(currentMonth);

    const navigate = (y: number, m: number) => {
        router.get(
            '/admin/income',
            { year: y, month: m },
            { preserveState: true, replace: true },
        );
    };

    const handleYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const y = Number(e.target.value);
        setYear(y);
        navigate(y, month);
    };

    const handleMonth = (m: number) => {
        setMonth(m);
        navigate(year, m);
    };

    // ── YoY change (compare to same month last year) ──
    const prevMonthData = monthlyChart.find(
        (d) => d.month === (month === 1 ? 12 : month - 1),
    );
    const prevTotal = prevMonthData?.total ?? 0;
    const delta =
        prevTotal > 0 ? ((grandTotal - prevTotal) / prevTotal) * 100 : null;

    const stats = [
        {
            label: 'Total Pendapatan',
            value: formatRp(grandTotal),
            icon: DollarSign,
            color: 'text-green-600',
            bg: 'bg-green-500/10',
            delta,
        },
        {
            label: 'Pendapatan Service',
            value: formatRp(serviceTotal),
            icon: Wrench,
            color: 'text-red-600',
            bg: 'bg-red-500/10',
            delta: null,
        },
        {
            label: 'Penjualan Sparepart',
            value: formatRp(spareTotal),
            icon: Package,
            color: 'text-amber-600',
            bg: 'bg-amber-500/10',
            delta: null,
        },
        {
            label: 'Jumlah Transaksi',
            value: `${transactions.length}`,
            icon: CalendarDays,
            color: 'text-blue-600',
            bg: 'bg-blue-500/10',
            delta: null,
        },
    ];

    return (
        <LazyMotion features={domAnimation}>
            <Head title="Laporan Pendapatan" />

            <m.div
                initial="hidden"
                animate="visible"
                variants={container}
                className="flex flex-col gap-8 p-6 lg:p-8"
            >
                {/* ── Header ── */}
                <m.div
                    variants={item}
                    className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                            Laporan{' '}
                            <span className="text-red-600">Pendapatan</span>
                        </h1>
                        <p className="mt-1 text-sm text-[#1b1b18]/50 dark:text-white/50">
                            Ringkasan pemasukan dari service dan penjualan
                            sparepart.
                        </p>
                    </div>

                    {/* Year & Month selector */}
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={year}
                            onChange={handleYear}
                            className="h-10 rounded-2xl border border-[#1b1b18]/10 bg-white px-4 text-sm font-bold text-[#1b1b18] shadow-sm focus:outline-none dark:border-white/10 dark:bg-[#1a1a1a] dark:text-white"
                        >
                            {availableYears.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>
                </m.div>

                {/* ── Stat Cards ── */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((s) => (
                        <m.div
                            key={s.label}
                            variants={item}
                            whileHover={{
                                y: -4,
                                transition: { duration: 0.2 },
                            }}
                            className="group relative overflow-hidden rounded-3xl border border-[#1b1b18]/5 bg-white p-6 shadow-sm hover:shadow-xl dark:border-white/5 dark:bg-[#121212]"
                        >
                            <div className="flex items-center justify-between">
                                <div
                                    className={`flex size-12 items-center justify-center rounded-2xl ${s.bg} ${s.color}`}
                                >
                                    <s.icon className="size-6" />
                                </div>
                                {s.delta !== null && (
                                    <span
                                        className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${s.delta >= 0 ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}
                                    >
                                        {s.delta >= 0 ? (
                                            <ArrowUpRight className="size-3" />
                                        ) : (
                                            <ArrowDownRight className="size-3" />
                                        )}
                                        {Math.abs(s.delta).toFixed(1)}%
                                    </span>
                                )}
                            </div>
                            <div className="mt-4">
                                <p className="text-sm font-medium text-[#1b1b18]/50 dark:text-white/50">
                                    {s.label}
                                </p>
                                <h3 className="mt-1 text-xl font-black tracking-tight text-[#1b1b18] dark:text-white">
                                    {s.value}
                                </h3>
                            </div>
                            <m.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.04, 0.09, 0.04],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                className="absolute -top-4 -right-4 size-24 rounded-full bg-red-600/10 blur-3xl"
                            />
                        </m.div>
                    ))}
                </div>

                {/* ── Chart + Month Picker ── */}
                <m.div
                    variants={item}
                    className="rounded-3xl border border-[#1b1b18]/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#121212]"
                >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                                Grafik Bulanan{' '}
                                <span className="text-red-600">{year}</span>
                            </h2>
                            <p className="mt-0.5 text-xs text-[#1b1b18]/40 dark:text-white/40">
                                Klik bulan untuk melihat detailnya
                            </p>
                        </div>
                        {/* Legend */}
                        <div className="flex items-center gap-4 text-xs font-bold">
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block size-3 rounded-sm bg-red-500" />
                                Service
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block size-3 rounded-sm bg-amber-400" />
                                Sparepart
                            </span>
                        </div>
                    </div>

                    <BarChart data={monthlyChart} activeMonth={month} />

                    {/* Month pill buttons */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {MONTH_LABELS.map((label, idx) => {
                            const m = idx + 1;
                            const active = m === month;
                            return (
                                <button
                                    key={m}
                                    onClick={() => handleMonth(m)}
                                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
                                        active
                                            ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                                            : 'bg-[#1b1b18]/5 text-[#1b1b18]/60 hover:bg-red-600/10 hover:text-red-600 dark:bg-white/5 dark:text-white/50'
                                    }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </m.div>

                {/* ── Transactions Table ── */}
                <m.div
                    variants={item}
                    className="overflow-hidden rounded-3xl border border-[#1b1b18]/5 bg-white shadow-sm dark:border-white/5 dark:bg-[#121212]"
                >
                    <div className="flex items-center justify-between border-b border-[#1b1b18]/5 px-6 py-4 dark:border-white/5">
                        <h2 className="text-lg font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                            Transaksi — {MONTH_LABELS[month - 1]} {year}
                        </h2>
                        <span className="rounded-full bg-[#1b1b18]/5 px-3 py-1 text-xs font-bold text-[#1b1b18]/60 dark:bg-white/5 dark:text-white/50">
                            {transactions.length} transaksi
                        </span>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-20 text-[#1b1b18]/30 dark:text-white/30">
                            <TrendingUp className="size-12" />
                            <p className="font-bold">
                                Belum ada transaksi di bulan ini.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-[#1b1b18]/5 dark:border-white/5">
                                        <th className="px-6 py-3 text-[10px] font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-3 text-[10px] font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                            Keterangan
                                        </th>
                                        <th className="px-6 py-3 text-[10px] font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                            Pelanggan
                                        </th>
                                        <th className="px-6 py-3 text-[10px] font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                            Kategori
                                        </th>
                                        <th className="px-6 py-3 text-right text-[10px] font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                            Jumlah
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1b1b18]/5 dark:divide-white/5">
                                    {transactions.map((tx) => (
                                        <tr
                                            key={`${tx.type}-${tx.id}`}
                                            className="transition-colors hover:bg-[#1b1b18]/2 dark:hover:bg-white/2"
                                        >
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-[#1b1b18]/70 dark:text-white/60">
                                                {new Date(
                                                    tx.date,
                                                ).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-[#1b1b18] dark:text-white">
                                                    {tx.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#1b1b18]/70 dark:text-white/60">
                                                {tx.customer}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                                                        tx.type === 'service'
                                                            ? 'bg-red-500/10 text-red-600'
                                                            : 'bg-amber-500/10 text-amber-600'
                                                    }`}
                                                >
                                                    {tx.type === 'service' ? (
                                                        <Wrench className="size-3" />
                                                    ) : (
                                                        <Package className="size-3" />
                                                    )}
                                                    {tx.type === 'service'
                                                        ? 'Service'
                                                        : 'Sparepart'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-sm font-black text-green-600">
                                                    {formatRp(tx.amount)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-[#1b1b18]/10 dark:border-white/10">
                                        <td
                                            colSpan={4}
                                            className="px-6 py-4 text-sm font-black tracking-wide text-[#1b1b18]/50 uppercase dark:text-white/50"
                                        >
                                            Total
                                        </td>
                                        <td className="px-6 py-4 text-right text-base font-black text-green-600">
                                            {formatRp(grandTotal)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </m.div>
            </m.div>
        </LazyMotion>
    );
}

IncomePage.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Laporan Pendapatan', href: '/admin/income' },
    ],
};
