import { m, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import AppLogoIcon from '@/components/app-logo-icon';

const MIN_PRELOAD_DURATION = 1000; // ms

export default function Preloader({ onLoadingComplete }: { onLoadingComplete?: () => void }) {
    const [show, setShow] = useState(true);
    const { progress } = useProgress();
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const startTime = Date.now();
        
        const checkProgress = setInterval(() => {
            const elapsed = Date.now() - startTime;
            if (progress === 100 && elapsed >= MIN_PRELOAD_DURATION) {
                setIsFinished(true);
                onLoadingComplete?.();
                clearInterval(checkProgress);
            }
        }, 100);

        // Safety fallback
        const fallback = setTimeout(() => {
            setIsFinished(true);
            clearInterval(checkProgress);
        }, 10000);

        return () => {
            clearInterval(checkProgress);
            clearTimeout(fallback);
        };
    }, [progress]);

    useEffect(() => {
        if (isFinished) {
            const timeout = setTimeout(() => setShow(false), 800);
            return () => clearTimeout(timeout);
        }
    }, [isFinished]);

    return (
        <AnimatePresence>
            {show && (
                <m.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0a]"
                >
                    <div className="relative flex flex-col items-center w-full max-w-xs px-6">
                        {/* Logo Container */}
                        <m.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="mb-6 relative flex items-center justify-center"
                        >
                            <div className="relative z-10 p-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
                                <AppLogoIcon className="size-20" />
                            </div>
                            {/* Animated Rings */}
                            <m.div 
                                className="absolute -inset-2 rounded-full border border-red-600/30"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <m.div 
                                className="absolute -inset-6 rounded-full border border-red-600/10"
                                animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0, 0.1] }}
                                transition={{ duration: 3, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </m.div>

                        {/* Brand Name */}
                        <m.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="mb-8 flex flex-col items-center"
                        >
                            <h1 className="text-3xl font-black tracking-tighter text-[#1b1b18] dark:text-white uppercase leading-none">
                                Diva <span className="text-red-600">AC</span>
                            </h1>
                            <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#1b1b18]/40 dark:text-white/40">
                                Premium Care
                            </span>
                        </m.div>

                        {/* Progress Container */}
                        <div className="w-full">
                            <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-[#1b1b18]/5 dark:bg-white/5">
                                <m.div
                                    className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                />
                            </div>
                            
                            <div className="mt-4 flex items-center justify-between">
                                <m.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600"
                                >
                                    {progress < 100 ? 'Loading Assets' : 'Synchronized'}
                                </m.span>
                                <m.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-[10px] font-mono font-bold text-[#1b1b18]/40 dark:text-white/40"
                                >
                                    {Math.round(progress)}%
                                </m.span>
                            </div>
                        </div>
                    </div>
                </m.div>
            )}
        </AnimatePresence>
    );
}
