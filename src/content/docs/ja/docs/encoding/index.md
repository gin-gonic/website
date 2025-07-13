---
sidebar:
  order: 5
title: エンコーディング
---

### jsonの代替を使ったビルド

Ginでは`encoding/json`が既定のJSONパッケージとして使われます。
しかし、別のタグでビルドすると変えられます。

[go-json](https://github.com/goccy/go-json)

```sh
go build -tags=go_json .
```

[jsoniter](https://github.com/json-iterator/go)

```sh
go build -tags=jsoniter .
```

[sonic](https://github.com/bytedance/sonic)（cpuがavxの命令に対応していることを要確認）

```sh
$ go build -tags="sonic avx" .
```
