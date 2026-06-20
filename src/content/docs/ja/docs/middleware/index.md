---
title: "ミドルウェア"
sidebar:
  order: 6
---

Ginのミドルウェアは、HTTPリクエストがルートハンドラに到達する前に処理する方法を提供します。ミドルウェア関数はルートハンドラと同じシグネチャ（`gin.HandlerFunc`）を持ち、通常は`c.Next()`を呼び出してチェーン内の次のハンドラに制御を渡します。

## ミドルウェアの仕組み

Ginはミドルウェアの実行に**オニオンモデル**を使用します。各ミドルウェアは2つのフェーズで実行されます：

1. **プレハンドラ** -- `c.Next()`の前のコードはルートハンドラの前に実行されます。
2. **ポストハンドラ** -- `c.Next()`の後のコードはルートハンドラが戻った後に実行されます。

これは、ミドルウェアが玉ねぎの層のようにハンドラをラップすることを意味します。最初に登録されたミドルウェアが最も外側の層になります。

```go
func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()

    // プレハンドラフェーズ
    c.Next()

    // ポストハンドラフェーズ
    latency := time.Since(start)
    log.Printf("Request took %v", latency)
  }
}
```

## ミドルウェアの登録

Ginでミドルウェアを登録する方法は3つあります：

```go
// 1. グローバル -- すべてのルートに適用
router := gin.New()
router.Use(Logger(), Recovery())

// 2. グループ -- グループ内のすべてのルートに適用
v1 := router.Group("/v1")
v1.Use(AuthRequired())
{
  v1.GET("/users", listUsers)
}

// 3. ルートごと -- 単一のルートに適用
router.GET("/benchmark", BenchmarkMiddleware(), benchHandler)
```

より広いスコープで登録されたミドルウェアが先に実行されます。上記の例では、`GET /v1/users`へのリクエストは`Logger`、`Recovery`、`AuthRequired`、`listUsers`の順に実行されます。

## このセクションの内容

- [**ミドルウェアの使用**](./using-middleware/) -- ミドルウェアをグローバル、グループ、または個別のルートに登録する
- [**カスタムミドルウェア**](./custom-middleware/) -- 独自のミドルウェア関数を作成する
- [**BasicAuthミドルウェアの使用**](./using-basicauth/) -- HTTP基本認証
- [**ミドルウェア内のゴルーチン**](./goroutines-inside-middleware/) -- ミドルウェアから安全にバックグラウンドタスクを実行する
- [**カスタムHTTP設定**](./custom-http-config/) -- ミドルウェアでのエラーハンドリングとリカバリ
- [**セキュリティヘッダー**](./security-headers/) -- 一般的なセキュリティヘッダーを設定する
