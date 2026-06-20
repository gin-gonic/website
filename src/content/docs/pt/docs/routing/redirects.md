---
title: "Redirecionamentos"
sidebar:
  order: 9
---

O Gin suporta tanto redirecionamentos HTTP (enviando o cliente para uma URL diferente) quanto redirecionamentos de router (encaminhando internamente uma requisição para um handler diferente sem uma ida e volta ao cliente).

## Redirecionamentos HTTP

Use `c.Redirect` com um código de status HTTP apropriado para redirecionar o cliente:

- **301 (`http.StatusMovedPermanently`)** — o recurso foi movido permanentemente. Navegadores e mecanismos de busca atualizam seus caches.
- **302 (`http.StatusFound`)** — redirecionamento temporário. O navegador segue mas não armazena a nova URL em cache.
- **307 (`http.StatusTemporaryRedirect`)** — como 302, mas o navegador deve preservar o método HTTP original (útil para redirecionamentos POST).
- **308 (`http.StatusPermanentRedirect`)** — como 301, mas o navegador deve preservar o método HTTP original.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // External redirect (GET)
  router.GET("/old", func(c *gin.Context) {
    c.Redirect(http.StatusMovedPermanently, "https://www.google.com/")
  })

  // Redirect from POST -- use 302 or 307 to preserve behavior
  router.POST("/submit", func(c *gin.Context) {
    c.Redirect(http.StatusFound, "/result")
  })

  // Internal router redirect (no HTTP round-trip)
  router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/final"
    router.HandleContext(c)
  })

  router.GET("/final", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"hello": "world"})
  })

  router.GET("/result", func(c *gin.Context) {
    c.String(http.StatusOK, "Redirected here!")
  })

  router.Run(":8080")
}
```

## Teste

```sh
# GET redirect -- follows to Google (use -L to follow, -I to see headers only)
curl -I http://localhost:8080/old
# Output includes: HTTP/1.1 301 Moved Permanently
# Output includes: Location: https://www.google.com/

# POST redirect -- returns 302 with new location
curl -X POST -I http://localhost:8080/submit
# Output includes: HTTP/1.1 302 Found
# Output includes: Location: /result

# Internal redirect -- handled server-side, client sees final response
curl http://localhost:8080/test
# Output: {"hello":"world"}
```

:::caution
Ao redirecionar de um handler POST, use `302` ou `307` em vez de `301`. Um redirecionamento `301` pode fazer com que alguns navegadores mudem o método de POST para GET, o que pode levar a comportamento inesperado.
:::

:::tip
Redirecionamentos internos via `router.HandleContext(c)` não enviam uma resposta de redirecionamento ao cliente. A requisição é re-roteada dentro do servidor, o que é mais rápido e invisível para o cliente.
:::

## Veja também

- [Agrupamento de rotas](/pt/docs/routing/grouping-routes/)
