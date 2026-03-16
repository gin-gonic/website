---
title: "ربط سلسلة الاستعلام أو بيانات الإرسال"
sidebar:
  order: 4
---

`ShouldBind` يختار محرك الربط تلقائياً بناءً على طريقة HTTP وترويسة `Content-Type`:

- لطلبات **GET**، يستخدم ربط سلسلة الاستعلام (علامات `form`).
- لطلبات **POST/PUT**، يتحقق من `Content-Type` — يستخدم ربط JSON لـ `application/json`، وXML لـ `application/xml`، وربط النموذج لـ `application/x-www-form-urlencoded` أو `multipart/form-data`.

هذا يعني أن معالجاً واحداً يمكنه قبول البيانات من كل من سلاسل الاستعلام وأجسام الطلبات دون اختيار المصدر يدوياً.

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

## اختبره

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
علامة `time_format` تستخدم [تخطيط الوقت المرجعي](https://pkg.go.dev/time#pkg-constants) في Go. التنسيق `2006-01-02` يعني "سنة-شهر-يوم". علامة `time_utc:"1"` تضمن أن الوقت المحلل بتوقيت UTC.
:::

## انظر أيضاً

- [الربط والتحقق](/ar/docs/binding/binding-and-validation/)
- [ربط سلسلة الاستعلام فقط](/ar/docs/binding/only-bind-query-string/)
- [ربط الترويسة](/ar/docs/binding/bind-header/)
