---
title: "部署"
draft: false
weight: 6
---

Gin 專案可以輕鬆部署到任意雲主機商。

## [Render](https://render.com)

Render 是一個原生支援 Go 語言的現代化雲平台，並支持管理 SSL、資料庫、不停機部署、HTTP/2 和 websocket。

請參考 Render 文件[部署 Gin 專案](https://render.com/docs/deploy-go-gin).

## [Google App Engine](https://cloud.google.com/appengine/)

GAE 提供兩種方式部署 Go 應用。標準環境簡單使用但是比較客製化，且出於安全考量禁止使用 [syscalls](https://github.com/gin-gonic/gin/issues/1639)。在靈活的還輕可以運行任何框架跟套件。

前往 [Google App Engine](https://cloud.google.com/appengine/docs/go/) 了解更多並選擇您喜歡的環境。
