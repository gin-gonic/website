---
title: "HTTP 메서드 사용"
sidebar:
  order: 1
---

Gin은 HTTP 동사에 직접 매핑되는 메서드를 제공하여 RESTful API를 간편하게 구축할 수 있습니다. 각 메서드는 해당 HTTP 요청 유형에만 응답하는 라우트를 등록합니다:

| 메서드      | 일반적인 REST 용도                    |
| ----------- | ----------------------------------- |
| **GET**     | 리소스 조회                          |
| **POST**    | 새 리소스 생성                       |
| **PUT**     | 기존 리소스 교체                     |
| **PATCH**   | 기존 리소스 부분 수정                |
| **DELETE**  | 리소스 삭제                          |
| **HEAD**    | GET과 동일하지만 바디 없음            |
| **OPTIONS** | 통신 옵션 설명                       |

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func getting(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "GET"})
}

func posting(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "POST"})
}

func putting(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "PUT"})
}

func deleting(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "DELETE"})
}

func patching(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"method": "PATCH"})
}

func head(c *gin.Context) {
	c.Status(http.StatusOK)
}

func options(c *gin.Context) {
	c.Status(http.StatusOK)
}

func main() {
	// 기본 미들웨어로 gin 라우터를 생성합니다:
	// 로거 및 복구(크래시 방지) 미들웨어
	router := gin.Default()

	router.GET("/someGet", getting)
	router.POST("/somePost", posting)
	router.PUT("/somePut", putting)
	router.DELETE("/someDelete", deleting)
	router.PATCH("/somePatch", patching)
	router.HEAD("/someHead", head)
	router.OPTIONS("/someOptions", options)

	// 기본적으로 :8080에서 서비스합니다.
	// PORT 환경 변수가 정의되어 있으면 해당 포트를 사용합니다.
	router.Run()
	// router.Run(":3000") 포트를 직접 지정할 경우
}
```

### curl로 테스트하기

서버가 실행되면 각 엔드포인트를 테스트할 수 있습니다:

```sh
# GET 요청
curl -X GET http://localhost:8080/someGet

# POST 요청
curl -X POST http://localhost:8080/somePost

# PUT 요청
curl -X PUT http://localhost:8080/somePut

# DELETE 요청
curl -X DELETE http://localhost:8080/someDelete

# PATCH 요청
curl -X PATCH http://localhost:8080/somePatch

# HEAD 요청 (헤더만 반환, 바디 없음)
curl -I http://localhost:8080/someHead

# OPTIONS 요청
curl -X OPTIONS http://localhost:8080/someOptions
```

## 참고

- [경로의 매개변수](/ko-kr/docs/routing/param-in-path/)
- [라우트 그룹화](/ko-kr/docs/routing/grouping-routes/)
- [쿼리 문자열 매개변수](/ko-kr/docs/routing/querystring-param/)
