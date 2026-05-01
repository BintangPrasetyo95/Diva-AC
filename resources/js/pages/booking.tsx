import { Head, Link, usePage } from '@inertiajs/react';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Car, Phone, User, PenTool, Menu } from 'lucide-react';
import React, { useState } from 'react';
import AppLogo from '@/components/app-logo';
import AppearanceToggleTab from '@/components/appearance-tabs';
import { useLanguage } from '@/hooks/use-language';
import { dashboard, login, register } from '@/routes';

export default function Booking() {
    const { t, language, setLanguage } = useLanguage();
    const { auth } = usePage().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
    
    return (
        <LazyMotion features={domAnimation}>
            <Head title="Booking Appointment - Diva AC" />
            <div className="min-h-screen bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC] selection:bg-red-600 selection:text-white">
                
                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-white/50 dark:bg-black/50 border-b border-[#1b1b18]/10 dark:border-white/10">
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/" 
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1b1b18]/5 hover:bg-[#1b1b18]/10 dark:bg-white/5 dark:hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft className="size-5" />
                        </Link>
                        <AppLogo />
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-4">
                            <AnimatePresence mode="wait">
                                {isDesktopMenuOpen && (
                                    <m.div
                                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: 50, scale: 0.9 }}
                                        className="flex items-center gap-4"
                                    >
                                        {/* Language Switcher */}
                                        <div className="flex items-center gap-1 rounded-full bg-[#1b1b18]/5 p-1 backdrop-blur-md border border-[#1b1b18]/10 dark:bg-white/10 dark:border-white/20">
                                            <button 
                                                onClick={() => setLanguage('id')}
                                                className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${language === 'id' ? 'bg-red-600 text-white shadow-lg' : 'text-[#1b1b18]/60 hover:text-[#1b1b18] hover:bg-[#1b1b18]/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/10'}`}
                                            >
                                                ID
                                            </button>
                                            <button 
                                                onClick={() => setLanguage('en')}
                                                className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${language === 'en' ? 'bg-red-600 text-white shadow-lg' : 'text-[#1b1b18]/60 hover:text-[#1b1b18] hover:bg-[#1b1b18]/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/10'}`}
                                            >
                                                EN
                                            </button>
                                        </div>

                                        <AppearanceToggleTab />
                                        
                                        {auth.user ? (
                                            <Link
                                                href="/dashboard"
                                                className="inline-flex h-10 items-center justify-center rounded-full bg-[#1b1b18]/5 px-6 text-sm font-medium text-[#1b1b18] backdrop-blur-md transition-all hover:bg-[#1b1b18]/10 border border-[#1b1b18]/10 dark:bg-white/10 dark:text-white dark:border-white/20 dark:hover:bg-white/20"
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
                                onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                                className={`relative z-50 flex h-12 w-12 shrink-0 items-center justify-center rounded-full backdrop-blur-md border shadow-xl transition-all active:scale-95 ${isDesktopMenuOpen ? 'bg-red-600 text-white border-red-600' : 'bg-[#1b1b18]/5 border-[#1b1b18]/10 text-[#1b1b18] hover:bg-[#1b1b18]/10 dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/20'}`}
                            >
                                <Menu className={`size-6 transition-transform ${isDesktopMenuOpen ? 'rotate-90' : ''}`} />
                            </button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="lg:hidden flex flex-col items-end gap-2 relative">
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`relative z-50 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md border shadow-xl transition-all active:scale-95 ${isMenuOpen ? 'bg-red-600 text-white border-red-600' : 'bg-[#1b1b18]/5 border-[#1b1b18]/10 text-[#1b1b18] hover:bg-[#1b1b18]/10 dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/20'}`}
                            >
                                <Menu className={`size-6 transition-transform ${isMenuOpen ? 'rotate-90' : ''}`} />
                            </button>
                            
                            <AnimatePresence>
                                {isMenuOpen && (
                                    <m.div
                                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                        className="absolute top-16 right-0 flex flex-col gap-4 rounded-3xl border border-white/20 bg-white/50 p-6 backdrop-blur-xl dark:bg-black/50 min-w-[220px] shadow-2xl"
                                    >
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 mb-2">{t('language')}</span>
                                            <div className="flex items-center gap-1 rounded-full bg-[#1b1b18]/5 p-1 border border-[#1b1b18]/10 dark:bg-white/5 dark:border-white/10">
                                                <button 
                                                    onClick={() => setLanguage('id')}
                                                    className={`flex-1 px-3 py-2 text-xs font-bold rounded-xl transition-all ${language === 'id' ? 'bg-red-600 text-white shadow-md' : 'text-[#1b1b18]/60 hover:text-[#1b1b18] hover:bg-[#1b1b18]/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/10'}`}
                                                >
                                                    Indonesia
                                                </button>
                                                <button 
                                                    onClick={() => setLanguage('en')}
                                                    className={`flex-1 px-3 py-2 text-xs font-bold rounded-xl transition-all ${language === 'en' ? 'bg-red-600 text-white shadow-md' : 'text-[#1b1b18]/60 hover:text-[#1b1b18] hover:bg-[#1b1b18]/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/10'}`}
                                                >
                                                    English
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 mb-2">{t('appearance')}</span>
                                            <AppearanceToggleTab />
                                        </div>
                                        
                                        <div className="h-px w-full bg-[#1b1b18]/10 dark:bg-white/10" />
                                        
                                        <div className="flex flex-col gap-3">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 mb-1">{t('account')}</span>
                                            {auth.user ? (
                                                <Link
                                                    href="/dashboard"
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
                <main className="pt-28 pb-12 px-6 max-w-3xl mx-auto">
                    <m.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">
                            {t('book_appointment') || 'Book an Appointment'}
                        </h1>
                        <p className="mt-2 text-[#1b1b18]/60 dark:text-white/60">
                            {t('booking_form_subtitle') || 'Fill out the form below to schedule your service. We will confirm your appointment via WhatsApp.'}
                        </p>
                    </m.div>

                    <m.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-3xl border border-[#1b1b18]/10 bg-white/50 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-black/50 sm:p-10 shadow-2xl"
                    >
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1b1b18]/70 dark:text-white/70">
                                        <User className="size-4" />
                                        <span>{t('name') || 'Full Name'}</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-3 text-[#1b1b18] placeholder:text-[#1b1b18]/30 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 dark:border-white/20 dark:text-white dark:placeholder:text-white/30"
                                        placeholder={t('booking_placeholder_name') || 'Your Name'}
                                    />
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1b1b18]/70 dark:text-white/70">
                                        <Phone className="size-4" />
                                        <span>{t('phone') || 'Phone / WhatsApp'}</span>
                                    </label>
                                    <input 
                                        type="tel" 
                                        required
                                        className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-3 text-[#1b1b18] placeholder:text-[#1b1b18]/30 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 dark:border-white/20 dark:text-white dark:placeholder:text-white/30"
                                        placeholder={t('booking_placeholder_phone') || 'Your Phone / WhatsApp'}
                                    />
                                </div>
                            </div>

                            {/* Car Model */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1b1b18]/70 dark:text-white/70">
                                    <Car className="size-4" />
                                    <span>{t('car_model') || 'Car Model & Year'}</span>
                                </label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-3 text-[#1b1b18] placeholder:text-[#1b1b18]/30 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 dark:border-white/20 dark:text-white dark:placeholder:text-white/30"
                                    placeholder={t('booking_placeholder_car_model') || 'e.g. Daihatsu Ayla 2022'}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Date */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1b1b18]/70 dark:text-white/70">
                                        <Calendar className="size-4" />
                                        <span>{t('date') || 'Preferred Date'}</span>
                                    </label>
                                    <input 
                                        type="date" 
                                        required
                                        className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-3 text-[#1b1b18] focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 dark:border-white/20 dark:text-white [&::-webkit-calendar-picker-indicator]:dark:invert"
                                    />
                                </div>

                                {/* Time */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1b1b18]/70 dark:text-white/70">
                                        <Clock className="size-4" />
                                        <span>{t('time') || 'Preferred Time'}</span>
                                    </label>
                                    <input 
                                        type="time" 
                                        required
                                        className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-3 text-[#1b1b18] focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 dark:border-white/20 dark:text-white [&::-webkit-calendar-picker-indicator]:dark:invert"
                                    />
                                </div>
                            </div>

                            {/* Service Type */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1b1b18]/70 dark:text-white/70">
                                    <PenTool className="size-4" />
                                    <span>{t('service_type') || 'Service Needed'}</span>
                                </label>
                                <select className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-3 text-[#1b1b18] focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 dark:border-white/20 dark:text-white [&>option]:dark:bg-zinc-900">
                                    <option value="inspection">{t('service_opt_inspection')}</option>
                                    <option value="cleaning">{t('service_opt_cleaning')}</option>
                                    <option value="freon">{t('service_opt_freon')}</option>
                                    <option value="repair">{t('service_opt_repair')}</option>
                                    <option value="other">{t('service_opt_other')}</option>
                                </select>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1b1b18]/70 dark:text-white/70">
                                    <span>{t('notes') || 'Additional Notes'}</span>
                                </label>
                                <textarea 
                                    rows={4}
                                    className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-3 text-[#1b1b18] placeholder:text-[#1b1b18]/30 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 dark:border-white/20 dark:text-white dark:placeholder:text-white/30"
                                    placeholder={t('booking_placeholder_notes') || 'Additional Notes'}
                                ></textarea>
                            </div>

                            <m.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-4 font-bold text-white transition-all hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)]"
                            >
                                {t('submit_booking') || 'Confirm Booking'}
                            </m.button>
                        </form>
                    </m.div>
                </main>
            </div>
        </LazyMotion>
    );
}
