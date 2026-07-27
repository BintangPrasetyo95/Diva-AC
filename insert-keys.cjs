const fs = require('fs');

const path = 'resources/js/hooks/use-language.tsx';
let content = fs.readFileSync(path, 'utf8');

const newTranslations =     placeholder_gallery: { id: 'Contoh: Tampak Depan Bengkel', en: 'e.g. Workshop Front View' },
    placeholder_name: { id: 'Contoh: Budi Santoso', en: 'e.g. John Doe' },
    placeholder_email: { id: 'budi@example.com', en: 'john@example.com' },
    placeholder_username: { id: 'budisantoso', en: 'johndoe' },
    placeholder_map: { id: 'https://goo.gl/maps/...', en: 'https://goo.gl/maps/...' },
    placeholder_phone: { id: '08123456789', en: '628123456789' },
    placeholder_password: { id: 'Kata Sandi', en: 'Password' },
    placeholder_confirm_password: { id: 'Konfirmasi kata sandi', en: 'Confirm password' },
    placeholder_recovery_code: { id: 'Masukkan kode pemulihan', en: 'Enter recovery code' },
    placeholder_full_name: { id: 'Nama lengkap', en: 'Full name' },
    placeholder_current_password: { id: 'Kata sandi saat ini', en: 'Current password' },
    placeholder_new_password: { id: 'Kata sandi baru', en: 'New password' },
    label_password: { id: 'Kata Sandi', en: 'Password' },
    label_email: { id: 'Alamat Email', en: 'Email address' },
    label_confirm_password: { id: 'Konfirmasi kata sandi', en: 'Confirm password' },
    label_name: { id: 'Nama', en: 'Name' },
    label_current_password: { id: 'Kata sandi saat ini', en: 'Current password' },
    label_new_password: { id: 'Kata sandi baru', en: 'New password' },
    label_preview: { id: 'Pratinjau', en: 'Preview' },
    label_instagram: { id: 'Instagram', en: 'Instagram' },
    label_facebook: { id: 'Facebook', en: 'Facebook' },
    label_tiktok: { id: 'TikTok', en: 'TikTok' },
    btn_email_reset_link: { id: 'Kirim tautan reset kata sandi', en: 'Email password reset link' },
    text_or_return_to: { id: 'Atau, kembali ke', en: 'Or, return to' },
    dash_booking_desc: { id: 'Monitor antrean booking dan atur jadwal pelanggan secara visual.', en: 'Monitor booking queue and manage customer schedules visually.' },
    dash_create_booking_desc: { id: 'Isi formulir di bawah untuk menambahkan pesanan booking ke antrean.', en: 'Fill out the form below to add a booking order to the queue.' },
    dash_cancel_booking: { id: 'Batalkan Booking?', en: 'Cancel Booking?' },
    dash_cancel_booking_desc: { id: 'Apakah Anda yakin ingin membatalkan booking ini? Tindakan ini tidak dapat dibatalkan.', en: 'Are you sure you want to cancel this booking? This action cannot be undone.' },
    dash_no_bookings: { id: 'Tidak Ada Booking', en: 'No Bookings' },
    dash_paid: { id: 'LUNAS', en: 'PAID' },
    dash_unpaid: { id: 'BELUM LUNAS', en: 'UNPAID' },
    dash_serviced_vehicles: { id: 'Kendaraan Diservis', en: 'Serviced Vehicles' },
    dash_my_account: { id: 'Akun Saya', en: 'My Account' },
;

// Only insert if not already present
if (!content.includes('placeholder_gallery')) {
    content = content.replace('export const translations: Translations = {', 'export const translations: Translations = {\n' + newTranslations);
    fs.writeFileSync(path, content);
    console.log('Inserted new keys!');
} else {
    console.log('Keys already exist.');
}
