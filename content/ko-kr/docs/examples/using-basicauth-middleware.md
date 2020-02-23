---
title: "기본인증(BasicAuth) 미들웨어 사용하기"
draft: false
---

```go
// 개인정보 샘플 데이터
var secrets = gin.H{
	"foo":    gin.H{"email": "foo@bar.com", "phone": "123433"},
	"austin": gin.H{"email": "austin@example.com", "phone": "666"},
	"lena":   gin.H{"email": "lena@guapa.com", "phone": "523443"},
}

func main() {
	r := gin.Default()

	// gin.BasicAuth() 미들웨어를 사용하여 그룹화 하기
	// gin.Accounts는 map[string]string 타입입니다.
	authorized := r.Group("/admin", gin.BasicAuth(gin.Accounts{
		"foo":    "bar",
		"austin": "1234",
		"lena":   "hello2",
		"manu":   "4321",
	}))

	// 엔드포인트 /admin/secrets
	// "localhost:8080/admin/secrets"로 접근합니다.
	authorized.GET("/secrets", func(c *gin.Context) {
		// BasicAuth 미들웨어를 통해 유저를 설정합니다.
		user := c.MustGet(gin.AuthUserKey).(string)
		if secret, ok := secrets[user]; ok {
			c.JSON(http.StatusOK, gin.H{"user": user, "secret": secret})
		} else {
			c.JSON(http.StatusOK, gin.H{"user": user, "secret": "NO SECRET :("})
		}
	})

	// 서버가 실행 되고 0.0.0.0:8080 에서 요청을 기다립니다.
	r.Run(":8080")
}
```
