---
title: "サーバー設定"
sidebar:
  order: 8
---

Ginは柔軟なサーバー設定オプションを提供しています。`gin.Engine`は`http.Handler`インターフェースを実装しているため、Goの標準`net/http.Server`と組み合わせてタイムアウト、TLS、その他の設定を直接制御できます。

## カスタムhttp.Serverの使用

デフォルトでは、`router.Run()`は基本的なHTTPサーバーを起動します。本番環境では、タイムアウトやその他のオプションを設定するために独自の`http.Server`を作成してください：

```go
func main() {
  router := gin.Default()
  router.GET("/", func(c *gin.Context) {
    c.String(200, "ok")
  })

  s := &http.Server{
    Addr:           ":8080",
    Handler:        router,
    ReadTimeout:    10 * time.Second,
    WriteTimeout:   10 * time.Second,
    MaxHeaderBytes: 1 << 20,
  }
  s.ListenAndServe()
}
```

これにより、Ginのルーティングとミドルウェア機能をすべて維持しながら、Goのサーバー設定に完全にアクセスできます。

## このセクションの内容

- [**カスタムHTTP設定**](./custom-http-config/) -- 基盤となるHTTPサーバーの微調整
- [**カスタムJSONコーデック**](./custom-json-codec/) -- 代替JSONシリアライゼーションライブラリの使用
- [**Let's Encrypt**](./lets-encrypt/) -- Let's Encryptによる自動TLS証明書
- [**複数サービスの実行**](./multiple-service/) -- 異なるポートで複数のGinエンジンを起動
- [**グレースフルリスタートまたは停止**](./graceful-restart-or-stop/) -- アクティブな接続を切断せずにシャットダウン
- [**HTTP/2サーバープッシュ**](./http2-server-push/) -- リソースをクライアントに先行してプッシュ
- [**Cookieの処理**](./cookie/) -- HTTP Cookieの読み書き
- [**信頼済みプロキシ**](./trusted-proxies/) -- クライアントIP解決のためにGinが信頼するプロキシの設定
