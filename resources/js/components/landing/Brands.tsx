import { m } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';

const brands = [
    { name: 'Mercedes-Benz', logo: '/img/brands/mercedes.svg', link: 'https://www.mercedes-benz.com/en/' },
    { name: 'BMW', logo: '/img/brands/bmw.svg', link: 'https://www.bmw.com/en/' },
    { name: 'Audi', logo: '/img/brands/audi.svg', link: 'https://www.audi.com/en.html' },
    { name: 'Porsche', logo: '/img/brands/porsche.png', link: 'https://www.porsche.com/international/' },
    { name: 'Toyota', logo: '/img/brands/toyota.svg', link: 'https://www.toyota.com/' },
    { name: 'Honda', logo: '/img/brands/honda.svg', link: 'https://global.honda/' },
    { name: 'Mitsubishi', logo: '/img/brands/mitsubishi.svg', link: 'https://www.mitsubishi-motors.com/en/' },
    { name: 'Hyundai', logo: '/img/brands/hyundai.svg', link: 'https://www.hyundai.com/' },
    { name: 'Lexus', logo: '/img/brands/lexus.svg', link: 'https://www.lexus.com/' },
    { name: 'Volkswagen', logo: '/img/brands/volkswagen.svg', link: 'https://www.volkswagen.com/' },
    { name: 'Denso', logo: '/img/brands/denso.png', link: 'https://www.denso.com/' },
    { name: 'Suzuki', logo: '/img/brands/suzuki.png', link: 'https://www.suzuki.com/' },
    { name: 'Wurth', logo: '/img/brands/wurth.png', link: 'https://www.wuerth.com/wuerth-group/homepage.php' },
];

export default function Brands() {
    const { t } = useLanguage();

    return (
        <section className="bg-black/5 py-16 px-6 backdrop-blur-sm dark:bg-white/5">
            <div className="mx-auto max-w-6xl">

                <div className="flex flex-wrap justify-center gap-12 md:gap-20">
                    {brands.map((brand, index) => (
                        <m.a
                            key={brand.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1, transition: { delay: index * 0.05 } }}
                            viewport={{ once: true }}
                            className="group flex flex-col items-center justify-center relative min-w-[80px]"
                            href={brand.link}
                            target='_blank'
                        >
                            <m.img
                                src={brand.logo}
                                alt={brand.name}
                                loading="lazy"
                                decoding="async"
                                width={120}
                                height={48}
                                whileHover={{ y: -8, transition: { duration: 0.15, ease: "easeOut" } }}
                                whileTap={{ y: -8, transition: { duration: 0.15, ease: "easeOut" } }}
                                className="h-12 w-auto grayscale brightness-[1] opacity-60 transition-all duration-150 group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100 group-hover:drop-shadow-[0_0_16px_rgba(255,255,255,0.8)] group-active:grayscale-0 group-active:brightness-100 group-active:opacity-100 group-active:drop-shadow-[0_0_16px_rgba(255,255,255,0.8)] dark:invert-[0.2] dark:group-hover:invert-0 dark:group-active:invert-0 cursor-pointer"
                            />
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-[#1b1b18]/60 dark:text-white/60 opacity-0 group-hover:opacity-100 group-hover:translate-y-[-4px] group-active:opacity-100 group-active:translate-y-[-4px] transition-all duration-300 pointer-events-none">
                                {brand.name}
                            </span>
                        </m.a>
                    ))}
                </div>
            </div>
        </section>
    );
}
