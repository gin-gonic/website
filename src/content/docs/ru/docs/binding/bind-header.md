---
title: "Привязка заголовков"
sidebar:
  order: 9
---

`ShouldBindHeader` привязывает HTTP-заголовки запроса непосредственно к структуре, используя теги структуры `header`. Это полезно для извлечения метаданных, таких как лимиты API, токены аутентификации или пользовательские заголовки домена из входящих запросов.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type testHeader struct {
  Rate   int    `header:"Rate"`
  Domain string `header:"Domain"`
}

func main() {
  r := gin.Default()

  r.GET("/", func(c *gin.Context) {
    h := testHeader{}

    if err := c.ShouldBindHeader(&h); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    c.JSON(http.StatusOK, gin.H{"Rate": h.Rate, "Domain": h.Domain})
  })

  r.Run(":8080")
}
```

## Тестирование

```sh
# Pass custom headers
curl -H "Rate:300" -H "Domain:music" http://localhost:8080/
# Output: {"Domain":"music","Rate":300}

# Missing headers -- zero values are used
curl http://localhost:8080/
# Output: {"Domain":"","Rate":0}
```

:::note
Имена заголовков не чувствительны к регистру согласно спецификации HTTP. Значение тега структуры `header` сопоставляется без учёта регистра, поэтому `header:"Rate"` будет соответствовать заголовкам, отправленным как `Rate`, `rate` или `RATE`.
:::

:::tip
Вы можете комбинировать теги `header` с `binding:"required"` для отклонения запросов, в которых отсутствуют обязательные заголовки:

```go
type authHeader struct {
  Token string `header:"Authorization" binding:"required"`
}
```

:::

## Смотрите также

- [Привязка и валидация](/ru/docs/binding/binding-and-validation/)
- [Привязка строки запроса или POST-данных](/ru/docs/binding/bind-query-or-post/)
