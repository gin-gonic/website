---
title: "Bind header"
sidebar:
  order: 9
---

`ShouldBindHeader` vincula os headers da requisição HTTP diretamente em uma struct usando tags de struct `header`. Isso é útil para extrair metadados como limites de taxa de API, tokens de autenticação ou headers de domínio customizados das requisições recebidas.

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

## Teste

```sh
# Pass custom headers
curl -H "Rate:300" -H "Domain:music" http://localhost:8080/
# Output: {"Domain":"music","Rate":300}

# Missing headers -- zero values are used
curl http://localhost:8080/
# Output: {"Domain":"","Rate":0}
```

:::note
Os nomes dos headers são case-insensitive de acordo com a especificação HTTP. O valor da tag de struct `header` é correspondido de forma case-insensitive, então `header:"Rate"` vai corresponder a headers enviados como `Rate`, `rate` ou `RATE`.
:::

:::tip
Você pode combinar tags `header` com `binding:"required"` para rejeitar requisições que estejam faltando headers obrigatórios:

```go
type authHeader struct {
  Token string `header:"Authorization" binding:"required"`
}
```

:::

## Veja também

- [Binding e validação](/pt/docs/binding/binding-and-validation/)
- [Vincular query string ou dados post](/pt/docs/binding/bind-query-or-post/)
