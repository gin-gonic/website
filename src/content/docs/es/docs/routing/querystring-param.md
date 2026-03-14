---
title: "Parámetros de cadena de consulta"
sidebar:
  order: 3
---

Los parámetros de cadena de consulta son los pares clave-valor que aparecen después del `?` en una URL (por ejemplo, `/search?q=gin&page=2`). Gin proporciona dos métodos para leerlos:

- `c.Query("key")` devuelve el valor del parámetro de consulta, o una **cadena vacía** si la clave no está presente.
- `c.DefaultQuery("key", "default")` devuelve el valor, o el **valor predeterminado** especificado si la clave no está presente.

Ambos métodos son atajos para acceder a `c.Request.URL.Query()` con menos código repetitivo.

```go
func main() {
  router := gin.Default()

  // Query string parameters are parsed using the existing underlying request object.
  // The request responds to a url matching:  /welcome?firstname=Jane&lastname=Doe
  router.GET("/welcome", func(c *gin.Context) {
    firstname := c.DefaultQuery("firstname", "Guest")
    lastname := c.Query("lastname") // shortcut for c.Request.URL.Query().Get("lastname")

    c.String(http.StatusOK, "Hello %s %s", firstname, lastname)
  })
  router.Run(":8080")
}
```

### Pruébalo

```sh
# Both parameters provided
curl "http://localhost:8080/welcome?firstname=Jane&lastname=Doe"
# Output: Hello Jane Doe

# Missing firstname -- uses default value "Guest"
curl "http://localhost:8080/welcome?lastname=Doe"
# Output: Hello Guest Doe

# No parameters at all
curl "http://localhost:8080/welcome"
# Output: Hello Guest
```

## Ver también

- [Parámetros en la ruta](/es/docs/routing/param-in-path/)
