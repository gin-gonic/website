---
title: "Раздача данных из reader"
sidebar:
  order: 8
---

`DataFromReader` позволяет передавать данные из любого `io.Reader` непосредственно в HTTP-ответ без буферизации всего содержимого в памяти. Это необходимо для создания прокси-эндпоинтов или эффективной раздачи больших файлов из удалённых источников.

**Типичные сценарии использования:**

- **Проксирование удалённых ресурсов** — Получение файла из внешнего сервиса (например, API облачного хранилища или CDN) и пересылка его клиенту. Данные проходят через ваш сервер без полной загрузки в память.
- **Раздача генерируемого контента** — Потоковая передача динамически генерируемых данных (например, CSV-экспортов или файлов отчётов) по мере их создания.
- **Загрузка больших файлов** — Раздача файлов, которые слишком велики для хранения в памяти, путём чтения их частями с диска или из удалённого источника.

Сигнатура метода: `c.DataFromReader(code, contentLength, contentType, reader, extraHeaders)`. Вы указываете HTTP-код статуса, длину контента (чтобы клиент знал общий размер), MIME-тип, `io.Reader` для потоковой передачи и необязательный словарь дополнительных заголовков ответа (например, `Content-Disposition` для загрузки файлов).

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

В этом примере Gin получает изображение с GitHub и передаёт его клиенту в потоковом режиме как загружаемое вложение. Байты изображения проходят из тела HTTP-ответа вышестоящего сервера напрямую в ответ клиенту без накопления в буфере. Обратите внимание, что `response.Body` автоматически закрывается HTTP-сервером после возврата из обработчика, поскольку `DataFromReader` читает его до конца во время записи ответа.
