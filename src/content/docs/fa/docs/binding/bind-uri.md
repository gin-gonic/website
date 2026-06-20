---
title: "اتصال URI"
sidebar:
  order: 7
---

`ShouldBindUri` پارامترهای مسیر URI را مستقیماً با استفاده از تگ‌های `uri` در struct به آن متصل می‌کند. در ترکیب با تگ‌های اعتبارسنجی `binding`، این امکان را فراهم می‌کند تا پارامترهای مسیر (مانند نیاز به UUID معتبر) را با یک فراخوانی اعتبارسنجی کنید.

این زمانی مفید است که مسیر شما حاوی داده‌های ساختاریافته -- مانند شناسه منابع یا slug -- است که می‌خواهید قبل از استفاده اعتبارسنجی و بررسی نوع کنید.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

type Person struct {
  ID   string `uri:"id" binding:"required,uuid"`
  Name string `uri:"name" binding:"required"`
}

func main() {
  route := gin.Default()

  route.GET("/:name/:id", func(c *gin.Context) {
    var person Person
    if err := c.ShouldBindUri(&person); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
      return
    }
    c.JSON(http.StatusOK, gin.H{"name": person.Name, "uuid": person.ID})
  })

  route.Run(":8088")
}
```

## تست

```sh
# Valid UUID -- binding succeeds
curl http://localhost:8088/thinkerou/987fbc97-4bed-5078-9f07-9141ba07c9f3
# Output: {"name":"thinkerou","uuid":"987fbc97-4bed-5078-9f07-9141ba07c9f3"}

# Invalid UUID -- binding fails with validation error
curl http://localhost:8088/thinkerou/not-uuid
# Output: {"error":"Key: 'Person.ID' Error:Field validation for 'ID' failed on the 'uuid' tag"}
```

:::note
نام تگ `uri` در struct باید با نام پارامتر در تعریف مسیر مطابقت داشته باشد. به‌عنوان مثال، `:id` در مسیر با `uri:"id"` در struct مطابقت دارد.
:::

## همچنین ببینید

- [پارامترها در مسیر](/fa/docs/routing/param-in-path/)
- [اتصال و اعتبارسنجی](/fa/docs/binding/binding-and-validation/)
