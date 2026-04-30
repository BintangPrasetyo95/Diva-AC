<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="keywords" content="Bengkel AC Mobil termurah, bengkel AC mobil Lampung Tengah, bengkel AC mobil Diva AC, servis AC mobil Diva AC, perbaikan AC mobil Diva AC, AC mobil murah, AC mobil berkualitas, Metro, Diva AC Metro, Metro AC, AC, AC Mobil Metro, AC Mobil Lampung Tengah, AC Mobil Diva AC, Service, Servis, Cuci, Isi Freon, Perbaikan AC Mobil, Bengkel AC Mobil Termurah, Bengkel AC Mobil Lampung Tengah, Bengkel AC Mobil Diva AC, Servis AC Mobil Diva AC, Perbaikan AC Mobil Diva AC, AC Mobil Murah, AC Mobil Berkualitas">
        <meta name="description" content="Diva AC Bengkel AC Mobil, solusi AC mobil murah dan berkualitas di Lampung Tengah">
        <meta name="author" content="Diva AC">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="icon" type="image/png" href="/logo-optimized.png">
        <link rel="apple-touch-icon" href="/logo-optimized.png">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
        <link rel="preload" href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600&display=swap" as="style">
        <link rel="stylesheet" href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600&display=swap">

        <!-- Scripts -->
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
        @inertia
    </body>
</html>