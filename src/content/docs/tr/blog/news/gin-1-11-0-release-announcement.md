---
title: "Gin 1.11.0 Yayında! HTTP/3, Form Geliştirmeleri, Performans ve Daha Fazlası"
linkTitle: "Gin 1.11.0 Sürüm Duyurusu"
lastUpdated: 2025-09-21
---

## Gin v1.11.0 Yayınlandı

Popüler web framework’ümüz Gin’in 1.11.0 sürümünün büyük bir dizi yeni özellik, performans iyileştirmeleri ve hata düzeltmeleri ile yayında olduğunu duyurmaktan heyecan duyuyoruz. Bu sürümle birlikte Gin’in hız ve esneklik konusundaki kararlılığı devam ediyor.

### 🌟 Öne Çıkan Özellikler

- **Deneysel HTTP/3 Desteği:** Gin artık [quic-go](https://github.com/quic-go/quic-go) ile deneysel HTTP/3 desteği sunuyor! En yeni web protokollerini denemek istiyorsanız işte fırsatınız. ([#3210](https://github.com/gin-gonic/gin/pull/3210))

- **Form Binding İyileştirmeleri:** Form binding tarafında büyük yenilikler:
  - Formlarda dizi (array) koleksiyon formatlarına destek ([#3986](https://github.com/gin-gonic/gin/pull/3986))
  - Form etiketinde string slice unmarshalling desteği ([#3970](https://github.com/gin-gonic/gin/pull/3970))
  - Koleksiyonlar için varsayılan değer desteği ([#4048](https://github.com/gin-gonic/gin/pull/4048))

- **Binding Tiplerinde Gelişmeler:** Yeni `BindPlain` metodu ile düz metin bağlama kolaylığı ([#3904](https://github.com/gin-gonic/gin/pull/3904)), unixMilli ve unixMicro formatı desteği ([#4190](https://github.com/gin-gonic/gin/pull/4190)).

- **Context API İyileştirmeleri:** `GetXxx` artık daha fazla Go yerel tipini destekliyor ([#3633](https://github.com/gin-gonic/gin/pull/3633)), böylece context verilerini tip güvenli biçimde almak artık daha kolay.

- **Dosya Sistemi Güncellemeleri:** Yeni `OnlyFilesFS` artık export edildi, testi yapıldı ve dokümantasyonu tamamlandı ([#3939](https://github.com/gin-gonic/gin/pull/3939)).

### 🚀 Performans ve Diğer Geliştirmeler

- **Daha Hızlı Form Verisi İşleme:** Form verisi ayrıştırmasında içsel optimizasyonlar performansı artırıyor ([#4339](https://github.com/gin-gonic/gin/pull/4339)).
- Çekirdek, render ve context mantığında daha fazla sağlamlık ve netlik için yeniden düzenlemeler ([tam PR listesi için changelog](../releases/release111.md)).

### 🐛 Hata Düzeltmeleri

- **Middleware Güvenilirliği:** Nadiren oluşan middleware tekrar giriş hatası giderildi ([#3987](https://github.com/gin-gonic/gin/pull/3987)).
- TOML form binding stabilitesi artırıldı ([#4193](https://github.com/gin-gonic/gin/pull/4193)).
- Boş ağaçlar üzerinde “method not allowed” isteği işlerken oluşan panic hatası artık yok ([#4003](https://github.com/gin-gonic/gin/pull/4003)).
- Context yönetimi, veri yarışları ve daha fazlası için genel iyileştirmeler.

### 🔧 Derleme, Bağımlılıklar ve CI Güncellemeleri

- **Go 1.25** desteği ve yeni linter’lar CI/CD süreçlerinde devreye alındı ([#4341](https://github.com/gin-gonic/gin/pull/4341), [#4010](https://github.com/gin-gonic/gin/pull/4010)).
- Trivy güvenlik taraması CI ile entegre edildi ([#4359](https://github.com/gin-gonic/gin/pull/4359)).
- `sonic`, `setup-go`, `quic-go` ve diğerlerinde çoklu bağımlılık güncellemeleri.

### 📖 Dokümantasyon

- Genişletilmiş dokümantasyon, güncellenmiş changeloglar, örnek ve dil bilgisi iyileştirmeleri, ayrıca yeni Portekizce dokümanlar ([#4078](https://github.com/gin-gonic/gin/pull/4078)).

---

Gin 1.11.0, aktif topluluğumuzun ve sürekli geliştirmelerimizin bir göstergesidir. Katkı veren herkese, hata raporlayanlara ve Gin’i modern web uygulamaları için ilgili tutan tüm kullanıcılara teşekkürler!

Gin 1.11.0’ı kullanmaya hazır mısınız? [GitHub’dan hemen güncelleyin](https://github.com/gin-gonic/gin/releases/tag/v1.11.0) ve yorumlarınızı bizimle paylaşın!
