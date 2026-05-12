import { Head, Link, usePage } from '@inertiajs/react';
import {
    LazyMotion,
    domAnimation,
    m,
    useScroll,
    useTransform,
    AnimatePresence,
} from 'framer-motion';
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

function LandingPage({
    canRegister,
    services = [],
    gallery = [],
    settings,
}: {
    canRegister: boolean;
    services: any[];
    gallery: any[];
    settings: any;
}) {
    const { auth } = usePage().props;
    const { scrollY } = useScroll();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isDesktopMenuOpen, setIsDesktopMenuOpen] = React.useState(false);
    const { language, setLanguage, t } = useLanguage();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const opacityValue = useTransform(scrollY, [0, 500], [1, 0.3]);

    return (
        <div className="relative w-full">
            {/* Fixed Background Scene — lazy loaded to avoid blocking the main thread */}
            {mounted && (
                <m.div
                    style={{ opacity: opacityValue }}
                    className="pointer-events-none fixed inset-0 z-0"
                >
                    <Suspense
                        fallback={
                            <div className="h-full w-full bg-white dark:bg-[#080808]" />
                        }
                    >
                        <ThreeScene />
                    </Suspense>
                </m.div>
            )}

            {/* Sticky Branding Title */}
            <div className="fixed top-6 left-6 z-50">
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-2 backdrop-blur-md dark:bg-black/20">
                    <AppLogo />
                </div>
            </div>

            <nav className="fixed top-6 right-6 z-50 flex items-center gap-4">
                {/* Desktop Navigation */}
                <div className="hidden items-center gap-4 lg:flex">
                    <AnimatePresence mode="wait">
                        {isDesktopMenuOpen && (
                            <m.div
                                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                                className="flex items-center gap-4"
                            >
                                {/* Language Switcher */}
                                <div className="flex items-center gap-1 rounded-full border border-[#1b1b18]/10 bg-[#1b1b18]/5 p-1 backdrop-blur-md dark:border-white/20 dark:bg-white/10">
                                    <button
                                        onClick={() => setLanguage('id')}
                                        className={`rounded-full px-3 py-1 text-[10px] font-bold transition-all ${language === 'id' ? 'bg-red-600 text-white shadow-lg' : 'text-[#1b1b18]/60 hover:bg-[#1b1b18]/5 hover:text-[#1b1b18] dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white'}`}
                                    >
                                        ID
                                    </button>
                                    <button
                                        onClick={() => setLanguage('en')}
                                        className={`rounded-full px-3 py-1 text-[10px] font-bold transition-all ${language === 'en' ? 'bg-red-600 text-white shadow-lg' : 'text-[#1b1b18]/60 hover:bg-[#1b1b18]/5 hover:text-[#1b1b18] dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white'}`}
                                    >
                                        EN
                                    </button>
                                </div>

                                <AppearanceToggleTab />

                                {auth.user ? (
                                    <Link
                                        href="/admin/dashboard"
                                        className="inline-block rounded-full border border-[#1b1b18]/10 bg-[#1b1b18]/5 px-6 py-2 text-sm font-medium text-[#1b1b18] backdrop-blur-md transition-all hover:bg-[#1b1b18]/10 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
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
                        className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-xl backdrop-blur-md transition-all active:scale-95 ${isDesktopMenuOpen ? 'border-red-600 bg-red-600 text-white' : 'border-[#1b1b18]/10 bg-[#1b1b18]/5 text-[#1b1b18] hover:bg-[#1b1b18]/10 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'}`}
                    >
                        <Menu
                            className={`size-6 transition-transform ${isDesktopMenuOpen ? 'rotate-90' : ''}`}
                        />
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex flex-col items-end gap-2 lg:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-xl backdrop-blur-md transition-all active:scale-95 ${isMenuOpen ? 'border-red-600 bg-red-600 text-white' : 'border-[#1b1b18]/10 bg-[#1b1b18]/5 text-[#1b1b18] hover:bg-[#1b1b18]/10 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'}`}
                    >
                        <Menu
                            className={`size-6 transition-transform ${isMenuOpen ? 'rotate-90' : ''}`}
                        />
                    </button>

                    <AnimatePresence>
                        {isMenuOpen && (
                            <m.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                className="flex min-w-[220px] flex-col gap-4 rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl dark:bg-black/40"
                            >
                                <div className="flex flex-col gap-2">
                                    <span className="mb-2 text-[10px] font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                        {t('language')}
                                    </span>
                                    <div className="flex items-center gap-1 rounded-full border border-[#1b1b18]/10 bg-[#1b1b18]/5 p-1 dark:border-white/10 dark:bg-white/5">
                                        <button
                                            onClick={() => setLanguage('id')}
                                            className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold transition-all ${language === 'id' ? 'bg-red-600 text-white shadow-md' : 'text-[#1b1b18]/60 hover:bg-[#1b1b18]/5 hover:text-[#1b1b18] dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white'}`}
                                        >
                                            Indonesia
                                        </button>
                                        <button
                                            onClick={() => setLanguage('en')}
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
                    <Services services={services} />
                </div>
                <Brands />
                <div className="bg-white/10 backdrop-blur-md dark:bg-black/20">
                    <Booking />
                    <Sparepart />
                    <Gallery items={gallery} />
                    <Testimonials />
                    <Contact settings={settings} />
                    <Footer settings={settings} />
                </div>
            </div>
        </div>
    );
}

export default function Welcome({
    canRegister = true,
    services = [],
    gallery = [],
    settings,
}: {
    canRegister?: boolean;
    services: any[];
    gallery: any[];
    settings: any;
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
                    y: isLoaded ? 0 : 20,
                }}
                transition={{
                    duration: 1.5,
                    ease: [0.22, 1, 0.36, 1], // Custom easeOutExpo
                    delay: 0.2, // Small delay to sync better with preloader exit
                }}
            >
                <LandingPage
                    canRegister={canRegister}
                    services={services}
                    gallery={gallery}
                    settings={settings}
                />
            </m.div>
        </LazyMotion>
    );
}
