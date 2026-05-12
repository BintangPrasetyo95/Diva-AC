import { Head } from '@inertiajs/react';
import React, { useEffect } from 'react';

interface Props {
    type: 'service' | 'sparepart';
    data: any;
}

export default function InvoicePage({ type, data }: Props) {
    useEffect(() => {
        // Automatically open print dialog when page loads
        window.print();
    }, []);

    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(Number(amount));
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    let items: any[] = [];
    let date = data.created_at || data.tanggal_service || new Date().toISOString();
    let total = 0;
    let noPolisi = '';

    if (type === 'service') {
        noPolisi = data.mobil?.no_polisi || '';
        date = data.tanggal_service;
        
        // Items in service
        items.push({
            name: `Jasa Service (${data.tipe_service})`,
            qty: 1,
            price: Number(data.harga_service) || (Number(data.total_service) - data.spareparts.reduce((acc: number, curr: any) => acc + (curr.pivot.jumlah * curr.pivot.harga_satuan), 0)),
        });

        data.spareparts?.forEach((sp: any) => {
            items.push({
                name: sp.nama_sparepart,
                qty: sp.pivot.jumlah,
                price: sp.pivot.harga_satuan,
            });
        });

        total = Number(data.total_service);
    } else if (type === 'sparepart') {
        date = data.created_at;

        data.spareparts?.forEach((sp: any) => {
            items.push({
                name: sp.nama_sparepart,
                qty: sp.pivot.jumlah,
                price: sp.pivot.harga_satuan,
            });
        });

        total = Number(data.total_harga);
    }

    return (
        <div className="bg-white min-h-screen text-black flex justify-center p-8">
            <Head title="Invoice - DIVA AC" />
            
            <style>{`
                @media print {
                    @page {
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        padding: 20px;
                    }
                }
            `}</style>
            
            <div className="w-full max-w-4xl bg-white text-sm font-sans">
                {/* Header section */}
                <div className="flex justify-between items-start mb-12">
                    <div className="text-left w-1/2">
                        {/* Empty space on the left top */}
                    </div>
                    <div className="text-right w-1/2">
                        <h1 className="text-3xl font-bold tracking-widest text-blue-900 mb-2 uppercase">INVOICE</h1>
                        <p className="font-bold text-gray-700">Hp : 0811 - 799 - 8851</p>
                    </div>
                </div>

                {/* Details Section */}
                <div className="flex justify-between items-end mb-6">
                    <div className="space-y-2">
                        <div className="flex">
                            <span className="w-24 font-bold text-gray-700">No Pol</span>
                            <span className="font-bold">: {noPolisi || '-'}</span>
                        </div>
                        <div className="flex">
                            <span className="w-24 font-bold text-gray-700">Tanggal</span>
                            <span className="font-bold">: {formatDate(date)}</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-gray-700 text-lg">INVOICE #</span>
                            <span className="text-lg font-bold">
                                {type === 'service' ? 'SRV' : 'INV'}-{String(data.id).padStart(4, '0')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <table className="w-full mb-4 border-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-800">
                            <th className="py-2 text-left w-12 text-gray-800 uppercase text-xs tracking-wider">NO.</th>
                            <th className="py-2 text-left text-gray-800 uppercase text-xs tracking-wider">Spare Part/Servis</th>
                            <th className="py-2 text-center w-24 text-gray-800 uppercase text-xs tracking-wider">Quantity</th>
                            <th className="py-2 text-right w-32 text-gray-800 uppercase text-xs tracking-wider">Unit Price</th>
                            <th className="py-2 text-right w-32 text-gray-800 uppercase text-xs tracking-wider">Line Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index} className="border-b border-gray-200">
                                <td className="py-3 text-left font-medium">{index + 1}</td>
                                <td className="py-3 text-left">{item.name}</td>
                                <td className="py-3 text-center">{item.qty}</td>
                                <td className="py-3 text-right">{formatCurrency(item.price)}</td>
                                <td className="py-3 text-right font-medium">{formatCurrency(item.qty * item.price)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals Section */}
                <div className="flex justify-end mb-12">
                    <div className="w-64 space-y-2">
                        <div className="flex justify-between items-center py-1">
                            <span className="font-bold text-gray-700">SUBTOTAL</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                            <span className="font-bold text-gray-700">DISCOUNT %</span>
                            <span>-</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t-2 border-gray-800">
                            <span className="font-bold text-lg text-gray-900">TOTAL</span>
                            <span className="font-bold text-lg text-gray-900">{formatCurrency(total)}</span>
                        </div>
                    </div>
                </div>

                {/* Signatures & Footer info */}
                <div className="flex justify-between items-start mt-12">
                    <div className="w-1/3">
                        <div className="mb-1 text-xs">
                            <span className="font-bold">* Keterangan :</span> garansi........bulan
                        </div>
                        <div className="text-xs mb-8">
                            hanya untuk spare part yang di ganti *
                        </div>
                        <div className="text-center w-32">
                            <p className="mb-16">Penerima,</p>
                            <div className="border-b border-gray-400 w-full"></div>
                        </div>
                    </div>

                    <div className="w-1/3 flex flex-col items-center">
                        <p className="mb-16">Hormat Kami,</p>
                        <p className="font-bold text-lg mb-8">DIVA AC</p>
                    </div>
                </div>

                {/* Bottom message */}
                <div className="mt-8 text-center text-gray-500 font-bold italic tracking-widest text-xs">
                    TERIMA KASIH ATAS KEPERCAYAAN ANDA...!
                </div>
            </div>
        </div>
    );
}

InvoicePage.layout = (page: any) => page;
