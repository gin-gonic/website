---
title: "Gin 1.11.0 發布"
linkTitle: "Gin 1.11.0 發布"
lastUpdated: 2024-09-20
---

## Gin v1.11.0

### 新功能

* feat(gin)：使用 quic-go/quic-go 實驗性支援 HTTP/3（[#3210](https://github.com/gin-gonic/gin/pull/3210)）
* feat(form)：表單綁定新增陣列集合格式（[#3986](https://github.com/gin-gonic/gin/pull/3986)），支援自訂字串切片進行 form 標籤反序列化（[#3970](https://github.com/gin-gonic/gin/pull/3970)）
* feat(binding)：新增 BindPlain（[#3904](https://github.com/gin-gonic/gin/pull/3904)）
* feat(fs)：OnlyFilesFS 開放、測試與文件化（[#3939](https://github.com/gin-gonic/gin/pull/3939)）
* feat(binding)：支援 unixMilli 和 unixMicro（[#4190](https://github.com/gin-gonic/gin/pull/4190)）
* feat(form)：表單綁定中的集合支援預設值（[#4048](https://github.com/gin-gonic/gin/pull/4048)）
* feat(context)：GetXxx 支援更多 Go 原生型別（[#3633](https://github.com/gin-gonic/gin/pull/3633)）

### 增強

* perf(context)：優化 getMapFromFormData 效能（[#4339](https://github.com/gin-gonic/gin/pull/4339)）
* refactor(tree)：在 node.insertChild 以 "/" 取代 string(/)（[#4354](https://github.com/gin-gonic/gin/pull/4354)）
* refactor(render)：移除 writeHeader 的 headers 參數（[#4353](https://github.com/gin-gonic/gin/pull/4353)）
* refactor(context)：簡化 "GetType()" 系列函式（[#4080](https://github.com/gin-gonic/gin/pull/4080)）
* refactor(slice)：簡化 SliceValidationError 的 Error 方法（[#3910](https://github.com/gin-gonic/gin/pull/3910)）
* refactor(context)：SaveUploadedFile 避免重複使用 filepath.Dir（[#4181](https://github.com/gin-gonic/gin/pull/4181)）
* refactor(context)：重構 context 處理邏輯並強化測試穩定性（[#4066](https://github.com/gin-gonic/gin/pull/4066)）
* refactor(binding)：以 strings.Cut 取代 strings.Index（[#3522](https://github.com/gin-gonic/gin/pull/3522)）
* refactor(context)：SaveUploadedFile 新增選用權限參數（[#4068](https://github.com/gin-gonic/gin/pull/4068)）
* refactor(context)：initQueryCache() 驗證 URL 非空指標（[#3969](https://github.com/gin-gonic/gin/pull/3969)）
* refactor(context)：Negotiate 的 YAML 判斷邏輯（[#3966](https://github.com/gin-gonic/gin/pull/3966)）
* tree：自定義 'min' 改為官方函式（[#3975](https://github.com/gin-gonic/gin/pull/3975)）
* context：移除重複使用 filepath.Dir（[#4181](https://github.com/gin-gonic/gin/pull/4181)）

### 錯誤修正

* fix：HandleContext 避免中介軟體重入問題（[#3987](https://github.com/gin-gonic/gin/pull/3987)）
* fix(binding)：decodeToml 避免重複解碼並新增驗證（[#4193](https://github.com/gin-gonic/gin/pull/4193)）
* fix(gin)：處理空樹節點不允許方法時避免 panic（[#4003](https://github.com/gin-gonic/gin/pull/4003)）
* fix(gin)：Gin 模式資料競爭警告（[#1580](https://github.com/gin-gonic/gin/pull/1580)）
* fix(context)：initQueryCache() 驗證 URL 非空指標（[#3969](https://github.com/gin-gonic/gin/pull/3969)）
* fix(context)：Negotiate 的 YAML 判斷邏輯（[#3966](https://github.com/gin-gonic/gin/pull/3966)）
* fix(context)：檢查 handler 是否為 nil（[#3413](https://github.com/gin-gonic/gin/pull/3413)）
* fix(readme)：修正指向英文文件的壞連結（[#4222](https://github.com/gin-gonic/gin/pull/4222)）
* fix(tree)：萬用字元型別建構失敗時維持 panic 訊息一致（[#4077](https://github.com/gin-gonic/gin/pull/4077)）

### 建置流程／CI 更新

* ci：將 Trivy 弱點掃描整合進 CI 流程（[#4359](https://github.com/gin-gonic/gin/pull/4359)）
* ci：CI／CD 支援 Go 1.25（[#4341](https://github.com/gin-gonic/gin/pull/4341)）
* build(deps)：github.com/bytedance/sonic 從 v1.13.2 升級至 v1.14.0（[#4342](https://github.com/gin-gonic/gin/pull/4342)）
* ci：GitHub Actions 新增 Go 1.24 版本（[#4154](https://github.com/gin-gonic/gin/pull/4154)）
* build：Gin 最低需求 Go 版本更新為 1.21（[#3960](https://github.com/gin-gonic/gin/pull/3960)）
* ci(lint)：啟用新 linters（testifylint、usestdlibvars、perfsprint 等）（[#4010](https://github.com/gin-gonic/gin/pull/4010)、[#4091](https://github.com/gin-gonic/gin/pull/4091)、[#4090](https://github.com/gin-gonic/gin/pull/4090)）
* ci(lint)：更新工作流並改善測試請求一致性（[#4126](https://github.com/gin-gonic/gin/pull/4126)）

### 相依套件更新

* chore(deps)：google.golang.org/protobuf 從 1.36.6 升級至 1.36.9（[#4346](https://github.com/gin-gonic/gin/pull/4346)、[#4356](https://github.com/gin-gonic/gin/pull/4356)）
* chore(deps)：github.com/stretchr/testify 從 1.10.0 升級至 1.11.1（[#4347](https://github.com/gin-gonic/gin/pull/4347)）
* chore(deps)：actions/setup-go 從 5 升級至 6（[#4351](https://github.com/gin-gonic/gin/pull/4351)）
* chore(deps)：github.com/quic-go/quic-go 從 0.53.0 升級至 0.54.0（[#4328](https://github.com/gin-gonic/gin/pull/4328)）
* chore(deps)：golang.org/x/net 從 0.33.0 升級至 0.38.0（[#4178](https://github.com/gin-gonic/gin/pull/4178)、[#4221](https://github.com/gin-gonic/gin/pull/4221)）
* chore(deps)：github.com/go-playground/validator/v10 從 10.20.0 升級至 10.22.1（[#4052](https://github.com/gin-gonic/gin/pull/4052)）

### 文件更新

* docs(changelog)：更新 Gin v1.10.1 發布說明（[#4360](https://github.com/gin-gonic/gin/pull/4360)）
* docs：修正英文文法錯誤與不自然句子於 doc/doc.md（[#4207](https://github.com/gin-gonic/gin/pull/4207)）
* docs：更新 Gin v1.10.0 文件與發布說明（[#3953](https://github.com/gin-gonic/gin/pull/3953)）
* docs：修正 Gin 快速入門錯字（[#3997](https://github.com/gin-gonic/gin/pull/3997)）
* docs：修正註解與連結問題（[#4205](https://github.com/gin-gonic/gin/pull/4205)、[#3938](https://github.com/gin-gonic/gin/pull/3938)）
* docs：修正路由分組範例程式碼（[#4020](https://github.com/gin-gonic/gin/pull/4020)）
* docs(readme)：新增葡萄牙語文件（[#4078](https://github.com/gin-gonic/gin/pull/4078)）
* docs(context)：修正註解中的部分函式名稱（[#4079](https://github.com/gin-gonic/gin/pull/4079)）
