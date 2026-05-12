import { Head, Link, usePage } from '@inertiajs/react';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Menu, MapPin, Phone, User, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import AppLogo from '@/components/app-logo';
import AppearanceToggleTab from '@/components/appearance-tabs';
import { useLanguage } from '@/hooks/use-language';
import { dashboard, login, register } from '@/routes';

interface Sparepart {
    id: number;
    nama_sparepart: string;
    tipe_sparepart: string;
    image_url: string | null;
}

interface Props {
    auth: any;
    spareparts: Sparepart[];
}

export default function Spareparts({ auth, spareparts = [] }: Props) {
    const { t, language, setLanguage } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

    // Form state
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [address, setAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rows, setRows] = useState([{ id: Date.now().toString(), partId: '' }]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const validRows = rows.filter(r => r.partId !== '');
        if (validRows.length === 0) {
            alert('Please select at least one sparepart.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/spareparts/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
                },
                body: JSON.stringify({
                    customer_name: customerName,
                    customer_phone: customerPhone,
                    address: address,
                    items: validRows.map(r => ({ partId: r.partId, jumlah: 1 }))
                })
            });

            const data = await response.json();

            if (data.success && data.wa_url) {
                window.location.href = data.wa_url;
            } else {
                alert('Failed to submit order. Please try again.');
            }
        } catch (error) {
            console.error('Failed to submit order:', error);
            alert('Failed to submit order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const addRow = () => {
        setRows([...rows, { id: Date.now().toString(), partId: '' }]);
    };

    const removeRow = (idToRemove: string) => {
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== idToRemove));
        }
    };

    const updateRow = (idToUpdate: string, newPartId: string) => {
        setRows(rows.map(row => row.id === idToUpdate ? { ...row, partId: newPartId } : row));
    };

    const handleImageClick = (partId: string) => {
        const isSelected = rows.some(row => row.partId === partId);

        if (isSelected) {
            // Remove the part if it's currently selected
            const rowWithPart = rows.find(r => r.partId === partId);
            if (rowWithPart) {
                if (rows.length > 1) {
                    removeRow(rowWithPart.id);
                } else {
                    updateRow(rowWithPart.id, ''); // Just clear it if it's the last row
                }
            }
        } else {
            // Check if there's an empty row
            const emptyRow = rows.find(row => row.partId === '');
            if (emptyRow) {
                updateRow(emptyRow.id, partId);
            } else {
                setRows([...rows, { id: Date.now().toString(), partId }]);
            }
        }
    };

    return (
        <LazyMotion features={domAnimation}>
            <Head title="Buy Spareparts - Diva AC" />
            <div className="min-h-screen bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC] selection:bg-red-600 selection:text-white pb-24">
                
                {/* Header - Reuse Booking Header structure */}
                <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-white/50 dark:bg-black/50 border-b border-[#1b1b18]/10 dark:border-white/10">
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/" 
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1b1b18]/5 hover:bg-[#1b1b18]/10 dark:bg-white/5 dark:hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft className="size-5" />
                        </Link>
                        <AppLogo />
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-4">
                            <AnimatePresence mode="wait">
                                {isDesktopMenuOpen && (
                                    <m.div
                                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: 50, scale: 0.9 }}
                                        className="flex items-center gap-4"
                                    >
                                        {/* Language Switcher */}
                                        <div className="flex items-center gap-1 rounded-full bg-[#1b1b18]/5 p-1 backdrop-blur-md border border-[#1b1b18]/10 dark:bg-white/10 dark:border-white/20">
                                            <button 
                                                onClick={() => setLanguage('id')}
                                                className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${language === 'id' ? 'bg-red-600 text-white shadow-lg' : 'text-[#1b1b18]/60 hover:text-[#1b1b18] hover:bg-[#1b1b18]/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/10'}`}
                                            >
                                                ID
                                            </button>
                                            <button 
                                                onClick={() => setLanguage('en')}
                                                className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${language === 'en' ? 'bg-red-600 text-white shadow-lg' : 'text-[#1b1b18]/60 hover:text-[#1b1b18] hover:bg-[#1b1b18]/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/10'}`}
                                            >
                                                EN
                                            </button>
                                        </div>

                                        <AppearanceToggleTab />
                                        
                                        {auth.user ? (
                                            <Link
                                                href="/admin/dashboard"
                                                className="inline-flex h-10 items-center justify-center rounded-full bg-[#1b1b18]/5 px-6 text-sm font-medium text-[#1b1b18] backdrop-blur-md transition-all hover:bg-[#1b1b18]/10 border border-[#1b1b18]/10 dark:bg-white/10 dark:text-white dark:border-white/20 dark:hover:bg-white/20"
                                            >
                                                {t('dashboard')}
                                            </Link>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={login()}
                                                    className="inline-flex h-10 items-center justify-center rounded-full border border-[#1b1b18]/20 bg-transparent px-4 text-sm font-bold text-[#1b1b18] transition-all hover:bg-[#1b1b18]/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                                                >
                                                    {t('login')}
                                                </Link>
                                                <Link
                                                    href={register()}
                                                    className="inline-flex h-10 items-center justify-center rounded-full bg-red-600 px-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-red-700"
                                                >
                                                    {t('register')}
                                                </Link>
                                            </div>
                                        )}
                                    </m.div>
                                )}
                            </AnimatePresence>

                            <button 
                                onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                                className={`relative z-50 flex h-12 w-12 shrink-0 items-center justify-center rounded-full backdrop-blur-md border shadow-xl transition-all active:scale-95 ${isDesktopMenuOpen ? 'bg-red-600 text-white border-red-600' : 'bg-[#1b1b18]/5 border-[#1b1b18]/10 text-[#1b1b18] hover:bg-[#1b1b18]/10 dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/20'}`}
                            >
                                <Menu className={`size-6 transition-transform ${isDesktopMenuOpen ? 'rotate-90' : ''}`} />
                            </button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="lg:hidden flex flex-col items-end gap-2 relative">
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`relative z-50 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md border shadow-xl transition-all active:scale-95 ${isMenuOpen ? 'bg-red-600 text-white border-red-600' : 'bg-[#1b1b18]/5 border-[#1b1b18]/10 text-[#1b1b18] hover:bg-[#1b1b18]/10 dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/20'}`}
                            >
                                <Menu className={`size-6 transition-transform ${isMenuOpen ? 'rotate-90' : ''}`} />
                            </button>
                            
                            <AnimatePresence>
                                {isMenuOpen && (
                                    <m.div
                                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                        className="absolute top-16 right-0 flex flex-col gap-4 rounded-3xl border border-white/20 bg-white/50 p-6 backdrop-blur-xl dark:bg-black/50 min-w-[220px] shadow-2xl"
                                    >
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 mb-2">{t('language')}</span>
                                            <div className="flex items-center gap-1 rounded-full bg-[#1b1b18]/5 p-1 border border-[#1b1b18]/10 dark:bg-white/5 dark:border-white/10">
                                                <button 
                                                    onClick={() => setLanguage('id')}
                                                    className={`flex-1 px-3 py-2 text-xs font-bold rounded-xl transition-all ${language === 'id' ? 'bg-red-600 text-white shadow-md' : 'text-[#1b1b18]/60 hover:text-[#1b1b18] hover:bg-[#1b1b18]/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/10'}`}
                                                >
                                                    Indonesia
                                                </button>
                                                <button 
                                                    onClick={() => setLanguage('en')}
                                                    className={`flex-1 px-3 py-2 text-xs font-bold rounded-xl transition-all ${language === 'en' ? 'bg-red-600 text-white shadow-md' : 'text-[#1b1b18]/60 hover:text-[#1b1b18] hover:bg-[#1b1b18]/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/10'}`}
                                                >
                                                    English
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 mb-2">{t('appearance')}</span>
                                            <AppearanceToggleTab />
                                        </div>
                                        
                                        <div className="h-px w-full bg-[#1b1b18]/10 dark:bg-white/10" />
                                        
                                        <div className="flex flex-col gap-3">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1b1b18]/40 dark:text-white/40 mb-1">{t('account')}</span>
                                            {auth.user ? (
                                                <Link
                                                    href="/admin/dashboard"
                                                    className="block rounded-xl bg-[#1b1b18]/5 px-4 py-2 text-sm font-medium text-[#1b1b18] transition-all hover:bg-[#1b1b18]/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                                                >
                                                    {t('dashboard')}
                                                </Link>
                                            ) : (
                                                <>
                                                    <Link
                                                        href={login()}
                                                        className="block rounded-xl border border-[#1b1b18]/20 px-4 py-2 text-center text-sm font-bold text-[#1b1b18] transition-all hover:bg-[#1b1b18]/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                                                    >
                                                        {t('login')}
                                                    </Link>
                                                    <Link
                                                        href={register()}
                                                        className="block rounded-xl bg-red-600 px-4 py-2 text-center text-sm font-bold text-white shadow-lg transition-all hover:bg-red-700"
                                                    >
                                                        {t('register')}
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                    </m.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="pt-28 px-6 max-w-7xl mx-auto">
                    <m.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 text-center"
                    >
                        <h1 className="text-3xl font-black uppercase tracking-tight sm:text-5xl">
                            {t('spareparts_page_title')}
                        </h1>
                        <p className="mt-4 text-[#1b1b18]/60 dark:text-white/60 max-w-2xl mx-auto">
                            {t('spareparts_page_subtitle')}
                        </p>
                    </m.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
                        {/* Left Side: Interactive Visual Grid */}
                        <m.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-6"
                        >
                            <h2 className="text-xl font-bold uppercase tracking-wider">{t('select_sparepart')}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {spareparts.map((part) => {
                                    const isSelected = rows.some(r => r.partId === String(part.id));
                                    return (
                                        <button
                                            key={part.id}
                                            type="button"
                                            onClick={() => handleImageClick(String(part.id))}
                                            className={`relative aspect-square overflow-hidden rounded-3xl transition-all duration-300 ${isSelected ? 'ring-4 ring-red-600 scale-[0.98] shadow-lg' : 'hover:scale-[1.02] hover:shadow-xl'}`}
                                        >
                                            <img src={part.image_url || '/img/placeholder.jpg'} alt={part.nama_sparepart} className="w-full h-full object-cover" />
                                            <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`} />
                                            {isSelected && (
                                                <div className="absolute top-4 right-4 bg-red-600 text-white rounded-full p-1 shadow-lg">
                                                    <CheckCircle2 className="size-6" />
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent">
                                                <p className="text-white font-bold text-sm">{part.nama_sparepart}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </m.div>

                        {/* Right Side: Form */}
                        <m.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-3xl border border-[#1b1b18]/10 bg-white/50 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-black/50 sm:p-10 shadow-2xl h-fit"
                        >
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1b1b18]/70 dark:text-white/70">
                                            <User className="size-4" />
                                            <span>{t('name')}</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            required
                                            className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-3 text-[#1b1b18] placeholder:text-[#1b1b18]/30 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 dark:border-white/20 dark:text-white dark:placeholder:text-white/30"
                                            placeholder={t('booking_placeholder_name')}
                                            value={customerName}
                                            onChange={e => setCustomerName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1b1b18]/70 dark:text-white/70">
                                            <Phone className="size-4" />
                                            <span>{t('phone')}</span>
                                        </label>
                                        <input 
                                            type="tel" 
                                            required
                                            className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-3 text-[#1b1b18] placeholder:text-[#1b1b18]/30 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 dark:border-white/20 dark:text-white dark:placeholder:text-white/30"
                                            placeholder={t('booking_placeholder_phone')}
                                            value={customerPhone}
                                            onChange={e => setCustomerPhone(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#1b1b18]/70 dark:text-white/70">{t('select_sparepart')}</h3>
                                    
                                    <AnimatePresence>
                                        {rows.map((row) => (
                                            <m.div 
                                                key={row.id}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="flex items-center gap-3"
                                            >
                                                <select 
                                                    value={row.partId}
                                                    onChange={(e) => updateRow(row.id, e.target.value)}
                                                    required
                                                    className="flex-1 rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-3 text-[#1b1b18] focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 dark:border-white/20 dark:text-white [&>option]:dark:bg-zinc-900"
                                                >
                                                    <option value="" disabled>{t('select_sparepart')}</option>
                                                    {spareparts.map(part => (
                                                        <option key={part.id} value={part.id}>{part.nama_sparepart}</option>
                                                    ))}
                                                </select>
                                                
                                                {rows.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRow(row.id)}
                                                        className="p-3 text-red-600 hover:bg-red-600/10 rounded-xl transition-colors shrink-0"
                                                        title={t('remove')}
                                                    >
                                                        <Trash2 className="size-5" />
                                                    </button>
                                                )}
                                            </m.div>
                                        ))}
                                    </AnimatePresence>
                                    
                                    <button
                                        type="button"
                                        onClick={addRow}
                                        className="flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
                                    >
                                        <Plus className="size-4" />
                                        <span>{t('add_more_spareparts')}</span>
                                    </button>
                                </div>

                                <div className="space-y-2 pt-4">
                                    <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1b1b18]/70 dark:text-white/70">
                                        <MapPin className="size-4" />
                                        <span>{t('form_address')}</span>
                                    </label>
                                    <textarea 
                                        required
                                        rows={3}
                                        className="w-full rounded-xl border border-[#1b1b18]/20 bg-transparent px-4 py-3 text-[#1b1b18] placeholder:text-[#1b1b18]/30 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 dark:border-white/20 dark:text-white dark:placeholder:text-white/30"
                                        placeholder={t('address_placeholder')}
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                    ></textarea>
                                </div>

                                <m.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-4 font-bold text-white transition-all hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Loading...' : t('confirm_purchase')}
                                </m.button>
                            </form>
                        </m.div>
                    </div>
                </main>
            </div>
        </LazyMotion>
    );
}
