---
title: "カスタムバリデータ"
sidebar:
  order: 2
---

Ginはフィールドレベルのバリデーションに [go-playground/validator](https://github.com/go-playground/validator) を使用します。組み込みのバリデータ（`required`、`email`、`min`、`max` など）に加えて、独自のカスタムバリデーション関数を登録できます。

以下の例では、過去の日付を拒否する `bookabledate` バリデータを登録し、予約のチェックインとチェックアウトの日付が常に未来であることを保証します。

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

## テスト

```sh
# Both dates are in the future and check_out > check_in
curl "http://localhost:8085/bookable?check_in=2118-04-16&check_out=2118-04-17"
# Output: {"message":"Booking dates are valid!"}

# check_out is before check_in -- fails gtfield validation
curl "http://localhost:8085/bookable?check_in=2118-03-10&check_out=2118-03-09"
# Output: {"error":"Key: 'Booking.CheckOut' Error:Field validation for 'CheckOut' failed on the 'gtfield' tag"}
```

:::tip
単一フィールドのチェックを超えたクロスフィールドルールのために、[構造体レベルのバリデーション](https://github.com/go-playground/validator/releases/tag/v8.7)を登録することもできます。詳しくは[struct-lvl-validationの例](https://github.com/gin-gonic/examples/tree/master/struct-lvl-validations)を参照してください。
:::

## 関連項目

- [バインドとバリデーション](/ja/docs/binding/binding-and-validation/)
- [バインドのデフォルト値](/ja/docs/binding/bind-default-values/)
