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
        id: "Restorasi AC Klasik",
        en: "Vintage AC Restoration"
    },
    service_vintage_desc: {
        id: "Meresorasi sistem kontrol iklim pada kendaraan klasik dan vintage ke standar modern.",
        en: "Restoring climate control systems in classic and vintage vehicles to modern standards."
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
    testimonial_1_name: {
        id: "James Wilson",
        en: "James Wilson"
    },
    testimonial_1_role: {
        id: "Pemilik BMW",
        en: "BMW Owner"
    },
    testimonial_1_content: {
        id: "Servis AC terbaik di kota. Sistem pendingin mobil saya terasa seperti baru lagi. Tim yang sangat profesional!",
        en: "The best AC service in town. My car cooling system feels like new again. Highly professional team!"
    },
    testimonial_2_name: {
        id: "Sarah Chen",
        en: "Sarah Chen"
    },
    testimonial_2_role: {
        id: "Pemilik Tesla Model 3",
        en: "Tesla Model 3 Owner"
    },
    testimonial_2_content: {
        id: "Diagnosa cepat dan harga transparan. Mereka memperbaiki masalah kompresor rumit yang tidak bisa dilakukan orang lain.",
        en: "Quick diagnostics and transparent pricing. They fixed a complex compressor issue that others couldnt."
    },
    testimonial_3_name: {
        id: "Michael Ross",
        en: "Michael Ross"
    },
    testimonial_3_role: {
        id: "Kolektor Mobil Klasik",
        en: "Vintage Collector"
    },
    testimonial_3_content: {
        id: "Mereka merestorasi AC di Mustang 1969 saya dengan sempurna. Perhatian mereka terhadap detail tidak tertandingi.",
        en: "They restored the AC in my 1969 Mustang perfectly. Their attention to detail is unmatched."
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
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem('language');
        return (saved as Language) || 'id';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
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
