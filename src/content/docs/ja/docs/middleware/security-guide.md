---
title: "セキュリティのベストプラクティス"
sidebar:
  order: 8
---

Webアプリケーションは攻撃者の主要なターゲットです。ユーザー入力を処理し、データを保存し、リバースプロキシの背後で動作するGinアプリケーションは、本番環境に移行する前に意図的なセキュリティ設定が必要です。このガイドでは、最も重要な防御策とGinミドルウェアおよび標準Goライブラリを使用した適用方法を説明します。

:::note
セキュリティは多層的です。このリストの単一の手法だけでは十分ではありません。関連するすべてのセクションを適用して多層防御を構築してください。
:::

## CORS設定

Cross-Origin Resource Sharing（CORS）は、どの外部ドメインがAPIにリクエストを送信できるかを制御します。CORSの設定ミスにより、悪意のあるWebサイトが認証済みユーザーに代わってサーバーからのレスポンスを読み取る可能性があります。

十分にテストされたソリューションとして[`gin-contrib/cors`](https://github.com/gin-contrib/cors)パッケージを使用してください。

```go
package main

import (
  "time"

  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"https://example.com"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
    MaxAge:           12 * time.Hour,
  }))

  r.GET("/api/data", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "ok"})
  })

  r.Run()
}
```

:::note
`AllowOrigins: []string{"*"}`と`AllowCredentials: true`を同時に使用しないでください。これにより、あらゆるサイトがAPIに対して認証付きリクエストを送信できることをブラウザに伝えることになります。
:::

## CSRF保護

クロスサイトリクエストフォージェリは、認証済みユーザーのブラウザを騙してアプリケーションに不要なリクエストを送信させます。認証にCookieを使用するすべての状態変更エンドポイント（POST、PUT、DELETE）にはCSRF保護が必要です。

[`gin-contrib/csrf`](https://github.com/gin-contrib/csrf)ミドルウェアを使用してトークンベースの保護を追加します。

```go
package main

import (
  "github.com/gin-contrib/csrf"
  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/cookie"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  store := cookie.NewStore([]byte("session-secret"))
  r.Use(sessions.Sessions("mysession", store))

  r.Use(csrf.Middleware(csrf.Options{
    Secret: "csrf-token-secret",
    ErrorFunc: func(c *gin.Context) {
      c.String(403, "CSRF token mismatch")
      c.Abort()
    },
  }))

  r.GET("/form", func(c *gin.Context) {
    token := csrf.GetToken(c)
    c.JSON(200, gin.H{"csrf_token": token})
  })

  r.POST("/form", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "submitted"})
  })

  r.Run()
}
```

:::note
CSRF保護はCookieベースの認証を使用するアプリケーションに不可欠です。`Authorization`ヘッダー（例：Bearerトークン）のみに依存するAPIは、ブラウザがそれらのヘッダーを自動的に付与しないため、CSRFに対して脆弱ではありません。
:::

## レート制限

レート制限は、乱用、ブルートフォース攻撃、リソース枯渇を防止します。標準ライブラリの`golang.org/x/time/rate`パッケージを使用して、クライアントごとのシンプルなレートリミッターをミドルウェアとして構築できます。

```go
package main

import (
  "net/http"
  "sync"

  "github.com/gin-gonic/gin"
  "golang.org/x/time/rate"
)

func RateLimiter() gin.HandlerFunc {
  type client struct {
    limiter *rate.Limiter
  }

  var (
    mu      sync.Mutex
    clients = make(map[string]*client)
  )

  return func(c *gin.Context) {
    ip := c.ClientIP()

    mu.Lock()
    if _, exists := clients[ip]; !exists {
      // 1秒あたり10リクエスト、バースト20を許可
      clients[ip] = &client{limiter: rate.NewLimiter(10, 20)}
    }
    cl := clients[ip]
    mu.Unlock()

    if !cl.limiter.Allow() {
      c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
        "error": "rate limit exceeded",
      })
      return
    }

    c.Next()
  }
}

func main() {
  r := gin.Default()
  r.Use(RateLimiter())

  r.GET("/api/resource", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "ok"})
  })

  r.Run()
}
```

:::note
上記の例ではリミッターをインメモリマップに格納しています。本番環境では、古いエントリの定期的なクリーンアップを追加し、複数のアプリケーションインスタンスを実行する場合は分散レートリミッター（例：Redisバックエンド）を検討してください。
:::

## 入力バリデーションとSQLインジェクション防止

常に構造体タグを使用したGinのモデルバインディングで入力をバリデーションしバインドしてください。ユーザー入力を連結してSQLクエリを構築しないでください。

### 構造体タグで入力をバリデーション

```go
type CreateUser struct {
  Username string `json:"username" binding:"required,alphanum,min=3,max=30"`
  Email    string `json:"email"    binding:"required,email"`
  Age      int    `json:"age"      binding:"required,gte=1,lte=130"`
}

func createUserHandler(c *gin.Context) {
  var req CreateUser
  if err := c.ShouldBindJSON(&req); err != nil {
    c.JSON(400, gin.H{"error": err.Error()})
    return
  }
  // reqはバリデーション済み；安全に処理を続行
}
```

### パラメータ化クエリを使用

```go
// 危険 -- SQLインジェクション脆弱性
row := db.QueryRow("SELECT id FROM users WHERE username = '" + username + "'")

// 安全 -- パラメータ化クエリ
row := db.QueryRow("SELECT id FROM users WHERE username = $1", username)
```

これはすべてのデータベースライブラリに適用されます。`database/sql`、GORM、sqlx、その他のORMを使用する場合でも、常にパラメータプレースホルダーを使用し、文字列連結を使用しないでください。

:::note
入力バリデーションとパラメータ化クエリは、インジェクション攻撃に対する2つの最も重要な防御策です。どちらか一方だけでは十分ではありません -- 両方を使用してください。
:::

## XSS防止

クロスサイトスクリプティング（XSS）は、攻撃者が他のユーザーのブラウザで実行される悪意のあるスクリプトを注入する場合に発生します。複数のレイヤーで防御してください。

### HTML出力をエスケープ

HTMLテンプレートをレンダリングする場合、Goの`html/template`パッケージはデフォルトで出力をエスケープします。ユーザー提供のデータをJSONとして返す場合は、ブラウザがJSONをHTMLとして解釈しないよう`Content-Type`ヘッダーが正しく設定されていることを確認してください。

```go
// GinはJSONレスポンスのContent-Typeを自動的に設定します。
// 構造化データを返す場合はc.Stringではなくc.JSONを使用してください。
c.JSON(200, gin.H{"input": userInput})
```

### JSONP保護にSecureJSONを使用

Ginは`c.SecureJSON`を提供しており、JSONハイジャックを防ぐために`while(1);`を先頭に付加します。

```go
c.SecureJSON(200, gin.H{"data": userInput})
```

### 必要に応じてContent-Typeを明示的に設定

```go
// APIエンドポイントでは常にJSONを返す
c.Header("Content-Type", "application/json; charset=utf-8")
c.Header("X-Content-Type-Options", "nosniff")
```

`X-Content-Type-Options: nosniff`ヘッダーはブラウザのMIMEタイプスニッフィングを防止し、サーバーが別のものとして宣言しているレスポンスをHTMLとして解釈することを防ぎます。

## セキュリティヘッダーミドルウェア

セキュリティヘッダーの追加は、最もシンプルで効果的な強化手段の一つです。詳細な例については[セキュリティヘッダー](/ja/docs/middleware/security-headers/)ページをご覧ください。以下は重要なヘッダーの簡単なまとめです。

```go
func SecurityHeaders() gin.HandlerFunc {
  return func(c *gin.Context) {
    c.Header("X-Frame-Options", "DENY")
    c.Header("X-Content-Type-Options", "nosniff")
    c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    c.Header("Content-Security-Policy", "default-src 'self'")
    c.Header("Referrer-Policy", "strict-origin")
    c.Header("Permissions-Policy", "geolocation=(), camera=(), microphone=()")
    c.Next()
  }
}
```

| ヘッダー | 防止するもの |
|--------|-----------------|
| `X-Frame-Options: DENY` | iframeによるクリックジャッキング |
| `X-Content-Type-Options: nosniff` | MIMEタイプスニッフィング攻撃 |
| `Strict-Transport-Security` | プロトコルダウングレードとCookieハイジャック |
| `Content-Security-Policy` | XSSとデータインジェクション |
| `Referrer-Policy` | 機密URLパラメータのサードパーティへの漏洩 |
| `Permissions-Policy` | ブラウザAPI（カメラ、マイクなど）の不正使用 |

## 信頼済みプロキシ

アプリケーションがリバースプロキシやロードバランサーの背後で動作する場合、Ginにどのプロキシを信頼するかを伝える必要があります。この設定がないと、攻撃者は`X-Forwarded-For`ヘッダーを偽造してIPベースのアクセス制御やレート制限をバイパスできます。

```go
// 既知のプロキシアドレスのみを信頼
router.SetTrustedProxies([]string{"10.0.0.1", "192.168.1.0/24"})
```

完全な説明と設定オプションについては[信頼済みプロキシ](/ja/docs/server-config/trusted-proxies/)ページをご覧ください。

## HTTPSとTLS

すべての本番GinアプリケーションはトラフィックをHTTPS経由で配信すべきです。GinはLet's Encryptによる自動TLS証明書をサポートしています。

```go
import "github.com/gin-gonic/autotls"

func main() {
  r := gin.Default()
  // ... ルート ...
  log.Fatal(autotls.Run(r, "example.com"))
}
```

カスタム証明書マネージャーを含む完全なセットアップ手順については[Let's Encryptサポート](/ja/docs/server-config/support-lets-encrypt/)ページをご覧ください。

:::note
プロトコルダウングレード攻撃を防ぐため、常にHTTPSと`Strict-Transport-Security`ヘッダー（HSTS）を組み合わせてください。HSTSヘッダーが設定されると、ブラウザはプレーンHTTPでの接続を拒否します。
:::

## 関連項目

- [セキュリティヘッダー](/ja/docs/middleware/security-headers/)
- [信頼済みプロキシ](/ja/docs/server-config/trusted-proxies/)
- [Let's Encryptサポート](/ja/docs/server-config/support-lets-encrypt/)
- [カスタムミドルウェア](/ja/docs/middleware/custom-middleware/)
- [バインディングとバリデーション](/ja/docs/binding/binding-and-validation/)
