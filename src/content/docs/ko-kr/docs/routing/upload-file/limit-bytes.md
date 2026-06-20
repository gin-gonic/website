---
title: "업로드 크기 제한"
sidebar:
  order: 3
---

`http.MaxBytesReader`를 사용하여 업로드 파일의 최대 크기를 엄격하게 제한합니다. 제한을 초과하면 리더가 오류를 반환하고 `413 Request Entity Too Large` 상태로 응답할 수 있습니다.

이는 클라이언트가 과도하게 큰 파일을 전송하여 서버 메모리나 디스크 공간을 소진시키는 서비스 거부 공격을 방지하는 데 중요합니다.

## 동작 원리

1. **제한 정의** -- 상수 `MaxUploadSize` (1 MB)가 업로드의 하드 캡을 설정합니다.
2. **제한 적용** -- `http.MaxBytesReader`가 `c.Request.Body`를 래핑합니다. 클라이언트가 허용된 것보다 더 많은 바이트를 보내면 리더가 중지하고 오류를 반환합니다.
3. **파싱 및 확인** -- `c.Request.ParseMultipartForm`이 읽기를 트리거합니다. 코드는 `*http.MaxBytesError`를 확인하여 명확한 메시지와 함께 `413` 상태를 반환합니다.

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

const (
  MaxUploadSize = 1 << 20 // 1 MB
)

func uploadHandler(c *gin.Context) {
  // Wrap the body reader so only MaxUploadSize bytes are allowed
  c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, MaxUploadSize)

  // Parse multipart form
  if err := c.Request.ParseMultipartForm(MaxUploadSize); err != nil {
    if _, ok := err.(*http.MaxBytesError); ok {
      c.JSON(http.StatusRequestEntityTooLarge, gin.H{
        "error": fmt.Sprintf("file too large (max: %d bytes)", MaxUploadSize),
      })
      return
    }
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }

  file, _, err := c.Request.FormFile("file")
  if err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": "file form required"})
    return
  }
  defer file.Close()

  c.JSON(http.StatusOK, gin.H{
    "message": "upload successful",
  })
}

func main() {
  r := gin.Default()
  r.POST("/upload", uploadHandler)
  r.Run(":8080")
}
```

## 테스트

```sh
# Upload a small file (under 1 MB) -- succeeds
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/small-file.txt"
# Output: {"message":"upload successful"}

# Upload a large file (over 1 MB) -- rejected
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/large-file.zip"
# Output: {"error":"file too large (max: 1048576 bytes)"}
```

## 참고

- [단일 파일](/ko-kr/docs/routing/upload-file/single-file/)
- [다중 파일](/ko-kr/docs/routing/upload-file/multiple-file/)
