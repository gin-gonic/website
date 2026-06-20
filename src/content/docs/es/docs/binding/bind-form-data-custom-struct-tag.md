---
title: "Enlazar datos de formulario con etiqueta de struct personalizada"
sidebar:
  order: 14
---

Por defecto, Gin usa la etiqueta de struct `form` para enlazar datos de formulario. Cuando necesitas enlazar un struct que usa una etiqueta diferente — por ejemplo, un tipo externo que no puedes modificar — puedes crear un enlace personalizado que lea desde tu propia etiqueta.

Esto es útil al integrar con bibliotecas de terceros cuyos structs usan etiquetas como `url`, `query` u otros nombres personalizados en lugar de `form`.

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

## Pruébalo

```sh
# The custom binding reads from the "url" struct tag instead of "form"
curl "http://localhost:8080/list?field_a=hello"
# Output: {"field_a":"hello"}

# Missing parameter -- empty string
curl "http://localhost:8080/list"
# Output: {"field_a":""}
```

:::note
El enlace personalizado implementa la interfaz `binding.Binding`, que requiere un método `Name() string` y un método `Bind(*http.Request, any) error`. El helper `binding.MapFormWithTag` realiza el trabajo real de mapear valores de formulario a campos del struct usando tu etiqueta personalizada.
:::

## Ver también

- [Enlace y validación](/es/docs/binding/binding-and-validation/)
- [Enlazar solicitud de datos de formulario con struct personalizado](/es/docs/binding/bind-form-data-request-with-custom-struct/)
