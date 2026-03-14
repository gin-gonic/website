---
title: "Gin 1.12.0 发布公告：BSON 支持、Context 改进、性能提升及更多"
linkTitle: "Gin 1.12.0 发布公告"
lastUpdated: 2026-02-28
---

## Gin v1.12.0 正式发布

我们非常高兴地宣布 Gin v1.12.0 的发布，带来了丰富的新功能、有意义的性能改进和一系列扎实的错误修复。此版本深化了 Gin 对现代协议的支持，优化了开发者体验，并延续了项目保持快速精简的传统。

### 主要特性

- **BSON 协议支持：** 渲染层现在支持 BSON 编码，为更高效的二进制数据交换打开了大门（[#4145](https://github.com/gin-gonic/gin/pull/4145)）。

- **新的 Context 方法：** 两个新的辅助方法使错误处理更加简洁和地道：
  - `GetError` 和 `GetErrorSlice` 用于从上下文中进行类型安全的错误检索（[#4502](https://github.com/gin-gonic/gin/pull/4502)）
  - `Delete` 方法用于从上下文中删除键（[#38e7651](https://github.com/gin-gonic/gin/commit/38e7651)）

- **灵活的绑定：** URI 和查询绑定现在遵循 `encoding.UnmarshalText`，让你对自定义类型反序列化有更多控制（[#4203](https://github.com/gin-gonic/gin/pull/4203)）。

- **转义路径选项：** 一个新的引擎选项允许你选择使用转义（原始）请求路径进行路由（[#4420](https://github.com/gin-gonic/gin/pull/4420)）。

- **内容协商中的 Protocol Buffers：** `context` 现在支持 Protocol Buffers 作为可协商的内容类型，使 gRPC 风格的响应更容易集成（[#4423](https://github.com/gin-gonic/gin/pull/4423)）。

- **日志中的彩色延迟显示：** 默认日志记录器现在以彩色渲染延迟，使你更容易一眼发现慢请求（[#4146](https://github.com/gin-gonic/gin/pull/4146)）。

### 性能和增强

- **路由树优化：** 对基数树的多项改进减少了内存分配并加速了路径解析：
  - 减少 `findCaseInsensitivePath` 中的分配（[#4417](https://github.com/gin-gonic/gin/pull/4417)）
  - 使用 `strings.Count` 进行高效路径解析（[#4246](https://github.com/gin-gonic/gin/pull/4246)）
  - 在 `redirectTrailingSlash` 中用自定义函数替换正则表达式（[#4414](https://github.com/gin-gonic/gin/pull/4414)）
- **Recovery 优化：** 堆栈跟踪读取现在更加高效（[#4466](https://github.com/gin-gonic/gin/pull/4466)）。
- **日志改进：** 查询字符串输出现在可以通过配置跳过（[#4547](https://github.com/gin-gonic/gin/pull/4547)）。
- **Unix Socket 信任：** 当请求通过 Unix socket 到达时，`X-Forwarded-For` 头现在始终被信任（[#3359](https://github.com/gin-gonic/gin/pull/3359)）。
- **Flush 安全性：** 当底层 `http.ResponseWriter` 未实现 `http.Flusher` 时，`Flush()` 不再 panic（[#4479](https://github.com/gin-gonic/gin/pull/4479)）。
- **代码质量重构：** 使用 `maps.Copy` 和 `maps.Clone` 进行更简洁的 map 处理，用命名常量替换魔术数字，现代化的 range-over-int 循环等（[#4352](https://github.com/gin-gonic/gin/pull/4352)、[#4333](https://github.com/gin-gonic/gin/pull/4333)、[#4529](https://github.com/gin-gonic/gin/pull/4529)、[#4392](https://github.com/gin-gonic/gin/pull/4392)）。

### 错误修复

- **路由 Panic 修复：** 解决了启用 `RedirectFixedPath` 时 `findCaseInsensitivePathRec` 中的 panic（[#4535](https://github.com/gin-gonic/gin/pull/4535)）。
- **Data 渲染中的 Content-Length：** `Data.Render` 现在正确写入 `Content-Length` 头（[#4206](https://github.com/gin-gonic/gin/pull/4206)）。
- **多头 ClientIP：** `ClientIP` 现在正确处理具有多个 `X-Forwarded-For` 头值的请求（[#4472](https://github.com/gin-gonic/gin/pull/4472)）。
- **绑定边界情况：** 修复了绑定中的空值错误（[#2169](https://github.com/gin-gonic/gin/pull/2169)）并改进了表单绑定中的空切片/数组处理（[#4380](https://github.com/gin-gonic/gin/pull/4380)）。
- **字面冒号路由：** 带有字面冒号的路由现在与 `engine.Handler()` 一起正确工作（[#4415](https://github.com/gin-gonic/gin/pull/4415)）。
- **文件描述符泄漏：** `RunFd` 现在正确关闭 `os.File` 句柄以防止资源泄漏（[#4422](https://github.com/gin-gonic/gin/pull/4422)）。
- **Hijack 行为：** 改进了 hijack 行为以正确模拟响应生命周期（[#4373](https://github.com/gin-gonic/gin/pull/4373)）。
- **Recovery：** `http.ErrAbortHandler` 现在按预期在 recovery 中间件中被抑制（[#4336](https://github.com/gin-gonic/gin/pull/4336)）。
- **调试版本不匹配：** 修复了调试模式中报告的不正确版本字符串（[#4403](https://github.com/gin-gonic/gin/pull/4403)）。

### 构建、依赖和 CI 更新

- **Go 1.25 最低版本：** 最低支持的 Go 版本现在是 **1.25**，CI 工作流已相应更新（[#4550](https://github.com/gin-gonic/gin/pull/4550)）。
- **BSON 依赖升级：** BSON 绑定依赖已升级到 `mongo-driver` v2（[#4549](https://github.com/gin-gonic/gin/pull/4549)）。

---

Gin 1.12.0 体现了我们社区的奉献精神——贡献者、审阅者和用户。感谢你们让 Gin 在每次发布中变得更好。

准备好试用 Gin 1.12.0 了吗？[在 GitHub 上升级](https://github.com/gin-gonic/gin/releases/tag/v1.12.0)并告诉我们你的想法！
