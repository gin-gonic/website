---
title: "الربط"
sidebar:
  order: 4
---

يوفر Gin نظام ربط قوي يحلل بيانات الطلب إلى هياكل Go ويتحقق منها تلقائياً. بدلاً من استدعاء `c.PostForm()` يدوياً أو قراءة `c.Request.Body`، تحدد هيكلاً بعلامات وتدع Gin يقوم بالعمل.

## Bind مقابل ShouldBind

يوفر Gin عائلتين من طرق الربط:

| الطريقة | عند الخطأ | استخدمها عندما |
|--------|----------|----------|
| `c.Bind`، `c.BindJSON`، إلخ. | تستدعي `c.AbortWithError(400, err)` تلقائياً | تريد أن يتعامل Gin مع استجابات الخطأ |
| `c.ShouldBind`، `c.ShouldBindJSON`، إلخ. | تُرجع الخطأ لتتعامل معه أنت | تريد استجابات خطأ مخصصة |

في معظم الحالات، **يُفضل استخدام `ShouldBind`** لمزيد من التحكم في معالجة الأخطاء.

## مثال سريع

```go
type LoginForm struct {
  User     string `form:"user" binding:"required"`
  Password string `form:"password" binding:"required"`
}

func main() {
  router := gin.Default()

  router.POST("/login", func(c *gin.Context) {
    var form LoginForm
    // ShouldBind checks Content-Type to select a binding engine automatically
    if err := c.ShouldBind(&form); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, gin.H{"status": "logged in"})
  })

  router.Run(":8080")
}
```

## التنسيقات المدعومة

يستطيع Gin ربط البيانات من مصادر عديدة: **JSON** و**XML** و**YAML** و**TOML** و**بيانات النماذج** (URL-encoded وmultipart) و**سلاسل الاستعلام** و**معاملات URI** و**الترويسات**. استخدم علامة الهيكل المناسبة (`json`، `xml`، `yaml`، `form`، `uri`، `header`) لتعيين الحقول. قواعد التحقق توضع في علامة `binding` وتستخدم صياغة [go-playground/validator](https://github.com/go-playground/validator).

## في هذا القسم

- [**ربط النموذج والتحقق**](./binding-and-validation/) -- مفاهيم الربط الأساسية وقواعد التحقق
- [**المحققون المخصصون**](./custom-validators/) -- تسجيل دوال التحقق الخاصة بك
- [**ربط سلسلة الاستعلام أو بيانات الإرسال**](./bind-query-or-post/) -- الربط من سلاسل الاستعلام وأجسام النماذج
- [**ربط URI**](./bind-uri/) -- ربط معاملات المسار في هياكل
- [**ربط الترويسة**](./bind-header/) -- ربط ترويسات HTTP في هياكل
- [**القيمة الافتراضية**](./default-value/) -- تعيين قيم احتياطية للحقول المفقودة
- [**تنسيق المجموعات**](./collection-format/) -- معالجة معاملات المصفوفات في الاستعلام
- [**محلل مخصص**](./custom-unmarshaler/) -- تنفيذ منطق إلغاء التسلسل المخصص
- [**ربط مربعات اختيار HTML**](./bind-html-checkboxes/) -- معالجة مدخلات مربعات الاختيار في النماذج
- [**ربط Multipart/urlencoded**](./multipart-urlencoded-binding/) -- ربط بيانات النماذج متعددة الأجزاء
- [**علامة هيكل مخصصة**](./custom-struct-tag/) -- استخدام علامات هيكل مخصصة لتعيين الحقول
- [**محاولة ربط الجسم في هياكل مختلفة**](./bind-body-into-different-structs/) -- تحليل جسم الطلب أكثر من مرة
