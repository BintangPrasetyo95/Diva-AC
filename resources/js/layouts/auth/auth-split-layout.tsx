import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
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
function AuthPageHeading({ titleKey, descKey }: { titleKey?: string; descKey?: string }) {
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

    return (
        <>
            <Preloader />
            <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
                <div className="relative hidden h-full flex-col bg-muted p-10 text-[#1b1b18] dark:text-white lg:flex dark:border-r">
                    <div className="absolute inset-0 bg-zinc-900 z-0">
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
                        className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#1b1b18]/5 text-[#1b1b18] transition-colors hover:bg-[#1b1b18]/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 sm:left-8 sm:top-8"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>

                    {/* Top Right: Menu Toggle */}
                    <div className="absolute right-6 top-6 z-50 flex flex-col items-end gap-2 sm:right-8 sm:top-8">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-all active:scale-95 ${isMenuOpen ? 'bg-red-600 text-white border-red-600' : 'bg-[#1b1b18]/5 border-[#1b1b18]/10 text-[#1b1b18] hover:bg-[#1b1b18]/10 dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/20'}`}
                        >
                            <Menu className={`size-5 transition-transform ${isMenuOpen ? 'rotate-90' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                    className="flex flex-col gap-4 rounded-3xl border border-[#1b1b18]/10 bg-white/90 p-6 backdrop-blur-xl dark:border-white/20 dark:bg-black/80 min-w-[220px] shadow-2xl"
                                >
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 mb-2">{t('language')}</span>
                                        <div className="flex items-center gap-1 rounded-full bg-[#1b1b18]/5 p-1 border border-[#1b1b18]/10 dark:bg-white/5 dark:border-white/10">
                                            <button 
                                                onClick={() => setLanguage('id')}
                                                className={`flex-1 px-3 py-2 text-xs font-bold rounded-xl transition-all ${language === 'id' ? 'bg-red-600 text-white shadow-md' : 'text-[#1b1b18]/60 hover:text-[#1b1b18] hover:bg-[#1b1b18]/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/10'}`}
                                            >
                                                ID
                                            </button>
                                            <button 
                                                onClick={() => setLanguage('en')}
                                                className={`flex-1 px-3 py-2 text-xs font-bold rounded-xl transition-all ${language === 'en' ? 'bg-red-600 text-white shadow-md' : 'text-[#1b1b18]/60 hover:text-[#1b1b18] hover:bg-[#1b1b18]/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/10'}`}
                                            >
                                                EN
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 mb-2">{t('appearance')}</span>
                                        <AppearanceToggleTab />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        {/* Logo at the top of the form */}
                        <div className="flex justify-center mb-2">
                            <Link href={home()} className="flex items-center">
                                <AppLogoIcon className='w-20 h-20' />
                            </Link>
                        </div>
                        
                        <AuthPageHeading titleKey={title} descKey={description} />
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
