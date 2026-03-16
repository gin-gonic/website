---
title: "PureJSON"
sidebar:
  order: 5
---

Обычно `json.Marshal` в Go заменяет специальные HTML-символы на Unicode-escape-последовательности для безопасности — например, `<` становится `\u003c`. Это нормально при встраивании JSON в HTML, но если вы создаёте чистое API, клиенты могут ожидать буквальные символы.

`c.PureJSON` использует `json.Encoder` с `SetEscapeHTML(false)`, поэтому HTML-символы, такие как `<`, `>` и `&`, отображаются буквально, а не экранируются.

Используйте `PureJSON`, когда потребители вашего API ожидают необработанный, неэкранированный JSON. Используйте стандартный `JSON`, когда ответ может быть встроен в HTML-страницу.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Standard JSON -- escapes HTML characters
  router.GET("/json", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  // PureJSON -- serves literal characters
  router.GET("/purejson", func(c *gin.Context) {
    c.PureJSON(http.StatusOK, gin.H{
      "html": "<b>Hello, world!</b>",
    })
  })

  router.Run(":8080")
}
```

## Тестирование

```sh
# Standard JSON -- HTML characters are escaped
curl http://localhost:8080/json
# Output: {"html":"\u003cb\u003eHello, world!\u003c/b\u003e"}

# PureJSON -- HTML characters are literal
curl http://localhost:8080/purejson
# Output: {"html":"<b>Hello, world!</b>"}
```

:::tip
Gin также предоставляет `c.AbortWithStatusPureJSON` (v1.11+) для возврата неэкранированного JSON с прерыванием цепочки middleware — полезно в middleware аутентификации или валидации.
:::

## Смотрите также

- [AsciiJSON](/ru/docs/rendering/ascii-json/)
- [SecureJSON](/ru/docs/rendering/secure-json/)
- [Рендеринг](/ru/docs/rendering/rendering/)
