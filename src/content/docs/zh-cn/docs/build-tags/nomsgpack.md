---
title: "不使用 MsgPack 构建"
sidebar:
  order: 2
---

[MsgPack](https://msgpack.org/)（MessagePack）是一种紧凑的二进制序列化格式——可以将其视为 JSON 的更快、更小的替代品。Gin 默认包含 MsgPack 渲染和绑定支持，这意味着你的应用可以开箱即用地使用 `c.Bind()` 和 `c.Render()` 以适当的内容类型接受和返回 MsgPack 编码的数据。

然而，许多应用只使用 JSON，从不需要 MsgPack。在这种情况下，MsgPack 依赖会给编译后的二进制文件增加不必要的体积。你可以使用 `nomsgpack` 构建标签将其剥离。

## 不使用 MsgPack 构建

将 `nomsgpack` 标签传递给 `go build`：

```sh
go build -tags=nomsgpack .
```

这也适用于其他 Go 命令：

```sh
go run -tags=nomsgpack .
go test -tags=nomsgpack ./...
```

## 有什么变化

当你使用 `nomsgpack` 构建时，Gin 会在编译时排除 MsgPack 渲染和绑定代码。这会产生以下实际影响：

- 编译后的二进制文件更小，因为 MsgPack 序列化库不会被链接进来。
- 任何尝试渲染或绑定 MsgPack 数据的处理函数将不再工作。如果你使用 `c.ProtoBuf()` 或其他非 MsgPack 渲染器，它们不受影响。
- 所有 JSON、XML、YAML、TOML 和 ProtoBuf 功能继续正常工作。

:::note
如果你的 API 不提供 MsgPack 响应，并且你没有在任何地方调用 `c.MsgPack()`，那么使用此标签是安全的。你现有的 JSON 和 HTML 处理函数的行为将完全相同。
:::

## 验证结果

你可以通过比较构建来确认二进制文件大小的减少：

```sh
# Standard build
go build -o gin-app .
ls -lh gin-app

# Build without MsgPack
go build -tags=nomsgpack -o gin-app-nomsgpack .
ls -lh gin-app-nomsgpack
```

确切的节省量取决于你的应用，但移除 MsgPack 通常会减少最终二进制文件的一小部分体积。更多背景信息请参阅[原始 Pull Request](https://github.com/gin-gonic/gin/pull/1852)。
