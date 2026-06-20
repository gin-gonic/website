---
title: "构建标签"
sidebar:
  order: 11
---

Go [构建标签](https://pkg.go.dev/go/build#hdr-Build_Constraints)（也称为构建约束）是告诉 Go 编译器在编译期间包含或排除文件的指令。Gin 使用构建标签让你可以在编译时替换内部实现或禁用可选功能，而无需更改任何应用代码。

这在以下场景中很有用：

- **性能优化** -- 用更快的第三方编码器替换默认的 `encoding/json` 包，以加速 API 中的 JSON 序列化。
- **减小二进制体积** -- 剥离你不使用的功能（如 MsgPack 渲染），以生成更小的编译二进制文件。
- **部署调优** -- 为不同环境选择不同的编码器（例如高吞吐量的生产构建与标准的开发构建）。

构建标签通过 `-tags` 标志传递给 Go 工具链：

```sh
go build -tags=<tag_name> .
```

你可以通过逗号分隔来组合多个标签：

```sh
go build -tags=nomsgpack,go_json .
```

### 可用的构建标签

| 标签 | 效果 |
|---|---|
| `go_json` | 将 `encoding/json` 替换为 [go-json](https://github.com/goccy/go-json) |
| `jsoniter` | 将 `encoding/json` 替换为 [jsoniter](https://github.com/json-iterator/go) |
| `sonic avx` | 将 `encoding/json` 替换为 [sonic](https://github.com/bytedance/sonic)（需要 AVX CPU 指令集） |
| `nomsgpack` | 禁用 MsgPack 渲染支持 |

:::note
构建标签仅影响 Gin 的编译方式。你的应用代码（路由处理函数、中间件等）在切换标签时不需要更改。
:::

## 本节内容

以下页面详细介绍每个构建标签：

- [**使用 JSON 替换构建**](./json-replacement/) -- 用 go-json、jsoniter 或 sonic 替换默认的 JSON 编码器以加速序列化。
- [**不使用 MsgPack 构建**](./nomsgpack/) -- 使用 `nomsgpack` 构建标签禁用 MsgPack 渲染以减小二进制体积。
