import { Instagram, Facebook } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { useLanguage } from '@/hooks/use-language';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-white py-12 px-6 dark:bg-[#0a0a0a]">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                    <div className="flex items-center gap-2">
                        <AppLogo />
                    </div>
                    
                    <div className="flex gap-8 text-sm font-medium text-[#1b1b18]/60 dark:text-white/60">
                        <a href="#services" className="hover:text-red-600 transition-colors">{t('services_title')}</a>
                        <a href="#booking" className="hover:text-red-600 transition-colors">{t('booking_title')}</a>
                        <a href="#contact" className="hover:text-red-600 transition-colors">{t('contact_title')}</a>
                    </div>
                    
                    <div className="flex gap-4">
                        <a 
                            href="https://www.instagram.com/diva_ac50/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex size-10 items-center justify-center rounded-full bg-[#1b1b18]/5 text-[#1b1b18] hover:bg-pink-600 hover:text-white dark:bg-white/5 dark:text-white dark:hover:bg-pink-600 transition-all"
                        >
                            <Instagram className="size-5" />
                        </a>
                        <a 
                            href="https://www.facebook.com/DivaAc/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex size-10 items-center justify-center rounded-full bg-[#1b1b18]/5 text-[#1b1b18] hover:bg-blue-600 hover:text-white dark:bg-white/5 dark:text-white dark:hover:bg-blue-600 transition-all"
                        >
                            <Facebook className="size-5" />
                        </a>
                        <a 
                            href="https://wa.me/628117998851" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex size-10 items-center justify-center rounded-full bg-[#1b1b18]/5 text-[#1b1b18] hover:bg-green-500 hover:text-white dark:bg-white/5 dark:text-white dark:hover:bg-green-500 transition-all"
                        >
                            <svg 
                                className="size-5 fill-current" 
                                viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.187-2.59-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.526-2.961-2.642-.087-.116-.708-.941-.708-1.797 0-.856.448-1.274.607-1.446.159-.172.346-.215.46-.215.115 0 .231 0 .331.005.106.004.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.777 1.394.864.174.088.275.073.376-.044.101-.117.433-.506.548-.68.116-.174.231-.145.39-.087.159.058 1.011.477 1.184.564.173.087.289.129.332.202.043.073.043.423-.101.827zM12.003 2c-5.523 0-10 4.477-10 10 0 1.765.459 3.423 1.261 4.866l-1.261 4.603 4.71-1.236c1.408.759 3.011 1.191 4.711 1.191 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zm0 18.067c-1.579 0-3.054-.42-4.329-1.156l-.31-.181-2.756.723.737-2.688-.198-.315c-.811-1.287-1.286-2.82-1.286-4.45 0-4.447 3.621-8.067 8.068-8.067 4.448 0 8.068 3.62 8.068 8.067-.001 4.448-3.621 8.067-8.068 8.067z" />
                            </svg>
                        </a>
                    </div>
                </div>
                
                <div className="mt-12 border-t border-[#1b1b18]/5 pt-8 text-center text-xs text-[#1b1b18]/40 dark:border-white/5 dark:text-white/40">
                    <p>© {new Date().getFullYear()} Diva AC. {t('footer_all_rights')}</p>
                    <div className="mt-4 flex flex-col items-center gap-1 opacity-50">
                        <p className="text-[10px] uppercase tracking-[0.2em] mb-2">
                            {t('footer_trademark_disclaimer')}
                        </p>
                        <p className="max-w-md text-[10px] leading-relaxed">
                            {t('footer_trademark_desc')}
                        </p>
                        <p className="mt-4">
                            3D Model: <a href="https://sketchfab.com/3d-models/free-ai-based-conceptcar-049-public-domain-cc0-72547082a35946878d3f59101ab583fa" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">FREE Concept Car 049 by Unity Fan</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
