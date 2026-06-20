---
title: "Один файл"
sidebar:
  order: 1
---

Используйте `c.FormFile` для получения одного загруженного файла из запроса `multipart/form-data`, затем `c.SaveUploadedFile` для сохранения его на диск.

Вы можете контролировать максимальный объём памяти, используемой при разборе multipart-данных, установив `router.MaxMultipartMemory` (по умолчанию 32 МиБ). Файлы, превышающие этот лимит, сохраняются во временные файлы на диске, а не в память.

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

## Тестирование

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/your/file.zip" \
  -H "Content-Type: multipart/form-data"
# Output: 'file.zip' uploaded!
```

:::caution
Никогда не доверяйте `file.Filename` от клиента. Всегда очищайте имя файла перед использованием в путях файловой системы. Используйте `filepath.Base` для удаления компонентов директории и предотвращения атак обхода пути.
:::

## Смотрите также

- [Несколько файлов](/ru/docs/routing/upload-file/multiple-file/)
- [Ограничение размера загрузки](/ru/docs/routing/upload-file/limit-bytes/)
