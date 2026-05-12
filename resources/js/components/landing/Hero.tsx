import { m } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export default function Hero() {
    const { t } = useLanguage();

    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* Gray Overlay */}
            <div className="absolute inset-0 z-0 bg-gray-500/10 dark:bg-black/20" />

            <div className="relative z-10 flex h-full flex-col items-center justify-end bg-transparent px-6 pb-10 text-center sm:pb-10">
                {/* Scroll Indicator - Top on Mobile, Bottom-Right on Desktop */}
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: 1 }}
                    className="absolute top-28 right-10 sm:top-auto sm:bottom-10"
                >
                    <div className="flex flex-col items-center gap-2 sm:items-center">
                        <span className="text-[10px] tracking-[0.3em] text-[#1b1b18]/40 uppercase [writing-mode:vertical-rl] sm:text-xs dark:text-white/40">
                            {t('scroll_explore')}
                        </span>
                        <div className="h-8 w-px bg-linear-to-b from-[#1b1b18]/40 to-transparent sm:h-12 dark:from-white/40" />
                    </div>
                </m.div>
                {/* Model Credit - Bottom Left on Desktop */}

                <m.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mx-4 mb-16 max-w-3xl rounded-3xl border border-white/20 bg-white/5 p-6 backdrop-blur-md sm:mx-0 sm:rounded-4xl sm:p-8 dark:border-white/5 dark:bg-black/5"
                >
                    <p className="mx-auto mb-6 text-sm font-medium text-[#1b1b18]/80 sm:mb-8 sm:text-lg dark:text-white/80">
                        {t('hero_tagline')}
                    </p>
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                        <m.a
                            href="#booking"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-xs font-bold text-white shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all hover:bg-red-700 hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] sm:w-auto sm:px-8 sm:py-4 sm:text-sm"
                        >
                            {t('book_now')}
                            <ArrowRight className="size-4" />
                        </m.a>
                        <m.a
                            href="#services"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full rounded-full border border-[#1b1b18]/20 bg-white/10 px-6 py-3 text-xs font-semibold text-[#1b1b18] backdrop-blur-md transition-all hover:bg-[#1b1b18]/5 sm:w-auto sm:px-8 sm:py-4 sm:text-sm dark:border-white/20 dark:text-white dark:hover:bg-white/5"
                        >
                            {t('explore_services')}
                        </m.a>
                    </div>
                </m.div>
            </div>
        </section>
    );
}
