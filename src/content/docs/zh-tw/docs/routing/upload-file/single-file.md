---
title: "單一檔案"
sidebar:
  order: 1
---

參考 issue [#774](https://github.com/gin-gonic/gin/issues/774) 和詳細的[範例程式碼](https://github.com/gin-gonic/examples/tree/master/upload-file/single)。

`file.Filename` **不應被信任**。請參閱 [MDN 上的 `Content-Disposition`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives) 和 [#1693](https://github.com/gin-gonic/gin/issues/1693)

> 檔名始終是可選的，應用程式不應盲目使用：應剝離路徑資訊，並轉換為伺服器檔案系統的規則。

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

使用 `curl` 測試：

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
