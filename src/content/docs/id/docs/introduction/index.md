---
title: "Pendahuluan"
sidebar:
  order: 1
---

Gin adalah framework web yang ditulis menggunakan Go (Golang). Framework ini memiliki API yang mirip dengan Martini, tapi dengan performa hingga 40 kali lebih cepat berkat [httprouter](https://github.com/julienschmidt/httprouter). Kalau Anda membutuhkan performa tinggi dan produktivitas, Anda akan menyukai Gin.

Di bagian ini kita akan membahas apa itu Gin, masalah apa yang dapat diselesaikannya, dan bagaimana Gin dapat membantu proyek Anda.

Atau, jika Anda sudah siap menggunakan Gin di proyek Anda, kunjungi [Quickstart](../quickstart/).

## Fitur

### Cepat

Routing berbasis radix tree, memori footprint kecil. Tidak ada penggunaan reflection. Kinerja API yang dapat diprediksi.

### Dukungan middleware

Permintaan HTTP yang masuk dapat diproses oleh serangkaian middleware sebelum tindakan akhirnya dieksekusi. Sebagai contoh: Logger, Authorization, GZIP, dan selanjutnya pesan disimpan ke dalam DB.

### Bebas crash

Gin dapat menangkap dan memulihkan panic yang terjadi selama pemrosesan permintaan HTTP. Dengan begitu, server Anda akan selalu tersedia. Panic ini juga dapat dilaporkan ke layanan seperti Sentry!

### Validasi JSON

Gin dapat melakukan parse dan validasi JSON dari suatu permintaan, seperti memeriksa keberadaan nilai yang wajib diisi.

### Pengelompokan route

Atur route dengan lebih rapi. Anda bisa mengelompokkan route yang memerlukan otorisasi dan yang tidak, atau berdasarkan versi API yang berbeda. Pengelompokan ini bisa bersarang tanpa batas dan tidak akan menurunkan performa.

### Manajemen error

Gin menyediakan cara yang mudah untuk mengumpulkan semua error yang terjadi selama pemrosesan permintaan HTTP. Nantinya, middleware dapat mencatat error tersebut ke file log, database, dan mengirimnya melalui jaringan.

### Rendering bawaan

Gin menyediakan API yang mudah digunakan untuk melakukan rendering dalam format JSON, XML, dan HTML.

### Extendable

Sangat mudah membuat middleware baru, Anda bisa langsung melihat contoh kodenya.
