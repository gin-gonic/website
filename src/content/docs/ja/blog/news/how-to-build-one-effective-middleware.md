---
title: "効果的なミドルウェアの作り方"
linkTitle: "効果的なミドルウェアの作り方"
lastUpdated: 2019-02-26
---

## 構成要素

ミドルウェアは通常、2つの部分で構成されています：

- 1つ目の部分は、ミドルウェアを初期化するときに一度だけ実行されます。ここでは、グローバルオブジェクトや設定ロジックなど、アプリケーションのライフサイクル全体で一度だけ必要となる処理を行います。

- 2つ目の部分は、リクエストごとに実行されます。たとえば、データベースミドルウェアの場合、グローバルなデータベースオブジェクトをリクエストコンテキストに注入します。コンテキストに注入されると、他のミドルウェアやハンドラ関数で取得・使用できます。

```go
func funcName(params string) gin.HandlerFunc {
  // <---
  // ここが第1部
  // --->
  // 初期化例：入力パラメータの検証
  if err := check(params); err != nil {
      panic(err)
  }

  return func(c *gin.Context) {
    // <---
    // ここが第2部
    // --->
    // リクエストごとの実行例：コンテキストへ注入
    c.Set("TestVar", params)
    c.Next()
  }
}
```

## 実行プロセス

以下のコード例を見てみましょう：

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

上記の[構成要素](#構成要素)セクションに従ってGinプロセスを実行すると、各ミドルウェアの**第1部**が最初に実行され、次の情報が出力されます：

```go
globalMiddleware...1
mid1...1
mid2...1
```

初期化の順序：

```go
globalMiddleware...1
    |
    v
mid1...1
    |
    v
mid2...1
```

リクエスト（例: `curl -v localhost:8080/rest/n/api/some`）を行うと、各ミドルウェアの**第2部**が順に実行され、下記のように出力されます：

```go
globalMiddleware...2
mid1...2
mid2...2
exec handler.
mid2...3
mid1...3
globalMiddleware...3
```

つまり、実行順序は次の通りです：

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
