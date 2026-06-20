---
title: "使用 JSON 替换构建"
sidebar:
  order: 1
---

Gin 默认使用标准库的 `encoding/json` 包进行 JSON 序列化和反序列化。标准库编码器经过充分测试且完全兼容，但并非最快的选项。如果 JSON 性能是你应用的瓶颈——例如在序列化大量响应负载的高吞吐量 API 中——你可以在构建时使用构建标签替换为更快的替代品。无需更改代码。

## 可用的替换方案

Gin 支持三种替代 JSON 编码器。每一种都实现了 Gin 期望的相同接口，因此你的处理函数、中间件和绑定逻辑无需修改即可继续工作。

### go-json

[go-json](https://github.com/goccy/go-json) 是一个纯 Go 的 JSON 编码器，相比 `encoding/json` 提供了显著的性能提升，同时保持完全兼容。它适用于所有平台和架构。

```sh
go build -tags=go_json .
```

### jsoniter

[jsoniter](https://github.com/json-iterator/go)（json-iterator）是另一个纯 Go 的高性能 JSON 库。它与 `encoding/json` API 兼容，并为高级用例提供了灵活的配置系统。

```sh
go build -tags=jsoniter .
```

### sonic

[sonic](https://github.com/bytedance/sonic) 是由字节跳动开发的极速 JSON 编码器。它使用 JIT 编译和 SIMD 指令来实现最大吞吐量，是三者中最快的选项。

```sh
go build -tags="sonic avx" .
```

:::note
Sonic 需要支持 AVX 指令集的 CPU。这在大多数现代 x86_64 处理器（Intel Sandy Bridge 及更新、AMD Bulldozer 及更新）上可用，但不适用于 ARM 架构或较旧的 x86 硬件。如果你的部署目标不支持 AVX，请使用 go-json 或 jsoniter。
:::

## 选择替换方案

| 编码器 | 平台支持 | 主要优势 |
|---|---|---|
| `encoding/json`（默认） | 所有 | 最大兼容性，无额外依赖 |
| go-json | 所有 | 良好的加速效果，纯 Go，广泛兼容 |
| jsoniter | 所有 | 良好的加速效果，灵活的配置 |
| sonic | 仅支持 AVX 的 x86_64 | 通过 JIT 和 SIMD 实现最高吞吐量 |

对于大多数应用，**go-json** 是安全且有效的选择——它在所有平台上都能工作并提供有意义的性能提升。当你需要最大 JSON 吞吐量且服务器运行在 x86_64 硬件上时，选择 **sonic**。如果你需要其特定的配置功能或已经在代码库的其他地方使用它，选择 **jsoniter**。

## 验证替换

你可以通过简单的基准测试比较序列化性能，或通过检查二进制文件的符号表来确认替换是否生效：

```sh
# Build with go-json
go build -tags=go_json -o myapp .

# Check that go-json symbols are present
go tool nm myapp | grep goccy
```

构建标签也适用于其他 Go 命令：

```sh
go run -tags=go_json .
go test -tags=go_json ./...
```

:::note
一次只使用一个 JSON 替换标签。如果你指定多个 JSON 标签（例如 `-tags=go_json,jsoniter`），行为是未定义的。`nomsgpack` 标签可以安全地与任何 JSON 替换标签组合使用。
:::
