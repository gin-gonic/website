---
title: "Limitar tamaño de subida"
sidebar:
  order: 3
---

Usa `http.MaxBytesReader` para limitar estrictamente el tamaño máximo de los archivos subidos. Cuando se excede el límite, el lector devuelve un error y puedes responder con un estado `413 Request Entity Too Large`.

Esto es importante para prevenir ataques de denegación de servicio donde los clientes envían archivos excesivamente grandes para agotar la memoria o el espacio en disco del servidor.

## Cómo funciona

1. **Definir límite** — Una constante `MaxUploadSize` (1 MB) establece el límite máximo para las subidas.
2. **Aplicar límite** — `http.MaxBytesReader` envuelve `c.Request.Body`. Si el cliente envía más bytes de los permitidos, el lector se detiene y devuelve un error.
3. **Analizar y verificar** — `c.Request.ParseMultipartForm` activa la lectura. El código verifica `*http.MaxBytesError` para devolver un estado `413` con un mensaje claro.

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

## Pruébalo

```sh
# Upload a small file (under 1 MB) -- succeeds
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/small-file.txt"
# Output: {"message":"upload successful"}

# Upload a large file (over 1 MB) -- rejected
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/large-file.zip"
# Output: {"error":"file too large (max: 1048576 bytes)"}
```

## Ver también

- [Archivo individual](/es/docs/routing/upload-file/single-file/)
- [Múltiples archivos](/es/docs/routing/upload-file/multiple-file/)
