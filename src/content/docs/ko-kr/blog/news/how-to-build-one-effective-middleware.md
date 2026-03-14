---
title: "효과적인 미들웨어 구축 방법"
linkTitle: "효과적인 미들웨어 구축 방법"
lastUpdated: 2019-02-26
---

## 구성 요소

미들웨어는 일반적으로 두 부분으로 구성됩니다:

- 첫 번째 부분은 미들웨어를 초기화할 때 한 번 실행됩니다. 여기서 글로벌 객체, 설정 로직 등 애플리케이션의 수명 동안 한 번만 발생해야 하는 모든 것을 설정합니다.

- 두 번째 부분은 모든 요청에서 실행됩니다. 예를 들어, 데이터베이스 미들웨어에서는 글로벌 데이터베이스 객체를 요청 컨텍스트에 주입합니다. 컨텍스트에 들어가면 다른 미들웨어와 핸들러 함수가 이를 검색하고 사용할 수 있습니다.

```go
func funcName(params string) gin.HandlerFunc {
  // <---
  // 이것은 첫 번째 부분입니다
  // --->
  // 예제 초기화: 입력 매개변수 유효성 검사
  if err := check(params); err != nil {
      panic(err)
  }

  return func(c *gin.Context) {
    // <---
    // 이것은 두 번째 부분입니다
    // --->
    // 요청별 실행 예제: 컨텍스트에 주입
    c.Set("TestVar", params)
    c.Next()
  }
}
```

## 실행 과정

다음 예제 코드를 살펴보겠습니다:

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

위의 [구성 요소](#구성-요소) 섹션에 따르면, Gin 프로세스를 실행할 때 각 미들웨어의 **첫 번째 부분**이 먼저 실행되고 다음 정보를 출력합니다:

```go
globalMiddleware...1
mid1...1
mid2...1
```

초기화 순서는 다음과 같습니다:

```go
globalMiddleware...1
    |
    v
mid1...1
    |
    v
mid2...1
```

요청을 보내면(예: `curl -v localhost:8080/rest/n/api/some`) 각 미들웨어의 **두 번째 부분**이 순서대로 실행되며 다음을 출력합니다:

```go
globalMiddleware...2
mid1...2
mid2...2
exec handler.
mid2...3
mid1...3
globalMiddleware...3
```

즉, 실행 순서는 다음과 같습니다:

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
