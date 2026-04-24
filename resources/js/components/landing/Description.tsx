import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';

export default function Description() {
    const { t } = useLanguage();
    
    return (
        <section className="bg-white/40 py-24 px-6 backdrop-blur-md dark:bg-black/40">
            <div className="mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center"
                >
                    <div>
                        <h2 className="mb-6 text-3xl font-bold tracking-tight text-[#1b1b18] sm:text-4xl dark:text-white uppercase">
                            {t('desc_title')}
                        </h2>
                        <div className="space-y-4 text-lg text-[#1b1b18]/70 dark:text-white/70">
                            <p>
                                {t('desc_p1')}
                            </p>
                            <p>
                                {t('desc_p2')}
                            </p>
                        </div>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900">
                        {/* Placeholder for an image or a secondary 3D element */}
                        <div className="absolute inset-0 flex items-center justify-center">
                             <div className="text-center">
                                <span className="text-sm font-medium uppercase tracking-widest text-[#1b1b18]/30 dark:text-white/30">{t('desc_workshop')}</span>
                             </div>
                        </div>
                        <img 
                            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000" 
                            alt="Luxury Car Interior" 
                            className="h-full w-full object-cover opacity-50 dark:opacity-30"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
