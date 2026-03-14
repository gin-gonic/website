---
title: "Build with JSON replacement"
sidebar:
  order: 1
---

Gin uses the standard library `encoding/json` package for JSON serialization and deserialization by default. The standard library encoder is well-tested and fully compatible, but it is not the fastest option available. If JSON performance is a bottleneck in your application -- for example, in high-throughput APIs that serialize large response payloads -- you can swap in a faster drop-in replacement at build time using build tags. No code changes are required.

## Available replacements

Gin supports three alternative JSON encoders. Each one implements the same interface that Gin expects, so your handlers, middleware, and binding logic continue to work without modification.

### go-json

[go-json](https://github.com/goccy/go-json) is a pure-Go JSON encoder that offers significant performance improvements over `encoding/json` while maintaining full compatibility. It works on all platforms and architectures.

```sh
go build -tags=go_json .
```

### jsoniter

[jsoniter](https://github.com/json-iterator/go) (json-iterator) is another pure-Go, high-performance JSON library. It is API-compatible with `encoding/json` and provides a flexible configuration system for advanced use cases.

```sh
go build -tags=jsoniter .
```

### sonic

[sonic](https://github.com/bytedance/sonic) is a blazing-fast JSON encoder developed by ByteDance. It uses JIT compilation and SIMD instructions to achieve maximum throughput, making it the fastest option among the three.

```sh
go build -tags="sonic avx" .
```

:::note
Sonic requires a CPU with AVX instruction support. This is available on most modern x86_64 processors (Intel Sandy Bridge and later, AMD Bulldozer and later), but it will not work on ARM architectures or older x86 hardware. If your deployment target does not support AVX, use go-json or jsoniter instead.
:::

## Choosing a replacement

| Encoder | Platform support | Key strength |
|---|---|---|
| `encoding/json` (default) | All | Maximum compatibility, no extra dependency |
| go-json | All | Good speedup, pure Go, broad compatibility |
| jsoniter | All | Good speedup, flexible configuration |
| sonic | x86_64 with AVX only | Highest throughput via JIT and SIMD |

For most applications, **go-json** is a safe and effective choice -- it works everywhere and provides meaningful performance gains. Choose **sonic** when you need maximum JSON throughput and your servers run on x86_64 hardware. Choose **jsoniter** if you need its specific configuration features or are already using it elsewhere in your codebase.

## Verifying the replacement

You can confirm that the replacement is active by comparing serialization performance with a simple benchmark, or by checking the binary's symbol table:

```sh
# Build with go-json
go build -tags=go_json -o myapp .

# Check that go-json symbols are present
go tool nm myapp | grep goccy
```

The build tag also works with other Go commands:

```sh
go run -tags=go_json .
go test -tags=go_json ./...
```

:::note
Only use one JSON replacement tag at a time. If you specify multiple JSON tags (e.g., `-tags=go_json,jsoniter`), the behavior is undefined. The `nomsgpack` tag can be safely combined with any JSON replacement tag.
:::
