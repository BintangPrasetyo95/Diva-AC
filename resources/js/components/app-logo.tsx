import { useState, useEffect } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';

function useShopStatus() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const checkStatus = () => {
            const now = new Date();
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Jakarta',
                weekday: 'short',
                hour: 'numeric',
                minute: 'numeric',
                hour12: false
            });
            
            const parts = formatter.formatToParts(now);
            const weekday = parts.find(p => p.type === 'weekday')?.value;
            // Handle cases where hour might be '24' instead of '0' depending on browser
            let hourStr = parts.find(p => p.type === 'hour')?.value || '0';

            if (hourStr === '24') {
hourStr = '0';
}

            const hour = parseInt(hourStr, 10);
            
            if (weekday === 'Sun') {
                setIsOpen(false);
            } else {
                if (hour >= 8 && hour < 17) {
                    setIsOpen(true);
                } else {
                    setIsOpen(false);
                }
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 60000);
 
        return () => clearInterval(interval);
    }, []);

    return isOpen;
}

export default function AppLogo() {
    const isOpen = useShopStatus();

    return (
        <div className="flex items-center gap-3">
            <AppLogoIcon className="size-8 shrink-0" />
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-tighter leading-none text-[#1b1b18] dark:text-white uppercase">
                        Diva <span className="text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.3)]">AC</span>
                    </span>
                    <div className={`px-1.5 py-0.5 rounded-sm text-[0.55rem] font-bold uppercase tracking-widest text-[#1b1b18] dark:text-white leading-none flex items-center gap-1 ${isOpen ? 'shadow-[0_0_8px_rgba(34,197,94,0.3)] outline outline-green-500' : 'shadow-[0_0_8px_rgba(220,38,38,0.3)] outline outline-red-500'}`}>
                        {isOpen && <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-600 animate-pulse" />}
                        {isOpen ? 'OPEN' : 'CLOSED'}
                    </div>
                </div>
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-[#1b1b18]/40 dark:text-white/40 leading-none mt-1">
                    Premium Care
                </span>
            </div>
        </div>
    );
}
