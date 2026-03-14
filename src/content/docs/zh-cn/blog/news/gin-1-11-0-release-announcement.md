---
title: "Gin 1.11.0 发布公告：HTTP/3、表单改进、性能提升及更多"
linkTitle: "Gin 1.11.0 发布公告"
lastUpdated: 2025-09-21
---

## Gin v1.11.0 正式发布

我们很高兴地宣布 Gin v1.11.0 的发布，为这个备受喜爱的 Web 框架带来了一系列重大新功能、性能优化和错误修复。此版本延续了 Gin 对速度、灵活性和现代 Go 开发的承诺。

### 主要特性

- **实验性 HTTP/3 支持：** Gin 现在通过 [quic-go](https://github.com/quic-go/quic-go) 支持实验性 HTTP/3！如果你渴望尝试最新的 Web 传输协议，现在是你的机会。（[#3210](https://github.com/gin-gonic/gin/pull/3210)）

- **更好的表单绑定：** 我们对表单绑定做了重大改进：
  - 支持表单中的数组集合格式（[#3986](https://github.com/gin-gonic/gin/pull/3986)）
  - 表单标签的自定义字符串切片反序列化（[#3970](https://github.com/gin-gonic/gin/pull/3970)）
  - 集合的默认值（[#4048](https://github.com/gin-gonic/gin/pull/4048)）

- **增强的绑定类型：** 使用新的 `BindPlain` 方法轻松绑定纯文本（[#3904](https://github.com/gin-gonic/gin/pull/3904)），以及支持 unixMilli 和 unixMicro 格式（[#4190](https://github.com/gin-gonic/gin/pull/4190)）。

- **Context API 改进：** `GetXxx` 现在支持更多原生 Go 类型（[#3633](https://github.com/gin-gonic/gin/pull/3633)），使类型安全的上下文数据检索更加容易。

- **文件系统更新：** 新的 `OnlyFilesFS` 现已导出、测试和记录（[#3939](https://github.com/gin-gonic/gin/pull/3939)）。

### 性能和增强

- **更快的表单数据处理：** 表单解析的内部优化提升了性能（[#4339](https://github.com/gin-gonic/gin/pull/4339)）。
- 重构了核心、渲染和上下文逻辑，提高了健壮性和清晰度（[完整 PR 列表见变更日志](../releases/release111.md)）。

### 错误修复

- **中间件可靠性：** 修复了中间件可能意外重新进入的罕见错误（[#3987](https://github.com/gin-gonic/gin/pull/3987)）。
- 改进了 TOML 表单绑定稳定性（[#4193](https://github.com/gin-gonic/gin/pull/4193)）。
- 在空树上处理"方法不允许"请求时不再 panic（[#4003](https://github.com/gin-gonic/gin/pull/4003)）。
- 上下文处理、竞态条件等方面的一般改进。

### 构建、依赖和 CI 更新

- 在 CI/CD 工作流中支持 **Go 1.25**，并启用了新的 linter 以实现更严格的代码健康检查（[#4341](https://github.com/gin-gonic/gin/pull/4341)、[#4010](https://github.com/gin-gonic/gin/pull/4010)）。
- Trivy 漏洞扫描现已集成到 CI 中（[#4359](https://github.com/gin-gonic/gin/pull/4359)）。
- 多项依赖升级，包括 `sonic`、`setup-go`、`quic-go` 等。

### 文档

- 扩展了文档，更新了变更日志，改进了语法和代码示例，并新增了葡萄牙语文档（[#4078](https://github.com/gin-gonic/gin/pull/4078)）。

---

Gin 1.11.0 是我们活跃社区和持续开发的见证。我们感谢每一位贡献者、问题报告者和用户，是你们让 Gin 在现代 Web 应用中保持敏锐和相关。

准备好试用 Gin 1.11.0 了吗？[在 GitHub 上升级](https://github.com/gin-gonic/gin/releases/tag/v1.11.0)并告诉我们你的想法！
