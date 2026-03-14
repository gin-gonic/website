---
title: "如何构建一个有效的中间件"
linkTitle: "如何构建一个有效的中间件"
lastUpdated: 2019-02-26
---

## 组成部分

中间件通常由两部分组成：

- 第一部分在初始化中间件时执行一次。在这里设置全局对象、配置逻辑等——所有只需要在应用生命周期中发生一次的事情。

- 第二部分在每个请求时执行。例如，在数据库中间件中，你会将全局数据库对象注入到请求上下文中。一旦它在上下文中，其他中间件和处理函数就可以检索和使用它。

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

## 执行过程

让我们看下面的示例代码：

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

根据上面[组成部分](#组成部分)中的说明，当你运行 Gin 进程时，每个中间件的**第一部分**首先执行，并打印以下信息：

```go
globalMiddleware...1
mid1...1
mid2...1
```

初始化顺序为：

```go
globalMiddleware...1
    |
    v
mid1...1
    |
    v
mid2...1
```

当你发起请求时——例如 `curl -v localhost:8080/rest/n/api/some`——每个中间件的**第二部分**按顺序执行，并输出以下内容：

```go
globalMiddleware...2
mid1...2
mid2...2
exec handler.
mid2...3
mid1...3
globalMiddleware...3
```

换句话说，执行顺序为：

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
