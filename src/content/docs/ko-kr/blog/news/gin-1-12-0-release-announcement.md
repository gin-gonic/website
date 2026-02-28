---
title: "Gin 1.12.0 발표: BSON 지원, Context 개선, 성능 향상 등"
linkTitle: "Gin 1.12.0 릴리스 공지"
lastUpdated: 2026-02-28
---

## Gin v1.12.0 출시됨

새로운 기능, 뛰어난 성능 개선, 그리고 많은 버그 수정을 포함한 Gin v1.12.0의 출시를 기쁨으로 알립니다. 이번 릴리스는 Gin의 최신 프로토콜 지원을 강화하고, 개발자 경험을 개선하며, 프로젝트의 빠르고 가벼운 전통을 계속 이어갑니다.

### 🌟 주요 기능

- **BSON 프로토콜 지원:** 렌더링 계층이 이제 BSON 인코딩을 지원하여 더 효율적인 바이너리 데이터 교환의 문을 열어줍니다 ([#4145](https://github.com/gin-gonic/gin/pull/4145)).

- **새로운 Context 메서드:** 두 개의 새로운 헬퍼 메서드가 에러 처리를 더 깔끔하고 관용적으로 만듭니다:
  - `GetError` 및 `GetErrorSlice`를 통한 컨텍스트에서 타입 안전한 에러 검색 ([#4502](https://github.com/gin-gonic/gin/pull/4502))
  - 컨텍스트에서 키를 제거하는 `Delete` 메서드 ([#38e7651](https://github.com/gin-gonic/gin/commit/38e7651))

- **유연한 바인딩:** URI 및 쿼리 바인딩이 이제 `encoding.UnmarshalText`를 준수하여 사용자 정의 타입 역직렬화를 더 잘 제어할 수 있습니다 ([#4203](https://github.com/gin-gonic/gin/pull/4203)).

- **이스케이프 경로 옵션:** 새로운 엔진 옵션으로 라우팅에 이스케이프된 (원본) 요청 경로를 사용하도록 선택할 수 있습니다 ([#4420](https://github.com/gin-gonic/gin/pull/4420)).

- **컨텐츠 협상의 Protocol Buffers:** `context`가 이제 Protocol Buffers를 협상 가능한 콘텐츠 타입으로 지원하여 gRPC 스타일의 응답 통합이 더 쉬워집니다 ([#4423](https://github.com/gin-gonic/gin/pull/4423)).

- **Logger의 컬러화된 지연 시간:** 기본 로거가 이제 지연 시간을 색상으로 렌더링하여 느린 요청을 한눈에 파악할 수 있습니다 ([#4146](https://github.com/gin-gonic/gin/pull/4146)).

### 🚀 성능 및 개선 사항

- **라우터 트리 최적화:** 기수 트리에 대한 여러 개선 사항이 할당을 줄이고 경로 파싱을 가속화합니다:
  - `findCaseInsensitivePath`에서 더 적은 할당 ([#4417](https://github.com/gin-gonic/gin/pull/4417))
  - 효율성을 위해 `strings.Count`를 사용한 경로 파싱 ([#4246](https://github.com/gin-gonic/gin/pull/4246))
  - `redirectTrailingSlash`에서 정규식을 사용자 정의 함수로 대체 ([#4414](https://github.com/gin-gonic/gin/pull/4414))
- **복구 최적화:** 스택 트레이스 읽기가 더 효율적으로 ([#4466](https://github.com/gin-gonic/gin/pull/4466)).
- **Logger 개선:** 쿼리 문자열 출력을 이제 구성을 통해 건너뛸 수 있습니다 ([#4547](https://github.com/gin-gonic/gin/pull/4547)).
- **Unix Socket 신뢰:** Unix 소켓을 통해 요청이 도착할 때 `X-Forwarded-For` 헤더가 항상 신뢰됩니다 ([#3359](https://github.com/gin-gonic/gin/pull/3359)).
- **Flush 안전성:** 기본 `http.ResponseWriter`가 `http.Flusher`를 구현하지 않을 때 `Flush()`가 더 이상 패닉을 일으키지 않습니다 ([#4479](https://github.com/gin-gonic/gin/pull/4479)).
- **코드 품질 리팩토링:** `maps.Copy` 및 `maps.Clone`을 사용한 더 깔끔한 맵 처리, 매직 넘버를 명명된 상수로 대체, 최신화된 range-over-int 루프 등 ([#4352](https://github.com/gin-gonic/gin/pull/4352), [#4333](https://github.com/gin-gonic/gin/pull/4333), [#4529](https://github.com/gin-gonic/gin/pull/4529), [#4392](https://github.com/gin-gonic/gin/pull/4392)).

### 🐛 버그 수정

- **라우터 패닉 수정:** `RedirectFixedPath`가 활성화되어 있을 때 `findCaseInsensitivePathRec`의 패닉을 해결 ([#4535](https://github.com/gin-gonic/gin/pull/4535)).
- **데이터 렌더링의 Content-Length:** `Data.Render`가 이제 `Content-Length` 헤더를 올바르게 씁니다 ([#4206](https://github.com/gin-gonic/gin/pull/4206)).
- **여러 헤더가 있는 ClientIP:** `ClientIP`가 이제 여러 `X-Forwarded-For` 헤더 값이 있는 요청을 올바르게 처리합니다 ([#4472](https://github.com/gin-gonic/gin/pull/4472)).
- **바인딩 엣지 케이스:** 바인딩의 빈 값 오류 수정 ([#2169](https://github.com/gin-gonic/gin/pull/2169)) 및 폼 바인딩의 빈 슬라이스/배열 처리 개선 ([#4380](https://github.com/gin-gonic/gin/pull/4380)).
- **리터럴 콜론 라우트:** 리터럴 콜론이 있는 라우트가 이제 `engine.Handler()`에서 올바르게 작동합니다 ([#4415](https://github.com/gin-gonic/gin/pull/4415)).
- **파일 디스크립터 누수:** `RunFd`가 이제 `os.File` 핸들을 올바르게 닫아 리소스 누수를 방지합니다 ([#4422](https://github.com/gin-gonic/gin/pull/4422)).
- **Hijack 동작:** Hijack 동작을 개선하여 응답 라이프사이클을 올바르게 모델링합니다 ([#4373](https://github.com/gin-gonic/gin/pull/4373)).
- **복구:** `http.ErrAbortHandler`가 의도한 대로 복구 미들웨어에서 억제됩니다 ([#4336](https://github.com/gin-gonic/gin/pull/4336)).
- **디버그 버전 불일치:** 디버그 모드에서 보고된 잘못된 버전 문자열을 수정 ([#4403](https://github.com/gin-gonic/gin/pull/4403)).

### 🔧 빌드, 의존성 및 CI 업데이트

- **Go 1.25 최소 버전:** 최소 지원 Go 버전이 이제 **1.25**이고 CI 워크플로우도 그에 맞게 업데이트되었습니다 ([#4550](https://github.com/gin-gonic/gin/pull/4550)).
- **BSON 의존성 업그레이드:** BSON 바인딩 의존성이 `mongo-driver` v2로 업그레이드되었습니다 ([#4549](https://github.com/gin-gonic/gin/pull/4549)).

---

Gin 1.12.0은 우리 커뮤니티의 헌신을 반영합니다 — 기여자, 검토자, 그리고 사용자 모두. 모든 릴리스에서 Gin을 더 나아지게 해주셔서 감사합니다.

Gin 1.12.0을 시도할 준비가 되셨나요? [GitHub에서 업그레이드](https://github.com/gin-gonic/gin/releases/tag/v1.12.0)하고 피드백을 보내주세요!
