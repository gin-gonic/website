---
title: "Gin 1.12.0 已发布"
linkTitle: "Gin 1.12.0 已发布"
lastUpdated: 2026-02-28
---

## Gin v1.12.0

### 功能

* feat(binding): 在 uri/query 绑定中添加 encoding.UnmarshalText 支持 ([#4203](https://github.com/gin-gonic/gin/pull/4203))
* feat(context): 添加 GetError 和 GetErrorSlice 方法用于错误检索 ([#4502](https://github.com/gin-gonic/gin/pull/4502))
* feat(context): 为内容协商添加 Protocol Buffers 支持 ([#4423](https://github.com/gin-gonic/gin/pull/4423))
* feat(context): 实现 Delete 方法 ([#4296](https://github.com/gin-gonic/gin/pull/4296))
* feat(gin): 添加使用转义路径的选项 ([#4420](https://github.com/gin-gonic/gin/pull/4420))
* feat(logger): 彩色延迟 ([#4146](https://github.com/gin-gonic/gin/pull/4146))
* feat(render): 添加 bson 协议 ([#4145](https://github.com/gin-gonic/gin/pull/4145))

### 错误修复

* fix(binding): 空值错误 ([#2169](https://github.com/gin-gonic/gin/pull/2169))
* fix(binding): 改进表单绑定中的空切片/数组处理 ([#4380](https://github.com/gin-gonic/gin/pull/4380))
* fix(context): 修复多个 X-Forwarded-For 头部值的 ClientIP 处理 ([#4472](https://github.com/gin-gonic/gin/pull/4472))
* fix(debug): 版本不匹配 ([#4403](https://github.com/gin-gonic/gin/pull/4403))
* fix(gin): 在 RunFd 中关闭 os.File 以防止资源泄漏 ([#4422](https://github.com/gin-gonic/gin/pull/4422))
* fix(gin): 修复引擎处理器不支持的文字冒号路由 ([#4415](https://github.com/gin-gonic/gin/pull/4415))
* fix(recover): 在恢复中抑制 http.ErrAbortHandler ([#4336](https://github.com/gin-gonic/gin/pull/4336))
* fix(render): 在 Data.Render 中写入内容长度 ([#4206](https://github.com/gin-gonic/gin/pull/4206))
* fix(response): 完善响应生命周期的劫持行为 ([#4373](https://github.com/gin-gonic/gin/pull/4373))
* fix(tree): 修复 RedirectFixedPath 中 findCaseInsensitivePathRec 的崩溃 ([#4535](https://github.com/gin-gonic/gin/pull/4535))
* fix: 修正拼写错误，改进文档清晰度，移除死代码 ([#4511](https://github.com/gin-gonic/gin/pull/4511))

### 增强

* chore(binding): 将 bson 依赖升级到 mongo-driver v2 ([#4549](https://github.com/gin-gonic/gin/pull/4549))
* chore(context): 始终信任来自 unix 套接字的 xff 头 ([#3359](https://github.com/gin-gonic/gin/pull/3359))
* chore(deps): 将 golang.org/x/crypto 升级到 v0.45.0 ([#4449](https://github.com/gin-gonic/gin/pull/4449))
* chore(deps): 将 quic-go 升级到 v0.57.1 ([#4532](https://github.com/gin-gonic/gin/pull/4532))
* chore(logger): 允许跳过查询字符串输出 ([#4547](https://github.com/gin-gonic/gin/pull/4547))
* chore(response): 防止 http.Flusher 存在时的 Flush() 崩溃 ([#4479](https://github.com/gin-gonic/gin/pull/4479))

### 重构

* refactor(binding): 使用 maps.Copy 实现更清晰的映射处理 ([#4352](https://github.com/gin-gonic/gin/pull/4352))
* refactor(context): 省略返回值名称 ([#4395](https://github.com/gin-gonic/gin/pull/4395))
* refactor(context): 用常数替换硬编码的 localhost IP ([#4481](https://github.com/gin-gonic/gin/pull/4481))
* refactor(context): 使用 maps.Clone ([#4333](https://github.com/gin-gonic/gin/pull/4333))
* refactor(ginS): 使用 sync.OnceValue 简化引擎函数 ([#4314](https://github.com/gin-gonic/gin/pull/4314))
* refactor(recovery): 智能错误比较 ([#4142](https://github.com/gin-gonic/gin/pull/4142))
* refactor(utils): 将工具函数移到 utils.go ([#4467](https://github.com/gin-gonic/gin/pull/4467))
* refactor: for 循环可以使用整数范围进行现代化 ([#4392](https://github.com/gin-gonic/gin/pull/4392))
* refactor: 用命名常数替换 bodyAllowedForStatus 中的魔数 ([#4529](https://github.com/gin-gonic/gin/pull/4529))
* refactor: 使用 b.Loop() 简化代码并改进性能 ([#4389](https://github.com/gin-gonic/gin/pull/4389), [#4432](https://github.com/gin-gonic/gin/pull/4432))

### 构建过程更新 / CI

* ci(bot): 提高频率并分组更新依赖 ([#4367](https://github.com/gin-gonic/gin/pull/4367))
* ci(lint): 重构测试断言和 linter 配置 ([#4436](https://github.com/gin-gonic/gin/pull/4436))
* ci(sec): 改进 HTTP 中间件中的类型安全性和服务器组织 ([#4437](https://github.com/gin-gonic/gin/pull/4437))
* ci(sec): 将 Trivy 安全扫描计划为每天 UTC 午夜运行 ([#4439](https://github.com/gin-gonic/gin/pull/4439))
* ci: 用 Trivy 集成替换漏洞扫描工作流 ([#4421](https://github.com/gin-gonic/gin/pull/4421))
* ci: 更新 CI 工作流并标准化 Trivy 配置引号 ([#4531](https://github.com/gin-gonic/gin/pull/4531))
* ci: 在 CI 和文档中将 Go 版本支持更新为 1.25+ ([#4550](https://github.com/gin-gonic/gin/pull/4550))

### 文档更新

* docs(README): 添加 Trivy 安全扫描徽章 ([#4426](https://github.com/gin-gonic/gin/pull/4426))
* docs(context): 为 ShouldBind\* 方法添加示例注释 ([#4428](https://github.com/gin-gonic/gin/pull/4428))
* docs(context): 修复一些注释 ([#4396](https://github.com/gin-gonic/gin/pull/4396))
* docs(context): 修复注释中错误的函数名 ([#4382](https://github.com/gin-gonic/gin/pull/4382))
* docs(readme): 翻新和扩展文档以提高清晰度和完整性 ([#4362](https://github.com/gin-gonic/gin/pull/4362))
* docs: 宣布 Gin 1.11.0 版本并附带博客链接 ([#4363](https://github.com/gin-gonic/gin/pull/4363))
* docs: 记录并最终确定 Gin v1.12.0 版本 ([#4551](https://github.com/gin-gonic/gin/pull/4551))
* docs: 翻新 GitHub 贡献和支持模板 ([#4364](https://github.com/gin-gonic/gin/pull/4364))
* docs: 用详细说明翻新贡献指南 ([#4365](https://github.com/gin-gonic/gin/pull/4365))
* docs: 更新文档以反映 Go 版本变更 ([#4552](https://github.com/gin-gonic/gin/pull/4552))
* docs: 更新功能文档说明以修复损坏的文档链接 ([#4508](https://github.com/gin-gonic/gin/pull/4508))

### 性能

* perf(path): 用自定义函数替换 redirectTrailingSlash 中的正则表达式 ([#4414](https://github.com/gin-gonic/gin/pull/4414))
* perf(recovery): 优化堆栈函数中的行读取 ([#4466](https://github.com/gin-gonic/gin/pull/4466))
* perf(tree): 使用 strings.Count 优化路径解析 ([#4246](https://github.com/gin-gonic/gin/pull/4246))
* perf(tree): 减少 findCaseInsensitivePath 中的分配 ([#4417](https://github.com/gin-gonic/gin/pull/4417))

### 测试

* test(benchmarks): 修复不正确的函数名 ([#4375](https://github.com/gin-gonic/gin/pull/4375))
* test(bytesconv): 为空/nil 情况添加测试 ([#4454](https://github.com/gin-gonic/gin/pull/4454))
* test(context): 使用 http.StatusContinue 常数替代魔数 100 ([#4542](https://github.com/gin-gonic/gin/pull/4542))
* test(debug): 将 debug.go 的测试覆盖率提高到 100% ([#4404](https://github.com/gin-gonic/gin/pull/4404))
* test(gin): 为 ginS 包添加全面的测试覆盖 ([#4442](https://github.com/gin-gonic/gin/pull/4442))
* test(gin): 解决集成测试中的竞态条件 ([#4453](https://github.com/gin-gonic/gin/pull/4453))
* test(render): 添加全面的错误处理测试 ([#4541](https://github.com/gin-gonic/gin/pull/4541))
* test(render): 为 MsgPack 渲染添加全面的测试 ([#4537](https://github.com/gin-gonic/gin/pull/4537))
