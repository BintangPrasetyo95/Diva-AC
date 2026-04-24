import { motion } from 'framer-motion';
import { Calendar, Clock, Car, Phone } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export default function Booking() {
    const { t } = useLanguage();

    return (
        <section id="booking" className="py-24 px-6">
            <div className="mx-auto max-w-4xl">
                <div className="rounded-3xl border border-[#1b1b18]/5 bg-white/20 p-8 md:p-16 backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-[#1b1b18] sm:text-4xl dark:text-white uppercase">
                            {t('booking_title')}
                        </h2>
                        <p className="mt-4 text-[#1b1b18]/60 dark:text-white/60">
                            {t('booking_subtitle')}
                        </p>
                    </div>

                    <form className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#1b1b18] dark:text-white">{t('form_name')}</label>
                            <input 
                                type="text" 
                                placeholder={t('form_name_placeholder')}
                                className="w-full rounded-xl border border-[#1b1b18]/10 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 dark:border-white/10 dark:bg-black dark:focus:ring-red-500/20 dark:focus:border-red-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#1b1b18] dark:text-white">{t('form_phone')}</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#1b1b18]/40 dark:text-white/40" />
                                <input 
                                    type="tel" 
                                    placeholder={t('form_phone_placeholder')}
                                    className="w-full rounded-xl border border-[#1b1b18]/10 bg-white pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 dark:border-white/10 dark:bg-black dark:focus:ring-red-500/20 dark:focus:border-red-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#1b1b18] dark:text-white">{t('form_car_model')}</label>
                            <div className="relative">
                                <Car className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#1b1b18]/40 dark:text-white/40" />
                                <input 
                                    type="text" 
                                    placeholder={t('form_car_placeholder')}
                                    className="w-full rounded-xl border border-[#1b1b18]/10 bg-white pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 dark:border-white/10 dark:bg-black dark:focus:ring-red-500/20 dark:focus:border-red-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#1b1b18] dark:text-white">{t('form_date')}</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#1b1b18]/40 dark:text-white/40" />
                                <input 
                                    type="date" 
                                    className="w-full rounded-xl border border-[#1b1b18]/10 bg-white pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 dark:border-white/10 dark:bg-black dark:focus:ring-red-500/20 dark:focus:border-red-500"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                             <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="button"
                                className="mt-4 w-full rounded-xl bg-red-600 py-4 font-bold text-white transition-all hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)]"
                            >
                                {t('form_confirm')}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
