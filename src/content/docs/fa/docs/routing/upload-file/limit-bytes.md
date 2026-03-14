---
title: "محدودیت حجم آپلود"
sidebar:
  order: 3
---

این مثال نحوه استفاده از `http.MaxBytesReader` برای محدود کردن دقیق حداکثر حجم فایل‌های آپلود شده و بازگرداندن وضعیت `413` هنگام تجاوز از محدودیت را نشان می‌دهد.

[کد نمونه](https://github.com/gin-gonic/examples/blob/master/upload-file/limit-bytes/main.go) جزئیات را ببینید.

## نحوه کار

1. **تعریف محدودیت** -- یک ثابت `MaxUploadSize` (۱ مگابایت) سقف سخت‌افزاری آپلودها را تعیین می‌کند.
2. **اعمال محدودیت** -- `http.MaxBytesReader` بدنه `c.Request.Body` را بسته‌بندی می‌کند. اگر کلاینت بیش از حد مجاز بایت ارسال کند، reader متوقف شده و خطا برمی‌گرداند.
3. **تجزیه و بررسی** -- `c.Request.ParseMultipartForm` خواندن را فعال می‌کند. کد `*http.MaxBytesError` را بررسی می‌کند تا وضعیت `413 Request Entity Too Large` با پیام واضح برگرداند.

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

const (
  MaxUploadSize = 1 << 20 // 1 MB
)

func uploadHandler(c *gin.Context) {
  // Wrap the body reader so only MaxUploadSize bytes are allowed
  c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, MaxUploadSize)

  // Parse multipart form
  if err := c.Request.ParseMultipartForm(MaxUploadSize); err != nil {
    if _, ok := err.(*http.MaxBytesError); ok {
      c.JSON(http.StatusRequestEntityTooLarge, gin.H{
        "error": fmt.Sprintf("file too large (max: %d bytes)", MaxUploadSize),
      })
      return
    }
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }

  file, _, err := c.Request.FormFile("file")
  if err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": "file form required"})
    return
  }
  defer file.Close()

  c.JSON(http.StatusOK, gin.H{
    "message": "upload successful",
  })
}

func main() {
  r := gin.Default()
  r.POST("/upload", uploadHandler)
  r.Run(":8080")
}
```

نحوه استفاده از `curl`:

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/Users/appleboy/test.zip" \
  -H "Content-Type: multipart/form-data"
```
