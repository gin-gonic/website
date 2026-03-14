---
title: "렌더링"
sidebar:
  order: 5
---

Gin은 JSON, XML, YAML, ProtoBuf, HTML 등 여러 형식으로 응답을 렌더링하는 것을 지원합니다. 모든 렌더링 메서드는 동일한 패턴을 따릅니다: `*gin.Context`에서 HTTP 상태 코드와 직렬화할 데이터를 사용하여 메서드를 호출합니다. Gin은 content-type 헤더, 직렬화 및 응답 작성을 자동으로 처리합니다.

```go
// 모든 렌더링 메서드는 이 패턴을 공유합니다:
c.JSON(http.StatusOK, data)   // application/json
c.XML(http.StatusOK, data)    // application/xml
c.YAML(http.StatusOK, data)   // application/x-yaml
c.TOML(http.StatusOK, data)   // application/toml
c.ProtoBuf(http.StatusOK, data) // application/x-protobuf
```

`Accept` 헤더나 쿼리 매개변수를 사용하여 단일 핸들러에서 동일한 데이터를 여러 형식으로 제공할 수 있습니다:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/user", func(c *gin.Context) {
    user := gin.H{"name": "Lena", "role": "admin"}

    switch c.Query("format") {
    case "xml":
      c.XML(http.StatusOK, user)
    case "yaml":
      c.YAML(http.StatusOK, user)
    default:
      c.JSON(http.StatusOK, user)
    }
  })

  router.Run(":8080")
}
```

## 이 섹션의 내용

- [**XML/JSON/YAML/ProtoBuf 렌더링**](./rendering/) -- 자동 content-type 처리로 여러 형식으로 응답 렌더링
- [**SecureJSON**](./secure-json/) -- 레거시 브라우저에서 JSON 하이재킹 공격 방지
- [**JSONP**](./jsonp/) -- CORS 없이 레거시 클라이언트의 크로스 도메인 요청 지원
- [**AsciiJSON**](./ascii-json/) -- 안전한 전송을 위해 비ASCII 문자 이스케이프
- [**PureJSON**](./pure-json/) -- HTML 문자를 이스케이프하지 않고 JSON 렌더링
- [**정적 파일 서빙**](./serving-static-files/) -- 정적 에셋 디렉토리 서빙
- [**파일에서 데이터 서빙**](./serving-data-from-file/) -- 개별 파일, 첨부 파일 및 다운로드 서빙
- [**리더에서 데이터 서빙**](./serving-data-from-reader/) -- 모든 `io.Reader`에서 응답으로 데이터 스트리밍
- [**HTML 렌더링**](./html-rendering/) -- 동적 데이터로 HTML 템플릿 렌더링
- [**다중 템플릿**](./multiple-template/) -- 단일 애플리케이션에서 여러 템플릿 세트 사용
- [**단일 바이너리에 템플릿 바인딩**](./bind-single-binary-with-template/) -- 컴파일된 바이너리에 템플릿 임베드
