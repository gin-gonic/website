---
title: "Gin 1.12.0 릴리스됨"
linkTitle: "Gin 1.12.0 릴리스됨"
lastUpdated: 2026-02-28
---

## Gin v1.12.0

### 기능

* feat(binding): uri/query 바인딩에서 encoding.UnmarshalText 지원 추가 ([#4203](https://github.com/gin-gonic/gin/pull/4203))
* feat(context): 오류 검색을 위한 GetError 및 GetErrorSlice 메서드 추가 ([#4502](https://github.com/gin-gonic/gin/pull/4502))
* feat(context): 콘텐츠 협상에 Protocol Buffers 지원 추가 ([#4423](https://github.com/gin-gonic/gin/pull/4423))
* feat(context): Delete 메서드 구현 ([#4296](https://github.com/gin-gonic/gin/pull/4296))
* feat(gin): 이스케이프된 경로를 사용하는 옵션 추가 ([#4420](https://github.com/gin-gonic/gin/pull/4420))
* feat(logger): 색상 지연 ([#4146](https://github.com/gin-gonic/gin/pull/4146))
* feat(render): bson 프로토콜 추가 ([#4145](https://github.com/gin-gonic/gin/pull/4145))

### 버그 수정

* fix(binding): 빈 값 오류 ([#2169](https://github.com/gin-gonic/gin/pull/2169))
* fix(binding): 폼 바인딩의 빈 슬라이스/배열 처리 개선 ([#4380](https://github.com/gin-gonic/gin/pull/4380))
* fix(context): 여러 X-Forwarded-For 헤더 값에 대한 ClientIP 처리 수정 ([#4472](https://github.com/gin-gonic/gin/pull/4472))
* fix(debug): 버전 불일치 ([#4403](https://github.com/gin-gonic/gin/pull/4403))
* fix(gin): 리소스 누수를 방지하기 위해 RunFd에서 os.File 닫기 ([#4422](https://github.com/gin-gonic/gin/pull/4422))
* fix(gin): engine.Handler()와 작동하지 않는 리터럴 콜론 경로 수정 ([#4415](https://github.com/gin-gonic/gin/pull/4415))
* fix(recover): recover에서 http.ErrAbortHandler 억제 ([#4336](https://github.com/gin-gonic/gin/pull/4336))
* fix(render): Data.Render에 콘텐츠 길이 작성 ([#4206](https://github.com/gin-gonic/gin/pull/4206))
* fix(response): 응답 수명 주기의 하이재킹 동작 개선 ([#4373](https://github.com/gin-gonic/gin/pull/4373))
* fix(tree): RedirectFixedPath가 포함된 findCaseInsensitivePathRec의 패닉 수정 ([#4535](https://github.com/gin-gonic/gin/pull/4535))
* fix: 오타 수정, 문서 명확성 개선, 데드 코드 제거 ([#4511](https://github.com/gin-gonic/gin/pull/4511))

### 개선 사항

* chore(binding): bson 의존성을 mongo-driver v2로 업그레이드 ([#4549](https://github.com/gin-gonic/gin/pull/4549))
* chore(context): unix 소켓에서 xff 헤더를 항상 신뢰 ([#3359](https://github.com/gin-gonic/gin/pull/3359))
* chore(deps): golang.org/x/crypto를 v0.45.0으로 업그레이드 ([#4449](https://github.com/gin-gonic/gin/pull/4449))
* chore(deps): quic-go를 v0.57.1로 업그레이드 ([#4532](https://github.com/gin-gonic/gin/pull/4532))
* chore(logger): 쿼리 문자열 출력 건너뛰기 허용 ([#4547](https://github.com/gin-gonic/gin/pull/4547))
* chore(response): `http.Flusher`가 있을 때 Flush() 패닉 방지 ([#4479](https://github.com/gin-gonic/gin/pull/4479))

### 리팩토링

* refactor(binding): 깔끔한 맵 처리를 위해 maps.Copy 사용 ([#4352](https://github.com/gin-gonic/gin/pull/4352))
* refactor(context): 반환 값 이름 생략 ([#4395](https://github.com/gin-gonic/gin/pull/4395))
* refactor(context): 하드코딩된 localhost IP를 상수로 바꾸기 ([#4481](https://github.com/gin-gonic/gin/pull/4481))
* refactor(context): maps.Clone 사용 ([#4333](https://github.com/gin-gonic/gin/pull/4333))
* refactor(ginS): sync.OnceValue를 사용하여 엔진 함수 단순화 ([#4314](https://github.com/gin-gonic/gin/pull/4314))
* refactor(recovery): 스마트 오류 비교 ([#4142](https://github.com/gin-gonic/gin/pull/4142))
* refactor(utils): 유틸리티 함수를 utils.go로 이동 ([#4467](https://github.com/gin-gonic/gin/pull/4467))
* refactor: for 루프를 int에 대한 범위를 사용하여 현대화할 수 있습니다 ([#4392](https://github.com/gin-gonic/gin/pull/4392))
* refactor: bodyAllowedForStatus의 매직 숫자를 명명된 상수로 바꾸기 ([#4529](https://github.com/gin-gonic/gin/pull/4529))
* refactor: b.Loop()를 사용하여 코드를 단순화하고 성능 개선 ([#4389](https://github.com/gin-gonic/gin/pull/4389), [#4432](https://github.com/gin-gonic/gin/pull/4432))

### 빌드 프로세스 업데이트 / CI

* ci(bot): 의존성 업데이트 빈도 증가 및 그룹화 ([#4367](https://github.com/gin-gonic/gin/pull/4367))
* ci(lint): 테스트 어설션 및 린터 설정 리팩토링 ([#4436](https://github.com/gin-gonic/gin/pull/4436))
* ci(sec): HTTP 미들웨어의 타입 안정성 및 서버 구성 개선 ([#4437](https://github.com/gin-gonic/gin/pull/4437))
* ci(sec): Trivy 보안 스캔을 매일 UTC 자정에 실행하도록 예약 ([#4439](https://github.com/gin-gonic/gin/pull/4439))
* ci: 취약점 스캔 워크플로우를 Trivy 통합으로 대체 ([#4421](https://github.com/gin-gonic/gin/pull/4421))
* ci: CI 워크플로우 업데이트 및 Trivy 설정 따옴표 표준화 ([#4531](https://github.com/gin-gonic/gin/pull/4531))
* ci: CI 및 문서 전체에서 Go 버전 지원을 1.25+로 업데이트 ([#4550](https://github.com/gin-gonic/gin/pull/4550))

### 문서 업데이트

* docs(README): Trivy 보안 스캔 배지 추가 ([#4426](https://github.com/gin-gonic/gin/pull/4426))
* docs(context): ShouldBind\* 메서드의 예제 댓글 추가 ([#4428](https://github.com/gin-gonic/gin/pull/4428))
* docs(context): 일부 댓글 수정 ([#4396](https://github.com/gin-gonic/gin/pull/4396))
* docs(context): 댓글의 잘못된 함수 이름 수정 ([#4382](https://github.com/gin-gonic/gin/pull/4382))
* docs(readme): 명확성과 완전성을 위해 문서 전개 및 확장 ([#4362](https://github.com/gin-gonic/gin/pull/4362))
* docs: 블로그 링크와 함께 Gin 1.11.0 릴리스 공지 ([#4363](https://github.com/gin-gonic/gin/pull/4363))
* docs: Gin v1.12.0 릴리스 문서화 및 최종화 ([#4551](https://github.com/gin-gonic/gin/pull/4551))
* docs: GitHub 기여 및 지원 템플릿 전개 ([#4364](https://github.com/gin-gonic/gin/pull/4364))
* docs: 종합적인 지침으로 기여 가이드라인 전개 ([#4365](https://github.com/gin-gonic/gin/pull/4365))
* docs: Go 버전 변경사항을 반영하도록 문서 업데이트 ([#4552](https://github.com/gin-gonic/gin/pull/4552))
* docs: 손상된 문서 링크에 대한 기능 문서 지침 업데이트 ([#4508](https://github.com/gin-gonic/gin/pull/4508))

### 성능

* perf(path): redirectTrailingSlash에서 정규식을 사용자 정의 함수로 바꾸기 ([#4414](https://github.com/gin-gonic/gin/pull/4414))
* perf(recovery): 스택 함수의 라인 읽기 최적화 ([#4466](https://github.com/gin-gonic/gin/pull/4466))
* perf(tree): strings.Count를 사용한 경로 파싱 최적화 ([#4246](https://github.com/gin-gonic/gin/pull/4246))
* perf(tree): findCaseInsensitivePath의 할당 감소 ([#4417](https://github.com/gin-gonic/gin/pull/4417))

### 테스트

* test(benchmarks): 잘못된 함수 이름 수정 ([#4375](https://github.com/gin-gonic/gin/pull/4375))
* test(bytesconv): 빈/nil 경우에 대한 테스트 추가 ([#4454](https://github.com/gin-gonic/gin/pull/4454))
* test(context): 매직 숫자 100 대신 http.StatusContinue 상수 사용 ([#4542](https://github.com/gin-gonic/gin/pull/4542))
* test(debug): debug.go의 테스트 커버리지를 100%로 개선 ([#4404](https://github.com/gin-gonic/gin/pull/4404))
* test(gin): ginS 패키지의 포괄적인 테스트 커버리지 추가 ([#4442](https://github.com/gin-gonic/gin/pull/4442))
* test(gin): 통합 테스트의 경쟁 조건 해결 ([#4453](https://github.com/gin-gonic/gin/pull/4453))
* test(render): 포괄적인 오류 처리 테스트 추가 ([#4541](https://github.com/gin-gonic/gin/pull/4541))
* test(render): MsgPack 렌더링에 대한 포괄적인 테스트 추가 ([#4537](https://github.com/gin-gonic/gin/pull/4537))
