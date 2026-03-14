---
title: "Gin 1.6.0 がリリースされました"
linkTitle: "Gin 1.6.0 がリリースされました"
lastUpdated: 2020-03-22
---

### 変更履歴

#### 破壊的変更
  * chore(performance): RemoveExtraSlashフラグ追加のパフォーマンスを改善 [#2159](https://github.com/gin-gonic/gin/pull/2159)
  * govendorのサポートを終了 [#2148](https://github.com/gin-gonic/gin/pull/2148)
  * SameSite Cookieフラグのサポートを追加 [#1615](https://github.com/gin-gonic/gin/pull/1615)

#### 機能
  * YAMLネゴシエーションを追加 [#2220](https://github.com/gin-gonic/gin/pull/2220)
  * FileFromFS [#2112](https://github.com/gin-gonic/gin/pull/2112)

#### バグ修正
  * Unixソケットの処理 [#2280](https://github.com/gin-gonic/gin/pull/2280)
  * 改行の問題を修正するためコンテキストJSONでjson marshallを使用。#2209を修正 [#2228](https://github.com/gin-gonic/gin/pull/2228)
  * 受信ネットワーク接続の受け入れを修正 [#2216](https://github.com/gin-gonic/gin/pull/2216)
  * パラメータの最大数の計算のバグを修正 [#2166](https://github.com/gin-gonic/gin/pull/2166)
  * [FIX] DataFromReaderで空のヘッダーを許可 [#2121](https://github.com/gin-gonic/gin/pull/2121)
  * Context.Keysマップを保護するためmutexを追加 [#1391](https://github.com/gin-gonic/gin/pull/1391)

#### 機能強化
  * ログインジェクションの緩和策を追加 [#2277](https://github.com/gin-gonic/gin/pull/2277)
  * tree: ノード値のrange処理 [#2229](https://github.com/gin-gonic/gin/pull/2229)
  * tree: 重複する代入を削除 [#2222](https://github.com/gin-gonic/gin/pull/2222)
  * chore: go-isattyとjson-iterator/goをアップグレード [#2215](https://github.com/gin-gonic/gin/pull/2215)
  * path: httprouterとコードを同期 [#2212](https://github.com/gin-gonic/gin/pull/2212)
  * stringとbyteスライス間の型変換にゼロコピーアプローチを使用 [#2206](https://github.com/gin-gonic/gin/pull/2206)
  * URLパスのクリーニング時にバイトを再利用 [#2179](https://github.com/gin-gonic/gin/pull/2179)
  * tree: else文を1つ削除 [#2177](https://github.com/gin-gonic/gin/pull/2177)
  * tree: httprouterの更新を同期 (#2173) (#2172) [#2171](https://github.com/gin-gonic/gin/pull/2171)
  * tree: httprouterのコードの一部を同期しif/elseを削減 [#2163](https://github.com/gin-gonic/gin/pull/2163)
  * HTTPメソッド定数を使用 [#2155](https://github.com/gin-gonic/gin/pull/2155)
  * go-validatorをv10にアップグレード [#2149](https://github.com/gin-gonic/gin/pull/2149)
  * gin.goでのリダイレクトリクエストをリファクタリング [#1970](https://github.com/gin-gonic/gin/pull/1970)
  * ビルドタグnomsgpackを追加 [#1852](https://github.com/gin-gonic/gin/pull/1852)

#### ドキュメント
  * docs(path): コメントの改善 [#2223](https://github.com/gin-gonic/gin/pull/2223)
  * SetCookieメソッドの変更に合わせてREADMEを更新 [#2217](https://github.com/gin-gonic/gin/pull/2217)
  * スペルの修正 [#2202](https://github.com/gin-gonic/gin/pull/2202)
  * READMEから壊れたリンクを削除 [#2198](https://github.com/gin-gonic/gin/pull/2198)
  * Context.Done()、Context.Deadline()、Context.Err()のドキュメントを更新 [#2196](https://github.com/gin-gonic/gin/pull/2196)
  * バリデータをv10に更新 [#2190](https://github.com/gin-gonic/gin/pull/2190)
  * READMEでgo-validatorをv10にアップグレード [#2189](https://github.com/gin-gonic/gin/pull/2189)
  * 現在の出力に更新 [#2188](https://github.com/gin-gonic/gin/pull/2188)
  * "Custom Validators"の例を修正 [#2186](https://github.com/gin-gonic/gin/pull/2186)
  * READMEにプロジェクトを追加 [#2165](https://github.com/gin-gonic/gin/pull/2165)
  * docs(benchmarks): gin v1.5用 [#2153](https://github.com/gin-gonic/gin/pull/2153)
  * README.mdの表現を明確化 [#2122](https://github.com/gin-gonic/gin/pull/2122)

#### その他
  * CIでgo1.14をサポート [#2262](https://github.com/gin-gonic/gin/pull/2262)
  * chore: 依存バージョンをアップグレード [#2231](https://github.com/gin-gonic/gin/pull/2231)
  * go1.10のサポートを終了 [#2147](https://github.com/gin-gonic/gin/pull/2147)
  * `mode.go`のコメントを修正 [#2129](https://github.com/gin-gonic/gin/pull/2129)
