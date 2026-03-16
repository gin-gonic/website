---
title: "المحققون المخصصون"
sidebar:
  order: 2
---

يستخدم Gin مكتبة [go-playground/validator](https://github.com/go-playground/validator) للتحقق على مستوى الحقول. بالإضافة إلى المحققين المدمجين (مثل `required`، `email`، `min`، `max`)، يمكنك تسجيل دوال التحقق المخصصة الخاصة بك.

المثال أدناه يسجّل محققاً `bookabledate` يرفض التواريخ في الماضي، مما يضمن أن تواريخ تسجيل الوصول والمغادرة تكون دائماً في المستقبل.

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

## اختبره

```sh
# Both dates are in the future and check_out > check_in
curl "http://localhost:8085/bookable?check_in=2118-04-16&check_out=2118-04-17"
# Output: {"message":"Booking dates are valid!"}

# check_out is before check_in -- fails gtfield validation
curl "http://localhost:8085/bookable?check_in=2118-03-10&check_out=2118-03-09"
# Output: {"error":"Key: 'Booking.CheckOut' Error:Field validation for 'CheckOut' failed on the 'gtfield' tag"}
```

:::tip
يمكنك أيضاً تسجيل [تحققات على مستوى الهيكل](https://github.com/go-playground/validator/releases/tag/v8.7) لقواعد عبر الحقول تتجاوز فحوصات الحقل الواحد. راجع [مثال struct-lvl-validation](https://github.com/gin-gonic/examples/tree/master/struct-lvl-validations) لمعرفة المزيد.
:::

## انظر أيضاً

- [الربط والتحقق](/ar/docs/binding/binding-and-validation/)
- [ربط القيم الافتراضية](/ar/docs/binding/bind-default-values/)
