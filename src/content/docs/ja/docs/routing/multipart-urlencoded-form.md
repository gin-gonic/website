---
title: "Multipart/URLエンコードフォーム"
sidebar:
  order: 4
---

`c.PostForm()` と `c.DefaultPostForm()` を使用して、フォーム送信から値を読み取ります。これらのメソッドは、`application/x-www-form-urlencoded` と `multipart/form-data` の両方のコンテンツタイプで動作します。これらはブラウザがフォームデータを送信する2つの標準的な方法です。

- `c.PostForm("field")` はフィールドの値を返します。フィールドが存在しない場合は空文字列を返します。
- `c.DefaultPostForm("field", "fallback")` はフィールドの値を返します。フィールドが存在しない場合は指定されたデフォルト値を返します。

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.POST("/form_post", func(c *gin.Context) {
    message := c.PostForm("message")
    nick := c.DefaultPostForm("nick", "anonymous")

    c.JSON(200, gin.H{
      "status":  "posted",
      "message": message,
      "nick":    nick,
    })
  })
  router.Run(":8080")
}
```

## テスト

```sh
# URL-encoded form
curl -X POST http://localhost:8080/form_post \
  -d "message=hello&nick=world"
# Output: {"message":"hello","nick":"world","status":"posted"}

# Multipart form
curl -X POST http://localhost:8080/form_post \
  -F "message=hello" -F "nick=world"
# Output: {"message":"hello","nick":"world","status":"posted"}

# Missing nick -- falls back to default "anonymous"
curl -X POST http://localhost:8080/form_post \
  -d "message=hello"
# Output: {"message":"hello","nick":"anonymous","status":"posted"}
```

## 関連項目

- [ファイルアップロード](/ja/docs/routing/upload-file/)
- [クエリとポストフォーム](/ja/docs/routing/query-and-post-form/)
