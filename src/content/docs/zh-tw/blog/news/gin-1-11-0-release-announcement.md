---
title: "Gin 1.11.0 發布公告：HTTP/3、表單改進、效能提升及更多"
linkTitle: "Gin 1.11.0 發布公告"
lastUpdated: 2025-09-21
---

## Gin v1.11.0 正式發布

我們很高興宣布 Gin v1.11.0 的發布，為這個深受喜愛的 Web 框架帶來了大量新功能、效能調整和錯誤修復。此版本延續了 Gin 對速度、靈活性和現代 Go 開發的承諾。

### 主要功能

- **實驗性 HTTP/3 支援：** Gin 現在透過 [quic-go](https://github.com/quic-go/quic-go) 支援實驗性 HTTP/3！如果你迫不及待想嘗試最新的 Web 傳輸協定，現在就是你的機會。（[#3210](https://github.com/gin-gonic/gin/pull/3210)）

- **更好的表單綁定：** 我們對表單綁定進行了重大改進：
  - 支援表單中的陣列集合格式（[#3986](https://github.com/gin-gonic/gin/pull/3986)）
  - 自訂字串切片反序列化的表單標籤（[#3970](https://github.com/gin-gonic/gin/pull/3970)）
  - 集合的預設值（[#4048](https://github.com/gin-gonic/gin/pull/4048)）

- **增強的綁定類型：** 使用新的 `BindPlain` 方法輕鬆綁定純文字（[#3904](https://github.com/gin-gonic/gin/pull/3904)），並支援 unixMilli 和 unixMicro 格式（[#4190](https://github.com/gin-gonic/gin/pull/4190)）。

- **Context API 改進：** `GetXxx` 現在支援更多原生 Go 類型（[#3633](https://github.com/gin-gonic/gin/pull/3633)），使型別安全的上下文資料擷取更加容易。

- **檔案系統更新：** 新的 `OnlyFilesFS` 現已匯出、測試並記錄文件（[#3939](https://github.com/gin-gonic/gin/pull/3939)）。

### 效能與增強

- **更快的表單資料處理：** 表單解析的內部最佳化提升了效能（[#4339](https://github.com/gin-gonic/gin/pull/4339)）。
- 重構了核心、渲染和上下文邏輯，提高了穩健性和清晰度（[完整 PR 列表請參閱更新日誌](../releases/release111.md)）。

### 錯誤修復

- **中介軟體可靠性：** 修復了中介軟體可能意外重新進入的罕見錯誤（[#3987](https://github.com/gin-gonic/gin/pull/3987)）。
- 改善了 TOML 表單綁定的穩定性（[#4193](https://github.com/gin-gonic/gin/pull/4193)）。
- 在空的路由樹上處理「方法不允許」請求時不再發生 panic（[#4003](https://github.com/gin-gonic/gin/pull/4003)）。
- 上下文處理、競態條件等方面的整體改進。

### 建構、依賴項與 CI 更新

- CI/CD 工作流程支援 **Go 1.25**，並啟用了新的 linter 以實現更嚴格的程式碼品質檢查（[#4341](https://github.com/gin-gonic/gin/pull/4341)、[#4010](https://github.com/gin-gonic/gin/pull/4010)）。
- Trivy 漏洞掃描現已整合到 CI 中（[#4359](https://github.com/gin-gonic/gin/pull/4359)）。
- 多個依賴項升級，包括 `sonic`、`setup-go`、`quic-go` 等。

### 文件

- 擴展文件、更新更新日誌、改善語法和程式碼範例，以及新增葡萄牙語文件（[#4078](https://github.com/gin-gonic/gin/pull/4078)）。

---

Gin 1.11.0 是我們活躍社群和持續開發的見證。我們感謝每一位貢獻者、問題回報者和使用者，正是你們讓 Gin 在現代 Web 應用程式中保持卓越和相關性。

準備好嘗試 Gin 1.11.0 了嗎？[在 GitHub 上升級](https://github.com/gin-gonic/gin/releases/tag/v1.11.0)，並告訴我們你的想法！
