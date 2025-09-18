---
title: "编码"
sidebar:
  order: 5

---

### 使用其他JSON库进行构建

Gin默认使用 `encoding/json` 作为JSON处理包，但你可以通过在构建时添加标签(tags)来替换为其他JSON库。


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