---
title: "Vários Ficheiros"
---

Consulte o [código de exemplo](https://github.com/gin-gonic/examples/tree/master/upload-file/multiple) detalhado.

```go
func main() {
  router := gin.Default()
  // definir um limite de memória mais baixa
  // para formulários de várias partes (o padrão é 32MiB)
  router.MaxMultipartMemory = 8 << 20  // 8 MiB
  router.POST("/upload", func(c *gin.Context) {
    // formulário de várias partes
    form, _ := c.MultipartForm()
    files := form.File["upload[]"]

    for _, file := range files {
      log.Println(file.Filename)

      // Upload the file to specific dst.
      c.SaveUploadedFile(file, "./files/" + file.Filename)
    }
    c.String(http.StatusOK, fmt.Sprintf("%d files uploaded!", len(files)))
  })
  router.Run(":8080")
}
```

Como testar com a `curl`:

```sh
curl -X POST http://localhost:8080/upload \
  -F "upload[]=@/Users/appleboy/test1.zip" \
  -F "upload[]=@/Users/appleboy/test2.zip" \
  -H "Content-Type: multipart/form-data"
```
