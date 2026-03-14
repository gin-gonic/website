---
title: "パス内のパラメータ"
sidebar:
  order: 2
---

```go
func main() {
  router := gin.Default()

  // このハンドラは /user/john にマッチしますが、/user/ や /user にはマッチしません
  router.GET("/user/:name", func(c *gin.Context) {
    name := c.Param("name")
    c.String(http.StatusOK, "Hello %s", name)
  })

  // ただし、こちらは /user/john/ と /user/john/send にマッチします
  // 他のルーターが /user/john にマッチしない場合、/user/john/ にリダイレクトします
  router.GET("/user/:name/*action", func(c *gin.Context) {
    name := c.Param("name")
    action := c.Param("action")
    message := name + " is " + action
    c.String(http.StatusOK, message)
  })

  router.Run(":8080")
}
```

## 関連項目

- [クエリ文字列パラメータ](/ja/docs/routing/querystring-param/)
