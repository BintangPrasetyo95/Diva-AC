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
    service_diagnostic_title: {
        id: "Diagnostik Sistem",
        en: "System Diagnostics"
    },
    service_diagnostic_desc: {
        id: "Pemeriksaan menyeluruh menggunakan alat scan komputer canggih.",
        en: "Thorough inspection using advanced computer scanning tools."
    },
    service_overhaul_title: {
        id: "Overhaul Kompresor",
        en: "Compressor Overhaul"
    },
    service_overhaul_desc: {
        id: "Perbaikan total kompresor untuk mengembalikan performa seperti baru.",
        en: "Complete compressor repair to restore performance to like-new condition."
    },
    service_whats_included: {
        id: "Apa yang Termasuk",
        en: "What's Included"
    },
    service_comp_solutions: {
        id: "Solusi Komprehensif",
        en: "Comprehensive Solutions"
    },
    service_why_choose: {
        id: "Mengapa Memilih Ini",
        en: "Why Choose This"
    },
    service_expert_benefits: {
        id: "Manfaat Ahli",
        en: "Expert Benefits"
    },
    service_ready_start: {
        id: "Siap untuk memulai?",
        en: "Ready to start?"
    },
    service_book_now_cta: {
        id: "Pesan layanan ini sekarang",
        en: "Book this service now"
    },
    // Features & Benefits
    f_ac_1: { id: "Diagnostik Sistem Menyeluruh", en: "Full System Diagnostics" },
    f_ac_2: { id: "Pembersihan Evaporator", en: "Evaporator Cleaning" },
    f_ac_3: { id: "Flushing Kondensor", en: "Condenser Flushing" },
    f_ac_4: { id: "Deteksi Kebocoran", en: "Leak Detection" },
    b_ac_1: { id: "Performa Pendinginan Optimal", en: "Optimal Cooling Performance" },
    b_ac_2: { id: "Kualitas Udara Lebih Baik", en: "Improved Air Quality" },
    b_ac_3: { id: "Usia Komponen Lebih Lama", en: "Longer Component Life" },
    b_ac_4: { id: "Efisiensi Bahan Bakar", en: "Fuel Efficiency" },
    
    f_sp_1: { id: "Kompresor Orisinal", en: "Genuine Compressors" },
    f_sp_2: { id: "Kondensor Berkualitas Tinggi", en: "High-Quality Condensers" },
    f_sp_3: { id: "Katup Ekspansi", en: "Expansion Valves" },
    f_sp_4: { id: "Receiver Drier", en: "Receiver Driers" },
    b_sp_1: { id: "Performa Standar Pabrik", en: "Factory Performance" },
    b_sp_2: { id: "Garansi Terjamin", en: "Warranty Guaranteed" },
    b_sp_3: { id: "Kecocokan Sempurna", en: "Perfect Fitment" },
    b_sp_4: { id: "Ketahanan yang Handal", en: "Reliable Longevity" },
    
    f_mn_1: { id: "Pemeriksaan Berkala", en: "Periodic Check-ups" },
    f_mn_2: { id: "Inspeksi Sabuk/Belt", en: "Belt Inspection" },
    f_mn_3: { id: "Uji Tekanan", en: "Pressure Testing" },
    f_mn_4: { id: "Penggantian Filter", en: "Filter Replacement" },
    b_mn_1: { id: "Mencegah Perbaikan Mahal", en: "Prevent Costly Repairs" },
    b_mn_2: { id: "Ketenangan Pikiran", en: "Peace of Mind" },
    b_mn_3: { id: "Kenyamanan Konsisten", en: "Consistent Comfort" },
    b_mn_4: { id: "Nilai Jual Kembali Kendaraan", en: "Vehicle Resale Value" },
    
    f_fr_1: { id: "Refrigeran Kemurnian Tinggi", en: "High-Purity Refrigerant" },
    f_fr_2: { id: "Pengukuran Presisi", en: "Precise Measurement" },
    f_fr_3: { id: "Uji Vakum", en: "Vacuum Testing" },
    f_fr_4: { id: "Isi Ulang Pelumas", en: "Lubricant Recharge" },
    b_fr_1: { id: "Pendinginan Instan", en: "Instant Cooling" },
    b_fr_2: { id: "Gas Ramah Lingkungan", en: "Eco-Friendly Gases" },
    b_fr_3: { id: "Perlindungan Kompresor", en: "Compressor Protection" },
    b_fr_4: { id: "Beban Energi Rendah", en: "Low Energy Draw" },
    
    f_or_1: { id: "Perawatan Ozon", en: "Ozone Treatment" },
    f_or_2: { id: "Fogging Antibakteri", en: "Antibacterial Fogging" },
    f_or_3: { id: "Sanitasi Filter", en: "Filter Sanitization" },
    f_or_4: { id: "Pembersihan Saluran Dalam", en: "Deep Duct Cleaning" },
    b_or_1: { id: "Aroma Kabin Segar", en: "Fresh Cabin Scent" },
    b_or_2: { id: "Eliminasi Alergen", en: "Eliminate Allergens" },
    b_or_3: { id: "Lingkungan Lebih Sehat", en: "Healthier Environment" },
    b_or_4: { id: "Menghilangkan Bau Membandel", en: "Remove Stubborn Smells" },
    
    f_cl_1: { id: "Pemasangan Alarm", en: "Alarm Installation" },
    f_cl_2: { id: "Perbaikan Central Lock", en: "Central Lock Repair" },
    f_cl_3: { id: "Servis Power Window", en: "Power Window Service" },
    f_cl_4: { id: "Kabel Elektrikal", en: "Electrical Wiring" },
    b_cl_1: { id: "Keamanan Kendaraan", en: "Vehicle Security" },
    b_cl_2: { id: "Kemudahan Penggunaan", en: "Convenience" },
    b_cl_3: { id: "Operasi yang Halus", en: "Smooth Operation" },
    b_cl_4: { id: "Utamakan Keselamatan", en: "Safety First" },
    
    f_dg_1: { id: "Scanning Komputerisasi", en: "Computerized Scanning" },
    f_dg_2: { id: "Kalibrasi Sensor", en: "Sensor Calibration" },
    f_dg_3: { id: "Uji Kontinuitas Elektrikal", en: "Electrical Continuity Test" },
    f_dg_4: { id: "Pembersihan Kode Error", en: "Error Code Clearing" },
    b_dg_1: { id: "Akurasi Tepat", en: "Pinpoint Accuracy" },
    b_dg_2: { id: "Troubleshooting Cepat", en: "Fast Troubleshooting" },
    b_dg_3: { id: "Cegah Spekulasi Ganti Part", en: "Prevent Parts Guessing" },
    b_dg_4: { id: "Laporan Kesehatan Digital", en: "Digital Health Report" },
    
    f_ov_1: { id: "Pembongkaran Total", en: "Full Disassembly" },
    f_ov_2: { id: "Pembersihan Internal", en: "Internal Cleaning" },
    f_ov_3: { id: "Ganti Seal & Gasket", en: "Seal & Gasket Replacement" },
    f_ov_4: { id: "Uji Tekanan", en: "Pressure Testing" },
    b_ov_1: { id: "Kembalikan Daya Dingin", en: "Restore Cooling Power" },
    b_ov_2: { id: "Operasi Hening", en: "Quiet Operation" },
    b_ov_3: { id: "Perbaikan Hemat Biaya", en: "Cost-Effective Repair" },
    b_ov_4: { id: "Perpanjang Usia Komponen", en: "Extended Component Life" },
    service_stat_clients: { id: "Pelanggan Puas", en: "Satisfied Clients" },
    service_stat_experience: { id: "Tahun Pengalaman", en: "Years Experience" },
    service_stat_parts: { id: "Suku Cadang Asli", en: "Genuine Parts" },
    service_stat_support: { id: "Respon Dukungan", en: "Support Response" },
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
    show_all: {
        id: "Tampilkan Semua",
        en: "Show All"
    },
    show_less: {
        id: "Tampilkan Lebih Sedikit",
        en: "Show Less"
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
    auth_logout: {
        id: "Keluar",
        en: "Log out"
    },
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
        id: "Layanan Ahli dengan",
        en: "Expert Care with"
    },
    brands_header_title_premium: {
        id: "Brand",
        en: "Trusted"
    },
    brands_header_title_brands: {
        id: "Terpercaya",
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
        id: "Service",
        en: "Services"
    },
    dash_stat_stock: {
        id: "Spare part",
        en: "Spare Parts"
    },
    dash_stat_customers: {
        id: "Pelanggan",
        en: "Customers"
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
    },
    dash_store_open: {
        id: "BUKA",
        en: "OPEN"
    },
    dash_store_closed: {
        id: "TUTUP",
        en: "CLOSED"
    },
    dash_pos: {
        id: "Kasir (POS)",
        en: "Point of Sale (POS)"
    },
    dash_system: {
        id: "Sistem",
        en: "System"
    },
    dash_website_content: {
        id: "Manajemen Website",
        en: "Website Content"
    },
    dash_gallery: {
        id: "Galeri",
        en: "Gallery"
    },
    dash_gallery_desc: {
        id: "Kelola foto showcase bengkel Anda.",
        en: "Manage your workshop showcase photos."
    },
    dash_add_new: {
        id: "Tambah Baru",
        en: "Add New"
    },
    dash_display_icon: {
        id: "Ikon Tampilan",
        en: "Display Icon"
    },
    dash_sort_order: {
        id: "Urutan",
        en: "Sort Order"
    },
    dash_visible_on_landing: {
        id: "Tampilkan di Beranda",
        en: "Visible on Landing"
    },
    dash_upload_photo: {
        id: "Unggah Foto Baru",
        en: "Upload New Photo"
    },
    dash_edit_info: {
        id: "Edit Info",
        en: "Edit Info"
    },
    dash_save_changes: {
        id: "Simpan Perubahan",
        en: "Save Changes"
    },
    dash_general_config: {
        id: "Konfigurasi Umum",
        en: "General Configuration"
    },
    dash_multilingual_content: {
        id: "Konten Multibahasa",
        en: "Multilingual Content"
    },
    dash_visual_assets: {
        id: "Aset Visual",
        en: "Visual Assets"
    },
    dash_service_image: {
        id: "Gambar Layanan",
        en: "Service Image"
    },
    dash_card_summary_id: {
        id: "Ringkasan Kartu (ID)",
        en: "Card Summary (ID)"
    },
    dash_card_summary_en: {
        id: "Ringkasan Kartu (EN)",
        en: "Card Summary (EN)"
    },
    dash_page_content_id: {
        id: "Konten Halaman (ID)",
        en: "Page Content (ID)"
    },
    dash_page_content_en: {
        id: "Konten Halaman (EN)",
        en: "Page Content (EN)"
    },
    dash_saving: {
        id: "Menyimpan...",
        en: "Saving Changes..."
    },
    dash_update_all: {
        id: "Perbarui Semua Layanan",
        en: "Update All Services"
    },
    dash_saved_success: {
        id: "Berhasil disimpan",
        en: "All Changes Saved"
    },
    dash_settings: {
        id: "Pengaturan",
        en: "Settings"
    },
    dash_services_settings: {
        id: "Pengaturan Layanan",
        en: "Service Settings"
    },
    dash_help: {
        id: "Bantuan & Dukungan",
        en: "Help & Support"
    },
    dash_inventory_desc: {
        id: "Kelola stok suku cadang dan peringatan.",
        en: "Manage spare parts stock and alerts."
    },
    dash_total_services: {
        id: "Total Layanan",
        en: "Total Services"
    },
    dash_filter_all: {
        id: "Semua",
        en: "All"
    },
    dash_sort_date: {
        id: "Tanggal",
        en: "Date"
    },
    dash_sort_name: {
        id: "Nama",
        en: "Name"
    },
    dash_sort_id: {
        id: "ID",
        en: "ID"
    },
    dash_sort_stock: {
        id: "Stok",
        en: "Stock"
    },
    dash_sort_price: {
        id: "Harga",
        en: "Price"
    },
    dash_gender: {
        id: "Jenis Kelamin",
        en: "Gender"
    },
    dash_ascending: {
        id: "Menaik",
        en: "Ascending"
    },
    dash_descending: {
        id: "Menurun",
        en: "Descending"
    },
    dash_newest: {
        id: "Terbaru",
        en: "Newest"
    },
    dash_oldest: {
        id: "Terlama",
        en: "Oldest"
    },
    dash_management: {
        id: "Manajemen",
        en: "Management"
    },
    dash_services_desc: {
        id: "Kelola antrian service dan riwayat pelanggan.",
        en: "Manage service queue and customer history."
    },
    dash_col_id: {
        id: "ID",
        en: "ID"
    },
    dash_col_mechanic: {
        id: "Mekanik",
        en: "Mechanic"
    },
    dash_col_total: {
        id: "Total",
        en: "Total"
    },
    dash_no_services: {
        id: "Tidak ada layanan ditemukan",
        en: "No services found"
    },
    dash_view_details: {
        id: "Lihat Detail",
        en: "View Details"
    },
    dash_edit_order: {
        id: "Edit Pesanan",
        en: "Edit Order"
    },
    dash_cancel_service: {
        id: "Batalkan Layanan",
        en: "Cancel Service"
    },
    dash_filter: {
        id: "Filter",
        en: "Filter"
    },
    dash_sort: {
        id: "Urutkan",
        en: "Sort"
    },
    dash_col_item_name: {
        id: "Nama Barang",
        en: "Item Name"
    },
    dash_col_category: {
        id: "Kategori",
        en: "Category"
    },
    dash_col_stock_status: {
        id: "Status Stok",
        en: "Stock Status"
    },
    dash_col_price: {
        id: "Harga",
        en: "Price"
    },
    dash_edit_details: {
        id: "Edit Detail",
        en: "Edit Details"
    },
    dash_update_stock: {
        id: "Update Stok",
        en: "Update Stock"
    },
    dash_delete_item: {
        id: "Hapus Barang",
        en: "Delete Item"
    },
    dash_no_items: {
        id: "Tidak ada barang ditemukan",
        en: "No items found"
    },
    dash_logs: {
        id: "Log",
        en: "Logs"
    },
    dash_add_part: {
        id: "Tambah Suku Cadang",
        en: "Add Part"
    },
    dash_total_items: {
        id: "Total Barang",
        en: "Total Items"
    },
    dash_low_stock: {
        id: "Stok Menipis",
        en: "Low Stock"
    },
    dash_total_value: {
        id: "Total Nilai",
        en: "Total Value"
    },
    dash_out_of_stock: {
        id: "Stok Habis",
        en: "Out of Stock"
    },
    dash_low_stock_alert: {
        id: "Stok Rendah",
        en: "Low Stock"
    },
    dash_in_stock: {
        id: "Tersedia",
        en: "In Stock"
    },
    dash_inventory: {
        id: "Inventaris",
        en: "Inventory"
    },
    dash_database: {
        id: "Database",
        en: "Database"
    },
    dash_customers_desc: {
        id: "Kelola data pelanggan dan riwayat kendaraan.",
        en: "Manage customer data and vehicle history."
    },
    dash_add_customer: {
        id: "Tambah Pelanggan",
        en: "Add Customer"
    },
    dash_total_vehicles: {
        id: "Total Kendaraan",
        en: "Total Vehicles"
    },
    dash_new_this_month: {
        id: "Baru Bulan Ini",
        en: "New This Month"
    },
    dash_col_joined_date: {
        id: "Tanggal Bergabung",
        en: "Joined Date"
    },
    dash_male: {
        id: "Laki-laki",
        en: "Male"
    },
    dash_female: {
        id: "Perempuan",
        en: "Female"
    },
    dash_registration: {
        id: "Registrasi",
        en: "Registration"
    },
    dash_edit_profile: {
        id: "Edit Profil",
        en: "Edit Profile"
    },
    dash_manage_cars: {
        id: "Kelola Mobil",
        en: "Manage Cars"
    },
    dash_delete_customer: {
        id: "Hapus Pelanggan",
        en: "Delete Customer"
    },
    dash_no_customers: {
        id: "Tidak ada pelanggan ditemukan",
        en: "No customers found"
    },
    dash_confirm_q: {
        id: "Yakin?",
        en: "Are you sure?"
    },
    dash_yes: {
        id: "Ya",
        en: "Yes"
    },
    dash_no: {
        id: "Tidak",
        en: "No"
    },
    dash_service_details: {
        id: "Detail Layanan",
        en: "Service Details"
    },
    dash_customer_info: {
        id: "Informasi Pelanggan",
        en: "Customer Information"
    },
    dash_vehicle_info: {
        id: "Informasi Kendaraan",
        en: "Vehicle Information"
    },
    dash_service_info: {
        id: "Informasi Layanan",
        en: "Service Information"
    },
    dash_items_summary: {
        id: "Ringkasan Barang",
        en: "Items Summary"
    },
    dash_subtotal: {
        id: "Subtotal",
        en: "Subtotal"
    },
    dash_tax: {
        id: "Pajak",
        en: "Tax"
    },
    dash_grand_total: {
        id: "Total Keseluruhan",
        en: "Grand Total"
    },
    dash_print_invoice: {
        id: "Cetak Invoice",
        en: "Print Invoice"
    },
    dash_complete_service: {
        id: "Selesaikan Layanan",
        en: "Complete Service"
    },
    dash_back_to_services: {
        id: "Kembali ke Layanan",
        en: "Back to Services"
    },
    dash_col_qty: {
        id: "Jumlah",
        en: "Qty"
    }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    // Start with a fixed default language to avoid hydration mismatch
    const [language, setLanguage] = useState<Language>('id');
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // Sync with localStorage after mount
        if (typeof window !== 'undefined') {
            const saved = window.localStorage.getItem('language');
            if (saved && (saved === 'id' || saved === 'en')) {
                setLanguage(saved as Language);
            }
            setIsHydrated(true);
        }
    }, []);

    useEffect(() => {
        if (isHydrated && typeof window !== 'undefined') {
            window.localStorage.setItem('language', language);
        }
    }, [language, isHydrated]);

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
