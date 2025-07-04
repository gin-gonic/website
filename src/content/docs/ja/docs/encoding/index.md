---
title: "Encoding"
sidebar:
  order: 5
---

### JSONの差し替えビルドについて
Gin では、標準の JSON パッケージとして encoding/json が使用されていますが、ビルドタグを利用することで他の JSON パッケージに差し替えることが可能です。

[go-json](https://github.com/goccy/go-json)

```sh
go build -tags=go_json .
```

[jsoniter](https://github.com/json-iterator/go)

```sh
go build -tags=jsoniter .
```

[sonic](https://github.com/bytedance/sonic) (この処理を実行するには、お使いの CPU が AVX 命令セットに対応している必要があります。)

```sh
$ go build -tags="sonic avx" .
```
