---
title: "Single file"
draft: false
---
Ссылки на проблему [#774](https://github.com/gin-gonic/gin/issues/774) и деталь [пример кода](https://github.com/gin-gonic/examples/tree/master/upload-file/single).

`file.Filename` **НЕ ДОЛЖНО** быть доверенным. См. [`Content-Disposition` на MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives) и [#1693](https://github.com/gin-gonic/gin/issues/1693)

> Имя файла всегда необязательно и не должно использоваться приложением вслепую: информация о пути должна быть удалена, и должно быть выполнено преобразование к правилам файловой системы сервера.

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
		c.SaveUploadedFile(file, dst)

		c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
	})
	router.Run(":8080")
}
```

Как тестировать с помощью `curl`:

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
