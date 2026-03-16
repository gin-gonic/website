---
title: "تک فایل"
sidebar:
  order: 1
---

از `c.FormFile` برای دریافت یک فایل آپلود شده از یک درخواست `multipart/form-data` و سپس `c.SaveUploadedFile` برای ذخیره آن در دیسک استفاده کنید.

می‌توانید حداکثر حافظه مصرفی هنگام تجزیه multipart را با تنظیم `router.MaxMultipartMemory` کنترل کنید (پیش‌فرض ۳۲ مگابایت). فایل‌های بزرگ‌تر از این محدودیت به‌جای حافظه در فایل‌های موقت روی دیسک ذخیره می‌شوند.

```go
package main

import (
  "fmt"
  "log"
  "net/http"
  "path/filepath"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  // Set a lower memory limit for multipart forms (default is 32 MiB)
  router.MaxMultipartMemory = 8 << 20 // 8 MiB

  router.POST("/upload", func(c *gin.Context) {
    // single file
    file, err := c.FormFile("file")
    if err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    log.Println(file.Filename)

    // Upload the file to specific dst.
    dst := filepath.Join("./files/", filepath.Base(file.Filename))
    c.SaveUploadedFile(file, dst)

    c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
  })

  router.Run(":8080")
}
```

## تست

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/your/file.zip" \
  -H "Content-Type: multipart/form-data"
# Output: 'file.zip' uploaded!
```

:::caution
هرگز به `file.Filename` از سمت کلاینت اعتماد نکنید. همیشه قبل از استفاده در مسیرهای فایل، نام فایل را پاکسازی کنید. از `filepath.Base` برای حذف اجزای مسیر و جلوگیری از حملات پیمایش مسیر استفاده کنید.
:::

## همچنین ببینید

- [چند فایل](/fa/docs/routing/upload-file/multiple-file/)
- [محدودیت حجم آپلود](/fa/docs/routing/upload-file/limit-bytes/)
