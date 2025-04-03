---
title: "Giriş"
sidebar:
  order: 1
---

Gin, Go (Golang) ile yazılmış bir web çerçevesidir. Martini benzeri bir API'ye sahiptir ama [httprouter](https://github.com/julienschmidt/httprouter) sayesinde 40 kata kadar daha hızlı, çok daha iyi performansa sahiptir. Performansa ve iyi üretkenliğe ihtiyacınız varsa, Gin'i seveceksiniz.

Bu bölümde Gin'in ne olduğunu, hangi sorunları çözdüğünü ve projenize nasıl yardımcı olabileceğini inceleyeceğiz.

Veya projenizde Gin'i kullanmaya hazırsanız [Hızlı Başlangıç](https://gin-gonic.com/tr/docs/quickstart/)'ı ziyaret edin.

## Özellikler

### Hızlı

Radix ağacı tabanlı routing, küçük bellek ayak izi. Reflection yok. Öngörülebilir API performansı.

### Middleware desteği

Gelen bir HTTP isteği, bir middleware zinciri ve son eylem tarafından işlenebilir. Örneğin: Logger, Authorization, GZIP ve son olarak veritabanına bir mesaj gönderin.

### Çökmeye Dirençli

Gin, bir HTTP isteği sırasında oluşan bir paniği yakalayabilir ve düzeltebilir. Bu şekilde sunucunuz her zaman çalışacaktır. Ayrıca bir paniği Sentry'ye bildirmek de mümkündür.

### JSON doğrulama 

Gin, bir isteğin JSON'ını ayrıştırabilir ve doğrulayabilir. Örneğin gerekli değerlerin varlığını kontrol edebilir.

### Route gruplama

Routelarınızı daha iyi düzenleyin. Authorization gerektiren veya gerektirmeyen, farklı API sürümlerini kolayca düzenleyin. Ayrıca, gruplar performansı düşürmeden sınırsız olarak iç içe yerleştirilebilir.

### Hata yönetimi

Gin, bir HTTP isteği sırasında meydana gelen tüm hataları toplamak için uygun bir yol sağlar. Sonunda, middleware bunları bir log dosyasına veya bir veritabanına yazabilir ve ağ üzerinden gönderebilir.


### Hazır rendering

Gin, JSON, XML ve HTML işleme için kullanımı kolay bir API sağlar.

### Genişletilebilir

Yeni middleware oluşturmak çok kolaydır, sadece örnek kodları inceleyin.

