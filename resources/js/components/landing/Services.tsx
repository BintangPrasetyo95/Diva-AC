import { m, AnimatePresence } from 'framer-motion';
import { Wind, ShieldCheck, PenTool, ShoppingCart, Gauge, History, Wrench, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ServiceItem {
    id: number;
    slug: string;
    title_id: string;
    title_en: string;
    description_id: string;
    description_en: string;
    icon: string;
    image: string | null;
    image_url: string | null;
}

interface Props {
    services: ServiceItem[];
}

const ICON_MAP = {
    Wind: Wind,
    ShieldCheck: ShieldCheck,
    PenTool: PenTool,
    ShoppingCart: ShoppingCart,
    Gauge: Gauge,
    History: History,
    Wrench: Wrench,
};

export default function Services({ services = [] }: Props) {
    const { t, language } = useLanguage();
    const [showAll, setShowAll] = useState(false);

    const displayedServices = showAll ? services : services.slice(0, 6);
    const hasMore = services.length > 6;

    return (
        <section id="services" className="py-24 px-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-16 text-center">
                    <m.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold tracking-tight text-[#1b1b18] sm:text-4xl dark:text-white uppercase"
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
                    <AnimatePresence mode="popLayout">
                        {displayedServices.map((service, index) => {
                            const IconComponent = ICON_MAP[service.icon as keyof typeof ICON_MAP] || Wind;
                            const title = language === 'id' ? service.title_id : service.title_en;
                            const description = language === 'id' ? service.description_id : service.description_en;

                            return (
                                <m.div
                                    key={service.slug}
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 100,
                                        damping: 15,
                                        delay: index % 6 * 0.1 
                                    }}
                                >
                                    <Link 
                                        href={`/services/info/${service.slug}`}
                                        className="block group"
                                    >
                                        <m.div
                                            whileHover={{ 
                                                y: -8, 
                                                rotate: index % 2 === 0 ? 1 : -1,
                                                transition: { type: "spring", stiffness: 400, damping: 25 }
                                            }}
                                            className="relative flex flex-col rounded-[2.5rem] rounded-tr-none border border-white/20 bg-white/10 p-4 backdrop-blur-xl transition-all hover:bg-white/20 dark:border-white/10 dark:bg-black/20 dark:hover:bg-white/5 shadow-2xl"
                                        >
                                            {/* Image Container */}
                                            <div className="relative mb-6 aspect-4/3 w-full overflow-hidden rounded-4xl rounded-tr-none">
                                                <img
                                                    src={service.image_url || '/img/placeholder.jpg'}
                                                    alt={title}
                                                    width={800}
                                                    height={600}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                            </div>
                                            
                                            {/* Icon Floating Outside */}
                                            <div className="absolute left-3 bottom-[51%] z-20 inline-flex size-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-transform group-hover:scale-110 group-hover:rotate-6">
                                                <IconComponent className="size-7" />
                                            </div>

                                            <div className="px-4 pb-4">
                                                <h3 className="relative mb-4 text-2xl font-black tracking-tight text-[#1b1b18] group-hover:text-red-600 transition-colors dark:text-white uppercase">
                                                    {title}
                                                </h3>
                                                
                                                <p className="relative text-lg leading-relaxed text-[#1b1b18]/70 dark:text-white/70 line-clamp-3">
                                                    {description}
                                                </p>
                                                
                                                <div className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1b1b18]/40 transition-colors group-hover:text-red-600 dark:text-white/40 dark:group-hover:text-red-500">
                                                    <span>{t('learn_more')}</span>
                                                    <div className="h-[2px] w-0 bg-red-600 transition-all group-hover:w-8" />
                                                </div>
                                            </div>
                                        </m.div>
                                    </Link>
                                </m.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {hasMore && (
                    <div className="mt-16 text-center">
                        <Button 
                            onClick={() => setShowAll(!showAll)}
                            className="bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 text-[#1b1b18] dark:text-white border border-white/20 rounded-full px-10 h-14 font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 gap-3"
                        >
                            {showAll ? (
                                <>
                                    <ChevronUp className="size-5" />
                                    {t('show_less')}
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="size-5" />
                                    {t('show_all')}
                                </>
                            )}
                        </Button>
                    </div>
                )}
                
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