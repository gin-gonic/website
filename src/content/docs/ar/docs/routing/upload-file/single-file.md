---
title: "ملف واحد"
sidebar:
  order: 1
---

يشير إلى المشكلة [#774](https://github.com/gin-gonic/gin/issues/774) و[الكود النموذجي](https://github.com/gin-gonic/examples/tree/master/upload-file/single) التفصيلي.

`file.Filename` **لا ينبغي** الوثوق به. راجع [`Content-Disposition` على MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives) و[#1693](https://github.com/gin-gonic/gin/issues/1693)

> اسم الملف اختياري دائماً ويجب عدم استخدامه بشكل أعمى من قبل التطبيق: يجب إزالة معلومات المسار، ويجب إجراء التحويل إلى قواعد نظام ملفات الخادم.

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

كيفية استخدام `curl`:

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
