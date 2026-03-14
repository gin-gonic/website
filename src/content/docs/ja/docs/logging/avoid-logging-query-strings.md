---
title: "クエリ文字列のロギングを回避"
sidebar:
  order: 5
---

クエリ文字列にはAPIトークン、パスワード、セッションID、個人を特定できる情報（PII）などの機密情報が含まれることがよくあります。これらの値をロギングすると、セキュリティリスクが生じ、GDPRやHIPAAなどのプライバシー規制に違反する可能性があります。クエリ文字列をログから除去することで、ログファイル、モニタリングシステム、エラーレポートツールを通じて機密データが漏洩するリスクを軽減できます。

`LoggerConfig`の`SkipQueryString`オプションを使用して、クエリ文字列がログに表示されないようにします。有効にすると、`/path?token=secret&user=alice`へのリクエストは単に`/path`としてログに記録されます。

```go
func main() {
  router := gin.New()

  // SkipQueryStringはロガーがクエリ文字列をログに記録しないことを示します。
  // 例えば、/path?q=1は/pathとしてログに記録されます
  loggerConfig := gin.LoggerConfig{SkipQueryString: true}

  router.Use(gin.LoggerWithConfig(loggerConfig))
  router.Use(gin.Recovery())

  router.GET("/search", func(c *gin.Context) {
    q := c.Query("q")
    c.String(200, "searching for: "+q)
  })

  router.Run(":8080")
}
```

`curl`で違いをテストできます：

```bash
curl "http://localhost:8080/search?q=gin&token=secret123"
```

`SkipQueryString`なしの場合、ログエントリに完全なクエリ文字列が含まれます：

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search?q=gin&token=secret123"
```

`SkipQueryString: true`の場合、クエリ文字列が除去されます：

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search"
```

これは、ログ出力がサードパーティサービスに転送されたり長期保存される、コンプライアンスが重要な環境で特に有用です。アプリケーションは`c.Query()`を通じてクエリパラメータに完全にアクセスできます。影響を受けるのはログ出力のみです。
