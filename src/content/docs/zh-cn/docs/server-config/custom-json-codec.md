---
title: "运行时自定义 JSON 编解码器"
sidebar:
  order: 2
---

Gin 支持在不使用编译标签的情况下自定义 JSON 序列化和反序列化逻辑。

1. 定义一个实现 `json.Core` 接口的自定义结构体。
2. 在引擎启动之前，使用自定义结构体为 `json.API` 赋值。

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
