---
title: "BasicAuth ミドルウェアを使う"
draft: false
---

```go
// 秘匿されたデータをシミュレートする
var secrets = gin.H{
	"foo":    gin.H{"email": "foo@bar.com", "phone": "123433"},
	"austin": gin.H{"email": "austin@example.com", "phone": "666"},
	"lena":   gin.H{"email": "lena@guapa.com", "phone": "523443"},
}

func main() {
	r := gin.Default()

	// gin.BasicAuth() ミドルウェアを使用したグループ
	// gin.Accounts は map[string]string へのショートカットです。
	authorized := r.Group("/admin", gin.BasicAuth(gin.Accounts{
		"foo":    "bar",
		"austin": "1234",
		"lena":   "hello2",
		"manu":   "4321",
	}))

	// /admin/secrets エンドポイントは localhost:8080/admin/secrets です。
	authorized.GET("/secrets", func(c *gin.Context) {
		// BasicAuth ミドルウェアで設定されたユーザー名にアクセスします。
		user := c.MustGet(gin.AuthUserKey).(string)
		if secret, ok := secrets[user]; ok {
			c.JSON(http.StatusOK, gin.H{"user": user, "secret": secret})
		} else {
			c.JSON(http.StatusOK, gin.H{"user": user, "secret": "NO SECRET :("})
		}
	})

	// 0.0.0.0:8080 でサーバーを立てます。
	r.Run(":8080")
}
```


