import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-3">
            <AppLogoIcon className="size-8" />
            <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter leading-none text-[#1b1b18] dark:text-white uppercase">
                    Diva <span className="text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.3)]">AC</span>
                </span>
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-[#1b1b18]/40 dark:text-white/40 leading-none mt-1">
                    Premium Care
                </span>
            </div>
        </div>
    );
}
