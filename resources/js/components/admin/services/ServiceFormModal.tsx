import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Loader2, Wrench, PlusCircle, Trash, Package } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useLanguage } from '@/hooks/use-language';
import { ModalShell } from '@/components/ui/ModalShell';
import { Service, Mobil, Mekanik, Sparepart, User } from '@/types/admin';

interface ServiceFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingService: Service | null;
    mobils: Mobil[];
    mekaniks: Mekanik[];
    spareparts: Sparepart[];
    users: User[];
}

type LineItem = {
    type: 'jasa' | 'sparepart';
    id?: number;
    name: string;
    qty: number;
    price: number;
};

export function ServiceFormModal({
    isOpen,
    onClose,
    editingService,
    mobils,
    mekaniks,
    spareparts,
    users,
}: ServiceFormModalProps) {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing');

    const [lineItems, setLineItems] = useState<LineItem[]>([]);

    const { data, setData, post, put, processing, errors, reset, clearErrors, isDirty } = useForm({
        id_mobil: '',
        id_pelanggan: 'new',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        no_polisi: '',
        merk: '',
        tipe: '',
        warna: '',
        id_mekanik: '',
        tanggal_service: new Date().toISOString().split('T')[0],
        tipe_service: '',
        harga_service: '',
        status_service: '',
        catatan: '',
        spareparts: [] as any[],
        jasas: [] as any[],
    });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            if (editingService) {
                setActiveTab('existing');
                
                const initialLines: LineItem[] = [];
                if (editingService.jasas && editingService.jasas.length > 0) {
                    editingService.jasas.forEach((j: any) => {
                        initialLines.push({
                            type: 'jasa',
                            name: j.nama_jasa,
                            qty: 1,
                            price: Number(j.harga_jasa)
                        });
                    });
                } else if (editingService.tipe_service) {
                    const parts = editingService.tipe_service.split(',').map(s => s.trim()).filter(Boolean);
                    if (parts.length > 0) {
                        initialLines.push({
                            type: 'jasa',
                            name: parts[0],
                            qty: 1,
                            price: Number(editingService.harga_service || 0)
                        });
                        for (let i = 1; i < parts.length; i++) {
                            initialLines.push({
                                type: 'jasa',
                                name: parts[i],
                                qty: 1,
                                price: 0
                            });
                        }
                    } else {
                        initialLines.push({
                            type: 'jasa',
                            name: editingService.tipe_service,
                            qty: 1,
                            price: Number(editingService.harga_service || 0)
                        });
                    }
                }
                if (editingService.spareparts) {
                    editingService.spareparts.forEach(sp => {
                        initialLines.push({
                            type: 'sparepart',
                            id: sp.id,
                            name: sp.nama_sparepart,
                            qty: sp.pivot?.jumlah || 1,
                            price: Number(sp.pivot?.harga_satuan || sp.harga_sparepart)
                        });
                    });
                }
                
                setLineItems(initialLines);

                setData({
                    id_mobil: editingService.id_mobil.toString(),
                    id_pelanggan: 'new',
                    customer_name: '',
                    customer_email: '',
                    customer_phone: '',
                    no_polisi: '',
                    merk: '',
                    tipe: '',
                    warna: '',
                    id_mekanik: editingService.id_mekanik.toString(),
                    tanggal_service: editingService.tanggal_service.split('T')[0],
                    tipe_service: editingService.tipe_service,
                    harga_service: editingService.harga_service.toString(),
                    status_service: editingService.status_service,
                    catatan: editingService.catatan || '',
                    spareparts: [],
                    jasas: []
                });
            } else {
                setActiveTab('existing');
                setLineItems([]);
                reset();
            }
        }
    }, [isOpen, editingService]);

    const handleClose = () => {
        if (isDirty) {
            if (window.confirm(t('confirm_unsaved_changes') || 'Anda memiliki perubahan yang belum disimpan. Yakin ingin menutup?')) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    useEffect(() => {
        const jasas = lineItems.filter(li => li.type === 'jasa');
        const sps = lineItems.filter(li => li.type === 'sparepart');
        
        const combinedTipeService = jasas.map(j => j.name).filter(Boolean).join(', ');
        const totalHargaService = jasas.reduce((sum, j) => sum + (Number(j.price) * Number(j.qty)), 0);
        
        const mappedSpareparts = sps.map(sp => ({
            id: sp.id,
            jumlah: Number(sp.qty),
            harga_satuan: Number(sp.price),
            nama_sparepart: sp.name
        }));

        const mappedJasas = jasas.map(j => ({
            nama_jasa: j.name,
            harga_jasa: Number(j.price)
        }));

        setData(prev => ({
            ...prev,
            tipe_service: combinedTipeService,
            harga_service: totalHargaService.toString(),
            spareparts: mappedSpareparts,
            jasas: mappedJasas
        }));
    }, [lineItems]);

    const addJasa = () => {
        setLineItems([...lineItems, { type: 'jasa', name: '', qty: 1, price: 0 }]);
    };

    const addSparepart = () => {
        if (spareparts.length === 0) return;
        const sp = spareparts[0];
        setLineItems([...lineItems, {
            type: 'sparepart',
            id: sp.id,
            name: sp.nama_sparepart,
            qty: 1,
            price: Number(sp.harga_sparepart)
        }]);
    };

    const updateLineItem = (index: number, field: string, value: any) => {
        const newItems = [...lineItems];
        const item = newItems[index];
        
        if (item.type === 'sparepart' && field === 'id') {
            const sp = spareparts.find(s => s.id === Number(value));
            if (sp) {
                item.id = sp.id;
                item.name = sp.nama_sparepart;
                item.price = Number(sp.harga_sparepart);
            }
        } else {
            (item as any)[field] = value;
        }
        setLineItems(newItems);
    };

    const removeLineItem = (index: number) => {
        const newItems = [...lineItems];
        newItems.splice(index, 1);
        setLineItems(newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!data.tipe_service) {
            toast.error('Tipe Service wajib diisi (Minimal 1 Jasa)');
            return;
        }

        if (editingService) {
            put(`/admin/services/${editingService.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                    toast.success('Service updated successfully');
                    reset();
                },
            });
        } else {
            const url = activeTab === 'new' ? '/admin/services/with-car' : '/admin/services';
            post(url, {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                    toast.success('Service created successfully');
                    reset();
                },
            });
        }
    };

    const totalHarga =
        Number(data.harga_service || 0) +
        data.spareparts.reduce(
            (sum, sp) => sum + Number(sp.jumlah) * Number(sp.harga_satuan),
            0
        );

    return (
        <ModalShell isDirty={isDirty} isOpen={isOpen} onClose={onClose} maxWidth="max-w-7xl">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                    {editingService ? t('dash_edit_order') : t('dash_new_service')}
                </h2>
                <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-full p-2 transition-colors hover:bg-[#1b1b18]/10 dark:hover:bg-white/10 text-[#1b1b18] dark:text-white"
                >
                    <X className="size-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Left Column: Basic Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {!editingService && (
                            <div className="flex rounded-2xl bg-[#1b1b18]/5 p-1 dark:bg-white/5">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('existing')}
                                    className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                                        activeTab === 'existing'
                                            ? 'bg-white text-[#1b1b18] shadow-sm dark:bg-[#1b1b18] dark:text-white'
                                            : 'text-[#1b1b18]/50 hover:text-[#1b1b18] dark:text-white/50 dark:hover:text-white'
                                    }`}
                                >
                                    Pilih Mobil
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('new')}
                                    className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                                        activeTab === 'new'
                                            ? 'bg-white text-[#1b1b18] shadow-sm dark:bg-[#1b1b18] dark:text-white'
                                            : 'text-[#1b1b18]/50 hover:text-[#1b1b18] dark:text-white/50 dark:hover:text-white'
                                    }`}
                                >
                                    Mobil Baru
                                </button>
                            </div>
                        )}

                        {activeTab === 'new' && !editingService ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 dark:text-white/60 uppercase">
                                        Pelanggan
                                    </label>
                                    <SearchableSelect
                                        value={data.id_pelanggan}
                                        onChange={(val) => setData('id_pelanggan', val)}
                                        options={[
                                            { value: 'new', label: '+ Pelanggan Baru' },
                                            ...users.map((u) => ({
                                                value: u.id.toString(),
                                                label: `${u.nama_pelanggan} (${u.email})`,
                                            })),
                                        ]}
                                    />
                                </div>

                                {data.id_pelanggan === 'new' && (
                                    <>
                                        <div className="space-y-2">
                                            <Input
                                                placeholder="Nama Pelanggan"
                                                value={data.customer_name}
                                                onChange={(e) => setData('customer_name', e.target.value)}
                                                className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                type="email"
                                                placeholder="Email"
                                                value={data.customer_email}
                                                onChange={(e) => setData('customer_email', e.target.value)}
                                                className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                placeholder="No. Telepon (Opsional)"
                                                value={data.customer_phone}
                                                onChange={(e) => setData('customer_phone', e.target.value)}
                                                className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2">
                                    <Input
                                        placeholder="Nomor Polisi"
                                        value={data.no_polisi}
                                        onChange={(e) => setData('no_polisi', e.target.value.toUpperCase())}
                                        className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5 uppercase"
                                        required
                                    />
                                    {errors.no_polisi && <span className="text-xs text-red-600">{errors.no_polisi}</span>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        placeholder="Merk"
                                        value={data.merk}
                                        onChange={(e) => setData('merk', e.target.value)}
                                        className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                        required
                                    />
                                    <Input
                                        placeholder="Tipe Mobil"
                                        value={data.tipe}
                                        onChange={(e) => setData('tipe', e.target.value)}
                                        className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                        required
                                    />
                                </div>
                                <Input
                                    placeholder="Warna (Opsional)"
                                    value={data.warna}
                                    onChange={(e) => setData('warna', e.target.value)}
                                    className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {activeTab === 'existing' || editingService ? (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 dark:text-white/60 uppercase">
                                            Mobil
                                        </label>
                                        <SearchableSelect
                                            value={data.id_mobil}
                                            onChange={(val) => setData('id_mobil', val)}
                                            placeholder="Pilih Mobil"
                                            options={mobils.map((m) => ({
                                                value: m.id.toString(),
                                                label: `${m.pelanggan?.nama_pelanggan} - ${m.merk} (${m.no_polisi})`,
                                            }))}
                                        />
                                        {errors.id_mobil && <span className="text-xs text-red-600">{errors.id_mobil}</span>}
                                    </div>
                                ) : null}
                            </div>
                        )}

                        <div className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 dark:text-white/60 uppercase">
                                    Mekanik
                                </label>
                                <SearchableSelect
                                    value={data.id_mekanik}
                                    onChange={(val) => setData('id_mekanik', val)}
                                    placeholder="Pilih Mekanik"
                                    options={mekaniks.map((m) => ({
                                        value: m.id.toString(),
                                        label: m.nama_mekanik,
                                    }))}
                                />
                                {errors.id_mekanik && <span className="text-xs text-red-600">{errors.id_mekanik}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 dark:text-white/60 uppercase">
                                    Tanggal Service
                                </label>
                                <Input
                                    type="date"
                                    value={data.tanggal_service}
                                    onChange={(e) => setData('tanggal_service', e.target.value)}
                                    className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                    required
                                />
                                {errors.tanggal_service && <span className="text-xs text-red-600">{errors.tanggal_service}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 dark:text-white/60 uppercase">
                                    Status
                                </label>
                                <SearchableSelect
                                    value={data.status_service}
                                    onChange={(val) => setData('status_service', val)}
                                    options={[
                                        { value: 'antri', label: t('dash_service_queue') },
                                        { value: 'proses', label: t('dash_service_process') },
                                        { value: 'selesai', label: t('dash_service_done') },
                                        { value: 'batal', label: t('dash_service_cancel') },
                                    ]}
                                />
                                {errors.status_service && <span className="text-xs text-red-600">{errors.status_service}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 dark:text-white/60 uppercase">
                                    Catatan Tambahan
                                </label>
                                <Input
                                    value={data.catatan}
                                    onChange={(e) => setData('catatan', e.target.value)}
                                    className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                    placeholder="Opsional"
                                />
                                {errors.catatan && <span className="text-xs text-red-600">{errors.catatan}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Invoice Editor */}
                    <div className="lg:col-span-2 sticky top-6 self-start">
                        <div className="rounded-3xl bg-[#1b1b18]/5 p-6 dark:bg-white/5 border border-[#1b1b18]/10 dark:border-white/10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black tracking-widest uppercase text-[#1b1b18] dark:text-white">
                                    Invoice & Item Service
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={addJasa}
                                        className="flex items-center gap-1 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-2 text-xs font-bold hover:bg-blue-500/20 transition-colors"
                                    >
                                        <PlusCircle className="size-4" /> Jasa
                                    </button>
                                    <button
                                        type="button"
                                        onClick={addSparepart}
                                        className="flex items-center gap-1 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-2 text-xs font-bold hover:bg-green-500/20 transition-colors"
                                    >
                                        <PlusCircle className="size-4" /> Sparepart
                                    </button>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-[#1b1b18] dark:text-white border-collapse min-w-[500px]">
                                    <thead>
                                        <tr className="border-b border-[#1b1b18]/10 dark:border-white/10 text-[10px] font-black uppercase tracking-wider text-[#1b1b18]/50 dark:text-white/50">
                                            <th className="pb-3 w-5/12 pl-2">Item</th>
                                            <th className="pb-3 text-right w-1/3">Harga Satuan</th>
                                            <th className="pb-3 text-right w-1/4">Total</th>
                                            <th className="pb-3 text-center w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#1b1b18]/5 dark:divide-white/5">
                                        {lineItems.map((item, idx) => (
                                            <tr key={idx} className="group hover:bg-[#1b1b18]/5 dark:hover:bg-white/5 transition-colors">
                                                <td className="py-3 px-2">
                                                    {item.type === 'jasa' ? (
                                                        <div className="flex flex-col gap-1">
                                                            <Input 
                                                                placeholder="Nama Jasa..."
                                                                value={item.name}
                                                                onChange={(e) => updateLineItem(idx, 'name', e.target.value)}
                                                                className="h-9 text-sm rounded-xl border-transparent bg-white dark:bg-[#121212] shadow-sm"
                                                            />
                                                            <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest ml-1">Jasa</div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col gap-1">
                                                            <SearchableSelect
                                                                value={item.id?.toString() || ''}
                                                                onChange={(val) => updateLineItem(idx, 'id', val)}
                                                                placeholder="Pilih Sparepart"
                                                                options={spareparts.map((part) => ({
                                                                    value: part.id.toString(),
                                                                    label: part.nama_sparepart,
                                                                }))}
                                                            />
                                                            <div className="flex items-center gap-2 ml-1 mt-1">
                                                                <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Part</span>
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-xs text-[#1b1b18]/50 dark:text-white/50">Qty:</span>
                                                                    <Input
                                                                        type="number"
                                                                        min="1"
                                                                        value={item.qty}
                                                                        onChange={(e) => updateLineItem(idx, 'qty', e.target.value)}
                                                                        className="h-7 w-16 text-xs px-2 py-0 rounded-lg border-transparent bg-white dark:bg-[#121212] shadow-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-3 px-2 text-right align-top pt-4">
                                                    <div className="relative flex items-center justify-end">
                                                        <span className="absolute left-3 text-[#1b1b18]/50 dark:text-white/50 text-xs">Rp</span>
                                                        <Input 
                                                            type="number"
                                                            min="0"
                                                            value={item.price}
                                                            onChange={(e) => updateLineItem(idx, 'price', e.target.value)}
                                                            className="h-9 w-full text-right text-sm font-medium rounded-xl border-transparent bg-white dark:bg-[#121212] shadow-sm pl-8"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="py-3 pl-2 text-right font-bold whitespace-nowrap align-top pt-5">
                                                    Rp {(Number(item.qty) * Number(item.price)).toLocaleString('id-ID')}
                                                </td>
                                                <td className="py-3 text-center align-top pt-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLineItem(idx)}
                                                        className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    >
                                                        <Trash className="size-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {lineItems.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="py-8 text-center text-sm text-[#1b1b18]/40 dark:text-white/40">
                                                    Belum ada item yang ditambahkan.<br/>
                                                    Klik <strong>+ Jasa</strong> atau <strong>+ Sparepart</strong> untuk memulai.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 border-dashed border-[#1b1b18]/20 dark:border-white/20">
                                            <td colSpan={2} className="pt-6 pb-2 text-xs font-black tracking-widest uppercase text-[#1b1b18]/70 dark:text-white/70">
                                                Total
                                            </td>
                                            <td colSpan={2} className="pt-6 pb-2 pr-10 text-right text-xl font-black text-red-600 dark:text-red-400 whitespace-nowrap">
                                                Rp {totalHarga.toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            
                            {errors.tipe_service && <div className="mt-2 text-xs text-red-600">{errors.tipe_service}</div>}

                            <div className="mt-8">
                                <button
                                    disabled={processing || lineItems.length === 0}
                                    className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#1b1b18] text-sm font-black tracking-widest text-white uppercase shadow-xl transition-all hover:bg-black disabled:opacity-50 dark:bg-white dark:text-[#1b1b18]"
                                >
                                    {processing ? (
                                        <Loader2 className="size-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Wrench className="size-5" />
                                            {t('dash_save_changes')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </ModalShell>
    );
}
