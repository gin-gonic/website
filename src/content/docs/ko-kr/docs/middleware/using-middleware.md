---
title: "미들웨어 사용하기"
sidebar:
  order: 2
---

Gin의 미들웨어는 라우트 핸들러 이전(그리고 선택적으로 이후)에 실행되는 함수입니다. 로깅, 인증, 오류 복구, 요청 수정과 같은 횡단 관심사에 사용됩니다.

Gin은 세 가지 수준의 미들웨어 부착을 지원합니다:

- **전역 미들웨어** -- 라우터의 모든 라우트에 적용됩니다. `router.Use()`로 등록합니다. 로깅과 패닉 복구처럼 보편적으로 적용되는 관심사에 적합합니다.
- **그룹 미들웨어** -- 라우트 그룹 내의 모든 라우트에 적용됩니다. `group.Use()`로 등록합니다. 라우트의 부분 집합(예: 모든 `/admin/*` 라우트)에 인증이나 권한 부여를 적용하는 데 유용합니다.
- **라우트별 미들웨어** -- 단일 라우트에만 적용됩니다. `router.GET()`, `router.POST()` 등에 추가 인수로 전달됩니다. 커스텀 속도 제한이나 입력 유효성 검사와 같은 라우트별 로직에 유용합니다.

**실행 순서:** 미들웨어 함수는 등록된 순서대로 실행됩니다. 미들웨어가 `c.Next()`를 호출하면 다음 미들웨어(또는 최종 핸들러)에 제어를 전달하고, `c.Next()`가 반환된 후 실행을 재개합니다. 이는 스택과 같은(LIFO) 패턴을 생성합니다 -- 처음 등록된 미들웨어가 가장 먼저 시작하지만 가장 나중에 완료됩니다. 미들웨어가 `c.Next()`를 호출하지 않으면 후속 미들웨어와 핸들러가 건너뛰어집니다(`c.Abort()`로 단축하는 데 유용).

```go
package main

import (
  "github.com/gin-gonic/gin"
)

func main() {
  // 기본적으로 미들웨어 없이 라우터를 생성합니다
  router := gin.New()

  // 전역 미들웨어
  // Logger 미들웨어는 GIN_MODE=release로 설정해도 gin.DefaultWriter에 로그를 기록합니다.
  // 기본적으로 gin.DefaultWriter = os.Stdout
  router.Use(gin.Logger())

  // Recovery 미들웨어는 모든 패닉에서 복구하고 패닉이 있으면 500을 기록합니다.
  router.Use(gin.Recovery())

  // 라우트별 미들웨어, 원하는 만큼 추가할 수 있습니다.
  router.GET("/benchmark", MyBenchLogger(), benchEndpoint)

  // 인증 그룹
  // authorized := router.Group("/", AuthRequired())
  // 위와 정확히 동일합니다:
  authorized := router.Group("/")
  // 그룹별 미들웨어! 이 경우 커스텀 생성된
  // AuthRequired() 미들웨어를 "authorized" 그룹에서만 사용합니다.
  authorized.Use(AuthRequired())
  {
    authorized.POST("/login", loginEndpoint)
    authorized.POST("/submit", submitEndpoint)
    authorized.POST("/read", readEndpoint)

    // 중첩 그룹
    testing := authorized.Group("testing")
    testing.GET("/analytics", analyticsEndpoint)
  }

  // 0.0.0.0:8080에서 수신 대기 및 서비스
  router.Run(":8080")
}
```

:::note
`gin.Default()`는 `Logger`와 `Recovery` 미들웨어가 이미 부착된 라우터를 생성하는 편의 함수입니다. 미들웨어가 없는 빈 라우터를 원하면 위에 표시된 것처럼 `gin.New()`를 사용하고 필요한 미들웨어만 추가하세요.
:::
