---
title: "커스텀 유효성 검사기"
sidebar:
  order: 2
---

커스텀 유효성 검사기를 등록하는 것도 가능합니다. [예제 코드](https://github.com/gin-gonic/examples/tree/master/struct-lvl-validations)를 참조하세요.

```go
package main

import (
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
  "github.com/gin-gonic/gin/binding"
  "github.com/go-playground/validator/v10"
)

// Booking은 바인딩되고 유효성 검사된 데이터를 포함합니다.
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

```sh
$ curl "localhost:8085/bookable?check_in=2118-04-16&check_out=2118-04-17"
{"message":"Booking dates are valid!"}

$ curl "localhost:8085/bookable?check_in=2118-03-10&check_out=2118-03-09"
{"error":"Key: 'Booking.CheckOut' Error:Field validation for 'CheckOut' failed on the 'gtfield' tag"}
```

[구조체 수준 유효성 검사](https://github.com/go-playground/validator/releases/tag/v8.7)도 이 방식으로 등록할 수 있습니다.
자세한 내용은 [struct-lvl-validation 예제](https://github.com/gin-gonic/examples/tree/master/struct-lvl-validations)를 참조하세요.
