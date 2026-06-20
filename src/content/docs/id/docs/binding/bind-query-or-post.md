---
title: "Bind query string atau post data"
sidebar:
  order: 4
---

`ShouldBind` secara otomatis memilih engine binding berdasarkan metode HTTP dan header `Content-Type`:

- Untuk request **GET**, menggunakan binding query string (tag `form`).
- Untuk request **POST/PUT**, memeriksa `Content-Type` — menggunakan binding JSON untuk `application/json`, XML untuk `application/xml`, dan binding form untuk `application/x-www-form-urlencoded` atau `multipart/form-data`.

Ini berarti satu handler dapat menerima data dari query string maupun body request tanpa pemilihan sumber secara manual.

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

## Uji coba

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
Tag `time_format` menggunakan [layout waktu referensi](https://pkg.go.dev/time#pkg-constants) Go. Format `2006-01-02` berarti "tahun-bulan-hari". Tag `time_utc:"1"` memastikan waktu yang diparsing menggunakan zona waktu UTC.
:::

## Lihat juga

- [Binding dan validasi](/id/docs/binding/binding-and-validation/)
- [Hanya bind query string](/id/docs/binding/only-bind-query-string/)
- [Bind header](/id/docs/binding/bind-header/)
