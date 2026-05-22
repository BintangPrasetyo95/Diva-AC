import React from 'react';
import { Modal } from '@/components/Modal';
import { useLanguage } from '@/hooks/use-language';

interface OrderItem {
    id_sparepart: number;
    nama_sparepart: string;
    jumlah: number;
    harga_satuan: string;
}

interface Order {
    id: number;
    customer_name: string;
    customer_phone: string;
    address: string;
    tanggal_penjualan: string;
    total_harga: string;
    status: string;
    created_at: string;
    items: OrderItem[];
}

interface OrderViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
}

export function OrderViewModal({ isOpen, onClose, order }: OrderViewModalProps) {
    const { t } = useLanguage();

    if (!order) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${t('sell_view_title')} #${order.id}`}
            subtitle={t('sell_view_desc')}
            maxWidthClassName="max-w-md"
        >
            <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-[10px] font-bold tracking-wider text-[#1b1b18]/50 uppercase dark:text-white/50">
                            {t('sell_customer_name')}
                        </p>
                        <p className="font-bold">
                            {order.customer_name}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold tracking-wider text-[#1b1b18]/50 uppercase dark:text-white/50">
                            {t('sell_phone')}
                        </p>
                        <p className="font-bold">
                            {order.customer_phone}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-[10px] font-bold tracking-wider text-[#1b1b18]/50 uppercase dark:text-white/50">
                            {t('sell_address')}
                        </p>
                        <p className="font-bold text-wrap break-words">
                            {order.address}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-[10px] font-bold tracking-wider text-[#1b1b18]/50 uppercase dark:text-white/50">
                            {t('sell_order_items')}
                        </p>
                        <ul className="mt-2 divide-y divide-[#1b1b18]/5 border-t border-[#1b1b18]/5 dark:divide-white/5 dark:border-white/5">
                            {order.items.map(
                                (item: OrderItem, idx: number) => (
                                    <li
                                        key={idx}
                                        className="flex items-center justify-between py-2"
                                    >
                                        <span>
                                            {item.nama_sparepart} x{item.jumlah}
                                        </span>
                                        <span className="font-bold">
                                            Rp{' '}
                                            {(
                                                item.jumlah *
                                                Number(
                                                    item.harga_satuan,
                                                )
                                            ).toLocaleString(
                                                'id-ID',
                                            )}
                                        </span>
                                    </li>
                                ),
                            )}
                        </ul>
                    </div>
                    <div className="col-span-2 flex items-center justify-between border-t border-[#1b1b18]/5 pt-2 dark:border-white/5">
                        <p className="text-[10px] font-bold tracking-wider text-[#1b1b18]/50 uppercase dark:text-white/50">
                            {t('sell_total_price')}
                        </p>
                        <p className="text-lg font-black text-red-600">
                            Rp{' '}
                            {Number(
                                order.total_harga,
                            ).toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
