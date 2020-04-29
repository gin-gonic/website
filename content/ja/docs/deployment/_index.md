---
title: "Deployment"
draft: false
weight: 6
---

Ginのプロジェクトはあらゆるクラウドサービス上に簡単にデプロイできます。

## [Render](https://render.com)

RenderはGoをネイティブサポートするモダンなクラウドプラットフォームで、フルマネージドSSL、データベース、ダウンタイムのないデプロイ、HTTP/2、そしてwebsocketもサポートしています。

Renderの[Ginプロジェクトのデプロイガイド](https://render.com/docs/deploy-go-gin)に詳細な記述があります。

## [Google App Engine](https://cloud.google.com/appengine/)

GAEでGoのアプリケーションをデプロイするには2つの方法があります。スタンダード環境は簡単に使用できますが、カスタマイズ性は低く、セキュリティ上の問題で[システムコール](https://github.com/gin-gonic/gin/issues/1639)の使用は避けるべきです。フレキシブル環境はあらゆるフレームワークやライブラリが使用できます。

さらに学んだり、より適した環境を探すには[Google App Engine 上での Go の使用](https://cloud.google.com/appengine/docs/go/)を参考にしてください。