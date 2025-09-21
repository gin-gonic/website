---
title: "Cómo construir un middleware efectivo"
linkTitle: "Cómo construir un middleware efectivo"
lastUpdated: 2019-02-26
---

## Partes constituyentes

Normalmente, un middleware consta de dos partes:

- La primera parte se ejecuta una vez, cuando inicializas tu middleware. Aquí es donde configuras objetos globales, lógica de configuración, etc.; todo lo que solo necesita suceder una vez en el ciclo de vida de la aplicación.

- La segunda parte se ejecuta en cada petición. Por ejemplo, en un middleware de base de datos, inyectarías tu objeto global de base de datos en el contexto de la solicitud. Una vez en el contexto, otros middlewares y tus funciones controlador pueden recuperarlo y utilizarlo.

```go
func funcName(params string) gin.HandlerFunc {
  // <---
  // Esta es la primera parte
  // --->
  // Ejemplo de inicialización: validar parámetros de entrada
  if err := check(params); err != nil {
      panic(err)
  }

  return func(c *gin.Context) {
    // <---
    // Esta es la segunda parte
    // --->
    // Ejecución por solicitud: inyectar en el contexto
    c.Set("TestVar", params)
    c.Next()
  }
}
```

## Proceso de ejecución

Veamos el siguiente ejemplo de código:

```go
func main() {
  router := gin.Default()

  router.Use(globalMiddleware())

  router.GET("/rest/n/api/*some", mid1(), mid2(), handler)

  router.Run()
}

func globalMiddleware() gin.HandlerFunc {
  fmt.Println("globalMiddleware...1")

  return func(c *gin.Context) {
    fmt.Println("globalMiddleware...2")
    c.Next()
    fmt.Println("globalMiddleware...3")
  }
}

func handler(c *gin.Context) {
  fmt.Println("exec handler.")
}

func mid1() gin.HandlerFunc {
  fmt.Println("mid1...1")

  return func(c *gin.Context) {

    fmt.Println("mid1...2")
    c.Next()
    fmt.Println("mid1...3")
  }
}

func mid2() gin.HandlerFunc {
  fmt.Println("mid2...1")

  return func(c *gin.Context) {
    fmt.Println("mid2...2")
    c.Next()
    fmt.Println("mid2...3")
  }
}
```

Según la sección [Partes constituyentes](#partes-constituyentes) anterior, cuando ejecutas el proceso Gin, **la primera parte** de cada middleware se ejecuta primero e imprime la siguiente información:

```go
globalMiddleware...1
mid1...1
mid2...1
```

El orden de inicialización es:

```go
globalMiddleware...1
    |
    v
mid1...1
    |
    v
mid2...1
```

Cuando realizas una solicitud—por ejemplo, `curl -v localhost:8080/rest/n/api/some`—**la segunda parte** de cada middleware se ejecuta en orden y muestra lo siguiente:

```go
globalMiddleware...2
mid1...2
mid2...2
exec handler.
mid2...3
mid1...3
globalMiddleware...3
```

En otras palabras, el orden de ejecución es:

```go
globalMiddleware...2
    |
    v
mid1...2
    |
    v
mid2...2
    |
    v
exec handler.
    |
    v
mid2...3
    |
    v
mid1...3
    |
    v
globalMiddleware...3
