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
                    className="absolute top-28 right-10 sm:bottom-10 sm:top-auto"
                >
                    <div className="flex flex-col items-center gap-2 sm:items-center">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#1b1b18]/40 [writing-mode:vertical-rl] dark:text-white/40 sm:text-xs">
                            {t('scroll_explore')}
                        </span>
                        <div className="h-8 w-px bg-linear-to-b from-[#1b1b18]/40 to-transparent dark:from-white/40 sm:h-12" />
                    </div>
                </m.div>
                {/* Model Credit - Bottom Left on Desktop */}



                <m.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="rounded-4xl border border-white/20 bg-white/5 p-8 backdrop-blur-md dark:border-white/5 dark:bg-black/5 max-w-3xl"
                >
                    <p className="mx-auto mb-8 text-lg font-medium text-[#1b1b18]/80 sm:text-xl dark:text-white/80">
                        {t('hero_tagline')}
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <m.a
                            href="#booking"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 rounded-full bg-red-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)]"
                        >
                            {t('book_now')}
                            <ArrowRight className="size-4" />
                        </m.a>
                        <m.a
                            href="#services"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="rounded-full border border-[#1b1b18]/20 bg-white/10 px-8 py-4 text-sm font-semibold text-[#1b1b18] backdrop-blur-md transition-all hover:bg-[#1b1b18]/5 dark:border-white/20 dark:text-white dark:hover:bg-white/5"
                        >
                            {t('explore_services')}
                        </m.a>
                    </div>
                </m.div>
            </div>
        </section>
    );
}
