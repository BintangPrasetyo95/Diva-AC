import React, { useEffect, useState } from 'react';
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

interface CarCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    customers: CustomerOption[];
}

export function CarCreateModal({ isOpen, onClose, customers }: CarCreateModalProps) {
    const { t } = useLanguage();
    const [isNewUser, setIsNewUser] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors, isDirty } =
        useForm({
            id_pelanggan: '',
            nama_pelanggan: '',
            no_telp: '',
            email: '',
            jenis_kelamin: 'L',
            alamat: '',
            merk: '',
            model: '',
            tahun: '',
            no_polisi: '',
            warna: '',
            keterangan: '',
        });

    useEffect(() => {
        if (!isOpen) {
            reset();
            clearErrors();
            setIsNewUser(false);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const routeName = isNewUser ? '/admin/cars/with-user' : '/admin/cars';

        post(routeName, {
            onSuccess: () => {
                onClose();
                reset();
                toast.success(t('dash_car_created', 'Car successfully created'));
            },
        });
    };

    return (
        <Modal isDirty={isDirty}
            isOpen={isOpen}
            onClose={onClose}
            title={t('dash_create_new_car', 'Create New Car')}
            maxWidthClassName="max-w-[600px]"
        >
            <div className="mt-2 mb-4 flex items-center gap-4">
                <Button
                    type="button"
                    variant={!isNewUser ? 'default' : 'outline'}
                    onClick={() => setIsNewUser(false)}
                    className={`flex-1 rounded-xl text-xs font-bold tracking-widest uppercase ${!isNewUser ? 'bg-[#1b1b18] text-white dark:bg-white dark:text-[#1b1b18]' : ''}`}
                >
                    {t('dash_existing_customer', 'Existing Customer')}
                </Button>
                <Button
                    type="button"
                    variant={isNewUser ? 'default' : 'outline'}
                    onClick={() => setIsNewUser(true)}
                    className={`flex-1 rounded-xl text-xs font-bold tracking-widest uppercase ${isNewUser ? 'bg-[#1b1b18] text-white dark:bg-white dark:text-[#1b1b18]' : ''}`}
                >
                    {t('dash_new_customer', 'New Customer')}
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isNewUser ? (
                    <div className="space-y-2">
                        <Label>{t('dash_select_customer', 'Select Customer')}</Label>
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
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2 md:col-span-1">
                            <Label>{t('dash_customer_name', 'Customer Name')}</Label>
                            <Input
                                value={data.nama_pelanggan}
                                onChange={(e) =>
                                    setData('nama_pelanggan', e.target.value)
                                }
                                className="h-12 rounded-xl"
                            />
                            {errors.nama_pelanggan && (
                                <p className="text-xs text-red-500">
                                    {errors.nama_pelanggan}
                                </p>
                            )}
                        </div>
                        <div className="col-span-2 space-y-2 md:col-span-1">
                            <Label>{t('dash_phone_number', 'Phone Number')}</Label>
                            <Input
                                value={data.no_telp}
                                onChange={(e) =>
                                    setData('no_telp', e.target.value)
                                }
                                className="h-12 rounded-xl"
                            />
                            {errors.no_telp && (
                                <p className="text-xs text-red-500">
                                    {errors.no_telp}
                                </p>
                            )}
                        </div>
                        <div className="col-span-2 space-y-2 md:col-span-1">
                            <Label>{t('dash_email', 'Email')}</Label>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                className="h-12 rounded-xl"
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div className="col-span-2 space-y-2 md:col-span-1">
                            <Label>{t('dash_gender', 'Gender')}</Label>
                            <SearchableSelect
                                value={data.jenis_kelamin}
                                onChange={(val) => setData('jenis_kelamin', val)}
                                options={[
                                    { value: 'L', label: t('dash_male', 'Male (Laki-laki)') },
                                    { value: 'P', label: t('dash_female', 'Female (Perempuan)') },
                                ]}
                            />
                            {errors.jenis_kelamin && (
                                <p className="text-xs text-red-500">
                                    {errors.jenis_kelamin}
                                </p>
                            )}
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label>{t('dash_address', 'Address')}</Label>
                            <Input
                                value={data.alamat}
                                onChange={(e) =>
                                    setData('alamat', e.target.value)
                                }
                                className="h-12 rounded-xl"
                            />
                            {errors.alamat && (
                                <p className="text-xs text-red-500">
                                    {errors.alamat}
                                </p>
                            )}
                        </div>
                    </div>
                )}

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
                        {processing ? t('dash_saving', 'Saving...') : t('dash_save_car', 'Save Car')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
