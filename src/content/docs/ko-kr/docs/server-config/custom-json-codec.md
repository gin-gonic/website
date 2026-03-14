---
title: "런타임 커스텀 JSON 코덱"
sidebar:
  order: 2
---

Gin은 컴파일 태그를 사용하지 않고도 커스텀 JSON 직렬화 및 역직렬화 로직을 지원합니다.

1. `json.Core` 인터페이스를 구현하는 커스텀 구조체를 정의합니다.
2. 엔진이 시작되기 전에 커스텀 구조체를 사용하여 `json.API`에 값을 할당합니다.

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
  // 기본 json api 교체
  json.API = customJsonApi{}

  // gin 엔진 시작
  router := gin.Default()
  router.Run(":8080")
}
```
