---
title: "🍳 Gin 레시피 (쿡북)"
sidebar:
  order: 6
---

## 소개

이 섹션은 작고 실용적인 레시피를 통해 **코드에서 Gin을 사용하는 방법**을 보여줍니다.
각 레시피는 **단일 개념**에 초점을 맞추므로 빠르게 학습하고 즉시 적용할 수 있습니다.

이러한 예제를 Gin을 사용하여 실제 API를 구조화하는 참고 자료로 사용하세요.

---

## 🧭 배우게 될 내용

이 섹션에서는 다음을 다루는 예제를 찾을 수 있습니다:

- **서버 기본**: 서버 실행, 라우팅 및 구성.
- **요청 처리**: JSON, XML 및 폼 데이터 바인딩.
- **미들웨어**: 내장 및 사용자 정의 미들웨어 사용.
- **렌더링**: HTML, JSON, XML 등 제공.
- **보안**: SSL, 헤더 및 인증 처리.

---

## 🥇 레시피 1: 최소 Gin 서버

**목표:** Gin 서버를 시작하고 기본 요청을 처리합니다.

### 단계

1. 라우터 생성
2. 라우트 정의
3. 서버 시작

```go
package main

import "github.com/gin-gonic/gin"

func main() {
  r := gin.Default()

  r.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })

  r.Run(":8080") // http://localhost:8080
}
```
