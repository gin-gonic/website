---
title: "Giriş"
sidebar:
  order: 1
---

Gin, Go (Golang) ile yazılmış bir web framework'üdür. [httprouter](https://github.com/julienschmidt/httprouter) sayesinde 40 kata kadar daha hızlı, çok daha iyi performansa sahip martini benzeri bir API sunar. Performans ve iyi verimlilik istiyorsanız, Gin'i seveceksiniz.

Bu bölümde Gin'in ne olduğunu, hangi sorunları çözdüğünü ve projenize nasıl yardımcı olabileceğini inceleyeceğiz.

Veya Gin'i projenizde kullanmaya hazırsanız, [Hızlı Başlangıç](https://gin-gonic.com/tr/docs/quickstart/) sayfasını ziyaret edin.

## Özellikler

### Hızlı

Radix ağacı tabanlı yönlendirme, küçük bellek ayak izi. Yansıma (reflection) yok. Öngörülebilir API performansı.

### Ara katman desteği

Gelen bir HTTP isteği, bir ara katman zinciri ve son eylem tarafından işlenebilir.
Örneğin: Logger, Yetkilendirme, GZIP ve son olarak veritabanına mesaj gönderme.

### Çökme koruması

Gin, bir HTTP isteği sırasında oluşan panic'i yakalayabilir ve kurtarabilir. Bu sayede sunucunuz her zaman erişilebilir olur. Örneğin - bu panic'i Sentry'ye raporlamak da mümkündür!

### JSON doğrulama

Gin, bir isteğin JSON'ını ayrıştırabilir ve doğrulayabilir - örneğin, zorunlu değerlerin varlığını kontrol edebilir.

### Rota gruplama

Rotalarınızı daha iyi düzenleyin. Yetkilendirme gerektiren ve gerektirmeyen, farklı API sürümleri... Ayrıca gruplar, performans kaybı olmadan sınırsız şekilde iç içe yerleştirilebilir.

### Hata yönetimi

Gin, bir HTTP isteği sırasında oluşan tüm hataları toplamak için kullanışlı bir yol sağlar. Sonunda, bir ara katman bunları bir log dosyasına, veritabanına yazabilir ve ağ üzerinden gönderebilir.

### Yerleşik işleme

Gin, JSON, XML ve HTML işleme için kullanımı kolay bir API sağlar.

### Genişletilebilir

Yeni bir ara katman oluşturmak çok kolay, örnek koda göz atmanız yeterli.

## Gin v1. Kararlı

- Sıfır tahsisli yönlendirici.
- Hâlâ en hızlı HTTP yönlendirici ve framework. Yönlendirmeden yazmaya kadar.
- Eksiksiz birim test paketi.
- Savaş testinden geçmiş.
- API dondurulmuş, yeni sürümler kodunuzu bozmayacak.
