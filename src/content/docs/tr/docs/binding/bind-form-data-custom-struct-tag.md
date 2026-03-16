---
title: "Özel struct etiketi ile form verisi bağlama"
sidebar:
  order: 14
---

Varsayılan olarak, Gin form verisi bağlamak için `form` struct etiketini kullanır. Farklı bir etiket kullanan bir struct'ı bağlamanız gerektiğinde — örneğin, değiştiremediğiniz harici bir tür — kendi etiketinizden okuyan özel bir bağlama oluşturabilirsiniz.

Bu, struct'ları `form` yerine `url`, `query` veya diğer özel adları etiket olarak kullanan üçüncü parti kütüphanelerle entegre olurken kullanışlıdır.

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

## Test et

```sh
# The custom binding reads from the "url" struct tag instead of "form"
curl "http://localhost:8080/list?field_a=hello"
# Output: {"field_a":"hello"}

# Missing parameter -- empty string
curl "http://localhost:8080/list"
# Output: {"field_a":""}
```

:::note
Özel bağlama, `binding.Binding` arayüzünü uygular; bu arayüz bir `Name() string` metodu ve bir `Bind(*http.Request, any) error` metodu gerektirir. `binding.MapFormWithTag` yardımcısı, özel etiketinizi kullanarak form değerlerini struct alanlarına eşlemenin asıl işini yapar.
:::

## Ayrıca bakınız

- [Bağlama ve doğrulama](/tr/docs/binding/binding-and-validation/)
- [Özel struct ile form verisi bağlama](/tr/docs/binding/bind-form-data-request-with-custom-struct/)
