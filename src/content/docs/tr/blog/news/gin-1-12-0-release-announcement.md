---
title: "Gin 1.12.0 Duyurusu: BSON Desteği, Context İyileştirmeleri, Performans ve Daha Fazlası"
linkTitle: "Gin 1.12.0 Sürüm Duyurusu"
lastUpdated: 2026-02-28
---

## Gin v1.12.0 Yayınlandı

Gin v1.12.0 sürümünün yayınlandığını heyecanla duyuruyoruz. Bu sürüm yeni özellikler, anlamlı performans iyileştirmeleri ve sağlam bir dizi hata düzeltmesiyle doludur. Bu sürüm, Gin'in modern protokoller için desteğini derinleştiriyor, geliştirici deneyimini iyileştiriyor ve projenin hızlı ve yalın kalma geleneğini sürdürüyor.

### 🌟 Temel Özellikler

- **BSON Protokol Desteği:** İşleme katmanı artık BSON kodlamayı destekliyor, daha verimli ikili veri alışverişinin kapısını açıyor ([#4145](https://github.com/gin-gonic/gin/pull/4145)).

- **Yeni Context Yöntemleri:** İki yeni yardımcı, hata yönetimini daha temiz ve daha deyimsel hale getiriyor:
  - Context'ten tür güvenli hata alımı için `GetError` ve `GetErrorSlice` ([#4502](https://github.com/gin-gonic/gin/pull/4502))
  - Context'ten anahtarları kaldırmak için `Delete` yöntemi ([#38e7651](https://github.com/gin-gonic/gin/commit/38e7651))

- **Esnek Bağlama:** URI ve sorgu bağlama artık `encoding.UnmarshalText`'i kabul ediyor, özel tür deserileştirmesi üzerinde daha fazla kontrol sağlıyor ([#4203](https://github.com/gin-gonic/gin/pull/4203)).

- **Kaçış Karakterli Yol Seçeneği:** Yeni bir motor seçeneği, yönlendirme için kaçış karakterli (ham) istek yolunu kullanmayı tercih etmenizi sağlıyor ([#4420](https://github.com/gin-gonic/gin/pull/4420)).

- **İçerik Müzakeresinde Protocol Buffers:** `context` artık Protocol Buffers'ı müzakere edilebilir bir içerik türü olarak destekliyor, gRPC tarzı yanıtların entegrasyonunu kolaylaştırıyor ([#4423](https://github.com/gin-gonic/gin/pull/4423)).

- **Logger'da Renkli Gecikme:** Varsayılan logger artık gecikmeyi renkli olarak gösteriyor, yavaş istekleri bir bakışta tespit etmeyi kolaylaştırıyor ([#4146](https://github.com/gin-gonic/gin/pull/4146)).

### 🚀 Performans ve İyileştirmeler

- **Yönlendirici Ağaç Optimizasyonları:** Radix ağacına yapılan birden fazla iyileştirme, tahsisleri azaltıyor ve yol ayrıştırmayı hızlandırıyor:
  - `findCaseInsensitivePath`'te daha az tahsis ([#4417](https://github.com/gin-gonic/gin/pull/4417))
  - Verimlilik için `strings.Count` kullanarak yol ayrıştırma ([#4246](https://github.com/gin-gonic/gin/pull/4246))
  - `redirectTrailingSlash`'te regex yerine özel fonksiyonlar ([#4414](https://github.com/gin-gonic/gin/pull/4414))
- **Kurtarma Optimizasyonu:** Yığın izi okuma artık daha verimli ([#4466](https://github.com/gin-gonic/gin/pull/4466)).
- **Logger İyileştirmeleri:** Sorgu dizesi çıktısı artık yapılandırma ile atlanabiliyor ([#4547](https://github.com/gin-gonic/gin/pull/4547)).
- **Unix Soket Güveni:** İstekler Unix soketi üzerinden geldiğinde `X-Forwarded-For` başlıklarına artık her zaman güveniliyor ([#3359](https://github.com/gin-gonic/gin/pull/3359)).
- **Flush Güvenliği:** Alttaki `http.ResponseWriter` `http.Flusher` uygulamadığında `Flush()` artık panic oluşturmuyor ([#4479](https://github.com/gin-gonic/gin/pull/4479)).
- **Kod Kalitesi Yeniden Düzenlemeleri:** `maps.Copy` ve `maps.Clone` ile daha temiz map işleme, sihirli sayılar yerine adlandırılmış sabitler, modernize edilmiş range-over-int döngüleri ve daha fazlası ([#4352](https://github.com/gin-gonic/gin/pull/4352), [#4333](https://github.com/gin-gonic/gin/pull/4333), [#4529](https://github.com/gin-gonic/gin/pull/4529), [#4392](https://github.com/gin-gonic/gin/pull/4392)).

### 🐛 Hata Düzeltmeleri

- **Yönlendirici Panic Düzeltildi:** `RedirectFixedPath` etkinken `findCaseInsensitivePathRec`'deki panic çözüldü ([#4535](https://github.com/gin-gonic/gin/pull/4535)).
- **Data Render'da Content-Length:** `Data.Render` artık `Content-Length` başlığını doğru şekilde yazıyor ([#4206](https://github.com/gin-gonic/gin/pull/4206)).
- **Birden Fazla Başlıkla ClientIP:** `ClientIP` artık birden fazla `X-Forwarded-For` başlık değerine sahip istekleri doğru şekilde işliyor ([#4472](https://github.com/gin-gonic/gin/pull/4472)).
- **Bağlama Sınır Durumları:** Bağlamada boş değer hataları düzeltildi ([#2169](https://github.com/gin-gonic/gin/pull/2169)) ve form bağlamada boş dilim/dizi işleme iyileştirildi ([#4380](https://github.com/gin-gonic/gin/pull/4380)).
- **Literal İki Noktalı Rotalar:** Literal iki nokta içeren rotalar artık `engine.Handler()` ile doğru çalışıyor ([#4415](https://github.com/gin-gonic/gin/pull/4415)).
- **Dosya Tanımlayıcı Sızıntısı:** `RunFd` artık kaynak sızıntılarını önlemek için `os.File` tanıtıcısını düzgün şekilde kapatıyor ([#4422](https://github.com/gin-gonic/gin/pull/4422)).
- **Hijack Davranışı:** Yanıt yaşam döngüsünü doğru şekilde modellemek için hijack davranışı iyileştirildi ([#4373](https://github.com/gin-gonic/gin/pull/4373)).
- **Kurtarma:** `http.ErrAbortHandler` artık kurtarma ara katmanında istenildiği gibi bastırılıyor ([#4336](https://github.com/gin-gonic/gin/pull/4336)).
- **Hata Ayıklama Sürüm Uyumsuzluğu:** Hata ayıklama modunda bildirilen yanlış sürüm dizesi düzeltildi ([#4403](https://github.com/gin-gonic/gin/pull/4403)).

### 🔧 Derleme, Bağımlılık ve CI Güncellemeleri

- **Go 1.25 Minimum:** Desteklenen minimum Go sürümü artık **1.25**, CI iş akışları buna göre güncellendi ([#4550](https://github.com/gin-gonic/gin/pull/4550)).
- **BSON Bağımlılık Yükseltmesi:** BSON bağlama bağımlılığı `mongo-driver` v2'ye yükseltildi ([#4549](https://github.com/gin-gonic/gin/pull/4549)).

---

Gin 1.12.0, topluluğumuzun -- katkıda bulunanlar, inceleyenler ve kullanıcılar -- özverisinini yansıtmaktadır. Her sürümde Gin'i daha iyi yaptığınız için teşekkür ederiz.

Gin 1.12.0'ı denemek için hazır mısınız? [GitHub'da yükseltin](https://github.com/gin-gonic/gin/releases/tag/v1.12.0) ve düşüncelerinizi bize bildirin!
