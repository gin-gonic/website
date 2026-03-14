---
title: "Build dengan penggantian JSON"
sidebar:
  order: 1
---

Gin menggunakan paket `encoding/json` pustaka standar untuk serialisasi dan deserialisasi JSON secara default. Encoder pustaka standar telah diuji dengan baik dan sepenuhnya kompatibel, tetapi bukan opsi tercepat yang tersedia. Jika performa JSON menjadi bottleneck dalam aplikasi Anda -- misalnya, dalam API throughput tinggi yang menyerialisasi payload respons besar -- Anda dapat mengganti dengan pengganti drop-in yang lebih cepat pada waktu build menggunakan tag build. Tidak diperlukan perubahan kode.

## Pengganti yang tersedia

Gin mendukung tiga encoder JSON alternatif. Masing-masing mengimplementasikan antarmuka yang sama yang diharapkan Gin, sehingga handler, middleware, dan logika binding Anda terus bekerja tanpa modifikasi.

### go-json

[go-json](https://github.com/goccy/go-json) is a pure-Go JSON encoder that offers significant performance improvements over `encoding/json` while maintaining full compatibility. It works on all platforms and architectures.

```sh
go build -tags=go_json .
```

### jsoniter

[jsoniter](https://github.com/json-iterator/go) (json-iterator) is another pure-Go, high-performance JSON library. It is API-compatible with `encoding/json` and provides a flexible configuration system for advanced use cases.

```sh
go build -tags=jsoniter .
```

### sonic

[sonic](https://github.com/bytedance/sonic) is a blazing-fast JSON encoder developed by ByteDance. It uses JIT compilation and SIMD instructions to achieve maximum throughput, making it the fastest option among the three.

```sh
go build -tags="sonic avx" .
```

:::note
Sonic requires a CPU with AVX instruction support. This is available on most modern x86_64 processors (Intel Sandy Bridge and later, AMD Bulldozer and later), but it will not work on ARM architectures or older x86 hardware. If your deployment target does not support AVX, use go-json or jsoniter instead.
:::

## Memilih pengganti

| Encoder | Platform support | Key strength |
|---|---|---|
| `encoding/json` (default) | All | Maximum compatibility, no extra dependency |
| go-json | All | Good speedup, pure Go, broad compatibility |
| jsoniter | All | Good speedup, flexible configuration |
| sonic | x86_64 with AVX only | Highest throughput via JIT and SIMD |

Untuk sebagian besar aplikasi, **go-json** adalah pilihan yang aman dan efektif -- bekerja di mana saja dan memberikan peningkatan performa yang berarti. Pilih **sonic** ketika Anda membutuhkan throughput JSON maksimum dan server Anda berjalan pada hardware x86_64. Pilih **jsoniter** jika Anda membutuhkan fitur konfigurasi spesifiknya atau sudah menggunakannya di tempat lain dalam kode Anda.

## Memverifikasi pengganti

Anda dapat mengonfirmasi bahwa pengganti aktif dengan membandingkan performa serialisasi dengan benchmark sederhana, atau dengan memeriksa tabel simbol binary:

```sh
# Build with go-json
go build -tags=go_json -o myapp .

# Check that go-json symbols are present
go tool nm myapp | grep goccy
```

The build tag also works with other Go commands:

```sh
go run -tags=go_json .
go test -tags=go_json ./...
```

:::note
Only use one JSON replacement tag at a time. If you specify multiple JSON tags (e.g., `-tags=go_json,jsoniter`), the behavior is undefined. The `nomsgpack` tag can be safely combined with any JSON replacement tag.
:::
