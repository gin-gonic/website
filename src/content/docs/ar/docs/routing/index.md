---
title: "التوجيه"
sidebar:
  order: 3
---

يوفر Gin نظام توجيه قوي مبني على [httprouter](https://github.com/julienschmidt/httprouter) لمطابقة عناوين URL عالية الأداء. يستخدم httprouter من الداخل [شجرة Radix](https://en.wikipedia.org/wiki/Radix_tree) (تُسمى أيضاً الشجرة المضغوطة) لتخزين المسارات والبحث عنها، مما يعني أن مطابقة المسارات سريعة للغاية ولا تتطلب أي تخصيص للذاكرة لكل عملية بحث. وهذا يجعل Gin أحد أسرع أطر عمل Go للويب المتاحة.

يتم تسجيل المسارات عن طريق استدعاء طريقة HTTP على المحرك (أو مجموعة مسارات) وتقديم نمط URL مع دالة معالجة واحدة أو أكثر:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/hello", func(c *gin.Context) {
    c.String(http.StatusOK, "Hello, World!")
  })

  router.POST("/users", func(c *gin.Context) {
    name := c.PostForm("name")
    c.JSON(http.StatusCreated, gin.H{"user": name})
  })

  router.Run(":8080")
}
```

## في هذا القسم

تغطي الصفحات أدناه كل موضوع من مواضيع التوجيه بالتفصيل:

- [**استخدام طرق HTTP**](./http-method/) -- تسجيل المسارات لـ GET وPOST وPUT وDELETE وPATCH وHEAD وOPTIONS.
- [**المعاملات في المسار**](./param-in-path/) -- التقاط الأجزاء الديناميكية من مسارات URL (مثل `/user/:name`).
- [**معاملات سلسلة الاستعلام**](./querystring-param/) -- قراءة قيم سلسلة الاستعلام من عنوان URL للطلب.
- [**الاستعلام ونموذج الإرسال**](./query-and-post-form/) -- الوصول إلى بيانات سلسلة الاستعلام ونموذج POST في نفس المعالج.
- [**Map كسلسلة استعلام أو نموذج إرسال**](./map-as-querystring-or-postform/) -- ربط معاملات Map من سلاسل الاستعلام أو نماذج POST.
- [**نموذج Multipart/urlencoded**](./multipart-urlencoded-form/) -- تحليل بيانات `multipart/form-data` و`application/x-www-form-urlencoded`.
- [**رفع الملفات**](./upload-file/) -- معالجة رفع ملف واحد أو ملفات متعددة.
- [**تجميع المسارات**](./grouping-routes/) -- تنظيم المسارات تحت بادئات مشتركة مع وسيطات مشتركة.
- [**إعادة التوجيه**](./redirects/) -- تنفيذ إعادة التوجيه على مستوى HTTP والموجّه.
