---
title: "Tag Build"
sidebar:
  order: 11
---

Go [build tags](https://pkg.go.dev/go/build#hdr-Build_Constraints) (juga disebut build constraints) adalah direktif yang memberitahu compiler Go untuk menyertakan atau mengecualikan file selama kompilasi. Gin menggunakan build tags untuk memungkinkan Anda mengganti implementasi internal atau menonaktifkan fitur opsional pada waktu kompilasi, tanpa mengubah kode aplikasi apa pun.

Ini berguna dalam beberapa skenario:

- **Optimasi performa** -- Ganti paket `encoding/json` default dengan encoder pihak ketiga yang lebih cepat untuk mempercepat serialisasi JSON di API Anda.
- **Pengurangan ukuran binary** -- Hapus fitur yang tidak Anda gunakan, seperti rendering MsgPack, untuk menghasilkan binary yang lebih kecil.
- **Penyesuaian deployment** -- Pilih encoder berbeda untuk lingkungan berbeda (mis., build produksi throughput tinggi vs. build pengembangan standar).

Tag build diteruskan ke toolchain Go dengan flag `-tags`:

```sh
go build -tags=<tag_name> .
```

You can combine multiple tags by separating them with commas:

```sh
go build -tags=nomsgpack,go_json .
```

### Tag build yang tersedia

| Tag | Effect |
|---|---|
| `go_json` | Replaces `encoding/json` with [go-json](https://github.com/goccy/go-json) |
| `jsoniter` | Replaces `encoding/json` with [jsoniter](https://github.com/json-iterator/go) |
| `sonic avx` | Replaces `encoding/json` with [sonic](https://github.com/bytedance/sonic) (requires AVX CPU instructions) |
| `nomsgpack` | Disables MsgPack rendering support |

:::note
Tag build hanya memengaruhi cara Gin dikompilasi. Kode aplikasi Anda (handler rute, middleware, dll.) tidak perlu berubah saat Anda berganti tag.
:::

## Dalam bagian ini

Halaman-halaman di bawah ini membahas setiap tag build secara detail:

- [**Build dengan penggantian JSON**](./json-replacement/) -- Ganti encoder JSON default dengan go-json, jsoniter, atau sonic untuk serialisasi yang lebih cepat.
- [**Build tanpa MsgPack**](./nomsgpack/) -- Nonaktifkan rendering MsgPack dengan tag build `nomsgpack` untuk mengurangi ukuran binary.
