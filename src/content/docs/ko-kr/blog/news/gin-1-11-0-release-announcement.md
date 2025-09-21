---
title: "Gin 1.11.0 출시! HTTP/3, 폼 개선, 성능 향상 등"
linkTitle: "Gin 1.11.0 출시 공지"
lastUpdated: 2025-09-21
---

## Gin v1.11.0가 출시되었습니다

빠르고 유연한 Go 웹 프레임워크 Gin이 v1.11.0으로 새롭게 태어났습니다. 여러 신기능, 성능 개선 및 버그 수정이 포함되어 있습니다. Gin은 변함없이 속도와 현대적인 Go 개발을 선도합니다.

### 🌟 주요 기능

- **실험적 HTTP/3 지원:** Gin은 이제 [quic-go](https://github.com/quic-go/quic-go)로 HTTP/3을 실험적으로 지원합니다! 최신 웹 프로토콜에 도전해보세요. ([#3210](https://github.com/gin-gonic/gin/pull/3210))

- **폼 바인딩 강화:**
  - 폼 바인딩에서 배열 컬렉션 포맷 지원 ([#3986](https://github.com/gin-gonic/gin/pull/3986))
  - 폼 태그에서 커스텀 문자열 슬라이스 unmarshal ([#3970](https://github.com/gin-gonic/gin/pull/3970))
  - 컬렉션 타입에 기본값 지원 ([#4048](https://github.com/gin-gonic/gin/pull/4048))

- **바인딩 타입 확장:** 새로운 `BindPlain` 메서드로 텍스트 바인딩 간소화 ([#3904](https://github.com/gin-gonic/gin/pull/3904)), unixMilli, unixMicro 형식 지원 ([#4190](https://github.com/gin-gonic/gin/pull/4190)).

- **Context API 개선:** `GetXxx`가 더 많은 Go 네이티브 타입을 지원합니다 ([#3633](https://github.com/gin-gonic/gin/pull/3633)), 타입 안전한 context 데이터 활용이 쉬워집니다.

- **파일 시스템 확장:** 새로운 `OnlyFilesFS`가 export 및 테스트, 문서화 완료 ([#3939](https://github.com/gin-gonic/gin/pull/3939)).

### 🚀 성능 및 향상점

- **폼 데이터 처리 속도 향상:** 폼 파싱 성능이 내부적으로 개선되었습니다 ([#4339](https://github.com/gin-gonic/gin/pull/4339)).
- 코어, 렌더링, context 처리 로직 리팩토링 및 견고함과 명료성 강화([전체 PR changelog에서 확인](../releases/release111.md)).

### 🐛 버그 수정

- **미들웨어 안정성:** 드물게 발생하던 미들웨어 재진입 버그 수정 ([#3987](https://github.com/gin-gonic/gin/pull/3987)).
- TOML 폼 바인딩 안정성 향상 ([#4193](https://github.com/gin-gonic/gin/pull/4193)).
- 빈 트리에서 "method not allowed" 처리 시 panic이 발생하지 않음 ([#4003](https://github.com/gin-gonic/gin/pull/4003)).
- context와 경쟁 상태 등 전반적인 안정성 증대.

### 🔧 빌드, 의존성, CI 업데이트

- **Go 1.25** CI/CD 지원 및 신규 linter 적용으로 코드 퀄리티 강화 ([#4341](https://github.com/gin-gonic/gin/pull/4341), [#4010](https://github.com/gin-gonic/gin/pull/4010)).
- CI에 Trivy 취약점 스캐너 통합 ([#4359](https://github.com/gin-gonic/gin/pull/4359)).
- 여러 패키지 의존성 업데이트: sonic, setup-go, quic-go 등.

### 📖 문서 업데이트

- 문서 확장, changelog 강화, 예시/문장 개선, 포르투갈어 문서 추가 ([#4078](https://github.com/gin-gonic/gin/pull/4078)).

---

Gin 1.11.0은 활발한 커뮤니티와 지속적인 개발의 결과입니다. 모든 기여자, 버그 리포터, 그리고 Gin을 현대 웹에 맞게 발전시키는 유저 여러분께 감사드립니다.

Gin 1.11.0을 지금 경험해보세요! [GitHub에서 업그레이드](https://github.com/gin-gonic/gin/releases/tag/v1.11.0) 후 의견도 남겨주세요!
