---
title: "Encoding"
sidebar:
  order: 5
---

### Build dengan pengganti json

Gin menggunakan `encoding/json` sebagai paket JSON bawaan, tetapi Anda dapat mengubahnya dengan melakukan build dari tag lain.

[go-json](https://github.com/goccy/go-json)

```sh
go build -tags=go_json .
```

[jsoniter](https://github.com/json-iterator/go)

```sh
go build -tags=jsoniter .
```

[sonic](https://github.com/bytedance/sonic) (Anda harus memastikan bahwa CPU Anda mendukung instruksi AVX.)

```sh
$ go build -tags="sonic avx" .
```
