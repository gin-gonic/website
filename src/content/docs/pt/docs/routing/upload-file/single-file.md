---
title: "Arquivo único"
sidebar:
  order: 1
---

Use `c.FormFile` para receber um único arquivo enviado de uma requisição `multipart/form-data`, depois `c.SaveUploadedFile` para salvá-lo no disco.

Você pode controlar a memória máxima usada durante a análise multipart definindo `router.MaxMultipartMemory` (o padrão é 32 MiB). Arquivos maiores que esse limite são armazenados em arquivos temporários no disco em vez de na memória.

```go
package main

import (
  "fmt"
  "log"
  "net/http"
  "path/filepath"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  // Set a lower memory limit for multipart forms (default is 32 MiB)
  router.MaxMultipartMemory = 8 << 20 // 8 MiB

  router.POST("/upload", func(c *gin.Context) {
    // single file
    file, err := c.FormFile("file")
    if err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    log.Println(file.Filename)

    // Upload the file to specific dst.
    dst := filepath.Join("./files/", filepath.Base(file.Filename))
    c.SaveUploadedFile(file, dst)

    c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
  })

  router.Run(":8080")
}
```

## Teste

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/your/file.zip" \
  -H "Content-Type: multipart/form-data"
# Output: 'file.zip' uploaded!
```

:::caution
Nunca confie em `file.Filename` vindo do cliente. Sempre sanitize o nome do arquivo antes de usá-lo em caminhos de arquivo. Use `filepath.Base` para remover componentes de diretório e prevenir ataques de travessia de caminho.
:::

## Veja também

- [Múltiplos arquivos](/pt/docs/routing/upload-file/multiple-file/)
- [Limitar tamanho do upload](/pt/docs/routing/upload-file/limit-bytes/)
