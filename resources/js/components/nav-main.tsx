import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarMenu className="gap-2">
            {items.map((item) => {
                const active = isCurrentUrl(item.href) || (item.items && item.items.some(sub => isCurrentUrl(sub.href)));
                
                if (item.items && item.items.length > 0) {
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                tooltip={item.title}
                                isActive={active}
                                className={`rounded-2xl h-12 px-4 transition-all duration-200 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 ${active
                                        ? 'bg-red-600/10 text-red-600 hover:bg-red-600/20 hover:text-red-700'
                                        : 'hover:bg-red-600/5 hover:text-red-600'
                                    }`}
                            >
                                <Link href={item.href}>
                                    {item.icon && <item.icon className={`size-5 shrink-0 ${active ? 'text-red-600' : 'text-[#1b1b18] dark:text-zinc-400'}`} />}
                                    <span className="font-bold tracking-tight group-data-[collapsible=icon]:hidden">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                            
                            <SidebarMenuSub className="mt-2 space-y-1 group-data-[collapsible=icon]:hidden">
                                {item.items.map((subItem) => {
                                    const subActive = isCurrentUrl(subItem.href);
                                    return (
                                        <SidebarMenuSubItem key={subItem.title}>
                                            <SidebarMenuSubButton
                                                asChild
                                                isActive={subActive}
                                                className={`rounded-xl h-10 px-4 transition-all duration-200 ${subActive
                                                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700 hover:text-white'
                                                        : 'hover:bg-red-600/5 hover:text-red-600 text-[#1b1b18]/70 dark:text-zinc-400'
                                                    }`}
                                            >
                                                <Link href={subItem.href}>
                                                    <span className="font-bold tracking-tight">{subItem.title}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    );
                                })}
                            </SidebarMenuSub>
                        </SidebarMenuItem>
                    );
                }

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
