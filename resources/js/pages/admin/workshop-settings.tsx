import { Head, useForm } from '@inertiajs/react';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import {
    Store,
    MapPin,
    Instagram,
    Facebook,
    Save,
    Loader2,
    CheckCircle2,
    MessageCircle,
    Globe,
    ExternalLink,
    Clock,
    Mail,
    Phone,
} from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLanguage } from '@/hooks/use-language';

interface OpeningHours {
    [key: string]: {
        open: string;
        close: string;
        is_closed: boolean;
    };
}

interface StoreSettings {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
    address: string | null;
    maps_link: string | null;
    instagram_link: string | null;
    facebook_link: string | null;
    tiktok_link: string | null;
    opening_hours: OpeningHours;
    logo_path: string | null;
}

interface Props {
    settings: StoreSettings;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring' as const, stiffness: 100, damping: 12 },
    },
};

export default function WorkshopSettings({ settings }: Props) {
    const { t, language } = useLanguage();
    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        ...settings,
        logo: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/admin/workshop-settings', {
            onSuccess: () => toast.success(t('dash_saved')),
            onError: () => toast.error('Failed to update settings'),
        });
    };

    const updateOpeningHours = (day: string, field: string, value: any) => {
        setData('opening_hours', {
            ...data.opening_hours,
            [day]: {
                ...data.opening_hours[day],
                [field]: value,
            },
        });
    };

    return (
        <LazyMotion features={domAnimation}>
            <div className="mx-auto max-w-7xl space-y-8 p-6 pb-32 lg:p-8">
                <Head title={t('dash_workshop_identity')} />

                <m.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="flex flex-col gap-8"
                >
                    <m.div
                        variants={itemVariants}
                        className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
                    >
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                                Workshop{' '}
                                <span className="text-red-600">Identity</span>
                            </h1>
                            <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">
                                {language === 'id'
                                    ? 'Kelola identitas bisnis dan informasi kontak Anda.'
                                    : 'Manage your business identity and contact information.'}
                            </p>
                        </div>

                        <Button
                            onClick={submit}
                            disabled={processing}
                            className="h-12 gap-2 rounded-full bg-red-600 px-8 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-red-600/20 transition-all hover:scale-105 hover:bg-red-700 active:scale-95"
                        >
                            {processing ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : recentlySuccessful ? (
                                <CheckCircle2 className="size-4" />
                            ) : (
                                <Save className="size-4" />
                            )}
                            {processing
                                ? t('dash_saving')
                                : recentlySuccessful
                                  ? t('dash_saved')
                                  : t('dash_save_changes')}
                        </Button>
                    </m.div>

                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Left Column: General & Social */}
                        <div className="space-y-8">
                            {/* General Information */}
                            <m.section
                                variants={itemVariants}
                                className="space-y-8 rounded-[2.5rem] border border-[#1b1b18]/5 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#121212]"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-red-600/10 p-2 text-red-600">
                                        <Store className="size-5" />
                                    </div>
                                    <h2 className="text-sm font-black tracking-[0.2em] text-[#1b1b18]/40 uppercase dark:text-white/40">
                                        {t('dash_general_info')}
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                            {t('dash_workshop_name')}
                                        </Label>
                                        <Input
                                            value={data.name}
                                            disabled
                                            className="h-14 cursor-not-allowed rounded-2xl border-none bg-[#1b1b18]/5 font-bold opacity-50 dark:bg-white/5"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                            {t('dash_workshop_email')}
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#1b1b18]/20" />
                                            <Input
                                                type="email"
                                                value={data.email || ''}
                                                onChange={(e) =>
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-14 rounded-2xl border-none bg-[#1b1b18]/5 pl-12 font-bold transition-all focus:ring-2 focus:ring-red-600/20 dark:bg-white/5"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                            {t('dash_workshop_address')}
                                        </Label>
                                        <Textarea
                                            value={data.address || ''}
                                            onChange={(e) =>
                                                setData(
                                                    'address',
                                                    e.target.value,
                                                )
                                            }
                                            className="min-h-[100px] rounded-3xl border-none bg-[#1b1b18]/5 p-4 font-bold transition-all focus:ring-2 focus:ring-red-600/20 dark:bg-white/5"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                            {t('dash_maps_link')}
                                        </Label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <MapPin className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#1b1b18]/20" />
                                                <Input
                                                    value={data.maps_link || ''}
                                                    onChange={(e) =>
                                                        setData(
                                                            'maps_link',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="https://goo.gl/maps/..."
                                                    className="h-14 rounded-2xl border-none bg-[#1b1b18]/5 pl-12 font-bold transition-all focus:ring-2 focus:ring-red-600/20 dark:bg-white/5"
                                                />
                                            </div>
                                            {data.maps_link && (
                                                <Button
                                                    variant="outline"
                                                    className="h-14 w-14 shrink-0 rounded-2xl border-none bg-[#1b1b18]/5 dark:bg-white/5"
                                                    asChild
                                                >
                                                    <a
                                                        href={data.maps_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <ExternalLink className="size-5" />
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </m.section>

                            {/* Contact & Social */}
                            <m.section
                                variants={itemVariants}
                                className="space-y-8 rounded-[2.5rem] border border-[#1b1b18]/5 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#121212]"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-red-600/10 p-2 text-red-600">
                                        <MessageCircle className="size-5" />
                                    </div>
                                    <h2 className="text-sm font-black tracking-[0.2em] text-[#1b1b18]/40 uppercase dark:text-white/40">
                                        {t('dash_contact_social')}
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <Label className="ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                            {t('dash_whatsapp')}
                                        </Label>
                                        <div className="relative">
                                            <Phone className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#1b1b18]/20" />
                                            <Input
                                                value={data.whatsapp || ''}
                                                onChange={(e) => {
                                                    setData((prev) => ({
                                                        ...prev,
                                                        whatsapp:
                                                            e.target.value,
                                                        phone: e.target.value,
                                                    }));
                                                }}
                                                placeholder="628123456789"
                                                className="h-14 rounded-2xl border-none bg-[#1b1b18]/5 pl-12 font-bold transition-all focus:ring-2 focus:ring-red-600/20 dark:bg-white/5"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label className="ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                                Instagram
                                            </Label>
                                            <div className="relative">
                                                <Instagram className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#1b1b18]/20" />
                                                <Input
                                                    value={
                                                        data.instagram_link ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            'instagram_link',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-14 rounded-2xl border-none bg-[#1b1b18]/5 pl-12 font-bold transition-all focus:ring-2 focus:ring-red-600/20 dark:bg-white/5"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                                Facebook
                                            </Label>
                                            <div className="relative">
                                                <Facebook className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#1b1b18]/20" />
                                                <Input
                                                    value={
                                                        data.facebook_link || ''
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            'facebook_link',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-14 rounded-2xl border-none bg-[#1b1b18]/5 pl-12 font-bold transition-all focus:ring-2 focus:ring-red-600/20 dark:bg-white/5"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40">
                                                TikTok
                                            </Label>
                                            <div className="relative">
                                                <Globe className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#1b1b18]/20" />
                                                <Input
                                                    value={
                                                        data.tiktok_link || ''
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            'tiktok_link',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-14 rounded-2xl border-none bg-[#1b1b18]/5 pl-12 font-bold transition-all focus:ring-2 focus:ring-red-600/20 dark:bg-white/5"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </m.section>
                        </div>

                        {/* Right Column: Operational Hours */}
                        <div className="space-y-8">
                            <m.section
                                variants={itemVariants}
                                className="h-full space-y-8 rounded-[2.5rem] border border-[#1b1b18]/5 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-[#121212]"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-red-600/10 p-2 text-red-600">
                                        <Clock className="size-5" />
                                    </div>
                                    <h2 className="text-sm font-black tracking-[0.2em] text-[#1b1b18]/40 uppercase dark:text-white/40">
                                        {t('dash_operational_hours')}
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {Object.entries(data.opening_hours).map(
                                        ([day, hours]) => (
                                            <div
                                                key={day}
                                                className="flex flex-col gap-4 rounded-3xl bg-[#1b1b18]/5 p-4 transition-all hover:bg-[#1b1b18]/10 sm:flex-row sm:items-center dark:bg-white/5 dark:hover:bg-white/10"
                                            >
                                                <div className="w-24 shrink-0">
                                                    <span className="text-xs font-black tracking-widest text-[#1b1b18]/60 uppercase dark:text-white/60">
                                                        {t(
                                                            `day_${day.toLowerCase()}`,
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="flex flex-1 items-center gap-2">
                                                    <Input
                                                        type="time"
                                                        value={hours.open}
                                                        onChange={(e) =>
                                                            updateOpeningHours(
                                                                day,
                                                                'open',
                                                                e.target.value,
                                                            )
                                                        }
                                                        disabled={
                                                            hours.is_closed
                                                        }
                                                        className="h-10 rounded-xl border-none bg-white text-xs font-bold disabled:opacity-30 dark:bg-black"
                                                    />
                                                    <span className="text-[#1b1b18]/20">
                                                        -
                                                    </span>
                                                    <Input
                                                        type="time"
                                                        value={hours.close}
                                                        onChange={(e) =>
                                                            updateOpeningHours(
                                                                day,
                                                                'close',
                                                                e.target.value,
                                                            )
                                                        }
                                                        disabled={
                                                            hours.is_closed
                                                        }
                                                        className="h-10 rounded-xl border-none bg-white text-xs font-bold disabled:opacity-30 dark:bg-black"
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateOpeningHours(
                                                            day,
                                                            'is_closed',
                                                            !hours.is_closed,
                                                        )
                                                    }
                                                    className={`rounded-xl px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all ${
                                                        hours.is_closed
                                                            ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                                                            : 'bg-[#1b1b18]/10 text-[#1b1b18]/40 hover:bg-[#1b1b18]/20'
                                                    }`}
                                                >
                                                    {hours.is_closed
                                                        ? t('day_closed')
                                                        : 'Open'}
                                                </button>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </m.section>
                        </div>
                    </div>
                </m.div>

                {/* Floating Action Button */}
                <div className="pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
                    <Button
                        onClick={submit}
                        disabled={processing}
                        className="pointer-events-auto h-16 gap-3 rounded-full border-4 border-white bg-red-600 px-12 text-xs font-black tracking-[0.2em] text-white uppercase shadow-2xl shadow-red-600/40 transition-all hover:scale-105 hover:bg-red-700 active:scale-95 dark:border-[#121212]"
                    >
                        {processing ? (
                            <Loader2 className="size-5 animate-spin" />
                        ) : recentlySuccessful ? (
                            <CheckCircle2 className="size-5" />
                        ) : (
                            <Save className="size-5" />
                        )}
                        {processing
                            ? t('dash_saving')
                            : recentlySuccessful
                              ? t('dash_saved')
                              : t('dash_save_changes')}
                    </Button>
                </div>
            </div>
        </LazyMotion>
    );
}

WorkshopSettings.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Workshop Identity', href: '/admin/workshop-settings' },
    ],
};
