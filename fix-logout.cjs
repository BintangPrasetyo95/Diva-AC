const fs = require('fs');

// 1. Add auth_logout to use-language.tsx
let useLanguageContent = fs.readFileSync('resources/js/hooks/use-language.tsx', 'utf8');
if (!useLanguageContent.includes('auth_logout')) {
    useLanguageContent = useLanguageContent.replace(
        "export const translations: Translations = {", 
        "export const translations: Translations = {\n    auth_logout: { id: 'Keluar', en: 'Log out' },"
    );
    fs.writeFileSync('resources/js/hooks/use-language.tsx', useLanguageContent);
}

// 2. Fix verify-email.tsx
let verifyEmailContent = fs.readFileSync('resources/js/pages/auth/verify-email.tsx', 'utf8');
if (!verifyEmailContent.includes('useLanguage')) {
    verifyEmailContent = "import { useLanguage } from '@/hooks/use-language';\n" + verifyEmailContent;
}
if (!verifyEmailContent.includes('const { t } = useLanguage()')) {
    const funcMatch = verifyEmailContent.match(/export default function ([A-Za-z0-9_]+)\s*\([^)]*\)\s*{/);
    if (funcMatch) {
        verifyEmailContent = verifyEmailContent.replace(funcMatch[0], funcMatch[0] + "\n    const { t } = useLanguage();");
    }
}
verifyEmailContent = verifyEmailContent.replace('Log out', "{t('auth_logout') || 'Log out'}");
fs.writeFileSync('resources/js/pages/auth/verify-email.tsx', verifyEmailContent);

console.log('Fixed auth_logout issues');
