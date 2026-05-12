import { Link, usePage } from '@inertiajs/react';
import {
    AnimatePresence,
    motion,
    LazyMotion,
    domAnimation,
    m,
} from 'framer-motion';
import { ArrowLeft, Menu } from 'lucide-react';
import { useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import AppearanceToggleTab from '@/components/appearance-tabs';
import FluidBubblesScene from '@/components/FluidBubblesScene';
import Preloader from '@/components/landing/Preloader';
import { useLanguage } from '@/hooks/use-language';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

// Separate component so it always re-renders on language change,
// even if the parent layout is memoized by the React compiler.
function AuthPageHeading({
    titleKey,
    descKey,
}: {
    titleKey?: string;
    descKey?: string;
}) {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-xl font-medium">{t(titleKey ?? '')}</h1>
            <p className="text-sm text-balance text-muted-foreground">
                {t(descKey ?? '')}
            </p>
        </div>
    );
}

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <LazyMotion features={domAnimation}>
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
                className="relative"
            >
                <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
                    <div className="relative hidden h-full flex-col bg-muted p-10 text-[#1b1b18] lg:flex dark:border-r dark:text-white">
                        <div className="absolute inset-0 z-0 bg-zinc-900">
                            <FluidBubblesScene />
                        </div>
                        <Link
                            href={home()}
                            className="relative z-20 flex items-center text-lg font-medium"
                        >
                            <AppLogoIcon className="mr-2 size-8 fill-current" />
                            {name}
                        </Link>
                    </div>
                    <div className="relative flex h-full w-full items-center justify-center lg:p-8">
                        {/* Top Left: Back Button */}
                        <Link
                            href={home()}
                            className="absolute top-6 left-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#1b1b18]/5 text-[#1b1b18] transition-colors hover:bg-[#1b1b18]/10 sm:top-8 sm:left-8 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>

                        {/* Top Right: Menu Toggle */}
                        <div className="absolute top-6 right-6 z-50 flex flex-col items-end gap-2 sm:top-8 sm:right-8">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-all active:scale-95 ${isMenuOpen ? 'border-red-600 bg-red-600 text-white' : 'border-[#1b1b18]/10 bg-[#1b1b18]/5 text-[#1b1b18] hover:bg-[#1b1b18]/10 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'}`}
                            >
                                <Menu
                                    className={`size-5 transition-transform ${isMenuOpen ? 'rotate-90' : ''}`}
                                />
                            </button>

                            <AnimatePresence>
                                {isMenuOpen && (
                                    <motion.div
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
                                        className="flex min-w-[220px] flex-col gap-4 rounded-3xl border border-[#1b1b18]/10 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:border-white/20 dark:bg-black/80"
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
                                                    ID
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setLanguage('en')
                                                    }
                                                    className={`flex-1 rounded-xl px-3 py-2 text-xs font-bold transition-all ${language === 'en' ? 'bg-red-600 text-white shadow-md' : 'text-[#1b1b18]/60 hover:bg-[#1b1b18]/5 hover:text-[#1b1b18] dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white'}`}
                                                >
                                                    EN
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <span className="mb-2 text-[10px] font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                                {t('appearance')}
                                            </span>
                                            <AppearanceToggleTab />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                            {/* Logo at the top of the form */}
                            <div className="mb-2 flex justify-center">
                                <Link
                                    href={home()}
                                    className="flex items-center"
                                >
                                    <AppLogoIcon className="h-20 w-20" />
                                </Link>
                            </div>

                            <AuthPageHeading
                                titleKey={title}
                                descKey={description}
                            />
                            {children}
                        </div>
                    </div>
                </div>
            </m.div>
        </LazyMotion>
    );
}
