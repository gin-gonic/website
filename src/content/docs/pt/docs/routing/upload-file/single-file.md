---
title: "Arquivo único"
sidebar:
  order: 1
---

Referência da issue [#774](https://github.com/gin-gonic/gin/issues/774) e [código de exemplo](https://github.com/gin-gonic/examples/tree/master/upload-file/single) detalhado.

`file.Filename` **NÃO DEVE** ser considerado confiável. Veja [`Content-Disposition` no MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives) e [#1693](https://github.com/gin-gonic/gin/issues/1693)

> O nome do arquivo é sempre opcional e não deve ser usado cegamente pela aplicação: informações de caminho devem ser removidas e a conversão para as regras do sistema de arquivos do servidor deve ser feita.

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

Como usar o `curl`:

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
