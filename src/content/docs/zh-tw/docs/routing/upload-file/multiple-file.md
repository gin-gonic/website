---
title: "多個檔案"
sidebar:
  order: 2
---

請參閱詳細的[範例程式碼](https://github.com/gin-gonic/examples/tree/master/upload-file/multiple)。

```go
func main() {
  router := gin.Default()
  // Set a lower memory limit for multipart forms (default is 32 MiB)
  router.MaxMultipartMemory = 8 << 20  // 8 MiB
  router.POST("/upload", func(c *gin.Context) {
    // Multipart form
    form, _ := c.MultipartForm()
    files := form.File["files"]

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

使用 `curl` 測試：

```sh
curl -X POST http://localhost:8080/upload \
  -F "files=@/Users/appleboy/test1.zip" \
  -F "files=@/Users/appleboy/test2.zip" \
  -H "Content-Type: multipart/form-data"
```
