---
title: "Jsoniter"
draft: false
weight: 5
---

## [jsoniter](https://github.com/json-iterator/go)로 빌드하기

Gin은 기본적인 json 패키지로 `encoding/json` 를 사용하지만, 다른 태그로 빌드 하기 위해 [jsoniter](https://github.com/json-iterator/go)를 사용하는 것도 가능합니다.

```sh
$ go build -tags=jsoniter .
```
