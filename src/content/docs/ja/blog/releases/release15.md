---
title: "Gin 1.5.0 がリリースされました"
linkTitle: "Gin 1.5.0 がリリースされました"
lastUpdated: 2019-11-28
---

### 変更履歴

#### 機能

- [NEW] インラインの小文字開始構造体をパースできるようになりました [#1893](https://github.com/gin-gonic/gin/pull/1893)
- [NEW] **[後方互換性なし]** マッチしたルートのフルパスをContextに保持 [#1826](https://github.com/gin-gonic/gin/pull/1826)
- [NEW] コンテキストパラメータのクエリキャッシュを追加 [#1450](https://github.com/gin-gonic/gin/pull/1450)
- [NEW] マルチパートの複数ファイルサポートを追加 [#1949](https://github.com/gin-gonic/gin/pull/1949)
- [NEW] HTTPヘッダーパラメータのバインドをサポート [#1957](https://github.com/gin-gonic/gin/pull/1957)
- [NEW] Unix時間のバインドをサポート [#1980](https://github.com/gin-gonic/gin/pull/1980)
- [NEW] DataFromReaderで負のContent-Lengthをサポート [#1981](https://github.com/gin-gonic/gin/pull/1981)
- [NEW] gin.Context.BindJSON()にDisallowUnknownFields()を追加 [#2028](https://github.com/gin-gonic/gin/pull/2028)
- [NEW] Engine.RunListener()で特定の`net.Listener`を使用 [#2023](https://github.com/gin-gonic/gin/pull/2023)

#### バグ修正

- [FIX] デバッグメッセージにDefaultWriterとDefaultErrorWriterを使用 [#1891](https://github.com/gin-gonic/gin/pull/1891)
- [FIX] コードの改善 [#1909](https://github.com/gin-gonic/gin/pull/1909)
- [FIX] json marshalをencodeに置き換えてJSONエンコーダの速度を向上 [#1546](https://github.com/gin-gonic/gin/pull/1546)
- [FIX] Copy()でのcontext.Paramsの競合状態を修正 [#1841](https://github.com/gin-gonic/gin/pull/1841)
- [FIX] GetQueryMapのパフォーマンスを改善 [#1918](https://github.com/gin-gonic/gin/pull/1918)
- [FIX] POSTデータの取得を改善 [#1920](https://github.com/gin-gonic/gin/pull/1920)
- [FIX] x/net/contextの代わりにcontextを使用 [#1922](https://github.com/gin-gonic/gin/pull/1922)
- [FIX] PostFormキャッシュのバグ修正を試行 [#1931](https://github.com/gin-gonic/gin/pull/1931)
- [FIX] **[後方互換性なし]** go1.8とgo1.9のサポートを終了 [#1933](https://github.com/gin-gonic/gin/pull/1933)
- [FIX] FullPath機能のバグ修正 [#1919](https://github.com/gin-gonic/gin/pull/1919)
- [FIX] Gin1.5でbytes.Bufferをstrings.Builderに変更 [#1939](https://github.com/gin-gonic/gin/pull/1939)
- [FIX] github.com/ugorji/go/codecをアップグレード [#1969](https://github.com/gin-gonic/gin/pull/1969)
- [FIX] コードの簡素化 [#2004](https://github.com/gin-gonic/gin/pull/2004)
- [FIX] RISC-Vアーキテクチャでの自動カラーログのターミナル識別 [#2019](https://github.com/gin-gonic/gin/pull/2019)
- [FIX] **[後方互換性なし]** Context.JSONP()が末尾にセミコロン(;)を期待するように変更 [#2007](https://github.com/gin-gonic/gin/pull/2007)
- [FIX] **[後方互換性なし]** バリデータバージョンをv9にアップグレード [#1015](https://github.com/gin-gonic/gin/pull/1015)
- [FIX] タイポの修正 [#2079](https://github.com/gin-gonic/gin/pull/2079) [#2080](https://github.com/gin-gonic/gin/pull/2080)
- [FIX] バインディングボディテストの移動 [#2086](https://github.com/gin-gonic/gin/pull/2086)
- [FIX] Context.StatusでWriterを使用 [#1606](https://github.com/gin-gonic/gin/pull/1606)
- [FIX] `Engine.RunUnix()`がファイルモードを変更できない場合にエラーを返すように修正 [#2093](https://github.com/gin-gonic/gin/pull/2093)
- [FIX] `RouterGroup.StaticFS()`がファイルをリークしていた問題を修正。現在はクローズします。[#2118](https://github.com/gin-gonic/gin/pull/2118)
- [FIX] `Context.Request.FormFile`がファイルをリークしていた問題を修正。現在はクローズします。[#2114](https://github.com/gin-gonic/gin/pull/2114)
- [FIX] `form:"-"`マッピングでのウォーキングを無視 [#1943](https://github.com/gin-gonic/gin/pull/1943)
- [REFACTOR] **[後方互換性なし]** json marshalをencodeに置き換えてJSONエンコーダの速度を向上 [#1546 ](https://github.com/gin-gonic/gin/pull/1546)

