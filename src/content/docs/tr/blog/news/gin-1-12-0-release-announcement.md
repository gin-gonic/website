---
title: "Gin 1.12.0 Duyurusu: BSON Desteği, Context İyileştirmeleri, Performans ve Daha Fazlası"
linkTitle: "Gin 1.12.0 Sürüm Duyurusu"
lastUpdated: 2026-02-28
---

## Gin v1.12.0 Yayınlandı

Yeni özellikler, önemli performans iyileştirmeleri ve bir dizi hata düzeltmesiyle dolu Gin v1.12.0'ın yayınını duyurmaktan mutluluk duyuyoruz. Bu sürüm, Gin'in modern protokoller için desteğini derinleştirir, geliştirici deneyimini iyileştirir ve projenin hızlı ve hafif kalma geleneğini devam ettirir.

### 🌟 Ana Özellikler

- **BSON Protokol Desteği:** İşleme katmanı artık BSON kodlamasını destekliyor; daha verimli ikili veri alışverişinin kapısını açıyor (#4145).

- **Yeni Context Yöntemleri:** İki yeni yardımcı, hata işlemeyi daha temiz ve deyimsel hale getirir:
  - Bağlamdan tür güvenli hata alınması için `GetError` ve `GetErrorSlice` (#4502)
  - Bağlamdan anahtarları kaldırmak için `Delete` yöntemi (#38e7651)

- **Esnek Bağlama:** URI ve sorgu bağlama artık `encoding.UnmarshalText` öğesine uyuyor; özel tür seri durumdan çıkarma üzerinde daha fazla kontrol sağlıyor (#4203).

- **Kaçan Yol Seçeneği:** Yeni bir motor seçeneği, yönlendirme için kaçan (ham) istek yolunu kullanmayı seçmenizi sağlar (#4420).

- **İçerik Müzakeresinde Protocol Buffers:** `context` artık Protocol Buffers'ı müzakere edilebilir bir içerik türü olarak destekliyor ve gRPC tarzı yanıtlar tümleştirmeyi kolaylaştırıyor (#4423).

- **Logger'da Renklendirilmiş Gecikme:** Varsayılan günlükçü artık gecikmeyi renkle işliyor; yavaş istekleri bir bakışta tespit etmeyi kolaylaştırıyor (#4146).

### 🚀 Performans ve İyileştirmeler

- **Yönlendirici Ağacı Optimizasyonları:** Radix ağacında yapılan birden fazla iyileştirme, ayırmaları azaltır ve yol ayrıştırmasını hızlandırır:
  - `findCaseInsensitivePath` içinde daha az ayırma (#4417)
  - Verimlilik için `strings.Count` kullanarak yol ayrıştırması (#4246)
  - `redirectTrailingSlash` içinde normal ifadeler özel işlevlerle değiştirildi (#4414)
- **Kurtarma Optimizasyonu:** Yığın izi okuma artık daha verimli (#4466).
- **Logger İyileştirmeleri:** Sorgu dizesi çıkışı artık yapılandırma yoluyla atlanabilir (#4547).
- **Unix Soket Güveni:** Unix soketi üzerinden istekler geldiğinde `X-Forwarded-For` başlıkları artık her zaman güvenilir (#3359).
- **Temizleme Güvenliği:** Temel `http.ResponseWriter` `http.Flusher` uygulamadığında `Flush()` artık panik oluşturmuyor (#4479).
- **Kod Kalitesi Yeniden Düzenlemesi:** `maps.Copy` ve `maps.Clone` ile daha temiz harita işleme, sihirli sayıları değiştiren adlandırılmış sabitler, modernize edilmiş range-over-int döngüleri ve daha fazlası (#4352, #4333, #4529, #4392).

### 🐛 Hata Düzeltmeleri

- **Yönlendirici Paniği Düzeltildi:** `RedirectFixedPath` etkinleştirildiğinde `findCaseInsensitivePathRec` içinde meydana gelen panik çözüldü (#4535).
- **Veri İşlemesinde Content-Length:** `Data.Render` artık `Content-Length` başlığını doğru yazıyor (#4206).
- **Birden Fazla Başlıklı ClientIP:** `ClientIP` artık birden fazla `X-Forwarded-For` başlığı değeri olan istekleri doğru şekilde işliyor (#4472).
- **Bağlama Kenar Durumları:** Bağlamada boş değer hatası düzeltildi (#2169) ve form bağlamasında boş dilim/dizi işlemesi iyileştirildi (#4380).
- **Literal Iki Nokta Rotaları:** Literal iki nokta içeren rotalar artık `engine.Handler()` ile doğru şekilde çalışıyor (#4415).
- **Dosya Tanımlayıcısı Sızıntısı:** `RunFd` artık kaynak sızıntısını önlemek için `os.File` işlemcisini doğru şekilde kapatıyor (#4422).
- **Hijack Davranışı:** Hijack davranışı, yanıt yaşam döngüsünü doğru şekilde modellemek için iyileştirildi (#4373).
- **Kurtarma:** `http.ErrAbortHandler` artık amaçlandığı gibi kurtarma ara yazılımında bastırılıyor (#4336).
- **Hata Ayıklama Sürüm Uyuşmazlığı:** Hata ayıklama modunda bildirilen yanlış sürüm dizesi düzeltildi (#4403).

### 🔧 Derleme, Bağımlılık ve CI Güncellemeleri

- **Go 1.25 Minimum:** Minimum desteklenen Go sürümü artık **1.25** olup, CI iş akışları buna göre güncellenmiştir (#4550).
- **BSON Bağımlılığı Yükseltmesi:** BSON bağlama bağımlılığı `mongo-driver` v2 öğesine yükseltilmiştir (#4549).

---

Gin 1.12.0, topluluğumuzun — katkıda bulunanlar, gözden geçirenler ve kullanıcılar — adanmışlığını yansıtır. Her sürümde Gin'i daha iyi hale getirdiğiniz için teşekkür ederiz.

Gin 1.12.0'ı denemeye hazır mısınız? GitHub'ta yükseltme yapın ve bize ne düşündüğünüzü söyleyin!
