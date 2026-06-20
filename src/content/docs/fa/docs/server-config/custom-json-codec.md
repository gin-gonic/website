---
title: "کدک JSON سفارشی در زمان اجرا"
sidebar:
  order: 2
---

Gin از منطق سریال‌سازی و deserialization سفارشی JSON بدون استفاده از تگ‌های کامپایل پشتیبانی می‌کند.

1. یک struct سفارشی تعریف کنید که رابط `json.Core` را پیاده‌سازی کند.
2. قبل از شروع موتور، مقادیر را با استفاده از struct سفارشی به `json.API` اختصاص دهید.

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
