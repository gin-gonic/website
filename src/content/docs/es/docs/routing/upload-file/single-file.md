---
title: "Archivo individual"
sidebar:
  order: 1
---

Usa `c.FormFile` para recibir un solo archivo subido desde una solicitud `multipart/form-data`, luego `c.SaveUploadedFile` para guardarlo en disco.

Puedes controlar la memoria máxima usada durante el análisis multipart configurando `router.MaxMultipartMemory` (el valor predeterminado es 32 MiB). Los archivos más grandes que este límite se almacenan en archivos temporales en disco en lugar de en memoria.

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

## Pruébalo

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/your/file.zip" \
  -H "Content-Type: multipart/form-data"
# Output: 'file.zip' uploaded!
```

:::caution
Nunca confíes en `file.Filename` del cliente. Siempre sanitiza el nombre del archivo antes de usarlo en rutas de archivos. Usa `filepath.Base` para eliminar componentes de directorio y prevenir ataques de recorrido de ruta.
:::

## Ver también

- [Múltiples archivos](/es/docs/routing/upload-file/multiple-file/)
- [Limitar tamaño de subida](/es/docs/routing/upload-file/limit-bytes/)
