---
title: "تقديم البيانات من ملف"
sidebar:
  order: 7
---

يوفر Gin عدة طرق لتقديم الملفات للعملاء. كل طريقة تناسب حالة استخدام مختلفة:

- **`c.File(path)`** -- يُقدم ملفاً من نظام الملفات المحلي. يتم اكتشاف نوع المحتوى تلقائياً. استخدمه عندما تعرف مسار الملف الدقيق وقت الترجمة أو قمت بالتحقق منه بالفعل.
- **`c.FileFromFS(path, fs)`** -- يُقدم ملفاً من واجهة `http.FileSystem`. مفيد عند تقديم ملفات من أنظمة ملفات مضمّنة (`embed.FS`) أو واجهات تخزين مخصصة أو عندما تريد تقييد الوصول إلى شجرة مجلدات محددة.
- **`c.FileAttachment(path, filename)`** -- يُقدم ملفاً كتنزيل عن طريق تعيين ترويسة `Content-Disposition: attachment`. سيطلب المتصفح من المستخدم حفظ الملف باستخدام اسم الملف الذي تقدمه، بغض النظر عن اسم الملف الأصلي على القرص.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // Serve a file inline (displayed in browser)
  router.GET("/local/file", func(c *gin.Context) {
    c.File("local/file.go")
  })

  // Serve a file from an http.FileSystem
  var fs http.FileSystem = http.Dir("/var/www/assets")
  router.GET("/fs/file", func(c *gin.Context) {
    c.FileFromFS("fs/file.go", fs)
  })

  // Serve a file as a downloadable attachment with a custom filename
  router.GET("/download", func(c *gin.Context) {
    c.FileAttachment("local/report-2024-q1.xlsx", "quarterly-report.xlsx")
  })

  router.Run(":8080")
}
```

يمكنك اختبار نقطة نهاية التنزيل باستخدام curl:

```sh
# The -v flag shows the Content-Disposition header
curl -v http://localhost:8080/download --output report.xlsx

# Serve a file inline
curl http://localhost:8080/local/file
```

لبث البيانات من `io.Reader` (مثل عنوان URL بعيد أو محتوى مُولّد ديناميكياً)، استخدم `c.DataFromReader()` بدلاً من ذلك. راجع [تقديم البيانات من قارئ](/ar/docs/rendering/serving-data-from-reader/) للمزيد من التفاصيل.

:::caution[الأمان: اجتياز المسار]
لا تمرر أبداً مدخلات المستخدم مباشرة إلى `c.File()` أو `c.FileAttachment()`. يمكن للمهاجم تقديم مسار مثل `../../etc/passwd` لقراءة ملفات عشوائية على خادمك. تحقق دائماً من مسارات الملفات ونظّفها، أو استخدم `c.FileFromFS()` مع `http.FileSystem` مقيّد يحصر الوصول في مجلد محدد.

```go
// DANGEROUS -- never do this
router.GET("/files/:name", func(c *gin.Context) {
  c.File(c.Param("name")) // attacker controls the path
})

// SAFE -- restrict to a specific directory
var safeFS http.FileSystem = http.Dir("/var/www/public")
router.GET("/files/:name", func(c *gin.Context) {
  c.FileFromFS(c.Param("name"), safeFS)
})
```
:::
