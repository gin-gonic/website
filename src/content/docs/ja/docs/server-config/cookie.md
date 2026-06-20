---
title: "Cookie"
sidebar:
  order: 7
---

Ginはレスポンスとリクエストに対してHTTP Cookieを設定および読み取るためのヘルパーを提供しています。

### `SetCookie`のパラメータ

`c.SetCookie()`のメソッドシグネチャは以下の通りです：

```go
c.SetCookie(name, value string, maxAge int, path, domain string, secure, httpOnly bool)
```

| パラメータ  | 説明 |
|------------|-------------|
| `name`     | Cookie名（キー）。 |
| `value`    | Cookieの値。 |
| `maxAge`   | 有効期間（**秒**）。Cookieを削除するには`-1`、ブラウザを閉じたときに削除するセッションCookieには`0`を設定します。 |
| `path`     | Cookieが有効なURLパス。サイト全体で利用可能にするには`"/"`を使用します。 |
| `domain`   | Cookieがスコープされるドメイン（例：`"example.com"`）。開発中は`"localhost"`を使用します。 |
| `secure`   | `true`の場合、Cookieは**HTTPS**接続経由でのみ送信されます。**本番環境では`true`に設定してください。** |
| `httpOnly` | `true`の場合、クライアントサイドのJavaScript（`document.cookie`）からCookieにアクセスできなくなり、XSS攻撃の防止に役立ちます。**本番環境では`true`に設定してください。** |

:::tip[本番環境の推奨]
本番デプロイでは、クロスサイトリクエストフォージェリ（CSRF）やクロスサイトスクリプティング（XSS）攻撃への露出を最小限にするため、`Secure: true`、`HttpOnly: true`、`SameSite: Strict`（または`Lax`）を設定してください。
:::

### Cookieの設定と取得

```go
import (
  "fmt"

  "github.com/gin-gonic/gin"
)

func main() {

  router := gin.Default()

  router.GET("/cookie", func(c *gin.Context) {

    cookie, err := c.Cookie("gin_cookie")

    if err != nil {
      cookie = "NotSet"
      c.SetCookie("gin_cookie", "test", 3600, "/", "localhost", false, true)
    }

    fmt.Printf("Cookie value: %s \n", cookie)
  })

  router.Run()
}
```

### テスト

```bash
# 最初のリクエスト -- Cookieなし、サーバーが設定
curl -v http://localhost:8080/cookie
# レスポンスヘッダーの "Set-Cookie: gin_cookie=test" を確認

# 2回目のリクエスト -- Cookieを返送
curl -v --cookie "gin_cookie=test" http://localhost:8080/cookie
# サーバーログ: Cookie value: test
```

### Cookieの削除

max ageを`-1`に設定してCookieを削除します。

```go
c.SetCookie("gin_cookie", "test", -1, "/", "localhost", false, true)
```

### http.CookieによるCookie設定（v1.11以降）

Ginは`*http.Cookie`を使用したCookie設定もサポートしており、`Expires`、`MaxAge`、`SameSite`、`Partitioned`などのフィールドにアクセスできます。

```go
import (
  "net/http"
  "time"
  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()
  r.GET("/set-cookie", func(c *gin.Context) {
    c.SetCookieData(&http.Cookie{
      Name:   "session_id",
      Value:  "abc123",
      Path:   "/",
      Domain:   "localhost",
      Expires:  time.Now().Add(24 * time.Hour),
      MaxAge:   86400,
      Secure:   true,
      HttpOnly: true,
      SameSite: http.SameSiteLaxMode,
      // Partitioned: true, // Go 1.22+
    })
    c.String(http.StatusOK, "ok")
  })
  r.Run(":8080")
}
```

## 関連項目

- [セキュリティヘッダー](/ja/docs/middleware/security-headers/)
