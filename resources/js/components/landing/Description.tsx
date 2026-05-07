import { m } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { useLanguage } from '@/hooks/use-language';

export default function Description() {
    const { t } = useLanguage();

    return (
        <section className="py-12 px-4 sm:px-6">
            <div className="mx-auto max-w-6xl">
                <m.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="relative overflow-hidden rounded-3xl"
                >
                    {/* Gradient background — light mode */}
                    <div
                        className="absolute inset-0 dark:hidden"
                        style={{
                            background:
                                'linear-gradient(to left, #121421 0%, #3F435E 15%, #f0eeeb 70%, #f0eeeb 100%)',
                        }}
                    />
                    {/* Gradient background — dark mode */}
                    <div
                        className="absolute inset-0 hidden dark:block"
                        style={{
                            background:
                                'linear-gradient(to left, #121421 0%, #3F435E 15%, #1f1f1c 70%, #1f1f1c 100%)',
                        }}
                    />

                    {/*
                     * Layout:
                     *   sm and below → column (image on top, text below)
                     *   md and above → row   (text left, image right, same height)
                     */}
                    <div className="relative z-10 flex flex-col md:flex-row md:items-stretch pt-16 pr-16">

                        {/* ── Image ── */}
                        {/* On small screens it appears first (top).
                            On medium+ it moves to the right via order-last. */}
                        <m.div
                            initial={{ opacity: 0, scale: 1.05 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.75, ease: 'easeOut' }}
                            className="
                                relative flex justify-center overflow-hidden
                                /* small: natural height, centered */
                                w-full
                                /* medium+: right column, fills card height */
                                md:order-last md:w-2/5
                            "
                        >
                            <img
                                // src="/img/actor.png"
                                alt="Diva AC Owner"
                                /*
                                 * Small screens  → fixed reasonable height so it doesn't
                                 *                   dominate the card
                                 * Medium screens → h-full so it matches the text column;
                                 *                   object-bottom keeps the figure grounded
                                 */
                                className="
                                    h-48 sm:h-64
                                    md:h-full
                                    w-auto max-w-full object-contain object-bottom
                                    drop-shadow-2xl
                                "
                            />
                        </m.div>

                        {/* ── Text ── */}
                        <div className="
                            flex flex-col justify-center
                            px-8 py-10 sm:px-10 sm:py-12 lg:px-16
                            md:w-3/5
                        ">
                            <m.h2
                                initial={{ opacity: 0, x: -18 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.15, duration: 0.6 }}
                                className="mb-8 text-3xl font-black leading-tight tracking-tight text-[#1b1b18] dark:text-white sm:text-4xl lg:text-md"
                            >
                                {t('desc_title')}
                            </m.h2>

                            <m.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <Link
                                    href="/booking"
                                    className="inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-[#1b1b18] hover:scale-105 active:scale-95 dark:hover:bg-white dark:hover:text-[#1b1b18]"
                                >
                                    {t('book_now')}
                                </Link>
                            </m.div>
                        </div>
                    </div>
                </m.div>
            </div>
        </section>
    );
}
