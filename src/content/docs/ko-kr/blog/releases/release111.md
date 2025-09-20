---
title: "Gin 1.11.0 출시됨"
linkTitle: "Gin 1.11.0 출시됨"
lastUpdated: 2025-09-20
---

## Gin v1.11.0

### 새로운 기능

* feat(gin): quic-go/quic-go를 통한 HTTP/3의 실험적 지원 ([#3210](https://github.com/gin-gonic/gin/pull/3210))
* feat(form): 폼 바인딩에서 배열 컬렉션 형식 추가 ([#3986](https://github.com/gin-gonic/gin/pull/3986)), 폼 태그 언마샬을 위한 사용자 지정 문자열 슬라이스 추가 ([#3970](https://github.com/gin-gonic/gin/pull/3970))
* feat(binding): BindPlain 추가 ([#3904](https://github.com/gin-gonic/gin/pull/3904))
* feat(fs): OnlyFilesFS 내보내기, 테스트 및 문서화 ([#3939](https://github.com/gin-gonic/gin/pull/3939))
* feat(binding): unixMilli 및 unixMicro 지원 추가 ([#4190](https://github.com/gin-gonic/gin/pull/4190))
* feat(form): 폼 바인딩에서 컬렉션 기본값 지원 ([#4048](https://github.com/gin-gonic/gin/pull/4048))
* feat(context): GetXxx에서 Go의 다양한 기본 타입 지원 추가 ([#3633](https://github.com/gin-gonic/gin/pull/3633))

### 개선 사항

* perf(context): getMapFromFormData 성능 최적화 ([#4339](https://github.com/gin-gonic/gin/pull/4339))
* refactor(tree): node.insertChild에서 string(/)을 "/"로 교체 ([#4354](https://github.com/gin-gonic/gin/pull/4354))
* refactor(render): writeHeader에서 headers 파라미터 제거 ([#4353](https://github.com/gin-gonic/gin/pull/4353))
* refactor(context): "GetType()" 함수 간소화 ([#4080](https://github.com/gin-gonic/gin/pull/4080))
* refactor(slice): SliceValidationError Error 메서드 간소화 ([#3910](https://github.com/gin-gonic/gin/pull/3910))
* refactor(context): SaveUploadedFile에서 filepath.Dir의 이중 사용 방지 ([#4181](https://github.com/gin-gonic/gin/pull/4181))
* refactor(context): 컨텍스트 처리 리팩터링 및 테스트 견고성 향상 ([#4066](https://github.com/gin-gonic/gin/pull/4066))
* refactor(binding): strings.Index 대신 strings.Cut 사용 ([#3522](https://github.com/gin-gonic/gin/pull/3522))
* refactor(context): SaveUploadedFile에 선택적 권한 파라미터 추가 ([#4068](https://github.com/gin-gonic/gin/pull/4068))
* refactor(context): initQueryCache()에서 URL 널 체크 추가 ([#3969](https://github.com/gin-gonic/gin/pull/3969))
* refactor(context): Negotiate에서 YAML 판별 로직 개선 ([#3966](https://github.com/gin-gonic/gin/pull/3966))
* tree: 자체 min 함수에서 공식 min으로 교체 ([#3975](https://github.com/gin-gonic/gin/pull/3975))
* context: filepath.Dir의 불필요한 사용 제거 ([#4181](https://github.com/gin-gonic/gin/pull/4181))

### 버그 수정

* fix: HandleContext에서 미들웨어 재진입 이슈 방지 ([#3987](https://github.com/gin-gonic/gin/pull/3987))
* fix(binding): decodeToml에서 중복 디코딩 방지 및 검증 추가 ([#4193](https://github.com/gin-gonic/gin/pull/4193))
* fix(gin): 빈 트리에서 허용되지 않은 메서드 처리시 패닉 방지 ([#4003](https://github.com/gin-gonic/gin/pull/4003))
* fix(gin): gin 모드 데이터 레이스 경고 ([#1580](https://github.com/gin-gonic/gin/pull/1580))
* fix(context): initQueryCache()에서 URL 널 체크 추가 ([#3969](https://github.com/gin-gonic/gin/pull/3969))
* fix(context): Negotiate에서 YAML 판별 로직 개선 ([#3966](https://github.com/gin-gonic/gin/pull/3966))
* fix(context): 핸들러 널 체크 ([#3413](https://github.com/gin-gonic/gin/pull/3413))
* fix(readme): 영어 문서 링크 깨짐 수정 ([#4222](https://github.com/gin-gonic/gin/pull/4222))
* fix(tree): 와일드카드 타입 빌드 실패 시 패닉 정보 일관성 유지 ([#4077](https://github.com/gin-gonic/gin/pull/4077))

### 빌드 및 CI 프로세스 업데이트

* ci: CI 워크플로우에 Trivy 취약점 스캔 통합 ([#4359](https://github.com/gin-gonic/gin/pull/4359))
* ci: CI/CD에서 Go 1.25 지원 ([#4341](https://github.com/gin-gonic/gin/pull/4341))
* build(deps): github.com/bytedance/sonic v1.13.2 → v1.14.0 업그레이드 ([#4342](https://github.com/gin-gonic/gin/pull/4342))
* ci: GitHub Actions에 Go 1.24 버전 추가 ([#4154](https://github.com/gin-gonic/gin/pull/4154))
* build: Gin 최소 Go 버전 1.21로 업데이트 ([#3960](https://github.com/gin-gonic/gin/pull/3960))
* ci(lint): 새로운 린터 활성화 (testifylint, usestdlibvars, perfsprint 등) ([#4010](https://github.com/gin-gonic/gin/pull/4010), [#4091](https://github.com/gin-gonic/gin/pull/4091), [#4090](https://github.com/gin-gonic/gin/pull/4090))
* ci(lint): 워크플로우 및 테스트 요청 일관성 개선 ([#4126](https://github.com/gin-gonic/gin/pull/4126))

### 의존성 업데이트

* chore(deps): google.golang.org/protobuf 1.36.6 → 1.36.9 업그레이드 ([#4346](https://github.com/gin-gonic/gin/pull/4346), [#4356](https://github.com/gin-gonic/gin/pull/4356))
* chore(deps): github.com/stretchr/testify 1.10.0 → 1.11.1 업그레이드 ([#4347](https://github.com/gin-gonic/gin/pull/4347))
* chore(deps): actions/setup-go 5 → 6 업그레이드 ([#4351](https://github.com/gin-gonic/gin/pull/4351))
* chore(deps): github.com/quic-go/quic-go 0.53.0 → 0.54.0 업그레이드 ([#4328](https://github.com/gin-gonic/gin/pull/4328))
* chore(deps): golang.org/x/net 0.33.0 → 0.38.0 업그레이드 ([#4178](https://github.com/gin-gonic/gin/pull/4178), [#4221](https://github.com/gin-gonic/gin/pull/4221))
* chore(deps): github.com/go-playground/validator/v10 10.20.0 → 10.22.1 업그레이드 ([#4052](https://github.com/gin-gonic/gin/pull/4052))

### 문서 업데이트

* docs(changelog): Gin v1.10.1 릴리즈 노트 업데이트 ([#4360](https://github.com/gin-gonic/gin/pull/4360))
* docs: doc/doc.md에서 영어 문법 오류 및 어색한 문장 수정 ([#4207](https://github.com/gin-gonic/gin/pull/4207))
* docs: Gin v1.10.0 문서 및 릴리즈 노트 업데이트 ([#3953](https://github.com/gin-gonic/gin/pull/3953))
* docs: Gin Quick Start 오타 수정 ([#3997](https://github.com/gin-gonic/gin/pull/3997))
* docs: 댓글 및 링크 문제 수정 ([#4205](https://github.com/gin-gonic/gin/pull/4205), [#3938](https://github.com/gin-gonic/gin/pull/3938))
* docs: 라우트 그룹 예제 코드 수정 ([#4020](https://github.com/gin-gonic/gin/pull/4020))
* docs(readme): 포르투갈어 문서 추가 ([#4078](https://github.com/gin-gonic/gin/pull/4078))
* docs(context): 몇몇 함수 이름 코멘트 수정 ([#4079](https://github.com/gin-gonic/gin/pull/4079))
