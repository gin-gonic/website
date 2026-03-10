---
title: "Gin 1.12.0 已發布"
linkTitle: "Gin 1.12.0 已發布"
lastUpdated: 2026-02-28
---

## Gin v1.12.0

### 功能

* feat(binding): 在 uri/query 綁定中新增 encoding.UnmarshalText 支援 ([#4203](https://github.com/gin-gonic/gin/pull/4203))
* feat(context): 新增 GetError 和 GetErrorSlice 方法用於錯誤檢索 ([#4502](https://github.com/gin-gonic/gin/pull/4502))
* feat(context): 為內容協商新增 Protocol Buffers 支援 ([#4423](https://github.com/gin-gonic/gin/pull/4423))
* feat(context): 實作 Delete 方法 ([#4296](https://github.com/gin-gonic/gin/pull/4296))
* feat(gin): 新增使用轉義路徑的選項 ([#4420](https://github.com/gin-gonic/gin/pull/4420))
* feat(logger): 彩色延遲 ([#4146](https://github.com/gin-gonic/gin/pull/4146))
* feat(render): 新增 bson 協議 ([#4145](https://github.com/gin-gonic/gin/pull/4145))

### 錯誤修復

* fix(binding): 空值錯誤 ([#2169](https://github.com/gin-gonic/gin/pull/2169))
* fix(binding): 改進表單綁定中的空切片/陣列處理 ([#4380](https://github.com/gin-gonic/gin/pull/4380))
* fix(context): 修正多個 X-Forwarded-For 標頭值的 ClientIP 處理 ([#4472](https://github.com/gin-gonic/gin/pull/4472))
* fix(debug): 版本不符 ([#4403](https://github.com/gin-gonic/gin/pull/4403))
* fix(gin): 在 RunFd 中關閉 os.File 以防止資源洩漏 ([#4422](https://github.com/gin-gonic/gin/pull/4422))
* fix(gin): 修正引擎處理器不支援的文字冒號路由 ([#4415](https://github.com/gin-gonic/gin/pull/4415))
* fix(recover): 在恢復中抑制 http.ErrAbortHandler ([#4336](https://github.com/gin-gonic/gin/pull/4336))
* fix(render): 在 Data.Render 中寫入內容長度 ([#4206](https://github.com/gin-gonic/gin/pull/4206))
* fix(response): 完善回應生命週期的劫持行為 ([#4373](https://github.com/gin-gonic/gin/pull/4373))
* fix(tree): 修正 RedirectFixedPath 中 findCaseInsensitivePathRec 的當機 ([#4535](https://github.com/gin-gonic/gin/pull/4535))
* fix: 修正拼寫錯誤、改進文件清晰度，並移除死碼 ([#4511](https://github.com/gin-gonic/gin/pull/4511))

### 增強

* chore(binding): 將 bson 相依性升級至 mongo-driver v2 ([#4549](https://github.com/gin-gonic/gin/pull/4549))
* chore(context): 始終信任來自 unix 通訊端的 xff 標頭 ([#3359](https://github.com/gin-gonic/gin/pull/3359))
* chore(deps): 將 golang.org/x/crypto 升級至 v0.45.0 ([#4449](https://github.com/gin-gonic/gin/pull/4449))
* chore(deps): 將 quic-go 升級至 v0.57.1 ([#4532](https://github.com/gin-gonic/gin/pull/4532))
* chore(logger): 允許略過查詢字串輸出 ([#4547](https://github.com/gin-gonic/gin/pull/4547))
* chore(response): 防止 http.Flusher 存在時的 Flush() 當機 ([#4479](https://github.com/gin-gonic/gin/pull/4479))

### 重構

* refactor(binding): 使用 maps.Copy 實現更清晰的對應處理 ([#4352](https://github.com/gin-gonic/gin/pull/4352))
* refactor(context): 省略傳回值名稱 ([#4395](https://github.com/gin-gonic/gin/pull/4395))
* refactor(context): 用常數替換硬編碼的 localhost IP ([#4481](https://github.com/gin-gonic/gin/pull/4481))
* refactor(context): 使用 maps.Clone ([#4333](https://github.com/gin-gonic/gin/pull/4333))
* refactor(ginS): 使用 sync.OnceValue 簡化引擎函式 ([#4314](https://github.com/gin-gonic/gin/pull/4314))
* refactor(recovery): 智慧錯誤比較 ([#4142](https://github.com/gin-gonic/gin/pull/4142))
* refactor(utils): 將工具函式移至 utils.go ([#4467](https://github.com/gin-gonic/gin/pull/4467))
* refactor: for 迴圈可以使用整數範圍進行現代化 ([#4392](https://github.com/gin-gonic/gin/pull/4392))
* refactor: 用具名常數替換 bodyAllowedForStatus 中的魔數 ([#4529](https://github.com/gin-gonic/gin/pull/4529))
* refactor: 使用 b.Loop() 簡化程式碼並改進效能 ([#4389](https://github.com/gin-gonic/gin/pull/4389), [#4432](https://github.com/gin-gonic/gin/pull/4432))

### 建置流程更新 / CI

* ci(bot): 提高頻率並分組更新相依性 ([#4367](https://github.com/gin-gonic/gin/pull/4367))
* ci(lint): 重構測試斷言和 linter 設定 ([#4436](https://github.com/gin-gonic/gin/pull/4436))
* ci(sec): 改進 HTTP 中介軟體中的類型安全性和伺服器組織 ([#4437](https://github.com/gin-gonic/gin/pull/4437))
* ci(sec): 排程 Trivy 安全掃描在每天 UTC 午夜執行 ([#4439](https://github.com/gin-gonic/gin/pull/4439))
* ci: 用 Trivy 整合替換漏洞掃描工作流程 ([#4421](https://github.com/gin-gonic/gin/pull/4421))
* ci: 更新 CI 工作流程並標準化 Trivy 設定引號 ([#4531](https://github.com/gin-gonic/gin/pull/4531))
* ci: 在 CI 和文件中將 Go 版本支援更新至 1.25+ ([#4550](https://github.com/gin-gonic/gin/pull/4550))

### 文件更新

* docs(README): 新增 Trivy 安全掃描徽章 ([#4426](https://github.com/gin-gonic/gin/pull/4426))
* docs(context): 為 ShouldBind\* 方法新增範例註解 ([#4428](https://github.com/gin-gonic/gin/pull/4428))
* docs(context): 修正部分註解 ([#4396](https://github.com/gin-gonic/gin/pull/4396))
* docs(context): 修正註解中錯誤的函式名稱 ([#4382](https://github.com/gin-gonic/gin/pull/4382))
* docs(readme): 翻新並擴展文件以提高清晰度和完整性 ([#4362](https://github.com/gin-gonic/gin/pull/4362))
* docs: 宣佈 Gin 1.11.0 版本並附帶部落格連結 ([#4363](https://github.com/gin-gonic/gin/pull/4363))
* docs: 記錄並最終確認 Gin v1.12.0 版本 ([#4551](https://github.com/gin-gonic/gin/pull/4551))
* docs: 翻新 GitHub 貢獻和支援範本 ([#4364](https://github.com/gin-gonic/gin/pull/4364))
* docs: 以詳細說明翻新貢獻指南 ([#4365](https://github.com/gin-gonic/gin/pull/4365))
* docs: 更新文件以反映 Go 版本變更 ([#4552](https://github.com/gin-gonic/gin/pull/4552))
* docs: 更新功能文件說明以修復損毀的文件連結 ([#4508](https://github.com/gin-gonic/gin/pull/4508))

### 效能

* perf(path): 用自訂函式替換 redirectTrailingSlash 中的正規表示式 ([#4414](https://github.com/gin-gonic/gin/pull/4414))
* perf(recovery): 最佳化堆疊函式中的行讀取 ([#4466](https://github.com/gin-gonic/gin/pull/4466))
* perf(tree): 使用 strings.Count 最佳化路徑解析 ([#4246](https://github.com/gin-gonic/gin/pull/4246))
* perf(tree): 減少 findCaseInsensitivePath 中的配置 ([#4417](https://github.com/gin-gonic/gin/pull/4417))

### 測試

* test(benchmarks): 修正不正確的函式名稱 ([#4375](https://github.com/gin-gonic/gin/pull/4375))
* test(bytesconv): 為空/nil 案例新增測試 ([#4454](https://github.com/gin-gonic/gin/pull/4454))
* test(context): 使用 http.StatusContinue 常數替代魔數 100 ([#4542](https://github.com/gin-gonic/gin/pull/4542))
* test(debug): 改進 debug.go 的測試涵蓋率至 100% ([#4404](https://github.com/gin-gonic/gin/pull/4404))
* test(gin): 為 ginS 套件新增全面的測試涵蓋 ([#4442](https://github.com/gin-gonic/gin/pull/4442))
* test(gin): 解決整合測試中的競態條件 ([#4453](https://github.com/gin-gonic/gin/pull/4453))
* test(render): 新增全面的錯誤處理測試 ([#4541](https://github.com/gin-gonic/gin/pull/4541))
* test(render): 為 MsgPack 轉譯新增全面的測試 ([#4537](https://github.com/gin-gonic/gin/pull/4537))
