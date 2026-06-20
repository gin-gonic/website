---
title: "Gin 1.5.0 yayınlandı"
linkTitle: "Gin 1.5.0 yayınlandı"
lastUpdated: 2019-11-28
---

### DEĞİŞİKLİK GÜNLÜĞÜ

#### Özellikler

- [YENİ] Artık satır içi küçük harfle başlayan yapıyı ayrıştırabilirsiniz [#1893](https://github.com/gin-gonic/gin/pull/1893)
- [YENİ] **[Geriye Dönük Uyumsuz]** Eşleşen rota tam yolunu Context'te tutma [#1826](https://github.com/gin-gonic/gin/pull/1826)
- [YENİ] Context parametre sorgu önbelleği ekleme [#1450](https://github.com/gin-gonic/gin/pull/1450)
- [YENİ] Multipart çoklu dosya desteği ekleme [#1949](https://github.com/gin-gonic/gin/pull/1949)
- [YENİ] HTTP başlık parametresi bağlama desteği [#1957](https://github.com/gin-gonic/gin/pull/1957)
- [YENİ] Unix zaman bağlama desteği [#1980](https://github.com/gin-gonic/gin/pull/1980)
- [YENİ] DataFromReader'da negatif Content-Length desteği [#1981](https://github.com/gin-gonic/gin/pull/1981)
- [YENİ] gin.Context.BindJSON() içinde DisallowUnknownFields() ekleme [#2028](https://github.com/gin-gonic/gin/pull/2028)
- [YENİ] Engine.RunListener() ile belirli `net.Listener` kullanma [#2023](https://github.com/gin-gonic/gin/pull/2023)

#### Hata düzeltmeleri

- [DÜZELTİLDİ] Hata ayıklama mesajları için DefaultWriter ve DefaultErrorWriter kullanma [#1891](https://github.com/gin-gonic/gin/pull/1891)
- [DÜZELTİLDİ] Bazı kod iyileştirmeleri [#1909](https://github.com/gin-gonic/gin/pull/1909)
- [DÜZELTİLDİ] JSON encoder hızını artırmak için encode ile json marshal değiştirme [#1546](https://github.com/gin-gonic/gin/pull/1546)
- [DÜZELTİLDİ] Copy()'da context.Params yarış koşulunu düzeltme [#1841](https://github.com/gin-gonic/gin/pull/1841)
- [DÜZELTİLDİ] GetQueryMap performansını iyileştirme [#1918](https://github.com/gin-gonic/gin/pull/1918)
- [DÜZELTİLDİ] Post veri alımını iyileştirme [#1920](https://github.com/gin-gonic/gin/pull/1920)
- [DÜZELTİLDİ] x/net/context yerine context kullanma [#1922](https://github.com/gin-gonic/gin/pull/1922)
- [DÜZELTİLDİ] PostForm önbellek hatasını düzeltme girişimi [#1931](https://github.com/gin-gonic/gin/pull/1931)
- [DÜZELTİLDİ] **[Geriye Dönük Uyumsuz]** go1.8 ve go1.9 desteğini kaldırma [#1933](https://github.com/gin-gonic/gin/pull/1933)
- [DÜZELTİLDİ] FullPath özelliği için hata düzeltmesi [#1919](https://github.com/gin-gonic/gin/pull/1919)
- [DÜZELTİLDİ] Gin1.5 bytes.Buffer'dan strings.Builder'a [#1939](https://github.com/gin-gonic/gin/pull/1939)
- [DÜZELTİLDİ] github.com/ugorji/go/codec yükseltme [#1969](https://github.com/gin-gonic/gin/pull/1969)
- [DÜZELTİLDİ] Kod basitleştirme [#2004](https://github.com/gin-gonic/gin/pull/2004)
- [DÜZELTİLDİ] Otomatik renkli loglar için RISC-V mimarisinde terminal tanımlama [#2019](https://github.com/gin-gonic/gin/pull/2019)
- [DÜZELTİLDİ] **[Geriye Dönük Uyumsuz]** Context.JSONP() artık sonunda noktalı virgül (;) bekliyor [#2007](https://github.com/gin-gonic/gin/pull/2007)
- [DÜZELTİLDİ] **[Geriye Dönük Uyumsuz]** Validator sürümünü v9'a yükseltme [#1015](https://github.com/gin-gonic/gin/pull/1015)
- [DÜZELTİLDİ] Bazı yazım hatalarını düzeltme [#2079](https://github.com/gin-gonic/gin/pull/2079) [#2080](https://github.com/gin-gonic/gin/pull/2080)
- [DÜZELTİLDİ] Bağlama gövde testlerini taşıma [#2086](https://github.com/gin-gonic/gin/pull/2086)
- [DÜZELTİLDİ] Context.Status'ta Writer kullanma [#1606](https://github.com/gin-gonic/gin/pull/1606)
- [DÜZELTİLDİ] `Engine.RunUnix()` artık dosya modunu değiştiremezse hatayı döndürüyor [#2093](https://github.com/gin-gonic/gin/pull/2093)
- [DÜZELTİLDİ] `RouterGroup.StaticFS()` dosya sızdırıyordu. Artık kapatıyor. [#2118](https://github.com/gin-gonic/gin/pull/2118)
- [DÜZELTİLDİ] `Context.Request.FormFile` dosya sızdırıyordu, artık kapatıyor [#2114](https://github.com/gin-gonic/gin/pull/2114)
- [DÜZELTİLDİ] `form:"-"` eşlemesinde gezinmeyi yok sayma [#1943](https://github.com/gin-gonic/gin/pull/1943)
- [YENİDEN DÜZENLENDİ] **[Geriye Dönük Uyumsuz]** JSON encoder hızını artırmak için encode ile json marshal değiştirme [#1546 ](https://github.com/gin-gonic/gin/pull/1546)

