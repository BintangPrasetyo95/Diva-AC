import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { useLanguage } from '@/hooks/use-language';
import { useAppearance } from '@/hooks/use-appearance';
import { Sun, Moon, Search } from 'lucide-react';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { language, setLanguage, t } = useLanguage();
    const { appearance, updateAppearance } = useAppearance();

    return (
        <header className="flex h-20 shrink-0 items-center justify-between px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16 md:px-8">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1 text-[#1b1b18]/40 hover:text-red-600 dark:text-white/40 dark:hover:text-red-600" />
                <div className="h-6 w-px bg-[#1b1b18]/10 dark:bg-white/10" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="flex items-center gap-6">
                {/* Global Search */}
                <div className="relative hidden lg:block">
                    <Search
                        className="absolute top-1/2 left-4 z-10 size-5 -translate-y-1/2 text-black dark:text-white"
                        strokeWidth={2.5}
                    />
                    <input
                        type="text"
                        placeholder={t('dash_search')}
                        className="h-11 w-72 rounded-2xl border border-[#1b1b18]/10 bg-white/50 px-12 text-sm font-medium backdrop-blur-md transition-all focus:border-red-600/50 focus:outline-none dark:border-white/10 dark:bg-black/20"
                    />
                </div>

                <div className="flex items-center gap-4">
                    {/* Language Toggler */}
                    <div className="flex items-center gap-1 rounded-2xl bg-[#1b1b18]/5 p-1.5 dark:bg-white/5">
                        <button
                            onClick={() => setLanguage('id')}
                            className={`rounded-xl px-4 py-1.5 text-[10px] font-black transition-all ${language === 'id' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-[#1b1b18]/40 hover:text-[#1b1b18] dark:text-white/40 dark:hover:text-white'}`}
                        >
                            ID
                        </button>
                        <button
                            onClick={() => setLanguage('en')}
                            className={`rounded-xl px-4 py-1.5 text-[10px] font-black transition-all ${language === 'en' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-[#1b1b18]/40 hover:text-[#1b1b18] dark:text-white/40 dark:hover:text-white'}`}
                        >
                            EN
                        </button>
                    </div>

                    {/* Theme Toggler */}
                    <div className="flex items-center gap-1 rounded-2xl bg-[#1b1b18]/5 p-1.5 dark:bg-white/5">
                        <button
                            onClick={() => updateAppearance('light')}
                            className={`rounded-xl p-2 transition-all ${appearance === 'light' ? 'bg-white text-amber-500 shadow-sm' : 'text-[#1b1b18]/40 hover:text-[#1b1b18] dark:text-white/40'}`}
                        >
                            <Sun className="size-4" />
                        </button>
                        <button
                            onClick={() => updateAppearance('dark')}
                            className={`rounded-xl p-2 transition-all ${appearance === 'dark' ? 'bg-[#1b1b18] text-indigo-400 shadow-sm' : 'text-[#1b1b18]/40 hover:text-[#1b1b18] dark:text-white/40'}`}
                        >
                            <Moon className="size-4" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
