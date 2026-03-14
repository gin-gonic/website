---
title: "ランタイムでのカスタムJSONコーデック"
sidebar:
  order: 2
---

Ginはコンパイルタグを使用せずに、カスタムJSONシリアライゼーションおよびデシリアライゼーションロジックをサポートしています。

1. `json.Core`インターフェースを実装するカスタム構造体を定義します。
2. エンジンが起動する前に、カスタム構造体を使用して`json.API`に値を割り当てます。

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
  // デフォルトのjson apiを置換
  json.API = customJsonApi{}

  // ginエンジンを起動
  router := gin.Default()
  router.Run(":8080")
}
```
