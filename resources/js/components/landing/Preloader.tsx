import { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';

const PRELOAD_DURATION = 1500; // ms

export default function Preloader() {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setShow(false), PRELOAD_DURATION);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <AnimatePresence>
            {show && (
                <m.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0a]"
                >
                    <div className="relative flex flex-col items-center">
                        <m.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="mb-8 text-4xl font-black tracking-tighter text-[#1b1b18] dark:text-white"
                        >
                            DIVA AC
                        </m.div>

                        <div className="h-1 w-64 overflow-hidden rounded-full bg-[#1b1b18]/10 dark:bg-white/10">
                            <m.div
                                className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1.2, ease: 'easeInOut' }}
                            />
                        </div>

                        <m.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-[#1b1b18]/40 dark:text-white/40"
                        >
                            Loading Experience
                        </m.span>
                    </div>
                </m.div>
            )}
        </AnimatePresence>
    );
}
