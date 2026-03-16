---
title: "커스텀 유효성 검사기"
sidebar:
  order: 2
---

Gin은 필드 수준 유효성 검사를 위해 [go-playground/validator](https://github.com/go-playground/validator)를 사용합니다. `required`, `email`, `min`, `max`와 같은 내장 유효성 검사기 외에도 자체 커스텀 유효성 검사 함수를 등록할 수 있습니다.

아래 예제는 과거 날짜를 거부하는 `bookabledate` 유효성 검사기를 등록하여 예약 체크인 및 체크아웃 날짜가 항상 미래인지 확인합니다.

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

## 테스트

```sh
# Both dates are in the future and check_out > check_in
curl "http://localhost:8085/bookable?check_in=2118-04-16&check_out=2118-04-17"
# Output: {"message":"Booking dates are valid!"}

# check_out is before check_in -- fails gtfield validation
curl "http://localhost:8085/bookable?check_in=2118-03-10&check_out=2118-03-09"
# Output: {"error":"Key: 'Booking.CheckOut' Error:Field validation for 'CheckOut' failed on the 'gtfield' tag"}
```

:::tip
단일 필드 검사를 넘어서는 교차 필드 규칙을 위해 [구조체 수준 유효성 검사](https://github.com/go-playground/validator/releases/tag/v8.7)도 등록할 수 있습니다. 자세한 내용은 [struct-lvl-validation 예제](https://github.com/gin-gonic/examples/tree/master/struct-lvl-validations)를 참고하세요.
:::

## 참고

- [바인딩과 유효성 검사](/ko-kr/docs/binding/binding-and-validation/)
- [기본값 바인딩](/ko-kr/docs/binding/bind-default-values/)
