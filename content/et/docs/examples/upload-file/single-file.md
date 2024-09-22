---
title: "Üksik fail"
draft: false
---

Viidete probleem [#774](https://github.com/gin-gonic/gin/issues/774) ja detailselt [example code](https://github.com/gin-gonic/examples/tree/master/upload-file/single).

`file.Filename` **EI TOHI** usaldada. Vaata [`Content-Disposition` on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives) ja [#1693](https://github.com/gin-gonic/gin/issues/1693)

> Failinimi on alati valikuline ja rakendus ei tohi seda pimesi kasutada: failitee teave tuleb eemaldada ja serveri failisüsteemi reegliteks teisendada.

```go
func main() {
	router := gin.Default()
	// Määrake mitmeosalistele vormidele alumine mälupiirang (vaikimisi on 32 MiB)
	router.MaxMultipartMemory = 8 << 20  // 8 MiB
	router.POST("/upload", func(c *gin.Context) {
		// üksik fail
		file, _ := c.FormFile("file")
		log.Println(file.Filename)

		// Laadige fail konkreetsesse dst.
		c.SaveUploadedFile(file, dst)

		c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
	})
	router.Run(":8080")
}
```

Kuidas kasutada `curl`:

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
