import { m, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';
import { useState } from 'react';

const images = [
    '/img/gallery/g1.jpg',
    '/img/gallery/g2.jpg',
    '/img/gallery/g3.jpg',
    '/img/gallery/g4.jpg',
    '/img/gallery/g5.jpg',
    '/img/gallery/g6.jpg',
    '/img/gallery/g7.jpg',
    '/img/gallery/g8.jpg',
    '/img/gallery/g9.jpg',
    '/img/gallery/g10.jpg',
];

const MarqueeRow = ({
    images,
    direction = 'left',
    isFirst = false,
}: {
    images: string[];
    direction?: 'left' | 'right';
    isFirst?: boolean;
}) => {
    return (
        <div className="flex w-full overflow-hidden pb-4">
            <m.div
                className="flex w-max"
                style={{ willChange: 'transform' }}
                animate={{
                    x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%']
                }}
                transition={{
                    duration: 40,
                    ease: 'linear',
                    repeat: Infinity
                }}
            >
                {/* 2 copies is the minimum for a seamless infinite loop */}
                {[0, 1].map((i) => (
                    <div key={i} className="flex flex-nowrap">
                        {images.map((src, idx) => (
                            <div key={idx} className="px-2 shrink-0">
                                <m.div
                                    whileHover={{ scale: 1.02, transition: { duration: 0.15, ease: "easeOut" } }}
                                    className="relative aspect-square w-[200px] sm:w-[250px] md:w-[300px] lg:w-[350px] overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900"
                                >
                                    <img
                                        src={src}
                                        alt={`Gallery image ${idx + 1}`}
                                        width={350}
                                        height={350}
                                        sizes="(max-width: 640px) 200px, (max-width: 768px) 250px, (max-width: 1024px) 300px, 350px"
                                        className="h-full w-full object-cover"
                                        loading={isFirst && i === 0 && idx === 0 ? undefined : 'lazy'}
                                        decoding="async"
                                        fetchPriority={isFirst && i === 0 && idx === 0 ? 'high' : undefined}
                                    />
                                </m.div>
                            </div>
                        ))}
                    </div>
                ))}
            </m.div>
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
        <m.section 
            initial={{ opacity: 0.3 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.3, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="overflow-hidden"
        >
            <div className="w-full flex flex-col gap-2">
                {row1Images.length > 0 && (
                    <MarqueeRow images={row1Images} direction="right" isFirst />
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
                        <m.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5"
                        >
                            {remainingImages.map((src, index) => (
                                <m.div
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
                                        width={350}
                                        height={350}
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover"
                                    />
                                </m.div>
                            ))}
                        </m.div>
                    )}
                </AnimatePresence>
            </div>
        </m.section>
    );
}
