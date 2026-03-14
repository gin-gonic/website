---
title: "쿼리 문자열 로깅 방지"
sidebar:
  order: 5
---

쿼리 문자열에는 종종 API 토큰, 비밀번호, 세션 ID 또는 개인 식별 정보(PII)와 같은 민감한 정보가 포함됩니다. 이러한 값을 로깅하면 보안 위험이 발생할 수 있으며 GDPR이나 HIPAA와 같은 개인정보 보호 규정을 위반할 수 있습니다. 로그에서 쿼리 문자열을 제거하면 로그 파일, 모니터링 시스템 또는 오류 보고 도구를 통해 민감한 데이터가 유출될 가능성이 줄어듭니다.

`LoggerConfig`의 `SkipQueryString` 옵션을 사용하여 쿼리 문자열이 로그에 나타나지 않도록 합니다. 활성화하면 `/path?token=secret&user=alice`에 대한 요청이 단순히 `/path`로 로깅됩니다.

```go
func main() {
  router := gin.New()

  // SkipQueryString은 로거가 쿼리 문자열을 로깅하지 않아야 함을 나타냅니다.
  // 예를 들어, /path?q=1은 /path로 로깅됩니다
  loggerConfig := gin.LoggerConfig{SkipQueryString: true}

  router.Use(gin.LoggerWithConfig(loggerConfig))
  router.Use(gin.Recovery())

  router.GET("/search", func(c *gin.Context) {
    q := c.Query("q")
    c.String(200, "searching for: "+q)
  })

  router.Run(":8080")
}
```

`curl`로 차이를 테스트할 수 있습니다:

```bash
curl "http://localhost:8080/search?q=gin&token=secret123"
```

`SkipQueryString` 없이는 로그 항목에 전체 쿼리 문자열이 포함됩니다:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search?q=gin&token=secret123"
```

`SkipQueryString: true`를 사용하면 쿼리 문자열이 제거됩니다:

```
[GIN] 2025/06/01 - 15:04:05 | 200 |     102.4µs |       127.0.0.1 | GET      "/search"
```

이는 로그 출력이 타사 서비스로 전달되거나 장기 저장되는 규정 준수에 민감한 환경에서 특히 유용합니다. 애플리케이션은 `c.Query()`를 통해 쿼리 매개변수에 완전히 접근할 수 있습니다 -- 로그 출력만 영향을 받습니다.
