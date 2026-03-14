---
title: "تک فایل"
sidebar:
  order: 1
---

مرجع issue [#774](https://github.com/gin-gonic/gin/issues/774) و [کد نمونه](https://github.com/gin-gonic/examples/tree/master/upload-file/single) جزئیات.

`file.Filename` **نباید** مورد اعتماد قرار گیرد. [`Content-Disposition` در MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#Directives) و [#1693](https://github.com/gin-gonic/gin/issues/1693) را ببینید

> نام فایل همیشه اختیاری است و نباید بدون بررسی توسط برنامه استفاده شود: اطلاعات مسیر باید حذف شود و تبدیل به قوانین سیستم فایل سرور باید انجام شود.

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

نحوه استفاده از `curl`:

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
