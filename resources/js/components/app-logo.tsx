import AppLogoIcon from '@/components/app-logo-icon';
import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const { isStoreOpen } = usePage().props as any;
    const isOpen = Boolean(isStoreOpen);

    return (
        <div className="flex items-center gap-3">
            <AppLogoIcon className="size-8 shrink-0" />
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <div className="flex items-center gap-2">
                    <span className="text-xl leading-none font-black tracking-tighter text-[#1b1b18] uppercase dark:text-white">
                        Diva{' '}
                        <span className="text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.3)]">
                            AC
                        </span>
                    </span>
                    <div
                        className={`flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[0.55rem] leading-none font-bold tracking-widest text-[#1b1b18] uppercase dark:text-white ${isOpen ? 'shadow-[0_0_8px_rgba(34,197,94,0.3)] outline outline-green-500' : 'shadow-[0_0_8px_rgba(220,38,38,0.3)] outline outline-red-500'}`}
                    >
                        {isOpen && (
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500 dark:bg-green-600" />
                        )}
                        {isOpen ? 'OPEN' : 'CLOSED'}
                    </div>
                </div>
                <span className="mt-1 text-[0.6rem] leading-none font-bold tracking-[0.3em] text-[#1b1b18]/40 uppercase dark:text-white/40">
                    Premium Care
                </span>
            </div>
        </div>
    );
}
