---
title: "인코딩"
sidebar:
  order: 5
---

### JSON 패키지 교체하여 빌드하기

Gin은 기본적으로 `encoding/json`을 JSON 패키지로 사용하지만, 다른 태그를 사용하여 빌드함으로써 변경할 수 있습니다.

[go-json](https://github.com/goccy/go-json)
```sh
go build -tags=go_json .
```

[jsoniter](https://github.com/json-iterator/go)
```sh
go build -tags=jsoniter .
```

[sonic](https://github.com/bytedance/sonic) (CPU가 AVX 명령어를 지원하는지 확인해야 합니다.)
```sh
$ go build -tags="sonic avx" .
```