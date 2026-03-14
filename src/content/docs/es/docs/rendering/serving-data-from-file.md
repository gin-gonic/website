---
title: "Servir datos desde archivo"
sidebar:
  order: 7
---

Gin proporciona varios métodos para servir archivos a los clientes. Cada método se adapta a un caso de uso diferente:

- **`c.File(path)`** -- Sirve un archivo del sistema de archivos local. El tipo de contenido se detecta automáticamente. Úsalo cuando conozcas la ruta exacta del archivo en tiempo de compilación o ya la hayas validado.
- **`c.FileFromFS(path, fs)`** -- Sirve un archivo desde una interfaz `http.FileSystem`. Útil cuando sirves archivos desde sistemas de archivos embebidos (`embed.FS`), backends de almacenamiento personalizados, o cuando deseas restringir el acceso a un árbol de directorios específico.
- **`c.FileAttachment(path, filename)`** -- Sirve un archivo como descarga estableciendo el encabezado `Content-Disposition: attachment`. El navegador pedirá al usuario que guarde el archivo usando el nombre de archivo que proporcionas, independientemente del nombre original del archivo en disco.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Serve a file inline (displayed in browser)
  router.GET("/local/file", func(c *gin.Context) {
    c.File("local/file.go")
  })

  // Serve a file from an http.FileSystem
  var fs http.FileSystem = http.Dir("/var/www/assets")
  router.GET("/fs/file", func(c *gin.Context) {
    c.FileFromFS("fs/file.go", fs)
  })

  // Serve a file as a downloadable attachment with a custom filename
  router.GET("/download", func(c *gin.Context) {
    c.FileAttachment("local/report-2024-q1.xlsx", "quarterly-report.xlsx")
  })

  router.Run(":8080")
}
```

Puedes probar el endpoint de descarga con curl:

```sh
# The -v flag shows the Content-Disposition header
curl -v http://localhost:8080/download --output report.xlsx

# Serve a file inline
curl http://localhost:8080/local/file
```

Para transmitir datos desde un `io.Reader` (como una URL remota o contenido generado dinámicamente), usa `c.DataFromReader()` en su lugar. Consulta [Servir datos desde reader](/es/docs/rendering/serving-data-from-reader/) para más detalles.

:::caution[Seguridad: recorrido de rutas]
Nunca pases entrada del usuario directamente a `c.File()` o `c.FileAttachment()`. Un atacante podría proporcionar una ruta como `../../etc/passwd` para leer archivos arbitrarios en tu servidor. Siempre valida y sanitiza las rutas de archivos, o usa `c.FileFromFS()` con un `http.FileSystem` restringido que confine el acceso a un directorio específico.

```go
// DANGEROUS -- never do this
router.GET("/files/:name", func(c *gin.Context) {
  c.File(c.Param("name")) // attacker controls the path
})

// SAFE -- restrict to a specific directory
var safeFS http.FileSystem = http.Dir("/var/www/public")
router.GET("/files/:name", func(c *gin.Context) {
  c.FileFromFS(c.Param("name"), safeFS)
})
```
:::
