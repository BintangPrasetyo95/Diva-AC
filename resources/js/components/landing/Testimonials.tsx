import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
    {
        name: 'James Wilson',
        role: 'BMW Owner',
        content: 'The best AC service in town. My car cooling system feels like new again. Highly professional team!',
        rating: 5,
    },
    {
        name: 'Sarah Chen',
        role: 'Tesla Model 3 Owner',
        content: 'Quick diagnostics and transparent pricing. They fixed a complex compressor issue that others couldnt.',
        rating: 5,
    },
    {
        name: 'Michael Ross',
        role: 'Vintage Collector',
        content: 'They restored the AC in my 1969 Mustang perfectly. Their attention to detail is unmatched.',
        rating: 5,
    },
];

export default function Testimonials() {
    return (
        <section className="bg-white/40 py-24 px-6 backdrop-blur-md dark:bg-black/40">
            <div className="mx-auto max-w-6xl">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-[#1b1b18] sm:text-4xl dark:text-white">
                        Trusted by Car Enthusiasts
                    </h2>
                    <p className="mt-4 text-[#1b1b18]/60 dark:text-white/60">
                        Read what our customers have to say about their experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col rounded-2xl border border-[#1b1b18]/5 bg-white/20 p-8 backdrop-blur-sm dark:border-white/5 dark:bg-white/5"
                        >
                            <div className="mb-4 flex gap-1">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="mb-8 flex-1 text-lg italic text-[#1b1b18]/80 dark:text-white/80">
                                "{testimonial.content}"
                            </p>
                            <div>
                                <h4 className="font-bold text-[#1b1b18] dark:text-white">{testimonial.name}</h4>
                                <p className="text-sm text-[#1b1b18]/40 dark:text-white/40">{testimonial.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
