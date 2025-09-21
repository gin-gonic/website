---
title: "효과적인 미들웨어를 만드는 방법"
linkTitle: "효과적인 미들웨어를 만드는 방법"
lastUpdated: 2019-02-26
---

## 구성 요소

미들웨어는 일반적으로 두 부분으로 구성됩니다:

- 첫 번째 부분은 미들웨어를 초기화할 때 한 번만 실행됩니다. 여기서는 글로벌 객체, 설정 로직 등 애플리케이션의 전체 생명주기에서 한 번만 필요한 작업을 설정합니다.

- 두 번째 부분은 요청마다 실행됩니다. 예를 들어, 데이터베이스 미들웨어에서는 글로벌 데이터베이스 객체를 요청 컨텍스트에 주입합니다. 컨텍스트에 주입된 후에는 다른 미들웨어와 핸들러 함수에서 해당 객체를 가져와 사용할 수 있습니다.

```go
func funcName(params string) gin.HandlerFunc {
  // <---
  // 이것이 첫 번째 부분입니다
  // --->
  // 초기화 예시: 입력 파라미터 검증
  if err := check(params); err != nil {
      panic(err)
  }

  return func(c *gin.Context) {
    // <---
    // 이것이 두 번째 부분입니다
    // --->
    // 요청별 실행 예시: 컨텍스트에 주입
    c.Set("TestVar", params)
    c.Next()
  }
}
```

## 실행 과정

다음 예제 코드를 살펴봅시다:

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

상단의 [구성 요소](#구성-요소)에서 설명한 것처럼 Gin 프로세스를 실행하면 각 미들웨어의 **첫 번째 부분**이 먼저 실행되고 아래와 같은 정보가 출력됩니다:

```go
globalMiddleware...1
mid1...1
mid2...1
```

초기화 순서:

```go
globalMiddleware...1
    |
    v
mid1...1
    |
    v
mid2...1
```

요청을 보내면(예: `curl -v localhost:8080/rest/n/api/some`) 각 미들웨어의 **두 번째 부분**이 순서대로 실행되며 아래와 같이 출력됩니다:

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
