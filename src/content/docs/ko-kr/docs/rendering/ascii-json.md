---
title: "AsciiJSON"
sidebar:
  order: 4
---

`AsciiJSON`은 데이터를 JSON으로 직렬화하지만 모든 비ASCII 문자를 `\uXXXX` 유니코드 이스케이프 시퀀스로 이스케이프합니다. `<`와 `>` 같은 HTML 특수 문자도 이스케이프됩니다. 결과적으로 응답 바디에는 7비트 ASCII 문자만 포함됩니다.

**AsciiJSON 사용 시기:**

- API 소비자가 엄격하게 ASCII 안전한 응답을 요구할 때 (예: UTF-8 인코딩된 바이트를 처리할 수 없는 시스템).
- 특정 로깅 시스템이나 레거시 전송과 같이 ASCII만 지원하는 컨텍스트에 JSON을 포함해야 할 때.
- JSON이 HTML에 포함될 때 인젝션 문제를 방지하기 위해 `<`, `>`, `&` 같은 문자가 이스케이프되도록 하고 싶을 때.

대부분의 현대 API에서는 유효한 UTF-8을 출력하는 표준 `c.JSON()`으로 충분합니다. ASCII 안전성이 특정 요구 사항인 경우에만 `AsciiJSON`을 사용하세요.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/someJSON", func(c *gin.Context) {
    data := map[string]interface{}{
      "lang": "GO语言",
      "tag":  "<br>",
    }

    // 출력: {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
    c.AsciiJSON(http.StatusOK, data)
  })

  // 0.0.0.0:8080에서 수신 대기 및 서비스
  router.Run(":8080")
}
```

curl로 이 엔드포인트를 테스트할 수 있습니다:

```bash
curl http://localhost:8080/someJSON
# 출력: {"lang":"GO\u8bed\u8a00","tag":"\u003cbr\u003e"}
```

중국어 문자 `语言`이 `\u8bed\u8a00`으로 대체되고, `<br>` 태그는 `\u003cbr\u003e`가 됩니다. 응답 바디는 모든 ASCII 전용 환경에서 안전하게 사용할 수 있습니다.
