import { Head, Link, usePage } from '@inertiajs/react';
import { LazyMotion, domAnimation, m, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import React, { Suspense } from 'react';
import AppLogo from '@/components/app-logo';
import AppearanceToggleTab from '@/components/appearance-tabs';
import Booking from '@/components/landing/Booking';
import Brands from '@/components/landing/Brands';
import Contact from '@/components/landing/Contact';
import Description from '@/components/landing/Description';
import Footer from '@/components/landing/Footer';
import Gallery from '@/components/landing/Gallery';
import Hero from '@/components/landing/Hero';
import Preloader from '@/components/landing/Preloader';
import Services from '@/components/landing/Services';
import Sparepart from '@/components/landing/Sparepart';
import Testimonials from '@/components/landing/Testimonials';
import { useLanguage } from '@/hooks/use-language';
import { dashboard, login, register } from '@/routes';

// Lazy-load the heavy Three.js scene — deferred to a separate chunk,
// preventing Three.js/fiber/drei from blocking the main thread on initial load.
const ThreeScene = React.lazy(() => import('@/components/ThreeScene'));

function LandingPage({ canRegister }: { canRegister: boolean }) {
    const { auth } = usePage().props;
    const { scrollY } = useScroll();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isDesktopMenuOpen, setIsDesktopMenuOpen] = React.useState(false);
    const { language, setLanguage, t } = useLanguage();
    
    const opacityValue = useTransform(scrollY, [0, 500], [1, 0.3]);

    return (
        <div className="relative w-full">
            {/* Fixed Background Scene — lazy loaded to avoid blocking the main thread */}
            <m.div
                style={{ opacity: opacityValue }}
                className="fixed inset-0 z-0 pointer-events-none"
            >
                <Suspense fallback={<div className="w-full h-full bg-white dark:bg-[#080808]" />}>
                    <ThreeScene />
                </Suspense>
            </m.div>

            {/* Sticky Branding Title */}
            <div className="fixed top-6 left-6 z-50">
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-2 backdrop-blur-md dark:bg-black/20">
                    <AppLogo />
                </div>
            </div>

            <nav className="fixed top-6 right-6 z-50 flex items-center gap-4">
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
                                        href={dashboard()}
                                        className="inline-block rounded-full bg-[#1b1b18]/5 px-6 py-2 text-sm font-medium text-[#1b1b18] backdrop-blur-md transition-all hover:bg-[#1b1b18]/10 border border-[#1b1b18]/10 dark:bg-white/10 dark:text-white dark:border-white/20 dark:hover:bg-white/20"
                                    >
                                        {t('dashboard')}
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={login()}
                                            className="inline-block rounded-full border border-[#1b1b18]/20 bg-transparent px-4 py-1.5 text-sm font-bold text-[#1b1b18] transition-all hover:bg-[#1b1b18]/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                                        >
                                            {t('login')}
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="inline-block rounded-full bg-red-600 px-4 py-1.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-red-700"
                                            >
                                                {t('register')}
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </m.div>
                        )}
                    </AnimatePresence>

                    <button 
                        onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                        className={`flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md border shadow-xl transition-all active:scale-95 ${isDesktopMenuOpen ? 'bg-red-600 text-white border-red-600' : 'bg-[#1b1b18]/5 border-[#1b1b18]/10 text-[#1b1b18] hover:bg-[#1b1b18]/10 dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/20'}`}
                    >
                        <Menu className={`size-6 transition-transform ${isDesktopMenuOpen ? 'rotate-90' : ''}`} />
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="lg:hidden flex flex-col items-end gap-2">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md border shadow-xl transition-all active:scale-95 ${isMenuOpen ? 'bg-red-600 text-white border-red-600' : 'bg-[#1b1b18]/5 border-[#1b1b18]/10 text-[#1b1b18] hover:bg-[#1b1b18]/10 dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/20'}`}
                    >
                        <Menu className={`size-6 transition-transform ${isMenuOpen ? 'rotate-90' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                        {isMenuOpen && (
                            <m.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                className="flex flex-col gap-4 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl dark:bg-black/40 min-w-[220px] shadow-2xl"
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
                                            href={dashboard()}
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
                                            {canRegister && (
                                                <Link
                                                    href={register()}
                                                    className="block rounded-xl bg-red-600 px-4 py-2 text-center text-sm font-bold text-white shadow-lg transition-all hover:bg-red-700"
                                                >
                                                    {t('register')}
                                                </Link>
                                            )}
                                        </>
                                    )}
                                </div>
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>

            <div className="relative z-10">
                <Hero />
                <div className="bg-white/10 backdrop-blur-md dark:bg-black/20">
                    <Description />
                    <Services />
                </div>
                <Brands />
                <div className="bg-white/10 backdrop-blur-md dark:bg-black/20">
                    <Booking />
                    <Sparepart />
                    <Gallery />
                    <Testimonials />
                    <Contact />
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const [isLoaded, setIsLoaded] = React.useState(false);

    return (
        <LazyMotion features={domAnimation}>
            <Head title="Welcome" />
            <Preloader onLoadingComplete={() => setIsLoaded(true)} />
            
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                    opacity: isLoaded ? 1 : 0, 
                    y: isLoaded ? 0 : 20 
                }}
                transition={{ 
                    duration: 1.5, 
                    ease: [0.22, 1, 0.36, 1], // Custom easeOutExpo
                    delay: 0.2 // Small delay to sync better with preloader exit
                }}
            >
                <LandingPage canRegister={canRegister} />
            </m.div>
        </LazyMotion>
    );
}
