---
title: "빌드 태그"
sidebar:
  order: 11
---

Go [빌드 태그](https://pkg.go.dev/go/build#hdr-Build_Constraints)(빌드 제약 조건이라고도 함)는 컴파일 중 파일을 포함하거나 제외하도록 Go 컴파일러에 지시하는 지시문입니다. Gin은 빌드 태그를 사용하여 애플리케이션 코드를 변경하지 않고 컴파일 시점에 내부 구현을 교체하거나 선택적 기능을 비활성화할 수 있습니다.

이는 여러 시나리오에서 유용합니다:

- **성능 최적화** -- 기본 `encoding/json` 패키지를 더 빠른 서드파티 인코더로 교체하여 API의 JSON 직렬화 속도를 높입니다.
- **바이너리 크기 감소** -- MsgPack 렌더링과 같이 사용하지 않는 기능을 제거하여 더 작은 컴파일 바이너리를 생성합니다.
- **배포 튜닝** -- 환경에 따라 다른 인코더를 선택합니다 (예: 고처리량 프로덕션 빌드 vs. 표준 개발 빌드).

빌드 태그는 `-tags` 플래그를 사용하여 Go 툴체인에 전달됩니다:

```sh
go build -tags=<tag_name> .
```

여러 태그를 쉼표로 구분하여 결합할 수 있습니다:

```sh
go build -tags=nomsgpack,go_json .
```

### 사용 가능한 빌드 태그

| 태그 | 효과 |
|---|---|
| `go_json` | `encoding/json`을 [go-json](https://github.com/goccy/go-json)으로 교체 |
| `jsoniter` | `encoding/json`을 [jsoniter](https://github.com/json-iterator/go)로 교체 |
| `sonic avx` | `encoding/json`을 [sonic](https://github.com/bytedance/sonic)으로 교체 (AVX CPU 명령어 필요) |
| `nomsgpack` | MsgPack 렌더링 지원 비활성화 |

:::note
빌드 태그는 Gin이 컴파일되는 방식에만 영향을 줍니다. 애플리케이션 코드(라우트 핸들러, 미들웨어 등)는 태그를 전환할 때 변경할 필요가 없습니다.
:::

## 이 섹션의 내용

아래 페이지에서 각 빌드 태그를 자세히 다룹니다:

- [**JSON 교체로 빌드**](./json-replacement/) -- 기본 JSON 인코더를 go-json, jsoniter 또는 sonic으로 교체하여 더 빠른 직렬화를 달성합니다.
- [**MsgPack 없이 빌드**](./nomsgpack/) -- `nomsgpack` 빌드 태그로 MsgPack 렌더링을 비활성화하여 바이너리 크기를 줄입니다.
