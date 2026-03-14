---
title: "How to Build an Effective Middleware"
linkTitle: "How to Build an Effective Middleware"
lastUpdated: 2019-02-26
---

## Constituent parts

Middleware typically consists of two parts:

- The first part executes once, when you initialize your middleware. This is where you set up global objects, configuration logic, etc.—everything that only needs to happen once in the application's lifetime.

- The second part executes on every request. For example, in a database middleware, you would inject your global database object into the request context. Once it is in the context, other middlewares and your handler functions can retrieve and use it.

```go
func funcName(params string) gin.HandlerFunc {
  // <---
  // This is part one
  // --->
  // Example initialization: validate input params
  if err := check(params); err != nil {
      panic(err)
  }

  return func(c *gin.Context) {
    // <---
    // This is part two
    // --->
    // Example execution per request: inject into context
    c.Set("TestVar", params)
    c.Next()
  }
}
```

## Execution process

Let's look at the following example code:

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

According to the [Constituent parts](#constituent-parts) section above, when you run the Gin process, **part one** of each middleware executes first and prints the following information:

```go
globalMiddleware...1
mid1...1
mid2...1
```

The initialization order is:

```go
globalMiddleware...1
    |
    v
mid1...1
    |
    v
mid2...1
```

When you make a request—e.g., `curl -v localhost:8080/rest/n/api/some`—**part two** of each middleware executes in order and outputs the following:

```go
globalMiddleware...2
mid1...2
mid2...2
exec handler.
mid2...3
mid1...3
globalMiddleware...3
```

In other words, the execution order is:

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
```
