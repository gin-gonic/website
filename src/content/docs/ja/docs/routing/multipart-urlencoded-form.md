---
title: "Multipart/URLエンコードフォーム"
sidebar:
  order: 4
---

`c.PostForm()`と`c.DefaultPostForm()`を使用してフォーム送信から値を読み取ります。これらのメソッドは`application/x-www-form-urlencoded`と`multipart/form-data`の両方のコンテンツタイプで動作します。これらはブラウザがフォームデータを送信する2つの標準的な方法です。

- `c.PostForm("field")`は値を返します。フィールドがない場合は空文字列を返します。
- `c.DefaultPostForm("field", "fallback")`は値を返します。フィールドがない場合は指定されたデフォルト値を返します。

```go
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

### テスト方法

```sh
# URLエンコードフォーム
curl -X POST http://localhost:8080/form_post \
  -d "message=hello&nick=world"

# Multipartフォーム
curl -X POST http://localhost:8080/form_post \
  -F "message=hello" -F "nick=world"
```

## 関連項目

- [ファイルアップロード](/ja/docs/routing/upload-file/)
- [クエリとポストフォーム](/ja/docs/routing/query-and-post-form/)
