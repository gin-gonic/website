---
sidebar:
  order: 6
title: デプロイ
---

Gin のプロジェクトはあらゆるクラウドサービス上に簡単にデプロイできます。

## [Railway](https://www.railway.com)

Railway は、アプリケーションやサービスのデプロイ、管理、スケーリングのための最先端のクラウド開発プラットフォームです。サーバーから監視まで、単一の拡張可能で使いやすいプラットフォームでインフラ構成をシンプルにします。

Railway の [Gin プロジェクトのデプロイガイド](https://docs.railway.com/guides/gin)に従ってください。

## [Koyeb](https://www.koyeb.com)

Koyeb は開発者フレンドリーなサーバーレスプラットフォームで、Git ベースのデプロイ、TLS 暗号化、ネイティブなオートスケーリング、グローバルエッジネットワーク、組み込みのサービスメッシュ＆ディスカバリーを備えており、アプリケーションをグローバルにデプロイできます。

Koyeb の [Gin プロジェクトのデプロイガイド](https://www.koyeb.com/tutorials/deploy-go-gin-on-koyeb)に従ってください。

## [Qovery](https://www.qovery.com)

Qovery はデータベース、SSL、グローバル CDN、Git による自動デプロイを備えた無料のクラウドホスティングを提供しています。

[Gin プロジェクトのデプロイ](https://docs.qovery.com/guides/tutorial/deploy-gin-with-postgresql/)に関する Qovery のガイドに従ってください。

## [Render](https://render.com)

Render は Go をネイティブサポートするモダンなクラウドプラットフォームで、フルマネージド
SSL、データベース、ダウンタイムのないデプロイ、HTTP/2、そして websocket もサポートしています。

Render の[Gin
プロジェクトのデプロイガイド](https://render.com/docs/deploy-go-gin)に詳細な記述があります。

## [Google App Engine](https://cloud.google.com/appengine/)

GAE で Go のアプリケーションをデプロイするには 2
つの方法があります。スタンダード環境は簡単に使用できますが、カスタマイズ性は低く、セキュリティ上の問題で[システムコール](https://github.com/gin-gonic/gin/issues/1639)の使用は避けるべきです。フレキシブル環境はあらゆるフレームワークやライブラリが使用できます。

さらに学んだり、より適した環境を探すには[Google App Engine 上での Go
の使用](https://cloud.google.com/appengine/docs/go/)を参考にしてください。

## セルフホスト

Gin プロジェクトはセルフホスト方式でもデプロイできます。デプロイメントアーキテクチャとセキュリティの考慮事項は、対象となる環境によって異なります。以下のセクションでは、デプロイメントを計画する際に考慮すべき設定オプションの概要のみを説明します。

## 設定オプション

Gin プロジェクトのデプロイは、環境変数またはコード内で直接設定することができます。

Gin の設定には以下の環境変数が利用可能です:

| 環境変数 | 説明 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT | `router.Run()` を使用して Gin サーバーを起動する際に使用する TCP のポート （つまり引数は要らない） |
| GIN_MODE | `debug`、`release`、`test` のいずれかに設定。デバッグ出力を出すタイミングなど、Gin のモードを管理します。コード内で `gin.SetMode(gin.ReleaseMode)` や `gin.SetMode(gin.TestMode)` を使用して設定することもできます。 |

以下のコードを使用して Gin を設定できます。

```go
// バインドアドレスやポートを指定しない場合、デフォルトでは全てのインターフェースのポート8080にバインドされます。
// Run() を引数なしで使用する場合、PORT 環境変数を使用してリッスンポートを変更できます。
router := gin.Default()
router.Run()

// バインドアドレスとポートを指定します。
router := gin.Default()
router.Run("192.168.1.100:8080")

// リッスンポートのみを指定します。全てのインターフェースにバインドされます。
router := gin.Default()
router.Run(":8080")

// 実際のクライアントIPアドレスを設定するヘッダーについて、信頼できるIPアドレスやCIDRを設定します。
// 詳細はドキュメントを参照してください。
router := gin.Default()
router.SetTrustedProxies([]string{"192.168.1.2"})
```

## 全てのプロキシを信頼しない

Gin では、実際のクライアント IP を保持するヘッダー（存在する場合）を指定したり、これらのヘッダーを指定することを信頼するプロキシ（または直接のクライアント）を指定することができます。

`gin.Engine` の `SetTrustedProxies()` 関数を使用して、クライアント IP に関連するリクエストヘッダーを信頼できるクライアントのネットワークアドレスやネットワーク CIDR を指定します。これらは IPv4 アドレス、IPv4 CIDR、IPv6 アドレス、または IPv6 CIDR を指定できます。

**注意：** 上記の関数を使用して信頼できるプロキシを指定しない場合、Ginはデフォルトで全てのプロキシを信頼します。これは**安全ではありません**。同時に、プロキシを使用しない場合は、`Engine.SetTrustedProxies(nil)` を使用してこの機能を無効にできます。その場合、不要な計算を避けるため `Context.ClientIP()` は直接リモートアドレスを返します。

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.SetTrustedProxies([]string{"192.168.1.2"})

  router.GET("/", func(c *gin.Context) {
    // クライアントが 192.168.1.2 の場合、X-Forwarded-For
    // ヘッダーを使用して、そのヘッダーの信頼できる部分から
    // 元のクライアント IP を推測します。
    // それ以外の場合は、直接クライアント IP を返します
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```

**注意：** CDN サービスを使用している場合、`Engine.TrustedPlatform` を設定することで TrustedProxies のチェックをスキップできます。これは TrustedProxies よりも優先順位が高くなります。以下の例を参照してください:

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  // 事前定義されたヘッダー gin.PlatformXXX を使用
  // Google App Engine
  router.TrustedPlatform = gin.PlatformGoogleAppEngine
  // Cloudflare
  router.TrustedPlatform = gin.PlatformCloudflare
  // Fly.io
  router.TrustedPlatform = gin.PlatformFlyIO
  // または、独自の信頼できるリクエストヘッダーを設定できます。ただし、CDNが
  // ユーザーがこのヘッダーを渡すことを防いでいることを確認してください！
  // 例えば、CDNがクライアントIPを X-CDN-Client-IP に設定している場合:
  router.TrustedPlatform = "X-CDN-Client-IP"

  router.GET("/", func(c *gin.Context) {
    // TrustedPlatformを設定すると、ClientIP()は対応する
    // ヘッダーを解決して直接IPを返します
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```
