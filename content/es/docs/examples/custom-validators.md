---
title: "Personalizar Validaciones"
draft: false
---

Es posible registrar validaciones personalizadas como puede verse en el [código de ejemplo](https://github.com/gin-gonic/examples/tree/master/struct-lvl-validations).

```go
package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	// import error https://github.com/go-playground/validator/issues/565
	"github.com/go-playground/validator/v10"
)

// el tipo Booking contiene datos vinculados y con validación.
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

Las [validaciones a nivel de struct](https://github.com/go-playground/validator/releases/tag/v8.7) pueden registrarse de esta manera también.
Véase el ejemplo de [validación a nivel de struct](https://github.com/gin-gonic/examples/tree/master/struct-lvl-validations) para mayor referencia.
