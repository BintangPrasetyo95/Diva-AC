import { Head, useForm } from '@inertiajs/react';
import { Wind, ShoppingCart, PenTool, Gauge, ShieldCheck, History, Save, CheckCircle2, ChevronDown, ChevronUp, Image as ImageIcon, Wrench } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ServiceItem {
    id: number;
    slug: string;
    title_id: string;
    title_en: string;
    description_id: string;
    description_en: string;
    detailed_description_id: string | null;
    detailed_description_en: string | null;
    features_id: string[] | null;
    features_en: string[] | null;
    benefits_id: string[] | null;
    benefits_en: string[] | null;
    icon: string;
    image: string | null;
    order: number;
    is_active: boolean;
}

interface Props {
    services: ServiceItem[];
}

const ICON_OPTIONS = {
    Wind: Wind,
    ShoppingCart: ShoppingCart,
    PenTool: PenTool,
    Gauge: Gauge,
    ShieldCheck: ShieldCheck,
    History: History,
    Wrench: Wrench,
};

export default function ServicesSettings({ services: initialServices }: Props) {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        services: initialServices,
    });

    const handleServiceChange = (index: number, field: keyof ServiceItem, value: any) => {
        const newServices = [...data.services];
        newServices[index] = { ...newServices[index], [field]: value };
        setData('services', newServices);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/settings/services', {
            onSuccess: () => toast.success('Services updated successfully'),
            onError: () => toast.error('Failed to update services'),
        });
    };

    return (
        <div className="p-6 lg:p-8 max-w-5xl mx-auto">
            <Head title="Service Settings" />

            <div className="mb-8">
                <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] dark:text-white uppercase">
                    Landing Page <span className="text-red-600">Services</span>
                </h1>
                <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">Configure the service cards shown on the landing page.</p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    {data.services.map((service, index) => {
                        const isExpanded = expandedId === service.id;
                        const IconComponent = ICON_OPTIONS[service.icon as keyof typeof ICON_OPTIONS] || Wind;

                        return (
                            <div 
                                key={service.id} 
                                className={`bg-white dark:bg-[#121212] border border-[#1b1b18]/5 dark:border-white/5 rounded-3xl overflow-hidden transition-all ${isExpanded ? 'ring-2 ring-red-600/20 shadow-xl' : 'shadow-sm'}`}
                            >
                                <div 
                                    className="p-6 flex items-center justify-between cursor-pointer hover:bg-[#1b1b18]/1 dark:hover:bg-white/1 transition-colors"
                                    onClick={() => setExpandedId(isExpanded ? null : service.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-2xl bg-red-600/10 flex items-center justify-center text-red-600">
                                            <IconComponent className="size-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-black uppercase tracking-tight text-[#1b1b18] dark:text-white">{service.title_en}</h3>
                                            <p className="text-xs text-[#1b1b18]/40 dark:text-white/40">{service.slug}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${service.is_active ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                                            {service.is_active ? 'Active' : 'Inactive'}
                                        </div>
                                        {isExpanded ? <ChevronUp className="size-5 text-[#1b1b18]/20" /> : <ChevronDown className="size-5 text-[#1b1b18]/20" />}
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="p-8 border-t border-[#1b1b18]/5 dark:border-white/5 bg-[#1b1b18]/1 dark:bg-white/1 space-y-8 animate-in slide-in-from-top-4 duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Titles */}
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Title (ID)</Label>
                                                    <Input 
                                                        value={service.title_id} 
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleServiceChange(index, 'title_id', e.target.value)}
                                                        className="rounded-xl h-12 bg-white dark:bg-[#0a0a0a]"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Title (EN)</Label>
                                                    <Input 
                                                        value={service.title_en} 
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleServiceChange(index, 'title_en', e.target.value)}
                                                        className="rounded-xl h-12 bg-white dark:bg-[#0a0a0a]"
                                                    />
                                                </div>
                                            </div>

                                            {/* Icons & Images */}
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Icon</Label>
                                                        <select 
                                                            value={service.icon}
                                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleServiceChange(index, 'icon', e.target.value)}
                                                            className="w-full h-12 rounded-xl bg-white dark:bg-[#0a0a0a] border border-[#1b1b18]/10 dark:border-white/10 px-3 text-sm"
                                                        >
                                                            {Object.keys(ICON_OPTIONS).map(icon => (
                                                                <option key={icon} value={icon}>{icon}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Order</Label>
                                                        <Input 
                                                            type="number"
                                                            value={service.order} 
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleServiceChange(index, 'order', parseInt(e.target.value))}
                                                            className="rounded-xl h-12 bg-white dark:bg-[#0a0a0a]"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Image Path</Label>
                                                    <div className="relative">
                                                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#1b1b18]/30" />
                                                        <Input 
                                                            value={service.image || ''} 
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleServiceChange(index, 'image', e.target.value)}
                                                            className="pl-11 rounded-xl h-12 bg-white dark:bg-[#0a0a0a]"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Short Descriptions */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Short Description (ID)</Label>
                                                <Textarea 
                                                    value={service.description_id} 
                                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleServiceChange(index, 'description_id', e.target.value)}
                                                    className="rounded-2xl bg-white dark:bg-[#0a0a0a] min-h-[100px]"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Short Description (EN)</Label>
                                                <Textarea 
                                                    value={service.description_en} 
                                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleServiceChange(index, 'description_en', e.target.value)}
                                                    className="rounded-2xl bg-white dark:bg-[#0a0a0a] min-h-[100px]"
                                                />
                                            </div>
                                        </div>

                                        {/* Detailed Descriptions */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Detailed Description (ID)</Label>
                                                <Textarea 
                                                    placeholder="Add more details for the service info page..."
                                                    value={service.detailed_description_id || ''} 
                                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleServiceChange(index, 'detailed_description_id', e.target.value)}
                                                    className="rounded-2xl bg-white dark:bg-[#0a0a0a] min-h-[150px]"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Detailed Description (EN)</Label>
                                                <Textarea 
                                                    placeholder="Add more details for the service info page..."
                                                    value={service.detailed_description_en || ''} 
                                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleServiceChange(index, 'detailed_description_en', e.target.value)}
                                                    className="rounded-2xl bg-white dark:bg-[#0a0a0a] min-h-[150px]"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="checkbox" 
                                                id={`active-${service.id}`}
                                                checked={service.is_active}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleServiceChange(index, 'is_active', e.target.checked)}
                                                className="size-4 rounded border-[#1b1b18]/10 text-red-600 focus:ring-red-600"
                                            />
                                            <Label htmlFor={`active-${service.id}`} className="text-sm font-bold text-[#1b1b18] dark:text-white">Active on Landing Page</Label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="flex items-center justify-end pt-8">
                    <Button 
                        disabled={processing}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-2xl px-8 h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-red-600/20 transition-all hover:scale-105 active:scale-95 gap-2"
                    >
                        {recentlySuccessful ? <CheckCircle2 className="size-5" /> : <Save className="size-5" />}
                        {processing ? 'Saving...' : recentlySuccessful ? 'Saved' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
