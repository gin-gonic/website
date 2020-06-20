---
title: "Subir un archivo individual"
draft: false
---

Issue de referencia [#774](https://github.com/gin-gonic/gin/issues/774) y código [detallado de ejemplo](https://github.com/gin-gonic/examples/tree/master/upload-file/single).

`file.Filename` **NO DEBE** confiar en su totalidad en la extensión del archivo. Véase en [`Content-Disposition` de MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives) y [#1693](https://github.com/gin-gonic/gin/issues/1693)

> El nombre de archivo siempre es opcional y la aplicación no debe usarlo a ciegas: la información de su ubicación debe eliminarse y debe hacerse la conversión a las reglas del sistema de archivos del servidor.

```go
func main() {
	router := gin.Default()
	// Establecer un límite de memoria inferior para formularios de multipart (el valor predeterminado es 32 MiB)
	router.MaxMultipartMemory = 8 << 20  // 8 MiB
	router.POST("/upload", func(c *gin.Context) {
		// Archivo individual
		file, _ := c.FormFile("file")
		log.Println(file.Filename)

		// Guarda el archivo recibido a un destino específico
		c.SaveUploadedFile(file, dst)

		c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
	})
	router.Run(":8080")
}
```

Ejemplo para ejecutar `curl`:

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
