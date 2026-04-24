import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { dashboard, login, register } from '@/routes';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Hero from '@/components/landing/Hero';
import Description from '@/components/landing/Description';
import Services from '@/components/landing/Services';
import Booking from '@/components/landing/Booking';
import Gallery from '@/components/landing/Gallery';
import Testimonials from '@/components/landing/Testimonials';
import Contact from '@/components/landing/Contact';
import Footer from '@/components/landing/Footer';
import AppearanceToggleTab from '@/components/appearance-tabs';
import ThreeScene from '@/components/ThreeScene';
import Preloader from '@/components/landing/Preloader';
import AppLogo from '@/components/app-logo';
import { LanguageProvider, useLanguage } from '@/hooks/use-language';

function LandingPage({ canRegister }: { canRegister: boolean }) {
    const { auth } = usePage().props;
    const { scrollY } = useScroll();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isDesktopMenuOpen, setIsDesktopMenuOpen] = React.useState(false);
    const { language, setLanguage, t } = useLanguage();
    
    // Blur from 0 to 20px over the first 500px of scroll
    const blurValue = useTransform(scrollY, [0, 500], [0, 10]);
    const opacityValue = useTransform(scrollY, [0, 500], [1, 0.3]);

    return (
        <div className="relative w-full">
            {/* Fixed Background Scene */}
            <motion.div 
                style={{ filter: useTransform(blurValue, (v) => `blur(${v}px)`), opacity: opacityValue }}
                className="fixed inset-0 z-0 pointer-events-none"
            >
                <ThreeScene />
            </motion.div>

            {/* Sticky Branding Title */}
            <div className="fixed top-6 left-6 z-50">
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-2 backdrop-blur-md dark:bg-black/20">
                    <AppLogo />
                </div>
            </div>

            <nav className="fixed top-6 right-6 z-50 flex items-center gap-4">
                {/* Desktop Navigation */}
                <div className="hidden sm:flex items-center gap-4">
                    <AnimatePresence mode="wait">
                        {isDesktopMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                                className="flex items-center gap-4"
                            >
                                {/* Language Switcher */}
                                <div className="flex items-center gap-1 rounded-full bg-white/10 p-1 backdrop-blur-md border border-white/20 dark:bg-black/20">
                                    <button 
                                        onClick={() => setLanguage('id')}
                                        className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${language === 'id' ? 'bg-red-600 text-white' : 'text-white/40 hover:text-white'}`}
                                    >
                                        ID
                                    </button>
                                    <button 
                                        onClick={() => setLanguage('en')}
                                        className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${language === 'en' ? 'bg-red-600 text-white' : 'text-white/40 hover:text-white'}`}
                                    >
                                        EN
                                    </button>
                                </div>

                                <AppearanceToggleTab />
                                
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="inline-block rounded-full bg-white/10 px-6 py-2 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/20 border border-white/20 dark:bg-black/20"
                                    >
                                        {t('dashboard')}
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-4 rounded-full bg-white/10 px-4 py-1 backdrop-blur-md border border-white/20 dark:bg-black/20">
                                        <Link
                                            href={login()}
                                            className="inline-block px-2 py-1 text-sm font-medium text-white transition-all hover:text-gray-300 dark:text-white"
                                        >
                                            {t('login')}
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="inline-block rounded-full bg-red-600 px-4 py-1.5 text-sm font-bold text-white transition-all hover:bg-red-700"
                                            >
                                                {t('register')}
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button 
                        onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl transition-all active:scale-95 hover:bg-white/20"
                    >
                        <Menu className={`size-6 transition-transform ${isDesktopMenuOpen ? 'rotate-90' : ''}`} />
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="sm:hidden flex flex-col items-end gap-2">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl transition-all active:scale-95"
                    >
                        <Menu className="size-6" />
                    </button>
                    
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                className="flex flex-col gap-4 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl dark:bg-black/40 min-w-[220px] shadow-2xl"
                            >
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">{t('language')}</span>
                                    <div className="flex items-center gap-1 rounded-full bg-white/5 p-1 border border-white/10">
                                        <button 
                                            onClick={() => setLanguage('id')}
                                            className={`flex-1 px-3 py-2 text-xs font-bold rounded-xl transition-all ${language === 'id' ? 'bg-red-600 text-white' : 'text-white/40'}`}
                                        >
                                            Indonesia
                                        </button>
                                        <button 
                                            onClick={() => setLanguage('en')}
                                            className={`flex-1 px-3 py-2 text-xs font-bold rounded-xl transition-all ${language === 'en' ? 'bg-red-600 text-white' : 'text-white/40'}`}
                                        >
                                            English
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">{t('appearance')}</span>
                                    <AppearanceToggleTab />
                                </div>
                                
                                <div className="h-[1px] w-full bg-white/10" />
                                
                                <div className="flex flex-col gap-3">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{t('account')}</span>
                                    {auth.user ? (
                                        <Link
                                            href={dashboard()}
                                            className="block rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/20"
                                        >
                                            {t('dashboard')}
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={login()}
                                                className="block px-4 py-2 text-sm font-medium text-white transition-all hover:text-red-500"
                                            >
                                                {t('login')}
                                            </Link>
                                            {canRegister && (
                                                <Link
                                                    href={register()}
                                                    className="block rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white text-center shadow-lg"
                                                >
                                                    {t('register')}
                                                </Link>
                                            )}
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>

            <div className="relative z-10">
                <Hero />
                <Description />
                <Services />
                <Booking />
                <Gallery />
                <Testimonials />
                <Contact />
                <Footer />
            </div>
        </div>
    );
}

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    return (
        <LanguageProvider>
            <Head title="" />
            <Preloader />
            <LandingPage canRegister={canRegister} />
        </LanguageProvider>
    );
}
