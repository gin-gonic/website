---
title: "쿼리와 POST 폼"
sidebar:
  order: 5
---

`POST` 요청을 처리할 때 URL 쿼리 문자열과 요청 바디 모두에서 값을 읽어야 하는 경우가 많습니다. Gin은 이 두 소스를 분리하여 각각 독립적으로 접근할 수 있습니다:

- `c.Query("key")` / `c.DefaultQuery("key", "default")` -- URL 쿼리 문자열에서 읽습니다.
- `c.PostForm("key")` / `c.DefaultPostForm("key", "default")` -- `application/x-www-form-urlencoded` 또는 `multipart/form-data` 요청 바디에서 읽습니다.

이는 라우트가 쿼리 매개변수(예: `id`)로 리소스를 식별하고 바디가 페이로드(예: `name`과 `message`)를 전달하는 REST API에서 일반적입니다.

```go
package main

import (
  "fmt"
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.POST("/post", func(c *gin.Context) {
    id := c.Query("id")
    page := c.DefaultQuery("page", "0")
    name := c.PostForm("name")
    message := c.PostForm("message")

    fmt.Printf("id: %s; page: %s; name: %s; message: %s\n", id, page, name, message)
    c.String(http.StatusOK, "id: %s; page: %s; name: %s; message: %s", id, page, name, message)
  })

  router.Run(":8080")
}
```

## 테스트

```sh
# Query params in URL, form data in body
curl -X POST "http://localhost:8080/post?id=1234&page=1" \
  -d "name=manu&message=this_is_great"
# Output: id: 1234; page: 1; name: manu; message: this_is_great

# Missing page -- falls back to default value "0"
curl -X POST "http://localhost:8080/post?id=1234" \
  -d "name=manu&message=hello"
# Output: id: 1234; page: 0; name: manu; message: hello
```

:::note
`c.Query`는 URL 쿼리 문자열에서만 읽고, `c.PostForm`은 요청 바디에서만 읽습니다. 서로 교차하지 않습니다. Gin이 두 소스를 자동으로 확인하게 하려면 구조체와 함께 `c.ShouldBind`를 사용하세요.
:::

## 참고

- [쿼리 문자열 매개변수](/ko-kr/docs/routing/querystring-param/)
- [맵을 쿼리스트링 또는 POST 폼 매개변수로 사용](/ko-kr/docs/routing/map-as-querystring-or-postform/)
- [Multipart/URL 인코딩 폼](/ko-kr/docs/routing/multipart-urlencoded-form/)
