---
title: "Parâmetros no caminho"
sidebar:
  order: 2
---

O Gin suporta dois tipos de parâmetros de caminho que permitem capturar valores diretamente da URL:

- **`:name`** — corresponde a um único segmento de caminho. Por exemplo, `/user/:name` corresponde a `/user/john` mas **não** corresponde a `/user/` ou `/user`.
- **`*action`** — corresponde a tudo após o prefixo, incluindo barras. Por exemplo, `/user/:name/*action` corresponde a `/user/john/send` e `/user/john/`. O valor capturado inclui a `/` inicial.

Use `c.Param("name")` para obter o valor de um parâmetro de caminho dentro do seu handler.

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

## Teste

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
O valor do wildcard `*action` sempre inclui a `/` inicial. No exemplo acima, `c.Param("action")` retorna `/send`, não `send`.
:::

:::caution
Você não pode definir tanto `/user/:name` quanto `/user/:name/*action` se eles conflitarem na mesma profundidade de caminho. O Gin entrará em pânico na inicialização se detectar rotas ambíguas.
:::

## Veja também

- [Parâmetros de query string](/pt/docs/routing/querystring-param/)
- [Query e formulário post](/pt/docs/routing/query-and-post-form/)
