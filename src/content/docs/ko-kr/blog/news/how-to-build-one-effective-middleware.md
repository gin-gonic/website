---
title: "효과적인 미들웨어를 만드는 방법은?"
linkTitle: "효과적인 미들웨어를 만드는 방법은?"
date: 2019-02-26
---

## Constituent parts

미들웨어는 두 부분으로 구성됩니다:

  - 첫 번째 부분은 미들웨어를 초기화할 때 한 번만 실행됩니다. 이 단계에서 전역 객체, 논리적 설정 등을 구성하며, 이는 애플리케이션의 전체 수명 동안 한 번만 수행됩니다.

  - 두 번째 부분은 각 요청(request)마다 실행됩니다. 예를 들어, 데이터베이스 미들웨어의 경우, 전역 데이터베이스 객체를 컨텍스트(context)에 주입합니다. 한 번 컨텍스트에 주입되면, 다른 미들웨어나 핸들러 함수 내에서 이를 가져와 사용할 수 있습니다.

```go
func funcName(params string) gin.HandlerFunc {
    // <---
    // This is part one
    // --->
    // The following code is an example
    if err := check(params); err != nil {
        panic(err)
    }

    return func(c *gin.Context) {
        // <---
        // This is part two
        // --->
        // The following code is an example
        c.Set("TestVar", params)
        c.Next()    
    }
}
```

## Execution process

먼저, 다음과 같은 예제 코드가 있습니다:

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

[구성 요소](#Constituent-parts)에 따라서, gin 프로세스를 실행하면, **첫번째 부분**이 먼저 실행되며, 다음 정보를 출력합니다:

```go
globalMiddleware...1
mid1...1
mid2...1
```

그리고 초기화 순서는 다음과 같습니다:

```go
globalMiddleware...1
    |
    v
mid1...1
    |
    v
mid2...1
```

'curl -v localhost:8080/rest/n/api/some' 요청을 보낼 때, **두 번째 부분**은 미들웨어를 실행하고 다음 정보를 출력합니다:

```go
globalMiddleware...2
mid1...2
mid2...2
exec handler.
mid2...3
mid1...3
globalMiddleware...3
```

다시 말해, 실행 순서는 다음과 같습니다:

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


