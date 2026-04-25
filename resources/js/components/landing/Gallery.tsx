import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';
import { useState } from 'react';

const images = [
    'https://lh3.googleusercontent.com/grass-cs/ANxoTn0kGzh4UiWF2_O6mLLnfxkWvqM5A9NQfNF980Y47epm2uZBMRCATeu9yPHeuBa1uDl_I9dFB_fbANWHc7XSklR2MBzvqQvEEb-b38q9WpgQ0b494QBUPm940jzvM_IYOEv1NMc=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/grass-cs/ANxoTn3xf_Af2naI18N3ZAwaKG6-XIRMSQ-q3vyPD1XRf9Q_NWnekv0A9L6DchZfm8CnQrBwQajjVXJpL4LWoO1iFZYfA5sWj1GtKt3DWW_yG0kCXoOD6U-WRyw-a_gPGQW1HA7FaCbJTA=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/grass-cs/ANxoTn1OeUrJWIjd2aAPXIYdWYrDFY90pKDe1Py_13o8fKqkmBsW9Q-suM0RXFhQz2HY9XNE6-FDeYVoZjZs07dDhm1aJdJFKwqB7XQgnhl6WobBI-WHL-AdDfFIt9jrDDOcHtmo2C4=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/grass-cs/ANxoTn05pntNGml5_eeRYD3hAzfJPx7GBtcpSvz6uX8T8RV5Vnk1wAGo-kKyQE0pzIq7c1u_gANBvj-kzVlDilookUY_d6hFFLFPZNx9UKejj-mL0XR-oI7GRcnMiZHig31DMgCIuEOAsijKgR8=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/p/AF1QipMdGUAaAEQi3DSR7NVhDE0sHP2yldokQ0D5Kn_v=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/p/AF1QipMgFmU7ofklnA8mmGJantKJb1ig8TL5_nSERnwt=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/p/AF1QipOhEwZTOrgXtKfrERucQ7m_uaTBBDQTV3RI0hpm=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/grass-cs/ANxoTn2WUrV45GrOxFuRQTQjlbYoFZCaGPgPmGmbKOe9ggTHQ-YC8z3FaQVFQ90zHsXzd9rk_r73G0MdNh_SPX56i4CQJdIOPkNEa67-IXxwttj85wUO4-kUNCNgWtQSaNH4x7V8eOgqmQ=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/grass-cs/ANxoTn1rb7kfb5qrc0FJw3o236x0UQmO7dH2D-faNB_Y02M_WyM5_qtwCCc2ofW3I8gQP-pi-GbpWWOIv7BrmvxSh_uWAI_7RvRDk7tvrYuMIfNFsOsDLI5OWyOtwApFX1CzDljii_oE=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/p/AF1QipODKOgzgOv3_bE4pd9AtPd2YCreKoU8NAU-AH_p=s1360-w1360-h1020-rw',
];

const MarqueeRow = ({ images, direction = 'left' }: { images: string[], direction?: 'left' | 'right' }) => {
    return (
        <div className="flex w-full overflow-hidden pb-4">
            <motion.div
                className="flex w-max"
                animate={{
                    x: direction === 'left' ? ['0%', '-25%'] : ['-25%', '0%']
                }}
                transition={{
                    duration: 40,
                    ease: 'linear',
                    repeat: Infinity
                }}
            >
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-nowrap">
                        {images.map((src, idx) => (
                            <div key={idx} className="px-2 shrink-0">
                                <motion.div
                                    whileHover={{ scale: 1.02, transition: { duration: 0.15, ease: "easeOut" } }}
                                    className="relative aspect-square w-[200px] sm:w-[250px] md:w-[300px] lg:w-[350px] overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900"
                                >
                                    <img 
                                        src={src} 
                                        alt={`Gallery image ${idx}`} 
                                        className="h-full w-full object-cover"
                                    />
                                </motion.div>
                            </div>
                        ))}
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default function Gallery() {
    const { t } = useLanguage();
    const [showAll, setShowAll] = useState(false);

    const row1Images = images.slice(0, 5);
    const row2Images = images.slice(5, 10);
    const remainingImages = images.slice(10);

    return (
        <motion.section 
            initial={{ opacity: 0.3 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.3, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="py-24 overflow-hidden"
        >
            <div className="w-full flex flex-col gap-2">
                {row1Images.length > 0 && (
                    <MarqueeRow images={row1Images} direction="right" />
                )}
                {row2Images.length > 0 && (
                    <MarqueeRow images={row2Images} direction="left" />
                )}
            </div>

            <div className="mx-auto max-w-6xl px-6">
                {remainingImages.length > 0 && (
                    <div className="mt-12 text-center">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="inline-flex items-center justify-center rounded-full bg-[#1b1b18] px-8 py-3 text-sm font-medium text-white transition-all hover:bg-[#1b1b18]/90 dark:bg-white dark:text-[#1b1b18] dark:hover:bg-white/90"
                        >
                            {showAll ? t('see_less') : t('see_more')}
                        </button>
                    </div>
                )}

                <AnimatePresence>
                    {showAll && remainingImages.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5"
                        >
                            {remainingImages.map((src, index) => (
                                <motion.div
                                    key={src}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1, transition: { duration: 0.3 } }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                                    whileHover={{ scale: 1.02, transition: { duration: 0.15, ease: "easeOut" } }}
                                    className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900"
                                >
                                    <img 
                                        src={src} 
                                        alt={`Gallery extra image ${index + 1}`} 
                                        className="h-full w-full object-cover"
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.section>
    );
}
