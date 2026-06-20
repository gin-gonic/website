---
title: "Рендеринг XML/JSON/YAML/ProtoBuf"
sidebar:
  order: 1
---

Gin предоставляет встроенную поддержку рендеринга ответов в нескольких форматах, включая JSON, XML, YAML и Protocol Buffers. Это упрощает создание API с поддержкой согласования контента — обслуживание данных в любом формате, который запрашивает клиент.

**Когда использовать каждый формат:**

- **JSON** — Наиболее распространённый выбор для REST API и браузерных клиентов. Используйте `c.JSON()` для стандартного вывода или `c.IndentedJSON()` для читаемого форматирования при разработке.
- **XML** — Полезен при интеграции с устаревшими системами, SOAP-сервисами или клиентами, ожидающими XML (например, некоторые корпоративные приложения).
- **YAML** — Хорошо подходит для эндпоинтов, ориентированных на конфигурацию, или инструментов, которые нативно обрабатывают YAML (например, Kubernetes или конвейеры CI/CD).
- **ProtoBuf** — Идеален для высокопроизводительной коммуникации с малой задержкой между сервисами. Protocol Buffers создают меньшие полезные нагрузки и более быструю сериализацию по сравнению с текстовыми форматами, но требуют общего определения схемы (файл `.proto`).

Все методы рендеринга принимают HTTP-код статуса и значение данных. Gin сериализует данные и автоматически устанавливает соответствующий заголовок `Content-Type`.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/testdata/protoexample"
)

func main() {
  router := gin.Default()

  // gin.H is a shortcut for map[string]interface{}
  router.GET("/someJSON", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/moreJSON", func(c *gin.Context) {
    // You also can use a struct
    var msg struct {
      Name    string `json:"user"`
      Message string
      Number  int
    }
    msg.Name = "Lena"
    msg.Message = "hey"
    msg.Number = 123
    // Note that msg.Name becomes "user" in the JSON
    // Will output  :   {"user": "Lena", "Message": "hey", "Number": 123}
    c.JSON(http.StatusOK, msg)
  })

  router.GET("/someXML", func(c *gin.Context) {
    c.XML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/someYAML", func(c *gin.Context) {
    c.YAML(http.StatusOK, gin.H{"message": "hey", "status": http.StatusOK})
  })

  router.GET("/someProtoBuf", func(c *gin.Context) {
    reps := []int64{int64(1), int64(2)}
    label := "test"
    // The specific definition of protobuf is written in the testdata/protoexample file.
    data := &protoexample.Test{
      Label: &label,
      Reps:  reps,
    }
    // Note that data becomes binary data in the response
    // Will output protoexample.Test protobuf serialized data
    c.ProtoBuf(http.StatusOK, data)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

## Смотрите также

- [PureJSON](/ru/docs/rendering/pure-json/)
- [SecureJSON](/ru/docs/rendering/secure-json/)
- [AsciiJSON](/ru/docs/rendering/ascii-json/)
- [JSONP](/ru/docs/rendering/jsonp/)
