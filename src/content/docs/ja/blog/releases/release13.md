---
title: "Gin 1.3.0 がリリースされました"
linkTitle: "Gin 1.3.0 がリリースされました"
lastUpdated: 2018-08-14
---

### 変更履歴

- [NEW] `type map[string]string`をクエリ文字列またはフォームパラメータとしてサポートするため、[`func (*Context) QueryMap`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.QueryMap)、[`func (*Context) GetQueryMap`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.GetQueryMap)、[`func (*Context) PostFormMap`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.PostFormMap)、[`func (*Context) GetPostFormMap`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.GetPostFormMap)を追加。[#1383](https://github.com/gin-gonic/gin/pull/1383)を参照
- [NEW] [`func (*Context) AsciiJSON`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.AsciiJSON)を追加。[#1358](https://github.com/gin-gonic/gin/pull/1358)を参照
- [NEW] http2 pushをサポートするため[`type ResponseWriter`](https://pkg.go.dev/github.com/gin-gonic/gin#ResponseWriter)に`Pusher()`を追加。[#1273](https://github.com/gin-gonic/gin/pull/1273)を参照
- [NEW] 動的データの提供のため[`func (*Context) DataFromReader`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.DataFromReader)を追加。[#1304](https://github.com/gin-gonic/gin/pull/1304)を参照
- [NEW] バインディングの複数回呼び出しを可能にする[`func (*Context) ShouldBindBodyWith`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.ShouldBindBodyWith)を追加。[#1341](https://github.com/gin-gonic/gin/pull/1341)を参照
- [NEW] フォームバインディングでのポインタサポート。[#1336](https://github.com/gin-gonic/gin/pull/1336)を参照
- [NEW] [`func (*Context) JSONP`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.JSONP)を追加。[#1333](https://github.com/gin-gonic/gin/pull/1333)を参照
- [NEW] フォームバインディングでのデフォルト値サポート。[#1138](https://github.com/gin-gonic/gin/pull/1138)を参照
- [NEW] [`type StructValidator`](https://pkg.go.dev/github.com/gin-gonic/gin/binding#StructValidator)でバリデータエンジンを公開。[#1277](https://github.com/gin-gonic/gin/pull/1277)を参照
- [NEW] [`func (*Context) ShouldBind`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.ShouldBind)、[`func (*Context) ShouldBindQuery`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.ShouldBindQuery)、[`func (*Context) ShouldBindJSON`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.ShouldBindJSON)を追加。[#1047](https://github.com/gin-gonic/gin/pull/1047)を参照
- [NEW] フォームバインディングで`time.Time`のロケーションサポートを追加。[#1117](https://github.com/gin-gonic/gin/pull/1117)を参照
- [NEW] [`func (*Context) BindQuery`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.BindQuery)を追加。[#1029](https://github.com/gin-gonic/gin/pull/1029)を参照
- [NEW] ビルドタグで[jsonite](https://github.com/json-iterator/go)をオプションに。[#1026](https://github.com/gin-gonic/gin/pull/1026)を参照
- [NEW] ロガーにクエリ文字列を表示。[#999](https://github.com/gin-gonic/gin/pull/999)を参照
- [NEW] [`func (*Context) SecureJSON`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.SecureJSON)を追加。[#987](https://github.com/gin-gonic/gin/pull/987)および[#993](https://github.com/gin-gonic/gin/pull/993)を参照
- [DEPRECATE] `func (*Context) GetCookie`は[`func (*Context) Cookie`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.Cookie)に非推奨化
- [FIX] [`func DisableConsoleColor`](https://pkg.go.dev/github.com/gin-gonic/gin#DisableConsoleColor)が呼ばれた場合、カラータグを表示しないように修正。[#1072](https://github.com/gin-gonic/gin/pull/1072)を参照
- [FIX] [`func Mode`](https://pkg.go.dev/github.com/gin-gonic/gin#Mode)を呼び出した際のGin Mode `""`が`const DebugMode`を返すように修正。[#1250](https://github.com/gin-gonic/gin/pull/1250)を参照
- [FIX] `Flush()`が`responseWriter`のステータスコードを上書きしないように修正。[#1460](https://github.com/gin-gonic/gin/pull/1460)を参照


