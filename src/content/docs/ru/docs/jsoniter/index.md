---
название: "Jsoniter"
черновик: false
вес: 5
---

## Сборка с [jsoniter](https://github.com/json-iterator/go)

Gin использует `encoding/json` как пакет json по умолчанию, но вы можете изменить его на [jsoniter](https://github.com/json-iterator/go), собирая из других тегов.

``sh
$ go build -tags=jsoniter .
``` 
