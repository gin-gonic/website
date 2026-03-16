---
title: "Привязка данных формы с пользовательским тегом структуры"
sidebar:
  order: 14
---

По умолчанию Gin использует тег структуры `form` для привязки данных формы. Когда вам нужно привязать структуру, использующую другой тег — например, внешний тип, который вы не можете изменить — вы можете создать пользовательскую привязку, которая читает из вашего собственного тега.

Это полезно при интеграции со сторонними библиотеками, структуры которых используют теги вроде `url`, `query` или другие пользовательские имена вместо `form`.

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

## Тестирование

```sh
# The custom binding reads from the "url" struct tag instead of "form"
curl "http://localhost:8080/list?field_a=hello"
# Output: {"field_a":"hello"}

# Missing parameter -- empty string
curl "http://localhost:8080/list"
# Output: {"field_a":""}
```

:::note
Пользовательская привязка реализует интерфейс `binding.Binding`, который требует метод `Name() string` и метод `Bind(*http.Request, any) error`. Вспомогательная функция `binding.MapFormWithTag` выполняет фактическую работу по сопоставлению значений формы с полями структуры, используя ваш пользовательский тег.
:::

## Смотрите также

- [Привязка и валидация](/ru/docs/binding/binding-and-validation/)
- [Привязка данных формы с пользовательской структурой](/ru/docs/binding/bind-form-data-request-with-custom-struct/)
