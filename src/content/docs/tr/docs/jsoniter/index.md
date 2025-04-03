---
title: "Jsoniter"
weight: 5
---

## [jsoniter](https://github.com/json-iterator/go) ile oluşturun

Gin, varsayılan json paketi olarak `encoding/json` kullanır, ancak diğer etiketlerden derleyerek varsayılanı [jsoniter](https://github.com/json-iterator/go) olarak değiştirebilirsiniz.

```sh
$ go build -tags=jsoniter .
``` 
