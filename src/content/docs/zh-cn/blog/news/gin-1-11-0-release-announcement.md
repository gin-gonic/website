---
title: "Gin 1.11.0 发布啦：HTTP/3、表单优化、性能提升及更多"
linkTitle: "Gin 1.11.0 发布公告"
lastUpdated: 2025-09-21
---

## Gin v1.11.0 正式发布

我们很高兴地宣布 Gin v1.11.0 发布，为深受喜爱的 Go Web 框架带来了众多新功能、性能优化和 Bug 修复。Gin 依然专注于速度、灵活性与现代 Go 开发体验。

### 🌟 主要新功能

- **实验性 HTTP/3 支持：** 现在 Gin 通过 [quic-go](https://github.com/quic-go/quic-go) 提供了对 HTTP/3 的实验性支持！如果你想尝鲜新一代 Web 协议，不妨试试。([#3210](https://github.com/gin-gonic/gin/pull/3210))

- **表单绑定能力增强：**
  - 表单绑定支持数组集合格式 ([#3986](https://github.com/gin-gonic/gin/pull/3986))
  - 支持表单标签自定义字符串切片解析 ([#3970](https://github.com/gin-gonic/gin/pull/3970))
  - 集合类型支持默认值 ([#4048](https://github.com/gin-gonic/gin/pull/4048))

- **Binding 类型扩展：** 新增 `BindPlain` 方法，轻松绑定纯文本 ([#3904](https://github.com/gin-gonic/gin/pull/3904))，同时支持 unixMilli 与 unixMicro 格式 ([#4190](https://github.com/gin-gonic/gin/pull/4190))。

- **Context API 优化：** `GetXxx` 现已支持更多 Go 原生类型 ([#3633](https://github.com/gin-gonic/gin/pull/3633))，类型安全获取 context 数据更容易。

- **文件系统扩展：** 新的 `OnlyFilesFS` 已经导出并完整测试与文档化 ([#3939](https://github.com/gin-gonic/gin/pull/3939))。

### 🚀 性能与优化

- **表单数据处理更快：** 内部对于表单解析做了优化，提升处理性能 ([#4339](https://github.com/gin-gonic/gin/pull/4339))。
- 核心、渲染与 Context 逻辑重构，增强健壮性与代码可读性（[完整 PR 列表见 changelog](../releases/release111.md)）。

### 🐛 Bug 修复

- **中间件更可靠：** 修复了 rare middleware re-entry 问题 ([#3987](https://github.com/gin-gonic/gin/pull/3987))。
- TOML 表单绑定更稳定 ([#4193](https://github.com/gin-gonic/gin/pull/4193))。
- 处理“method not allowed”空树请求不再 panic ([#4003](https://github.com/gin-gonic/gin/pull/4003))。
- Context race 条件与更多细节持续改进。

### 🔧 Build 流程、依赖与 CI 更新

- CI/CD 支持 **Go 1.25**，新增更严格的代码质量 linters ([#4341](https://github.com/gin-gonic/gin/pull/4341)，[#4010](https://github.com/gin-gonic/gin/pull/4010))。
- Trivy 漏洞扫描已集成进 CI ([#4359](https://github.com/gin-gonic/gin/pull/4359))。
- 多个依赖升级：sonic、setup-go、quic-go 等。

### 📖 文档修订

- 文档扩展、changelog 更新、样例与语法优化，并新增葡萄牙语文档 ([#4078](https://github.com/gin-gonic/gin/pull/4078))。

---

Gin 1.11.0 是社区活跃和持续开发的见证。感谢每一位贡献者、问题反馈者和用户，让 Gin 始终活力十足、紧跟现代应用需求。

准备好体验 Gin 1.11.0 了吗？[立即在 GitHub 升级](https://github.com/gin-gonic/gin/releases/tag/v1.11.0)，欢迎随时反馈你的体验！
