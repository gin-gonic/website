---
title: "Validadores customizados"
sidebar:
  order: 2
---

O Gin usa [go-playground/validator](https://github.com/go-playground/validator) para validação em nível de campo. Além dos validadores integrados (como `required`, `email`, `min`, `max`), você pode registrar suas próprias funções de validação customizadas.

O exemplo abaixo registra um validador `bookabledate` que rejeita datas no passado, garantindo que as datas de check-in e check-out de reservas estejam sempre no futuro.

```go
package main

import (
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/binding"
  "github.com/go-playground/validator/v10"
)

// Booking contains binded and validated data.
type Booking struct {
  CheckIn  time.Time `form:"check_in" binding:"required,bookabledate" time_format:"2006-01-02"`
  CheckOut time.Time `form:"check_out" binding:"required,gtfield=CheckIn,bookabledate" time_format:"2006-01-02"`
}

var bookableDate validator.Func = func(fl validator.FieldLevel) bool {
  date, ok := fl.Field().Interface().(time.Time)
  if ok {
    today := time.Now()
    if today.After(date) {
      return false
    }
  }
  return true
}

func main() {
  route := gin.Default()

  if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
    v.RegisterValidation("bookabledate", bookableDate)
  }

  route.GET("/bookable", getBookable)
  route.Run(":8085")
}

func getBookable(c *gin.Context) {
  var b Booking
  if err := c.ShouldBindWith(&b, binding.Query); err == nil {
    c.JSON(http.StatusOK, gin.H{"message": "Booking dates are valid!"})
  } else {
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
  }
}
```

## Teste

```sh
# Both dates are in the future and check_out > check_in
curl "http://localhost:8085/bookable?check_in=2118-04-16&check_out=2118-04-17"
# Output: {"message":"Booking dates are valid!"}

# check_out is before check_in -- fails gtfield validation
curl "http://localhost:8085/bookable?check_in=2118-03-10&check_out=2118-03-09"
# Output: {"error":"Key: 'Booking.CheckOut' Error:Field validation for 'CheckOut' failed on the 'gtfield' tag"}
```

:::tip
Você também pode registrar [validações em nível de struct](https://github.com/go-playground/validator/releases/tag/v8.7) para regras entre campos que vão além de verificações de campo único. Veja o [exemplo de struct-lvl-validation](https://github.com/gin-gonic/examples/tree/master/struct-lvl-validations) para saber mais.
:::

## Veja também

- [Binding e validação](/pt/docs/binding/binding-and-validation/)
- [Vincular valores padrão](/pt/docs/binding/bind-default-values/)
