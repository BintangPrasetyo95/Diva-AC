import React from 'react';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas-pro';
import html2pdf from 'html2pdf.js';
import { InvoiceTemplate } from '@/pages/invoice';

const generatePdfBlob = async (type: 'service' | 'sparepart', data: any, invoiceNo: string): Promise<Blob> => {
    return new Promise<Blob>((resolve, reject) => {
        try {
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.top = '-9999px';
            container.style.left = '-9999px';
            document.body.appendChild(container);
            
            const root = createRoot(container);
            root.render(<InvoiceTemplate type={type} data={data} autoPrint={false} />);
            
            setTimeout(async () => {
                try {
                    const element = container.querySelector('.invoice-page-container') as HTMLElement || container;
                    const canvas = await html2canvas(element, { 
                        scale: 2, 
                        useCORS: true,
                        backgroundColor: '#ffffff'
                    });
                    
                    const opt = {
                        margin:       0,
                        filename:     `${invoiceNo}.pdf`,
                        image:        { type: 'jpeg', quality: 0.98 },
                        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
                    };
                    
                    const html2pdfLib = (html2pdf as any).default || html2pdf;
                    html2pdfLib().set(opt).from(canvas).output('blob').then((blob: Blob) => {
                        root.unmount();
                        if (document.body.contains(container)) document.body.removeChild(container);
                        resolve(blob);
                    }).catch((err: any) => {
                        root.unmount();
                        if (document.body.contains(container)) document.body.removeChild(container);
                        reject(err);
                    });
                } catch (err) {
                    root.unmount();
                    if (document.body.contains(container)) document.body.removeChild(container);
                    reject(err);
                }
            }, 500);
        } catch (error) {
            reject(error);
        }
    });
};

export const downloadInvoicePdf = async (type: 'service' | 'sparepart', data: any) => {
    const invoiceNo = `${type === 'service' ? 'SRV' : 'INV'}-${String(data.id).padStart(4, '0')}`;
    const blob = await generatePdfBlob(type, data, invoiceNo);
    
    // Create a download link for the blob
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoiceNo}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const shareInvoicePdf = async (type: 'service' | 'sparepart', data: any) => {
    const invoiceNo = `${type === 'service' ? 'SRV' : 'INV'}-${String(data.id).padStart(4, '0')}`;
    const blob = await generatePdfBlob(type, data, invoiceNo);
    const file = new File([blob], `${invoiceNo}.pdf`, { type: 'application/pdf' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
            title: `Invoice ${invoiceNo}`,
            text: `Here is the invoice for your ${type}.`,
            files: [file]
        });
    } else {
        throw new Error('Your browser does not support sharing files.');
    }
};
