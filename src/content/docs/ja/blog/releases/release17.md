---
title: "Gin 1.7.0 がリリースされました"
linkTitle: "Gin 1.7.0 がリリースされました"
lastUpdated: 2021-04-08
---

### 変更履歴


#### バグ修正
  * [#2572](https://github.com/gin-gonic/gin/pull/2572)からのコンパイルエラーを修正 ([#2600](https://github.com/gin-gonic/gin/pull/2600))
  * 修正: 壊れたパイプでAuthorizationヘッダーなしでヘッダーを出力 ([#2528](https://github.com/gin-gonic/gin/pull/2528))
  * 修正(tree): 新しいノード登録時にfullpathを再代入 ([#2366](https://github.com/gin-gonic/gin/pull/2366))


#### 機能強化
  * 競合を起こさずにパラメータと完全一致ルートをサポート ([#2663](https://github.com/gin-gonic/gin/pull/2663))
  * Chore: render stringのパフォーマンスを改善 ([#2365](https://github.com/gin-gonic/gin/pull/2365))
  * ルートツリーをhttprouterの最新コードに同期 ([#2368](https://github.com/gin-gonic/gin/pull/2368))
  * Chore: getQueryCache/getFormCacheをinitQueryCache/initFormCaにリネーム ([#2375](https://github.com/gin-gonic/gin/pull/2375))
  * Chore(performance): countParamsを改善 ([#2378](https://github.com/gin-gonic/gin/pull/2378))
  * bytesパッケージと同じ効果を持つ関数を削除 ([#2387](https://github.com/gin-gonic/gin/pull/2387))
  * 更新: SetMode関数 ([#2321](https://github.com/gin-gonic/gin/pull/2321))
  * 未使用の型SecureJSONPrefixを削除 ([#2391](https://github.com/gin-gonic/gin/pull/2391))
  * POSTメソッドのリダイレクトサンプルを追加 ([#2389](https://github.com/gin-gonic/gin/pull/2389))
  * CustomRecovery組み込みミドルウェアを追加 ([#2322](https://github.com/gin-gonic/gin/pull/2322))
  * バインディング: 32ビットアーキテクチャでの2038年問題を回避 ([#2450](https://github.com/gin-gonic/gin/pull/2450))
  * Requestがない場合のContext.GetQuery()のpanicを防止 ([#2412](https://github.com/gin-gonic/gin/pull/2412))
  * gin.contextにGetUintとGetUint64メソッドを追加 ([#2487](https://github.com/gin-gonic/gin/pull/2487))
  * content-dispositionヘッダーをMIMEスタイルに更新 ([#2512](https://github.com/gin-gonic/gin/pull/2512))
  * アロケーションを削減しrender `WriteString`を改善 ([#2508](https://github.com/gin-gonic/gin/pull/2508))
  * Error型に".Unwrap() error"を実装 ([#2525](https://github.com/gin-gonic/gin/issues/2525)) ([#2526](https://github.com/gin-gonic/gin/pull/2526))
  * map[string]stringでのバインドを許可 ([#2484](https://github.com/gin-gonic/gin/pull/2484))
  * Chore: ツリーを更新 ([#2371](https://github.com/gin-gonic/gin/pull/2371))
  * スライス/配列オブジェクトのバインディングをサポート [書き直し] ([#2302](https://github.com/gin-gonic/gin/pull/2302))
  * Basic auth: タイミングオラクルを修正 ([#2609](https://github.com/gin-gonic/gin/pull/2609))
  * パラメータと非パラメータパスの混合を追加 (httprouterの[#329](https://github.com/gin-gonic/gin/issues/329)を移植) ([#2663](https://github.com/gin-gonic/gin/pull/2663))
  * Feat(engine): trustedproxiesとremoteIPを追加 ([#2632](https://github.com/gin-gonic/gin/pull/2632))
