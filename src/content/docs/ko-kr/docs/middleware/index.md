---
title: "미들웨어"
sidebar:
  order: 6
---

Gin의 미들웨어는 HTTP 요청이 라우트 핸들러에 도달하기 전에 처리하는 방법을 제공합니다. 미들웨어 함수는 라우트 핸들러와 동일한 시그니처(`gin.HandlerFunc`)를 가지며, 일반적으로 `c.Next()`를 호출하여 체인의 다음 핸들러에 제어를 전달합니다.

## 미들웨어 작동 방식

Gin은 미들웨어 실행에 **어니언(양파) 모델**을 사용합니다. 각 미들웨어는 두 단계로 실행됩니다:

1. **핸들러 전** -- `c.Next()` 이전의 코드는 라우트 핸들러 전에 실행됩니다.
2. **핸들러 후** -- `c.Next()` 이후의 코드는 라우트 핸들러가 반환된 후에 실행됩니다.

이는 미들웨어가 양파의 겹처럼 핸들러를 감싸는 것을 의미합니다. 첫 번째로 부착된 미들웨어가 가장 바깥쪽 계층입니다.

```go
func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    start := time.Now()

    // 핸들러 전 단계
    c.Next()

    // 핸들러 후 단계
    latency := time.Since(start)
    log.Printf("Request took %v", latency)
  }
}
```

## 미들웨어 부착

Gin에서 미들웨어를 부착하는 세 가지 방법이 있습니다:

```go
// 1. 전역 -- 모든 라우트에 적용
router := gin.New()
router.Use(Logger(), Recovery())

// 2. 그룹 -- 그룹의 모든 라우트에 적용
v1 := router.Group("/v1")
v1.Use(AuthRequired())
{
  v1.GET("/users", listUsers)
}

// 3. 라우트별 -- 단일 라우트에 적용
router.GET("/benchmark", BenchmarkMiddleware(), benchHandler)
```

더 넓은 범위에서 부착된 미들웨어가 먼저 실행됩니다. 위 예제에서 `GET /v1/users` 요청은 `Logger`, `Recovery`, `AuthRequired`, `listUsers` 순으로 실행됩니다.

## 이 섹션의 내용

- [**미들웨어 사용하기**](./using-middleware/) -- 전역, 그룹 또는 개별 라우트에 미들웨어 부착
- [**커스텀 미들웨어**](./custom-middleware/) -- 자체 미들웨어 함수 작성
- [**BasicAuth 미들웨어 사용하기**](./using-basicauth/) -- HTTP Basic 인증
- [**미들웨어 내 고루틴**](./goroutines-inside-middleware/) -- 미들웨어에서 안전하게 백그라운드 작업 실행
- [**커스텀 HTTP 설정**](./custom-http-config/) -- 미들웨어에서의 오류 처리 및 복구
- [**보안 헤더**](./security-headers/) -- 일반적인 보안 헤더 설정
