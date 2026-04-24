import { motion } from 'framer-motion';

const images = [
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800',
];

export default function Gallery() {
    return (
        <section className="bg-[#fdfdfc]/40 py-24 px-6 backdrop-blur-md dark:bg-black/40">
            <div className="mx-auto max-w-6xl">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-[#1b1b18] sm:text-4xl dark:text-white">
                        Gallery
                    </h2>
                    <p className="mt-4 text-[#1b1b18]/60 dark:text-white/60">
                        A glimpse of our work and the premium vehicles we care for.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {images.map((src, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
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
                </div>
            </div>
        </section>
    );
}
