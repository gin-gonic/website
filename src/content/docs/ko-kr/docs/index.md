---
title: "문서"
sidebar:
  order: 20
---

Gin은 [Go](https://go.dev/)로 작성된 고성능 HTTP 웹 프레임워크입니다. [httprouter](https://github.com/julienschmidt/httprouter)를 활용하여 Martini와 유사한 API를 제공하면서, 성능은 최대 40배 더 빠릅니다. Gin은 속도와 개발자의 생산성이 중요한 REST API, 웹 애플리케이션, 마이크로서비스 구축에 적합하도록 설계되었습니다.

**Gin을 선택해야 하는 이유**

Gin은 Express.js 스타일 라우팅의 단순함과 Go의 성능 특성을 결합하여 다음과 같은 사용에 이상적입니다:

- 고처리량 REST API 구축
- 수많은 동시 요청을 처리해야 하는 마이크로서비스 개발
- 빠른 응답 속도가 필요한 웹 애플리케이션 구현
- 최소한의 반복작업으로 웹 서비스를 빠르게 프로토타이핑

**Gin의 주요 기능**

- **Zero allocation 라우터** – 힙 할당 없이 매우 메모리 효율적인 라우팅 제공
- **뛰어난 성능** – Go 웹 프레임워크 중에서 벤치마크상 탁월한 속도
- **미들웨어 지원** – 인증, 로깅, CORS 등 확장 가능한 미들웨어 시스템
- **Crash-free 운영** – 내장된 recovery 미들웨어로 인해 서버 크래시 방지
- **JSON 검증** – 요청/응답의 자동 바인딩 및 검증
- **라우트 그룹화** – 관련 라우트 조직 및 공통 미들웨어 적용
- **에러 관리** – 중앙 집중형 에러 핸들링 및 로깅
- **내장 렌더링** – JSON, XML, HTML 템플릿 등 다양한 방식 지원
- **확장성** – 다양한 커뮤니티 기반 미들웨어 및 플러그인

## 시작하기

### 필수 조건

- **Go 버전:** Gin은 [Go](https://go.dev/) 버전 [1.23](https://go.dev/doc/devel/release#go1.23.0) 이상 필요
- **Go 기본 지식:** Go 구문 및 패키지 관리 경험이 있으면 도움이 됩니다

### 설치

[Go 모듈](https://go.dev/wiki/Modules#how-to-use-modules) 환경에서는 코드에 Gin을 import하면 빌드 시 자동으로 패치됩니다.

```go
import "github.com/gin-gonic/gin"
```

### 첫 Gin 애플리케이션

Gin의 간결함을 보여주는 완성 예제:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // 기본 미들웨어(logger, recovery) 포함 Gin 라우터 생성
  r := gin.Default()
  
  // 간단한 GET 엔드포인트 정의
  r.GET("/ping", func(c *gin.Context) {
    // JSON 응답 반환
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })
  
  // 8080 포트에서 서버 시작 (기본값)
  // 0.0.0.0:8080 (윈도우에서는 localhost:8080)에서 대기
  r.Run()
}
```

**애플리케이션 실행**

1. 위 코드를 `main.go`로 저장
2. 프로그램 실행:

   ```sh
   go run main.go
   ```

3. 브라우저에서 [`http://localhost:8080/ping`](http://localhost:8080/ping) 접속
4. `{"message":"pong"}` 출력 확인

**이 예제에서 확인할 내용**

- 기본 미들웨어 포함 Gin 라우터 생성
- 간단한 핸들러 함수로 HTTP 엔드포인트 정의
- JSON 응답 반환
- HTTP 서버 구동

### 다음 단계

Gin 첫 애플리케이션 실행 후, 더 깊이 학습하려면 아래 리소스를 참조하세요:

#### 📚 학습 자료

- **[Gin 퀵스타트 가이드](./quickstart/)** – 다양한 API 예제와 빌드 설정을 포함한 포괄적 튜토리얼
- **[예제 레포지토리](https://github.com/gin-gonic/examples)** – 여러 Gin 사용 사례를 보여주는 즉시 실행 가능한 예제:
  - REST API 개발
  - 인증 및 미들웨어
  - 파일 업로드 및 다운로드
  - WebSocket 연결
  - 템플릿 렌더링

### 공식 튜토리얼

- [Go.dev 튜토리얼: Go와 Gin으로 RESTful API 개발](https://go.dev/doc/tutorial/web-service-gin)

## 🔌 미들웨어 생태계

Gin은 웹 개발자들이 자주 사용하는 다양한 커뮤니티 기반 미들웨어 생태계를 보유하고 있습니다. 대표적인 커뮤니티 미들웨어:

- **[gin-contrib](https://github.com/gin-contrib)** – 공식 미들웨어 모음:
  - 인증(JWT, Basic Auth, Session)
  - CORS, 속도 제한, 압축
  - 로깅, 메트릭, 추적
  - 정적 파일 제공, 템플릿 엔진

- **[gin-gonic/contrib](https://github.com/gin-gonic/contrib)** – 추가적인 커뮤니티 미들웨어
