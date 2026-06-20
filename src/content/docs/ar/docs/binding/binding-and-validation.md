---
title: "ربط النموذج والتحقق"
sidebar:
  order: 1
---

لربط جسم الطلب بنوع معين، استخدم ربط النموذج. ندعم حالياً ربط JSON وXML وYAML والقيم القياسية للنماذج (foo=bar&boo=baz).

يستخدم Gin [**go-playground/validator/v10**](https://github.com/go-playground/validator) للتحقق. اطلع على التوثيق الكامل لاستخدام العلامات [هنا](https://pkg.go.dev/github.com/go-playground/validator/v10#hdr-Baked_In_Validators_and_Tags).

لاحظ أنك تحتاج إلى تعيين علامة الربط المقابلة على جميع الحقول التي تريد ربطها. على سبيل المثال، عند الربط من JSON، عيّن `json:"fieldname"`.

أيضاً، يوفر Gin مجموعتين من الطرق للربط:
- **النوع** - ربط إلزامي
  - **الطرق** - `Bind`، `BindJSON`، `BindXML`، `BindQuery`، `BindYAML`
  - **السلوك** - تستخدم هذه الطرق `MustBindWith` من الداخل. إذا كان هناك خطأ في الربط، يتم إلغاء الطلب باستخدام `c.AbortWithError(400, err).SetType(ErrorTypeBind)`. هذا يُعيّن رمز حالة الاستجابة إلى 400 وترويسة `Content-Type` إلى `text/plain; charset=utf-8`. لاحظ أنه إذا حاولت تعيين رمز الاستجابة بعد ذلك، ستظهر تحذير `[GIN-debug] [WARNING] Headers were already written. Wanted to override status code 400 with 422`. إذا كنت ترغب في مزيد من التحكم في السلوك، فكر في استخدام طريقة `ShouldBind` المكافئة.
- **النوع** - ربط مشروط
  - **الطرق** - `ShouldBind`، `ShouldBindJSON`، `ShouldBindXML`، `ShouldBindQuery`، `ShouldBindYAML`
  - **السلوك** - تستخدم هذه الطرق `ShouldBindWith` من الداخل. إذا كان هناك خطأ في الربط، يتم إرجاع الخطأ ويكون من مسؤولية المطور معالجة الطلب والخطأ بشكل مناسب.

عند استخدام طريقة Bind، يحاول Gin استنتاج الرابط بناءً على ترويسة Content-Type. إذا كنت متأكداً مما تربطه، يمكنك استخدام `MustBindWith` أو `ShouldBindWith`.

يمكنك أيضاً تحديد أن حقولاً معينة مطلوبة. إذا تم تزيين حقل بـ `binding:"required"` وكانت قيمته فارغة عند الربط، سيتم إرجاع خطأ.

إذا كان أحد حقول الهيكل هو نفسه هيكل (هيكل متداخل)، فإن حقول ذلك الهيكل ستحتاج أيضاً إلى تزيينها بـ `binding:"required"` للتحقق بشكل صحيح.

```go
// Binding from JSON
type Login struct {
  User     string `form:"user" json:"user" xml:"user"  binding:"required"`
  Password string `form:"password" json:"password" xml:"password" binding:"required"`
}

func main() {
  router := gin.Default()

  // Example for binding JSON ({"user": "manu", "password": "123"})
  router.POST("/loginJSON", func(c *gin.Context) {
    var json Login
    if err := c.ShouldBindJSON(&json); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    if json.User != "manu" || json.Password != "123" {
      c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
      return
    }

    c.JSON(http.StatusOK, gin.H{"status": "you are logged in"})
  })

  // Example for binding XML (
  //  <?xml version="1.0" encoding="UTF-8"?>
  //  <root>
  //    <user>manu</user>
  //    <password>123</password>
  //  </root>)
  router.POST("/loginXML", func(c *gin.Context) {
    var xml Login
    if err := c.ShouldBindXML(&xml); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    if xml.User != "manu" || xml.Password != "123" {
      c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
      return
    }

    c.JSON(http.StatusOK, gin.H{"status": "you are logged in"})
  })

  // Example for binding a HTML form (user=manu&password=123)
  router.POST("/loginForm", func(c *gin.Context) {
    var form Login
    // This will infer what binder to use depending on the content-type header.
    if err := c.ShouldBind(&form); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }

    if form.User != "manu" || form.Password != "123" {
      c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
      return
    }

    c.JSON(http.StatusOK, gin.H{"status": "you are logged in"})
  })

  // Listen and serve on 0.0.0.0:8080
  router.Run(":8080")
}
```

### نموذج طلب

```sh
$ curl -v -X POST \
  http://localhost:8080/loginJSON \
  -H 'content-type: application/json' \
  -d '{ "user": "manu" }'
> POST /loginJSON HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.51.0
> Accept: */*
> content-type: application/json
> Content-Length: 18
>
* upload completely sent off: 18 out of 18 bytes
< HTTP/1.1 400 Bad Request
< Content-Type: application/json; charset=utf-8
< Date: Fri, 04 Aug 2017 03:51:31 GMT
< Content-Length: 100
<
{"error":"Key: 'Login.Password' Error:Field validation for 'Password' failed on the 'required' tag"}
```

### تخطي التحقق

عند تشغيل المثال أعلاه باستخدام أمر `curl` أعلاه، يُرجع خطأ. لأن المثال يستخدم `binding:"required"` لحقل `Password`. إذا استخدمت `binding:"-"` لحقل `Password`، فلن يُرجع خطأ عند تشغيل المثال أعلاه مرة أخرى.

## انظر أيضاً

- [المحققون المخصصون](/ar/docs/binding/custom-validators/)
- [ربط سلسلة الاستعلام أو بيانات الإرسال](/ar/docs/binding/bind-query-or-post/)
