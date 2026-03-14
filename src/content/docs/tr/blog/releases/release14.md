---
title: "Gin 1.4.0 yayınlandı"
linkTitle: "Gin 1.4.0 yayınlandı"
lastUpdated: 2019-05-08
---

### DEĞİŞİKLİK GÜNLÜĞÜ

#### Özellikler

- [YENİ] [Go Modülleri](https://github.com/golang/go/wiki/Modules) desteği  [#1569](https://github.com/gin-gonic/gin/pull/1569)
- [YENİ] Form mapping multipart isteği yeniden düzenleme [#1829](https://github.com/gin-gonic/gin/pull/1829)
- [YENİ] Dosya bağlama desteği [#1264](https://github.com/gin-gonic/gin/pull/1264)
- [YENİ] Dizi eşleme desteği [#1797](https://github.com/gin-gonic/gin/pull/1797)
- [YENİ] context.Keys LogFormatterParams olarak kullanılabilir hale getirildi [#1779](https://github.com/gin-gonic/gin/pull/1779)
- [YENİ] Marshal/Unmarshal için internal/json kullanımı [#1791](https://github.com/gin-gonic/gin/pull/1791)
- [YENİ] time.Duration eşleme desteği [#1794](https://github.com/gin-gonic/gin/pull/1794)
- [YENİ] Form eşlemeleri yeniden düzenleme [#1749](https://github.com/gin-gonic/gin/pull/1749)
- [YENİ] Akış ortasında istemci bağlantısının kesildiğini belirten context.Stream'e bayrak eklendi [#1252](https://github.com/gin-gonic/gin/pull/1252)
- [YENİ] context.Attachment yöntemiyle content-dispositon ekleri için context.File genişletildi [#1260](https://github.com/gin-gonic/gin/pull/1260)
- [YENİ] redirectTrailingSlash'ta X-Forwarded-Prefix'ten önek ekleme [#1238](https://github.com/gin-gonic/gin/pull/1238)
- [YENİ] context.HandlerNames() eklendi [#1729](https://github.com/gin-gonic/gin/pull/1729)
- [YENİ] LogFormatterParams'a yanıt boyutu eklendi [#1752](https://github.com/gin-gonic/gin/pull/1752)
- [YENİ] Form eşlemede alan yok sayma izni [#1733](https://github.com/gin-gonic/gin/pull/1733)
- [YENİ] Konsol çıktısında rengi zorlamak için fonksiyon eklendi [#1724](https://github.com/gin-gonic/gin/pull/1724)
- [YENİ] URL parametreleri için bağlama [#1694](https://github.com/gin-gonic/gin/pull/1694)
- [YENİ] LoggerWithFormatter yöntemi eklendi [#1677](https://github.com/gin-gonic/gin/pull/1677)
- [YENİ] Dosya tanımlayıcısı üzerinden http.Server çalıştırmak için RunFd yöntemi [#1609](https://github.com/gin-gonic/gin/pull/1609)
- [YENİ] YAML bağlama desteği [#1618](https://github.com/gin-gonic/gin/pull/1618)
- [YENİ] PureJSON işleyici eklendi [#694](https://github.com/gin-gonic/gin/pull/694)
- [YENİ] Form bağlamada varsayılan zaman formatı ayarlama [#1487](https://github.com/gin-gonic/gin/pull/1487)
- [YENİ] Bağımlılık kütüphaneleri yükseltme [#1491](https://github.com/gin-gonic/gin/pull/1491)

#### Hata düzeltmeleri

- [DÜZELTİLDİ] Uzun süren isteklerde gecikme hassasiyetini kırpma [#1830](https://github.com/gin-gonic/gin/pull/1830)
- [DÜZELTİLDİ] IsTerm bayrağı DisableConsoleColor yönteminden etkilenmemeli [#1802](https://github.com/gin-gonic/gin/pull/1802)
- [DÜZELTİLDİ] Readme güncellemeleri [#1793](https://github.com/gin-gonic/gin/pull/1793) [#1788](https://github.com/gin-gonic/gin/pull/1788) [1789](https://github.com/gin-gonic/gin/pull/1789)
- [DÜZELTİLDİ] StaticFS: 404'te iki log satırı yazdırılması düzeltildi [#1805](https://github.com/gin-gonic/gin/pull/1805), [#1804](https://github.com/gin-gonic/gin/pull/1804)
- [DÜZELTİLDİ] [Örnekler](https://github.com/gin-gonic/examples) bağımsız depoya taşındı [#1775](https://github.com/gin-gonic/gin/pull/1775)
- [DÜZELTİLDİ] HTTP içerik müzakeresi joker karakterleri desteği [#1112](https://github.com/gin-gonic/gin/pull/1112)
- [DÜZELTİLDİ] FormFile çağrıldığında MaxMultipartMemory iletme [#1600](https://github.com/gin-gonic/gin/pull/1600)
- [DÜZELTİLDİ] LoadHTML* testleri [#1559](https://github.com/gin-gonic/gin/pull/1559)
- [DÜZELTİLDİ] HandleContext'ten sync.pool kullanımı kaldırıldı [#1565](https://github.com/gin-gonic/gin/pull/1565)
- [DÜZELTİLDİ] Çıktı logunu os.Stderr'e biçimlendirme [#1571](https://github.com/gin-gonic/gin/pull/1571)
- [DÜZELTİLDİ] Okunabilirlik için logger'da sarı arka plan ve koyu gri metin kullanımı [#1570](https://github.com/gin-gonic/gin/pull/1570)
- [DÜZELTİLDİ] Panic loglarından hassas istek bilgilerini kaldırma [#1370](https://github.com/gin-gonic/gin/pull/1370)
- [DÜZELTİLDİ] log.Println() zaman damgası yazdırmıyor [#829](https://github.com/gin-gonic/gin/pull/829) [#1560](https://github.com/gin-gonic/gin/pull/1560)
- [DÜZELTİLDİ] Eksik telif hakkı ekleme ve if/else güncelleme [#1497](https://github.com/gin-gonic/gin/pull/1497)
- [DÜZELTİLDİ] msgpack kullanımı güncelleme [#1498](https://github.com/gin-gonic/gin/pull/1498)
- [DÜZELTİLDİ] Render'da protobuf kullanımı [#1496](https://github.com/gin-gonic/gin/pull/1496)
- [DÜZELTİLDİ] Protobuf format yanıt desteği ekleme [#1479](https://github.com/gin-gonic/gin/pull/1479)
- [DÜZELTİLDİ] BindXML ve ShouldBindXML ekleme [#1485](https://github.com/gin-gonic/gin/pull/1485)
- [DÜZELTİLDİ] CI test güncellemeleri [#1671](https://github.com/gin-gonic/gin/pull/1671) [#1670](https://github.com/gin-gonic/gin/pull/1670) [#1682](https://github.com/gin-gonic/gin/pull/1682) [#1669](https://github.com/gin-gonic/gin/pull/1669)
- [DÜZELTİLDİ] StaticFS(): Yol mevcut olmadığında 404 gönderme [#1663](https://github.com/gin-gonic/gin/pull/1663)
- [DÜZELTİLDİ] JSON bağlama için nil gövde işleme [#1638](https://github.com/gin-gonic/gin/pull/1638)
- [DÜZELTİLDİ] URI parametre bağlama desteği [#1612](https://github.com/gin-gonic/gin/pull/1612)
- [DÜZELTİLDİ] recovery: Google App Engine'de syscall import sorunu düzeltmesi [#1640](https://github.com/gin-gonic/gin/pull/1640)
- [DÜZELTİLDİ] Hata ayıklama loglarının satır sonları içermesini sağlama [#1650](https://github.com/gin-gonic/gin/pull/1650)
- [DÜZELTİLDİ] Bozuk boru kurtarması sırasında panic yığın izinin yazdırılması [#1089](https://github.com/gin-gonic/gin/pull/1089) [#1259](https://github.com/gin-gonic/gin/pull/1259)
- [DÜZELTİLDİ] Context.Next() - her iterasyonda handler uzunluğunu yeniden kontrol etme [#1745](https://github.com/gin-gonic/gin/pull/1745)
- [DÜZELTİLDİ] Tüm errcheck uyarılarını düzeltme [#1739](https://github.com/gin-gonic/gin/pull/1739) [#1653](https://github.com/gin-gonic/gin/pull/1653)
- [DÜZELTİLDİ] defaultLogger'da renk yöntemlerini public yapma [#1771](https://github.com/gin-gonic/gin/pull/1771)
- [DÜZELTİLDİ] writeHeaders yöntemini http.Header.Set kullanacak şekilde güncelleme [#1722](https://github.com/gin-gonic/gin/pull/1722)
- [DÜZELTİLDİ] context.Copy() yarış koşulu [#1020](https://github.com/gin-gonic/gin/pull/1020)

