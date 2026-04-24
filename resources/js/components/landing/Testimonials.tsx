import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export default function Testimonials() {
    const { t } = useLanguage();

    const testimonials = [
        {
            name: t('testimonial_1_name'),
            role: t('testimonial_1_role'),
            content: t('testimonial_1_content'),
            image: "https://lh3.googleusercontent.com/a-/ALV-UjUZlspvtt2IieRBMRkuyvk4Uj87TrNnB-xNf87YXZmJG9qysznduQ=w90-h90-p-rp-mo-ba4-br100",
            rating: 5,
        },
        {
            name: t('testimonial_2_name'),
            role: t('testimonial_2_role'),
            content: t('testimonial_2_content'),
            image: "https://lh3.googleusercontent.com/a-/ALV-UjUySof9dNwxtfouN_U_mGoblOrOttNVEEw3B1h0pcOYJ5FFZFzF=w90-h90-p-rp-mo-ba5-br100",
            rating: 5,
        },
        {
            name: t('testimonial_3_name'),
            role: t('testimonial_3_role'),
            content: t('testimonial_3_content'),
            image: "https://lh3.googleusercontent.com/a-/ALV-UjU-o8VcPwSviSqmay_zYwJ-vGwVwNopBOkfwvlDQJj04G4VlvW_=w90-h90-p-rp-mo-ba4-br100",
            rating: 5,
        },
    ];

    return (
        <section className="py-24 px-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-[#1b1b18] sm:text-4xl dark:text-white">
                        {t('testimonials_trusted')}
                    </h2>
                    <p className="mt-4 text-[#1b1b18]/60 dark:text-white/60">
                        {t('testimonials_subtitle')}
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
                            <div className="flex items-center gap-5">
                                <div className='size-10'>
                                    <img src={testimonial.image} alt="" className='rounded-full' />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1b1b18] dark:text-white">{testimonial.name}</h4>
                                    <p className="text-sm text-[#1b1b18]/40 dark:text-white/40">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
