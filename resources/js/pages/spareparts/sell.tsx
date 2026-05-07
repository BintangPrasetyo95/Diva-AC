import { Head } from '@inertiajs/react';
import { m, Variants, LazyMotion, domAnimation } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import React from 'react';
import { useLanguage } from '@/hooks/use-language';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 12
        }
    }
};

export default function SparepartSellPage() {
    const { t } = useLanguage();

    return (
        <LazyMotion features={domAnimation}>
            <Head title="Penjualan Sparepart" />

            <m.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="flex flex-col gap-8 p-6 lg:p-8"
            >
                {/* Header Section */}
                <m.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-[#1b1b18] dark:text-white uppercase">
                            Sparepart <span className="text-red-600">Sell</span>
                        </h1>
                        <p className="text-sm text-[#1b1b18]/50 dark:text-white/50">Manage sparepart sales and transactions.</p>
                    </div>
                </m.div>

                {/* Content Placeholder */}
                <m.div variants={itemVariants} className="overflow-hidden rounded-3xl border border-[#1b1b18]/5 bg-white shadow-sm dark:border-white/5 dark:bg-[#121212] p-20 flex flex-col items-center justify-center text-center">
                    <div className="size-24 rounded-full bg-red-600/10 flex items-center justify-center mb-6">
                        <ShoppingCart className="size-12 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-[#1b1b18] dark:text-white mb-2">
                        Penjualan Sparepart
                    </h2>
                    <p className="text-[#1b1b18]/50 dark:text-white/50 max-w-md">
                        Halaman ini sedang dalam pengembangan. Fitur penjualan sparepart akan segera tersedia.
                    </p>
                </m.div>
            </m.div>
        </LazyMotion>
    );
}

SparepartSellPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Inventory',
            href: '/admin/inventory',
        },
        {
            title: 'Sparepart Sell',
            href: '/admin/spareparts/sell',
        },
    ],
};
