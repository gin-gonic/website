---
title: "ビルドタグ"
sidebar:
  order: 11
---

Go [build tags](https://pkg.go.dev/go/build#hdr-Build_Constraints) (also called build constraints) are directives that tell the Go compiler to include or exclude files during compilation. Gin uses build tags to let you swap out internal implementations or disable optional features at compile time, without changing any application code.

This is useful in several scenarios:

- **Performance optimization** -- Replace the default `encoding/json` package with a faster third-party encoder to speed up JSON serialization in your API.
- **Binary size reduction** -- Strip out features you do not use, such as MsgPack rendering, to produce a smaller compiled binary.
- **Deployment tuning** -- Choose different encoders for different environments (e.g., a high-throughput production build vs. a standard development build).

Build tags are passed to the Go toolchain with the `-tags` flag:

```sh
go build -tags=<tag_name> .
```

You can combine multiple tags by separating them with commas:

```sh
go build -tags=nomsgpack,go_json .
```

### Available build tags

| Tag | Effect |
|---|---|
| `go_json` | Replaces `encoding/json` with [go-json](https://github.com/goccy/go-json) |
| `jsoniter` | Replaces `encoding/json` with [jsoniter](https://github.com/json-iterator/go) |
| `sonic avx` | Replaces `encoding/json` with [sonic](https://github.com/bytedance/sonic) (requires AVX CPU instructions) |
| `nomsgpack` | Disables MsgPack rendering support |

:::note
Build tags only affect how Gin is compiled. Your application code (route handlers, middleware, etc.) does not need to change when you switch tags.
:::

## In this section

The pages below cover each build tag in detail:

- [**Build with JSON replacement**](./json-replacement/) -- Replace the default JSON encoder with go-json, jsoniter, or sonic for faster serialization.
- [**Build without MsgPack**](./nomsgpack/) -- Disable MsgPack rendering with the `nomsgpack` build tag to reduce binary size.
