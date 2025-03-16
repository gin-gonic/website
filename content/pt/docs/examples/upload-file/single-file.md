---
title: "Único Ficheiro"
draft: false
---

Consulte a questão [#774](https://github.com/gin-gonic/gin/issues/774) e [exemplo de código](https://github.com/gin-gonic/examples/tree/master/upload-file/single) detalhado.

`file.Filename` **NÃO DEVERIA** ser confiado. Consulte [`Content-Disposition` na MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives) e a questão [#1693](https://github.com/gin-gonic/gin/issues/1693).

> O nome do ficheiro sempre é opcional e não deve ser usado cegamente pela aplicação: a informação do caminho deveria ser esvaziada, e a conversão para as regras do sistema de ficheiro do servidor deveria ser feita.

```go
func main() {
	router := gin.Default()
	// definir um limite de memória mais baixa
	// para formulários de várias partes (o padrão é 32MiB)
	router.MaxMultipartMemory = 8 << 20  // 8 MiB
	router.POST("/upload", func(c *gin.Context) {
		// único ficheiro
		file, _ := c.FormFile("file")
		log.Println(file.Filename)

		// carregar o ficheiro para um destino específico.
		c.SaveUploadedFile(file, dst)

		c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
	})
	router.Run(":8080")
}
```

Como testar com a `curl`:

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
