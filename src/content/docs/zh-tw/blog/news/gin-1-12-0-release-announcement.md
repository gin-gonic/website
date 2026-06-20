---
title: "Gin 1.12.0 發布公告：BSON 支援、Context 改進、效能提升及更多"
linkTitle: "Gin 1.12.0 發布公告"
lastUpdated: 2026-02-28
---

## Gin v1.12.0 正式發布

我們很高興宣布 Gin v1.12.0 的發布，帶來了豐富的新功能、有意義的效能改進和扎實的錯誤修復。此版本深化了 Gin 對現代協定的支援、改善了開發者體驗，並延續了專案保持快速和精簡的傳統。

### 主要功能

- **BSON 協定支援：** 渲染層現在支援 BSON 編碼，為更高效的二進位資料交換打開了大門（[#4145](https://github.com/gin-gonic/gin/pull/4145)）。

- **新的 Context 方法：** 兩個新的輔助方法讓錯誤處理更加乾淨和符合慣例：
  - `GetError` 和 `GetErrorSlice` 用於從上下文中進行型別安全的錯誤擷取（[#4502](https://github.com/gin-gonic/gin/pull/4502)）
  - `Delete` 方法用於從上下文中移除鍵（[#38e7651](https://github.com/gin-gonic/gin/commit/38e7651)）

- **靈活的綁定：** URI 和查詢字串綁定現在支援 `encoding.UnmarshalText`，讓你對自訂類型的反序列化有更多控制（[#4203](https://github.com/gin-gonic/gin/pull/4203)）。

- **跳脫路徑選項：** 新的引擎選項讓你可以選擇使用跳脫（原始）的請求路徑進行路由（[#4420](https://github.com/gin-gonic/gin/pull/4420)）。

- **內容協商中的 Protocol Buffers：** `context` 現在支援 Protocol Buffers 作為可協商的內容類型，使 gRPC 風格的回應更容易整合（[#4423](https://github.com/gin-gonic/gin/pull/4423)）。

- **日誌器中的彩色延遲時間：** 預設日誌器現在以彩色渲染延遲時間，讓你一眼就能發現慢速請求（[#4146](https://github.com/gin-gonic/gin/pull/4146)）。

### 效能與增強

- **路由樹最佳化：** 對 Radix 樹的多項改進減少了記憶體配置並加速了路徑解析：
  - 減少 `findCaseInsensitivePath` 中的記憶體配置（[#4417](https://github.com/gin-gonic/gin/pull/4417)）
  - 使用 `strings.Count` 進行路徑解析以提高效率（[#4246](https://github.com/gin-gonic/gin/pull/4246)）
  - 在 `redirectTrailingSlash` 中用自訂函式取代正規表達式（[#4414](https://github.com/gin-gonic/gin/pull/4414)）
- **恢復最佳化：** 堆疊追蹤讀取現在更加高效（[#4466](https://github.com/gin-gonic/gin/pull/4466)）。
- **日誌器改進：** 現在可以透過配置跳過查詢字串輸出（[#4547](https://github.com/gin-gonic/gin/pull/4547)）。
- **Unix Socket 信任：** 當請求透過 Unix socket 到達時，`X-Forwarded-For` 標頭現在始終受信任（[#3359](https://github.com/gin-gonic/gin/pull/3359)）。
- **Flush 安全性：** 當底層的 `http.ResponseWriter` 未實作 `http.Flusher` 時，`Flush()` 不再引發 panic（[#4479](https://github.com/gin-gonic/gin/pull/4479)）。
- **程式碼品質重構：** 使用 `maps.Copy` 和 `maps.Clone` 實現更乾淨的 map 處理、使用命名常數取代魔術數字、現代化的 range-over-int 迴圈等（[#4352](https://github.com/gin-gonic/gin/pull/4352)、[#4333](https://github.com/gin-gonic/gin/pull/4333)、[#4529](https://github.com/gin-gonic/gin/pull/4529)、[#4392](https://github.com/gin-gonic/gin/pull/4392)）。

### 錯誤修復

- **路由器 Panic 修復：** 解決了啟用 `RedirectFixedPath` 時 `findCaseInsensitivePathRec` 中的 panic（[#4535](https://github.com/gin-gonic/gin/pull/4535)）。
- **Data Render 中的 Content-Length：** `Data.Render` 現在正確寫入 `Content-Length` 標頭（[#4206](https://github.com/gin-gonic/gin/pull/4206)）。
- **多標頭的 ClientIP：** `ClientIP` 現在正確處理具有多個 `X-Forwarded-For` 標頭值的請求（[#4472](https://github.com/gin-gonic/gin/pull/4472)）。
- **綁定邊界情況：** 修復了綁定中的空值錯誤（[#2169](https://github.com/gin-gonic/gin/pull/2169)）並改善了表單綁定中的空切片/陣列處理（[#4380](https://github.com/gin-gonic/gin/pull/4380)）。
- **字面冒號路由：** 包含字面冒號的路由現在可以正確搭配 `engine.Handler()` 使用（[#4415](https://github.com/gin-gonic/gin/pull/4415)）。
- **檔案描述子洩露：** `RunFd` 現在正確關閉 `os.File` 控制代碼以防止資源洩露（[#4422](https://github.com/gin-gonic/gin/pull/4422)）。
- **Hijack 行為：** 改進了 hijack 行為以正確建模回應生命週期（[#4373](https://github.com/gin-gonic/gin/pull/4373)）。
- **Recovery：** `http.ErrAbortHandler` 現在按預期在恢復中介軟體中被抑制（[#4336](https://github.com/gin-gonic/gin/pull/4336)）。
- **除錯版本不匹配：** 修復了除錯模式中回報的錯誤版本字串（[#4403](https://github.com/gin-gonic/gin/pull/4403)）。

### 建構、依賴項與 CI 更新

- **Go 1.25 最低版本：** 最低支援的 Go 版本現在是 **1.25**，CI 工作流程已相應更新（[#4550](https://github.com/gin-gonic/gin/pull/4550)）。
- **BSON 依賴項升級：** BSON 綁定依賴項已升級到 `mongo-driver` v2（[#4549](https://github.com/gin-gonic/gin/pull/4549)）。

---

Gin 1.12.0 反映了我們社群的奉獻——貢獻者、審查者和使用者們。感謝大家讓 Gin 在每次發布中都變得更好。

準備好嘗試 Gin 1.12.0 了嗎？[在 GitHub 上升級](https://github.com/gin-gonic/gin/releases/tag/v1.12.0)，並告訴我們你的想法！
