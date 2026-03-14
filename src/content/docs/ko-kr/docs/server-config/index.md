---
title: "서버 설정"
sidebar:
  order: 8
---

Gin은 유연한 서버 설정 옵션을 제공합니다. `gin.Engine`이 `http.Handler` 인터페이스를 구현하므로, Go의 표준 `net/http.Server`와 함께 사용하여 타임아웃, TLS 및 기타 설정을 직접 제어할 수 있습니다.

## 커스텀 http.Server 사용

기본적으로 `router.Run()`은 기본 HTTP 서버를 시작합니다. 프로덕션 사용을 위해 자체 `http.Server`를 생성하여 타임아웃 및 기타 옵션을 설정하세요:

```go
func main() {
  router := gin.Default()
  router.GET("/", func(c *gin.Context) {
    c.String(200, "ok")
  })

  s := &http.Server{
    Addr:           ":8080",
    Handler:        router,
    ReadTimeout:    10 * time.Second,
    WriteTimeout:   10 * time.Second,
    MaxHeaderBytes: 1 << 20,
  }
  s.ListenAndServe()
}
```

이를 통해 Gin의 모든 라우팅 및 미들웨어 기능을 유지하면서 Go의 서버 설정에 완전히 접근할 수 있습니다.

## 이 섹션의 내용

- [**커스텀 HTTP 설정**](./custom-http-config/) -- 기본 HTTP 서버 세부 조정
- [**커스텀 JSON 코덱**](./custom-json-codec/) -- 대체 JSON 직렬화 라이브러리 사용
- [**Let's Encrypt**](./lets-encrypt/) -- Let's Encrypt로 자동 TLS 인증서
- [**다중 서비스 실행**](./multiple-service/) -- 다른 포트에서 여러 Gin 엔진 서빙
- [**우아한 재시작 또는 중지**](./graceful-restart-or-stop/) -- 활성 연결을 끊지 않고 종료
- [**HTTP/2 서버 푸시**](./http2-server-push/) -- 리소스를 사전에 클라이언트에 푸시
- [**쿠키 처리**](./cookie/) -- HTTP 쿠키 읽기 및 쓰기
- [**신뢰할 수 있는 프록시**](./trusted-proxies/) -- 클라이언트 IP 확인을 위해 Gin이 신뢰하는 프록시 설정
