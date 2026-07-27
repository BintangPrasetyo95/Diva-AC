const fs = require('fs');

const path = 'resources/js/pages/my-account.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add import if needed
if (!content.includes('useLanguage')) {
    content = "import { useLanguage } from '@/hooks/use-language';\n" + content;
}

// 2. Add useLanguage hook
const funcMatch = content.match(/export default function MyAccount\([^)]*\)\s*{/);
if (funcMatch && !content.includes('const { t } = useLanguage();')) {
    content = content.replace(funcMatch[0], funcMatch[0] + "\n    const { t } = useLanguage();");
}

// 3. Define new translations in use-language.tsx
const langPath = 'resources/js/hooks/use-language.tsx';
let langContent = fs.readFileSync(langPath, 'utf8');

const newTranslations = {
    acct_title: { id: 'Akun Saya', en: 'My Account' },
    acct_profile: { id: 'Profil Saya', en: 'My Profile' },
    acct_cars: { id: 'Kendaraan', en: 'Vehicles' },
    acct_history: { id: 'Riwayat Servis', en: 'Service History' },
    acct_purchases: { id: 'Pembelian', en: 'Purchases' },
    acct_gender: { id: 'Jenis Kelamin', en: 'Gender' },
    acct_male: { id: 'Laki-laki', en: 'Male' },
    acct_female: { id: 'Perempuan', en: 'Female' },
    acct_register_date: { id: 'Tanggal Daftar', en: 'Registration Date' },
    acct_no_cars: { id: 'Belum ada kendaraan terdaftar', en: 'No registered vehicles yet' },
    acct_no_services: { id: 'Belum ada riwayat servis', en: 'No service history yet' },
    acct_no_purchases: { id: 'Belum ada pembelian sparepart', en: 'No sparepart purchases yet' },
    acct_plate: { id: 'No. Polisi', en: 'License Plate' },
    acct_times_service: { id: 'x servis', en: 'x service' },
    acct_mechanic: { id: 'Mekanik', en: 'Mechanic' },
    acct_type: { id: 'Tipe', en: 'Type' },
    acct_date: { id: 'Tanggal', en: 'Date' },
    acct_status: { id: 'Status', en: 'Status' },
    acct_action: { id: 'Aksi', en: 'Action' },
    acct_total: { id: 'Total', en: 'Total' },
    acct_pay: { id: 'Bayar', en: 'Pay' },
    acct_change: { id: 'Kembali', en: 'Change' },
    acct_vehicle: { id: 'Kendaraan', en: 'Vehicle' }
};

let toInsert = '';
for (const [key, val] of Object.entries(newTranslations)) {
    if (!langContent.includes(key + ':')) {
        toInsert += `    ${key}: { id: '${val.id}', en: '${val.en}' },\n`;
    }
}
if (toInsert) {
    langContent = langContent.replace('export const translations: Translations = {', 'export const translations: Translations = {\n' + toInsert);
    fs.writeFileSync(langPath, langContent);
}

// 4. Perform replacements
content = content.replace(/label: 'Profil Saya'/g, "label: t('acct_profile') || 'Profil Saya'");
content = content.replace(/label: 'Kendaraan'/g, "label: t('acct_cars') || 'Kendaraan'");
content = content.replace(/label: 'Riwayat Servis'/g, "label: t('acct_history') || 'Riwayat Servis'");
content = content.replace(/label: 'Pembelian'/g, "label: t('acct_purchases') || 'Pembelian'");

content = content.replace(/title="Akun Saya"/g, 'title={t("acct_title") || "Akun Saya"}');

// The stats block
content = content.replace(/'Kendaraan'/g, "t('acct_cars') || 'Kendaraan'");
content = content.replace(/'Servis'/g, "t('acct_history') || 'Servis'");
content = content.replace(/'Pembelian'/g, "t('acct_purchases') || 'Pembelian'");

// Grid items
content = content.replace(/label: 'Nama Lengkap'/g, "label: t('dash_full_name') || 'Nama Lengkap'");
content = content.replace(/label: 'Username'/g, "label: t('auth_username') || 'Username'");
content = content.replace(/label: 'Email'/g, "label: t('auth_email') || 'Email'");
content = content.replace(/label: 'No\. Telepon'/g, "label: t('phone') || 'No. Telepon'");
content = content.replace(/label: 'Alamat'/g, "label: t('dash_workshop_address') || 'Alamat'");
content = content.replace(/label: 'Jenis Kelamin'/g, "label: t('acct_gender') || 'Jenis Kelamin'");
content = content.replace(/label: 'Tanggal Daftar'/g, "label: t('acct_register_date') || 'Tanggal Daftar'");

content = content.replace(/'Laki-laki'/g, "t('acct_male') || 'Laki-laki'");
content = content.replace(/'Perempuan'/g, "t('acct_female') || 'Perempuan'");

// Empty states
content = content.replace(/"Belum ada kendaraan terdaftar"/g, "t('acct_no_cars') || 'Belum ada kendaraan terdaftar'");
content = content.replace(/"Belum ada riwayat servis"/g, "t('acct_no_services') || 'Belum ada riwayat servis'");
content = content.replace(/"Belum ada pembelian sparepart"/g, "t('acct_no_purchases') || 'Belum ada pembelian sparepart'");

// Other strings
content = content.replace(/No\. Polisi/g, "{t('acct_plate') || 'No. Polisi'}");
content = content.replace(/x servis/g, "{t('acct_times_service') || 'x servis'}");
content = content.replace(/>Detail</g, ">{t('dash_user_details') || 'Detail'}<");
content = content.replace(/>Invoice</g, ">{t('invoice') || 'Invoice'}<");

content = content.replace(/'#',\n\s*'Kendaraan',\n\s*'Mekanik',\n\s*'Tipe',\n\s*'Tanggal',\n\s*'Total',\n\s*'Status',\n\s*'Aksi',/g, 
    "'#',\n                                                t('acct_vehicle') || 'Kendaraan',\n                                                t('acct_mechanic') || 'Mekanik',\n                                                t('acct_type') || 'Tipe',\n                                                t('acct_date') || 'Tanggal',\n                                                t('acct_total') || 'Total',\n                                                t('acct_status') || 'Status',\n                                                t('acct_action') || 'Aksi',");

content = content.replace(/>Bayar</g, ">{t('acct_pay') || 'Bayar'}<");
content = content.replace(/>Kembali</g, ">{t('acct_change') || 'Kembali'}<");
content = content.replace(/>Total</g, ">{t('acct_total') || 'Total'}<");

fs.writeFileSync(path, content);
console.log('Fixed my-account.tsx');
