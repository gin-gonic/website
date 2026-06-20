---
title: "단일 파일"
sidebar:
  order: 1
---

`c.FormFile`을 사용하여 `multipart/form-data` 요청에서 단일 업로드 파일을 수신하고, `c.SaveUploadedFile`을 사용하여 디스크에 저장합니다.

`router.MaxMultipartMemory`를 설정하여 multipart 파싱 중 사용되는 최대 메모리를 제어할 수 있습니다 (기본값은 32 MiB). 이 제한보다 큰 파일은 메모리 대신 디스크의 임시 파일에 저장됩니다.

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
    // single file
    file, err := c.FormFile("file")
    if err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    log.Println(file.Filename)

    // Upload the file to specific dst.
    dst := filepath.Join("./files/", filepath.Base(file.Filename))
    c.SaveUploadedFile(file, dst)

    c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
  })

  router.Run(":8080")
}
```

## 테스트

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/your/file.zip" \
  -H "Content-Type: multipart/form-data"
# Output: 'file.zip' uploaded!
```

:::caution
클라이언트의 `file.Filename`을 절대 신뢰하지 마세요. 파일 경로에서 사용하기 전에 항상 파일 이름을 검증하세요. `filepath.Base`를 사용하여 디렉터리 구성 요소를 제거하고 경로 순회 공격을 방지하세요.
:::

## 참고

- [다중 파일](/ko-kr/docs/routing/upload-file/multiple-file/)
- [업로드 크기 제한](/ko-kr/docs/routing/upload-file/limit-bytes/)
