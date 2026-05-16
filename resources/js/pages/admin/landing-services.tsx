import { Head, useForm } from '@inertiajs/react';
import {
    Image as ImageIcon,
    Plus,
    Trash2,
    X,
    Upload,
    CheckCircle2,
    Loader2,
    Edit2,
    Save,
    Wind,
    ShoppingCart,
    PenTool,
    Gauge,
    ShieldCheck,
    History,
    Wrench,
    Globe,
    Layout,
    ChevronDown,
    GripVertical,
    PlusCircle,
    Trash,
} from 'lucide-react';
import React, { useState, useCallback } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLanguage } from '@/hooks/use-language';
import { SearchableSelect } from '@/components/ui/searchable-select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';


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
    image_url: string | null;
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
    t,
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
                boxShadow:
                    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            }}
            className={`group relative overflow-hidden rounded-[2.5rem] border bg-white dark:bg-[#121212] ${isExpanded ? 'z-10 border-red-600/30 shadow-2xl ring-4 ring-red-600/5' : 'border-[#1b1b18]/5 shadow-sm dark:border-white/5'}`}
        >
            <div
                className={`flex cursor-pointer items-center justify-between p-6 transition-colors ${isExpanded ? 'bg-red-600/5' : 'hover:bg-[#1b1b18]/1 dark:hover:bg-white/1'}`}
                onClick={onToggle}
            >
                <div className="flex items-center gap-5">
                    <div
                        onPointerDown={(e) => dragControls.start(e)}
                        className="cursor-grab p-1 text-[#1b1b18]/50 transition-colors hover:text-red-600 active:cursor-grabbing dark:text-white/50"
                    >
                        <GripVertical className="size-5" />
                    </div>
                    <div
                        className={`flex size-14 items-center justify-center rounded-3xl transition-colors ${isExpanded ? 'bg-red-600 text-white' : 'bg-red-600/10 text-red-600 dark:text-red-500'}`}
                    >
                        <IconComponent className="size-7" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                            {service.title_en}
                        </h3>
                        <div className="mt-0.5 flex items-center gap-2">
                            <span className="rounded-full bg-[#1b1b18]/5 px-2 py-0.5 text-[10px] font-bold tracking-widest text-[#1b1b18]/40 uppercase dark:bg-white/10 dark:text-white/40">
                                {service.slug || 'NEW'}
                            </span>
                            <span className="text-[10px] font-bold tracking-widest text-[#1b1b18]/20 uppercase">
                                Order: {service.order}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div
                        className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest uppercase ${service.is_active ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}
                    >
                        <div
                            className={`size-2 rounded-full ${service.is_active ? 'animate-pulse bg-green-600' : 'bg-red-600'}`}
                        />
                        {service.is_active ? 'Active' : 'Inactive'}
                    </div>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(service.id);
                        }}
                        className="flex size-10 items-center justify-center rounded-full border border-red-600/10 text-red-600 transition-all hover:bg-red-600 hover:text-white"
                    >
                        <Trash className="size-4" />
                    </button>

                    <div
                        className={`flex size-10 items-center justify-center rounded-full border border-[#1b1b18]/10 transition-transform duration-300 dark:border-white/10 ${isExpanded ? 'rotate-180 bg-white dark:bg-[#1b1b18]' : ''}`}
                    >
                        <ChevronDown className="size-5 text-[#1b1b18]/40 dark:text-white/40" />
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="animate-in space-y-12 border-t border-[#1b1b18]/5 p-8 duration-500 fade-in slide-in-from-top-4 lg:p-10 dark:border-white/5">
                    <section className="space-y-6">
                        <div className="mb-2 flex items-center gap-3">
                            <div className="rounded-xl bg-red-600/10 p-2 text-red-600">
                                <Layout className="size-4" />
                            </div>
                            <h4 className="text-xs font-black tracking-[0.2em] text-[#1b1b18]/30 uppercase">
                                {t('dash_general_config')}
                            </h4>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label className="ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                    {t('dash_display_icon')}
                                </Label>
                                <SearchableSelect
                                    value={service.icon}
                                    onChange={(val) => onChange(index, 'icon', val)}
                                    options={Object.keys(ICON_OPTIONS).map((icon) => ({
                                        value: icon,
                                        label: icon
                                    }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                    {t('dash_sort_order')}
                                </Label>
                                <Input
                                    type="number"
                                    value={service.order}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        onChange(
                                            index,
                                            'order',
                                            parseInt(e.target.value),
                                        )
                                    }
                                    className="h-14 rounded-2xl border-none bg-[#1b1b18]/5 font-bold dark:bg-white/5"
                                />
                            </div>
                            <div className="flex items-end pb-4">
                                <label className="group flex cursor-pointer items-center gap-3">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={service.is_active}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                onChange(
                                                    index,
                                                    'is_active',
                                                    e.target.checked,
                                                )
                                            }
                                            className="sr-only"
                                        />
                                        <div
                                            className={`h-8 w-14 rounded-full transition-colors duration-300 ${service.is_active ? 'bg-green-500' : 'bg-[#1b1b18]/10'}`}
                                        />
                                        <div
                                            className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${service.is_active ? 'translate-x-6' : ''}`}
                                        />
                                    </div>
                                    <span className="text-xs font-black tracking-widest text-[#1b1b18]/60 uppercase transition-colors group-hover:text-red-600 dark:text-white/60">
                                        {t('dash_visible_on_landing')}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-red-600/10 p-2 text-red-600">
                                <Globe className="size-4" />
                            </div>
                            <h4 className="text-xs font-black tracking-[0.2em] text-[#1b1b18]/30 uppercase">
                                {t('dash_multilingual_content')}
                            </h4>
                        </div>

                        <div className="space-y-10">
                            <div className="grid grid-cols-1 gap-8 rounded-4xl border border-[#1b1b18]/5 bg-[#1b1b18]/2 p-6 md:grid-cols-2 dark:border-white/5 dark:bg-white/2">
                                <div className="space-y-3">
                                    <div className="ml-1 flex items-center gap-2">
                                        <div className="flex size-4 items-center justify-center rounded-full bg-[#1b1b18]/10 text-[8px] font-bold dark:bg-white/10">
                                            ID
                                        </div>
                                        <Label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                            {t('dash_col_car')}
                                        </Label>
                                    </div>
                                    <Input
                                        value={service.title_id}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>,
                                        ) =>
                                            onChange(
                                                index,
                                                'title_id',
                                                e.target.value,
                                            )
                                        }
                                        className="h-14 rounded-2xl border-[#1b1b18]/10 bg-white font-bold dark:border-white/10 dark:bg-[#0a0a0a]"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="ml-1 flex items-center gap-2">
                                        <div className="flex size-4 items-center justify-center rounded-full bg-[#1b1b18]/10 text-[8px] font-bold dark:bg-white/10">
                                            EN
                                        </div>
                                        <Label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                            {t('dash_col_car')}
                                        </Label>
                                    </div>
                                    <Input
                                        value={service.title_en}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>,
                                        ) =>
                                            onChange(
                                                index,
                                                'title_en',
                                                e.target.value,
                                            )
                                        }
                                        className="h-14 rounded-2xl border-[#1b1b18]/10 bg-white font-bold dark:border-white/10 dark:bg-[#0a0a0a]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <div className="space-y-3">
                                    <Label className="ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                        {t('dash_card_summary_id')}
                                    </Label>
                                    <Textarea
                                        value={service.description_id}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>,
                                        ) =>
                                            onChange(
                                                index,
                                                'description_id',
                                                e.target.value,
                                            )
                                        }
                                        className="min-h-[120px] rounded-4xl border-[#1b1b18]/10 bg-white p-5 text-sm dark:border-white/10 dark:bg-[#0a0a0a]"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                        {t('dash_card_summary_en')}
                                    </Label>
                                    <Textarea
                                        value={service.description_en}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLTextAreaElement>,
                                        ) =>
                                            onChange(
                                                index,
                                                'description_en',
                                                e.target.value,
                                            )
                                        }
                                        className="min-h-[120px] rounded-4xl border-[#1b1b18]/10 bg-white p-5 text-sm dark:border-white/10 dark:bg-[#0a0a0a]"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-red-600/10 p-2 text-red-600">
                                <ImageIcon className="size-4" />
                            </div>
                            <h4 className="text-xs font-black tracking-[0.2em] text-[#1b1b18]/30 uppercase">
                                {t('dash_visual_assets')}
                            </h4>
                        </div>

                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                            <div className="space-y-4">
                                <Label className="ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                    {t('dash_upload_new_image')}
                                </Label>
                                <div
                                    className="group relative flex h-64 cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-4xl border-2 border-dashed border-[#1b1b18]/10 bg-[#1b1b18]/2 transition-colors hover:border-red-600/30 dark:border-white/10 dark:bg-white/2"
                                    onClick={() =>
                                        document
                                            .getElementById(`file-${index}`)
                                            ?.click()
                                    }
                                >
                                    <input
                                        type="file"
                                        id={`file-${index}`}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>,
                                        ) => {
                                            const file = e.target.files?.[0];
                                            if (file)
                                                onChange(
                                                    index,
                                                    'image_file',
                                                    file,
                                                );
                                        }}
                                    />
                                    <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-[#1b1b18]/40 shadow-sm transition-transform group-hover:scale-110 dark:bg-white/5">
                                        <Upload className="size-5" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-black tracking-widest text-[#1b1b18] uppercase dark:text-white">
                                            {t('dash_click_to_upload')}
                                        </p>
                                        <p className="mt-1 text-[10px] tracking-widest text-[#1b1b18]/40 uppercase">
                                            PNG, JPG up to 5MB
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                    {t('dash_current_preview')}
                                </Label>
                                <div className="flex h-64 items-center justify-center overflow-hidden rounded-4xl border border-[#1b1b18]/5 bg-[#1b1b18]/5 dark:border-white/5 dark:bg-white/5">
                                    {service.image_file ? (
                                        <img
                                            src={URL.createObjectURL(
                                                service.image_file,
                                            )}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : service.image_url ? (
                                        <img
                                            src={service.image_url}
                                            alt="Current"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full flex-col items-center justify-center text-[#1b1b18]/20">
                                            <ImageIcon className="mb-2 size-10" />
                                            <span className="text-[10px] font-black tracking-widest uppercase">
                                                No image selected
                                            </span>
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
    const [confirmRemoveId, setConfirmRemoveId] = useState<number | string | null>(null);
    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        services: initialServices,
    });

    const handleServiceChange = (
        index: number,
        field: keyof ServiceItem,
        value: any,
    ) => {
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
            image_url: null,
            order: data.services.length,
            is_active: true,
        };
        setData('services', [...data.services, newService]);
        setExpandedId(newService.id);
    };

    const removeService = (id: number | string) => {
        if (confirmRemoveId !== id) {
            setConfirmRemoveId(id);
            return;
        }

        setData(
            'services',
            data.services.filter((s) => s.id !== id),
        );
        setConfirmRemoveId(null);
    };

    const handleReorder = (newOrder: ServiceItem[]) => {
        const updated = newOrder.map((s, i) => ({ ...s, order: i }));
        setData('services', updated);
    };

    const submit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        patch('/admin/landing-services', {
            onSuccess: () =>
                toast.success(t('dash_services_settings') + ' updated'),
            onError: () => toast.error('Failed to update services'),
        });
    };

    return (
        <div className="mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
            <Head title={t('dash_services_settings')} />

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                        Landing Page{' '}
                        <span className="text-red-600">Services</span>
                    </h1>
                    <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">
                        {t('dash_services_desc')}
                    </p>
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
                        className="flex h-12 items-center gap-2 rounded-full bg-red-600 px-8 text-sm font-black tracking-widest text-white uppercase shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 active:scale-95 disabled:opacity-50"
                    >
                        {processing ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Save className="size-4" />
                        )}
                        {t('dash_save_changes')}
                    </button>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <Reorder.Group
                    axis="y"
                    values={data.services}
                    onReorder={handleReorder}
                    className="grid grid-cols-1 gap-4"
                >
                    {data.services.map((service, index) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            index={index}
                            isExpanded={expandedId === service.id}
                            onToggle={() =>
                                setExpandedId(
                                    expandedId === service.id
                                        ? null
                                        : service.id,
                                )
                            }
                            onChange={handleServiceChange}
                            onRemove={removeService}
                            t={t}
                        />
                    ))}
                </Reorder.Group>

                <div className="pointer-events-none sticky bottom-6 flex items-center justify-center pt-8">
                    <Button
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
                              ? t('dash_saved_success')
                              : t('dash_update_all')}
                    </Button>
                </div>
            </form>

            <Dialog open={confirmRemoveId !== null} onOpenChange={() => setConfirmRemoveId(null)}>
                <DialogContent className="rounded-4xl border-none p-8 dark:bg-[#121212]">
                    <DialogHeader className="space-y-4">
                        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-red-500/10 text-red-600">
                            <Trash2 className="size-10" />
                        </div>
                        <div className="space-y-2 text-center">
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight">
                                {t('dash_confirm_delete') || 'Hapus Layanan?'}
                            </DialogTitle>
                            <DialogDescription className="text-sm font-medium text-[#1b1b18]/50 dark:text-white/50">
                                Apakah Anda yakin ingin menghapus layanan ini? Tindakan ini hanya akan menghapus dari daftar sementara sebelum Anda menekan "Simpan Semua Perubahan".
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <DialogFooter className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => setConfirmRemoveId(null)}
                            className="h-12 flex-1 rounded-2xl font-bold uppercase tracking-widest"
                        >
                            {t('dash_cancel') || 'Batal'}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => confirmRemoveId && removeService(confirmRemoveId)}
                            className="h-12 flex-1 rounded-2xl bg-red-600 font-black uppercase tracking-widest shadow-lg shadow-red-600/20 hover:bg-red-700"
                        >
                            {t('dash_confirm_delete') ? 'Ya, Hapus' : 'Ya, Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
