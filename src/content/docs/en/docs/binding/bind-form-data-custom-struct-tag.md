---
title: "Bind form-data with custom struct tag"
sidebar:
  order: 14
---

By default, Gin uses the `form` struct tag to bind form data. When you need to bind a struct that uses a different tag — for example, an external type you cannot modify — you can create a custom binding that reads from your own tag.

This is useful when integrating with third-party libraries whose structs use tags like `url`, `query`, or other custom names instead of `form`.

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

## Test it

```sh
# The custom binding reads from the "url" struct tag instead of "form"
curl "http://localhost:8080/list?field_a=hello"
# Output: {"field_a":"hello"}

# Missing parameter -- empty string
curl "http://localhost:8080/list"
# Output: {"field_a":""}
```

:::note
The custom binding implements the `binding.Binding` interface, which requires a `Name() string` method and a `Bind(*http.Request, any) error` method. The `binding.MapFormWithTag` helper does the actual work of mapping form values to struct fields using your custom tag.
:::

## See also

- [Binding and validation](/en/docs/binding/binding-and-validation/)
- [Bind form-data request with custom struct](/en/docs/binding/bind-form-data-request-with-custom-struct/)
