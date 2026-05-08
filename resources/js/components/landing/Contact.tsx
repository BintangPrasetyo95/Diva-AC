import { MapPin, Clock } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export default function Contact({ settings }: { settings: any }) {
    const { t } = useLanguage();

    const whatsappNumber = settings?.whatsapp || '628117998851';
    const address = settings?.address || 'Jl. Brigjend Katamso, Lampung Tengah, Indonesia';
    const mapsLink = settings?.maps_link || 'https://maps.app.goo.gl/U7B13w6BFdYH7e7e8';
    
    // Format hours
    const hours = settings?.opening_hours || {};
    const monSat = hours['Monday'] ? `${hours['Monday'].open} - ${hours['Monday'].close}` : '08:00 - 17:00';

    return (
        <section id="contact" className="py-24 px-6">
            <div className="mx-auto max-w-6xl">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-0">
                    <div>
                        <h2 className="mb-8 text-3xl font-bold tracking-tight text-[#1b1b18] sm:text-4xl dark:text-white uppercase">
                            {t('contact_title')}
                        </h2>
                        
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <a className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:text-red-600 hover:bg-white transition-colors cursor-pointer" href={mapsLink} target="_blank">
                                    <MapPin className="size-6" />
                                </a>
                                <div>
                                    <h4 className="font-bold text-[#1b1b18] dark:text-white">{t('location_label')}</h4>
                                    <p className="text-[#1b1b18]/60 dark:text-white/60">{address}</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <a className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:text-red-600 hover:bg-white transition-colors cursor-pointer" href={`https://wa.me/${whatsappNumber}`} target="_blank">
                                    <svg 
                                        className="size-6 fill-current" 
                                        viewBox="0 0 24 24" 
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.187-2.59-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.526-2.961-2.642-.087-.116-.708-.941-.708-1.797 0-.856.448-1.274.607-1.446.159-.172.346-.215.46-.215.115 0 .231 0 .331.005.106.004.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.777 1.394.864.174.088.275.073.376-.044.101-.117.433-.506.548-.68.116-.174.231-.145.39-.087.159.058 1.011.477 1.184.564.173.087.289.129.332.202.043.073.043.423-.101.827zM12.003 2c-5.523 0-10 4.477-10 10 0 1.765.459 3.423 1.261 4.866l-1.261 4.603 4.71-1.236c1.408.759 3.011 1.191 4.711 1.191 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zm0 18.067c-1.579 0-3.054-.42-4.329-1.156l-.31-.181-2.756.723.737-2.688-.198-.315c-.811-1.287-1.286-2.82-1.286-4.45 0-4.447 3.621-8.067 8.068-8.067 4.448 0 8.068 3.62 8.068 8.067-.001 4.448-3.621 8.067-8.068 8.067z" />
                                    </svg>
                                </a>
                                <div>
                                    <h4 className="font-bold text-[#1b1b18] dark:text-white">{t('whatsapp_phone')}</h4>
                                    <p className="text-[#1b1b18]/60 dark:text-white/60">+{whatsappNumber.replace(/^(\d{2})(\d{3})(\d{4})(\d{4})$/, '$1 $2-$3-$4')}</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                                    <Clock className="size-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1b1b18] dark:text-white">{t('opening_hours')}</h4>
                                    <p className="text-[#1b1b18]/60 dark:text-white/60">{t('mon_sat')}: {monSat}</p>
                                    <p className="text-[#1b1b18]/60 dark:text-white/60">{hours['Sunday']?.is_closed ? t('sun_closed') : `${hours['Sunday']?.open} - ${hours['Sunday']?.close}`}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative overflow-hidden rounded-3xl border border-[#1b1b18]/5 bg-gray-100 dark:border-white/5 dark:bg-zinc-900">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.9494890027154!2d105.2870145!3d-5.111844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40bbc2e11b6de9%3A0x9e7ba69d620d49f6!2sDIVA%20AC%20BENGKEL%20AC%20MOBIL!5e0!3m2!1sid!2sid!4v1776964669783!5m2!1sid!2sid" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0, minHeight: '400px' }} 
                            allowFullScreen 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            className="grayscale dark:invert dark:opacity-80"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
