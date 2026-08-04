import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useLanguage } from '@/hooks/use-language';
import { Modal } from '@/components/Modal';

interface CustomerOption {
    id: number;
    name: string;
    telp: string;
}

interface CarEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    customers: CustomerOption[];
    editingCar: any;
}

export function CarEditModal({ isOpen, onClose, customers, editingCar }: CarEditModalProps) {
    const { t } = useLanguage();

    const { data, setData, put, processing, errors, reset, clearErrors, isDirty } =
        useForm({
            id_pelanggan: '',
            merk: '',
            model: '',
            tahun: '',
            no_polisi: '',
            warna: '',
            keterangan: '',
        });

    useEffect(() => {
        if (isOpen && editingCar) {
            setData({
                id_pelanggan: editingCar.pelanggan?.id?.toString() || '',
                merk: editingCar.merk || '',
                model: editingCar.model || '',
                tahun: editingCar.tahun?.toString() || '',
                no_polisi: editingCar.no_polisi || '',
                warna: editingCar.warna || '',
                keterangan: editingCar.keterangan || '',
            });
            clearErrors();
        } else if (!isOpen) {
            reset();
            clearErrors();
        }
    }, [isOpen, editingCar]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!editingCar) return;

        put(`/admin/cars/${editingCar.id}`, {
            onSuccess: () => {
                onClose();
                reset();
                toast.success(t('dash_car_updated', 'Car successfully updated'));
            },
        });
    };

    return (
        <Modal isDirty={isDirty}
            isOpen={isOpen}
            onClose={onClose}
            title={t('dash_edit_car', 'Edit Car')}
            maxWidthClassName="max-w-[600px]"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label>{t('dash_select_owner', 'Select Owner')}</Label>
                    <SearchableSelect
                        value={data.id_pelanggan}
                        onChange={(val) => setData('id_pelanggan', val)}
                        placeholder={t('dash_select_existing_customer', 'Select an existing customer')}
                        options={customers?.map((c) => ({
                            value: c.id.toString(),
                            label: `${c.name} (${c.telp})`,
                        }))}
                    />
                    {errors.id_pelanggan && (
                        <p className="text-xs text-red-500">
                            {errors.id_pelanggan}
                        </p>
                    )}
                </div>

                <div className="mt-4 border-t border-[#1b1b18]/10 pt-4 dark:border-white/10">
                    <h3 className="mb-4 text-sm font-bold uppercase">
                        {t('dash_car_details', 'Car Details')}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t('dash_brand', 'Brand (Merk)')}</Label>
                            <Input
                                value={data.merk}
                                onChange={(e) =>
                                    setData('merk', e.target.value)
                                }
                                placeholder="e.g. Toyota"
                                className="h-12 rounded-xl"
                            />
                            {errors.merk && (
                                <p className="text-xs text-red-500">
                                    {errors.merk}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>{t('dash_model', 'Model')}</Label>
                            <Input
                                value={data.model}
                                onChange={(e) =>
                                    setData('model', e.target.value)
                                }
                                placeholder="e.g. Avanza"
                                className="h-12 rounded-xl"
                            />
                            {errors.model && (
                                <p className="text-xs text-red-500">
                                    {errors.model}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>{t('dash_license_plate', 'License Plate (No Polisi)')}</Label>
                            <Input
                                value={data.no_polisi}
                                onChange={(e) =>
                                    setData('no_polisi', e.target.value)
                                }
                                placeholder="e.g. B 1234 CD"
                                className="h-12 rounded-xl uppercase"
                            />
                            {errors.no_polisi && (
                                <p className="text-xs text-red-500">
                                    {errors.no_polisi}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>{t('dash_year', 'Year (Tahun)')}</Label>
                            <Input
                                type="number"
                                value={data.tahun}
                                onChange={(e) =>
                                    setData('tahun', e.target.value)
                                }
                                placeholder="e.g. 2020"
                                className="h-12 rounded-xl"
                            />
                            {errors.tahun && (
                                <p className="text-xs text-red-500">
                                    {errors.tahun}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>{t('dash_color', 'Color (Warna)')}</Label>
                            <Input
                                value={data.warna}
                                onChange={(e) =>
                                    setData('warna', e.target.value)
                                }
                                placeholder="e.g. Black"
                                className="h-12 rounded-xl"
                            />
                            {errors.warna && (
                                <p className="text-xs text-red-500">
                                    {errors.warna}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>{t('dash_notes', 'Notes (Keterangan)')}</Label>
                            <Input
                                value={data.keterangan}
                                onChange={(e) =>
                                    setData('keterangan', e.target.value)
                                }
                                className="h-12 rounded-xl"
                            />
                            {errors.keterangan && (
                                <p className="text-xs text-red-500">
                                    {errors.keterangan}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="h-12 rounded-xl bg-[#1b1b18] px-8 font-bold tracking-widest text-white uppercase hover:bg-[#1b1b18]/80 dark:bg-white dark:text-[#1b1b18] dark:hover:bg-white/80"
                    >
                        {processing ? t('dash_saving', 'Saving...') : t('dash_update_car', 'Update Car')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
