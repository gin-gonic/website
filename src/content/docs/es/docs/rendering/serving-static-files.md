---
title: "Servir archivos estáticos"
sidebar:
  order: 6
---

Gin proporciona tres métodos para servir contenido estático:

- **`router.Static(relativePath, root)`** -- Sirve un directorio completo. Las solicitudes a `relativePath` se mapean a archivos bajo `root`. Por ejemplo, `router.Static("/assets", "./assets")` sirve `./assets/style.css` en `/assets/style.css`.
- **`router.StaticFS(relativePath, fs)`** -- Como `Static`, pero acepta una interfaz `http.FileSystem`, dándote más control sobre cómo se resuelven los archivos. Úsalo cuando necesites servir archivos desde un sistema de archivos embebido o quieras personalizar el comportamiento del listado de directorios.
- **`router.StaticFile(relativePath, filePath)`** -- Sirve un solo archivo. Útil para endpoints como `/favicon.ico` o `/robots.txt`.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.Static("/assets", "./assets")
  router.StaticFS("/more_static", http.Dir("my_file_system"))
  router.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::caution[Seguridad: recorrido de rutas]
El directorio que pasas a `Static()` o `http.Dir()` será completamente accesible para cualquier cliente. Asegúrate de que no contenga archivos sensibles como archivos de configuración, archivos `.env`, claves privadas o archivos de base de datos.

Como buena práctica:

- Usa un directorio dedicado que contenga solo los archivos que pretendes servir públicamente.
- Evita pasar rutas como `"."` o `"/"` que podrían exponer todo tu proyecto o sistema de archivos.
- Si necesitas un control más fino (por ejemplo, deshabilitar listados de directorios), usa `StaticFS` con una implementación personalizada de `http.FileSystem`. El estándar `http.Dir` habilita el listado de directorios por defecto.
:::
