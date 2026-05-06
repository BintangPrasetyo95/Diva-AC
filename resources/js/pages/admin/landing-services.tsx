import { Head, useForm } from '@inertiajs/react';
import { Image as ImageIcon, Plus, Trash2, X, Upload, CheckCircle2, Loader2, Edit2, Save, Wind, ShoppingCart, PenTool, Gauge, ShieldCheck, History, Wrench, Globe, Layout, ChevronDown, GripVertical, PlusCircle, Trash } from 'lucide-react';
import React, { useState, useCallback } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLanguage } from '@/hooks/use-language';

interface ServiceItem {
    id: number | string;
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
    image_file?: File | null;
    order: number;
    is_active: boolean;
}

interface Props {
    services: ServiceItem[];
}

const ICON_OPTIONS: Record<string, any> = {
    Wind: Wind,
    ShoppingCart: ShoppingCart,
    PenTool: PenTool,
    Gauge: Gauge,
    ShieldCheck: ShieldCheck,
    History: History,
    Wrench: Wrench,
};

const ServiceCard = ({ 
    service, 
    index, 
    isExpanded, 
    onToggle, 
    onChange, 
    onRemove, 
    t 
}: { 
    service: ServiceItem; 
    index: number; 
    isExpanded: boolean; 
    onToggle: () => void; 
    onChange: (index: number, field: keyof ServiceItem, value: any) => void;
    onRemove: (id: number | string) => void;
    t: any;
}) => {
    const dragControls = useDragControls();
    const IconComponent = ICON_OPTIONS[service.icon] || Wind;

    return (
        <Reorder.Item 
            value={service}
            dragListener={false}
            dragControls={dragControls}
            whileDrag={{ 
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
            }}
            className={`group relative bg-white dark:bg-[#121212] border rounded-[2.5rem] overflow-hidden ${isExpanded ? 'border-red-600/30 ring-4 ring-red-600/5 shadow-2xl z-10' : 'border-[#1b1b18]/5 dark:border-white/5 shadow-sm'}`}
        >
            <div 
                className={`p-6 flex items-center justify-between cursor-pointer transition-colors ${isExpanded ? 'bg-red-600/5' : 'hover:bg-[#1b1b18]/1 dark:hover:bg-white/1'}`}
                onClick={onToggle}
            >
                <div className="flex items-center gap-5">
                    <div 
                        onPointerDown={(e) => dragControls.start(e)}
                        className="cursor-grab active:cursor-grabbing p-1 text-[#1b1b18]/50 dark:text-white/50 hover:text-red-600 transition-colors"
                    >
                        <GripVertical className="size-5" />
                    </div>
                    <div className={`size-14 rounded-3xl flex items-center justify-center transition-colors ${isExpanded ? 'bg-red-600 text-white' : 'bg-red-600/10 text-red-600 dark:text-red-500'}`}>
                        <IconComponent className="size-7" />
                    </div>
                    <div>
                        <h3 className="font-black uppercase tracking-tight text-[#1b1b18] dark:text-white text-lg">{service.title_en}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#1b1b18]/5 dark:bg-white/10 text-[#1b1b18]/40 dark:text-white/40">{service.slug || 'NEW'}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1b1b18]/20">Order: {service.order}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${service.is_active ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                        <div className={`size-2 rounded-full ${service.is_active ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`} />
                        {service.is_active ? 'Active' : 'Inactive'}
                    </div>
                    
                    <button 
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(service.id);
                        }}
                        className="size-10 rounded-full border border-red-600/10 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all"
                    >
                        <Trash className="size-4" />
                    </button>

                    <div className={`size-10 rounded-full border border-[#1b1b18]/10 dark:border-white/10 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-white dark:bg-[#1b1b18]' : ''}`}>
                        <ChevronDown className="size-5 text-[#1b1b18]/40 dark:text-white/40" />
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="p-8 lg:p-10 border-t border-[#1b1b18]/5 dark:border-white/5 space-y-12 animate-in fade-in slide-in-from-top-4 duration-500">
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-red-600/10 text-red-600">
                                <Layout className="size-4" />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#1b1b18]/30">{t('dash_general_config')}</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40 ml-1">{t('dash_display_icon')}</Label>
                                <select 
                                    value={service.icon}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(index, 'icon', e.target.value)}
                                    className="w-full h-14 rounded-2xl bg-[#1b1b18]/5 dark:bg-white/5 border-none px-4 text-sm font-bold focus:ring-2 focus:ring-red-600/20"
                                >
                                    {Object.keys(ICON_OPTIONS).map(icon => (
                                        <option key={icon} value={icon}>{icon}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40 ml-1">{t('dash_sort_order')}</Label>
                                <Input 
                                    type="number"
                                    value={service.order} 
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(index, 'order', parseInt(e.target.value))}
                                    className="rounded-2xl h-14 bg-[#1b1b18]/5 dark:bg-white/5 border-none font-bold"
                                />
                            </div>
                            <div className="flex items-end pb-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input 
                                            type="checkbox" 
                                            checked={service.is_active}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(index, 'is_active', e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-14 h-8 rounded-full transition-colors duration-300 ${service.is_active ? 'bg-green-500' : 'bg-[#1b1b18]/10'}`} />
                                        <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${service.is_active ? 'translate-x-6' : ''}`} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-[#1b1b18]/60 dark:text-white/60 group-hover:text-red-600 transition-colors">{t('dash_visible_on_landing')}</span>
                                </label>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-red-600/10 text-red-600">
                                <Globe className="size-4" />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#1b1b18]/30">{t('dash_multilingual_content')}</h4>
                        </div>

                        <div className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-4xl bg-[#1b1b18]/2 dark:bg-white/2 border border-[#1b1b18]/5 dark:border-white/5">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 ml-1">
                                        <div className="size-4 rounded-full bg-[#1b1b18]/10 dark:bg-white/10 flex items-center justify-center text-[8px] font-bold">ID</div>
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">{t('dash_col_car')}</Label>
                                    </div>
                                    <Input 
                                        value={service.title_id} 
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(index, 'title_id', e.target.value)}
                                        className="rounded-2xl h-14 bg-white dark:bg-[#0a0a0a] border-[#1b1b18]/10 dark:border-white/10 font-bold"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 ml-1">
                                        <div className="size-4 rounded-full bg-[#1b1b18]/10 dark:bg-white/10 flex items-center justify-center text-[8px] font-bold">EN</div>
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">{t('dash_col_car')}</Label>
                                    </div>
                                    <Input 
                                        value={service.title_en} 
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(index, 'title_en', e.target.value)}
                                        className="rounded-2xl h-14 bg-white dark:bg-[#0a0a0a] border-[#1b1b18]/10 dark:border-white/10 font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40 ml-1">{t('dash_card_summary_id')}</Label>
                                    <Textarea 
                                        value={service.description_id} 
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(index, 'description_id', e.target.value)}
                                        className="rounded-4xl bg-white dark:bg-[#0a0a0a] border-[#1b1b18]/10 dark:border-white/10 min-h-[120px] p-5 text-sm"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40 ml-1">{t('dash_card_summary_en')}</Label>
                                    <Textarea 
                                        value={service.description_en} 
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(index, 'description_en', e.target.value)}
                                        className="rounded-4xl bg-white dark:bg-[#0a0a0a] border-[#1b1b18]/10 dark:border-white/10 min-h-[120px] p-5 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-red-600/10 text-red-600">
                                <ImageIcon className="size-4" />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#1b1b18]/30">{t('dash_visual_assets')}</h4>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40 ml-1">{t('dash_upload_new_image')}</Label>
                                <div 
                                    className="relative h-64 rounded-4xl border-2 border-dashed border-[#1b1b18]/10 dark:border-white/10 hover:border-red-600/30 transition-colors group flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden bg-[#1b1b18]/2 dark:bg-white/2"
                                    onClick={() => document.getElementById(`file-${index}`)?.click()}
                                >
                                    <input 
                                        type="file" 
                                        id={`file-${index}`}
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const file = e.target.files?.[0];
                                            if (file) onChange(index, 'image_file', file);
                                        }}
                                    />
                                    <div className="size-12 rounded-2xl bg-white dark:bg-white/5 shadow-sm flex items-center justify-center text-[#1b1b18]/40 group-hover:scale-110 transition-transform">
                                        <Upload className="size-5" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-black uppercase tracking-widest text-[#1b1b18] dark:text-white">{t('dash_click_to_upload')}</p>
                                        <p className="text-[10px] text-[#1b1b18]/40 mt-1 uppercase tracking-widest">PNG, JPG up to 5MB</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40 ml-1">{t('dash_current_preview')}</Label>
                                <div className="h-64 rounded-4xl overflow-hidden bg-[#1b1b18]/5 dark:bg-white/5 border border-[#1b1b18]/5 dark:border-white/5 flex items-center justify-center">
                                    {service.image_file ? (
                                        <img src={URL.createObjectURL(service.image_file)} alt="Preview" className="w-full h-full object-cover" />
                                    ) : service.image ? (
                                        <img src={`/storage/${service.image}`} alt="Current" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex h-full flex-col items-center justify-center text-[#1b1b18]/20">
                                            <ImageIcon className="size-10 mb-2" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">No image selected</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </Reorder.Item>
    );
};

export default function ServicesSettings({ services: initialServices }: Props) {
    const { t } = useLanguage();
    const [expandedId, setExpandedId] = useState<number | string | null>(null);
    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        services: initialServices,
    });

    const handleServiceChange = (index: number, field: keyof ServiceItem, value: any) => {
        const newServices = [...data.services];
        newServices[index] = { ...newServices[index], [field]: value };
        setData('services', newServices);
    };

    const addService = () => {
        const newService: ServiceItem = {
            id: `new-${Math.random().toString(36).substr(2, 9)}`,
            slug: '',
            title_id: 'Layanan Baru',
            title_en: 'New Service',
            description_id: '',
            description_en: '',
            detailed_description_id: '',
            detailed_description_en: '',
            features_id: [],
            features_en: [],
            benefits_id: [],
            benefits_en: [],
            icon: 'Wind',
            image: null,
            order: data.services.length,
            is_active: true,
        };
        setData('services', [...data.services, newService]);
        setExpandedId(newService.id);
    };

    const removeService = (id: number | string) => {
        setData('services', data.services.filter(s => s.id !== id));
    };

    const handleReorder = (newOrder: ServiceItem[]) => {
        const updated = newOrder.map((s, i) => ({ ...s, order: i }));
        setData('services', updated);
    };

    const submit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        patch('/admin/landing-services', {
            onSuccess: () => toast.success(t('dash_services_settings') + ' updated'),
            onError: () => toast.error('Failed to update services'),
        });
    };

    return (
        <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
            <Head title={t('dash_services_settings')} />

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] dark:text-white uppercase">
                        Landing Page <span className="text-red-600">Services</span>
                    </h1>
                    <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">{t('dash_services_desc')}</p>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        type="button"
                        onClick={addService}
                        className="flex h-12 items-center gap-2 rounded-full bg-[#1b1b18]/5 px-6 text-sm font-bold text-[#1b1b18] transition-all hover:bg-[#1b1b18]/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                    >
                        <PlusCircle className="size-4" />
                        {t('dash_add_new')}
                    </button>
                    <button 
                        type="button"
                        onClick={submit}
                        disabled={processing}
                        className="flex h-12 items-center gap-2 rounded-full bg-red-600 px-8 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 active:scale-95 disabled:opacity-50"
                    >
                        {processing ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                        {t('dash_save_changes')}
                    </button>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <Reorder.Group axis="y" values={data.services} onReorder={handleReorder} className="grid grid-cols-1 gap-4">
                    {data.services.map((service, index) => (
                        <ServiceCard 
                            key={service.id}
                            service={service}
                            index={index}
                            isExpanded={expandedId === service.id}
                            onToggle={() => setExpandedId(expandedId === service.id ? null : service.id)}
                            onChange={handleServiceChange}
                            onRemove={removeService}
                            t={t}
                        />
                    ))}
                </Reorder.Group>

                <div className="sticky bottom-6 flex items-center justify-center pt-8 pointer-events-none">
                    <Button 
                        disabled={processing}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-full px-12 h-16 font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-red-600/40 transition-all hover:scale-105 active:scale-95 gap-3 pointer-events-auto border-4 border-white dark:border-[#121212]"
                    >
                        {processing ? <Loader2 className="size-5 animate-spin" /> : recentlySuccessful ? <CheckCircle2 className="size-5" /> : <Save className="size-5" />}
                        {processing ? t('dash_saving') : recentlySuccessful ? t('dash_saved_success') : t('dash_update_all')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
