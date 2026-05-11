import { Head, useForm, router } from '@inertiajs/react';
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Plus, Trash2, X, Upload, CheckCircle2, Loader2, Edit2, Save } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/hooks/use-language';

interface GalleryItem {
    id: number;
    image_path: string;
    image_url: string;
    title: string | null;
    description: string | null;
    order: number;
    created_at: string;
}

interface Props {
    images: GalleryItem[];
}

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

export default function GalleryManager({ images }: Props) {
    const { t } = useLanguage();
    const [isUploading, setIsUploading] = useState(false);
    const [editingImage, setEditingImage] = useState<GalleryItem | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const { data, setData, post, patch, processing, reset } = useForm({
        image: null as File | null,
        title: '',
        description: '',
    });

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/gallery', {
            onSuccess: () => {
                toast.success('Image uploaded successfully');
                setIsUploading(false);
                reset();
            },
            onError: () => toast.error('Failed to upload image'),
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingImage) return;

        patch(`/admin/gallery/${editingImage.id}`, {
            onSuccess: () => {
                toast.success('Image updated successfully');
                setEditingImage(null);
                reset();
            },
            onError: () => toast.error('Failed to update image'),
        });
    };

    const startEditing = (img: GalleryItem) => {
        setEditingImage(img);
        setData({
            image: null,
            title: img.title || '',
            description: img.description || '',
        });
    };

    const handleDelete = (id: number) => {
        if (confirm(t('dash_confirm_delete'))) {
            router.delete(`/admin/gallery/${id}`, {
                onSuccess: () => toast.success('Image deleted successfully'),
                onError: () => toast.error('Failed to delete image'),
            });
        }
    };

    return (
        <LazyMotion features={domAnimation}>
            <Head title={t('dash_gallery_manager')} />

            <m.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="flex flex-col gap-8 p-6 lg:p-8"
            >
                <m.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] dark:text-white uppercase">
                            Gallery <span className="text-red-600">Manager</span>
                        </h1>
                        <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">{t('dash_gallery_desc')}</p>
                    </div>

                    <button 
                        onClick={() => { reset(); setIsUploading(true); }}
                        className="flex h-10 items-center gap-2 rounded-full bg-red-600 px-6 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 active:scale-95"
                    >
                        <Plus className="size-4" />
                        {t('dash_add_new')}
                    </button>
                </m.div>

                {images.length === 0 ? (
                    <m.div variants={itemVariants} className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="size-20 rounded-full bg-[#1b1b18]/5 dark:bg-white/5 flex items-center justify-center mb-4">
                            <ImageIcon className="size-10 text-[#1b1b18]/20 dark:text-white/20" />
                        </div>
                        <p className="text-[#1b1b18]/40 dark:text-white/40 font-bold uppercase tracking-widest text-xs">{t('dash_no_images')}</p>
                    </m.div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {images.map((img) => (
                            <m.div
                                key={img.id}
                                variants={itemVariants}
                                layout
                                className="group relative overflow-hidden rounded-3xl border border-[#1b1b18]/5 bg-white shadow-sm transition-all hover:shadow-xl dark:border-white/5 dark:bg-[#121212]"
                            >
                                <div className="aspect-video relative overflow-hidden bg-[#1b1b18]/5 dark:bg-white/5">
                                    <img 
                                        src={img.image_url} 
                                        alt={img.title || ''} 
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <button 
                                            onClick={() => startEditing(img)}
                                            className="size-12 rounded-full bg-white text-[#1b1b18] flex items-center justify-center shadow-lg hover:bg-red-600 hover:text-white transition-colors"
                                        >
                                            <Edit2 className="size-5" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(img.id)}
                                            className="size-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors"
                                        >
                                            <Trash2 className="size-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <p className="text-sm font-bold text-[#1b1b18] dark:text-white uppercase truncate">
                                            {img.title || `Image #${img.id}`}
                                        </p>
                                        <p className="text-[10px] text-[#1b1b18]/40 dark:text-white/40 uppercase tracking-widest">
                                            Added {new Date(img.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </m.div>
                        ))}
                    </div>
                )}
            </m.div>

            {/* Upload Modal */}
            <AnimatePresence>
                {isUploading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsUploading(false)}
                            className="absolute inset-0 bg-[#1b1b18]/80 backdrop-blur-sm"
                        />
                        <m.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl dark:bg-[#121212]"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-black uppercase tracking-tight text-[#1b1b18] dark:text-white">
                                    {t('dash_add_info')} <span className="text-red-600">Image</span>
                                </h2>
                                <button 
                                    onClick={() => setIsUploading(false)}
                                    className="rounded-full p-2 text-[#1b1b18]/40 hover:bg-[#1b1b18]/5 dark:text-white/40 dark:hover:bg-white/5"
                                >
                                    <X className="size-6" />
                                </button>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">{t('dash_upload_photo')}</label>
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`relative aspect-video cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed transition-all ${data.image ? 'border-green-500/50 bg-green-500/5' : 'border-[#1b1b18]/10 hover:border-red-600/50 dark:border-white/10'}`}
                                    >
                                        <input 
                                            type="file" 
                                            ref={fileInputRef}
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                        />
                                        {data.image ? (
                                            <div className="flex h-full flex-col items-center justify-center gap-2">
                                                <CheckCircle2 className="size-10 text-green-500" />
                                                <p className="text-xs font-bold text-green-600">{data.image.name}</p>
                                            </div>
                                        ) : (
                                            <div className="flex h-full flex-col items-center justify-center gap-2 text-[#1b1b18]/40">
                                                <Upload className="size-10" />
                                                <p className="text-xs font-bold uppercase tracking-widest">Click to browse</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">{t('auth_name')} ({t('dash_filter_all')})</label>
                                    <input 
                                        type="text" 
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="w-full rounded-2xl border border-[#1b1b18]/10 bg-[#1b1b18]/5 px-4 py-3 text-sm font-bold focus:border-red-600 focus:ring-0 dark:border-white/10 dark:bg-white/5"
                                        placeholder="e.g. Workshop Front View"
                                    />
                                </div>

                                <button 
                                    disabled={processing || !data.image}
                                    className="flex w-full h-14 items-center justify-center gap-2 rounded-2xl bg-red-600 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-red-600/20 transition-all hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <Loader2 className="size-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Upload className="size-5" />
                                            {t('dash_upload_photo')}
                                        </>
                                    )}
                                </button>
                            </form>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingImage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingImage(null)}
                            className="absolute inset-0 bg-[#1b1b18]/80 backdrop-blur-sm"
                        />
                        <m.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg overflow-hidden rounded-4xl bg-white p-8 shadow-2xl dark:bg-[#121212]"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-black uppercase tracking-tight text-[#1b1b18] dark:text-white">
                                    {t('dash_edit_info')} <span className="text-red-600">Info</span>
                                </h2>
                                <button 
                                    onClick={() => setEditingImage(null)}
                                    className="rounded-full p-2 text-[#1b1b18]/40 hover:bg-[#1b1b18]/5 dark:text-white/40 dark:hover:bg-white/5"
                                >
                                    <X className="size-6" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">Preview</label>
                                    <div className="aspect-video overflow-hidden rounded-3xl bg-[#1b1b18]/5 dark:bg-white/5">
                                        <img 
                                            src={`/storage/${editingImage.image_path}`} 
                                            alt={editingImage.title || ''} 
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#1b1b18]/40">{t('auth_name')}</label>
                                    <input 
                                        type="text" 
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="w-full rounded-2xl border border-[#1b1b18]/10 bg-[#1b1b18]/5 px-4 py-3 text-sm font-bold focus:border-red-600 focus:ring-0 dark:border-white/10 dark:bg-white/5"
                                        placeholder="e.g. Workshop Front View"
                                    />
                                </div>

                                <button 
                                    disabled={processing}
                                    className="flex w-full h-14 items-center justify-center gap-2 rounded-2xl bg-[#1b1b18] text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-black dark:bg-white dark:text-[#1b1b18] disabled:opacity-50"
                                >
                                    {processing ? (
                                        <Loader2 className="size-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="size-5" />
                                            {t('dash_save_changes')}
                                        </>
                                    )}
                                </button>
                            </form>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>
        </LazyMotion>
    );
}
