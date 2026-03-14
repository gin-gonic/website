---
title: "Раздача данных из файла"
sidebar:
  order: 7
---

Gin предоставляет несколько методов для отдачи файлов клиентам. Каждый метод подходит для разных сценариев использования:

- **`c.File(path)`** -- Отдаёт файл из локальной файловой системы. Тип контента определяется автоматически. Используйте, когда вы знаете точный путь к файлу на этапе компиляции или уже проверили его.
- **`c.FileFromFS(path, fs)`** -- Отдаёт файл из интерфейса `http.FileSystem`. Полезно при раздаче файлов из встроенных файловых систем (`embed.FS`), пользовательских хранилищ или когда вы хотите ограничить доступ определённым деревом директорий.
- **`c.FileAttachment(path, filename)`** -- Отдаёт файл как загружаемый, устанавливая заголовок `Content-Disposition: attachment`. Браузер предложит пользователю сохранить файл с указанным вами именем, независимо от оригинального имени файла на диске.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Serve a file inline (displayed in browser)
  router.GET("/local/file", func(c *gin.Context) {
    c.File("local/file.go")
  })

  // Serve a file from an http.FileSystem
  var fs http.FileSystem = http.Dir("/var/www/assets")
  router.GET("/fs/file", func(c *gin.Context) {
    c.FileFromFS("fs/file.go", fs)
  })

  // Serve a file as a downloadable attachment with a custom filename
  router.GET("/download", func(c *gin.Context) {
    c.FileAttachment("local/report-2024-q1.xlsx", "quarterly-report.xlsx")
  })

  router.Run(":8080")
}
```

Вы можете проверить эндпоинт загрузки с помощью curl:

```sh
# The -v flag shows the Content-Disposition header
curl -v http://localhost:8080/download --output report.xlsx

# Serve a file inline
curl http://localhost:8080/local/file
```

Для потоковой передачи данных из `io.Reader` (например, удалённого URL или динамически генерируемого контента) используйте `c.DataFromReader()`. Подробнее см. [Раздача данных из reader](/ru/docs/rendering/serving-data-from-reader/).

:::caution[Безопасность: обход пути]
Никогда не передавайте пользовательский ввод напрямую в `c.File()` или `c.FileAttachment()`. Злоумышленник может указать путь вроде `../../etc/passwd` для чтения произвольных файлов на вашем сервере. Всегда валидируйте и очищайте пути к файлам или используйте `c.FileFromFS()` с ограниченной `http.FileSystem`, которая ограничивает доступ определённой директорией.

```go
// DANGEROUS -- never do this
router.GET("/files/:name", func(c *gin.Context) {
  c.File(c.Param("name")) // attacker controls the path
})

// SAFE -- restrict to a specific directory
var safeFS http.FileSystem = http.Dir("/var/www/public")
router.GET("/files/:name", func(c *gin.Context) {
  c.FileFromFS(c.Param("name"), safeFS)
})
```
:::
