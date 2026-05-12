import { m } from 'framer-motion';
import { Star } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export default function Testimonials() {
    const { t } = useLanguage();

    const testimonials = [
        {
            name: 'Prayoga galih',
            content:
                'Pelayanan baik,pemilik dan karyawan ramah.memberikan solusi terbaik bila konsultasi 👍',
            image: 'https://lh3.googleusercontent.com/a-/ALV-UjVX-rSUEnbuW7IwJPV1uwuW6JI0LE49HulexQWHN43cxbtR-Hqr=w90-h90-p-rp-mo-ba3-br100',
            rating: 5,
            date: new Date('2024-01-10'),
        },
        {
            name: 'Oryza S',
            content: 'mantaplah cukup bintang yang berbicara',
            image: 'https://lh3.googleusercontent.com/a-/ALV-UjUZlspvtt2IieRBMRkuyvk4Uj87TrNnB-xNf87YXZmJG9qysznduQ=w90-h90-p-rp-mo-ba4-br100',
            rating: 5,
            date: new Date('2022-03-22'),
        },
        {
            name: '07_Arya Putra Hartoto',
            content: 'Bagus karna jujur',
            image: 'https://lh3.googleusercontent.com/a/ACg8ocJxETSZgrVaKUS9p0xa9rmYsqPMX646wbnpXVbXK3o-SX6_WQ=w90-h90-p-rp-mo-br100',
            rating: 5,
            date: new Date('2026-4-25'),
        },
    ];

    const getRelativeTime = (date: Date): string => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays < 7) {
            return diffDays <= 1
                ? '1 ' + t('testimonials_day_ago')
                : `${diffDays} ${t('testimonials_days_ago')}`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);

            return weeks === 1
                ? '1 ' + t('testimonials_week_ago')
                : `${weeks} ${t('testimonials_weeks_ago')}`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);

            return months === 1
                ? '1 ' + t('testimonials_month_ago')
                : `${months} ${t('testimonials_months_ago')}`;
        } else {
            const years = Math.floor(diffDays / 365);

            return years === 1
                ? '1 ' + t('testimonials_year_ago')
                : `${years} ${t('testimonials_years_ago')}`;
        }
    };

    return (
        <section className="px-6 py-24">
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
                        <m.div
                            key={testimonial.name}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col rounded-2xl border border-[#1b1b18]/5 bg-white/20 p-8 backdrop-blur-sm dark:border-white/5 dark:bg-white/5"
                        >
                            <div className="mb-4 flex gap-1">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="size-4 fill-yellow-400 text-yellow-400"
                                    />
                                ))}
                            </div>
                            <p className="mb-8 flex-1 text-lg text-[#1b1b18]/80 italic dark:text-white/80">
                                "{testimonial.content}"
                            </p>
                            <div className="flex items-center gap-5">
                                <div className="size-10 shrink-0">
                                    <img
                                        src={testimonial.image}
                                        alt=""
                                        className="rounded-full"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1b1b18] dark:text-white">
                                        {testimonial.name}
                                    </h4>
                                    <p className="mt-0.5 text-sm text-[#1b1b18]/40 dark:text-white/40">
                                        {getRelativeTime(testimonial.date)}
                                    </p>
                                </div>
                            </div>
                        </m.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
