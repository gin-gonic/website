---
title: "اتصال فرم‌دیتا با تگ struct سفارشی"
sidebar:
  order: 14
---

به‌طور پیش‌فرض، Gin از تگ `form` در struct برای اتصال داده‌های فرم استفاده می‌کند. وقتی نیاز به اتصال یک struct دارید که از تگ متفاوتی استفاده می‌کند -- مثلاً یک نوع خارجی که امکان تغییر آن را ندارید -- می‌توانید یک اتصال سفارشی ایجاد کنید که از تگ شخصی شما بخواند.

این زمانی مفید است که با کتابخانه‌های شخص ثالث یکپارچه شده‌اید که structهایشان از تگ‌هایی مانند `url`، `query` یا نام‌های سفارشی دیگر به جای `form` استفاده می‌کنند.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/binding"
)

const (
  customerTag   = "url"
  defaultMemory = 32 << 20
)

type customerBinding struct{}

func (customerBinding) Name() string {
  return "form"
}

func (customerBinding) Bind(req *http.Request, obj any) error {
  if err := req.ParseForm(); err != nil {
    return err
  }
  if err := req.ParseMultipartForm(defaultMemory); err != nil {
    if err != http.ErrNotMultipart {
      return err
    }
  }
  if err := binding.MapFormWithTag(obj, req.Form, customerTag); err != nil {
    return err
  }
  return validate(obj)
}

func validate(obj any) error {
  if binding.Validator == nil {
    return nil
  }
  return binding.Validator.ValidateStruct(obj)
}

// FormA is an external type that we can't modify its tag
type FormA struct {
  FieldA string `url:"field_a"`
}

func main() {
  router := gin.Default()

  router.GET("/list", func(c *gin.Context) {
    var urlBinding = customerBinding{}
    var opt FormA
    if err := c.MustBindWith(&opt, urlBinding); err != nil {
      return
    }
    c.JSON(http.StatusOK, gin.H{"field_a": opt.FieldA})
  })

  router.Run(":8080")
}
```

## تست

```sh
# The custom binding reads from the "url" struct tag instead of "form"
curl "http://localhost:8080/list?field_a=hello"
# Output: {"field_a":"hello"}

# Missing parameter -- empty string
curl "http://localhost:8080/list"
# Output: {"field_a":""}
```

:::note
اتصال سفارشی اینترفیس `binding.Binding` را پیاده‌سازی می‌کند که به متد `Name() string` و متد `Bind(*http.Request, any) error` نیاز دارد. تابع کمکی `binding.MapFormWithTag` کار واقعی نگاشت مقادیر فرم به فیلدهای struct را با استفاده از تگ سفارشی شما انجام می‌دهد.
:::

## همچنین ببینید

- [اتصال و اعتبارسنجی](/fa/docs/binding/binding-and-validation/)
- [اتصال درخواست فرم‌دیتا با struct سفارشی](/fa/docs/binding/bind-form-data-request-with-custom-struct/)
