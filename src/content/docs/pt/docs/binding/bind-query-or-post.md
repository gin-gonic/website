---
title: "Vincular query string ou dados post"
sidebar:
  order: 4
---

`ShouldBind` seleciona automaticamente o mecanismo de binding com base no método HTTP e no header `Content-Type`:

- Para requisições **GET**, ele usa o binding de query string (tags `form`).
- Para requisições **POST/PUT**, ele verifica o `Content-Type` — usando binding JSON para `application/json`, XML para `application/xml` e binding de formulário para `application/x-www-form-urlencoded` ou `multipart/form-data`.

Isso significa que um único handler pode aceitar dados tanto de query strings quanto de corpos de requisição sem seleção manual da fonte.

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

## Teste

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
A tag `time_format` usa o [layout de tempo de referência](https://pkg.go.dev/time#pkg-constants) do Go. O formato `2006-01-02` significa "ano-mes-dia". A tag `time_utc:"1"` garante que o tempo analisado esteja em UTC.
:::

## Veja também

- [Binding e validação](/pt/docs/binding/binding-and-validation/)
- [Vincular apenas query string](/pt/docs/binding/only-bind-query-string/)
- [Bind header](/pt/docs/binding/bind-header/)
