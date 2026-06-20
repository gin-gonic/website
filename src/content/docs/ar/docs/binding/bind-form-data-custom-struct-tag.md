---
title: "ربط بيانات النموذج بعلامة هيكل مخصصة"
sidebar:
  order: 14
---

بشكل افتراضي، يستخدم Gin علامة الهيكل `form` لربط بيانات النموذج. عندما تحتاج لربط هيكل يستخدم علامة مختلفة — على سبيل المثال، نوع خارجي لا يمكنك تعديله — يمكنك إنشاء ربط مخصص يقرأ من علامتك الخاصة.

هذا مفيد عند التكامل مع مكتبات الطرف الثالث التي تستخدم هياكلها علامات مثل `url` أو `query` أو أسماء مخصصة أخرى بدلاً من `form`.

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

## اختبره

```sh
# The custom binding reads from the "url" struct tag instead of "form"
curl "http://localhost:8080/list?field_a=hello"
# Output: {"field_a":"hello"}

# Missing parameter -- empty string
curl "http://localhost:8080/list"
# Output: {"field_a":""}
```

:::note
الربط المخصص ينفّذ واجهة `binding.Binding`، التي تتطلب دالة `Name() string` ودالة `Bind(*http.Request, any) error`. المساعد `binding.MapFormWithTag` يقوم بالعمل الفعلي لربط قيم النموذج بحقول الهيكل باستخدام علامتك المخصصة.
:::

## انظر أيضاً

- [الربط والتحقق](/ar/docs/binding/binding-and-validation/)
- [ربط طلب بيانات النموذج بهيكل مخصص](/ar/docs/binding/bind-form-data-request-with-custom-struct/)
