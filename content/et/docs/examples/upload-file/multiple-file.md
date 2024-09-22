---
title: "Mitu faili"
draft: false
---

Vaata detailselt [example code](https://github.com/gin-gonic/examples/tree/master/upload-file/multiple).

```go
func main() {
	router := gin.Default()
	// Määrake mitmeosalistele vormidele alumine mälupiirang (vaikimisi on 32 MiB)
	router.MaxMultipartMemory = 8 << 20  // 8 MiB
	router.POST("/upload", func(c *gin.Context) {
		// Mitmeosaline vorm
		form, _ := c.MultipartForm()
		files := form.File["upload[]"]

		for _, file := range files {
			log.Println(file.Filename)

			// Laadige fail konkreetsesse dst.
			c.SaveUploadedFile(file, dst)
		}
		c.String(http.StatusOK, fmt.Sprintf("%d files uploaded!", len(files)))
	})
	router.Run(":8080")
}
```

Kuidas kasutada `curl`:

```sh
curl -X POST http://localhost:8080/upload \
  -F "upload[]=@/Users/appleboy/test1.zip" \
  -F "upload[]=@/Users/appleboy/test2.zip" \
  -H "Content-Type: multipart/form-data"
```
