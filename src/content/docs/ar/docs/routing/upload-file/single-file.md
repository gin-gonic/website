---
title: "ملف واحد"
sidebar:
  order: 1
---

استخدم `c.FormFile` لاستقبال ملف واحد مرفوع من طلب `multipart/form-data`، ثم `c.SaveUploadedFile` لحفظه على القرص.

يمكنك التحكم في الحد الأقصى للذاكرة المستخدمة أثناء تحليل multipart بتعيين `router.MaxMultipartMemory` (الافتراضي 32 ميجابايت). الملفات الأكبر من هذا الحد تُخزّن في ملفات مؤقتة على القرص بدلاً من الذاكرة.

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

## اختبره

```sh
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/your/file.zip" \
  -H "Content-Type: multipart/form-data"
# Output: 'file.zip' uploaded!
```

:::caution
لا تثق أبداً بـ `file.Filename` من العميل. قم دائماً بتنظيف اسم الملف قبل استخدامه في مسارات الملفات. استخدم `filepath.Base` لإزالة مكونات المجلد ومنع هجمات اجتياز المسار.
:::

## انظر أيضاً

- [ملفات متعددة](/ar/docs/routing/upload-file/multiple-file/)
- [تحديد حجم الرفع](/ar/docs/routing/upload-file/limit-bytes/)
