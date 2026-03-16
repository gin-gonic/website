---
title: "فقط اتصال رشته پرس‌وجو"
sidebar:
  order: 3
---

`ShouldBindQuery` فقط پارامترهای رشته پرس‌وجوی URL را به struct متصل می‌کند و بدنه درخواست را کاملاً نادیده می‌گیرد. این زمانی مفید است که می‌خواهید مطمئن شوید داده‌های بدنه POST به‌طور تصادفی پارامترهای پرس‌وجو را بازنویسی نکنند -- مثلاً در endpointهایی که هم فیلترهای query و هم بدنه JSON دریافت می‌کنند.

در مقابل، `ShouldBind` در درخواست GET نیز از اتصال query استفاده می‌کند، اما در درخواست POST ابتدا بدنه را بررسی می‌کند. از `ShouldBindQuery` زمانی استفاده کنید که صریحاً فقط اتصال query را می‌خواهید، صرف‌نظر از متد HTTP.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type Person struct {
  Name    string `form:"name"`
  Address string `form:"address"`
}

func main() {
  route := gin.Default()
  route.Any("/testing", startPage)
  route.Run(":8085")
}

func startPage(c *gin.Context) {
  var person Person
  if err := c.ShouldBindQuery(&person); err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
    return
  }

  c.JSON(http.StatusOK, gin.H{
    "name":    person.Name,
    "address": person.Address,
  })
}
```

## تست

```sh
# GET with query parameters
curl "http://localhost:8085/testing?name=appleboy&address=xyz"
# Output: {"address":"xyz","name":"appleboy"}

# POST with query parameters -- body is ignored, only query is bound
curl -X POST "http://localhost:8085/testing?name=appleboy&address=xyz" \
  -d "name=ignored&address=ignored"
# Output: {"address":"xyz","name":"appleboy"}
```

## همچنین ببینید

- [اتصال رشته پرس‌وجو یا داده ارسالی](/fa/docs/binding/bind-query-or-post/)
- [اتصال و اعتبارسنجی](/fa/docs/binding/binding-and-validation/)
