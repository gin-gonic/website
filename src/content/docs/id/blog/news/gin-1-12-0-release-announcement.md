---
title: "Mengumumkan Gin 1.12.0: Dukungan BSON, Peningkatan Context, Performa & Lainnya"
linkTitle: "Pengumuman Rilis Gin 1.12.0"
lastUpdated: 2026-02-28
---

## Gin v1.12.0 Telah Hadir

Kami sangat senang mengumumkan rilis Gin v1.12.0, yang dikemas dengan fitur baru, peningkatan performa yang signifikan, dan serangkaian perbaikan bug yang solid. Rilis ini memperdalam dukungan Gin untuk protokol modern, menyempurnakan pengalaman pengembang, dan melanjutkan tradisi proyek untuk tetap cepat dan ringan.

### Fitur Utama

- **Dukungan Protokol BSON:** Layer render kini mendukung encoding BSON, membuka jalan untuk pertukaran data biner yang lebih efisien ([#4145](https://github.com/gin-gonic/gin/pull/4145)).

- **Metode Context Baru:** Dua helper baru membuat penanganan error lebih bersih dan lebih idiomatis:
  - `GetError` dan `GetErrorSlice` untuk pengambilan error yang type-safe dari context ([#4502](https://github.com/gin-gonic/gin/pull/4502))
  - Metode `Delete` untuk menghapus key dari context ([#38e7651](https://github.com/gin-gonic/gin/commit/38e7651))

- **Binding Fleksibel:** Binding URI dan query kini menghormati `encoding.UnmarshalText`, memberi Anda lebih banyak kontrol atas deserialisasi tipe kustom ([#4203](https://github.com/gin-gonic/gin/pull/4203)).

- **Opsi Escaped Path:** Opsi engine baru memungkinkan Anda memilih untuk menggunakan path permintaan yang di-escape (raw) untuk routing ([#4420](https://github.com/gin-gonic/gin/pull/4420)).

- **Protocol Buffers dalam Content Negotiation:** `context` kini mendukung Protocol Buffers sebagai tipe konten yang dapat dinegosiasikan, membuat respons bergaya gRPC lebih mudah diintegrasikan ([#4423](https://github.com/gin-gonic/gin/pull/4423)).

- **Latensi Berwarna di Logger:** Logger default kini merender latensi dengan warna, memudahkan untuk mendeteksi permintaan lambat secara sekilas ([#4146](https://github.com/gin-gonic/gin/pull/4146)).

### Performa & Peningkatan

- **Optimasi Router Tree:** Beberapa peningkatan pada radix tree mengurangi alokasi dan mempercepat parsing path:
  - Alokasi lebih sedikit di `findCaseInsensitivePath` ([#4417](https://github.com/gin-gonic/gin/pull/4417))
  - Parsing path menggunakan `strings.Count` untuk efisiensi ([#4246](https://github.com/gin-gonic/gin/pull/4246))
  - Regex diganti dengan fungsi kustom di `redirectTrailingSlash` ([#4414](https://github.com/gin-gonic/gin/pull/4414))
- **Optimasi Recovery:** Pembacaan stack trace kini lebih efisien ([#4466](https://github.com/gin-gonic/gin/pull/4466)).
- **Peningkatan Logger:** Output query string kini dapat dilewati melalui konfigurasi ([#4547](https://github.com/gin-gonic/gin/pull/4547)).
- **Trust Unix Socket:** Header `X-Forwarded-For` kini selalu dipercaya ketika permintaan datang melalui Unix socket ([#3359](https://github.com/gin-gonic/gin/pull/3359)).
- **Keamanan Flush:** `Flush()` tidak lagi panic ketika `http.ResponseWriter` yang mendasari tidak mengimplementasikan `http.Flusher` ([#4479](https://github.com/gin-gonic/gin/pull/4479)).
- **Refaktor Kualitas Kode:** Penanganan map yang lebih bersih dengan `maps.Copy` dan `maps.Clone`, konstanta bernama menggantikan magic number, loop range-over-int yang dimodernisasi, dan lainnya ([#4352](https://github.com/gin-gonic/gin/pull/4352), [#4333](https://github.com/gin-gonic/gin/pull/4333), [#4529](https://github.com/gin-gonic/gin/pull/4529), [#4392](https://github.com/gin-gonic/gin/pull/4392)).

### Perbaikan Bug

- **Panic Router Diperbaiki:** Menyelesaikan panic di `findCaseInsensitivePathRec` ketika `RedirectFixedPath` diaktifkan ([#4535](https://github.com/gin-gonic/gin/pull/4535)).
- **Content-Length di Data Render:** `Data.Render` kini menulis header `Content-Length` dengan benar ([#4206](https://github.com/gin-gonic/gin/pull/4206)).
- **ClientIP dengan Beberapa Header:** `ClientIP` kini menangani permintaan dengan beberapa nilai header `X-Forwarded-For` dengan benar ([#4472](https://github.com/gin-gonic/gin/pull/4472)).
- **Kasus Edge Binding:** Memperbaiki error nilai kosong pada binding ([#2169](https://github.com/gin-gonic/gin/pull/2169)) dan meningkatkan penanganan slice/array kosong pada binding form ([#4380](https://github.com/gin-gonic/gin/pull/4380)).
- **Rute Literal Colon:** Rute dengan literal colon kini berfungsi dengan benar dengan `engine.Handler()` ([#4415](https://github.com/gin-gonic/gin/pull/4415)).
- **Kebocoran File Descriptor:** `RunFd` kini menutup handle `os.File` dengan benar untuk mencegah kebocoran resource ([#4422](https://github.com/gin-gonic/gin/pull/4422)).
- **Perilaku Hijack:** Menyempurnakan perilaku hijack untuk memodelkan siklus hidup respons dengan benar ([#4373](https://github.com/gin-gonic/gin/pull/4373)).
- **Recovery:** `http.ErrAbortHandler` kini ditekan di middleware recovery sesuai yang dimaksudkan ([#4336](https://github.com/gin-gonic/gin/pull/4336)).
- **Ketidakcocokan Versi Debug:** Memperbaiki string versi yang salah dilaporkan dalam mode debug ([#4403](https://github.com/gin-gonic/gin/pull/4403)).

### Build, Dependensi & Pembaruan CI

- **Go 1.25 Minimum:** Versi Go minimum yang didukung kini adalah **1.25**, dengan workflow CI yang diperbarui sesuai ([#4550](https://github.com/gin-gonic/gin/pull/4550)).
- **Peningkatan Dependensi BSON:** Dependensi binding BSON telah ditingkatkan ke `mongo-driver` v2 ([#4549](https://github.com/gin-gonic/gin/pull/4549)).

---

Gin 1.12.0 mencerminkan dedikasi komunitas kami — kontributor, reviewer, dan pengguna. Terima kasih telah menjadikan Gin lebih baik di setiap rilis.

Siap mencoba Gin 1.12.0? [Upgrade di GitHub](https://github.com/gin-gonic/gin/releases/tag/v1.12.0) dan beri tahu kami pendapat Anda!
