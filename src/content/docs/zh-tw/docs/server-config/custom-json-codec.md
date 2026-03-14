---
title: "在執行期間自訂 JSON 編解碼器"
sidebar:
  order: 2
---

Gin 支援不使用編譯標籤的自訂 JSON 序列化和反序列化邏輯。

1. 定義一個實作 `json.Core` 介面的自訂結構體。
2. 在引擎啟動之前，使用自訂結構體賦值給 `json.API`。

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
