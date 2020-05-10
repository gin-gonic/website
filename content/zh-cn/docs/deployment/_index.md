---
title: "部署"
draft: false
weight: 6
---

Gin 项目可以轻松部署在任何云提供商上。

## [Render](https://render.com)

Render 是一个原生支持 Go 的现代化云平台，并支持全托管 SSL、数据库、不停机部署、HTTP/2 和 websocket。

参考 Render [Gin 项目部署指南](https://render.com/docs/deploy-go-gin)。

## [Google App Engine](https://cloud.google.com/appengine/)

GAE 提供了两种方式部署 Go 应用。标准环境，简单易用但可定制性较低，且出于安全考虑禁止 [syscalls](https://github.com/gin-gonic/gin/issues/1639)。灵活环境，可以运行任何框架和库。

前往 [Go on Google App Engine](https://cloud.google.com/appengine/docs/go/) 了解更多并选择你喜欢的环境。
