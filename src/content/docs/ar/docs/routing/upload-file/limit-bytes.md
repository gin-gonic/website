---
title: "تحديد حجم الرفع"
sidebar:
  order: 3
---

استخدم `http.MaxBytesReader` لتقييد الحد الأقصى لحجم الملفات المرفوعة بشكل صارم. عند تجاوز الحد، يُرجع القارئ خطأ ويمكنك الاستجابة بحالة `413 Request Entity Too Large`.

هذا مهم لمنع هجمات رفض الخدمة حيث يُرسل العملاء ملفات كبيرة جداً لاستنفاد ذاكرة الخادم أو مساحة القرص.

## كيف يعمل

1. **تحديد الحد** — ثابت `MaxUploadSize` (1 ميجابايت) يُعيّن الحد الأقصى للرفع.
2. **فرض الحد** — `http.MaxBytesReader` يلف `c.Request.Body`. إذا أرسل العميل بايتات أكثر من المسموح، يتوقف القارئ ويُرجع خطأ.
3. **التحليل والتحقق** — `c.Request.ParseMultipartForm` يُشغّل القراءة. يتحقق الكود من `*http.MaxBytesError` لإرجاع حالة `413` مع رسالة واضحة.

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

## اختبره

```sh
# Upload a small file (under 1 MB) -- succeeds
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/small-file.txt"
# Output: {"message":"upload successful"}

# Upload a large file (over 1 MB) -- rejected
curl -X POST http://localhost:8080/upload \
  -F "file=@/path/to/large-file.zip"
# Output: {"error":"file too large (max: 1048576 bytes)"}
```

## انظر أيضاً

- [ملف واحد](/ar/docs/routing/upload-file/single-file/)
- [ملفات متعددة](/ar/docs/routing/upload-file/multiple-file/)
