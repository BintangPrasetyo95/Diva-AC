import { Head } from '@inertiajs/react';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import { Store, MapPin, Phone, Clock, Save, Globe } from 'lucide-react';
import React from 'react';
import { useLanguage } from '@/hooks/use-language';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring" as const, stiffness: 100, damping: 12 }
    }
};

export default function BusinessProfile() {
    const { t, language } = useLanguage();

    return (
        <LazyMotion features={domAnimation}>
            <Head title="Business Profile" />

            <m.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="flex flex-col gap-8 p-6 lg:p-8"
            >
                <m.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] dark:text-white uppercase">
                            Business <span className="text-red-600">Profile</span>
                        </h1>
                        <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">Update workshop information and settings</p>
                    </div>

                    <button className="flex h-10 items-center gap-2 rounded-full bg-red-600 px-6 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 active:scale-95">
                        <Save className="size-4" />
                        Save Changes
                    </button>
                </m.div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* General Information */}
                    <m.div
                        variants={itemVariants}
                        className="rounded-3xl border border-[#1b1b18]/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#121212]"
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <Store className="size-5 text-red-600" />
                            <h2 className="text-lg font-black tracking-tight text-[#1b1b18] dark:text-white uppercase">General Info</h2>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">Workshop Name</label>
                                <input type="text" defaultValue="Diva-AC Mobil" readOnly className="rounded-2xl border border-[#1b1b18]/10 bg-[#1b1b18]/5 px-4 py-3 text-sm font-bold focus:border-red-600 focus:ring-0 dark:border-white/10 dark:bg-white/5 cursor-not-allowed opacity-70" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">WhatsApp Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#1b1b18]/40" />
                                    <input type="text" defaultValue="+62 812-3456-7890" className="w-full rounded-2xl border border-[#1b1b18]/10 bg-transparent pl-12 pr-4 py-3 text-sm font-bold focus:border-red-600 focus:ring-0 dark:border-white/10" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">Maps Location (URL)</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#1b1b18]/40" />
                                    <input type="text" defaultValue="https://goo.gl/maps/..." className="w-full rounded-2xl border border-[#1b1b18]/10 bg-transparent pl-12 pr-4 py-3 text-sm font-bold focus:border-red-600 focus:ring-0 dark:border-white/10" />
                                </div>
                            </div>
                        </div>
                    </m.div>

                    {/* Operational Hours */}
                    <m.div
                        variants={itemVariants}
                        className="rounded-3xl border border-[#1b1b18]/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#121212]"
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <Clock className="size-5 text-red-600" />
                            <h2 className="text-lg font-black tracking-tight text-[#1b1b18] dark:text-white uppercase">Operational Hours</h2>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {[
                                { en: 'Monday', id: 'Senin' },
                                { en: 'Tuesday', id: 'Selasa' },
                                { en: 'Wednesday', id: 'Rabu' },
                                { en: 'Thursday', id: 'Kamis' },
                                { en: 'Friday', id: 'Jumat' },
                                { en: 'Saturday', id: 'Sabtu' },
                                { en: 'Sunday', id: 'Minggu' }
                            ].map((day) => (
                                <div key={day.en} className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40">
                                        {language === 'id' ? day.id : day.en}
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={day.en === 'Sunday' ? (language === 'id' ? 'Tutup' : 'Closed') : '08:00 - 17:00'}
                                        readOnly={day.en === 'Sunday'}
                                        className={`rounded-2xl border border-[#1b1b18]/10 bg-transparent px-4 py-3 text-sm font-bold focus:border-red-600 focus:ring-0 dark:border-white/10 ${day.en === 'Sunday' ? 'bg-[#1b1b18]/5 dark:bg-white/5 cursor-not-allowed opacity-70' : ''}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </m.div>
                </div>
            </m.div>
        </LazyMotion>
    );
}
