-- ============================================
-- SEEDER DATA: USER (PREREQUISITE)
-- ============================================
-- Masukkan data user untuk system

INSERT INTO
    user (
        id_user,
        username_user,
        password_user
    )
VALUES (1, 'admin', 'password123'),
    (2, 'kasir1', 'password123'),
    (3, 'kasir2', 'password123'),
    (4, 'staff1', 'password123');

-- ============================================
-- SEEDER DATA: PENJUALAN SPAREPART
-- ============================================
-- Masukkan data dummy ke tabel penjualan_sparepart

INSERT INTO
    penjualan_sparepart (
        id_penjualansparepart,
        id_user,
        tangal_penjualansparepart,
        harga_penjualansparepart,
        jumlah_penjualansparepart,
        bayar_penjualansparepart,
        kembali_penjualansparepart
    )
VALUES
    -- April 2026
    (
        1,
        1,
        '2026-04-01',
        150000,
        2,
        300000,
        0
    ),
    (
        2,
        2,
        '2026-04-03',
        50000,
        4,
        200000,
        0
    ),
    (
        3,
        1,
        '2026-04-05',
        75000,
        1,
        100000,
        25000
    ),
    (
        4,
        3,
        '2026-04-07',
        200000,
        1,
        200000,
        0
    ),
    (
        5,
        2,
        '2026-04-10',
        300000,
        1,
        300000,
        0
    ),
    (
        6,
        1,
        '2026-04-12',
        150000,
        3,
        500000,
        50000
    ),
    (
        7,
        4,
        '2026-04-15',
        50000,
        2,
        150000,
        50000
    ),
    (
        8,
        2,
        '2026-04-18',
        75000,
        2,
        200000,
        50000
    ),
    (
        9,
        1,
        '2026-04-20',
        200000,
        2,
        450000,
        50000
    ),
    (
        10,
        3,
        '2026-04-22',
        300000,
        1,
        300000,
        0
    ),

-- May 2026
(
    11,
    2,
    '2026-05-01',
    150000,
    1,
    150000,
    0
),
(
    12,
    1,
    '2026-05-02',
    50000,
    3,
    200000,
    50000
),
(
    13,
    4,
    '2026-05-03',
    75000,
    2,
    200000,
    50000
),
(
    14,
    2,
    '2026-05-05',
    200000,
    1,
    200000,
    0
),
(
    15,
    1,
    '2026-05-07',
    300000,
    1,
    300000,
    0
),
(
    16,
    3,
    '2026-05-08',
    150000,
    2,
    350000,
    50000
),
(
    17,
    2,
    '2026-05-10',
    50000,
    5,
    300000,
    50000
),
(
    18,
    1,
    '2026-05-12',
    75000,
    1,
    100000,
    25000
),
(
    19,
    4,
    '2026-05-14',
    200000,
    1,
    200000,
    0
),
(
    20,
    2,
    '2026-05-16',
    300000,
    2,
    650000,
    50000
);

-- ============================================
-- SEEDER DATA: PENJUALAN SPAREPART MENGGUNAKAN SPAREPART
-- ============================================
-- Masukkan data relasi antara penjualan dengan sparepart yang terjual

INSERT INTO
    penjualansparepartmenggunakansparepart (
        id_penjualansparepart,
        id_sparepart
    )
VALUES
    -- Penjualan 1-5
    (1, 1), -- Penjualan 1: Oli Mesin
    (2, 2), -- Penjualan 2: Busi
    (3, 3), -- Penjualan 3: Filter Udara
    (4, 4), -- Penjualan 4: Rem Cakram
    (5, 5), -- Penjualan 5: Aki

-- Penjualan 6-10
(6, 1), -- Penjualan 6: Oli Mesin
(7, 2), -- Penjualan 7: Busi
(8, 3), -- Penjualan 8: Filter Udara
(9, 4), -- Penjualan 9: Rem Cakram
(10, 5), -- Penjualan 10: Aki

-- Penjualan 11-15
(11, 1), -- Penjualan 11: Oli Mesin
(12, 2), -- Penjualan 12: Busi
(13, 3), -- Penjualan 13: Filter Udara
(14, 4), -- Penjualan 14: Rem Cakram
(15, 5), -- Penjualan 15: Aki

-- Penjualan 16-20
(16, 1), -- Penjualan 16: Oli Mesin
(17, 2), -- Penjualan 17: Busi
(18, 3), -- Penjualan 18: Filter Udara
(19, 4), -- Penjualan 19: Rem Cakram
(20, 5);
-- Penjualan 20: Aki

-- ============================================
-- VERIFIKASI DATA YANG DIMASUKKAN
-- ============================================
SELECT 'Total Penjualan Sparepart' AS label, COUNT(*) AS jumlah
FROM penjualan_sparepart;

SELECT 'Total Relasi Penjualan & Sparepart' AS label, COUNT(*) AS jumlah
FROM
    penjualansparepartmenggunakansparepart;

-- ============================================
-- PREVIEW DATA PENJUALAN DENGAN SPAREPART
-- ============================================
SELECT ps.id_penjualansparepart, sp.nama_sparepart, ps.tangal_penjualansparepart, ps.harga_penjualansparepart, ps.jumlah_penjualansparepart, ROUND(
        ps.harga_penjualansparepart * ps.jumlah_penjualansparepart, 0
    ) AS total
FROM
    penjualan_sparepart ps
    LEFT JOIN penjualansparepartmenggunakansparepart psm ON ps.id_penjualansparepart = psm.id_penjualansparepart
    LEFT JOIN sparepart sp ON psm.id_sparepart = sp.id_sparepart
ORDER BY ps.tangal_penjualansparepart DESC;