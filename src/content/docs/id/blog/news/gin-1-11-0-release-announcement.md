---
title: "Mengumumkan Gin 1.11.0: HTTP/3, Peningkatan Form, Performa & Lainnya"
linkTitle: "Pengumuman Rilis Gin 1.11.0"
lastUpdated: 2025-09-21
---

## Gin v1.11.0 Telah Hadir

Kami dengan senang hati mengumumkan rilis Gin v1.11.0, yang membawa sejumlah besar fitur baru, peningkatan performa, dan perbaikan bug ke framework web yang dicintai ini. Rilis ini melanjutkan komitmen Gin terhadap kecepatan, fleksibilitas, dan pengembangan Go modern.

### Fitur Utama

- **Dukungan HTTP/3 Eksperimental:** Gin kini mendukung HTTP/3 eksperimental melalui [quic-go](https://github.com/quic-go/quic-go)! Jika Anda ingin mencoba protokol transport web terbaru, sekaranglah kesempatannya. ([#3210](https://github.com/gin-gonic/gin/pull/3210))

- **Binding Form yang Lebih Baik:** Kami telah melakukan peningkatan besar pada binding form:
  - Dukungan format koleksi array dalam form ([#3986](https://github.com/gin-gonic/gin/pull/3986))
  - Unmarshalling string slice kustom untuk tag form ([#3970](https://github.com/gin-gonic/gin/pull/3970))
  - Nilai default untuk koleksi ([#4048](https://github.com/gin-gonic/gin/pull/4048))

- **Tipe Binding yang Ditingkatkan:** Bind teks biasa dengan mudah menggunakan metode `BindPlain` baru ([#3904](https://github.com/gin-gonic/gin/pull/3904)), ditambah dukungan untuk format unixMilli dan unixMicro ([#4190](https://github.com/gin-gonic/gin/pull/4190)).

- **Peningkatan API Context:** `GetXxx` kini mendukung lebih banyak tipe Go native ([#3633](https://github.com/gin-gonic/gin/pull/3633)), membuat pengambilan data context yang type-safe lebih mudah.

- **Pembaruan Filesystem:** `OnlyFilesFS` yang baru kini diekspor, diuji, dan didokumentasikan ([#3939](https://github.com/gin-gonic/gin/pull/3939)).

### Performa & Peningkatan

- **Penanganan Data Form yang Lebih Cepat:** Optimasi internal untuk parsing form meningkatkan performa ([#4339](https://github.com/gin-gonic/gin/pull/4339)).
- Refaktor inti, rendering, dan logika context untuk ketangguhan dan kejelasan ([daftar PR lengkap di changelog](../releases/release111.md)).

### Perbaikan Bug

- **Keandalan Middleware:** Memperbaiki bug langka di mana middleware bisa masuk kembali secara tidak terduga ([#3987](https://github.com/gin-gonic/gin/pull/3987)).
- Peningkatan stabilitas binding form TOML ([#4193](https://github.com/gin-gonic/gin/pull/4193)).
- Tidak ada lagi panic saat menangani permintaan "method not allowed" pada tree kosong ([#4003](https://github.com/gin-gonic/gin/pull/4003)).
- Peningkatan umum pada penanganan context, race condition, dan lainnya.

### Build, Dependensi & Pembaruan CI

- Dukungan untuk **Go 1.25** dalam workflow CI/CD, ditambah linter baru yang diaktifkan untuk kesehatan kode yang lebih ketat ([#4341](https://github.com/gin-gonic/gin/pull/4341), [#4010](https://github.com/gin-gonic/gin/pull/4010)).
- Pemindaian kerentanan Trivy kini terintegrasi dengan CI ([#4359](https://github.com/gin-gonic/gin/pull/4359)).
- Beberapa peningkatan dependensi, termasuk `sonic`, `setup-go`, `quic-go`, dan lainnya.

### Dokumentasi

- Dokumentasi yang diperluas, changelog yang diperbarui, perbaikan tata bahasa dan contoh kode, serta dokumentasi Portugis baru ([#4078](https://github.com/gin-gonic/gin/pull/4078)).

---

Gin 1.11.0 adalah bukti komunitas aktif dan pengembangan berkelanjutan kami. Kami menghargai setiap kontributor, pelapor masalah, dan pengguna yang menjaga Gin tetap tajam dan relevan untuk aplikasi web modern.

Siap mencoba Gin 1.11.0? [Upgrade di GitHub](https://github.com/gin-gonic/gin/releases/tag/v1.11.0) dan beri tahu kami pendapat Anda!
