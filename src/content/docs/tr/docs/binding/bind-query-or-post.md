---
title: "Sorgu dizesi veya post verisi bağlama"
sidebar:
  order: 4
---

`ShouldBind`, HTTP metoduna ve `Content-Type` başlığına göre bağlama motorunu otomatik olarak seçer:

- **GET** istekleri için sorgu dizesi bağlaması (`form` etiketleri) kullanır.
- **POST/PUT** istekleri için `Content-Type`'ı kontrol eder — `application/json` için JSON bağlaması, `application/xml` için XML ve `application/x-www-form-urlencoded` veya `multipart/form-data` için form bağlaması kullanır.

Bu, tek bir handler'ın manuel kaynak seçimi olmadan hem sorgu dizelerinden hem de istek gövdelerinden veri kabul edebileceği anlamına gelir.

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

## Test et

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
`time_format` etiketi Go'nun [referans zaman düzenini](https://pkg.go.dev/time#pkg-constants) kullanır. `2006-01-02` formatı "yıl-ay-gün" anlamına gelir. `time_utc:"1"` etiketi, ayrıştırılan zamanın UTC olmasını sağlar.
:::

## Ayrıca bakınız

- [Bağlama ve doğrulama](/tr/docs/binding/binding-and-validation/)
- [Yalnızca sorgu dizesi bağlama](/tr/docs/binding/only-bind-query-string/)
- [Başlık bağlama](/tr/docs/binding/bind-header/)
