---
title: "ربط سلسلة الاستعلام فقط"
sidebar:
  order: 3
---

`ShouldBindQuery` يربط فقط معاملات سلسلة استعلام URL بالهيكل، متجاهلاً جسم الطلب بالكامل. هذا مفيد عندما تريد التأكد من أن بيانات جسم POST لا تكتب فوق معاملات الاستعلام عن طريق الخطأ — على سبيل المثال، في نقاط النهاية التي تقبل كلاً من مرشحات الاستعلام وجسم JSON.

في المقابل، `ShouldBind` في طلب GET يستخدم أيضاً ربط الاستعلام، لكن في طلب POST سيتحقق أولاً من الجسم. استخدم `ShouldBindQuery` عندما تريد صراحةً ربط الاستعلام فقط بغض النظر عن طريقة HTTP.

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

## اختبره

```sh
# GET with query parameters
curl "http://localhost:8085/testing?name=appleboy&address=xyz"
# Output: {"address":"xyz","name":"appleboy"}

# POST with query parameters -- body is ignored, only query is bound
curl -X POST "http://localhost:8085/testing?name=appleboy&address=xyz" \
  -d "name=ignored&address=ignored"
# Output: {"address":"xyz","name":"appleboy"}
```

## انظر أيضاً

- [ربط سلسلة الاستعلام أو بيانات الإرسال](/ar/docs/binding/bind-query-or-post/)
- [الربط والتحقق](/ar/docs/binding/binding-and-validation/)
