---
title: "Gin 1.4.0 がリリースされました"
linkTitle: "Gin 1.4.0 がリリースされました"
lastUpdated: 2019-05-08
---

### 変更履歴

#### 機能

- [NEW] [Go Modules](https://github.com/golang/go/wiki/Modules)のサポート [#1569](https://github.com/gin-gonic/gin/pull/1569)
- [NEW] フォームマッピングのマルチパートリクエストをリファクタリング [#1829](https://github.com/gin-gonic/gin/pull/1829)
- [NEW] ファイルバインディングのサポート [#1264](https://github.com/gin-gonic/gin/pull/1264)
- [NEW] 配列マッピングのサポートを追加 [#1797](https://github.com/gin-gonic/gin/pull/1797)
- [NEW] context.KeysをLogFormatterParamsとして利用可能に [#1779](https://github.com/gin-gonic/gin/pull/1779)
- [NEW] Marshal/Unmarshalにinternal/jsonを使用 [#1791](https://github.com/gin-gonic/gin/pull/1791)
- [NEW] time.Durationのマッピングをサポート [#1794](https://github.com/gin-gonic/gin/pull/1794)
- [NEW] フォームマッピングをリファクタリング [#1749](https://github.com/gin-gonic/gin/pull/1749)
- [NEW] ストリーミング中にクライアントが切断した場合を示すcontext.Streamのフラグを追加 [#1252](https://github.com/gin-gonic/gin/pull/1252)
- [NEW] 新しいメソッドcontext.Attachmentによるcontent-dispositionアタッチメントをサポートするためcontext.Fileを拡張 [#1260](https://github.com/gin-gonic/gin/pull/1260)
- [NEW] redirectTrailingSlashでX-Forwarded-Prefixからのプレフィックスを追加 [#1238](https://github.com/gin-gonic/gin/pull/1238)
- [NEW] context.HandlerNames()を追加 [#1729](https://github.com/gin-gonic/gin/pull/1729)
- [NEW] LogFormatterParamsにレスポンスサイズを追加 [#1752](https://github.com/gin-gonic/gin/pull/1752)
- [NEW] フォームマッピングでフィールドの無視を許可 [#1733](https://github.com/gin-gonic/gin/pull/1733)
- [NEW] コンソール出力でカラーを強制する関数を追加 [#1724](https://github.com/gin-gonic/gin/pull/1724)
- [NEW] URLパラメータのバインディング [#1694](https://github.com/gin-gonic/gin/pull/1694)
- [NEW] LoggerWithFormatterメソッドを追加 [#1677](https://github.com/gin-gonic/gin/pull/1677)
- [NEW] ファイルディスクリプタを通じてhttp.Serverを実行するRunFdメソッド [#1609](https://github.com/gin-gonic/gin/pull/1609)
- [NEW] Yamlバインディングのサポート [#1618](https://github.com/gin-gonic/gin/pull/1618)
- [NEW] PureJSONレンダラーを追加 [#694](https://github.com/gin-gonic/gin/pull/694)
- [NEW] フォームバインディングでのデフォルト時間フォーマットを設定 [#1487](https://github.com/gin-gonic/gin/pull/1487)
- [NEW] 依存ライブラリをアップグレード [#1491](https://github.com/gin-gonic/gin/pull/1491)

#### バグ修正

- [FIX] 長時間実行リクエストでのレイテンシ精度を切り捨て [#1830](https://github.com/gin-gonic/gin/pull/1830)
- [FIX] IsTermフラグがDisableConsoleColorメソッドの影響を受けないように修正 [#1802](https://github.com/gin-gonic/gin/pull/1802)
- [FIX] Readmeの更新 [#1793](https://github.com/gin-gonic/gin/pull/1793) [#1788](https://github.com/gin-gonic/gin/pull/1788) [1789](https://github.com/gin-gonic/gin/pull/1789)
- [FIX] StaticFS: 404で2行のログが出力される問題を修正 [#1805](https://github.com/gin-gonic/gin/pull/1805)、[#1804](https://github.com/gin-gonic/gin/pull/1804)
- [FIX] [examples](https://github.com/gin-gonic/examples)を独立したリポジトリに移動 [#1775](https://github.com/gin-gonic/gin/pull/1775)
- [FIX] HTTPコンテンツネゴシエーションのワイルドカードをサポート [#1112](https://github.com/gin-gonic/gin/pull/1112)
- [FIX] FormFile呼び出し時にMaxMultipartMemoryを渡すように修正 [#1600](https://github.com/gin-gonic/gin/pull/1600)
- [FIX] LoadHTML*テストの修正 [#1559](https://github.com/gin-gonic/gin/pull/1559)
- [FIX] HandleContextからsync.poolの使用を削除 [#1565](https://github.com/gin-gonic/gin/pull/1565)
- [FIX] 出力ログをos.Stderrにフォーマット [#1571](https://github.com/gin-gonic/gin/pull/1571)
- [FIX] 可読性のためロガーに黄色背景とダークグレーのテキストを使用 [#1570](https://github.com/gin-gonic/gin/pull/1570)
- [FIX] panicログから機密リクエスト情報を削除 [#1370](https://github.com/gin-gonic/gin/pull/1370)
- [FIX] log.Println()がタイムスタンプを出力しない問題を修正 [#829](https://github.com/gin-gonic/gin/pull/829) [#1560](https://github.com/gin-gonic/gin/pull/1560)
- [FIX] 欠落していたコピーライトを追加しif/elseを更新 [#1497](https://github.com/gin-gonic/gin/pull/1497)
- [FIX] msgpackの使用方法を更新 [#1498](https://github.com/gin-gonic/gin/pull/1498)
- [FIX] レンダリングでprotobufを使用 [#1496](https://github.com/gin-gonic/gin/pull/1496)
- [FIX] Protobufフォーマットレスポンスのサポートを追加 [#1479](https://github.com/gin-gonic/gin/pull/1479)
- [FIX] BindXMLとShouldBindXMLを追加 [#1485](https://github.com/gin-gonic/gin/pull/1485)
- [FIX] CIテストの更新 [#1671](https://github.com/gin-gonic/gin/pull/1671) [#1670](https://github.com/gin-gonic/gin/pull/1670) [#1682](https://github.com/gin-gonic/gin/pull/1682) [#1669](https://github.com/gin-gonic/gin/pull/1669)
- [FIX] StaticFS(): パスが存在しない場合に404を送信 [#1663](https://github.com/gin-gonic/gin/pull/1663)
- [FIX] JSONバインディングでnilボディを処理 [#1638](https://github.com/gin-gonic/gin/pull/1638)
- [FIX] URIパラメータのバインドをサポート [#1612](https://github.com/gin-gonic/gin/pull/1612)
- [FIX] recovery: Google App Engineでのsyscallインポートの問題を修正 [#1640](https://github.com/gin-gonic/gin/pull/1640)
- [FIX] デバッグログに改行が含まれるようにする [#1650](https://github.com/gin-gonic/gin/pull/1650)
- [FIX] 壊れたパイプのリカバリ中にpanicスタックトレースが出力される問題を修正 [#1089](https://github.com/gin-gonic/gin/pull/1089) [#1259](https://github.com/gin-gonic/gin/pull/1259)
- [FIX] Context.Next() - 各イテレーションでハンドラのlenを再確認 [#1745](https://github.com/gin-gonic/gin/pull/1745)
- [FIX] すべてのerrcheck警告を修正 [#1739](https://github.com/gin-gonic/gin/pull/1739) [#1653](https://github.com/gin-gonic/gin/pull/1653)
- [FIX] defaultLoggerのカラーメソッドをpublicに変更 [#1771](https://github.com/gin-gonic/gin/pull/1771)
- [FIX] writeHeadersメソッドをhttp.Header.Setを使用するように更新 [#1722](https://github.com/gin-gonic/gin/pull/1722)
- [FIX] context.Copy()の競合状態を修正 [#1020](https://github.com/gin-gonic/gin/pull/1020)

