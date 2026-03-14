---
title: "Middleware personalizado"
sidebar:
  order: 3
---

El middleware de Gin es una función que devuelve un `gin.HandlerFunc`. El middleware se ejecuta antes y/o después del handler principal, lo que lo hace útil para logging, autenticación, manejo de errores y otras preocupaciones transversales.

### Flujo de ejecución del middleware

Una función middleware tiene dos fases, divididas por la llamada a `c.Next()`:

- **Antes de `c.Next()`** -- El código aquí se ejecuta antes de que la solicitud llegue al handler principal. Usa esta fase para tareas de configuración como registrar el tiempo de inicio, validar tokens o establecer valores de contexto con `c.Set()`.
- **`c.Next()`** -- Esto llama al siguiente handler en la cadena (que puede ser otro middleware o el handler de ruta final). La ejecución se pausa aquí hasta que todos los handlers posteriores se hayan completado.
- **Después de `c.Next()`** -- El código aquí se ejecuta después de que el handler principal ha terminado. Usa esta fase para limpieza, registrar el estado de la respuesta o medir latencia.

Si quieres detener la cadena completamente (por ejemplo, cuando la autenticación falla), llama a `c.Abort()` en lugar de `c.Next()`. Esto previene que cualquier handler restante se ejecute. Puedes combinarlo con una respuesta, por ejemplo `c.AbortWithStatusJSON(401, gin.H{"error": "unauthorized"})`.

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    t := time.Now()

    // Set example variable
    c.Set("example", "12345")

    // before request

    c.Next()

    // after request
    latency := time.Since(t)
    log.Print(latency)

    // access the status we are sending
    status := c.Writer.Status()
    log.Println(status)
  }
}

func main() {
  r := gin.New()
  r.Use(Logger())

  r.GET("/test", func(c *gin.Context) {
    example := c.MustGet("example").(string)

    // it would print: "12345"
    log.Println(example)
  })

  // Listen and serve on 0.0.0.0:8080
  r.Run(":8080")
}
```

### Pruébalo

```bash
curl http://localhost:8080/test
```

Los logs del servidor mostrarán la latencia de la solicitud y el código de estado HTTP para cada solicitud que pase a través del middleware `Logger`.

## Ver también

- [Middleware de manejo de errores](/es/docs/middleware/error-handling-middleware/)
- [Usar middleware](/es/docs/middleware/using-middleware/)

