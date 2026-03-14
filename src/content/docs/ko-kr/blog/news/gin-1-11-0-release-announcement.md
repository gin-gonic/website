---
title: "Gin 1.11.0 발표: HTTP/3, 폼 개선, 성능 향상 등"
linkTitle: "Gin 1.11.0 릴리스 공지"
lastUpdated: 2025-09-21
---

## Gin v1.11.0 출시

Gin v1.11.0의 릴리스를 발표하게 되어 기쁩니다. 이번 릴리스는 사랑받는 웹 프레임워크에 주요 새 기능, 성능 조정, 버그 수정 세트를 제공합니다. 이 릴리스는 속도, 유연성 및 현대 Go 개발에 대한 Gin의 약속을 이어갑니다.

### 주요 기능

- **실험적 HTTP/3 지원:** Gin은 이제 [quic-go](https://github.com/quic-go/quic-go)를 통한 실험적 HTTP/3를 지원합니다! 최신 웹 전송 프로토콜을 시도해보고 싶다면, 지금이 기회입니다. ([#3210](https://github.com/gin-gonic/gin/pull/3210))

- **향상된 폼 바인딩:** 폼 바인딩에 큰 개선을 했습니다:
  - 폼에서 배열 컬렉션 형식 지원 ([#3986](https://github.com/gin-gonic/gin/pull/3986))
  - 폼 태그를 위한 커스텀 문자열 슬라이스 언마셜링 ([#3970](https://github.com/gin-gonic/gin/pull/3970))
  - 컬렉션의 기본값 ([#4048](https://github.com/gin-gonic/gin/pull/4048))

- **향상된 바인딩 타입:** 새로운 `BindPlain` 메서드로 일반 텍스트를 쉽게 바인딩하고 ([#3904](https://github.com/gin-gonic/gin/pull/3904)), unixMilli 및 unixMicro 형식도 지원합니다 ([#4190](https://github.com/gin-gonic/gin/pull/4190)).

- **Context API 개선:** `GetXxx`가 이제 더 많은 네이티브 Go 타입을 지원하여 ([#3633](https://github.com/gin-gonic/gin/pull/3633)), 타입 안전한 context 데이터 검색이 더 쉬워졌습니다.

- **파일시스템 업데이트:** 새로운 `OnlyFilesFS`가 이제 내보내지고, 테스트되고, 문서화되었습니다 ([#3939](https://github.com/gin-gonic/gin/pull/3939)).

### 성능 및 개선 사항

- **더 빠른 폼 데이터 처리:** 폼 파싱을 위한 내부 최적화로 성능이 향상됩니다 ([#4339](https://github.com/gin-gonic/gin/pull/4339)).
- 견고성과 명확성을 위해 코어, 렌더링 및 context 로직을 리팩토링했습니다 ([변경 로그의 전체 PR 목록](../releases/release111.md)).

### 버그 수정

- **미들웨어 안정성:** 미들웨어가 예기치 않게 다시 진입할 수 있는 드문 버그를 수정했습니다 ([#3987](https://github.com/gin-gonic/gin/pull/3987)).
- TOML 폼 바인딩 안정성이 향상되었습니다 ([#4193](https://github.com/gin-gonic/gin/pull/4193)).
- 빈 트리에서 "method not allowed" 요청을 처리할 때 더 이상 패닉이 발생하지 않습니다 ([#4003](https://github.com/gin-gonic/gin/pull/4003)).
- context 처리, 레이스 컨디션 등의 일반적인 개선.

### 빌드, 의존성 및 CI 업데이트

- CI/CD 워크플로에서 **Go 1.25** 지원과 더 엄격한 코드 상태를 위한 새 린터 활성화 ([#4341](https://github.com/gin-gonic/gin/pull/4341), [#4010](https://github.com/gin-gonic/gin/pull/4010)).
- CI에 Trivy 취약점 스캐닝 통합 ([#4359](https://github.com/gin-gonic/gin/pull/4359)).
- `sonic`, `setup-go`, `quic-go` 등 다수의 의존성 업그레이드.

### 문서

- 확장된 문서, 업데이트된 변경 로그, 개선된 문법 및 코드 샘플, 새로운 포르투갈어 문서 ([#4078](https://github.com/gin-gonic/gin/pull/4078)).

---

Gin 1.11.0은 활발한 커뮤니티와 지속적인 개발의 증거입니다. Gin을 현대 웹 애플리케이션에 적합하고 관련성 있게 유지해주는 모든 기여자, 이슈 보고자, 사용자에게 감사드립니다.

Gin 1.11.0을 사용해볼 준비가 되셨나요? [GitHub에서 업그레이드](https://github.com/gin-gonic/gin/releases/tag/v1.11.0)하고 의견을 알려주세요!
