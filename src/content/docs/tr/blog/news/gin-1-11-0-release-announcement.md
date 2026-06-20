---
title: "Gin 1.11.0 Duyurusu: HTTP/3, Form İyileştirmeleri, Performans ve Daha Fazlası"
linkTitle: "Gin 1.11.0 Sürüm Duyurusu"
lastUpdated: 2025-09-21
---

## Gin v1.11.0 Yayınlandı

Gin v1.11.0 sürümünün yayınlandığını heyecanla duyuruyoruz. Bu sürüm, sevilen web framework'üne büyük bir yeni özellik seti, performans iyileştirmeleri ve hata düzeltmeleri getiriyor. Bu sürüm, Gin'in hız, esneklik ve modern Go geliştirmeye olan bağlılığını sürdürmektedir.

### 🌟 Temel Özellikler

- **Deneysel HTTP/3 Desteği:** Gin artık [quic-go](https://github.com/quic-go/quic-go) aracılığıyla deneysel HTTP/3'ü destekliyor! En son web taşıma protokollerini denemek istiyorsanız, şimdi tam zamanı. ([#3210](https://github.com/gin-gonic/gin/pull/3210))

- **Daha İyi Form Bağlama:** Form bağlamada büyük iyileştirmeler yaptık:
  - Formlarda dizi koleksiyon formatları desteği ([#3986](https://github.com/gin-gonic/gin/pull/3986))
  - Form etiketleri için özel string dilim unmarshalling ([#3970](https://github.com/gin-gonic/gin/pull/3970))
  - Koleksiyonlar için varsayılan değerler ([#4048](https://github.com/gin-gonic/gin/pull/4048))

- **Geliştirilmiş Bağlama Türleri:** Yeni `BindPlain` yöntemiyle düz metni kolayca bağlayın ([#3904](https://github.com/gin-gonic/gin/pull/3904)), ayrıca unixMilli ve unixMicro formatları desteği ([#4190](https://github.com/gin-gonic/gin/pull/4190)).

- **Context API İyileştirmeleri:** `GetXxx` artık daha fazla yerel Go türünü destekliyor ([#3633](https://github.com/gin-gonic/gin/pull/3633)), bu da tür güvenli context veri alımını kolaylaştırıyor.

- **Dosya Sistemi Güncellemeleri:** Yeni `OnlyFilesFS` artık dışa aktarılmış, test edilmiş ve belgelenmiştir ([#3939](https://github.com/gin-gonic/gin/pull/3939)).

### 🚀 Performans ve İyileştirmeler

- **Daha Hızlı Form Veri İşleme:** Form ayrıştırma için dahili optimizasyonlar performansı artırıyor ([#4339](https://github.com/gin-gonic/gin/pull/4339)).
- Sağlamlık ve netlik için çekirdek, işleme ve context mantığı yeniden düzenlendi ([tam PR listesi için değişiklik günlüğüne bakın](../releases/release111.md)).

### 🐛 Hata Düzeltmeleri

- **Ara Katman Güvenilirliği:** Ara katmanın beklenmedik şekilde yeniden girebileceği nadir bir hata düzeltildi ([#3987](https://github.com/gin-gonic/gin/pull/3987)).
- TOML form bağlama kararlılığı iyileştirildi ([#4193](https://github.com/gin-gonic/gin/pull/4193)).
- Boş ağaçlarda "method not allowed" istekleri işlenirken artık panic oluşmuyor ([#4003](https://github.com/gin-gonic/gin/pull/4003)).
- Context işleme, yarış koşulları ve daha fazlasında genel iyileştirmeler.

### 🔧 Derleme, Bağımlılık ve CI Güncellemeleri

- CI/CD iş akışlarında **Go 1.25** desteği, daha sıkı kod sağlığı için yeni linter'lar etkinleştirildi ([#4341](https://github.com/gin-gonic/gin/pull/4341), [#4010](https://github.com/gin-gonic/gin/pull/4010)).
- Trivy güvenlik açığı taraması artık CI ile entegre ([#4359](https://github.com/gin-gonic/gin/pull/4359)).
- `sonic`, `setup-go`, `quic-go` ve diğerleri dahil birçok bağımlılık yükseltmesi.

### 📖 Belgeler

- Genişletilmiş belgeler, güncellenmiş değişiklik günlükleri, iyileştirilmiş dilbilgisi ve kod örnekleri, yeni Portekizce belgeler ([#4078](https://github.com/gin-gonic/gin/pull/4078)).

---

Gin 1.11.0, aktif topluluğumuzun ve sürekli gelişimimizin bir kanıtıdır. Gin'i modern web uygulamaları için keskin ve güncel tutan her katkıda bulunan, sorun bildiren ve kullanıcıya teşekkür ederiz.

Gin 1.11.0'ı denemek için hazır mısınız? [GitHub'da yükseltin](https://github.com/gin-gonic/gin/releases/tag/v1.11.0) ve düşüncelerinizi bize bildirin!
