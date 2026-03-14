---
title: "تقديم الملفات الثابتة"
sidebar:
  order: 6
---

يوفر Gin ثلاث طرق لتقديم المحتوى الثابت:

- **`router.Static(relativePath, root)`** -- يُقدم مجلداً كاملاً. الطلبات إلى `relativePath` يتم تعيينها إلى ملفات تحت `root`. على سبيل المثال، `router.Static("/assets", "./assets")` يُقدم `./assets/style.css` على `/assets/style.css`.
- **`router.StaticFS(relativePath, fs)`** -- مثل `Static`، لكن يقبل واجهة `http.FileSystem`، مما يمنحك مزيداً من التحكم في كيفية حل الملفات. استخدمها عندما تحتاج لتقديم ملفات من نظام ملفات مضمّن أو تريد تخصيص سلوك قائمة المجلدات.
- **`router.StaticFile(relativePath, filePath)`** -- يُقدم ملفاً واحداً. مفيد لنقاط النهاية مثل `/favicon.ico` أو `/robots.txt`.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.Static("/assets", "./assets")
  router.StaticFS("/more_static", http.Dir("my_file_system"))
  router.StaticFile("/favicon.ico", "./resources/favicon.ico")

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

:::caution[الأمان: اجتياز المسار]
المجلد الذي تمرره إلى `Static()` أو `http.Dir()` سيكون متاحاً بالكامل لأي عميل. تأكد من أنه لا يحتوي على ملفات حساسة مثل ملفات التكوين أو ملفات `.env` أو المفاتيح الخاصة أو ملفات قواعد البيانات.

كأفضل ممارسة:

- استخدم مجلداً مخصصاً يحتوي فقط على الملفات التي تنوي تقديمها للعامة.
- تجنب تمرير مسارات مثل `"."` أو `"/"` التي يمكن أن تكشف مشروعك بالكامل أو نظام الملفات.
- إذا كنت بحاجة لتحكم أدق (مثلاً تعطيل قوائم المجلدات)، استخدم `StaticFS` مع تنفيذ مخصص لـ `http.FileSystem`. يُفعّل `http.Dir` القياسي قائمة المجلدات افتراضياً.
:::
