---
title: "Limitar tamanho do upload"
sidebar:
  order: 3
---

Use `http.MaxBytesReader` para limitar estritamente o tamanho máximo dos arquivos enviados. Quando o limite é excedido, o reader retorna um erro e você pode responder com um status `413 Request Entity Too Large`.

Isso é importante para prevenir ataques de negação de serviço onde clientes enviam arquivos excessivamente grandes para esgotar a memória ou o espaço em disco do servidor.

## Como funciona

1. **Definir limite** — Uma constante `MaxUploadSize` (1 MB) define o limite máximo para uploads.
2. **Impor limite** — `http.MaxBytesReader` envolve `c.Request.Body`. Se o cliente enviar mais bytes que o permitido, o reader para e retorna um erro.
3. **Analisar e verificar** — `c.Request.ParseMultipartForm` dispara a leitura. O código verifica `*http.MaxBytesError` para retornar um status `413` com uma mensagem clara.

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

## Teste

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

## Veja também

- [Arquivo único](/pt/docs/routing/upload-file/single-file/)
- [Múltiplos arquivos](/pt/docs/routing/upload-file/multiple-file/)
