import { m } from 'framer-motion';
import { Wind, ShieldCheck, PenTool, ShoppingCart, Gauge, History } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export default function Services() {
    const { t } = useLanguage();

    const services = [
        {
            title: t('service_ac_title'),
            description: t('service_ac_desc'),
            icon: Wind,
            image: '/img/services/s1.jpg',
        },
        {
            title: t('service_parts_title'),
            description: t('service_parts_desc'),
            icon: ShoppingCart,
            image: '/img/services/s2.jpg',
        },
        {
            title: t('service_maintenance_title'),
            description: t('service_maintenance_desc'), 
            icon: PenTool,
            image: '/img/services/s3.jpg',
        },
        {
            title: t('service_freon_title'),
            description: t('service_freon_desc'),
            icon: Gauge,
            image: '/img/services/s4.jpg',
        },
        {
            title: t('service_odor_title'),
            description: t('service_odor_desc'),
            icon: ShieldCheck,
            image: '/img/services/s5.jpg',
        },
        {
            title: t('service_vintage_title'),
            description: t('service_vintage_desc'),
            icon: History,
            image: '/img/services/s6.jpg',
        },
    ];
    return (
        <section id="services" className="py-24 px-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-16 text-center">
                    <m.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold tracking-tight text-[#1b1b18] sm:text-4xl dark:text-white"
                    >
                        {t('what_we_do')}
                    </m.h2>
                    <m.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 text-lg text-[#1b1b18]/60 dark:text-white/60"
                    >
                        {t('services_subtitle')}
                    </m.p>
                </div>

                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <m.div
                            key={service.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ 
                                opacity: 1, 
                                y: 0,
                                transition: {
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 15,
                                    delay: index * 0.1 
                                }
                            }}
                            viewport={{ once: true }}
                            whileHover={{ 
                                y: -8, 
                                rotate: index % 2 === 0 ? 1 : -1,
                                transition: { type: "spring", stiffness: 400, damping: 25 }
                            }}
                            className="group relative flex flex-col rounded-[2.5rem] rounded-tr-none border border-white/20 bg-white/10 p-4 backdrop-blur-xl transition-all hover:bg-white/20 dark:border-white/10 dark:bg-black/20 dark:hover:bg-white/5 shadow-2xl"
                        >
                            {/* Image Container */}
                            <div className="relative mb-6 aspect-4/3 w-full overflow-hidden rounded-4xl rounded-tr-none">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    width={800}
                                    height={600}
                                    loading="lazy"
                                    decoding="async"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                            
                             {/* Icon Floating Outside - Bottom Left (No Clipping) */}
                            <div className="absolute left-3 bottom-[51%] z-20 inline-flex size-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-transform group-hover:scale-110 group-hover:rotate-6">
                                <service.icon className="size-7" />
                            </div>

                            <div className="px-4 pb-4">
                                <h3 className="relative mb-4 text-2xl font-black tracking-tight text-[#1b1b18] group-hover:text-red-600 transition-colors dark:text-white">
                                    {service.title}
                                </h3>
                                
                                <p className="relative text-lg leading-relaxed text-[#1b1b18]/70 dark:text-white/70">
                                    {service.description}
                                </p>
                                
                                <div className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1b1b18]/40 transition-colors group-hover:text-red-600 dark:text-white/40 dark:group-hover:text-red-500">
                                    <span>{t('learn_more')}</span>
                                    <div className="h-[2px] w-0 bg-red-600 transition-all group-hover:w-8" />
                                </div>
                            </div>
                        </m.div>
                    ))}
                </div>
                
                <div className="mt-24 text-center">
                    <m.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="inline-flex items-center gap-4 rounded-full border border-white/20 bg-white/5 px-8 py-3 backdrop-blur-md"
                    >
                        <span className="text-sm font-medium text-[#1b1b18]/60 dark:text-white/60">
                            {t('need_else')}
                        </span>
                        <a href="#contact" className="text-sm font-bold text-red-600 hover:underline dark:text-red-500">
                            {t('ask_us')}
                        </a>
                    </m.div>
                </div>
            </div>
        </section>
    );
}

