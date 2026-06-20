---
title: "Bind form-data dengan tag struct kustom"
sidebar:
  order: 14
---

Secara default, Gin menggunakan tag struct `form` untuk melakukan bind data form. Ketika Anda perlu melakukan bind struct yang menggunakan tag berbeda — misalnya, tipe eksternal yang tidak dapat Anda modifikasi — Anda dapat membuat binding kustom yang membaca dari tag Anda sendiri.

Ini berguna saat berintegrasi dengan pustaka pihak ketiga yang struct-nya menggunakan tag seperti `url`, `query`, atau nama kustom lainnya sebagai pengganti `form`.

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

## Uji coba

```sh
# The custom binding reads from the "url" struct tag instead of "form"
curl "http://localhost:8080/list?field_a=hello"
# Output: {"field_a":"hello"}

# Missing parameter -- empty string
curl "http://localhost:8080/list"
# Output: {"field_a":""}
```

:::note
Binding kustom mengimplementasikan interface `binding.Binding`, yang memerlukan metode `Name() string` dan metode `Bind(*http.Request, any) error`. Helper `binding.MapFormWithTag` melakukan pekerjaan sebenarnya untuk memetakan nilai form ke field struct menggunakan tag kustom Anda.
:::

## Lihat juga

- [Binding dan validasi](/id/docs/binding/binding-and-validation/)
- [Bind permintaan form-data dengan struct kustom](/id/docs/binding/bind-form-data-request-with-custom-struct/)
