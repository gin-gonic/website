---
title: "Query e formulário post"
sidebar:
  order: 5
---

Ao tratar uma requisição `POST`, você frequentemente precisa ler valores tanto da query string da URL quanto do corpo da requisição. O Gin mantém essas duas fontes separadas, para que você possa acessar cada uma independentemente:

- `c.Query("key")` / `c.DefaultQuery("key", "default")` — lê da query string da URL.
- `c.PostForm("key")` / `c.DefaultPostForm("key", "default")` — lê do corpo da requisição `application/x-www-form-urlencoded` ou `multipart/form-data`.

Isso é comum em APIs REST onde a rota identifica o recurso (via parâmetros de query como `id`) enquanto o corpo carrega o payload (como `name` e `message`).

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

## Teste

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
`c.Query` lê apenas da query string da URL, e `c.PostForm` lê apenas do corpo da requisição. Eles nunca se cruzam. Se você quiser que o Gin verifique ambas as fontes automaticamente, use `c.ShouldBind` com uma struct.
:::

## Veja também

- [Parâmetros de query string](/pt/docs/routing/querystring-param/)
- [Map como parâmetros de querystring ou postform](/pt/docs/routing/map-as-querystring-or-postform/)
- [Formulário Multipart/Urlencoded](/pt/docs/routing/multipart-urlencoded-form/)
