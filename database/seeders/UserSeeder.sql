-- ============================================
-- SEEDER DATA: USER
-- ============================================
-- Masukkan data user untuk system

INSERT INTO user (id_user, username_user, password_user) VALUES
(1, 'admin', 'password123'),
(2, 'kasir1', 'password123'),
(3, 'kasir2', 'password123'),
(4, 'staff1', 'password123');

-- Verifikasi
SELECT * FROM user;
