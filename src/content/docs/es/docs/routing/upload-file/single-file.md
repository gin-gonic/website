---
title: "Archivo individual"
sidebar:
  order: 1
---

Hace referencia al issue [#774](https://github.com/gin-gonic/gin/issues/774) y al [código de ejemplo](https://github.com/gin-gonic/examples/tree/master/upload-file/single) detallado.

`file.Filename` **NO DEBE** ser confiable. Consulta [`Content-Disposition` en MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives) y [#1693](https://github.com/gin-gonic/gin/issues/1693)

> El nombre de archivo es siempre opcional y no debe ser utilizado ciegamente por la aplicación: la información de ruta debe ser eliminada, y la conversión a las reglas del sistema de archivos del servidor debe ser realizada.

```go
func main() {
  router := gin.Default()
  // Set a lower memory limit for multipart forms (default is 32 MiB)
  router.MaxMultipartMemory = 8 << 20  // 8 MiB
  router.POST("/upload", func(c *gin.Context) {
    // single file
    file, _ := c.FormFile("file")
    log.Println(file.Filename)

    // Upload the file to specific dst.
    c.SaveUploadedFile(file, "./files/" + file.Filename)

    c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
  })
  router.Run(":8080")
}
```

Cómo usar `curl`:

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
