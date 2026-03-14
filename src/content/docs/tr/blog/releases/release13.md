---
title: "Gin 1.3.0 yayınlandı"
linkTitle: "Gin 1.3.0 yayınlandı"
lastUpdated: 2018-08-14
---

### DEĞİŞİKLİK GÜNLÜĞÜ

- [YENİ] `type map[string]string` türünü sorgu dizesi veya form parametreleri olarak desteklemek için [`func (*Context) QueryMap`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.QueryMap), [`func (*Context) GetQueryMap`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.GetQueryMap), [`func (*Context) PostFormMap`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.PostFormMap) ve [`func (*Context) GetPostFormMap`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.GetPostFormMap) eklendi, bakınız [#1383](https://github.com/gin-gonic/gin/pull/1383)
- [YENİ] [`func (*Context) AsciiJSON`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.AsciiJSON) eklendi, bakınız [#1358](https://github.com/gin-gonic/gin/pull/1358)
- [YENİ] http2 push desteği için [`type ResponseWriter`](https://pkg.go.dev/github.com/gin-gonic/gin#ResponseWriter) içine `Pusher()` eklendi, bakınız [#1273](https://github.com/gin-gonic/gin/pull/1273)
- [YENİ] Dinamik veri sunma için [`func (*Context) DataFromReader`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.DataFromReader) eklendi, bakınız [#1304](https://github.com/gin-gonic/gin/pull/1304)
- [YENİ] Bağlamayı birden fazla kez çağırmaya izin veren [`func (*Context) ShouldBindBodyWith`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.ShouldBindBodyWith) eklendi, bakınız [#1341](https://github.com/gin-gonic/gin/pull/1341)
- [YENİ] Form bağlamada işaretçi desteği, bakınız [#1336](https://github.com/gin-gonic/gin/pull/1336)
- [YENİ] [`func (*Context) JSONP`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.JSONP) eklendi, bakınız [#1333](https://github.com/gin-gonic/gin/pull/1333)
- [YENİ] Form bağlamada varsayılan değer desteği, bakınız [#1138](https://github.com/gin-gonic/gin/pull/1138)
- [YENİ] [`type StructValidator`](https://pkg.go.dev/github.com/gin-gonic/gin/binding#StructValidator) içinde doğrulayıcı motorunu dışa aktarma, bakınız [#1277](https://github.com/gin-gonic/gin/pull/1277)
- [YENİ] [`func (*Context) ShouldBind`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.ShouldBind), [`func (*Context) ShouldBindQuery`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.ShouldBindQuery) ve [`func (*Context) ShouldBindJSON`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.ShouldBindJSON) eklendi, bakınız [#1047](https://github.com/gin-gonic/gin/pull/1047)
- [YENİ] Form bağlamada `time.Time` konumu desteği, bakınız [#1117](https://github.com/gin-gonic/gin/pull/1117)
- [YENİ] [`func (*Context) BindQuery`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.BindQuery) eklendi, bakınız [#1029](https://github.com/gin-gonic/gin/pull/1029)
- [YENİ] [jsonite](https://github.com/json-iterator/go) build tag'leri ile isteğe bağlı yapıldı, bakınız [#1026](https://github.com/gin-gonic/gin/pull/1026)
- [YENİ] Logger'da sorgu dizesi gösterme, bakınız [#999](https://github.com/gin-gonic/gin/pull/999)
- [YENİ] [`func (*Context) SecureJSON`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.SecureJSON) eklendi, bakınız [#987](https://github.com/gin-gonic/gin/pull/987) ve [#993](https://github.com/gin-gonic/gin/pull/993)
- [KALDIRILDI] `func (*Context) GetCookie` yerine [`func (*Context) Cookie`](https://pkg.go.dev/github.com/gin-gonic/gin#Context.Cookie)
- [DÜZELTİLDİ] [`func DisableConsoleColor`](https://pkg.go.dev/github.com/gin-gonic/gin#DisableConsoleColor) çağrıldığında renk etiketleri gösterilmiyor, bakınız [#1072](https://github.com/gin-gonic/gin/pull/1072)
- [DÜZELTİLDİ] [`func Mode`](https://pkg.go.dev/github.com/gin-gonic/gin#Mode) çağrılırken Gin Mode `""` artık `const DebugMode` döndürüyor, bakınız [#1250](https://github.com/gin-gonic/gin/pull/1250)
- [DÜZELTİLDİ] `Flush()` artık `responseWriter` durum kodunu geçersiz kılmıyor, bakınız [#1460](https://github.com/gin-gonic/gin/pull/1460)


