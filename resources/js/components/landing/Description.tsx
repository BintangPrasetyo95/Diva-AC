import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';

export default function Description() {
    const { t } = useLanguage();
    
    return (
        <section className="py-24 px-6">
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
                        <img 
                            src="https://lh3.googleusercontent.com/grass-cs/ANxoTn1rb7kfb5qrc0FJw3o236x0UQmO7dH2D-faNB_Y02M_WyM5_qtwCCc2ofW3I8gQP-pi-GbpWWOIv7BrmvxSh_uWAI_7RvRDk7tvrYuMIfNFsOsDLI5OWyOtwApFX1CzDljii_oE=s1360-w1360-h1020-rw" 
                            alt="Luxury Car Interior" 
                            className="h-full w-full object-cover opacity-80 dark:opacity-60"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
