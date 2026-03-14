---
title: "오류 처리 미들웨어"
sidebar:
  order: 4
---

일반적인 RESTful 애플리케이션에서는 다음과 같은 모든 라우트에서 오류를 만날 수 있습니다:

- 사용자의 잘못된 입력
- 데이터베이스 장애
- 인증되지 않은 접근
- 내부 서버 버그

기본적으로 Gin은 `c.Error(err)`를 사용하여 각 라우트에서 수동으로 오류를 처리할 수 있도록 합니다.
하지만 이는 빠르게 반복적이고 일관성 없어질 수 있습니다.

이를 해결하기 위해 커스텀 미들웨어를 사용하여 한 곳에서 모든 오류를 처리할 수 있습니다.
이 미들웨어는 각 요청 후에 실행되며 Gin 컨텍스트(`c.Errors`)에 추가된 오류를 확인합니다.
오류를 찾으면 적절한 상태 코드와 함께 구조화된 JSON 응답을 보냅니다.

#### 예제

```go
import (
  "errors"
  "net/http"
  "github.com/gin-gonic/gin"
)

// ErrorHandler는 오류를 캡처하고 일관된 JSON 오류 응답을 반환합니다
func ErrorHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next() // 1단계: 먼저 요청을 처리합니다.

        // 2단계: 컨텍스트에 오류가 추가되었는지 확인
        if len(c.Errors) > 0 {
            // 3단계: 마지막 오류를 사용
            err := c.Errors.Last().Err

            // 4단계: 일반적인 오류 메시지로 응답
            c.JSON(http.StatusInternalServerError, map[string]any{
                "success": false,
                "message": err.Error(),
            })
        }

        // 오류가 없으면 다른 단계 수행
    }
}

func main() {
    r := gin.Default()

    // 오류 처리 미들웨어 부착
    r.Use(ErrorHandler())

    r.GET("/ok", func(c *gin.Context) {
        somethingWentWrong := false

        if somethingWentWrong {
            c.Error(errors.New("something went wrong"))
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "message": "Everything is fine!",
        })
    })

    r.GET("/error", func(c *gin.Context) {
        somethingWentWrong := true

        if somethingWentWrong {
            c.Error(errors.New("something went wrong"))
            return
        }

        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "message": "Everything is fine!",
        })
    })

    r.Run()
}

```

#### 확장

- 오류를 상태 코드에 매핑
- 오류 코드에 따라 다른 오류 응답 생성
- 오류 로깅

#### 오류 처리 미들웨어의 이점

- **일관성**: 모든 오류가 동일한 형식을 따릅니다
- **깔끔한 라우트**: 비즈니스 로직이 오류 포맷팅과 분리됩니다
- **중복 감소**: 모든 핸들러에서 오류 처리 로직을 반복할 필요가 없습니다
