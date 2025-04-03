---
title: "Jsoniter"
draft: false
weight: 5
---

## Go Build con [jsoniter](https://github.com/json-iterator/go)

Gin utiliza `encoding/json` como paquete por defecto para json, pero se puede cambiar por [jsoniter](https://github.com/json-iterator/go) especificándolo en el tag al hacer go build.

```sh
$ go build -tags=jsoniter .
```
