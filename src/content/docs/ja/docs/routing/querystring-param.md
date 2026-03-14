---
title: "クエリ文字列パラメータ"
sidebar:
  order: 3
---

クエリ文字列パラメータは、URL内の`?`の後に表示されるキーと値のペアです（例：`/search?q=gin&page=2`）。Ginはそれらを読み取るための2つのメソッドを提供しています：

- `c.Query("key")`はクエリパラメータの値を返します。キーが存在しない場合は**空文字列**を返します。
- `c.DefaultQuery("key", "default")`は値を返します。キーが存在しない場合は指定された**デフォルト値**を返します。

どちらのメソッドも`c.Request.URL.Query()`にアクセスするためのショートカットで、ボイラープレートコードを削減できます。

```go
func main() {
  router := gin.Default()

  // クエリ文字列パラメータは既存のリクエストオブジェクトを使用してパースされます。
  // リクエストは次のURLにマッチします：/welcome?firstname=Jane&lastname=Doe
  router.GET("/welcome", func(c *gin.Context) {
    firstname := c.DefaultQuery("firstname", "Guest")
    lastname := c.Query("lastname") // c.Request.URL.Query().Get("lastname") のショートカット

    c.String(http.StatusOK, "Hello %s %s", firstname, lastname)
  })
  router.Run(":8080")
}
```

### テスト方法

```sh
# 両方のパラメータを指定
curl "http://localhost:8080/welcome?firstname=Jane&lastname=Doe"
# 出力: Hello Jane Doe

# firstnameなし -- デフォルト値 "Guest" を使用
curl "http://localhost:8080/welcome?lastname=Doe"
# 出力: Hello Guest Doe

# パラメータなし
curl "http://localhost:8080/welcome"
# 出力: Hello Guest
```

## 関連項目

- [パス内のパラメータ](/ja/docs/routing/param-in-path/)
