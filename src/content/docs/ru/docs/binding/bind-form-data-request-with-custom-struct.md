---
title: "Привязка данных формы с пользовательской структурой"
sidebar:
  order: 12
---

Gin может автоматически привязывать данные формы к вложенным структурам. Когда ваша модель данных состоит из более мелких структур — будь то встроенные поля, поля-указатели или анонимные встроенные структуры — Gin проходит по иерархии структуры и сопоставляет каждый тег `form` с соответствующим параметром запроса или полем формы.

Это полезно для организации сложных форм в повторно используемые подструктуры, вместо определения одной плоской структуры с множеством полей.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type StructA struct {
  FieldA string `form:"field_a"`
}

type StructB struct {
  NestedStruct StructA
  FieldB       string `form:"field_b"`
}

type StructC struct {
  NestedStructPointer *StructA
  FieldC              string `form:"field_c"`
}

type StructD struct {
  NestedAnonyStruct struct {
    FieldX string `form:"field_x"`
  }
  FieldD string `form:"field_d"`
}

func main() {
  router := gin.Default()

  router.GET("/getb", func(c *gin.Context) {
    var b StructB
    c.Bind(&b)
    c.JSON(http.StatusOK, gin.H{
      "a": b.NestedStruct,
      "b": b.FieldB,
    })
  })

  router.GET("/getc", func(c *gin.Context) {
    var b StructC
    c.Bind(&b)
    c.JSON(http.StatusOK, gin.H{
      "a": b.NestedStructPointer,
      "c": b.FieldC,
    })
  })

  router.GET("/getd", func(c *gin.Context) {
    var b StructD
    c.Bind(&b)
    c.JSON(http.StatusOK, gin.H{
      "x": b.NestedAnonyStruct,
      "d": b.FieldD,
    })
  })

  router.Run(":8080")
}
```

## Тестирование

```sh
# Nested struct -- fields from StructA are bound alongside StructB's own fields
curl "http://localhost:8080/getb?field_a=hello&field_b=world"
# Output: {"a":{"FieldA":"hello"},"b":"world"}

# Nested struct pointer -- works the same way, Gin allocates the pointer automatically
curl "http://localhost:8080/getc?field_a=hello&field_c=world"
# Output: {"a":{"FieldA":"hello"},"c":"world"}

# Anonymous inline struct -- fields are bound by their form tags as usual
curl "http://localhost:8080/getd?field_x=hello&field_d=world"
# Output: {"d":"world","x":{"FieldX":"hello"}}
```

:::note
Все три паттерна — вложенная структура, указатель на вложенную структуру и анонимная встроенная структура — привязываются с использованием одних и тех же плоских параметров запроса. Gin не требует никаких префиксов или соглашений о вложенности в именах параметров.
:::

## Смотрите также

- [Привязка и валидация](/ru/docs/binding/binding-and-validation/)
- [Привязка данных формы с пользовательским тегом структуры](/ru/docs/binding/bind-form-data-custom-struct-tag/)
