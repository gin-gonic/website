---
title: "Jsoniter"
draft: false
weight: 5
---

## [jsoniter](https://github.com/json-iterator/go) でビルドする

Gin はデフォルトの json パッケージとして `encoding/json` を使っていますが、他のタグからビルドすることで、[jsoniter](https://github.com/json-iterator/go) を使うこともできます。

```sh
$ go build -tags=jsoniter .
```
