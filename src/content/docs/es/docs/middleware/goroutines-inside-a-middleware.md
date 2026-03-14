---
title: "Goroutines dentro de un middleware"
sidebar:
  order: 6
---

Cuando inicias nuevas Goroutines dentro de un middleware o handler, **NO DEBES** usar el contexto original dentro de ellas, debes usar una copia de solo lectura.

### Por qué `c.Copy()` es esencial

Gin usa un **sync.Pool** para reutilizar objetos `gin.Context` entre solicitudes para mejorar el rendimiento. Una vez que un handler retorna, el `gin.Context` se devuelve al pool y puede ser asignado a una solicitud completamente diferente. Si una goroutine aún mantiene una referencia al contexto original en ese momento, leerá o escribirá campos que ahora pertenecen a otra solicitud. Esto lleva a **condiciones de carrera**, **corrupción de datos** o **panics**.

Llamar a `c.Copy()` crea una instantánea del contexto que es segura de usar después de que el handler retorna. La copia incluye la solicitud, URL, claves y otros datos de solo lectura, pero está desvinculada del ciclo de vida del pool.

```go
package main

import (
  "log"
  "time"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/long_async", func(c *gin.Context) {
    // create copy to be used inside the goroutine
    cCp := c.Copy()
    go func() {
      // simulate a long task with time.Sleep(). 5 seconds
      time.Sleep(5 * time.Second)

      // note that you are using the copied context "cCp", IMPORTANT
      log.Println("Done! in path " + cCp.Request.URL.Path)
    }()
  })

  router.GET("/long_sync", func(c *gin.Context) {
    // simulate a long task with time.Sleep(). 5 seconds
    time.Sleep(5 * time.Second)

    // since we are NOT using a goroutine, we do not have to copy the context
    log.Println("Done! in path " + c.Request.URL.Path)
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```
