---
title: "セキュリティヘッダー"
sidebar:
  order: 7
---

Webアプリケーションを一般的なセキュリティ脆弱性から保護するためにセキュリティヘッダーを使用することは重要です。この例では、Ginアプリケーションにセキュリティヘッダーを追加する方法と、Host Header Injection関連の攻撃（SSRF、オープンリダイレクション）を回避する方法を示します。

### 各ヘッダーの保護対象

| ヘッダー | 目的 |
|--------|---------|
| `X-Content-Type-Options: nosniff` | MIMEタイプスニッフィング攻撃を防止します。このヘッダーがないと、ブラウザは宣言されたものとは異なるコンテンツタイプとしてファイルを解釈する可能性があり、攻撃者が無害なファイルタイプに偽装した悪意のあるスクリプトを実行できます（例：実際にはJavaScriptである`.jpg`のアップロード）。 |
| `X-Frame-Options: DENY` | ページが`<iframe>`内に読み込まれるのを無効にすることでクリックジャッキングを防止します。攻撃者はクリックジャッキングを使用して正規のページに透明なフレームを重ね、ユーザーに隠しボタン（例：「アカウントを削除」）をクリックさせます。 |
| `Content-Security-Policy` | ブラウザがどのリソース（スクリプト、スタイル、画像、フォントなど）をどのオリジンから読み込むことを許可するかを制御します。インラインスクリプトをブロックしスクリプトソースを制限できるため、クロスサイトスクリプティング（XSS）に対する最も効果的な防御の一つです。 |
| `X-XSS-Protection: 1; mode=block` | ブラウザの組み込みXSSフィルターを有効にします。このヘッダーはモダンブラウザでは主に非推奨です（Chrome は2019年にXSS Auditorを削除しました）が、古いブラウザのユーザーに対して多層防御を提供します。 |
| `Strict-Transport-Security` | 指定された`max-age`期間中、ドメインへのすべてのリクエストにHTTPSを使用することをブラウザに強制します。プロトコルダウングレード攻撃や安全でないHTTP接続でのCookieハイジャックを防止します。`includeSubDomains`ディレクティブはすべてのサブドメインにこの保護を拡張します。 |
| `Referrer-Policy: strict-origin` | 送信リクエストとともにどれだけのリファラー情報を送信するかを制御します。このヘッダーがないと、トークンや機密データを含む可能性のあるクエリパラメータを含む完全なURLがサードパーティサイトに漏洩する可能性があります。`strict-origin`はオリジン（ドメイン）のみをHTTPS経由でのみ送信します。 |
| `Permissions-Policy` | ページで使用できるブラウザ機能（位置情報、カメラ、マイクなど）を制限します。攻撃者がスクリプトを注入できた場合の被害を限定します。注入されたスクリプトは機密なデバイスAPIにアクセスできなくなります。 |

### 例

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()

  expectedHost := "localhost:8080"

  // セキュリティヘッダーの設定
  r.Use(func(c *gin.Context) {
    if c.Request.Host != expectedHost {
      c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid host header"})
      return
    }
    c.Header("X-Frame-Options", "DENY")
    c.Header("Content-Security-Policy", "default-src 'self'; connect-src *; font-src *; script-src-elem * 'unsafe-inline'; img-src * data:; style-src * 'unsafe-inline';")
    c.Header("X-XSS-Protection", "1; mode=block")
    c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    c.Header("Referrer-Policy", "strict-origin")
    c.Header("X-Content-Type-Options", "nosniff")
    c.Header("Permissions-Policy", "geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()")
    c.Next()
  })

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })

  r.Run() // 0.0.0.0:8080でリッスンしてサーブ
}
```

`curl`でテストできます：

```bash
// ヘッダーの確認

curl localhost:8080/ping -I

HTTP/1.1 404 Not Found
Content-Security-Policy: default-src 'self'; connect-src *; font-src *; script-src-elem * 'unsafe-inline'; img-src * data:; style-src * 'unsafe-inline';
Content-Type: text/plain
Permissions-Policy: geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()
Referrer-Policy: strict-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-Xss-Protection: 1; mode=block
Date: Sat, 30 Mar 2024 08:20:44 GMT
Content-Length: 18

// Host Header Injectionの確認

curl localhost:8080/ping -I -H "Host:neti.ee"

HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Date: Sat, 30 Mar 2024 08:21:09 GMT
Content-Length: 31
```

オプションで、[gin helmet](https://github.com/danielkov/gin-helmet)を使用できます。`go get github.com/danielkov/gin-helmet/ginhelmet`

```go
package main

import (
  "github.com/gin-gonic/gin"
  "github.com/danielkov/gin-helmet/ginhelmet"
)

func main() {
  r := gin.Default()

  // デフォルトのセキュリティヘッダーを使用
  r.Use(ginhelmet.Default())

  r.GET("/", func(c *gin.Context) {
    c.JSON(200, gin.H{"message": "Hello, World!"})
  })

  r.Run()
}
```
