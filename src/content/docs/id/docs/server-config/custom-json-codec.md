---
title: "Codec JSON kustom saat runtime"
sidebar:
  order: 2
---

Gin mendukung logika serialisasi dan deserialisasi JSON kustom tanpa menggunakan tag kompilasi.

1. Definisikan struct kustom yang mengimplementasikan antarmuka `json.Core`.
2. Sebelum engine Anda dimulai, tetapkan nilai ke `json.API` menggunakan struct kustom.

```go
package main

import (
  "io"

  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/codec/json"
  jsoniter "github.com/json-iterator/go"
)

var customConfig = jsoniter.Config{
  EscapeHTML:             true,
  SortMapKeys:            true,
  ValidateJsonRawMessage: true,
}.Froze()

type customJsonApi struct{}

func (j customJsonApi) Marshal(v any) ([]byte, error) {
  return customConfig.Marshal(v)
}

func (j customJsonApi) Unmarshal(data []byte, v any) error {
  return customConfig.Unmarshal(data, v)
}

func (j customJsonApi) MarshalIndent(v any, prefix, indent string) ([]byte, error) {
  return customConfig.MarshalIndent(v, prefix, indent)
}

func (j customJsonApi) NewEncoder(writer io.Writer) json.Encoder {
  return customConfig.NewEncoder(writer)
}

func (j customJsonApi) NewDecoder(reader io.Reader) json.Decoder {
  return customConfig.NewDecoder(reader)
}

func main() {
  // Replace the default json api
  json.API = customJsonApi{}

  // Start your gin engine
  router := gin.Default()
  router.Run(":8080")
}
```
