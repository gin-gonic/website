---
title: "Gin 1.11.0 發布！HTTP/3、表單改進、效能提升及更多"
linkTitle: "Gin 1.11.0 發布公告"
lastUpdated: 2025-09-21
---

## Gin v1.11.0 正式登場

我們非常高興宣布 Gin v1.11.0 正式推出，帶來大量新功能、效能優化與錯誤修正，讓這個受歡迎的 Go Web 框架持續進化。Gin 致力於速度、彈性與現代 Go 開發。

### 🌟 亮點功能

- **實驗性 HTTP/3 支援：** Gin 現在透過 [quic-go](https://github.com/quic-go/quic-go) 提供 HTTP/3 的實驗性支援！想嘗鮮最新網路協議，現在正是時候。([#3210](https://github.com/gin-gonic/gin/pull/3210))

- **表單綁定大幅提升：**
  - 表單綁定支援陣列集合格式 ([#3986](https://github.com/gin-gonic/gin/pull/3986))
  - 表單標籤自訂字串切片解碼 ([#3970](https://github.com/gin-gonic/gin/pull/3970))
  - 集合類型支援預設值 ([#4048](https://github.com/gin-gonic/gin/pull/4048))

- **Binding 類型升級：** 新增 `BindPlain` 方法可輕鬆綁定純文字 ([#3904](https://github.com/gin-gonic/gin/pull/3904))，同時支援 unixMilli 及 unixMicro 格式 ([#4190](https://github.com/gin-gonic/gin/pull/4190))。

- **Context API 強化：** `GetXxx` 現已支援更多原生 Go 類型 ([#3633](https://github.com/gin-gonic/gin/pull/3633))，資料取得更型安全。

- **檔案系統擴充：** 新 `OnlyFilesFS` 已完整導出、測試並撰寫文件 ([#3939](https://github.com/gin-gonic/gin/pull/3939))。

### 🚀 效能＆強化

- **表單資料處理更快：** 表單解析優化，效能加倍 ([#4339](https://github.com/gin-gonic/gin/pull/4339))。
- 核心、渲染與 context 邏輯重構，加強穩定性及易讀性（[PR 完整列表見 changelog](../releases/release111.md)）。

### 🐛 Bug 修正

- **中介軟體更可靠：** 已修復稀有的 middleware re-entry 問題 ([#3987](https://github.com/gin-gonic/gin/pull/3987))。
- TOML 表單綁定更加穩固 ([#4193](https://github.com/gin-gonic/gin/pull/4193))。
- 處理空路樹 “method not allowed” 請求不再 panic ([#4003](https://github.com/gin-gonic/gin/pull/4003))。
- Context 與競爭條件等部分也持續優化狀態。

### 🔧 Build 流程、依賴及 CI 更新

- CI/CD 現已支援 **Go 1.25**，並啟用更多嚴格 linter 確保程式品質 ([#4341](https://github.com/gin-gonic/gin/pull/4341)，[#4010](https://github.com/gin-gonic/gin/pull/4010))。
- Trivy 漏洞掃描整合進 CI ([#4359](https://github.com/gin-gonic/gin/pull/4359))。
- sonic、setup-go、quic-go 等多項依賴升級。

### 📖 文件更新

- 文檔擴充、changelog 更新、語法與範例優化，此外新增葡萄牙語文件 ([#4078](https://github.com/gin-gonic/gin/pull/4078))。

---

Gin 1.11.0 是社群活躍與持續開發的最佳見證。感謝所有貢獻者、回報者與用戶，讓 Gin 一直緊跟現代應用腳步。

準備好體驗 Gin 1.11.0？[立即在 GitHub 升級](https://github.com/gin-gonic/gin/releases/tag/v1.11.0)，歡迎隨時提供回饋！
