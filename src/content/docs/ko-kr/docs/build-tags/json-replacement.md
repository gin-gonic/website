---
title: "JSON 교체로 빌드"
sidebar:
  order: 1
---

Gin은 기본적으로 JSON 직렬화 및 역직렬화에 표준 라이브러리 `encoding/json` 패키지를 사용합니다. 표준 라이브러리 인코더는 충분히 테스트되었고 완전히 호환되지만, 가장 빠른 옵션은 아닙니다. JSON 성능이 애플리케이션의 병목인 경우 -- 예를 들어, 대규모 응답 페이로드를 직렬화하는 고처리량 API -- 빌드 태그를 사용하여 빌드 시점에 더 빠른 드롭인 대체를 교체할 수 있습니다. 코드 변경은 필요하지 않습니다.

## 사용 가능한 대체

Gin은 세 가지 대체 JSON 인코더를 지원합니다. 각각 Gin이 기대하는 동일한 인터페이스를 구현하므로 핸들러, 미들웨어, 바인딩 로직이 수정 없이 계속 작동합니다.

### go-json

[go-json](https://github.com/goccy/go-json)은 순수 Go JSON 인코더로 완전한 호환성을 유지하면서 `encoding/json`에 비해 상당한 성능 향상을 제공합니다. 모든 플랫폼과 아키텍처에서 작동합니다.

```sh
go build -tags=go_json .
```

### jsoniter

[jsoniter](https://github.com/json-iterator/go) (json-iterator)는 또 다른 순수 Go 고성능 JSON 라이브러리입니다. `encoding/json`과 API 호환이며 고급 사용 사례를 위한 유연한 구성 시스템을 제공합니다.

```sh
go build -tags=jsoniter .
```

### sonic

[sonic](https://github.com/bytedance/sonic)은 ByteDance에서 개발한 초고속 JSON 인코더입니다. JIT 컴파일과 SIMD 명령어를 사용하여 최대 처리량을 달성하며, 세 가지 중 가장 빠른 옵션입니다.

```sh
go build -tags="sonic avx" .
```

:::note
Sonic은 AVX 명령어 지원이 있는 CPU가 필요합니다. 대부분의 최신 x86_64 프로세서(Intel Sandy Bridge 이후, AMD Bulldozer 이후)에서 사용 가능하지만, ARM 아키텍처나 구형 x86 하드웨어에서는 작동하지 않습니다. 배포 대상이 AVX를 지원하지 않는 경우, go-json이나 jsoniter를 대신 사용하세요.
:::

## 대체 선택

| 인코더 | 플랫폼 지원 | 주요 강점 |
|---|---|---|
| `encoding/json` (기본값) | 모든 플랫폼 | 최대 호환성, 추가 의존성 없음 |
| go-json | 모든 플랫폼 | 좋은 속도 향상, 순수 Go, 넓은 호환성 |
| jsoniter | 모든 플랫폼 | 좋은 속도 향상, 유연한 구성 |
| sonic | AVX 지원 x86_64만 | JIT 및 SIMD를 통한 최고 처리량 |

대부분의 애플리케이션에서 **go-json**은 안전하고 효과적인 선택입니다 -- 모든 곳에서 작동하며 의미 있는 성능 향상을 제공합니다. 최대 JSON 처리량이 필요하고 서버가 x86_64 하드웨어에서 실행되는 경우 **sonic**을 선택하세요. 특정 구성 기능이 필요하거나 코드베이스의 다른 곳에서 이미 사용 중인 경우 **jsoniter**를 선택하세요.

## 대체 확인

간단한 벤치마크로 직렬화 성능을 비교하거나 바이너리의 심볼 테이블을 확인하여 대체가 활성화되었는지 확인할 수 있습니다:

```sh
# go-json으로 빌드
go build -tags=go_json -o myapp .

# go-json 심볼이 있는지 확인
go tool nm myapp | grep goccy
```

빌드 태그는 다른 Go 명령어에서도 작동합니다:

```sh
go run -tags=go_json .
go test -tags=go_json ./...
```

:::note
한 번에 하나의 JSON 대체 태그만 사용하세요. 여러 JSON 태그를 지정하면 (예: `-tags=go_json,jsoniter`), 동작이 정의되지 않습니다. `nomsgpack` 태그는 모든 JSON 대체 태그와 안전하게 결합할 수 있습니다.
:::
