import { Head, useForm } from '@inertiajs/react';
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
    ExternalLink
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

export default function WorkshopSettings({ settings }: Props) {
    const { t } = useLanguage();
    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        ...settings,
        logo: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/admin/workshop-settings', {
            onSuccess: () => toast.success('Workshop settings updated successfully'),
            onError: () => toast.error('Failed to update settings'),
        });
    };

    return (
        <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8 pb-24">
            <Head title="Workshop Settings" />

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] dark:text-white uppercase">
                        Workshop <span className="text-red-600">Settings</span>
                    </h1>
                    <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">Manage your business identity and contact information.</p>
                </div>

                <Button 
                    onClick={submit}
                    disabled={processing}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 h-12 font-black uppercase tracking-widest text-xs shadow-lg shadow-red-600/20 transition-all hover:scale-105 active:scale-95 gap-2"
                >
                    {processing ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    Save All Changes
                </Button>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
                {/* Left Column: General & Branding */}
                <div className="space-y-8">
                    {/* General Information */}
                    <section className="bg-white dark:bg-[#121212] rounded-[2.5rem] p-8 border border-[#1b1b18]/5 dark:border-white/5 shadow-sm space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-red-600/10 text-red-600">
                                <Store className="size-5" />
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#1b1b18]/40">Business Identity</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40 ml-1">Workshop Name</Label>
                                <Input 
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    disabled
                                    className="h-14 rounded-2xl bg-[#1b1b18]/5 dark:bg-white/5 border-none font-bold opacity-50 cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40 ml-1">Business Email</Label>
                                <Input 
                                    type="email"
                                    value={data.email || ''}
                                    onChange={e => setData('email', e.target.value)}
                                    className="h-14 rounded-2xl bg-[#1b1b18]/5 dark:bg-white/5 border-none font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40 ml-1">Physical Address</Label>
                            <Textarea 
                                value={data.address || ''}
                                onChange={e => setData('address', e.target.value)}
                                className="rounded-3xl bg-[#1b1b18]/5 dark:bg-white/5 border-none font-bold min-h-[100px] p-4"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40 ml-1">Google Maps Embed/Link</Label>
                            <div className="flex gap-2">
                                <Input 
                                    value={data.maps_link || ''}
                                    onChange={e => setData('maps_link', e.target.value)}
                                    placeholder="https://goo.gl/maps/..."
                                    className="h-14 rounded-2xl bg-[#1b1b18]/5 dark:bg-white/5 border-none font-bold"
                                />
                                {data.maps_link && (
                                    <Button variant="outline" className="h-14 w-14 rounded-2xl shrink-0" asChild>
                                        <a href={data.maps_link} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="size-5" />
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Contact & Social */}
                    <section className="bg-white dark:bg-[#121212] rounded-[2.5rem] p-8 border border-[#1b1b18]/5 dark:border-white/5 shadow-sm space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-red-600/10 text-red-600">
                                <MessageCircle className="size-5" />
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#1b1b18]/40">Contact & Social</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40 ml-1">Contact / WhatsApp Number</Label>
                                    <div className="relative">
                                        <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#1b1b18]/20" />
                                        <Input 
                                            value={data.whatsapp || ''}
                                            onChange={e => {
                                                setData(prev => ({
                                                    ...prev,
                                                    whatsapp: e.target.value,
                                                    phone: e.target.value
                                                }));
                                            }}
                                            placeholder="628123456789"
                                            className="h-14 pl-12 rounded-2xl bg-[#1b1b18]/5 dark:bg-white/5 border-none font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40 ml-1">Instagram</Label>
                                <div className="relative">
                                    <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#1b1b18]/20" />
                                    <Input 
                                        value={data.instagram_link || ''}
                                        onChange={e => setData('instagram_link', e.target.value)}
                                        className="h-14 pl-12 rounded-2xl bg-[#1b1b18]/5 dark:bg-white/5 border-none font-bold"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40 ml-1">Facebook</Label>
                                <div className="relative">
                                    <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#1b1b18]/20" />
                                    <Input 
                                        value={data.facebook_link || ''}
                                        onChange={e => setData('facebook_link', e.target.value)}
                                        className="h-14 pl-12 rounded-2xl bg-[#1b1b18]/5 dark:bg-white/5 border-none font-bold"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40 ml-1">TikTok</Label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#1b1b18]/20" />
                                    <Input 
                                        value={data.tiktok_link || ''}
                                        onChange={e => setData('tiktok_link', e.target.value)}
                                        className="h-14 pl-12 rounded-2xl bg-[#1b1b18]/5 dark:bg-white/5 border-none font-bold"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
                <Button 
                    onClick={submit}
                    disabled={processing}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full px-12 h-16 font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-red-600/40 transition-all hover:scale-105 active:scale-95 gap-3 pointer-events-auto border-4 border-white dark:border-[#121212]"
                >
                    {processing ? <Loader2 className="size-5 animate-spin" /> : recentlySuccessful ? <CheckCircle2 className="size-5" /> : <Save className="size-5" />}
                    {processing ? 'Saving...' : recentlySuccessful ? 'Settings Saved' : 'Update All Settings'}
                </Button>
            </div>
        </div>
    );
}

WorkshopSettings.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Workshop Settings', href: '/admin/workshop-settings' },
    ],
};
