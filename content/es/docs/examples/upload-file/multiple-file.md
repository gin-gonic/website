---
title: "Múltiples archivos"
draft: false
---

Vea el código de [ejemplo detallado](https://github.com/gin-gonic/examples/tree/master/upload-file/multiple).

```go
func main() {
	router := gin.Default()
	// Establecer un límite de memoria inferior para formularios de multipart (el valor predeterminado es 32 MiB)
	router.MaxMultipartMemory = 8 << 20  // 8 MiB
	router.POST("/upload", func(c *gin.Context) {
		// Formulario multipart
		form, _ := c.MultipartForm()
		files := form.File["upload[]"]

		for _, file := range files {
			log.Println(file.Filename)

			// Guarda el archivo recibido a un destino específico
			c.SaveUploadedFile(file, dst)
		}
		c.String(http.StatusOK, fmt.Sprintf("%d files uploaded!", len(files)))
	})
	router.Run(":8080")
}
```

Ejemplo para ejecutar `curl`:

```sh
curl -X POST http://localhost:8080/upload \
  -F "upload[]=@/Users/appleboy/test1.zip" \
  -F "upload[]=@/Users/appleboy/test2.zip" \
  -H "Content-Type: multipart/form-data"
```
