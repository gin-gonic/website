---
title: "部署"
draft: false
weight: 6
---

Gin 專案可以輕鬆部署到任意雲主機商。

## [Koyeb](https://www.koyeb.com)

Koyeb 是一個開發者友善的無伺服器平台，可透過基於 Git 的部署在全球部署應用程式，支援 TLS 加密、本地自動擴展、全球邊緣網絡，以及內建的服務網格與發現功能。

請參照 Koyeb [指南部署您的 Gin 專案](https://www.koyeb.com/tutorials/deploy-go-gin-on-koyeb)。

## [Qovery](https://www.qovery.com)

Qovery 提供免費的雲端主機托管，包括資料庫、SSL、全球 CDN，以及使用 Git 進行自動部署。

請參照 Qovery 指南來[部署您的 Gin 項目](https://docs.qovery.com/guides/tutorial/deploy-gin-with-postgresql/)。

## [Render](https://render.com)

Render 是一個原生支援 Go 語言的現代化雲平台，並支持管理 SSL、資料庫、不停機部署、HTTP/2 和 websocket。

請參考 Render 文件[部署 Gin 專案](https://render.com/docs/deploy-go-gin).

## [Google App Engine](https://cloud.google.com/appengine/)

GAE 提供兩種方式部署 Go 應用。標準環境簡單使用但是比較客製化，且出於安全考量禁止使用 [syscalls](https://github.com/gin-gonic/gin/issues/1639)。在靈活的還輕可以運行任何框架跟套件。

前往 [Google App Engine](https://cloud.google.com/appengine/docs/go/) 了解更多並選擇您喜歡的環境。
