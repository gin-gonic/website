---
title: "効果的なミドルウェアの作り方"
linkTitle: "効果的なミドルウェアの作り方"
lastUpdated: 2019-02-26
---

## 構成要素

ミドルウェアは通常、2つの部分で構成されます：

- 最初の部分は、ミドルウェアを初期化する際に一度だけ実行されます。ここでは、グローバルオブジェクトや設定ロジックなど、アプリケーションのライフタイムで一度だけ実行する必要があるものをセットアップします。

- 2番目の部分は、リクエストごとに実行されます。例えば、データベースミドルウェアでは、グローバルなデータベースオブジェクトをリクエストコンテキストに注入します。コンテキストに入った後は、他のミドルウェアやハンドラ関数がそれを取得して使用できます。

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

## 実行プロセス

以下のサンプルコードを見てみましょう：

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

上記の[構成要素](#構成要素)セクションに従い、Ginプロセスを実行すると、各ミドルウェアの**第1部分**が最初に実行され、以下の情報が出力されます：

```go
globalMiddleware...1
mid1...1
mid2...1
```

初期化の順序は以下の通りです：

```go
globalMiddleware...1
    |
    v
mid1...1
    |
    v
mid2...1
```

リクエストを行うと（例：`curl -v localhost:8080/rest/n/api/some`）、各ミドルウェアの**第2部分**が順番に実行され、以下が出力されます：

```go
globalMiddleware...2
mid1...2
mid2...2
exec handler.
mid2...3
mid1...3
globalMiddleware...3
```

つまり、実行順序は以下のようになります：

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
