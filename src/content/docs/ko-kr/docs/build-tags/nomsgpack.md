---
title: "MsgPack 없이 빌드"
sidebar:
  order: 2
---

[MsgPack](https://msgpack.org/) (MessagePack)은 컴팩트한 바이너리 직렬화 형식입니다 -- JSON보다 더 빠르고 작은 대안이라고 생각하면 됩니다. Gin은 기본적으로 MsgPack 렌더링 및 바인딩 지원을 포함하고 있으며, 이는 적절한 content type으로 `c.Bind()`와 `c.Render()`를 사용하여 MsgPack 인코딩 데이터를 즉시 수신하고 반환할 수 있음을 의미합니다.

그러나 많은 애플리케이션은 JSON만 사용하고 MsgPack은 필요하지 않습니다. 이 경우 MsgPack 의존성이 컴파일된 바이너리에 불필요한 무게를 추가합니다. `nomsgpack` 빌드 태그로 이를 제거할 수 있습니다.

## MsgPack 없이 빌드하기

`go build`에 `nomsgpack` 태그를 전달합니다:

```sh
go build -tags=nomsgpack .
```

다른 Go 명령어에서도 작동합니다:

```sh
go run -tags=nomsgpack .
go test -tags=nomsgpack ./...
```

## 변경 사항

`nomsgpack`으로 빌드하면 Gin은 컴파일 시점에 MsgPack 렌더링 및 바인딩 코드를 제외합니다. 이로 인한 몇 가지 실질적인 효과가 있습니다:

- MsgPack 직렬화 라이브러리가 링크되지 않으므로 컴파일된 바이너리가 더 작아집니다.
- MsgPack 데이터를 렌더링하거나 바인딩하려는 핸들러는 더 이상 작동하지 않습니다. `c.ProtoBuf()`나 다른 비MsgPack 렌더러를 사용하는 경우에는 영향을 받지 않습니다.
- 모든 JSON, XML, YAML, TOML 및 ProtoBuf 기능은 정상적으로 계속 작동합니다.

:::note
API가 MsgPack 응답을 제공하지 않고 코드 어디에서도 `c.MsgPack()`을 호출하지 않는다면, 이 태그를 안전하게 사용할 수 있습니다. 기존 JSON 및 HTML 핸들러는 동일하게 동작합니다.
:::

## 결과 확인

빌드를 비교하여 바이너리 크기 감소를 확인할 수 있습니다:

```sh
# 표준 빌드
go build -o gin-app .
ls -lh gin-app

# MsgPack 없이 빌드
go build -tags=nomsgpack -o gin-app-nomsgpack .
ls -lh gin-app-nomsgpack
```

정확한 절감 효과는 애플리케이션에 따라 다르지만, MsgPack을 제거하면 일반적으로 최종 바이너리에서 약간의 용량이 줄어듭니다. 자세한 배경은 [원본 풀 리퀘스트](https://github.com/gin-gonic/gin/pull/1852)를 참조하세요.
