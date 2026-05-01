import { Link } from '@inertiajs/react';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarMenu className="gap-2">
            {items.map((item) => {
                const active = isCurrentUrl(item.href);
                return (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={active}
                            tooltip={item.title}
                            className={`rounded-2xl h-12 px-4 transition-all duration-200 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 ${active
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700 hover:text-white'
                                    : 'hover:bg-red-600/5 hover:text-red-600'
                                }`}
                        >
                            <Link href={item.href}>
                                {item.icon && <item.icon className={`size-5 shrink-0 ${active ? 'text-white' : 'text-[#1b1b18] dark:text-zinc-400'}`} />}
                                <span className="font-bold tracking-tight group-data-[collapsible=icon]:hidden">{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </SidebarMenu>
    );
}
