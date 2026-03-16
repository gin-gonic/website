---
title: "PureJSON"
sidebar:
  order: 5
---

Normalmente, o `json.Marshal` do Go substitui caracteres HTML especiais por sequências de escape unicode por segurança — por exemplo, `<` se torna `\u003c`. Isso é adequado quando se incorpora JSON em HTML, mas se você está construindo uma API pura, os clientes podem esperar os caracteres literais.

`c.PureJSON` usa `json.Encoder` com `SetEscapeHTML(false)`, então caracteres HTML como `<`, `>` e `&` são renderizados literalmente em vez de serem escapados.

Use `PureJSON` quando os consumidores da sua API esperam JSON bruto e sem escape. Use o `JSON` padrão quando a resposta pode ser incorporada em uma página HTML.

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

## Teste

```sh
# Standard JSON -- HTML characters are escaped
curl http://localhost:8080/json
# Output: {"html":"\u003cb\u003eHello, world!\u003c/b\u003e"}

# PureJSON -- HTML characters are literal
curl http://localhost:8080/purejson
# Output: {"html":"<b>Hello, world!</b>"}
```

:::tip
O Gin também fornece `c.AbortWithStatusPureJSON` (v1.11+) para retornar JSON sem escape enquanto aborta a cadeia de middleware — útil em middleware de autenticação ou validação.
:::

## Veja também

- [AsciiJSON](/pt/docs/rendering/ascii-json/)
- [SecureJSON](/pt/docs/rendering/secure-json/)
- [Renderização](/pt/docs/rendering/rendering/)
