import { Link } from '@inertiajs/react';
import { m } from 'framer-motion';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import React from 'react';
import { useLanguage } from '@/hooks/use-language';

export default function Sparepart() {
    const { t } = useLanguage();

    return (
        <section className="relative w-full overflow-hidden py-24">
            {/* Background Decorations */}
            <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-red-600/10 blur-[120px]" />

            <div className="relative z-10 container mx-auto max-w-7xl px-4 md:px-8">
                <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
                    {/* Left Side: 3 Rows of Images in a Masonry-like Grid */}
                    <div className="order-2 grid h-[400px] grid-cols-2 grid-rows-3 gap-4 sm:h-[500px] lg:order-1 lg:h-[600px]">
                        <m.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="col-start-1 row-span-2 row-start-1 overflow-hidden rounded-3xl border border-[#1b1b18]/10 bg-white/50 shadow-xl backdrop-blur-sm dark:border-white/10 dark:bg-black/50"
                        >
                            <img
                                src="/img/spareparts/sp1.png"
                                alt="Sparepart 1"
                                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                        </m.div>
                        <m.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{
                                duration: 0.6,
                                delay: 0.1,
                                ease: 'easeOut',
                            }}
                            className="col-start-2 row-span-1 row-start-1 overflow-hidden rounded-3xl border border-[#1b1b18]/10 bg-white/50 shadow-xl backdrop-blur-sm dark:border-white/10 dark:bg-black/50"
                        >
                            <img
                                src="/img/spareparts/sp2.png"
                                alt="Sparepart 2"
                                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                        </m.div>
                        <m.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{
                                duration: 0.6,
                                delay: 0.2,
                                ease: 'easeOut',
                            }}
                            className="col-start-1 row-span-1 row-start-3 overflow-hidden rounded-3xl border border-[#1b1b18]/10 bg-white/50 shadow-xl backdrop-blur-sm dark:border-white/10 dark:bg-black/50"
                        >
                            <img
                                src="/img/spareparts/sp3.png"
                                alt="Sparepart 3"
                                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                        </m.div>
                        <m.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{
                                duration: 0.6,
                                delay: 0.3,
                                ease: 'easeOut',
                            }}
                            className="col-start-2 row-span-2 row-start-2 overflow-hidden rounded-3xl border border-[#1b1b18]/10 bg-white/50 shadow-xl backdrop-blur-sm dark:border-white/10 dark:bg-black/50"
                        >
                            <img
                                src="/img/spareparts/sp4.png"
                                alt="Sparepart 4"
                                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                        </m.div>
                    </div>

                    {/* Right Side: Content */}
                    <div className="order-1 flex flex-col items-start gap-6 lg:order-2">
                        <m.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 rounded-full border border-[#1b1b18]/10 bg-white/50 px-4 py-2 backdrop-blur-md dark:border-white/10 dark:bg-black/50"
                        >
                            <ShoppingCart className="size-4 text-red-600" />
                            <span className="text-sm font-bold tracking-wider text-[#1b1b18] uppercase dark:text-white">
                                Spareparts
                            </span>
                        </m.div>

                        <m.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl font-extrabold tracking-tight text-[#1b1b18] md:text-5xl lg:text-6xl dark:text-white"
                        >
                            {t('buy_sparepart_title')}
                        </m.h2>

                        <m.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg leading-relaxed text-[#1b1b18]/70 dark:text-white/70"
                        >
                            {t('buy_sparepart_desc')}
                        </m.p>

                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Link
                                href="/spareparts"
                                className="group mt-4 inline-flex items-center justify-center gap-3 rounded-full bg-red-600 px-8 py-4 text-base font-bold text-white shadow-[0_8px_30px_rgb(220,38,38,0.3)] transition-all hover:bg-red-700 hover:shadow-[0_8px_30px_rgb(220,38,38,0.5)] active:scale-95"
                            >
                                <span>{t('buy_now')}</span>
                                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </m.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
