---
title: "리더에서 데이터 서빙"
sidebar:
  order: 8
---

`DataFromReader`를 사용하면 전체 콘텐츠를 먼저 메모리에 버퍼링하지 않고 모든 `io.Reader`에서 HTTP 응답으로 데이터를 직접 스트리밍할 수 있습니다. 이는 프록시 엔드포인트를 구축하거나 원격 소스에서 대용량 파일을 효율적으로 서빙하는 데 필수적입니다.

**일반적인 사용 사례:**

- **원격 리소스 프록시** -- 외부 서비스(클라우드 스토리지 API 또는 CDN 등)에서 파일을 가져와 클라이언트에 전달합니다. 데이터가 메모리에 완전히 로드되지 않고 서버를 통해 흐릅니다.
- **생성된 콘텐츠 서빙** -- 동적으로 생성된 데이터(CSV 내보내기 또는 보고서 파일 등)를 생성되는 대로 스트리밍합니다.
- **대용량 파일 다운로드** -- 메모리에 담기에는 너무 큰 파일을 디스크나 원격 소스에서 청크 단위로 읽어 서빙합니다.

메서드 시그니처는 `c.DataFromReader(code, contentLength, contentType, reader, extraHeaders)`입니다. HTTP 상태 코드, 콘텐츠 길이(클라이언트가 총 크기를 알 수 있도록), MIME 타입, 스트리밍할 `io.Reader`, 그리고 선택적 추가 응답 헤더 맵(파일 다운로드용 `Content-Disposition` 등)을 제공합니다.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.GET("/someDataFromReader", func(c *gin.Context) {
    response, err := http.Get("https://raw.githubusercontent.com/gin-gonic/logo/master/color.png")
    if err != nil || response.StatusCode != http.StatusOK {
      c.Status(http.StatusServiceUnavailable)
      return
    }

    reader := response.Body
    contentLength := response.ContentLength
    contentType := response.Header.Get("Content-Type")

    extraHeaders := map[string]string{
      "Content-Disposition": `attachment; filename="gopher.png"`,
    }

    c.DataFromReader(http.StatusOK, contentLength, contentType, reader, extraHeaders)
  })
  router.Run(":8080")
}
```

이 예제에서 Gin은 GitHub에서 이미지를 가져와 다운로드 가능한 첨부 파일로 클라이언트에 직접 스트리밍합니다. 이미지 바이트는 업스트림 HTTP 응답 바디에서 클라이언트 응답으로 버퍼에 축적되지 않고 흐릅니다. `response.Body`는 `DataFromReader`가 응답 쓰기 중 완전히 읽으므로 핸들러가 반환된 후 HTTP 서버에 의해 자동으로 닫힙니다.
