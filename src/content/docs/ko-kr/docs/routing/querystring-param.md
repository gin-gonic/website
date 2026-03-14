---
title: "쿼리 문자열 매개변수"
sidebar:
  order: 3
---

쿼리 문자열 매개변수는 URL에서 `?` 뒤에 오는 키-값 쌍입니다 (예: `/search?q=gin&page=2`). Gin은 이를 읽기 위한 두 가지 메서드를 제공합니다:

- `c.Query("key")`는 쿼리 매개변수의 값을 반환하며, 키가 없으면 **빈 문자열**을 반환합니다.
- `c.DefaultQuery("key", "default")`는 값을 반환하며, 키가 없으면 지정된 **기본값**을 반환합니다.

두 메서드 모두 `c.Request.URL.Query()`에 접근하는 단축 방법으로, 보일러플레이트 코드를 줄여줍니다.

```go
func main() {
  router := gin.Default()

  // 쿼리 문자열 매개변수는 기존 요청 객체를 사용하여 파싱됩니다.
  // 요청은 다음 URL에 매칭됩니다: /welcome?firstname=Jane&lastname=Doe
  router.GET("/welcome", func(c *gin.Context) {
    firstname := c.DefaultQuery("firstname", "Guest")
    lastname := c.Query("lastname") // c.Request.URL.Query().Get("lastname")의 단축

    c.String(http.StatusOK, "Hello %s %s", firstname, lastname)
  })
  router.Run(":8080")
}
```

### 테스트하기

```sh
# 두 매개변수 모두 제공
curl "http://localhost:8080/welcome?firstname=Jane&lastname=Doe"
# 출력: Hello Jane Doe

# firstname 누락 -- 기본값 "Guest" 사용
curl "http://localhost:8080/welcome?lastname=Doe"
# 출력: Hello Guest Doe

# 매개변수 없음
curl "http://localhost:8080/welcome"
# 출력: Hello Guest
```

## 참고

- [경로의 매개변수](/ko-kr/docs/routing/param-in-path/)
