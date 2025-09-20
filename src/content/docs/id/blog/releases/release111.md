---
title: "Gin 1.11.0 telah dirilis"
linkTitle: "Gin 1.11.0 telah dirilis"
lastUpdated: 2024-09-20
---

## Gin v1.11.0

### Fitur

* feat(gin): Dukungan eksperimental untuk HTTP/3 menggunakan quic-go/quic-go ([#3210](https://github.com/gin-gonic/gin/pull/3210))
* feat(form): menambahkan format koleksi array dalam binding form ([#3986](https://github.com/gin-gonic/gin/pull/3986)), menambahkan slice string khusus untuk unmarshal tag form ([#3970](https://github.com/gin-gonic/gin/pull/3970))
* feat(binding): menambahkan BindPlain ([#3904](https://github.com/gin-gonic/gin/pull/3904))
* feat(fs): Mengekspor, menguji, dan mendokumentasikan OnlyFilesFS ([#3939](https://github.com/gin-gonic/gin/pull/3939))
* feat(binding): menambahkan dukungan untuk unixMilli dan unixMicro ([#4190](https://github.com/gin-gonic/gin/pull/4190))
* feat(form): Dukungan nilai default untuk koleksi dalam binding form ([#4048](https://github.com/gin-gonic/gin/pull/4048))
* feat(context): GetXxx mendukung lebih banyak tipe native Go ([#3633](https://github.com/gin-gonic/gin/pull/3633))

### Peningkatan

* perf(context): optimasi performa getMapFromFormData ([#4339](https://github.com/gin-gonic/gin/pull/4339))
* refactor(tree): mengganti string(/) dengan "/" dalam node.insertChild ([#4354](https://github.com/gin-gonic/gin/pull/4354))
* refactor(render): menghapus parameter headers dari writeHeader ([#4353](https://github.com/gin-gonic/gin/pull/4353))
* refactor(context): menyederhanakan fungsi "GetType()" ([#4080](https://github.com/gin-gonic/gin/pull/4080))
* refactor(slice): menyederhanakan metode Error pada SliceValidationError ([#3910](https://github.com/gin-gonic/gin/pull/3910))
* refactor(context): Menghindari penggunaan filepath.Dir dua kali pada SaveUploadedFile ([#4181](https://github.com/gin-gonic/gin/pull/4181))
* refactor(context): Refaktor penanganan konteks dan meningkatkan robustitas pengujian ([#4066](https://github.com/gin-gonic/gin/pull/4066))
* refactor(binding): menggunakan strings.Cut untuk menggantikan strings.Index ([#3522](https://github.com/gin-gonic/gin/pull/3522))
* refactor(context): menambahkan parameter izin opsional ke SaveUploadedFile ([#4068](https://github.com/gin-gonic/gin/pull/4068))
* refactor(context): verifikasi URL tidak null pada initQueryCache() ([#3969](https://github.com/gin-gonic/gin/pull/3969))
* refactor(context): logika penilaian YAML dalam Negotiate ([#3966](https://github.com/gin-gonic/gin/pull/3966))
* tree: mengganti 'min' buatan sendiri dengan bawaan resmi ([#3975](https://github.com/gin-gonic/gin/pull/3975))
* context: menghapus penggunaan filepath.Dir yang berlebihan ([#4181](https://github.com/gin-gonic/gin/pull/4181))

### Perbaikan Bug

* fix: mencegah masalah re-entry middleware di HandleContext ([#3987](https://github.com/gin-gonic/gin/pull/3987))
* fix(binding): mencegah decoding ganda dan menambahkan validasi di decodeToml ([#4193](https://github.com/gin-gonic/gin/pull/4193))
* fix(gin): Tidak panik saat menangani metode yang tidak diizinkan pada pohon kosong ([#4003](https://github.com/gin-gonic/gin/pull/4003))
* fix(gin): peringatan race data untuk mode gin ([#1580](https://github.com/gin-gonic/gin/pull/1580))
* fix(context): verifikasi URL tidak null pada initQueryCache() ([#3969](https://github.com/gin-gonic/gin/pull/3969))
* fix(context): logika penilaian YAML dalam Negotiate ([#3966](https://github.com/gin-gonic/gin/pull/3966))
* fix(context): pengecekan handler yang null ([#3413](https://github.com/gin-gonic/gin/pull/3413))
* fix(readme): memperbaiki tautan rusak ke dokumentasi bahasa Inggris ([#4222](https://github.com/gin-gonic/gin/pull/4222))
* fix(tree): Memastikan pesan panic konsisten saat pembangunan tipe wildcard gagal ([#4077](https://github.com/gin-gonic/gin/pull/4077))

### Pembaruan proses build / CI

* ci: mengintegrasikan pemindaian kerentanan Trivy ke alur kerja CI ([#4359](https://github.com/gin-gonic/gin/pull/4359))
* ci: dukungan Go 1.25 pada CI/CD ([#4341](https://github.com/gin-gonic/gin/pull/4341))
* build(deps): memperbarui github.com/bytedance/sonic dari v1.13.2 ke v1.14.0 ([#4342](https://github.com/gin-gonic/gin/pull/4342))
* ci: menambahkan versi Go 1.24 ke GitHub Actions ([#4154](https://github.com/gin-gonic/gin/pull/4154))
* build: memperbarui minimum versi Go untuk Gin ke 1.21 ([#3960](https://github.com/gin-gonic/gin/pull/3960))
* ci(lint): mengaktifkan linters baru (testifylint, usestdlibvars, perfsprint, dll.) ([#4010](https://github.com/gin-gonic/gin/pull/4010), [#4091](https://github.com/gin-gonic/gin/pull/4091), [#4090](https://github.com/gin-gonic/gin/pull/4090))
* ci(lint): memperbarui workflow dan meningkatkan konsistensi permintaan pengujian ([#4126](https://github.com/gin-gonic/gin/pull/4126))

### Pembaruan Ketergantungan

* chore(deps): memperbarui google.golang.org/protobuf dari 1.36.6 menjadi 1.36.9 ([#4346](https://github.com/gin-gonic/gin/pull/4346), [#4356](https://github.com/gin-gonic/gin/pull/4356))
* chore(deps): memperbarui github.com/stretchr/testify dari 1.10.0 menjadi 1.11.1 ([#4347](https://github.com/gin-gonic/gin/pull/4347))
* chore(deps): memperbarui actions/setup-go dari 5 menjadi 6 ([#4351](https://github.com/gin-gonic/gin/pull/4351))
* chore(deps): memperbarui github.com/quic-go/quic-go dari 0.53.0 menjadi 0.54.0 ([#4328](https://github.com/gin-gonic/gin/pull/4328))
* chore(deps): memperbarui golang.org/x/net dari 0.33.0 menjadi 0.38.0 ([#4178](https://github.com/gin-gonic/gin/pull/4178), [#4221](https://github.com/gin-gonic/gin/pull/4221))
* chore(deps): memperbarui github.com/go-playground/validator/v10 dari 10.20.0 menjadi 10.22.1 ([#4052](https://github.com/gin-gonic/gin/pull/4052))

### Pembaruan dokumentasi

* docs(changelog): memperbarui catatan rilis Gin v1.10.1 ([#4360](https://github.com/gin-gonic/gin/pull/4360))
* docs: memperbaiki kesalahan tata bahasa Inggris dan kalimat yang janggal di doc/doc.md ([#4207](https://github.com/gin-gonic/gin/pull/4207))
* docs: memperbarui dokumentasi dan catatan rilis untuk Gin v1.10.0 ([#3953](https://github.com/gin-gonic/gin/pull/3953))
* docs: memperbaiki typo di Gin Quick Start ([#3997](https://github.com/gin-gonic/gin/pull/3997))
* docs: memperbaiki masalah komentar dan tautan ([#4205](https://github.com/gin-gonic/gin/pull/4205), [#3938](https://github.com/gin-gonic/gin/pull/3938))
* docs: memperbaiki contoh kode grup rute ([#4020](https://github.com/gin-gonic/gin/pull/4020))
* docs(readme): menambahkan dokumentasi bahasa Portugis ([#4078](https://github.com/gin-gonic/gin/pull/4078))
* docs(context): memperbaiki beberapa nama fungsi di komentar ([#4079](https://github.com/gin-gonic/gin/pull/4079))
