---
title: "Vincular form-data com tag de struct customizada"
sidebar:
  order: 14
---

Por padrão, o Gin usa a tag de struct `form` para vincular dados de formulário. Quando você precisa vincular uma struct que usa uma tag diferente — por exemplo, um tipo externo que você não pode modificar — você pode criar um binding customizado que lê a partir da sua própria tag.

Isso é útil ao integrar com bibliotecas de terceiros cujas structs usam tags como `url`, `query` ou outros nomes customizados em vez de `form`.

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

## Teste

```sh
# The custom binding reads from the "url" struct tag instead of "form"
curl "http://localhost:8080/list?field_a=hello"
# Output: {"field_a":"hello"}

# Missing parameter -- empty string
curl "http://localhost:8080/list"
# Output: {"field_a":""}
```

:::note
O binding customizado implementa a interface `binding.Binding`, que requer um método `Name() string` e um método `Bind(*http.Request, any) error`. O auxiliar `binding.MapFormWithTag` faz o trabalho real de mapear os valores do formulário para os campos da struct usando a sua tag customizada.
:::

## Veja também

- [Binding e validação](/pt/docs/binding/binding-and-validation/)
- [Vincular requisição form-data com struct customizada](/pt/docs/binding/bind-form-data-request-with-custom-struct/)
