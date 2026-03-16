---
title: "PureJSON"
sidebar:
  order: 5
---

Normalmente, `json.Marshal` de Go reemplaza los caracteres especiales de HTML con secuencias de escape unicode por seguridad — por ejemplo, `<` se convierte en `\u003c`. Esto está bien al incrustar JSON en HTML, pero si estás construyendo una API pura, los clientes pueden esperar los caracteres literales.

`c.PureJSON` usa `json.Encoder` con `SetEscapeHTML(false)`, por lo que los caracteres HTML como `<`, `>` y `&` se renderizan literalmente en lugar de ser escapados.

Usa `PureJSON` cuando los consumidores de tu API esperan JSON sin escapar. Usa el `JSON` estándar cuando la respuesta pueda incrustarse en una página HTML.

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

## Pruébalo

```sh
# Standard JSON -- HTML characters are escaped
curl http://localhost:8080/json
# Output: {"html":"\u003cb\u003eHello, world!\u003c/b\u003e"}

# PureJSON -- HTML characters are literal
curl http://localhost:8080/purejson
# Output: {"html":"<b>Hello, world!</b>"}
```

:::tip
Gin también proporciona `c.AbortWithStatusPureJSON` (v1.11+) para devolver JSON sin escapar mientras se aborta la cadena de middleware — útil en middleware de autenticación o validación.
:::

## Ver también

- [AsciiJSON](/es/docs/rendering/ascii-json/)
- [SecureJSON](/es/docs/rendering/secure-json/)
- [Renderizado](/es/docs/rendering/rendering/)
