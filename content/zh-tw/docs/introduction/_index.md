---
title: "介紹"
draft: false
weight: 1
---

Gin 是一個使用 Go (Golang) 寫的 Web 框架。它提供類似 Martini 的 API，但擁有更好的效能，感謝 [httprouter](https://github.com/julienschmidt/httprouter)，速度快上了 40 倍。如果你需要效能和高生產力，你將會愛上 Gin。

在這個章節當中，我們會介紹什麼是 Gin，它解決了什麼問題，還有他如何幫助你的專案。

或者，如果你已經準備好要在你的專案中使用 Gin，請前往 [快速入門](/quickstart)。

## 特色

### 快速

以 Radix tree 為基礎的路由，記憶體使用量小。沒有使用 reflection。可預測的 API 效能。

### 支援 Middleware

傳入的請求可以由一系列的 Middleware 和最終行為來處理。例如：Logger、Authorization、GZIP，最後送訊息到資料庫。

### Crash-free

Gin 可以攔截發生在 HTTP 請求期間的 panic 並回復它。這樣的話，伺服器將永遠是可用狀態。舉例來說，它可以選擇回報 panic 給 Sentry。

### JSON 驗證

Gin 可以剖析和驗證請求裡的 JSON，例如檢查必要值。

### 路由群組

更好地組織你的路由。需不需要授權或不同的 API 版本。此外，這些群組可以無限制地巢狀嵌套而不會降低效能。

### 錯誤管理

Gin 提供了一種方便的方法來收集 HTTP 請求期間發生的所有錯誤。 最後， Middleware 可以將它們寫入日誌檔案、寫入資料庫，並透過網路傳送。

### 內建渲染

Gin 提供易使用的 API 來渲染 JSON、XML 和 HTML。

### 可擴展性

建立新的 Middleware 很簡單，直接查看範例程式碼即可。
