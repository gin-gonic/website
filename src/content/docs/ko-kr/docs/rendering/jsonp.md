---
title: "JSONP"
sidebar:
  order: 3
---

JSONP (JSON with Padding)는 CORS 지원 이전의 브라우저에서 크로스 도메인 요청을 만들기 위한 기법입니다. JSON 응답을 JavaScript 함수 호출로 감싸는 방식으로 작동합니다. 브라우저는 동일 출처 정책의 적용을 받지 않는 `<script>` 태그를 통해 응답을 로드하며, 래핑 함수가 데이터를 인수로 받아 실행됩니다.

`c.JSONP()`를 호출하면, Gin은 `callback` 쿼리 매개변수를 확인합니다. 존재하면 응답 바디가 `callbackName({"foo":"bar"})`으로 래핑되고 `Content-Type`은 `application/javascript`가 됩니다. 콜백이 제공되지 않으면 표준 `c.JSON()` 호출처럼 동작합니다.

:::note
JSONP는 레거시 기법입니다. 현대 애플리케이션에서는 [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)를 대신 사용하세요. CORS는 더 안전하고, 모든 HTTP 메서드(GET뿐만 아니라)를 지원하며, 응답을 콜백으로 래핑할 필요가 없습니다. 매우 오래된 브라우저를 지원하거나 JSONP가 필요한 타사 시스템과 통합할 때만 JSONP를 사용하세요.
:::

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  router.GET("/JSONP", func(c *gin.Context) {
    data := map[string]interface{}{
      "foo": "bar",
    }

    // 콜백 이름은 쿼리 문자열에서 읽습니다, 예:
    // GET /JSONP?callback=x
    // 출력: x({\"foo\":\"bar\"})
    c.JSONP(http.StatusOK, data)
  })

  // 0.0.0.0:8080에서 수신 대기 및 서비스
  router.Run(":8080")
}
```

curl로 테스트하여 JSONP와 일반 JSON 응답의 차이를 확인하세요:

```sh
# 콜백 포함 -- JavaScript를 반환
curl "http://localhost:8080/JSONP?callback=handleData"
# 출력: handleData({"foo":"bar"});

# 콜백 없이 -- 일반 JSON을 반환
curl "http://localhost:8080/JSONP"
# 출력: {"foo":"bar"}
```

:::caution[보안 고려 사항]
콜백 매개변수가 적절하게 새니타이즈되지 않으면 JSONP 엔드포인트가 XSS 공격에 취약할 수 있습니다. `alert(document.cookie)//`와 같은 악의적인 콜백 값이 임의의 JavaScript를 주입할 수 있습니다. Gin은 인젝션에 사용될 수 있는 문자를 제거하여 콜백 이름을 새니타이즈하여 이를 완화합니다. 그러나 웹의 어떤 페이지든 `<script>` 태그를 통해 JSONP 엔드포인트를 로드할 수 있으므로, JSONP 엔드포인트를 비민감, 읽기 전용 데이터로 제한해야 합니다.
:::

## 참고

- [XML/JSON/YAML/ProtoBuf 렌더링](/ko-kr/docs/rendering/rendering/)
- [SecureJSON](/ko-kr/docs/rendering/secure-json/)
- [AsciiJSON](/ko-kr/docs/rendering/ascii-json/)
- [PureJSON](/ko-kr/docs/rendering/pure-json/)
