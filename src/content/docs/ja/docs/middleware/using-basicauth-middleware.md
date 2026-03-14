---
title: "BasicAuthミドルウェアの使用"
sidebar:
  order: 5
---

Ginには[HTTP基本認証](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#basic_authentication_scheme)を実装する組み込みの`gin.BasicAuth()`ミドルウェアが付属しています。ユーザー名/パスワードのペアの`gin.Accounts`マップ（`map[string]string`のショートカット）を受け取り、適用されたルートグループを保護します。

:::caution[セキュリティ警告]
HTTP基本認証は資格情報を**Base64エンコード**された文字列として送信し、**暗号化されません**。トラフィックを傍受できる人は誰でも資格情報を簡単にデコードできます。本番環境でBasicAuthを使用する際は、常に**HTTPS**（TLS）を使用してください。
:::

:::note[本番環境の資格情報]
以下の例ではシンプルさのためにユーザー名とパスワードをハードコードしています。実際のアプリケーションでは、環境変数、シークレットマネージャー（例：HashiCorp Vault、AWS Secrets Manager）、または適切にハッシュ化されたパスワードを持つデータベースなどの安全なソースから資格情報をロードしてください。プレーンテキストの資格情報をバージョン管理にコミットしないでください。
:::

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

// プライベートデータのシミュレーション
var secrets = gin.H{
  "foo":    gin.H{"email": "foo@bar.com", "phone": "123433"},
  "austin": gin.H{"email": "austin@example.com", "phone": "666"},
  "lena":   gin.H{"email": "lena@guapa.com", "phone": "523443"},
}

func main() {
  router := gin.Default()

  // gin.BasicAuth()ミドルウェアを使用したグループ
  // gin.Accountsはmap[string]stringのショートカット
  authorized := router.Group("/admin", gin.BasicAuth(gin.Accounts{
    "foo":    "bar",
    "austin": "1234",
    "lena":   "hello2",
    "manu":   "4321",
  }))

  // /admin/secretsエンドポイント
  // "localhost:8080/admin/secrets"にアクセス
  authorized.GET("/secrets", func(c *gin.Context) {
    // ユーザーを取得、BasicAuthミドルウェアによって設定されています
    user := c.MustGet(gin.AuthUserKey).(string)
    if secret, ok := secrets[user]; ok {
      c.JSON(http.StatusOK, gin.H{"user": user, "secret": secret})
    } else {
      c.JSON(http.StatusOK, gin.H{"user": user, "secret": "NO SECRET :("})
    }
  })

  // 0.0.0.0:8080でリッスンしてサーブ
  router.Run(":8080")
}
```

### テスト

curlの`-u`フラグを使用して基本認証の資格情報を提供します：

```bash
# 認証成功
curl -u foo:bar http://localhost:8080/admin/secrets
# => {"secret":{"email":"foo@bar.com","phone":"123433"},"user":"foo"}

# パスワード不正 -- 401 Unauthorizedを返す
curl -u foo:wrongpassword http://localhost:8080/admin/secrets

# 資格情報なし -- 401 Unauthorizedを返す
curl http://localhost:8080/admin/secrets
```
