---
title: "Enlazar cadena de consulta o datos post"
sidebar:
  order: 4
---

`ShouldBind` selecciona automáticamente el motor de enlace según el método HTTP y el encabezado `Content-Type`:

- Para solicitudes **GET**, usa el enlace de cadena de consulta (etiquetas `form`).
- Para solicitudes **POST/PUT**, verifica el `Content-Type` — usando enlace JSON para `application/json`, XML para `application/xml` y enlace de formulario para `application/x-www-form-urlencoded` o `multipart/form-data`.

Esto significa que un solo handler puede aceptar datos tanto de cadenas de consulta como de cuerpos de solicitud sin selección manual de la fuente.

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

## Pruébalo

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
La etiqueta `time_format` usa el [formato de tiempo de referencia](https://pkg.go.dev/time#pkg-constants) de Go. El formato `2006-01-02` significa "año-mes-día". La etiqueta `time_utc:"1"` asegura que el tiempo analizado esté en UTC.
:::

## Ver también

- [Enlace y validación](/es/docs/binding/binding-and-validation/)
- [Solo enlazar cadena de consulta](/es/docs/binding/only-bind-query-string/)
- [Enlazar encabezados](/es/docs/binding/bind-header/)
