---
title: "배포"
sidebar:
  order: 10
---

Gin 프로젝트는 모든 클라우드 제공업체에 쉽게 배포할 수 있습니다.

## [Railway](https://www.railway.com)

Railway는 애플리케이션과 서비스를 배포, 관리, 확장하기 위한 최첨단 클라우드 개발 플랫폼입니다. 서버에서 관측 가능성까지 인프라 스택을 단일하고 확장 가능하며 사용하기 쉬운 플랫폼으로 단순화합니다.

Railway [Gin 프로젝트 배포 가이드](https://docs.railway.com/guides/gin)를 따르세요.

## [Seenode](https://seenode.com)

Seenode는 빠르고 효율적으로 애플리케이션을 배포하려는 개발자를 위해 특별히 설계된 현대적인 클라우드 플랫폼입니다. Git 기반 배포, 자동 SSL 인증서, 내장 데이터베이스 및 간소화된 인터페이스를 제공하여 Gin 애플리케이션을 몇 분 안에 운영할 수 있습니다.

Seenode [Gin 프로젝트 배포 가이드](https://seenode.com/docs/frameworks/go/gin)를 따르세요.

## [Koyeb](https://www.koyeb.com)

Koyeb은 Git 기반 배포, TLS 암호화, 네이티브 오토스케일링, 글로벌 엣지 네트워크, 내장 서비스 메시 및 디스커버리를 갖춘 개발자 친화적인 서버리스 플랫폼입니다.

Koyeb [Gin 프로젝트 배포 가이드](https://www.koyeb.com/tutorials/deploy-go-gin-on-koyeb)를 따르세요.

## [Qovery](https://www.qovery.com)

Qovery는 데이터베이스, SSL, 글로벌 CDN 및 Git을 통한 자동 배포를 포함한 무료 클라우드 호스팅을 제공합니다.

자세한 정보는 [Qovery](https://hub.qovery.com/guides/getting-started/deploy-your-first-application/)를 참조하세요.

## [Render](https://render.com)

Render는 Go에 대한 네이티브 지원, 완전 관리형 SSL, 데이터베이스, 무중단 배포, HTTP/2 및 WebSocket 지원을 제공하는 현대적인 클라우드 플랫폼입니다.

Render [Gin 프로젝트 배포 가이드](https://render.com/docs/deploy-go-gin)를 따르세요.

## [Google App Engine](https://cloud.google.com/appengine/)

GAE에는 Go 애플리케이션을 배포하는 두 가지 방법이 있습니다. 표준 환경은 사용하기 쉽지만 커스터마이즈가 제한적이고 보안상의 이유로 [시스콜](https://github.com/gin-gonic/gin/issues/1639)을 방지합니다. 유연한 환경은 모든 프레임워크나 라이브러리를 실행할 수 있습니다.

[Google App Engine의 Go](https://cloud.google.com/appengine/docs/go/)에서 더 알아보고 선호하는 환경을 선택하세요.

## 자체 호스팅

Gin 프로젝트는 자체 호스팅 방식으로도 배포할 수 있습니다. 배포 아키텍처와 보안 고려 사항은 대상 환경에 따라 다릅니다. 다음 섹션에서는 배포를 계획할 때 고려해야 할 설정 옵션의 개략적인 개요만 제시합니다.

## 설정 옵션

Gin 프로젝트 배포는 환경 변수 또는 코드에서 직접 조정할 수 있습니다.

Gin 설정에 사용할 수 있는 환경 변수는 다음과 같습니다:

| 환경 변수 | 설명                                                                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT                 | `router.Run()`(인수 없이)으로 Gin 서버를 시작할 때 수신 대기할 TCP 포트입니다.                                                                                                      |
| GIN_MODE             | `debug`, `release` 또는 `test` 중 하나로 설정합니다. 디버그 출력을 언제 내보낼지 등 Gin 모드를 관리합니다. 코드에서 `gin.SetMode(gin.ReleaseMode)` 또는 `gin.SetMode(gin.TestMode)`로도 설정할 수 있습니다. |

다음 코드를 사용하여 Gin을 설정할 수 있습니다.

```go
// Gin의 바인드 주소나 포트를 지정하지 않습니다. 기본적으로 모든 인터페이스의 포트 8080에 바인딩합니다.
// 인수 없이 `Run()`을 사용할 때 `PORT` 환경 변수를 사용하여 수신 포트를 변경할 수 있습니다.
router := gin.Default()
router.Run()

// Gin의 바인드 주소와 포트를 지정합니다.
router := gin.Default()
router.Run("192.168.1.100:8080")

// 수신 포트만 지정합니다. 모든 인터페이스에 바인딩됩니다.
router := gin.Default()
router.Run(":8080")

// 실제 클라이언트 IP 주소를 문서화하기 위해 헤더를 설정하는 데 신뢰할 수 있는 IP 주소 또는 CIDR을 설정합니다.
// 자세한 내용은 문서를 참조하세요.
router := gin.Default()
router.SetTrustedProxies([]string{"192.168.1.2"})
```

신뢰할 수 있는 프록시 설정에 대한 정보는 [신뢰할 수 있는 프록시](/ko-kr/docs/server-config/trusted-proxies/)를 참조하세요.
