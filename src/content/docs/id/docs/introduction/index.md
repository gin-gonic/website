---
title: "Pengantar"
sidebar:
  order: 1
---

Gin adalah framework web yang ditulis dalam Go (Golang). Gin memiliki API mirip Martini dengan performa yang jauh lebih baik, hingga 40 kali lebih cepat berkat [httprouter](https://github.com/julienschmidt/httprouter). Jika Anda membutuhkan performa dan produktivitas yang baik, Anda akan menyukai Gin.

Di bagian ini kami akan membahas apa itu Gin, masalah apa yang dipecahkannya, dan bagaimana Gin dapat membantu proyek Anda.

Atau, jika Anda sudah siap menggunakan Gin dalam proyek Anda, kunjungi [Memulai Cepat](https://gin-gonic.com/en/docs/quickstart/).

## Fitur

### Cepat

Routing berbasis radix tree, jejak memori kecil. Tanpa reflection. Performa API yang dapat diprediksi.

### Dukungan Middleware

Permintaan HTTP yang masuk dapat ditangani oleh rangkaian middleware dan aksi akhir.
Contoh: Logger, Otorisasi, GZIP, dan akhirnya mengirim pesan ke DB.

### Bebas Crash

Gin dapat menangkap panic yang terjadi selama permintaan HTTP dan memulihkannya. Dengan demikian, server Anda akan selalu tersedia. Sebagai contoh - Anda juga bisa melaporkan panic ini ke Sentry!

### Validasi JSON

Gin dapat mem-parse dan memvalidasi JSON dari sebuah permintaan - misalnya, memeriksa keberadaan nilai yang wajib diisi.

### Pengelompokan Rute

Organisasikan rute Anda lebih baik. Memerlukan otorisasi vs tidak memerlukan, versi API berbeda... Selain itu, grup dapat disusun bertingkat tanpa batas tanpa menurunkan performa.

### Manajemen Error

Gin menyediakan cara praktis untuk mengumpulkan semua error yang terjadi selama permintaan HTTP. Pada akhirnya, middleware dapat menulisnya ke file log, ke database, dan mengirimnya melalui jaringan.

### Rendering Bawaan

Gin menyediakan API yang mudah digunakan untuk rendering JSON, XML, dan HTML.

### Dapat Diperluas

Membuat middleware baru sangat mudah, cukup lihat contoh kodenya.

## Gin v1. Stabil

- Router tanpa alokasi.
- Masih menjadi router dan framework HTTP tercepat. Dari routing hingga penulisan.
- Rangkaian lengkap pengujian unit.
- Teruji dalam pertempuran.
- API dibekukan, rilis baru tidak akan merusak kode Anda.
