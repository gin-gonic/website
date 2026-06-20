---
title: "信頼済みプロキシ"
sidebar:
  order: 8
---

Ginでは、実際のクライアントIPを保持するヘッダー（もしあれば）と、それらのヘッダーを指定することが信頼できるプロキシ（または直接クライアント）を指定できます。

### 信頼済みプロキシ設定が重要な理由

アプリケーションがリバースプロキシ（Nginx、HAProxy、クラウドロードバランサーなど）の背後にある場合、プロキシは元のクライアントのIPアドレスを`X-Forwarded-For`や`X-Real-Ip`などのヘッダーで転送します。問題は、**どのクライアントでもこれらのヘッダーを設定できる**ことです。適切な信頼済みプロキシ設定がないと、攻撃者は`X-Forwarded-For`を偽造して以下のことが可能になります：

- **IPベースのアクセス制御のバイパス** -- アプリケーションが特定のルートを内部IPレンジ（例：`10.0.0.0/8`）に制限している場合、攻撃者はパブリックIPから`X-Forwarded-For: 10.0.0.1`を送信して制限を完全にバイパスできます。
- **ログと監査証跡の汚染** -- 偽造されたIPにより、実際のソースにリクエストを遡れなくなるため、インシデント調査が信頼性を失います。
- **レート制限の回避** -- レート制限が`ClientIP()`をキーにしている場合、各リクエストが異なるIPアドレスを主張してスロットリングを回避できます。

`SetTrustedProxies`は、Ginにどのネットワークアドレスががスプロキシかを伝えることでこの問題を解決します。`ClientIP()`が`X-Forwarded-For`チェーンをパースする際、それらのプロキシによって追加されたエントリのみを信頼し、クライアントが先頭に追加したものは破棄します。リクエストが直接到着した場合（信頼済みプロキシからではない場合）、転送ヘッダーは完全に無視され、生のリモートアドレスが使用されます。

`gin.Engine`の`SetTrustedProxies()`関数を使用して、クライアントIPに関連するリクエストヘッダーを信頼できるクライアントのネットワークアドレスまたはネットワークCIDRを指定します。IPv4アドレス、IPv4 CIDR、IPv6アドレス、またはIPv6 CIDRを指定できます。

**注意：** 上記の関数で信頼済みプロキシを指定しない場合、Ginはデフォルトですべてのプロキシを信頼します。これは**安全ではありません**。同時に、プロキシを使用しない場合は、`Engine.SetTrustedProxies(nil)`を使用してこの機能を無効にできます。すると`Context.ClientIP()`は不要な計算を避けてリモートアドレスを直接返します。

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  router.SetTrustedProxies([]string{"192.168.1.2"})

  router.GET("/", func(c *gin.Context) {
    // クライアントが192.168.1.2の場合、X-Forwarded-For
    // ヘッダーを使用して、信頼できる部分から
    // 元のクライアントIPを推定します。
    // そうでなければ、直接のクライアントIPを返します
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```

**注意：** CDNサービスを使用している場合、`Engine.TrustedPlatform`を設定してTrustedProxiesチェックをスキップできます。TrustedProxiesより優先度が高くなります。以下の例をご覧ください：

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()
  // 定義済みヘッダーgin.PlatformXXXを使用
  // Google App Engine
  router.TrustedPlatform = gin.PlatformGoogleAppEngine
  // Cloudflare
  router.TrustedPlatform = gin.PlatformCloudflare
  // Fly.io
  router.TrustedPlatform = gin.PlatformFlyIO
  // または、独自の信頼済みリクエストヘッダーを設定できます。ただし、CDNが
  // ユーザーによるこのヘッダーの通過を防いでいることを確認してください！
  // 例えば、CDNがクライアントIPをX-CDN-Client-IPに入れる場合：
  router.TrustedPlatform = "X-CDN-Client-IP"

  router.GET("/", func(c *gin.Context) {
    // TrustedPlatformを設定した場合、ClientIP()は
    // 対応するヘッダーを解決してIPを直接返します
    fmt.Printf("ClientIP: %s\n", c.ClientIP())
  })
  router.Run()
}
```
