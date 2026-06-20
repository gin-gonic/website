---
title: "다중 파일"
sidebar:
  order: 2
---

`c.MultipartForm`을 사용하여 단일 요청으로 업로드된 여러 파일을 수신합니다. 파일은 폼 필드 이름으로 그룹화됩니다 -- 함께 업로드하려는 모든 파일에 동일한 필드 이름을 사용하세요.

```go
package main

import (
  "fmt"
  "log"
  "net/http"
  "path/filepath"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  // Set a lower memory limit for multipart forms (default is 32 MiB)
  router.MaxMultipartMemory = 8 << 20 // 8 MiB

  router.POST("/upload", func(c *gin.Context) {
    // Multipart form
    form, err := c.MultipartForm()
    if err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    files := form.File["files"]

    for _, file := range files {
      log.Println(file.Filename)

      // Upload the file to specific dst.
      dst := filepath.Join("./files/", filepath.Base(file.Filename))
      c.SaveUploadedFile(file, dst)
    }
    c.String(http.StatusOK, fmt.Sprintf("%d files uploaded!", len(files)))
  })

  router.Run(":8080")
}
```

## 테스트

```sh
curl -X POST http://localhost:8080/upload \
  -F "files=@/path/to/test1.zip" \
  -F "files=@/path/to/test2.zip" \
  -H "Content-Type: multipart/form-data"
# Output: 2 files uploaded!
```

## 참고

- [단일 파일](/ko-kr/docs/routing/upload-file/single-file/)
- [업로드 크기 제한](/ko-kr/docs/routing/upload-file/limit-bytes/)
