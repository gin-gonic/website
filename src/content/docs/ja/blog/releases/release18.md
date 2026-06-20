---
title: "Gin 1.8.0 がリリースされました"
linkTitle: "Gin 1.8.0 がリリースされました"
lastUpdated: 2022-05-30
---

### 変更履歴

#### 破壊的変更
  * TrustedProxies: デフォルトのIPv6サポートを追加しリファクタリング ([#2967](https://github.com/gin-gonic/gin/pull/2967))。`RemoteIP() (net.IP, bool)`を`RemoteIP() net.IP`に置き換えてください
  * gin.Contextにgin.Context.Request.Context()からのフォールバック値を追加 ([#2751](https://github.com/gin-gonic/gin/pull/2751))

#### バグ修正
  * go 1.17でのSetOutput()のpanicを修正 ([#2861](https://github.com/gin-gonic/gin/pull/2861))
  * 修正: 名前付きパラメータの後にワイルドカードが続く場合の不具合 ([#2983](https://github.com/gin-gonic/gin/pull/2983))
  * 修正: context.reset()時のsameSiteの欠落 ([#3123](https://github.com/gin-gonic/gin/pull/3123))


#### 機能強化
  * 非推奨のHeaderMapの代わりにHeader()を使用 ([#2694](https://github.com/gin-gonic/gin/pull/2694))
  * RouterGroup.HandleのHTTPメソッドの正規マッチ最適化 ([#2685](https://github.com/gin-gonic/gin/pull/2685))
  * go-jsonのサポートを追加（ドロップイン型のJSON置換） ([#2680](https://github.com/gin-gonic/gin/pull/2680))
  * fmt.Errorfの代わりにerrors.Newを使用して改善 ([#2707](https://github.com/gin-gonic/gin/pull/2707))
  * 精度の切り捨てにDuration.Truncateを使用 ([#2711](https://github.com/gin-gonic/gin/pull/2711))
  * Cloudflare使用時のクライアントIP取得 ([#2723](https://github.com/gin-gonic/gin/pull/2723))
  * コード調整の最適化 ([#2700](https://github.com/gin-gonic/gin/pull/2700))
  * コードの最適化とサイクロマティック複雑度の削減 ([#2737](https://github.com/gin-gonic/gin/pull/2737))
  * gin.Contextにgin.Context.Request.Context()からのフォールバック値を追加 ([#2751](https://github.com/gin-gonic/gin/pull/2751))
  * sliceValidateError.Errorのパフォーマンスを改善 ([#2765](https://github.com/gin-gonic/gin/pull/2765))
  * カスタム構造体タグのサポート ([#2720](https://github.com/gin-gonic/gin/pull/2720))
  * ルーターグループテストの改善 ([#2787](https://github.com/gin-gonic/gin/pull/2787))
  * Context.Deadline()、Context.Done()、Context.Err()をContext.Request.Context()にフォールバック ([#2769](https://github.com/gin-gonic/gin/pull/2769))
  * コードの最適化 [#2830](https://github.com/gin-gonic/gin/pull/2830)、[#2834](https://github.com/gin-gonic/gin/pull/2834)、[#2838](https://github.com/gin-gonic/gin/pull/2838)、[#2837](https://github.com/gin-gonic/gin/pull/2837)、[#2788](https://github.com/gin-gonic/gin/pull/2788)、[#2848](https://github.com/gin-gonic/gin/pull/2848)、[#2851](https://github.com/gin-gonic/gin/pull/2851)、[#2701](https://github.com/gin-gonic/gin/pull/2701)
  * Test(route): performRequest関数を公開 ([#3012](https://github.com/gin-gonic/gin/pull/3012))
  * 事前知識によるh2cのサポート ([#1398](https://github.com/gin-gonic/gin/pull/1398))
  * Feat: 添付ファイル名のUTF-8サポート ([#3071](https://github.com/gin-gonic/gin/pull/3071))
  * Feat: StaticFileFSを追加 ([#2749](https://github.com/gin-gonic/gin/pull/2749))
  * Feat(context): ValueメソッドからGIN Contextを返す ([#2825](https://github.com/gin-gonic/gin/pull/2825))
  * Feat: goテスト実行時に自動的にTestModeにSetMode ([#3139](https://github.com/gin-gonic/gin/pull/3139))
  * GinにTOMLバインディングを追加 ([#3081](https://github.com/gin-gonic/gin/pull/3081))
  * IPv6のデフォルトtrusted proxiesを追加 ([#3033](https://github.com/gin-gonic/gin/pull/3033))

#### ドキュメント
  * READMEにnomsgpackタグに関する注記を追加 ([#2703](https://github.com/gin-gonic/gin/pull/2703))
