---
title: "SecureJSON"
sidebar:
  order: 2
---

`SecureJSON`은 **JSON 하이재킹**이라는 취약점 클래스로부터 보호합니다. 구형 브라우저(주로 Internet Explorer 9 이하)에서는 악성 페이지가 피해자의 JSON API 엔드포인트를 가리키는 `<script>` 태그를 포함할 수 있었습니다. 해당 엔드포인트가 최상위 JSON 배열(예: `["secret","data"]`)을 반환하면, 브라우저가 이를 JavaScript로 실행했습니다. `Array` 생성자를 오버라이드하면 공격자가 파싱된 값을 가로채어 민감한 데이터를 제3자 서버로 유출할 수 있었습니다.

**SecureJSON이 이를 방지하는 방법:**

응답 데이터가 JSON 배열인 경우, `SecureJSON`은 파싱할 수 없는 접두사(기본적으로 `while(1);`)를 응답 바디에 추가합니다. 이로 인해 `<script>` 태그를 통해 응답이 로드되면 브라우저의 JavaScript 엔진이 무한 루프에 빠져 데이터에 접근할 수 없게 됩니다. 정상적인 API 소비자(`fetch`, `XMLHttpRequest` 또는 모든 HTTP 클라이언트 사용)는 원시 응답 바디를 읽고 파싱 전에 접두사를 간단히 제거할 수 있습니다.

Google의 API는 `)]}'\n`으로, Facebook은 `for(;;);`로 유사한 기법을 사용합니다. `router.SecureJsonPrefix()`로 접두사를 커스터마이즈할 수 있습니다.

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  router := gin.Default()

  // 자체 보안 JSON 접두사를 사용할 수도 있습니다
  // router.SecureJsonPrefix(")]}',\n")

  router.GET("/someJSON", func(c *gin.Context) {
    names := []string{"lena", "austin", "foo"}

    // 출력: while(1);["lena","austin","foo"]
    c.SecureJSON(http.StatusOK, names)
  })

  // 0.0.0.0:8080에서 수신 대기 및 서비스
  router.Run(":8080")
}
```

:::note
현대 브라우저는 이 취약점을 수정했으므로, `SecureJSON`은 주로 레거시 브라우저를 지원해야 하거나 보안 정책에 심층 방어가 필요한 경우에 관련됩니다. 대부분의 새로운 API에서는 표준 `c.JSON()`으로 충분합니다.
:::
