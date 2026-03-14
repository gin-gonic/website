---
title: "Ограничение размера загрузки"
sidebar:
  order: 3
---

Этот пример показывает, как использовать `http.MaxBytesReader` для строгого ограничения максимального размера загружаемых файлов и возврата статуса `413` при превышении лимита.

Подробный [пример кода](https://github.com/gin-gonic/examples/blob/master/upload-file/limit-bytes/main.go).

## Как это работает

1. **Определение лимита** -- Константа `MaxUploadSize` (1 МБ) задаёт жёсткий предел для загрузок.
2. **Применение лимита** -- `http.MaxBytesReader` оборачивает `c.Request.Body`. Если клиент отправляет больше байтов, чем разрешено, reader останавливается и возвращает ошибку.
3. **Разбор и проверка** -- `c.Request.ParseMultipartForm` запускает чтение. Код проверяет наличие `*http.MaxBytesError` для возврата статуса `413 Request Entity Too Large` с понятным сообщением.

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

Как использовать `curl`:

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
