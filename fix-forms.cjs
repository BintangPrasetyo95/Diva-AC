const fs = require('fs');
const path = require('path');

function findFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(findFiles(file));
        } else {
            if (file.endsWith('.tsx')) results.push(file);
        }
    });
    return results;
}

const files = findFiles('resources/js/pages');

const replacements = [
    { target: /placeholder="e\.g\. Workshop Front View"/g, repl: "placeholder={t('placeholder_gallery') || 'e.g. Workshop Front View'}" },
    { target: /placeholder="e\.g\. John Doe"/g, repl: "placeholder={t('placeholder_name') || 'e.g. John Doe'}" },
    { target: /placeholder="john@example\.com"/g, repl: "placeholder={t('placeholder_email') || 'john@example.com'}" },
    { target: /placeholder="johndoe"/g, repl: "placeholder={t('placeholder_username') || 'johndoe'}" },
    { target: /placeholder="https:\/\/goo\.gl\/maps\/\.\.\."/g, repl: "placeholder={t('placeholder_map') || 'https://goo.gl/maps/...'}" },
    { target: /placeholder="628123456789"/g, repl: "placeholder={t('placeholder_phone') || '628123456789'}" },
    { target: /placeholder="Password"/g, repl: "placeholder={t('placeholder_password') || 'Password'}" },
    { target: /placeholder="email@example\.com"/g, repl: "placeholder={t('placeholder_email') || 'email@example.com'}" },
    { target: /placeholder="Confirm password"/g, repl: "placeholder={t('placeholder_confirm_password') || 'Confirm password'}" },
    { target: /placeholder="Enter recovery code"/g, repl: "placeholder={t('placeholder_recovery_code') || 'Enter recovery code'}" },
    { target: /placeholder="Full name"/g, repl: "placeholder={t('placeholder_full_name') || 'Full name'}" },
    { target: /placeholder="Email address"/g, repl: "placeholder={t('placeholder_email') || 'Email address'}" },
    { target: /placeholder="Current password"/g, repl: "placeholder={t('placeholder_current_password') || 'Current password'}" },
    { target: /placeholder="New password"/g, repl: "placeholder={t('placeholder_new_password') || 'New password'}" },
    
    // Labels
    { target: /<Label([^>]*)>Password<\/Label>/g, repl: "<Label>{t('label_password') || 'Password'}</Label>" },
    { target: /<Label([^>]*)>Email address<\/Label>/g, repl: "<Label>{t('label_email') || 'Email address'}</Label>" },
    { target: /<Label([^>]*)>Email<\/Label>/g, repl: "<Label>{t('label_email') || 'Email'}</Label>" },
    { target: /<Label([^>]*)>\s*Confirm password\s*<\/Label>/g, repl: "<Label>{t('label_confirm_password') || 'Confirm password'}</Label>" },
    { target: /<Label([^>]*)>Name<\/Label>/g, repl: "<Label>{t('label_name') || 'Name'}</Label>" },
    { target: /<Label([^>]*)>\s*Current password\s*<\/Label>/g, repl: "<Label>{t('label_current_password') || 'Current password'}</Label>" },
    { target: /<Label([^>]*)>New password<\/Label>/g, repl: "<Label>{t('label_new_password') || 'New password'}</Label>" },
    { target: /<label([^>]*)>\s*Preview\s*<\/label>/g, repl: "<label>{t('label_preview') || 'Preview'}</label>" },
    { target: /<Label([^>]*)>\s*Instagram\s*<\/Label>/g, repl: "<Label>{t('label_instagram') || 'Instagram'}</Label>" },
    { target: /<Label([^>]*)>\s*Facebook\s*<\/Label>/g, repl: "<Label>{t('label_facebook') || 'Facebook'}</Label>" },
    { target: /<Label([^>]*)>\s*TikTok\s*<\/Label>/g, repl: "<Label>{t('label_tiktok') || 'TikTok'}</Label>" },
    
    // Auth specific buttons/links
    { target: /Email password reset link/g, repl: "{t('btn_email_reset_link') || 'Email password reset link'}" },
    { target: /Or, return to/g, repl: "{t('text_or_return_to') || 'Or, return to'}" },
    { target: /log in/g, repl: "{t('login') || 'log in'}" }
];

let modifiedCount = 0;

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let original = content;
    
    let matched = false;
    replacements.forEach(r => {
        if (r.target.test(content)) {
            content = content.replace(r.target, r.repl);
            matched = true;
        }
    });
    
    if (matched && content !== original) {
        // Inject useLanguage import if missing
        if (!content.includes('useLanguage')) {
            content = "import { useLanguage } from '@/hooks/use-language';\n" + content;
        }
        
        // Inject const { t } = useLanguage(); inside the default export component
        if (!content.includes('const { t } = useLanguage();')) {
            const funcMatch = content.match(/export default function ([A-Za-z0-9_]+)\s*\([^)]*\)\s*{/);
            if (funcMatch) {
                content = content.replace(funcMatch[0], funcMatch[0] + "\n    const { t } = useLanguage();");
            }
        }
        
        fs.writeFileSync(f, content);
        console.log('Modified ' + path.relative(process.cwd(), f));
        modifiedCount++;
    }
});

console.log('Total files modified:', modifiedCount);
