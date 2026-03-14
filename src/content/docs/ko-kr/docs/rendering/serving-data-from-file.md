---
title: "파일에서 데이터 서빙"
sidebar:
  order: 7
---

Gin은 클라이언트에 파일을 서빙하기 위한 여러 메서드를 제공합니다. 각 메서드는 다른 사용 사례에 적합합니다:

- **`c.File(path)`** -- 로컬 파일시스템에서 파일을 서빙합니다. 콘텐츠 타입이 자동으로 감지됩니다. 컴파일 시 정확한 파일 경로를 알고 있거나 이미 검증한 경우 사용하세요.
- **`c.FileFromFS(path, fs)`** -- `http.FileSystem` 인터페이스에서 파일을 서빙합니다. 임베드된 파일시스템(`embed.FS`), 커스텀 스토리지 백엔드에서 파일을 서빙하거나 특정 디렉토리 트리로 접근을 제한하려는 경우 유용합니다.
- **`c.FileAttachment(path, filename)`** -- `Content-Disposition: attachment` 헤더를 설정하여 파일을 다운로드로 서빙합니다. 브라우저는 디스크의 원본 파일 이름과 관계없이 제공한 파일 이름을 사용하여 파일을 저장하라는 메시지를 표시합니다.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // 파일을 인라인으로 서빙 (브라우저에 표시)
  router.GET("/local/file", func(c *gin.Context) {
    c.File("local/file.go")
  })

  // http.FileSystem에서 파일 서빙
  var fs http.FileSystem = http.Dir("/var/www/assets")
  router.GET("/fs/file", func(c *gin.Context) {
    c.FileFromFS("fs/file.go", fs)
  })

  // 커스텀 파일 이름으로 다운로드 가능한 첨부 파일로 서빙
  router.GET("/download", func(c *gin.Context) {
    c.FileAttachment("local/report-2024-q1.xlsx", "quarterly-report.xlsx")
  })

  router.Run(":8080")
}
```

curl로 다운로드 엔드포인트를 테스트할 수 있습니다:

```sh
# -v 플래그는 Content-Disposition 헤더를 보여줍니다
curl -v http://localhost:8080/download --output report.xlsx

# 파일을 인라인으로 서빙
curl http://localhost:8080/local/file
```

`io.Reader`에서 데이터를 스트리밍하려면(원격 URL이나 동적으로 생성된 콘텐츠 등), 대신 `c.DataFromReader()`를 사용하세요. 자세한 내용은 [리더에서 데이터 서빙](/ko-kr/docs/rendering/serving-data-from-reader/)을 참조하세요.

:::caution[보안: 경로 탐색]
사용자 입력을 `c.File()` 또는 `c.FileAttachment()`에 직접 전달하지 마세요. 공격자가 `../../etc/passwd`와 같은 경로를 제공하여 서버의 임의 파일을 읽을 수 있습니다. 항상 파일 경로를 검증하고 새니타이즈하거나, 특정 디렉토리로 접근을 제한하는 `http.FileSystem`과 함께 `c.FileFromFS()`를 사용하세요.

```go
// 위험 -- 절대 이렇게 하지 마세요
router.GET("/files/:name", func(c *gin.Context) {
  c.File(c.Param("name")) // 공격자가 경로를 제어합니다
})

// 안전 -- 특정 디렉토리로 제한
var safeFS http.FileSystem = http.Dir("/var/www/public")
router.GET("/files/:name", func(c *gin.Context) {
  c.FileFromFS(c.Param("name"), safeFS)
})
```
:::
