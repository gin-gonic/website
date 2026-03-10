---
title: "Gin 1.12.0 Dirilis"
linkTitle: "Gin 1.12.0 Dirilis"
lastUpdated: 2026-02-28
---

## Gin v1.12.0

### Fitur

* feat(binding): tambah dukungan encoding.UnmarshalText dalam binding uri/query ([#4203](https://github.com/gin-gonic/gin/pull/4203))
* feat(context): tambah metode GetError dan GetErrorSlice untuk pengambilan kesalahan ([#4502](https://github.com/gin-gonic/gin/pull/4502))
* feat(context): tambah dukungan Protocol Buffers ke negosiasi konten ([#4423](https://github.com/gin-gonic/gin/pull/4423))
* feat(context): implementasikan metode Delete ([#4296](https://github.com/gin-gonic/gin/pull/4296))
* feat(gin): tambah opsi untuk menggunakan path yang dilepas ([#4420](https://github.com/gin-gonic/gin/pull/4420))
* feat(logger): latensi warna ([#4146](https://github.com/gin-gonic/gin/pull/4146))
* feat(render): tambah protokol bson ([#4145](https://github.com/gin-gonic/gin/pull/4145))

### Perbaikan Bug

* fix(binding): kesalahan nilai kosong ([#2169](https://github.com/gin-gonic/gin/pull/2169))
* fix(binding): tingkatkan penanganan irisan/array kosong dalam binding form ([#4380](https://github.com/gin-gonic/gin/pull/4380))
* fix(context): perbaiki penanganan ClientIP untuk nilai header X-Forwarded-For jamak ([#4472](https://github.com/gin-gonic/gin/pull/4472))
* fix(debug): ketidakcocokan versi ([#4403](https://github.com/gin-gonic/gin/pull/4403))
* fix(gin): tutup os.File di RunFd untuk mencegah kebocoran sumber daya ([#4422](https://github.com/gin-gonic/gin/pull/4422))
* fix(gin): perbaiki rute titik dua literal yang tidak berfungsi dengan engine.Handler() ([#4415](https://github.com/gin-gonic/gin/pull/4415))
* fix(recover): tekan http.ErrAbortHandler dalam recovery ([#4336](https://github.com/gin-gonic/gin/pull/4336))
* fix(render): tulis panjang konten dalam Data.Render ([#4206](https://github.com/gin-gonic/gin/pull/4206))
* fix(response): perbaiki perilaku hijack untuk siklus hidup respons ([#4373](https://github.com/gin-gonic/gin/pull/4373))
* fix(tree): perbaiki panic di findCaseInsensitivePathRec dengan RedirectFixedPath ([#4535](https://github.com/gin-gonic/gin/pull/4535))
* fix: Perbaiki kesalahan ketik, tingkatkan kejelasan dokumentasi, dan hapus kode mati ([#4511](https://github.com/gin-gonic/gin/pull/4511))

### Peningkatan

* chore(binding): tingkatkan dependensi bson ke mongo-driver v2 ([#4549](https://github.com/gin-gonic/gin/pull/4549))
* chore(context): selalu percayai header xff dari unix socket ([#3359](https://github.com/gin-gonic/gin/pull/3359))
* chore(deps): tingkatkan golang.org/x/crypto ke v0.45.0 ([#4449](https://github.com/gin-gonic/gin/pull/4449))
* chore(deps): tingkatkan quic-go ke v0.57.1 ([#4532](https://github.com/gin-gonic/gin/pull/4532))
* chore(logger): izinkan melewati keluaran string kueri ([#4547](https://github.com/gin-gonic/gin/pull/4547))
* chore(response): cegah panic Flush() ketika `http.Flusher` ([#4479](https://github.com/gin-gonic/gin/pull/4479))

### Refaktor

* refactor(binding): gunakan maps.Copy untuk penanganan peta yang lebih bersih ([#4352](https://github.com/gin-gonic/gin/pull/4352))
* refactor(context): hilangkan nama nilai kembalian ([#4395](https://github.com/gin-gonic/gin/pull/4395))
* refactor(context): ganti IP localhost yang dikodekan keras dengan konstanta ([#4481](https://github.com/gin-gonic/gin/pull/4481))
* refactor(context): menggunakan maps.Clone ([#4333](https://github.com/gin-gonic/gin/pull/4333))
* refactor(ginS): gunakan sync.OnceValue untuk menyederhanakan fungsi engine ([#4314](https://github.com/gin-gonic/gin/pull/4314))
* refactor(recovery): perbandingan kesalahan cerdas ([#4142](https://github.com/gin-gonic/gin/pull/4142))
* refactor(utils): pindahkan fungsi util ke utils.go ([#4467](https://github.com/gin-gonic/gin/pull/4467))
* refactor: for loop dapat dimodernisasi menggunakan range over int ([#4392](https://github.com/gin-gonic/gin/pull/4392))
* refactor: ganti angka ajaib dengan konstanta bernama di bodyAllowedForStatus ([#4529](https://github.com/gin-gonic/gin/pull/4529))
* refactor: gunakan b.Loop() untuk menyederhanakan kode dan meningkatkan kinerja ([#4389](https://github.com/gin-gonic/gin/pull/4389), [#4432](https://github.com/gin-gonic/gin/pull/4432))

### Pembaruan Proses Pembangunan / CI

* ci(bot): tingkatkan frekuensi dan pengelompokan pembaruan dependensi ([#4367](https://github.com/gin-gonic/gin/pull/4367))
* ci(lint): refaktor pernyataan pengujian dan konfigurasi linter ([#4436](https://github.com/gin-gonic/gin/pull/4436))
* ci(sec): tingkatkan keamanan tipe dan organisasi server dalam middleware HTTP ([#4437](https://github.com/gin-gonic/gin/pull/4437))
* ci(sec): jadwalkan pemindaian keamanan Trivy untuk berjalan setiap hari pada tengah malam UTC ([#4439](https://github.com/gin-gonic/gin/pull/4439))
* ci: ganti alur kerja pemindaian kerentanan dengan integrasi Trivy ([#4421](https://github.com/gin-gonic/gin/pull/4421))
* ci: perbarui alur kerja CI dan standarkan tanda kutip konfigurasi Trivy ([#4531](https://github.com/gin-gonic/gin/pull/4531))
* ci: perbarui dukungan versi Go ke 1.25+ di seluruh CI dan dokumentasi ([#4550](https://github.com/gin-gonic/gin/pull/4550))

### Pembaruan Dokumentasi

* docs(README): tambahkan lencana pemindaian keamanan Trivy ([#4426](https://github.com/gin-gonic/gin/pull/4426))
* docs(context): tambahkan komentar contoh untuk metode ShouldBind\* ([#4428](https://github.com/gin-gonic/gin/pull/4428))
* docs(context): perbaiki beberapa komentar ([#4396](https://github.com/gin-gonic/gin/pull/4396))
* docs(context): perbaiki nama fungsi yang salah dalam komentar ([#4382](https://github.com/gin-gonic/gin/pull/4382))
* docs(readme): perbarui dan perluas dokumentasi untuk kejelasan dan kelengkapan ([#4362](https://github.com/gin-gonic/gin/pull/4362))
* docs: umumkan rilis Gin 1.11.0 dengan tautan blog ([#4363](https://github.com/gin-gonic/gin/pull/4363))
* docs: dokumentasikan dan finalkan rilis Gin v1.12.0 ([#4551](https://github.com/gin-gonic/gin/pull/4551))
* docs: perbarui template kontribusi dan dukungan GitHub ([#4364](https://github.com/gin-gonic/gin/pull/4364))
* docs: perbarui panduan kontribusi dengan instruksi komprehensif ([#4365](https://github.com/gin-gonic/gin/pull/4365))
* docs: perbarui dokumentasi untuk mencerminkan perubahan versi Go ([#4552](https://github.com/gin-gonic/gin/pull/4552))
* docs: perbarui instruksi dokumentasi fitur untuk tautan dokumentasi yang rusak ([#4508](https://github.com/gin-gonic/gin/pull/4508))

### Kinerja

* perf(path): ganti regex dengan fungsi kustom dalam redirectTrailingSlash ([#4414](https://github.com/gin-gonic/gin/pull/4414))
* perf(recovery): optimalkan pembacaan baris dalam fungsi stack ([#4466](https://github.com/gin-gonic/gin/pull/4466))
* perf(tree): optimalkan penguraian jalur menggunakan strings.Count ([#4246](https://github.com/gin-gonic/gin/pull/4246))
* perf(tree): kurangi alokasi dalam findCaseInsensitivePath ([#4417](https://github.com/gin-gonic/gin/pull/4417))

### Tes

* test(benchmarks): perbaiki nama fungsi yang tidak benar ([#4375](https://github.com/gin-gonic/gin/pull/4375))
* test(bytesconv): tambahkan tes untuk kasus kosong/nil ([#4454](https://github.com/gin-gonic/gin/pull/4454))
* test(context): gunakan konstanta http.StatusContinue daripada angka ajaib 100 ([#4542](https://github.com/gin-gonic/gin/pull/4542))
* test(debug): tingkatkan cakupan pengujian debug.go menjadi 100% ([#4404](https://github.com/gin-gonic/gin/pull/4404))
* test(gin): tambahkan cakupan pengujian komprehensif untuk paket ginS ([#4442](https://github.com/gin-gonic/gin/pull/4442))
* test(gin): selesaikan kondisi balapan dalam tes integrasi ([#4453](https://github.com/gin-gonic/gin/pull/4453))
* test(render): tambahkan tes penanganan kesalahan komprehensif ([#4541](https://github.com/gin-gonic/gin/pull/4541))
* test(render): tambahkan tes komprehensif untuk rendering MsgPack ([#4537](https://github.com/gin-gonic/gin/pull/4537))
