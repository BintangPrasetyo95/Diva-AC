import { Link } from '@inertiajs/react';
import { m } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';

export default function Booking() {
    const { t } = useLanguage();

    return (
        <section id="booking" className="py-24 px-6">
            <div className="mx-auto max-w-4xl">
                <div className="rounded-3xl border border-[#1b1b18]/5 bg-white/20 p-8 md:p-16 backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
                    <div className="mb-4 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-[#1b1b18] sm:text-4xl dark:text-white uppercase">
                            {t('booking_title')}
                        </h2>
                        <p className="mt-4 text-[#1b1b18]/60 dark:text-white/60">
                            {t('booking_subtitle')}
                        </p>
                    </div>


                    <div className="md:col-span-2">
                        <m.div
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="mt-4 w-full"
                        >
                            <Link
                                href="/booking"
                                className="block w-full rounded-xl bg-red-600 py-4 text-center font-bold text-white transition-all hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)]"
                            >
                                {t('booking_go')}
                            </Link>
                        </m.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
