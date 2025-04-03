---
title: "Jsoniter"
sidebar:
  order: 5
---

## Build with [jsoniter](https://github.com/json-iterator/go)

Gin 使用 `encoding/json` 作為預設的 JSON 套件，但您可以通過使用其他標籤進行構建以切換到 [jsoniter](https://github.com/json-iterator/go)。

```sh
$ go build -tags=jsoniter .
```
