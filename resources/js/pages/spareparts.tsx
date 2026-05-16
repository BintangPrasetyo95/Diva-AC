import { Head, Link, usePage } from '@inertiajs/react';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Menu,
    MapPin,
    Phone,
    User,
    Plus,
    Trash2,
    CheckCircle2,
} from 'lucide-react';
import React, { useState } from 'react';
import AppLogo from '@/components/app-logo';
import AppearanceToggleTab from '@/components/appearance-tabs';
import { useLanguage } from '@/hooks/use-language';
import { dashboard, login, register } from '@/routes';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { SearchableSelect } from '@/components/ui/searchable-select';

interface Sparepart {
    id: number;
    nama_sparepart: string;
    tipe_sparepart: string;
    image_url: string | null;
}

interface Props {
    auth: any;
    spareparts: Sparepart[];
}

export default function Spareparts({ auth, spareparts = [] }: Props) {
    const { t, language, setLanguage } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

    // Form state
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [address, setAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successUrl, setSuccessUrl] = useState<string | null>(null);
    const [rows, setRows] = useState([
        { id: Date.now().toString(), partId: '', jumlah: 1 },
    ]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validRows = rows.filter((r) => r.partId !== '');
        if (validRows.length === 0) {
            alert('Please select at least one sparepart.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/spareparts/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content || '',
                },
                body: JSON.stringify({
                    customer_name: customerName,
                    customer_phone: customerPhone,
                    address: address,
                    items: validRows.map((r) => ({
                        partId: r.partId,
                        jumlah: Number(r.jumlah) || 1,
                    })),
                }),
            });

            const data = await response.json();

            if (data.success && data.wa_url) {
                setSuccessUrl(data.wa_url);
            } else {
                alert('Failed to submit order. Please try again.');
            }
        } catch (error) {
            console.error('Failed to submit order:', error);
            alert('Failed to submit order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const addRow = () => {
        setRows([
            ...rows,
            { id: Date.now().toString(), partId: '', jumlah: 1 },
        ]);
    };

    const removeRow = (idToRemove: string) => {
        if (rows.length > 1) {
            setRows(rows.filter((row) => row.id !== idToRemove));
        }
    };

    const updateRow = (idToUpdate: string, newPartId: string) => {
        setRows(
            rows.map((row) =>
                row.id === idToUpdate ? { ...row, partId: newPartId } : row,
            ),
        );
    };

    const updateRowQuantity = (idToUpdate: string, newJumlah: number) => {
        setRows(
            rows.map((row) =>
                row.id === idToUpdate
                    ? { ...row, jumlah: Math.max(1, newJumlah) }
                    : row,
            ),
        );
    };

    const handleImageClick = (partId: string) => {
        const isSelected = rows.some((row) => row.partId === partId);

        if (isSelected) {
            // Remove the part if it's currently selected
            const rowWithPart = rows.find((r) => r.partId === partId);
            if (rowWithPart) {
                if (rows.length > 1) {
                    removeRow(rowWithPart.id);
                } else {
                    updateRow(rowWithPart.id, ''); // Just clear it if it's the last row
                }
            }
        } else {
            // Check if there's an empty row
            const emptyRow = rows.find((row) => row.partId === '');
            if (emptyRow) {
                updateRow(emptyRow.id, partId);
            } else {
                setRows([
                    ...rows,
                    { id: Date.now().toString(), partId, jumlah: 1 },
                ]);
            }
        }
    };

    return (
        <LazyMotion features={domAnimation}>
            <Head title="Buy Spareparts - Diva AC" />
            <div className="min-h-screen bg-[#FDFDFC] pb-24 text-[#1b1b18] selection:bg-red-600 selection:text-white dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                {/* Header - Reuse Booking Header structure */}
                <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b border-[#1b1b18]/10 bg-white/50 px-6 py-4 backdrop-blur-md dark:border-white/10 dark:bg-black/50">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1b1b18]/5 transition-colors hover:bg-[#1b1b18]/10 dark:bg-white/5 dark:hover:bg-white/10"
                        >
                            <ArrowLeft className="size-5" />
                        </Link>
                        <AppLogo />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Desktop Navigation */}
                        <div className="hidden items-center gap-4 lg:flex">
                            <AnimatePresence mode="wait">
                                {isDesktopMenuOpen && (
                                    <m.div
                                        initial={{
                                            opacity: 0,
                                            x: 50,
                                            scale: 0.9,
                                        }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: 50, scale: 0.9 }}
                                        className="flex items-center gap-4"
                                    >
                                        {/* Language Switcher */}
                                        <div className="flex items-center gap-1 rounded-full border border-[#1b1b18]/10 bg-[#1b1b18]/5 p-1 backdrop-blur-md dark:border-white/20 dark:bg-white/10">
                                            <button
                                                onClick={() =>
                                                    setLanguage('id')
                                                }
                                                className={`rounded-full px-3 py-1 text-[10px] font-bold transition-all ${language === 'id' ? 'bg-red-600 text-white shadow-lg' : 'text-[#1b1b18]/60 hover:bg-[#1b1b18]/5 hover:text-[#1b1b18] dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white'}`}
                                            >
                                                ID
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setLanguage('en')
                                                }
                                                className={`rounded-full px-3 py-1 text-[10px] font-bold transition-all ${language === 'en' ? 'bg-red-600 text-white shadow-lg' : 'text-[#1b1b18]/60 hover:bg-[#1b1b18]/5 hover:text-[#1b1b18] dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white'}`}
                                            >
                                                EN
                                            </button>
                                        </div>

                                        <AppearanceToggleTab />

                                        {auth.user ? (
                                            <Link
                                                href="/admin/dashboard"
                                                className="inline-flex h-10 items-center justify-center rounded-full border border-[#1b1b18]/10 bg-[#1b1b18]/5 px-6 text-sm font-medium text-[#1b1b18] backdrop-blur-md transition-all hover:bg-[#1b1b18]/10 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                                            >
                                                {t('dashboard')}
                                            </Link>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={login()}
                                                    className="inline-flex h-10 items-center justify-center rounded-full border border-[#1b1b18]/20 bg-transparent px-4 text-sm font-bold text-[#1b1b18] transition-all hover:bg-[#1b1b18]/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                                                >
                                                    {t('login')}
                                                </Link>
                                                <Link
                                                    href={register()}
                                                    className="inline-flex h-10 items-center justify-center rounded-full bg-red-600 px-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-red-700"
                                                >
                                                    {t('register')}
                                                </Link>
                                            </div>
                                        )}
                                    </m.div>
                                )}
                            </AnimatePresence>

                            <button
                                onClick={() =>
                                    setIsDesktopMenuOpen(!isDesktopMenuOpen)
                                }
                                className={`relative z-50 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border shadow-xl backdrop-blur-md transition-all active:scale-95 ${isDesktopMenuOpen ? 'border-red-600 bg-red-600 text-white' : 'border-[#1b1b18]/10 bg-[#1b1b18]/5 text-[#1b1b18] hover:bg-[#1b1b18]/10 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'}`}
                            >
                                <Menu
                                    className={`size-6 transition-transform ${isDesktopMenuOpen ? 'rotate-90' : ''}`}
                                />
                            </button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="relative flex flex-col items-end gap-2 lg:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`relative z-50 flex h-12 w-12 items-center justify-center rounded-full border shadow-xl backdrop-blur-md transition-all active:scale-95 ${isMenuOpen ? 'border-red-600 bg-red-600 text-white' : 'border-[#1b1b18]/10 bg-[#1b1b18]/5 text-[#1b1b18] hover:bg-[#1b1b18]/10 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'}`}
                            >
                                <Menu
                                    className={`size-6 transition-transform ${isMenuOpen ? 'rotate-90' : ''}`}
                                />
                            </button>

                            <AnimatePresence>
                                {isMenuOpen && (
                                    <m.div
                                        initial={{
                                            opacity: 0,
                                            y: -20,
                                            scale: 0.95,
                                        }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{
                                            opacity: 0,
                                            y: -20,
                                            scale: 0.95,
                                        }}
                                        className="absolute top-16 right-0 flex min-w-[220px] flex-col gap-4 rounded-3xl border border-white/20 bg-white/50 p-6 shadow-2xl backdrop-blur-xl dark:bg-black/50"
                                    >
                                        <div className="flex flex-col gap-2">
                                            <span className="mb-2 text-[10px] font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                                {t('language')}
                                            </span>
                                            <div className="flex items-center gap-1 rounded-full border border-[#1b1b18]/10 bg-[#1b1b18]/5 p-1 dark:border-white/10 dark:bg-white/5">
                                                <button
                                                    onClick={() =>
                                                        setLanguage('id')
                                                    }
                                                    className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold transition-all ${language === 'id' ? 'bg-red-600 text-white shadow-md' : 'text-[#1b1b18]/60 hover:bg-[#1b1b18]/5 hover:text-[#1b1b18] dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white'}`}
                                                >
                                                    Indonesia
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setLanguage('en')
                                                    }
                                                    className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold transition-all ${language === 'en' ? 'bg-red-600 text-white shadow-md' : 'text-[#1b1b18]/60 hover:bg-[#1b1b18]/5 hover:text-[#1b1b18] dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white'}`}
                                                >
                                                    English
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <span className="mb-2 text-[10px] font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                                {t('appearance')}
                                            </span>
                                            <AppearanceToggleTab />
                                        </div>

                                        <div className="h-px w-full bg-[#1b1b18]/10 dark:bg-white/10" />

                                        <div className="flex flex-col gap-3">
                                            <span className="mb-1 text-[10px] font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                                {t('account')}
                                            </span>
                                            {auth.user ? (
                                                <Link
                                                    href="/admin/dashboard"
                                                    className="block rounded-xl bg-[#1b1b18]/5 px-4 py-2 text-sm font-medium text-[#1b1b18] transition-all hover:bg-[#1b1b18]/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                                                >
                                                    {t('dashboard')}
                                                </Link>
                                            ) : (
                                                <>
                                                    <Link
                                                        href={login()}
                                                        className="block rounded-xl border border-[#1b1b18]/20 px-4 py-2 text-center text-sm font-bold text-[#1b1b18] transition-all hover:bg-[#1b1b18]/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                                                    >
                                                        {t('login')}
                                                    </Link>
                                                    <Link
                                                        href={register()}
                                                        className="block rounded-xl bg-red-600 px-4 py-2 text-center text-sm font-bold text-white shadow-lg transition-all hover:bg-red-700"
                                                    >
                                                        {t('register')}
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                    </m.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="mx-auto max-w-7xl px-6 pt-28">
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 text-center"
                    >
                        <h1 className="text-3xl font-black tracking-tight uppercase sm:text-5xl">
                            {t('spareparts_page_title')}
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-[#1b1b18]/60 dark:text-white/60">
                            {t('spareparts_page_subtitle')}
                        </p>
                    </m.div>

                    <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
                        {/* Left Side: Interactive Visual Grid */}
                        <m.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-6"
                        >
                            <h2 className="text-xl font-bold tracking-wider uppercase">
                                {t('select_sparepart')}
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {spareparts.map((part) => {
                                    const isSelected = rows.some(
                                        (r) => r.partId === String(part.id),
                                    );
                                    return (
                                        <button
                                            key={part.id}
                                            type="button"
                                            onClick={() =>
                                                handleImageClick(
                                                    String(part.id),
                                                )
                                            }
                                            className={`relative aspect-square overflow-hidden rounded-3xl transition-all duration-300 ${isSelected ? 'scale-[0.98] shadow-lg ring-4 ring-red-600' : 'hover:scale-[1.02] hover:shadow-xl'}`}
                                        >
                                            <img
                                                src={
                                                    part.image_url ||
                                                    '/img/placeholder.jpg'
                                                }
                                                alt={part.nama_sparepart}
                                                className="h-full w-full object-cover"
                                            />
                                            <div
                                                className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}
                                            />
                                            {isSelected && (
                                                <div className="absolute top-4 right-4 rounded-full bg-red-600 p-1 text-white shadow-lg">
                                                    <CheckCircle2 className="size-6" />
                                                </div>
                                            )}
                                            <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/80 to-transparent p-4">
                                                <p className="text-sm font-bold text-white">
                                                    {part.nama_sparepart}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </m.div>

                        {/* Right Side: Form */}
                        <m.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="h-fit rounded-3xl border border-[#1b1b18]/10 bg-white/50 p-6 shadow-2xl backdrop-blur-xl sm:p-10 dark:border-white/10 dark:bg-black/50"
                        >
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold tracking-wider text-[#1b1b18]/70 uppercase dark:text-white/70">
                                            <User className="size-4" />
                                            <span>{t('name')}</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-3 text-[#1b1b18] placeholder:text-[#1b1b18]/30 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none dark:border-white/20 dark:text-white dark:placeholder:text-white/30"
                                            placeholder={t(
                                                'booking_placeholder_name',
                                            )}
                                            value={customerName}
                                            onChange={(e) =>
                                                setCustomerName(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold tracking-wider text-[#1b1b18]/70 uppercase dark:text-white/70">
                                            <Phone className="size-4" />
                                            <span>{t('phone')}</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-3 text-[#1b1b18] placeholder:text-[#1b1b18]/30 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none dark:border-white/20 dark:text-white dark:placeholder:text-white/30"
                                            placeholder={t(
                                                'booking_placeholder_phone',
                                            )}
                                            value={customerPhone}
                                            onChange={(e) =>
                                                setCustomerPhone(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <h3 className="text-sm font-bold tracking-wider text-[#1b1b18]/70 uppercase dark:text-white/70">
                                        {t('select_sparepart')}
                                    </h3>

                                    <AnimatePresence>
                                        {rows.map((row) => (
                                            <m.div
                                                key={row.id}
                                                initial={{
                                                    opacity: 0,
                                                    height: 0,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    height: 'auto',
                                                }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="flex items-center gap-3"
                                            >
                                                <div className="flex-1">
                                                    <SearchableSelect
                                                        value={row.partId}
                                                        onChange={(val) => updateRow(row.id, val)}
                                                        placeholder={t('select_sparepart')}
                                                        options={spareparts.map((part) => ({
                                                            value: part.id,
                                                            label: part.nama_sparepart,
                                                        }))}
                                                    />
                                                </div>

                                                <input
                                                    type="number"
                                                    min="1"
                                                    required
                                                    value={row.jumlah}
                                                    onChange={(e) =>
                                                        updateRowQuantity(
                                                            row.id,
                                                            parseInt(
                                                                e.target.value,
                                                            ) || 1,
                                                        )
                                                    }
                                                    className="w-24 rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-3 text-[#1b1b18] focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none dark:border-white/20 dark:text-white"
                                                    title={t('quantity')}
                                                />

                                                {rows.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeRow(row.id)
                                                        }
                                                        className="shrink-0 rounded-xl p-3 text-red-600 transition-colors hover:bg-red-600/10"
                                                        title={t('remove')}
                                                    >
                                                        <Trash2 className="size-5" />
                                                    </button>
                                                )}
                                            </m.div>
                                        ))}
                                    </AnimatePresence>

                                    <button
                                        type="button"
                                        onClick={addRow}
                                        className="flex items-center gap-2 text-sm font-bold text-red-600 transition-colors hover:text-red-700"
                                    >
                                        <Plus className="size-4" />
                                        <span>{t('add_more_spareparts')}</span>
                                    </button>
                                </div>

                                <div className="space-y-2 pt-4">
                                    <label className="flex items-center gap-2 text-sm font-bold tracking-wider text-[#1b1b18]/70 uppercase dark:text-white/70">
                                        <MapPin className="size-4" />
                                        <span>{t('form_address')}</span>
                                    </label>
                                    <textarea
                                        required
                                        rows={3}
                                        className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-3 text-[#1b1b18] placeholder:text-[#1b1b18]/30 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none dark:border-white/20 dark:text-white dark:placeholder:text-white/30"
                                        placeholder={t('address_placeholder')}
                                        value={address}
                                        onChange={(e) =>
                                            setAddress(e.target.value)
                                        }
                                    ></textarea>
                                </div>

                                <m.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-4 font-bold text-white shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all hover:bg-red-700 hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] disabled:opacity-50"
                                >
                                    {isSubmitting
                                        ? 'Loading...'
                                        : t('confirm_purchase')}
                                </m.button>
                            </form>
                        </m.div>
                    </div>
                    {/* Footer Placeholder if needed */}
                </main>
            </div>

            <Dialog
                open={!!successUrl}
                onOpenChange={(open) => {
                    if (!open) {
                        setSuccessUrl(null);
                        setCustomerName('');
                        setCustomerPhone('');
                        setAddress('');
                        setRows([
                            {
                                id: Date.now().toString(),
                                partId: '',
                                jumlah: 1,
                            },
                        ]);
                    }
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-600">
                            <CheckCircle2 className="size-5" />
                            {t('order_confirmed_title')}
                        </DialogTitle>
                        <DialogDescription>
                            {t('order_confirmed_desc')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            onClick={() => {
                                setSuccessUrl(null);
                                setCustomerName('');
                                setCustomerPhone('');
                                setAddress('');
                                setRows([
                                    {
                                        id: Date.now().toString(),
                                        partId: '',
                                        jumlah: 1,
                                    },
                                ]);
                            }}
                            className="rounded-xl px-4 py-2 text-sm font-bold text-[#1b1b18]/70 transition-colors hover:bg-[#1b1b18]/5 dark:text-white/70 dark:hover:bg-white/5"
                        >
                            {t('order_close')}
                        </button>
                        <a
                            href={successUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-600"
                        >
                            <Phone className="size-4" />
                            {t('order_open_wa')}
                        </a>
                    </div>
                </DialogContent>
            </Dialog>
        </LazyMotion>
    );
}
