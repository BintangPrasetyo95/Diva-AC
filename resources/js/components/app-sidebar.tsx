import { Link } from '@inertiajs/react';
import { 
    LayoutGrid, 
    Wrench, 
    Package, 
    Users, 
    Settings, 
    HelpCircle,
    ShoppingBag,
    Image as ImageIcon,
    ShieldCheck,
    Store
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import { useLanguage } from '@/hooks/use-language';

export function AppSidebar() {
    const { t } = useLanguage();

    const mainNavItems: NavItem[] = [
        {
            title: t('dash_title'),
            href: '/admin/dashboard',
            icon: LayoutGrid,
            items: [
                {
                    title: t('dash_income'),
                    href: '/admin/income',
                },
            ],
        },
        {
            title: t('dash_stat_active'),
            href: '/admin/services',
            icon: Wrench,
        },
        {
            title: t('dash_stat_stock'),
            href: '/admin/inventory',
            icon: Package,
            items: [
                {
                    title: t('dash_sparepart_sell'),
                    href: '/admin/spareparts/sell',
                }
            ]
        },
        {
            title: t('dash_stat_customers'),
            href: '/admin/customers',
            icon: Users,
            items: [
                {
                    title: t('dash_cars'),
                    href: '/admin/cars',
                }
            ]
        },
    ];

    const websiteNavItems: NavItem[] = [
        {
            title: t('dash_services_settings'),
            href: '/admin/landing-services',
            icon: Settings,
        },
        {
            title: t('dash_gallery'),
            href: '/admin/gallery',
            icon: ImageIcon,
        },
    ];

    const secondaryNavItems: NavItem[] = [
        {
            title: t('dash_user_management'),
            href: '/admin/users',
            icon: ShieldCheck,
        },
        {
            title: t('dash_workshop_identity'),
            href: '/admin/workshop-settings',
            icon: Store,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r-0">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1b1b18]/30 dark:text-white/30 group-data-[collapsible=icon]:hidden">{t('dash_overview')}</SidebarGroupLabel>
                    <NavMain items={mainNavItems} />
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1b1b18]/30 dark:text-white/30 group-data-[collapsible=icon]:hidden">{t('dash_website_content')}</SidebarGroupLabel>
                    <NavMain items={websiteNavItems} />
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1b1b18]/30 dark:text-white/30 group-data-[collapsible=icon]:hidden">{t('dash_system')}</SidebarGroupLabel>
                    <NavMain items={secondaryNavItems} />
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-2">
                <div className="rounded-2xl bg-[#1b1b18]/5 p-2 dark:bg-white/5 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
                    <NavUser />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
