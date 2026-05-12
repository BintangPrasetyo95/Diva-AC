import { m } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { useLanguage } from '@/hooks/use-language';

export default function Description() {
    const { t } = useLanguage();

    return (
        <section className="px-8 py-12 sm:px-16 lg:px-24">
            <div className="mx-auto max-w-7xl">
                <m.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.7,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/60 backdrop-blur-3xl dark:border-white/5"
                >
                    {/* Decorative neutral glow for consistent glass effect */}
                    <div className="absolute top-1/2 left-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />

                    {/*
                     * Layout:
                     *   sm and below → column (image on top, text below)
                     *   md and above → row   (text left, image right, same height)
                     */}
                    <div className="relative z-10 flex flex-col md:flex-row md:items-stretch">
                        {/* ── Image ── */}
                        <m.div
                            initial={{ opacity: 0, scale: 1.05 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: 0.2,
                                duration: 0.75,
                                ease: 'easeOut',
                            }}
                            className="relative flex w-full justify-center pt-12 sm:pt-16 md:order-last md:w-2/5 md:pt-20"
                        >
                            <div className="relative flex h-full w-full justify-center">
                                <img
                                    src="/img/actor.png"
                                    alt="Diva AC Owner"
                                    className="h-72 w-auto max-w-full scale-125 object-contain object-bottom brightness-110 contrast-110 sm:h-96 md:h-full md:-translate-x-20 md:-translate-y-12 md:scale-135"
                                    style={{
                                        maskImage:
                                            'linear-gradient(to top, transparent 0%, black 30%)',
                                        WebkitMaskImage:
                                            'linear-gradient(to top, transparent 0%, black 30%)',
                                    }}
                                />
                            </div>
                        </m.div>

                        {/* ── Text ── */}
                        <div className="relative flex flex-col justify-center px-8 py-14 sm:px-16 sm:py-24 md:w-3/5 lg:px-32">
                            {/* Decorative Quote Mark */}
                            <div className="absolute top-10 left-6 font-serif text-8xl text-white/5 select-none sm:top-16 sm:left-12 lg:left-20">
                                &ldquo;
                            </div>

                            <m.h2
                                initial={{ opacity: 0, x: -18 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.15, duration: 0.6 }}
                                className="text-md relative mb-10 font-serif leading-[1.3] tracking-tight text-white italic sm:text-xl lg:text-2xl xl:text-3xl"
                            >
                                <span className="bg-linear-to-br from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                                    {t('desc_title')}
                                </span>
                            </m.h2>

                            <m.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="flex flex-wrap gap-4"
                            >
                                <Link
                                    href="/booking"
                                    className="group relative inline-flex items-center gap-4 overflow-hidden rounded-2xl bg-red-600 px-10 py-5 text-sm font-black text-white shadow-xl shadow-red-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-red-700 hover:shadow-2xl hover:shadow-red-600/40 active:scale-95"
                                >
                                    <span className="relative z-10">
                                        {t('book_now')}
                                    </span>
                                    <m.span
                                        className="relative z-10 inline-block text-lg"
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 2,
                                            ease: 'easeInOut',
                                        }}
                                    >
                                        →
                                    </m.span>
                                    <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                                </Link>
                            </m.div>
                        </div>
                    </div>
                </m.div>
            </div>
        </section>
    );
}
