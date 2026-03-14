---
title: "업로드 크기 제한"
sidebar:
  order: 3
---

이 예제는 `http.MaxBytesReader`를 사용하여 업로드 파일의 최대 크기를 엄격하게 제한하고, 제한을 초과할 때 `413` 상태를 반환하는 방법을 보여줍니다.

자세한 [예제 코드](https://github.com/gin-gonic/examples/blob/master/upload-file/limit-bytes/main.go)를 참조하세요.

## 동작 방식

1. **제한 정의** -- 상수 `MaxUploadSize` (1 MB)가 업로드의 하드 캡을 설정합니다.
2. **제한 적용** -- `http.MaxBytesReader`가 `c.Request.Body`를 래핑합니다. 클라이언트가 허용된 것보다 더 많은 바이트를 보내면, 리더가 중지하고 오류를 반환합니다.
3. **파싱 및 확인** -- `c.Request.ParseMultipartForm`이 읽기를 트리거합니다. 코드는 `*http.MaxBytesError`를 확인하여 명확한 메시지와 함께 `413 Request Entity Too Large` 상태를 반환합니다.

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
  // MaxUploadSize 바이트만 허용되도록 바디 리더를 래핑
  c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, MaxUploadSize)

  // multipart 폼 파싱
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

`curl` 사용 방법:

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
