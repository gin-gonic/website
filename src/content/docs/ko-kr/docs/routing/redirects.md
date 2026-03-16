---
title: "리다이렉트"
sidebar:
  order: 9
---

Gin은 HTTP 리다이렉트(클라이언트를 다른 URL로 보내기)와 라우터 리다이렉트(클라이언트 왕복 없이 내부적으로 요청을 다른 핸들러로 전달)를 모두 지원합니다.

## HTTP 리다이렉트

적절한 HTTP 상태 코드와 함께 `c.Redirect`를 사용하여 클라이언트를 리다이렉트합니다:

- **301 (`http.StatusMovedPermanently`)** -- 리소스가 영구적으로 이동했습니다. 브라우저와 검색 엔진이 캐시를 업데이트합니다.
- **302 (`http.StatusFound`)** -- 임시 리다이렉트. 브라우저가 따라가지만 새 URL을 캐시하지 않습니다.
- **307 (`http.StatusTemporaryRedirect`)** -- 302와 유사하지만 브라우저가 원래 HTTP 메서드를 유지해야 합니다(POST 리다이렉트에 유용).
- **308 (`http.StatusPermanentRedirect`)** -- 301과 유사하지만 브라우저가 원래 HTTP 메서드를 유지해야 합니다.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // External redirect (GET)
  router.GET("/old", func(c *gin.Context) {
    c.Redirect(http.StatusMovedPermanently, "https://www.google.com/")
  })

  // Redirect from POST -- use 302 or 307 to preserve behavior
  router.POST("/submit", func(c *gin.Context) {
    c.Redirect(http.StatusFound, "/result")
  })

  // Internal router redirect (no HTTP round-trip)
  router.GET("/test", func(c *gin.Context) {
    c.Request.URL.Path = "/final"
    router.HandleContext(c)
  })

  router.GET("/final", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"hello": "world"})
  })

  router.GET("/result", func(c *gin.Context) {
    c.String(http.StatusOK, "Redirected here!")
  })

  router.Run(":8080")
}
```

## 테스트

```sh
# GET redirect -- follows to Google (use -L to follow, -I to see headers only)
curl -I http://localhost:8080/old
# Output includes: HTTP/1.1 301 Moved Permanently
# Output includes: Location: https://www.google.com/

# POST redirect -- returns 302 with new location
curl -X POST -I http://localhost:8080/submit
# Output includes: HTTP/1.1 302 Found
# Output includes: Location: /result

# Internal redirect -- handled server-side, client sees final response
curl http://localhost:8080/test
# Output: {"hello":"world"}
```

:::caution
POST 핸들러에서 리다이렉트할 때 `301` 대신 `302` 또는 `307`을 사용하세요. `301` 리다이렉트는 일부 브라우저가 메서드를 POST에서 GET으로 변경하게 할 수 있으며, 이로 인해 예상치 못한 동작이 발생할 수 있습니다.
:::

:::tip
`router.HandleContext(c)`를 통한 내부 리다이렉트는 클라이언트에 리다이렉트 응답을 보내지 않습니다. 요청은 서버 내에서 재라우팅되므로 더 빠르고 클라이언트에게 보이지 않습니다.
:::

## 참고

- [라우트 그룹화](/ko-kr/docs/routing/grouping-routes/)
