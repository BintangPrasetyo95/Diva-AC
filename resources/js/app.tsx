import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import { LanguageProvider } from '@/hooks/use-language';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
            case name === 'ThreePage':
            case name === 'booking':
            case name === 'spareparts':
            case name === 'services/info':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <LanguageProvider>
                <TooltipProvider delayDuration={0}>
                    {app}
                    <Toaster />
                </TooltipProvider>
            </LanguageProvider>
        );
    },
    progress: {
        color: '#dc2626',
    },
});

initializeTheme();
