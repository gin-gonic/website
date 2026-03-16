---
title: "Параметры в пути"
sidebar:
  order: 2
---

Gin поддерживает два типа параметров пути, которые позволяют извлекать значения непосредственно из URL:

- **`:name`** — соответствует одному сегменту пути. Например, `/user/:name` соответствует `/user/john`, но **не** соответствует `/user/` или `/user`.
- **`*action`** — соответствует всему после префикса, включая косые черты. Например, `/user/:name/*action` соответствует `/user/john/send` и `/user/john/`. Захваченное значение включает ведущий `/`.

Используйте `c.Param("name")` для получения значения параметра пути внутри вашего обработчика.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // This handler will match /user/john but will not match /user/ or /user
  router.GET("/user/:name", func(c *gin.Context) {
    name := c.Param("name")
    c.String(http.StatusOK, "Hello %s", name)
  })

  // However, this one will match /user/john/ and also /user/john/send
  // If no other routers match /user/john, it will redirect to /user/john/
  router.GET("/user/:name/*action", func(c *gin.Context) {
    name := c.Param("name")
    action := c.Param("action")
    message := name + " is " + action
    c.String(http.StatusOK, message)
  })

  router.Run(":8080")
}
```

## Тестирование

```sh
# Single parameter -- matches :name
curl http://localhost:8080/user/john
# Output: Hello john

# Wildcard parameter -- matches :name and *action
curl http://localhost:8080/user/john/send
# Output: john is /send

# Trailing slash is captured by the wildcard
curl http://localhost:8080/user/john/
# Output: john is /
```

:::note
Значение подстановочного параметра `*action` всегда включает ведущий `/`. В примере выше `c.Param("action")` возвращает `/send`, а не `send`.
:::

:::caution
Вы не можете определить одновременно `/user/:name` и `/user/:name/*action`, если они конфликтуют на одном уровне глубины пути. Gin вызовет панику при запуске, если обнаружит неоднозначные маршруты.
:::

## Смотрите также

- [Параметры строки запроса](/ru/docs/routing/querystring-param/)
- [Запрос и POST-форма](/ru/docs/routing/query-and-post-form/)
