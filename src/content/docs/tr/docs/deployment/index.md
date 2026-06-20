---
title: "Dağıtım"
sidebar:
  order: 10
---

Gin projeleri herhangi bir bulut sağlayıcısında kolayca dağıtılabilir.

## [Railway](https://www.railway.com)

Railway, uygulamaları ve servisleri dağıtmak, yönetmek ve ölçeklendirmek için modern bir bulut geliştirme platformudur. Sunuculardan gözlemlenebilirliğe kadar altyapı yığınınızı tek, ölçeklenebilir, kullanımı kolay bir platformla basitleştirir.

Gin projelerinizi dağıtmak için Railway [kılavuzunu](https://docs.railway.com/guides/gin) takip edin.

## [Seenode](https://seenode.com)

Seenode, uygulamaları hızlı ve verimli bir şekilde dağıtmak isteyen geliştiriciler için özel olarak tasarlanmış modern bir bulut platformudur. Git tabanlı dağıtım, otomatik SSL sertifikaları, yerleşik veritabanları ve Gin uygulamalarınızı dakikalar içinde canlıya alan akıcı bir arayüz sunar.

Gin projelerinizi dağıtmak için Seenode [kılavuzunu](https://seenode.com/docs/frameworks/go/gin) takip edin.

## [Koyeb](https://www.koyeb.com)

Koyeb, git tabanlı dağıtım, TLS şifreleme, yerel otomatik ölçeklendirme, küresel uç ağı ve yerleşik servis ağı ve keşfi ile uygulamaları küresel olarak dağıtmak için geliştirici dostu bir sunucusuz platformdur.

Gin projelerinizi dağıtmak için Koyeb [kılavuzunu](https://www.koyeb.com/tutorials/deploy-go-gin-on-koyeb) takip edin.

## [Qovery](https://www.qovery.com)

Qovery, veritabanları, SSL, küresel CDN ve Git ile otomatik dağıtımlar içeren ücretsiz Bulut barındırma sunar.

Daha fazla bilgi için [Qovery](https://hub.qovery.com/guides/getting-started/deploy-your-first-application/) sayfasına bakın.

## [Render](https://render.com)

Render, Go için yerel destek, tam yönetimli SSL, veritabanları, kesintisiz dağıtımlar, HTTP/2 ve websocket desteği sunan modern bir bulut platformudur.

Gin projelerini dağıtmak için Render [kılavuzunu](https://render.com/docs/deploy-go-gin) takip edin.

## [Google App Engine](https://cloud.google.com/appengine/)

GAE, Go uygulamalarını dağıtmak için iki yol sunar. Standart ortam kullanımı daha kolaydır ancak daha az özelleştirilebilirdir ve güvenlik nedeniyle [syscall](https://github.com/gin-gonic/gin/issues/1639) çağrılarını engeller. Esnek ortam herhangi bir framework veya kütüphaneyi çalıştırabilir.

Daha fazla bilgi edinin ve tercih ettiğiniz ortamı [Go on Google App Engine](https://cloud.google.com/appengine/docs/go/) sayfasından seçin.

## Kendi Sunucunuzda Barındırma

Gin projeleri kendi sunucunuzda da dağıtılabilir. Dağıtım mimarisi ve güvenlik değerlendirmeleri hedef ortama göre değişir. Aşağıdaki bölüm, yalnızca dağıtımı planlarken göz önünde bulundurulacak yapılandırma seçeneklerinin üst düzey bir genel görünümünü sunar.

## Yapılandırma Seçenekleri

Gin proje dağıtımları, ortam değişkenleri kullanılarak veya doğrudan kod içinde ayarlanabilir.

Gin'i yapılandırmak için aşağıdaki ortam değişkenleri kullanılabilir:

| Ortam Değişkeni | Açıklama                                                                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT                 | Gin sunucusunu `router.Run()` ile (argümansız) başlatırken dinlenecek TCP portu.                                                                                                      |
| GIN_MODE             | `debug`, `release` veya `test` değerlerinden birine ayarlanır. Hata ayıklama çıktılarının ne zaman üretileceği gibi Gin modlarının yönetimini sağlar. Ayrıca kod içinde `gin.SetMode(gin.ReleaseMode)` veya `gin.SetMode(gin.TestMode)` ile de ayarlanabilir. |

Gin'i yapılandırmak için aşağıdaki kod kullanılabilir.

```go
// Don't specify the bind address or port for Gin. Defaults to binding on all interfaces on port 8080.
// Can use the `PORT` environment variable to change the listen port when using `Run()` without any arguments.
router := gin.Default()
router.Run()

// Specify the bind address and port for Gin.
router := gin.Default()
router.Run("192.168.1.100:8080")

// Specify only the listen port. Will bind on all interfaces.
router := gin.Default()
router.Run(":8080")

// Set which IP addresses or CIDRs, are considered to be trusted for setting headers to document real client IP addresses.
// See the documentation for additional details.
router := gin.Default()
router.SetTrustedProxies([]string{"192.168.1.2"})
```

Güvenilir proxy'leri yapılandırma hakkında bilgi için [Güvenilir proxy'ler](/tr/docs/server-config/trusted-proxies/) sayfasına bakın.
