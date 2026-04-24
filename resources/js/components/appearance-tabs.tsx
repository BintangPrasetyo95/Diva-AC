import type { LucideIcon } from 'lucide-react';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' },
    ];

    return (
        <div
            className={cn(
                'inline-flex gap-1 rounded-full bg-white/10 p-1 backdrop-blur-md border border-white/20 dark:bg-black/20',
                className,
            )}
            {...props}
        >
            {tabs.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => updateAppearance(value)}
                    className={cn(
                        'flex items-center rounded-full px-4 py-1.5 transition-all',
                        appearance === value
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'text-white/40 hover:text-white hover:bg-white/10',
                    )}
                >
                    <Icon className="h-4 w-4" />
                    <span className="ml-2 text-xs font-bold uppercase tracking-wider">{label}</span>
                </button>
            ))}
        </div>
    );
}
