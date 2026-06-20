---
title: "Gin 1.9.0 がリリースされました"
linkTitle: "Gin 1.9.0 がリリースされました"
lastUpdated: 2023-02-21
---

### 変更履歴

#### 破壊的変更
  * contextとrenderでの不要なpanicを停止 ([#2150](https://github.com/gin-gonic/gin/pull/2150))

#### バグ修正
  * 修正(router): ループインデックスがデクリメントされないツリーのバグ ([#3460](https://github.com/gin-gonic/gin/pull/3460))
  * 修正(context): NegotiateFormatでのpanic - インデックスが範囲外 ([#3397](https://github.com/gin-gonic/gin/pull/3397))
  * ヘッダーのエスケープロジックを追加 ([#3500](https://github.com/gin-gonic/gin/pull/3500)および[#3503](https://github.com/gin-gonic/gin/pull/3503))

#### セキュリティ
  * GO-2022-0969およびGO-2022-0288の脆弱性を修正 ([#3333](https://github.com/gin-gonic/gin/pull/3333))
  * 修正(security): 脆弱性GO-2023-1571 ([#3505](https://github.com/gin-gonic/gin/pull/3505))

#### 機能強化
  * Feat: sonic JSONサポートを追加 ([#3184](https://github.com/gin-gonic/gin/pull/3184))
  * Chore(file): pathという名前のディレクトリを作成 ([#3316](https://github.com/gin-gonic/gin/pull/3316))
  * 修正: インターフェースチェック方法を変更 ([#3327](https://github.com/gin-gonic/gin/pull/3327))
  * 非推奨のio/ioutilパッケージを削除 ([#3395](https://github.com/gin-gonic/gin/pull/3395))
  * リファクタリング: strings.ToLowerの二重呼び出しを回避 ([#3433](https://github.com/gin-gonic/gin/pull/3343))
  * コンソールロガーのHTTPステータスコードのバグを修正 ([#3453](https://github.com/gin-gonic/gin/pull/3453))
  * Chore(yaml): 依存関係をv3バージョンにアップグレード ([#3456](https://github.com/gin-gonic/gin/pull/3456))
  * Chore(router): 複数のHTTPメソッドをサポートするためroutergroupにmatchメソッドを追加 ([#3464](https://github.com/gin-gonic/gin/pull/3464))
  * Chore(http): gin.responseWriterにgo1.20のhttp.rwUnwrapperサポートを追加 ([#3489](https://github.com/gin-gonic/gin/pull/3489))

#### ドキュメント
  * Docs: markdownフォーマットを更新 ([#3260](https://github.com/gin-gonic/gin/pull/3260))
  * Docs(readme): TOMLレンダリングの例を追加 ([#3400](https://github.com/gin-gonic/gin/pull/3400))
  * Docs(readme): より多くの例をdocs/doc.mdに移動 ([#3449](https://github.com/gin-gonic/gin/pull/3449))
  * Docs: markdownフォーマットを更新 ([#3446](https://github.com/gin-gonic/gin/pull/3446))
