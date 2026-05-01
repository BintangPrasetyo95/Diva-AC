import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'id' | 'en';

interface Translations {
    [key: string]: {
        id: string;
        en: string;
    };
}

export const translations: Translations = {
    // Hero
    hero_tagline: {
        id: "Layanan AC Mobil Premium & Suku Cadang Berkualitas Tinggi. Perawatan ahli untuk kenyamanan kendaraan Anda.",
        en: "Premium Car AC Services & High-Quality Spare Parts. Expert care for your vehicle's comfort."
    },
    book_now: {
        id: "Booking Sekarang",
        en: "Book a Service"
    },
    explore_services: {
        id: "Jelajahi Layanan",
        en: "Explore Services"
    },
    scroll_explore: {
        id: "Scroll untuk jelajah",
        en: "Scroll to explore"
    },
    // Sections
    services_title: {
        id: "Layanan Kami",
        en: "Our Services"
    },
    booking_title: {
        id: "Atur Jadwal Pertemuan",
        en: "Book Your Appointment"
    },
    booking_subtitle: {
        id: "Jadwalkan layanan dalam hitungan menit. Tim kami akan segera mengkonfirmasi slot Anda.",
        en: "Schedule a service in minutes. Our team will confirm your slot shortly."
    },
    booking_go: {
        id: "Atur Jadwal Sekarang!",
        en: "Book Your Appointment Now!"
    },
    contact_title: {
        id: "Hubungi Kami",
        en: "Contact Us"
    },
    testimonials_title: {
        id: "Apa Kata Mereka",
        en: "Testimonials"
    },
    // Services Detailed
    service_ac_title: {
        id: "Service AC Mobil",
        en: "Car AC Service"
    },
    service_ac_desc: {
        id: "Diagnosa lengkap, pembersihan, dan perbaikan untuk semua jenis sistem AC mobil.",
        en: "Complete diagnostics, cleaning, and repair for all types of car air conditioning systems."
    },
    service_parts_title: {
        id: "Jual Spare Parts",
        en: "Sell Spare Parts"
    },
    service_parts_desc: {
        id: "Suku cadang pengganti asli dan berkualitas tinggi termasuk kompresor, kondensor, dan lainnya.",
        en: "Genuine and high-quality replacement parts including compressors, condensers, and more."
    },
    service_maintenance_title: {
        id: "Perawatan Umum",
        en: "General Maintenance"
    },
    service_maintenance_desc: {
        id: "Pemeriksaan rutin untuk mencegah kerusakan besar dan menjaga performa pendinginan optimal.",
        en: "Routine check-ups to prevent major failures and maintain optimal cooling performance."
    },
    service_freon_title: {
        id: "Isi Freon",
        en: "Freon Refilling"
    },
    service_freon_desc: {
        id: "Pengisian ulang refrigeran berkualitas tinggi memastikan pendinginan yang aman bagi lingkungan dan efektif.",
        en: "High-quality refrigerant recharging ensuring environmentally safe and effective cooling."
    },
    service_odor_title: {
        id: "Penghilang Bau",
        en: "Odor Removal"
    },
    service_odor_desc: {
        id: "Perawatan khusus untuk menghilangkan bakteri dan bau tidak sedap dari ventilasi AC Anda.",
        en: "Specialized treatment to eliminate bacteria and unpleasant smells from your AC vents."
    },
    service_vintage_title: {
        id: "Alarm, Central Lock & Power Window",
        en: "Alarm, Central Lock & Power Window"
    },
    service_vintage_desc: {
        id: "Layanan khusus untuk alarm, central lock, dan power window mobil.",
        en: "Specialized services for alarm, central lock, and power window systems."
    },
    // Description Section
    desc_title: {
        id: "Standar Keunggulan dalam Perawatan AC Mobil",
        en: "The Standard of Excellence in Car AC Maintenance"
    },
    desc_p1: {
        id: "Di Diva AC, kami percaya bahwa setiap perjalanan harus terasa nyaman. Dengan keahlian bertahun-tahun dalam kontrol iklim otomotif, kami menyediakan layanan khusus yang memastikan sistem AC kendaraan Anda berjalan pada performa puncak.",
        en: "At Diva AC, we believe that every drive should be comfortable. With years of expertise in automotive climate control, we provide specialized services that ensure your vehicle's AC system runs at peak performance."
    },
    desc_p2: {
        id: "Mulai dari perawatan rutin hingga perbaikan kompleks dan distribusi suku cadang berkualitas tinggi, teknisi bersertifikat kami menggunakan alat diagnosa canggih untuk memberikan hasil yang dapat Anda rasakan seketika.",
        en: "From routine maintenance to complex repairs and high-quality spare parts distribution, our certified technicians use state-of-the-art diagnostic tools to deliver results you can feel instantly."
    },
    // Contact
    location_label: {
        id: "Lokasi Kami",
        en: "Our Location"
    },
    whatsapp_phone: {
        id: "Whatsapp & Telepon",
        en: "Whatsapp & Phone"
    },
    opening_hours: {
        id: "Jam Operasional",
        en: "Opening Hours"
    },
    mon_sat: {
        id: "Senin - Sabtu",
        en: "Mon - Sat"
    },
    sun_closed: {
        id: "Minggu: Tutup",
        en: "Sun: Closed"
    },
    footer_all_rights: {
        id: "Hak cipta dilindungi undang-undang. Solusi Iklim Otomotif Premium.",
        en: "All rights reserved. Premium Automotive Climate Solutions."
    },
    need_else: {
        id: "Butuh sesuatu yang lain?",
        en: "Need something else?"
    },
    ask_us: {
        id: "Tanya kami apa saja",
        en: "Ask us anything"
    },
    // Menu
    appearance: {
        id: "Tampilan",
        en: "Appearance"
    },
    language: {
        id: "Bahasa",
        en: "Language"
    },
    account: {
        id: "Akun",
        en: "Account"
    },
    login: {
        id: "Masuk",
        en: "Log in"
    },
    register: {
        id: "Daftar",
        en: "Register"
    },
    dashboard: {
        id: "Dashboard",
        en: "Dashboard"
    },
    // New Translations
    what_we_do: {
        id: "Apa Yang Kami Lakukan",
        en: "What We Do"
    },
    services_subtitle: {
        id: "Solusi komprehensif untuk kebutuhan kontrol iklim otomotif Anda.",
        en: "Comprehensive solutions for your automotive climate control needs."
    },
    learn_more: {
        id: "Pelajari lebih lanjut",
        en: "Learn more"
    },
    testimonials_trusted: {
        id: "Dipercaya oleh Penggemar Mobil",
        en: "Trusted by Car Enthusiasts"
    },
    testimonials_subtitle: {
        id: "Baca apa yang dikatakan pelanggan kami tentang pengalaman mereka.",
        en: "Read what our customers have to say about their experience."
    },
    testimonials_day_ago: {
        id: "Hari lalu",
        en: "Day ago",
    },
    testimonials_days_ago: {
        id: "Hari lalu",
        en: "Days ago",
    },
    testimonials_week_ago: {
        id: "Minggu lalu",
        en: "Week ago",
    },
    testimonials_weeks_ago: {
        id: "Minggu lalu",
        en: "Weeks ago",
    },
    testimonials_month_ago: {
        id: "Bulan lalu",
        en: "Month ago",
    },
    testimonials_months_ago: {
        id: "Bulan lalu",
        en: "Months ago",
    },
    testimonials_year_ago: {
        id: "Tahun lalu",
        en: "Year ago",
    },
    testimonials_years_ago: {
        id: "Tahun lalu",
        en: "Years ago",
    },
    see_more: {
        id: "Lihat Selengkapnya",
        en: "See More"
    },
    see_less: {
        id: "Lihat Lebih Sedikit",
        en: "See Less"
    },
    // Auth - Login
    auth_login_title: {
        id: "Masuk ke akun Anda",
        en: "Log in to your account"
    },
    auth_login_description: {
        id: "Masukkan email dan kata sandi Anda untuk masuk",
        en: "Enter your email and password below to log in"
    },
    auth_login_button: {
        id: "Masuk",
        en: "Log in"
    },
    auth_no_account: {
        id: "Belum punya akun?",
        en: "Don't have an account?"
    },
    auth_sign_up: {
        id: "Daftar",
        en: "Sign up"
    },
    auth_forgot_password: {
        id: "Lupa kata sandi?",
        en: "Forgot password?"
    },
    auth_remember_me: {
        id: "Ingat saya",
        en: "Remember me"
    },
    // Auth - Register
    auth_register_title: {
        id: "Buat akun baru",
        en: "Create an account"
    },
    auth_register_description: {
        id: "Masukkan detail Anda untuk membuat akun",
        en: "Enter your details below to create your account"
    },
    auth_create_account: {
        id: "Buat Akun",
        en: "Create account"
    },
    auth_already_account: {
        id: "Sudah punya akun?",
        en: "Already have an account?"
    },
    auth_log_in: {
        id: "Masuk",
        en: "Log in"
    },
    // Auth - Shared fields
    auth_email: {
        id: "Alamat Email",
        en: "Email address"
    },
    auth_password: {
        id: "Kata Sandi",
        en: "Password"
    },
    auth_confirm_password: {
        id: "Konfirmasi Kata Sandi",
        en: "Confirm password"
    },
    auth_name: {
        id: "Nama",
        en: "Name"
    },
    auth_name_placeholder: {
        id: "Nama lengkap",
        en: "Full name"
    },
    auth_password_placeholder: {
        id: "Kata sandi",
        en: "Password"
    },
    auth_confirm_password_placeholder: {
        id: "Konfirmasi kata sandi",
        en: "Confirm password"
    },
    // Booking Page
    book_appointment: {
        id: "Pesan Jadwal",
        en: "Book an Appointment"
    },
    booking_form_subtitle: {
        id: "Isi formulir di bawah ini untuk menjadwalkan layanan Anda. Kami akan mengkonfirmasi jadwal Anda melalui WhatsApp.",
        en: "Fill out the form below to schedule your service. We will confirm your appointment via WhatsApp."
    },
    name: {
        id: "Nama Lengkap",
        en: "Full Name"
    },
    phone: {
        id: "Telepon / WhatsApp",
        en: "Phone / WhatsApp"
    },
    car_model: {
        id: "Model & Tahun Mobil",
        en: "Car Model & Year"
    },
    booking_placeholder_name: {
        id: "Nama Anda",
        en: "Your Name"
    },
    booking_placeholder_phone: {
        id: "Nomor Whatsapp Anda",
        en: "Your Phone / WhatsApp"
    },
    booking_placeholder_notes: {
        id: "Deskripsikan masalah yang Anda alami...",
        en: "Describe any issues you are experiencing..."
    },
    booking_placeholder_car_model: {
        id: "Contoh: Daihatsu Ayla 2022",
        en: "e.g. Daihatsu Ayla 2022"
    },
    date: {
        id: "Tanggal Pilihan",
        en: "Preferred Date"
    },
    time: {
        id: "Waktu Pilihan",
        en: "Preferred Time"
    },
    service_type: {
        id: "Jenis Layanan",
        en: "Service Needed"
    },
    notes: {
        id: "Catatan Tambahan",
        en: "Additional Notes"
    },
    submit_booking: {
        id: "Konfirmasi Pesanan",
        en: "Confirm Booking"
    },
    service_opt_inspection: {
        id: "Inspeksi / Pengecekan AC",
        en: "AC Inspection / Check-up"
    },
    service_opt_cleaning: {
        id: "Cuci AC",
        en: "AC Cleaning"
    },
    service_opt_freon: {
        id: "Isi Freon",
        en: "Freon Refill"
    },
    service_opt_repair: {
        id: "Perbaikan / Ganti Sparepart",
        en: "Parts Repair / Replacement"
    },
    service_opt_other: {
        id: "Lainnya / Kurang Yakin",
        en: "Other / Not Sure"
    },
    // Sparepart Section
    buy_sparepart_title: {
        id: "Beli Sparepart Sekarang!",
        en: "Buy Sparepart Now!"
    },
    buy_sparepart_desc: {
        id: "Temukan berbagai macam sparepart original untuk kenyamanan AC mobil kesayangan Anda. Kualitas terjamin dan harga terbaik.",
        en: "Find a wide range of original spare parts for your beloved car's AC comfort. Guaranteed quality and best prices."
    },
    buy_now: {
        id: "Beli Sekarang",
        en: "Buy Now"
    },
    // Spareparts Page
    spareparts_page_title: {
        id: "Beli Sparepart",
        en: "Buy Spareparts"
    },
    spareparts_page_subtitle: {
        id: "Pilih sparepart yang Anda butuhkan dan isi formulir untuk memesan.",
        en: "Select the spareparts you need and fill the form to order."
    },
    add_more_spareparts: {
        id: "Tambah Sparepart Lain",
        en: "Add More Spareparts"
    },
    remove: {
        id: "Hapus",
        en: "Remove"
    },
    form_address: {
        id: "Alamat Pengiriman",
        en: "Shipping Address"
    },
    address_placeholder: {
        id: "Masukkan alamat lengkap pengiriman...",
        en: "Enter full shipping address..."
    },
    sp_compressor: {
        id: "Kompresor AC",
        en: "AC Compressor"
    },
    sp_condenser: {
        id: "Kondensor AC",
        en: "AC Condenser"
    },
    sp_evaporator: {
        id: "Evaporator AC",
        en: "AC Evaporator"
    },
    sp_filter: {
        id: "Filter Kabin",
        en: "Cabin Filter"
    },
    sp_freon: {
        id: "Freon R134a",
        en: "R134a Freon"
    },
    confirm_purchase: {
        id: "Konfirmasi Pembelian",
        en: "Confirm Purchase"
    },
    select_sparepart: {
        id: "Pilih Sparepart",
        en: "Select Sparepart"
    },
    // Brands & Legal
    brands_header_subtitle: {
        id: "Layanan Ahli untuk",
        en: "Expert Care for"
    },
    brands_header_title_premium: {
        id: "Brand",
        en: "Premium"
    },
    brands_header_title_brands: {
        id: "Premium",
        en: "Brands"
    },
    footer_trademark_disclaimer: {
        id: "Sanggahan Merek Dagang",
        en: "Trademark Disclaimer"
    },
    footer_trademark_desc: {
        id: "Semua nama merek, logo, dan merek dagang yang digunakan di situs ini adalah milik dari pemiliknya masing-masing. Diva AC adalah pusat layanan independen dan tidak berafiliasi dengan, atau didukung oleh, merek-merek tersebut.",
        en: "All brand names, logos, and trademarks used on this site are property of their respective owners. Diva AC is an independent service center and is not affiliated with, or endorsed by, these brands."
    },
    // Dashboard
    dash_title: {
        id: "Dashboard",
        en: "Dashboard"
    },
    dash_overview: {
        id: "Ringkasan",
        en: "Overview"
    },
    dash_welcome: {
        id: "Selamat datang kembali, berikut perkembangan hari ini.",
        en: "Welcome back, here's what's happening today."
    },
    dash_search: {
        id: "Cari...",
        en: "Search..."
    },
    dash_new_service: {
        id: "Service Baru",
        en: "New Service"
    },
    dash_stat_revenue: {
        id: "Pendapatan Bulanan",
        en: "Monthly Revenue"
    },
    dash_stat_active: {
        id: "Service Aktif",
        en: "Active Services"
    },
    dash_stat_stock: {
        id: "Stok Menipis",
        en: "Low Stock Parts"
    },
    dash_stat_customers: {
        id: "Pelanggan Baru",
        en: "New Customers"
    },
    dash_active_orders: {
        id: "Daftar Service Aktif",
        en: "Active Work Orders"
    },
    dash_view_all: {
        id: "Lihat Semua",
        en: "View All"
    },
    dash_col_customer: {
        id: "Pelanggan",
        en: "Customer"
    },
    dash_col_car: {
        id: "Mobil",
        en: "Car"
    },
    dash_col_status: {
        id: "Status",
        en: "Status"
    },
    dash_status_in_progress: {
        id: "Proses",
        en: "In Progress"
    },
    dash_status_pending: {
        id: "Menunggu",
        en: "Pending"
    },
    dash_status_completed: {
        id: "Selesai",
        en: "Completed"
    },
    dash_stock_alerts: {
        id: "Peringatan Stok",
        en: "Stock Alerts"
    },
    dash_order: {
        id: "Pesan",
        en: "Order"
    },
    dash_manage_inventory: {
        id: "Kelola Inventaris",
        en: "Manage Inventory"
    }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            const saved = window.localStorage.getItem('language');
            return (saved as Language) || 'id';
        }
        return 'id';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('language', language);
        }
    }, [language]);

    const t = (key: string) => {
        return translations[key]?.[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);

    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }

    return context;
}
