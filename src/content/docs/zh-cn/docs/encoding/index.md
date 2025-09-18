---
title: "编码"
sidebar:
  order: 5
---

### 通过 JSON 库替换进行构建

Gin 框架默认使用 `encoding/json` 作为JSON包，但你可以通过其他构建标签来更换。

[go-json](https://github.com/goccy/go-json)

```sh
go build -tags=go_json .
```

[jsoniter](https://github.com/json-iterator/go)

```sh
go build -tags=jsoniter .
```

[sonic](https://github.com/bytedance/sonic) (需要确保你的 CPU 支持 AVX 指令集)

```sh
$ go build -tags="sonic avx" .
```
