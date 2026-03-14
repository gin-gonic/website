---
title: "Enlazar datos de formulario con etiqueta de struct personalizada"
sidebar:
  order: 14
---

Puedes enlazar solicitudes de datos de formulario usando etiquetas de struct personalizadas implementando un enlace personalizado.

```go
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

func ListHandler(s *Service) func(ctx *gin.Context) {
  return func(ctx *gin.Context) {
    var urlBinding = customerBinding{}
    var opt FormA
    err := ctx.MustBindWith(&opt, urlBinding)
    if err != nil {
      // handle error
    }
    // use opt.FieldA
  }
}
```
