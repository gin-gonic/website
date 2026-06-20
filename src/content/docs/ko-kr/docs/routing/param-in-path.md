---
title: "경로의 매개변수"
sidebar:
  order: 2
---

Gin은 URL에서 직접 값을 캡처할 수 있는 두 가지 유형의 경로 매개변수를 지원합니다:

- **`:name`** -- 단일 경로 세그먼트와 매칭됩니다. 예를 들어, `/user/:name`은 `/user/john`과 매칭되지만 `/user/` 또는 `/user`와는 매칭되지 **않습니다**.
- **`*action`** -- 슬래시를 포함하여 접두사 이후의 모든 것과 매칭됩니다. 예를 들어, `/user/:name/*action`은 `/user/john/send` 및 `/user/john/`과 매칭됩니다. 캡처된 값에는 선행 `/`가 포함됩니다.

핸들러 내에서 경로 매개변수의 값을 가져오려면 `c.Param("name")`을 사용하세요.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // This handler will match /user/john but will not match /user/ or /user
  router.GET("/user/:name", func(c *gin.Context) {
    name := c.Param("name")
    c.String(http.StatusOK, "Hello %s", name)
  })

  // However, this one will match /user/john/ and also /user/john/send
  // If no other routers match /user/john, it will redirect to /user/john/
  router.GET("/user/:name/*action", func(c *gin.Context) {
    name := c.Param("name")
    action := c.Param("action")
    message := name + " is " + action
    c.String(http.StatusOK, message)
  })

  router.Run(":8080")
}
```

## 테스트

```sh
# Single parameter -- matches :name
curl http://localhost:8080/user/john
# Output: Hello john

# Wildcard parameter -- matches :name and *action
curl http://localhost:8080/user/john/send
# Output: john is /send

# Trailing slash is captured by the wildcard
curl http://localhost:8080/user/john/
# Output: john is /
```

:::note
와일드카드 `*action` 값에는 항상 선행 `/`가 포함됩니다. 위 예제에서 `c.Param("action")`은 `send`가 아닌 `/send`를 반환합니다.
:::

:::caution
동일한 경로 깊이에서 충돌하는 `/user/:name`과 `/user/:name/*action`을 모두 정의할 수 없습니다. Gin은 모호한 라우트를 감지하면 시작 시 패닉을 발생시킵니다.
:::

## 참고

- [쿼리 문자열 매개변수](/ko-kr/docs/routing/querystring-param/)
- [쿼리와 POST 폼](/ko-kr/docs/routing/query-and-post-form/)
