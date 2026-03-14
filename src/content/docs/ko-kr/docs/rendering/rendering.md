---
title: "XML/JSON/YAML/ProtoBuf 렌더링"
sidebar:
  order: 1
---

Gin은 JSON, XML, YAML, Protocol Buffers를 포함한 여러 형식으로 응답을 렌더링하는 내장 지원을 제공합니다. 이를 통해 콘텐츠 협상을 지원하는 API를 구축하는 것이 간편해집니다 -- 클라이언트가 요청하는 형식으로 데이터를 제공합니다.

**각 형식 사용 시기:**

- **JSON** -- REST API 및 브라우저 기반 클라이언트를 위한 가장 일반적인 선택입니다. 표준 출력에는 `c.JSON()`을, 개발 중 사람이 읽기 쉬운 형식에는 `c.IndentedJSON()`을 사용하세요.
- **XML** -- 레거시 시스템, SOAP 서비스 또는 XML을 기대하는 클라이언트(일부 엔터프라이즈 애플리케이션 등)와 통합할 때 유용합니다.
- **YAML** -- 설정 지향 엔드포인트나 YAML을 기본적으로 사용하는 도구(Kubernetes 또는 CI/CD 파이프라인 등)에 적합합니다.
- **ProtoBuf** -- 서비스 간 고성능, 저지연 통신에 이상적입니다. Protocol Buffers는 텍스트 기반 형식에 비해 더 작은 페이로드와 더 빠른 직렬화를 제공하지만, 공유 스키마 정의(`.proto` 파일)가 필요합니다.

모든 렌더링 메서드는 HTTP 상태 코드와 데이터 값을 받습니다. Gin은 데이터를 직렬화하고 적절한 `Content-Type` 헤더를 자동으로 설정합니다.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/testdata/protoexample"
)

func main() {
  router := gin.Default()

  // gin.H는 map[string]interface{}의 단축입니다
  router.GET("/someJSON", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/moreJSON", func(c *gin.Context) {
    // 구조체를 사용할 수도 있습니다
    var msg struct {
      Name    string `json:"user"`
      Message string
      Number  int
    }
    msg.Name = "Lena"
    msg.Message = "hey"
    msg.Number = 123
    // msg.Name이 JSON에서 "user"가 됩니다
    // 출력: {"user": "Lena", "Message": "hey", "Number": 123}
    c.JSON(http.StatusOK, msg)
  })

  router.GET("/someXML", func(c *gin.Context) {
    c.XML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/someYAML", func(c *gin.Context) {
    c.YAML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/someProtoBuf", func(c *gin.Context) {
    reps := []int64{int64(1), int64(2)}
    label := "test"
    // protobuf의 구체적인 정의는 testdata/protoexample 파일에 작성되어 있습니다.
    data := &protoexample.Test{
      Label: &label,
      Reps:  reps,
    }
    // 데이터가 응답에서 바이너리 데이터가 됩니다
    // protoexample.Test protobuf 직렬화된 데이터를 출력합니다
    c.ProtoBuf(http.StatusOK, data)
  })

  // 0.0.0.0:8080에서 수신 대기 및 서비스
  router.Run(":8080")
}
```

## 참고

- [PureJSON](/ko-kr/docs/rendering/pure-json/)
- [SecureJSON](/ko-kr/docs/rendering/secure-json/)
- [AsciiJSON](/ko-kr/docs/rendering/ascii-json/)
- [JSONP](/ko-kr/docs/rendering/jsonp/)
