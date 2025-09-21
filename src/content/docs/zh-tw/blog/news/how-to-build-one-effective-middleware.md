---
title: "如何建立一個有效的中介軟體"
linkTitle: "如何建立一個有效的中介軟體"
lastUpdated: 2019-02-26
---

## 組成部分

中介軟體一般由兩部分構成：

- 第一部分在你初始化中介軟體時只會執行一次。這裡可以設定全域物件、組態邏輯等——所有只需要在應用程式生命週期執行一次的內容。

- 第二部分則在每次請求時執行。例如，在資料庫中介軟體中，你會將全域資料庫物件注入到請求 context。注入後，其他中介軟體及處理函式都能取得並使用它。

```go
func funcName(params string) gin.HandlerFunc {
  // <---
  // 這是第一部分
  // --->
  // 初始化範例：驗證輸入參數
  if err := check(params); err != nil {
      panic(err)
  }

  return func(c *gin.Context) {
    // <---
    // 這是第二部分
    // --->
    // 每次請求執行：注入到 context
    c.Set("TestVar", params)
    c.Next()
  }
}
```

## 執行流程

讓我們看看以下範例程式碼：

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

依據前述[組成部分](#組成部分)章節，當你執行 Gin 程序時，每個中介軟體的**第一部分**會先執行，並輸出以下資訊：

```go
globalMiddleware...1
mid1...1
mid2...1
```

初始化順序：

```go
globalMiddleware...1
    |
    v
mid1...1
    |
    v
mid2...1
```

當你發起請求（如 `curl -v localhost:8080/rest/n/api/some`），每個中介軟體的**第二部分**會按照順序執行，輸出如下內容：

```go
globalMiddleware...2
mid1...2
mid2...2
exec handler.
mid2...3
mid1...3
globalMiddleware...3
```

換句話說，執行順序如下：

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
