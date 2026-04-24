import { useProgress } from '@react-three/drei';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
    const { progress, active } = useProgress();
    const [show, setShow] = useState(true);

    useEffect(() => {
        // Expiration timer: force hide after 30 seconds
        const timeout = setTimeout(() => {
            setShow(false);
        }, 30000);

        // Hide when loading is done
        if (!active && progress === 100) {
            const finishTimeout = setTimeout(() => setShow(false), 500);
            return () => {
                clearTimeout(timeout);
                clearTimeout(finishTimeout);
            };
        }

        return () => clearTimeout(timeout);
    }, [active, progress]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0a]"
                >
                    <div className="relative flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="mb-8 text-4xl font-black tracking-tighter text-[#1b1b18] dark:text-white"
                        >
                            DIVA AC
                        </motion.div>
                        
                        <div className="h-1 w-64 overflow-hidden rounded-full bg-[#1b1b18]/10 dark:bg-white/10">
                            <motion.div
                                className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "easeOut" }}
                            />
                        </div>
                        
                        <motion.span 
                            className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-[#1b1b18]/40 dark:text-white/40"
                        >
                            Loading Experience {Math.round(progress)}%
                        </motion.span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
