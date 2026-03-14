---
title: "セッション管理"
sidebar:
  order: 9
---

セッションを使用すると、複数のHTTPリクエストにまたがってユーザー固有のデータを保存できます。HTTPはステートレスであるため、セッションはCookieやその他のメカニズムを使用してリターンユーザーを識別し、保存されたデータを取得します。

## gin-contrib/sessionsの使用

[gin-contrib/sessions](https://github.com/gin-contrib/sessions)ミドルウェアは、複数のバックエンドストアを持つセッション管理を提供します：

```sh
go get github.com/gin-contrib/sessions
```

### Cookieベースのセッション

最もシンプルなアプローチで、暗号化されたCookieにセッションデータを保存します：

```go
package main

import (
  "net/http"

  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/cookie"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // シークレットキーでCookieベースのセッションストアを作成
  store := cookie.NewStore([]byte("your-secret-key"))
  r.Use(sessions.Sessions("mysession", store))

  r.GET("/login", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Set("user", "john")
    session.Save()
    c.JSON(http.StatusOK, gin.H{"message": "logged in"})
  })

  r.GET("/profile", func(c *gin.Context) {
    session := sessions.Default(c)
    user := session.Get("user")
    if user == nil {
      c.JSON(http.StatusUnauthorized, gin.H{"error": "not logged in"})
      return
    }
    c.JSON(http.StatusOK, gin.H{"user": user})
  })

  r.GET("/logout", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Clear()
    session.Save()
    c.JSON(http.StatusOK, gin.H{"message": "logged out"})
  })

  r.Run(":8080")
}
```

### Redisベースのセッション

本番アプリケーションでは、複数インスタンス間のスケーラビリティのためにRedisにセッションを保存します：

```go
package main

import (
  "net/http"

  "github.com/gin-contrib/sessions"
  "github.com/gin-contrib/sessions/redis"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  // セッションストレージ用にRedisに接続
  store, err := redis.NewStore(10, "tcp", "localhost:6379", "", []byte("secret"))
  if err != nil {
    panic(err)
  }
  r.Use(sessions.Sessions("mysession", store))

  r.GET("/set", func(c *gin.Context) {
    session := sessions.Default(c)
    session.Set("count", 1)
    session.Save()
    c.JSON(http.StatusOK, gin.H{"count": 1})
  })

  r.GET("/get", func(c *gin.Context) {
    session := sessions.Default(c)
    count := session.Get("count")
    c.JSON(http.StatusOK, gin.H{"count": count})
  })

  r.Run(":8080")
}
```

## セッションオプション

`sessions.Options`でセッションの動作を設定します：

```go
session := sessions.Default(c)
session.Options(sessions.Options{
  Path:     "/",
  MaxAge:   3600,        // セッションは1時間で期限切れ（秒）
  HttpOnly: true,        // JavaScriptアクセスを防止
  Secure:   true,        // HTTPS経由でのみ送信
  SameSite: http.SameSiteLaxMode,
})
```

| オプション | 説明 |
|--------|-------------|
| `Path` | Cookieのパススコープ（デフォルト：`/`） |
| `MaxAge` | 有効期間（秒）。削除には`-1`、ブラウザセッションには`0` |
| `HttpOnly` | CookieへのJavaScriptアクセスを防止 |
| `Secure` | HTTPS経由でのみCookieを送信 |
| `SameSite` | クロスサイトのCookie動作を制御（`Lax`、`Strict`、`None`） |

:::note
本番環境ではXSSと中間者攻撃からセッションCookieを保護するため、常に`HttpOnly: true`と`Secure: true`を設定してください。
:::

## 利用可能なバックエンド

| バックエンド | パッケージ | ユースケース |
|---------|---------|----------|
| Cookie | `sessions/cookie` | シンプルなアプリ、小さなセッションデータ |
| Redis | `sessions/redis` | 本番環境、マルチインスタンスデプロイ |
| Memcached | `sessions/memcached` | 高性能キャッシュレイヤー |
| MongoDB | `sessions/mongo` | MongoDBがプライマリデータストアの場合 |
| PostgreSQL | `sessions/postgres` | PostgreSQLがプライマリデータストアの場合 |

## セッション vs JWT

| 側面 | セッション | JWT |
|--------|----------|-----|
| ストレージ | サーバーサイド（Redis、DB） | クライアントサイド（トークン） |
| 失効 | 容易（ストアから削除） | 困難（ブロックリストが必要） |
| スケーラビリティ | 共有ストアが必要 | ステートレス |
| データサイズ | サーバーサイドで無制限 | トークンサイズに制限 |

容易な失効が必要な場合（例：ログアウト、ユーザーBAN）はセッションを使用します。マイクロサービス間でのステートレスな認証が必要な場合はJWTを使用します。

## 関連項目

- [Cookieの処理](/ja/docs/server-config/cookie/)
- [セキュリティのベストプラクティス](/ja/docs/middleware/security-guide/)
- [ミドルウェアの使用](/ja/docs/middleware/using-middleware/)
