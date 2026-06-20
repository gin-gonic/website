---
title: "Bind query string or post data"
sidebar:
  order: 4
---

`ShouldBind` automatically selects the binding engine based on the HTTP method and `Content-Type` header:

- For **GET** requests, it uses query string binding (`form` tags).
- For **POST/PUT** requests, it checks the `Content-Type` — using JSON binding for `application/json`, XML for `application/xml`, and form binding for `application/x-www-form-urlencoded` or `multipart/form-data`.

This means a single handler can accept data from both query strings and request bodies without manual source selection.

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

## Test it

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
The `time_format` tag uses Go's [reference time layout](https://pkg.go.dev/time#pkg-constants). The format `2006-01-02` means "year-month-day". The `time_utc:"1"` tag ensures the parsed time is in UTC.
:::

## See also

- [Binding and validation](/en/docs/binding/binding-and-validation/)
- [Only bind query string](/en/docs/binding/only-bind-query-string/)
- [Bind header](/en/docs/binding/bind-header/)
