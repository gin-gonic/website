---
title: "BasicAuth 미들웨어 사용하기"
sidebar:
  order: 5
---

Gin에는 [HTTP Basic 인증](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#basic_authentication_scheme)을 구현하는 내장 `gin.BasicAuth()` 미들웨어가 포함되어 있습니다. 사용자 이름/비밀번호 쌍의 `gin.Accounts` 맵(`map[string]string`의 단축)을 받아 적용되는 모든 라우트 그룹을 보호합니다.

:::caution[보안 경고]
HTTP Basic 인증은 자격 증명을 **Base64 인코딩된** 문자열로 전송하며, **암호화되지 않습니다**. 트래픽을 가로챌 수 있는 사람은 자격 증명을 쉽게 디코딩할 수 있습니다. 프로덕션에서 BasicAuth를 사용할 때는 항상 **HTTPS**(TLS)를 사용하세요.
:::

:::note[프로덕션 자격 증명]
아래 예제는 단순화를 위해 사용자 이름과 비밀번호를 하드코딩합니다. 실제 애플리케이션에서는 환경 변수, 시크릿 매니저(예: HashiCorp Vault, AWS Secrets Manager) 또는 적절하게 해시된 비밀번호가 있는 데이터베이스와 같은 안전한 소스에서 자격 증명을 로드하세요. 평문 자격 증명을 버전 관리에 커밋하지 마세요.
:::

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

// 개인 데이터 시뮬레이션
var secrets = gin.H{
  "foo":    gin.H{"email": "foo@bar.com", "phone": "123433"},
  "austin": gin.H{"email": "austin@example.com", "phone": "666"},
  "lena":   gin.H{"email": "lena@guapa.com", "phone": "523443"},
}

func main() {
  router := gin.Default()

  // gin.BasicAuth() 미들웨어를 사용하여 그룹화
  // gin.Accounts는 map[string]string의 단축입니다
  authorized := router.Group("/admin", gin.BasicAuth(gin.Accounts{
    "foo":    "bar",
    "austin": "1234",
    "lena":   "hello2",
    "manu":   "4321",
  }))

  // /admin/secrets 엔드포인트
  // "localhost:8080/admin/secrets"를 방문하세요
  authorized.GET("/secrets", func(c *gin.Context) {
    // 사용자 가져오기, BasicAuth 미들웨어에 의해 설정됨
    user := c.MustGet(gin.AuthUserKey).(string)
    if secret, ok := secrets[user]; ok {
      c.JSON(http.StatusOK, gin.H{"user": user, "secret": secret})
    } else {
      c.JSON(http.StatusOK, gin.H{"user": user, "secret": "NO SECRET :("})
    }
  })

  // 0.0.0.0:8080에서 수신 대기 및 서비스
  router.Run(":8080")
}
```

### 테스트해 보기

curl의 `-u` 플래그를 사용하여 Basic 인증 자격 증명을 제공합니다:

```bash
# 인증 성공
curl -u foo:bar http://localhost:8080/admin/secrets
# => {"secret":{"email":"foo@bar.com","phone":"123433"},"user":"foo"}

# 잘못된 비밀번호 -- 401 Unauthorized 반환
curl -u foo:wrongpassword http://localhost:8080/admin/secrets

# 자격 증명 없음 -- 401 Unauthorized 반환
curl http://localhost:8080/admin/secrets
```
