---
title: "Multipart/URL 인코딩 폼"
sidebar:
  order: 4
---

`c.PostForm()`과 `c.DefaultPostForm()`을 사용하여 폼 제출에서 값을 읽습니다. 이 메서드들은 `application/x-www-form-urlencoded`와 `multipart/form-data` 컨텐츠 타입 모두에서 작동합니다 -- 브라우저가 폼 데이터를 제출하는 두 가지 표준 방식입니다.

- `c.PostForm("field")`는 값을 반환하며, 필드가 없으면 빈 문자열을 반환합니다.
- `c.DefaultPostForm("field", "fallback")`는 값을 반환하며, 필드가 없으면 지정된 기본값을 반환합니다.

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

### 테스트하기

```sh
# URL 인코딩 폼
curl -X POST http://localhost:8080/form_post \
  -d "message=hello&nick=world"

# Multipart 폼
curl -X POST http://localhost:8080/form_post \
  -F "message=hello" -F "nick=world"
```

## 참고

- [파일 업로드](/ko-kr/docs/routing/upload-file/)
- [쿼리와 POST 폼](/ko-kr/docs/routing/query-and-post-form/)
