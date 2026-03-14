---
title: "اتصال و اعتبارسنجی مدل"
sidebar:
  order: 1
---

برای اتصال بدنه درخواست به یک نوع، از اتصال مدل استفاده کنید. ما در حال حاضر از اتصال JSON، XML، YAML و مقادیر فرم استاندارد (foo=bar&boo=baz) پشتیبانی می‌کنیم.

Gin از [**go-playground/validator/v10**](https://github.com/go-playground/validator) برای اعتبارسنجی استفاده می‌کند. مستندات کامل استفاده از تگ‌ها را [اینجا](https://pkg.go.dev/github.com/go-playground/validator/v10#hdr-Baked_In_Validators_and_Tags) بررسی کنید.

توجه داشته باشید که باید تگ اتصال مربوطه را روی تمام فیلدهایی که می‌خواهید متصل کنید تنظیم کنید. به عنوان مثال، هنگام اتصال از JSON، `json:"fieldname"` را تنظیم کنید.

همچنین، Gin دو مجموعه متد برای اتصال ارائه می‌دهد:
- **نوع** - اتصال اجباری
  - **متدها** - `Bind`، `BindJSON`، `BindXML`، `BindQuery`، `BindYAML`
  - **رفتار** - این متدها در پشت صحنه از `MustBindWith` استفاده می‌کنند. اگر خطای اتصال وجود داشته باشد، درخواست با `c.AbortWithError(400, err).SetType(ErrorTypeBind)` لغو می‌شود. این کد وضعیت پاسخ را به 400 و هدر `Content-Type` را به `text/plain; charset=utf-8` تنظیم می‌کند. توجه داشته باشید اگر پس از این سعی کنید کد پاسخ را تنظیم کنید، هشداری دریافت خواهید کرد `[GIN-debug] [WARNING] Headers were already written. Wanted to override status code 400 with 422`. اگر می‌خواهید کنترل بیشتری بر رفتار داشته باشید، استفاده از متد معادل `ShouldBind` را در نظر بگیرید.
- **نوع** - اتصال پیشنهادی
  - **متدها** - `ShouldBind`، `ShouldBindJSON`، `ShouldBindXML`، `ShouldBindQuery`، `ShouldBindYAML`
  - **رفتار** - این متدها در پشت صحنه از `ShouldBindWith` استفاده می‌کنند. اگر خطای اتصال وجود داشته باشد، خطا برگردانده می‌شود و مسئولیت مدیریت مناسب درخواست و خطا بر عهده توسعه‌دهنده است.

هنگام استفاده از متد Bind، Gin سعی می‌کند بر اساس هدر Content-Type، binder را استنتاج کند. اگر مطمئن هستید چه چیزی را متصل می‌کنید، می‌توانید از `MustBindWith` یا `ShouldBindWith` استفاده کنید.

همچنین می‌توانید مشخص کنید که فیلدهای خاصی الزامی هستند. اگر فیلدی با `binding:"required"` تزئین شده باشد و هنگام اتصال مقدار خالی داشته باشد، خطا برگردانده خواهد شد.

اگر یکی از فیلدهای struct خودش یک struct باشد (struct تو در تو)، فیلدهای آن struct نیز باید با `binding:"required"` تزئین شوند تا به درستی اعتبارسنجی شوند.

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

### نمونه درخواست

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

### رد شدن از اعتبارسنجی

هنگام اجرای مثال بالا با استفاده از دستور `curl` بالا، خطا برمی‌گرداند. زیرا مثال از `binding:"required"` برای `Password` استفاده می‌کند. اگر از `binding:"-"` برای `Password` استفاده کنید، هنگام اجرای مجدد مثال بالا خطا برنمی‌گرداند.

## همچنین ببینید

- [اعتبارسنج‌های سفارشی](/en/docs/binding/custom-validators/)
- [اتصال رشته پرس‌وجو یا داده ارسالی](/en/docs/binding/bind-query-or-post/)
