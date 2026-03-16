---
title: "Let's Encryptサポート"
sidebar:
  order: 3
---

[gin-gonic/autotls](https://github.com/gin-gonic/autotls) パッケージは、Let's Encryptによる自動HTTPSを提供します。証明書の発行と更新を自動的に処理するため、最小限の設定でHTTPSを提供できます。

## クイックスタート

最も簡単な方法は、ルーターと1つ以上のドメイン名を指定して `autotls.Run` を呼び出すことです：

```go
package main

import (
  "log"

  "github.com/gin-gonic/autotls"
  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(200, "pong")
  })

  log.Fatal(autotls.Run(router, "example1.com", "example2.com"))
}
```

## カスタム自動証明書マネージャー

証明書キャッシュディレクトリの指定や許可するホスト名の制限など、より詳細な制御が必要な場合は、カスタム `autocert.Manager` を使用して `autotls.RunWithManager` を呼び出します：

```go
package main

import (
  "log"

  "github.com/gin-gonic/autotls"
  "github.com/gin-gonic/gin"
  "golang.org/x/crypto/acme/autocert"
)

func main() {
  router := gin.Default()

  router.GET("/ping", func(c *gin.Context) {
    c.String(200, "pong")
  })

  m := autocert.Manager{
    Prompt:     autocert.AcceptTOS,
    HostPolicy: autocert.HostWhitelist("example1.com", "example2.com"),
    Cache:      autocert.DirCache("/var/www/.cache"),
  }

  log.Fatal(autotls.RunWithManager(router, &m))
}
```

:::note
Let's Encryptは、サーバーがパブリックインターネットからポート80と443でアクセス可能であることを要求します。これはlocalhostや、インバウンド接続をブロックするファイアウォールの背後では動作しません。
:::

## 関連項目

- [カスタムHTTP設定](/ja/docs/server-config/custom-http-config/)
