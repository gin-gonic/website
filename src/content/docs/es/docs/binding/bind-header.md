---
title: "Enlazar encabezados"
sidebar:
  order: 9
---

`ShouldBindHeader` enlaza los encabezados de solicitud HTTP directamente en un struct usando etiquetas de struct `header`. Esto es útil para extraer metadatos como límites de tasa de API, tokens de autenticación o encabezados de dominio personalizados de las solicitudes entrantes.

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

## Pruébalo

```sh
# Pass custom headers
curl -H "Rate:300" -H "Domain:music" http://localhost:8080/
# Output: {"Domain":"music","Rate":300}

# Missing headers -- zero values are used
curl http://localhost:8080/
# Output: {"Domain":"","Rate":0}
```

:::note
Los nombres de encabezados no distinguen entre mayúsculas y minúsculas según la especificación HTTP. El valor de la etiqueta de struct `header` se compara sin distinción de mayúsculas, por lo que `header:"Rate"` coincidirá con encabezados enviados como `Rate`, `rate` o `RATE`.
:::

:::tip
Puedes combinar etiquetas `header` con `binding:"required"` para rechazar solicitudes que no tengan los encabezados requeridos:

```go
type authHeader struct {
  Token string `header:"Authorization" binding:"required"`
}
```

:::

## Ver también

- [Enlace y validación](/es/docs/binding/binding-and-validation/)
- [Enlazar cadena de consulta o datos post](/es/docs/binding/bind-query-or-post/)
