import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Loader2, Wrench, PlusCircle, Trash } from 'lucide-react';
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

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
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
        status_service: 'antri' as 'antri' | 'proses' | 'selesai' | 'batal',
        catatan: '',
        spareparts: [] as any[],
    });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            if (editingService) {
                setActiveTab('existing');
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
                    spareparts: editingService.spareparts
                        ? editingService.spareparts.map((sp) => ({
                            id: sp.id,
                            jumlah: sp.pivot?.jumlah || 1,
                            harga_satuan: Number(sp.pivot?.harga_satuan || sp.harga_sparepart),
                            nama_sparepart: sp.nama_sparepart,
                        }))
                        : [],
                });
            } else {
                setActiveTab('existing');
                reset();
            }
        }
    }, [isOpen, editingService]);

    const addSparepart = () => {
        if (spareparts.length === 0) return;
        const sp = spareparts[0];
        setData('spareparts', [
            ...data.spareparts,
            {
                id: sp.id,
                jumlah: 1,
                harga_satuan: Number(sp.harga_sparepart),
                nama_sparepart: sp.nama_sparepart,
            },
        ]);
    };

    const removeSparepart = (index: number) => {
        const newItems = [...data.spareparts];
        newItems.splice(index, 1);
        setData('spareparts', newItems);
    };

    const updateSparepart = (index: number, field: string, value: any) => {
        const newItems = [...data.spareparts];
        const item = newItems[index];

        if (field === 'id') {
            const sp = spareparts.find((s) => s.id === Number(value));
            if (sp) {
                item.id = sp.id;
                item.harga_satuan = Number(sp.harga_sparepart);
                item.nama_sparepart = sp.nama_sparepart;
            }
        } else {
            item[field] = Number(value);
        }

        setData('spareparts', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

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

    return (
        <ModalShell isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight text-[#1b1b18] uppercase dark:text-white">
                    {editingService ? t('dash_edit_order') : t('dash_new_service')}
                </h2>
                <button
                    onClick={onClose}
                    className="rounded-full p-2 text-[#1b1b18]/40 hover:bg-[#1b1b18]/5 dark:text-white/40 dark:hover:bg-white/5"
                >
                    <X className="size-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    {!editingService && (
                        <div className="flex w-full gap-2 rounded-2xl bg-[#1b1b18]/5 p-1 dark:bg-white/5 mb-4">
                            <button
                                type="button"
                                onClick={() => setActiveTab('existing')}
                                className={`flex-1 rounded-xl py-2 text-xs font-bold tracking-widest uppercase transition-all ${activeTab === 'existing'
                                        ? 'bg-white text-[#1b1b18] shadow-sm dark:bg-[#121212] dark:text-white'
                                        : 'text-[#1b1b18]/40 hover:text-[#1b1b18] dark:text-white/40 dark:hover:text-white'
                                    }`}
                            >
                                Pilih Existing
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('new')}
                                className={`flex-1 rounded-xl py-2 text-xs font-bold tracking-widest uppercase transition-all ${activeTab === 'new'
                                        ? 'bg-white text-[#1b1b18] shadow-sm dark:bg-[#121212] dark:text-white'
                                        : 'text-[#1b1b18]/40 hover:text-[#1b1b18] dark:text-white/40 dark:hover:text-white'
                                    }`}
                            >
                                + Mobil Baru
                            </button>
                        </div>
                    )}

                    {activeTab === 'existing' || editingService ? (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                Pelanggan / Mobil
                            </label>
                            <SearchableSelect
                                value={data.id_mobil}
                                onChange={(val) => setData('id_mobil', val)}
                                placeholder="Pilih Mobil"
                                options={mobils.map((m) => ({
                                    value: m.id,
                                    label: `${m.pelanggan?.nama_pelanggan} - ${m.merk} (${m.no_polisi})`,
                                }))}
                            />
                            {errors.id_mobil && (
                                <span className="text-xs text-red-600">
                                    {errors.id_mobil}
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4 rounded-2xl border border-red-600/20 bg-red-600/5 p-4">
                            <h3 className="text-sm font-bold text-red-600 uppercase">
                                Input Kendaraan & Pelanggan Baru
                            </h3>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                    Pelanggan
                                </label>
                                <SearchableSelect
                                    value={data.id_pelanggan}
                                    onChange={(val) => setData('id_pelanggan', val)}
                                    placeholder="Pilih Pelanggan"
                                    options={[
                                        { value: 'new', label: '+ Pelanggan Baru' },
                                        ...users.map((u) => ({
                                            value: u.id,
                                            label: `${u.name} (${u.email})`,
                                        })),
                                    ]}
                                />
                                {errors.id_pelanggan && (
                                    <span className="text-xs text-red-600">
                                        {errors.id_pelanggan}
                                    </span>
                                )}
                            </div>

                            {data.id_pelanggan === 'new' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            placeholder="Nama Pelanggan Baru"
                                            value={data.customer_name}
                                            onChange={(e) =>
                                                setData('customer_name', e.target.value)
                                            }
                                            className="h-12 bg-white dark:bg-[#121212]"
                                            required={
                                                activeTab === 'new' &&
                                                data.id_pelanggan === 'new'
                                            }
                                        />
                                        <Input
                                            type="email"
                                            placeholder="Email Pelanggan"
                                            value={data.customer_email}
                                            onChange={(e) =>
                                                setData('customer_email', e.target.value)
                                            }
                                            className="h-12 bg-white dark:bg-[#121212]"
                                            required={
                                                activeTab === 'new' &&
                                                data.id_pelanggan === 'new'
                                            }
                                        />
                                    </div>
                                    <Input
                                        placeholder="No. WhatsApp / Telepon"
                                        value={data.customer_phone}
                                        onChange={(e) =>
                                            setData('customer_phone', e.target.value)
                                        }
                                        className="h-12 bg-white dark:bg-[#121212]"
                                    />
                                </>
                            )}

                            <div className="grid grid-cols-2 gap-4 border-t border-red-600/20 pt-4">
                                <Input
                                    placeholder="No Polisi (Mis. B 1234 CD)"
                                    value={data.no_polisi}
                                    onChange={(e) => setData('no_polisi', e.target.value)}
                                    className="h-12 bg-white dark:bg-[#121212]"
                                    required={activeTab === 'new'}
                                />
                                <Input
                                    placeholder="Merk (Mis. Toyota)"
                                    value={data.merk}
                                    onChange={(e) => setData('merk', e.target.value)}
                                    className="h-12 bg-white dark:bg-[#121212]"
                                    required={activeTab === 'new'}
                                />
                                <Input
                                    placeholder="Tipe (Mis. Avanza)"
                                    value={data.tipe}
                                    onChange={(e) => setData('tipe', e.target.value)}
                                    className="h-12 bg-white dark:bg-[#121212]"
                                    required={activeTab === 'new'}
                                />
                                <Input
                                    placeholder="Warna (Opsional)"
                                    value={data.warna}
                                    onChange={(e) => setData('warna', e.target.value)}
                                    className="h-12 bg-white dark:bg-[#121212]"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                            Mekanik
                        </label>
                        <SearchableSelect
                            value={data.id_mekanik}
                            onChange={(val) => setData('id_mekanik', val)}
                            placeholder="Pilih Mekanik"
                            options={mekaniks.map((m) => ({
                                value: m.id,
                                label: m.nama_mekanik,
                            }))}
                        />
                        {errors.id_mekanik && (
                            <span className="text-xs text-red-600">
                                {errors.id_mekanik}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                Tipe Service
                            </label>
                            <Input
                                value={data.tipe_service}
                                onChange={(e) => setData('tipe_service', e.target.value)}
                                className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                required
                            />
                            {errors.tipe_service && (
                                <span className="text-xs text-red-600">
                                    {errors.tipe_service}
                                </span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                Harga Jasa Service
                            </label>
                            <Input
                                type="number"
                                min="0"
                                value={data.harga_service}
                                onChange={(e) => setData('harga_service', e.target.value)}
                                className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                required
                            />
                            {errors.harga_service && (
                                <span className="text-xs text-red-600">
                                    {errors.harga_service}
                                </span>
                            )}
                        </div>
                        <div className="space-y-2 col-span-2">
                            <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                                Tanggal Service
                            </label>
                            <Input
                                type="date"
                                value={data.tanggal_service}
                                onChange={(e) =>
                                    setData('tanggal_service', e.target.value)
                                }
                                className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                                required
                            />
                            {errors.tanggal_service && (
                                <span className="text-xs text-red-600">
                                    {errors.tanggal_service}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
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
                        {errors.status_service && (
                            <span className="text-xs text-red-600">
                                {errors.status_service}
                            </span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                            Catatan Tambahan
                        </label>
                        <Input
                            value={data.catatan}
                            onChange={(e) => setData('catatan', e.target.value)}
                            className="h-12 rounded-2xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                            placeholder="Opsional"
                        />
                        {errors.catatan && (
                            <span className="text-xs text-red-600">
                                {errors.catatan}
                            </span>
                        )}
                    </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-[#1b1b18]/10 p-4 dark:border-white/10">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase">
                            Penggunaan Sparepart
                        </label>
                        <button
                            type="button"
                            onClick={addSparepart}
                            className="flex items-center gap-1 rounded-lg bg-[#1b1b18]/5 px-2 py-1 text-xs font-bold text-[#1b1b18] hover:bg-[#1b1b18]/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                        >
                            <PlusCircle className="size-3" /> Tambah Part
                        </button>
                    </div>

                    {data.spareparts.map((sp, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <div className="flex-1">
                                <SearchableSelect
                                    value={sp.id}
                                    onChange={(val) => updateSparepart(idx, 'id', val)}
                                    placeholder="Pilih Sparepart"
                                    options={spareparts.map((part) => ({
                                        value: part.id,
                                        label: `${part.nama_sparepart} - Rp ${Number(
                                            part.harga_sparepart
                                        ).toLocaleString('id-ID')}`,
                                    }))}
                                />
                            </div>
                            <Input
                                type="number"
                                min="1"
                                value={sp.jumlah}
                                onChange={(e) =>
                                    updateSparepart(idx, 'jumlah', e.target.value)
                                }
                                className="h-10 w-20 rounded-xl border-transparent bg-[#1b1b18]/5 dark:bg-white/5"
                            />
                            <button
                                type="button"
                                onClick={() => removeSparepart(idx)}
                                className="rounded-lg p-2 text-red-500 hover:bg-red-500/10"
                            >
                                <Trash className="size-4" />
                            </button>
                        </div>
                    ))}
                    {data.spareparts.length === 0 && (
                        <div className="text-center text-xs text-[#1b1b18]/40 dark:text-white/40">
                            Belum ada sparepart yang ditambahkan
                        </div>
                    )}
                </div>

                <button
                    disabled={processing}
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
            </form>
        </ModalShell>
    );
}
