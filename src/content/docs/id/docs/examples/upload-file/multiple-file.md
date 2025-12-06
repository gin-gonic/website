---
title: "File multipel"
---

Lihat detail [contoh kode](https://github.com/gin-gonic/examples/tree/master/upload-file/multiple).

```go
func main() {
  router := gin.Default()
  // Atur batas memori yang lebih rendah untuk multipart form (bawaan 32 MiB)
  router.MaxMultipartMemory = 8 << 20  // 8 MiB
  router.POST("/upload", func(c *gin.Context) {
    // Multipart form
    form, _ := c.MultipartForm()
    files := form.File["files"]

    for _, file := range files {
      log.Println(file.Filename)

      // Unggah file ke tujuan spesifik
      c.SaveUploadedFile(file, "./files/" + file.Filename)
    }
    c.String(http.StatusOK, fmt.Sprintf("%d files uploaded!", len(files)))
  })
  router.Run(":8080")
}
```

Cara menggunakan `curl`:

```sh
curl -X POST http://localhost:8080/upload \
  -F "files=@/Users/appleboy/test1.zip" \
  -F "files=@/Users/appleboy/test2.zip" \
  -H "Content-Type: multipart/form-data"
```
