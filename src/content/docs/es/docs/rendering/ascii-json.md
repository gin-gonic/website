---
title: "AsciiJSON"
sidebar:
  order: 4
---

`AsciiJSON` serializa datos a JSON pero escapa todos los caracteres no ASCII en secuencias de escape Unicode `\uXXXX`. Los caracteres especiales de HTML como `<` y `>` también se escapan. El resultado es un cuerpo de respuesta que contiene solo caracteres ASCII de 7 bits.

**Cuándo usar AsciiJSON:**

- Tus consumidores de API requieren respuestas estrictamente seguras en ASCII (por ejemplo, sistemas que no pueden manejar bytes codificados en UTF-8).
- Necesitas incrustar JSON dentro de contextos que solo soportan ASCII, como ciertos sistemas de logging o transportes legacy.
- Quieres asegurar que caracteres como `<`, `>` y `&` se escapen para evitar problemas de inyección cuando el JSON se incrusta en HTML.

Para la mayoría de las APIs modernas, el estándar `c.JSON()` es suficiente ya que produce UTF-8 válido. Usa `AsciiJSON` solo cuando la seguridad ASCII es un requisito específico.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/someJSON", func(c *gin.Context) {
    data := map[string]interface{}{
      "lang": "GO语言",
      "tag":  "<br>",
    }

    // will output : {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
    c.AsciiJSON(http.StatusOK, data)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

Puedes probar este endpoint con curl:

```bash
curl http://localhost:8080/someJSON
# Output: {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
```

Observa que los caracteres chinos son reemplazados con `\u8bed\u8a00`, y la etiqueta `<br>` se convierte en `\u003cbr\u003e`. El cuerpo de la respuesta es seguro para consumir en cualquier entorno solo ASCII.
