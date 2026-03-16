---
title: "اتصال رشته پرس‌وجو یا داده ارسالی"
sidebar:
  order: 4
---

`ShouldBind` به‌صورت خودکار موتور اتصال را بر اساس متد HTTP و هدر `Content-Type` انتخاب می‌کند:

- برای درخواست‌های **GET**، از اتصال رشته پرس‌وجو (تگ‌های `form`) استفاده می‌کند.
- برای درخواست‌های **POST/PUT**، هدر `Content-Type` را بررسی می‌کند -- از اتصال JSON برای `application/json`، XML برای `application/xml`، و اتصال فرم برای `application/x-www-form-urlencoded` یا `multipart/form-data` استفاده می‌کند.

این بدین معنی است که یک handler واحد می‌تواند داده را هم از رشته‌های پرس‌وجو و هم از بدنه درخواست بدون انتخاب دستی منبع دریافت کند.

```go
package main

import (
  "log"
  "net/http"
  "time"

  "github.com/gin-gonic/gin"
)

type Person struct {
  Name     string    `form:"name"`
  Address  string    `form:"address"`
  Birthday time.Time `form:"birthday" time_format:"2006-01-02" time_utc:"1"`
}

func main() {
  route := gin.Default()
  route.GET("/testing", startPage)
  route.POST("/testing", startPage)
  route.Run(":8085")
}

func startPage(c *gin.Context) {
  var person Person
  if err := c.ShouldBind(&person); err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }

  log.Printf("Name: %s, Address: %s, Birthday: %s\n", person.Name, person.Address, person.Birthday)
  c.JSON(http.StatusOK, gin.H{
    "name":     person.Name,
    "address":  person.Address,
    "birthday": person.Birthday,
  })
}
```

## تست

```sh
# GET with query string parameters
curl "http://localhost:8085/testing?name=appleboy&address=xyz&birthday=1992-03-15"
# Output: {"address":"xyz","birthday":"1992-03-15T00:00:00Z","name":"appleboy"}

# POST with form data
curl -X POST http://localhost:8085/testing \
  -d "name=appleboy&address=xyz&birthday=1992-03-15"
# Output: {"address":"xyz","birthday":"1992-03-15T00:00:00Z","name":"appleboy"}

# POST with JSON body
curl -X POST http://localhost:8085/testing \
  -H "Content-Type: application/json" \
  -d '{"name":"appleboy","address":"xyz","birthday":"1992-03-15"}'
# Output: {"address":"xyz","birthday":"1992-03-15T00:00:00Z","name":"appleboy"}
```

:::note
تگ `time_format` از [طرح زمان مرجع](https://pkg.go.dev/time#pkg-constants) Go استفاده می‌کند. فرمت `2006-01-02` به معنای "سال-ماه-روز" است. تگ `time_utc:"1"` تضمین می‌کند که زمان تجزیه‌شده در UTC باشد.
:::

## همچنین ببینید

- [اتصال و اعتبارسنجی](/fa/docs/binding/binding-and-validation/)
- [فقط اتصال رشته پرس‌وجو](/fa/docs/binding/only-bind-query-string/)
- [اتصال هدر](/fa/docs/binding/bind-header/)
