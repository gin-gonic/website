---
title: "ربط Uri"
sidebar:
  order: 7
---

`ShouldBindUri` يربط معاملات مسار URI مباشرة في هيكل باستخدام علامات الهيكل `uri`. بالجمع مع علامات التحقق `binding`، يتيح لك هذا التحقق من معاملات المسار (مثل طلب UUID صالح) باستدعاء واحد.

هذا مفيد عندما يحتوي مسارك على بيانات منظمة — مثل معرّفات الموارد أو العناوين المختصرة — تريد التحقق منها وفحص نوعها قبل استخدامها.

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

## اختبره

```sh
# Valid UUID -- binding succeeds
curl http://localhost:8088/thinkerou/987fbc97-4bed-5078-9f07-9141ba07c9f3
# Output: {"name":"thinkerou","uuid":"987fbc97-4bed-5078-9f07-9141ba07c9f3"}

# Invalid UUID -- binding fails with validation error
curl http://localhost:8088/thinkerou/not-uuid
# Output: {"error":"Key: 'Person.ID' Error:Field validation for 'ID' failed on the 'uuid' tag"}
```

:::note
اسم علامة الهيكل `uri` يجب أن يتطابق مع اسم المعامل في تعريف المسار. على سبيل المثال، `:id` في المسار يقابل `uri:"id"` في الهيكل.
:::

## انظر أيضاً

- [المعاملات في المسار](/ar/docs/routing/param-in-path/)
- [الربط والتحقق](/ar/docs/binding/binding-and-validation/)
