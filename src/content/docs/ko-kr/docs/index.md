---
title: "문서"
sidebar:
  order: 20
---

Gin은 [Go](https://go.dev/)로 작성된 고성능 HTTP 웹 프레임워크입니다. Martini와 유사한 API를 제공하지만, [httprouter](https://github.com/julienschmidt/httprouter) 덕분에 최대 40배 더 뛰어난 성능을 발휘합니다. Gin은 속도와 개발자 생산성이 중요한 REST API, 웹 애플리케이션, 마이크로서비스를 구축하기 위해 설계되었습니다.

**왜 Gin을 선택해야 할까요?**

Gin은 Express.js 스타일 라우팅의 간결함과 Go의 성능 특성을 결합하여 다음과 같은 용도에 이상적입니다:

- 높은 처리량의 REST API 구축
- 많은 동시 요청을 처리해야 하는 마이크로서비스 개발
- 빠른 응답 시간이 필요한 웹 애플리케이션 생성
- 최소한의 보일러플레이트 코드로 웹 서비스를 빠르게 프로토타이핑

**Gin의 주요 기능:**

- **제로 할당 라우터** - 힙 할당이 없는 매우 메모리 효율적인 라우팅
- **고성능** - 벤치마크에서 다른 Go 웹 프레임워크에 비해 뛰어난 속도를 보여줍니다
- **미들웨어 지원** - 인증, 로깅, CORS 등을 위한 확장 가능한 미들웨어 시스템
- **크래시 방지** - 내장된 복구 미들웨어가 패닉으로 인한 서버 중단을 방지합니다
- **JSON 유효성 검사** - 자동 요청/응답 JSON 바인딩 및 유효성 검사
- **라우트 그룹화** - 관련 라우트를 구성하고 공통 미들웨어를 적용
- **오류 관리** - 중앙 집중식 오류 처리 및 로깅
- **내장 렌더링** - JSON, XML, HTML 템플릿 등 지원
- **확장 가능** - 커뮤니티 미들웨어와 플러그인의 풍부한 생태계

## 시작하기

### 사전 요구 사항

- **Go 버전**: Gin은 [Go](https://go.dev/) [1.25](https://go.dev/doc/devel/release#go1.25) 이상이 필요합니다
- **기본 Go 지식**: Go 문법과 패키지 관리에 대한 기본적인 이해가 도움이 됩니다

### 설치

[Go의 모듈 지원](https://go.dev/wiki/Modules#how-to-use-modules)을 사용하면, 코드에서 Gin을 임포트하기만 하면 빌드 시 Go가 자동으로 가져옵니다:

```go
import "github.com/gin-gonic/gin"
```

### 첫 번째 Gin 애플리케이션

다음은 Gin의 간결함을 보여주는 완전한 예제입니다:

```go
package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  // 기본 미들웨어(로거 및 복구)로 Gin 라우터 생성
  r := gin.Default()

  // 간단한 GET 엔드포인트 정의
  r.GET("/ping", func(c *gin.Context) {
    // JSON 응답 반환
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })

  // 포트 8080에서 서버 시작 (기본값)
  // 서버는 0.0.0.0:8080에서 수신 대기합니다 (Windows에서는 localhost:8080)
  r.Run()
}
```

**애플리케이션 실행:**

1. 위 코드를 `main.go`로 저장합니다
2. 애플리케이션을 실행합니다:

   ```sh
   go run main.go
   ```

3. 브라우저를 열고 [`http://localhost:8080/ping`](http://localhost:8080/ping)을 방문합니다
4. 다음을 확인할 수 있습니다: `{"message":"pong"}`

**이 예제가 보여주는 것:**

- 기본 미들웨어로 Gin 라우터 생성
- 간단한 핸들러 함수로 HTTP 엔드포인트 정의
- JSON 응답 반환
- HTTP 서버 시작

### 다음 단계

첫 번째 Gin 애플리케이션을 실행한 후, 다음 리소스를 탐색하여 더 알아보세요:

#### 학습 자료

- **[Gin 빠른 시작 가이드](./quickstart/)** - API 예제 및 빌드 설정을 포함한 종합 튜토리얼
- **[예제 저장소](https://github.com/gin-gonic/examples)** - 다양한 Gin 사용 사례를 보여주는 실행 가능한 예제:
  - REST API 개발
  - 인증 및 미들웨어
  - 파일 업로드 및 다운로드
  - WebSocket 연결
  - 템플릿 렌더링

### 공식 튜토리얼

- [Go.dev 튜토리얼: Go와 Gin으로 RESTful API 개발하기](https://go.dev/doc/tutorial/web-service-gin)

## 미들웨어 생태계

Gin은 일반적인 웹 개발 요구 사항을 위한 풍부한 미들웨어 생태계를 가지고 있습니다. 커뮤니티에서 기여한 미들웨어를 살펴보세요:

- **[gin-contrib](https://github.com/gin-contrib)** - 공식 미들웨어 모음:
  - 인증 (JWT, Basic Auth, 세션)
  - CORS, 속도 제한, 압축
  - 로깅, 메트릭, 트레이싱
  - 정적 파일 서빙, 템플릿 엔진

- **[gin-gonic/contrib](https://github.com/gin-gonic/contrib)** - 추가 커뮤니티 미들웨어
