---
title: "自訂驗證器"
sidebar:
  order: 2
---

Gin 使用 [go-playground/validator](https://github.com/go-playground/validator) 進行欄位級別驗證。除了內建驗證器（如 `required`、`email`、`min`、`max`）之外，你還可以註冊自己的自訂驗證函式。

以下範例註冊了一個 `bookabledate` 驗證器，它會拒絕過去的日期，確保預訂的入住和退房日期始終在未來。

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

## 測試

```sh
# Both dates are in the future and check_out > check_in
curl "http://localhost:8085/bookable?check_in=2118-04-16&check_out=2118-04-17"
# Output: {"message":"Booking dates are valid!"}

# check_out is before check_in -- fails gtfield validation
curl "http://localhost:8085/bookable?check_in=2118-03-10&check_out=2118-03-09"
# Output: {"error":"Key: 'Booking.CheckOut' Error:Field validation for 'CheckOut' failed on the 'gtfield' tag"}
```

:::tip
你也可以註冊[結構體級別驗證](https://github.com/go-playground/validator/releases/tag/v8.7)來處理超越單一欄位檢查的跨欄位規則。請參閱 [struct-lvl-validation 範例](https://github.com/gin-gonic/examples/tree/master/struct-lvl-validations)以了解更多。
:::

## 另請參閱

- [綁定與驗證](/zh-tw/docs/binding/binding-and-validation/)
- [綁定預設值](/zh-tw/docs/binding/bind-default-values/)
