import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';

const brands = [
    { name: 'Mercedes-Benz', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Mercedes-Benz_Star_%281969-1986%2C_2025-%29.svg' },
    { name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg' },
    { name: 'Audi', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg' },
    { name: 'Porsche', logo: 'https://upload.wikimedia.org/wikipedia/en/c/c2/Porsche_Logo_2024.png' },
    { name: 'Toyota', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Toyota.svg' },
    { name: 'Honda', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Honda.svg' },
    { name: 'Mitsubishi', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Mitsubishi_logo.svg' },
    { name: 'Hyundai', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg' },
    { name: 'Lexus', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Lexus.svg' },
    { name: 'Volkswagen', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg' },
    { name: 'Wurth', logo: 'https://static.wixstatic.com/media/3dc518_c6b7dc0b86cb41ee925524ede7bff592~mv2.png/v1/fill/w_360,h_82,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Wurth%20Logo%20Transparenr.png' },
];

export default function Brands() {
    const { t } = useLanguage();

    return (
        <section className="bg-black/5 py-16 px-6 backdrop-blur-sm dark:bg-white/5">
            <div className="mx-auto max-w-6xl">

                <div className="flex flex-wrap justify-center gap-12 md:gap-20">
                    {brands.map((brand, index) => (
                        <motion.div
                            key={brand.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="group flex flex-col items-center justify-center relative min-w-[80px]"
                        >
                            <motion.img
                                src={brand.logo}
                                alt={brand.name}
                                whileHover={{ y: -8 }}
                                className="h-12 w-auto grayscale brightness-[1] opacity-60 transition-all duration-10 group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100 group-hover:drop-shadow-[0_0_16px_rgba(255,255,255,0.8)] dark:invert-[0.2] dark:group-hover:invert-0 cursor-pointer"
                            />
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-[#1b1b18]/60 dark:text-white/60 opacity-0 group-hover:opacity-100 group-hover:translate-y-[-4px] transition-all duration-300 pointer-events-none">
                                {brand.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
