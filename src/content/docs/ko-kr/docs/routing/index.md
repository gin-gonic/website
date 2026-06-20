---
title: "라우팅"
sidebar:
  order: 3
---

Gin은 고성능 URL 매칭을 위해 [httprouter](https://github.com/julienschmidt/httprouter)를 기반으로 구축된 강력한 라우팅 시스템을 제공합니다. 내부적으로 httprouter는 라우트를 저장하고 조회하기 위해 [기수 트리](https://en.wikipedia.org/wiki/Radix_tree)(압축 트라이라고도 함)를 사용하므로, 라우트 매칭이 극도로 빠르고 조회당 메모리 할당이 전혀 필요하지 않습니다. 이것이 Gin을 사용 가능한 가장 빠른 Go 웹 프레임워크 중 하나로 만듭니다.

라우트는 엔진(또는 라우트 그룹)에서 HTTP 메서드를 호출하고 URL 패턴과 하나 이상의 핸들러 함수를 제공하여 등록합니다:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/hello", func(c *gin.Context) {
    c.String(http.StatusOK, "Hello, World!")
  })

  router.POST("/users", func(c *gin.Context) {
    name := c.PostForm("name")
    c.JSON(http.StatusCreated, gin.H{"user": name})
  })

  router.Run(":8080")
}
```

## 이 섹션의 내용

아래 페이지에서 각 라우팅 주제를 자세히 다룹니다:

- [**HTTP 메서드 사용**](./http-method/) -- GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS에 대한 라우트를 등록합니다.
- [**경로의 매개변수**](./param-in-path/) -- URL 경로에서 동적 세그먼트를 캡처합니다 (예: `/user/:name`).
- [**쿼리스트링 매개변수**](./querystring-param/) -- 요청 URL에서 쿼리 문자열 값을 읽습니다.
- [**쿼리와 POST 폼**](./query-and-post-form/) -- 같은 핸들러에서 쿼리 문자열과 POST 폼 데이터에 모두 접근합니다.
- [**맵을 쿼리스트링 또는 POST 폼으로**](./map-as-querystring-or-postform/) -- 쿼리 문자열이나 POST 폼에서 맵 매개변수를 바인딩합니다.
- [**Multipart/URL 인코딩 폼**](./multipart-urlencoded-form/) -- `multipart/form-data`와 `application/x-www-form-urlencoded` 바디를 파싱합니다.
- [**파일 업로드**](./upload-file/) -- 단일 및 다중 파일 업로드를 처리합니다.
- [**라우트 그룹화**](./grouping-routes/) -- 공유 미들웨어와 함께 공통 접두사 아래에 라우트를 구성합니다.
- [**리다이렉트**](./redirects/) -- HTTP 및 라우터 수준 리다이렉트를 수행합니다.
