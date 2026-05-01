import { Head, Link, usePage } from '@inertiajs/react';
import { m, Variants, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    CheckCircle2,
    ShieldCheck,
    Wind,
    ShoppingCart,
    PenTool,
    Gauge,
    History,
    ChevronRight,
    Star,
    Zap,
    Trophy,
    Menu
} from 'lucide-react';
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import Footer from '@/components/landing/Footer';
import AppLogo from '@/components/app-logo';
import AppearanceToggleTab from '@/components/appearance-tabs';
import { login, register } from '@/routes';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
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

export default function ServiceInfo({ slug }: { slug: string }) {
    const { t, language, setLanguage } = useLanguage();
    const { auth } = usePage().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

    const serviceDetails: Record<string, any> = {
        'ac-service': {
            title: t('service_ac_title'),
            desc: t('service_ac_desc'),
            icon: Wind,
            image: '/img/services/s1.jpg',
            features: [
                t('f_ac_1'),
                t('f_ac_2'),
                t('f_ac_3'),
                t('f_ac_4')
            ],
            benefits: [
                t('b_ac_1'),
                t('b_ac_2'),
                t('b_ac_3'),
                t('b_ac_4')
            ]
        },
        'spare-parts': {
            title: t('service_parts_title'),
            desc: t('service_parts_desc'),
            icon: ShoppingCart,
            image: '/img/services/s2.jpg',
            features: [
                t('f_sp_1'),
                t('f_sp_2'),
                t('f_sp_3'),
                t('f_sp_4')
            ],
            benefits: [
                t('b_sp_1'),
                t('b_sp_2'),
                t('b_sp_3'),
                t('b_sp_4')
            ]
        },
        'maintenance': {
            title: t('service_maintenance_title'),
            desc: t('service_maintenance_desc'),
            icon: PenTool,
            image: '/img/services/s3.jpg',
            features: [
                t('f_mn_1'),
                t('f_mn_2'),
                t('f_mn_3'),
                t('f_mn_4')
            ],
            benefits: [
                t('b_mn_1'),
                t('b_mn_2'),
                t('b_mn_3'),
                t('b_mn_4')
            ]
        },
        'freon-refill': {
            title: t('service_freon_title'),
            desc: t('service_freon_desc'),
            icon: Gauge,
            image: '/img/services/s4.jpg',
            features: [
                t('f_fr_1'),
                t('f_fr_2'),
                t('f_fr_3'),
                t('f_fr_4')
            ],
            benefits: [
                t('b_fr_1'),
                t('b_fr_2'),
                t('b_fr_3'),
                t('b_fr_4')
            ]
        },
        'odor-removal': {
            title: t('service_odor_title'),
            desc: t('service_odor_desc'),
            icon: ShieldCheck,
            image: '/img/services/s5.jpg',
            features: [
                t('f_or_1'),
                t('f_or_2'),
                t('f_or_3'),
                t('f_or_4')
            ],
            benefits: [
                t('b_or_1'),
                t('b_or_2'),
                t('b_or_3'),
                t('b_or_4')
            ]
        },
        'central-lock': {
            title: t('service_vintage_title'),
            desc: t('service_vintage_desc'),
            icon: History,
            image: '/img/services/s6.jpg',
            features: [
                t('f_cl_1'),
                t('f_cl_2'),
                t('f_cl_3'),
                t('f_cl_4')
            ],
            benefits: [
                t('b_cl_1'),
                t('b_cl_2'),
                t('b_cl_3'),
                t('b_cl_4')
            ]
        },
        'system-diagnostics': {
            title: t('service_diagnostic_title'),
            desc: t('service_diagnostic_desc'),
            icon: Gauge,
            image: '/img/services/s4.jpg',
            features: [
                t('f_dg_1'),
                t('f_dg_2'),
                t('f_dg_3'),
                t('f_dg_4')
            ],
            benefits: [
                t('b_dg_1'),
                t('b_dg_2'),
                t('b_dg_3'),
                t('b_dg_4')
            ]
        },
        'compressor-overhaul': {
            title: t('service_overhaul_title'),
            desc: t('service_overhaul_desc'),
            icon: PenTool,
            image: '/img/services/s3.jpg',
            features: [
                t('f_ov_1'),
                t('f_ov_2'),
                t('f_ov_3'),
                t('f_ov_4')
            ],
            benefits: [
                t('b_ov_1'),
                t('b_ov_2'),
                t('b_ov_3'),
                t('b_ov_4')
            ]
        }
    };

    const service = serviceDetails[slug] || serviceDetails['ac-service'];

    return (
        <LazyMotion features={domAnimation}>
            <Head title={`${service.title} - Diva AC`} />

            <div className="min-h-screen bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC] selection:bg-red-600 selection:text-white pb-24">
                
                {/* Header - Reusing structure from Booking/Spareparts */}
                <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-white/50 dark:bg-black/50 border-b border-[#1b1b18]/10 dark:border-white/10">
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/#services" 
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

                {/* Hero Section */}
                <div className="relative h-[60vh] w-full overflow-hidden">
                    <m.img 
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        src={service.image} 
                        className="h-full w-full object-cover"
                        alt={service.title}
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-white dark:to-[#0a0a0a]" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-24">
                        <m.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="max-w-4xl"
                        >
                            <div className="mb-6 inline-flex size-16 items-center justify-center rounded-3xl bg-red-600 text-white shadow-2xl">
                                <service.icon className="size-8" />
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white uppercase mb-4">
                                {service.title}
                            </h1>
                            <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
                                {service.desc}
                            </p>
                        </m.div>
                    </div>
                </div>

                {/* Content Section */}
                <m.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="max-w-7xl mx-auto px-8 lg:px-24 py-24"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                        {/* Features */}
                        <m.div variants={itemVariants} className="flex flex-col gap-12">
                            <div>
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-red-600 mb-4 flex items-center gap-3">
                                    <Zap className="size-4" />
                                    {t('service_whats_included')}
                                </h2>
                                <h3 className="text-4xl font-black tracking-tight text-[#1b1b18] dark:text-white uppercase">
                                    {t('service_comp_solutions')}
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                {service.features.map((feature: string, i: number) => (
                                    <div key={i} className="group flex items-center gap-6 p-6 rounded-4xl bg-[#1b1b18]/2 dark:bg-white/2 border border-[#1b1b18]/5 dark:border-white/5 hover:bg-red-600/5 transition-colors">
                                        <div className="size-10 rounded-xl bg-white dark:bg-black/40 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <CheckCircle2 className="size-5 text-red-600" />
                                        </div>
                                        <span className="text-lg font-bold text-[#1b1b18]/80 dark:text-white/80">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </m.div>

                        {/* Benefits & CTA */}
                        <m.div variants={itemVariants} className="flex flex-col gap-12">
                            <div>
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-4 flex items-center gap-3">
                                    <Trophy className="size-4" />
                                    {t('service_why_choose')}
                                </h2>
                                <h3 className="text-4xl font-black tracking-tight text-[#1b1b18] dark:text-white uppercase">
                                    {t('service_expert_benefits')}
                                </h3>
                            </div>
                            <div className="space-y-8 mb-12">
                                {service.benefits.map((benefit: string, i: number) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="mt-1 flex size-5 items-center justify-center rounded-full bg-blue-600/10 text-blue-600">
                                            <Star className="size-3 fill-current" />
                                        </div>
                                        <span className="text-lg font-medium text-[#1b1b18]/60 dark:text-white/60">{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href="/booking" className="group block">
                                <div className="relative overflow-hidden rounded-[2.5rem] bg-red-600 p-8 text-white shadow-2xl transition-transform hover:scale-[1.02] active:scale-95">
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-black uppercase tracking-widest opacity-60">{t('service_ready_start')}</span>
                                            <span className="text-2xl font-black uppercase tracking-tighter">{t('service_book_now_cta')}</span>
                                        </div>
                                        <div className="size-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md group-hover:rotate-12 transition-transform">
                                            <ChevronRight className="size-8" />
                                        </div>
                                    </div>
                                    <div className="absolute -right-8 -top-8 size-48 rounded-full bg-white/10 blur-3xl" />
                                    <div className="absolute -left-8 -bottom-8 size-32 rounded-full bg-black/10 blur-2xl" />
                                </div>
                            </Link>
                        </m.div>
                    </div>
                </m.div>

                {/* Statistics / Trust Bar */}
                <m.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="border-y border-[#1b1b18]/5 dark:border-white/5 bg-[#1b1b18]/1 dark:bg-white/1 py-12"
                >
                    <div className="max-w-7xl mx-auto px-8 lg:px-24 grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <span className="block text-3xl font-black text-[#1b1b18] dark:text-white mb-1 tracking-tighter uppercase">5k+</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('service_stat_clients')}</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-3xl font-black text-[#1b1b18] dark:text-white mb-1 tracking-tighter uppercase">10+</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('service_stat_experience')}</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-3xl font-black text-[#1b1b18] dark:text-white mb-1 tracking-tighter uppercase">100%</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('service_stat_parts')}</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-3xl font-black text-[#1b1b18] dark:text-white mb-1 tracking-tighter uppercase">24h</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">{t('service_stat_support')}</span>
                        </div>
                    </div>
                </m.div>

                <Footer />
            </div>
        </LazyMotion>
    );
}
