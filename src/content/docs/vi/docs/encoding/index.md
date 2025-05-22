---
title: "Encoding"
sidebar:
  order: 5
---

### Build with json replacement

Gin uses `encoding/json` as the default JSON package but you can change it by building from other tags.

[go-json](https://github.com/goccy/go-json)

```sh
go build -tags=go_json .
```

[jsoniter](https://github.com/json-iterator/go)

```sh
go build -tags=jsoniter .
```

[sonic](https://github.com/bytedance/sonic) (you have to ensure that your cpu supports avx instruction.)

```sh
$ go build -tags="sonic avx" .
```
