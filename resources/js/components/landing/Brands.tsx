import { m } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';

const brands = [
    { name: 'Denso', logo: '/img/brands/denso.png', link: 'https://www.denso.com/' },
    { name: 'Sanden', logo: '/img/brands/sanden.svg', link: 'https://www.sanden.co.jp/english/' },
    { name: 'Valeo', logo: '/img/brands/valeo.png', link: 'https://www.valeo.com/en/' },
    { name: 'Seiko Seiki', logo: '', link: '', isTextOnly: true },
    { name: 'AC Delco', logo: '/img/brands/acdelco.png', link: 'https://www.acdelco.com/' },
    { name: 'Paco', logo: '/img/brands/paco.png', link: 'https://www.paco.co.th/' },
    { name: 'Formula', logo: '/img/brands/formula.svg', link: 'https://www.formula.co.th/' },
    { name: 'Yaruki', logo: '/img/brands/yaruki.png', link: 'https://www.yaruki.co.id/' },
    { name: 'Fuji Cool', logo: '/img/brands/fujicool.png', link: 'https://www.fujicool.com/' },
    { name: 'UCM', logo: '/img/brands/ucm.png', link: 'https://ucmservice.com/' },
    { name: 'Seasons', logo: '/img/brands/seasons.png', link: 'https://www.4seasons-ac.eu/' },
];

export default function Brands() {
    const { t } = useLanguage();

    return (
        <section className="bg-black/5 py-16 px-6 backdrop-blur-sm dark:bg-white/5">
            <div className="mx-auto max-w-6xl">
                <m.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#1b1b18]/40 dark:text-white/40">
                        {t('brands_header_subtitle')}
                    </h2>
                    <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-[#1b1b18] dark:text-white">
                        {t('brands_header_title_premium')} <span className="text-red-600">{t('brands_header_title_brands')}</span>
                    </h3>
                </m.div>

                <div className="flex flex-wrap justify-center gap-12 md:gap-20">
                    {brands.map((brand, index) => {
                        const isTextOnly = 'isTextOnly' in brand && brand.isTextOnly;
                        const Wrapper = isTextOnly ? 'div' : m.a;
                        
                        return (
                            <Wrapper
                                key={brand.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1, transition: { delay: index * 0.05 } }}
                                viewport={{ once: true }}
                                className={`group flex flex-col items-center justify-center relative min-w-[80px] ${!isTextOnly ? 'cursor-pointer' : ''}`}
                                {...(!isTextOnly ? { href: brand.link, target: '_blank' } : {})}
                            >
                                {isTextOnly ? (
                                    <m.span 
                                        className="text-xl font-bold uppercase tracking-widest text-[#1b1b18]/40 transition-all duration-300 group-hover:text-[#1b1b18] group-hover:scale-110 dark:text-white/40 dark:group-hover:text-white"
                                        whileHover={{ y: -4 }}
                                    >
                                        {brand.name}
                                    </m.span>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </Wrapper>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}



// Denso (Original/OEM): Paling populer dan sering menjadi standar bawaan (OEM) berbagai merk mobil.
// Sanden: Terkenal berkualitas, terutama untuk kompresor AC.
// Valeo: Sering digunakan untuk mobil-mobil buatan Eropa.
// Seiko Seiki: Produsen terkemuka lainnya.
// AC Delco: Menyediakan spare part aftermarket dengan kualitas teruji, sering untuk Chevrolet.
// Paco & Formula: Pilihan terjangkau untuk kondensor dan evaporator.
// Yaruki: Menyediakan berbagai komponen AC mobil.
// Fuji Cool, UCM, Seasons: Merek aftermarket alternatif yang harganya lebih ekonomis dibandingkan genuine part.

