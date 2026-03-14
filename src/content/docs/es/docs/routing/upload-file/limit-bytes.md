---
title: "Limitar tamaño de subida"
sidebar:
  order: 3
---

Este ejemplo muestra cómo usar `http.MaxBytesReader` para limitar estrictamente el tamaño máximo de los archivos subidos y devolver un estado `413` cuando se excede el límite.

Consulta el [código de ejemplo](https://github.com/gin-gonic/examples/blob/master/upload-file/limit-bytes/main.go) detallado.

## Cómo funciona

1. **Definir límite** -- Una constante `MaxUploadSize` (1 MB) establece el límite máximo para las subidas.
2. **Aplicar límite** -- `http.MaxBytesReader` envuelve `c.Request.Body`. Si el cliente envía más bytes de los permitidos, el lector se detiene y devuelve un error.
3. **Analizar y verificar** -- `c.Request.ParseMultipartForm` activa la lectura. El código verifica `*http.MaxBytesError` para devolver un estado `413 Request Entity Too Large` con un mensaje claro.

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

const (
  MaxUploadSize = 1 << 20 // 1 MB
)

func uploadHandler(c *gin.Context) {
  // Wrap the body reader so only MaxUploadSize bytes are allowed
  c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, MaxUploadSize)

  // Parse multipart form
  if err := c.Request.ParseMultipartForm(MaxUploadSize); err != nil {
    if _, ok := err.(*http.MaxBytesError); ok {
      c.JSON(http.StatusRequestEntityTooLarge, gin.H{
        "error": fmt.Sprintf("file too large (max: %d bytes)", MaxUploadSize),
      })
      return
    }
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }

  file, _, err := c.Request.FormFile("file")
  if err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": "file form required"})
    return
  }
  defer file.Close()

  c.JSON(http.StatusOK, gin.H{
    "message": "upload successful",
  })
}

func main() {
  r := gin.Default()
  r.POST("/upload", uploadHandler)
  r.Run(":8080")
}
```

Cómo usar `curl`:

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
