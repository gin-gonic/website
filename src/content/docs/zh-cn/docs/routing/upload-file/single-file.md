---
title: "单文件"
sidebar:
  order: 1
---

参考 issue [#774](https://github.com/gin-gonic/gin/issues/774) 和详细[示例代码](https://github.com/gin-gonic/examples/tree/master/upload-file/single)。

`file.Filename` **不应该**被信任。参阅 [MDN 上的 `Content-Disposition`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives) 和 [#1693](https://github.com/gin-gonic/gin/issues/1693)

> 文件名始终是可选的，应用程序不应盲目使用它：应该去除路径信息，并按照服务器文件系统规则进行转换。

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

如何使用 `curl`：

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
