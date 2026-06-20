---
title: "Запрос и POST-форма"
sidebar:
  order: 5
---

При обработке `POST`-запроса часто нужно читать значения как из строки запроса URL, так и из тела запроса. Gin разделяет эти два источника, поэтому вы можете обращаться к каждому из них независимо:

- `c.Query("key")` / `c.DefaultQuery("key", "default")` — читает из строки запроса URL.
- `c.PostForm("key")` / `c.DefaultPostForm("key", "default")` — читает из тела запроса `application/x-www-form-urlencoded` или `multipart/form-data`.

Это часто используется в REST API, где маршрут идентифицирует ресурс (через параметры запроса, такие как `id`), а тело содержит полезную нагрузку (например, `name` и `message`).

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.POST("/post", func(c *gin.Context) {
    id := c.Query("id")
    page := c.DefaultQuery("page", "0")
    name := c.PostForm("name")
    message := c.PostForm("message")

    fmt.Printf("id: %s; page: %s; name: %s; message: %s\n", id, page, name, message)
    c.String(http.StatusOK, "id: %s; page: %s; name: %s; message: %s", id, page, name, message)
  })

  router.Run(":8080")
}
```

## Тестирование

```sh
# Query params in URL, form data in body
curl -X POST "http://localhost:8080/post?id=1234&page=1" \
  -d "name=manu&message=this_is_great"
# Output: id: 1234; page: 1; name: manu; message: this_is_great

# Missing page -- falls back to default value "0"
curl -X POST "http://localhost:8080/post?id=1234" \
  -d "name=manu&message=hello"
# Output: id: 1234; page: 0; name: manu; message: hello
```

:::note
`c.Query` читает только из строки запроса URL, а `c.PostForm` читает только из тела запроса. Они никогда не пересекаются. Если вы хотите, чтобы Gin автоматически проверял оба источника, используйте `c.ShouldBind` со структурой.
:::

## Смотрите также

- [Параметры строки запроса](/ru/docs/routing/querystring-param/)
- [Map как параметры строки запроса или POST-формы](/ru/docs/routing/map-as-querystring-or-postform/)
- [Multipart/Urlencoded форма](/ru/docs/routing/multipart-urlencoded-form/)
