---
title: "Gin 1.12.0 발표: BSON 지원, Context 개선, 성능 향상 등"
linkTitle: "Gin 1.12.0 릴리스 공지"
lastUpdated: 2026-02-28
---

## Gin v1.12.0 출시

새로운 기능, 의미 있는 성능 향상, 탄탄한 버그 수정이 가득한 Gin v1.12.0의 릴리스를 발표하게 되어 기쁩니다. 이 릴리스는 현대 프로토콜에 대한 Gin의 지원을 심화하고, 개발자 경험을 개선하며, 빠르고 가벼운 프로젝트의 전통을 이어갑니다.

### 주요 기능

- **BSON 프로토콜 지원:** 렌더 레이어가 이제 BSON 인코딩을 지원하여 더 효율적인 바이너리 데이터 교환이 가능합니다 ([#4145](https://github.com/gin-gonic/gin/pull/4145)).

- **새로운 Context 메서드:** 두 가지 새 헬퍼가 오류 처리를 더 깔끔하고 관용적으로 만듭니다:
  - context에서 타입 안전한 오류 검색을 위한 `GetError` 및 `GetErrorSlice` ([#4502](https://github.com/gin-gonic/gin/pull/4502))
  - context에서 키를 제거하기 위한 `Delete` 메서드 ([#38e7651](https://github.com/gin-gonic/gin/commit/38e7651))

- **유연한 바인딩:** URI 및 쿼리 바인딩이 이제 `encoding.UnmarshalText`를 존중하여 커스텀 타입 역직렬화를 더 잘 제어할 수 있습니다 ([#4203](https://github.com/gin-gonic/gin/pull/4203)).

- **이스케이프된 경로 옵션:** 새로운 엔진 옵션을 통해 라우팅에 이스케이프된(원시) 요청 경로를 사용할 수 있습니다 ([#4420](https://github.com/gin-gonic/gin/pull/4420)).

- **콘텐츠 협상에서의 Protocol Buffers:** `context`가 이제 협상 가능한 콘텐츠 타입으로 Protocol Buffers를 지원하여 gRPC 스타일 응답의 통합이 더 쉬워졌습니다 ([#4423](https://github.com/gin-gonic/gin/pull/4423)).

- **로거의 색상 지연 시간:** 기본 로거가 이제 지연 시간을 색상으로 렌더링하여 느린 요청을 한눈에 파악하기 쉬워졌습니다 ([#4146](https://github.com/gin-gonic/gin/pull/4146)).

### 성능 및 개선 사항

- **라우터 트리 최적화:** 기수 트리에 대한 여러 개선으로 할당이 줄어들고 경로 파싱이 빨라졌습니다:
  - `findCaseInsensitivePath`에서의 할당 감소 ([#4417](https://github.com/gin-gonic/gin/pull/4417))
  - 효율성을 위해 `strings.Count`를 사용한 경로 파싱 ([#4246](https://github.com/gin-gonic/gin/pull/4246))
  - `redirectTrailingSlash`에서 정규식을 커스텀 함수로 교체 ([#4414](https://github.com/gin-gonic/gin/pull/4414))
- **Recovery 최적화:** 스택 트레이스 읽기가 더 효율적입니다 ([#4466](https://github.com/gin-gonic/gin/pull/4466)).
- **로거 개선:** 설정을 통해 쿼리 문자열 출력을 건너뛸 수 있습니다 ([#4547](https://github.com/gin-gonic/gin/pull/4547)).
- **Unix 소켓 신뢰:** Unix 소켓을 통해 요청이 도착하면 `X-Forwarded-For` 헤더가 항상 신뢰됩니다 ([#3359](https://github.com/gin-gonic/gin/pull/3359)).
- **Flush 안전성:** 기본 `http.ResponseWriter`가 `http.Flusher`를 구현하지 않을 때 `Flush()`가 더 이상 패닉을 일으키지 않습니다 ([#4479](https://github.com/gin-gonic/gin/pull/4479)).
- **코드 품질 리팩토링:** `maps.Copy` 및 `maps.Clone`으로 깔끔한 맵 처리, 매직 넘버를 대체하는 명명된 상수, 현대화된 range-over-int 루프 등 ([#4352](https://github.com/gin-gonic/gin/pull/4352), [#4333](https://github.com/gin-gonic/gin/pull/4333), [#4529](https://github.com/gin-gonic/gin/pull/4529), [#4392](https://github.com/gin-gonic/gin/pull/4392)).

### 버그 수정

- **라우터 패닉 수정:** `RedirectFixedPath`가 활성화된 경우 `findCaseInsensitivePathRec`에서의 패닉을 해결했습니다 ([#4535](https://github.com/gin-gonic/gin/pull/4535)).
- **Data Render의 Content-Length:** `Data.Render`가 이제 `Content-Length` 헤더를 올바르게 작성합니다 ([#4206](https://github.com/gin-gonic/gin/pull/4206)).
- **다중 헤더가 있는 ClientIP:** `ClientIP`가 이제 여러 `X-Forwarded-For` 헤더 값이 있는 요청을 올바르게 처리합니다 ([#4472](https://github.com/gin-gonic/gin/pull/4472)).
- **바인딩 엣지 케이스:** 바인딩에서의 빈 값 오류를 수정하고 ([#2169](https://github.com/gin-gonic/gin/pull/2169)), 폼 바인딩에서의 빈 슬라이스/배열 처리를 개선했습니다 ([#4380](https://github.com/gin-gonic/gin/pull/4380)).
- **리터럴 콜론 라우트:** 리터럴 콜론이 있는 라우트가 이제 `engine.Handler()`에서 올바르게 작동합니다 ([#4415](https://github.com/gin-gonic/gin/pull/4415)).
- **파일 디스크립터 누수:** `RunFd`가 이제 리소스 누수를 방지하기 위해 `os.File` 핸들을 올바르게 닫습니다 ([#4422](https://github.com/gin-gonic/gin/pull/4422)).
- **Hijack 동작:** 응답 수명 주기를 올바르게 모델링하도록 hijack 동작을 개선했습니다 ([#4373](https://github.com/gin-gonic/gin/pull/4373)).
- **Recovery:** `http.ErrAbortHandler`가 이제 의도한 대로 recovery 미들웨어에서 억제됩니다 ([#4336](https://github.com/gin-gonic/gin/pull/4336)).
- **디버그 버전 불일치:** 디버그 모드에서 보고되는 잘못된 버전 문자열을 수정했습니다 ([#4403](https://github.com/gin-gonic/gin/pull/4403)).

### 빌드, 의존성 및 CI 업데이트

- **Go 1.25 최소 버전:** 최소 지원 Go 버전이 이제 **1.25**이며, CI 워크플로가 그에 맞게 업데이트되었습니다 ([#4550](https://github.com/gin-gonic/gin/pull/4550)).
- **BSON 의존성 업그레이드:** BSON 바인딩 의존성이 `mongo-driver` v2로 업그레이드되었습니다 ([#4549](https://github.com/gin-gonic/gin/pull/4549)).

---

Gin 1.12.0은 기여자, 리뷰어, 사용자 모두를 포함한 커뮤니티의 헌신을 반영합니다. 매 릴리스마다 Gin을 더 좋게 만들어주셔서 감사합니다.

Gin 1.12.0을 사용해볼 준비가 되셨나요? [GitHub에서 업그레이드](https://github.com/gin-gonic/gin/releases/tag/v1.12.0)하고 의견을 알려주세요!
