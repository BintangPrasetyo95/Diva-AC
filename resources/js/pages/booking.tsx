import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Car,
    Phone,
    User,
    PenTool,
    Menu,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import React, { useState } from 'react';
import AppLogo from '@/components/app-logo';
import AppearanceToggleTab from '@/components/appearance-tabs';
import { useLanguage } from '@/hooks/use-language';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { dashboard, login, register } from '@/routes';
import { toast } from 'sonner';

export default function Booking() {
    const { t, language, setLanguage } = useLanguage();
    const { auth } = usePage().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        customer_name: '',
        customer_phone: '',
        car_model: '',
        booking_date: '',
        booking_time: '',
        service_type: 'inspection',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/booking', {
            onSuccess: () => {
                reset();
                toast.success(t('booking_success') || 'Booking submitted successfully!');
            },
        });
    };

    return (
        <LazyMotion features={domAnimation}>
            <Head title="Booking Appointment - Diva AC" />
            <div className="min-h-screen bg-[#FDFDFC] text-[#1b1b18] selection:bg-red-600 selection:text-white dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                {/* Header */}
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
                <main className="mx-auto max-w-3xl px-6 pt-28 pb-12">
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-black tracking-tight uppercase sm:text-4xl">
                            {t('book_appointment') || 'Book an Appointment'}
                        </h1>
                        <p className="mt-2 text-[#1b1b18]/60 dark:text-white/60">
                            {t('booking_form_subtitle') ||
                                'Fill out the form below to schedule your service. We will confirm your appointment via WhatsApp.'}
                        </p>
                    </m.div>

                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-3xl border border-[#1b1b18]/10 bg-white/50 p-6 shadow-2xl backdrop-blur-xl sm:p-10 dark:border-white/10 dark:bg-black/50"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold tracking-wider text-[#1b1b18]/70 uppercase dark:text-white/70">
                                        <User className="size-4" />
                                        <span>{t('name') || 'Full Name'}</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.customer_name}
                                        onChange={(e) => setData('customer_name', e.target.value)}
                                        required
                                        className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-3 text-[#1b1b18] placeholder:text-[#1b1b18]/30 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none dark:border-white/20 dark:text-white dark:placeholder:text-white/30"
                                        placeholder={
                                            t('booking_placeholder_name') ||
                                            'Your Name'
                                        }
                                    />
                                    {errors.customer_name && <p className="text-xs text-red-600">{errors.customer_name}</p>}
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold tracking-wider text-[#1b1b18]/70 uppercase dark:text-white/70">
                                        <Phone className="size-4" />
                                        <span>
                                            {t('phone') || 'Phone / WhatsApp'}
                                        </span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.customer_phone}
                                        onChange={(e) => setData('customer_phone', e.target.value)}
                                        required
                                        className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-3 text-[#1b1b18] placeholder:text-[#1b1b18]/30 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none dark:border-white/20 dark:text-white dark:placeholder:text-white/30"
                                        placeholder={
                                            t('booking_placeholder_phone') ||
                                            'Your Phone / WhatsApp'
                                        }
                                    />
                                    {errors.customer_phone && <p className="text-xs text-red-600">{errors.customer_phone}</p>}
                                </div>
                            </div>

                            {/* Car Model */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold tracking-wider text-[#1b1b18]/70 uppercase dark:text-white/70">
                                    <Car className="size-4" />
                                    <span>
                                        {t('car_model') || 'Car Model & Year'}
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={data.car_model}
                                    onChange={(e) => setData('car_model', e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-3 text-[#1b1b18] placeholder:text-[#1b1b18]/30 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none dark:border-white/20 dark:text-white dark:placeholder:text-white/30"
                                    placeholder={
                                        t('booking_placeholder_car_model') ||
                                        'e.g. Daihatsu Ayla 2022'
                                    }
                                />
                                {errors.car_model && <p className="text-xs text-red-600">{errors.car_model}</p>}
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Date */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold tracking-wider text-[#1b1b18]/70 uppercase dark:text-white/70">
                                        <Calendar className="size-4" />
                                        <span>
                                            {t('date') || 'Preferred Date'}
                                        </span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.booking_date}
                                        onChange={(e) => setData('booking_date', e.target.value)}
                                        required
                                        className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-3 text-[#1b1b18] focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none dark:border-white/20 dark:text-white [&::-webkit-calendar-picker-indicator]:dark:invert"
                                    />
                                    {errors.booking_date && <p className="text-xs text-red-600">{errors.booking_date}</p>}
                                </div>

                                {/* Time */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold tracking-wider text-[#1b1b18]/70 uppercase dark:text-white/70">
                                        <Clock className="size-4" />
                                        <span>
                                            {t('time') || 'Preferred Time'}
                                        </span>
                                    </label>
                                    <input
                                        type="time"
                                        value={data.booking_time}
                                        onChange={(e) => setData('booking_time', e.target.value)}
                                        required
                                        className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-3 text-[#1b1b18] focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none dark:border-white/20 dark:text-white [&::-webkit-calendar-picker-indicator]:dark:invert"
                                    />
                                    {errors.booking_time && <p className="text-xs text-red-600">{errors.booking_time}</p>}
                                </div>
                            </div>

                            {/* Service Type */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold tracking-wider text-[#1b1b18]/70 uppercase dark:text-white/70">
                                    <PenTool className="size-4" />
                                    <span>
                                        {t('service_type') || 'Service Needed'}
                                    </span>
                                </label>
                                <SearchableSelect
                                    value={data.service_type}
                                    onChange={(val) => setData('service_type', val)}
                                    options={[
                                        { value: 'inspection', label: t('service_opt_inspection') || 'Inspection' },
                                        { value: 'cleaning', label: t('service_opt_cleaning') || 'AC Cleaning' },
                                        { value: 'freon', label: t('service_opt_freon') || 'Freon Refill' },
                                        { value: 'repair', label: t('service_opt_repair') || 'Major Repair' },
                                        { value: 'other', label: t('service_opt_other') || 'Other' },
                                    ]}
                                />
                                {errors.service_type && <p className="text-xs text-red-600">{errors.service_type}</p>}
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold tracking-wider text-[#1b1b18]/70 uppercase dark:text-white/70">
                                    <span>
                                        {t('notes') || 'Additional Notes'}
                                    </span>
                                </label>
                                <textarea
                                    rows={4}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-3 text-[#1b1b18] placeholder:text-[#1b1b18]/30 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none dark:border-white/20 dark:text-white dark:placeholder:text-white/30"
                                    placeholder={
                                        t('booking_placeholder_notes') ||
                                        'Additional Notes'
                                    }
                                ></textarea>
                                {errors.notes && <p className="text-xs text-red-600">{errors.notes}</p>}
                            </div>

                            <m.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={processing}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-4 font-bold text-white shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all hover:bg-red-700 hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] disabled:opacity-50"
                            >
                                {processing ? (
                                    <Loader2 className="size-5 animate-spin" />
                                ) : (
                                    <>
                                        <CheckCircle2 className="size-5" />
                                        {t('submit_booking') || 'Confirm Booking'}
                                    </>
                                )}
                            </m.button>
                        </form>
                    </m.div>
                </main>
            </div>
        </LazyMotion>
    );
}
