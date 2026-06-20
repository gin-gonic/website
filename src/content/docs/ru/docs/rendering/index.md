---
title: "Рендеринг"
sidebar:
  order: 5
---

Gin поддерживает рендеринг ответов в множестве форматов, включая JSON, XML, YAML, ProtoBuf, HTML и другие. Каждый метод рендеринга следует одному и тому же паттерну: вызов метода на `*gin.Context` с HTTP-кодом статуса и данными для сериализации. Gin автоматически обрабатывает заголовки content-type, сериализацию и запись ответа.

```go
// All rendering methods share this pattern:
c.JSON(http.StatusOK, data)   // application/json
c.XML(http.StatusOK, data)    // application/xml
c.YAML(http.StatusOK, data)   // application/x-yaml
c.TOML(http.StatusOK, data)   // application/toml
c.ProtoBuf(http.StatusOK, data) // application/x-protobuf
```

Вы можете использовать заголовок `Accept` или параметр запроса для обслуживания одних и тех же данных в нескольких форматах из одного обработчика:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/user", func(c *gin.Context) {
    user := gin.H{"name": "Lena", "role": "admin"}

    switch c.Query("format") {
    case "xml":
      c.XML(http.StatusOK, user)
    case "yaml":
      c.YAML(http.StatusOK, user)
    default:
      c.JSON(http.StatusOK, user)
    }
  })

  router.Run(":8080")
}
```

## В этом разделе

- [**Рендеринг XML/JSON/YAML/ProtoBuf**](./rendering/) -- Рендеринг ответов в нескольких форматах с автоматической обработкой content-type
- [**SecureJSON**](./secure-json/) -- Предотвращение атак перехвата JSON в устаревших браузерах
- [**JSONP**](./jsonp/) -- Поддержка кросс-доменных запросов от устаревших клиентов без CORS
- [**AsciiJSON**](./ascii-json/) -- Экранирование не-ASCII символов для безопасной передачи
- [**PureJSON**](./pure-json/) -- Рендеринг JSON без экранирования HTML-символов
- [**Раздача статических файлов**](./serving-static-files/) -- Раздача директорий со статическими ресурсами
- [**Раздача данных из файла**](./serving-data-from-file/) -- Раздача отдельных файлов, вложений и загрузок
- [**Раздача данных из reader**](./serving-data-from-reader/) -- Потоковая передача данных из любого `io.Reader` в ответ
- [**Рендеринг HTML**](./html-rendering/) -- Рендеринг HTML-шаблонов с динамическими данными
- [**Множественные шаблоны**](./multiple-template/) -- Использование нескольких наборов шаблонов в одном приложении
- [**Встраивание шаблонов в бинарный файл**](./bind-single-binary-with-template/) -- Встраивание шаблонов в скомпилированный бинарный файл
