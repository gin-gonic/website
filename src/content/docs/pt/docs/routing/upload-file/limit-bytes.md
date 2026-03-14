---
title: "Limitar tamanho do upload"
sidebar:
  order: 3
---

Este exemplo mostra como usar `http.MaxBytesReader` para limitar rigorosamente o tamanho máximo de arquivos enviados e retornar um status `413` quando o limite for excedido.

Veja o [código de exemplo](https://github.com/gin-gonic/examples/blob/master/upload-file/limit-bytes/main.go) detalhado.

## Como funciona

1. **Definir limite** -- Uma constante `MaxUploadSize` (1 MB) define o teto para uploads.
2. **Aplicar limite** -- `http.MaxBytesReader` envolve `c.Request.Body`. Se o cliente enviar mais bytes do que o permitido, o reader para e retorna um erro.
3. **Analisar e verificar** -- `c.Request.ParseMultipartForm` dispara a leitura. O código verifica `*http.MaxBytesError` para retornar um status `413 Request Entity Too Large` com uma mensagem clara.

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

Como usar o `curl`:

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
