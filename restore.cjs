const fs = require('fs');

function replaceFile(path, replacements) {
    let content = fs.readFileSync(path, 'utf8');
    replacements.forEach(r => {
        content = content.replace(r.target, r.repl);
    });
    fs.writeFileSync(path, content);
}

replaceFile('resources/js/pages/auth/confirm-password.tsx', [
    { target: "<Label>{t('label_password')", repl: "<Label htmlFor=\"password\">{t('label_password')" }
]);

replaceFile('resources/js/pages/auth/forgot-password.tsx', [
    { target: "<Label>{t('label_email')", repl: "<Label htmlFor=\"email\">{t('label_email')" }
]);

replaceFile('resources/js/pages/auth/reset-password.tsx', [
    { target: "<Label>{t('label_email')", repl: "<Label htmlFor=\"email\">{t('label_email')" },
    { target: "<Label>{t('label_password')", repl: "<Label htmlFor=\"password\">{t('label_password')" },
    { target: "<Label>{t('label_confirm_password')", repl: "<Label htmlFor=\"password_confirmation\">{t('label_confirm_password')" }
]);

replaceFile('resources/js/pages/settings/profile.tsx', [
    { target: "<Label>{t('label_name')", repl: "<Label htmlFor=\"name\">{t('label_name')" },
    { target: "<Label>{t('label_email')", repl: "<Label htmlFor=\"email\">{t('label_email')" }
]);

replaceFile('resources/js/pages/settings/security.tsx', [
    { target: "<Label>{t('label_current_password')", repl: "<Label htmlFor=\"current_password\">{t('label_current_password')" },
    { target: "<Label>{t('label_new_password')", repl: "<Label htmlFor=\"password\">{t('label_new_password')" },
    { target: "<Label>{t('label_confirm_password')", repl: "<Label htmlFor=\"password_confirmation\">{t('label_confirm_password')" }
]);

// workshop-settings.tsx had className!
let wsContent = fs.readFileSync('resources/js/pages/admin/workshop-settings.tsx', 'utf8');
wsContent = wsContent.replace("<Label>{t('label_instagram')", "<Label className=\"ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40\">{t('label_instagram')}");
wsContent = wsContent.replace("<Label>{t('label_facebook')", "<Label className=\"ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40\">{t('label_facebook')}");
wsContent = wsContent.replace("<Label>{t('label_tiktok')", "<Label className=\"ml-1 text-[10px] font-black tracking-widest text-[#1b1b18]/40 uppercase dark:text-white/40\">{t('label_tiktok')}");
fs.writeFileSync('resources/js/pages/admin/workshop-settings.tsx', wsContent);

console.log("Restored missing attributes!");
