---
title: "Jsoniter"

sidebar:
  order: 5
---

### Construir com o [`jsoniter`](https://github.com/json-iterator/go)

A Gin usa o módulo `encoding/json` como pacote de JSON padrão mas podes mudar para o [`jsoniter`](https://github.com/json-iterator/go) ao construir a partir de outros marcadores:

```sh
$ go build -tags=jsoniter .
``` 
