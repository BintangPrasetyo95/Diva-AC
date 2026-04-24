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
    'https://lh3.googleusercontent.com/grass-cs/ANxoTn2svDmi6xI3jb06YZhEN855SgUDyygVbW4qZT-VmfVhzJxJBwIQzNp4Ypr3cMLgWG-GfXOMUttTLGnG_jKMZQT2hIWnUA1Uw0AafeA4J-RHn6wzQ08y-T_ohaiMP_A-HYYopKJq=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/grass-cs/ANxoTn2WUrV45GrOxFuRQTQjlbYoFZCaGPgPmGmbKOe9ggTHQ-YC8z3FaQVFQ90zHsXzd9rk_r73G0MdNh_SPX56i4CQJdIOPkNEa67-IXxwttj85wUO4-kUNCNgWtQSaNH4x7V8eOgqmQ=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/grass-cs/ANxoTn1rb7kfb5qrc0FJw3o236x0UQmO7dH2D-faNB_Y02M_WyM5_qtwCCc2ofW3I8gQP-pi-GbpWWOIv7BrmvxSh_uWAI_7RvRDk7tvrYuMIfNFsOsDLI5OWyOtwApFX1CzDljii_oE=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/p/AF1QipODKOgzgOv3_bE4pd9AtPd2YCreKoU8NAU-AH_p=s1360-w1360-h1020-rw',
];

export default function Gallery() {
    const { t } = useLanguage();
    const [showAll, setShowAll] = useState(false);

    const displayedImages = showAll ? images : images.slice(0, 6);

    return (
        <section className="py-24 px-6">
            <div className="mx-auto max-w-6xl">

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                        {displayedImages.map((src, index) => (
                            <motion.div
                                key={src} // Use src as key for better AnimatePresence tracking
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                whileHover={{ scale: 1.02 }}
                                className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900"
                            >
                                <img 
                                    src={src} 
                                    alt={`Gallery image ${index + 1}`} 
                                    className="h-full w-full object-cover"
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {images.length > 6 && (
                    <div className="mt-12 text-center">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="inline-flex items-center justify-center rounded-full bg-[#1b1b18] px-8 py-3 text-sm font-medium text-white transition-all hover:bg-[#1b1b18]/90 dark:bg-white dark:text-[#1b1b18] dark:hover:bg-white/90"
                        >
                            {showAll ? t('see_less') : t('see_more')}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
