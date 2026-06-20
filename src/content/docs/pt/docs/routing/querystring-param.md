---
title: "Parâmetros de query string"
sidebar:
  order: 3
---

Parâmetros de query string são os pares chave-valor que aparecem após o `?` em uma URL (por exemplo, `/search?q=gin&page=2`). O Gin fornece dois métodos para lê-los:

- `c.Query("key")` retorna o valor do parâmetro de query, ou uma **string vazia** se a chave não estiver presente.
- `c.DefaultQuery("key", "default")` retorna o valor, ou o **valor padrão** especificado se a chave não estiver presente.

Ambos os métodos são atalhos para acessar `c.Request.URL.Query()` com menos código boilerplate.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Query string parameters are parsed using the existing underlying request object.
  // The request responds to a url matching:  /welcome?firstname=Jane&lastname=Doe
  router.GET("/welcome", func(c *gin.Context) {
    firstname := c.DefaultQuery("firstname", "Guest")
    lastname := c.Query("lastname") // shortcut for c.Request.URL.Query().Get("lastname")

    c.String(http.StatusOK, "Hello %s %s", firstname, lastname)
  })
  router.Run(":8080")
}
```

## Teste

```sh
# Both parameters provided
curl "http://localhost:8080/welcome?firstname=Jane&lastname=Doe"
# Output: Hello Jane Doe

# Missing firstname -- uses default value "Guest"
curl "http://localhost:8080/welcome?lastname=Doe"
# Output: Hello Guest Doe

# No parameters at all
curl "http://localhost:8080/welcome"
# Output: Hello Guest
```

## Veja também

- [Parâmetros no caminho](/pt/docs/routing/param-in-path/)
